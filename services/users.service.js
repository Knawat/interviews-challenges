"use strict";

const { MoleculerClientError } = require("moleculer").Errors;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const DbService = require("../mixins/db.mixin");

module.exports = {
	name: "users",
	mixins: [DbService("users")],
	settings: {
		/** Secret for JWT */
		JWT_SECRET: process.env.JWT_SECRET || "jwt-conduit-secret",

		/** Public fields */
		fields: ["_id", "phone", "email", "name", "password", "role"],

		/** Validator schema for entity */
		entityValidator: {
			name: { type: "string", min: 2, pattern: /^[a-zA-Z0-9]+$/ },
			password: { type: "string", min: 6 },
			email: { type: "email" },
			phone: { type: "string", min: 11, max: 11 },
			//1->admin
			//2->customer
			role: { type: "number", min: 1, max: 1 },
		}
	},
	actions: {
		/**
		* @api {post} /public/users/register user registeration API 
		* @apiName customers register
		* @apiGroup users
		*
		* @apiParam (user) {Object} user new user account object.
		* @apiParam (user) {String} user.name user name.
		* @apiParam (user) {String} user.password user password(min length 6).
		* @apiParam (user) {String} user.email user email
		* @apiParam (user) {String} user.phone user phone(length 11)
		* @apiParam (user) {String} user.role user role (super:1,moderator:2,customer:3)
		*
		* @apiSuccess (Success) {Boolean} success ensuring success
		* @apiSuccess (Success) {Object} user new user object created.
		* @apiError (Error) {Boolean}  success ensuring that operation failed.
		* @apiError (Error) {String}  [err] error object.
		* @apiError (Error) {String}  [msg] error helpful message.
		*
		* @apiError (Error_params) {String}  [paramsValidation] error helpful message.
		*/
		register: {
			params: {
				user: { type: "object" }
			},
			handler(ctx) {
				let entity = ctx.params.user;
				entity.role = 2;
				return this.validateEntity(entity)
					.then(() => {
						if (entity.phone)
							return this.adapter.findOne({ phone: entity.phone })
								.then((res) => {
									if (res)
										return Promise.reject(this.errorRes("phone already registered", null))
								})
					})
					.then(() => {
						if (entity.email)
							return this.adapter.findOne({ email: entity.email })
								.then((res) => {
									if (res) {
										return Promise.reject(this.errorRes("email already registered", null))
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
					})
					.catch(err => err);
			}
		},
		/**
		* @api {post} /admin/add-admin admin create admin/moderator account 
		* @apiName admin register
		* @apiGroup users
		*
		* @apiParam (user) {Object} user new user account object.
		* @apiParam (user) {String} user.name user name.
		* @apiParam (user) {String} user.password user password(min length 6).
		* @apiParam (user) {String} user.email user email
		* @apiParam (user) {String} user.phone user phone(length 11)
		* @apiParam (user) {String} user.role user role (admin:1,customer:2)
		* @apiParam (user) {String} user.createdBy admin(id) who created new account (admin:1)
		*
		* @apiSuccess (Success) {Boolean} success ensuring success
		* @apiSuccess (Success) {Object} user new user object created.
		*
		* @apiError (Error) {Boolean}  success ensuring that operation failed.
		* @apiError (Error) {String}  [err] error object.
		* @apiError (Error) {String}  [msg] error helpful message.
		*
		* @apiError (Error_params) {String}  [paramsValidation] error helpful message.
		*/
		addAdmin: {
			params: {
				user: { type: "object" }
			},
			handler(ctx) {
				let entity = ctx.params.user;
				entity.role = 1;
				return this.validateEntity(entity)
					.then(() => {
						if (entity.phone)
							return this.adapter.findOne({ phone: entity.phone })
								.then((res) => {
									if (res)
										return Promise.reject(this.errorRes("phone already registered", null))
								})
					})
					.then(() => {
						if (entity.email)
							return this.adapter.findOne({ email: entity.email })
								.then((res) => {
									if (res) {
										return Promise.reject(this.errorRes("email already registered", null))
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
					})
					.catch(err => err);
			}
		},
		/**
		* @api {post} /public/users/register user registeration API 
		* @apiName customers register
		* @apiGroup users
		*
		* @apiParam (user) {Object} user user account object.
		* @apiParam (user) {String} user.email user email.
		* @apiParam (user) {String} user.password user password.
		*
		* @apiSuccess (Success) {Boolean} success ensuring success.
		* @apiSuccess (Success) {Object} user user object created.
		*
		* @apiError (Error) {Boolean}  success ensuring that operation failed.
		* @apiError (Error) {String}  [err] error object.
		* @apiError (Error) {String}  [msg] error helpful message.
		*
		* @apiError (Error_params) {String}  [paramsValidation] error helpful message.
		*/
		login: {
			params: {
				user: {
					type: "object", props: {
						email: "email",
						password: "string"
					}
				}
			},
			async handler(ctx) {
				const { email, password } = ctx.params.user;
				return this.adapter.findOne({ email })
					.then(user => {
						if (!user) {
							return Promise.reject(this.errorRes("email not found", null))
						}
						return bcrypt.compare(password, user.password).then(res => {
							if (!res) {
								return Promise.reject(this.errorRes("wrong password", null))
							}
							return this.transformDocuments(ctx, {}, user);
						});
					})
					.then(user => this.transformToken(user, true, ctx.meta.token))
					.catch(err => err);
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
				return jwt.verify(ctx.params.token, this.settings.JWT_SECRET, (err, decoded) => {
					if (err)
						return Promise.reject({ success: false });
					else if (decoded.id)
						return Promise.resolve(this.getById(decoded.id));
				});
			}
		}
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
			return { success: true, user: user };
		},
		// structured API error res 
		errorRes(msg, errObj) {
			if (msg && errObj)
				return { success: false, msg: msg, err: errObj }
			else if (msg)
				return { success: false, msg: msg };
			else if (errObj)
				return { success: false, err: errObj };
		}
	}
};