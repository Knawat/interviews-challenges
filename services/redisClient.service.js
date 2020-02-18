"use strict";

const Redis = require("../mixins/redis.mixin");

module.exports = {
	name: "redisClient",
	mixins: [Redis],
	actions: {
		add_to_cart: {
			async handler(ctx) {
				return await this.addToCart(ctx.params);
			}
		}
	}
};
