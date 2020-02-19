"use strict";

require("dotenv").config();

const { MoleculerError } = require("moleculer").Errors;
const redis = require("redis");
const MESSAGE_CONSTANT = require("../lib/Constants");
const Common = require("./common.mixin");
const redisClient = redis.createClient(
	process.env.REDIS_PORT,
	process.env.REDIS_HOST
);
redisClient.on("error", function () {
	throw new MoleculerError(MESSAGE_CONSTANT.SOMETHING_WRONG, 500);
});
redisClient.on("connect", function () {
	//console.log("Redis client connected");
});
module.exports = {
	name: "redis",
	mixins: [Common],
	methods: {
		getRsObject: function () {
			return redisClient;
		},

		hset: async function (cart, hash, obj) {
			return new Promise((resolve, reject) => {
				redisClient.hset(
					cart,
					hash,
					obj,
					async (error, res) => {
						if (error) {
							reject(error);
						} else {
							resolve(res);
						}
					});
			});
		},

		hget: async function (cart, hash) {
			return new Promise((resolve, reject) => {
				redisClient.hget(
					cart,
					hash,
					async (error, res) => {
						if (error) {
							reject(error);
						} else {
							resolve(res);
						}
					});
			});
		},

		addToCart: async function (data) {
			let cart = {};
			return await this.hget("productCart", data.userId).then(async (res, error) => {
				if (error) throw new MoleculerError(error, 500);
				if (res) cart = JSON.parse(res);
				cart[data.productId] = cart[data.productId] ? ((+cart[data.productId]) + (+data.quantity)) : +data.quantity;
				await this.hset("productCart", data.userId, JSON.stringify(cart)).then(async (res, error) => {
					if (error) throw new MoleculerError(MESSAGE_CONSTANT.SOMETHING_WRONG, 500);
					return Promise.resolve(res);
				});
			});
		},

		cartDetails: async function (data) {
			let cart = {};
			return await this.hget("productCart", data.userId).then(async (res, error) => {
				if (error) throw new MoleculerError(error, 500);
				if (res) cart = JSON.parse(res);
				return Promise.resolve(cart);
			});
		}
	}
};
