var assert = require('assert');

var Decoder = require('../lib/index').Decoder;
var schema = require('../lib/index').schema;

function bodyless (code, type) {
  it('should decode ' + type, function (done) {
    this.subject.on('data', function (data) {
      assert.equal(data.type, type);
      done();
    });
    this.subject.write({
      code: code,
      size: 0,
      data: null
    });
  });
}

function testContent (content) {
  assert.deepEqual(content.value, {});
  assert.equal(content.content_type, 'application/json');
  assert.equal(content.charset, 'utf8');
  assert.equal(content.content_encoding, '');
  assert.deepEqual([].slice.call(content.vtag.toBuffer()), [17, 23]);
  assert.equal(content.links.length, 1);
  assert.deepEqual(content.links[0], {
    bucket: 'test bucket',
    key: 'linked key',
    tag: 'tagged'
  });
  assert.equal(content.last_mod, 77777);
  assert.equal(content.last_mod_usecs, 77777000);
  assert.equal(content.usermeta.length, 1);
  assert.deepEqual(content.usermeta[0], {
    key: 'testdata',
    value: 'foobar'
  });
  assert.equal(content.indexes.length, 2);
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
  assert.equal(content.deleted, false);
}

testContent.data = {
  value: new Buffer('{}'),
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
  assert.equal(props.n_val, 1);
  assert.equal(props.allow_mult, false);
  assert.equal(props.last_write_wins, false);
  assert.equal(props.has_precommit, false);
  assert.equal(props.has_postcommit, false);
  assert.equal(props.old_vclock, 10);
  assert.equal(props.young_vclock, 11);
  assert.equal(props.big_vclock, 12);
  assert.equal(props.small_vclock, 13);
  assert.equal(props.pr, 14);
  assert.equal(props.r, 15);
  assert.equal(props.w, 16);
  assert.equal(props.pw, 17);
  assert.equal(props.dw, 18);
  assert.equal(props.rw, 19);
  assert.equal(props.basic_quorum, false);
  assert.equal(props.notfound_ok, true);
  assert.equal(props.backend, 'leveldb');
  assert.equal(props.search, false);
  assert.equal(props.repl, 'realtime');
  assert.equal(props.search_index, 'default');
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

describe('Protocol Buffer Decoder', function () {

  beforeEach(function () {
    this.subject = new Decoder();
  });

  it('should decode RpbErrorResp', function (done) {
    this.subject.on('data', function (data) {
      assert.equal(data.type, 'RpbErrorResp');
      assert(data.error instanceof Error);
      assert.equal(data.error.message, 'test message');
      done();
    });
    var buf = new schema.RpbErrorResp({
      errmsg: 'test message',
      errcode: -1
    }).toBuffer();
    this.subject.write({
      code: 0,
      size: buf.length,
      data: buf
    });
  });

  bodyless(1, 'RpbPingReq');
  bodyless(2, 'RpbPingResp');
  bodyless(3, 'RpbGetClientIdReq');

  it('should decode RpbGetClientIdResp', function (done) {
    this.subject.on('data', function (data) {
      assert.equal(data.type, 'RpbGetClientIdResp');
      assert.equal(data.result.client_id, 'test client id');
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
      assert.equal(data.type, 'RpbSetClientIdReq');
      assert.equal(data.result.client_id, 'test client id');
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
      assert.equal(data.type, 'RpbGetServerInfoResp');
      assert.equal(data.result.node, 'test node');
      assert.equal(data.result.server_version, '2.0.0');
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
      assert.equal(data.type, 'RpbGetReq');
      assert.equal(data.result.bucket, 'test bucket');
      assert.equal(data.result.key, 'test key');
      assert.equal(data.result.r, 3);
      assert.equal(data.result.pr, 1);
      assert.equal(data.result.basic_quorum, false);
      assert.deepEqual([].slice.call(data.result.if_modified.toBuffer()), [13, 19]);
      assert.equal(data.result.head, false);
      assert.equal(data.result.timeout, 12345);
      assert.equal(data.result.sloppy_quorum, false);
      assert.equal(data.result.n_val, 1);
      assert.equal(data.result.type, 'default');
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
      assert.equal(data.type, 'RpbGetResp');
      assert.deepEqual([].slice.call(data.result.vclock.toBuffer()), [13, 19]);
      assert.equal(data.result.unchanged, false);
      assert.equal(data.result.content.length, 1);
      testContent(data.result.content[0]);
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

  it('should decode RpbPutReq', function (done) {
    this.subject.on('data', function (data) {
      assert.equal(data.type, 'RpbPutReq');
      assert.equal(data.result.bucket, 'test bucket');
      assert.equal(data.result.key, 'test key');
      assert.deepEqual([].slice.call(data.result.vclock.toBuffer()), [13, 19]);
      assert.equal(data.result.w, 3);
      assert.equal(data.result.dw, 2);
      assert.equal(data.result.return_body, true);
      assert.equal(data.result.pw, 1);
      assert.equal(data.result.if_not_modified, true);
      assert.equal(data.result.if_none_match, false);
      assert.equal(data.result.return_head, false);
      assert.equal(data.result.timeout, 77272);
      assert.equal(data.result.asis, false);
      assert.equal(data.result.sloppy_quorum, false);
      assert.equal(data.result.n_val, 3);
      assert.equal(data.result.type, 'test type');
      testContent(data.result.content);
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
      assert.equal(data.type, 'RpbPutResp');
      assert.deepEqual([].slice.call(data.result.vclock.toBuffer()), [13, 19]);
      assert.equal(data.result.key, 'test key');
      assert.equal(data.result.content.length, 1);
      testContent(data.result.content[0]);
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

  it('should decode RpbDelReq', function (done) {
    this.subject.on('data', function (data) {
      assert.equal(data.type, 'RpbDelReq');
      assert.equal(data.result.bucket, 'test bucket');
      assert.equal(data.result.key, 'test key');
      assert.equal(data.result.rw, 3);
      assert.deepEqual([].slice.call(data.result.vclock.toBuffer()), [13, 19]);
      assert.equal(data.result.r, 2);
      assert.equal(data.result.w, 1);
      assert.equal(data.result.pr, 7);
      assert.equal(data.result.pw, 8);
      assert.equal(data.result.dw, 9);
      assert.equal(data.result.timeout, 77272);
      assert.equal(data.result.sloppy_quorum, false);
      assert.equal(data.result.n_val, 3);
      assert.equal(data.result.type, 'test type');
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
      assert.equal(data.type, 'RpbListBucketsReq');
      assert.equal(data.result.timeout, 77272);
      assert.equal(data.result.stream, false);
      assert.equal(data.result.type, 'test type');
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
      assert.equal(data.type, 'RpbListBucketsResp');
      assert.deepEqual(data.result.buckets, ['bucket1', 'bucket2', 'bucket3']);
      assert.equal(data.result.done, true);
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
      assert.equal(data.type, 'RpbListKeysReq');
      assert.equal(data.result.bucket, 'test bucket');
      assert.equal(data.result.timeout, 77272);
      assert.equal(data.result.type, 'test type');
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
      assert.equal(data.type, 'RpbListKeysResp');
      assert.deepEqual(data.result.keys, ['key1', 'key1', 'key1']);
      assert.equal(data.result.done, true);
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
      assert.equal(data.type, 'RpbGetBucketReq');
      assert.equal(data.result.bucket, 'test bucket');
      assert.equal(data.result.type, 'test type');
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
      assert.equal(data.type, 'RpbGetBucketResp');
      testBucketProps(data.result.props);
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
      assert.equal(data.type, 'RpbSetBucketReq');
      testBucketProps(data.result.props);
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
      assert.equal(data.type, 'RpbMapRedReq');
      assert.deepEqual(data.result.request, JSON.parse(request));
      assert.equal(data.result.content_type, 'application/json');
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
      assert.equal(data.type, 'RpbMapRedResp');
      assert.equal(data.result.phase, 1);
      assert.deepEqual(data.result.response, response);
      assert.equal(data.result.done, true);
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

});
