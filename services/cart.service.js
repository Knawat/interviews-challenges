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
		addOne: {
			params: {
				prodIndex: "string",
				prodId: "string",
				count: "number"
			},
			handler(ctx) {
				let product = ctx.params;
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
		summary: {
			handler(ctx) {
				return this.adapter.find({
					userId: ctx.meta.userId
				})
					.then(data => ({ success: true, data: data }))
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