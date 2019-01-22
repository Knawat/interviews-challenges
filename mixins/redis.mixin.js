const Redis = require('ioredis');

const redis = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST
});

redis.on('connect', () => {
  console.log('Redis client connected'); // eslint-disable-line no-console
});

module.exports = {
  methods: {
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
    async getValueFromRedis(key) {
      let value = null;
      await redis
        .get(key)
        .then(result => {
          try {
            value = JSON.parse(result);
          } catch (e) {
            value = result;
          }
        })
        .catch(err => {
          this.wLog(err);
        });

      return value;
    },
    async setValueToRedis(key, value) {
      return redis.set(key, JSON.stringify(value));
    },
    handleErr(res) {
      return err => {
        this.logger.error('Request error!', err);
        res.status(err.code || 500).send(err.message);
      };
    }
  }
};
