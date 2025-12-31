// Pakistani Market Data - Cities, Routes, and Vehicle Types

// Major Pakistani Cities
const PAKISTANI_CITIES = [
    // Punjab
    { name: 'Karachi', province: 'Sindh', major: true },
    { name: 'Lahore', province: 'Punjab', major: true },
    { name: 'Faisalabad', province: 'Punjab', major: true },
    { name: 'Rawalpindi', province: 'Punjab', major: true },
    { name: 'Multan', province: 'Punjab', major: true },
    { name: 'Gujranwala', province: 'Punjab', major: true },
    { name: 'Sialkot', province: 'Punjab', major: true },
    { name: 'Sargodha', province: 'Punjab', major: false },
    { name: 'Bahawalpur', province: 'Punjab', major: false },
    { name: 'Sahiwal', province: 'Punjab', major: false },
    { name: 'Jhang', province: 'Punjab', major: false },
    { name: 'Sheikhupura', province: 'Punjab', major: false },
    { name: 'Gujrat', province: 'Punjab', major: false },
    { name: 'Kasur', province: 'Punjab', major: false },
    { name: 'Rahim Yar Khan', province: 'Punjab', major: false },
    { name: 'Okara', province: 'Punjab', major: false },
    { name: 'Mandi Bahauddin', province: 'Punjab', major: false },
    { name: 'Jhelum', province: 'Punjab', major: false },
    { name: 'Chiniot', province: 'Punjab', major: false },

    // Sindh
    { name: 'Hyderabad', province: 'Sindh', major: true },
    { name: 'Sukkur', province: 'Sindh', major: false },
    { name: 'Larkana', province: 'Sindh', major: false },
    { name: 'Nawabshah', province: 'Sindh', major: false },
    { name: 'Mirpur Khas', province: 'Sindh', major: false },
    { name: 'Jacobabad', province: 'Sindh', major: false },
    { name: 'Shikarpur', province: 'Sindh', major: false },
    { name: 'Dadu', province: 'Sindh', major: false },

    // Khyber Pakhtunkhwa
    { name: 'Islamabad', province: 'Federal Capital', major: true },
    { name: 'Peshawar', province: 'Khyber Pakhtunkhwa', major: true },
    { name: 'Abbottabad', province: 'Khyber Pakhtunkhwa', major: false },
    { name: 'Mardan', province: 'Khyber Pakhtunkhwa', major: false },
    { name: 'Mingora', province: 'Khyber Pakhtunkhwa', major: false },
    { name: 'Kohat', province: 'Khyber Pakhtunkhwa', major: false },
    { name: 'Mansehra', province: 'Khyber Pakhtunkhwa', major: false },

    // Balochistan
    { name: 'Quetta', province: 'Balochistan', major: true },
    { name: 'Gwadar', province: 'Balochistan', major: false },
    { name: 'Turbat', province: 'Balochistan', major: false },
    { name: 'Hub', province: 'Balochistan', major: false },

    // AJK & Gilgit-Baltistan
    { name: 'Muzaffarabad', province: 'AJK', major: false },
    { name: 'Gilgit', province: 'Gilgit-Baltistan', major: false }
];

// Pakistani Vehicle Types
const PAKISTANI_VEHICLES = {
    // Light Commercial Vehicles
    SUZUKI: {
        name: 'Suzuki Pickup',
        capacity: '750 kg',
        typicalUse: 'Light cargo, city delivery',
        avgRate: 'Rs 15-25k',
        icon: '🚙'
    },
    MAZDA: {
        name: 'Mazda',
        capacity: '1-1.5 tons',
        typicalUse: 'Small goods, inter-city',
        avgRate: 'Rs 25-40k',
        icon: '🚚'
    },
    SHEHZORE: {
        name: 'Shehzore',
        capacity: '1.5-2 tons',
        typicalUse: 'General cargo, construction materials',
        avgRate: 'Rs 30-50k',
        icon: '🚛'
    },

    // Medium Commercial Vehicles
    '10_WHEELER': {
        name: '10-Wheeler',
        capacity: '10-15 tons',
        typicalUse: 'Heavy cargo, long-haul',
        avgRate: 'Rs 80-120k',
        icon: '🚛'
    },
    '6_WHEELER': {
        name: '6-Wheeler',
        capacity: '5-8 tons',
        typicalUse: 'Medium cargo, regional transport',
        avgRate: 'Rs 50-70k',
        icon: '🚚'
    },

    // Heavy Commercial Vehicles
    '22_WHEELER': {
        name: '22-Wheeler',
        capacity: '20-40 tons',
        typicalUse: 'Containers, bulk cargo, heavy machinery',
        avgRate: 'Rs 150-250k',
        icon: '🚛'
    },
    TRAILER_40FT: {
        name: '40ft Trailer',
        capacity: '25-30 tons',
        typicalUse: 'Container transport, import/export',
        avgRate: 'Rs 180-280k',
        icon: '🚛'
    },
    TRAILER_20FT: {
        name: '20ft Trailer',
        capacity: '15-20 tons',
        typicalUse: 'Container transport',
        avgRate: 'Rs 120-180k',
        icon: '🚛'
    },

    // Specialized Vehicles
    FLATBED: {
        name: 'Flatbed',
        capacity: 'Varies (5-30 tons)',
        typicalUse: 'Construction materials, machinery, odd-sized cargo',
        avgRate: 'Rs 60-200k',
        icon: '🚛'
    },
    REFRIGERATED: {
        name: 'Refrigerated Van',
        capacity: '5-15 tons',
        typicalUse: 'Perishable goods, pharmaceuticals',
        avgRate: 'Rs 100-180k',
        icon: '🚐'
    },
    TANKER: {
        name: 'Tanker',
        capacity: '10,000-30,000 liters',
        typicalUse: 'Liquid cargo, fuel, chemicals',
        avgRate: 'Rs 120-200k',
        icon: '🚛'
    },

    // Any Vehicle
    ANY: {
        name: 'Any Vehicle',
        capacity: 'Not specified',
        typicalUse: 'Flexible requirement',
        avgRate: 'Varies',
        icon: '🚚'
    }
};

