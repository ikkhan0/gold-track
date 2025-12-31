const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create Express app
const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));
app.use(express.json());

// Connect to MongoDB
let isConnected = false;

async function connectToDatabase() {
    if (isConnected && mongoose.connection.readyState === 1) {
        console.log('Using existing MongoDB connection');
        return;
    }

    try {
        const mongoUri = process.env.MONGO_URI;
        const jwtSecret = process.env.JWT_SECRET;
        
        console.log('Environment check:', {
            hasMongoUri: !!mongoUri,
            hasJwtSecret: !!jwtSecret,
            nodeEnv: process.env.NODE_ENV
        });
        
        if (!mongoUri) {
            throw new Error('MONGO_URI environment variable is not set');
        }

        console.log('Attempting to connect to MongoDB...');
        
        // Disconnect if connection is in a bad state
        if (mongoose.connection.readyState !== 0 && mongoose.connection.readyState !== 1) {
            await mongoose.disconnect();
        }
        
        // Only connect if not already connected
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(mongoUri, {
                serverSelectionTimeoutMS: 5000,
                connectTimeoutMS: 10000,
                socketTimeoutMS: 45000,
                family: 4, // Use IPv4, skip trying IPv6
                retryWrites: true,
                w: 'majority',
                maxPoolSize: 10,
                minPoolSize: 1
            });
        }
        
        // Wait for connection to be ready
        if (mongoose.connection.readyState === 2) { // connecting
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error('Connection timeout')), 10000);
                mongoose.connection.once('connected', () => {
                    clearTimeout(timeout);
                    resolve();
                });
                mongoose.connection.once('error', (err) => {
                    clearTimeout(timeout);
                    reject(err);
                });
            });
        }
        
        isConnected = true;
        console.log('✅ MongoDB Connected Successfully, readyState:', mongoose.connection.readyState);
    } catch (error) {
        isConnected = false;
        console.error('❌ MongoDB Connection Error:', error.message);
        console.error('Full error:', error);
        throw error;
    }
}

// Load routes
let routesLoaded = false;

function loadRoutes() {
    if (routesLoaded) return;
    
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

        // Mount Routes
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
        
        routesLoaded = true;
        console.log('✅ Routes loaded successfully');
    } catch (error) {
        console.error('❌ Error loading routes:', error);
        throw error;
    }
}

// Health check
app.get('/', (req, res) => {
    res.json({ 
        message: 'API is running', 
        status: 'ok',
        dbConnected: mongoose.connection.readyState === 1,
        env: {
            hasMongoUri: !!process.env.MONGO_URI,
            hasJwtSecret: !!process.env.JWT_SECRET
        }
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Express Error:', err);
    res.status(500).json({ 
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Serverless function handler
module.exports = async (req, res) => {
    try {
        // Remove /api prefix from URL for internal routing
        const originalUrl = req.url;
        req.url = req.url.replace(/^\/api/, '') || '/';
        
        console.log(`📥 ${req.method} ${originalUrl} → ${req.url}`);
        
        // Connect to database
        await connectToDatabase();
        
        // Load routes after DB connection
        loadRoutes();
        
        // Handle request
        return app(req, res);
    } catch (error) {
        console.error('❌ Serverless function error:', error);
        return res.status(500).json({ 
            message: 'Database connection failed',
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
