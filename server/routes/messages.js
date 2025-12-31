const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/authMiddleware');
const { messageValidation } = require('../middleware/validator');
const { notifyNewMessage } = require('../utils/notificationHelper');

// POST /api/messages - Send a message
router.post('/', protect, messageValidation, async (req, res) => {
    try {
        const { receiverId, message, loadId, attachments } = req.body;

        const conversationId = Message.generateConversationId(req.user.id, receiverId);

        const newMessage = await Message.create({
            conversationId,
            sender: req.user.id,
            receiver: receiverId,
            load: loadId,
            message,
            attachments
        });

        const populatedMessage = await Message.findById(newMessage._id)
            .populate('sender', 'name companyName')
            .populate('receiver', 'name companyName')
            .populate('load', 'loadNumber origin destination');

        // Send notification
        await notifyNewMessage(receiverId, req.user.name);

        res.status(201).json({ message: 'Message sent successfully', data: populatedMessage });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/messages/conversation/:userId - Get conversation with a user
router.get('/conversation/:userId', protect, async (req, res) => {
    try {
        const { page = 1, limit = 50 } = req.query;
        const conversationId = Message.generateConversationId(req.user.id, req.params.userId);

        const messages = await Message.find({ conversationId })
            .populate('sender', 'name companyName')
            .populate('receiver', 'name companyName')
            .populate('load', 'loadNumber origin destination')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Message.countDocuments({ conversationId });

        // Mark messages from other user as read
        await Message.updateMany(
            { conversationId, receiver: req.user.id, isRead: false },
            { isRead: true }
        );

        res.json({
            messages: messages.reverse(), // Oldest first
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/messages/conversations - Get all conversations
router.get('/conversations', protect, async (req, res) => {
    try {
        // Get all unique conversation IDs for the user
        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: req.user._id },
                        { receiver: req.user._id }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: '$conversationId',
                    lastMessage: { $first: '$$ROOT' },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ['$receiver', req.user._id] },
                                        { $eq: ['$isRead', false] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $sort: { 'lastMessage.createdAt': -1 }
            }
        ]);

        // Populate user details
        await Message.populate(conversations, {
            path: 'lastMessage.sender lastMessage.receiver',
            select: 'name companyName'
        });

        // Format response
        const formattedConversations = conversations.map(conv => {
            const otherUser = conv.lastMessage.sender._id.equals(req.user._id)
                ? conv.lastMessage.receiver
                : conv.lastMessage.sender;

            return {
                conversationId: conv._id,
                otherUser,
                lastMessage: {
                    message: conv.lastMessage.message,
                    createdAt: conv.lastMessage.createdAt,
                    isRead: conv.lastMessage.isRead
                },
                unreadCount: conv.unreadCount
            };
        });

        res.json(formattedConversations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT /api/messages/:id/read - Mark message as read
router.put('/:id/read', protect, async (req, res) => {
    try {
        const message = await Message.findOne({
            _id: req.params.id,
            receiver: req.user.id
        });

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        message.isRead = true;
        await message.save();

        res.json({ message: 'Message marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
