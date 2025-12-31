const express = require('express');
const router = express.Router();
const Load = require('../models/Load');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Review = require('../models/Review');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// GET /api/analytics/overview - Platform overview (Admin only)
router.get('/overview', protect, isAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalLoads = await Load.countDocuments();
        const activeLoads = await Load.countDocuments({ status: { $in: ['Open', 'Assigned', 'In-Transit'] } });
        const completedLoads = await Load.countDocuments({ status: 'Delivered' });
        const totalVehicles = await Vehicle.countDocuments();

        const usersByRole = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);

        const loadsByStatus = await Load.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        res.json({
            totalUsers,
            totalLoads,
            activeLoads,
            completedLoads,
            totalVehicles,
            usersByRole,
            loadsByStatus
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/analytics/load-trends - Load posting trends
router.get('/load-trends', protect, isAdmin, async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const trends = await Load.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);

        res.json(trends);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/analytics/popular-routes - Popular origin-destination pairs
router.get('/popular-routes', protect, isAdmin, async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const routes = await Load.aggregate([
            {
                $group: {
                    _id: { origin: '$origin', destination: '$destination' },
                    count: { $sum: 1 },
                    avgOfferPrice: { $avg: '$offerPrice' }
                }
            },
            { $sort: { count: -1 } },
            { $limit: parseInt(limit) }
        ]);

        res.json(routes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/analytics/market-insights - Market insights for DAT-like dashboard
router.get('/market-insights', protect, async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Load-to-truck ratio by major cities
        const cities = ['Karachi', 'Lahore', 'Islamabad', 'Peshawar', 'Quetta', 'Multan', 'Faisalabad', 'Rawalpindi'];
        const marketData = [];

        for (const city of cities) {
            const loadsCount = await Load.countDocuments({
                origin: { $regex: city, $options: 'i' },
                status: 'Open',
                createdAt: { $gte: thirtyDaysAgo }
            });

            const trucksCount = await Vehicle.countDocuments({
                status: 'Active',
                // This is simplified - in real scenario, you'd track vehicle location
            });

            marketData.push({
                city,
                loadsCount,
                trucksCount: Math.floor(trucksCount / cities.length), // Simplified distribution
                ratio: trucksCount > 0 ? (loadsCount / (trucksCount / cities.length)).toFixed(2) : 0,
                trend: loadsCount > 10 ? 'high' : loadsCount > 5 ? 'medium' : 'low'
            });
        }

        // Average rates by vehicle type
        const ratesByVehicle = await Load.aggregate([
            { $match: { offerPrice: { $exists: true, $ne: null } } },
            {
                $group: {
                    _id: '$requiredVehicle',
                    avgRate: { $avg: '$offerPrice' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Top performing carriers
        const topCarriers = await Review.aggregate([
            { $match: { type: 'carrier_review' } },
            {
                $group: {
                    _id: '$reviewee',
                    avgRating: { $avg: '$rating' },
                    reviewCount: { $sum: 1 }
                }
            },
            { $match: { reviewCount: { $gte: 3 } } },
            { $sort: { avgRating: -1, reviewCount: -1 } },
            { $limit: 10 }
        ]);

        await User.populate(topCarriers, { path: '_id', select: 'name companyName fleetSize' });

        res.json({
            marketData,
            ratesByVehicle,
            topCarriers
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/analytics/lane-competition - Competitive analysis for a specific lane
router.get('/lane-competition', protect, async (req, res) => {
    try {
        const { origin, destination } = req.query;

        if (!origin || !destination) {
            return res.status(400).json({ message: 'Origin and destination are required' });
        }

        // Get active loads for this lane
        const activeLoadsCount = await Load.countDocuments({
            origin: { $regex: origin, $options: 'i' },
            destination: { $regex: destination, $options: 'i' },
            status: 'Open'
        });

        // Get available trucks data (assuming TruckAvailability model is available)
        // If not, we fall back to generic vehicle data or 0
        let availableTrucksCount = 0;
        try {
            const TruckAvailability = require('../models/TruckAvailability');
            availableTrucksCount = await TruckAvailability.countDocuments({
                currentLocation: { $regex: origin, $options: 'i' },
                destination: { $regex: destination, $options: 'i' },
                isAvailable: true,
                status: 'Available'
            });
        } catch (err) {
            console.log('TruckAvailability model not ready yet');
        }

        // Calculate Average Rate
        const avgRateData = await Load.aggregate([
            {
                $match: {
                    origin: { $regex: origin, $options: 'i' },
                    destination: { $regex: destination, $options: 'i' },
                    offerPrice: { $exists: true, $ne: null }
                }
            },
            {
                $group: {
                    _id: null,
                    avgRate: { $avg: '$offerPrice' }
                }
            }
        ]);

        const avgRate = avgRateData.length > 0 ? Math.round(avgRateData[0].avgRate) : 0;

        // Determine Market Rate Trend (Simple logic for now)
        // In real app, compare with last week's average
        const trend = 'stable';

        // Calculate Load-to-Truck Ratio
        const ratio = availableTrucksCount > 0 ? (activeLoadsCount / availableTrucksCount).toFixed(2) : activeLoadsCount;

        // Determine Market Condition
        let marketCondition = 'normal';
        if (ratio > 3) marketCondition = 'hot'; // Carrier's market
        else if (ratio < 1) marketCondition = 'cold'; // Shipper's market

        res.json({
            origin,
            destination,
            totalLoads: activeLoadsCount,
            totalTrucksAvailable: availableTrucksCount,
            ratio: parseFloat(ratio),
            marketCondition,
            avgRate,
            trend
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/analytics/lanemakers - Get top carriers for a specific lane
router.get('/lanemakers', protect, async (req, res) => {
    try {
        const { origin, destination } = req.query;

        if (!origin || !destination) {
            return res.status(400).json({ message: 'Origin and destination are required' });
        }

        // Find carriers who have completed loads on this lane
        const topCarriers = await Load.aggregate([
            {
                $match: {
                    origin: { $regex: origin, $options: 'i' },
                    destination: { $regex: destination, $options: 'i' },
                    status: 'Delivered',
                    assignedCarrier: { $exists: true }
                }
            },
            {
                $group: {
                    _id: '$assignedCarrier',
                    loadCount: { $sum: 1 },
                    avgRating: { $avg: '$rating' } // Assuming rating is on Load or we'd lookup from User
                }
            },
            { $sort: { loadCount: -1 } },
            { $limit: 10 }
        ]);

        await User.populate(topCarriers, {
            path: '_id',
            select: 'name companyName rating reviewCount verificationBadges fleetSize'
        });

        const formattedCarriers = topCarriers.map(c => ({
            carrier: c._id,
            loadCount: c.loadCount,
            marketShare: 'High' // Calculation logic could go here
        }));

        res.json({
            origin,
            destination,
            lanemakers: formattedCarriers
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/analytics/user-activity - User activity metrics (Admin only)
router.get('/user-activity', protect, isAdmin, async (req, res) => {
    try {
        const activeUsers = await User.countDocuments({
            lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        });

        const newUsers = await User.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        });

        const topShippers = await Load.aggregate([
            {
                $group: {
                    _id: '$shipper',
                    totalLoads: { $sum: 1 },
                    completedLoads: {
                        $sum: { $cond: [{ $eq: ['$status', 'Delivered'] }, 1, 0] }
                    }
                }
            },
            { $sort: { totalLoads: -1 } },
            { $limit: 10 }
        ]);

        await User.populate(topShippers, { path: '_id', select: 'name companyName rating' });

        res.json({
            activeUsers,
            newUsers,
            topShippers
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/analytics/my-performance - User's own performance metrics
router.get('/my-performance', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;

        let performance = {};

        if (role === 'shipper' || role === 'broker') {
            const totalPosted = await Load.countDocuments({ shipper: userId });
            const completed = await Load.countDocuments({ shipper: userId, status: 'Delivered' });
            const active = await Load.countDocuments({ shipper: userId, status: { $in: ['Open', 'Assigned', 'In-Transit'] } });

            const avgBidsReceived = await Load.aggregate([
                { $match: { shipper: userId } },
                { $project: { bidCount: { $size: '$bids' } } },
                { $group: { _id: null, avg: { $avg: '$bidCount' } } }
            ]);

            performance = {
                totalLoadsPosted: totalPosted,
                completedLoads: completed,
                activeLoads: active,
                completionRate: totalPosted > 0 ? ((completed / totalPosted) * 100).toFixed(1) : 0,
                avgBidsReceived: avgBidsReceived[0]?.avg?.toFixed(1) || 0
            };
        } else {
            // Carrier/Fleet Owner/Owner Operator
            const totalBids = await Load.countDocuments({ 'bids.carrier': userId });
            const acceptedBids = await Load.countDocuments({
                assignedCarrier: userId,
                'bids.carrier': userId,
                'bids.status': 'Accepted'
            });
            const completedJobs = await Load.countDocuments({
                assignedCarrier: userId,
                status: 'Delivered'
            });

            const myVehicles = await Vehicle.countDocuments({ owner: userId });

            performance = {
                totalBidsPlaced: totalBids,
                acceptedBids,
                completedJobs,
                acceptanceRate: totalBids > 0 ? ((acceptedBids / totalBids) * 100).toFixed(1) : 0,
                completionRate: acceptedBids > 0 ? ((completedJobs / acceptedBids) * 100).toFixed(1) : 0,
                totalVehicles: myVehicles
            };
        }

        // Common metrics
        const myReviews = await Review.find({ reviewee: userId });
        const avgRating = myReviews.length > 0
            ? (myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length).toFixed(1)
            : 0;

        performance.rating = avgRating;
        performance.totalReviews = myReviews.length;

        res.json(performance);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
