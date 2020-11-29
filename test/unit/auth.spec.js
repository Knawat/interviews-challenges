const { ServiceBroker } = require('moleculer');
const { ValidationError, MoleculerClientError } = require('moleculer').Errors;

const auth = require('../../services/auth.service');
const users = require('../../services/users.service');

const loginDetails = {
  email: 'dev.ahmed.zidan@gmail.com',
  password: 'test123'
};
const test1 = {
  email: 'dev.ahmed.zidan@gmail.com'
};
const test2 = {
  email: 'dev.ahmed.zidan@gmail.com',
  password: 'password1'
};

const registrationDetails = {
  name: 'testing User',
  email: `unit${Math.floor(Math.random() * 100)}@test.com`,
  password: 'password2'
};
const rTest1 = {
  name: 'testing User 2',
  email: 'dev.ahmed.zidan@gmail.com',
  password: 'password3'
};

describe("Test 'Auth' service", () => {
  const broker = new ServiceBroker();

  broker.createService(auth);
  broker.createService(users);

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe("Test 'auth.login' action with credentials", () => {
    it('should return Object with userDetails on matching credentials ', () =>
      broker.call('auth.login', loginDetails).then(
        // eslint-disable-next-line max-nested-callbacks
        data =>
          expect(data.success).toEqual(true) &&
          expect(typeof data.data.user).toEqual('object') &&
          expect(typeof data.data.token).toEqual('string') &&
          expect(data.data.token.length).toBeGreaterThan(0)
      ));

    it('should throw MolecularClient Error without entering password', () =>
      expect(broker.call('auth.login', test1)).rejects.toBeInstanceOf(MoleculerClientError));

    it('should throw MolecularClient Error on wrong credentials', () =>
      expect(broker.call('auth.login', test2)).rejects.toBeInstanceOf(MoleculerClientError));

    it('should throw ValidationError on sending empty field values', () =>
      expect(broker.call('auth.login')).rejects.toBeInstanceOf(ValidationError));
  });

  describe("Test 'auth.register' action with credentials", () => {
    it('should return Object with registration id ', () =>
      expect(broker.call('auth.register', registrationDetails)).resolves.toBeInstanceOf(Object));

    it('should throw MolecularClient Error on registering through registered email ', () =>
      expect(broker.call('auth.register', rTest1)).rejects.toBeInstanceOf(MoleculerClientError));

    it('should throw ValidationError Error ', () =>
      expect(broker.call('auth.register')).rejects.toBeInstanceOf(ValidationError));
  });
});
