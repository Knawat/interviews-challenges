const elasticsearch = require("elasticsearch");

const esHost = process.env.ELASTIC_HOST;
const esLog = process.env.ELASTIC_LOG;
const esVersion = process.env.ELASTIC_VERSION;
const esClient = new elasticsearch.Client({
  host: esHost,
  log: esLog,
  apiVersion: esVersion,
});
const index = {
  users: "users",
};

module.exports = {
  methods: {
    esClient() {
      return esClient;
    },
    addUser(email, name, password, userId) {
      return esClient.index({
        index: index.users,
        body: {
          name,
          email,
          password,
          userId,
        },
      });
    },
    isUserIndexExist() {
      return esClient.indices.exists({
        index: index.users,
        body: {},
      });
    },
    createUserIndex() {
      return esClient.indices.create({
        index: index.users,
        body: {
          mappings: {
            _doc: {
              properties: {
                name: { type: "text" },
                email: { type: "text" },
                userId: { type: "text" },
                password: { type: "text" },
              },
            },
          },
        },
        include_type_name: true,
      });
    },
    addTestUserData() {
      const user = {
        id: 1,
        name: "test user",
        email: "test@example.com",
        password: "123456",
      };
      return this.addUser(user.email, user.name, user.password, user.id);
    },
    getUserByEmail(email) {
      return esClient.search({
        index: index.users,
        body: {
          query: {
            match_phrase: { email },
          },
        },
      });
    },
  },
};
