let users_service_input = {
    name: "Heddello",
    password: "fdafsfsa",
    email: "qaffaff2@afff.com",
    phone: "78152014400"
}
let products_service_input = {
    index: "string22",
    type: "string22",
    id: "string22",
    body: { name: "string22" }
}
let cart_service_input = {
    productDetails: {
        prodIndex: products_service_input.index,
        prodId: products_service_input.id,
        count: 3,
    },
    generalDetails:{
        userId:"opstomand"
    }
}
module.exports = { users_service_input, products_service_input, cart_service_input }