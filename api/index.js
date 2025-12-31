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

// Connect to MongoDB (cached)
let cachedConnectionPromise = null;

async function connectToDatabase() {
    const mongoUri = process.env.MONGO_URI;
    const jwtSecret = process.env.JWT_SECRET;

    console.log('Environment check:', {
        hasMongoUri: !!mongoUri,
        hasJwtSecret: !!jwtSecret,
        nodeEnv: process.env.NODE_ENV,
        readyState: mongoose.connection.readyState
    });

    if (!mongoUri) {
        throw new Error('MONGO_URI environment variable is not set');
    }

    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!cachedConnectionPromise) {
        console.log('Attempting fresh MongoDB connection...');
        cachedConnectionPromise = mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            family: 4,
            retryWrites: true,
            w: 'majority',
            maxPoolSize: 1,
            minPoolSize: 1,
            bufferCommands: false
        }).then(async (conn) => {
            // Explicit ping to verify connectivity
            await conn.connection.db.admin().command({ ping: 1 });
            console.log('✅ MongoDB Connected & Pinged');
            return conn;
        }).catch(err => {
            console.error('❌ MongoDB connection failure:', err);
            cachedConnectionPromise = null;
            throw err;
        });
    }

    return cachedConnectionPromise;
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
        await connectToDatabase();
        const ready = mongoose.connection.readyState;
        const dbName = mongoose.connection.name;
        // Lazy-load User model to avoid circular load
        const User = require('../server/models/User');
        const count = await User.countDocuments();
        const oneUser = await User.findOne({}, { email: 1, role: 1, status: 1 }).lean();
        res.json({
            readyState: ready,
            db: dbName,
            userCount: count,
            sampleUser: oneUser
        });
    } catch (err) {
        console.error('Debug /debug/db error:', err);
        res.status(500).json({ message: 'Debug query failed', error: err.message });
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
