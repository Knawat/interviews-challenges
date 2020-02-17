const { Service } = require("moleculer");
const { MoleculerClientError } = require("moleculer").Errors;

const apiResponse = require("../mixins/apiResponse.mixin");
const elasticSearch = require("../mixins/elasticSearch.mixin");
const common = require("../mixins/common.mixin");

class ProductService extends Service {
  constructor(broker) {
    super(broker);
    this.parseServiceSchema({
      name: "product",
      mixins: [apiResponse, elasticSearch, common],
      actions: {
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
