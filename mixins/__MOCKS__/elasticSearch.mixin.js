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
  products: "products",
  cart: "cart",
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
      return esClient
        .search({
          index: index.users,
          body: {
            query: {
              match_phrase: { email },
            },
          },
        })
        .then(async (userRes) => {
          const { hits } = userRes.hits;
          if (hits.length > 0) {
            return hits[0]._source;
          }
          return {};
        });
    },
    isProductIndexExist() {
      return esClient.indices.exists({
        index: index.products,
        body: {},
      });
    },
    createProductsIndex() {
      return esClient.indices.create({
        index: index.products,
        body: {
          mappings: {
            _doc: {
              properties: {
                name: { type: "text" },
                productId: { type: "integer" },
                price: { type: "integer" },
              },
            },
          },
        },
        include_type_name: true,
      });
    },
    addTestProducts(price, name, productId) {
      return esClient.index({
        index: index.products,
        body: {
          name,
          price,
          productId,
        },
      });
    },
    addTestProductsData() {
      const products = [{
        name: "My test product 1",
        productId: 1,
        price: 12,
      }, {
        name: "My test product 2",
        productId: 2,
        price: 120,
      }, {
        name: "My test product 3",
        productId: 3,
        price: 1200,
      }];

      products.forEach((product) => {
        this.addTestProducts(product.price, product.name, product.id);
      });

      return true;
    },
    getProductData() {
      return esClient.search({
        index: index.products,
        body: { query: { match_all: {} } },
      });
    },
    isCartIndexExist() {
      return esClient.indices.exists({
        index: index.cart,
        body: {},
      });
    },
    createCartIndex() {
      return esClient.indices.create({
        index: index.cart,
        body: {
          mappings: {
            _doc: {
              properties: {
                cartId: { type: "text" },
                product: {
                  properties: {
                    productId: {
                      type: "integer",
                    },
                    quantity: {
                      type: "integer",
                    },
                  },
                },
                userId: { type: "text" },
              },
            },
          },
        },
        include_type_name: true,
      });
    },
    addTestCartData() {
      const cart = {
        id: 1,
        productId: 1,
        quantity: 1,
      };
      return this.addProductToCart(cart.id, cart.productId, cart.quantity);
    },
    addProductToCart(cartId, productId, quantity) {
      return esClient.index({
        index: index.cart,
        body: {
          cartId,
          product: [
            {
              productId,
              quantity,
            },
          ],
          userId: cartId,
        },
      });
    },
    updateQuantity(userId, docId, updateProductData) {
      return esClient.update({
        index: index.cart,
        id: docId,
        body: {
          doc: {
            cartId: userId,
            product: updateProductData,
            userId,
          },
        },
      });
    },
    getCartByUserId(userId) {
      return esClient.search({
        index: index.cart,
        body: {
          query: {
            match_phrase: {
              userId: userId
            }
          }
        },
      }).then(async (cartRes) => {
        const { hits } = cartRes.hits;
        if (hits.length > 0) {
          const cartDoc = hits[0];
          return { id: cartDoc._id, ...cartDoc._source};
        }
        return {};
      });
    },
  },
};
