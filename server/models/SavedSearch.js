const mongoose = require('mongoose');

const savedSearchSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    filters: {
        origin: String,
        destination: String,
        deadheadRadius: { type: Number, default: 50 }, // miles
        vehicleType: String,
        minRate: Number,
        maxRate: Number,
        maxAge: Number, // minutes
        equipmentDetails: {
            removableGooseneck: Boolean,
            stepDeck: Boolean,
            temperatureControlled: Boolean,
            hazmat: Boolean,
            teamDriverRequired: Boolean
        }
    },
    isAlarmEnabled: {
        type: Boolean,
        default: false
    },
    alarmSettings: {
        emailNotification: { type: Boolean, default: true },
        pushNotification: { type: Boolean, default: true },
        frequency: {
            type: String,
            enum: ['instant', 'hourly', 'daily'],
            default: 'instant'
        }
    },
    lastRun: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

savedSearchSchema.index({ user: 1, createdAt: -1 });

savedSearchSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.models.SavedSearch || mongoose.model('SavedSearch', savedSearchSchema);
