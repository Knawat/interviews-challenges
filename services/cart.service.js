"use strict";

require("dotenv").config();

const { MoleculerError } = require("moleculer").Errors;
const Common = require("../mixins/common.mixin");
const Joi = require("joi");
const MESSAGE_CONSTANT = require("../lib/Constants");

module.exports = {
	name: "cart",
	mixins: [Common],
	dependencies: ["elasticSearchClient", "redisClient"],
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
			handler(ctx) {
				const { productId, quantity } = ctx.params;
				return ctx
					.call("elasticSearchClient.product_exists", { id: productId })
					.then(product => {
						if (!product) {
							throw new MoleculerError(MESSAGE_CONSTANT.PRODUCT_NOT_EXIST, 404);
						}
						return ctx
							.call("redisClient.add_to_cart", {
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
				console.log(ctx.meta.auth.userId);
				return ctx
					.call("redisClient.cart_details", {
						userId: ctx.meta.auth.userId
					})
					.then(async cart => {
						if (Object.keys(cart).length === 0) {
							throw new MoleculerError(MESSAGE_CONSTANT.CART_NOT_FOUND, 404);
						}
						let cartKeyArr = Object.keys(cart);
						const cartDetails = [];
						await this.asyncForEach(cartKeyArr, async proId => {
							await ctx
								.call("elasticSearchClient.fatch_product", { id: proId })
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
