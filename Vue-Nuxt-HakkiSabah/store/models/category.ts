import { PRODUCT } from '~/store/models/product'

export class Cat {
  public constructor (
    public categoryName: string,
    public description: string,
    public id: number,
    public imageUrl: string
  ) {
    this.categoryName = categoryName
    this.description = description
    this.id = id
    this.imageUrl = imageUrl
  }
}

export class GET_CAT {
  public constructor (
    public categoryName: string,
    public description: string,
    public id: number,
    public imageUrl: string,
    public products: PRODUCT[]
  ) {
    this.categoryName = categoryName
    this.description = description
    this.id = id
    this.imageUrl = imageUrl
    this.products = products
  }
}
