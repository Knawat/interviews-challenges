import * as host from '~/test/productsList'
// initial state
export const state = () => ({
  all: [],
  count: 0
})

// actions
export const actions = {
  getAllProducts ({ commit }, page = 1) {
    commit('setProducts', host.getPage(page))
    commit('setCount', host.total)
  },
  async getProductsServer ({ commit }, page = 1) {
    this.$axios.setToken(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc0OWQ5Mzc4LTNhNjktNGZiYy04YjM4LTQ4OWRmMjQyODg3ZCIsImV4cCI6MTYxMDU0Mjk2NCwiaWF0IjoxNjA1MzU4OTY0fQ.7lnp6hM54C_aVAj7esC-Gqhn869NtJzFnl_B9kqLIoQ',
      'Bearer'
    )
    try {
      const resp = await this.$axios.$get(
        `api/catalog/products?page=${page}&hideOutOfStock=${1}`
      )
      commit('setProducts', resp.products)
      commit('setCount', resp.total)
    } catch (error) {
      // console.error(error)
    }
  }
}

// mutations
export const mutations = {
  setProducts (state, products) {
    state.all = products
  },
  setCount (state, count) {
    state.count = count
  }

}
