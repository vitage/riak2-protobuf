'use strict';

var net = require('net');

/**
 * Expose classes.
 */

exports = module.exports = createSocket;
exports.Socket = require('./socket');
exports.Parser = require('./parser');
exports.Serializer = require('./serializer');
exports.Framer = require('./framer');
exports.schema = require('./schema');

/**
 * Create a duplex socket that speaks Riak.
 *
 * @param {Object} options
 * @api public
 */

function createSocket (options) {
  return new exports.Socket(options);
}
