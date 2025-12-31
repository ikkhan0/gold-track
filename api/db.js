```javascript
const mongoose = require('mongoose');

console.log('📦 DB MODULE LOADED - Vercel Serverless Environment');

// Disable buffering for serverless
mongoose.set('bufferCommands', false);

let isConnected = false;

async function connectDB() {
    console.log('🔍 connectDB() called');
    console.log('   Current readyState:', mongoose.connection.readyState);
    console.log('   isConnected flag:', isConnected);
    
    if (isConnected && mongoose.connection.readyState === 1) {
        console.log('✅ Using existing MongoDB connection');
        return mongoose.connection;
    }

    try {
        const mongoUri = process.env.MONGO_URI;
        
        console.log('📋 Environment Check:');
        console.log('   MONGO_URI exists:', !!mongoUri);
        console.log('   MONGO_URI length:', mongoUri ? mongoUri.length : 0);
        
        if (!mongoUri) {
            throw new Error('MONGO_URI environment variable is not set');
        }

        // Show sanitized URI (hide password)
        const sanitizedUri = mongoUri.replace(/:([^@]+)@/, ':***@');
        console.log('   Sanitized URI:', sanitizedUri);
        console.log('   Contains directConnection?', mongoUri.includes('directConnection'));
        
        // CRITICAL: Remove directConnection from URI if it exists
        let cleanUri = mongoUri;
        if (cleanUri.includes('directConnection')) {
            const before = cleanUri;
            cleanUri = cleanUri.replace(/[&?]directConnection=(true|false)/gi, '');
            console.log('⚠️  Removed directConnection from URI');
            console.log('   Before:', before.replace(/:([^@]+)@/, ':***@'));
            console.log('   After:', cleanUri.replace(/:([^@]+)@/, ':***@'));
        }
        
        console.log('🔌 Calling mongoose.connect()...');
        console.log('   Clean URI:', cleanUri.replace(/:([^@]+)@/, ':***@'));
        
        // Minimal connection options
        const options = {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        };
        
        console.log('   Options:', JSON.stringify(options));
        
        await mongoose.connect(cleanUri, options);

        isConnected = true;
        console.log('✅ MongoDB connected successfully');
        console.log('   Database:', mongoose.connection.name);
        console.log('   Host:', mongoose.connection.host);
        console.log('   ReadyState:', mongoose.connection.readyState);
        
        return mongoose.connection;
    } catch (error) {
        console.error('❌ MongoDB connection error:');
        console.error('   Message:', error.message);
        console.error('   Name:', error.name);
        console.error('   Code:', error.code);
        console.error('   Full error:', error);
        isConnected = false;
        throw error;
    }
}

module.exports = connectDB;
```
