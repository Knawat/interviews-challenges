const { MoleculerClientError } = require('moleculer').Errors;

module.exports = {
  methods: {
    /**
     * async foreach common method
     *
     * @methods
     * @param {Array} array
     * @param {Function} callback
     * @param {Object} thisArg
     *
     * @returns {Array} response from all promises
     */
    async asyncForEach(array, callback, thisArg) {
      const promiseArray = [];
      for (let i = 0; i < array.length; i += 1) {
        if (i in array) {
          const p = Promise.resolve(array[i]).then(currentValue =>
            callback.call(thisArg || this, currentValue, i, array)
          );
          promiseArray.push(p);
        }
      }
      await Promise.all(promiseArray);
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
					message: err.message || 'internal server error!'
				},
				{
					field: 'success',
					message: false
				}
			]);
    },
  }
};
