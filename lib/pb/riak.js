module.exports = require("protobufjs").newBuilder().import({
    "package": null,
    "messages": [
        {
            "name": "RpbErrorResp",
            "fields": [
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "errmsg",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "required",
                    "type": "uint32",
                    "name": "errcode",
                    "id": 2,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbGetServerInfoResp",
            "fields": [
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "node",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "server_version",
                    "id": 2,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbPair",
            "fields": [
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "key",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "value",
                    "id": 2,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbGetBucketReq",
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
                    "name": "type",
                    "id": 2,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbGetBucketResp",
            "fields": [
                {
                    "rule": "required",
                    "type": "RpbBucketProps",
                    "name": "props",
                    "id": 1,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbSetBucketReq",
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
                    "type": "RpbBucketProps",
                    "name": "props",
                    "id": 2,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "type",
                    "id": 3,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbResetBucketReq",
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
                    "name": "type",
                    "id": 2,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbGetBucketTypeReq",
            "fields": [
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "type",
                    "id": 1,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbSetBucketTypeReq",
            "fields": [
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "type",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "required",
                    "type": "RpbBucketProps",
                    "name": "props",
                    "id": 2,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbModFun",
            "fields": [
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "module",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "function",
                    "id": 2,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbCommitHook",
            "fields": [
                {
                    "rule": "optional",
                    "type": "RpbModFun",
                    "name": "modfun",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "name",
                    "id": 2,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbBucketProps",
            "fields": [
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "n_val",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "allow_mult",
                    "id": 2,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "last_write_wins",
                    "id": 3,
                    "options": {}
                },
                {
                    "rule": "repeated",
                    "type": "RpbCommitHook",
                    "name": "precommit",
                    "id": 4,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "has_precommit",
                    "id": 5,
                    "options": {
                        "default": false
                    }
                },
                {
                    "rule": "repeated",
                    "type": "RpbCommitHook",
                    "name": "postcommit",
                    "id": 6,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "has_postcommit",
                    "id": 7,
                    "options": {
                        "default": false
                    }
                },
                {
                    "rule": "optional",
                    "type": "RpbModFun",
                    "name": "chash_keyfun",
                    "id": 8,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "RpbModFun",
                    "name": "linkfun",
                    "id": 9,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "old_vclock",
                    "id": 10,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "young_vclock",
                    "id": 11,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "big_vclock",
                    "id": 12,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "small_vclock",
                    "id": 13,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "pr",
                    "id": 14,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "r",
                    "id": 15,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "w",
                    "id": 16,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "pw",
                    "id": 17,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "dw",
                    "id": 18,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "rw",
                    "id": 19,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "basic_quorum",
                    "id": 20,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "notfound_ok",
                    "id": 21,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "backend",
                    "id": 22,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "search",
                    "id": 23,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "RpbReplMode",
                    "name": "repl",
                    "id": 24,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "search_index",
                    "id": 25,
                    "options": {}
                }
            ],
            "enums": [
                {
                    "name": "RpbReplMode",
                    "values": [
                        {
                            "name": "FALSE",
                            "id": 0
                        },
                        {
                            "name": "REALTIME",
                            "id": 1
                        },
                        {
                            "name": "FULLSYNC",
                            "id": 2
                        },
                        {
                            "name": "TRUE",
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
            "name": "RpbAuthReq",
            "fields": [
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "user",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "password",
                    "id": 2,
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
        "java_outer_classname": "RiakPB"
    },
    "services": []
}).build();
