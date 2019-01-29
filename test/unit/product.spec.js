const { ServiceBroker } = require('moleculer');
const { ValidationError } = require('moleculer').Errors;

const elastic = require('../../services/elastic.service');
const product = require('../../services/product.service');

const cart = {
  productId: 'BxSFlGgB29P723uFOqA2',
  quantity: 4
};

/* const cartResult = {
  status: true,
  message: 'Product added to cart'
}; */
const clearCartResult = {
  status: true,
  message: 'Cart cleared!'
};

describe("Test 'Product' service", async () => {
  const broker = new ServiceBroker();
  broker.createService(elastic);
  broker.createService(product);

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe("Test 'product.list' action", () => {
    it('should return array of products', async () => {
      // eslint-disable-next-line max-nested-callbacks
      await broker.call('product.list').then(products => {
        expect(products.success).toEqual(true);
      });
    });
  });

  describe("Test 'product.add_to_cart' action", () => {
    it('should return confirmation on cart added', async () => {
      expect(broker.call('product.add_to_cart', cart)).resolves.toEqual({
        status: true,
        message: 'Product added to cart'
      });
    });

    it('should throw ValidationError Error ', () => {
      expect(broker.call('product.add_to_cart')).rejects.toBeInstanceOf(ValidationError);
    });
  });

  describe("Test 'product.clear_cart' action", () => {
    it('should return confirmation on cart added', () => {
      expect(broker.call('product.clear_cart')).resolves.toEqual(clearCartResult);
    });
  });
  describe("Test 'product.cart_summary' action", () => {
    it('should return array of product objects stored in cart', () => {
      expect(broker.call('product.cart_summary')).resolves.toBeInstanceOf(Object);
    });
  });
});
