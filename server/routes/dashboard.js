const express = require('express');
const router = express.Router();
const Load = require('../models/Load');
const Vehicle = require('../models/Vehicle');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, async (req, res) => {
    try {
        const stats = {};

        if (req.user.role === 'carrier' || req.user.role === 'owner_operator' || req.user.role === 'fleet_owner') {
            const myTrucks = await Vehicle.countDocuments({ owner: req.user.id });
            const myBids = await Load.find({ 'bids.carrier': req.user.id });

            const pendingBids = myBids.filter(l => l.bids.some(b => b.carrier.toString() === req.user.id && b.status === 'Pending')).length;
            const activeLoads = myBids.filter(l => l.bids.some(b => b.carrier.toString() === req.user.id && b.status === 'Accepted')).length;

            // Calculate pseudo-earnings (sum of accepted bids)
            let totalEarnings = 0;
            myBids.forEach(load => {
                const winningBid = load.bids.find(b => b.carrier.toString() === req.user.id && b.status === 'Accepted');
                if (winningBid) totalEarnings += winningBid.amount;
            });

            stats.activeJobs = activeLoads;
            stats.myTrucks = myTrucks;
            stats.pendingBids = pendingBids;
            stats.totalEarnings = totalEarnings;
        } else {
            // Shipper or Broker
            const myLoads = await Load.find({ shipper: req.user.id });
            const activePostings = myLoads.filter(l => l.status === 'Open').length;
            const inProgress = myLoads.filter(l => l.status === 'In-Transit').length;
            const totalPostings = myLoads.length;

            let totalBidsReceived = 0;
            myLoads.forEach(l => totalBidsReceived += (l.bids?.length || 0));

            stats.activePostings = activePostings;
            stats.inProgress = inProgress;
            stats.bidsReceived = totalBidsReceived;
            stats.totalSpent = 0; // Placeholder
        }

        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
