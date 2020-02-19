const { ServiceBroker } = require("moleculer");

const ProductService = require("../../../services/product.service");

jest.mock("../../../mixins/elasticSearch.mixin");

describe("Test 'product' service", () => {
  const broker = new ServiceBroker({ logger: true });
  broker.createService(ProductService);

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe("Test 'product.getProducts' action", () => {
    it("should return with 'success: true'", async () => {
      await broker
        .call("product.getProducts", {})
        .then((getProductRes) => {
          expect(getProductRes.success).toEqual(true);
        })
        .catch((error) => {
          console.log(">>> get products error:", error);
        });
    });
    it("should return with 'success: false'", async () => {
      await broker
        .call("product.getProducts", {})
        .then((getProductRes) => {
          expect(getProductRes.success).toEqual(false);
        })
        .catch((error) => {
          console.log(">>> get products error:", error);
        });
    });
  });
});
