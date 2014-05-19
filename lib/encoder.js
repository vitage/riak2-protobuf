'use strict';

var net = require('net');
var stream = require('stream');
var inherits = require('util').inherits;

var codes = require('./pb/messages').codes;
var schema = require('./schema');

var extend = require('lodash').extend;

/**
 * Initialize `Encoder` with the given `options`.
 *
 * @param {Object} [options]
 * @api public
 */

var Encoder = exports = module.exports = function Encoder(options) {
  stream.Transform.call(this, { objectMode: true });
}

/**
 * `Encoder` inherits from `stream.Transform`.
 */

inherits(Encoder, stream.Transform);

/**
 * Transform JavaScript messages to Riak messages.
 *
 * @param {Object} message
 * @param {null} encoding
 * @param {Function} done
 * @api private
 */

Encoder.prototype._transform = function(message, encoding, done) {
  this.push(this.visit(message));
  done();
};

/**
 * Visit message.
 *
 * @param {Object} message
 * @api public
 */

Encoder.prototype.visit = function (message) {
  var method = message.type;
  var data = message.data;
  var code = codes[method]
  var descriptor = schema[method];

  var visitor = method && this['visit' + method];
  if (visitor) {
    message = visitor.call(this, data, message, descriptor);
    if (message) {
      if (message.type != null) method = message.type;
      if (message.data != null) data = message.data;
      if (message.code != null) code = message.code;
      if (message.descriptor != null) descriptor = message.descriptor;
    }
  }

  if (data && descriptor) {
    data = new descriptor(data).toBuffer();
    var buf = new Buffer(5);
    buf.writeUInt32BE(data.length + 1, 0);
    buf[4] = code;
    return Buffer.concat([buf, data], data.length + 5);
  } else if (code) {
    return new Buffer([0, 0, 0, 1, code]);
  } else {
    throw new Error('unknown method `' + method + "'");
  }
};

/**
 * Visit content.
 *
 * @param {Object} content
 * @api public
 */

Encoder.prototype.visitContent = function (content) {
  if (!content) return;
  if (Array.isArray(content) && content.length) {
    return content.map(this.visitContent);
  }
  var result = extend({}, content);
  if (result.content_type == null) {
    result.content_type = 'application/json';
  }
  if (result.content_type == 'application/json' &&
    typeof result.value != 'string')
  {
    result.value = JSON.stringify(result.value);
  }
  return result;
}

/**
 * Visit props.
 *
 * @param {Object} props
 * @api public
 */

Encoder.prototype.visitProps = function (props) {
  if (!props) return;
  if (typeof props.repl == 'string') {
    props.repl = props.repl.toUpperCase();
  }
  return props;
}

/**
 * Visit `Error` response message.
 *
 * @param {Object} data
 * @param {Object} message
 * @api public
 */

Encoder.prototype.visitRpbErrorResp = function (data, message) {
  if (data) return;
  var err = message.error || {};
  return {
    data: {
      errmsg: err.message || 'Error',
      errcode: err.code || 0
    }
  };
};

/**
 * Visit content messages.
 *
 * @param {Object} data
 * @api public
 */

Encoder.prototype.visitRpbGetResp =
Encoder.prototype.visitRpbPutReq =
Encoder.prototype.visitRpbPutResp = function (data) {
  return {
    data: extend({}, data, { content: this.visitContent(data.content) })
  };
};

/**
 * Visit `GetBucket` request or response messages.
 *
 * @param {Object} data
 * @api public
 */

Encoder.prototype.visitRpbSetBucketReq =
Encoder.prototype.visitRpbGetBucketResp = function (data) {
  return {
    data: extend({}, data, { props: this.visitProps(data.props) })
  };
};

/**
 * Visit `MapRedReq` request messages.
 *
 * @param {Object} data
 * @api public
 */

Encoder.prototype.visitRpbMapRedReq = function (data) {
  if (data.content_type == 'application/json' &&
    typeof data.request != 'string')
  {
    data = extend({}, data);
    data.request = JSON.stringify(data.request, function (key, value) {
      return typeof value == 'function' ? value.toString() : value;
    });
    return { data: data };
  }
};

// 25,RpbIndexReq,riak_kv
// 26,RpbIndexResp,riak_kv
// 27,RpbSearchQueryReq,riak_search
// 28,RpbSearchQueryResp,riak_search
// 29,RpbResetBucketReq,riak
// 30,RpbResetBucketResp,riak
// 31,RpbGetBucketTypeReq,riak
// 32,RpbSetBucketTypeReq,riak
// 40,RpbCSBucketReq,riak_kv
// 41,RpbCSBucketResp,riak_kv
// 50,RpbCounterUpdateReq,riak_kv
// 51,RpbCounterUpdateResp,riak_kv
// 52,RpbCounterGetReq,riak_kv
// 53,RpbCounterGetResp,riak_kv
// 54,RpbYokozunaIndexGetReq,riak_yokozuna
// 55,RpbYokozunaIndexGetResp,riak_yokozuna
// 56,RpbYokozunaIndexPutReq,riak_yokozuna
// 57,RpbYokozunaIndexDeleteReq,riak_yokozuna
// 58,RpbYokozunaSchemaGetReq,riak_yokozuna
// 59,RpbYokozunaSchemaGetResp,riak_yokozuna
// 60,RpbYokozunaSchemaPutReq,riak_yokozuna
// 80,DtFetchReq,riak_dt
// 81,DtFetchResp,riak_dt
// 82,DtUpdateReq,riak_dt
// 83,DtUpdateResp,riak_dt
// 253,RpbAuthReq,riak
// 254,RpbAuthResp,riak
// 255,RpbStartTls,riak
