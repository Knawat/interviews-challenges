const { Service } = require("moleculer");

const apiResponse = require("../mixins/apiResponse.mixin");

class CartService extends Service {
  constructor(broker) {
    super(broker);
    this.parseServiceSchema({
      name: "cart",
      mixins: [apiResponse],
      actions: {
        addToCart: {
          // Check user is authenticated
          // If user is authenticated use user id from token
          // Add product to existing cart if product not exist
          // Update quantity only if product in cart exist
          params: {
            productId: { type: "string" },
            quantity: { type: "number" },
          },
          async handler() {
            return this.success({}, "Product added to cart successfully.");
          },
        },
      },
    });
  }
}

module.exports = CartService;
