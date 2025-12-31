const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Disable mongoose buffering for serverless
mongoose.set('bufferCommands', false);
mongoose.set('bufferTimeoutMS', 10000);

// Create Express app
const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));
app.use(express.json());

// MongoDB Connection Management for Serverless
let cachedDb = null;
let connectionPromise = null;
let lastConnectionAttempt = 0;
const CONNECTION_TIMEOUT = 30000; // 30 seconds

async function connectToDatabase() {
    const mongoUri = process.env.MONGO_URI;
    const jwtSecret = process.env.JWT_SECRET;

    console.log('🔍 Environment check:', {
        hasMongoUri: !!mongoUri,
        hasJwtSecret: !!jwtSecret,
        mongoUriPrefix: mongoUri ? mongoUri.substring(0, 20) + '...' : 'MISSING',
        nodeEnv: process.env.NODE_ENV,
        currentReadyState: mongoose.connection.readyState,
        readyStateDesc: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown'
    });

    // Validate environment variables
    if (!mongoUri) {
        const error = new Error('MONGO_URI environment variable is not set in Vercel');
        console.error('❌ Configuration Error:', error.message);
        throw error;
    }

    if (!jwtSecret) {
        console.warn('⚠️  JWT_SECRET not set - authentication will fail');
    }

    // Check if already connected
    if (mongoose.connection.readyState === 1) {
        console.log('✅ Using existing MongoDB connection');
        return mongoose.connection;
    }

    // Check if currently connecting
    if (mongoose.connection.readyState === 2) {
        console.log('⏳ MongoDB connection in progress, waiting...');
        if (connectionPromise) {
            return await connectionPromise;
        }
    }

    // Prevent too frequent connection attempts
    const now = Date.now();
    if (connectionPromise && (now - lastConnectionAttempt) < 5000) {
        console.log('🔄 Reusing pending connection attempt');
        return await connectionPromise;
    }

    // Create new connection
    lastConnectionAttempt = now;
    console.log('🔌 Initiating new MongoDB connection...');

    connectionPromise = mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: CONNECTION_TIMEOUT,
        connectTimeoutMS: CONNECTION_TIMEOUT,
        socketTimeoutMS: 45000,
        family: 4,
        retryWrites: true,
        w: 'majority',
        maxPoolSize: 10,
        minPoolSize: 1,
        maxIdleTimeMS: 60000,
        bufferCommands: false,
        autoIndex: false, // Disable auto-indexing in production
    })
        .then(async (mongooseInstance) => {
            console.log('🔗 MongoDB connection established');

            // Verify connection with ping
            try {
                await mongooseInstance.connection.db.admin().ping();
                console.log('✅ MongoDB Connected & Verified (Ping successful)');
                console.log('📊 Connected to database:', mongooseInstance.connection.name);
                cachedDb = mongooseInstance.connection;
                return mongooseInstance.connection;
            } catch (pingError) {
                console.error('❌ MongoDB ping failed:', pingError.message);
                throw pingError;
            }
        })
        .catch(err => {
            console.error('❌ MongoDB Connection Error Details:', {
                message: err.message,
                code: err.code,
                name: err.name,
                stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
            });

            // Reset connection promise to allow retry
            connectionPromise = null;
            cachedDb = null;

            // Throw detailed error
            const detailedError = new Error(`MongoDB connection failed: ${err.message}`);
            detailedError.originalError = err;
            throw detailedError;
        });

    return await connectionPromise;
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

        // Lazy-load User model to avoid circular dependencies
        const User = require('../server/models/User');
        const count = await User.countDocuments();
        const oneUser = await User.findOne({}, { email: 1, role: 1, status: 1 }).lean();

        const debugInfo = {
            success: true,
            readyState: ready,
            readyStateDesc: readyStateMap[ready] || 'unknown',
            database: dbName,
            userCount: count,
            sampleUser: oneUser,
            timestamp: new Date().toISOString(),
            environment: {
                hasMongoUri: !!process.env.MONGO_URI,
                hasJwtSecret: !!process.env.JWT_SECRET,
                nodeEnv: process.env.NODE_ENV
            }
        };

        console.log('✅ Debug check successful:', debugInfo);
        res.json(debugInfo);
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
