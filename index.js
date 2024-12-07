const express = require('express');
const server = express()
const connectDb = require("./utils/connecDb")
const cookie = require("cookie-parser")
const bodyParser = require('body-parser');
const cors = require('cors')
const {config} = require('dotenv');

config("/.env")
const port = process.env.PORT

const {handleSignUp, handleLogin, getUserDetails, editUser, deleteUser, handleLogout, handleForgotPassword, handleResetPassword} = require("./utils/controllers/userController")
const verifyUser = require('./utils/controllers/verifyUser')


const { verifyAdmin } = require('./utils/controllers/verifyAdmin')
const {handleAddProducts, getProducts, searchProducts, braintreeTokenController, brainTreePaymentController } = require("./utils/controllers/productController");
const {createCartOrder} = require("./utils/controllers/orderController")
const {addDeliveryDetails} = require("./utils/controllers/delivery")
const {addToCart, removeFromCart, emptyCart, getCart}= require("./utils/controllers/cartHandler")
const multmid = require('./middlewares/multer');
const {isAuthenticated, isAdmin} = require('./middlewares/auth');
const { handleCategory } = require('./utils/controllers/feature');

server.use(express.json())
server.use(bodyParser.json())
server.use(cors({
    origin:
    "https://smartappliances.vercel.app",
// "http://localhost:3000",
credentials:true

}))
server.use(cookie())
// api routes for usercontrollers

server.post("/user/signup", handleSignUp);
server.post("/user/login", handleLogin);

server.get("/user/getuser",isAuthenticated, getUserDetails);


server.get("/user/verifyuser", verifyUser)

server.put("/user/edit",isAuthenticated, editUser)

server.delete("/user/delete", isAuthenticated, deleteUser)

server.post('/user/logout', handleLogout)
server.post("/forgotpassword", handleForgotPassword); // Forgot password route
server.post("/resetpassword", handleResetPassword); // Reset password route

// api routes for product controllers

server.post("/products/add", isAuthenticated, multmid,  handleAddProducts)
server.get("/user/isAdmin", isAuthenticated, verifyAdmin);
server.get("/products/getproducts", getProducts)
server.get("/search", searchProducts)


//catagory
server.get("/products/smartsecurity",(req,res)=>{handleCategory(req,res,"Smart-Security")})
server.get("/products/smartlighting",(req,res)=>{handleCategory(req,res,"Smart-Lighting")})
server.get("/products/smartspeakers",(req,res)=>{handleCategory(req,res,"Smart-Speakers")})
server.get("/products/smartswitches",(req,res)=>{handleCategory(req,res,"Smart-Switches")})
server.get("/products/smartdisplays",(req,res)=>{handleCategory(req,res,"Smart-Displays")})


server.put("/user/addDeliveryDetails", isAuthenticated, addDeliveryDetails)
 
// Order Routes 

server.post("/createOrder",isAuthenticated,createCartOrder)
// cart handler routes
server.post("/products/addtocart/:productId",isAuthenticated,addToCart)
server.get("/products/getcart",isAuthenticated,getCart)
server.get("/products/removeItem/:productId" ,isAuthenticated , removeFromCart)
server.get("/produts/emptycart" ,isAuthenticated , emptyCart)

server.listen(port,()=>{
    console.log(`server is running on port ${port}`);
    
})

connectDb()
