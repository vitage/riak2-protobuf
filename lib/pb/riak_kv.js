module.exports = require("protobufjs").newBuilder().import({
    "package": null,
    "messages": [
        {
            "name": "RpbGetClientIdResp",
            "fields": [
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "client_id",
                    "id": 1,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbSetClientIdReq",
            "fields": [
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "client_id",
                    "id": 1,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbGetReq",
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
                    "rule": "optional",
                    "type": "uint32",
                    "name": "r",
                    "id": 3,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "pr",
                    "id": 4,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "basic_quorum",
                    "id": 5,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "notfound_ok",
                    "id": 6,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "if_modified",
                    "id": 7,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "head",
                    "id": 8,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "deletedvclock",
                    "id": 9,
                    "options": {}
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
                    "type": "bytes",
                    "name": "type",
                    "id": 13,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbGetResp",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "RpbContent",
                    "name": "content",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "vclock",
                    "id": 2,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "unchanged",
                    "id": 3,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbPutReq",
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
                    "rule": "optional",
                    "type": "bytes",
                    "name": "vclock",
                    "id": 3,
                    "options": {}
                },
                {
                    "rule": "required",
                    "type": "RpbContent",
                    "name": "content",
                    "id": 4,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "w",
                    "id": 5,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "dw",
                    "id": 6,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "return_body",
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
                    "name": "if_not_modified",
                    "id": 9,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "if_none_match",
                    "id": 10,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "return_head",
                    "id": 11,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "timeout",
                    "id": 12,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "asis",
                    "id": 13,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "sloppy_quorum",
                    "id": 14,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "n_val",
                    "id": 15,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "type",
                    "id": 16,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbPutResp",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "RpbContent",
                    "name": "content",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "vclock",
                    "id": 2,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "key",
                    "id": 3,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbDelReq",
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
                    "rule": "optional",
                    "type": "uint32",
                    "name": "rw",
                    "id": 3,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "vclock",
                    "id": 4,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "r",
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
                    "name": "pr",
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
                    "type": "uint32",
                    "name": "dw",
                    "id": 9,
                    "options": {}
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
                    "type": "bytes",
                    "name": "type",
                    "id": 13,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbListBucketsReq",
            "fields": [
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "timeout",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "stream",
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
            "name": "RpbListBucketsResp",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "bytes",
                    "name": "buckets",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "done",
                    "id": 2,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbListKeysReq",
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
                    "type": "uint32",
                    "name": "timeout",
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
            "name": "RpbListKeysResp",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "bytes",
                    "name": "keys",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "done",
                    "id": 2,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbMapRedReq",
            "fields": [
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "request",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "content_type",
                    "id": 2,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbMapRedResp",
            "fields": [
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "phase",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "response",
                    "id": 2,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "done",
                    "id": 3,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbIndexReq",
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
                    "name": "index",
                    "id": 2,
                    "options": {}
                },
                {
                    "rule": "required",
                    "type": "IndexQueryType",
                    "name": "qtype",
                    "id": 3,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "key",
                    "id": 4,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "range_min",
                    "id": 5,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "range_max",
                    "id": 6,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "return_terms",
                    "id": 7,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "stream",
                    "id": 8,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "max_results",
                    "id": 9,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "continuation",
                    "id": 10,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "timeout",
                    "id": 11,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "type",
                    "id": 12,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "term_regex",
                    "id": 13,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "pagination_sort",
                    "id": 14,
                    "options": {}
                }
            ],
            "enums": [
                {
                    "name": "IndexQueryType",
                    "values": [
                        {
                            "name": "eq",
                            "id": 0
                        },
                        {
                            "name": "range",
                            "id": 1
                        }
                    ],
                    "options": {}
                }
            ],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbIndexResp",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "bytes",
                    "name": "keys",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "repeated",
                    "type": "RpbPair",
                    "name": "results",
                    "id": 2,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "continuation",
                    "id": 3,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "done",
                    "id": 4,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbCSBucketReq",
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
                    "name": "start_key",
                    "id": 2,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "end_key",
                    "id": 3,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "start_incl",
                    "id": 4,
                    "options": {
                        "default": true
                    }
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "end_incl",
                    "id": 5,
                    "options": {
                        "default": false
                    }
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "continuation",
                    "id": 6,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "max_results",
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
                    "type": "bytes",
                    "name": "type",
                    "id": 9,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbCSBucketResp",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "RpbIndexObject",
                    "name": "objects",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "continuation",
                    "id": 2,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "done",
                    "id": 3,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbIndexObject",
            "fields": [
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "key",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "required",
                    "type": "RpbGetResp",
                    "name": "object",
                    "id": 2,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbContent",
            "fields": [
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "value",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "content_type",
                    "id": 2,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "charset",
                    "id": 3,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "content_encoding",
                    "id": 4,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "vtag",
                    "id": 5,
                    "options": {}
                },
                {
                    "rule": "repeated",
                    "type": "RpbLink",
                    "name": "links",
                    "id": 6,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "last_mod",
                    "id": 7,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "last_mod_usecs",
                    "id": 8,
                    "options": {}
                },
                {
                    "rule": "repeated",
                    "type": "RpbPair",
                    "name": "usermeta",
                    "id": 9,
                    "options": {}
                },
                {
                    "rule": "repeated",
                    "type": "RpbPair",
                    "name": "indexes",
                    "id": 10,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "deleted",
                    "id": 11,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbLink",
            "fields": [
                {
                    "rule": "optional",
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
                    "rule": "optional",
                    "type": "bytes",
                    "name": "tag",
                    "id": 3,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbCounterUpdateReq",
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
                    "type": "sint64",
                    "name": "amount",
                    "id": 3,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "w",
                    "id": 4,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "dw",
                    "id": 5,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "pw",
                    "id": 6,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "returnvalue",
                    "id": 7,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbCounterUpdateResp",
            "fields": [
                {
                    "rule": "optional",
                    "type": "sint64",
                    "name": "value",
                    "id": 1,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbCounterGetReq",
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
                    "rule": "optional",
                    "type": "uint32",
                    "name": "r",
                    "id": 3,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "uint32",
                    "name": "pr",
                    "id": 4,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "basic_quorum",
                    "id": 5,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bool",
                    "name": "notfound_ok",
                    "id": 6,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbCounterGetResp",
            "fields": [
                {
                    "rule": "optional",
                    "type": "sint64",
                    "name": "value",
                    "id": 1,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        }
    ],
    "enums": [],
    "imports": [
        {
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
        }
    ],
    "options": {
        "java_package": "com.basho.riak.protobuf",
        "java_outer_classname": "RiakKvPB"
    },
    "services": []
}).build();
