export class PRODUCT {
  // eslint-disable-next-line no-useless-constructor
  public constructor (
    public description: string,
    public id: number,
    public imageURL: string,
    public name: string,
    public price: number
  ) {
    this.description = description
    this.id = id
    this.imageURL = imageURL
    this.name = name
    this.price = price
  }
}

export class GET_PRODUCTS extends PRODUCT {
  // eslint-disable-next-line no-useless-constructor
  public constructor (
    public categoryId: number,
    public description: string,
    public id: number,
    public imageURL: string,
    public name: string,
    public price: number
  ) {
    super(
      description,
      id,
      imageURL,
      name,
      price
    )
  }
}
