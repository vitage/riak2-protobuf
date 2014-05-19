
var extend = require('lodash').extend;

extend(exports,
  require('./pb/riak'),
  require('./pb/riak_dt.js'),
  require('./pb/riak_kv.js'),
  require('./pb/riak_search.js'),
  require('./pb/riak_yokozuna.js')
);
