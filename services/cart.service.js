const { Service } = require("moleculer");
const { MoleculerClientError } = require("moleculer").Errors;

const apiResponse = require("../mixins/apiResponse.mixin");
const elasticSearch = require("../mixins/elasticSearch.mixin");

class CartService extends Service {
  constructor(broker) {
    super(broker);
    this.parseServiceSchema({
      name: "cart",
      mixins: [apiResponse, elasticSearch],
      actions: {
        /**
          * Check user is authenticated
          * If user is authenticated use user id from token
          * Add product to existing cart if product not exist
          * Update quantity only if product in cart exist
         */
        addToCart: {
          params: {
            productId: { type: "number" },
            quantity: { type: "number" },
          },
          async handler(ctx) {
            const { userId } = ctx.meta;
            return this.getCartByUserId(userId)
              .then((cartRes) => {
                const { productId, quantity } = ctx.params;
                if (Object.keys(cartRes).length > 0) {
                  const dbProduct = cartRes.product;
                  dbProduct.forEach((element) => {
                    if (element.productId === productId) {
                      element.quantity += quantity;
                    }
                  });
                  const found = dbProduct.some((el) => el.productId === productId);
                  if (!found) dbProduct.push({ productId, quantity });
                  return this.updateQuantity(
                    userId,
                    cartRes.id,
                    dbProduct,
                  ).then(() => this.success({}, "Product added to cart successfully."));
                }
                return this.addProductToCart(
                  userId,
                  productId,
                  quantity,
                ).then(() => this.success({}, "Product added to cart successfully."));
              })
              .catch((error) => {
                throw new MoleculerClientError(
                  error.message,
                  error.code || 500,
                  null,
                );
              });
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
