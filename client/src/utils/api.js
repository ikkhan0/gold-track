import axios from 'axios';

// Use same domain for API calls (no need for environment variable!)
// In production: /api → https://gold-track-flax.vercel.app/api
// In development: /api → proxied to localhost:5000 by Vite
const API_BASE_URL = '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
