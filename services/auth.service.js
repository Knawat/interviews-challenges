"use strict";

require("dotenv").config();

const { MoleculerError } = require("moleculer").Errors;
const MESSAGE_CONSTANT = require("../lib/Constants");
const Common = require("../mixins/common.mixin");
const Joi = require("joi");

module.exports = {
	name: "auth",
	mixins: [Common],
	dependencies: ["elasticSearchClient"],
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
				return await ctx
					.call("elasticSearchClient.registration", {
						email: ctx.params.email,
						password: ctx.params.password,
						name: ctx.params.name
					})
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
				return await ctx
					.call("elasticSearchClient.login", {
						email: ctx.params.email,
						password: ctx.params.password
					})
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
				return await this.verifyToken(
					ctx.params.token
				).then(async function (decoded) {
					if (decoded.userID) {
						return await ctx
							.call("elasticSearchClient.fatch_user", {
								id: decoded.userID
							})
							.then(user => {
								return Promise.resolve(user);
							});
					} else {
						throw new MoleculerError(MESSAGE_CONSTANT.AUTH_FAIL, 401);
					}
				})
					.catch(err => {
						throw new MoleculerError(err.message || MESSAGE_CONSTANT.SOMETHING_WRONG, 401);
					});
			}
		}
	}
};
