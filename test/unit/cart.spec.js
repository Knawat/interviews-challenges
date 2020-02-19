const { ServiceBroker } = require("moleculer");
const cartService = require("../../services/cart.service");
const productService = require("../../services/product.service");
const JoiValidator = require("../../lib/JoiValidator");
const { ValidationError, MoleculerError } = require("moleculer").Errors;

describe("Test 'Product' service", () => {
	const broker = new ServiceBroker({
		validator: new JoiValidator()
	});

	broker.createService(cartService);
	broker.createService(productService);

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	describe("Test 'cart.add_to_cart' action", () => {

		it("should throw ValidationError if fields are empty", async () => {
			try {
				await broker.call("cart.add_to_cart");
			} catch (e) {
				expect(e).toBeInstanceOf(ValidationError);
			}
		});

		it("should throw ValidationError if productId is not entering", async () => {
			try {
				await broker.call("cart.add_to_cart",
					{
						quantity: 4
					}
				);
			} catch (e) {
				expect(e).toBeInstanceOf(ValidationError);
			}
		});

		it("should throw ValidationError if quantity is not entering", async () => {
			try {
				await broker.call("cart.add_to_cart",
					{
						productId: "1"
					}
				);
			} catch (e) {
				expect(e).toBeInstanceOf(ValidationError);
			}
		});

		it("should throw MoleculerError if product not exist", async () => {
			try {
				await broker.call("cart.add_to_cart",
					{
						productId: "100",
						quantity: 4
					}
				);
			} catch (e) {
				expect(e).toBeInstanceOf(MoleculerError);
			}
		});

		it("should return message as \"Product has been added to your cart.\"", async () =>
			await broker.call("cart.add_to_cart", {
				productId: "1",
				quantity: 4
			}, {
				meta: {
					auth: {
						userId: 1
					}
				}
			}).then(res => {
				expect(res).toEqual({ message: "Product has been added to your cart." });
			}).catch(error => {
				expect(error).toBeInstanceOf(MoleculerError);
			})
		);
	});

	describe("Test 'cart.details' action", () => {

		it("should throw MoleculerError if cart is not found", async () => {
			try {
				await broker.call("cart.details", null, {
					meta: {
						auth: {
							userId: 2
						}
					}
				}
				);
			} catch (e) {
				expect(e).toBeInstanceOf(MoleculerError);
			}
		});

		it("should return cart details", async () =>
			await broker.call("cart.details", null, {
				meta: {
					auth: {
						userId: 1
					}
				}
			}).then(res => {
				expect(res).toBeInstanceOf(Object);
			}).catch(error => {
				expect(error).toBeInstanceOf(MoleculerError);
			})
		);
	});
});