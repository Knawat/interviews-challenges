"use strict";
let ESService = require("moleculer-elasticsearch");

module.exports = {
	name: "products",
	mixins: [ESService],
	dependencies: [],
	actions: {
		/**
		 * @api {post} /prodcuts/create Add(index) new product
		 * @apiName create products
		 * @apiGroup products
		 *
		 * @apiParam (newProduct) {Object} newProduct new product object to index.
		 * @apiParam (newProduct) {String} newProduct.index product index.
		 * @apiParam (newProduct) {String} newProduct.type  product type.
		 * @apiParam (newProduct) {String} newProduct.title product title.
		 *
		 * @apiSuccess {Boolean} success ensuring indexing
		 * @apiError {Boolean}  success ensuring failure to index.
		 * 
		 */
		create: {
			params: {
				newProduct: {
					index: "string",
					type: "string",
					title: "string"
				}
			},
			handler(ctx) {
				return new this.Promise((resolve, reject) => {
					ctx.call("es.create", {
						index: ctx.params.newProduct.index,
						type: ctx.params.newProduct.type,
						title: ctx.params.newProduct.title
					}).then(res => {
						resolve({ success: true });
					}).catch((err) => {
						reject({ success: false, err: err });
					})
				})
			}
		},
		/**
		 * @api {post} /prodcuts/query query on indexed products
		 * @apiName query products
		 * @apiGroup products
		 *
		 * @apiParam  {String} index product index.
		 * @apiParam  {String} q query string.
		 *
		 * @apiSuccess {Boolean} success ensuring success
		 * @apiSuccess {Object} res elasticsearch response with results found.

		 * @apiError {Boolean}  success ensuring failure to found results.
		 */
		query: {
			params: {
				index: "string",
				q: "string",
			},
			handler(ctx) {
				return new this.Promise((resolve, reject) => {
					ctx.call("es.search", {
						index: ctx.params.index,
						q: ctx.params.q
					}).then(res => {
						resolve({ success: true, res: res });
					}).catch((err) => {
						reject({ 
							success: false, 
							// err: err 
						});
					});
				});
			}
		}
	}
};