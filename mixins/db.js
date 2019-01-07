let ESService = require("moleculer-elasticsearch");
module.exports = function() {
  return {
    mixins: [ESService],
    settings: {
      elasticsearch: {
        host: "http://elastic:cart@hazem_db_1:9200"
      }
    }
  };
};
