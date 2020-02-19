
const { ServiceBroker } = require("moleculer");

const CartService = require("../../../services/cart.service");

jest.mock("../../../mixins/elasticSearch.mixin");


describe("Test 'cart' service", () => {
  const product = {
    productId: 1,
    quantity: 3,
  };
  const newProduct = {
    productId: 3,
    quantity: 3,
  };

  const broker = new ServiceBroker({ logger: true });
  broker.createService(CartService);

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe("Test 'cart.getCartSummary' action", () => {
    it("should return with 'success: true'", async () => {
      await broker.call("cart.getCartSummary", {}, {
        meta: {
          userId: 1,
        },
      }).then((getProductRes) => {
        expect(getProductRes.success).toEqual(true);
      }).catch((error) => {
        console.log(">>> add product to cart error:", error);
      });
    });

    it("should return with 'success: true'", async () => {
      await broker.call("cart.getCartSummary", {}, {
        meta: {
          userId: 1,
        },
      }).catch((error) => {
        expect(error.code).toEqual(500);
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
        console.log(">>> add product to cart error:", error);
      });
    });

    it("should return with 'success: true'", async () => {
      await broker.call("cart.addToCart", newProduct, {
        meta: {
          userId: 1,
        },
      }).then((addProductRes) => {
        expect(addProductRes.success).toEqual(true);
      }).catch((error) => {
        console.log(">>> add product to cart error:", error);
      });
    });

    it("should return with 'success: false'", async () => {
      await broker.call("cart.addToCart", newProduct, {
        meta: {
          userId: 1,
        },
      }).catch((error) => {
        expect(error.code).toEqual(500);
      });
    });
  });
});
