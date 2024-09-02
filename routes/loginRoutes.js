const express = require('express');
const router = express.Router();
const login = require('../controllers/loginController'); // Adjust the path as necessary

// Define the POST /login route
router.post('/login', login);

module.exports = router;