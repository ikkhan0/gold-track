import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TrendingUp, Users, Package, Truck, MapPin, Clock, DollarSign, ArrowRight } from 'lucide-react';
import axios from 'axios';
import CarrierDashboard from './carrier/CarrierDashboard';
import ShipperDashboard from './shipper/ShipperDashboard';
import OwnerOperatorDashboard from './owneroperator/OwnerOperatorDashboard';
import './Dashboard.css';

const StatCard = ({ title, value, icon: Icon, trend }) => (
    <div className="stat-card">
        <div className="stat-icon">
            <Icon size={20} />
        </div>
        <div className="stat-content">
            <p className="stat-title">{title}</p>
            <h3 className="stat-value">{value}</h3>
            {trend && <span className="stat-trend">{trend}</span>}
        </div>
    </div>
);

const QuickActionButton = ({ icon: Icon, label, onClick }) => (
    <button onClick={onClick} className="quick-action-btn">
        <Icon size={18} />
        <span>{label}</span>
        <ArrowRight size={16} className="ml-auto" />
    </button>
);

const DashboardHome = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalActiveItems: 0,
        totalEarnings: 0,
        completedTransactions: 0,
        rating: 0
    });
    const [loading, setLoading] = useState(true);

    console.log('[DashboardHome] User:', user);
    console.log('[DashboardHome] User role:', user?.role);

    useEffect(() => {
        fetchStats();
    }, [user]);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            const res = await axios.get('http://localhost:5000/api/dashboard/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setStats({
                totalActiveItems: res.data?.activeJobs || 0,
                totalEarnings: res.data?.totalEarnings || 0,
                completedTransactions: res.data?.completedTrips || 0,
                rating: res.data?.rating || 0
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    // Route to appropriate dashboard based on user role
    const role = user?.role?.toLowerCase();

    if (role === 'shipper' || role === 'broker') {
        return <ShipperDashboard />;
    }

    if (role === 'owner_operator' || role === 'fleet_owner') {
        return <OwnerOperatorDashboard />;
    }

    // Default to carrier dashboard for carrier and unknown roles
    return <CarrierDashboard />;
};

export default DashboardHome;
