const MP = require('@knawat/mp')
// const cat = require("@knawat/categories")

console.log('knwat  ')
const mp = new MP({
  key: '749d9378-3a69-4fbc-8b38-489df242887d',
  secret: '8c7363bc-d4ac-4367-97e4-ae8cb1c7a432',
  store: 'https://demostore.knawat.com/'
})

mp.$fetch('GET', '/catalog/categories', { auth: 'token' }).then(console.log)
console.log()
// console.log( )
// mp.getTokenAuth().then(console.log)
// console.log(cat.getAllCategories())
// console.log(mp.$fetch("catalog/products", "catalog/products"))
// try {
//     mp.$fetch(null, "catalog/products");

// } catch (error) {
//     console.err("error: ", error)
// }
