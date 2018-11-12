"use strict";
let ESService = require("moleculer-elasticsearch");

module.exports = {
    name: "es",
    mixins: [ESService],
    settings: {
        elasticsearch: {
            host: "http://elastic:changeme@localhost:9200"
        }
    }
}
