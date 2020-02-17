"use strict";

require('dotenv').config()

const MoleculerError = require("moleculer").Errors.MoleculerError;
const Common = require("../mixins/common.mixin");
const Elasticsearch = require("../mixins/elasticsearch.mixin");

module.exports = {
    name: "es",
    mixins: [Common, Elasticsearch],
    actions: {
        registration: {
            handler(ctx) {
                return this.registration(ctx.params).catch(err => {
                    throw new MoleculerError(err);
                });
            }
        },
        login: {
            handler(ctx) {
                return this.login(ctx.params).catch(err => {
                    throw new MoleculerError(err);
                });
            }
        },
        fatch_user: {
            handler(ctx) {
                return this.fatch_user(ctx.params).catch(err => {
                    throw new MoleculerError(err);
                });
            }
        }
    },

    async started() {
        try {
            const elasticClient = this.getEsObject();
            await elasticClient.indices
                .exists({
                    index: "users"
                })
                .then(async (res) => {
                    if (!res) {
                        await elasticClient.indices.create({
                            index: "users",
                            body: {
                                mappings: {
                                    properties: {
                                        name: { type: "text" },
                                        email: { type: "keyword" },
                                        password: { type: "keyword" }
                                    }
                                }
                            }
                        });
                        await elasticClient
                            .index({
                                index: "users",
                                type: "_doc",
                                body: {
                                    name: "Divya Kanak",
                                    email: "divya.kanak@tatvasoft.com",
                                    password: this.hashPassword("123456789")
                                }
                            })
                            .catch(err => {
                                throw new MoleculerError(err);
                            });
                    }
                });
        }
        catch (e) {
            return Promise.reject({
                message: "Unable to connect to database."
            });
        }
    }
};
