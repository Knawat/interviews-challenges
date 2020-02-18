"use strict";

require('dotenv').config();

const { MoleculerError } = require("moleculer").Errors;
const Common = require("../mixins/common.mixin");
const Joi = require("joi");

module.exports = {
    name: "cart",
    mixins: [Common],
    dependencies: ['elasticSearchClient', 'redisClient'],
    actions: {
        add_to_cart: {
            rest: {
                method: "POST",
                path: "/add_to_cart"
            },
            auth: "Bearer",
            params: {
                productId: Joi.string()
                    .required()
                    .error(() => {
                        return MESSAGE_CONSTANT.PRODUCT_INVALID
                    }),
                quantity: Joi.number()
                    .required()
                    .min(1)
                    .max(50)
                    .error(() => {
                        return MESSAGE_CONSTANT.QTN_INVALID
                    })
            },
            handler(ctx) {
                const { productId, quantity } = ctx.params;
                return ctx
                    .call("elasticSearchClient.fatch_product", { id: productId })
                    .then(product => {
                        if (!product) {
                            throw new MoleculerError(MESSAGE_CONSTANT.PRODUCT_NOT_EXIST, 404);
                        }
                        return ctx
                            .call("redisClient.add_to_cart", {
                                productId: productId,
                                quantity: quantity,
                                userId: ctx.meta.auth.userId
                            })
                            .then(cart => {
                                return Promise.resolve({
                                    message: MESSAGE_CONSTANT.PRODUCT_ADDED
                                });
                            });
                    });
            }
        }
    }
};
