const User =  require("../../models/userModel");
const { messageHandler } = require("../utils");
const {config} = require("dotenv");
config("/.env");


const verifyAdmin = async(req,res) =>{
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
const id = req.user;
const finduser = await User.findById(id);
const usermail = finduser.email;
if(adminEmail === usermail){
    return messageHandler(res,200,"Admin Verified")
}else{
    return messageHandler(res,202,"Unauthorized")
}
// console.log(adminEmail);
} catch (error) {
        console.log(error);
        
    }
}

module.exports={verifyAdmin}