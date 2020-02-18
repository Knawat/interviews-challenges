"use strict";

require("dotenv").config();

const ApiGateway = require("moleculer-web");
const { MoleculerError } = require("moleculer").Errors;
const MESSAGE_CONSTANT = require("../lib/Constants");

module.exports = {
	name: "api",
	mixins: [ApiGateway],
	settings: {
		port: process.env.PORT || 3000,
		routes: [
			{
				path: "/api",

				whitelist: [
					"auth.*", "product.*", "cart.*"
				],
				authentication: true,
				aliases: {
					//registration
					"POST auth/registration": "auth.registration",

					//login
					"POST auth/login": "auth.login",

					//product
					"GET product/list": "product.list",

					//cart
					"POST cart/add_to_cart": "cart.add_to_cart"
				},

				bodyParsers: {
					json: {
						strict: false,
						limit: "1MB"
					},
					urlencoded: {
						extended: true,
						limit: "1MB"
					}
				},

				onError(req, res, err) {
					res.setHeader("Content-Type", "application/json; charset=utf-8");
					res.writeHead(err.code || 500);
					if ("ValidationError" == err.name) {
						res.write(JSON.stringify({ error: { message: err.data[0].message } }));
					} else {
						res.write(JSON.stringify({ error: { message: err.message } }));
					}
					res.end();
				},

				logging: true
			}
		],
	},

	methods: {
		async authenticate(ctx, route, req) {
			if (!req.$endpoint.action.auth) {
				return;
			}
			if (req.$endpoint.action.auth === "Bearer") {
				let auth = req.headers.authorization;
				if (auth) {
					let type = auth.split(" ")[0];
					if ("Bearer" !== type)
						throw new MoleculerError(MESSAGE_CONSTANT.AUTH_FAIL, 401);
					let token = auth.split(" ")[1];
					if (token) {
						return await ctx.call("auth.verifyToken", { token }).then(user => {
							ctx.meta.auth = {
								userId: user.user.id,
								name: user.user.name,
								email: user.user.email
							};
							return true;
						});
					} else {
						throw new MoleculerError(MESSAGE_CONSTANT.AUTH_FAIL, 401);
					}
				} else {
					throw new MoleculerError(MESSAGE_CONSTANT.AUTH_FAIL, 401);
				}
			} else {
				throw new MoleculerError(MESSAGE_CONSTANT.AUTH_FAIL, 401);
			}
		}
	}
};
