import Vue from "vue";
import Vuex from "vuex";

import { getProductPrice } from "@/utils";
import { getProductWeight } from "@/utils";

Vue.use(Vuex);
const cachedCart = localStorage.getItem("cart");

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("token"),
    cartItems: cachedCart ? JSON.parse(cachedCart) : [] // { product: Object, quantity: Number }
  },
  getters: {
    isAuthorized: ({ token }) => {
      return Boolean(token);
    },

    getCartItems: ({ cartItems }) => {
      return cartItems;
    },
    getCartCount: ({ cartItems }) => {
      const count = cartItems.reduce((total, item) => {
        return (total += item.quantity);
      }, 0);

      return count;
    },
    isEmptyCart: ({ cartItems }) => {
      if (cartItems[0]) return false;

      return true;
    },
    getCartPrice: ({ cartItems }) => {
      const totalPrice = cartItems.reduce((total, item) => {
        const itemPrice = +getProductPrice(item.product) * item.quantity;
        total += +itemPrice.toFixed(2);

        return total;
      }, 0);

      return `$ ${totalPrice.toFixed(2)}`;
    },
    getCartWeight: ({ cartItems }) => {
      const totalWeight = cartItems.reduce((total, item) => {
        const itemWeight = +getProductWeight(item.product) * item.quantity;
        total += +itemWeight.toFixed(2);

        return total;
      }, 0);

      return `${totalWeight} KG`;
    }
  },
  mutations: {
    SET_TOKEN(state, token) {
      localStorage.setItem("token", token);
      state.token = token;
    },
    ADD_CART_ITEM({ cartItems }, product) {
      const { sku } = product;
      const exists = cartItems.find(item => item.product.sku === sku);

      if (!exists) {
        cartItems.push({
          product,
          quantity: 1
        });

        return;
      }
      exists.quantity++;
    },
    REMOVE_CART_ITEM(state, sku) {
      const item = state.cartItems.find(item => item.product.sku === sku);

      if (item.quantity === 1) {
        state.cartItems = state.cartItems.filter(
          item => item.product.sku !== sku
        );

        return;
      }
      item.quantity--;
    },
    SAVE_CART({ cartItems }) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  },
  actions: {},
  modules: {}
});
