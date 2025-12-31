const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    // Global Contact Info (Admin can change)
    companyName: { type: String, default: 'GoldTrack.pk' },
    companyPhone: { type: String, default: '+92-300-1234567' },
    companyWhatsApp: { type: String, default: '+92-300-1234567' },
    companyEmail: { type: String, default: 'info@goldtrack.pk' },
    companyAddress: { type: String, default: 'Karachi, Pakistan' },
    supportPhone: { type: String, default: '+92-300-1234567' },
    
    // Social Media
    facebook: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    
    // Business Hours
    businessHours: { type: String, default: 'Mon-Sat: 9 AM - 6 PM' },
    
    // Feature Flags
    enableBidding: { type: Boolean, default: true },
    enableDirectContact: { type: Boolean, default: true }, // DAT-style direct contact
    requireApprovalForPosts: { type: Boolean, default: false },
    autoExpireLoadsAfterDays: { type: Number, default: 7 },
    
    // Subscription Pricing
    goldSubscriptionMonthly: { type: Number, default: 2000 }, // PKR
    goldSubscriptionYearly: { type: Number, default: 20000 },
    premiumSubscriptionMonthly: { type: Number, default: 5000 },
    premiumSubscriptionYearly: { type: Number, default: 50000 },
    
    // Updated by admin
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Singleton pattern - only one settings document
settingsSchema.statics.getSettings = async function() {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
