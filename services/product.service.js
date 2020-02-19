"use strict";

require("dotenv").config();

const Common = require("../mixins/common.mixin");
const Elasticsearch = require("../mixins/elasticsearch.mixin");
const { MoleculerError } = require("moleculer").Errors;
const products = require("../lib/product.json");
const MESSAGE_CONSTANT = require("../lib/Constants");

module.exports = {
	name: "product",
	mixins: [Common, Elasticsearch],
	actions: {
		list: {
			rest: {
				method: "GET",
				path: "/list"
			},
			cache: {
				keys: ["products"],
				ttl: 60 * 60 * 1
			},
			auth: "Bearer",
			handler: async function handler() {
				return await this.getProducts().then(products => {
					return Promise.resolve(products);
				});
			}
		},

		fatch_product: {
			rest: {
				method: "GET",
				path: "/products/:id"
			},
			handler: async function handler(ctx) {
				return await this.fatch_product({ id: ctx.params.id })
					.then(product => {
						if (!product) {
							throw new MoleculerError(MESSAGE_CONSTANT.PRODUCT_NOT_EXIST, 404);
						}
						console.log(product);
						return Promise.resolve({
							product: product
						});
					});
			}
		},

		seeder: {
			rest: {
				method: "GET",
				path: "/seeder"
			},
			handler: async function handler() {
				try {
					const elasticClient = this.getEsObject();

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
											id: product.id,
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
		}
	}
};
