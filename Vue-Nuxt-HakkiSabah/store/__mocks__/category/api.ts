import { Cat, GET_CAT } from '~/store/models/category'
import { getCategoriesWithMergedProducts } from '~/store/__mocks__/category/categories'

export const getCategories = (): Promise<Cat[] | GET_CAT> => {
  return new Promise<Cat[] | GET_CAT>((resolve) => {
    const categories = getCategoriesWithMergedProducts()
    if (categories) {
      resolve(categories)
    }
  })
}
