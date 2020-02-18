
const { ServiceBroker } = require("moleculer");

const CartService = require("../../../services/cart.service");

describe("Test 'cart' service", () => {
  const product = {
    productId: 1,
    quantity: 3,
  };
  const broker = new ServiceBroker({ logger: true });
  broker.createService(CartService);

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe("Test 'cart.started' action", () => {
    it("should return with 'success: true'", () => {
      expect(broker.start()).resolves.toBeUndefined();
    });
  });

  describe("Test 'cart.getCartSummary' action", () => {
    it("should return with 'success: true'", async () => {
      await broker.call("cart.getCartSummary", {}, {
        meta: {
          userId: 1,
        },
      }).then((getProductRes) => {
        expect(getProductRes.success).toEqual(true);
      }).catch((error) => {
        this.logger.error(">>> get products error:", error);
      });
    });
  });

  describe("Test 'cart.addToCart' action", () => {
    it("should return with 'success: true'", async () => {
      await broker.call("cart.addToCart", product, {
        meta: {
          userId: 1,
        },
      }).then((addProductRes) => {
        expect(addProductRes.success).toEqual(true);
      }).catch((error) => {
        this.logger.error(">>> add product to cart error:", error);
      });
    });
  });
});
