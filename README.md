# Simple cart app with Users, Products and Carts functionality

This App is built with Moleculer microservices, Elasticsearch as a database, Redis for caching.

## Install

    npm install

## Run the app

    npm run dev

## Run the tests

    npm run test
    
## Run Redis in docker

    docker run redis:latest
    
## Run Elasticsearch in docker

    docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.4.0

# REST API

The REST API to the example app is described below.
- [Users](#create-a-new-user)
    - [Create a new User](#create-a-new-user)
    - [Login and create Token](#get-existing-user)
- [Products](#create-product)
    - [Create a new Product](#create-product)
    - [Get Product by SKU](#get-product)
    - [Add Product to cart](#add-to-cart)
    
## Create a new User

### Request

`POST /users/create`

    curl --location --request POST 'http://localhost:3000/users/create' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "user": {
            "username": "abdozak",
            "password": "123456789",
            "email": "abdo.zak.ams@gmail.com"
        }
    }'

### Response

    HTTP/1.1 200 Ok

    {
        "_index": "users",
        "_type": "user",
        "_id": "axCCrHQB_M4gtWtjTXPU",
        "_version": 1,
        "result": "created",
        "_shards": {
            "total": 2,
            "successful": 1,
            "failed": 0
        },
        "_seq_no": 0,
        "_primary_term": 1
    }

## Login

### Request

`GET /users/login`

    curl --location --request POST 'http://localhost:3000/users/login' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "user": {
            "username": "abdozak",
            "password": "123456789",
            "email": "abdo.zak.ams@gmail.com"
        }
    }'

### Response

    HTTP/1.1 200 OK

    {
        "user": {
            "username": "abdozak",
            "email": "abdo.zak.ams@gmail.com",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImF4Q0NySFFCX000Z3RXdGpUWFBVIiwiZW1haWwiOiJhYmRvLnphay5hbXNAZ21haWwuY29tIiwiZXhwIjoxNjA1ODA2MjgzLCJpYXQiOjE2MDA2MjIyODN9.Nn2E-aVPFfeiq_ytBa3ovJ0pgO_6-xqFQLHHNmpnAm4"
            }
    }
    
## Get existing user

### Request

`GET /user`

    curl --location --request GET 'http://localhost:3000/user' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImF4Q0NySFFCX000Z3RXdGpUWFBVIiwiZW1haWwiOiJhYmRvLnphay5hbXNAZ21haWwuY29tIiwiZXhwIjoxNjA1ODA2MjgzLCJpYXQiOjE2MDA2MjIyODN9.Nn2E-aVPFfeiq_ytBa3ovJ0pgO_6-xqFQLHHNmpnAm4' \

### Response

    HTTP/1.1 404 Not Found

    {
        "user": {
            "username": "abdozak",
            "email": "abdo.zak.ams@gmail.com",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImF4Q0NySFFCX000Z3RXdGpUWFBVIiwiZW1haWwiOiJhYmRvLnphay5hbXNAZ21haWwuY29tIiwiZXhwIjoxNjA1ODA2MjgzLCJpYXQiOjE2MDA2MjIyODN9.Nn2E-aVPFfeiq_ytBa3ovJ0pgO_6-xqFQLHHNmpnAm4"
            }
    }

## Create Product

### Request

`POST /products/create`

    curl --location --request POST 'http://localhost:3000/products/create' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImF4Q0NySFFCX000Z3RXdGpUWFBVIiwiZW1haWwiOiJhYmRvLnphay5hbXNAZ21haWwuY29tIiwiZXhwIjoxNjA1ODA2MjgzLCJpYXQiOjE2MDA2MjIyODN9.Nn2E-aVPFfeiq_ytBa3ovJ0pgO_6-xqFQLHHNmpnAm4' \
    --header 'Content-Type: application/json' \
    --data-raw '{   "product": {
            "sku":"9876543212",
            "data": {
                "title": "shoes"
                }
            }
        }'

### Response

    HTTP/1.1 200 Created
    
    {
        "_index": "products",
        "_type": "product",
        "_id": "9876543212",
        "_version": 1,
        "result": "created",
        "_shards": {
            "total": 2,
            "successful": 1,
            "failed": 0
        },
        "_seq_no": 0,
        "_primary_term": 1
    }

## Get Product

### Request

`GET /products/{Product SKU}`

    curl --location --request GET 'http://localhost:3000/products/9876543212/' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImF4Q0NySFFCX000Z3RXdGpUWFBVIiwiZW1haWwiOiJhYmRvLnphay5hbXNAZ21haWwuY29tIiwiZXhwIjoxNjA1ODA2MjgzLCJpYXQiOjE2MDA2MjIyODN9.Nn2E-aVPFfeiq_ytBa3ovJ0pgO_6-xqFQLHHNmpnAm4' \
    

### Response

    HTTP/1.1 200 OK

    {
        "title": "shoes"
    }

## Add to cart

### Request

`POST /products/{Product SKU}/cart`

    curl --location --request POST 'http://localhost:3000/products/9876543212/cart' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImF4Q0NySFFCX000Z3RXdGpUWFBVIiwiZW1haWwiOiJhYmRvLnphay5hbXNAZ21haWwuY29tIiwiZXhwIjoxNjA1ODA2MjgzLCJpYXQiOjE2MDA2MjIyODN9.Nn2E-aVPFfeiq_ytBa3ovJ0pgO_6-xqFQLHHNmpnAm4' \

### Response

    HTTP/1.1 200 OK

    {
        "_index": "carts",
        "_type": "cart",
        "_id": "axCCrHQB_M4gtWtjTXPU",
        "_version": 1,
        "result": "created",
        "_shards": {
            "total": 2,
            "successful": 1,
            "failed": 0
        },
        "_seq_no": 0,
        "_primary_term": 1
    }
