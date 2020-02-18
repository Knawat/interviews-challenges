"use strict";

require("dotenv").config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const MESSAGE_CONSTANT = require("../lib/Constants");

module.exports = {
	name: "common",
	methods: {
		hashPassword: function (password) {
			return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
		},
		comparePassword: function (hashPassword, password) {
			return bcrypt.compareSync(password, hashPassword);
		},
		generateToken: function (user) {
			return new Promise((resolve, reject) => {
				jwt.sign({ userID: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIREIN },
					(error, token) => {
						if (error) {
							reject(error);
						} else {
							resolve(token);
						}
					});
			});
		},
		verifyToken: function (token) {
			return new Promise(function (resolve, reject) {
				jwt.verify(token, process.env.JWT_SECRET, function (
					err,
					res
				) {
					if (err) {
						if (err.name == "JsonWebTokenError")
							reject({
								message: MESSAGE_CONSTANT.INVALID_TOKEN
							});
						if (err.name == "TokenExpiredError")
							reject({
								message: MESSAGE_CONSTANT.EXPIRED_TOKEN
							});
						if (err.name == "NotBeforeError")
							reject({
								message: MESSAGE_CONSTANT.INACTIVE_TOKEN
							});
						reject({
							message: MESSAGE_CONSTANT.AUTH_FAIL
						});
					}
					resolve(res);
				});
			});
		},
		asyncForEach: async function (array, callback, thisArg) {
			const promiseArray = [];
			for (let i = 0; i < array.length; i += 1) {
				if (i in array) {
					const p = this.Promise.resolve(array[i]).then(currentValue =>
						callback.call(thisArg || this, currentValue, i, array)
					);
					promiseArray.push(p);
				}
			}
			await this.Promise.all(promiseArray);
		}
	}
};