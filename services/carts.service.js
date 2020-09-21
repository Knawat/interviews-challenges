"use strict";

const { MoleculerClientError } = require("moleculer").Errors;
let es_client = require("../elasticsearch");
es_client.indices.exists({index: "carts"}).then(b => {if(!b) es_client.indices.create({index: "carts"});});

module.exports = {
	name: "carts",

	/**
	 * Default settings
	 */
	settings: {

	},

	/**
	 * Actions
	 */
	actions: {

		/**
		 * Get an cart by id
		 * 
		 * @actions
		 * @param {String} id - Article slug
		 * 
		 * @returns {Object} Article entity
		 */
		get: {
			// cache: {
			// 	keys: ["#token", "id"]
			// },
			params: {
				user: { type: "string" }
			},
			handler(ctx) {
				return this.getById(ctx.params.user)
					.then(entity => {
						if (!entity)
							return this.Promise.reject(new MoleculerClientError("Product not found!", 404));

						return entity;
					});
			}
		},	
        
		/**
		 * Add product to cart
		 * 
		 * @actions
		 * 
		 * @param {String} product - Article ID
		 * @param {String} user - User ID
		 * @returns {Object} Created favorite record
		 */		
		add: {
			params: {
				product : { type: "any" },
				user: { type: "any" },
				// qty: { type: "string" },
			},
			handler(ctx) {
				const { product , user } = ctx.params;
				const qty = ctx.params.qty ? ctx.params.qty:1;
				return this.cartCreate(user, product, qty);
			}
		},
	},

    
	methods: {

		/**
		 * Create cart [if not exists] and add SKU and quantity
		 * 
		 * @param {String} user - User ID
		 * @param {String} product - Product ID
		 * @param {Number} qty - Quantity change
		 * @returns {Object} Created record
		 * 
		 */
		cartCreate(user, product, qty){
			return es_client.update(
				{	
					index: "carts",
					type: "cart",
					id: user,
					body: {
						doc:{
							products: {
								[product]: qty
							}
						},
						upsert: {
							products: {
								[product]: qty
							}
						}
					},
				});
		},

		getById(id){
			return es_client.get({
				index: "carts",
				id: id
			}).catch(() => 0);
		}
	}
};