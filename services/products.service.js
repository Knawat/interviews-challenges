"use strict";

const { MoleculerClientError } = require("moleculer").Errors;
let es_client = require("../elasticsearch");

es_client.indices.exists({index: "products"}).then(b => {if(!b) es_client.indices.create({index: "products"});});

module.exports = {
	name: "products",

	/**
	 * Actions
	 */
	actions: {

		/**
		 * Create a new product.
		 * Auth is required!
		 * 
		 * @actions
		 * @param {Object} product - product entity
		 * 
		 * @returns {Object} Created entity
		 */
		create: {
			auth: "required",
			params: {
				product: {
					$$type: "object",
					sku: { type: "string", min: 2},
					data: { type: "object" }
					// stock: { type: "number" }
				}
			},
			handler(ctx) {
				return this.getById(ctx.params.product.sku)
					.then(doc => {
						if (doc)
							return this.Promise.reject(new MoleculerClientError("Product exists with the same SKU!", 404));

						return es_client.create(
							{	
								index: "products",
								type: "product",
								id: ctx.params.product.sku,
								body: ctx.params.product.data 
							});
					});
			}
		},

		/**
		 * Get Product by ID
		 * 
		 * @actions
		 * @param {String} id - Product id
		 * 
		 * @returns {Object} Product entity
		 */
		get: {
			cache: {
				keys: ["#token", "id"]
			},
			params: {
				id: { type: "string" }
			},
			handler(ctx) {
				return this.getById(ctx.params.id)
					.then(entity => {
						if (!entity)
							return this.Promise.reject(new MoleculerClientError("Product not found!", 404));

						return entity._source;
					});
			}
		},	
        
		/**
		 * Add product to cart
		 * 
		 * @actions
		 * @param {String} id - Product slug
		 * 
		 * @returns {Object} Updated Product
		 */
		cart: {
			auth: "required",
			params: {
				product: { type: "any" }
			},
			handler(ctx) {
				return this.Promise.resolve(ctx.params.product)
					.then(product => this.getById(product))
					.then(product => {
						if (!product)
							return this.Promise.reject(new MoleculerClientError("Product not found", 404));
							
						return ctx.call("carts.add", { product: product._id, user: ctx.meta.user._id.toString() });
					});
			}
		},
	},

	/**
	 * Methods
	 */
	methods: {
		getById(id){
			return es_client.get({
				index: "products",
				id: id
			}).catch(() => 0);
		}
	}

};