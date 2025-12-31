const axios = require('axios');

const testAdminLogin = async () => {
    try {
        console.log('Testing admin login...\n');
        
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@goldtrack.pk',
            password: 'admin123'
        });

        console.log('✅ Login successful!');
        console.log('\nResponse:', JSON.stringify(response.data, null, 2));
        
        if (response.data.role === 'admin' || response.data.role === 'super_admin') {
            console.log('✅ Admin role confirmed!');
        }
    } catch (error) {
        console.error('❌ Login failed!');
        console.error('Status:', error.response?.status);
        console.error('Message:', error.response?.data?.message);
        console.error('Error:', error.message);
    }
};

testAdminLogin();
