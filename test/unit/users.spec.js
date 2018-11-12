"use strict";

const { ServiceBroker } = require("moleculer");
const { ValidationError } = require("moleculer").Errors;
const usersTestService = require("../../services/users.service");
const { MoleculerClientError } = require("moleculer").Errors;
const { users_service_input } = require("../tester-input");


describe("Test 'users' service", async () => {
	let broker = new ServiceBroker();
	beforeAll(async () => {
		await broker.createService(usersTestService);
		await broker.start();
	});

	afterAll(async () => {
		await broker.stop()
	});

	// test cases
	describe("Test 'users.register' action", async () => {
		let userObj = { user: users_service_input };
		it("should return new registered user", async () => {
			expect(await broker.call("users.register", userObj))
				.toMatchObject({
					user: {
						name: users_service_input.name
					}
				})
		});
		// it("should return that user already registered", async () => {
		// 	await expect(
		// 		await broker.call("users.register", userObj)
		// 	).rejects.toBeInstanceOf(MoleculerClientError)
		// });
	});
	describe("Test 'users.login' action", async () => {
		let userObj = {
			user: {
				email: users_service_input.email,
				password: users_service_input.password
			}
		};
		it("should return user data", async () => {
			expect(await broker.call("users.login", userObj))
				.toMatchObject({
					user: {
						name: users_service_input.name,
						email: users_service_input.email,
					}
				})
		});
		// it("should return error with wrong credentials", async () => {
		// 	let fakeOne = {
		// 		user: {
		// 			email: users_service_input.email + "mm",
		// 			password: users_service_input.password
		// 		}
		// 	}
		// 	expect(await broker.call("users.login", fakeOne))
		// 		.rejects.toBeInstanceOf(MoleculerClientError)
		// });
	});
});

