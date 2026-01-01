const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://imran_db_user:imran321123@loadboard.rge52dl.mongodb.net/loadboard?retryWrites=true&w=majority&appName=loadboard';

console.log('Testing MongoDB connection...');
console.log('URI:', MONGO_URI);

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connected successfully!');
        console.log('Connected to database:', mongoose.connection.db.databaseName);
        console.log('Connection state:', mongoose.connection.readyState);

        // Test a simple query
        return mongoose.connection.db.admin().listDatabases();
    })
    .then((result) => {
        console.log('\n📊 Available databases:');
        result.databases.forEach(db => {
            console.log(`  - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
        });

        // Check collections in current database
        return mongoose.connection.db.listCollections().toArray();
    })
    .then((collections) => {
        console.log('\n📁 Collections in loadboard database:');
        if (collections.length === 0) {
            console.log('  No collections found (database is empty)');
        } else {
            collections.forEach(col => {
                console.log(`  - ${col.name}`);
            });
        }

        // Count users
        return mongoose.connection.db.collection('users').countDocuments();
    })
    .then((userCount) => {
        console.log(`\n👥 Total users: ${userCount}`);
        console.log('\n✅ Connection test completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Connection failed!');
        console.error('Error:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    });
