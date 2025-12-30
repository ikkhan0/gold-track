import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useI18n } from '../context/I18nContext';
import { useAuth } from '../context/AuthContext';
import { PAKISTAN_CITIES } from '../constants/data';
import './Register.css';

const Register = () => {
    const { t } = useI18n();
    const { register } = useAuth();
    const navigate = useNavigate();
    const [role, setRole] = useState('Carrier');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '',
        cnic: '', city: '', address: '', companyName: '', ntn: '', licenseNumber: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            await register({
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                role,
                address: formData.address,
                city: formData.city,
                // Carrier/Owner Operator Specific
                cnic: (role === 'Carrier' || role === 'Owner Operator') ? formData.cnic : undefined,
                licenseNumber: (role === 'Carrier' || role === 'Owner Operator') ? formData.licenseNumber : undefined,
                // Shipper Specific
                companyName: role === 'Shipper' ? formData.companyName : undefined,
                ntn: role === 'Shipper' ? formData.ntn : undefined
            });
            setSuccessMsg("✅ Registration Successful! Your account is pending admin approval. You will be notified once active.");
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-wrapper bg-dark">
            <div className="register-card">
                <div className="register-header">
                    <h1 className="register-title">Join GoldTrack.pk</h1>
                    <p className="register-subtitle">Connect with Pakistan's most reliable logistics network</p>
                </div>

                {successMsg ? (
                    <div className="register-success animate-fade-in">
                        <svg className="success-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="success-title">Registration Submitted</h3>
                        <p className="success-message">{successMsg}</p>
                        <Button variant="outline" onClick={() => navigate('/login')}>Back to Login</Button>
                    </div>
                ) : (
                    <>
                        <div className="role-selector">
                            <button
                                onClick={() => setRole('Carrier')}
                                className={`role-button ${role === 'Carrier' ? 'active' : ''}`}
                            >
                                🚛 Carrier (Fleet Owner)
                            </button>
                            <button
                                onClick={() => setRole('Shipper')}
                                className={`role-button ${role === 'Shipper' ? 'active' : ''}`}
                            >
                                📦 Shipper / Broker
                            </button>
                            <button
                                onClick={() => setRole('Owner Operator')}
                                className={`role-button ${role === 'Owner Operator' ? 'active' : ''}`}
                            >
                                👤 Owner Operator
                            </button>
                        </div>

                        <form className="register-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <Input name="firstName" label="First Name" placeholder="Imran" onChange={handleChange} required />
                                <Input name="lastName" label="Last Name" placeholder="Khan" onChange={handleChange} required />
                            </div>

                            <Input name="phone" label="Mobile Number (WhatsApp)" placeholder="0300-1234567" onChange={handleChange} required />
                            <Input name="email" label="Email Address" type="email" placeholder="name@example.com" onChange={handleChange} required />

                            <div className="form-row">
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                                        City
                                    </label>
                                    <select
                                        name="city"
                                        onChange={handleChange}
                                        required
                                        style={{ width: '100%' }}
                                    >
                                        <option value="">Select City</option>
                                        {PAKISTAN_CITIES.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                                <Input name="address" label="Full Address" placeholder="Office / Depot Address" onChange={handleChange} required />
                            </div>

                            {(role === 'Carrier' || role === 'Owner Operator') && (
                                <div className="form-row">
                                    <Input name="cnic" label="CNIC Number" placeholder="35202-1234567-8" onChange={handleChange} required />
                                    <Input name="licenseNumber" label="Driving License No." placeholder="DL-123456" onChange={handleChange} required />
                                </div>
                            )}

                            {role === 'Shipper' && (
                                <div className="form-row">
                                    <Input name="companyName" label="Company Name" placeholder="e.g. Fast Logistics" onChange={handleChange} required />
                                    <Input name="ntn" label="NTN (Optional)" placeholder="1234567-8" onChange={handleChange} />
                                </div>
                            )}

                            <div className="form-row">
                                <Input name="password" label="Password" type="password" placeholder="••••••••" onChange={handleChange} required />
                                <Input name="confirmPassword" label="Confirm Password" type="password" placeholder="••••••••" onChange={handleChange} required />
                            </div>

                            <div className="form-checkbox-wrapper">
                                <input type="checkbox" className="form-checkbox" required />
                                <span className="form-checkbox-label">
                                    I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                                </span>
                            </div>

                            <Button variant="primary" style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }} isLoading={loading}>
                                Register as {role}
                            </Button>
                        </form>

                        <div className="register-footer">
                            Already have an account? {' '}
                            <Link to="/login">Login Here</Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Register;
