"use strict";

const { MoleculerClientError } = require("moleculer").Errors;
const { ForbiddenError } = require("moleculer-web").Errors;

const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");

module.exports = {
  name: "cart",
  mixins: [DbService("cart"), CacheCleanerMixin(["cache.clean.cart"])],

  /**
   * Default settings
   */
  settings: {
    fields: ["_id", "productId", "amount", "createdAt", "updatedAt"]
  },

  /**
   * Actions
   */
  actions: {
    /**
     * Create a new article.
     * Auth is required!
     *
     * @actions
     * @param {Object} article - Article entity
     *
     * @returns {Object} Created entity
     */
    addToCart: {
      auth: "required",
      params: {
        productId: { type: "string" },
        amount: { type: "number", positive: true, integer: true }
      },
      handler(ctx) {
        let product = ctx.params;
        product.createdAt = new Date();
        product.updatedAt = new Date();
        product.userId = ctx.meta.userId;
        return new this.Promise((resolve, reject) => {
          this.adapter
            .findOne({
              userId: product.userId,
              productId: product.productId
            })
            .then(prodFound => {
              if (prodFound) {
                prodFound.amount = prodFound.amount + product.amount;
                this.adapter
                  .updateById(prodFound._id, {
					  $set: { amount: prodFound.amount }
                  })
                  .then(prodUpdated => {
                    if (prodUpdated) resolve({ success: true });
                  })
                  .catch(err => reject({ success: false, msg: err }));
              } else if (!prodFound) {
                this.adapter
                  .insert(product)
                  .then(prodInserted => {
                    if (prodInserted) resolve({ success: true });
                  })
                  .catch(err => reject({ success: false, msg: err }));
              }
            })
            .catch(err => reject({ success: false, msg: err }));
        });
      }
    },
    summary: {
      handler(ctx) {
        return new this.Promise((resolve, reject) => {
          this.adapter
            .find({
              userId: ctx.meta.userId
            })
            .then(data => {
              resolve({ success: true, data: data });
            })
            .catch(err => reject({ success: false, msg: err }));
        });
      }
    }
  },

  /**
   * Methods
   */
  methods: {
    /**
     * Transform a result entity to follow the RealWorld API spec
     *
     * @param {Context} ctx
     * @param {Object} entity
     * @param {Object} user - Logged in user
     */
    transformEntity(ctx, entity, user) {
      if (!entity) return this.Promise.resolve();

      return this.Promise.resolve(entity);
    }
  }
};
