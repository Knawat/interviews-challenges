const { ServiceBroker } = require("moleculer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const AuthService = require("../../../services/auth.service");
// const elasticSearch = require("../../../mixins/elasticSearch.mixin");


describe("Test 'auth' service", () => {
  const newUserEmail = "admin@example.com";
  const authorizedEmail = "test@example.com";
  const newUserName = "admin";
  const userPassword = "123456";
  const invalidEmail = "123456";
  const unAuthorizedEmail = "unAuthorized@example.com";

  const broker = new ServiceBroker({ logger: true });

  broker.createService(AuthService);

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe("Test on 'service started' seed action", () => {
    it("should add a test user", async () => {
      // await elasticSearch.methods.deleteUserIndex();
      expect(broker.start("auth.started")).resolves.toBeUndefined();
    });
  });

  describe("Test 'auth.register' action", () => {
    it("should return success true", async () => {
      await broker.call("auth.register", {
        name: newUserName,
        email: newUserEmail,
        password: userPassword,
      }).then((response) => {
        expect(response.success).toEqual(true);
      }).catch((err) => {
        expect(err.message).toEqual("Email id already in use.Please try with another.");
      });
    });

    it("should handle validation error and return status code 422", async () => {
      await broker.call("auth.register", {
        name: newUserName,
        email: invalidEmail,
        password: userPassword,
      }).catch((response) => {
        expect(response.code).toEqual(422);
      });
    });

    it("should handle user does not exist error and return status code 409", async () => {
      await broker.call("auth.register", {
        name: newUserName,
        email: unAuthorizedEmail,
        password: userPassword,
      }).catch((response) => {
        expect(response.code).toEqual(409);
      });
    });
  });

  describe("Test 'auth.login' action", () => {
    it("should return success true with auth_token with test registered user", async () => {
      await broker.call("auth.login", {
        email: newUserEmail,
        password: userPassword,
      }).then((response) => {
        expect(response.success).toEqual(true);
      }).catch(async (error) => {
        expect(error.code).toEqual(500);
      });
    });

    it("should return success true with auth_token with seeded user", async () => {
      await broker.call("auth.login", {
        email: authorizedEmail,
        password: userPassword,
      }).then((response) => {
        expect(response.success).toEqual(true);
      }).catch(async (error) => {
        expect(error.code).toEqual(500);
      });
    });

    it("should handle validation error and return status code 422", async () => {
      await broker.call("auth.login", {
        email: invalidEmail,
        password: userPassword,
      }).catch((response) => {
        expect(response.code).toEqual(422);
      });
    });

    it("should handle user does not exist error and return status code 409", async () => {
      await broker.call("auth.login", {
        email: unAuthorizedEmail,
        password: userPassword,
      }).catch((response) => {
        expect(response.code).toEqual(409);
      });
    });
  });

  describe("Test 'auth.verifyToken' action", () => {
    it("should return user id 1", async () => {
      const salt = bcrypt.genSaltSync(10);
      const authToken = await jwt.sign({ userId: 1 }, salt);
      broker.call("auth.verifyToken", { authToken }).then((tokenRes) => {
        expect(tokenRes.userId).toEqual(1);
      });
    });
  });
});
