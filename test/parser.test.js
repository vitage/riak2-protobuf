var assert = require('assert');

var Parser = require('../lib/index').Parser;
var schema = require('../lib/index').schema;

function bodyless (code, type) {
  it('should decode ' + type, function (done) {
    this.subject.on('data', function (data) {
      assert.strictEqual(data._type, type);
      done();
    });
    this.subject.write({
      code: code
    });
  });
}

function testContent (content) {
  assert.deepEqual(content.value, { hello: 'world' });
  assert.strictEqual(content.content_type, 'application/json');
  assert.strictEqual(content.charset, 'utf8');
  assert.strictEqual(content.content_encoding, '');
  assert.deepEqual([].slice.call(content.vtag.toBuffer()), [17, 23]);
  assert.strictEqual(content.links.length, 1);
  assert.deepEqual(content.links[0], {
    bucket: 'test bucket',
    key: 'linked key',
    tag: 'tagged'
  });
  assert.strictEqual(content.last_mod, 77777);
  assert.strictEqual(content.last_mod_usecs, 77777000);
  assert.strictEqual(content.usermeta.length, 1);
  assert.deepEqual(content.usermeta[0], {
    key: 'testdata',
    value: 'foobar'
  });
  assert.strictEqual(content.indexes.length, 2);
  assert.deepEqual(content.indexes, [
    {
      key: 'field1_bin',
      value: 'val4'
    },
    {
      key: 'field1_int',
      value: '1004'
    }
  ]);
  assert.strictEqual(content.deleted, false);
}

testContent.data = {
  value: '{"hello":"world"}',
  content_type: 'application/json',
  charset: 'utf8',
  content_encoding: '',
  vtag: new Buffer([17, 23]),
  links: [
    {
      bucket: 'test bucket',
      key: 'linked key',
      tag: 'tagged'
    }
  ],
  last_mod: 77777,
  last_mod_usecs: 77777000,
  usermeta: [
    {
      key: 'testdata',
      value: 'foobar'
    }
  ],
  indexes: [
    {
      key: 'field1_bin',
      value: 'val4'
    },
    {
      key: 'field1_int',
      value: '1004'
    }
  ],
  deleted: false
};

function testBucketProps (props) {
  assert.strictEqual(props.n_val, 1);
  assert.strictEqual(props.allow_mult, false);
  assert.strictEqual(props.last_write_wins, false);
  assert.strictEqual(props.has_precommit, false);
  assert.strictEqual(props.has_postcommit, false);
  assert.strictEqual(props.old_vclock, 10);
  assert.strictEqual(props.young_vclock, 11);
  assert.strictEqual(props.big_vclock, 12);
  assert.strictEqual(props.small_vclock, 13);
  assert.strictEqual(props.pr, 14);
  assert.strictEqual(props.r, 15);
  assert.strictEqual(props.w, 16);
  assert.strictEqual(props.pw, 17);
  assert.strictEqual(props.dw, 18);
  assert.strictEqual(props.rw, 19);
  assert.strictEqual(props.basic_quorum, false);
  assert.strictEqual(props.notfound_ok, true);
  assert.strictEqual(props.backend, 'leveldb');
  assert.strictEqual(props.search, false);
  assert.strictEqual(props.repl, 'realtime');
  assert.strictEqual(props.search_index, 'default');
}

testBucketProps.data = {
  // Declared in riak_core_app
  n_val: 1,
  allow_mult: false,
  last_write_wins: false,
  // repeated RpbCommitHook precommit = 4;
  has_precommit: false,
  // repeated RpbCommitHook postcommit = 6;
  has_postcommit: false,
  // optional RpbModFun chash_keyfun = 8;

  // Declared in riak_kv_app
  // optional RpbModFun linkfun = 9;
  old_vclock: 10,
  young_vclock: 11,
  big_vclock: 12,
  small_vclock: 13,
  pr: 14,
  r: 15,
  w: 16,
  pw: 17,
  dw: 18,
  rw: 19,
  basic_quorum: false,
  notfound_ok: true,

  // Used by riak_kv_multi_backend
  backend: 'leveldb',

  // Used by riak_search bucket fixup
  search: false,

  // Used by riak_repl bucket fixup
  repl: 'REALTIME',

  search_index: 'default'
};

