"use strict";
let ESService = require("moleculer-elasticsearch");

module.exports = {
  name: "es",
  mixins: [ESService],
  settings: {
    elasticsearch: {
      host: "http://elastic:cart@hazem_elasticsearch_1:9200"
    }
  }
};