const {ServiceBroker} = require('moleculer');
const product = require('../../services/products.service');

describe("Test 'Product' service", () => {
    const broker = new ServiceBroker();
    broker.createService(product);

    beforeAll(() => broker.start());
    afterAll(() => broker.stop());

    describe("Test 'products.list' action", () => {
        it('should return array of products', () =>
            // eslint-disable-next-line max-nested-callbacks
            broker.call('products.list').then(products => {
                expect(products.success).toEqual(true);
            }));
    });
});
