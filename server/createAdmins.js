const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

// Simple User Schema for seeding
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,
    role: String,
    status: String,
    isEmailVerified: Boolean,
    city: String,
    province: String,
    permissions: {
        manageUsers: Boolean,
        manageCMS: Boolean,
        manageLoads: Boolean,
        viewAnalytics: Boolean,
        manageSettings: Boolean
    },
    companyName: String,
    fleetSize: Number,
    vehicleTypes: [String],
    cnic: String,
    licenseNumber: String,
    totalLoadsPosted: Number,
    totalBidsPlaced: Number,
    completedDeliveries: Number,
    rating: Number,
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

const adminUsers = [
    {
        name: 'Super Admin',
        email: 'superadmin@goldtrack.pk',
        password: 'SuperAdmin@123',
        phone: '+92-300-1111111',
        role: 'super_admin',
        status: 'approved',
        isEmailVerified: true,
        city: 'Karachi',
        province: 'Sindh',
        permissions: {
            manageUsers: true,
            manageCMS: true,
            manageLoads: true,
            viewAnalytics: true,
            manageSettings: true
        }
    },
    {
        name: 'Admin User',
        email: 'admin@goldtrack.pk',
        password: 'Admin@123',
        phone: '+92-300-2222222',
        role: 'admin',
        status: 'approved',
        isEmailVerified: true,
        city: 'Lahore',
        province: 'Punjab',
        permissions: {
            manageUsers: true,
            manageCMS: true,
            manageLoads: true,
            viewAnalytics: true,
            manageSettings: false
        }
    },
    {
        name: 'Test Shipper',
        email: 'shipper@goldtrack.pk',
        password: 'Shipper@123',
        phone: '+92-300-3333333',
        role: 'shipper',
        status: 'approved',
        isEmailVerified: true,
        city: 'Karachi',
        companyName: 'Khan Trading Co.',
        totalLoadsPosted: 10,
        completedDeliveries: 8,
        rating: 4.5
    },
    {
        name: 'Test Carrier',
        email: 'carrier@goldtrack.pk',
        password: 'Carrier@123',
        phone: '+92-300-4444444',
        role: 'carrier',
        status: 'approved',
        isEmailVerified: true,
        city: 'Lahore',
        fleetSize: 5,
        vehicleTypes: ['Mazda', 'Shehzore'],
        cnic: '42101-1234567-1',
        licenseNumber: 'DL-12345',
        totalBidsPlaced: 20,
        completedDeliveries: 15,
        rating: 4.7
    },
    {
        name: 'Pending User',
        email: 'pending@goldtrack.pk',
        password: 'Pending@123',
        phone: '+92-300-5555555',
        role: 'carrier',
        status: 'pending',
        isEmailVerified: false,
        city: 'Multan',
        cnic: '36602-1111111-1',
        licenseNumber: 'DL-99999'
    }
];

async function seedAdmins() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Remove existing test users
        await User.deleteMany({
            email: { $in: adminUsers.map(u => u.email) }
        });
        console.log('🗑️  Cleared existing test users');

        // Create users with hashed passwords
        for (const userData of adminUsers) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            const user = new User({
                ...userData,
                password: hashedPassword
            });

            await user.save();
            console.log(`✅ Created: ${userData.name} (${userData.email})`);
        }

        console.log('\n🎉 Admin users created successfully!\n');
        console.log('═══════════════════════════════════════');
        console.log('LOGIN CREDENTIALS:');
        console.log('═══════════════════════════════════════');
        adminUsers.forEach(u => {
            console.log(`\n${u.role.toUpperCase()}`);
            console.log(`  Email: ${u.email}`);
            console.log(`  Password: ${u.password}`);
        });
        console.log('\n═══════════════════════════════════════');
        console.log('\n✅ You can now login at: http://localhost:5173/admin/login');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

seedAdmins();
