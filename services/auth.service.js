const { Service } = require("moleculer");
const uuid = require("uuid");

const { MoleculerClientError } = require("moleculer").Errors;
const apiResponse = require("../mixins/apiResponse.mixin");
const elasticSearch = require("../mixins/elasticSearch.mixin");
const common = require("../mixins/common.mixin");

class AuthService extends Service {
  constructor(broker) {
    super(broker);

    this.parseServiceSchema({
      name: "auth",
      mixins: [apiResponse, elasticSearch, common],
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
            password: { type: "string" },
          },
          handler(ctx) {
            return this.getUserByEmail(ctx.params.email)
              .then((userData) => {
                if (userData.hits.hits.length > 0) {
                  throw new MoleculerClientError(
                    "Email id already in use.Please try with another.",
                    409,
                    null,
                  );
                }
                return this.createUser(ctx.params);
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
      methods: {
        createUser(requestData) {
          return this.Promise.resolve()
            .then(async () => {
              const passwordHash = await this.passwordHash(
                requestData.password,
              );
              const userId = await uuid();
              this.addUser(
                requestData.email,
                requestData.name,
                passwordHash,
                userId,
              );
            })
            .then(() => this.success({}, "User registered successfully."))
            .catch((error) => {
              throw new MoleculerClientError(
                error.message,
                error.code || 500,
                null,
              );
            });
        },
      },
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
