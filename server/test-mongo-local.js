const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Testing MongoDB Connection...');
console.log('📋 MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('📋 MONGO_URI length:', process.env.MONGO_URI ? process.env.MONGO_URI.length : 0);

// Extract database name
const uri = process.env.MONGO_URI;
const dbMatch = uri.match(/\/([^/?]+)(\?|$)/);
console.log('📋 Database name:', dbMatch ? dbMatch[1] : 'Could not parse');

// Sanitize and show URI
const sanitized = uri.replace(/:([^@]+)@/, ':***@');
console.log('📋 Sanitized URI:', sanitized);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Connected Successfully!');
        console.log('   Database:', mongoose.connection.name);
        console.log('   Host:', mongoose.connection.host);
        console.log('   ReadyState:', mongoose.connection.readyState);

        // Test a simple query
        return mongoose.connection.db.admin().listDatabases();
    })
    .then((result) => {
        console.log('\n📊 Available Databases:');
        result.databases.forEach(db => {
            console.log(`   - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
        });

        // List collections in current database
        return mongoose.connection.db.listCollections().toArray();
    })
    .then((collections) => {
        console.log(`\n📦 Collections in '${mongoose.connection.name}' database:`);
        collections.forEach(col => {
            console.log(`   - ${col.name}`);
        });

        // Try to count users
        const User = require('./models/User');
        return User.countDocuments();
    })
    .then((count) => {
        console.log(`\n👥 Total users: ${count}`);
        console.log('\n✅ Connection test completed successfully!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('\n❌ MongoDB Connection Error:');
        console.error('   Message:', err.message);
        console.error('   Code:', err.code);
        console.error('   Name:', err.name);
        if (err.code === 8000) {
            console.error('\n💡 Authentication failed - please check:');
            console.error('   1. Username and password in MONGO_URI');
            console.error('   2. Database user has correct permissions');
            console.error('   3. IP whitelist in MongoDB Atlas includes your IP');
        }
        process.exit(1);
    });
