1. Run the following command to start the docker containers

# npm run dc:up

The above command should start the api gateway with http://localhost:3000/api

2. Sample Payload for Registering the user
   payload:{
   "email": "string",
   "password":"string",
   "username":"string",
   "mobilenum":number
   }

    # API_URL:- POST http://localhost:3000/api/users

3. Sample Payload for login

    paylaod:{
    email:string,
    password:string
    }

    # API_URL:- POST http://localhost:3000/api/users/login

    Note:- The above api will return a token in response. please attach
    the token in authorization headers as Bearer token

4. Sample Payload for Adding Product to Cart
   payload:{
   name: string,
   description: string,
   brand: string,
   price: number
   }

# API_URL:- POST http://localhost:3000/api/cart

5. Use the Following api to get the summary from cart

    # API_URL:- GET http://localhost:3000/api/summary
