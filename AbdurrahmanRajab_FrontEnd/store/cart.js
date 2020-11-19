import * as host from '~/test/productsList'

// initial state
export const state = () => ({
  items: []
})

// getters
export const getters = {
  productAmount: (state) => {
    return state.items.length || 0
  },
  cartProducts: (state, getters, rootState) => {
    return host.getProductsBySku(state.items)
    // return state.items.map((id) => {
    //   const product = rootState.products.all.find(product => product.sku === id)
    //   return {
    //     title: product.name.tr,
    //     price: product.variations.market_price,
    //     sku: product.sku
    //   }
    // })
  },

  cartTotalPrice: (state, getters) => {
    return getters.cartProducts.reduce((total, product) => {
      return total + product.variations.market_price
    }, 0)
  }
}

// actions
export const actions = {
  addProductToCart({ state, commit }, sku) {
    const cartItem = state.items.find(item => item === sku)
    if (!cartItem) {
      commit('pushProductToCart', { id: sku })
    }
  },
  removeProductFromCart({ state, commit }, sku) {
    commit('filterProductFromCart', sku)
  }
}

// mutations
export const mutations = {
  pushProductToCart(state, { id }) {
    state.items.push(id)
  },
  filterProductFromCart(state, sku) {
    state.items = state.items.filter(id => id !== sku)
  }
}
