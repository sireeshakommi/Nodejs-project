const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Signup = require('../models/Signup');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const login = async (req, res) => {
    const { email, password, token: sentToken } = req.body;

    try {
        // Check if the user exists
        const user = await Signup.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '2h' });

        if (sentToken) {
            // Validate the token if provided in the body
            try {
                const decoded = jwt.verify(sentToken, JWT_SECRET);
                return res.json({ message: 'Token is valid', user: decoded });
            } catch (error) {
                if (error.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: 'Token expired.' });
                }
                return res.status(400).json({ message: 'Invalid token.' });
            }
        }

        // If no token was sent or it was invalid, return the login response with the new token
        return res.json({ message: 'Login Successful', token });

    } catch (error) {
        console.error('Error Occurred:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = login;