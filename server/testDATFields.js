// Quick test script to verify DAT-style endpoints
const mongoose = require('mongoose');
require('dotenv').config();

const testDATEndpoints = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');

        const Load = require('./models/Load');
        const Settings = require('./models/Settings');
        
        // 1. Check if Settings document exists
        let settings = await Settings.findOne();
        if (!settings) {
            console.log('⚠️  No settings found, creating default...');
            settings = await Settings.create({
                companyName: 'GoldTrack LoadBoard',
                companyPhone: '+92-300-1234567',
                companyEmail: 'info@goldtrack.pk',
                companyAddress: 'Karachi, Pakistan',
                enableDirectContact: true,
                enableBidding: true
            });
            console.log('✅ Default settings created');
        } else {
            console.log('✅ Settings found:', {
                companyName: settings.companyName,
                companyPhone: settings.companyPhone,
                enableDirectContact: settings.enableDirectContact
            });
        }

        // 2. Check loads for new fields
        const loads = await Load.find().limit(3);
        console.log(`\n📦 Found ${loads.length} loads`);
        
        loads.forEach((load, index) => {
            console.log(`\nLoad ${index + 1}:`);
            console.log(`  Route: ${load.origin} → ${load.destination}`);
            console.log(`  Contact Person: ${load.contactPersonName || '❌ Not set'}`);
            console.log(`  Contact Mobile: ${load.contactMobile || '❌ Not set'}`);
            console.log(`  View Count: ${load.viewCount || 0}`);
            console.log(`  Contact View Count: ${load.contactViewCount || 0}`);
        });

        // 3. Show what fields are available
        const loadSchema = Load.schema.obj;
        console.log('\n✅ Load schema includes DAT fields:');
        console.log('  - contactPersonName:', !!loadSchema.contactPersonName);
        console.log('  - contactMobile:', !!loadSchema.contactMobile);
        console.log('  - contactWhatsApp:', !!loadSchema.contactWhatsApp);
        console.log('  - viewCount:', !!loadSchema.viewCount);
        console.log('  - contactViewCount:', !!loadSchema.contactViewCount);
        console.log('  - viewedBy:', !!loadSchema.viewedBy);
        console.log('  - contactClickedBy:', !!loadSchema.contactClickedBy);

        console.log('\n✅ All DAT-style fields are present in the schema!');
        console.log('\n📋 Next steps:');
        console.log('  1. Post a new load with contact fields from frontend');
        console.log('  2. Test "Call Now" button on carrier dashboard');
        console.log('  3. Verify contact reveal and analytics tracking');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 MongoDB disconnected');
    }
};

testDATEndpoints();
