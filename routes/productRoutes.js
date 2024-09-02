const express = require('express');
const router = express.Router();
const { createProduct, getProductsById } = require('../controllers/productController');

// Route to create a new product
router.post('/products', createProduct);

// Route to get all products with user details
router.get('/products/:userId', getProductsById);

module.exports = router;