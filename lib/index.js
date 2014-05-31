'use strict';

/**
 * Expose classes.
 */

exports = module.exports = require('./socket');
exports.Socket = exports;
exports.Parser = require('./parser');
exports.Serializer = require('./serializer');
exports.FrameAligner = require('./frame-aligner');
exports.schema = require('./schema');
