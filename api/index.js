const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Connect to MongoDB (connection will be reused)
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb && mongoose.connection.readyState === 1) {
        console.log('Using cached MongoDB connection');
        return cachedDb;
    }

    try {
        const mongoUri = process.env.MONGO_URI;
        
        if (!mongoUri) {
            throw new Error('MONGO_URI environment variable is not set');
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        
        cachedDb = mongoose.connection;
        console.log('MongoDB Connected Successfully');
        return cachedDb;
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        throw error;
    }
}

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
try {
    const authRoutes = require('../server/routes/auth');
    const loadRoutes = require('../server/routes/loads');
    const vehicleRoutes = require('../server/routes/vehicles');
    const dashboardRoutes = require('../server/routes/dashboard');
    const adminRoutes = require('../server/routes/admin');
    const truckRoutes = require('../server/routes/trucks');
    const messageRoutes = require('../server/routes/messages');
    const notificationRoutes = require('../server/routes/notifications');
    const reviewRoutes = require('../server/routes/reviews');
    const documentRoutes = require('../server/routes/documents');
    const rateRoutes = require('../server/routes/rates');
    const analyticsRoutes = require('../server/routes/analytics');
    const trackingRoutes = require('../server/routes/tracking');
    const searchRoutes = require('../server/routes/searches');
    const userRoutes = require('../server/routes/users');
    const staticDataRoutes = require('../server/routes/staticData');
    const settingsRoutes = require('../server/routes/settings');

    // Mount Routes (no /api prefix - Vercel handles that)
    app.use('/auth', authRoutes);
    app.use('/loads', loadRoutes);
    app.use('/vehicles', vehicleRoutes);
    app.use('/dashboard', dashboardRoutes);
    app.use('/admin', adminRoutes);
    app.use('/trucks', truckRoutes);
    app.use('/messages', messageRoutes);
    app.use('/notifications', notificationRoutes);
    app.use('/reviews', reviewRoutes);
    app.use('/documents', documentRoutes);
    app.use('/rates', rateRoutes);
    app.use('/analytics', analyticsRoutes);
    app.use('/tracking', trackingRoutes);
    app.use('/searches', searchRoutes);
    app.use('/users', userRoutes);
    app.use('/static-data', staticDataRoutes);
    app.use('/settings', settingsRoutes);
} catch (error) {
    console.error('Error loading routes:', error);
}

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'API is running', status: 'ok' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Serverless function handler
module.exports = async (req, res) => {
    try {
        await connectToDatabase();
        return app(req, res);
    } catch (error) {
        console.error('Serverless function error:', error);
        return res.status(500).json({ 
            message: 'Database connection failed',
            error: error.message 
        });
    }
};
