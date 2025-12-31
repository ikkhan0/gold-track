const mongoose = require('mongoose');

const loadSchema = new mongoose.Schema({
    shipper: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    origin: { type: String, required: true }, // e.g., "Karachi"
    destination: { type: String, required: true }, // e.g., "Lahore"

    goodsType: { type: String, required: true }, // e.g., "Textile"
    weight: { type: Number, required: true }, // In Tons

    requiredVehicle: {
        type: String,
        enum: ['Mazda', 'Shehzore', 'Flatbed', '10-Wheeler', '22-Wheeler', 'Suzuki', 'Any'],
        default: 'Any'
    },

    offerPrice: { type: Number }, // Optional target price
    status: { type: String, enum: ['Open', 'Assigned', 'In-Transit', 'Delivered'], default: 'Open' },

    // PICKUP & DELIVERY
    pickupDate: { type: Date, required: true }, // When to pickup
    pickupTime: { type: String }, // Specific appointment time (e.g., "9:00 AM")
    deliveryDate: { type: Date }, // Expected delivery date
    deliveryTime: { type: String }, // Delivery appointment

    // LOAD SPECIFICATIONS
    loadType: { type: String, enum: ['Full', 'LTL', 'Partial'], default: 'Full' },
    dimensions: {
        length: Number, // feet
        width: Number,  // feet
        height: Number  // feet
    },
    distance: { type: Number }, // Miles/KM (can be auto-calculated)
    loadReferenceNumber: { type: String }, // Customer reference

    // SPECIAL REQUIREMENTS
    specialRequirements: {
        hazmat: { type: Boolean, default: false },
        oversize: { type: Boolean, default: false },
        teamDriver: { type: Boolean, default: false },
        tarping: { type: Boolean, default: false },
        liftgate: { type: Boolean, default: false },
        portEntry: { type: Boolean, default: false }
    },

    // ADDITIONAL STOPS (for multi-stop routes)
    additionalStops: [{
        city: String,
        address: String,
        stopType: { type: String, enum: ['Pickup', 'Dropoff'] },
        stopNumber: Number
    }],

    // NOTES & INSTRUCTIONS
    loadNotes: { type: String }, // Additional instructions
    equipmentNotes: { type: String }, // Equipment preferences

    // DAT-STYLE DIRECT CONTACT FIELDS
    contactPersonName: { type: String, required: true }, // Person to contact for this specific load
    contactMobile: { type: String, required: true }, // Direct mobile number for this load
    contactWhatsApp: { type: String }, // Optional WhatsApp number if different
    showContactImmediately: { type: Boolean, default: false }, // If true, shows contact without click

    // ANALYTICS & TRACKING
    viewCount: { type: Number, default: 0 }, // How many times load was viewed
    contactViewCount: { type: Number, default: 0 }, // How many times "Show Contact" was clicked
    viewedBy: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        viewedAt: { type: Date, default: Date.now }
    }],
    contactClickedBy: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        clickedAt: { type: Date, default: Date.now }
    }],

    bids: [{
        carrier: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        amount: Number,
        note: String,
        status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
        date: { type: Date, default: Date.now }
    }],

    pickupDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date } // Auto-expire old loads
});

// Methods for tracking
loadSchema.methods.recordView = function (userId) {
    this.viewCount += 1;
    if (userId && !this.viewedBy.some(v => v.user.toString() === userId.toString())) {
        this.viewedBy.push({ user: userId });
    }
    return this.save();
};

loadSchema.methods.recordContactClick = function (userId) {
    this.contactViewCount += 1;
    if (userId && !this.contactClickedBy.some(c => c.user.toString() === userId.toString())) {
        this.contactClickedBy.push({ user: userId });
    }
    return this.save();
};

// Add index for better query performance
loadSchema.index({ shipper: 1, status: 1 });
loadSchema.index({ origin: 1, destination: 1 });
loadSchema.index({ 'bids.carrier': 1 });
loadSchema.index({ createdAt: -1 }); // For sorting by newest
loadSchema.index({ expiresAt: 1 }); // For TTL cleanup

module.exports = mongoose.models.Load || mongoose.model('Load', loadSchema);
