"use strict";

const DbService = require("moleculer-db");

//process.env.MONGO_URI = "mongodb://localhost/conduit";

module.exports = function (collection) {
	if (process.env.MONGO_URI) {
		// Mongo adapter
		const MongoAdapter = require("moleculer-db-adapter-mongo", {
			keepAlive: 1,
			useNewUrlParser: true
		});
		return {
			mixins: [DbService],
			adapter: new MongoAdapter(process.env.MONGO_URI),
			collection
		};
	}
};