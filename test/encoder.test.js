var assert = require('assert');

var Encoder = require('../lib/index').Encoder;
var schema = require('../lib/index').schema;

function bodyless (code, type) {
  it('should encode ' + type, function (done) {
    this.subject.on('data', function (buf) {
      assert.equal(buf.readUInt32BE(0), 1);
      assert.equal(buf[4], code);
      done();
    });
    this.subject.write({
      type: type
    });
  });
}

function testContent (content) {
  assert.equal(content.value.toString('utf8'), '{"hello":"world"}');
  assert.equal(content.content_type.toString('utf8'), 'application/json');
  assert.equal(content.charset.toString('utf8'), 'utf8');
  assert.equal(content.content_encoding.toString('utf8'), '');
  assert.deepEqual([].slice.call(content.vtag.toBuffer()), [17, 23]);
  assert.equal(content.links.length, 1);
  assert.equal(content.links[0].bucket.toString('utf8'), 'test bucket');
  assert.equal(content.links[0].key.toString('utf8'), 'linked key');
  assert.equal(content.links[0].tag.toString('utf8'), 'tagged');
  assert.equal(content.last_mod, 77777);
  assert.equal(content.last_mod_usecs, 77777000);
  assert.equal(content.usermeta.length, 1);
  assert.equal(content.usermeta[0].key.toString('utf8'), 'testdata');
  assert.equal(content.usermeta[0].value.toString('utf8'), 'foobar');
  assert.equal(content.indexes.length, 2);
  assert.equal(content.indexes[0].key.toString('utf8'), 'field1_bin');
  assert.equal(content.indexes[0].value.toString('utf8'), 'val4');
  assert.equal(content.indexes[1].key.toString('utf8'), 'field1_int');
  assert.equal(content.indexes[1].value.toString('utf8'), '1004');
  assert.equal(content.deleted, false);
}

