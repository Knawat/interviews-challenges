import { getproducts } from '~/store/__mocks__/products/products'
import { GET_PRODUCTS } from '~/store/models/product'

export const getProducts = (): Promise<GET_PRODUCTS[]> => {
  return new Promise<GET_PRODUCTS[]>((resolve) => {
    if (getproducts) {
      resolve(getproducts)
    }
  })
}
