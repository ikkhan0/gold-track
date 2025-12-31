const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: String,
        required: true,
        index: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    load: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Load'
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    attachments: [{
        url: String,
        type: String, // 'image', 'document'
        fileName: String
    }],
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

// Indexes for efficient queries
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ sender: 1, receiver: 1 });

// Generate conversation ID from two user IDs
messageSchema.statics.generateConversationId = function (userId1, userId2) {
    const ids = [userId1.toString(), userId2.toString()].sort();
    return ids.join('_');
};

module.exports = mongoose.model('Message', messageSchema);