testContent.data = {
  value: { hello: 'world' },
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
  assert.equal(props.backend.toString('utf8'), 'leveldb');
  assert.equal(props.search, false);
  assert.equal(props.repl, 1);
  assert.equal(props.search_index.toString('utf8'), 'default');
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

describe('Protocol Buffer Encoder', function () {

  beforeEach(function () {
    this.subject = new Encoder();
  });

  it('should encode RpbErrorResp with Error', function (done) {
    this.subject.on('data', function (buf) {
      assert.equal(buf.readUInt32BE(0), buf.length - 4);
      assert.equal(buf[4], 0);
      var data = schema.RpbErrorResp.decode(buf.slice(5));
      assert.equal(data.errmsg.toString('utf8'), 'test message');
      assert.equal(data.errcode, 1234);
      done();
    });
    var err = new Error('test message');
    err.code = 1234;
    this.subject.write({
      type: 'RpbErrorResp',
      error: err
    });
  });

  it('should encode RpbErrorResp with data', function (done) {
    this.subject.on('data', function (buf) {
      assert.equal(buf.readUInt32BE(0), buf.length - 4);
      assert.equal(buf[4], 0);
      var data = schema.RpbErrorResp.decode(buf.slice(5));
      assert.equal(data.errmsg.toString('utf8'), 'test message');
      assert.equal(data.errcode, 1234);
      done();
    });
    this.subject.write({
      type: 'RpbErrorResp',
      data: {
        errmsg: 'test message',
        errcode: 1234
      }
    });
  });

  bodyless(1, 'RpbPingReq');
  bodyless(2, 'RpbPingResp');
  bodyless(3, 'RpbGetClientIdReq');

  it('should encode RpbGetClientIdResp', function (done) {
    this.subject.on('data', function (buf) {
      assert.equal(buf.readUInt32BE(0), buf.length - 4);
      assert.equal(buf[4], 4);
      var data = schema.RpbGetClientIdResp.decode(buf.slice(5));
      assert.equal(data.client_id.toString('utf8'), 'test client id');
      done();
    });
    this.subject.write({
      type: 'RpbGetClientIdResp',
      data: {
        client_id: 'test client id'
      }
    });
  });

  it('should encode RpbSetClientIdReq', function (done) {
    this.subject.on('data', function (buf) {
      assert.equal(buf.readUInt32BE(0), buf.length - 4);
      assert.equal(buf[4], 5);
      var data = schema.RpbSetClientIdReq.decode(buf.slice(5));
      assert.equal(data.client_id.toString('utf8'), 'test client id');
      done();
    });
    this.subject.write({
      type: 'RpbSetClientIdReq',
      data: {
        client_id: 'test client id'
      }
    });
  });

  bodyless(6, 'RpbSetClientIdResp');
  bodyless(7, 'RpbGetServerInfoReq');

  it('should encode RpbGetServerInfoResp', function (done) {
    this.subject.on('data', function (buf) {
      assert.equal(buf.readUInt32BE(0), buf.length - 4);
      assert.equal(buf[4], 8);
      var data = schema.RpbGetServerInfoResp.decode(buf.slice(5));
      assert.equal(data.node.toString('utf8'), 'test node');
      assert.equal(data.server_version.toString('utf8'), '2.0.0');
      done();
    });
    this.subject.write({
      type: 'RpbGetServerInfoResp',
      data: {
        node: 'test node',
        server_version: '2.0.0'
      }
    });
  });

  it('should encode RpbGetReq', function (done) {
    this.subject.on('data', function (buf) {
      assert.equal(buf.readUInt32BE(0), buf.length - 4);
      assert.equal(buf[4], 9);
      var data = schema.RpbGetReq.decode(buf.slice(5));
      assert.equal(data.bucket.toString('utf8'), 'test bucket');
      assert.equal(data.key.toString('utf8'), 'test key');
      assert.equal(data.r, 3);
      assert.equal(data.pr, 1);
      assert.equal(data.basic_quorum, false);
      assert.deepEqual([].slice.call(data.if_modified.toBuffer()), [13, 19]);
      assert.equal(data.head, false);
      assert.equal(data.timeout, 12345);
      assert.equal(data.sloppy_quorum, false);
      assert.equal(data.n_val, 1);
      assert.equal(data.type.toString('utf8'), 'default');
      done();
    });
    this.subject.write({
      type: 'RpbGetReq',
      data: {
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
      }
    });
  });

  it('should encode RpbGetResp', function (done) {
    this.subject.on('data', function (buf) {
      assert.equal(buf.readUInt32BE(0), buf.length - 4);
      assert.equal(buf[4], 10);
      var data = schema.RpbGetResp.decode(buf.slice(5));
      assert.deepEqual([].slice.call(data.vclock.toBuffer()), [13, 19]);
      assert.equal(data.unchanged, false);
      assert.equal(data.content.length, 1);
      testContent(data.content[0]);
      done();
    });
    this.subject.write({
      type: 'RpbGetResp',
      data: {
        content: [testContent.data],
        vclock: new Buffer([13, 19]),
        unchanged: false
      }
    });
  });

  it('should encode RpbPutReq', function (done) {
    this.subject.on('data', function (buf) {
      assert.equal(buf.readUInt32BE(0), buf.length - 4);
      assert.equal(buf[4], 11);
      var data = schema.RpbPutReq.decode(buf.slice(5));
      assert.equal(data.bucket.toString('utf8'), 'test bucket');
      assert.equal(data.key.toString('utf8'), 'test key');
      assert.deepEqual([].slice.call(data.vclock.toBuffer()), [13, 19]);
      assert.equal(data.w, 3);
      assert.equal(data.dw, 2);
      assert.equal(data.return_body, true);
      assert.equal(data.pw, 1);
      assert.equal(data.if_not_modified, true);
      assert.equal(data.if_none_match, false);
      assert.equal(data.return_head, false);
      assert.equal(data.timeout, 77272);
      assert.equal(data.asis, false);
      assert.equal(data.sloppy_quorum, false);
      assert.equal(data.n_val, 3);
      assert.equal(data.type.toString('utf8'), 'test type');
      testContent(data.content);
      done();
    });
    this.subject.write({
      type: 'RpbPutReq',
      data: {
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
      }
    });
  });

  it('should encode RpbPutResp', function (done) {
    this.subject.on('data', function (buf) {
      assert.equal(buf.readUInt32BE(0), buf.length - 4);
      assert.equal(buf[4], 12);
      var data = schema.RpbPutResp.decode(buf.slice(5));
      assert.deepEqual([].slice.call(data.vclock.toBuffer()), [13, 19]);
      assert.equal(data.key.toString('utf8'), 'test key');
      assert.equal(data.content.length, 1);
      testContent(data.content[0]);
      done();
    });
    this.subject.write({
      type: 'RpbPutResp',
      data: {
        content: [testContent.data],
        vclock: new Buffer([13, 19]),
        key: 'test key'
      }
    });
  });

  it('should encode RpbDelReq', function (done) {
    this.subject.on('data', function (buf) {
      assert.equal(buf.readUInt32BE(0), buf.length - 4);
      assert.equal(buf[4], 13);
      var data = schema.RpbDelReq.decode(buf.slice(5));
      assert.equal(data.bucket.toString('utf8'), 'test bucket');
      assert.equal(data.key.toString('utf8'), 'test key');
      assert.equal(data.rw, 3);
      assert.deepEqual([].slice.call(data.vclock.toBuffer()), [13, 19]);
      assert.equal(data.r, 2);
      assert.equal(data.w, 1);
      assert.equal(data.pr, 7);
      assert.equal(data.pw, 8);
      assert.equal(data.dw, 9);
      assert.equal(data.timeout, 77272);
      assert.equal(data.sloppy_quorum, false);
      assert.equal(data.n_val, 3);
      assert.equal(data.type.toString('utf8'), 'test type');
      done();
    });
    this.subject.write({
      type: 'RpbDelReq',
      data: {
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
      }
    });
  });

  bodyless(14, 'RpbDelResp');

  it('should encode RpbListBucketsReq', function (done) {
    this.subject.on('data', function (buf) {
      assert.equal(buf.readUInt32BE(0), buf.length - 4);
      assert.equal(buf[4], 15);
      var data = schema.RpbListBucketsReq.decode(buf.slice(5));
      assert.equal(data.timeout, 77272);
      assert.equal(data.stream, false);
      assert.equal(data.type.toString('utf8'), 'test type');
      done();
    });
    this.subject.write({
      type: 'RpbListBucketsReq',
      data: {
        timeout: 77272,
        stream: false,
        type: 'test type'
      }
    });
  });

  it('should encode RpbListBucketsResp', function (done) {
    this.subject.on('data', function (buf) {
      assert.equal(buf.readUInt32BE(0), buf.length - 4);
      assert.equal(buf[4], 16);
      var data = schema.RpbListBucketsResp.decode(buf.slice(5));
      assert.equal(data.buckets[0].toString('utf8'), 'bucket1');
      assert.equal(data.buckets[1].toString('utf8'), 'bucket2');
      assert.equal(data.buckets[2].toString('utf8'), 'bucket3');
      assert.equal(data.done, true);
      done();
    });
    this.subject.write({
      type: 'RpbListBucketsResp',
      data: {
        buckets: [
          'bucket1',
          'bucket2',
          'bucket3'
        ],
        done: true
      }
    });
  });

  it('should encode RpbListKeysReq', function (done) {
    this.subject.on('data', function (buf) {
      assert.equal(buf.readUInt32BE(0), buf.length - 4);
      assert.equal(buf[4], 17);
      var data = schema.RpbListKeysReq.decode(buf.slice(5));
      assert.equal(data.bucket.toString('utf8'), 'test bucket');
      assert.equal(data.timeout, 77272);
      assert.equal(data.type.toString('utf8'), 'test type');
      done();
    });
    this.subject.write({
      type: 'RpbListKeysReq',
      data: {
        bucket: 'test bucket',
        timeout: 77272,
        type: 'test type'
      }
    });
  });

  it('should encode RpbListKeysResp', function (done) {
    this.subject.on('data', function (buf) {
      assert.equal(buf.readUInt32BE(0), buf.length - 4);
      assert.equal(buf[4], 18);
      var data = schema.RpbListKeysResp.decode(buf.slice(5));
      assert.equal(data.keys[0].toString('utf8'), 'key1');
      assert.equal(data.keys[1].toString('utf8'), 'key2');
      assert.equal(data.keys[2].toString('utf8'), 'key3');
      assert.equal(data.done, true);
      done();
    });
    this.subject.write({
      type: 'RpbListKeysResp',
      data: {
        keys: [
          'key1',
          'key2',
          'key3'
        ],
        done: true
      }
    });
  });

  it('should encode RpbGetBucketReq', function (done) {
    this.subject.on('data', function (buf) {
      assert.equal(buf.readUInt32BE(0), buf.length - 4);
      assert.equal(buf[4], 19);
      var data = schema.RpbGetBucketReq.decode(buf.slice(5));
      assert.equal(data.bucket.toString('utf8'), 'test bucket');
      assert.equal(data.type.toString('utf8'), 'test type');
      done();
    });
    this.subject.write({
      type: 'RpbGetBucketReq',
      data: {
        bucket: 'test bucket',
        type: 'test type'
      }
    });
  });

  it('should encode RpbGetBucketResp', function (done) {
    this.subject.on('data', function (buf) {
      assert.equal(buf.readUInt32BE(0), buf.length - 4);
      assert.equal(buf[4], 20);
      var data = schema.RpbGetBucketResp.decode(buf.slice(5));
      testBucketProps(data.props);
      done();
    });
    this.subject.write({
      type: 'RpbGetBucketResp',
      data: {
        props: testBucketProps.data
      }
    });
  });

  it('should encode RpbSetBucketReq', function (done) {
    this.subject.on('data', function (buf) {
      assert.equal(buf.readUInt32BE(0), buf.length - 4);
      assert.equal(buf[4], 21);
      var data = schema.RpbSetBucketReq.decode(buf.slice(5));
      testBucketProps(data.props);
      done();
    });
    this.subject.write({
      type: 'RpbSetBucketReq',
      data: {
        bucket: 'test bucket',
        props: testBucketProps.data,
        type: 'test type'
      }
    });
  });

  bodyless(22, 'RpbSetBucketResp');

  it('should encode RpbMapRedReq', function (done) {
    var request = {
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
    };
    var reqstr = JSON.stringify(request, function (key, value) {
      return typeof value == 'function' ? value.toString() : value;
    });
    this.subject.on('data', function (buf) {
      assert.equal(buf.readUInt32BE(0), buf.length - 4);
      assert.equal(buf[4], 23);
      var data = schema.RpbMapRedReq.decode(buf.slice(5));
      assert.deepEqual(data.request.toString('utf8'), reqstr);
      assert.equal(data.content_type.toString('utf8'), 'application/json');
      done();
    });
    this.subject.write({
      type: 'RpbMapRedReq',
      data: {
        request: request,
        content_type: 'application/json'
      }
    });
  });

  it('should encode RpbMapRedResp', function (done) {
    var response = JSON.stringify(
      [['foo', 1],['baz', 0],['bar', 4],['bam', 3]]
    );
    this.subject.on('data', function (buf) {
      assert.equal(buf.readUInt32BE(0), buf.length - 4);
      assert.equal(buf[4], 24);
      var data = schema.RpbMapRedResp.decode(buf.slice(5));
      assert.equal(data.phase, 1);
      assert.deepEqual(data.response.toString('utf8'), response);
      assert.equal(data.done, true);
      done();
    });
    this.subject.write({
      type: 'RpbMapRedResp',
      data: {
        phase: 1,
        response: response,
        done: true
      }
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
