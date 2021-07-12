import { $axios } from '../../utils/api'
import { checker } from '../../utils/checker'
import { Cat, GET_CAT } from '../models/category'

export const getCategory = (): Promise<Cat[] | GET_CAT> => {
  return new Promise<Cat[] | GET_CAT>(async (resolve) => {
    $axios.get('https://limitless-lake-55070.herokuapp.com/category/')
      .then((res: any) => {
        const cleaned = checker.checkCats(res.data)
        resolve(cleaned)
      })
    // Conditional
    // if (process.env.API_URL) {
    //   $axios.get(`${process.env.API_URL
    //     ? process.env.API_URL
    //     : 'https://limitless-lake-55070.herokuapp.com/'}category/`)
    //     .then((res: any) => resolve(res.data))
    // } else {
    //   resolve(await getCategories())
    // }
  })
}
