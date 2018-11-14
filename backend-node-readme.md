
# Knawat-moleculer-test 
## About:
A simple nodejs app using moleculer.services framework to build it with microservices arch. 

## Used tools:

 - NATs : transporter
 - Redis : caching db
 - Elasticsearch : used as engine in indexing products and querying about them
 - Mongodb: used as db for users and cart services


## Run it:
After cloning the repository, you should be having docker-compose installed , build docker server in the root folder: 
> docker-compose build

After finishing successfully, run the whole project with all containers:
>docker-compose up

## Run unit tests:
* First you will need to have specific docker containers(tools) up:
>  docker-compose up elasticsearch nats redis mongo

Note: that we assume you already build them.


## How to scale cart service:
 - Traefik: using it for load balancing, It gives us the ease of adding more instances for any service and let it be consumed directly through that load balancer , not direct
## Patterns used:

 - API Gateway: in order to let the services be consumed using http

## APIs Documentation
- we are using (APIDoc)[http://apidocjs.com] in order to generate documentation on how to consume the APIs
- first install it on command line:
> npm install apidoc -g
- then run this to generate the documentation:
> apidoc -i YOUR-FOLDER/services -o docs/ 