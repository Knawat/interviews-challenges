import { ADD_CART, GET_CART, UPDATE_CART } from '../models/cart'
import { getCartItems, addToCart, deleteCartItem, updateCartItem } from '../__mocks__/cart/api'
import { GET_PRODUCTS } from '../models/product'
import { $axios } from '../../utils/api'

export const getUserCart = (): Promise<GET_CART> => {
  return new Promise<GET_CART>(async (resolve) => {
    if (process.env.API_URL) {
      $axios.get(`${process.env.API_URL}cart/?token=${process.env.token}`).then((res: any) => resolve(res.data))
    } else {
      resolve(await getCartItems())
    }
  })
}
export const addCart = (cartState: GET_CART, item: ADD_CART, currentProducts: GET_PRODUCTS[]): Promise<GET_CART> => {
  return new Promise<GET_CART>(async (resolve) => {
    if (process.env.API_URL) {
      $axios.post(`${process.env.API_URL}cart/add?token=${process.env.token}`, item).then((res: any) => resolve(res.data))
    } else {
      resolve(await addToCart(cartState, item, currentProducts))
    }
  })
}

export const updateCart = (cartState: GET_CART, item: UPDATE_CART): Promise<GET_CART> => {
  return new Promise<GET_CART>(async (resolve) => {
    if (process.env.API_URL) {
      $axios.put(`${process.env.API_URL}cart/update/${item.id}?token=${process.env.token}`, item).then((res: any) => resolve(res.data))
    } else {
      resolve(await updateCartItem(cartState, item))
    }
  })
}

export const deleteUserCartItem = (cartState: GET_CART, itemId: number): Promise<GET_CART> => {
  return new Promise<GET_CART>(async (resolve) => {
    if (process.env.API_URL) {
      $axios.delete(`${process.env.API_URL}cart/delete/${itemId}?token=${process.env.token}`).then((res: any) => resolve(res.data))
    } else {
      resolve(await deleteCartItem(cartState, itemId))
    }
  })
}
