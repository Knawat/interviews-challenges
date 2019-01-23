const { Service } = require('moleculer');

const elasticsearch = require('elasticsearch');
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

    this.es = new elasticsearch.Client({
      host: [
        {
          host: process.env.ELASTIC_HOST || 'localhost',
          protocol: process.env.ELASTIC_PROTOCOL || 'http',
          port: process.env.ELASTIC_PORT || 9200
        }
      ],
      log: process.env.ELASTIC_LOG || 'info'
    });

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
            return this.fetchUsers(this.es, ctx.params);
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
          catch: false,
          async handler(ctx) {
            return this.addUsers(this.es, ctx.params);
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
            return this.getAllProducts(this.es);
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
            return this.getProductById(this.es, productId);
          }
        },

        /**
         * check if product exist or not.
         *
         * @methods
         * @param {Number} productId
         *
         * @returns {boolean} exist flag(true, flase)
         */
        is_product_exist: {
          catch: false,
          params: {
            productId: 'string'
          },
          async handler(ctx) {
            const { productId } = ctx.params;
            return this.isProductExist(this.es, productId);
          }
        }
      }
    });
  }
}

module.exports = ElasticService;
