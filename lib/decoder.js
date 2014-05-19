'use strict';

var net = require('net');
var stream = require('stream');
var inherits = require('util').inherits;

var codes = require('./pb/messages').codes;
var methods = require('./pb/messages').methods;
var schema = require('./schema');

/**
 * Initialize `Decoder` with the given `options`.
 *
 * @param {Object} [options]
 * @api public
 */

var Decoder = exports = module.exports = function Decoder(options) {
  stream.Transform.call(this, { objectMode: true });
}

/**
 * `Decoder` inherits from `stream.Transform`.
 */

inherits(Decoder, stream.Transform);

/**
 * Transform raw Riak messages to JavaScript objects.
 *
 * @param {Object} message
 * @param {null} encoding
 * @param {Function} done
 * @api private
 */

Decoder.prototype._transform = function(message, encoding, done) {
  var code = message.code;
  var method = methods[code];
  var descriptor = schema[method];

  if (descriptor) {
    var data = descriptor.decode(message.data);
    var stringify = stringifyKeys.bind(data);

    switch (code) {
      case codes.RpbErrorResp:
        stringify('errmsg');
        var err = new Error(data.errmsg);
        err.code = data.errcode;
        this.push({ type: method, error: err });
        return done();

      case codes.RpbGetClientIdResp:
      case codes.RpbSetClientIdReq:
        stringify('client_id');
        break;

      case codes.RpbGetServerInfoResp:
        stringify('node', 'server_version');
        break;

      case codes.RpbPutReq:
      case codes.RpbDelReq:
        stringifyContent(data.content);
      case codes.RpbGetReq:
        stringify('bucket', 'key', 'type');
        break;
      case codes.RpbPutResp:
        stringify('key');
      case codes.RpbGetResp:
        stringifyContent(data.content);
        break;

      case codes.RpbListBucketsReq:
        stringify('type');
        break;
      case codes.RpbListBucketsResp:
        if (data.buckets && data.buckets.length) {
          data.buckets = data.buckets.map(function (it) {
            return it.toString('utf8');
          });
        }
        break;
      case codes.RpbListKeysReq:
        stringify('bucket', 'type');
        break;
      case codes.RpbListKeysResp:
        if (data.keys && data.keys.length) {
          data.keys = data.keys.map(function (it) {
            return it.toString('utf8');
          });
        }
        break;

      case codes.RpbGetBucketReq:
        stringify('bucket', 'type');
        break;
      case codes.RpbSetBucketReq:
        stringify('bucket', 'type')
      case codes.RpbGetBucketResp:
        stringifyProps(data.props);
        break;

      case codes.RpbMapRedReq:
        stringify('request', 'content_type');
        if (data.content_type == 'application/json') {
          try {
            data.request = JSON.parse(data.request);
          } catch (err) {
            data.error = err;
          }
        }
        break;
      case codes.RpbMapRedResp:
        stringify('response');
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

    this.push({ type: method, result: data });
  } else if (method) {
    this.push({ type: method });
  } else {
    this.push({ error: new Error('unknown message code `' + message.code + "'") });
  }

  done();
};

/**
 * Stringify values on `this` object.
 *
 * @param {String} key...
 * @api private
 */

function stringifyKeys () {
  var data = this;
  [].forEach.call(arguments, function (key) {
    if (data[key]) data[key] = data[key].toString('utf8');
  });
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
    return content.forEach(stringifyContent);
  }
  stringifyKeys.call(content, 'content_type', 'charset', 'content_encoding');
  if (content.links && content.links.length) {
    content.links.forEach(stringifyLink);
  }
  if (content.usermeta && content.usermeta.length) {
    content.usermeta.forEach(stringifyPair);
  }
  if (content.indexes && content.indexes.length) {
    content.indexes.forEach(stringifyPair, true);
  }
  if (content.content_type == 'application/json') {
    try {
      content.value = JSON.parse(content.value.toString(content.charset || 'utf8'));
    } catch (err) {
      content.error = err;
    }
  }
}

/**
 * Stringify values on a `Link` object.
 *
 * @param {Object} link
 * @api private
 */

function stringifyLink (link) {
  if (!link) return;
  stringifyKeys.call(link, 'bucket', 'key', 'tag');
}

/**
 * Stringify values on a `Pair` object.
 *
 * @param {Object} pair
 * @param {Boolean} tryInt
 * @api private
 */

function stringifyPair (pair, tryInt) {
  if (!pair) return;
  stringifyKeys.call(pair, 'key', 'value');
  if (tryInt && pair.key.substr(-4, 4) == '_int') {
    pair.value = parseInt(pair.value, 10);
  }
}

/**
 * Stringify values on a `Props` object.
 *
 * @param {Object} props
 * @api private
 */

function stringifyProps (props) {
  if (!props) return;
  for (var key in schema.RpbBucketProps.RpbReplMode) {
    if (schema.RpbBucketProps.RpbReplMode[key] == props.repl) {
      props.repl = key.toLowerCase();
      break
    }
  }
  stringifyKeys.call(props, 'backend', 'search_index');
}
