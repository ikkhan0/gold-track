const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkUsers() {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({}, 'name email role status');
    console.log('='.repeat(60));
    console.log('Existing Users in Database:');
    console.log('='.repeat(60));
    users.forEach(u => {
        console.log(`📧 ${u.email.padEnd(35)} | ${u.role.padEnd(15)} | ${u.status}`);
    });
    console.log('='.repeat(60));
    console.log(`Total: ${users.length} users`);
    await mongoose.connection.close();
}

checkUsers();
