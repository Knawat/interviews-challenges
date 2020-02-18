"use strict";

require("dotenv").config();

const Common = require("../mixins/common.mixin");

module.exports = {
	name: "product",
	mixins: [Common],
	dependencies: ["elasticSearchClient"],
	actions: {
		list: {
			rest: {
				method: "GET",
				path: "/list"
			},
			auth: "Bearer",
			handler: function handler(ctx) {
				return ctx.call("elasticSearchClient.products").then(products => {
					return Promise.resolve(products);
				});
			}
		}
	}
};
