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

        const loads = await Load.find(query)
            .populate('shipper', 'name companyName rating creditScore daysToPayAverage verificationBadges')
            .sort({ createdAt: -1 });
        
        res.json(loads);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Create a new load (Shipper only)
router.post('/', protect, async (req, res) => {
    const userRole = req.user.role.toLowerCase();
    if (userRole !== 'shipper' && userRole !== 'broker') {
        return res.status(403).json({ message: 'Only shippers and brokers can post loads' });
    }

    try {
        const load = await Load.create({
            shipper: req.user.id,
            ...req.body
        });
        res.status(201).json(load);
    } catch (error) {
        console.error('Load creation error:', error);
        res.status(400).json({ message: 'Invalid load data', error: error.message });
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

// ============= DAT-STYLE DIRECT CONTACT ENDPOINTS =============

// POST /api/loads/:id/view - Record load view (Analytics)
router.post('/:id/view', protect, async (req, res) => {
    try {
        const load = await Load.findById(req.params.id);
        if (!load) return res.status(404).json({ message: 'Load not found' });

        await load.recordView(req.user.id);
        
        res.json({ message: 'View recorded', viewCount: load.viewCount });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/loads/:id/contact - Reveal contact & track click (DAT-Style)
router.post('/:id/contact', protect, async (req, res) => {
    try {
        const load = await Load.findById(req.params.id)
            .populate('shipper', 'name companyName phone whatsapp');
        
        if (!load) return res.status(404).json({ message: 'Load not found' });

        // Record contact click for analytics
        await load.recordContactClick(req.user.id);
        
        // Return contact information
        res.json({
            message: 'Contact information revealed',
            contact: {
                personName: load.contactPersonName,
                mobile: load.contactMobile,
                whatsapp: load.contactWhatsApp || load.contactMobile,
                company: load.shipper?.companyName || load.shipper?.name
            },
            analytics: {
                viewCount: load.viewCount,
                contactViewCount: load.contactViewCount
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/loads/:id/analytics - Get load analytics (Shipper Only)
router.get('/:id/analytics', protect, async (req, res) => {
    try {
        const load = await Load.findById(req.params.id)
            .populate('viewedBy.user', 'name phone city')
            .populate('contactClickedBy.user', 'name phone city');
        
        if (!load) return res.status(404).json({ message: 'Load not found' });

        if (load.shipper.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view analytics' });
        }

        res.json({
            loadId: load._id,
            totalViews: load.viewCount,
            totalContactClicks: load.contactViewCount,
            viewedBy: load.viewedBy,
            contactClickedBy: load.contactClickedBy,
            conversionRate: load.viewCount > 0 
                ? ((load.contactViewCount / load.viewCount) * 100).toFixed(2) + '%' 
                : '0%'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
