const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Load = require('../models/Load');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { reviewValidation } = require('../middleware/validator');
const { notifyReviewReceived } = require('../utils/notificationHelper');

// POST /api/reviews - Create a review
router.post('/', protect, reviewValidation, async (req, res) => {
    try {
        const { loadId, revieweeId, rating, comment, punctuality, communication, professionalism } = req.body;

        // Check if load exists and is delivered
        const load = await Load.findById(loadId);
        if (!load) {
            return res.status(404).json({ message: 'Load not found' });
        }

        if (load.status !== 'Delivered') {
            return res.status(400).json({ message: 'Can only review completed loads' });
        }

        // Check if user is part of this load
        const isShipper = load.shipper.toString() === req.user.id;
        const isCarrier = load.assignedCarrier && load.assignedCarrier.toString() === req.user.id;

        if (!isShipper && !isCarrier) {
            return res.status(403).json({ message: 'You are not authorized to review this load' });
        }

        // Check if already reviewed
        const existingReview = await Review.findOne({ load: loadId, reviewer: req.user.id });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this load' });
        }

        // Determine review type
        const type = isShipper ? 'carrier_review' : 'shipper_review';

        // Create review
        const review = await Review.create({
            load: loadId,
            reviewer: req.user.id,
            reviewee: revieweeId,
            type,
            rating,
            comment,
            punctuality,
            communication,
            professionalism
        });

        // Update load review status
        if (isShipper) {
            load.isReviewedByShipper = true;
        } else {
            load.isReviewedByCarrier = true;
        }
        await load.save();

        // Update reviewee's rating
        await updateUserRating(revieweeId);

        // Send notification
        await notifyReviewReceived(revieweeId, req.user.name, rating);

        res.status(201).json({ message: 'Review submitted successfully', review });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/reviews/user/:id - Get reviews for a user
router.get('/user/:id', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const reviews = await Review.find({ reviewee: req.params.id })
            .populate('reviewer', 'name companyName')
            .populate('load', 'loadNumber origin destination')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Review.countDocuments({ reviewee: req.params.id });

        // Calculate average ratings
        const stats = await Review.aggregate([
            { $match: { reviewee: req.params.id } },
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: '$rating' },
                    avgPunctuality: { $avg: '$punctuality' },
                    avgCommunication: { $avg: '$communication' },
                    avgProfessionalism: { $avg: '$professionalism' },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            reviews,
            stats: stats[0] || { avgRating: 0, count: 0 },
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/reviews/load/:id - Get reviews for a load
router.get('/load/:id', async (req, res) => {
    try {
        const reviews = await Review.find({ load: req.params.id })
            .populate('reviewer', 'name companyName role')
            .populate('reviewee', 'name companyName role');

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT /api/reviews/:id - Update review (within 24 hours)
router.put('/:id', protect, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.reviewer.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Check if within 24 hours
        const hoursSinceCreation = (Date.now() - review.createdAt) / (1000 * 60 * 60);
        if (hoursSinceCreation > 24) {
            return res.status(400).json({ message: 'Reviews can only be edited within 24 hours' });
        }

        const { rating, comment, punctuality, communication, professionalism } = req.body;

        if (rating) review.rating = rating;
        if (comment !== undefined) review.comment = comment;
        if (punctuality) review.punctuality = punctuality;
        if (communication) review.communication = communication;
        if (professionalism) review.professionalism = professionalism;
        review.isEdited = true;

        await review.save();

        // Update reviewee's rating
        await updateUserRating(review.reviewee);

        res.json({ message: 'Review updated successfully', review });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Helper function to update user's average rating
async function updateUserRating(userId) {
    const stats = await Review.aggregate([
        { $match: { reviewee: userId } },
        { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    if (stats.length > 0) {
        await User.findByIdAndUpdate(userId, {
            rating: Math.round(stats[0].avgRating * 10) / 10,
            reviewCount: stats[0].count
        });
    }
}

module.exports = router;
