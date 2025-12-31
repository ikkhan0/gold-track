const mongoose = require('mongoose');

const laneRateSchema = new mongoose.Schema({
    origin: {
        type: String,
        required: true,
        index: true
    },
    destination: {
        type: String,
        required: true,
        index: true
    },
    vehicleType: {
        type: String,
        enum: ['Mazda', 'Shehzore', 'Flatbed', '10-Wheeler', '22-Wheeler', 'Suzuki', 'Any'],
        default: 'Any'
    },

    // Distance and Rate Metrics
    avgDistance: { type: Number }, // in KM
    avgRate: { type: Number }, // Average total rate
    avgRatePerMile: { type: Number }, // Rate per mile/km
    lowestRate: { type: Number },
    highestRate: { type: Number },

    // Market Conditions
    marketCondition: {
        type: String,
        enum: ['hot', 'normal', 'cold'],
        default: 'normal'
    },
    trend: {
        type: String,
        enum: ['up', 'down', 'stable'],
        default: 'stable'
    },
    loadCount: { type: Number, default: 0 }, // Loads posted this week
    sampleSize: { type: Number, default: 0 }, // Total loads analyzed

    // Timeframe
    weekStart: { type: Date },
    weekEnd: { type: Date },
    lastUpdated: { type: Date, default: Date.now }
});

// Compound index for efficient lane queries
laneRateSchema.index({ origin: 1, destination: 1, vehicleType: 1 });
laneRateSchema.index({ lastUpdated: -1 });

// Static method to calculate lane rates
laneRateSchema.statics.calculateLaneRate = async function (origin, destination, vehicleType = 'Any') {
    const Load = mongoose.model('Load');
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Find all completed loads for this lane
    const query = {
        origin: { $regex: origin, $options: 'i' },
        destination: { $regex: destination, $options: 'i' },
        status: 'Delivered',
        actualDeliveryDate: { $gte: oneWeekAgo },
        offerPrice: { $exists: true, $ne: null }
    };

    if (vehicleType !== 'Any') {
        query.requiredVehicle = vehicleType;
    }

    const loads = await Load.find(query);

    if (loads.length === 0) {
        return null;
    }

    const rates = loads.map(l => l.offerPrice);
    const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;
    const lowestRate = Math.min(...rates);
    const highestRate = Math.max(...rates);

    const avgDistance = loads.reduce((sum, l) => sum + (l.distance || 0), 0) / loads.length;
    const avgRatePerMile = avgDistance > 0 ? avgRate / avgDistance : 0;

    // Determine market condition based on load volume
    const weeklyLoads = await Load.countDocuments({
        ...query,
        createdAt: { $gte: oneWeekAgo }
    });

    let marketCondition = 'normal';
    if (weeklyLoads > 20) marketCondition = 'hot';
    else if (weeklyLoads < 5) marketCondition = 'cold';

    // Calculate trend (compare with previous week)
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const previousWeekLoads = await Load.find({
        ...query,
        actualDeliveryDate: { $gte: twoWeeksAgo, $lt: oneWeekAgo }
    });

    let trend = 'stable';
    if (previousWeekLoads.length > 0) {
        const prevAvgRate = previousWeekLoads.reduce((sum, l) => sum + l.offerPrice, 0) / previousWeekLoads.length;
        const rateChange = ((avgRate - prevAvgRate) / prevAvgRate) * 100;

        if (rateChange > 5) trend = 'up';
        else if (rateChange < -5) trend = 'down';
    }

    return {
        avgRate: Math.round(avgRate),
        avgRatePerMile: Math.round(avgRatePerMile * 100) / 100,
        lowestRate: Math.round(lowestRate),
        highestRate: Math.round(highestRate),
        avgDistance: Math.round(avgDistance),
        marketCondition,
        trend,
        loadCount: weeklyLoads,
        sampleSize: loads.length
    };
};

module.exports = mongoose.models.LaneRate || mongoose.model('LaneRate', laneRateSchema);
