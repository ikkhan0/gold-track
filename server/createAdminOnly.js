const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function run() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const email = 'admin@goldtrack.pk';
        console.log(`Deleting existing user: ${email}`);
        await User.deleteOne({ email });

        console.log('Creating new Admin user...');
        const hashedPassword = await bcrypt.hash('Admin@123', 10);

        const user = new User({
            name: 'Admin User',
            email: email,
            password: hashedPassword,
            phone: '+923001234567',
            role: 'admin',
            status: 'approved',
            isEmailVerified: true
        });

        await user.save();
        console.log('✅ SUCCESS: Admin User Created!');
        console.log('Email: admin@goldtrack.pk');
        console.log('Password: Admin@123');

        process.exit(0);
    } catch (err) {
        console.error('❌ ERROR:', err);
        process.exit(1);
    }
}

run();
