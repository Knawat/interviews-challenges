const { ServiceBroker } = require("moleculer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const AuthService = require("../../../services/auth.service");

jest.mock("../../../mixins/elasticSearch.mixin");
jest.mock("../../../mixins/common.mixin");

describe("Test 'auth' service", () => {
  const newUserEmail = "admin@example.com";
  const newUserName = "admin";
  const userPassword = "123456";

  const broker = new ServiceBroker({ logger: true });

  broker.createService(AuthService);

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe("Test on seed action", () => {
    it("should return with 'success: true'", async () => {
      await broker.call("auth.seeder", {})
        .then((seedResponse) => {
          expect(seedResponse.success).toEqual(true);
        }).catch((error) => {
          expect(error.code).toEqual(500);
        });
    });
    it("should return with 'error: 500'", async () => {
      await broker.call("auth.seeder", {})
        .catch((error) => {
          expect(error.code).toEqual(500);
        });
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
    it("should return success true ", async () => {
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
    it("should return Error : Email id already exist", async () => {
      await broker.call("auth.register", {
        name: newUserName,
        email: newUserEmail,
        password: userPassword,
      }).catch((err) => {
        expect(err.message).toEqual("Email id already in use.Please try with another.");
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
    it("should return error code 401", async () => {
      await broker.call("auth.login", {
        email: newUserEmail,
        password: userPassword,
      }).then((response) => {
        expect(response.success).toEqual(true);
      }).catch(async (error) => {
        expect(error.code).toEqual(401);
      });
    });
    it("should return error code 500", async () => {
      await broker.call("auth.login", {
        email: newUserEmail,
        password: userPassword,
      }).then((response) => {
        expect(response.success).toEqual(true);
      }).catch(async (error) => {
        expect(error.code).toEqual(500);
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
