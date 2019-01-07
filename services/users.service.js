"use strict";

const { MoleculerClientError } = require("moleculer").Errors;

//const crypto 		= require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuidv4 = require("uuid/v4");

module.exports = {
  name: "users",

  /**
   * Default settings
   */
  settings: {
    /** Secret for JWT */
    JWT_SECRET: process.env.JWT_SECRET || "jwt-knawat-secret",
    /** Public fields */
    fields: ["_id", "name", "email"],

    /** Validator schema for entity */
    entityValidator: {
      name: { type: "string", min: 2, pattern: /^[a-zA-Z0-9]+$/ },
      password: { type: "string", min: 6 },
      email: { type: "email" }
    }
  },

  /**
   * Actions
   */
  actions: {
    /**
     * Register a new user
     *
     * @actions
     * @param {Object} user - User entity
     *
     * @returns {Object} Created entity & token
     */
    createUser: {
      params: {
        user: {
          type: "object"
        }
      },
      handler(ctx) {
        let entity = ctx.params.user;
        // return this.validateEntity(entity)
        //   .then(() => {
        if (entity.email)
          return (
            this.broker
              .call("es.count", {
                index: "users",
                body: {
                  query: {
                    term: {
                      email: entity.email
                    }
                  }
                }
              })
              .then(search => {
                if (search.count > 0)
                  return Promise.reject(
                    new MoleculerClientError("Email is exist!", 422, "", [
                      {
                        field: "email",
                        message: "is exist"
                      }
                    ])
                  );
              })
              // return this.adapter
              //   .findOne({ email: entity.email })
              //   .then(found => {
              //     if (found)
              //       return Promise.reject(
              //         new MoleculerClientError("Email is exist!", 422, "", [
              //           { field: "email", message: "is exist" }
              //         ])
              //       );
              //   });
              // })
              .then(() => {
                entity.password = bcrypt.hashSync(entity.password, 10);
                entity.createdAt = new Date();

                return this.broker
                  .call("es.create", {
                    index: "users",
                    type: "_doc",
                    id: uuidv4(),
                    body: entity
                  })
                  .then(user =>
                    this.transformEntity(user, true, ctx.meta.token)
                  );
              })
          );
      }
    },

    /**
     * Login with email & password
     *
     * @actions
     * @param {Object} user - User credentials
     *
     * @returns {Object} Logged in user with token
     */
    login: {
      params: {
        user: {
          type: "object",
          props: {
            email: { type: "email" },
            password: { type: "string", min: 1 }
          }
        }
      },
      handler(ctx) {
        const { email, password } = ctx.params.user;

        return this.Promise.resolve()
          .then(() =>
            this.broker.call("es.search", {
              index: "users",
              body: {
                query: {
                  term: {
                    email: email
                  }
                }
              }
            })
          )
          .then(user => {
            if (user.hits.total != 1)
              return this.Promise.reject(
                new MoleculerClientError(
                  "Email or password is invalid!",
                  422,
                  "",
                  [{ field: "email", message: "is not found" }]
                )
              );
            user = user.hits.hits[0]._source
            this.logger.info(user)
            return bcrypt.compare(password, user.password).then(res => {
              if (!res)
                return Promise.reject(
                  new MoleculerClientError("Wrong password!", 422, "", [
                    { field: "email", message: "is not found" }
                  ])
                );

              return {
                name: user.name,
                email: user.email
              }
            });
          })
          .then(user => this.transformEntity(user, true, ctx.meta.token));
      }
    },

    /**
     * Get user by JWT token (for API GW authentication)
     *
     * @actions
     * @param {String} token - JWT token
     *
     * @returns {Object} Resolved user
     */
    resolveToken: {
      cache: {
        keys: ["token"],
        ttl: 60 * 60 // 1 hour
      },
      params: {
        token: "string"
      },
      handler(ctx) {
        return new this.Promise((resolve, reject) => {
          jwt.verify(
            ctx.params.token,
            this.settings.JWT_SECRET,
            (err, decoded) => {
              if (err) return reject(err);

              resolve(decoded);
            }
          );
        }).then(decoded => {
          if (decoded.id) return this.getById(decoded.id);
        });
      }
    }
  },

  /**
   * Methods
   */
  methods: {
    /**
     * Generate a JWT token from user entity
     *
     * @param {Object} user
     */
    generateJWT(user) {
      const today = new Date();
      const exp = new Date(today);
      exp.setDate(today.getDate() + 60);

      return jwt.sign(
        {
          id: user._id,
          username: user.username,
          exp: Math.floor(exp.getTime() / 1000)
        },
        this.settings.JWT_SECRET
      );
    },

    /**
     * Transform returned user entity. Generate JWT token if neccessary.
     *
     * @param {Object} user
     * @param {Boolean} withToken
     */
    transformEntity(user, withToken, token) {
      if (user) {
        if (withToken) user.token = token || this.generateJWT(user);
      }

      return { user };
    }
  }
};
