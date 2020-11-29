const DB = require('../mixins/db.mixin');
const Helper = require('../mixins/helpers.mixin');

// const products = [
//     {
//         id: 1,
//         name: 'HP-C4356',
//         url: 'https://www.google.com/search?q=HP-C4356',
//         sku: 'TST02',
//         barcode: 'BRCD02',
//         brand: 'HP',
//         category: 'laptop',
//         created: '2019-01-21T07:36:39.545Z'
//     },
//     {
//         id: 2,
//         name: 'Motorola PowerOne',
//         url: 'https://www.google.com/search?q=Motorola PowerOne',
//         sku: 'TST05',
//         barcode: 'BRCD05',
//         brand: 'Mtorola',
//         category: 'Mobile',
//         created: '2019-01-21T07:36:39.545Z'
//     },
//     {
//         id: 3,
//         name: 'Honda shine',
//         url: 'https://www.google.com/search?q=Honda shine',
//         sku: 'TST07',
//         barcode: 'BRCD07',
//         brand: 'Honda',
//         category: 'Bike',
//         created: '2019-01-21T07:36:39.545Z'
//     },
//     {
//         id: 4,
//         name: 'LED lamp',
//         url: 'https://www.google.com/search?q=LED lamp',
//         sku: 'TST10',
//         barcode: 'BRCD10',
//         brand: 'Syska',
//         category: 'Electric',
//         created: '2019-01-21T07:36:39.545Z'
//     },
//     {
//         id: 5,
//         name: 'DELL mouse',
//         url: 'https://www.google.com/search?q=DELL mouse',
//         sku: 'TST09',
//         barcode: 'BRCD09',
//         brand: 'DELL',
//         category: 'Gadgets',
//         created: '2019-01-21T07:36:39.545Z'
//     },
//     {
//         id: 6,
//         name: 'Iphone X',
//         sku: 'TST01Iphone X',
//         url: 'https://www.google.com/search?q=',
//         barcode: 'BRCD01',
//         brand: 'IPHONE',
//         category: 'mobile',
//         created: '2019-01-21T07:36:39.545Z'
//     },
//     {
//         id: 7,
//         name: 'fastrack-005D',
//         url: 'https://www.google.com/search?q=fastrack-005D',
//         sku: 'TST03',
//         barcode: 'BRCD03',
//         brand: 'titan',
//         category: 'watch',
//         created: '2019-01-21T07:36:39.545Z'
//     },
//     {
//         id: 8,
//         name: 'LED-42 Inch',
//         url: 'https://www.google.com/search?q=LED-42 Inch',
//         sku: 'TST04',
//         barcode: 'BRCD04',
//         brand: 'MI',
//         category: 'TV',
//         created: '2019-01-21T07:36:39.545Z'
//     },
//     {
//         id: 9,
//         name: 'JBL headphones',
//         url: 'https://www.google.com/search?q=JBL headphones',
//         sku: 'TST06',
//         barcode: 'BRCD06',
//         brand: 'JBL',
//         category: 'headphones',
//         created: '2019-01-21T07:36:39.545Z'
//     },
//     {
//         id: 10,
//         name: 'Swift',
//         url: 'https://www.google.com/search?q=Swift',
//         sku: 'TST08',
//         barcode: 'BRCD08',
//         brand: 'Suzuki',
//         category: 'Car',
//         created: '2019-01-21T07:36:39.545Z'
//     }
// ];

/**
 * Elastic DB Handler
 */
module.exports = {
    name: 'users',
    mixins: [DB, Helper],

    actions: {
        /**
         * fetch users
         *
         * @actions
         * @param {Context} ctx - params with searching data
         *
         * @returns {Promise} response with user info
         */
        fetch_all: {
            cache: false,
            handler(ctx) {
                return this.fetchUsers(ctx.params).catch(err => this.handleError(err));
            }
        },

        /**
         * add users
         *
         * @actions
         *
         * @returns {Promise} response object from elastic search
         */
        add: {
            params: {
                name: {type: 'string'},
                email: {type: 'string'},
                password: {type: 'string'}
            },
            catch: false,
            handler(ctx) {
                return this.addProduct(ctx.params).catch(err => this.handleError(err));
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
        }
    },
    /*
     * action call when elastic service started
     */
    async started() {
        /*
         * This action is performed to store sample data and creating indexes for elastic search on initialization
         * This action is performed only to add mock data for the project
         * The action will check if user and product index exist? If No, then will create the index and add mock data into it.
         */
        const eSearch = await this.getElasticObject();
        const usersExists = await eSearch.indices.exists({
            index: "users",
            body: {}
        });
        if (!usersExists) {
            await eSearch.indices.create({
                index: "users",
                body: {
                    mappings: {
                        properties: {
                            name: {type: 'text'},
                            email: {type: 'keyword'},
                            password: {type: 'keyword'}
                        }
                    }
                }
            });

            this.logger.info("Users index created");
        }

    }
};
