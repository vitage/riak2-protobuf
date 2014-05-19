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
  var method = message.type;
  var code = codes[method]
  var descriptor = schema[method];

  if (descriptor) {
    var data = message.data;

    switch (code) {
      case codes.RpbErrorResp:
        var err = message.error;
        if (err) {
          data = {
            errmsg: err.message,
            errcode: err.code || 0
          };
        }
        break;

      case codes.RpbGetResp:
      case codes.RpbPutReq:
      case codes.RpbPutResp:
      case codes.RpbDelReq:
        extend({}, data, { content: stringifyContent(data.content) });
        break;

      case codes.RpbSetBucketReq:
      case codes.RpbGetBucketResp:
        extend({}, data, { props: stringifyProps(data.props) });
        break;

      case codes.RpbMapRedReq:
        if (data.content_type == 'application/json' &&
          typeof data.request == 'object')
        {
          data = extend({}, data);
          data.request = JSON.stringify(data.request, jsonStringifier);
        }
        break;

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
    }

    data = new descriptor(data).toBuffer();
    var buf = new Buffer(5);
    buf.writeUInt32BE(data.length + 1, 0);
    buf[4] = code;
    buf = Buffer.concat([buf, data], data.length + 5);

    this.push(buf);
  } else if (code) {
    this.push(new Buffer([0, 0, 0, 1, code]));
  } else {
    throw new Error('unknown method `' + method + "'");
  }

  done();
};

/**
 * Stringify functions.
 *
 * @param {String} key
 * @param {Mixed} value
 * @api private
 */

function jsonStringifier (key, value) {
  return typeof value == 'function' ? value.toString() : value;
}

/**
 * Stringify values on a `Content` object.
 *
 * @param {Object} content
 * @api private
 */

function stringifyContent (content) {
  if (!content) return;
  if (Array.isArray(content) && content.length) {
    return content.map(stringifyContent);
  }
  var result = extend({}, content);
  if (result.content_type == null) {
    result.content_type = 'application/json';
  }
  if (result.content_type == 'application/json' &&
    typeof result.value == 'object')
  {
    result.value = JSON.stringify(result.value);
  }
  return result;
}

/**
 * Stringify values on a `Props` object.
 *
 * @param {Object} props
 * @api private
 */

function stringifyProps (props) {
  if (!props) return;
  if (typeof props.repl == 'string') {
    props.repl = props.repl.toUpperCase();
  }
}
