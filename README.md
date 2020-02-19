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
## How to scale services?

-   Using docker compose scale command to scale service (https://docs.docker.com/compose/reference/scale/). for example,

```bash
1. docker-compose scale auth=2
2. docker-compose scale product=2
3. docker-compose scale cart=3
```

## How to scale cart service?

docker-compose scale cart=3

## Mention some micro-services specific pattern you used and why?

- Here i have implemented micro service architecture which are scalable. 
- Here each service is horizontally scalable and each minor node will communicate and will do work together.
- Every service is maintainable, develop and deployable independently.
- Because of node contains independent service In case of error in one node whole application will not stop working.It can be fixed and deployed independently while the same service may start working on existing node.

