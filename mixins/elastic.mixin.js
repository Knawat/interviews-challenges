const { MoleculerClientError } = require('moleculer').Errors;

const indices = {
  products: 'products',
  users: 'users'
};
const type = {
  products: 'product',
  users: 'user'
};

module.exports = {
  methods: {
    /**
     * fetch users
     *
     * @methods
     * @param {elasticsearch} esObject - elasticsearch object
     * @param {Object} params - params with searching data
     *
     * @returns {Promise} reponse with user info
     */
    async fetchUsers(esObject, params) {
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

      return esObject
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
              status: false,
              message: 'No user found.'
            };
          }

          return result.hits.hits.map(user => ({
            id: user._id,
            ...user._source
          }));
        });
    },
    /**
     * add users
     *
     * @methods
     * @param {elasticsearch} esObject - elasticsearch object
     * @param {Object} params - params with data
     *
     * @returns {Promise} response object from elastic search
     */
    async addUsers(esObject, params) {
      const { name, email, password } = params;

      return esObject
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
     * @param {elasticsearch} esObject - elasticsearch object
     * @returns {Promise} response object from elastic search
     */
    async getAllProducts(esObject) {
      return esObject
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
              status: false,
              message: 'No products found.'
            };
          }
          const products = result.hits.hits.map(product => ({
            id: product._id,
            ...product._source
          }));
          return this.Promise.resolve({
            status: true,
            products: products
          });
        });
    },

    /**
     * Get product from elastic search by id
     *
     * @methods
     * @param {elasticsearch} esObject - elasticsearch object
     * @param {Number} productId
     *
     * @returns {Promise} response object from elastic search
     */
    async getProductById(esObject, productId) {
      return esObject
        .get({
          index: indices.products,
          type: type.products,
          id: productId
        })
        .then(result => {
          if (!result) {
            return '';
          }
          return this.Promise.resolve({
            id: result._id,
            ...result._source
          });
        });
    },

    /**
     * check if product exist or not.
     *
     * @methods
     * @param {elasticsearch} esObject - elasticsearch object
     * @param {Number} productId
     *
     * @returns {boolean} exist flag(true, flase)
     */
    async isProductExist(esObject, productId) {
      return esObject
        .exists({
          index: indices.products,
          type: type.products,
          id: productId
        })
        .then(result => result);
    }
  }
};
