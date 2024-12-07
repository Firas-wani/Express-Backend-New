const Product = require("../../models/productModel");
const User = require("../../models/userModel");
const { messageHandler }  = require("../../utils/utils");

const addToCart = async (req, res) => {
    try {
      const userId = req.user;
      const productId = req.params.productId;
      const { quantity  } = req.body;
  // console.log(quantity);
  
      const user = await User.findById(userId);
      if (!user) {
        return messageHandler(res,203,"Some Error Login Again");
      }
  
      const product = await Product.findById(productId);
      if (!product) {
        return messageHandler(res,206,"No Product Found")   
    }
  
      const cartItemIndex = user.cart.findIndex(
        (item) => item.productId.toString() === productId
      );
  
      if (cartItemIndex > -1) {
        user.cart[cartItemIndex].quantity += parseInt(quantity);
      } else {
        user.cart.push({
          productId: product._id,
          quantity: parseInt(quantity),
          price: product.price,
        
        });
      }
  
      
      const productIds = user.cart.map((item) => item.productId);
      const productsInCart = await Product.find({ _id: { $in: productIds } });
  
      
      user.cartValue = user.cart.reduce((acc, item) => {
        const itemProduct = productsInCart.find(
          (product) => product._id.toString() === item.productId.toString()
        );
        return acc + item.quantity * (itemProduct ? itemProduct.price : 0);
      }, 0);
  
      await user.save();
  
      return messageHandler(res,200,"Added to Cart")
    } catch (error) {
      console.error(error);
    }
  
  };
  


const getCart = async(req,res) =>{
    try {
        const userId = req.user
        const getUser = await User.findById(userId).populate({path:"cart.productId"})
if(getUser){
    return res.json({message:"cart fetched", getUser})
}else{
    return messageHandler(res,306,"No user")
}


    } catch (error) {
        console.log(error);
        
    }
}
const removeFromCart = async(req,res)=>{
    try {
        const userId = req.user;
        const productId = req.params.productId;
const user = await User.findById(userId);
if(!user){
    return messageHandler(res,206,"Login again")
}

const cartItemIndex = user.cart.findIndex(
    (item) => item.productId.toString() === productId
)
if(cartItemIndex > -1){
    user.cart.splice(cartItemIndex,1)
}else{
    return messageHandler(res, 206, "Product Not found in cart")
}

const productIds = user.cart.map((item) => item.productId)

const productsInCart = await Product.find({_id:{$in:productIds}})


user.cartValue = user.cart.reduce((acc,item)=>{

    const itemProduct = productsInCart.find(
        (product) => product._id.toString() === item.productId.toString()
    )

return acc + item.quantity * (itemProduct ? itemProduct.price : 0)

},0)
await user.save()
return res.redirect("/user/cart")

} catch (error) {
        console.log(error);
        
    }
}
const emptyCart = async(req,res)=>{
    try {
        const userId = req.user;
        const user = await User.findById(userId)
if(!user){
    return messageHandler(res,206,"Login Again")
}
user.cart= [];
user.cartValue = 0;
await user.save()
return res.redirect("/user/cart")
}catch(error) {
        console.log(error);
         }
}








module.exports={addToCart, getCart, removeFromCart, emptyCart}