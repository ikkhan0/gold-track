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
        console.log('Login attempt:', { email: req.body.email });
        
        const { email, password } = req.body;

        if (!email || !password) {
            console.log('Missing email or password');
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        console.log('User found:', user ? { email: user.email, role: user.role, status: user.status } : 'No user found');

        if (user && (await bcrypt.compare(password, user.password))) {
            // Allow admin and super_admin to login regardless of status
            if (user.status !== 'approved' && user.role !== 'admin' && user.role !== 'super_admin') {
                console.log('User not approved');
                return res.status(403).json({ message: 'Your account is pending approval. Please contact support.' });
            }

            if (!process.env.JWT_SECRET) {
                console.error('JWT_SECRET is not set!');
                return res.status(500).json({ message: 'Server configuration error' });
            }

            const token = generateToken(user._id, user.role);
            console.log('Login successful for:', user.email);

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: token
            });
        } else {
            console.log('Invalid credentials');
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = router;
