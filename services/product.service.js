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
        },

        /**
         * Add Product to Cart
         *
         * @actions
         * @param {String} id - productId
         * @returns {Promise} API response with Product array
         */
        add_to_cart: {
          auth: 'required',
          cache: false,
          params: {
            productId: 'string',
            quantity: 'number'
          },
          async handler(ctx) {
            const { productId, quantity } = ctx.params;
            return this.Promise.resolve()
              .then(() => this.isProductExist(productId))
              .then(async exist => {
                if (!exist) {
                  throw new MoleculerClientError('Product not found!', 404, '', [
                    {
                      field: 'products',
                      message: 'Product not found!'
                    },
                    {
                      field: 'success',
                      message: false
                    }
                  ]);
                }
                return this.Promise.resolve(true);
              })
              .then(() => this.addToCart(ctx, productId, quantity))
              .then(result => result);
          }
        }
      }
    });
  }

  /**
   * add Product to redis productCartHash
   *
   * @param {String} productId
   * @memberof ProductService
   */
  async addToCart(ctx, productId, quantity) {
    const { userId } = ctx.meta.auth;
    const cart = await this.executeRedisCommand('hget', ['userCartHash', userId]);
    let cartArray = {};

    if (cart) cartArray = JSON.parse(cart);

    cartArray[productId] = quantity;
    const returnString = JSON.stringify(cartArray);

    await this.executeRedisCommand('hmset', ['userCartHash', { [userId]: returnString }]);

    return this.Promise.resolve({
      status: true,
      message: 'Product added to cart'
    });
  }
}

module.exports = ProductService;
