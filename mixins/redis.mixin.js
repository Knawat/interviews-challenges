const Redis = require('ioredis');
const { MoleculerClientError } = require('moleculer').Errors;

const redis = new Redis({
  port: process.env.REDIS_PORT || 6379,
  host: process.env.REDIS_HOST || '127.0.0.1'
});

module.exports = {
  methods: {
    /**
     * exucute redis command
     *
     * @methods
     * @param {String} command - redis cli command
     * @param {Object} args - command arguments
     *
     * @returns {Promise} redis response
     */
    async executeRedisCommand(command, args) {
      let value = '';
      await redis[command.toLowerCase()](args)
        .then(result => {
          value = result;
        })
        .catch(err => {
          this.handleError(err);
        });
      return value;
    },

    /**
     * handling response error
     *
     * @methods
     * @param {Response} response redis cli error response
     *
     * @returns {Object} Response Object with status code and message
     */
    handleError(err) {
      this.logger.error('>> err : ', err);
      throw new MoleculerClientError('internal server error!', 422, '', [
        {
          field: 'error',
          message: 'internal server error! Please try after sometime'
        },
        {
          field: 'success',
          message: false
        }
      ]);
    }
  }
};
