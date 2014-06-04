'use strict';

var net = require('net');
var stream = require('stream');
var inherits = require('util').inherits;

var Int64 = require('node-int64');

var codes = require('./pb/messages').codes;
var types = require('./pb/messages').types;
var schema = require('./schema');

/**
 * Convert `it` to a UTF-8 string.
 *
 * @param {Object} it
 * @api private
 */

function toUTF8 (it) {
  return it.toString('utf8');
}

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
    if (target[key] != null && typeof target[key] == 'object') {
      target[key] = target[key].toString('utf8');
    }
  });
  return target;
}

/**
 * Initialize `Parser` with the given `options`.
 *
 * @param {Object} [options]
 * @api public
 */

var Parser = exports = module.exports = function Parser(options) {
  stream.Transform.call(this, { objectMode: true });
}

/**
 * `Parser` inherits from `stream.Transform`.
 */

inherits(Parser, stream.Transform);

/**
 * Transform raw Riak messages to JavaScript objects.
 *
 * @param {Object} message
 * @param {String} encoding
 * @param {Function} done
 * @api private
 */

Parser.prototype._transform = function(message, encoding, done) {
  var data = message.data;
  var code = message.code;
  var type = types[code];
  var message = this.visit(data, type, code);
  message.__proto__ = { _code: code, _type: type };
  this.push(message);
  done();
};

/**
 * Properties on the root object to always stringify.
 *
 * @api public
 */

Parser.prototype.utf8props = [
  'bucket',
  'client_id',
  'content_type',
  'errmsg',
  'index',
  'key',
  'node',
  'range_min',
  'range_max',
  'request',
  'response',
  'server_version',
  'type'
];

/**
 * Visit message.
 *
 * @param {Object} data
 * @api public
 */

Parser.prototype.visit = function (data, type, code) {
  if (data) {
    var descriptor = schema[type];
    if (descriptor) data = descriptor.decode(data);
    stringify(data, this.utf8props);
  }

  var visitor = type && this['visit' + type];
  if (visitor) {
    return visitor.call(this, data, descriptor) || data;
  } else if (descriptor) {
    return data;
  } else if (type) {
    return {};
  } else {
    return new Error('unknown message code `' + code + "'");
  }
};

/**
 * Visit content.
 *
 * @param {Object} content
 * @api public
 */

