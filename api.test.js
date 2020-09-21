/**
 * @jest-environment node
 */

 /**
 *  1. Create user
 * 
 *  3. Login
 *  4. Get user data
 *  5. Create product
 *  6. Get Product
 *  7. Add product to cart
 *  8. Add non-existin product
 *  9. Get user's cart
 * 10. 
 */
var axios = require('axios');
var data = JSON.stringify({"user":{"username":"johndoe","password":"123456789","email":"john.doe@gmail.com"}});


let token = ''
describe('User functionality', () => {
    it('Creating user', async () => {
        expect.assertions(1);

        let res = await axios({
            method: 'post',
            url: 'http://localhost:3000/users/create',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
          })
        .then(function (response) {
        //   console.log(JSON.stringify(response.data));
          return response
        })
        .catch(function (error) {
            // console.log(error);
            return 422
        });
        expect(res.status).toEqual(200);        
    });
   
    it('Login ', async () => {
        expect.assertions(1);

        let res = await axios({
            method: 'post',
            url: 'http://localhost:3000/users/login',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
          })
        .then(function (response) {
        //   console.log(JSON.stringify(response.data));
          return response
        })
        .catch(function (error) {
            // console.log(error);
            return 422
        });
        token = res.data.user.token;
        expect(res.status).toEqual(200);       
    });

    it('Get User data', async () => {
        expect.assertions(1);

        let res = await axios({
            method: 'get',
            url: 'http://localhost:3000/user',
            headers: { 
                'Authorization': `Bearer ${token}`, 
              'Content-Type': 'application/json'
            },
            data : data
          })
        .then(function (response) {
        //   console.log(JSON.stringify(response.data));
          return response
        })
        .catch(function (error) {
            // console.log(error);
            return 422
        });
        expect(res.status).toEqual(200);       
        data = {
            "product": {
                "sku":"123456789963",
                "data": {
                    "title": "shoes"
                  }
              }
          }
    });
  });

  
  describe('Product and carting', () => {
    it('Create Product', async () => {
        expect.assertions(1);

        let res = await axios({
            method: 'post',
            url: 'http://localhost:3000/products/create',
            headers: { 
                'Authorization': `Bearer ${token}`, 
              'Content-Type': 'application/json'
            },
            data : data
          })
        .then(function (response) {
        //   console.log(JSON.stringify(response.data));
          return response
        })
        .catch(function (error) {
            // console.log(error);
            return 422
        });
        expect(res.status).toEqual(200);        
    });
   
    it('Get Product', async () => {
        expect.assertions(1);

        let res = await axios({
            method: 'get',
            url: `http://localhost:3000/products/${data.product.sku}`,
            headers: { 
                'Authorization': `Bearer ${token}`, 
              'Content-Type': 'application/json'
            },
          })
        .then(function (response) {
        //   console.log(JSON.stringify(response.data));
          return response
        })
        .catch(function (error) {
            // console.log(error);
            return 422
        });
        expect(res.status).toEqual(200);       
    });

    it('Add to cart', async () => {
        expect.assertions(1);

        let res = await axios({
            method: 'post',
            url: `http://localhost:3000/products/${data.product.sku}/cart`,
            headers: { 
                'Authorization': `Bearer ${token}`, 
              'Content-Type': 'application/json'
            },
          })
        .then(function (response) {
        //   console.log(JSON.stringify(response.data));
          return response
        })
        .catch(function (error) {
            // console.log(error);
            return 422
        });
        expect(res.status).toEqual(200);       
    });
  });