describe('Protocol Buffer Parser', function () {

  beforeEach(function () {
    this.subject = new Parser();
  });

  it('should decode RpbErrorResp', function (done) {
    this.subject.on('data', function (data) {
      assert.strictEqual(data._type, 'RpbErrorResp');
      assert.strictEqual(data.errmsg, 'test message');
      assert.strictEqual(data.errcode, 255);
      done();
    });
    var buf = new schema.RpbErrorResp({
      errmsg: 'test message',
      errcode: 255
    }).toBuffer();
    this.subject.write({
      code: 0,
      size: buf.length,
      data: buf
    }, 0);
  });

  bodyless(1, 'RpbPingReq');
  bodyless(2, 'RpbPingResp');
  bodyless(3, 'RpbGetClientIdReq');

  it('should decode RpbGetClientIdResp', function (done) {
    this.subject.on('data', function (data) {
      assert.strictEqual(data._type, 'RpbGetClientIdResp');
      assert.strictEqual(data.client_id, 'test client id');
      done();
    });
    var buf = new schema.RpbGetClientIdResp({
      client_id: 'test client id'
    }).toBuffer();
    this.subject.write({
      code: 4,
      size: buf.length,
      data: buf
    });
  });

  it('should decode RpbSetClientIdReq', function (done) {
    this.subject.on('data', function (data) {
      assert.strictEqual(data._type, 'RpbSetClientIdReq');
      assert.strictEqual(data.client_id, 'test client id');
      done();
    });
    var buf = new schema.RpbSetClientIdReq({
      client_id: 'test client id'
    }).toBuffer();
    this.subject.write({
      code: 5,
      size: buf.length,
      data: buf
    });
  });

  bodyless(6, 'RpbSetClientIdResp');
  bodyless(7, 'RpbGetServerInfoReq');

  it('should decode RpbGetServerInfoResp', function (done) {
    this.subject.on('data', function (data) {
      assert.strictEqual(data._type, 'RpbGetServerInfoResp');
      assert.strictEqual(data.node, 'test node');
      assert.strictEqual(data.server_version, '2.0.0');
      done();
    });
    var buf = new schema.RpbGetServerInfoResp({
      node: 'test node',
      server_version: '2.0.0'
    }).toBuffer();
    this.subject.write({
      code: 8,
      size: buf.length,
      data: buf
    });
  });

  it('should decode RpbGetReq', function (done) {
    this.subject.on('data', function (data) {
      assert.strictEqual(data._type, 'RpbGetReq');
      assert.strictEqual(data.bucket, 'test bucket');
      assert.strictEqual(data.key, 'test key');
      assert.strictEqual(data.r, 3);
      assert.strictEqual(data.pr, 1);
      assert.strictEqual(data.basic_quorum, false);
      assert.deepEqual([].slice.call(data.if_modified.toBuffer()), [13, 19]);
      assert.strictEqual(data.head, false);
      assert.strictEqual(data.timeout, 12345);
      assert.strictEqual(data.sloppy_quorum, false);
      assert.strictEqual(data.n_val, 1);
      assert.strictEqual(data.type, 'default');
      done();
    });
    var buf = new schema.RpbGetReq({
      bucket: 'test bucket',
      key: 'test key',
      r: 3,
      pr: 1,
      basic_quorum: false,
      notfound_ok: true,
      if_modified: new Buffer([13, 19]),
      head: false,
      deletedvclock: false,
      timeout: 12345,
      sloppy_quorum: false,
      n_val: 1,
      type: 'default'
    }).toBuffer();
    this.subject.write({
      code: 9,
      size: buf.length,
      data: buf
    });
  });

  it('should decode RpbGetResp', function (done) {
    this.subject.on('data', function (data) {
      assert.strictEqual(data._type, 'RpbGetResp');
      assert.deepEqual([].slice.call(data.vclock.toBuffer()), [13, 19]);
      assert.strictEqual(data.unchanged, false);
      assert.strictEqual(data.content.length, 1);
      testContent(data.content[0]);
      done();
    });
    var buf = new schema.RpbGetResp({
      content: [testContent.data],
      vclock: new Buffer([13, 19]),
      unchanged: false
    }).toBuffer();
    this.subject.write({
      code: 10,
      size: buf.length,
      data: buf
    });
  });

  it('should decode RpbGetResp with text/*', function (done) {
    var content = {
      value: 'this is text data',
      content_type: 'text/plain'
    };
    this.subject.on('data', function (data) {
      assert.strictEqual(data.content[0].value, content.value);
      done();
    });
    var buf = new schema.RpbGetResp({
      content: [content]
    }).toBuffer();
    this.subject.write({
      code: 10,
      size: buf.length,
      data: buf
    });
  });

  it('should decode RpbGetResp with application/xml', function (done) {
    var content = {
      value: '<?xml version="1.0"?><p>this is text data</p>',
      content_type: 'application/xml'
    };
    this.subject.on('data', function (data) {
      assert.strictEqual(data.content[0].value, content.value);
      done();
    });
    var buf = new schema.RpbGetResp({
      content: [content]
    }).toBuffer();
    this.subject.write({
      code: 10,
      size: buf.length,
      data: buf
    });
  });

  it('should decode RpbGetResp with application/html', function (done) {
    var content = {
      value: 'this is text data</p>',
      content_type: 'application/html'
    };
    this.subject.on('data', function (data) {
      assert.strictEqual(data.content[0].value, content.value);
      done();
    });
    var buf = new schema.RpbGetResp({
      content: [content]
    }).toBuffer();
    this.subject.write({
      code: 10,
      size: buf.length,
      data: buf
    });
  });

  it('should decode RpbGetResp with application/octet-stream', function (done) {
    var content = {
      value: new Buffer([1, 2, 3, 4, 5]),
      content_type: 'application/octet-stream'
    };
    this.subject.on('data', function (data) {
      assert.deepEqual([].slice.call(data.content[0].value),
        [].slice.call(content.value));
      done();
    });
    var buf = new schema.RpbGetResp({
      content: [content]
    }).toBuffer();
    this.subject.write({
      code: 10,
      size: buf.length,
      data: buf
    });
  });

  it('should decode RpbPutReq', function (done) {
    this.subject.on('data', function (data) {
      assert.strictEqual(data._type, 'RpbPutReq');
      assert.strictEqual(data.bucket, 'test bucket');
      assert.strictEqual(data.key, 'test key');
      assert.deepEqual([].slice.call(data.vclock.toBuffer()), [13, 19]);
      assert.strictEqual(data.w, 3);
      assert.strictEqual(data.dw, 2);
      assert.strictEqual(data.return_body, true);
      assert.strictEqual(data.pw, 1);
      assert.strictEqual(data.if_not_modified, true);
      assert.strictEqual(data.if_none_match, false);
      assert.strictEqual(data.return_head, false);
      assert.strictEqual(data.timeout, 77272);
      assert.strictEqual(data.asis, false);
      assert.strictEqual(data.sloppy_quorum, false);
      assert.strictEqual(data.n_val, 3);
      assert.strictEqual(data.type, 'test type');
      testContent(data.content);
      done();
    });
    var buf = new schema.RpbPutReq({
      bucket: 'test bucket',
      key: 'test key',
      vclock: new Buffer([13, 19]),
      content: testContent.data,
      w: 3,
      dw: 2,
      return_body: true,
      pw: 1,
      if_not_modified: true,
      if_none_match: false,
      return_head: false,
      timeout: 77272,
      asis: false,
      sloppy_quorum: false,
      n_val: 3,
      type: 'test type'
    }).toBuffer();
    this.subject.write({
      code: 11,
      size: buf.length,
      data: buf
    });
  });

  it('should decode RpbPutResp', function (done) {
    this.subject.on('data', function (data) {
      assert.strictEqual(data._type, 'RpbPutResp');
      assert.deepEqual([].slice.call(data.vclock.toBuffer()), [13, 19]);
      assert.strictEqual(data.key, 'test key');
      assert.strictEqual(data.content.length, 1);
      testContent(data.content[0]);
      done();
    });
    var buf = new schema.RpbPutResp({
      content: [testContent.data],
      vclock: new Buffer([13, 19]),
      key: 'test key'
    }).toBuffer();
    this.subject.write({
      code: 12,
      size: buf.length,
      data: buf
    });
  });

  it('should decode RpbPutResp with no content', function (done) {
    this.subject.on('data', function (data) {
      assert.strictEqual(data._type, 'RpbPutResp');
      assert.deepEqual([].slice.call(data.vclock.toBuffer()), [13, 19]);
      assert.strictEqual(data.key, 'test key');
      assert.strictEqual(data.content.length, 0);
      done();
    });
    var buf = new schema.RpbPutResp({
      content: [],
      vclock: new Buffer([13, 19]),
      key: 'test key'
    }).toBuffer();
    this.subject.write({
      code: 12,
      size: buf.length,
      data: buf
    });
  });

  it('should decode RpbDelReq', function (done) {
    this.subject.on('data', function (data) {
      assert.strictEqual(data._type, 'RpbDelReq');
      assert.strictEqual(data.bucket, 'test bucket');
      assert.strictEqual(data.key, 'test key');
      assert.strictEqual(data.rw, 3);
      assert.deepEqual([].slice.call(data.vclock.toBuffer()), [13, 19]);
      assert.strictEqual(data.r, 2);
      assert.strictEqual(data.w, 1);
      assert.strictEqual(data.pr, 7);
      assert.strictEqual(data.pw, 8);
      assert.strictEqual(data.dw, 9);
      assert.strictEqual(data.timeout, 77272);
      assert.strictEqual(data.sloppy_quorum, false);
      assert.strictEqual(data.n_val, 3);
      assert.strictEqual(data.type, 'test type');
      done();
    });
    var buf = new schema.RpbDelReq({
      bucket: 'test bucket',
      key: 'test key',
      rw: 3,
      vclock: new Buffer([13, 19]),
      r: 2,
      w: 1,
      pr: 7,
      pw: 8,
      dw: 9,
      timeout: 77272,
      sloppy_quorum: false,
      n_val: 3,
      type: 'test type'
    }).toBuffer();
    this.subject.write({
      code: 13,
      size: buf.length,
      data: buf
    });
  });

  bodyless(14, 'RpbDelResp');

  it('should decode RpbListBucketsReq', function (done) {
    this.subject.on('data', function (data) {
      assert.strictEqual(data._type, 'RpbListBucketsReq');
      assert.strictEqual(data.timeout, 77272);
      assert.strictEqual(data.stream, false);
      assert.strictEqual(data.type, 'test type');
      done();
    });
    var buf = new schema.RpbListBucketsReq({
      timeout: 77272,
      stream: false,
      type: 'test type'
    }).toBuffer();
    this.subject.write({
      code: 15,
      size: buf.length,
      data: buf
    });
  });

  it('should decode RpbListBucketsResp', function (done) {
    this.subject.on('data', function (data) {
      assert.strictEqual(data._type, 'RpbListBucketsResp');
      assert.deepEqual(data.buckets, ['bucket1', 'bucket2', 'bucket3']);
      assert.strictEqual(data.done, true);
      done();
    });
    var buf = new schema.RpbListBucketsResp({
      buckets: [
        'bucket1',
        'bucket2',
        'bucket3'
      ],
      done: true
    }).toBuffer();
    this.subject.write({
      code: 16,
      size: buf.length,
      data: buf
    });
  });

  it('should decode RpbListKeysReq', function (done) {
    this.subject.on('data', function (data) {
      assert.strictEqual(data._type, 'RpbListKeysReq');
      assert.strictEqual(data.bucket, 'test bucket');
      assert.strictEqual(data.timeout, 77272);
      assert.strictEqual(data.type, 'test type');
      done();
    });
    var buf = new schema.RpbListKeysReq({
      bucket: 'test bucket',
      timeout: 77272,
      type: 'test type'
    }).toBuffer();
    this.subject.write({
      code: 17,
      size: buf.length,
      data: buf
    });
  });

  it('should decode RpbListKeysResp', function (done) {
    this.subject.on('data', function (data) {
      assert.strictEqual(data._type, 'RpbListKeysResp');
      assert.deepEqual(data.keys, ['key1', 'key1', 'key1']);
      assert.strictEqual(data.done, true);
      done();
    });
    var buf = new schema.RpbListKeysResp({
      keys: [
        'key1',
        'key1',
        'key1'
      ],
      done: true
    }).toBuffer();
    this.subject.write({
      code: 18,
      size: buf.length,
      data: buf
    });
  });

  it('should decode RpbGetBucketReq', function (done) {
    this.subject.on('data', function (data) {
      assert.strictEqual(data._type, 'RpbGetBucketReq');
      assert.strictEqual(data.bucket, 'test bucket');
      assert.strictEqual(data.type, 'test type');
      done();
    });
    var buf = new schema.RpbGetBucketReq({
      bucket: 'test bucket',
      type: 'test type'
    }).toBuffer();
    this.subject.write({
      code: 19,
      size: buf.length,
      data: buf
    });
  });

  it('should decode RpbGetBucketResp', function (done) {
    this.subject.on('data', function (data) {
      assert.strictEqual(data._type, 'RpbGetBucketResp');
      testBucketProps(data.props);
      done();
    });
    var buf = new schema.RpbGetBucketResp({
      props: testBucketProps.data
    }).toBuffer();
    this.subject.write({
      code: 20,
      size: buf.length,
      data: buf
    });
  });

  it('should decode RpbSetBucketReq', function (done) {
    this.subject.on('data', function (data) {
      assert.strictEqual(data._type, 'RpbSetBucketReq');
      testBucketProps(data.props);
      done();
    });
    var buf = new schema.RpbSetBucketReq({
      bucket: 'test bucket',
      props: testBucketProps.data,
      type: 'test type'
    }).toBuffer();
    this.subject.write({
      code: 21,
      size: buf.length,
      data: buf
    });
  });

  bodyless(22, 'RpbSetBucketResp');

  it('should decode RpbMapRedReq', function (done) {
    var request = JSON.stringify({
      inputs: 'training',
      query: [
        {
          map: {
            language: 'javascript',
            source: function (riakObject) {
              var val = riakObject.values[0].data.match(/pizza/g);
              return [[riakObject.key, (val ? val.length : 0 )]];
            }
          }
        }
      ]
    }, function (key, value) {
      if (typeof value == 'function') {
        return value.toString();
      }
      return value;
    });
    this.subject.on('data', function (data) {
      assert.strictEqual(data._type, 'RpbMapRedReq');
      assert.deepEqual(data.request, JSON.parse(request));
      assert.strictEqual(data.content_type, 'application/json');
      done();
    });
    var buf = new schema.RpbMapRedReq({
      request: request,
      content_type: 'application/json'
    }).toBuffer();
    this.subject.write({
      code: 23,
      size: buf.length,
      data: buf
    });
  });

  it('should decode RpbMapRedResp', function (done) {
    var response = JSON.stringify(
      [['foo', 1],['baz', 0],['bar', 4],['bam', 3]]
    );
    this.subject.on('data', function (data) {
      assert.strictEqual(data._type, 'RpbMapRedResp');
      assert.strictEqual(data.phase, 1);
      assert.deepEqual(data.response, response);
      assert.strictEqual(data.done, true);
      done();
    });
    var buf = new schema.RpbMapRedResp({
      phase: 1,
      response: response,
      done: true
    }).toBuffer();
    this.subject.write({
      code: 24,
      size: buf.length,
      data: buf
    });
  });

  it('should decode RpbIndexReq', function (done) {
    this.subject.on('data', function (data) {
      assert.strictEqual(data._type, 'RpbIndexReq');
      assert.strictEqual(data.bucket, 'test bucket');
      assert.strictEqual(data.index, 'test index');
      assert.strictEqual(data.qtype, 'range');
      assert.strictEqual(data.key, 'test key');
      assert.strictEqual(data.range_min, 'test min');
      assert.strictEqual(data.range_max, 'test max');
      assert.strictEqual(data.return_terms, false);
      assert.strictEqual(data.stream, true);
      assert.strictEqual(data.max_results, 10);
      assert(Buffer.isBuffer(data.continuation));
      assert.strictEqual(data.continuation.toString('utf8'), 'test buffer');
      assert.strictEqual(data.timeout, 10000);
      assert.strictEqual(data.type, 'test type');
      assert(data.term_regex instanceof RegExp);
      assert.strictEqual(data.term_regex.source, '.*');
      assert.strictEqual(data.pagination_sort, false);
      done();
    });
    var buf = new schema.RpbIndexReq({
      bucket: 'test bucket',
      index: 'test index',
      qtype: 'range',
      key: 'test key',
      range_min: 'test min',
      range_max: 'test max',
      return_terms: false,
      stream: true,
      max_results: 10,
      continuation: new Buffer('test buffer'),
      timeout: 10000,
      type: 'test type',
      term_regex: '.*',
      pagination_sort: false
    }).toBuffer();
    this.subject.write({
      code: 25,
      size: buf.length,
      data: buf
    });
  });

  it('should decode RpbIndexResp', function (done) {
    this.subject.on('data', function (data) {
      assert.strictEqual(data._type, 'RpbIndexResp');
      assert.deepEqual(data.keys, ['test key']);
      assert.strictEqual(data.results.length, 1);
      assert.strictEqual(data.results[0].key, 'test key');
      assert.strictEqual(data.results[0].value, 'test value');
      assert(Buffer.isBuffer(data.continuation));
      assert.strictEqual(data.continuation.toString('utf8'), 'test buffer');
      assert.strictEqual(data.done, false);
      done();
    });
    var buf = new schema.RpbIndexResp({
      keys: ['test key'],
      results: [
        {
          key: 'test key',
          value: new Buffer('test value')
        }
      ],
      continuation: new Buffer('test buffer'),
      done: false
    }).toBuffer();
    this.subject.write({
      code: 26,
      size: buf.length,
      data: buf
    });
  });

// 27,RpbSearchQueryReq,riak_search
// 28,RpbSearchQueryResp,riak_search
// 29,RpbResetBucketReq,riak
// 30,RpbResetBucketResp,riak
// 31,RpbGetBucketTypeReq,riak
// 32,RpbSetBucketTypeReq,riak
// 40,RpbCSBucketReq,riak_kv
// 41,RpbCSBucketResp,riak_kv

  it('should decode RpbCounterUpdateReq', function (done) {
    this.subject.on('data', function (data) {
      assert.strictEqual(data._type, 'RpbCounterUpdateReq');
      assert.strictEqual(data.bucket, 'test bucket');
      assert.strictEqual(data.key, 'test key');
      assert.strictEqual(data.amount, 187);
      assert.strictEqual(data.w, 4);
      assert.strictEqual(data.dw, 5);
      assert.strictEqual(data.pw, 6);
      assert.strictEqual(data.returnvalue, true);
      done();
    });
    var buf = new schema.RpbCounterUpdateReq({
      bucket: 'test bucket',
      key: 'test key',
      amount: 187,
      w: 4,
      dw: 5,
      pw: 6,
      returnvalue: true
    }).toBuffer();
    this.subject.write({
      code: 50,
      size: buf.length,
      data: buf
    });
  });

  it('should decode RpbCounterUpdateResp', function (done) {
    this.subject.on('data', function (data) {
      assert.strictEqual(data._type, 'RpbCounterUpdateResp');
      assert.strictEqual(data.value, 187);
      done();
    });
    var buf = new schema.RpbCounterUpdateResp({
      value: 187
    }).toBuffer();
    this.subject.write({
      code: 51,
      size: buf.length,
      data: buf
    });
  });

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

  it('should decode DtFetchReq', function (done) {
    this.subject.on('data', function (data) {
      assert.strictEqual(data._type, 'DtFetchReq');
      assert.strictEqual(data.bucket, 'test bucket');
      assert.strictEqual(data.key, 'test key');
      assert.strictEqual(data.type, 'test type');
      assert.strictEqual(data.r, 1);
      assert.strictEqual(data.pr, 2);
      assert.strictEqual(data.basic_quorum, false);
      assert.strictEqual(data.notfound_ok, false);
      assert.strictEqual(data.timeout, 1000);
      assert.strictEqual(data.sloppy_quorum, false);
      assert.strictEqual(data.n_val, 4);
      assert.strictEqual(data.include_context, false);
      done();
    });
    var buf = new schema.DtFetchReq({
      bucket: 'test bucket',
      key: 'test key',
      type: 'test type',
      r: 1,
      pr: 2,
      basic_quorum: false,
      notfound_ok: false,
      timeout: 1000,
      sloppy_quorum: false,
      n_val: 4,
      include_context: false
    }).toBuffer();
    this.subject.write({
      code: 80,
      size: buf.length,
      data: buf
    });
  });

  it('should decode DtFetchResp with counter', function (done) {
    this.subject.on('data', function (data) {
      assert.strictEqual(data._type, 'DtFetchResp');
      assert(Buffer.isBuffer(data.context));
      assert.strictEqual(data.context.toString('utf8'), 'some context');
      assert.strictEqual(data.type, 'counter');
      assert.deepEqual(data.value, {
        counter_value: 199,
        set_value: [],
        map_value: []
      });
      done();
    });
    var buf = new schema.DtFetchResp({
      context: 'some context',
      type: 1,
      value: {
        counter_value: 199
      }
    }).toBuffer();
    this.subject.write({
      code: 81,
      size: buf.length,
      data: buf
    });
  });

  it('should decode DtFetchResp with set', function (done) {
    this.subject.on('data', function (data) {
      assert.strictEqual(data._type, 'DtFetchResp');
      assert(Buffer.isBuffer(data.context));
      assert.strictEqual(data.context.toString('utf8'), 'some context');
      assert.strictEqual(data.type, 'set');
      assert.deepEqual(data.value, {
        counter_value: null,
        set_value: ['foo', 'bar', 'baz'],
        map_value: []
      });
      done();
    });
    var buf = new schema.DtFetchResp({
      context: 'some context',
      type: 2,
      value: {
        set_value: ['foo', 'bar', 'baz']
      }
    }).toBuffer();
    this.subject.write({
      code: 81,
      size: buf.length,
      data: buf
    });
  });

  it('should decode DtFetchResp with map', function (done) {
    this.subject.on('data', function (data) {
      assert.strictEqual(data._type, 'DtFetchResp');
      assert(Buffer.isBuffer(data.context));
      assert.strictEqual(data.context.toString('utf8'), 'some context');
      assert.strictEqual(data.type, 'map');
      assert(data.value);
      assert.strictEqual(data.value.counter_value, null);
      assert.deepEqual(data.value.set_value, []);
      assert.strictEqual(data.value.map_value.length, 5)
      assert.deepEqual(data.value.map_value[0], {
        field: {
          name: 'counter1',
          type: 'counter'
        },
        counter_value: 881,
        set_value: [],
        register_value: null,
        flag_value: null,
        map_value: []
      });
      assert.deepEqual(data.value.map_value[1], {
        field: {
          name: 'set2',
          type: 'set'
        },
        counter_value: null,
        set_value: ['foo', 'bar', 'baz'],
        register_value: null,
        flag_value: null,
        map_value: []
      });
      assert.deepEqual(data.value.map_value[2], {
        field: {
          name: 'register3',
          type: 'register'
        },
        counter_value: null,
        set_value: [],
        register_value: 'xyzzy',
        flag_value: null,
        map_value: []
      });
      assert.deepEqual(data.value.map_value[3], {
        field: {
          name: 'flag4',
          type: 'flag'
        },
        counter_value: null,
        set_value: [],
        register_value: null,
        flag_value: true,
        map_value: []
      });
      assert.deepEqual(data.value.map_value[4], {
        field: {
          name: 'map5',
          type: 'map'
        },
        counter_value: null,
        set_value: [],
        register_value: null,
        flag_value: null,
        map_value: [
          {
            field: {
              name: 'counter1.1',
              type: 'counter'
            },
            counter_value: 67,
            set_value: [],
            register_value: null,
            flag_value: null,
            map_value: [],
          }
        ]
      });
      done();
    });
    var buf = new schema.DtFetchResp({
      context: 'some context',
      type: 3,
      value: {
        map_value: [
          {
            field: {
              name: 'counter1',
              type: 1
            },
            counter_value: 881
          },
          {
            field: {
              name: 'set2',
              type: 2
            },
            set_value: ['foo', 'bar', 'baz']
          },
          {
            field: {
              name: 'register3',
              type: 3
            },
            register_value: 'xyzzy'
          },
          {
            field: {
              name: 'flag4',
              type: 4
            },
            flag_value: true
          },
          {
            field: {
              name: 'map5',
              type: 5
            },
            map_value: [
              {
                field: {
                  name: 'counter1.1',
                  type: 1
                },
                counter_value: 67
              }
            ]
          }
        ]
      }
    }).toBuffer();
    this.subject.write({
      code: 81,
      size: buf.length,
      data: buf
    });
  });

  it('should decode DtUpdateReq', function (done) {
    this.subject.on('data', function (data) {
      assert.strictEqual(data._type, 'DtUpdateReq');
      assert.strictEqual(data.bucket, 'test bucket');
      assert.strictEqual(data.key, 'test key');
      assert.strictEqual(data.type, 'test type');
      assert(Buffer.isBuffer(data.context));
      assert.strictEqual(data.context.toString('utf8'), 'some context');

      assert.strictEqual(data.op.counter_op.increment, 1);
      assert.strictEqual(data.op.set_op.adds.length, 1);
      assert.strictEqual(data.op.set_op.adds[0], 'foo');
      assert.strictEqual(data.op.set_op.removes.length, 1);
      assert.strictEqual(data.op.set_op.removes[0], 'bar');
      assert.strictEqual(data.op.map_op.adds.length, 1);
      assert.strictEqual(data.op.map_op.adds[0].name, 'counter1');
      assert.strictEqual(data.op.map_op.adds[0].type, 'counter');
      assert.strictEqual(data.op.map_op.removes.length, 1);
      assert.strictEqual(data.op.map_op.removes[0].name, 'set2');
      assert.strictEqual(data.op.map_op.removes[0].type, 'set');
      assert.strictEqual(data.op.map_op.updates.length, 5);
      assert.strictEqual(data.op.map_op.updates[0].field.name, 'counter1');
      assert.strictEqual(data.op.map_op.updates[0].field.type, 'counter');
      assert.strictEqual(data.op.map_op.updates[0].counter_op.increment, 1);
      assert.strictEqual(data.op.map_op.updates[1].field.name, 'set2');
      assert.strictEqual(data.op.map_op.updates[1].field.type, 'set');
      assert.strictEqual(data.op.map_op.updates[1].set_op.adds.length, 1);
      assert.strictEqual(data.op.map_op.updates[1].set_op.adds[0], 'foo');
      assert.strictEqual(data.op.map_op.updates[1].set_op.removes.length, 1);
      assert.strictEqual(data.op.map_op.updates[1].set_op.removes[0], 'bar');
      assert.strictEqual(data.op.map_op.updates[2].field.name, 'register3');
      assert.strictEqual(data.op.map_op.updates[2].field.type, 'register');
      assert.strictEqual(data.op.map_op.updates[2].register_op, 'xyzzy');
      assert.strictEqual(data.op.map_op.updates[3].field.name, 'flag4');
      assert.strictEqual(data.op.map_op.updates[3].field.type, 'flag');
      assert.strictEqual(data.op.map_op.updates[3].flag_op, 'disable');
      assert.strictEqual(data.op.map_op.updates[4].field.name, 'map5');
      assert.strictEqual(data.op.map_op.updates[4].field.type, 'map');
      assert.strictEqual(data.op.map_op.updates[4].map_op.adds.length, 1);
      assert.strictEqual(data.op.map_op.updates[4].map_op.adds[0].name, 'flag44');
      assert.strictEqual(data.op.map_op.updates[4].map_op.adds[0].type, 'flag');

      assert.strictEqual(data.w, 6);
      assert.strictEqual(data.dw, 7);
      assert.strictEqual(data.pw, 8);
      assert.strictEqual(data.return_body, true);
      assert.strictEqual(data.timeout, 10);
      assert.strictEqual(data.sloppy_quorum, true);
      assert.strictEqual(data.n_val, 12);
      assert.strictEqual(data.include_context, false);
      done();
    });
    var buf = new schema.DtUpdateReq({
      bucket: 'test bucket',
      key: 'test key',
      type: 'test type',
      context: 'some context',
      op: {
        counter_op: {
          increment: 1
        },
        set_op: {
          adds: ['foo'],
          removes: ['bar']
        },
        map_op: {
          adds: [
            {
              name: 'counter1',
              type: 1
            }
          ],
          removes: [
            {
              name: 'set2',
              type: 2
            }
          ],
          updates: [
            {
              field: {
                name: 'counter1',
                type: 1
              },
              counter_op: {
                increment: 1
              }
            },
            {
              field: {
                name: 'set2',
                type: 2
              },
              set_op: {
                adds: ['foo'],
                removes: ['bar']
              }
            },
            {
              field: {
                name: 'register3',
                type: 3
              },
              register_op: 'xyzzy'
            },
            {
              field: {
                name: 'flag4',
                type: 4
              },
              flag_op: 2
            },
            {
              field: {
                name: 'map5',
                type: 5
              },
              map_op: {
                adds: [
                  {
                    name: 'flag44',
                    type: 4
                  }
                ]
              }
            }
          ]
        }
      },
      w: 6,
      dw: 7,
      pw: 8,
      return_body: true,
      timeout: 10,
      sloppy_quorum: true,
      n_val: 12,
      include_context: false
    }).toBuffer();
    this.subject.write({
      code: 82,
      size: buf.length,
      data: buf
    });
  });

  it('should decode DtUpdateResp', function (done) {
    this.subject.on('data', function (data) {
      assert.strictEqual(data._type, 'DtUpdateResp');
      assert.strictEqual(data.key, 'test key');
      assert(Buffer.isBuffer(data.context));
      assert.strictEqual(data.context.toString('utf8'), 'some context');
      assert.strictEqual(data.counter_value, 199);
      assert.strictEqual(data.set_value.length, 3);
      assert.strictEqual(data.set_value[0], 'foo');
      assert.strictEqual(data.set_value[1], 'bar');
      assert.strictEqual(data.set_value[2], 'baz');
      assert.strictEqual(data.map_value.length, 1);
      assert.strictEqual(data.map_value[0].field.name, 'dory');
      assert.strictEqual(data.map_value[0].field.type, 'flag');
      assert.strictEqual(data.map_value[0].flag_value, true);
      done();
    });
    var buf = new schema.DtUpdateResp({
      key: 'test key',
      context: 'some context',
      counter_value: 199,
      set_value: ['foo', 'bar', 'baz'],
      map_value: [
        {
          field: {
            name: 'dory',
            type: 4
          },
          flag_value: true
        }
      ]
    }).toBuffer();
    this.subject.write({
      code: 83,
      size: buf.length,
      data: buf
    });
  });

// 253,RpbAuthReq,riak
// 254,RpbAuthResp,riak
// 255,RpbStartTls,riak

});
