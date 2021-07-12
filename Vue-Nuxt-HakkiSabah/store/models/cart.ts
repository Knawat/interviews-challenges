export class product {
  // eslint-disable-next-line no-useless-constructor
  public constructor (
    public description: string,
    public id: number,
    public imageURL: string,
    public name: string,
    public price: number) {
  }
}

export class ADD_CART {
  // eslint-disable-next-line no-useless-constructor
  public constructor (
    public id: number,
    public productId: number,
    public quantity: number) {
  }
}

export class UPDATE_CART {
  // eslint-disable-next-line no-useless-constructor
  public constructor (
    public id: number,
    public productId: number,
    public quantity: number) {
  }
}

export class cartItems {
  // eslint-disable-next-line no-useless-constructor
  public constructor (
    public id: number,
    public product: product,
    public quantity: number,
    public userId: number) {
  }
}

export class GET_CART {
  // eslint-disable-next-line no-useless-constructor
  public constructor (
    public cartItems: cartItems[],
    public totalCost: number
  ) {
    this.cartItems = cartItems
    this.totalCost = totalCost
  }
}
