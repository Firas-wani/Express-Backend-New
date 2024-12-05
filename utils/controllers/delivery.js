const User = require("../../models/userModel")



const addDeliveryDetails = async (req, res) =>{
    try {
const userId = req.user;
const {mobile, fullname, street, landmark, state, city, pincode}  = req.body;
const credentials = {mobile, fullname, street, landmark, state, city, pincode}    


const someEmpty = Object.values(credentials).some(value => !value)
console.log(someEmpty);

if(someEmpty){
 return   res.status(206).json({message:"All credentials required"})
}
const user = await User.findByIdAndUpdate(userId,{
    mobile, fullname, street, landmark, state, city,   pincode
})
if(user){
    return res.status(200).json({message:"Delivery Details Updated"})
}else{
    return res.status(400).json({ message: "User not found or update failed" });
}
    } catch (error) {
        console.log(error);
        
    }
}

module.exports = {addDeliveryDetails}