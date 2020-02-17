"use strict";

require('dotenv').config()

const ApiGateway = require("moleculer-web");

module.exports = {
	name: "api",
	mixins: [ApiGateway],
	settings: {
		port: process.env.PORT || 3000,
		routes: [
			{
				path: "/api",

				whitelist: [
					"auth.*"
				],
				authentication: true,
				authorization: true,
				aliases: {
					//registration
					"POST auth/registration": "auth.registration",

					//login
					"POST auth/login": "auth.login"
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
						res.end();
					} else {
						res.write(JSON.stringify({ error: err.message }));
						res.end();
					}
				},

				logging: true
			}
		],
	},

	methods: {
		async authenticate(ctx, route, req) {
			let auth = req.headers.authorization;
			if (auth) {
				let type = auth.split(" ")[0];
				if ("Bearer" !== type)
					return Promise.reject({
						message: MESSAGE_CONSTANT.AUTH_FAIL
					});
				let token = auth.split(" ")[1];
				if (token) {
					return await ctx.call("auth.verifyToken", { token }).then(user => {
						ctx.meta.auth = {
							userId: user.id,
							name: user.name,
							email: user.email
						};
						return true;
					});
				} else {
					return Promise.reject({
						message: MESSAGE_CONSTANT.AUTH_FAIL
					});
				}
			} else {
				return;
			}
		},

		async authorize(ctx, route, req) {
			const user = ctx.meta.user;
			if (req.$action.auth == "required" && !user) {
				return Promise.reject({
					message: MESSAGE_CONSTANT.AUTH_FAIL
				});
			}
		}

	}
};
