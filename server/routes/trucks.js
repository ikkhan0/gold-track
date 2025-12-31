const express = require('express');
const router = express.Router();
const TruckAvailability = require('../models/TruckAvailability');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const { protect, authorize } = require('../middleware/authMiddleware');

// POST /api/trucks/availability - Post available truck (Carriers only)
router.post('/availability', protect, authorize('carrier'), async (req, res) => {
    try {
        const {
            truck,
            currentLocation,
            currentLocationCoords,
            destination,
            destinationCoords,
            availableDate,
            deadheadOriginRadius,
            deadheadDestinationRadius,
            loadType,
            equipmentType,
            maxLength,
            maxWeight,
            specialFeatures,
            expectedRatePerKM,
            minimumRate,
            contactMethod,
            notes,
            openToBackhaul,
            expiresAt
        } = req.body;

        // Verify truck belongs to user
        const vehicleExists = await Vehicle.findOne({
            _id: truck,
            owner: req.user.id
        });

        if (!vehicleExists) {
            return res.status(404).json({ message: 'Truck not found or you do not own this vehicle' });
        }

        // Check if truck already has active posting
        const existingPosting = await TruckAvailability.findOne({
            truck,
            isAvailable: true,
            status: 'Available'
        });

        if (existingPosting) {
            return res.status(400).json({
                message: 'This truck already has an active availability posting',
                existingPosting
            });
        }

        const truckAvailability = await TruckAvailability.create({
            carrier: req.user.id,
            truck,
            currentLocation,
            currentLocationCoords,
            destination,
            destinationCoords,
            availableDate: availableDate || Date.now(),
            deadheadOriginRadius,
            deadheadDestinationRadius,
            loadType,
            equipmentType,
            maxLength,
            maxWeight,
            specialFeatures,
            expectedRatePerKM,
            minimumRate,
            contactMethod,
            notes,
            openToBackhaul,
            expiresAt
        });

        const populated = await TruckAvailability.findById(truckAvailability._id)
            .populate('truck', 'vehicleType registrationNumber capacity');

        res.status(201).json({
            message: 'Truck availability posted successfully',
            availability: populated
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/trucks/search - Search available trucks (Brokers/Shippers)
router.get('/search', protect, async (req, res) => {
    try {
        const {
            currentLocation,
            destination,
            equipmentType,
            availableDate,
            loadType,
            minWeight,
            minLength,
            maxAge, // in minutes
            deadheadOrigin,
            deadheadDestination
        } = req.query;

        const filters = {
            currentLocation,
            destination,
            equipmentType,
            availableDate,
            loadType,
            minWeight: minWeight ? parseInt(minWeight) : undefined,
            minLength: minLength ? parseInt(minLength) : undefined,
            maxAge: maxAge ? parseInt(maxAge) : undefined
        };

        let trucks = await TruckAvailability.searchTrucks(filters);

        // Categorize as exact or similar matches
        const exactMatches = [];
        const similarMatches = [];

        trucks.forEach(truck => {
            const isExactMatch =
                (!currentLocation || truck.currentLocation.toLowerCase().includes(currentLocation.toLowerCase())) &&
                (!equipmentType || truck.equipmentType === equipmentType || equipmentType === 'Any');

            if (isExactMatch) {
                exactMatches.push(truck);
            } else {
                similarMatches.push(truck);
            }
        });

        res.json({
            exactMatches,
            similarMatches,
            total: trucks.length,
            filters: req.query
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/trucks/availability/my-postings - Get carrier's own postings
router.get('/availability/my-postings', protect, authorize('carrier'), async (req, res) => {
    try {
        const { status } = req.query;

        const query = { carrier: req.user.id };
        if (status) {
            query.status = status;
        }

        const postings = await TruckAvailability.find(query)
            .populate('truck', 'vehicleType registrationNumber capacity')
            .populate('bookedBy', 'name companyName')
            .populate('bookedLoad', 'origin destination offerPrice')
            .sort({ createdAt: -1 });

        res.json(postings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/trucks/availability/:id - Get specific availability details
router.get('/availability/:id', protect, async (req, res) => {
    try {
        const availability = await TruckAvailability.findById(req.params.id)
            .populate('carrier', 'name companyName phone whatsapp creditScore daysToPayAverage rating reviewCount verificationBadges')
            .populate('truck', 'vehicleType registrationNumber capacity features')
            .populate('bookedBy', 'name companyName')
            .populate('bookedLoad', 'origin destination offerPrice');

        if (!availability) {
            return res.status(404).json({ message: 'Truck availability not found' });
        }

        // Record view (don't count owner views)
        if (availability.carrier._id.toString() !== req.user.id) {
            await availability.recordView();
        }

        res.json(availability);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// PUT /api/trucks/availability/:id - Update availability
router.put('/availability/:id', protect, authorize('carrier'), async (req, res) => {
    try {
        const availability = await TruckAvailability.findOne({
            _id: req.params.id,
            carrier: req.user.id
        });

        if (!availability) {
            return res.status(404).json({ message: 'Availability not found or unauthorized' });
        }

        const allowedUpdates = [
            'currentLocation',
            'currentLocationCoords',
            'destination',
            'destinationCoords',
            'availableDate',
            'deadheadOriginRadius',
            'deadheadDestinationRadius',
            'loadType',
            'expectedRatePerKM',
            'minimumRate',
            'contactMethod',
            'notes',
            'openToBackhaul',
            'isAvailable',
            'expiresAt'
        ];

        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                availability[field] = req.body[field];
            }
        });

        await availability.save();

        const updated = await TruckAvailability.findById(availability._id)
            .populate('truck', 'vehicleType registrationNumber capacity');

        res.json({ message: 'Availability updated successfully', availability: updated });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// DELETE /api/trucks/availability/:id - Remove availability posting
router.delete('/availability/:id', protect, authorize('carrier'), async (req, res) => {
    try {
        const availability = await TruckAvailability.findOne({
            _id: req.params.id,
            carrier: req.user.id
        });

        if (!availability) {
            return res.status(404).json({ message: 'Availability not found or unauthorized' });
        }

        await availability.deleteOne();
        res.json({ message: 'Availability posting removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/trucks/availability/:id/contact - Record contact attempt
router.post('/availability/:id/contact', protect, async (req, res) => {
    try {
        const availability = await TruckAvailability.findById(req.params.id);

        if (!availability) {
            return res.status(404).json({ message: 'Availability not found' });
        }

        await availability.recordContact();

        res.json({ message: 'Contact recorded', contactCount: availability.contactCount });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/trucks/availability/:id/book - Book a truck
router.post('/availability/:id/book', protect, authorize('shipper', 'broker'), async (req, res) => {
    try {
        const { loadId } = req.body;

        const availability = await TruckAvailability.findById(req.params.id);

        if (!availability) {
            return res.status(404).json({ message: 'Availability not found' });
        }

        if (!availability.isAvailable || availability.status !== 'Available') {
            return res.status(400).json({ message: 'Truck is no longer available' });
        }

        await availability.markAsBooked(loadId, req.user.id);

        res.json({
            message: 'Truck booked successfully',
            availability
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST /api/trucks/expire-old - Cron job endpoint to expire old postings
router.post('/expire-old', async (req, res) => {
    try {
        const result = await TruckAvailability.expireOldPostings();
        res.json({
            message: 'Old postings expired',
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
