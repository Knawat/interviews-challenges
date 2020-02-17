"use strict";

const ApiGateway = require("moleculer-web");
require('dotenv').config()
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('http').IncomingMessage} IncomingRequest Incoming HTTP Request
 * @typedef {import('http').ServerResponse} ServerResponse HTTP Server Response
 */

module.exports = {
	name: "api",
	mixins: [ApiGateway],

	// More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
	settings: {
		// Exposed port
		port: process.env.PORT || 3000,

		// Exposed IP
		ip: "0.0.0.0",

		// Global Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
		use: [],

		routes: [
			{
				path: "/api",

				whitelist: [
					"auth.*"
				],

				// Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
				authentication: true,

				// Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
				authorization: true,

				authAliases: true,
				aliases: {
					//registration
					"POST auth/registration": "auth.registration",

					//login
					"POST auth/login": "auth.login",
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

				// Enable/disable logging
				logging: true
			}
		],
	},

	methods: {

		/**
		 * Authenticate the request. It check the `Authorization` token value in the request header.
		 * Check the token value & resolve the user by the token.
		 * The resolved user will be available in `ctx.meta.user`
		 *
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		async authenticate(ctx, route, req) {
			// Read the token from header
			const auth = req.headers["authorization"];
			if (auth && auth.startsWith("Bearer")) {
				const token = auth.slice(7);
				if (token == "123456") {
					return { id: 1, name: "John Doe" };
				} else {
					throw new ApiGateway.Errors.UnAuthorizedError(ApiGateway.Errors.ERR_INVALID_TOKEN);
				}
			} else {
				return;
			}
		},

		/**
		 * Authorize the request. Check that the authenticated user has right to access the resource.
		 *
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		async authorize(ctx, route, req) {
			const user = ctx.meta.user;
			if (req.$action.auth == "required" && !user) {
				throw new ApiGateway.Errors.UnAuthorizedError("NO_RIGHTS");
			}
		}

	}
};
