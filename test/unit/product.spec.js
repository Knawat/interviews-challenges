const { ServiceBroker } = require("moleculer");
const productService = require("../../services/product.service");

describe("Test 'Product' service", () => {
	const broker = new ServiceBroker();

	broker.createService(productService);

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	describe("Test 'product.list' action", () => {
		it("should return products", () =>
			broker.call("product.list").then(products => {
				expect(products).toBeInstanceOf(Object);
			}));
	});
});