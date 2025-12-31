const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// GET /api/settings - Get global settings (Public)
router.get('/', async (req, res) => {
    try {
        const settings = await Settings.getSettings();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT /api/settings - Update settings (Admin Only)
router.put('/', protect, isAdmin, async (req, res) => {
    try {
        let settings = await Settings.getSettings();
        
        // Update allowed fields
        const allowedFields = [
            'companyName', 'companyPhone', 'companyWhatsApp', 'companyEmail',
            'companyAddress', 'supportPhone', 'facebook', 'instagram',
            'linkedin', 'twitter', 'businessHours', 'enableBidding',
            'enableDirectContact', 'requireApprovalForPosts', 'autoExpireLoadsAfterDays',
            'goldSubscriptionMonthly', 'goldSubscriptionYearly',
            'premiumSubscriptionMonthly', 'premiumSubscriptionYearly'
        ];
        
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                settings[field] = req.body[field];
            }
        });
        
        settings.updatedBy = req.user.id;
        settings.updatedAt = new Date();
        
        await settings.save();
        
        res.json({
            message: 'Settings updated successfully',
            settings
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
