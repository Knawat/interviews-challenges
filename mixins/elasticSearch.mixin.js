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
            properties: {
              name: { type: "text" },
              email: { type: "text" },
              userId: { type: "text" },
              password: { type: "text" },
            },
          },
        },
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
    deleteUserIndex() {
      return esClient.indices.delete({index: index.users});
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
            properties: {
              name: { type: "text" },
              productId: { type: "integer" },
              price: { type: "integer" },
            },
          },
        },
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
        this.addTestProducts(product.price, product.name, product.productId);
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
    seedUser(){
      return this.isUserIndexExist()
      .then(async (isUserIndexExist) => {
        if (!isUserIndexExist) {
          await this.createUserIndex();
          const userData = await this.addTestUserData();
          this.logger.info(">>> User seeded", userData);
        } else {
          this.logger.info(">>> User index already exist");
        }
        return Promise.resolve(true);
      })
      .catch((error) => {
        this.logger.error(">>> User seed error", error);
      });
    },
    seedProduct(){
      return this.isProductIndexExist()
      .then(async (isProductIndexExist) => {
        if (!isProductIndexExist) {
          await this.createProductsIndex();
          const product = await this.addTestProductsData();
          this.logger.info(">>> Product seeded", product);
        } else {
          this.logger.info(">>> Product index already exist");
        }
        return Promise.resolve(true);
      })
      .catch((error) => {
        this.logger.error(">>> Product seed error", error);
      });
    },
    seedCart(){
      return this.isCartIndexExist()
      .then(async (isCartIndexExist) => {
        if (!isCartIndexExist) {
          await this.createCartIndex();
          const cartData = await this.addTestCartData();
          this.logger.info(">>> Cart seeded", cartData);
        } else {
          this.logger.info(">>> Cart index already exist");
        }
        return Promise.resolve(true);
      })
      .catch((error) => {
        this.logger.error(">>> Cart seed error", error);
      });
    },
  },
};
