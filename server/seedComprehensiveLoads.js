// Seed script to create comprehensive test loads with all fields
const mongoose = require('mongoose');
require('dotenv').config();

const seedComprehensiveLoads = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');

        const Load = require('./models/Load');
        const User = require('./models/User');

        // Get a shipper user
        const shipper = await User.findOne({ role: 'shipper' });
        if (!shipper) {
            console.log('❌ No shipper found. Please create a shipper user first.');
            process.exit(1);
        }

        console.log(`📦 Creating comprehensive test loads for shipper: ${shipper.name}`);

        // Delete existing test loads (optional - comment out if you want to keep old data)
        // await Load.deleteMany({});
        // console.log('🗑️  Cleared existing loads');

        const comprehensiveLoads = [
            {
                shipper: shipper._id,
                origin: 'Karachi',
                destination: 'Lahore',
                goodsType: 'Electronics',
                weight: 18,
                requiredVehicle: '22-Wheeler',
                offerPrice: 180000,
                contactPersonName: 'Ahmed Khan',
                contactMobile: '0300-1234567',
                contactWhatsApp: '0300-1234567',
                pickupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
                pickupTime: '09:00 AM',
                deliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
                loadType: 'Full',
                dimensions: {
                    length: 40,
                    width: 8,
                    height: 8
                },
                specialRequirements: {
                    hazmat: false,
                    oversize: false,
                    teamDriver: false,
                    tarping: true,
                    liftgate: false,
                    portEntry: false
                },
                loadNotes: 'Fragile electronics. Handle with care. Tarping required for weather protection.',
                status: 'Open'
            },
            {
                shipper: shipper._id,
                origin: 'Lahore',
                destination: 'Islamabad',
                goodsType: 'Chemicals',
                weight: 25,
                requiredVehicle: '22-Wheeler',
                offerPrice: 95000,
                contactPersonName: 'Bilal Ahmed',
                contactMobile: '0321-9876543',
                contactWhatsApp: '0321-9876543',
                pickupDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
                pickupTime: '08:00 AM',
                deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                loadType: 'Full',
                dimensions: {
                    length: 40,
                    width: 8,
                    height: 9
                },
                specialRequirements: {
                    hazmat: true, // HAZMAT load
                    oversize: false,
                    teamDriver: false,
                    tarping: false,
                    liftgate: false,
                    portEntry: false
                },
                loadNotes: 'HAZMAT Class 3 - Flammable Liquids. Proper documentation required. Driver must have HAZMAT certification.',
                status: 'Open'
            },
            {
                shipper: shipper._id,
                origin: 'Faisalabad',
                destination: 'Karachi',
                goodsType: 'Textile',
                weight: 12,
                requiredVehicle: '10-Wheeler',
                offerPrice: 85000,
                contactPersonName: 'Hassan Ali',
                contactMobile: '0333-7654321',
                pickupDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
                pickupTime: '02:00 PM',
                deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                loadType: 'LTL', // Less than truckload
                dimensions: {
                    length: 20,
                    width: 8,
                    height: 6
                },
                specialRequirements: {
                    hazmat: false,
                    oversize: false,
                    teamDriver: false,
                    tarping: false,
                    liftgate: true, // Liftgate required
                    portEntry: false
                },
                loadNotes: 'Partial load. Liftgate required for unloading. No appointment needed at destination.',
                status: 'Open'
            },
            {
                shipper: shipper._id,
                origin: 'Multan',
                destination: 'Quetta',
                goodsType: 'Construction Material',
                weight: 30,
                requiredVehicle: 'Flatbed',
                offerPrice: 250000,
                contactPersonName: 'Imran Sheikh',
                contactMobile: '0345-1122334',
                contactWhatsApp: '0345-1122334',
                pickupDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
                pickupTime: '07:00 AM',
                deliveryDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
                loadType: 'Full',
                dimensions: {
                    length: 48,
                    width: 8.5,
                    height: 11
                },
                specialRequirements: {
                    hazmat: false,
                    oversize: true, // OVERSIZE load
                    teamDriver: true, // Team driver required for long haul
                    tarping: true,
                    liftgate: false,
                    portEntry: false
                },
                loadNotes: 'OVERSIZE LOAD - Steel beams. Permits required. Team driver needed for 2-day journey. Tarping and securing required.',
                status: 'Open'
            },
            {
                shipper: shipper._id,
                origin: 'Peshawar',
                destination: 'Karachi',
                goodsType: 'Food Items',
                weight: 15,
                requiredVehicle: 'Shehzore',
                offerPrice: 55000,
                contactPersonName: 'Zain Malik',
                contactMobile: '0312-5566778',
                pickupDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
                pickupTime: '06:00 AM',
                deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                loadType: 'Full',
                specialRequirements: {
                    hazmat: false,
                    oversize: false,
                    teamDriver: false,
                    tarping: false,
                    liftgate: false,
                    portEntry: false
                },
                loadNotes: 'Perishable food items. Time-sensitive delivery. Keep refrigerated if possible.',
                status: 'Open'
            },
            {
                shipper: shipper._id,
                origin: 'Karachi',
                destination: 'Gwadar',
                goodsType: 'Machinery',
                weight: 28,
                requiredVehicle: '22-Wheeler',
                offerPrice: 320000,
                contactPersonName: 'Farhan Qureshi',
                contactMobile: '0301-4455667',
                contactWhatsApp: '0301-4455667',
                pickupDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                pickupTime: '10:00 AM',
                deliveryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                loadType: 'Full',
                dimensions: {
                    length: 45,
                    width: 8,
                    height: 10
                },
                specialRequirements: {
                    hazmat: false,
                    oversize: true,
                    teamDriver: true,
                    tarping: true,
                    liftgate: false,
                    portEntry: true // PORT ENTRY required
                },
                loadNotes: 'Heavy machinery for port project. Port entry clearance required. Team driver for long distance. Crane needed at destination.',
                status: 'Open'
            },
            {
                shipper: shipper._id,
                origin: 'Sialkot',
                destination: 'Lahore',
                goodsType: 'Sports Equipment',
                weight: 8,
                requiredVehicle: 'Mazda',
                offerPrice: 35000,
                contactPersonName: 'Ali Raza',
                contactMobile: '0334-8899000',
                pickupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                pickupTime: '11:00 AM',
                loadType: 'Partial',
                dimensions: {
                    length: 15,
                    width: 6,
                    height: 5
                },
                specialRequirements: {
                    hazmat: false,
                    oversize: false,
                    teamDriver: false,
                    tarping: false,
                    liftgate: true,
                    portEntry: false
                },
                loadNotes: 'Sports equipment for exhibition. Multiple boxes. Liftgate preferred for easy unloading.',
                status: 'Open'
            },
            {
                shipper: shipper._id,
                origin: 'Rawalpindi',
                destination: 'Karachi',
                goodsType: 'Electronics',
                weight: 22,
                requiredVehicle: '22-Wheeler',
                offerPrice: 175000,
                contactPersonName: 'Usman Tariq',
                contactMobile: '0322-1234567',
                contactWhatsApp: '0322-1234567',
                pickupDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
                pickupTime: '01:00 PM',
                deliveryDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
                deliveryTime: '09:00 AM',
                loadType: 'Full',
                dimensions: {
                    length: 40,
                    width: 8,
                    height: 8
                },
                specialRequirements: {
                    hazmat: false,
                    oversize: false,
                    teamDriver: false,
                    tarping: true,
                    liftgate: false,
                    portEntry: false
                },
                loadNotes: 'High-value electronics. Insurance required. Tarping mandatory. Appointment at 9 AM sharp for delivery.',
                status: 'Open'
            }
        ];

        // Insert all loads
        const createdLoads = await Load.insertMany(comprehensiveLoads);
        console.log(`\n✅ Created ${createdLoads.length} comprehensive test loads with all fields!\n`);

        // Display summary
        console.log('📋 Load Summary:');
        console.log('================');
        createdLoads.forEach((load, index) => {
            console.log(`\n${index + 1}. ${load.origin} → ${load.destination}`);
            console.log(`   Vehicle: ${load.requiredVehicle} | Weight: ${load.weight}t | Type: ${load.loadType}`);
            console.log(`   Price: Rs ${load.offerPrice?.toLocaleString() || 'N/A'}`);
            console.log(`   Pickup: ${load.pickupDate.toLocaleDateString()} ${load.pickupTime || ''}`);
            if (load.deliveryDate) {
                console.log(`   Delivery: ${load.deliveryDate.toLocaleDateString()}`);
            }
            if (load.dimensions && load.dimensions.length) {
                console.log(`   Dimensions: ${load.dimensions.length}' x ${load.dimensions.width}' x ${load.dimensions.height}'`);
            }
            const specialReqs = [];
            if (load.specialRequirements.hazmat) specialReqs.push('HAZMAT');
            if (load.specialRequirements.oversize) specialReqs.push('OVERSIZE');
            if (load.specialRequirements.teamDriver) specialReqs.push('TEAM DRIVER');
            if (load.specialRequirements.tarping) specialReqs.push('TARPING');
            if (load.specialRequirements.liftgate) specialReqs.push('LIFTGATE');
            if (load.specialRequirements.portEntry) specialReqs.push('PORT ENTRY');
            if (specialReqs.length > 0) {
                console.log(`   Requirements: ${specialReqs.join(', ')}`);
            }
            console.log(`   Contact: ${load.contactPersonName} - ${load.contactMobile}`);
        });

        console.log('\n\n🎯 Test Scenarios Covered:');
        console.log('==========================');
        console.log('✅ Full Truckload (FTL) loads');
        console.log('✅ Less Than Truckload (LTL)');
        console.log('✅ Partial loads');
        console.log('✅ HAZMAT requirements');
        console.log('✅ Oversize loads');
        console.log('✅ Team driver requirements');
        console.log('✅ Tarping required');
        console.log('✅ Liftgate required');
        console.log('✅ Port entry clearance');
        console.log('✅ Dimensions specified');
        console.log('✅ Pickup date/time');
        console.log('✅ Delivery date/time');
        console.log('✅ Load notes and instructions');
        console.log('✅ Contact information');

        console.log('\n\n📱 Next Steps:');
        console.log('==============');
        console.log('1. Login as carrier: carrier@test.com / password123');
        console.log('2. View Carrier Dashboard - all loads should display');
        console.log('3. Check each load for complete information');
        console.log('4. Test "Call Now" button for contact reveal');
        console.log('5. Test bidding on different load types');
        console.log('\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 MongoDB disconnected');
    }
};

seedComprehensiveLoads();
