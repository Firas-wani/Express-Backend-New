// const mongoose = require("mongoose")
// const Product = require("../models/productModel")


// const User =mongoose.model("user",{
// username:String,
// email:String,
// password:String,
// addresses :[
//   {
  
//   fullname:String,
//   street: String,
//   // village:String,
//   contact:String,
//   landmark: String,
//   city: String,
//   state: String,
//   postalCode:String,

//   }


  
// ],

//   isEmailVerified: Boolean,
//   cartValue : {type:Number},
// cart :[
//   {
// productId : {type: mongoose.Schema.Types.ObjectId, ref: "Products"},
// quantity : {type:Number},
// price : {type:Number},

// }
// ],

// orders:[
//   {
// type: mongoose.Schema.Types.ObjectId, ref: "Order"
//   }
// ]



// })
// module.exports = User
const mongoose = require("mongoose");
const Product = require("./productModel");

const User = mongoose.model("User", {
  username: String,
  email: String,
  password: String,
  addresses: [
    {
      fullname: String,
      street: String,
      city: String,
      state: String,
      contact: String,
      pincode: String,
      landmark: String,
      village: String,
    },
  ],
  isEmailVerified: Boolean,
  cartValue: { type: Number },
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number },
      price: { type: Number },
      size: { type: String },
      color: { type: String },
    },
  ],

  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", // Reference to Order model
    },
  ],
});

module.exports = User;