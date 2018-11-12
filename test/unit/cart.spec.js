"use strict";

const { ServiceBroker } = require("moleculer");
const { ValidationError } = require("moleculer").Errors;
const cartTestService = require("../../services/cart.service");
const { cart_service_input } = require("../tester-input");

describe("Test 'cart' service", async () => {
    let broker = new ServiceBroker();
    beforeAll(async () => {
        await broker.createService(cartTestService);
        await broker.start();
    });

    afterAll(async () => {
        await broker.stop()
    });

    // test cases
    describe("Test 'cart.addOne' action", async () => {
        // it("should return false because of params validation ", async () => {
        //     expect(await broker.call("cart.addOne", null, {
        //         meta: {
        //             userId: cart_service_input.generalDetails.userId
        //         }
        //     }))
        //          .rejects.toBeInstanceOf(ValidationError);
        // });
        let cartProduct = cart_service_input.productDetails;
        it("should return success if product added successfully", async () => {
            expect(await broker.call("cart.addOne", cartProduct, {
                meta: {
                    userId: cart_service_input.generalDetails.userId
                }
            }))
                .toMatchObject({
                    success: true
                })
        });
        it("should find product and add its count", async () => {
            expect(await broker.call("cart.addOne", cartProduct, {
                meta: {
                    userId: cart_service_input.generalDetails.userId
                }
            }))
                .toMatchObject({
                    success: true
                })
        });

    });
    describe("Test 'cart.summary' action", async () => {
        it("should return user cart summary", async () => {
            await expect(await broker.call("cart.summary", null, {
                meta: {
                    userId: cart_service_input.generalDetails.userId
                }
            }))
                .toMatchObject({
                    success: true
                })
        });
    });
});

