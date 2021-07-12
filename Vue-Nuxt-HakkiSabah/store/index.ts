import { getAccessorType, mutationTree, actionTree } from 'typed-vuex'
import { Context } from '@nuxt/types'
import { getCategory } from './api/category'
import { getAllProducts } from './api/products'
import { addCart, deleteUserCartItem, getUserCart, updateCart } from './api/cart'
import { PRODUCT } from './models/product'
import { Cat, GET_CAT } from '~/store/models/category'
import { GET_PRODUCTS } from '~/store/models/product'
import { ADD_CART, GET_CART, UPDATE_CART } from '~/store/models/cart'

export const state = () => ({
  categories: [] as GET_CAT | Cat[],
  products: [] as GET_PRODUCTS[],
  cart: {} as GET_CART,
  lastCartId: 1
})

type RootState = ReturnType<typeof state>

export const getters = {
  categories: (state: RootState) => state.categories,
  cart: (state: RootState) => state.cart,
  lastCartId: (state: RootState) => state.lastCartId,
  products: (state: RootState) => state.products
}

export const mutations = mutationTree(state, {
  setCategories (state, categories: GET_CAT | Cat[]) {
    state.categories = categories
  },
  setProducts (state, products: GET_PRODUCTS[]) {
    state.products = products
  },
  loadCart (state, cart: GET_CART) {
    state.cart = cart
  },
  addToCartState (state, updatedCart) {
    state.cart = updatedCart
  },
  deleteItemFromState (state, updatedCart) {
    state.cart = updatedCart
  },
  updateLastCartId (state, id) {
    state.lastCartId = id < 1 ? 1 : id
  },
  clearCart (state, cart) {
    state.cart = cart
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    // Note : commiting for updateLastCartId mutation for cart id,
    // its usage start in Home.vue's addCart method
    async addItem ({ state, commit, getters }, cartItem: ADD_CART): Promise<void> {
      const updatedCart: GET_CART = await addCart(state.cart, cartItem, getters.products)!
      commit('updateLastCartId', updatedCart.cartItems.length + 1)
      commit('addToCartState', updatedCart)
    },
    async updateItem ({ state, commit }, cartItem: UPDATE_CART): Promise<void> {
      const updatedCart: GET_CART = await updateCart(state.cart, cartItem)
      commit('addToCartState', updatedCart)
    },
    async deleteItem ({ state, commit }, itemId: number): Promise<void> {
      const updatedCart: GET_CART = await deleteUserCartItem(state.cart, itemId)
      commit('deleteItemFromState', updatedCart)
      commit('updateLastCartId', updatedCart.cartItems.length - 1)
    },
    emptyCart ({ commit }) {
      this.$cookies.remove('cart')
      const cart: GET_CART = {
        cartItems: [],
        totalCost: 0
      }
      commit('clearCart', cart)
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async nuxtServerInit (_vuexContext, nuxtContext: Context): Promise<void> {
      const categories = await getCategory()
      _vuexContext.commit('setCategories', categories)
      const products = await getAllProducts(categories)
      _vuexContext.commit('setProducts', products)
      const cart = await getUserCart()

      _vuexContext.commit('loadCart', cart)
    }
  }
)
export const accessorType = getAccessorType({
  actions,
  getters,
  mutations,
  state
})
