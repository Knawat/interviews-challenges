## Interview Challenges

This Project will provide simple set of services with [Moleculer](https://moleculer.services/) Framework, with [REDIS](https://redis.io/) caching, and [NATS](https://nats.io/) for transportation.

## Functionality:

- User can log in & register.
- User can add product to the cart.
- User can get his cart summary.
- docker-compose support

## Backend:

- Elasticsearch as a database.
- NATs messaging system for services transportation.

# How to scale cart/product service?

	docker-compose scale products=2
	docker-compose scale auth=2
	docker-compose scale elastic=5

# Mention some micro-services specific pattern you used and why?

project uses [EVERY SERVICE ON A SINGLE NODE](https://moleculer.services/docs/0.13/clustering.html#Microservices-architecture) micro-service architecture to make project scallable. By using this architecture we can scale all services to make system falut tolerant and flexible as there won’t be many dependency concerns and rolling back changes becomes much easier.


## Postman Collection

[https://www.getpostman.com/collections/3ee4f1c212614ff64a82](https://www.getpostman.com/collections/3ee4f1c212614ff64a82)