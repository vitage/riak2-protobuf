var assert = require('assert');

var riakpb = require('../lib/index');
var Socket = riakpb.Socket;
var MockSocket = require('./mock/socket');

describe('Protocol Buffer Socket', function () {

  before(function () {
    this.socket = new MockSocket({
      returns: [
        new Buffer('AAAACRAKBHRlc3QQAQ==', 'base64'),
        new Buffer('AAAAHQgKDnJpYWtAMTI3LjAuMC4xEgoyLjAuMGJldGEx', 'base64')
      ],
      asserts: [
        function (chunk) {
          assert.equal(chunk.toString('base64'), 'AAAAAQ8=');
        },
        function (chunk) {
          assert.equal(chunk.toString('base64'), 'AAAAAQc=');
        }
      ]
    })
    this.subject = new Socket({
      socket: this.socket
    });
  });

  it('should === exports', function () {
    assert.strictEqual(Socket, riakpb);
  });

  it('should use pipeline', function (done) {
    this.subject.once('data', function (data) {
      assert.equal(data._type, 'RpbListBucketsResp');
      assert.deepEqual(data, {
        buckets: ['test'],
        done: true
      });
      done();
    }.bind(this));
    this.subject.write({}, 'RpbListBucketsReq');
  });

  it('should use pipeline with no body', function (done) {
    this.subject.once('data', function (data) {
      assert.equal(data._type, 'RpbGetServerInfoResp');
      assert.deepEqual(data, {
        node: 'riak@127.0.0.1',
        server_version: '2.0.0beta1'
      });
      done();
    }.bind(this));
    this.subject.write('RpbGetServerInfoReq');
  });

  it('should end', function () {
    this.subject.end();
  });

  it('should destroy', function () {
    this.subject.destroy();
    assert(this.subject.destroyed);
  });

});
