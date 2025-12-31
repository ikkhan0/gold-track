const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');
const Load = require('./models/Load');
const Vehicle = require('./models/Vehicle');
const CMSContent = require('./models/CMSContent');

const testDatabaseConnection = async () => {
    try {
        console.log('🔍 Testing MongoDB Connection...');
        console.log('MongoDB URI:', process.env.MONGO_URI?.replace(/:[^:@]+@/, ':****@')); // Hide password
        
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected Successfully!\n');

        // Test collections
        console.log('📊 Checking Collections:');
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`Found ${collections.length} collections:`);
        collections.forEach(col => console.log(`  - ${col.name}`));
        console.log('');

        // Count documents in each model
        console.log('📈 Document Counts:');
        const userCount = await User.countDocuments();
        const loadCount = await Load.countDocuments();
        const vehicleCount = await Vehicle.countDocuments();
        const cmsCount = await CMSContent.countDocuments();

        console.log(`  Users: ${userCount}`);
        console.log(`  Loads: ${loadCount}`);
        console.log(`  Vehicles: ${vehicleCount}`);
        console.log(`  CMS Content: ${cmsCount}`);
        console.log('');

        // Check for admin users
        console.log('👑 Admin Users:');
        const admins = await User.find({ role: { $in: ['admin', 'super_admin'] } }).select('name email role');
        if (admins.length > 0) {
            admins.forEach(admin => console.log(`  - ${admin.name} (${admin.email}) - ${admin.role}`));
        } else {
            console.log('  ⚠️  No admin users found! Run: node seedAdminUsers.js');
        }
        console.log('');

        // Check user statuses
        console.log('📊 User Status Breakdown:');
        const pendingUsers = await User.countDocuments({ status: 'pending' });
        const approvedUsers = await User.countDocuments({ status: 'approved' });
        const rejectedUsers = await User.countDocuments({ status: 'rejected' });
        console.log(`  Pending: ${pendingUsers}`);
        console.log(`  Approved: ${approvedUsers}`);
        console.log(`  Rejected: ${rejectedUsers}`);
        console.log('');

        // Check roles
        console.log('👥 User Role Distribution:');
        const carriers = await User.countDocuments({ role: 'carrier' });
        const shippers = await User.countDocuments({ role: 'shipper' });
        const brokers = await User.countDocuments({ role: 'broker' });
        const fleetOwners = await User.countDocuments({ role: 'fleet_owner' });
        const ownerOperators = await User.countDocuments({ role: 'owner_operator' });
        console.log(`  Carriers: ${carriers}`);
        console.log(`  Shippers: ${shippers}`);
        console.log(`  Brokers: ${brokers}`);
        console.log(`  Fleet Owners: ${fleetOwners}`);
        console.log(`  Owner Operators: ${ownerOperators}`);
        console.log('');

        // Check load statuses
        if (loadCount > 0) {
            console.log('📦 Load Status Distribution:');
            const openLoads = await Load.countDocuments({ status: 'Open' });
            const assignedLoads = await Load.countDocuments({ status: 'Assigned' });
            const inTransitLoads = await Load.countDocuments({ status: 'In-Transit' });
            const deliveredLoads = await Load.countDocuments({ status: 'Delivered' });
            console.log(`  Open: ${openLoads}`);
            console.log(`  Assigned: ${assignedLoads}`);
            console.log(`  In-Transit: ${inTransitLoads}`);
            console.log(`  Delivered: ${deliveredLoads}`);
            console.log('');
        }

        // Test a simple query
        console.log('🔬 Testing Sample Query:');
        const sampleLoad = await Load.findOne().populate('shipper', 'name email');
        if (sampleLoad) {
            console.log(`  Found load: ${sampleLoad.origin} → ${sampleLoad.destination}`);
            console.log(`  Shipper: ${sampleLoad.shipper?.name || 'N/A'}`);
            console.log(`  Status: ${sampleLoad.status}`);
            console.log(`  Bids: ${sampleLoad.bids?.length || 0}`);
        } else {
            console.log('  No loads found in database');
        }
        console.log('');

        console.log('✅ All database checks completed successfully!');
        console.log('');
        console.log('🚀 Ready to start server with: npm start or node server.js');

    } catch (error) {
        console.error('❌ Database Connection Error:', error.message);
        console.error('');
        console.error('Troubleshooting:');
        console.error('1. Check if MongoDB is running (mongod service)');
        console.error('2. Verify MONGO_URI in .env file');
        console.error('3. Ensure network connectivity to MongoDB');
        console.error('4. Check MongoDB authentication credentials');
    } finally {
        // Close connection
        await mongoose.connection.close();
        console.log('');
        console.log('Connection closed.');
    }
};

// Run the test
testDatabaseConnection();
