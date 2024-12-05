const User = require("../../models/userModel");
const bcrypt = require("bcrypt");
const {messageHandler} = require("../../utils/utils")
const {config} = require("dotenv");
config("/.env")
const jwt = require("jsonwebtoken")
const secretKey = process.env.SECRET_KEY
const transporter = require('../../utils/nodeMailer')

// handle signup
const handleSignUp = async(req, res)=>{
try {
    const { username, email, password}= req.body;
    if(username !== "" && email !== "" && password !== ""){
        
const findAccount = await User.findOne({email});
if(findAccount){
    res.json({msg: "user already exists"});
}else{
const hashPass = await bcrypt.hash(password, 10);
const newAccount = await User.create({

username,
email, 
password:hashPass


});
if (newAccount) {
    // const baseUrl = "mongodb://localhost:27017/newdb";
    const baseUrl =   "http://localhost:3000"
    const link = `${baseUrl}/verify/email/${newAccount._id}`;
    const data = `Your account has been registered with Us ... kindly click on the below link    ${link} to actiavte your account  and confirm you Email`;

    const mail = await transporter.sendMail({
      from: "wanifiras7@gmail.com",
      to: `${email}`,
      subject: `Welecome ${username}`,
      text: data,
    });
if(newAccount && mail){
    res.json({msg:"User created successfully"})
}else{
    res.json({msg:"all credentials required"})
}
}
}
} 
}catch (error) {
    console.log(error);
    
}
}
// login handler

const handleLogin = async(req, res)=>{
    try {
        const {email , password} = req.body;
        if(email === "" || password === ""){
            return messageHandler(res, 203 , "all credentials required")
        }
const existingUser = await User.findOne({email})


if(!existingUser){
    return messageHandler(res, 203 , "User Not Found")
}
const checkPass = await bcrypt.compare(password,existingUser.password)
if(!checkPass){
    return messageHandler(res, 203 , "Password Incorrect")
}else{
    const payload = existingUser._id;
    const token = await jwt.sign({_id:payload}, secretKey)
    
if(token){
    res.cookie("token", token)
    res.status(201).json({message:"user logged in"})
}
}
} catch (error) {
        console.log(error);
        
    }
}

// get user details

const getUserDetails = async(req, res)=>{
try {
   const _id = req.user;
    if(_id){
        const getUser = await User.findById(_id)
        return messageHandler(res, 202, "User Fetched Successfully",{userDetails:getUser})
        
    }

} catch (error) {
    console.log(error);
    
}
}

// edit user 

const editUser = async(req,res)=>{
    try {
      const {email, username, password}= req.body;
      const _id = req.user;
      const findUser = await User.findById(_id);
if(findUser){
    const hashPass = await bcrypt.hash(password, 10)
    const editUser = await User.findByIdAndUpdate(_id,{
        email,
        username,
        password:hashPass
    })
}
if(editUser){
    return messageHandler (res,202,"User Updated Successfully")
}else{
    res.json({message:"Some Error"})
}
}
catch (error) {
        console.log(error);
        
    }
}


// delete user 

const deleteUser = async(req, res)=>{
    try {
        const id = req.user;
        if(id){
            const deleteUser = await User.findByIdAndDelete(id)
if(deleteUser){
    return messageHandler(res, 200, "User Deleted")
}else{
    res.json({message:"no user"})
}



        }

    } catch (error) {
        console.log(error);
        
    }
}

// logout

const handleLogout = async(req, res)=>{
    try {
        res.clearCookie("token");
        return messageHandler(res, 200, "User Logged out successfully ")
    } catch (error) {
        console.log(error);
        
    }
}


 




module.exports = {handleSignUp, handleLogin, getUserDetails, editUser, deleteUser, handleLogout }