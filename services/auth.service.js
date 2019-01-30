const { Service } = require('moleculer');
const jwt = require('jsonwebtoken');
const { MoleculerClientError } = require('moleculer').Errors;
const Common = require('../mixins/common.mixin');

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
      mixins: [Common],
      /**
       * Service dependencies
       */
      dependencies: ['elastic'],

      /**
       * Service settings
       */
      settings: {
        /*
         * JWT Secret to generate token
         */
        secret: process.env.SECRET || '123456',
        /* JWT expiration time (in days) */
        expire: process.env.EXPIRE || 1
      },
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
            return ctx
              .call('elastic.fetch_users', ctx.params)
              .then(async result => {
                if ('success' in result && !result.success) {
                  throw new MoleculerClientError('Email or password is invalid!', 422, '', [
                    {
                      field: 'email',
                      message: 'Email or password is invalid!'
                    },
                    {
                      field: 'success',
                      message: false
                    }
                  ]);
                }
                const user = result.data[0];

                const token = await this.generateToken(user);

                return this.Promise.resolve({
                  success: true,
                  message: 'Login Successfull',
                  data: {
                    token: token,
                    user: user
                  }
                });
              })
              .catch(err => this.handleError(err));
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
            return ctx
              .call('elastic.fetch_users', verificationData)
              .then(async result => {
                if ('success' in result && !result.success) {
                  return this.Promise.resolve(true);
                }
                throw new MoleculerClientError('Email already exist!', 422, '', [
                  {
                    field: 'email',
                    message: 'Email already exist!'
                  },
                  {
                    field: 'success',
                    message: false
                  }
                ]);
              })
              .then(async uniqueEmail => {
                if (!uniqueEmail) {
                  return this.Promise.reject({ success: false, message: 'Email already exist!' });
                }
                return ctx.call('elastic.add_users', ctx.params).then(result =>
                  this.Promise.resolve({
                    success: true,
                    message: 'Registration successfull!',
                    id: result._id
                  })
                );
              })
              .catch(err => this.handleError(err));
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
            ttl: 60 * 60 // expire time
          },
          params: {
            token: 'string'
          },
          handler(ctx) {
            return new this.Promise((resolve, reject) => {
              jwt.verify(ctx.params.token, this.settings.secret, (err, decoded) => {
                if (err) return reject(err);

                resolve(decoded);
              });
            })
              .then(decoded => {
                if (decoded.id) return decoded;
              })
              .catch(err => this.handleError(err));
          }
        }
      }
    });
  }

  /**
   * generate JWT token from user
   *
   * @param {Object} user
   * @returns {String} Token
   * @memberof AuthService
   */
  async generateToken(user) {
    if (typeof user !== 'undefined') {
      const token = await jwt.sign(
        {
          id: user.id,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * this.settings.expire
        },
        this.settings.secret
      );
      return token;
    }
    return '';
  }
}

module.exports = AuthService;
