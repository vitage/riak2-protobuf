'use strict';

var net = require('net');
var stream = require('stream');
var inherits = require('util').inherits;

var codes = require('./pb/messages').codes;
var methods = require('./pb/messages').methods;
var schema = require('./schema');

/**
 * Stringify values on `target`.
 *
 * @param {Object} target
 * @param {String} key...
 * @api private
 */

function stringify (target, keys) {
  if (!Array.isArray(keys)) keys = [].slice.call(arguments, 1);
  keys.forEach(function (key) {
    if (target[key]) target[key] = target[key].toString('utf8');
  });
  return target;
}

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
  this.push(this.visit(message));
  done();
};

/**
 * Properties on the root object to always stringify.
 *
 * @api public
 */

Decoder.prototype.utf8props = [
  'bucket',
  'client_id',
  'content_type',
  'errmsg',
  'key',
  'node',
  'request',
  'response',
  'server_version',
  'type'
];

/**
 * Visit message.
 *
 * @param {Object} message
 * @api public
 */

Decoder.prototype.visit = function (message) {
  var code = message.code;
  var data = message.data;
  var method = methods[code];

  if (data) {
    var descriptor = schema[method];
    if (descriptor) data = descriptor.decode(data);
    stringify(data, this.utf8props);
  }

  var visitor = method && this['visit' + method];
  if (visitor) {
    var response = visitor.call(this, data, message, descriptor) ||
      { result: data };
    response.type = method;
    return response;
  } else if (descriptor) {
    return { type: method, result: data };
  } else if (method) {
    return { type: method };
  } else {
    return { error: new Error('unknown message code `' + message.code + "'") };
  }
};

/**
 * Visit content.
 *
 * @param {Object} content
 * @api public
 */

Decoder.prototype.visitContent = function (content) {
  if (!content) return;
  if (Array.isArray(content) && content.length) {
    return content.forEach(this.visitContent.bind(this));
  }
  stringify(content, 'content_type', 'charset', 'content_encoding');
  if (content.links && content.links.length) {
    content.links.forEach(this.visitLink);
  }
  if (content.usermeta && content.usermeta.length) {
    content.usermeta.forEach(this.visitPair);
  }
  if (content.indexes && content.indexes.length) {
    content.indexes.forEach(this.visitPair, true);
  }
  var contentType = (content.content_type || '').toLowerCase();
  if (/^text\//.test(contentType) ||
    /^application\/.*\b(xml|html|json)\b.*/.test(contentType))
  {
    content.value = content.value.toString(content.charset || 'utf8');
    if (contentType == 'application/json') {
      try {
        content.value = JSON.parse(content.value);
      } catch (err) {
        content.parseError = err;
      }
    }
  } else {
    content.value = content.value.toBuffer();
  }
};

/**
 * Visit link.
 *
 * @param {Object} link
 * @api public
 */

Decoder.prototype.visitLink = function (link) {
  stringify(link, 'bucket', 'key', 'tag');
};

/**
 * Visit pair.
 *
 * @param {Object} pair
 * @param {Boolean} [tryInt]
 * @api public
 */

Decoder.prototype.visitPair = function (pair, tryInt) {
  if (!pair) return;
  stringify(pair, 'key', 'value');
  if (tryInt && pair.key.substr(-4, 4) == '_int') {
    pair.value = parseInt(pair.value, 10);
  }
};

/**
 * Visit props.
 *
 * @param {Object} props
 * @api public
 */

Decoder.prototype.visitProps = function (props) {
  if (!props) return;
  for (var key in schema.RpbBucketProps.RpbReplMode) {
    if (schema.RpbBucketProps.RpbReplMode[key] == props.repl) {
      props.repl = key.toLowerCase();
      break
    }
  }
  stringify(props, 'backend', 'search_index');
}

/**
 * Visit `Error` response message.
 *
 * @param {Object} data
 * @api public
 */

Decoder.prototype.visitRpbErrorResp = function (data) {
  var err = new Error(data.errmsg);
  err.code = data.errcode;
  return { error: err };
};

/**
 * Visit content messages.
 *
 * @param {Object} data
 * @api public
 */

Decoder.prototype.visitRpbGetResp =
Decoder.prototype.visitRpbPutReq =
Decoder.prototype.visitRpbPutResp = function (data) {
  this.visitContent(data.content);
};

/**
 * Visit `ListBuckets` response message.
 *
 * @param {Object} data
 * @api public
 */

Decoder.prototype.visitRpbListBucketsResp = function (data) {
  if (data.buckets && data.buckets.length) {
    data.buckets = data.buckets.map(function (it) {
      return it.toString('utf8');
    });
  }
};

/**
 * Visit `ListKeys` response message.
 *
 * @param {Object} data
 * @api public
 */

Decoder.prototype.visitRpbListKeysResp = function (data) {
  if (data.keys && data.keys.length) {
    data.keys = data.keys.map(function (it) {
      return it.toString('utf8');
    });
  }
};

/**
 * Visit `GetBucket` response or `SetBucket` request message.
 *
 * @param {Object} data
 * @api public
 */

Decoder.prototype.visitRpbGetBucketResp =
Decoder.prototype.visitRpbSetBucketReq = function (data) {
  this.visitProps(data.props);
};

/**
 * Visit `MapRed` request message.
 *
 * @param {Object} data
 * @api public
 */

Decoder.prototype.visitRpbMapRedReq = function (data) {
  var result = { result: data };
  if (data.content_type == 'application/json') {
    try {
      data.request = JSON.parse(data.request);
    } catch (err) {
      result.parseError = err;
    }
  }
  return result;
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
