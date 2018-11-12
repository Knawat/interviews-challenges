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
				return new this.Promise((resolve, reject) => {
					this.adapter.findOne({
						userId: product.userId,
						prodId: product.prodId,
						prodIndex: product.prodIndex
					})
						.then(prodFound => {
							if (prodFound) {
								prodFound.count = prodFound.count + product.count;
								this.adapter.updateById(prodFound._id, { $set: { count: prodFound.count } }).then(prodUpdated => {
									if (prodUpdated) resolve({ success: true })
								}).catch(err => reject({ success: false, msg: err }))
							}
							else if (!prodFound) {
								this.adapter.insert(product)
									.then(prodInserted => {
										if (prodInserted) resolve({ success: true });
									}).catch(err => reject({ success: false, msg: err }))
							}
						})
						.catch(err => reject({ success: false, msg: err }));
				});
			}
		},
		summary: {
			handler(ctx) {
				return new this.Promise((resolve, reject) => {
					this.adapter.find({
						userId: ctx.meta.userId
					}).then(data => {
						resolve({ success: true, data: data });
					}).catch(err => reject({ success: false, msg: err }));
				});
			}
		}
	}
};