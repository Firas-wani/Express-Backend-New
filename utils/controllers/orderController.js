const User = require("../../models/userModel");
const Product = require("../../models/productModel");
const Order = require("../../models/orderModel");
const { messageHandler } = require("../utils");


const createCartOrder = async(req,res)=>{
    try {
      const  userId = req.user;
      const user = await User.findById(userId)
      if(!user || user.cart.length === 0){
        return messageHandler(res,206,"Your cart is empty")
      }
      let totalAmount = 0;
      const productsInCart = [];
      for(const cartItem of user.cart){
        const product = cartItem.productId;
if(!product){
    return messageHandler(res,206,"Products Unavailiable")
}
const itemTotal = cartItem.price * cartItem.quantity;
totalAmount += itemTotal;
productsInCart.push({
    productId: product._id,
    quantity:cartItem.quantity,
    price:cartItem.price,
    // size:cartItem.size,
    color:cartItem.color,
});
  }

  const newOrder = new Order({
    user:userId,
    products:productsInCart,
    totalAmount:totalAmount,
    status:"pending"
  })

  const savedOrder = await newOrder.save()
user.orders.push(savedOrder._id);
user.cart=[];
user.cartValue=0;
await user.save()
res.status(200).json({message:"Order created successfully"})


    } catch (error) {
        console.log(error);
        
    }
}

const deleteOrder = async(req,res)=>{
    try {
       const orderId = req.params;
       const userId = req.user;
       const delOrder = await Order.findByIdAndDelete(orderId)
       const updatedUser= await User.findByIdAndUpdate(userId,{$pull:{orders:orderId}},{new:true});
       if(delOrder && updatedUser){
        return messageHandler(res,200,"Order Deleted")
       }
    } catch (error) {
        console.log(error);
        
    }
}

const orderAddAddress = async(req,res)=>{
    const {orderId} = req.params;
    try {
        const _id = req.user;
const user = await User.findById(_id)
const address = user.addresses[0]

if(!address || address === undefined){
    return res.status(206).json({message:"Kindly Add Address"})
}

const updatedOrder = await Order.findById(orderId,{
   $set:{address:[address[0]]}
})

if(updatedOrder){
    return messageHandler(res,200,"Order updated")
}


    } catch (error) {
        console.log(error);
        
    }

}
module.exports={createCartOrder, deleteOrder, orderAddAddress}