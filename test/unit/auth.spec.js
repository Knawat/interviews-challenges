const { ServiceBroker } = require("moleculer");
const { ValidationError, MoleculerError } = require("moleculer").Errors;
const authService = require("../../services/auth.service");
const JoiValidator = require("../../lib/JoiValidator");

describe("Test 'Auth' service", () => {
	const broker = new ServiceBroker({
		validator: new JoiValidator()
	});

	broker.createService(authService);

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	describe("Test 'authService.login' action with credentials", () => {

		it("should throw ValidationError if fields are empty", async () => {
			try {
				await broker.call("auth.login");
			} catch (e) {
				expect(e).toBeInstanceOf(ValidationError);
			}
		});

		it("should throw ValidationError if email is not entering", async () => {
			try {
				await broker.call("auth.login",
					{
						password: "123456789"
					}
				);
			} catch (e) {
				expect(e).toBeInstanceOf(ValidationError);
			}
		});

		it("should throw ValidationError if password is not entering", async () => {
			try {
				await broker.call("auth.login",
					{
						email: "divya.kanak@tatvasoft.com"
					}
				);
			} catch (e) {
				expect(e).toBeInstanceOf(ValidationError);
			}
		});

		it("should return user object with user details and token", async () =>
			await expect(broker.call("auth.login",
				{
					email: "divya.kanak@tatvasoft.com",
					password: "123456789"
				}
			)).resolves.toBeInstanceOf(Object)
		);
	});

	describe("Test 'authService.registration' action with credentials", () => {
		let random = Math.random().toString(36).substring(7);

		it("should throw ValidationError if fields are empty", async () => {
			try {
				await broker.call("auth.registration");
			} catch (e) {
				expect(e).toBeInstanceOf(ValidationError);
			}
		});

		it("should throw ValidationError if email is not entering", async () => {
			try {
				await broker.call("auth.registration",
					{
						password: "123456789",
						name: random
					}
				);
			} catch (e) {
				expect(e).toBeInstanceOf(ValidationError);
			}
		});

		it("should throw ValidationError if password is not entering", async () => {
			try {
				await broker.call("auth.registration",
					{
						email: "divya.kanak@tatvasoft.com",
						name: random
					}
				);
			} catch (e) {
				expect(e).toBeInstanceOf(ValidationError);
			}
		});

		it("should throw ValidationError if name is not entering", async () => {
			try {
				await broker.call("auth.registration",
					{
						email: "divya.kanak@tatvasoft.com",
						password: "123456789"
					}
				);
			} catch (e) {
				expect(e).toBeInstanceOf(ValidationError);
			}
		});

		it("should return Object with user id", async () =>
			await expect(broker.call("auth.registration",
				{
					email: "divya.kanak." + random + "@tatvasoft.com",
					password: "123456789",
					name: random
				}
			)).resolves.toBeInstanceOf(Object)
		);

		it("should throw MoleculerError if Email is already exist.", async () =>
			await expect(broker.call("auth.registration", {
				email: "divya.kanak@tatvasoft.com",
				password: "123456789",
				name: "divya"
			})).rejects.toBeInstanceOf(MoleculerError));
	});

});