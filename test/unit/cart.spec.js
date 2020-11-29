const {ServiceBroker} = require('moleculer');
const {ValidationError} = require('moleculer').Errors;

const cartService = require('../../services/cart.service');

const cart = {
    productId: '1',
    quantity: 4
};

const clearCartResult = {
    success: true,
    message: 'Cart cleared!'
};

describe("Test 'Cart' service", () => {
    const broker = new ServiceBroker();
    broker.createService(cartService);
    beforeAll(() => broker.start());
    afterAll(() => broker.stop());

    describe("Test 'cart.add' action", () => {
        it('should return confirmation on cart added', () =>
            expect(
                broker.call('cart.add', cart, {
                    meta: {
                        auth: {
                            userId: 1
                        }
                    }
                })
            ).resolves.toEqual({
                success: true,
                message: 'Product added to cart'
            }) ||
            expect(
                broker.call('cart.add', cart, {
                    meta: {
                        auth: {
                            userId: 1
                        }
                    }
                })
            ).rejects.toEqual({
                success: false,
                message: 'Product not found!'
            }));

        it('should throw ValidationError Error ', () =>
            expect(
                broker.call('cart.add', null, {
                    meta: {
                        auth: {
                            userId: 1
                        }
                    }
                })
            ).rejects.toBeInstanceOf(ValidationError));
    });

    describe("Test 'cart.clear' action", () => {
        it('should return confirmation on product added to cart', () =>
            expect(
                broker.call('cart.clear', null, {
                    meta: {
                        auth: {
                            userId: 1
                        }
                    }
                })
            ).resolves.toEqual(clearCartResult));
    });

    describe("Test 'cart.summary' action", () => {
        it('should return array of product objects stored in cart', () =>
            expect(
                broker.call('cart.summary', null, {
                    meta: {
                        auth: {
                            userId: 1
                        }
                    }
                })
            ).resolves.toBeInstanceOf(Object));
    });
});
