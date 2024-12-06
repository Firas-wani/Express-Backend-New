const Product = require("../../models/productModel");
const {memoryStorage} = require("multer");
const { messageHandler } = require('../utils');


const handleCategory = async(req, res, category) =>{
    try {
        const products = await Product.find({category: category})
if(products.length === 0){
    return messageHandler(res, 203, "No Products")
}else{
    res.json({message:"category", products})
}


    } catch (error) {
        console.log(error);
        
    }
}

const handleSubCategory = async(req, res, subcategory) =>{
    try {
        const products = await Product.find({subcategory : subcategory})
        if(products.length === 0){
            return messageHandler(res, 203, "No Products")
        }else{

            res.json({message:"subCategory", products})
        }
    } catch (error) {
        console.log(error);
        
    }
}


module.exports ={handleCategory, handleSubCategory}