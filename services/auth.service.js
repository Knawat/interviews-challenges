"use strict";
require('dotenv').config()

const MESSAGE_CONSTANT = require("../lib/Constants");

const Joi = require("joi");


module.exports = {
    name: "auth",

	/**
	 * Settings
	 */
    settings: {

    },

	/**
	 * Dependencies
	 */
    dependencies: [],

	/**
	 * Actions
	 */
    actions: {
        /**
         * Registration action.
         *
         * Required params:
         * 	- 'name'
         *  - 'email'
         *  - 'password'
         *
         * @param {any} ctx
         * @returns
         */
        registration: {
            rest: {
                method: "POST",
                path: "/registration"
            },
            params: Joi.object({
                name: Joi.string()
                    .required()
                    .min(2)
                    .max(30)
                    .error(() => {
                        return {
                            message: MESSAGE_CONSTANT.NAME
                        };
                    }),
                email: Joi.string()
                    .required()
                    .email({ minDomainAtoms: 2 })
                    .error(() => {
                        return {
                            message: MESSAGE_CONSTANT.EMAIL
                        };
                    }),
                password: Joi.string()
                    .required()
                    .error(() => {
                        return {
                            message: MESSAGE_CONSTANT.PASSWORD
                        };
                    })
            }),
            handler: async function handler(ctx) {
                return ctx.params;
            }
        },

        /**
         * Login action.
         *
         * Required params:
         * 	- 'email'
         *  - 'password'
         *
         * @param {any} ctx
         * @returns
         */
        login: {
            rest: {
                method: "POST",
                path: "/login"
            },
            params: Joi.object({
                email: Joi.string()
                    .email({ minDomainAtoms: 2 })
                    .required()
                    .error(() => {
                        return {
                            message: MESSAGE_CONSTANT.EMAIL
                        };
                    }),
                password: Joi.string()
                    .required()
                    .error(() => {
                        return {
                            message: MESSAGE_CONSTANT.PASSWORD
                        };
                    })
            }),
            handler: async function handler(ctx) {
                return ctx.params;
            }
        },

        /**
         * resolveToken action.
         *
         * Required params:
         * 	- 'token'
         *
         * @param {any} ctx
         * @returns
         */
        verifyToken: {
            cache: {
                keys: ["token"],
                ttl: 60 * 60 // 1 hour
            },
            params: Joi.object({
                token: Joi.string()
                    .required()
                    .error(() => {
                        return {
                            message: MESSAGE_CONSTANT.TOKEN
                        };
                    })
            }),
            handler: async function handler(ctx) {
                return ctx.params;
            }
        }
    },

	/**
	 * Events
	 */
    events: {

    },

	/**
	 * Methods
	 */
    methods: {

    },

	/**
	 * Service created lifecycle event handler
	 */
    created() {

    },

	/**
	 * Service started lifecycle event handler
	 */
    async started() {

    },

	/**
	 * Service stopped lifecycle event handler
	 */
    async stopped() {

    }
};
