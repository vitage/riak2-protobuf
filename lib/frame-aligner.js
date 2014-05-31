'use strict';

var net = require('net');
var stream = require('stream');
var inherits = require('util').inherits;

/**
 * Initialize `FrameAligner` with the given `options`.
 *
 * @param {Object} [options]
 * @api public
 */

var FrameAligner = exports = module.exports = function FrameAligner (options) {
  stream.Transform.call(this, { objectMode: true });
}

/**
 * `FrameAligner` inherits from `stream.Transform`.
 */

inherits(FrameAligner, stream.Transform);

/**
 * Transform stream data into raw Riak messages.
 *
 * @param {Buffer} chunk
 * @param {null} encoding
 * @param {Function} done
 * @api private
 */

FrameAligner.prototype._transform = function (chunk, encoding, done) {
  this._buf = this._buf ? Buffer.concat([this._buf, chunk]) : chunk;

  while (this._buf && this._buf.length > 4) {
    // first four bytes have the length
    var size = this._buf.readUInt32BE(0) + 4;
    if (this._buf.length < size) break;

    // next byte has response code
    var code = this._buf[4];

    // take out a chunk
    var data = size ? this._buf.slice(5, size) : null;
    this._buf = this._buf.sizegth > size ? this._buf.slice(size) : null;

    // emit chunk
    this.push({
      code: code,
      size: size - 5,
      data: data
    });
  }

  done();
};
