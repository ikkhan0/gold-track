import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, Clock, DollarSign, Eye, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import '../Dashboard.css';

const StatCard = ({ title, value, icon: Icon, trend }) => (
    <div className="stat-card">
        <div className="stat-icon">
            <Icon size={20} />
        </div>
        <div className="stat-content">
            <p className="stat-card-title">{title}</p>
            <h3 className="stat-card-value">{value}</h3>
            {trend && <span className="stat-trend">↑ {trend}</span>}
        </div>
    </div>
);

const PostingRow = ({ load, onManageBids }) => {
    return (
        <tr>
            <td style={{ color: '#D4AF37', fontWeight: 'bold' }}>{load.loadNumber || load._id?.slice(-6)}</td>
            <td style={{ color: '#F5F5F5' }}>
                {load.origin} <span style={{ color: '#D4AF37' }}>→</span> {load.destination}
            </td>
            <td>
                <span className={`status-badge status-${load.status?.toLowerCase() || 'open'}`}>
                    {load.status || 'Open'}
                </span>
            </td>
            <td style={{ color: '#D4AF37', fontWeight: 'bold' }}>Rs {(load.offerPrice || 0).toLocaleString()}</td>
            <td>
                <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '0.25rem', 
                    fontSize: '0.875rem', 
                    fontWeight: 'bold',
                    background: load.bids?.length > 0 ? 'rgba(212, 175, 55, 0.2)' : 'rgba(128, 128, 128, 0.2)',
                    color: load.bids?.length > 0 ? '#D4AF37' : '#B0B3B8'
                }}>
                    {load.bids?.length || 0} bids
                </span>
            </td>
            <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => onManageBids(load)}
                        className="btn-secondary"
                        style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                        title="Manage Bids"
                    >
                        <Eye size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

const ShipperDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loads, setLoads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        activePostings: 0,
        inProgress: 0,
        bidsReceived: 0,
        totalSpent: 0
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [loadsRes, statsRes] = await Promise.all([
                api.get('/loads/posted'),
                api.get('/dashboard/stats')
            ]);

            setLoads(loadsRes.data || []);
            setStats({
                activePostings: loadsRes.data?.filter(l => l.status === 'open').length || 0,
                inProgress: loadsRes.data?.filter(l => l.status === 'in-transit').length || 0,
                bidsReceived: loadsRes.data?.reduce((sum, l) => sum + (l.bids?.length || 0), 0) || 0,
                totalSpent: statsRes.data?.totalSpent || 0
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleManageBids = (load) => {
        navigate('/dashboard/my-postings', { state: { selectedLoad: load } });
    };

    return (
        <div className="dashboard-container" style={{ padding: '2rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#F5F5F5', marginBottom: '0.5rem', textTransform: 'uppercase' }}>SHIPPER DASHBOARD 📦</h1>
                    <p style={{ color: '#B0B3B8' }}>Welcome back, {user?.name}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button onClick={() => navigate('/dashboard/post-load')} className="btn-primary">
                        Post New Load
                    </button>
                    <button onClick={() => navigate('/dashboard/find-trucks')} className="btn-secondary">
                        Find Trucks
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard title="Active Postings" value={stats.activePostings} icon={Package} trend="+12%" />
                <StatCard title="In Progress" value={stats.inProgress} icon={Clock} />
                <StatCard title="Bids Received" value={stats.bidsReceived} icon={TrendingUp} trend="+8%" />
                <StatCard title="Total Spent" value={`Rs ${stats.totalSpent.toLocaleString()}`} icon={DollarSign} />
            </div>

            {/* My Load Postings Table */}
            <div className="dashboard-table-container">
                <div className="dashboard-table-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#F5F5F5', textTransform: 'uppercase' }}>MY LOAD POSTINGS</h2>
                            <p style={{ color: '#B0B3B8', fontSize: '0.875rem', marginTop: '0.25rem' }}>Manage your active and completed loads</p>
                        </div>
                        <span className="status-badge status-open">
                            {loads.length} Total Postings
                        </span>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    {loading ? (
                        <div className="loading-state">Loading your postings...</div>
                    ) : loads.length === 0 ? (
                        <div className="empty-state">
                            <Package size={48} />
                            <p>No postings yet. Post your first load!</p>
                        </div>
                    ) : (
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>LOAD ID</th>
                                    <th>ROUTE</th>
                                    <th>STATUS</th>
                                    <th>OFFER</th>
                                    <th>BIDS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loads.map(load => (
                                    <PostingRow key={load._id} load={load} onManageBids={handleManageBids} />
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShipperDashboard;
