"use strict";

require('dotenv').config()

const Elasticsearch = require("elasticsearch");
const MESSAGE_CONSTANT = require("../lib/Constants");
const MoleculerError = require("moleculer").Errors.MoleculerError;
const Common = require("./common.mixin");
const elasticClient = new Elasticsearch.Client({
    host: process.env.ELASTICSEARCH_HOST
});

module.exports = {
    name: "elasticsearch",
    mixins: [Common],
    methods: {
        getEsObject: function () {
            return elasticClient;
        },

        registration: async function (data) {
            return await elasticClient
                .search({
                    index: "users",
                    type: "_doc",
                    body: {
                        query: {
                            bool: {
                                must: { match: { email: data.email } }
                            }
                        }
                    },
                    size: 1
                })
                .then(result => {
                    if (result.hits.total.value > 0) {
                        return Promise.reject({
                            message: MESSAGE_CONSTANT.EMAIL_EXIST
                        });
                    }
                    else {
                        return elasticClient
                            .index({
                                index: "users",
                                type: "_doc",
                                body: {
                                    name: data.name,
                                    email: data.email,
                                    password: this.hashPassword(data.password)
                                }
                            })
                            .then(result => {
                                return Promise.resolve({
                                    id: result._id
                                });
                            })
                            .catch(err => {
                                throw new MoleculerError(err);
                            });
                    }
                });
        },

        login: async function (data) {
            return await elasticClient
                .search({
                    index: "users",
                    type: "_doc",
                    body: {
                        query: {
                            bool: {
                                must: { match: { email: data.email } }
                            }
                        }
                    },
                    size: 1
                })
                .then(async result => {
                    if (result.hits.total.value === 0) {
                        return Promise.reject({
                            message: MESSAGE_CONSTANT.USER_NOT_EXIST
                        });
                    } else {
                        var passwordIsValid = await this.comparePassword(
                            result.hits.hits[0]._source.password,
                            data.password
                        );
                        if (!passwordIsValid)
                            return Promise.reject({
                                message: MESSAGE_CONSTANT.INVALID_CRED
                            });
                        return await this.generateToken({
                            id: result.hits.hits[0]._id
                        }).then(function (token) {
                            return Promise.resolve({
                                token: token,
                                user: {
                                    name: result.hits.hits[0]._source.name,
                                    id: result.hits.hits[0]._id
                                }
                            });
                        });
                    }
                });
        },

        fatch_user: async function (data) {
            return await elasticClient
                .search({
                    index: "users",
                    type: "_doc",
                    body: {
                        query: {
                            bool: {
                                must: { match: { _id: data.id } }
                            }
                        }
                    },
                    size: 1
                })
                .then(async (result) => {
                    if (result.hits.total.value === 0) {
                        return Promise.reject({
                            message: MESSAGE_CONSTANT.AUTH_FAIL
                        });
                    }
                    else {
                        return Promise.resolve({
                            user: {
                                email: result.hits.hits[0]._source.email,
                                name: result.hits.hits[0]._source.name,
                                id: result.hits.hits[0]._id
                            }
                        });
                    }
                })
                .catch(err => {
                    return Promise.reject({
                        message: MESSAGE_CONSTANT.AUTH_FAIL
                    });
                });
        }
    }
};
