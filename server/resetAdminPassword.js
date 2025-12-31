const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function reset() {
    try {
        console.log('Connecting...');
        await mongoose.connect(process.env.MONGO_URI);

        const email = 'admin@goldtrack.pk';
        const hashedPassword = await bcrypt.hash('123456', 10);

        console.log(`Resetting password for ${email}...`);

        const result = await User.findOneAndUpdate(
            { email },
            {
                name: 'Admin User',
                password: hashedPassword,
                role: 'admin',
                status: 'approved'
            },
            { upsert: true, new: true }
        );

        console.log('✅ Admin Password Reset to "123456"');
        console.log('User:', result.email, result.role);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
reset();
