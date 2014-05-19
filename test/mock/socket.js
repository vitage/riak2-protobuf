'use strict'

var stream = require('stream');
var inherits = require('util').inherits;

/**
 * Initialize `MockSocket` with the given `options`.
 *
 * @param {Object} [options]
 * @api public
 */

var MockSocket = exports = module.exports = function MockSocket (options) {
  stream.Transform.call(this, { objectMode: true });
  this.returns = options.returns;
  this.asserts = options.asserts;
}

/**
 * `MockSocket` inherits from `stream.Transform`.
 */

inherits(MockSocket, stream.Transform);

/**
 * Mock a socket.
 *
 * @param {Buffer} chunk
 * @param {null} encoding
 * @param {Function} done
 * @api private
 */

MockSocket.prototype._transform = function (chunk, encoding, done) {
  var asserts = this.asserts.shift();
  if (asserts) asserts(chunk);
  var returns = this.returns.shift();
  if (returns) this.push(returns);
  else throw new Error('Unexpected call');
  done();
};

/**
 * Mock destroy.
 *
 * @api public
 */

MockSocket.prototype.destroy = function () {
};

/**
 * Mock disable the Nagle algorithm.
 *
 * @api public
 */

MockSocket.prototype.setNoDelay = function () {
};

/**
 * Mock set keep alive.
 *
 * @api public
 */

MockSocket.prototype.setKeepAlive = function () {
};
