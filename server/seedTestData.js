require('dotenv').config();
const mongoose = require('mongoose');
const Load = require('./models/Load');
const TruckAvailability = require('./models/TruckAvailability');
const User = require('./models/User');

const seedTestData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');

        // Get a carrier and shipper user to associate with data
        const carrier = await User.findOne({ role: 'carrier' });
        const shipper = await User.findOne({ role: 'shipper' });

        if (!carrier || !shipper) {
            console.log('⚠️  No carrier or shipper users found. Please register users first.');
            process.exit(0);
        }

        // Clear existing test data
        await Load.deleteMany({});
        await TruckAvailability.deleteMany({});
        console.log('🗑️  Cleared existing loads and trucks');

        // Seed Loads
        const loads = [
            {
                origin: 'Karachi',
                destination: 'Lahore',
                pickupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                goodsType: 'General Cargo',
                weight: 15,
                requiredVehicle: 'Mazda',
                offerPrice: 85000,
                status: 'Open',
                shipper: shipper._id
            },
            {
                origin: 'Lahore',
                destination: 'Islamabad',
                pickupDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                goodsType: 'Electronics',
                weight: 8,
                requiredVehicle: 'Shehzore',
                offerPrice: 45000,
                status: 'Open',
                shipper: shipper._id
            },
            {
                origin: 'Faisalabad',
                destination: 'Karachi',
                pickupDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                goodsType: 'Textiles',
                weight: 20,
                requiredVehicle: '22-Wheeler',
                offerPrice: 120000,
                status: 'Open',
                shipper: shipper._id
            },
            {
                origin: 'Multan',
                destination: 'Peshawar',
                pickupDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
                goodsType: 'Construction Materials',
                weight: 25,
                requiredVehicle: '22-Wheeler',
                offerPrice: 150000,
                status: 'Open',
                shipper: shipper._id
            },
            {
                origin: 'Karachi',
                destination: 'Quetta',
                pickupDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                goodsType: 'Food Items',
                weight: 12,
                requiredVehicle: 'Mazda',
                offerPrice: 95000,
                status: 'Open',
                shipper: shipper._id
            }
        ];

        await Load.insertMany(loads);
        console.log(`✅ Created ${loads.length} sample loads`);

        // Seed Trucks
        const trucks = [
            {
                vehicleType: 'Mazda',
                currentLocation: 'Karachi',
                availableFrom: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                preferredRoutes: ['Karachi', 'Lahore', 'Islamabad'],
                capacity: 15,
                registrationNumber: 'KHI-1234',
                driverName: carrier.name,
                driverPhone: carrier.phone || '0301-9876543',
                postedBy: carrier._id
            },
            {
                vehicleType: 'Shehzore',
                currentLocation: 'Lahore',
                availableFrom: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                preferredRoutes: ['Lahore', 'Islamabad', 'Rawalpindi'],
                capacity: 8,
                registrationNumber: 'LHR-5678',
                driverName: carrier.name,
                driverPhone: carrier.phone || '0301-9876543',
                postedBy: carrier._id
            },
            {
                vehicleType: 'Container 20ft',
                currentLocation: 'Faisalabad',
                availableFrom: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                preferredRoutes: ['Faisalabad', 'Karachi', 'Lahore'],
                capacity: 20,
                registrationNumber: 'FSD-9012',
                driverName: carrier.name,
                driverPhone: carrier.phone || '0301-9876543',
                postedBy: carrier._id
            },
            {
                vehicleType: 'Container 40ft',
                currentLocation: 'Multan',
                availableFrom: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                preferredRoutes: ['Multan', 'Peshawar', 'Lahore'],
                capacity: 25,
                registrationNumber: 'MLT-3456',
                driverName: carrier.name,
                driverPhone: carrier.phone || '0301-9876543',
                postedBy: carrier._id
            }
        ];

        await TruckAvailability.insertMany(trucks);
        console.log(`✅ Created ${trucks.length} sample trucks`);

        console.log('\n✨ Test data seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedTestData();
