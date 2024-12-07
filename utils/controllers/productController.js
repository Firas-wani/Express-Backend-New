const User = require("../../models/userModel");
const Product = require("../../models/productModel");
// const Order = require('../../models/orderModel');
const cloudinary = require("cloudinary").v2;
const { messageHandler } = require("../utils");
const path = require("path");
const { config } = require("dotenv");
config("/.env");
const braintree = require("braintree");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


const handleAddProducts = async (req, res) => {
  try {
    const _id = req.user;
    const user = await User.findById(_id);

    if (!user) {
      return messageHandler(res, 404, "User not found");
    }

    const { title, description, price, category } = req.body;
    const image = req.file?.path; // Optional chaining to handle cases where `req.file` is undefined

    if (!title || !image || !description || !price || !category) {
      return messageHandler(res, 203, "All credentials are required");
    }

    // Upload image to Cloudinary
    const upload = await cloudinary.uploader.upload(image); // Use `await` here
    if (!upload) {
      return res.status(203).json({ message: "Cloudinary error" });
    }

    const imageUrl = upload.secure_url;

    // Create the product
    const newProduct = await Product.create({
      title,
      description,
      imageUrl,
      price,
      category,
    });

    if (newProduct) {
      return messageHandler(res, 200, "Product Added Successfully");
    }
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getProducts = async (req, res) => {
  try {
    const newProducts = await Product.find();
    if (newProducts) {
      res.json({ message: "Products Fetched Successfully", newProducts });
    } else {
      return messageHandler(res, 404, "No Produts Found");
    }
  } catch (error) {
    console.log(error);
  }
};
const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    // Check if query exists
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Perform a case-insensitive search in the `name` and `description` fields
    const regex = new RegExp(query, "i");
    const products = await Product.find({
      $or: [{ name: regex }, { description: regex }],
    });

    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while searching." });
  }
};





module.exports = { handleAddProducts, getProducts, searchProducts}