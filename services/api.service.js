"use strict";

const ApiGateway = require("moleculer-web");
const { UnAuthorizedError } = ApiGateway.Errors;


module.exports = {
    name: "api",
	mixins: [ApiGateway],
    
	settings: {
		port: process.env.API_PORT || 3000,

        routes: [{
            aliases: {

                // create
                "POST /users/create": "users.create",

                // Login
                "POST /users/login": "users.login",

				// Current user
                "GET /user": "users.me",
                
                // Get user's cart
				"GET /user/cart": "users.cart",

                // List Products
                // "GET /products": "products.list",

                // Create Product
                "POST /products/create": "products.create",
                
                // Get Product
                "GET /products/:id": "products.get",

                // Add to cart
                "POST /products/:product/cart": "products.cart",

            },
            authorization: true
        }],
    },
    methods: {
		/**
		 * Authorize the request
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		authorize(ctx, route, req) {
			let token;
			if (req.headers.authorization) {
				let type = req.headers.authorization.split(" ")[0];
				if (type === "Token" || type === "Bearer")
					token = req.headers.authorization.split(" ")[1];
			}

			return this.Promise.resolve(token)
				.then(token => {
					if (token) {
						// Verify JWT token
						return ctx.call("users.resolveToken", { token })
							.then(user => {
								if (user) {
									this.logger.info("Authenticated via JWT: ", user.username);
									// Reduce user fields (it will be transferred to other nodes)
                                    ctx.meta.user = user._source;
                                    ctx.meta.user._id = user._id;
                                    
									ctx.meta.token = token;
								}
								return user;
							})
							.catch(() => {});
					}
				})
				.then(user => {
					if (req.$endpoint.action.auth == "required" && !user)
						return this.Promise.reject(new UnAuthorizedError());
				});
		},
    }
    };