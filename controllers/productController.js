const Product = require('../models/Product');
const Signup = require('../models/Signup');

// Create a new product
const createProduct = async (req, res) => {
    const { userId, name, price, description } = req.body;

    if(!userId || !name || !price || !description)
    {
        return res.status(400).json({error:"All fields are required"});
    }
   
    try { 
        // Create the product
    const newProduct = new Product({
      userId,
      name,
      price,
      description
    });

   const savedProduct =  await newProduct.save();

    res.status(201).json({ message: 'Product created successfully', product: savedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error while creating product', error });
  }
};

// Get all products with user details (join operation)
const getProductsById = async (req, res) => {
  try {
    const products = await Product.find({userId:req.params.userId}).populate('userId','email');
    if(products.length === 0)
    {
        return res.status(404).json({message:'No order found for this user'});
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products with user details', error });
  }
};

// Export the functions
module.exports = {
  createProduct,
  getProductsById
};