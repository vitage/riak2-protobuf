'use strict';

var net = require('net');
var stream = require('stream');
var inherits = require('util').inherits;

var codes = require('./pb/messages').codes;
var schema = require('./schema');

var extend = require('lodash').extend;

/**
 * Initialize `Serializer` with the given `options`.
 *
 * @param {Object} [options]
 * @api public
 */

var Serializer = exports = module.exports = function Serializer(options) {
  stream.Transform.call(this, { objectMode: true });

  // bind methods for chained visitors
  this.visitMapEntry = this.visitMapEntry.bind(this);
  this.visitMapUpdate = this.visitMapUpdate.bind(this);
}

/**
 * `Serializer` inherits from `stream.Transform`.
 */

inherits(Serializer, stream.Transform);

/**
 * Transform JavaScript data to Riak messages.
 *
 * @param {Object} data
 * @param {String} type
 * @param {Function} done
 * @api private
 */

Serializer.prototype._transform = function(data, type, done) {
  if (typeof data == 'string') type = data, data = null;
  this.push(this.visit(data, type));
  done();
};

/**
 * Visit message.
 *
 * @param {Object} data
 * @api public
 */

Serializer.prototype.visit = function (data, type) {
  var code = codes[type]
  var descriptor = schema[type];

  var visitor = type && this['visit' + type];
  if (visitor) data = visitor.call(this, data) || data;

  if (Buffer.isBuffer(data)) {
    // no-op
  } else if (descriptor) {
    data = new descriptor(data || {}).toBuffer();
  } else if (code) {
    return new Buffer([0, 0, 0, 1, code]);
  } else {
    throw new Error('unknown message type `' + type + "'");
  }

  // make buffer
  var buf = new Buffer(5);
  buf.writeUInt32BE(data.length + 1, 0);
  buf[4] = code;
  return Buffer.concat([buf, data], data.length + 5);
};

/**
 * Visit content.
 *
 * @param {Object} content
 * @api public
 */

Serializer.prototype.visitContent = function (content) {
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

Serializer.prototype.visitProps = function (props) {
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

Serializer.prototype.visitRpbErrorResp = function (data) {
  if (data.errmsg) return;
  return {
    errmsg: data.message || 'Error',
    errcode: data.code || 0
  };
};

/**
 * Visit content messages.
 *
 * @param {Object} data
 * @api public
 */

Serializer.prototype.visitRpbGetResp =
Serializer.prototype.visitRpbPutReq =
Serializer.prototype.visitRpbPutResp = function (data) {
  return extend({}, data, { content: this.visitContent(data.content) });
};

/**
 * Visit `GetBucket` request or response messages.
 *
 * @param {Object} data
 * @api public
 */

Serializer.prototype.visitRpbSetBucketReq =
Serializer.prototype.visitRpbGetBucketResp = function (data) {
  return extend({}, data, { props: this.visitProps(data.props) });
};

/**
 * Visit `MapRedReq` request messages.
 *
 * @param {Object} data
 * @api public
 */

Serializer.prototype.visitRpbMapRedReq = function (data) {
  if (data.content_type == 'application/json' &&
    data.request && typeof data.request != 'string')
  {
    return extend({}, data, {
      request: JSON.stringify(data.request, function (key, value) {
        return typeof value == 'function' ? value.toString() : value;
      })
    });
  }
};

/**
 * Visit `Index` request messages.
 *
 * @param {Object} data
 * @api public
 */

Serializer.prototype.visitRpbIndexReq = function (data) {
  var regex = data.term_regex;
  if (regex instanceof RegExp) {
    return extend({}, data, { term_regex: regex.source });
  }
};

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
 * Visit `MapField`.
 *
 * @param {Object} field
 * @api public
 */

Serializer.prototype.visitMapField = function (field) {
  var type = field.type;
  if (typeof type == 'string') field.type = type.toUpperCase();
};

/**
 * Visit `MapEntry`.
 *
 * @param {Object} entry
 * @api public
 */

Serializer.prototype.visitMapEntry = function (entry) {
  var val = entry.map_value;
  if (val && val.length) val.forEach(this.visitMapEntry);
  this.visitMapField(entry.field);
};

/**
 * Visit `Fetch` response messages.
 *
 * @param {Object} data
 * @api public
 */

Serializer.prototype.visitDtFetchResp = function (data) {
  var val = data.type;
  if (typeof val == 'string') data.type = val.toUpperCase();
  val = data.value && data.value.map_value;
  if (val && val.length) val.forEach(this.visitMapEntry);
};

/**
 * Visit `MapUpdate` request messages.
 *
 * @param {Object} update
 * @api public
 */

Serializer.prototype.visitMapUpdate = function (update) {
  var val = update.flag_op;
  if (typeof val == 'string') update.flag_op = val.toUpperCase();
  val = update.map_op;
  if (val) this.visitMapOp(val);
  this.visitMapField(update.field);
};

/**
 * Visit `MapOp` request messages.
 *
 * @param {Object} op
 * @api public
 */

Serializer.prototype.visitMapOp = function (op) {
  var val = op.adds;
  if (val && val.length) val.forEach(this.visitMapField);
  val = op.removes;
  if (val && val.length) val.forEach(this.visitMapField);
  val = op.updates;
  if (val && val.length) val.forEach(this.visitMapUpdate);
};

/**
 * Visit `Update` request messages.
 *
 * @param {Object} data
 * @api public
 */

Serializer.prototype.visitDtUpdateReq = function (data) {
  var val;
  var op = data.op;
  if (op) {
    val = op.map_op;
    if (val) this.visitMapOp(val);
  }
};

/**
 * Visit `Update` response messages.
 *
 * @param {Object} data
 * @api public
 */

Serializer.prototype.visitDtUpdateResp = function (data) {
  var val = data.map_value;
  if (val && val.length) val.forEach(this.visitMapEntry);
};

// 253,RpbAuthReq,riak
// 254,RpbAuthResp,riak
// 255,RpbStartTls,riak
