import { Cat, GET_CAT } from '~/store/models/category'
import { getproducts } from '~/store/__mocks__/products/products'
import { GET_PRODUCTS, PRODUCT } from '~/store/models/product'

export const getcategories: Cat[] | GET_CAT[] = [
  {
    id: 2,
    categoryName: 'Pantry',
    description: 'Stock up and Save up to 40% on monthly groceries. Buy Big Packs, Get Big Savings. Low Prices. Top Brands. Great Offers.',
    imageUrl: 'https://cdn.midasbuy.com/images/%E4%B8%9A%E5%8A%A1%E5%85%A5%E5%8F%A3e813fefc.png',
    products: [
      {
        id: 3,
        name: 'Microsoft Surface Duo (Silver, 8GB RAM, 128GB Storage) with No Cost EMI/Additional Exchange Offers',
        imageURL: 'https://fdn.gsmarena.com/imgroot/news/20/05/surface-duo-specs-leak/-727/gsmarena_002.jpg',
        price: 13999,
        description: 'Surface Duo is a dual-screen mobile device that is thin and lightweight'
      },
      {
        id: 13,
        name: 'asas',
        imageURL: 'https://limitless-lake-55070.herokuapp.com/fileUpload/files/a5ce78f3-7c3d-48b0-9111-f81d1be32446.jfif',
        price: 12,
        description: 'asas'
      },
      {
        id: 4,
        name: 'Aashirvaad Select Premium Sharbati Atta, 5kg',
        imageURL: 'https://images-na.ssl-images-amazon.com/images/I/81l7thl5AQL._SL1500_.jpg',
        price: 3.27,
        description: 'Aashirvaad Select is made with 100% MP Sharbati wheat which is harvested from the Sehore region of Madhya Pradesh'
      },
      {
        id: 5,
        name: 'Dark Fantasy Choco Fills, 300g',
        imageURL: 'https://images-na.ssl-images-amazon.com/images/I/61jzDf1c7dL._SL1000_.jpg',
        price: 1.06,
        description: 'An exquisite combination of luscious chocolate filling enrobed within a perfectly baked rich cookie outer'
      },
      {
        id: 6,
        name: 'Daawat Super Basmati, 1kg with 25% Extra',
        imageURL: 'https://images-na.ssl-images-amazon.com/images/I/51QctuMGjnL.jpg',
        price: 1.84,
        description: 'Safe and clean Untouched by human hands Hygieically packed'
      }
    ]
  },
  {
    id: 1,
    categoryName: 'laptop',
    description: 'Mobile phone usage is on the rise and smartphone lovers are on a constant hunt to buy the best smartphone at a reasonable price. This is the place to buy it.',
    imageUrl: 'https://limitless-lake-55070.herokuapp.com/fileUpload/files/2a6d9e32-aacf-4806-846d-f28ef568263b.jpg',
    products: [
      {
        id: 14,
        name: '',
        imageURL: '',
        price: 0,
        description: ''
      },
      {
        id: 2,
        name: 'string',
        imageURL: 'string',
        price: 0,
        description: 'string'
      },
      {
        id: 12,
        name: 'dsd',
        imageURL: 'df',
        price: 2.2e+234,
        description: 'dsd'
      },
      {
        id: 15,
        name: 'string',
        imageURL: 'string',
        price: 0,
        description: 'string'
      },
      {
        id: 9,
        name: 'dasdas',
        imageURL: 'https://cdn.midasbuy.com/images/item-25a68966f.png',
        price: 121,
        description: 'dasdasdasda'
      },
      {
        id: 10,
        name: 'string',
        imageURL: 'string',
        price: 0,
        description: 'string'
      },
      {
        id: 1,
        name: 'Moto G Power | 2021 | 3-Day Battery | Made for US by Motorola | 3/32GB | 48MP Camera | Silver',
        imageURL: 'https://cdn.vox-cdn.com/thumbor/SJMhrP0QXquBo3ZDL1xvOWrvOLY=/0x0:2040x1366/1200x0/filters:focal(0x0:2040x1366):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/19901134/cfaulkner_200414_3976_0031.jpg',
        price: 189,
        description: 'Unlocked for the freedom to choose your carrier. Compatible with AT&T, Sprint'
      }
    ]
  },
  {
    id: 3,
    categoryName: 'Fashion (Men)',
    description: 'Shop from the latest collection of Apparels for Men Online',
    imageUrl: 'https://limitless-lake-55070.herokuapp.com/fileUpload/files/fc0b6ed3-b9d6-42e0-9203-96818518807c.jpg',
    products: [
      {
        id: 7,
        name: 'BULLMER Men\'s Slim Fit T Shirt (Pack of 3)',
        imageURL: 'https://cdn.midasbuy.com/images/apps/pubgm/1599546007887MVeNUtB6.png',
        price: 9.15,
        description: 'Fit Type: Slim Fit, Fabric: Cotton, Neck Style: Crew Neck, Pattern: Animal Print'
      },
      {
        id: 8,
        name: 'Chromozome Men\'s Plain Regular Fit T-Shirt (Pack Of 3)',
        imageURL: 'https://cdn.midasbuy.com/images/%E6%99%AE%E9%80%9A%E5%8D%A1%E5%8B%8B%E7%AB%A0_820x820005f24e1.jpg',
        price: 6.73,
        description: 'Care Instructions: Machine Wash, Fit Type: Regular Fit ,100% Cotton, Half sleeve, Round neck, Machine wash'
      },
      {
        id: 11,
        name: 'Name111',
        imageURL: 'https://cdn.midasbuy.com/images/item-25a68966f.png',
        price: 12,
        description: 'Desirmkxlxcd'
      }
    ]
  }
]

export function getCategoriesWithMergedProducts (): Cat[] | GET_CAT {
  // @ts-ignore
  // eslint-disable-next-line array-callback-return
  getcategories.filter((cat: Cat | GET_CAT.prototype.products) => {
    const tmpCat: PRODUCT[] = []
    // eslint-disable-next-line array-callback-return
    getproducts.filter((item: GET_PRODUCTS) => {
      if (cat.id === item.categoryId) {
        tmpCat.push({
          description: item.description,
          id: item.id,
          imageURL: item.imageURL,
          name: item.name,
          price: item.price
        })
      }
    })
    cat.products = tmpCat
  })
  return getcategories
}
