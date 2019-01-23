const _ = require('lodash');
const { Service } = require('moleculer');
const ApiGateway = require('moleculer-web');

const { UnAuthorizedError } = ApiGateway.Errors;

/**
 * Handles User Authentication
 *
 * @class AuthService
 * @extends {Service}
 */
class APIService extends Service {
  /**
   * Creates an instance of APIService.
   *
   * @param {ServiceBroker} broker
   * @memberof APIService
   */
  constructor(broker) {
    super(broker);

    this.parseServiceSchema({
      name: 'api',
      mixins: [ApiGateway],
      /**
       * Service dependencies
       */
      dependencies: [],

      /**
       * Service settings
       */
      settings: {
        port: process.env.API_PORT || 3000,
        cors: {
          // Configures the Access-Control-Allow-Origin CORS header.
          origin: '*',
          // Configures the Access-Control-Allow-Methods CORS header.
          methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
          // Configures the Access-Control-Allow-Headers CORS header.
          allowedHeaders: ['Authorization', 'Content-Type'],
          // Configures the Access-Control-Expose-Headers CORS header.
          exposedHeaders: [],
          // Configures the Access-Control-Allow-Credentials CORS header.
          credentials: false,
          // Configures the Access-Control-Max-Age CORS header.
          maxAge: 3600
        },
        routes: [
          {
            path: '/api',

            authorization: true,

            aliases: {
              'POST login': 'auth.login',
              'POST register': 'auth.register',
              'GET products': 'product.list',
              'POST add-to-cart': 'product.add_to_cart',
              'POST cart-summary': 'product.cart_summary',
              'POST clear-cart': 'product.clear_cart'
            },

            // Disable to call not-mapped actions
            mappingPolicy: 'restrict',

            // Parse body content
            bodyParsers: {
              json: {
                strict: false
              },
              urlencoded: {
                extended: true
              }
            }
          }
        ],
        // Serve assets from "public" folder
        assets: {
          folder: 'public'
        },
        onError(req, res, err) {
          // Return with the error as JSON object
          res.setHeader('Content-type', 'application/json; charset=utf-8');
          res.writeHead(err.code || 500);

          if (err.code === 422) {
            const o = {};
            err.data.forEach(e => {
              const field = e.field.split('.').pop();
              o[field] = e.message;
            });

            res.end(JSON.stringify({ errors: o }, null, 2));
          } else {
            const errObj = _.pick(err, ['name', 'message', 'code', 'type', 'data']);

            res.end(JSON.stringify(errObj, null, 2));
          }

          this.logResponse(req, res, err ? err.ctx : null);
        }
      }
    });
  }

  /**
   * Authorize the request
   *
   * @param {Context} ctx
   * @param {Object} route
   * @param {IncomingRequest} req
   * @returns {Promise}
   */
  authorize(ctx, route, req) {
    let reqToken;
    if (req.headers.authorization) {
      const type = req.headers.authorization.split(' ')[0];
      if (type === 'Token' || type === 'Bearer') {
        [, reqToken] = req.headers.authorization.split(' ');
      }
    }
    return this.Promise.resolve(reqToken)
      .then(token => {
        if (token) {
          // Verify JWT token
          return ctx
            .call('auth.verifyToken', { token })
            .then(user => {
              if (user) {
                // Reduce user fields (it will be transferred to other nodes)
                ctx.meta.auth = {
                  userId: user.id
                };
                ctx.meta.token = token;
              }
              return user;
            })
            .catch(() => null);
        }
      })
      .then(user => {
        if (req.$endpoint.action.auth === 'required' && !user) {
          throw new UnAuthorizedError();
        }
      });
  }
}
module.exports = APIService;
