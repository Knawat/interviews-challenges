const elasticsearch = require('elasticsearch');

const indices = {
  products: 'products',
  users: 'users'
};
const type = {
  products: 'product',
  users: 'user'
};
const es = new elasticsearch.Client({
  host: [
    {
      host: process.env.ELASTIC_HOST || 'localhost',
      protocol: process.env.ELASTIC_PROTOCOL || 'http',
      port: process.env.ELASTIC_PORT || 9200
    }
  ],
  log: process.env.ELASTIC_LOG || 'info'
});

module.exports = {
  methods: {
    /**
     * fetch users
     *
     * @methods
     * @param {Object} params - params with searching data
     *
     * @returns {Promise} reponse with user info
     */
    async fetchUsers(params) {
      const { email, password } = params;
      const paramData = [];
      if (email) {
        paramData.push({ match: { email: email } });
      }
      if (password) {
        paramData.push({ match: { password: password } });
      }

      const query = {
        bool: {
          must: paramData
        }
      };

      return es
        .search({
          index: indices.users,
          type: type.users,
          body: {
            query: query
          },
          size: 1
        })
        .then(result => {
          if (result.hits.total === 0) {
            return {
              success: false,
              message: 'No user found.'
            };
          }
          const data = result.hits.hits.map(user => ({
            id: user._id,
            ...user._source
          }));
          return this.Promise.resolve({
            success: true,
            data: data
          });
        });
    },
    /**
     * add users
     *
     * @methods
     * @param {Object} params - params with data
     *
     * @returns {Promise} response object from elastic search
     */
    async addUsers(params) {
      const { name, email, password } = params;

      return es
        .index({
          index: indices.users,
          type: type.users,
          body: {
            name: name,
            email: email,
            password: password
          }
        })
        .then(result => result);
    },

    /**
     * Get product listing
     *
     * @returns {Promise} response object from elastic search
     */
    async getAllProducts() {
      return es
        .search({
          index: indices.products,
          type: type.products,
          body: {
            query: {
              match_all: {}
            }
          },
          size: 999
        })
        .then(result => {
          if (result.hits.total === 0) {
            return {
              success: false,
              message: 'No products found.'
            };
          }
          const products = result.hits.hits.map(product => ({
            id: product._id,
            ...product._source
          }));
          return this.Promise.resolve({
            success: true,
            products: products
          });
        });
    },

    /**
     * Get product from elastic search by id
     *
     * @methods
     * @param {Number} productId
     *
     * @returns {Promise} response object from elastic search
     */
    async getProductById(productId) {
      return es
        .get({
          index: indices.products,
          type: type.products,
          id: productId
        })
        .then(
          result => {
            if (!result.found) {
              return '';
            }
            return this.Promise.resolve({
              id: result._id,
              ...result._source
            });
          },
          () => ''
        );
    },

    /**
     * check if product exist or not.
     *
     * @methods
     * @param {Number} productId
     *
     * @returns {boolean} exist flag(true, flase)
     */
    async isProductExist(productId) {
      return es
        .exists({
          index: indices.products,
          type: type.products,
          id: productId
        })
        .then(result => result);
    },

    /**
     * get elastic search object
     *
     * @returns {Object} - Elastic Search object
     */
    async getElasticObject() {
      return es;
    }
  }
};
