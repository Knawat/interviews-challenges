#!/bin/bash

for i in {30..0}; do
    if curl hazem_elasticsearch_1:9200; then
        curl -XPUT hazem_elasticsearch_1:9200/users -d '
            {
    "settings" : {
        "number_of_shards" : 1
    },
    "mappings" : {
        "_doc" : {
            "properties" : {
                "name" : { "type" : "text" },
                "email" : { "type" : "text", "analyzer":"keyword" },
                "password" : { "type" : "text" }
            }
        }
    }
}';
            break;
    fi
    sleep 2
done