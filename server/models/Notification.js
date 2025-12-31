const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: [
            'bid_received',
            'bid_accepted',
            'bid_rejected',
            'load_assigned',
            'load_completed',
            'delivery_started',
            'new_message',
            'document_verified',
            'document_rejected',
            'review_received',
            'user_signup'
        ],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    metadata: {
        loadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Load' },
        bidId: String,
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
        reviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' }
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

// Index for faster queries
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
