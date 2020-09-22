"use strict";
const fs = require('fs').promises;;
const DbMixin = require("../mixins/db.mixin");
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "users",
	// version: 1

	/**
	 * Mixins
	 */
	mixins: [DbMixin("users")],

	/**
	 * Settings
	 */
	settings: {
		// Available fields in the responses
		fields: [
			"_id",
            "name",
            "chart"
		],

		// Validator for the `create` & `insert` actions.
		entityValidator: {
            name: "string|min:3"
		}
	},

	/**
	 * Action Hooks
	 */
	hooks: {
		before: {
			/**
			 * Register a before hook for the `create` action.
			 * It sets a default value for the quantity field.
			 *
			 * @param {Context} ctx
			 */
			create(ctx) {
				// ctx.params.chart = [];
			}
		}
	},

	/**
	 * Actions
	 */
	actions: {
		/**
		 * The "moleculer-db" mixin registers the following actions:
		 *  - list
		 *  - find
		 *  - count
		 *  - create
		 *  - insert
		 *  - update
		 *  - remove
		 */

		// --- ADDITIONAL ACTIONS ---

		/**
		 * Increase the quantity of the product item.
		 */
		register: {
			rest: "PUT /register",
			params: {
				id: "string",
				name: "string"
			},
			async handler(ctx) {
				// const doc = await this.adapter.updateById(ctx.params.id, { $inc: { quantity: ctx.params.value } });
				// const json = await this.transformDocuments(ctx, ctx.params, doc);
				// await this.entityChanged("updated", json, ctx);
				console.log(ctx.params);
				let user = {
					id: ctx.params.id,
					name: ctx.params.name,
					chart: []
				}
				await this.adapter.insertMany([
					user
						]);
				return user; 
			}
		},

		/**
		 * Decrease the quantity of the product item.
		 */
		login: {
			rest: "GET /login/:id",
			params: {
				id: "string"
			},
			/** @param {Context} ctx  */
			async handler(ctx, route, req) {
				const doc = await this.adapter.find(ctx.params.id);
				// const json = await this.transformDocuments(ctx, ctx.params, doc);
				// await this.entityChanged("updated", json, ctx);
				// const auth = req.headers["authorization"];
				// console.log(auth);
				// console.log(ctx.params);
				// console.log(ctx.meta.user);
				ctx.meta.user = doc;
				fs.writeFile("../moleculer/data/cookie", JSON.stringify(doc[0]), (err) => {
					if (err) console.log(err);
					console.log("Successfully Written to File.");
				  });
				console.log(ctx.meta.user);
				// return doc;
				return doc;
			}
		},
				/**
		 * Increase the quantity of the product item.
		 */
		chart: {
			rest: "POST /chart",
			params: {
			},
			async handler(ctx) {
				let user =  await fs.readFile("../moleculer/data/cookie", "binary");
				user = JSON.parse(user);

				// fs.readFileSync("../moleculer/data/cookie", function(err, buf) {
				// 	user = JSON.parse(buf.toString());
				// 	console.log(buf.toString());
				// });
				if(user) {
					return user.chart;
				} else {
					return {data: 'user not found'};
				}
			}
		},

		addProductsToChart: {
			rest: "PUT /add/products/to/chart",
			params: {
				id: "string"
			},
			async handler(ctx) {
				let user =  await fs.readFile("../moleculer/data/cookie", "binary");
				user = JSON.parse(user);
				user.chart.push( ctx.params.id);
				// const doc = await this.adapter.updateById(user._id, { $push: { chart: ctx.params.id }  });
				// const json = await this.transformDocuments(ctx, ctx.params, doc);
				// await this.entityChanged("updated", json, ctx);
				fs.writeFile("../moleculer/data/cookie", JSON.stringify(user), (err) => {
					if (err) console.log(err);
					console.log("Successfully Written to File.");
				});
				fs.writeFile("../moleculer/data/users.db", JSON.stringify(user), (err) => {
					if (err) console.log(err);
					console.log("Successfully Written to File.");
				});
				return user;
			}
		},
	},

	/**
	 * Methods
	 */
	methods: {
		/**
		 * Loading sample data to the collection.
		 * It is called in the DB.mixin after the database
		 * connection establishing & the collection is empty.
		 */
		// async seedDB() {
		// 	await this.adapter.insertMany([
		// 		{ name: "Samsung Galaxy S10 Plus", quantity: 10, price: 704 },
		// 		{ name: "iPhone 11 Pro", quantity: 25, price: 999 },
		// 		{ name: "Huawei P30 Pro", quantity: 15, price: 679 },
		// 	]);
		// }
	},

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected() {
		// await this.adapter.collection.createIndex({ name: 1 });
	}
};
