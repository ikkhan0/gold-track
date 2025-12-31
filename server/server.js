const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CORS Configuration - Allow Vercel and localhost
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://gold-track-flax.vercel.app',
        'https://gold-track.vercel.app',
        /^https:\/\/gold-track-.*\.vercel\.app$/ // Allow all preview deployments
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes (Placeholders)
app.get('/', (req, res) => {
    res.send('API is Running...');
});

// Import Routes
const authRoutes = require('./routes/auth');
const loadRoutes = require('./routes/loads');
const vehicleRoutes = require('./routes/vehicles');
const dashboardRoutes = require('./routes/dashboard');
const adminRoutes = require('./routes/admin');
const truckRoutes = require('./routes/trucks');
const messageRoutes = require('./routes/messages');
const notificationRoutes = require('./routes/notifications');
const reviewRoutes = require('./routes/reviews');
const documentRoutes = require('./routes/documents');
const rateRoutes = require('./routes/rates');
const analyticsRoutes = require('./routes/analytics');
const trackingRoutes = require('./routes/tracking');
const searchRoutes = require('./routes/searches');
const userRoutes = require('./routes/users');
const staticDataRoutes = require('./routes/staticData');
const settingsRoutes = require('./routes/settings');

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


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
