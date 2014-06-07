'use strict';

var net = require('net');
var duplex = require('duplexer');

/**
 * Expose classes.
 */

exports = module.exports = createSocket;
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
  if (!options) options = {};

  var writeStream = options.writeStream || options.socket;
  var readStream = options.readStream || options.socket;
  var socket;

  if (writeStream && readStream) {
  } else if (!writeStream && !readStream) {
    socket = net.connect(options.port || 8087, options.host);
    socket.setNoDelay(true);
    socket.setKeepAlive(true, options.keepAlive || 60000);
    writeStream = readStream = socket;
  } else {
    throw new Error('Both `writeStream` and `readStream` should be' +
      ' provided or neither provided');
  }

  var serializer = options.serializer || new exports.Serializer();
  var framer = options.framer || new exports.Framer();
  var parser = options.parser || new exports.Parser();

  serializer.pipe(writeStream);
  readStream.pipe(framer).pipe(parser);

  socket = duplex(serializer, parser);
  socket.serializer = serializer;
  socket.framer = framer;
  socket.parser = parser;

  return socket;
}
