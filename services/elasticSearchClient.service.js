"use strict";

require("dotenv").config();

const { MoleculerError } = require("moleculer").Errors;
const Common = require("../mixins/common.mixin");
const Elasticsearch = require("../mixins/elasticsearch.mixin");
const products = require("../lib/product.json");
const MESSAGE_CONSTANT = require("../lib/Constants");

module.exports = {
	name: "elasticSearchClient",
	mixins: [Common, Elasticsearch],
	actions: {
		registration: {
			handler(ctx) {
				return this.registration(ctx.params);
			}
		},
		login: {
			handler(ctx) {
				return this.login(ctx.params);
			}
		},
		fatch_user: {
			handler(ctx) {
				return this.fatch_user(ctx.params);
			}
		},
		products: {
			cache: {
				keys: ["products"],
				ttl: 60 * 60 * 1
			},
			handler() {
				return this.getProducts();
			}
		},
		fatch_product: {
			handler(ctx) {
				return this.fatch_product(ctx.params);
			}
		}
	},

	async started() {
		try {
			const elasticClient = this.getEsObject();

			//userseed
			await elasticClient.indices
				.exists({
					index: "users"
				})
				.then(async (res) => {
					if (!res) {
						await elasticClient.indices.create({
							index: "users",
							body: {
								mappings: {
									properties: {
										name: { type: "text" },
										email: { type: "keyword" },
										password: { type: "keyword" }
									}
								}
							}
						});
						await elasticClient
							.index({
								index: "users",
								type: "_doc",
								body: {
									name: "Divya Kanak",
									email: "divya.kanak@tatvasoft.com",
									password: this.hashPassword("123456789")
								}
							})
							.catch(() => {
								throw new MoleculerError(MESSAGE_CONSTANT.SOMETHING_WRONG, 500);
							});
					}
				});

			//productseed
			await elasticClient.indices
				.exists({
					index: "products"
				})
				.then(async res => {
					if (!res) {
						await elasticClient.indices.create({
							index: "products",
							body: {
								mappings: {
									properties: {
										name: { type: "text" },
										sku: { type: "keyword" },
										category: { type: "text" }
									}
								}
							}
						});
						await this.asyncForEach(products, async product => {
							await elasticClient
								.index({
									index: "products",
									type: "_doc",
									body: {
										name: product.name,
										sku: product.sku,
										category: product.category
									}
								})
								.catch(() => {
									throw new MoleculerError(MESSAGE_CONSTANT.SOMETHING_WRONG, 500);
								});
						});
					}
				});
		}
		catch (err) {
			throw new MoleculerError(MESSAGE_CONSTANT.SOMETHING_WRONG, 500);
		}
	}
};
