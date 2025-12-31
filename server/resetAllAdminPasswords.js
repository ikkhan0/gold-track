const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function resetAllAdminPasswords() {
    await mongoose.connect(process.env.MONGO_URI);
    
    const adminUsers = [
        { email: 'admin@goldtrack.pk', password: 'admin123' },
        { email: 'superadmin@goldtrack.pk', password: 'admin123' }
    ];
    
    console.log('🔐 Resetting Admin Passwords...\n');
    
    for (const adminData of adminUsers) {
        const user = await User.findOne({ email: adminData.email });
        
        if (!user) {
            console.log(`❌ User not found: ${adminData.email}`);
            continue;
        }
        
        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);
        
        // Update password
        user.password = hashedPassword;
        await user.save();
        
        // Verify
        const testMatch = await bcrypt.compare(adminData.password, user.password);
        
        console.log(`✅ ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Password: ${adminData.password}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Status: ${user.status}`);
        console.log(`   Verified: ${testMatch ? '✅' : '❌'}\n`);
    }
    
    console.log('✅ All admin passwords reset successfully!\n');
    console.log('You can now login with:');
    console.log('  Admin: admin@goldtrack.pk / admin123');
    console.log('  Super Admin: superadmin@goldtrack.pk / admin123');
    
    await mongoose.connection.close();
}

resetAllAdminPasswords();
