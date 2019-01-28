const { ServiceBroker } = require('moleculer');
const { ValidationError, MoleculerClientError } = require('moleculer').Errors;

const elastic = require('../../services/elastic.service');
const auth = require('../../services/auth.service');

const loginDetails = {
  email: 'parth.jethwa@tatvasoft.com',
  password: 'test123'
};
const test1 = {
  email: 'parth.jethwa@tatvasoft.com'
};
const test2 = {
  email: 'parth.jethwa@tatvasoft.com',
  password: 'test1234'
};

const registrationDetails = {
  name: 'testing User',
  email: 'unit@test.com',
  password: 'unittest'
};
const rTest1 = {
  name: 'testing User 2',
  email: 'parth.jethwa@tatvasoft.com',
  password: 'unittest'
};

describe("Test 'Auth' service", () => {
  const broker = new ServiceBroker();
  
  broker.createService(elastic);
  broker.createService(auth);

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe("Test 'auth.login' action with credentials", () => {
    it('should return Object with userDetails on matching credentials ', async () => 
      // eslint-disable-next-line max-nested-callbacks
      broker.call('auth.login', loginDetails).then(data => {
				
        expect(data.success).toEqual(true);
				expect(typeof data.data.user).toEqual('object');
				
        expect(typeof data.data.token).toEqual('string');
        expect(data.data.token.length).toBeGreaterThan(0);
      })
    );

    it("should throw MolecularClient Error without entering password", async () => {
			await expect(broker.call("auth.login", test1)).rejects.toBeInstanceOf(MoleculerClientError);
		});

		it("should throw MolecularClient Error on wrong credentials", async () => {
			await expect(broker.call("auth.login", test2)).rejects.toBeInstanceOf(MoleculerClientError);
		});

		it("should throw ValidationError on sending empty field values", async () => {
			await expect(broker.call("auth.login")).rejects.toBeInstanceOf(ValidationError);
		});
  });

  describe("Test 'auth.register' action with credentials", () => {
    it("should return Object with registration id ", () => {
			expect(broker.call("auth.register", registrationDetails)).resolves.toBeInstanceOf(Object);
		});

    it('should throw MolecularClient Error on registering through registered email ', () => {
      expect(broker.call('auth.register', rTest1)).rejects.toBeInstanceOf(MoleculerClientError);
    });

    it('should throw ValidationError Error ', () => {
      expect(broker.call('auth.register')).rejects.toBeInstanceOf(ValidationError);
    });
  });
});
