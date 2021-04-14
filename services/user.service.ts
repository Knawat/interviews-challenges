"use strict";
import {Context, Service, ServiceBroker, ServiceSchema} from "moleculer";

import DbConnection from "../mixins/db.mixin";

export default class UsersService extends Service{

	private DbMixi = new DbConnection("user").start();

	// @ts-ignore
	public  constructor(public broker: ServiceBroker, schema: ServiceSchema<{}> = {}) {
		super(broker);
		this.parseServiceSchema(Service.mergeSchemas({
			name: "user",
			mixins: [this.DbMixi],
			settings: {
				// Available fields in the responses
				fields: [
					"_id",
					"name",
					"email",
					"password",
				],

				// Validator for the `create` & `insert` actions.
                entityValidator: {
                    name: "string|min:3",
                    email: "string|min:6",
                    password:"string|min:8"
                },
			},
			hooks: {
				before: {
					/**
					 * Register a before hook for the `create` action.
					 * It sets a default value for the quantity field.
					 *
					 * @param {Context} ctx
					 */
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
				 * using this api user can login
				 * providing email and password registered
				 * **/
				login: {
					rest: "POST /login",
					params: {
						email:"string",
						password:"string",
					},
					/** @param {Context} ctx  */
					async handler(ctx: Context<{ email: string; password: string }>) {
						const doc = await this.adapter.find({email:ctx.params.email});
						const json = await this.transformDocuments(ctx, ctx.params, doc);
						await this.entityChanged("data", json, ctx);
						if (json) {
							if(json.password==ctx.params.password){
								return json
							}else{
								return "Invalid Password";
							}
						} else {
							return "Invalid user";
						}
						
					},
				},
			},
			methods: {
			},
		}, schema));
	}
}
