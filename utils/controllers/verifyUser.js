const jwt = require("jsonwebtoken");
const { messageHandler } = require("../../utils/utils");
const {config} = require("dotenv")
config("/.env")


const verifyUser = async(req , res) =>{
    try {
    const secretKey = process.env.SECRET_KEY;
const {token} = req.cookies;
jwt.verify(secretKey, token,(error, decode)=>{
    if(error){
        return messageHandler(res, 400, "not verified")
    }else{
res.json({message:"token verified", decode})
    }
})


    } catch (error) {
        console.log(error);
        
    }
}

module.exports = verifyUser