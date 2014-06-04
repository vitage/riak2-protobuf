# Riak Protocol Buffer Stream

[![Build Status](https://travis-ci.org/mikepb/riak2-protobuf.svg)](https://travis-ci.org/mikepb/riak2-protobuf)

A Riak Protocol Buffer stream for Node.JS.

```js
var RiakSocket = require('riak2-protobuf');
var socket = new RiakSocket();

socket.write('RpbGetServerInfoReq');

socket.once('data', function (data) {
  console.log(data);
  // { node: 'riak@127.0.0.1',
  //   server_version: '2.0.0beta1' }
});

```


## Install

```bash
npm install riakjs2-protobuf
```


## Writing to the socket

The socket accepts a data object and a message type:

```js
// send ping request
socket.write('RpbPingReq');

// send get request
socket.write({
  bucket: 'mybucket',
  key: 'mykey'
}, 'RpbGetReq');
```


## Reading from the socket

The socket emits response data:

```js
// process response
socket.once('data', function (data) {
  console.log(data._code, data._type);
  console.log(data);
});
```


## Implementation notes

These message types have not yet been tested and the socket will
return data from Riak as-is:

```csv
27,RpbSearchQueryReq,riak_search
28,RpbSearchQueryResp,riak_search
29,RpbResetBucketReq,riak
30,RpbResetBucketResp,riak
31,RpbGetBucketTypeReq,riak
32,RpbSetBucketTypeReq,riak
40,RpbCSBucketReq,riak_kv
41,RpbCSBucketResp,riak_kv
50,RpbCounterUpdateReq,riak_kv
51,RpbCounterUpdateResp,riak_kv
52,RpbCounterGetReq,riak_kv
53,RpbCounterGetResp,riak_kv
54,RpbYokozunaIndexGetReq,riak_yokozuna
55,RpbYokozunaIndexGetResp,riak_yokozuna
56,RpbYokozunaIndexPutReq,riak_yokozuna
57,RpbYokozunaIndexDeleteReq,riak_yokozuna
58,RpbYokozunaSchemaGetReq,riak_yokozuna
59,RpbYokozunaSchemaGetResp,riak_yokozuna
60,RpbYokozunaSchemaPutReq,riak_yokozuna
82,DtUpdateReq,riak_dt
83,DtUpdateResp,riak_dt
253,RpbAuthReq,riak
254,RpbAuthResp,riak
255,RpbStartTls,riak
```

## License

MIT


[riak-pb]: http://docs.basho.com/riak/latest/dev/references/protocol-buffers/
