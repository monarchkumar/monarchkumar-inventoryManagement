# Inventory Management API
Simple NodeJS based Inventory Management API with MongoDB.

## Setup

## Useage
There are two types of Collection storable (at the moment). 
->Category
  Specifies catagory of *Item* in inventory. 
  Model:
  
    name: String,
    description: String,
->Item
  Specifies description of *Item* in inventory
  Model:
  
    name: String,
    description: String,
    category: *Categoty* object id,
    price: Number,
    quantity: Number,

Access API for *Categories* by "/categories". CRUD operation available.
Access API for *Items* by "/items". CRUD operation available.

  
