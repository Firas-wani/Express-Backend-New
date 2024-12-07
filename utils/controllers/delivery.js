const User = require("../../models/userModel")

const addDeliveryDetails = async (req, res) =>{
    try {
const userId = req.user;
const {mobile, fullname, street, landmark, state, city, pincode}  = req.body;
const credentials = {mobile, fullname, street, landmark, state, city, pincode}    
const someEmpty = Object.values(credentials).some(value => !value)
// console.log(someEmpty);

if(someEmpty){
 return   res.status(206).json({message:"All credentials required"})
}
const user = await User.findById(userId)
if(!user){
    return res.json({message:'user not found'})
}
user.addresses.push(credentials)
await user.save()
return res.json({message:"Address Updated"})



    } catch (error) {
        console.log(error);
        
    }
}

module.exports = {addDeliveryDetails}

