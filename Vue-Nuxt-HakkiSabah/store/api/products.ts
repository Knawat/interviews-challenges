import { $axios } from '../../utils/api'
import { checker } from '../../utils/checker'
import { GET_PRODUCTS } from '../models/product'

export const getAllProducts = (categories:any): Promise<GET_PRODUCTS[]> => {
  return new Promise<GET_PRODUCTS[]>(async (resolve) => {
    $axios.get('https://limitless-lake-55070.herokuapp.com/product/').then((res: any) => {
      checker.checkProductCat(res.data, categories)
      const cleaned:GET_PRODUCTS[] | any = checker.checkProductsPrice(res.data)
      resolve(cleaned)
    })
    // Conditional
    // if (process.env.API_URL) {
    //   // process.env.API_URL
    //   $axios.get('https://limitless-lake-55070.herokuapp.com/product/').then((res: any) => resolve(res.data))
    // } else {
    //   resolve(await getProducts())
    // }
  })
}
