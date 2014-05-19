# Ripe

A Riak Protocol Buffer socket for Node.JS.

```js
var RipeSocket = require('ripe-protobuf');
var socket = new Ripe();

socket.write({
  code: 'RpbGetServerInfoReq'
});

socket.once('data', function (data) {
  console.log(data);
  // { code: 'RpbGetServerInfoResp',
  //   result: {
  //     node: 'riak@127.0.0.1',
  //     server_version: '2.0.0beta1' } }
});

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

## License

MIT


[riak-pb]: http://docs.basho.com/riak/latest/dev/references/protocol-buffers/
