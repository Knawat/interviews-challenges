"use strict";

const { ServiceBroker } = require("moleculer");
// const { ValidationError } = require("moleculer").Errors;
const productsTestService = require("../../services/products.service");
const esTestsService = require("../../services/es.service");
// const { MoleculerClientError } = require("moleculer").Errors;
const { products_service_input } = require("../tester-input");

describe("Test 'products' service", async () => {
    let broker = new ServiceBroker();
    beforeAll(async () => {
        await broker.createService(esTestsService);
        await broker.createService(productsTestService);
        await broker.start();
    });

    afterAll(async () => {
        await broker.stop()
    });
    describe("Test 'products.create' action", async () => {
        let productObj = products_service_input;
        it("should return success if it added successfully", async () => {
            expect(await broker.call("products.create", productObj))
                .toMatchObject({
                    success: true
                })
        });
        // it("should return params validation error", async () => {
        //     expect(await broker.call("products.create", null))
        //         .rejects.toBeInstanceOf(ValidationError);
        // });
    });
    describe("Test 'products.query' action", async () => {
        let productObj = {
            index: products_service_input.index,
            q: products_service_input.body.name
        };
        it("should return success and list of results if found matches", async () => {
            expect(await broker.call("products.query", productObj))
                .toMatchObject({
                    success: true
                })
        });
    });
});

