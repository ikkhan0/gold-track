const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/User');
const CMSContent = require('./models/CMSContent');
require('dotenv').config();

// Dummy Users Data
const dummyUsers = [
    // Super Admin
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

    // Admin
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

    // Shipper
    {
        name: 'Ahmed Khan',
        email: 'shipper@goldtrack.pk',
        password: 'Shipper@123',
        phone: '+92-300-3333333',
        role: 'shipper',
        status: 'approved',
        isEmailVerified: true,
        city: 'Karachi',
        province: 'Sindh',
        companyName: 'Khan Trading Co.',
        ntn: 'NTN-123456',
        businessType: 'manufacturer',
        totalLoadsPosted: 45,
        completedDeliveries: 38,
        rating: 4.8
    },

    // Broker
    {
        name: 'Fatima Sheikh',
        email: 'broker@goldtrack.pk',
        password: 'Broker@123',
        phone: '+92-300-4444444',
        role: 'broker',
        status: 'approved',
        isEmailVerified: true,
        city: 'Lahore',
        province: 'Punjab',
        companyName: 'Sheikh Logistics',
        ntn: 'NTN-789012',
        businessType: 'broker',
        totalLoadsPosted: 120,
        completedDeliveries: 105,
        rating: 4.7
    },

    // Fleet Owner
    {
        name: 'Ali Transport Services',
        email: 'fleetowner@goldtrack.pk',
        password: 'Fleet@123',
        phone: '+92-300-5555555',
        role: 'fleet_owner',
        status: 'approved',
        isEmailVerified: true,
        city: 'Faisalabad',
        province: 'Punjab',
        companyName: 'Ali Transport Services',
        fleetSize: 15,
        vehicleTypes: ['Mazda', 'Shehzore', 'Container', 'Flatbed'],
        cnic: '42101-1234567-1',
        licenseNumber: 'DL-12345678',
        totalBidsPlaced: 89,
        completedDeliveries: 76,
        rating: 4.9
    },

    // Owner Operator
    {
        name: 'Hassan Mazda Service',
        email: 'operator@goldtrack.pk',
        password: 'Operator@123',
        phone: '+92-300-6666666',
        role: 'owner_operator',
        status: 'approved',
        isEmailVerified: true,
        city: 'Rawalpindi',
        province: 'Punjab',
        fleetSize: 1,
        vehicleTypes: ['Mazda'],
        cnic: '37405-9876543-2',
        licenseNumber: 'DL-87654321',
        totalBidsPlaced: 34,
        completedDeliveries: 29,
        rating: 4.6
    },

    // Pending Carrier (for approval demo)
    {
        name: 'Pending Carrier',
        email: 'pending@goldtrack.pk',
        password: 'Pending@123',
        phone: '+92-300-7777777',
        role: 'carrier',
        status: 'pending',
        isEmailVerified: false,
        city: 'Multan',
        province: 'Punjab',
        fleetSize: 2,
        vehicleTypes: ['Shehzore'],
        cnic: '36602-1111111-1',
        licenseNumber: 'DL-11111111'
    }
];

// CMS Content Data
const cmsContent = [
    {
        key: 'homepage_hero_title',
        section: 'homepage',
        title: 'MOVE FREIGHT WITH PRECISION',
        description: 'Experience the gold standard in logistics',
        isActive: true
    },
    {
        key: 'homepage_hero_subtitle',
        section: 'homepage',
        title: 'Pakistan\'s Premium Freight Network',
        description: 'GoldTrack connects shippers with verified carriers for guaranteed speed & security.',
        isActive: true
    },
    {
        key: 'contact_phone',
        section: 'contact',
        title: '+92-300-GOLDTRACK',
        description: 'Call us 24/7 for support',
        isActive: true
    },
    {
        key: 'contact_email',
        section: 'contact',
        title: 'support@goldtrack.pk',
        description: 'Email us for inquiries',
        isActive: true
    },
    {
        key: 'contact_address',
        section: 'contact',
        title: 'Karachi, Pakistan',
        description: 'Office No. 123, Shahrah-e-Faisal, Karachi, Sindh, Pakistan',
        isActive: true
    },
    {
        key: 'services_ftl_description',
        section: 'services',
        title: 'Full Truckload (FTL)',
        description: 'Dedicated truck for your shipment. Fastest delivery times with no intermediate stops.',
        content: {
            features: ['Direct delivery', 'No load sharing', 'Flexible scheduling'],
            pricing: 'Contact for quote'
        },
        isActive: true
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({ email: { $in: dummyUsers.map(u => u.email) } });
        await CMSContent.deleteMany({ key: { $in: cmsContent.map(c => c.key) } });
        console.log('🗑️  Cleared existing dummy data');

        // Hash passwords and create users
        for (let userData of dummyUsers) {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = new User({
                ...userData,
                password: hashedPassword
            });
            await user.save();
            console.log(`✅ Created user: ${userData.name} (${userData.role})`);
        }

        // Create CMS content
        for (let contentData of cmsContent) {
            const content = new CMSContent(contentData);
            await content.save();
            console.log(`✅ Created CMS content: ${contentData.key}`);
        }

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📋 Login Credentials:');
        console.log('═══════════════════════════════════════════════════════');
        dummyUsers.forEach(user => {
            console.log(`\n${user.role.toUpperCase()}`);
            console.log(`Email: ${user.email}`);
            console.log(`Password: ${user.password}`);
        });
        console.log('\n═══════════════════════════════════════════════════════');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
