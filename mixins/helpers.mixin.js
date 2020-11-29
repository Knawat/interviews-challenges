const {MoleculerClientError} = require('moleculer').Errors;

module.exports = {
    methods: {
        /**
         * handling response error
         * @param error
         */
        handleError(error) {
            this.logger.error('Error : ', error);
            throw new MoleculerClientError('Internal server error!', 422, '', [
                {
                    field: 'error',
                    message: error.message || 'Internal server error!'
                },
                {
                    field: 'success',
                    message: false
                }
            ]);
        }
    }
};