Parser.prototype.visitContent = function (content) {
  if (!content) return;
  if (Array.isArray(content)) {
    if (!content.length) return;
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

Parser.prototype.visitLink = function (link) {
  stringify(link, 'bucket', 'key', 'tag');
};

/**
 * Visit pair.
 *
 * @param {Object} pair
 * @param {Boolean} [tryInt]
 * @api public
 */

Parser.prototype.visitPair = function (pair, tryInt) {
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

Parser.prototype.visitProps = function (props) {
  if (!props) return;
  var repl = props.repl;
  var mapping = schema.RpbBucketProps.RpbReplMode;
  for (var key in mapping) {
    if (mapping[key] == repl) {
      props.repl = key.toLowerCase();
      break;
    }
  }
  stringify(props, 'backend', 'search_index');
}

/**
 * Visit content messages.
 *
 * @param {Object} data
 * @api public
 */

Parser.prototype.visitRpbGetResp =
Parser.prototype.visitRpbPutReq =
Parser.prototype.visitRpbPutResp = function (data) {
  this.visitContent(data.content);
};

/**
 * Visit `ListBuckets` response message.
 *
 * @param {Object} data
 * @api public
 */

Parser.prototype.visitRpbListBucketsResp = function (data) {
  if (data.buckets && data.buckets.length) {
    data.buckets = data.buckets.map(toUTF8);
  }
};

/**
 * Visit `ListKeys` response message.
 *
 * @param {Object} data
 * @api public
 */

Parser.prototype.visitRpbListKeysResp = function (data) {
  var keys = data.keys;
  if (keys && keys.length) data.keys = keys.map(toUTF8);
};

/**
 * Visit `GetBucket` response or `SetBucket` request message.
 *
 * @param {Object} data
 * @api public
 */

Parser.prototype.visitRpbGetBucketResp =
Parser.prototype.visitRpbSetBucketReq = function (data) {
  this.visitProps(data.props);
};

/**
 * Visit `MapRed` request message.
 *
 * @param {Object} data
 * @api public
 */

Parser.prototype.visitRpbMapRedReq = function (data) {
  if (data.content_type == 'application/json') {
    try {
      data.request = JSON.parse(data.request);
    } catch (err) {
      result.parseError = err;
    }
  }
};

/**
 * Visit `Index` request messages.
 *
 * @param {Object} data
 * @api public
 */

Parser.prototype.visitRpbIndexReq = function (data) {
  // qtype
  var qtype = data.qtype;
  var mapping = schema.RpbIndexReq.IndexQueryType;
  for (var key in mapping) {
    if (mapping[key] == qtype) {
      data.qtype = key.toLowerCase();
      break;
    }
  }
  // continuation
  var cont = data.continuation;
  if (cont) data.continuation = cont.toBuffer();
  // regex
  var regex = data.term_regex;
  if (regex) {
    data.term_regex = regex = regex.toString('utf8');
    try {
      data.term_regex = new RegExp(regex);
    } catch (err) {
      data.regexError = err;
    }
  }
};

/**
 * Visit `Index` response messages.
 *
 * @param {Object} data
 * @api public
 */

Parser.prototype.visitRpbIndexResp = function (data) {
  var keys = data.keys;
  if (keys && keys.length) data.keys = keys.map(toUTF8);
  var rest = data.results;
  if (rest && rest.length) rest.map(this.visitPair);
  var cont = data.continuation;
  if (cont) data.continuation = cont.toBuffer();
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

/**
 * Visit signed 64-bit integer.
 *
 * @param {Object} num
 * @api public
 */

Parser.prototype.visitInt64 = function (num) {
  var i64 = new Int64(num.high, num.low);
  var num = i64.valueOf();
  return isFinite(num) ? num : i64;
};

/**
 * Visit `MapEntry`.
 *
 * @param {Object} entry
 * @api public
 */

Parser.prototype.visitMapEntry = function (entry) {
  var val = entry.counter_value;
  if (val) entry.counter_value = this.visitInt64(val);
  val = entry.set_value;
  if (val && val.length) entry.set_value = val.map(toUTF8);
  val = entry.register_value;
  if (val) entry.register_value = toUTF8(val);

  val = entry.map_value;
  if (val && val.length) {
    entry.map_value.map(this.visitMapEntry.bind(this));
  }

  this.visitMapField(entry.field);

  return entry;
};

/**
 * Visit `MapField`.
 *
 * @param {Object} field
 * @api public
 */

Parser.prototype.visitMapField = function (field) {
  var mapping = schema.MapField.MapFieldType;
  var type = field.type;
  var key;

  for (key in mapping) {
    if (mapping[key] == type) {
      field.type = key.toLowerCase();
      break;
    }
  }

  field.name = toUTF8(field.name);
};

/**
 * Visit `DtValue`.
 *
 * @param {Object} value
 * @api public
 */

Parser.prototype.visitDtValue = function (value) {
  var val = value.counter_value;
  if (val != null) value.counter_value = this.visitInt64(val);
  val = value.set_value;
  if (val && val.length) value.set_value = val.map(toUTF8);
  val = value.map_value;
  if (val && val.length) {
    value.map_value = val.map(this.visitMapEntry.bind(this));
  }
};

/**
 * Visit `Fetch` response messages.
 *
 * @param {Object} data
 * @api public
 */

Parser.prototype.visitDtFetchResp = function (data) {
  var context = data.context;
  if (context) data.context = context.toBuffer();

  var mapping = schema.DtFetchResp.DataType;
  var type = data.type;
  var key;

  for (key in mapping) {
    if (mapping[key] == type) {
      data.type = key.toLowerCase();
      break;
    }
  }

  this.visitDtValue(data.value);
};

// 82,DtUpdateReq,riak_dt
// 83,DtUpdateResp,riak_dt
// 253,RpbAuthReq,riak
// 254,RpbAuthResp,riak
// 255,RpbStartTls,riak
