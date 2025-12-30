const express = require('express');
const router = express.Router();
const Load = require('../models/Load');
const Vehicle = require('../models/Vehicle');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, async (req, res) => {
    try {
        const stats = {};

        if (req.user.role === 'carrier') {
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

            stats.title1 = 'Active Jobs';
            stats.value1 = activeLoads;
            stats.title2 = 'My Trucks';
            stats.value2 = myTrucks;
            stats.title3 = 'Pending Bids';
            stats.value3 = pendingBids;
            stats.title4 = 'Proj. Earnings';
            stats.value4 = `Rs ${totalEarnings.toLocaleString()}`;
        } else {
            // Shipper
            const myLoads = await Load.find({ shipper: req.user.id });
            const activePostings = myLoads.filter(l => l.status === 'Open').length;
            const totalPostings = myLoads.length;

            let totalBidsReceived = 0;
            myLoads.forEach(l => totalBidsReceived += l.bids.length);

            stats.title1 = 'Active Postings';
            stats.value1 = activePostings;
            stats.title2 = 'Total Posted';
            stats.value2 = totalPostings;
            stats.title3 = 'Bids Received';
            stats.value3 = totalBidsReceived;
            stats.title4 = 'Total Spent';
            stats.value4 = 'Rs 0'; // Placeholder
        }

        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
