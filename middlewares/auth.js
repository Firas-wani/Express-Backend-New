const jwt = require("jsonwebtoken");
const {config} = require("dotenv");
config("/.env");
const  { messageHandler } = require ("../utils/utils")
const User = require("../models/userModel")



const isAuthenticated = async(req,res,next)=>{
    try {
        const secretKey = process.env.SECRET_KEY;
        const {token} = req.cookies
        jwt.verify(token,secretKey,(error,decode)=>{
            if(error){
                return res.status(401).json({message:"unauthorized"})
            }else{
                console.log(decode);
                req.user = decode._id;
                return next()
                
            }
        })
} catch (error) {
        console.log(error);
        }
}

const isAdmin = async(req,res,next) =>{
    try {
        
const id = req.user;
const userEmail = process.env.ADMIN_EMAIL;
const findAdmin = await User.findById(id);
if(findAdmin.email !== userEmail){
    return messageHandler(res,201,"Unauthorized")
}
return next()
} catch (error) {
        console.log(error);
        
    }
}














module.exports = {isAuthenticated, isAdmin}

