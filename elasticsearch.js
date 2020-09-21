let elasticsearch = require("elasticsearch");
module.exports = new elasticsearch.Client({
	host: process.env.ELASTICSEARCH || "http://elastic:changeme@localhost:9200",
	apiVersion: "7.4",
});