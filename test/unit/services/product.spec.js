
const { ServiceBroker } = require("moleculer");

const ProductService = require("../../../services/product.service");

describe("Test 'product' service", () => {
  const broker = new ServiceBroker({ logger: true });
  broker.createService(ProductService);

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe("Test 'product.started' action", () => {
    it("should return with 'success: true'", () => {
      expect(broker.start()).resolves.toBeUndefined();
    });
  });

  describe("Test 'product.getProducts' action", () => {
    it("should return with 'success: true'", async () => {
      await broker.call("product.getProducts", {})
        .then((getProductRes) => {
          expect(getProductRes.success).toEqual(true);
        }).catch((error) => {
          this.logger.error(">>> get products error:", error);
        });
    });
  });
});
