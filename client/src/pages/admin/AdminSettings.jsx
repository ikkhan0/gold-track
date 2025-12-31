import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../utils/api';
import { Settings as SettingsIcon, User, Shield, Bell, Database, Globe, Phone, Mail, Building, DollarSign } from 'lucide-react';
import './AdminSettings.css';

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState('company');
    const [settings, setSettings] = useState({
        companyName: '',
        companyPhone: '',
        companyWhatsApp: '',
        companyEmail: '',
        companyAddress: '',
        supportPhone: '',
        businessHours: '',
        facebook: '',
        instagram: '',
        linkedin: '',
        twitter: '',
        enableBidding: true,
        enableDirectContact: true,
        requireApprovalForPosts: false,
        autoExpireLoadsAfterDays: 30,
        goldSubscriptionMonthly: 5000,
        goldSubscriptionYearly: 50000,
        premiumSubscriptionMonthly: 10000,
        premiumSubscriptionYearly: 100000
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [adminProfile, setAdminProfile] = useState(null);

    useEffect(() => {
        fetchAdminProfile();
        fetchSettings();
    }, []);

    const fetchAdminProfile = () => {
        const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
        setAdminProfile(user);
    };

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await api.get('/settings');
            if (response.data) {
                setSettings(prevSettings => ({ ...prevSettings, ...response.data }));
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        try {
            await api.put('/settings', settings);
            alert('Settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings: ' + (error.response?.data?.message || error.message));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="admin-settings">
            <div className="page-header">
                <h1>System Settings</h1>
                <p>Configure platform settings and preferences</p>
            </div>

            <div className="settings-container">
                {/* Settings Tabs */}
                <div className="settings-sidebar">
                    <button
                        className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <User size={20} />
                        <span>Profile</span>
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'company' ? 'active' : ''}`}
                        onClick={() => setActiveTab('company')}
                    >
                        <Building size={20} />
                        <span>Company Info</span>
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'features' ? 'active' : ''}`}
                        onClick={() => setActiveTab('features')}
                    >
                        <SettingsIcon size={20} />
                        <span>Features</span>
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'subscriptions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('subscriptions')}
                    >
                        <DollarSign size={20} />
                        <span>Subscriptions</span>
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        <Shield size={20} />
                        <span>Security</span>
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'database' ? 'active' : ''}`}
                        onClick={() => setActiveTab('database')}
                    >
                        <Database size={20} />
                        <span>Database</span>
                    </button>
                </div>

                {/* Settings Content */}
                <div className="settings-content">
                    {activeTab === 'profile' && (
                        <div className="settings-section">
                            <h2>Admin Profile</h2>
                            <div className="profile-card">
                                <div className="profile-avatar">
                                    {adminProfile?.name?.charAt(0)?.toUpperCase() || 'A'}
                                </div>
                                <div className="profile-info">
                                    <h3>{adminProfile?.name || 'Admin User'}</h3>
                                    <p>{adminProfile?.email || 'admin@goldtrack.pk'}</p>
                                    <span className="role-badge">
                                        {adminProfile?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                    </span>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" value={adminProfile?.name || ''} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" value={adminProfile?.email || ''} readOnly />
                            </div>
                            <div className="form-group">
                                <label>Role</label>
                                <input type="text" value={adminProfile?.role || ''} readOnly />
                            </div>
                        </div>
                    )}

                    {activeTab === 'general' && (
                        <div className="settings-section">
                            <h2>General Settings</h2>
                            <div className="form-group">
                                <label>Site Name</label>
                                <input
                                    type="text"
                                    value={settings.siteName}
                                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Contact Email</label>
                                <input
                                    type="email"
                                    value={settings.contactEmail}
                                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Contact Phone</label>
                                <input
                                    type="text"
                                    value={settings.contactPhone}
                                    onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <textarea
                                    value={settings.address}
                                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                    rows={3}
                                />
                            </div>
                            <div className="form-group">
                                <label>Currency</label>
                                <select value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })}>
                                    <option value="PKR">Pakistani Rupee (PKR)</option>
                                    <option value="USD">US Dollar (USD)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Timezone</label>
                                <select value={settings.timezone} onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}>
                                    <option value="Asia/Karachi">Asia/Karachi (PKT)</option>
                                    <option value="UTC">UTC</option>
                                </select>
                            </div>
                            <button className="btn-primary" onClick={handleSaveSettings} disabled={loading}>
                                {loading ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="settings-section">
                            <h2>Security Settings</h2>
                            <div className="info-card">
                                <Shield size={48} className="info-icon" />
                                <h3>Change Password</h3>
                                <p>For security reasons, password changes require email verification.</p>
                                <button className="btn-secondary">Request Password Reset</button>
                            </div>

                            <div className="security-options">
                                <h3>Two-Factor Authentication</h3>
                                <label className="toggle-switch">
                                    <input type="checkbox" />
                                    <span className="slider"></span>
                                    <span className="label-text">Enable 2FA (Coming Soon)</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="settings-section">
                            <h2>Notification Preferences</h2>
                            <div className="notification-options">
                                <label className="toggle-switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                    <span className="label-text">New User Registrations</span>
                                </label>
                                <label className="toggle-switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                    <span className="label-text">New Load Postings</span>
                                </label>
                                <label className="toggle-switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                    <span className="label-text">System Alerts</span>
                                </label>
                                <label className="toggle-switch">
                                    <input type="checkbox" />
                                    <span className="slider"></span>
                                    <span className="label-text">Email Notifications</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {activeTab === 'database' && (
                        <div className="settings-section">
                            <h2>Database Management</h2>
                            <div className="database-stats">
                                <div className="stat-card">
                                    <h3>Total Users</h3>
                                    <p className="stat-value">Loading...</p>
                                </div>
                                <div className="stat-card">
                                    <h3>Total Loads</h3>
                                    <p className="stat-value">Loading...</p>
                                </div>
                                <div className="stat-card">
                                    <h3>Total Trucks</h3>
                                    <p className="stat-value">Loading...</p>
                                </div>
                            </div>

                            <div className="danger-zone">
                                <h3>Danger Zone</h3>
                                <p>These actions are irreversible. Use with caution.</p>
                                <button className="btn-danger">Clear All Cache</button>
                                <button className="btn-danger">Reset Test Data</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
