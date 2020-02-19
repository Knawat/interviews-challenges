module.exports = {
  methods: {
    addUser: jest.fn().mockImplementationOnce(() => Promise.resolve({
      _index: "cart",
      _type: "_doc",
      _id: "XD_cXHAB5PPR9KMWU2hT",
      _version: 1,
      result: "created",
      _shards: {
        total: 2,
        successful: 1,
        failed: 0,
      },
      _seq_no: 19,
      _primary_term: 2,
    }))
      .mockImplementationOnce(() => Promise.resolve({}))
      .mockImplementationOnce(() => Promise.reject(new Error())),
    getUserByEmail: jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve({
        id: "0Yx1WHABsuG6wtO60i-u",
        name: "test user",
        email: "test@example.com",
        password: "123456",
        userId: 1,
      }))
      .mockImplementationOnce(() => Promise.resolve({}))
      .mockImplementationOnce(() => Promise.reject({ message: "Email id already in use.Please try with another." }))
      .mockImplementationOnce(() => Promise.resolve({
        id: "0Yx1WHABsuG6wtO60i-u",
        name: "test user",
        email: "admin@example.com",
        password: "123456",
        userId: 1,
      }))
      .mockImplementationOnce(() => Promise.resolve({}))
      .mockImplementationOnce(() => Promise.reject({})),
    getProductData: jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve({
        took: 2,
        timed_out: false,
        _shards: {
          total: 1,
          successful: 1,
          skipped: 0,
          failed: 0,
        },
        hits: {
          total: {
            value: 3,
            relation: "eq",
          },
          max_score: 1.0,
          hits: [
            {
              _index: "products",
              _type: "_doc",
              _id: "cN5MNHAB-xUzzAcp_WNS",
              _score: 1.0,
              _source: {
                name: "2 lt Milk bottel",
                productId: 1,
                price: 120,
              },
            },
            {
              _index: "products",
              _type: "_doc",
              _id: "5N5NNHAB-xUzzAcpt2NC",
              _score: 1.0,
              _source: {
                name: "1 lt water bottel",
                productId: 2,
                price: 12,
              },
            },
            {
              _index: "products",
              _type: "_doc",
              _id: "WN5ONHAB-xUzzAcpfmT_",
              _score: 1.0,
              _source: {
                name: "3 lt sunflower oil",
                productId: 3,
                price: 1200,
              },
            },
          ],
        },
      }))
      .mockImplementationOnce(() => Promise.reject({})),

    addProductToCart: jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve({})),
    updateQuantity: jest.fn().mockImplementationOnce(() => Promise.resolve({
      _index: "cart",
      _type: "_doc",
      _id: "uYu1V3ABsuG6wtO6vjmD",
      _version: 14,
      result: "updated",
      _shards: {
        total: 2,
        successful: 1,
        failed: 0,
      },
      _seq_no: 18,
      _primary_term: 2,
    })),
    getCartByUserId: jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve({
        took: 3,
        timed_out: false,
        _shards: {
          total: 1,
          successful: 1,
          skipped: 0,
          failed: 0,
        },
        hits: {
          total: {
            value: 1,
            relation: "eq",
          },
          max_score: 0.6931472,
          hits: [
            {
              _index: "cart",
              _type: "_doc",
              _id: "uYu1V3ABsuG6wtO6vjmD",
              _score: 0.6931472,
              _source: {
                cartId: 1,
                product: [
                  {
                    quantity: 31,
                    productId: 1,
                  },
                ],
                userId: 1,
              },
            },
          ],
        },
      }))
      .mockImplementationOnce(() => Promise.reject({}))
      .mockImplementationOnce(() => Promise.resolve({
        id: "uYu1V3ABsuG6wtO6vjmD",
        cartId: 1,
        product: [
          {
            quantity: 31,
            productId: 1,
          },
        ],
        userId: 1,
      }))
      .mockImplementationOnce(() => Promise.resolve({
        id: "uYu1V3ABsuG6wtO6vjmD",
        cartId: 1,
        product: [
          {
            quantity: 31,
            productId: 1,
          },
        ],
        userId: 1,
      }))
      .mockImplementationOnce(() => Promise.resolve({}))
      .mockImplementationOnce(() => Promise.reject({})),
    seedUser: jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve(true))
      .mockImplementationOnce(() => Promise.reject({ code: 500 })),
    seedProduct: jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve(true))
      .mockImplementationOnce(() => Promise.reject({ code: 500 })),
    seedCart: jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve(true))
      .mockImplementationOnce(() => Promise.reject({ code: 500 })),
  },
};
