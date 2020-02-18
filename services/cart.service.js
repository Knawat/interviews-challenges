const { Service } = require("moleculer");

const apiResponse = require("../mixins/apiResponse.mixin");
const elasticSearch = require("../mixins/elasticSearch.mixin");

class CartService extends Service {
  constructor(broker) {
    super(broker);
    this.parseServiceSchema({
      name: "cart",
      mixins: [apiResponse, elasticSearch],
      actions: {
        addToCart: {
          // Check user is authenticated
          // If user is authenticated use user id from token
          // Add product to existing cart if product not exist
          // Update quantity only if product in cart exist
          params: {
            productId: { type: "number" },
            quantity: { type: "number" },
          },
          async handler() {
            return this.success({}, "Product added to cart successfully.");
          },
        },
      },
      started() {
        this.isCartIndexExist()
          .then(async (isCartIndexExist) => {
            if (!isCartIndexExist) {
              await this.createCartIndex();
              const cartData = await this.addTestCartData();
              this.logger.info(">>> Cart seeded", cartData);
            } else {
              this.logger.info(">>> Cart index already exist");
            }
          })
          .catch((error) => {
            this.logger.error(">>> Cart seed error", error);
          });
      },
    });
  }
}

module.exports = CartService;
