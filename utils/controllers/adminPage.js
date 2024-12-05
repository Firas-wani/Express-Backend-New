const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Order = require("../../models/orderModel");

const getAdminPage = async(req,res)=>{
    try {
       const products = await Product.find().lean()

       const users =  await User.find()
       .populate({
        path:"cart.productId",
        select:"name price"
       })
       .populate({
        path:"orders",
        select:"totalAmount"
       })


       const orders = await Product.find()
       .populate({
        path:"users",
})
.populate({
    path:"products.productId"
})

res.status(200).json({
user : req.user._id,
username : req.user.username,
cart: req.user.cart,
products: products,
users: users,
orders: orders



})
    } catch (error) {
        console.log(error);
        
    }
}