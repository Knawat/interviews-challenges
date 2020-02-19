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

# PostmanCollection

-   [https://www.getpostman.com/collections/733f6d1b45ffb27fb1b8](https://www.getpostman.com/collections/733f6d1b45ffb27fb1b8)

## Setup

```bash
# Install dependencies
npm install

# Start project at development
npm run dev

# Run seeder
GET - http://localhost:3000/api/seeder

# Start production
npm start

# Run unit tests
npm run test
```

> NOTE :

-   I haven't mocked elasticsearch and redis for unit test so, please make sure to keep docker up during unit test run.
-   Also, I have added actions like seeder to pre-load data and haven't written unit test for that so, it will affect overall coverage.

```bash
# Run ESLint
npm run lint

# Docker up
npm run dc:up

# Docker log
npm run dc:logs

# Docker down
npm run dc:down

```

## Run at Docker

```bash
### environment (production)
- `cp .env.example .env`
-  make changes into .env
-  docker-compose up --build -d
-  Open the http://docker-ip:3000 or http://localhost:3000
```

## How to scale services?

-   Using docker compose scale command to scale service (https://docs.docker.com/compose/reference/scale/). for example,

```bash
1. docker-compose scale auth=2
2. docker-compose scale product=2
3. docker-compose scale cart=5
```

## How to scale cart service?

docker-compose scale cart=5

## Mention some micro-services specific pattern you used and why?

Based on micro-service architecture, Every service is the loosely coupled services that can be developed, deployed, and maintained independently. The project uses micro-service architecture the same as. Every service having own node. Make communication with each other and make a large and scalable system. By using we can scale the service independently which offers improved fault-tolerant whereby in the case of an error in one service the whole application doesn’t necessarily stop functioning. When the error is fixed, it can be deployed only for the respective service instead of redeploying an entire application.
