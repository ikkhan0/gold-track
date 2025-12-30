const express = require('express');
const router = express.Router();
const Load = require('../models/Load');
const { protect } = require('../middleware/authMiddleware');

// Get all loads (with filters)
router.get('/', async (req, res) => {
    try {
        const { origin, destination, vehicle } = req.query;
        let query = { status: 'Open' };

        if (origin) query.origin = { $regex: origin, $options: 'i' };
        if (destination) query.destination = { $regex: destination, $options: 'i' };
        if (vehicle && vehicle !== 'Any') query.requiredVehicle = vehicle;

        const loads = await Load.find(query).populate('shipper', 'name companyName rating');
        res.json(loads);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Create a new load (Shipper only)
router.post('/', protect, async (req, res) => {
    if (req.user.role !== 'shipper') {
        return res.status(403).json({ message: 'Only shippers can post loads' });
    }

    try {
        const load = await Load.create({
            shipper: req.user.id,
            ...req.body
        });
        res.status(201).json(load);
    } catch (error) {
        res.status(400).json({ message: 'Invalid load data' });
    }
});

// Place a bid (Carrier only)
router.post('/:id/bid', protect, async (req, res) => {
    if (req.user.role !== 'carrier') {
        return res.status(403).json({ message: 'Only carriers can bid' });
    }

    try {
        const load = await Load.findById(req.params.id);
        if (!load) return res.status(404).json({ message: 'Load not found' });

        const newBid = {
            carrier: req.user.id,
            amount: req.body.amount,
            note: req.body.note
        };

        load.bids.push(newBid);
        await load.save();

        res.json({ message: 'Bid placed successfully', bids: load.bids });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get My Posted Loads (Shipper)
router.get('/posted', protect, async (req, res) => {
    try {
        const loads = await Load.find({ shipper: req.user.id }).populate('bids.carrier', 'name phone fleetType');
        res.json(loads);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get My Bidded Loads (Carrier)
router.get('/bidded', protect, async (req, res) => {
    try {
        const loads = await Load.find({ 'bids.carrier': req.user.id }).populate('shipper', 'name companyName');
        res.json(loads);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Manage Bid Status (Accept/Reject) - Shipper Only
router.put('/:id/bids/:bidId', protect, async (req, res) => {
    try {
        const load = await Load.findById(req.params.id);
        if (!load) return res.status(404).json({ message: 'Load not found' });

        if (load.shipper.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const bid = load.bids.id(req.params.bidId);
        if (!bid) return res.status(404).json({ message: 'Bid not found' });

        const { status } = req.body; // 'Accepted' or 'Rejected'
        bid.status = status;

        if (status === 'Accepted') {
            load.status = 'Assigned';
        }

        await load.save();
        res.json(load);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
