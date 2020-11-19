# Knawat API 

[GetProducts](https://docs.knawat.io/#tag/My-Products/paths/~1catalog~1products/get)

The get products API have a list of products and the total products number of the list. 
Object:{ 
    products:Array, 
    total:length
}

You can check the queries in the api docs
You can use the length to determine the number of pages you have/pagination.

Product:{
    sku,name:{tr,ar,en},description:{tr,ar,en},images:[links],categories:{id,name{tr,ar,en},variation[object],attributes[object],shop from![object] }
}
