const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

console.log('🚀 API Module Loading - Vercel Serverless');

// Disable buffering for serverless
mongoose.set('bufferCommands', false);

// Create Express app
const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));
app.use(express.json());

// MongoDB Connection for Serverless
let isConnected = false;

async function connectToDatabase() {
    console.log('🔍 connectToDatabase() called');
    console.log('   Mongoose readyState:', mongoose.connection.readyState);
    console.log('   isConnected flag:', isConnected);

    // Reuse existing connection
    if (isConnected && mongoose.connection.readyState === 1) {
        console.log('✅ Reusing existing MongoDB connection');
        return mongoose.connection;
    }

    try {
        const mongoUri = process.env.MONGO_URI;
        const jwtSecret = process.env.JWT_SECRET;

        console.log('📋 Environment Variables:');
        console.log('   MONGO_URI exists:', !!mongoUri);
        console.log('   JWT_SECRET exists:', !!jwtSecret);
        console.log('   MONGO_URI length:', mongoUri ? mongoUri.length : 0);

        if (!mongoUri) {
            throw new Error('MONGO_URI not set in Vercel environment variables');
        }

        if (!jwtSecret) {
            console.warn('⚠️  JWT_SECRET missing - auth will fail');
        }

        // Show sanitized URI
        const sanitized = mongoUri.replace(/:([^@]+)@/, ':***@');
        console.log('   Sanitized URI:', sanitized);
        console.log('   Has directConnection?', mongoUri.includes('directConnection'));

        // CRITICAL: Clean the URI - remove directConnection parameter
        let cleanUri = mongoUri;
        if (cleanUri.includes('directConnection')) {
            const original = cleanUri;
            cleanUri = cleanUri.replace(/[&?]directConnection=(true|false)/gi, '');
            console.log('⚠️  REMOVED directConnection from URI');
            console.log('   Before:', original.replace(/:([^@]+)@/, ':***@'));
            console.log('   After:', cleanUri.replace(/:([^@]+)@/, ':***@'));
        }

        console.log('🔌 Calling mongoose.connect()...');
        console.log('   Final URI:', cleanUri.replace(/:([^@]+)@/, ':***@'));

        // Minimal connection options
        const options = {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        };

        console.log('   Options:', JSON.stringify(options));

        await mongoose.connect(cleanUri, options);

        isConnected = true;
        console.log('✅ MongoDB connected successfully!');
        console.log('   Database:', mongoose.connection.name);
        console.log('   Host:', mongoose.connection.host);
        console.log('   ReadyState:', mongoose.connection.readyState);

        return mongoose.connection;
    } catch (error) {
        console.error('❌ MongoDB connection FAILED:');
        console.error('   Error message:', error.message);
        console.error('   Error name:', error.name);
        console.error('   Error code:', error.code);
        console.error('   Full error:', JSON.stringify(error, null, 2));
        isConnected = false;
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

// Debug route to verify DB queries
app.get('/debug/db', async (req, res) => {
    try {
        console.log('🔍 Starting database debug check...');
        await connectToDatabase();

        const ready = mongoose.connection.readyState;
        const readyStateMap = ['disconnected', 'connected', 'connecting', 'disconnecting'];
        const dbName = mongoose.connection.name;

        console.log('📊 Connection status:', readyStateMap[ready]);

        // Try to count users
        const User = require('../server/models/User');
        const userCount = await User.countDocuments();

        res.json({
            status: 'success',
            connectionState: readyStateMap[ready],
            database: dbName,
            userCount,
            timestamp: new Date().toISOString(),
            environment: {
                hasMongoUri: !!process.env.MONGO_URI,
                hasJwtSecret: !!process.env.JWT_SECRET,
                nodeEnv: process.env.NODE_ENV
            }
        });
    } catch (err) {
        console.error('❌ Debug /debug/db error:', {
            message: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
        res.status(500).json({
            success: false,
            message: 'Debug query failed',
            error: err.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Debug endpoint to check MONGO_URI parameters (password hidden)
app.get('/api/debug/uri', (req, res) => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            return res.json({ error: 'MONGO_URI not set' });
        }

        // Hide password but show all parameters
        const sanitized = mongoUri.replace(/:([^@]+)@/, ':***@');
        const hasDirectConnection = mongoUri.includes('directConnection');
        const directConnectionValue = mongoUri.match(/directConnection=(true|false)/)?.[1] || 'not set';

        res.json({
            sanitizedUri: sanitized,
            hasDirectConnection,
            directConnectionValue,
            uriLength: mongoUri.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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
