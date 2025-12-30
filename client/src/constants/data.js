// Pakistan Logistics Data Constants

export const PAKISTAN_CITIES = [
    'Karachi',
    'Lahore',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Quetta',
    'Gujranwala',
    'Sialkot',
    'Hyderabad',
    'Sukkur',
    'Bahawalpur',
    'Sargodha',
    'Abbottabad',
    'Gwadar',
    'Sahiwal',
    'Rahim Yar Khan'
];

export const VEHICLE_TYPES = {
    lightCommercial: [
        { value: 'suzuki-pickup', label: 'Suzuki Pickup (1 Ton)', capacity: 1 },
        { value: 'shehzore', label: 'Hyundai Shehzore (3 Tons)', capacity: 3 },
        { value: 'faw-carrier', label: 'FAW Carrier', capacity: 2.5 }
    ],
    mediumDuty: [
        { value: 'mazda-t3500-open', label: 'Mazda T-3500 (Open)', capacity: 3.5 },
        { value: 'mazda-t3500-container', label: 'Mazda T-3500 (Container)', capacity: 3.5 },
        { value: 'container-17ft', label: '17ft Container', capacity: 5 },
        { value: 'container-20ft', label: '20ft Container (Home Moving)', capacity: 7 }
    ],
    heavyDuty: [
        { value: '10-wheeler-22ft', label: '22ft 10-Wheeler', capacity: 15 },
        { value: 'flatbed-40ft', label: '40ft Flatbed Trailer', capacity: 25 },
        { value: 'container-40ft', label: '40ft High-Cube Container', capacity: 28 },
        { value: 'lowbed-trailer', label: 'Low-Bed Trailer (Machinery)', capacity: 35 }
    ]
};

// Flatten all vehicles for dropdowns
export const ALL_VEHICLES = [
    ...VEHICLE_TYPES.lightCommercial,
    ...VEHICLE_TYPES.mediumDuty,
    ...VEHICLE_TYPES.heavyDuty
];

export const GOODS_TYPES = [
    { value: 'textiles', label: 'Textiles/Garments', icon: '👔' },
    { value: 'construction', label: 'Construction Material', icon: '🧱' },
    { value: 'fmcg', label: 'FMCG/Food', icon: '🛒' },
    { value: 'furniture', label: 'Furniture', icon: '🛋️' },
    { value: 'machinery', label: 'Heavy Machinery', icon: '⚙️' },
    { value: 'chemicals', label: 'Chemicals', icon: '🧪' },
    { value: 'auto-parts', label: 'Auto Parts', icon: '🔧' },
    { value: 'agriculture', label: 'Agriculture/Perishable', icon: '🌾' }
];

// How It Works Icons (using emoji for now, can replace with SVG icons)
export const HOW_IT_WORKS_STEPS = [
    {
        id: 1,
        title: 'Post Load',
        description: 'Share your shipment details in seconds',
        icon: '📦',
        iconName: 'box-plus'
    },
    {
        id: 2,
        title: 'Get Bids',
        description: 'Receive competitive quotes from verified carriers',
        icon: '💰',
        iconName: 'gavel'
    },
    {
        id: 3,
        title: 'Track',
        description: 'Real-time GPS tracking from pickup to delivery',
        icon: '📍',
        iconName: 'map-pin'
    },
    {
        id: 4,
        title: 'Pay Securely',
        description: 'Safe escrow payments in PKR',
        icon: '🛡️',
        iconName: 'shield-currency'
    }
];

// User Roles
export const USER_ROLES = {
    SHIPPER: 'Shipper',
    CARRIER: 'Carrier',
    ADMIN: 'Admin'
};

// Status Types
export const LOAD_STATUS = {
    PENDING: 'Pending',
    ACTIVE: 'Active',
    IN_TRANSIT: 'In Transit',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled'
};

export const USER_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
};

// Navigation Items
export const NAV_ITEMS = {
    public: [
        { label: 'Load Board', path: '/loads' },
        { label: 'Market Rates', path: '/market-rates' },
        { label: 'Carrier Services', path: '/services/carrier' },
        { label: 'Shipper Services', path: '/services/shipper' }
    ],
    services: [
        'Full Truckload (FTL)',
        'Part Load (LTL)',
        'Car Moving',
        'Packers & Movers',
        'Car Towing',
        'Container Transport'
    ]
};
