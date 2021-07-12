import { GET_PRODUCTS } from '../../models/product'
import { ADD_CART, GET_CART, UPDATE_CART } from '~/store/models/cart'
import { $cookies } from '~/utils/api'

export const getCartItems = (): Promise<GET_CART> => {
  return new Promise<GET_CART>((resolve) => {
    const isCartFilled = $cookies.get('cart')
    const cart:GET_CART = {
      cartItems: [],
      totalCost: 0
    }
    // If cart empty we can send cart model for process resuming
    resolve(calcTotal(isCartFilled !== undefined ? isCartFilled : cart))
  })
}

function calcTotal (cart: GET_CART) {
  const tmp = cart
  tmp.totalCost = tmp.cartItems && tmp.cartItems.length > 0
    ? tmp.cartItems.map(item => item.quantity * item.product.price).reduce((sum, val) => sum + val)
    : 0
  return tmp
}

export const addToCart = (cartState: GET_CART, item: ADD_CART, currentProducts:GET_PRODUCTS[]): Promise<GET_CART> => {
  return new Promise<GET_CART>(async (resolve) => {
    const tmp = Object.assign({}, cartState)
    tmp.cartItems = Object.assign([], cartState.cartItems)
    const findedProduct = currentProducts.filter(product => product.id === item.productId)
    const itemIsInCart = cartState.cartItems.filter(cartItem => cartItem.product.id === item.productId)
    if (findedProduct && itemIsInCart.length === 0) {
      const { description, id, imageURL, name, price } = findedProduct[0]
      if (!Array.isArray(tmp.cartItems)) {
        tmp.cartItems = []
      }
      const newItem = {
        id: item.id,
        product: {
          description,
          id,
          imageURL,
          name,
          price
        },
        quantity: item.quantity,
        userId: 1
      }
      tmp.totalCost = tmp.totalCost + (newItem.quantity * newItem.product.price)
      tmp.cartItems.push(newItem)
      $cookies.set('cart', JSON.stringify(tmp))
      resolve(tmp)
    } else if (itemIsInCart) {
      resolve(updateCartItem(cartState, item).then(response => response))
    }
  })
}

export const deleteCartItem = (cartState: GET_CART, itemId: number): Promise<GET_CART> => {
  return new Promise<GET_CART>((resolve) => {
    const tmp = Object.assign({}, cartState)
    tmp.cartItems = Object.assign([], cartState.cartItems)
    tmp.cartItems = tmp.cartItems.filter(currItem => currItem.id !== itemId)
    $cookies.set('cart', JSON.stringify(tmp))
    resolve(calcTotal(tmp))
  })
}

export const updateCartItem = (cartState: GET_CART, item: UPDATE_CART): Promise<GET_CART> => {
  return new Promise<GET_CART>((resolve) => {
    const tmp = Object.assign({}, cartState)
    tmp.cartItems = Object.assign([], cartState.cartItems)
    tmp.cartItems = tmp.cartItems.map((currItem) => {
      if (currItem.id === item.id) {
        const tmp2 = Object.assign({}, currItem)
        tmp2.quantity = item.quantity
        return tmp2
      }
      return currItem
    })
    $cookies.set('cart', JSON.stringify(tmp))
    resolve(calcTotal(tmp))
  })
}
