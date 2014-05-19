module.exports = require("protobufjs").newBuilder().import({
    "package": null,
    "messages": [
        {
            "name": "RpbYokozunaIndex",
            "fields": [
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "name",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "schema",
                    "id": 2,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbYokozunaIndexGetReq",
            "fields": [
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "name",
                    "id": 1,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbYokozunaIndexGetResp",
            "fields": [
                {
                    "rule": "repeated",
                    "type": "RpbYokozunaIndex",
                    "name": "index",
                    "id": 1,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbYokozunaIndexPutReq",
            "fields": [
                {
                    "rule": "required",
                    "type": "RpbYokozunaIndex",
                    "name": "index",
                    "id": 1,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbYokozunaIndexDeleteReq",
            "fields": [
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "name",
                    "id": 1,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbYokozunaSchema",
            "fields": [
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "name",
                    "id": 1,
                    "options": {}
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "content",
                    "id": 2,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbYokozunaSchemaPutReq",
            "fields": [
                {
                    "rule": "required",
                    "type": "RpbYokozunaSchema",
                    "name": "schema",
                    "id": 1,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbYokozunaSchemaGetReq",
            "fields": [
                {
                    "rule": "required",
                    "type": "bytes",
                    "name": "name",
                    "id": 1,
                    "options": {}
                }
            ],
            "enums": [],
            "messages": [],
            "options": {}
        },
        {
            "name": "RpbYokozunaSchemaGetResp",
            "fields": [
                {
                    "rule": "required",
                    "type": "RpbYokozunaSchema",
                    "name": "schema",
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
    "imports": [],
    "options": {
        "java_package": "com.basho.riak.protobuf",
        "java_outer_classname": "RiakYokozunaPB"
    },
    "services": []
}).build();
