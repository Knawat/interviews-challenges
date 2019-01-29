const { Service } = require('moleculer');

const Redis = require('../mixins/redis.mixin');
const Common = require('../mixins/common.mixin');
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
      mixins: [Redis, Common],
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
         * List Products
         *
         * @actions
         *
         * @returns {Promise} API response with Product array
         */
        list: {
          cache: false,
          async handler(ctx) {
            return ctx
              .call('elastic.get_all_products')
              .then(async products => {
                if (!products) {
                  return this.Promise.resolve({
                    success: true,
                    message: 'No product found',
                    products: []
                  });
                }
                return this.Promise.resolve(products);
              })
              .catch(err => this.handleError(err));
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
              .then(() => ctx.call('elastic.is_product_exist', { productId: productId }))
              .then(async exist => {
                if (!exist) {
                  return this.Promise.reject({
                    success: false,
                    message: 'Product not found!'
                  });
                }
                return true;
              })
              .then(() => this.addToCart(ctx, productId, quantity))
              .then(result => result)
              .catch(err => this.handleError(err));
          }
        },

        /**
         * clear user product Cart
         *
         * @actions
         * @returns {Promise} status
         */
        clear_cart: {
          auth: 'required',
          async handler(ctx) {
            const { userId } = ctx.meta.auth;

            await this.executeRedisCommand('hdel', ['userCartHash', userId]);

            return this.Promise.resolve({
              status: true,
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
        cart_summary: {
          auth: 'required',
          async handler(ctx) {
            const { userId } = ctx.meta.auth;
            const cart = await this.executeRedisCommand('hget', ['userCartHash', userId]);

            let cartArray = {};
            const cartDetails = [];

            if (cart) cartArray = JSON.parse(cart, true);

            const productIdS = Object.keys(cartArray);

            await this.asyncForEach(productIdS, async product => {
              const quantity = cartArray[product];

              await ctx
                .call('elastic.get_product_by_id', { productId: product })
                .then(pr => {
                  if (pr !== '') {
                    cartDetails.push({
                      ...pr,
                      quantity: quantity
                    });
                  }
                })
                .catch(err => this.handleError(err));
            });

            return this.Promise.resolve(cartDetails);
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
      success: true,
      message: 'Product added to cart'
    });
  }
}

module.exports = ProductService;
