const Redis = require('ioredis');

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
          this.handleErr(err);
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
    handleErr(res) {
      return err => {
        this.logger.error('Request error!', err);
        res.status(err.code || 500).send(err.message);
      };
    }
  }
};
