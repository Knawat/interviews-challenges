"use strict";
const DbService = require("../mixins/db.mixin");
const cacheCleaner = require("../mixins/cache.cleaner.mixin");
const Feathers = require("moleculer-adapter-feathers");
const feathersElastic = require("feathers-elasticsearch");
const elasticsearch = require("elasticsearch");
const { v4 } = require("uuid");
const client = new elasticsearch.Client({
	host: process.env.ELASTIC_URL || "http://elasticsearch:9200",
	keepAlive: true,
});
let user_id;
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "cart",
	mixins: [Feathers, cacheCleaner(["cart"])],

	settings: {
		feathers: {
			adapter: feathersElastic,
			options: {
				name: "products",
				Model: client,
			},
		},
		fields: ["name", "description", "brand", "price", "userid"],
	},

	dependencies: [],

	actions: {
		/** Add Products to Cart
		 * @actions
		 * @param {Object} product
		 * @returns {Object}
		 */
		create: {
			auth: "required",
			rest: {
				method: "POST",
				path: "/",
			},
			params: {
				name: { type: "string", min: "6", optional: false },
				description: { type: "string", min: "10", optional: true },
				brand: { type: "string", min: "4", optional: false },
				price: { type: "number", optional: false },
			},
			async handler(ctx) {
				let products = ctx.params;
				products.userid = user_id;
				this.logger.info(products);
				const product = await client.indices.exists({
					index: "products",
				});
				if (!product) {
					await client.indices.create({ index: "products" });
				}
				await client.create({
					index: "products",
					id: v4(),
					type: "cart",
					body: products,
				});

				// const json = await this.transformDocuments(
				// 	ctx,
				// 	{},
				// 	doc.hits.hits
				// );
				return "Product added to the cart";
			},
		},

		/**
		 * View Cart Summary
		 * @actions
		 * @param {string} userid
		 * @returns {Object}
		 */

		summary: {
			auth: "required",
			cache: true,
			rest: {
				method: "GET",
				path: "/summary",
			},
			async handler(ctx) {
				const userid = user_id;
				if (userid) {
					this.logger.info(userid);
					const products = await client.search({
						index: "products",
						type: "cart",
						body: {
							query: {
								bool: {
									must: [
										{
											match: {
												userid: userid,
											},
										},
									],
								},
							},
						},
					});
					const json = await this.transformDocuments(
						ctx,
						{},
						products.hits.hits
					);
					return json;
				}
			},
		},
	},

	events: {
		"login.called"(user) {
			this.logger.info("--- event captured in products");
			this.logger.info(user);
			user_id = user.userid;
		},
	},

	methods: {},
};
