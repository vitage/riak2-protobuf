'use strict';

var net = require('net');
var stream = require('stream');
var inherits = require('util').inherits;

var Serializer = require('./serializer');
var Parser = require('./parser');
var FrameAligner = require('./frame-aligner');

/**
 * Initialize `Socket` with the given `options`.
 *
 * @param {Object} [options]
 * @api public
 */

var Socket = exports = module.exports = function Socket(options) {
  stream.Duplex.call(this, { objectMode: true });
  if (!options) options = {};
  this.init(options);
}

/**
 * `Socket` inherits from `stream.Duplex`.
 */

inherits(Socket, stream.Duplex);

/**
 * Initialize this socket.
 *
 * @param {Object} options
 * @api private
 */

Socket.prototype.init = function(options) {
  if (options.socket) {
    this.socket = options.socket;
  } else {
    this.socket = net.connect(options.port || 8087, options.host);
    this.socket.setNoDelay(true);
    this.socket.setKeepAlive(true, options.keepAlive || 60000);
  }

  this.serializer = options.serializer || new Serializer();
  this.aligner = options.aligner || new FrameAligner();
  this.parser = options.parser || new Parser();

  this._passthrough('error');

  this.socket.on('drain', this.emit.bind(this, 'drain'));
  this.socket.on('close', this.emit.bind(this, 'close'));
  this.parser.on('data', this.push.bind(this));
  this.parser.on('end', this.emit.bind(this, 'end'));

  this.serializer
    .pipe(this.socket)
    .pipe(this.aligner)
    .pipe(this.parser);
};

/**
 * Pass through events.
 *
 * @param {Object} options
 * @api private
 */

Socket.prototype._passthrough = function(event) {
  var handler = function (err) {
    this.emit(event, err);
  }.bind(this);

  this.serializer.on(event, handler);
  this.parser.on(event, handler);
  this.aligner.on(event, handler);
  this.socket.on(event, handler);
};

/**
 * Dispatch messages.
 *
 * @param {Object} data
 * @param {String} type
 * @param {Function} done
 * @api private
 */

Socket.prototype._write = function(data, type, done) {
  this.serializer.write(data, type);
  done();
};

/**
 * Process responses.
 *
 * @param {Number} size
 * @api private
 */

Socket.prototype._read = function(size) {
  var data = this.parser.read();
  if (data && data.length) this.push(data);
};

/**
 * Signal that no more data will be written.
 *
 * @param {String | Buffer} [chunk] Optional data to write
 * @param {String} [encoding] The encoding, if chunk is a String
 * @param {Function} [callback] Optional callback for when the stream is finished
 * @api public
 */

Socket.prototype.end = function() {
  this.once('finish', this.serializer.end.bind(this.serializer));
  stream.Duplex.prototype.end.call(this);
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
    this.socket.removeAllListeners();
    this.socket.destroy();
    this.aligner.removeAllListeners();
    this.parser.removeAllListeners();
    this.destroyed = true;
  }
  return this;
};
