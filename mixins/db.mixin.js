const elasticsearch = require('elasticsearch');
const bcrypt = require("bcrypt")

const esClient = new elasticsearch.Client({
    host: [
        {
            host: process.env.ELASTIC_HOST || '0.0.0.0',
            protocol: process.env.ELASTIC_PROTOCOL || 'http',
            port: process.env.ELASTIC_PORT || 9200
        }
    ],
    log: process.env.ELASTIC_LOG || 'info'
});
/**
 *Elastic Database Actions handling
 */
module.exports = {
    methods: {
        /**
         * fetch users
         *
         * @methods
         * @param {Object} params - params with searching data
         *
         * @returns {Promise} response with user info
         */
        fetchUsers(params) {
            const {email, password} = params;
            const matching = [];
            if (email) {
                matching.push({match: {email: email}});
            }
            if (password) {
                matching.push({match: {password: password}});
            }

            return esClient.search({
                index: "users",
                type: "user",
                body: {
                    query: {
                        bool: {
                            must: matching
                        }
                    }
                },
                size: 1
            })
                .then(result => {
                    if (!result.hits.total) {
                        return {
                            success: false,
                            message: 'No user found.'
                        };
                    }
                    const data = result.hits.hits.map(user => ({
                        id: user._id,
                        ...user._source
                    }));
                    return this.Promise.resolve({
                        success: true,
                        data: data
                    });
                });
        },

        /**
         * add users
         *
         * @methods
         * @param {Object} params - params with data
         *
         * @returns {Promise} response object from elastic search
         */
        addUsers(params) {
            const {name, email, password} = params;
            const hashedPassword = bcrypt.hashSync(password, 10)
            return esClient.index({
                index: "users",
                type: "user",
                body: {
                    name: name,
                    email: email,
                    password: hashedPassword
                }
            })
                .then(result => result);
        },

        /**
         * Get product listing
         *
         * @returns {Promise} response object from elastic search
         */
        fetchProducts() {
            return esClient.search({
                index: "products",
                type: "product",
                body: {
                    query: {
                        match_all: {}
                    }
                },
                size: 999
            })
                .then(result => {
                    if (result.hits.total === 0) {
                        return {
                            success: false,
                            message: 'No products found.'
                        };
                    }
                    const products = result.hits.hits.map(product => ({
                        id: product._id,
                        ...product._source
                    }));
                    return this.Promise.resolve({
                        success: true,
                        products: products
                    });
                });
        },

        /**
         * Get product from elastic search by id
         *
         * @methods
         * @param {Number} productId
         *
         * @returns {Promise} response object from elastic search
         */
        getProductById(productId) {
            return esClient.get({
                index: "products",
                type: "product",
                id: productId
            })
                .then(
                    result => {
                        if (!result.found) {
                            return null;
                        }
                        return this.Promise.resolve({
                            id: result._id,
                            ...result._source
                        });
                    },
                    () => ''
                );
        },

        /**
         * check if product exist or not.
         *
         * @methods
         * @param {Number} productId
         *
         * @returns {boolean} exist flag(true, flase)
         */
        isProductExist(productId) {
            return esClient.exists({
                index: "products",
                type: "product",
                id: productId
            })
                .then(result => result);
        },

        /**
         * get elastic search object
         *
         * @returns {Object} - Elastic Search object
         */
        getElasticObject() {
            return esClient;
        },

        createProduct(params) {
            return esClient.index({
                index: "products",
                type: "product",
                body: {
                    name: params.name,
                    url: params.url,
                    sku: params.sku,
                    barcode: params.barcode,
                    brand: params.brand,
                    category: params.category,
                    created: params.created
                }
            }).then(result => result)
        }
    }
};
