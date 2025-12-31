const express = require('express');
const router = express.Router();
const {
    PAKISTANI_CITIES,
    PAKISTANI_VEHICLES,
    COMMON_ROUTES,
    LOAD_TYPES,
    CARGO_TYPES
} = require('../constants/pakistanData');

// GET /api/static/cities - Get all Pakistani cities
router.get('/cities', (req, res) => {
    try {
        const { query, majorOnly } = req.query;
        let cities = PAKISTANI_CITIES;

        if (majorOnly === 'true') {
            cities = cities.filter(c => c.major);
        }

        if (query) {
            cities = cities.filter(c =>
                c.name.toLowerCase().includes(query.toLowerCase())
            );
        }

        res.json(cities);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/static/vehicle-types - Get Pakistani vehicle types
router.get('/vehicle-types', (req, res) => {
    try {
        // Convert object to array for easier frontend consumption
        const vehiclesArray = Object.entries(PAKISTANI_VEHICLES).map(([key, value]) => ({
            id: key,
            ...value
        }));
        res.json(vehiclesArray);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/static/common-routes - Get common Pakistani routes
router.get('/common-routes', (req, res) => {
    try {
        res.json(COMMON_ROUTES);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/static/load-types - Get standard load types
router.get('/load-types', (req, res) => {
    try {
        const types = Object.entries(LOAD_TYPES).map(([key, value]) => ({
            id: key,
            label: value
        }));
        res.json(types);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// GET /api/static/cargo-types - Get common cargo types
router.get('/cargo-types', (req, res) => {
    try {
        res.json(CARGO_TYPES);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
