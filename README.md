## Interview Challenges

Simple e-commerce task
## Functionality:

- User can login & register.
- User can add products in the cart.
- User can get his cart summary.
- docker-compose support

## Backend:

- Elasticsearch as a database.
- NATs messaging system for services transportation.
- Redis for caching 

## Api Collection
    - POST /api/register body:{name,email,password}
    - POST /api/login body:{email,password}
    - POST /api/products/create body:{ 
                                      name: {type: "string"},
                                      url: {type: "string"},
                                      sku: {type: "string"},
                                      barcode: {type: "string"},
                                      brand: {type: "string"},
                                      category: {type: "string"}
                                      } 
                                  headers:{Authorization:<useer_token>}
                                  
    - POST /api/cart/add body:{productId} headers:{Authorization:<useer_token>}
    - GET /api/cart headers:{Authorization:<useer_token>}
    - POST /api/cart/clear headers:{Authorization:<useer_token>}

## Build Setup

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

# Run Prettier
npm run prettier
```

## Run in Docker (production)

### Set environment


### Run in Docker (Development)

1.  Start with docker-compose: `node dc:up` OR `docker-compose up -d`

    It starts all services in separated containers, a Redis server for caching and a [Traefik](https://traefik.io/) reverse proxy. All nodes communicate via NATs transporter.

2.  Open the http://docker-ip:3000


## Code Overview

### Dependencies

- [moleculer](https://github.com/moleculerjs/moleculer) - Microservices framework for NodeJS
- [moleculer-web](https://github.com/moleculerjs/moleculer-web) - Official API Gateway service for Moleculer
- [nats](https://github.com/nats-io/node-nats) - [NATS](https://nats.io) transport driver for Moleculer _(optional)_
- [elasticsearch](https://github.com/elastic/elasticsearch-js) - [ELASTICSEARCH](https://www.elastic.co/products/elasticsearch) as database
- [ioredis](https://github.com/luin/ioredis) - [REDIS](https://redis.io/) caching
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - JWT user autheentication

### Application Structure

- `moleculer.config.js` - Moleculer ServiceBroker configuration file.
- `services/` - This folder contains the services.

## Test

```
$ npm test
```
