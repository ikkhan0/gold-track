const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Load = require('../models/Load');
const TruckAvailability = require('../models/TruckAvailability');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// @desc    Get all users (with optional status filter)
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, isAdmin, async (req, res) => {
    try {
        const { status, role, search } = req.query;
        const query = {};
        
        // Exclude admin and super_admin from list
        query.role = { $nin: ['admin', 'super_admin'] };
        
        // Apply filters
        if (status) query.status = status;
        if (role) query.role = role;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query).select('-password').sort({ createdAt: -1 });
        
        res.json({
            users,
            total: users.length
        });
    } catch (error) {
        console.error('Users fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Update user status (Approve/Reject)
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
router.put('/users/:id/status', protect, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const user = await User.findById(req.params.id);

        if (user) {
            user.status = status;
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                status: updatedUser.status
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Approve user
// @route   PUT /api/admin/users/:id/approve
// @access  Private/Admin
router.put('/users/:id/approve', protect, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.status = 'approved';
        await user.save();
        res.json({ message: 'User approved successfully', user: { _id: user._id, name: user.name, status: user.status } });
    } catch (error) {
        console.error('Approve error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Reject user
// @route   PUT /api/admin/users/:id/reject
// @access  Private/Admin
router.put('/users/:id/reject', protect, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.status = 'rejected';
        await user.save();
        res.json({ message: 'User rejected', user: { _id: user._id, name: user.name, status: user.status } });
    } catch (error) {
        console.error('Reject error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Suspend user
// @route   PUT /api/admin/users/:id/suspend
// @access  Private/Admin
router.put('/users/:id/suspend', protect, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.status = 'suspended';
        await user.save();
        res.json({ message: 'User suspended', user: { _id: user._id, name: user.name, status: user.status } });
    } catch (error) {
        console.error('Suspend error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Update user details
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
router.put('/users/:id', protect, isAdmin, async (req, res) => {
    try {
        const { name, email, phone, city, province, address, companyName, role, status } = req.body;
        
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields if provided
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (city) user.city = city;
        if (province) user.province = province;
        if (address) user.address = address;
        if (companyName) user.companyName = companyName;
        if (role) user.role = role;
        if (status) user.status = status;

        const updatedUser = await user.save();
        res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Get all CMS content
// @route   GET /api/admin/cms
// @access  Private/Admin
router.get('/cms', protect, isAdmin, async (req, res) => {
    try {
        const CMSContent = require('../models/CMSContent');
        const contents = await CMSContent.find().sort({ section: 1, createdAt: -1 });
        res.json(contents);
    } catch (error) {
        console.error('CMS fetch error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Update CMS content by key
// @route   PUT /api/admin/cms/:key
// @access  Private/Admin
router.put('/cms/:key', protect, isAdmin, async (req, res) => {
    try {
        const CMSContent = require('../models/CMSContent');
        const { title, content, description, imageUrl, metaTitle, metaDescription, isActive } = req.body;
        
        const updatedContent = await CMSContent.findOneAndUpdate(
            { key: req.params.key },
            {
                title,
                content: content || description,
                description,
                imageUrl,
                metaTitle,
                metaDescription,
                isActive,
                lastModifiedBy: req.user.id,
                updatedAt: Date.now()
            },
            { new: true, upsert: false }
        );

        if (!updatedContent) {
            return res.status(404).json({ message: 'CMS content not found' });
        }

        res.json(updatedContent);
    } catch (error) {
        console.error('CMS update error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Get all loads with pagination
// @route   GET /api/admin/loads
// @access  Private/Admin
router.get('/loads', protect, isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const total = await Load.countDocuments();
        const loads = await Load.find()
            .populate('shipper', 'name email phone companyName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            loads,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        console.error('Loads fetch error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Delete a load
// @route   DELETE /api/admin/loads/:id
// @access  Private/Admin
router.delete('/loads/:id', protect, isAdmin, async (req, res) => {
    try {
        const load = await Load.findById(req.params.id);

        if (!load) {
            return res.status(404).json({ message: 'Load not found' });
        }

        await load.deleteOne();
        res.json({ message: 'Load removed successfully' });
    } catch (error) {
        console.error('Load delete error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Get all trucks with pagination
// @route   GET /api/admin/trucks
// @access  Private/Admin
router.get('/trucks', protect, isAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const total = await TruckAvailability.countDocuments();
        const trucks = await TruckAvailability.find()
            .populate('carrier', 'name email phone')
            .populate('truck', 'registrationNumber type')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            trucks,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        console.error('Trucks fetch error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Delete a truck
// @route   DELETE /api/admin/trucks/:id
// @access  Private/Admin
router.delete('/trucks/:id', protect, isAdmin, async (req, res) => {
    try {
        const truck = await TruckAvailability.findById(req.params.id);

        if (!truck) {
            return res.status(404).json({ message: 'Truck not found' });
        }

        await truck.deleteOne();
        res.json({ message: 'Truck removed successfully' });
    } catch (error) {
        console.error('Truck delete error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
