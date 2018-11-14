"use strict";
let ESService = require("moleculer-elasticsearch");
const DbService = require("moleculer-db");
const MongoDBAdapter = require("moleculer-db-adapter-mongo");

module.exports = {
	name: "cart",
	mixins: [ESService, DbService],
	adapter: new MongoDBAdapter("mongodb://localhost:27017/knawat", {
		keepAlive: 1,
		useNewUrlParser: true
	}),
	collection: "cart",
	fields: ["_id", "prodIndex", "prodId", "userId", "count"],
	dependencies: [],
	actions: {
		/**
		* @api {post} /cart/add add a product in my cart 
		* @apiName add product 
		* @apiGroup cart
		*
		* @apiHeader (MyHeaderGroup) {String} authorization Authorization value.
		*
    	* @apiParam  {Object} product product object to add to cart.
		* @apiParam  {String} product.index product index.
		* @apiParam  {String} product.id  product id.
		* @apiParam  {String} product.count  product count.
		*
		* @apiSuccess {Boolean} success ensuring indexing
		* 
		* @apiError (Error) {Boolean}  success ensuring that operation failed.
		* @apiError (Error) {String}  [err] error object.
		* @apiError (Error) {String}  [msg] error helpful message.
		*
		* @apiError (Error_params) {String}  [paramsValidation] error helpful message.
		*/
		addOne: {
			params: {
				product: {
					type: "object",
					props: {
						prodIndex: "string",
						prodId: "string",
						count: "number"
					}
				}
			},
			handler(ctx) {
				let product = ctx.params.product;
				product.userId = ctx.meta.userId;
				return this.adapter.findOne({
					userId: product.userId,
					prodId: product.prodId,
					prodIndex: product.prodIndex
				})
					.then(prodFound => {
						if (prodFound) {
							prodFound.count = prodFound.count + product.count;
							this.adapter.updateById(prodFound._id, { $set: { count: prodFound.count } })
								.then(prodUpdated => Promise.resolve(prodUpdated))
								.catch(() => Promise.reject(this.errorRes("update failed", null)))
						}
						else if (!prodFound) {
							this.adapter.insert(product)
								.then(Inserted => Promise.resolve(Inserted))
								.catch(() => Promise.reject(this.errorRes("insert failed", null)))
						}
					})
					.then(() => ({ success: true }))
					.catch(err => err);
			}
		},
		/**
		* @api {get} /cart/summary get list of products in my cart 
		* @apiName list cart products 
		* @apiGroup cart
		*
		* @apiHeader (MyHeaderGroup) {String} authorization Authorization value.
		*
		* @apiSuccess {Boolean} success ensuring indexing
		* @apiSuccess {Object} list products listed saved in cart
		* 
		* @apiError (Error) {Boolean}  success ensuring that operation failed.
	   * @apiError (Error) {String}  [err] error object.
	   * @apiError (Error) {String}  [msg] error helpful message.
	   *
	   * @apiError (Error_params) {String}  [paramsValidation] error helpful message.
		*/
		summary: {
			handler(ctx) {
				return this.adapter.find({
					userId: ctx.meta.userId
				})
					.then(data => ({ success: true, list: data }))
					.catch(err => this.errorRes("failed to get list", err));
			}
		}
	},
	methods: {
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