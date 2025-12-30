const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Load = require('./models/Load');
const Vehicle = require('./models/Vehicle');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');

        // Clear existing data
        await User.deleteMany({});
        await Load.deleteMany({});
        await Vehicle.deleteMany({});
        console.log('Data Cleared');

        // Create Users
        const adminUser = await User.create({
            name: 'Super Admin',
            email: 'admin@goldtrack.pk',
            phone: '00000000000',
            password: 'password123',
            role: 'admin',
            status: 'approved'
        });

        const shipperUser = await User.create({
            name: 'Ali Shipper',
            email: 'ali@shipper.com',
            phone: '03001234567',
            password: 'password123',
            role: 'shipper',
            companyName: 'Ali Traders',
            status: 'approved', // Pre-approved for testing
            address: 'Main Market, Karachi',
            city: 'Karachi'
        });

        const carrierUser = await User.create({
            name: 'Gul Carrier',
            email: 'gul@carrier.com',
            phone: '03007654321',
            password: 'password123',
            role: 'carrier',
            cnic: '35202-1234567-1',
            city: 'Lahore',
            status: 'approved', // Pre-approved for testing
            address: 'Truck Stand, Lahore',
            licenseNumber: 'DL-998877'
        });

        console.log(`Users Created:
        Admin: admin@goldtrack.pk / password123
        Shipper: ali@shipper.com / password123
        Carrier: gul@carrier.com / password123`);

        // Create Vehicle for Carrier
        await Vehicle.create({
            owner: carrierUser._id,
            regNumber: 'LES-2024',
            type: 'Shehzore',
            capacity: 3,
            city: 'Lahore',
            status: 'Active'
        });
        console.log('Vehicle Created');

        // Create Load for Shipper
        await Load.create({
            shipper: shipperUser._id,
            origin: 'Karachi',
            destination: 'Lahore',
            goodsType: 'Textile',
            weight: 5,
            requiredVehicle: 'Mazda',
            offerPrice: 60000,
            status: 'Open'
        });
        console.log('Load Created');

        console.log('Seeding Completed Successfully');
        process.exit();
    } catch (error) {
        console.error('Seeding Error:', JSON.stringify(error, null, 2));
        if (error.errors) {
            Object.keys(error.errors).forEach(key => {
                console.error(`Validation Error [${key}]: ${error.errors[key].message}`);
            });
        }
        process.exit(1);
    }
};

seedData();
