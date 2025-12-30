import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useI18n } from '../context/I18nContext';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const { t } = useI18n();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [role, setRole] = useState('Carrier');
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials and account approval status.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper bg-dark">
            <div className="login-card">
                <div className="login-header">
                    <h1 className="login-title">Welcome Back</h1>
                    <p className="login-subtitle">Sign in to your GoldTrack account</p>
                </div>

                <div className="login-role-selector">
                    <button
                        onClick={() => setRole('Carrier')}
                        className={`login-role-button ${role === 'Carrier' ? 'active' : ''}`}
                    >
                        🚛 Carrier
                    </button>
                    <button
                        onClick={() => setRole('Shipper')}
                        className={`login-role-button ${role === 'Shipper' ? 'active' : ''}`}
                    >
                        📦 Shipper
                    </button>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <Input
                        label="Email Address"
                        placeholder="name@example.com"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />

                    {error && <div className="login-error">{error}</div>}

                    <div className="login-options">
                        <label className="login-remember">
                            <input type="checkbox" />
                            <span>Remember me</span>
                        </label>
                        <a href="#" className="login-forgot-link">Forgot password?</a>
                    </div>

                    <Button variant="primary" style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }} isLoading={loading}>
                        Login as {role}
                    </Button>
                </form>

                <div className="login-divider">
                    <span>OR</span>
                </div>

                <div className="login-whatsapp-button">
                    <Button variant="secondary" style={{ width: '100%', padding: '0.875rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            📱 Login with WhatsApp
                        </span>
                    </Button>
                </div>

                <div className="login-footer">
                    Don't have an account? {' '}
                    <Link to="/register">Register Now</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
