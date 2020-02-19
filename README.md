## Interview challenge (knawat)

This project developed based on Moleculer framwork with REDIS caching, Elasticsearch database and NATs for transportation.

## Functionality:

- User login & register.
- Add product to cart.
- Get user cart summary.
- docker-compose support.


## Run without docker

1. `cp .env.ignore .env` and make desired changes into .env

2. `npm install` Install dependencies

3. `npm run dev` Start with development environment

## Run in Docker

1. `cp .env.ignore .env` and make desired changes into .env

2.  `docker-compose up -d --build` (Run this command to pull images and start all the services in docker container)
3.  `http://localhost:3000/` Hit in postman as per endpoints mentioned in the post man collection 


## Postman Collection

[https://www.getpostman.com/collections/b5f4453de604b6db2f96](https://www.getpostman.com/collections/b5f4453de604b6db2f96)

## Scripts

```bash
# Install dependencies
npm install

# Start developing with REPL
npm run dev

# Start production
npm start

# Run unit tests
npm test

# Run ESLint
npm run lint
```
