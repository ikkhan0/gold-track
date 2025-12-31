const mongoose = require('mongoose');

// Disable buffering for serverless
mongoose.set('bufferCommands', false);

let isConnected = false;

async function connectDB() {
    if (isConnected && mongoose.connection.readyState === 1) {
        console.log('✅ Using existing MongoDB connection');
        return mongoose.connection;
    }

    try {
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            throw new Error('MONGO_URI environment variable is not set');
        }

        console.log('🔌 Connecting to MongoDB...');

        // CRITICAL: Remove directConnection from URI if it exists
        let cleanUri = mongoUri;
        if (cleanUri.includes('directConnection')) {
            cleanUri = cleanUri.replace(/[&?]directConnection=(true|false)/gi, '');
            console.log('⚠️  Removed directConnection from URI');
        }

        // Minimal connection options - NOTHING that can cause directConnection issues
        await mongoose.connect(cleanUri, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });

        isConnected = true;
        console.log('✅ MongoDB connected successfully');
        console.log('   Database:', mongoose.connection.name);
        console.log('   Host:', mongoose.connection.host);

        return mongoose.connection;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        isConnected = false;
        throw error;
    }
}

module.exports = connectDB;
