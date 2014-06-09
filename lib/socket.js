'use strict';

var net = require('net');
var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;

var Serializer = require('./serializer');
var Parser = require('./parser');
var Framer = require('./framer');

/**
 * Initialize `Socket` with the given `options`.
 *
 * @param {Object} [options]
 * @api public
 */

var Socket = exports = module.exports = function Socket(options) {
  var self = this;
  var socket;

  EventEmitter.call(this);

  if (!options) options = {};

  this.readStream = options.readStream || options.socket;
  this.writeStream = options.writeStream || options.socket;

  if (this.readStream && this.writeStream) {
    // no-op
  } else if (!this.readStream && !this.writeStream) {
    if (options.socket) {
      socket = options.socket;
    } else {
      socket = net.connect(options.port || 8087, options.host);
      socket.setNoDelay(true);
      socket.setKeepAlive(true, options.keepAlive || 60000);
    }
    this.readStream = this.writeStream = socket;
  } else {
    throw new Error('Both `readStream` and `writeStream` should be' +
      ' provided or neither provided');
  }

  this.serializer = options.serializer || new Serializer();
  this.framer = options.framer || new Framer();
  this.parser = options.parser || new Parser();

  // forward readable events

  ['readable', 'data', 'end', 'close'].forEach(function (event) {
    self.parser.on(event, function () {
      var args = [].slice.call(arguments);
      args.unshift(event);
      return self.emit.apply(self, args);
    });
  });

  // forward writable events

  ['drain', 'finish'].forEach(function (event) {
    self.writeStream.on(event, function () {
      var args = [].slice.call(arguments);
      args.unshift(event);
      return self.emit.apply(self, args);
    });
  });

  ['pipe', 'unpipe'].forEach(function (event) {
    self.serializer.on(event, function () {
      var args = [].slice.call(arguments);
      args.unshift(event);
      return self.emit.apply(self, args);
    });
  });

  // passthrough errors

  function onerror (err) {
    var args = [].slice.call(arguments);
    args.unshift('error');
    return self.emit.apply(self, args);
  }

  this.serializer.on('error', onerror);
  this.writeStream.on('error', onerror);
  if (this.writeStream !== this.readStream) {
    this.readStream.on('error', onerror);
  }
  this.parser.on('error', onerror);
  this.framer.on('error', onerror);

  // pipe

  this.serializer.pipe(this.writeStream);
  this.readStream.pipe(this.framer).pipe(this.parser);
};

/**
 * `Socket` inherits from `EventEmitter`.
 */

inherits(Socket, EventEmitter);

/**
 * Read from parser.
 *
 * @param {Number} [size]
 * @api public
 */

Socket.prototype.read = function(size) {
  return this.parser.read(size);
};

/**
 * Set encoding. This method does nothing.
 *
 * @param {String} encoding
 * @api public
 */

Socket.prototype.setEncoding = function() {
  return this;
};

/**
 * Resume stream.
 *
 * @param {String} encoding
 * @api public
 */

Socket.prototype.resume = function() {
  this.parser.resume()
  return this;
};

/**
 * Pause stream.
 *
 * @param {String} encoding
 * @api public
 */

Socket.prototype.pause = function() {
  this.parser.pause();
  return this;
};

/**
 * Pipe to destination.
 *
 * @param {Stream} destination
 * @param {Object} options
 * @api public
 */

Socket.prototype.pipe = function(destination, options) {
  this.parser.pipe(destination, options);
  return this;
};

/**
 * Unpipe to destination.
 *
 * @param {Stream} destination
 * @api public
 */

Socket.prototype.pipe = function(destination) {
  this.parser.unpipe(destination);
  return this;
};

/**
 * Unshift chunk of data onto read queue.
 *
 * @param {Buffer | String} chunk
 * @api public
 */

Socket.prototype.unshift = function(chunk) {
  this.parser.unshift(chunk);
  return this;
};

/**
 * Write message.
 *
 * @param {Object} message
 * @param {String} [encoding]
 * @param {Function} [callback]
 * @api public
 */

Socket.prototype.write = function(message, encoding, callback) {
  this.serializer.write(message, encoding, callback);
  return this;
};

/**
 * Signal that no more data will be written.
 *
 * @param {Object} [message]
 * @param {String} [encoding]
 * @param {Function} [callback]
 * @api public
 */

Socket.prototype.end = function(message, encoding, callback) {
  this.serializer.end(message, encoding, callback);
  return this;
};

/**
 * Ensure that no more data will be written.
 *
 * @api public
 */

Socket.prototype.destroy = function() {
  if (!this.destroyed) {
    this.serializer.removeAllListeners();
    this.writeStream.removeAllListeners();
    if (this.writeStream.destroy) {
      this.writeStream.destroy();
    }
    if (this.readStream !== this.writeStream) {
      this.readStream.removeAllListeners();
    }
    this.framer.removeAllListeners();
    this.parser.removeAllListeners();
    this.destroyed = true;
  }
  return this;
};
