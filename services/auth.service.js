"use strict";

require("dotenv").config();

const { MoleculerError } = require("moleculer").Errors;
const MESSAGE_CONSTANT = require("../lib/Constants");
const Common = require("../mixins/common.mixin");
const Joi = require("joi");
const Elasticsearch = require("../mixins/elasticsearch.mixin");

module.exports = {
	name: "auth",
	mixins: [Common, Elasticsearch],
	actions: {
		/**
         * Registration action.
         *
         * Required params:
         * 	- 'name'
         *  - 'email'
         *  - 'password'
         *
         * @param {any} ctx
         * @returns
         */
		registration: {
			rest: {
				method: "POST",
				path: "/registration"
			},
			params: Joi.object({
				name: Joi.string()
					.required()
					.min(2)
					.max(30)
					.error(() => {
						return MESSAGE_CONSTANT.NAME;
					}),
				email: Joi.string()
					.required()
					.email({ minDomainAtoms: 2 })
					.error(() => {
						return MESSAGE_CONSTANT.EMAIL;
					}),
				password: Joi.string()
					.required()
					.error(() => {
						return MESSAGE_CONSTANT.PASSWORD;
					})
			}),
			handler: async function handler(ctx) {
				return await this.registration(ctx.params)
					.then(user => {
						return Promise.resolve({
							message: MESSAGE_CONSTANT.USER_ADDED,
							id: user.id
						});
					});
			}
		},

		/**
         * Login action.
         *
         * Required params:
         * 	- 'email'
         *  - 'password'
         *
         * @param {any} ctx
         * @returns
         */
		login: {
			rest: {
				method: "POST",
				path: "/login"
			},
			params: Joi.object({
				email: Joi.string()
					.email({ minDomainAtoms: 2 })
					.required()
					.error(() => {
						return MESSAGE_CONSTANT.EMAIL;
					}),
				password: Joi.string()
					.required()
					.error(() => {
						return MESSAGE_CONSTANT.PASSWORD;
					})
			}),
			handler: async function handler(ctx) {
				return await this.login(ctx.params)
					.then(user => {
						return Promise.resolve({
							message: MESSAGE_CONSTANT.USER_LOGIN,
							user: user
						});
					});
			}
		},

		/**
         * verifyToken action.
         *
         * Required params:
         * 	- 'token'
         *
         * @param {any} ctx
         * @returns
         */
		verifyToken: {
			cache: {
				keys: ["token"],
				ttl: 60 * 60 // 1 hour
			},
			params: Joi.object({
				token: Joi.string()
					.required()
					.error(() => {
						return MESSAGE_CONSTANT.TOKEN;
					})
			}),
			handler: async function handler(ctx) {
				let userID = await this.verifyToken(
					ctx.params.token
				).then(async function (decoded) {
					if (decoded.userID) {
						return decoded.userID;
					} else {
						throw new MoleculerError(MESSAGE_CONSTANT.AUTH_FAIL, 401);
					}
				})
					.catch(err => {
						throw new MoleculerError(err.message || MESSAGE_CONSTANT.SOMETHING_WRONG, 401);
					});
				if (userID) {
					return await this.fatch_user({ id: userID })
						.then(user => {
							console.log(user);
							return Promise.resolve(user);
						});
				} else {
					throw new MoleculerError(MESSAGE_CONSTANT.AUTH_FAIL, 401);
				}
			}
		},

		/**
         * seeder action.
         *
         *
         * @param {any} ctx
         * @returns
         */
		seeder: {
			rest: {
				method: "GET",
				path: "/seeder"
			},
			handler: async function handler(ctx) {
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
								}).then(async (res) => {
									await elasticClient
										.index({
											index: res.index,
											type: "_doc",
											id: 1,
											body: {
												name: "Divya Kanak",
												email: "divya.kanak@tatvasoft.com",
												password: this.hashPassword("123456789")
											}
										})
										.catch(() => {
											throw new MoleculerError(MESSAGE_CONSTANT.SOMETHING_WRONG, 500);
										});
								}).catch(() => {
									throw new MoleculerError(MESSAGE_CONSTANT.SOMETHING_WRONG, 500);
								});
							}
						}).catch(() => {
							throw new MoleculerError(MESSAGE_CONSTANT.SOMETHING_WRONG, 500);
						});

					return await ctx
						.call("product.seeder")
						.then(() => {
							return { message: "Seeder running successful." }
						});
				}
				catch (err) {
					throw new MoleculerError(MESSAGE_CONSTANT.SOMETHING_WRONG, 500);
				}
			}
		}
	}
};
