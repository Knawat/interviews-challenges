/* eslint-disable no-console */
const elasticsearch = require('elasticsearch');

const indices = {
  products: 'products',
  users: 'users'
};
const type = {
  products: 'product',
  users: 'user'
};

const testIndices = {
  products: 'test_products',
  users: 'test_users'
};
let es;

const users = [
  {
    id: 1,
    name: 'Parth Jethwa',
    email: 'parth.jethwa@tatvasoft.com',
    password: 'test123'
  },
  {
    id: 2,
    name: 'Testing User',
    email: 'testing@user.com',
    password: 'test123'
  }
];

const products = [
  {
    id: 1,
    name: 'HP-C4356',
    url: 'https://www.google.com/search?q=HP-C4356',
    sku: 'TST02',
    barcode: 'BRCD02',
    brand: 'HP',
    category: 'laptop',
    created: '2019-01-21T07:36:39.545Z'
  },
  {
    id: 2,
    name: 'Motorola PowerOne',
    url: 'https://www.google.com/search?q=Motorola PowerOne',
    sku: 'TST05',
    barcode: 'BRCD05',
    brand: 'Mtorola',
    category: 'Mobile',
    created: '2019-01-21T07:36:39.545Z'
  },
  {
    id: 3,
    name: 'Honda shine',
    url: 'https://www.google.com/search?q=Honda shine',
    sku: 'TST07',
    barcode: 'BRCD07',
    brand: 'Honda',
    category: 'Bike',
    created: '2019-01-21T07:36:39.545Z'
  },
  {
    id: 4,
    name: 'LED lamp',
    url: 'https://www.google.com/search?q=LED lamp',
    sku: 'TST10',
    barcode: 'BRCD10',
    brand: 'Syska',
    category: 'Electric',
    created: '2019-01-21T07:36:39.545Z'
  },
  {
    id: 5,
    name: 'DELL mouse',
    url: 'https://www.google.com/search?q=DELL mouse',
    sku: 'TST09',
    barcode: 'BRCD09',
    brand: 'DELL',
    category: 'Gadgets',
    created: '2019-01-21T07:36:39.545Z'
  },
  {
    id: 6,
    name: 'Iphone X',
    sku: 'TST01Iphone X',
    url: 'https://www.google.com/search?q=',
    barcode: 'BRCD01',
    brand: 'IPHONE',
    category: 'mobile',
    created: '2019-01-21T07:36:39.545Z'
  },
  {
    id: 7,
    name: 'fastrack-005D',
    url: 'https://www.google.com/search?q=fastrack-005D',
    sku: 'TST03',
    barcode: 'BRCD03',
    brand: 'titan',
    category: 'watch',
    created: '2019-01-21T07:36:39.545Z'
  },
  {
    id: 8,
    name: 'LED-42 Inch',
    url: 'https://www.google.com/search?q=LED-42 Inch',
    sku: 'TST04',
    barcode: 'BRCD04',
    brand: 'MI',
    category: 'TV',
    created: '2019-01-21T07:36:39.545Z'
  },
  {
    id: 9,
    name: 'JBL headphones',
    url: 'https://www.google.com/search?q=JBL headphones',
    sku: 'TST06',
    barcode: 'BRCD06',
    brand: 'JBL',
    category: 'headphones',
    created: '2019-01-21T07:36:39.545Z'
  },
  {
    id: 10,
    name: 'Swift',
    url: 'https://www.google.com/search?q=Swift',
    sku: 'TST08',
    barcode: 'BRCD08',
    brand: 'Suzuki',
    category: 'Car',
    created: '2019-01-21T07:36:39.545Z'
  }
];

/**
 * async foreach common method
 *
 * @methods
 * @param {Array} array
 * @param {Function} callback
 * @param {Object} thisArg
 *
 * @returns {Array} response from all promises
 */
async function asyncForEach(array, callback, thisArg) {
  const promiseArray = [];
  for (let i = 0; i < array.length; i += 1) {
    if (i in array) {
      const p = Promise.resolve(array[i]).then(currentValue =>
        callback.call(thisArg || this, currentValue, i, array)
      );
      promiseArray.push(p);
    }
  }
  await Promise.all(promiseArray);
}

/**
 * initialize elastic search connection
 *
 */
async function initializeES() {
  es = await new elasticsearch.Client({
    host: [
      {
        host: process.env.ELASTIC_HOST || 'localhost',
        protocol: process.env.ELASTIC_PROTOCOL || 'http',
        port: process.env.ELASTIC_PORT || 9200
      }
    ],
    log: process.env.ELASTIC_LOG || 'info'
  });
  return es;
}

initializeES().then(async eSearch => {
  console.log('******************************************************');
  console.log('***********   Creatating Users index   ***************');
  console.log('******************************************************');

  const userIndex = await eSearch.indices.create({
    index: indices.users,
    body: {
      mappings: {
        user: {
          properties: {
            name: { type: 'text' },
            email: { type: 'keyword' },
            password: { type: 'keyword' }
          }
        }
      }
    }
  });
  console.log('[USER INDEX CREATED] : ', userIndex);

  console.log('******************************************************');
  console.log('*********   Creatating Product index   ***************');
  console.log('******************************************************');

  const productIndex = await eSearch.indices.create({
    index: indices.products,
    body: {
      mappings: {
        product: {
          properties: {
            name: { type: 'text' },
            sku: { type: 'keyword' },
            url: { type: 'text' },
            barcode: { type: 'keyword' },
            brand: { type: 'keyword' },
            category: { type: 'text' },
            created: { type: 'date' }
          }
        }
      }
    }
  });
  console.log('[PRODUCT INDEX CREATED] : ', productIndex);

  console.log('******************************************************');
  console.log('**************   Creatating Users   ******************');
  console.log('******************************************************');

  await asyncForEach(users, async user => {
    const response = await eSearch.index({
      index: indices.users,
      type: type.users,
      id: user.id,
      body: {
        name: user.name,
        email: user.email,
        password: user.password
      }
    });
    console.log('[USER CREATED] : ', response);
  });

  console.log('******************************************************');
  console.log('*************   Creatating Products   ****************');
  console.log('******************************************************');

  await asyncForEach(products, async product => {
    const response = await eSearch.index({
      index: indices.products,
      type: type.products,
      id: product.id,
      body: {
        name: product.name,
        url: product.url,
        sku: product.sku,
        barcode: product.barcode,
        brand: product.brand,
        category: product.category,
        created: product.created
      }
    });
    console.log('[PRODUCT CREATED] : ', response);
  });
});
