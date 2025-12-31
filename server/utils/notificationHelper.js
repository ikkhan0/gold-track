const Notification = require('../models/Notification');
const nodemailer = require('nodemailer');

// Email transporter configuration
let transporter = null;
if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
}

/**
 * Create a notification
 * @param {ObjectId} userId - User to notify
 * @param {String} type - Notification type
 * @param {String} title - Notification title
 * @param {String} message - Notification message
 * @param {Object} metadata - Additional metadata
 */
const createNotification = async (userId, type, title, message, metadata = {}) => {
    try {
        const notification = await Notification.create({
            user: userId,
            type,
            title,
            message,
            metadata
        });
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        return null;
    }
};

/**
 * Send email notification
 * @param {String} to - Recipient email
 * @param {String} subject - Email subject
 * @param {String} text - Plain text content
 * @param {String} html - HTML content
 */
const sendEmail = async (to, subject, text, html) => {
    if (!transporter) {
        console.log('Email not configured');
        return false;
    }

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to,
            subject,
            text,
            html
        });
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

/**
 * Notify about new bid
 */
const notifyBidReceived = async (shipperId, carrierName, loadId, amount) => {
    const title = 'New Bid Received';
    const message = `${carrierName} placed a bid of Rs ${amount.toLocaleString()} on your load`;

    await createNotification(shipperId, 'bid_received', title, message, {
        loadId,
        amount
    });
};

/**
 * Notify about bid acceptance
 */
const notifyBidAccepted = async (carrierId, shipperName, loadId) => {
    const title = 'Bid Accepted!';
    const message = `Congratulations! ${shipperName} accepted your bid`;

    await createNotification(carrierId, 'bid_accepted', title, message, {
        loadId
    });
};

/**
 * Notify about bid rejection
 */
const notifyBidRejected = async (carrierId, loadId) => {
    const title = 'Bid Not Selected';
    const message = `Your bid was not selected for this load`;

    await createNotification(carrierId, 'bid_rejected', title, message, {
        loadId
    });
};

/**
 * Notify about load assignment
 */
const notifyLoadAssigned = async (carrierId, loadNumber, origin, destination) => {
    const title = 'Load Assigned';
    const message = `Load ${loadNumber} (${origin} → ${destination}) has been assigned to you`;

    await createNotification(carrierId, 'load_assigned', title, message);
};

/**
 * Notify about delivery completion
 */
const notifyDeliveryCompleted = async (shipperId, loadNumber) => {
    const title = 'Delivery Completed';
    const message = `Load ${loadNumber} has been marked as delivered`;

    await createNotification(shipperId, 'load_completed', title, message);
};

/**
 * Notify about new message
 */
const notifyNewMessage = async (receiverId, senderName) => {
    const title = 'New Message';
    const message = `${senderName} sent you a message`;

    await createNotification(receiverId, 'new_message', title, message);
};

/**
 * Notify about document verification
 */
const notifyDocumentVerified = async (userId, documentType) => {
    const title = 'Document Verified';
    const message = `Your ${documentType} has been verified`;

    await createNotification(userId, 'document_verified', title, message);
};

/**
 * Notify about document rejection
 */
const notifyDocumentRejected = async (userId, documentType, reason) => {
    const title = 'Document Rejected';
    const message = `Your ${documentType} was rejected. Reason: ${reason}`;

    await createNotification(userId, 'document_rejected', title, message);
};

/**
 * Notify about new review
 */
const notifyReviewReceived = async (userId, reviewerName, rating) => {
    const title = 'New Review Received';
    const message = `${reviewerName} left you a ${rating}-star review`;

    await createNotification(userId, 'review_received', title, message);
};

/**
 * Notify all admins about new user signup (for approval)
 */
const notifyAdminsNewUserSignup = async (userName, userEmail, userRole) => {
    const User = require('../models/User');

    try {
        // Find all super_admins and admins
        const admins = await User.find({
            role: { $in: ['super_admin', 'admin'] }
        });

        const title = '🆕 New User Registration';
        const message = `${userName} (${userRole}) has signed up with email ${userEmail}. Please review and approve.`;

        // Create notification for each admin
        for (const admin of admins) {
            await createNotification(admin._id, 'user_signup', title, message, {
                userName,
                userEmail,
                userRole
            });
        }

        console.log(`[Notifications] Sent signup notification to ${admins.length} admins`);
        return true;
    } catch (error) {
        console.error('Error notifying admins of new signup:', error);
        return false;
    }
};

module.exports = {
    createNotification,
    sendEmail,
    notifyBidReceived,
    notifyBidAccepted,
    notifyBidRejected,
    notifyLoadAssigned,
    notifyDeliveryCompleted,
    notifyNewMessage,
    notifyDocumentVerified,
    notifyDocumentRejected,
    notifyReviewReceived,
    notifyAdminsNewUserSignup
};
