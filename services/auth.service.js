const { Service } = require("moleculer");
const apiResponse = require("../mixins/apiResponse.mixin");

class AuthService extends Service {
  constructor(broker) {
    super(broker);

    this.parseServiceSchema({
      name: "auth",
      mixins: [apiResponse],
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
    });
  }
}

module.exports = AuthService;
