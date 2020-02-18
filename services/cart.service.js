"use strict";

require("dotenv").config();

const { MoleculerError } = require("moleculer").Errors;
const Common = require("../mixins/common.mixin");
const Joi = require("joi");
const MESSAGE_CONSTANT = require("../lib/Constants");
const Elasticsearch = require("../mixins/elasticsearch.mixin");
const Redis = require("../mixins/redis.mixin");

module.exports = {
	name: "cart",
	mixins: [Common, Elasticsearch, Redis],
	actions: {
		add_to_cart: {
			rest: {
				method: "POST",
				path: "/add_to_cart"
			},
			auth: "Bearer",
			params: {
				productId: Joi.string()
					.required()
					.error(() => {
						return MESSAGE_CONSTANT.PRODUCT_INVALID;
					}),
				quantity: Joi.number()
					.required()
					.min(1)
					.max(50)
					.error(() => {
						return MESSAGE_CONSTANT.QTN_INVALID;
					})
			},
			async handler(ctx) {
				const { productId, quantity } = ctx.params;
				return await this.product_exists({ id: productId })
					.then(async product => {
						if (!product) {
							throw new MoleculerError(MESSAGE_CONSTANT.PRODUCT_NOT_EXIST, 404);
						}
						return await this.addToCart({
							productId: productId,
							quantity: quantity,
							userId: ctx.meta.auth.userId
						})
							.then(() => {
								return Promise.resolve({
									message: MESSAGE_CONSTANT.PRODUCT_ADDED
								});
							});
					});
			}
		},

		details: {
			rest: {
				method: "GET",
				path: "/details"
			},
			auth: "Bearer",
			async handler(ctx) {
				return await this.cartDetails({
					userId: ctx.meta.auth.userId
				})
					.then(async cart => {
						if (Object.keys(cart).length === 0) {
							throw new MoleculerError(MESSAGE_CONSTANT.CART_NOT_FOUND, 404);
						}
						let cartKeyArr = Object.keys(cart);
						const cartDetails = [];
						await this.asyncForEach(cartKeyArr, async proId => {
							await this.fatch_product({ id: proId })
								.then(product => {
									if (!product) {
										throw new MoleculerError(MESSAGE_CONSTANT.PRODUCT_NOT_EXIST, 404);
									}
									cartDetails.push({
										id: product.id,
										name: product.name,
										sku: product.sku,
										category: product.category,
										quantity: cart[proId]
									});
								});
						});
						return Promise.resolve({
							cart: cartDetails
						});
					});
			}
		}
	}
};
