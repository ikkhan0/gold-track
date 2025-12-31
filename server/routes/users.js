const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/authMiddleware');

// POST /api/users/carriers/add-preferred - Add carrier to preferred network
router.post('/carriers/add-preferred', protect, authorize('shipper', 'broker'), async (req, res) => {
    try {
        const { carrierId, notes } = req.body;

        const carrier = await User.findById(carrierId);
        if (!carrier || (carrier.role !== 'carrier' && carrier.role !== 'fleet_owner' && carrier.role !== 'owner_operator')) {
            return res.status(404).json({ message: 'Carrier not found' });
        }

        const user = await User.findById(req.user.id);

        // Check if already in list
        const alreadyAdded = user.preferredCarriers.find(
            c => c.carrier.toString() === carrierId
        );

        if (alreadyAdded) {
            return res.status(400).json({ message: 'Carrier already in preferred list' });
        }

        user.preferredCarriers.push({
            carrier: carrierId,
            notes
        });

        await user.save();

        res.json({ message: 'Carrier added to preferred network' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE /api/users/carriers/remove-preferred - Remove carrier from preferred list
router.delete('/carriers/remove-preferred/:carrierId', protect, authorize('shipper', 'broker'), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        user.preferredCarriers = user.preferredCarriers.filter(
            c => c.carrier.toString() !== req.params.carrierId
        );

        await user.save();

        res.json({ message: 'Carrier removed from preferred network' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/users/carriers/block - Block a carrier
router.post('/carriers/block', protect, authorize('shipper', 'broker'), async (req, res) => {
    try {
        const { carrierId, reason } = req.body;

        const carrier = await User.findById(carrierId);
        if (!carrier) {
            return res.status(404).json({ message: 'Carrier not found' });
        }

        const user = await User.findById(req.user.id);

        // Remove from preferred if exists
        user.preferredCarriers = user.preferredCarriers.filter(
            c => c.carrier.toString() !== carrierId
        );

        // Check if already blocked
        const alreadyBlocked = user.blockedCarriers.find(
            c => c.carrier.toString() === carrierId
        );

        if (alreadyBlocked) {
            return res.status(400).json({ message: 'Carrier is already blocked' });
        }

        user.blockedCarriers.push({
            carrier: carrierId,
            blockedAt: Date.now(),
            reason
        });

        await user.save();

        res.json({ message: 'Carrier has been blocked' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE /api/users/carriers/unblock/:carrierId - Unblock a carrier
router.delete('/carriers/unblock/:carrierId', protect, authorize('shipper', 'broker'), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        user.blockedCarriers = user.blockedCarriers.filter(
            c => c.carrier.toString() !== req.params.carrierId
        );

        await user.save();

        res.json({ message: 'Carrier has been unblocked' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/users/carriers/my-network - Get my preferred and blocked carriers
router.get('/carriers/my-network', protect, authorize('shipper', 'broker'), async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('preferredCarriers.carrier', 'name companyName rating reviewCount verificationBadges phone')
            .populate('blockedCarriers.carrier', 'name companyName rating');

        res.json({
            preferred: user.preferredCarriers,
            blocked: user.blockedCarriers
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
