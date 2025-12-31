const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://localhost:5000/api';

// Test credentials - update with actual credentials
const CARRIER_TOKEN = '';  // Will get from login
const SHIPPER_TOKEN = '';  // Will get from login

const testResults = {
    passed: [],
    failed: []
};

// Login function to get tokens
async function login(email, password) {
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
        return response.data.token;
    } catch (error) {
        console.error(`❌ Login failed for ${email}:`, error.response?.data?.message || error.message);
        return null;
    }
}

// Test endpoint
async function testEndpoint(name, method, endpoint, token = null, data = null) {
    try {
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        let response;

        switch (method) {
            case 'GET':
                response = await axios.get(`${BASE_URL}${endpoint}`, config);
                break;
            case 'POST':
                response = await axios.post(`${BASE_URL}${endpoint}`, data, config);
                break;
            case 'PUT':
                response = await axios.put(`${BASE_URL}${endpoint}`, data, config);
                break;
            case 'DELETE':
                response = await axios.delete(`${BASE_URL}${endpoint}`, config);
                break;
        }

        testResults.passed.push(name);
        console.log(`✅ ${name} - Status: ${response.status}`);
        return response.data;
    } catch (error) {
        testResults.failed.push({ name, error: error.response?.data?.message || error.message, status: error.response?.status });
        console.error(`❌ ${name} - Status: ${error.response?.status || 'ERROR'} - ${error.response?.data?.message || error.message}`);
        return null;
    }
}

async function runTests() {
    console.log('\n🔍 TESTING DASHBOARD BACKEND ENDPOINTS\n');
    console.log('=' .repeat(60));

    // First, let's test basic connectivity
    console.log('\n📡 Testing Server Connectivity...\n');
    await testEndpoint('Server Health Check', 'GET', '/');

    // Test authentication endpoints
    console.log('\n🔐 Testing Authentication Endpoints...\n');
    
    // Login as carrier
    console.log('Attempting carrier login...');
    const carrierToken = await login('carrier@example.com', '123456');
    
    // Login as shipper
    console.log('Attempting shipper login...');
    const shipperToken = await login('shipper@example.com', '123456');

    // Test carrier endpoints
    if (carrierToken) {
        console.log('\n🚛 Testing Carrier Endpoints...\n');
        
        await testEndpoint('Get All Loads', 'GET', '/loads', carrierToken);
        await testEndpoint('Get Carrier Stats', 'GET', '/dashboard/stats', carrierToken);
        await testEndpoint('Get My Vehicles', 'GET', '/vehicles', carrierToken);
        await testEndpoint('Get My Bidded Loads', 'GET', '/loads/bidded', carrierToken);
        await testEndpoint('Search Trucks (should fail for carrier)', 'GET', '/trucks/search', carrierToken);
        await testEndpoint('Get My Truck Postings', 'GET', '/trucks/my-postings', carrierToken);
    }

    // Test shipper endpoints
    if (shipperToken) {
        console.log('\n📦 Testing Shipper Endpoints...\n');
        
        await testEndpoint('Get My Posted Loads', 'GET', '/loads/posted', shipperToken);
        await testEndpoint('Get Shipper Stats', 'GET', '/dashboard/stats', shipperToken);
        await testEndpoint('Search Available Trucks', 'GET', '/trucks/search?currentLocation=Karachi', shipperToken);
        await testEndpoint('Get All Loads (shipper)', 'GET', '/loads', shipperToken);
    }

    // Test public endpoints
    console.log('\n🌍 Testing Public Endpoints...\n');
    await testEndpoint('Get All Loads (public)', 'GET', '/loads');
    await testEndpoint('Get Static Data - Cities', 'GET', '/static-data/cities');
    await testEndpoint('Get Static Data - Vehicles', 'GET', '/static-data/vehicles');

    // Test admin endpoints (need admin token)
    console.log('\n👑 Testing Admin Endpoints...\n');
    const adminToken = await login('admin@goldtrack.pk', 'admin123');
    
    if (adminToken) {
        await testEndpoint('Get All Users (Admin)', 'GET', '/admin/users', adminToken);
        await testEndpoint('Get All Loads (Admin)', 'GET', '/admin/loads', adminToken);
        await testEndpoint('Get All Trucks (Admin)', 'GET', '/admin/trucks', adminToken);
        await testEndpoint('Get CMS Content (Admin)', 'GET', '/admin/cms', adminToken);
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('\n📊 TEST SUMMARY\n');
    console.log(`✅ Passed: ${testResults.passed.length}`);
    console.log(`❌ Failed: ${testResults.failed.length}`);
    
    if (testResults.failed.length > 0) {
        console.log('\n❌ Failed Tests:\n');
        testResults.failed.forEach(({ name, error, status }) => {
            console.log(`  • ${name} (Status: ${status})`);
            console.log(`    Error: ${error}\n`);
        });
    }

    console.log('=' .repeat(60));
}

// Run tests
runTests().catch(console.error);
