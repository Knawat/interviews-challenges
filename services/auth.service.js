const { Service } = require("moleculer");
const apiResponse = require("../mixins/apiResponse.mixin");
const elasticSearch = require("../mixins/elasticSearch.mixin");

class AuthService extends Service {
  constructor(broker) {
    super(broker);

    this.parseServiceSchema({
      name: "auth",
      mixins: [apiResponse, elasticSearch],
      actions: {
        /**
         * Check user with same email id exist
         * Throw error and say please try again with different email id
         * If email does not exist then create new user by calling create user service.
         */
        register: {
          params: {
            name: { type: "string" },
            email: { type: "string" },
            userId: { type: "number" },
            password: { type: "string" },
          },
          handler() {
            return this.success({}, "User registered successfully.");
          },
        },
      },
      methods: {},
      started() {
        this.isUserIndexExist()
          .then(async (isUserIndexExist) => {
            if (!isUserIndexExist) {
              await this.createUserIndex();
              const userData = await this.addTestUserData();
              this.logger.info(">>> User seeded", userData);
            } else {
              this.logger.info(">>> User index already exist");
            }
          })
          .catch((error) => {
            this.logger.error(">>> User seed error", error);
          });
      },
    });
  }
}

module.exports = AuthService;