// Common Pakistani Routes with Approximate Distances (in KM)
const COMMON_ROUTES = [
    // Major North-South Routes
    { origin: 'Karachi', destination: 'Lahore', distance: 1210, highway: 'M9, M2', avgTime: '12-14 hours' },
    { origin: 'Karachi', destination: 'Islamabad', distance: 1400, highway: 'M9, M2', avgTime: '14-16 hours' },
    { origin: 'Karachi', destination: 'Peshawar', distance: 1580, highway: 'M9, M1', avgTime: '16-18 hours' },
    { origin: 'Karachi', destination: 'Rawalpindi', distance: 1380, highway: 'M9, M2', avgTime: '14-16 hours' },
    { origin: 'Karachi', destination: 'Faisalabad', distance: 1050, highway: 'M9, M3, M4', avgTime: '11-13 hours' },
    { origin: 'Karachi', destination: 'Multan', distance: 880, highway: 'M9, M5', avgTime: '9-11 hours' },
    { origin: 'Karachi', destination: 'Quetta', distance: 680, highway: 'N25', avgTime: '8-10 hours' },

    // Punjab Internal Routes
    { origin: 'Lahore', destination: 'Islamabad', distance: 375, highway: 'M2', avgTime: '4-5 hours' },
    { origin: 'Lahore', destination: 'Faisalabad', distance: 130, highway: 'M3', avgTime: '2-3 hours' },
    { origin: 'Lahore', destination: 'Multan', distance: 340, highway: 'M4', avgTime: '4-5 hours' },
    { origin: 'Lahore', destination: 'Sialkot', distance: 125, highway: 'GT Road', avgTime: '2-3 hours' },
    { origin: 'Lahore', destination: 'Gujranwala', distance: 80, highway: 'GT Road', avgTime: '1-2 hours' },

    { origin: 'Islamabad', destination: 'Peshawar', distance: 180, highway: 'M1', avgTime: '2-3 hours' },
    { origin: 'Faisalabad', destination: 'Multan', distance: 260, highway: 'M4', avgTime: '3-4 hours' },
    { origin: 'Rawalpindi', destination: 'Peshawar', distance: 170, highway: 'M1', avgTime: '2-3 hours' },

    // Sindh Internal Routes
    { origin: 'Karachi', destination: 'Hyderabad', distance: 165, highway: 'M9', avgTime: '2-3 hours' },
    { origin: 'Karachi', destination: 'Sukkur', distance: 470, highway: 'M9', avgTime: '5-6 hours' },
    { origin: 'Hyderabad', destination: 'Sukkur', distance: 310, highway: 'N5', avgTime: '4-5 hours' },

    // Port & Trade Routes
    { origin: 'Port Qasim', destination: 'Lahore', distance: 1230, highway: 'M9, M2', avgTime: '12-14 hours' },
    { origin: 'Gwadar', destination: 'Karachi', distance: 650, highway: 'Coastal Highway', avgTime: '8-10 hours' },
    { origin: 'Hub', destination: 'Karachi', distance: 45, highway: 'RCD Highway', avgTime: '1 hour' }
];

// Load Types Common in Pakistan
const LOAD_TYPES = {
    FULL: 'Full Truck Load (FTL)',
    PARTIAL: 'Less Than Truck Load (LTL)',
    EXPRESS: 'Express/Urgent',
    BACKHAUL: 'Backhaul/Return Load'
};

// Common Cargo Types in Pakistan
const CARGO_TYPES = [
    'General Cargo',
    'Construction Materials',
    'FMCG (Fast Moving Consumer Goods)',
    'Electronics',
    'Textiles & Garments',
    'Agricultural Produce',
    'Furniture',
    'Machinery & Equipment',
    'Pharmaceuticals',
    'Chemicals',
    'Steel & Metal',
    'Cement',
    'Rice & Grains',
    'Fruits & Vegetables',
    'Livestock',
    'Petroleum Products',
    'Containers (Import/Export)',
    'Household Items',
    'Auto Parts',
    'Plastics'
];

// Helper function to get city names for autocomplete
const getCityNames = () => PAKISTANI_CITIES.map(city => city.name);

// Helper function to get major cities only
const getMajorCities = () => PAKISTANI_CITIES.filter(city => city.major);

// Helper function to get vehicle types array
const getVehicleTypes = () => Object.keys(PAKISTANI_VEHICLES);

// Helper function to calculate estimated time based on distance
const estimateTime = (distanceKM) => {
    const avgSpeed = 60; // Average speed including stops
    const hours = Math.ceil(distanceKM / avgSpeed);
    return `${hours} hours`;
};

// Helper function to find route info
const getRouteInfo = (origin, destination) => {
    return COMMON_ROUTES.find(
        route =>
            (route.origin.toLowerCase().includes(origin.toLowerCase()) &&
                route.destination.toLowerCase().includes(destination.toLowerCase())) ||
            (route.destination.toLowerCase().includes(origin.toLowerCase()) &&
                route.origin.toLowerCase().includes(destination.toLowerCase()))
    );
};

module.exports = {
    PAKISTANI_CITIES,
    PAKISTANI_VEHICLES,
    COMMON_ROUTES,
    LOAD_TYPES,
    CARGO_TYPES,
    getCityNames,
    getMajorCities,
    getVehicleTypes,
    estimateTime,
    getRouteInfo
};
