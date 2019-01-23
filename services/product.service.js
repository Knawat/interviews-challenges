const { Service } = require('moleculer');
const { MoleculerClientError } = require('moleculer').Errors;

const Redis = require('../mixins/redis.mixin');
const Common = require('../mixins/common.mixin');
const Elastic = require('../mixins/elastic.mixin');
/**
 * Handles Product actions
 *
 * @class ProductService
 * @extends {Service}
 */
class ProductService extends Service {
  /**
   * Creates an instance of ProductService.
   *
   * @param {ServiceBroker} broker
   * @memberof ProductService
   */
  constructor(broker) {
    super(broker);

    this.parseServiceSchema({
      name: 'product',
      mixins: [Elastic, Redis, Common],
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
         * List Products
         *
         * @actions
         *
         * @returns {Promise} API response with Product array
         */
        list: {
          cache: false,
          async handler() {
            return this.Promise.resolve()
              .then(() => this.getAllProducts())
              .then(async products => {
                if (!products) {
                  throw new MoleculerClientError('No product found!', 404, '', [
                    {
                      field: 'products',
                      message: 'No products found!'
                    },
                    {
                      field: 'success',
                      message: false
                    }
                  ]);
                }
                return this.Promise.resolve(products);
              });
          }
        }
      }
    });
  }
}

module.exports = ProductService;
