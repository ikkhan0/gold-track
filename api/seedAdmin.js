const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Simple User schema inline
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: String,
    phone: { type: String, required: true },
    role: String,
    status: { type: String, default: 'approved' },
    companyName: String,
    isVerified: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function seedAdmin() {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb+srv://imran_db_user:imran321123@loadboard.rge52dl.mongodb.net/loadboard_db?retryWrites=true&w=majority';
        
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000,
            family: 4
        });
        
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@goldtrack.pk' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Create admin user
        const admin = new User({
            name: 'Admin User',
            email: 'admin@goldtrack.pk',
            password: hashedPassword,
            phone: '+92-300-1234567',
            role: 'admin',
            companyName: 'GoldTrack Admin',
            status: 'approved',
            isVerified: true
        });

        await admin.save();
        console.log('✅ Admin user created successfully');
        console.log('Email: admin@goldtrack.pk');
        console.log('Password: admin123');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

seedAdmin();
