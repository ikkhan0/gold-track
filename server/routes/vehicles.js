const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const { protect } = require('../middleware/authMiddleware');

// Get my vehicles
router.get('/', protect, async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ owner: req.user.id });
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Add a vehicle
router.post('/', protect, async (req, res) => {
    if (req.user.role !== 'carrier') {
        return res.status(403).json({ message: 'Only carriers can add vehicles' });
    }

    try {
        const vehicle = await Vehicle.create({
            owner: req.user.id,
            ...req.body
        });
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(400).json({ message: 'Invalid vehicle data' });
    }
});

// Delete vehicle
router.delete('/:id', protect, async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

        if (vehicle.owner.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await vehicle.deleteOne();
        res.json({ message: 'Vehicle removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
