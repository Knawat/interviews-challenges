const { Service } = require('moleculer');
const Elastic = require('../mixins/elastic.mixin');

/**
 * Handles Product actions
 *
 * @class ElasticService
 * @extends {Service}
 */
class ElasticService extends Service {
  /**
   * Creates an instance of ElasticService.
   *
   * @param {ServiceBroker} broker
   * @memberof ElasticService
   */
  constructor(broker) {
    super(broker);

    this.parseServiceSchema({
      name: 'elastic',
      mixins: [Elastic],
      /**
       * Service dependencies
       */
      dependencies: [],

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
         * fetch users
         *
         * @actions
         * @param {Context} ctx - params with searching data
         *
         * @returns {Promise} reponse with user info
         */
        fetch_users: {
          cache: false,
          async handler(ctx) {
            return this.fetchUsers(ctx.params);
          }
        },
        /**
         * add users
         *
         * @actions
         *
         * @returns {Promise} response object from elastic search
         */
        add_users: {
          params: {
            name: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' }
          },
          catch: false,
          async handler(ctx) {
            return this.addUsers(ctx.params);
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
            ttl: 60 * 60 * 1
          },
          async handler() {
            return this.getAllProducts();
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
          async handler(ctx) {
            const { productId } = ctx.params;
            return this.getProductById(productId);
          }
        }
      }
    });
  }
}

module.exports = ElasticService;
