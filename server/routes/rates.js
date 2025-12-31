const express = require('express');
const router = express.Router();
const LaneRate = require('../models/LaneRate');
const Load = require('../models/Load');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// GET /api/rates/lane - Get lane rate for specific route
router.get('/lane', async (req, res) => {
    try {
        const { origin, destination, vehicleType = 'Any' } = req.query;

        if (!origin || !destination) {
            return res.status(400).json({ message: 'Origin and destination are required' });
        }

        // Check if we have recent cached data
        let laneRate = await LaneRate.findOne({
            origin: { $regex: origin, $options: 'i' },
            destination: { $regex: destination, $options: 'i' },
            vehicleType,
            lastUpdated: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // 24 hours
        });

        // If no recent data, calculate it
        if (!laneRate) {
            const calculatedData = await LaneRate.calculateLaneRate(origin, destination, vehicleType);

            if (!calculatedData) {
                return res.json({
                    message: 'Insufficient data for this lane',
                    hasData: false
                });
            }

            // Save/update lane rate data
            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - 7);

            laneRate = await LaneRate.findOneAndUpdate(
                { origin, destination, vehicleType },
                {
                    ...calculatedData,
                    origin,
                    destination,
                    vehicleType,
                    weekStart,
                    weekEnd: new Date(),
                    lastUpdated: new Date()
                },
                { upsert: true, new: true }
            );
        }

        res.json({
            ...laneRate.toObject(),
            hasData: true
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/rates/trending - Get trending lanes
router.get('/trending', async (req, res) => {
    try {
        const { limit = 10, condition = 'all' } = req.query;

        const query = {};
        if (condition !== 'all') {
            query.marketCondition = condition;
        }

        const trendingLanes = await LaneRate.find(query)
            .sort({ loadCount: -1, avgRate: -1 })
            .limit(parseInt(limit));

        res.json(trendingLanes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/rates/hot-lanes - Get hot market lanes
router.get('/hot-lanes', async (req, res) => {
    try {
        const hotLanes = await LaneRate.find({ marketCondition: 'hot' })
            .sort({ loadCount: -1 })
            .limit(15);

        res.json(hotLanes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/rates/refresh - Manually refresh lane rates (Admin only)
router.post('/refresh', protect, isAdmin, async (req, res) => {
    try {
        const { origin, destination, vehicleType } = req.body;

        const calculatedData = await LaneRate.calculateLaneRate(origin, destination, vehicleType);

        if (!calculatedData) {
            return res.status(404).json({ message: 'No data available for this lane' });
        }

        const laneRate = await LaneRate.findOneAndUpdate(
            { origin, destination, vehicleType },
            {
                ...calculatedData,
                origin,
                destination,
                vehicleType,
                lastUpdated: new Date()
            },
            { upsert: true, new: true }
        );

        res.json({ message: 'Lane rate refreshed', laneRate });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/rates/compare - Compare rates across vehicle types
router.get('/compare', async (req, res) => {
    try {
        const { origin, destination } = req.query;

        if (!origin || !destination) {
            return res.status(400).json({ message: 'Origin and destination are required' });
        }

        const vehicleTypes = ['Mazda', 'Shehzore', 'Flatbed', '10-Wheeler', '22-Wheeler', 'Suzuki'];
        const comparisons = [];

        for (const vehicleType of vehicleTypes) {
            const laneRate = await LaneRate.findOne({
                origin: { $regex: origin, $options: 'i' },
                destination: { $regex: destination, $options: 'i' },
                vehicleType
            });

            if (laneRate) {
                comparisons.push({
                    vehicleType,
                    avgRate: laneRate.avgRate,
                    avgRatePerMile: laneRate.avgRatePerMile,
                    marketCondition: laneRate.marketCondition,
                    trend: laneRate.trend
                });
            }
        }

        res.json(comparisons);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/rates/trihaul - Get Tri-Haul route suggestions
// Suggests a third leg to turn a round trip into a triangular route for better profit
router.get('/trihaul', async (req, res) => {
    try {
        const { origin, destination, vehicleType = 'Any' } = req.query;

        if (!origin || !destination) {
            return res.status(400).json({ message: 'Origin and destination are required' });
        }

        // 1. Get Direct Round Trip Rate (A -> B -> A)
        // In a real app, we'd query Google Maps API for distances
        // Here we use stored rates
        const outboundRate = await LaneRate.findOne({
            origin: { $regex: origin, $options: 'i' },
            destination: { $regex: destination, $options: 'i' },
            vehicleType
        });

        const returnRate = await LaneRate.findOne({
            origin: { $regex: destination, $options: 'i' },
            destination: { $regex: origin, $options: 'i' },
            vehicleType
        });

        const directRoundTripTotal = (outboundRate?.avgRate || 0) + (returnRate?.avgRate || 0);

        // 2. Find Potential Intermediate Stops (C)
        // Find cities that have high paying loads from B -> C and C -> A
        const potentialHubs = await LaneRate.find({
            origin: { $regex: destination, $options: 'i' },
            avgRate: { $gt: 50000 }, // Filter for decent rates
            vehicleType
        }).limit(5);

        const suggestions = [];

        for (const hubLeg1 of potentialHubs) {
            const hubCity = hubLeg1.destination;

            // Skip if hub is origin or destination
            if (hubCity.toLowerCase() === origin.toLowerCase() ||
                hubCity.toLowerCase() === destination.toLowerCase()) continue;

            // Check rate from Hub -> Origin (C -> A)
            const hubLeg2 = await LaneRate.findOne({
                origin: { $regex: hubCity, $options: 'i' },
                destination: { $regex: origin, $options: 'i' },
                vehicleType
            });

            if (hubLeg2) {
                const triHaulTotal = (outboundRate?.avgRate || 0) + hubLeg1.avgRate + hubLeg2.avgRate;
                const profitIncrease = triHaulTotal - directRoundTripTotal;

                if (profitIncrease > 0) {
                    suggestions.push({
                        via: hubCity,
                        route: `${origin} -> ${destination} -> ${hubCity} -> ${origin}`,
                        totalRate: triHaulTotal,
                        profitIncrease,
                        increasePercentage: directRoundTripTotal > 0 ? Math.round((profitIncrease / directRoundTripTotal) * 100) : 100,
                        legs: [
                            { from: origin, to: destination, rate: outboundRate?.avgRate || 0 },
                            { from: destination, to: hubCity, rate: hubLeg1.avgRate },
                            { from: hubCity, to: origin, rate: hubLeg2.avgRate }
                        ]
                    });
                }
            }
        }

        // Sort by highest profit
        suggestions.sort((a, b) => b.profitIncrease - a.profitIncrease);

        res.json({
            origin,
            destination,
            directRoundTrip: directRoundTripTotal,
            suggestions
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
