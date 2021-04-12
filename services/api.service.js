const ApiGateway = require("moleculer-web");
const { UnAuthorizedError } = ApiGateway.Errors;

module.exports = {
	name: "api",
	mixins: [ApiGateway],

	settings: {
		port: process.env.PORT || 3000,

		routes: [
			{
				path: "/api",
				mergeParams: true,
				authorization: true,
				autoAliases: true,

				// Parse body content
				bodyParsers: {
					json: true,
				},
			},
		],

		onError(req, res, err) {
			res.setHeader("Content-type", "application/json; charset=utf-8");
			res.writeHead(err.code || 500);
			this.logger.info(err);
			if (err.code == 422) {
				let o = {};
				err.data.forEach((e) => {
					let field = e.field.split(".").pop();
					o[field] = e.message;
				});

				res.end(JSON.stringify({ errors: o }, null, 2));
			} else {
				const errObj = err;
				res.end(JSON.stringify(errObj, null, 2));
			}
			this.logResponse(req, res, err ? err.ctx : null);
		},
	},

	methods: {
		/**
		 * Authorize the request
		 */
		async authorize(ctx, route, req) {
			let token;
			if (req.headers.authorization) {
				let type = req.headers.authorization.split(" ")[0];
				if (type === "Token" || type === "Bearer")
					token = req.headers.authorization.split(" ")[1];
			}

			let user;
			if (token) {
				// Verify JWT token
				try {
					user = await ctx.call("users.verifyToken", { token });
					if (user) {
						ctx.meta.user = _.pick(user, [
							"userid",
							"username",
							"email",
							"mobile",
							"createdAt",
						]);
						ctx.meta.token = token;
						ctx.meta.userID = user.userid;
					}
				} catch (err) {}
			}

			if (req.$action.auth == "required" && !user)
				throw new UnAuthorizedError();
		},
	},
};
