'use strict';

var net = require('net');
var stream = require('stream');
var inherits = require('util').inherits;

var Encoder = require('./encoder');
var Decoder = require('./decoder');
var Chunker = require('./chunker');

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

  this.encoder = options.encoder || new Encoder();
  this.chunker = options.chunker || new Chunker();
  this.decoder = options.decoder || new Decoder();

  this._passthrough('error');

  this.socket.on('drain', this.emit.bind(this, 'drain'));
  this.socket.on('close', this.emit.bind(this, 'close'));
  this.decoder.on('data', this.push.bind(this));
  this.decoder.on('end', this.emit.bind(this, 'end'));

  this.encoder
    .pipe(this.socket)
    .pipe(this.chunker)
    .pipe(this.decoder);
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

  this.encoder.on(event, handler);
  this.decoder.on(event, handler);
  this.chunker.on(event, handler);
  this.socket.on(event, handler);
};

/**
 * Dispatch messages.
 *
 * @param {Object} message
 * @param {null} encoding
 * @param {Function} done
 * @api private
 */

Socket.prototype._write = function(message, encoding, done) {
  this.encoder.write(message);
};

/**
 * Process responses.
 *
 * @param {Number} size
 * @api private
 */

Socket.prototype._read = function(size) {
  var data = this.decoder.read();
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
  this.once('finish', this.encoder.end.bind(this.encoder));
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
    this.encoder.removeAllListeners();
    this.socket.removeAllListeners();
    this.socket.destroy();
    this.chunker.removeAllListeners();
    this.decoder.removeAllListeners();
    this.destroyed = true;
  }
  return this;
};
