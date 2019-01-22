const { Service } = require('moleculer');
const jwt = require('jsonwebtoken');
const { MoleculerClientError } = require('moleculer').Errors;
const RedisService = require('../mixins/redis.mixin');
const CommonService = require('../mixins/common.mixin');
const ElasticMixin = require('../mixins/elastic.mixin');
/**
 * Handles User Authentication
 *
 * @class AuthService
 * @extends {Service}
 */
class AuthService extends Service {
  /**
   * Creates an instance of AuthService.
   *
   * @param {ServiceBroker} broker
   * @memberof AuthService
   */
  constructor(broker) {
    super(broker);

    this.parseServiceSchema({
      name: 'auth',
      mixins: [RedisService, CommonService, ElasticMixin],
      /**
       * Service dependencies
       */
      dependencies: [],

      /**
       * Service settings
       */
      settings: {},
      /**
       * Service metadata
       */
      metadata: {},

      actions: {
        /**
         * Login user
         *
         * @actions
         * @param {String} email - email address
         * @param {String} password - password
         *
         * @returns {Promise} API reponse with user info
         */
        login: {
          params: {
            email: { type: 'string' },
            password: { type: 'string' }
          },
          cache: false,
          async handler(ctx) {
            return this.fetchUsers(ctx.params).then(async result => {
              if ('status' in result && !result.status) {
                throw new MoleculerClientError('email or password is invalid!', 422, '', [
                  {
                    field: 'email',
                    message: 'email or password is invalid!'
                  },
                  {
                    field: 'success',
                    message: false
                  }
                ]);
              }
              const user = result[0];
              const userId = user.id;

              // delete old token
              await this.executeRedisCommand('hdel', ['userHash', userId]);

              const token = await this.generateToken(user);

              // set token in redis to maintain session on server
              await this.executeRedisCommand('hmset', ['userHash', { [userId]: token }]);

              return this.Promise.resolve({
                succes: true,
                message: 'Login Successfull',
                data: {
                  token: token,
                  user: user
                }
              });
            });
          }
        },
        /**
         * Register user
         *
         * @actions
         * @param {String} name - name
         * @param {String} email - email address
         * @param {String} password - password
         *
         * @returns {Promise} API reponse with message
         */
        register: {
          params: {
            name: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' }
          },
          async handler(ctx) {
            const { email } = ctx.params;

            const verificationData = {
              email: email
            };

            return this.fetchUsers(verificationData)
              .then(async result => {
                if ('status' in result && !result.status) {
                  return this.Promise.resolve(true);
                }
                throw new MoleculerClientError('email already exist!', 422, '', [
                  {
                    field: 'email',
                    message: 'email already exist!'
                  },
                  {
                    field: 'success',
                    message: false
                  }
                ]);
              })
              .then(async uniqueEmail => {
                
								if (!uniqueEmail) {
                  return this.Promise.reject({ status: false, message: 'Email already exist!' });
								}
								
                return this.addUsers(ctx.params).then(result =>
                  this.Promise.resolve({ status: true, message: 'Registration successfull!', id: result._id })
                );
              });
          }
        },
        /**
         * Verify User with JWT token
         *
         * @actions
         * @param {String} token - JWT token
         *
         * @returns {Object} Resolved user
         */
        verifyToken: {
          cache: {
            keys: ['token'],
            ttl: 60 * 60 * 24 * process.env.EXPIRE // expire time
          },
          params: {
            token: 'string'
          },
          handler(ctx) {
            return new this.Promise((resolve, reject) => {
              jwt.verify(ctx.params.token, process.env.SECRET, (err, decoded) => {
                if (err) return reject(err);

                resolve(decoded);
              });
            }).then(decoded => {
              if (decoded.id) return decoded;
            });
          }
        }
      }
    });
  }

  /**
   * get user token from userHash
   *
   * @param {String} userId - user id
   * @returns {String} Token - stored token from rediss
   * @memberof AuthService
   */
  async getUserTokenFromHash(userId) {
    const token = await this.executeRedisCommand('hget', ['userHash', userId]);
    return token;
  }

  /**
   * generate JWT token from user
   *
   * @param {Object} user
   * @returns {String} Token
   * @memberof AuthService
   */
  async generateToken(user) {
    const token = await jwt.sign(
      {
        id: user.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * process.env.EXPIRE
      },
      process.env.SECRET
    );
    return token;
  }
}

module.exports = AuthService;
