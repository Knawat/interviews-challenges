## Interview Challenges

This project will provide services for below functionality.

## FRAMEWORK:

-   [Moleculer](https://moleculer.services/)

## Functionality:

-   User can login & register.
-   User can add product in the cart.
-   User can get his cart details

## DATABASE

-   [Elasticsearch](https://www.elastic.co/)

## TRANSPORTER

-   [NATs](https://nats.io/)

## CACHER

-   [REDIS](https://redis.io/)

## EXTRATOOL

-   [Docker](https://www.docker.com/)

## Setup

```bash
# Install dependencies
npm install

# Start developing with REPL
npm run dev

# PostmanCollection

https://www.getpostman.com/collections/733f6d1b45ffb27fb1b8

# Run seeder
GET - http://localhost:3000/api/seeder

# Start production
npm start

# Run unit tests
npm run test

# Run ESLint
npm run lint

## Run at Docker

### environment (production)

- `cp .env.example .env`
-  make changes into .env

### environment (Development)

1.  npm run dc:up
2.  Open the http://docker-ip:3000 or http://localhost:3000

### How to scale services?
 - Using docker compose scale command to scale service. for example,
 1. docker-compose scale api=2
 2. docker-compose scale auth=2
 3. docker-compose scale product=2
 4. docker-compose scale cart=5
```
