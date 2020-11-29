const {ServiceBroker} = require("moleculer");

const Redis = require('../mixins/redis.mixin');
const Helper = require('../mixins/helpers.mixin');
const DB = require('../mixins/db.mixin');


/**
 * Handles Product actions
 *
 * @class ProductService
 * @extends {Service}
 */
module.exports = {
    name: 'product',
    mixins: [Redis, Helper, DB, ServiceBroker],

    /**
     * Service dependencies
     */
    dependencies: ['elastic'],

    /**
     * Service settings
     */
    settings: {},

    actions: {
        /**
         * List Products
         *
         * @actions
         *
         * @returns {Promise} API response with Product array
         */
        list: {
            cache: false,
            handler(ctx) {
                return ctx
                    .call('products.get_all_products')
                    .then(products => {
                        if (!products) {
                            return this.Promise.resolve({
                                success: true,
                                message: 'No product found!',
                                products: []
                            });
                        }
                        return this.Promise.resolve(products);
                    })
                    .catch(err => this.handleError(err));
            }
        },

        /**
         * Get product listing
         * @actions
         *
         * @returns {Promise} response object from elastic search
         */
        get_all_products: {
            cache: {
                keys: ['products'],
                ttl: 60 * 60
            },
            handler() {
                return this.fetchProducts().catch(err => this.handleError(err));
            }
        },

        /**
         * Get product from elastic search by id
         *
         * @actions
         * @param {Number} productId
         *
         * @returns {Promise} response object from elastic search
         */
        get_product_by_id: {
            cache: false,
            params: {
                productId: 'string'
            },
            handler(ctx) {
                const {productId} = ctx.params;
                return this.getProductById(productId).catch(err => this.handleError(err));
            }
        },

        create: {
            auth: 'required',
            cache: false,
            params: {
                name: {type: "string"},
                url: {type: "string"},
                sku: {type: "string"},
                barcode: {type: "string"},
                brand: {type: "string"},
                category: {type: "string"},
                created: {type: "date"}
            },
            handler(ctx) {
                return this.createProduct(ctx.params).catch(err => this.handleError(err));
            }
        }
    },

    methods: {
        async createDbIndex() {
            const eSearch = await this.getElasticObject();
            const productsExists = await eSearch.indices.exists({
                index: "products",
                body: {}
            });
            if (!productsExists) {
                await eSearch.indices.create({
                    index: "products",
                    body: {
                        mappings: {
                            properties: {
                                name: {type: 'text'},
                                sku: {type: 'keyword'},
                                url: {type: 'text'},
                                barcode: {type: 'keyword'},
                                brand: {type: 'keyword'},
                                category: {type: 'text'},
                                created: {type: 'date'}
                            }
                        }
                    }
                });
                this.logger.info("products Index created:");
                /*
                await this.asyncForEach(products, async product => {
                                const response = await eSearch
                                    .index({
                                        index: "products",
                                        type: "product",
                                        id: product.id,
                                        body: {
                                            name: product.name,
                                            url: product.url,
                                            sku: product.sku,
                                            barcode: product.barcode,
                                            brand: product.brand,
                                            category: product.category,
                                            created: product.created
                                        }
                                    })
                                    .catch(err => this.handleError(err));
                                this.logger.info('[PRODUCT CREATED] : ', response);
                            });
                            */
            }
        },
    },
    async started() {
        await this.createDbIndex()
    }
};
