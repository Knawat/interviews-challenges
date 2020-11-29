const {ServiceBroker} = require('moleculer');
const {ValidationError} = require('moleculer').Errors;

const users = require('../../services/users.service');

const params = {
    email: 'dev.ahmed.zidan@gmail.com'
};
const params1 = {
    email: 'dev.ahmed.zidan@gmail.com1'
};
const addDetails = {
    name: 'User Uesr',
    email: 'user@user.com',
    password: 'password'
};

describe("Test 'Users' service", () => {
    const broker = new ServiceBroker();

    broker.createService(users);

    beforeAll(() => broker.start());
    afterAll(() => broker.stop());

    describe("Test 'users.fetch_all' action", () => {
        it('should return Object with userDetails on matching params ', () =>
            broker.call('users.fetch_all', params).then(
                // eslint-disable-next-line max-nested-callbacks
                data =>
                    expect(data.success).toEqual(true) &&
                    expect(typeof data.data).toEqual('object') &&
                    expect(data.data.length).toBeGreaterThan(0)
            ));

        it('should return Object on not getting any result', () =>
            broker.call('users.fetch_all', params1).then(
                // eslint-disable-next-line max-nested-callbacks
                data => expect(data.success).toEqual(false) && expect(typeof data.data).toEqual('object')
            ));
    });

    describe("Test 'users.add' action", () => {
        it('should return Object with userDetails on matching params ', () =>
            expect(broker.call('users.add', addDetails)).resolves.toBeInstanceOf(Object));

        it('should throw ValidationError Error ', () =>
            expect(broker.call('users.add')).rejects.toBeInstanceOf(ValidationError));
    });
});
