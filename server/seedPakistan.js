const mongoose = require('mongoose');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
const Load = require('./models/Load');
const TruckAvailability = require('./models/TruckAvailability');
const LaneRate = require('./models/LaneRate');
const connectDB = require('./config/db');

require('dotenv').config();

const PAKISTANI_CITIES = ['Karachi', 'Lahore', 'Islamabad', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot'];
const VEHICLE_TYPES = ['Mazda', 'Shehzore', 'Flatbed', '10-Wheeler', '22-Wheeler', 'Suzuki'];

const cleanDB = async () => {
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Load.deleteMany({});
    await TruckAvailability.deleteMany({});
    await LaneRate.deleteMany({});
    console.log('Database cleaned');
};

const seedData = async () => {
    await connectDB();
    await cleanDB();

    // Create 5 Carriers
    const carriers = [];
    for (let i = 0; i < 5; i++) {
        const carrier = await User.create({
            name: `Carrier ${i + 1}`,
            email: `carrier${i + 1}@example.com`,
            password: 'password123',
            phone: `0300123456${i}`,
            role: 'carrier',
            status: 'approved',
            companyName: `Pak Logistics ${i + 1}`,
            city: PAKISTANI_CITIES[i % PAKISTANI_CITIES.length],
            verificationBadges: ['Verified', 'Trusted'],
            creditScore: 80 + i * 2,
            daysToPayAverage: 7,
            isEmailVerified: true
        });
        carriers.push(carrier);

        // Create 2 Trucks for each carrier
        for (let j = 0; j < 2; j++) {
            const vehicle = await Vehicle.create({
                owner: carrier._id,
                vehicleType: VEHICLE_TYPES[j % VEHICLE_TYPES.length],
                registrationNumber: `LEC-${1000 + i * 10 + j}`,
                capacity: 20000,
                status: 'Active'
            });

            // Post Truck Availability
            await TruckAvailability.create({
                carrier: carrier._id,
                truck: vehicle._id,
                currentLocation: carrier.city,
                destination: PAKISTANI_CITIES[(i + 1) % PAKISTANI_CITIES.length],
                availableDate: new Date(),
                equipmentType: vehicle.vehicleType,
                loadType: 'Full',
                maxLength: 40,
                maxWeight: 20000,
                isAvailable: true
            });
        }
    }

    // Create 3 Shippers
    const shippers = [];
    for (let i = 0; i < 3; i++) {
        const shipper = await User.create({
            name: `Shipper ${i + 1}`,
            email: `shipper${i + 1}@example.com`,
            password: 'password123',
            phone: `0321123456${i}`,
            role: 'shipper',
            status: 'approved',
            companyName: `Textile Mills ${i + 1}`,
            city: 'Karachi',
            isEmailVerified: true
        });
        shippers.push(shipper);

        // Create Loads
        for (let j = 0; j < 3; j++) {
            await Load.create({
                shipper: shipper._id,
                origin: 'Karachi',
                destination: PAKISTANI_CITIES[(j + 1) % PAKISTANI_CITIES.length],
                goodsType: 'Textile',
                weight: 10,
                requiredVehicle: '10-Wheeler',
                offerPrice: 85000 + j * 5000,
                distance: 1200,
                status: 'Open',
                visibility: 'Public',
                pickupDate: new Date(Date.now() + 86400000), // tomorrow
                isBookNowEnabled: true,
                bookNowRate: 90000
            });
        }
    }

    // Seed Lane Rates
    for (const city of PAKISTANI_CITIES) {
        if (city === 'Karachi') continue;
        await LaneRate.create({
            origin: 'Karachi',
            destination: city,
            vehicleType: '10-Wheeler',
            avgRate: 95000,
            avgRatePerMile: 85,
            marketCondition: 'hot',
            trend: 'up',
            loadCount: 15,
            sampleSize: 50,
            lastUpdated: new Date()
        });
    }

    console.log('Seed data created successfully');
    process.exit();
};

seedData();
