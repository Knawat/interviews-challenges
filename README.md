## Interview Challenges

This project will provide simple set of services with [Moleculer](https://moleculer.services/) Framework, with [REDIS](https://redis.io/) caching and [NATs](https://nats.io/) for transportation.

## Functionality:

- User can login & register.
- User can add product in the cart.
- User can get his cart summary.
- docker-compose support

## Backend:

- Elasticsearch as a database.
- NATs messaging system for services transportation.

## Postman Collection

[https://www.getpostman.com/collections/3ee4f1c212614ff64a82](https://www.getpostman.com/collections/3ee4f1c212614ff64a82)

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

- `cp .env.example .env`

### Run in Docker (Development)

1.  Start with docker-compose: `docker-compose up -d`

    It starts all services in separated containers, a Redis server for caching and a [Traefik](https://traefik.io/) reverse proxy. All nodes communicate via NATs transporter.

2.  Open the http://docker-ip:3000
3.  Scale up services

    `docker-compose scale api=3 products=2 auth=2`

### Multiple instances

You can run multiple instances of services. In this case you need to use a transporter i.e.: [NATS](https://nats.io). NATS is a lightweight & fast message broker. Download it and start with `gnatsd` command. After it started, set the `TRANSPORTER` env variable and start services.

```
TRANSPORTER=nats://localhost:4222
```

### elasticsearch setup

Download [elastic search](https://www.elastic.co/downloads/elasticsearch) and install it. You can check the working of elastic search on http://localhost:9200. After it started, set the `ELASTIC_HOST`, `ELASTIC_PROTOCOL`, `ELASTIC_PORT` env variables that you described during the setup of elasticsearch and start services.

```
ELASTIC_HOST=localhost
ELASTIC_PROTOCOL=http
ELASTIC_PORT=9200
ELASTIC_LOG=info
```

## Code Overview

### Dependencies

- [moleculer](https://github.com/moleculerjs/moleculer) - Microservices framework for NodeJS
- [nats](https://github.com/nats-io/node-nats) - [NATS](https://nats.io) transport driver for Moleculer _(optional)_
- [elasticsearch](https://github.com/elastic/elasticsearch-js) - [ELASTICSEARCH](https://www.elastic.co/products/elasticsearch) as database

### Application Structure

- `moleculer.config.js` - Moleculer ServiceBroker configuration file.
- `services/` - This folder contains the services.

## Test

```
$ npm test
```

# How to scale services?

	docker-compose scale products=2
	docker-compose scale auth=2
	docker-compose scale elastic=5

# Mention some micro-services specific pattern you used and why?

Project uses [EVERY SERVICE ON A SINGLE NODE](https://moleculer.services/docs/0.13/clustering.html#Microservices-architecture) micro-service architecture to make project scalable. By using this architecture we can scale all services to make system falut tolerant and flexible as there won’t be many dependency concerns and rolling back changes becomes much easier.

