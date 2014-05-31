# Riak Stream

[![Build Status](https://travis-ci.org/mikepb/riakjs2-protobuf.svg)](https://travis-ci.org/mikepb/riakjs2-protobuf)

A Riak Protocol Buffer stream for Node.JS.

```js
var RiakSocket = require('riakjs2-protobuf');
var socket = new RiakSocket();

socket.write({
  type: 'RpbGetServerInfoReq'
});

socket.once('data', function (data) {
  console.log(data);
  // { type: 'RpbGetServerInfoResp',
  //   result: {
  //     node: 'riak@127.0.0.1',
  //     server_version: '2.0.0beta1' } }
});

```


## Install

```bash
npm install riakjs2-protobuf
```


## Writing to the socket

The socket accepts an object with two keys:

- `type` for the string representation of the
  [Riak message type][riak-pb].
- `data` for the Protocol Buffer data.


## Reading from the socket

The socket emits the standard stream events, so you can do
`socket.on('data', ondata)`. The callback will be passed a single
`data` argument with three possible keys:

- `type` for the string representation of the
  [Riak message type][riak-pb].
- `result` for the Protocol Buffer response.
- `error` for an error.


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
80,DtFetchReq,riak_dt
81,DtFetchResp,riak_dt
82,DtUpdateReq,riak_dt
83,DtUpdateResp,riak_dt
253,RpbAuthReq,riak
254,RpbAuthResp,riak
255,RpbStartTls,riak
```

## License

MIT


[riak-pb]: http://docs.basho.com/riak/latest/dev/references/protocol-buffers/
