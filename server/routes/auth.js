const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register User
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, role, cnic, companyName, address, city, licenseNumber, ntn } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role,
            status: 'pending', // Default status
            address,
            city,
            // Carrier specific
            cnic: role === 'carrier' ? cnic : undefined,
            licenseNumber: role === 'carrier' ? licenseNumber : undefined,
            // Shipper specific
            companyName: role === 'shipper' ? companyName : undefined,
            ntn: role === 'shipper' ? ntn : undefined
        });

        if (user) {
            res.status(201).json({
                message: 'Registration successful. Please wait for admin approval.',
                _id: user.id
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login User
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Allow admin and super_admin to login regardless of status
            if (user.status !== 'approved' && user.role !== 'admin' && user.role !== 'super_admin') {
                return res.status(403).json({ message: 'Your account is pending approval. Please contact support.' });
            }

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = router;
