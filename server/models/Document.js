const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'ownerModel',
        required: true
    },
    ownerModel: {
        type: String,
        required: true,
        enum: ['User', 'Vehicle']
    },
    type: {
        type: String,
        required: true,
        enum: [
            'cnic',
            'license',
            'vehicle_registration',
            'vehicle_insurance',
            'business_license',
            'ntn_certificate',
            'other'
        ]
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileType: {
        type: String // mime type
    },
    publicId: {
        type: String // Cloudinary public ID for deletion
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    verifiedAt: {
        type: Date
    },
    rejectionReason: {
        type: String
    },
    expiryDate: {
        type: Date
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes
documentSchema.index({ owner: 1, ownerModel: 1 });
documentSchema.index({ verificationStatus: 1 });

module.exports = mongoose.model('Document', documentSchema);
