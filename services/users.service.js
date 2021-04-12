"use strict";

const { MoleculerClientError } = require("moleculer").Errors;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "users",
	mixins: [Feathers, cacheCleaner(["users"])],
	settings: {
		feathers: {
			adapter: feathersElastic,
			options: {
				name: "users",
				Model: client,
			},
		},
		JWT_SECRET: process.env.JWT_SECRET || "zyclyx-secret",
		fields: ["id", "username", "email", "mobilenum"],
		entryValidators: {
			username: { type: "string", min: 4 },
			password: { type: "string", min: 6 },
			email: { type: "email" },
			mobile: { type: "number", min: 10 },
		},
	},
	actions: {
		/**
		 * @actions
		 * @param {Object} user - user entity
		 * @returns {Object} Created entity & token
		 */
		create: {
			rest: {
				method: "POST",
				path: "/",
			},
			params: {
				username: { type: "string", min: 2 },
				password: { type: "string", min: 6 },
				email: { type: "email" },
				mobilenum: { type: "number" },
			},
			async handler(ctx) {
				this.logger.info("in users service");
				let entity = ctx.params;
				//   await this.validateEntity(entity);
				let isIndex = await client.indices.exists({ index: "users" });
				this.logger.info(isIndex);
				if (!isIndex) {
					this.logger.info(" if condition ");
					await client.indices.create({ index: "users" });
				}
				if (isIndex && entity.username) {
					this.logger.info(entity.username);
					let query = {
						index: "users",
						type: "registration",
						body: {
							query: {
								bool: {
									must: [
										{
											match: {
												username: entity.username,
											},
										},
									],
								},
							},
						},
					};
					this.logger.info(query);
					const found = await client.search(query);
					this.logger.info(" username condition ");
					this.logger.info(found.hits.hits);
					if (found.hits.total.value != 0)
						throw new MoleculerClientError(
							"Username is exist",
							422,
							"",
							[{ field: "username", message: "is exist" }]
						);
				}
				if (isIndex && entity.email) {
					const found = await client.search({
						index: "users",
						type: "registration",
						body: {
							query: {
								bool: {
									must: [
										{
											match: {
												email: entity.email,
											},
										},
									],
								},
							},
						},
					});
					this.logger.info(" email condition ");
					this.logger.info(found);
					if (found.hits.total.value != 0)
						throw new MoleculerClientError(
							"email is exist",
							422,
							"",
							[{ field: "email", message: "is exist" }]
						);
				}

				entity.password = bcrypt.hashSync(entity.password, 10);
				entity.createdAt = new Date();
				entity.userid = v4();
				const doc = await client.create({
					index: "users",
					type: "registration",
					id: v4(),
					body: entity,
				});
				const user = await client.search({
					index: "users",
					body: {
						query: {
							bool: {
								must: [
									{
										match: {
											userid: entity.userid,
										},
									},
								],
							},
						},
					},
				});
				this.logger.info(user.hits.hits[0]);
				const json = await this.transformEntity(
					user.hits.hits[0],
					true,
					ctx.meta.token
				);
				//   await this.entityChanged("created",json,ctx);
				return json;
			},
		},
		/**
		 * @actions
		 * @param {Object} user
		 * @returns {Object}
		 */
		list: {
			auth: "required",
			cache: true,
			rest: {
				method: "GET",
				path: "/",
			},

			async handler(ctx) {
				this.logger.info("in user get service");
				const result = await this.adapter.find({});
				const user = await this.transformDocuments(ctx, {}, result);
				this.logger.info(user);
				return user;
			},
		},

		/**
		 * @actions
		 * @param {Object} user
		 * @returns {string}
		 */
		login: {
			rest: {
				method: "POST",
				path: "/login",
			},
			params: {
				email: { type: "email" },
				password: { type: "string", min: 6 },
			},
			async handler(ctx) {
				let email = ctx.params.email;
				if (email) {
					const user = await client.search({
						index: "users",
						type: "registration",
						body: {
							query: {
								bool: {
									must: [
										{
											match: {
												email: email,
											},
										},
									],
								},
							},
						},
					});
					if (user.hits.total.value == 0) {
						throw new MoleculerClientError(
							"Invalid email or password",
							500,
							"",
							[
								{
									field: "Invalid Email or Password",
									message: "is exist",
								},
							]
						);
					}
					this.logger.info(user.hits.hits);
					this.logger.info(user.password);
					let password = bcrypt.compare(
						ctx.params.password,
						user.hits.hits[0].password
					);
					this.logger.info(password);
					if (!password) {
						throw new MoleculerClientError(
							"Invalid email or password",
							500,
							"",
							[
								{
									field: "Invalid Email or Password",
									message: "is exist",
								},
							]
						);
					} else {
						const json = await this.transformEntity(
							user.hits.hits[0],
							true,
							ctx.meta.token
						);
						delete json["password"];
						return json;
					}
				}
			},
		},

		verifyToken: {
			rest: {
				method: "GET",
				path: "/me",
			},
			params: {
				token: { type: "string" },
			},
			async handler(ctx) {
				let token = ctx.params.token;
				if (token) {
					const user = jwt.verify(token, this.settings.JWT_SECRET);
					ctx.emit("login.called", ctx);
					return user;
				}
				return null;
			},
		},
	},

	methods: {
		/**
		 * @param {Object} user
		 * @param {Boolean} withToken
		 */
		transformEntity(user, withToken, token) {
			if (user) {
				if (withToken) {
					user.token = token || this.generateJWT(user);
				}
			}
			return user;
		},

		/**
		 * @param {Object} user
		 */
		generateJWT(user) {
			const today = new Date();
			const exp = new Date(today);
			exp.setDate(today.getDate() + 60);

			return jwt.sign(
				{
					id: user._id,
					username: user.username,
					exp: Math.floor(exp.getTime() / 1000),
				},
				this.settings.JWT_SECRET
			);
		},
	},
};
