const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String }, // WhatsApp number if different from phone
    role: { type: String, enum: ['carrier', 'shipper', 'admin', 'super_admin', 'broker', 'fleet_owner', 'owner_operator'], default: 'carrier' },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'suspended'], default: 'pending' },

    // Common Profile
    address: { type: String },
    city: { type: String },

    // Carrier Specific
    fleetType: { type: String },
    cnic: { type: String },
    licenseNumber: { type: String },
    
    // DAT-Style Trust Metrics
    creditScore: { type: Number, default: 50, min: 0, max: 100 }, // CS in DAT
    daysToPayAverage: { type: Number, default: 30 }, // DTP (Days To Pay)
    rating: { type: Number, default: 0 }, // User rating
    reviewCount: { type: Number, default: 0 },
    
    // Verification & Badges
    isVerified: { type: Boolean, default: false }, // CNIC/License verified by admin
    verificationBadges: [{ type: String }], // ['Gold', 'Premium', 'Verified']
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: { type: Date },

    // Shipper Specific
    companyName: { type: String },
    ntn: { type: String },
    
    // Fleet Owner Specific
    totalTrucks: { type: Number, default: 0 },
    drivers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Assigned drivers
    
    // Subscription & Premium Features
    subscriptionTier: { type: String, enum: ['Free', 'Gold', 'Premium'], default: 'Free' },
    subscriptionExpiresAt: { type: Date },

    createdAt: { type: Date, default: Date.now },
    lastLoginAt: { type: Date }
});

// Method to check if user has Gold/Premium access
userSchema.methods.hasPremiumAccess = function() {
    if (this.subscriptionTier === 'Free') return false;
    if (!this.subscriptionExpiresAt) return false;
    return this.subscriptionExpiresAt > new Date();
};

module.exports = mongoose.model('User', userSchema);
