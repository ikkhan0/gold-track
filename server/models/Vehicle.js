const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    type: {
        type: String,
        required: true,
        enum: ['Mazda', 'Shehzore', 'Flatbed', '10-Wheeler', '22-Wheeler', 'Suzuki', 'Container', 'Other']
    },

    regNumber: { type: String, required: true }, // e.g., LEC-1234
    capacity: { type: Number }, // In Tons
    driverName: { type: String },
    driverPhone: { type: String },

    status: { type: String, enum: ['Active', 'Maintenance', 'Busy'], default: 'Active' },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
