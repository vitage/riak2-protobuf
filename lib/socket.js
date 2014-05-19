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

  this.socket = options.socket || net.connect(options.port || 8087, options.host);
  this.socket.setNoDelay(true);
  this.socket.setKeepAlive(true, options.keepAlive || 60000);

  this.encoder = options.encoder || new Encoder();
  this.decoder = options.decoder || new Decoder();
  this.chunker = options.chunker || new Chunker();

  this.encoder
    .pipe(this.socket)
    .pipe(this.chunker)
    .pipe(this.decoder);

  this.decoder.on('data', function (data) {
    this.push(data);
  }.bind(this));
}

/**
 * `Socket` inherits from `stream.Duplex`.
 */

inherits(Socket, stream.Duplex);

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
  stream.Duplex.prototype.end.apply(this, arguments);
  this.encoder.end();
  this.decoder.end();
  this.chunker.end();
  this.socket.end();
};

/**
 * Ensure that no more data will be written.
 *
 * @api public
 */

Socket.prototype.destroy = function() {
  this.end();
  this.encoder.removeAllListeners();
  this.decoder.removeAllListeners();
  this.chunker.removeAllListeners();
  this.socket.destroy();
  this.destroyed = true;
};
