const { ServiceBroker } = require('moleculer');
const { ValidationError } = require('moleculer').Errors;

const elastic = require('../../services/elastic.service');
const product = require('../../services/product.service');

const cart = {
  productId: '1',
  quantity: 4
};

const clearCartResult = {
  success: true,
  message: 'Cart cleared!'
};

describe("Test 'Product' service", async () => {
  const broker = new ServiceBroker();
  broker.createService(elastic);
  broker.createService(product);

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe("Test 'product.list' action", () => {
    it('should return array of products', async () =>
      // eslint-disable-next-line max-nested-callbacks
      broker.call('product.list').then(products => {
        expect(products.success).toEqual(true);
      }));
  });

  describe("Test 'product.add_to_cart' action", () => {
    it('should return confirmation on cart added', async () =>
      expect(
        broker.call('product.add_to_cart', cart, {
          meta: {
            auth: {
              userId: 1
            }
          }
        })
      ).resolves.toEqual({
        success: true,
        message: 'Product added to cart'
      }) ||
      expect(
        broker.call('product.add_to_cart', cart, {
          meta: {
            auth: {
              userId: 1
            }
          }
        })
      ).rejects.toEqual({
        success: false,
        message: 'Product not found!'
      }));

    it('should throw ValidationError Error ', () =>
      expect(
        broker.call('product.add_to_cart', null, {
          meta: {
            auth: {
              userId: 1
            }
          }
        })
      ).rejects.toBeInstanceOf(ValidationError));
  });

  describe("Test 'product.clear_cart' action", () => {
    it('should return confirmation on cart added', () =>
      expect(
        broker.call('product.clear_cart', null, {
          meta: {
            auth: {
              userId: 1
            }
          }
        })
      ).resolves.toEqual(clearCartResult));
  });

  describe("Test 'product.cart_summary' action", () => {
    it('should return array of product objects stored in cart', () =>
      expect(
        broker.call('product.cart_summary', null, {
          meta: {
            auth: {
              userId: 1
            }
          }
        })
      ).resolves.toBeInstanceOf(Object));
  });
});
