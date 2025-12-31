import React, { useState, useEffect } from 'react';
import { Truck, TrendingUp, DollarSign, Package, Wrench, MapPin } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import '../Dashboard.css';

const StatCard = ({ title, value, icon: Icon, trend }) => (
    <div className="bg-[#1A1D1D]/60 backdrop-blur-md border border-[#D4AF37]/30 rounded-lg p-6 hover:border-[#D4AF37] transition-all shadow-lg">
        <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-[#0F1111] rounded-lg border border-[#004D40]">
                <Icon size={20} className="text-[#D4AF37]" />
            </div>
            {trend && (
                <div className="flex items-center gap-1 text-[#D4AF37] text-xs font-bold uppercase">
                    <TrendingUp size={14} />
                    <span>{trend}</span>
                </div>
            )}
        </div>
        <p className="text-[#B0B3B8] text-sm mb-1 uppercase tracking-wide">{title}</p>
        <h3 className="text-2xl font-bold text-[#F5F5F5]">{value}</h3>
    </div>
);

const TruckRow = ({ truck }) => {
    return (
        <tr className="border-b border-[#D4AF37]/10 hover:bg-[#1A1D1D] cursor-pointer transition-colors">
            <td className="py-3 px-4 text-[#D4AF37] font-mono text-sm font-bold">{truck.registrationNumber || 'TRK-' + truck._id?.slice(-3)}</td>
            <td className="py-3 px-4 text-[#F5F5F5] font-medium">{truck.type}</td>
            <td className="py-3 px-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${truck.status === 'active' ? 'bg-[#004D40]/20 text-[#004D40] border-[#004D40]/50' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                    {truck.status || 'Active'}
                </span>
            </td>
            <td className="py-3 px-4 text-[#B0B3B8]">{truck.currentLocation || 'Karachi'}</td>
            <td className="py-3 px-4 text-[#B0B3B8] text-sm">{truck.nextDestination || '-'}</td>
            <td className="py-3 px-4 text-[#D4AF37] font-bold">Rs {(truck.monthlyRevenue || 0).toLocaleString()}</td>
            <td className="py-3 px-4">
                <button className="px-4 py-1.5 bg-gradient-to-r from-[#004D40] to-[#003832] text-[#F5F5F5] text-sm font-bold rounded transition-all border border-[#004D40] hover:shadow-lg">
                    Manage
                </button>
            </td>
        </tr>
    );
};

const OwnerOperatorDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [trucks, setTrucks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        activeJobs: 0,
        fleetSize: 0,
        revenuePerTruck: 0,
        totalRevenue: 0
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [trucksRes, statsRes] = await Promise.all([
                api.get('/vehicles/my-vehicles').catch(() => ({ data: [] })),
                api.get('/dashboard/stats').catch(() => ({ data: {} }))
            ]);

            const truckData = trucksRes.data || [];
            setTrucks(truckData);

            const totalRevenue = truckData.reduce((sum, t) => sum + (t.monthlyRevenue || 0), 0);
            const avgRevenue = truckData.length > 0 ? Math.floor(totalRevenue / truckData.length) : 0;

            setStats({
                activeJobs: statsRes.data?.activeJobs || 0,
                fleetSize: truckData.length,
                revenuePerTruck: avgRevenue,
                totalRevenue: totalRevenue
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F1111] p-6">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-[#F5F5F5] mb-2 uppercase">OWNER OPERATOR DASHBOARD 🚚</h1>
                    <p className="text-[#B0B3B8]">Welcome back, {user?.name}</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#C9A532] text-[#0F1111] font-bold rounded-lg shadow-lg hover:shadow-[#D4AF37]/50 transition-all border border-[#D4AF37]">
                        Find Loads
                    </button>
                    <button
                        onClick={() => navigate('/dashboard/post-truck')}
                        className="px-6 py-3 bg-gradient-to-r from-[#004D40] to-[#003832] text-[#F5F5F5] font-semibold rounded-lg shadow-lg hover:shadow-[#004D40]/50 transition-all border border-[#004D40]"
                    >
                        Post Availability
                    </button>
                    <button className="px-6 py-3 bg-[#1A1D1D] text-[#F5F5F5] font-semibold rounded-lg border border-[#D4AF37] hover:bg-[#004D40] transition-all">
                        Manage Fleet
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Active Jobs" value={stats.activeJobs} icon={Package} trend="+5%" />
                <StatCard title="Fleet Size" value={stats.fleetSize} icon={Truck} />
                <StatCard title="Revenue/Truck" value={`Rs ${stats.revenuePerTruck.toLocaleString()}`} icon={DollarSign} trend="+12%" />
                <StatCard title="Total Revenue" value={`Rs ${stats.totalRevenue.toLocaleString()}`} icon={TrendingUp} trend="+18%" />
            </div>

            {/* My Fleet Table */}
            <div className="bg-[#1A1D1D]/60 backdrop-blur-md border border-[#D4AF37]/30 rounded-lg overflow-hidden shadow-xl">
                <div className="p-6 border-b border-[#D4AF37]/20">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-[#F5F5F5] uppercase">MY FLEET</h2>
                            <p className="text-[#B0B3B8] text-sm mt-1">Manage your trucks and performance</p>
                        </div>
                        <span className="px-4 py-2 bg-[#D4AF37]/20 text-[#D4AF37] rounded-lg text-sm font-bold uppercase border border-[#D4AF37]/50">
                            {trucks.length} Trucks
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-10 text-center text-[#B0B3B8]">Loading your fleet...</div>
                    ) : trucks.length === 0 ? (
                        <div className="p-10 text-center text-[#B0B3B8]">
                            <Truck size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No trucks in your fleet yet. Add your first truck!</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-[#0F1111] border-b border-[#D4AF37]/20">
                                <tr>
                                    <th className="py-4 px-4 text-left text-[#D4AF37] font-bold uppercase text-sm">TRUCK #</th>
                                    <th className="py-4 px-4 text-left text-[#D4AF37] font-bold uppercase text-sm">TYPE</th>
                                    <th className="py-4 px-4 text-left text-[#D4AF37] font-bold uppercase text-sm">STATUS</th>
                                    <th className="py-4 px-4 text-left text-[#D4AF37] font-bold uppercase text-sm">LOCATION</th>
                                    <th className="py-4 px-4 text-left text-[#D4AF37] font-bold uppercase text-sm">NEXT</th>
                                    <th className="py-4 px-4 text-left text-[#D4AF37] font-bold uppercase text-sm">REVENUE</th>
                                    <th className="py-4 px-4 text-left text-[#D4AF37] font-bold uppercase text-sm">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trucks.map(truck => (
                                    <TruckRow key={truck._id} truck={truck} />
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OwnerOperatorDashboard;
