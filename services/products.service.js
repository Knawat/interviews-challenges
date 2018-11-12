"use strict";
let ESService = require("moleculer-elasticsearch");

module.exports = {
	name: "products",
	mixins: [ESService],
	dependencies: [],
	actions: {
		create: {
			params: {
				index: "string",
				type: "string",
				id: "string",
				body: { name: "string" }
			},
			handler(ctx) {
				return new this.Promise((resolve, reject) => {
					ctx.call("es.create", {
						index: ctx.params.index,
						type: ctx.params.type,
						id: ctx.params.id,
						body: { name: ctx.params.body.name }
					}).then(res => {
						resolve({ success: true });
					}).catch((err) => {
						reject({ success: false, err: err });
					})
				})
			}
		},
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
						reject({ success: false, err: err });
					});
				});
			}
		}
	}
};