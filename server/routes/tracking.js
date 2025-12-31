const express = require('express');
const router = express.Router();
const Load = require('../models/Load');
const { protect } = require('../middleware/authMiddleware');
const { uploadPOD } = require('../middleware/upload');

// POST /api/tracking/:loadId/update - Add tracking update
router.post('/:loadId/update', protect, async (req, res) => {
    try {
        const { status, location, note } = req.body;

        const load = await Load.findById(req.params.loadId);
        if (!load) {
            return res.status(404).json({ message: 'Load not found' });
        }

        // Check authorization - only assigned carrier can update
        if (load.assignedCarrier && load.assignedCarrier.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this load' });
        }

        load.trackingUpdates.push({
            status,
            location,
            note,
            updatedBy: req.user.id
        });

        await load.save();

        res.json({ message: 'Tracking updated successfully', trackingUpdates: load.trackingUpdates });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/tracking/:loadId/location - Update current location
router.post('/:loadId/location', protect, async (req, res) => {
    try {
        const { lat, lng, address } = req.body;

        const load = await Load.findById(req.params.loadId);
        if (!load) {
            return res.status(404).json({ message: 'Load not found' });
        }

        if (load.assignedCarrier && load.assignedCarrier.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        load.currentLocation = {
            lat,
            lng,
            address,
            lastUpdated: Date.now()
        };

        await load.save();

        res.json({ message: 'Location updated successfully', currentLocation: load.currentLocation });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/tracking/:loadId/pod - Upload proof of delivery
router.post('/:loadId/pod', protect, uploadPOD.array('images', 5), async (req, res) => {
    try {
        const load = await Load.findById(req.params.loadId);
        if (!load) {
            return res.status(404).json({ message: 'Load not found' });
        }

        if (load.assignedCarrier && load.assignedCarrier.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { signature } = req.body;

        // Add uploaded images to POD
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                load.proofOfDelivery.push({
                    imageUrl: file.path,
                    signature
                });
            });
        }

        await load.save();

        res.json({ message: 'Proof of delivery uploaded successfully', proofOfDelivery: load.proofOfDelivery });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT /api/tracking/:loadId/complete - Mark load as delivered
router.put('/:loadId/complete', protect, async (req, res) => {
    try {
        const load = await Load.findById(req.params.loadId)
            .populate('shipper', 'name email');

        if (!load) {
            return res.status(404).json({ message: 'Load not found' });
        }

        if (load.assignedCarrier && load.assignedCarrier.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        load.status = 'Delivered';
        load.actualDeliveryDate = Date.now();

        // Add final tracking update
        load.trackingUpdates.push({
            status: 'Delivered',
            location: load.destination,
            note: 'Load delivered successfully',
            updatedBy: req.user.id
        });

        await load.save();

        // Send notification to shipper
        const { notifyDeliveryCompleted } = require('../utils/notificationHelper');
        await notifyDeliveryCompleted(load.shipper._id, load.loadNumber);

        res.json({ message: 'Load marked as delivered', load });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/tracking/:loadId - Get load tracking history
router.get('/:loadId', async (req, res) => {
    try {
        const load = await Load.findById(req.params.loadId)
            .select('loadNumber origin destination status trackingUpdates currentLocation proofOfDelivery actualPickupDate actualDeliveryDate')
            .populate('trackingUpdates.updatedBy', 'name');

        if (!load) {
            return res.status(404).json({ message: 'Load not found' });
        }

        res.json(load);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
