const { body, param, query, validationResult } = require('express-validator');

// Validation result checker middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// User Registration Validation
const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('role').isIn(['shipper', 'broker', 'carrier', 'fleet_owner', 'owner_operator'])
        .withMessage('Invalid role'),
    validate
];

// Login Validation
const loginValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
];

// Load Creation Validation
const createLoadValidation = [
    body('origin').trim().notEmpty().withMessage('Origin is required'),
    body('destination').trim().notEmpty().withMessage('Destination is required'),
    body('goodsType').trim().notEmpty().withMessage('Goods type is required'),
    body('weight').isNumeric().withMessage('Weight must be a number'),
    body('requiredVehicle').optional().isIn(['Mazda', 'Shehzore', 'Flatbed', '10-Wheeler', '22-Wheeler', 'Suzuki', 'Any'])
        .withMessage('Invalid vehicle type'),
    body('pickupDate').optional().isISO8601().withMessage('Invalid pickup date'),
    validate
];

// Bid Validation
const bidValidation = [
    body('amount').isNumeric().withMessage('Bid amount must be a number'),
    body('note').optional().trim(),
    validate
];

// Vehicle Creation Validation
const createVehicleValidation = [
    body('type').isIn(['Mazda', 'Shehzore', 'Flatbed', '10-Wheeler', '22-Wheeler', 'Suzuki', 'Container', 'Other'])
        .withMessage('Invalid vehicle type'),
    body('regNumber').trim().notEmpty().withMessage('Registration number is required'),
    body('capacity').optional().isNumeric().withMessage('Capacity must be a number'),
    body('driverName').optional().trim(),
    body('driverPhone').optional().trim(),
    validate
];

// Review Validation
const reviewValidation = [
    body('loadId').notEmpty().withMessage('Load ID is required'),
    body('revieweeId').notEmpty().withMessage('Reviewee ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().trim(),
    validate
];

// Message Validation
const messageValidation = [
    body('receiverId').notEmpty().withMessage('Receiver ID is required'),
    body('message').trim().notEmpty().withMessage('Message cannot be empty'),
    body('loadId').optional(),
    validate
];

// Admin User Update Validation
const updateUserValidation = [
    body('name').optional().trim(),
    body('email').optional().isEmail().withMessage('Valid email required'),
    body('phone').optional().trim(),
    body('role').optional().isIn(['super_admin', 'admin', 'shipper', 'broker', 'carrier', 'fleet_owner', 'owner_operator']),
    body('status').optional().isIn(['pending', 'approved', 'rejected', 'suspended']),
    validate
];

module.exports = {
    validate,
    registerValidation,
    loginValidation,
    createLoadValidation,
    bidValidation,
    createVehicleValidation,
    reviewValidation,
    messageValidation,
    updateUserValidation
};
