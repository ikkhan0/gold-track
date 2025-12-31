const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (connection will be reused)
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }

    const connection = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    cachedDb = connection;
    return connection;
}

// Import Routes
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

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/loads', loadRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/trucks', truckRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/rates', rateRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/searches', searchRoutes);
app.use('/api/users', userRoutes);
app.use('/api/static-data', staticDataRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/api', (req, res) => {
    res.json({ message: 'API is running', status: 'ok' });
});

// Serverless function handler
module.exports = async (req, res) => {
    await connectToDatabase();
    return app(req, res);
};
