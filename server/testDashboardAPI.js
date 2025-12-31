#!/usr/bin/env node

/**
 * Dashboard API Testing Script
 * Tests all critical dashboard endpoints
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

// Test credentials (from seedAdminUsers.js)
const TEST_CREDENTIALS = {
    carrier: { email: 'test.carrier@goldtrack.pk', password: 'carrier123' },
    shipper: { email: 'test.shipper@goldtrack.pk', password: 'shipper123' },
    admin: { email: 'admin@goldtrack.pk', password: 'admin123' }
};

let tokens = {};

// Helper function for colored output
function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
    log(`✅ ${message}`, 'green');
}

function logError(message) {
    log(`❌ ${message}`, 'red');
}

function logInfo(message) {
    log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
    log(`⚠️  ${message}`, 'yellow');
}

// Test functions
async function testLogin(role) {
    try {
        logInfo(`Testing ${role} login...`);
        const response = await axios.post(`${BASE_URL}/auth/login`, TEST_CREDENTIALS[role]);
        
        if (response.data.token) {
            tokens[role] = response.data.token;
            logSuccess(`${role.toUpperCase()} login successful`);
            return true;
        } else {
            logError(`${role} login failed: No token received`);
            return false;
        }
    } catch (error) {
        logError(`${role} login failed: ${error.response?.data?.message || error.message}`);
        return false;
    }
}

async function testDashboardStats(role) {
    try {
        logInfo(`Testing ${role} dashboard stats...`);
        const response = await axios.get(`${BASE_URL}/dashboard/stats`, {
            headers: { Authorization: `Bearer ${tokens[role]}` }
        });
        
        const stats = response.data;
        
        if (role === 'carrier') {
            if (stats.hasOwnProperty('activeJobs') && 
                stats.hasOwnProperty('myTrucks') && 
                stats.hasOwnProperty('pendingBids') && 
                stats.hasOwnProperty('totalEarnings')) {
                logSuccess(`Carrier stats structure correct: ${JSON.stringify(stats)}`);
                return true;
            } else {
                logError(`Carrier stats structure incorrect: ${JSON.stringify(stats)}`);
                return false;
            }
        } else if (role === 'shipper') {
            if (stats.hasOwnProperty('activePostings') && 
                stats.hasOwnProperty('inProgress') && 
                stats.hasOwnProperty('bidsReceived') && 
                stats.hasOwnProperty('totalSpent')) {
                logSuccess(`Shipper stats structure correct: ${JSON.stringify(stats)}`);
                return true;
            } else {
                logError(`Shipper stats structure incorrect: ${JSON.stringify(stats)}`);
                return false;
            }
        }
    } catch (error) {
        logError(`Dashboard stats failed for ${role}: ${error.response?.data?.message || error.message}`);
        return false;
    }
}

async function testAdminRoutes() {
    try {
        logInfo('Testing admin routes...');
        
        // Test get users
        const usersResponse = await axios.get(`${BASE_URL}/admin/users`, {
            headers: { Authorization: `Bearer ${tokens.admin}` }
        });
        
        if (Array.isArray(usersResponse.data)) {
            logSuccess(`Admin can fetch users: ${usersResponse.data.length} users found`);
        } else {
            logError('Admin users response is not an array');
            return false;
        }
        
        // Test get CMS content
        try {
            const cmsResponse = await axios.get(`${BASE_URL}/admin/cms`, {
                headers: { Authorization: `Bearer ${tokens.admin}` }
            });
            
            if (Array.isArray(cmsResponse.data)) {
                logSuccess(`Admin can fetch CMS content: ${cmsResponse.data.length} items found`);
            } else {
                logSuccess('Admin CMS route works (no content yet)');
            }
        } catch (error) {
            if (error.response?.status === 404) {
                logWarning('CMS endpoint not found - may need seeding');
            } else {
                throw error;
            }
        }
        
        return true;
    } catch (error) {
        logError(`Admin routes failed: ${error.response?.data?.message || error.message}`);
        return false;
    }
}

async function testLoadEndpoints() {
    try {
        logInfo('Testing load endpoints...');
        
        // Test get loads (public)
        const loadsResponse = await axios.get(`${BASE_URL}/loads`);
        
        if (Array.isArray(loadsResponse.data)) {
            logSuccess(`Public loads endpoint works: ${loadsResponse.data.length} loads found`);
        } else {
            logError('Loads response is not an array');
            return false;
        }
        
        // Test get posted loads (shipper)
        if (tokens.shipper) {
            const postedLoadsResponse = await axios.get(`${BASE_URL}/loads/posted`, {
                headers: { Authorization: `Bearer ${tokens.shipper}` }
            });
            
            if (Array.isArray(postedLoadsResponse.data)) {
                logSuccess(`Shipper can fetch posted loads: ${postedLoadsResponse.data.length} loads`);
            } else {
                logError('Posted loads response is not an array');
                return false;
            }
        }
        
        return true;
    } catch (error) {
        logError(`Load endpoints failed: ${error.response?.data?.message || error.message}`);
        return false;
    }
}

// Main test runner
async function runTests() {
    log('\n' + '='.repeat(60), 'cyan');
    log('🧪 LoadBoard Dashboard API Testing', 'cyan');
    log('='.repeat(60) + '\n', 'cyan');
    
    let passed = 0;
    let failed = 0;
    
    // Test server is running
    try {
        await axios.get('http://localhost:5000');
        logSuccess('Backend server is running on http://localhost:5000\n');
    } catch (error) {
        logError('Backend server is not running! Start it with: node server.js\n');
        process.exit(1);
    }
    
    // Test logins
    log('\n📝 Testing Authentication:', 'yellow');
    log('-'.repeat(60), 'yellow');
    for (const role of ['carrier', 'shipper', 'admin']) {
        const result = await testLogin(role);
        result ? passed++ : failed++;
    }
    
    // Test dashboard stats
    log('\n📊 Testing Dashboard Stats:', 'yellow');
    log('-'.repeat(60), 'yellow');
    for (const role of ['carrier', 'shipper']) {
        if (tokens[role]) {
            const result = await testDashboardStats(role);
            result ? passed++ : failed++;
        } else {
            logWarning(`Skipping ${role} dashboard test (login failed)`);
        }
    }
    
    // Test admin routes
    log('\n👑 Testing Admin Routes:', 'yellow');
    log('-'.repeat(60), 'yellow');
    if (tokens.admin) {
        const result = await testAdminRoutes();
        result ? passed++ : failed++;
    } else {
        logWarning('Skipping admin tests (login failed)');
    }
    
    // Test load endpoints
    log('\n📦 Testing Load Endpoints:', 'yellow');
    log('-'.repeat(60), 'yellow');
    const loadResult = await testLoadEndpoints();
    loadResult ? passed++ : failed++;
    
    // Summary
    log('\n' + '='.repeat(60), 'cyan');
    log('📊 Test Summary', 'cyan');
    log('='.repeat(60), 'cyan');
    logSuccess(`Passed: ${passed} tests`);
    if (failed > 0) {
        logError(`Failed: ${failed} tests`);
    }
    log('');
    
    if (failed === 0) {
        logSuccess('🎉 All dashboard tests passed! Your dashboards are ready to use.');
        log('\nNext steps:', 'blue');
        log('1. Start frontend: cd client && npm run dev', 'blue');
        log('2. Login at http://localhost:5173/login', 'blue');
        log('3. Test dashboards at http://localhost:5173/dashboard', 'blue');
        log('4. Admin panel at http://localhost:5173/admin/login', 'blue');
    } else {
        logWarning('\n⚠️  Some tests failed. Check the errors above and fix them.');
    }
    
    log('\n');
}

// Run the tests
runTests().catch(error => {
    logError(`\nUnexpected error: ${error.message}`);
    process.exit(1);
});
