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

    bids: [{
        carrier: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        amount: Number,
        note: String,
        status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
        date: { type: Date, default: Date.now }
    }],

    pickupDate: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Load', loadSchema);
