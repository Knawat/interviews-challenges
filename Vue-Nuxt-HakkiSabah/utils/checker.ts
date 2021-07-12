import { PRODUCT } from '~/store/models/product'
import { GET_CAT } from '~/store/models/category'

const seperator = '.'
export const checker = {
  // We need while loop because we dont want change reorder itself after the every splice method
  // Information from => https://stackoverflow.com/questions/9882284/looping-through-array-and-removing-items-without-breaking-for-loop
  checkCats (categories: GET_CAT[]) {
    let catLength = categories.length
    while (catLength--) {
      // detect and splice empty category
      if (categories[catLength].products.length <= 0) {
        categories.splice(catLength, 1)
      } else {
        // check category's products price
        categories[catLength].products = this.checkProductsPrice(categories[catLength].products)
        // if categories[catLength].products run out completely while filtering we need second check
        if (categories[catLength].products.length <= 0) {
          categories.splice(catLength, 1)
        }
      }
    }
    return categories
  },
  // If the product is in the category but not giving in the product endpoint, the product in the category is added to the products.
  checkProductCat (products: any, categories: GET_CAT[]) {
    products.forEach((product:any) => {
      categories.filter((cat) => {
        cat.products.filter((catPrdct) => {
          if (cat.id === product.categoryId && catPrdct.id === product.id) {
          } else {
            const nProduct = {
              categoryId: cat.id,
              description: catPrdct.description,
              id: catPrdct.id,
              imageURL: catPrdct.imageURL,
              name: catPrdct.name,
              price: catPrdct.price
            }
            products.push(nProduct)
          }
        })
      })
    })
    return categories
  },
  checkProductsPrice (products: PRODUCT[]): PRODUCT[] {
    let productsLength = products.length
    while (productsLength--) {
      if (products[productsLength].price <= 0) {
        products.splice(productsLength, 1)
      } else {
        // price may be unusual, for example => 2.2e+234
        products = this.priceCorrection(products, productsLength)
      }
    }
    return products
  },
  priceCorrection (products: any, index: number) {
    products[index].price
      .toString().split('').forEach((char: any) => {
      // We have constant for decimal separator and checking every char for correction
        if (seperator !== char && isNaN(Number(char))) {
          products.splice(index, 1)
        }
      })
    return products
  }
}
