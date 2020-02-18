const { Service } = require("moleculer");
const { MoleculerClientError } = require("moleculer").Errors;

const apiResponse = require("../mixins/apiResponse.mixin");
const elasticSearch = require("../mixins/elasticSearch.mixin");

class ProductService extends Service {
  constructor(broker) {
    super(broker);
    this.parseServiceSchema({
      name: "product",
      mixins: [apiResponse, elasticSearch],
      actions: {
        getProducts: {
          cache: true,
          async handler(ctx) {
            return this.getProductData()
              .then(products => {
                const productsDetails = [];
                for (const product of products.hits.hits) {
                  productsDetails.push({ id: product._id, ...product._source });
                }
                return this.success(productsDetails);
              })
              .catch(error => {
                throw new MoleculerClientError(
                  error.message,
                  error.code || 500,
                  null,
                );
            });
          }
        }
      },
      started() {
        this.isProductIndexExist()
          .then(async (isProductIndexExist) => {
            if (!isProductIndexExist) {
              await this.createProductsIndex();
              const product = await this.addTestProductsData();
              this.logger.info(">>> Product seeded", product);
            } else {
              this.logger.info(">>> Product index already exist");
            }
          })
          .catch((error) => {
            this.logger.error(">>> Product seed error", error);
          });
      },
    });
  }
}

module.exports = ProductService;
