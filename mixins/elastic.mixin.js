const elasticsearch = require('elasticsearch');
// const { MoleculerClientError } = require('moleculer').Errors;

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
  indices: {
    users: 'users'
  },
  type: {
    users: 'user'
  },
  es: new elasticsearch.Client({
    host: [
      {
        protocol: process.env.ELASTIC_PROTOCOL || 'http',
        host: process.env.ELASTIC_HOST || 'localhost',
        port: process.env.ELASTIC_PORT || 9200
      }
    ],
    log: process.env.ELASTIC_LOG || 'info'
  }),
  methods: {
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
    }
  }
};
