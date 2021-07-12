# Vue-Nuxt-HakkiSabah

## Live > <a href="https://vue-nuxt-hakki-sabah.vercel.app">vue-nuxt-hakki-sabah.vercel.app</a>

## Introduce
Thank you for sharing this challenge. I want to point out that this is my first TypeScript experience. About 1-2 weeks deadline were given at the mail interviews for the challenge. I tried my best as much as I could and I believe I can do even better.

### Environment Note
API_URL must have last slash character >> '/' <<

### Additional Logical Features
-   When the amount of product in the cart is entered as 0 or like 2.2e+234, that product is removed from the cart.
-   In the process of reducing the amount of product in the cart, if the amount is less than 1, the product is removed from the cart.
-   If the cart is empty on the checkout page, it will be redirected to the homepage.
-   If the product is in the category but not giving in the product endpoint, the product in the category is added to the products.

### .env contents like **

```env
API_URL=
token=
API_SECRET=SECRET_KEY
```
#### ** When you define API_URL in your `env` file, you must also define the token key 
#### This is because of the definitions that control the "store/api/" folder path

#### OR

#### You should be configure `nuxt.config.js` file at the `publicRuntimeConfig` lines

## Vercel

If you have vercel with global installation, just type `vercel`

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```
