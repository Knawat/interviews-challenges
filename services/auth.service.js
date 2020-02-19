const { Service } = require("moleculer");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MoleculerClientError } = require("moleculer").Errors;

const apiResponse = require("../mixins/apiResponse.mixin");
const elasticSearch = require("../mixins/elasticSearch.mixin");
const common = require("../mixins/common.mixin");

class AuthService extends Service {
  constructor(broker) {
    super(broker);

    const salt = bcrypt.genSaltSync(10);
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
            email: { type: "email" },
            password: { type: "string" },
          },
          handler(ctx) {
            return this.getUserByEmail(ctx.params.email)
              .then((userData) => {
                if (Object.keys(userData).length > 0) {
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
        login: {
          params: {
            email: { type: "email" },
            password: { type: "string" },
          },
          handler(ctx) {
            return this.getUserByEmail(ctx.params.email)
              .then(async (userData) => {
                const reqPassword = ctx.params.password;
                const isValidPass = await this.validatePassword(reqPassword, userData.password);
                if (Object.keys(userData).length > 0 && isValidPass) {
                  const authToken = await jwt.sign({ userId: userData.userId }, salt);
                  return this.success(
                    { auth_token: authToken },
                    "Auth token generated successfully.",
                  );
                }
                throw new MoleculerClientError(
                  "Invalid Email password.",
                  401,
                  null,
                );
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
        /**
         * verify jwt auth token
         */
        verifyToken: {
          params: {
            authToken: { type: "string" },
          },
          handler(ctx) {
            return jwt.verify(ctx.params.authToken, salt);
          },
        },
        /**
         * seeder
         */
        seeder() {
          const userSeeded = this.seedUser();
          const seedProduct = this.seedProduct();
          const seedCart = this.seedCart();

          return Promise.all([userSeeded, seedProduct, seedCart])
            .then(() => this.success({}, "Test data Seeded successfully."))
            .catch((error) => {
              throw new MoleculerClientError(
                error.message,
                error.code || 500,
                null,
              );
            });
        },
      },
      methods: {
        createUser(requestData) {
          return this.Promise.resolve()
            .then(async () => {
              const passwordHash = await this.passwordHash(requestData.password, salt);
              const uuidWithHyphen = await uuid();
              const userId = uuidWithHyphen.toString().replace(/-/g, "");
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
    });
  }
}

module.exports = AuthService;
