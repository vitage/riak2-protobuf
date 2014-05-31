
var fs = require("fs");

var path = __dirname + "/riak_pb_messages.csv";
var csv = fs.readFileSync(path).toString().trim();

var codes = exports.codes = {};
var types = exports.types = {};

csv.split(/[\r\n]+/g).forEach(function(line) {
  var data;
  data = line.split(",");
  types[data[0]] = data[1];
  return codes[data[1]] = +data[0];
});
