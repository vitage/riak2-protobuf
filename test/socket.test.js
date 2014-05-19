var assert = require('assert');

var ripepb = require('../lib/index');
var Socket = ripepb.Socket;
var MockSocket = require('./mock/socket');

describe('Protocol Buffer Socket', function () {

  before(function () {
    this.socket = new MockSocket({
      returns: [
        new Buffer('AAAAHQgKDnJpYWtAMTI3LjAuMC4xEgoyLjAuMGJldGEx', 'base64')
      ],
      asserts: [
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
    assert.strictEqual(Socket, ripepb);
  });

  it('should use pipeline', function (done) {
    this.subject.write({
      type: 'RpbGetServerInfoReq'
    });
    this.subject.once('data', function (data) {
      assert.deepEqual(data, {
        type: 'RpbGetServerInfoResp',
        result: {
          node: 'riak@127.0.0.1',
          server_version: '2.0.0beta1'
        }
      });
      done();
    }.bind(this));
  });

  it('should end', function () {
    this.subject.end();
  });

  it('should destroy', function () {
    this.subject.destroy();
    assert(this.subject.destroyed);
  });

});
