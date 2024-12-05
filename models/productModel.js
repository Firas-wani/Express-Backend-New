const mongoose = require("mongoose");

const Product = mongoose.model("Product",{

title:String,
imageUrl : String,
description: String,
price: Number,
category: String,
stock:Number,
quantity:Number,


})

module.exports = Product;