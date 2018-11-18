"use strict";
module.exports = {
	name: "products",
	dependencies: [],
	actions: {
		/**
		 * @api {post} /products/create Add(index) new product
		 * @apiName create products
		 * @apiGroup products
		 *
		 * @apiHeader (MyHeaderGroup) {String} authorization Authorization value.
		 * 
		 * @apiParam (newProduct) {Object} newProduct new product object to index.
		 * @apiParam (newProduct) {String} newProduct.index product index.
		 * @apiParam (newProduct) {String} newProduct.id product id.
		 * @apiParam (newProduct) {String} newProduct.type  product type.
		 * @apiParam (newProduct) {String} newProduct.title product title.
		 *
		 * @apiSuccess {Boolean} success ensuring indexing
		 * 
		 * @apiError (Error) {Boolean}  success ensuring that operation failed.
		 * @apiError (Error) {String}  [err] error object.
		 * @apiError (Error) {String}  [msg] error helpful message.
		 *
		 * @apiError (Error_params) {String}  [paramsValidation] error helpful message.
		 */
		createProd: {
			params: {
				newProduct: {
					type: "object",
					props: {
						index: "string",
						id: "string",
						type: "string",
						title: "string"
					}
				}
			},
			handler(ctx) {
				let newProduct = ctx.params.newProduct;
				return ctx.call("es.create", {
					index: newProduct.index,
					id: newProduct.id,
					type: newProduct.type,
					body: {
						title: newProduct.title
					}
				})
					.then(() => ({ success: true }))
					.catch(err => this.errorRes("failed to create new product", err));
			}
		},
		/**
		 * @api {post} /products/query query on indexed products in elasticsearch
		 * @apiName query products
		 * @apiGroup products
		 *
    	 * @apiHeader (MyHeaderGroup) {String} authorization Authorization value.
		 * 
		 * @apiParam  {Object} query query object to look for.
		 * @apiParam  {String} query.index product index.
		 * @apiParam  {String} query.q query string.
		 *
		 * @apiSuccess {Boolean} success ensuring success
		 * @apiSuccess {Object} result elasticsearch response with results found.
		 * 
		 * @apiError {Boolean}  success ensuring failure to found results.
		 */
		query: {
			params: {
				query: {
					type: "object",
					props: {
						index: "string",
						q: "string",
					}
				}
			},
			handler(ctx) {
				let query = ctx.params.query;
				return ctx.call("es.search", {
					index: query.index,
					q: query.q
				})
					.then(res => ({ success: true, result: res }))
					.catch(err => this.errorRes("failed to query", err));
			}
		}
	},
	methods: {
		errorRes(msg, errObj) {
			console.log(msg, errObj)
			if (msg && errObj)
				return { success: false, msg: msg, err: errObj }
			else if (msg)
				return { success: false, msg: msg };
			else if (errObj)
				return { success: false, err: errObj };
		}
	}
};