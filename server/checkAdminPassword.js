const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function checkAdmin() {
    await mongoose.connect(process.env.MONGO_URI);
    
    const admin = await User.findOne({ email: 'admin@goldtrack.pk' });
    
    if (!admin) {
        console.log('❌ Admin user not found!');
        await mongoose.connection.close();
        return;
    }
    
    console.log('Admin User Details:');
    console.log('  Email:', admin.email);
    console.log('  Name:', admin.name);
    console.log('  Role:', admin.role);
    console.log('  Status:', admin.status);
    console.log('  Has Password:', !!admin.password);
    console.log('  Password Hash:', admin.password.substring(0, 20) + '...');
    
    // Test password
    const testPassword = 'admin123';
    const isMatch = await bcrypt.compare(testPassword, admin.password);
    console.log(`  Password "${testPassword}" matches:`, isMatch);
    
    await mongoose.connection.close();
}

checkAdmin();
