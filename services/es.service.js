"use strict";
let ESService = require("moleculer-elasticsearch");

module.exports = {
    name: "es",
    mixins: [ESService],
    settings: {
        elasticsearch: {
            host: process.env.ELASTICSEARCH_HOST || "http://elastic:changeme@localhost:9200"
        }
    }
}
