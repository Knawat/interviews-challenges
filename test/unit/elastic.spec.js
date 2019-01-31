const { ServiceBroker } = require('moleculer');
const { ValidationError } = require('moleculer').Errors;

const elastic = require('../../services/elastic.service');

const params = {
  email: 'parth.jethwa@tatvasoft.com'
};
const params1 = {
  email: 'parth.jethwa@tatvasoft.com1'
};
const addDetails = {
  name: 'User Uesr',
  email: 'user@user.com',
  password: 'unittest'
};

const productWithId = {
  productId: '1'
};

const productWithWrongId = {
  productId: '100'
};

describe("Test 'Elastic' service", () => {
  const broker = new ServiceBroker();

  broker.createService(elastic);

  beforeAll(() => broker.start());
  afterAll(() => broker.stop());

  describe("Test 'elastic.fetch_users' action", () => {
    it('should return Object with userDetails on matching params ', () =>
      broker.call('elastic.fetch_users', params).then(
        // eslint-disable-next-line max-nested-callbacks
        data =>
          expect(data.success).toEqual(true) &&
          expect(typeof data.data).toEqual('object') &&
          expect(data.data.length).toBeGreaterThan(0)
      ));

    it('should return Object on not getting any result', () =>
      broker.call('elastic.fetch_users', params1).then(
        // eslint-disable-next-line max-nested-callbacks
        data => expect(data.success).toEqual(false) && expect(typeof data.data).toEqual('object')
      ));
  });

  describe("Test 'elastic.add_users' action", () => {
    it('should return Object with userDetails on matching params ', () =>
      expect(broker.call('elastic.add_users', addDetails)).resolves.toBeInstanceOf(Object));

    it('should throw ValidationError Error ', () =>
      expect(broker.call('elastic.add_users')).rejects.toBeInstanceOf(ValidationError));
  });

  describe("Test 'elastic.get_all_products' action", () => {
    it('should return array of products ', () =>
      expect(broker.call('elastic.get_all_products')).resolves.toBeInstanceOf(Object) ||
      expect(broker.call('elastic.get_all_products')).toEqual({
        success: false,
        message: 'No products found.'
      }));
  });

  describe("Test 'elastic.get_product_by_id' action", () => {
    it('should return Object with product details on matching product id ', () =>
      broker
        .call('elastic.get_product_by_id', productWithId)
        // eslint-disable-next-line max-nested-callbacks
        .then(data => expect(data).toBeInstanceOf(Object)));

    it('should be blank on not matching product id ', () =>
      broker
        .call('elastic.get_product_by_id', productWithWrongId)
        // eslint-disable-next-line max-nested-callbacks
        .then(data => expect(data).toEqual('')));

    it('should throw ValidationError Error ', () =>
      expect(broker.call('elastic.get_product_by_id')).rejects.toBeInstanceOf(ValidationError));
  });
});
