const {ServiceBroker} = require("moleculer");
const _ = require('lodash')
const Redis = require('../mixins/redis.mixin');
const Helper = require('../mixins/helpers.mixin');
const DB = require('../mixins/db.mixin');

/**
 * Cart Service Handling
 */
module.exports = {
    name: 'cart',
    mixins: [Redis, Helper, DB, ServiceBroker],

    /**
     * Service dependencies
     */
    dependencies: ['elastic'],

    /**
     * Service settings
     */
    settings: {},
    /**
     * Service metadata
     */
    metadata: {},

    actions: {

        /**
         * Add Product to Cart
         *
         * @actions
         * @param {String} id - productId
         * @returns {Promise} API response with Product array
         */
        add: {
            auth: 'required',
            cache: false,
            params: {
                productId: 'string',
                quantity: 'number'
            },
            handler(ctx) {
                const {productId, quantity} = ctx.params;
                return this.Promise.resolve()
                    .then(() => this.isProductExist(productId))
                    .then(exist => {
                        if (!exist) {
                            return this.Promise.resolve({
                                success: false,
                                message: 'Product not found!'
                            });
                        }
                        return this.Promise.resolve({
                            success: true
                        });
                    })
                    .then(data => {
                        if (data.success) {
                            return this.addToCart(ctx, productId, quantity);
                        }
                        return data;
                    })
                    .catch(err => this.handleError(err));
            }
        },

        /**
         * clear user product Cart
         *
         * @actions
         * @returns {Promise} success and message
         */
        clear: {
            auth: 'required',
            async handler(ctx) {
                const {userId} = ctx.meta.auth;

                await this.executeRedisCommand('hdel', ['userCartHash', userId]);

                return this.Promise.resolve({
                    success: true,
                    message: 'Cart cleared!'
                });
            }
        },

        /**
         * get user Cart summary
         *
         * @actions
         * @returns {Promise} cart details
         */
        summary: {
            auth: 'required',
            async handler(ctx) {
                const {userId} = ctx.meta.auth;
                const cart = await this.executeRedisCommand('hget', ['userCartHash', userId]);

                let cartArray = {};
                const cartDetails = [];

                if (cart) cartArray = JSON.parse(cart, true);

                const productIdS = Object.keys(cartArray);
                _.forEach(productIdS, async (productId) => {
                    const quantity = cartArray[productId];

                    await ctx
                        .call('products.get_product_by_id', {productId: productId})
                        .then(pr => {
                            if (pr !== '') {
                                cartDetails.push({
                                    ...pr,
                                    quantity: quantity
                                });
                            }
                        })
                        .catch(err => this.handleError(err));
                })

                return this.Promise.resolve(cartDetails);
            }
        }
    },

    methods: {

        /**
         *  add Product to redis productCartHash
         * @param ctx
         * @param productId
         * @param qty
         * @returns {Promise<string|void|{configFullName: *, filePath: *}|{configName: string, configFullName: string, filePath: *}|{configFullName: string, filePath: string}|{success: boolean, message: string}>}
         */
        async addToCart(ctx, productId, qty) {
            const {userId} = ctx.meta.auth;

            const cart = await this.executeRedisCommand('hget', ['userCartHash', userId]);
            let cartArray = {};

            if (cart) cartArray = JSON.parse(cart);

            cartArray[productId] = qty;
            const returnString = JSON.stringify(cartArray);

            await this.executeRedisCommand('hmset', ['userCartHash', {[userId]: returnString}]);

            return this.Promise.resolve({
                success: true,
                message: 'Product added to cart'
            });
        }
    }
};
