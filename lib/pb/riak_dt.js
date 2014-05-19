module.exports = require("protobufjs").newBuilder().import({
    "package": null,
    "messages": [
        {
            "name": "MapField",
            "fields": [
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "name",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "required",
                    "type": "MapFieldType",
                    "name": "type",
                    "id": 2,
                    "options": {}
                }
            ],
            "enums": [
                {
                    "name": "MapFieldType",
                    "values": [
                        {
                            "name": "COUNTER",
                            "id": 1
                        },
                        {
                            "name": "SET",
                            "id": 2
                        },
                        {
                            "name": "REGISTER",
                            "id": 3
                        },
                        {
                            "name": "FLAG",
                            "id": 4
                        },
                        {
                            "name": "MAP",
                            "id": 5
                        }
                    ],
                    "options": {}
                }
            ],
            "messages": [],
            "options": {}
        },
        {
            "name": "MapEntry",
            "fields": [
                {
                    "rule": "required",
                    "type": "MapField",
                    "name": "field",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "sint64",
                    "name": "counter_value",
                    "id": 2,
                    "options": {}
                },
                {
                    "rule": "repeated",
                    "type": "bytes",
                    "name": "set_value",
                    "id": 3,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "register_value",
                    "id": 4,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "flag_value",
                    "id": 5,
                    "options": {}
                },
                {
                    "rule": "repeated",
                    "type": "MapEntry",
                    "name": "map_value",
                    "id": 6,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "DtFetchReq",
            "fields": [
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "bucket",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "key",
                    "id": 2,
                    "options": {}
                },
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "type",
                    "id": 3,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "r",
                    "id": 4,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "pr",
                    "id": 5,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "basic_quorum",
                    "id": 6,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "notfound_ok",
                    "id": 7,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "timeout",
                    "id": 8,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "sloppy_quorum",
                    "id": 9,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "n_val",
                    "id": 10,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "include_context",
                    "id": 11,
                    "options": {
                        "default": true
                    }
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "DtValue",
            "fields": [
                {
                    "rule": "optional",
                    "type": "sint64",
                    "name": "counter_value",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "repeated",
                    "type": "bytes",
                    "name": "set_value",
                    "id": 2,
                    "options": {}
                },
                {
                    "rule": "repeated",
                    "type": "MapEntry",
                    "name": "map_value",
                    "id": 3,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "DtFetchResp",
            "fields": [
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "context",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "required",
                    "type": "DataType",
                    "name": "type",
                    "id": 2,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "DtValue",
                    "name": "value",
                    "id": 3,
                    "options": {}
                }
            ],
            "enums": [
                {
                    "name": "DataType",
                    "values": [
                        {
                            "name": "COUNTER",
                            "id": 1
                        },
                        {
                            "name": "SET",
                            "id": 2
                        },
                        {
                            "name": "MAP",
                            "id": 3
                        }
                    ],
                    "options": {}
                }
            ],
            "messages": [],
            "options": {}
        },
        {
            "name": "CounterOp",
            "fields": [
                {
                    "rule": "optional",
                    "type": "sint64",
                    "name": "increment",
                    "id": 1,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "SetOp",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "bytes",
                    "name": "adds",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "repeated",
                    "type": "bytes",
                    "name": "removes",
                    "id": 2,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "MapUpdate",
            "fields": [
                {
                    "rule": "required",
                    "type": "MapField",
                    "name": "field",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "CounterOp",
                    "name": "counter_op",
                    "id": 2,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "SetOp",
                    "name": "set_op",
                    "id": 3,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "register_op",
                    "id": 4,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "FlagOp",
                    "name": "flag_op",
                    "id": 5,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "MapOp",
                    "name": "map_op",
                    "id": 6,
                    "options": {}
                }
            ],
            "enums": [
                {
                    "name": "FlagOp",
                    "values": [
                        {
                            "name": "ENABLE",
                            "id": 1
                        },
                        {
                            "name": "DISABLE",
                            "id": 2
                        }
                    ],
                    "options": {}
                }
            ],
            "messages": [],
            "options": {}
        },
        {
            "name": "MapOp",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "MapField",
                    "name": "adds",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "repeated",
                    "type": "MapField",
                    "name": "removes",
                    "id": 2,
                    "options": {}
                },
                {
                    "rule": "repeated",
                    "type": "MapUpdate",
                    "name": "updates",
                    "id": 3,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "DtOp",
            "fields": [
                {
                    "rule": "optional",
                    "type": "CounterOp",
                    "name": "counter_op",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "SetOp",
                    "name": "set_op",
                    "id": 2,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "MapOp",
                    "name": "map_op",
                    "id": 3,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "DtUpdateReq",
            "fields": [
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "bucket",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "key",
                    "id": 2,
                    "options": {}
                },
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "type",
                    "id": 3,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "context",
                    "id": 4,
                    "options": {}
                },
                {
                    "rule": "required",
                    "type": "DtOp",
                    "name": "op",
                    "id": 5,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "w",
                    "id": 6,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "dw",
                    "id": 7,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "pw",
                    "id": 8,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "return_body",
                    "id": 9,
                    "options": {
                        "default": false
                    }
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "timeout",
                    "id": 10,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "sloppy_quorum",
                    "id": 11,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "n_val",
                    "id": 12,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "include_context",
                    "id": 13,
                    "options": {
                        "default": true
                    }
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "DtUpdateResp",
            "fields": [
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "key",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "context",
                    "id": 2,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "sint64",
                    "name": "counter_value",
                    "id": 3,
                    "options": {}
                },
                {
                    "rule": "repeated",
                    "type": "bytes",
                    "name": "set_value",
                    "id": 4,
                    "options": {}
                },
                {
                    "rule": "repeated",
                    "type": "MapEntry",
                    "name": "map_value",
                    "id": 5,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        }
    ],
    "enums": [],
    "imports": [],
    "options": {
        "java_package": "com.basho.riak.protobuf",
        "java_outer_classname": "RiakDtPB"
    },
    "services": []
}).build();
