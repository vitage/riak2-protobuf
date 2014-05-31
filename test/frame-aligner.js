var assert = require('assert');

var FrameAligner = require('../lib/index').FrameAligner;

describe('Protocol Buffer FrameAligner', function () {

  beforeEach(function () {
    this.subject = new FrameAligner();
  });

  it('should chunk one message', function (done) {
    this.subject.on('data', function (message) {
      assert.equal(message.code, 16);
      assert.equal(message.size, 1);
      assert.equal(message.data.length, 1);
      assert.equal(message.data[0], 13);
      done();
    });
    this.subject.write(new Buffer([0, 0, 0, 2, 16, 13, 17]))
  });

  it('should chunk two messages', function (done) {
    var expects = [
      { code: 16, size: 1, data: [13] },
      { code: 17, size: 1, data: [19, 1] }
    ];
    this.subject.on('data', function (message) {
      var expect = expects.shift();
      assert.equal(message.code, expect.code);
      assert.equal(message.size, expect.size);
      assert.equal(message.data.length, expect.size);
      assert.deepEqual([].slice.call(message.data), expect.data);
      done();
    });
    this.subject.write(new Buffer([
      0, 0, 0, 2, 16, 13,
      0, 0, 0, 4, 17, 19, 1,
      29
    ]))
  });

});
