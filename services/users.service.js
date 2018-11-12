"use strict";

const { MoleculerClientError } = require("moleculer").Errors;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const DbService = require("moleculer-db");
const MongoDBAdapter = require("moleculer-db-adapter-mongo");

module.exports = {
	name: "users",
	mixins: [DbService],
	adapter: new MongoDBAdapter("mongodb://localhost:27017/knawat", {
		keepAlive: 1,
		useNewUrlParser: true
	}),
	collection: "users",
	settings: {
		/** Secret for JWT */
		JWT_SECRET: process.env.JWT_SECRET || "jwt-conduit-secret",

		/** Public fields */
		fields: ["_id", "phone", "email", "name", "password"],

		/** Validator schema for entity */
		entityValidator: {
			name: { type: "string", min: 2, pattern: /^[a-zA-Z0-9]+$/ },
			password: { type: "string", min: 6 },
			email: { type: "email" },
			phone: { type: "string", min: 11, max: 11 },
		}
	},
	actions: {
		register: {
			params: {
				user: { type: "object" }
			},
			handler(ctx) {
				let entity = ctx.params.user;
				return this.validateEntity(entity)
					.then(() => {
						if (entity.phone)
							return this.adapter.findOne({ phone: entity.phone })
								.then((res) => {
									if (res) {
										return Promise.reject({ success: false, msg: 'phone already registered ' })
									}
								})
					})
					.then(() => {
						if (entity.email)
							return this.adapter.findOne({ email: entity.email })
								.then((res) => {
									if (res) {
										return Promise.reject({ success: false, msg: 'email already registered ' })
									}
								})
					})
					.then(() => {
						entity.password = bcrypt.hashSync(entity.password, 10);
						entity.createdAt = new Date();
						return this.adapter.insert(entity)
							.then(doc => this.transformDocuments(ctx, {}, doc))
							.then(user => this.transformToken(user, false, ctx.meta.token))
							.then(json => this.entityChanged("created", json, ctx).then(() => json));
					});
			}
		},
		login: {
			params: {
				user: {
					type: "object"
				}
			},
			handler(ctx) {
				if (ctx.params.user.email && ctx.params.user.password) {
					const { email, password } = ctx.params.user;
					return this.Promise.resolve()
						.then(() => this.adapter.findOne({ email }))
						.then(user => {
							if (!user)
								return this.Promise.reject(new MoleculerClientError("Email or password is invalid!", 422, "", [{ field: "email", message: "is not found" }]));

							return bcrypt.compare(password, user.password).then(res => {
								if (!res)
									return Promise.reject(new MoleculerClientError("Wrong password!", 422, "", [{ field: "email", message: "is not found" }]));

								return this.transformDocuments(ctx, {}, user);
							});
						})
						.then(user => this.transformToken(user, true, ctx.meta.token));
				}
				else {
					if (!ctx.params.user.email)
						return Promise.reject({ success: false, msg: 'email address not provided' })
					return Promise.reject({ success: false, msg: 'password not provided' })

				}

			}
		},
		resolveToken: {
			cache: {
				keys: ["token"],
				ttl: 60 * 60 // 1 hour
			},
			params: {
				token: "string"
			},
			handler(ctx) {
				return new this.Promise((resolve, reject) => {
					jwt.verify(ctx.params.token, this.settings.JWT_SECRET, (err, decoded) => {
						if (err)
							return reject(err);

						resolve(decoded);
					});
				})
					.then(decoded => {
						if (decoded.id)
							return this.getById(decoded.id);
					});
			}
		},

	},
	methods: {
		generateJWT(user) {
			const today = new Date();
			const exp = new Date(today);
			exp.setDate(today.getDate() + 60);

			return jwt.sign({
				id: user._id,
				exp: Math.floor(exp.getTime() / 1000)
			}, this.settings.JWT_SECRET);
		},
		transformToken(user, withToken, token) {
			if (user) {
				if (withToken) user.token = "Bearer " + token;
				user.token = "Bearer " + this.generateJWT(user);;
			}
			return { user };
		}
	}
};