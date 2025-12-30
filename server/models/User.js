const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ['carrier', 'shipper', 'admin'], default: 'carrier' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },

    // Common Profile
    address: { type: String },
    city: { type: String },

    // Carrier Specific
    fleetType: { type: String },
    cnic: { type: String },
    licenseNumber: { type: String },

    // Shipper Specific
    companyName: { type: String },
    ntn: { type: String },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
