import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    items: []
  },
  getters: {
    cartItems: ({ items }) => {
      return items;
    }
  },
  mutations: {
    ADD_CART_ITEM({ items }, product) {
      const { sku } = product;
      const exists = items.find(entry => entry.product.sku === sku);

      if (!exists) {
        items.push({
          product,
          quantity: 1
        });
      } else {
        exists.quantity++;
      }
    }
  },
  actions: {},
  modules: {}
});
