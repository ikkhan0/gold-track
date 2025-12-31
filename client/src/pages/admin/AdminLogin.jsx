import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await axios.post(`${API_URL}/auth/login`, formData);
            const data = response.data;
            const token = data.token;
            // Backend returns flat object or nested user object - handle both
            const user = data.user || data;

            console.log('Login Response:', { token, user }); // Debug log

            // Check if user is admin or super_admin
            if (user.role !== 'admin' && user.role !== 'super_admin') {
                setError('Access denied. Admin privileges required.');
                setLoading(false);
                return;
            }

            // Store token and user data
            localStorage.setItem('adminToken', token);
            localStorage.setItem('adminUser', JSON.stringify(user));

            // Navigate to admin dashboard
            navigate('/admin');
        } catch (err) {
            console.error('Login Error:', err);
            const status = err.response?.status || 'No Status';
            const serverMsg = err.response?.data?.message || 'No Message';
            const rawMsg = err.message || 'Unknown Error';

            setError(`DEBUG: Status ${status} | Server: ${serverMsg} | Raw: ${rawMsg}`);
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-wrapper">
            <div className="admin-login-container">
                <div className="admin-login-card">
                    <div className="admin-login-header">
                        <div className="admin-logo">
                            <span className="logo-icon">🔐</span>
                            <h1>GoldTrack Admin</h1>
                        </div>
                        <p className="admin-subtitle">Content Management System</p>
                    </div>

                    {error && (
                        <div className="admin-alert admin-alert-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="admin-login-form">
                        <div className="admin-form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="admin@goldtrack.pk"
                                required
                            />
                        </div>

                        <div className="admin-form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="admin-login-btn"
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="admin-login-footer">
                        <p className="admin-demo-text">Demo Credentials:</p>
                        <div className="demo-accounts">
                            <code>superadmin@goldtrack.pk / admin123</code>
                            <code>admin@goldtrack.pk / admin123</code>
                        </div>
                    </div>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Not an Administrator?</p>
                        <button
                            onClick={() => navigate('/login')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#16a34a',
                                fontWeight: '600',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            Go to Shipper/Carrier Login &rarr;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
