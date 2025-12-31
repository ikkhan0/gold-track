const express = require('express');
const router = express.Router();
const SavedSearch = require('../models/SavedSearch');
const Load = require('../models/Load');
const { protect } = require('../middleware/authMiddleware');
const { notifyNewMessage } = require('../utils/notificationHelper');

// POST /api/searches/save - Save a search
router.post('/save', protect, async (req, res) => {
    try {
        const { name, filters, isAlarmEnabled, alarmSettings } = req.body;

        const savedSearch = await SavedSearch.create({
            user: req.user.id,
            name,
            filters,
            isAlarmEnabled,
            alarmSettings
        });

        res.status(201).json({ message: 'Search saved successfully', savedSearch });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/searches - Get all saved searches
router.get('/', protect, async (req, res) => {
    try {
        const searches = await SavedSearch.find({ user: req.user.id })
            .sort({ createdAt: -1 });

        res.json(searches);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/searches/:id/run - Run a saved search
router.get('/:id/run', protect, async (req, res) => {
    try {
        const savedSearch = await SavedSearch.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!savedSearch) {
            return res.status(404).json({ message: 'Saved search not found' });
        }

        // Build query from saved filters
        const query = { status: 'Open' };

        if (savedSearch.filters.origin) {
            query.origin = { $regex: savedSearch.filters.origin, $options: 'i' };
        }
        if (savedSearch.filters.destination) {
            query.destination = { $regex: savedSearch.filters.destination, $options: 'i' };
        }
        if (savedSearch.filters.vehicleType) {
            query.requiredVehicle = savedSearch.filters.vehicleType;
        }
        if (savedSearch.filters.minRate) {
            query.offerPrice = { $gte: savedSearch.filters.minRate };
        }
        if (savedSearch.filters.maxRate) {
            query.offerPrice = { ...query.offerPrice, $lte: savedSearch.filters.maxRate };
        }
        if (savedSearch.filters.maxAge) {
            const minCreatedAt = new Date(Date.now() - savedSearch.filters.maxAge * 60000);
            query.createdAt = { $gte: minCreatedAt };
        }

        // Equipment details filters
        if (savedSearch.filters.equipmentDetails) {
            Object.keys(savedSearch.filters.equipmentDetails).forEach(key => {
                if (savedSearch.filters.equipmentDetails[key]) {
                    query[`equipmentDetails.${key}`] = true;
                }
            });
        }

        const loads = await Load.find(query)
            .populate('shipper', 'name companyName creditScore daysToPayAverage rating')
            .sort({ createdAt: -1 });

        // Update last run time
        savedSearch.lastRun = Date.now();
        await savedSearch.save();

        res.json({
            searchName: savedSearch.name,
            filters: savedSearch.filters,
            results: loads,
            count: loads.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT /api/searches/:id - Update saved search
router.put('/:id', protect, async (req, res) => {
    try {
        const savedSearch = await SavedSearch.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!savedSearch) {
            return res.status(404).json({ message: 'Saved search not found' });
        }

        const { name, filters, isAlarmEnabled, alarmSettings } = req.body;

        if (name) savedSearch.name = name;
        if (filters) savedSearch.filters = filters;
        if (isAlarmEnabled !== undefined) savedSearch.isAlarmEnabled = isAlarmEnabled;
        if (alarmSettings) savedSearch.alarmSettings = alarmSettings;

        await savedSearch.save();

        res.json({ message: 'Search updated successfully', savedSearch });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE /api/searches/:id - Delete saved search
router.delete('/:id', protect, async (req, res) => {
    try {
        const savedSearch = await SavedSearch.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!savedSearch) {
            return res.status(404).json({ message: 'Saved search not found' });
        }

        await savedSearch.deleteOne();
        res.json({ message: 'Search deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT /api/searches/:id/alarm - Toggle alarm for saved search
router.put('/:id/alarm', protect, async (req, res) => {
    try {
        const { enabled } = req.body;

        const savedSearch = await SavedSearch.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!savedSearch) {
            return res.status(404).json({ message: 'Saved search not found' });
        }

        savedSearch.isAlarmEnabled = enabled;
        await savedSearch.save();

        const message = enabled ? 'Alarm enabled' : 'Alarm disabled';
        res.json({ message, savedSearch });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
