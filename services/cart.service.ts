"use strict";
import {Context, Service, ServiceBroker, ServiceSchema} from "moleculer";

import DbConnection from "../mixins/db.mixin";
import {Errors} from 'moleculer-web';
export default class UsercartService extends Service{

	private DbMixi = new DbConnection("usercart").start();

	// @ts-ignore
	public  constructor(public broker: ServiceBroker, schema: ServiceSchema<{}> = {}) {
		super(broker);
		this.parseServiceSchema(Service.mergeSchemas({
			name: "usercart",
			mixins: [this.DbMixi],
			settings: {
				// Available fields in the responses
				fields: [
					"_id",
					"products",
					"productid",
					"quantity",
					"userid"
				],

				// Validator for the `create` & `insert` actions.
                entityValidator: {
					products:"array",
					userid:"string",
                }, 
                routes: [{
                    // First thing
                    authorization: true
                }]

			},
			hooks: {
				before: {
					/**
					 * Register a before hook for the `create` action.
					 * It sets a default value for the quantity field.
					 *
					 * @param {Context} ctx
					 */
					// create: (ctx: Context<{ quantity: number }>) => {
					// 	ctx.params.quantity = 1;
					// },
					list:(ctx:Context<{userid:string}>)=>{

					},
				},
			},
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
				getcartsummary: {
					rest: "POST /cartsummary",
					params: {
						id: "string",
					},
					async handler(ctx: Context<{ id: string}>) {
						const doc = await this.adapter.find({userid:ctx.params.id});
						const json = await this.transformDocuments(ctx, ctx.params, doc);
						await this.entityChanged("data", json, ctx);
						if(json){

						}
						return json;
					},
				},
			},
			methods: {
			},
		}, schema));
	}
}
