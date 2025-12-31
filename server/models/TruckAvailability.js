const mongoose = require('mongoose');

const truckAvailabilitySchema = new mongoose.Schema({
    // Owner Information
    carrier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    truck: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },

    // Location Details
    currentLocation: {
        type: String,
        required: true,
        index: true
    },
    currentLocationCoords: {
        lat: Number,
        lng: Number
    },
    destination: {
        type: String, // Optional - where truck is heading
        index: true
    },
    destinationCoords: {
        lat: Number,
        lng: Number
    },

    // Availability
    availableDate: {
        type: Date,
        required: true,
        default: Date.now,
        index: true
    },

    // Deadhead Preferences
    deadheadOriginRadius: {
        type: Number, // in KM
        default: 50,
        min: 0,
        max: 500
    },
    deadheadDestinationRadius: {
        type: Number, // in KM
        default: 100,
        min: 0,
        max: 500
    },

    // Load Preferences
    loadType: {
        type: String,
        enum: ['Full', 'Partial', 'Any'],
        default: 'Full'
    },

    // Equipment Details
    equipmentType: {
        type: String,
        enum: ['Mazda', 'Shehzore', 'Flatbed', '6-Wheeler', '10-Wheeler', '22-Wheeler', 'Suzuki', 'Refrigerated', 'Tanker', 'Trailer-20ft', 'Trailer-40ft', 'Any'],
        required: true
    },

    // Capacity
    maxLength: {
        type: Number, // in feet
        required: true
    },
    maxWeight: {
        type: Number, // in KG
        required: true
    },

    // Special Capabilities
    specialFeatures: {
        temperatureControlled: { type: Boolean, default: false },
        gpsTracking: { type: Boolean, default: false },
        tailgateLift: { type: Boolean, default: false },
        tarp: { type: Boolean, default: false },
        hazmatCertified: { type: Boolean, default: false }
    },

    // Pricing
    expectedRatePerKM: {
        type: Number, // in PKR
        min: 0
    },
    minimumRate: {
        type: Number, // in PKR
        min: 0
    },

    // Status
    isAvailable: {
        type: Boolean,
        default: true,
        index: true
    },
    status: {
        type: String,
        enum: ['Available', 'In-Transit', 'Booked', 'Expired'],
        default: 'Available',
        index: true
    },

    // Booking Information
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    bookedLoad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Load'
    },
    bookedAt: Date,

    // Contact Preferences
    contactMethod: {
        type: String,
        enum: ['Phone', 'WhatsApp', 'In-App', 'Any'],
        default: 'Any'
    },

    // Additional Details
    notes: {
        type: String,
        maxlength: 500
    },
    openToBackhaul: {
        type: Boolean,
        default: true
    },

    // Auto-expiration
    expiresAt: {
        type: Date,
        default: function () {
            // Default: expire after 7 days
            return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        },
        index: true
    },

    // Metrics
    viewCount: {
        type: Number,
        default: 0
    },
    contactCount: {
        type: Number,
        default: 0
    },

    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Compound indexes for efficient searching
truckAvailabilitySchema.index({ currentLocation: 1, equipmentType: 1, isAvailable: 1 });
truckAvailabilitySchema.index({ availableDate: 1, status: 1 });
truckAvailabilitySchema.index({ carrier: 1, status: 1 });
truckAvailabilitySchema.index({ expiresAt: 1, status: 1 });

// Pre-save middleware
truckAvailabilitySchema.pre('save', function (next) {
    this.updatedAt = Date.now();

    // Auto-set status based on availability
    if (!this.isAvailable && this.status === 'Available') {
        this.status = 'Booked';
    }

    next();
});

// Static method to expire old postings
truckAvailabilitySchema.statics.expireOldPostings = async function () {
    const now = new Date();
    const result = await this.updateMany(
        {
            expiresAt: { $lt: now },
            status: 'Available'
        },
        {
            status: 'Expired',
            isAvailable: false
        }
    );
    return result;
};

// Static method to search trucks with filters
truckAvailabilitySchema.statics.searchTrucks = async function (filters) {
    const query = {
        isAvailable: true,
        status: 'Available',
        expiresAt: { $gt: new Date() }
    };

    if (filters.currentLocation) {
        query.currentLocation = { $regex: filters.currentLocation, $options: 'i' };
    }

    if (filters.destination) {
        query.destination = { $regex: filters.destination, $options: 'i' };
    }

    if (filters.equipmentType && filters.equipmentType !== 'Any') {
        query.equipmentType = filters.equipmentType;
    }

    if (filters.availableDate) {
        query.availableDate = { $lte: new Date(filters.availableDate) };
    }

    if (filters.loadType && filters.loadType !== 'Any') {
        query.$or = [
            { loadType: filters.loadType },
            { loadType: 'Any' }
        ];
    }

    if (filters.minWeight) {
        query.maxWeight = { $gte: filters.minWeight };
    }

    if (filters.minLength) {
        query.maxLength = { $gte: filters.minLength };
    }

    // Search back filter (time-based)
    if (filters.maxAge) {
        const minCreatedAt = new Date(Date.now() - filters.maxAge * 60000);
        query.createdAt = { $gte: minCreatedAt };
    }

    return this.find(query)
        .populate('carrier', 'name companyName phone whatsapp creditScore daysToPayAverage rating verificationBadges')
        .populate('truck', 'vehicleType registrationNumber capacity')
        .sort({ createdAt: -1 });
};

// Instance method to mark as booked
truckAvailabilitySchema.methods.markAsBooked = function (loadId, brokerId) {
    this.isAvailable = false;
    this.status = 'Booked';
    this.bookedBy = brokerId;
    this.bookedLoad = loadId;
    this.bookedAt = Date.now();
    return this.save();
};

// Instance method to increment view count
truckAvailabilitySchema.methods.recordView = function () {
    this.viewCount += 1;
    return this.save();
};

// Instance method to increment contact count
truckAvailabilitySchema.methods.recordContact = function () {
    this.contactCount += 1;
    return this.save();
};

module.exports = mongoose.models.TruckAvailability || mongoose.model('TruckAvailability', truckAvailabilitySchema);
