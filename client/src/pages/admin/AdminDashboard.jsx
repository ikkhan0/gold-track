import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Check, X, Shield, Clock, Users, Package, Truck as TruckIcon, DollarSign } from 'lucide-react';
import './AdminDashboard.css';

const StatCard = ({ title, value, icon: Icon }) => (
    <div className="bg-[#1A1D1D]/60 backdrop-blur-md rounded-lg p-6 border border-[#D4AF37]/30 shadow-lg hover:border-[#D4AF37] transition-all">
        <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-[#0F1111] rounded-lg border border-[#004D40]">
                <Icon size={20} className="text-[#D4AF37]" />
            </div>
        </div>
        <p className="text-[#B0B3B8] text-sm mb-1 uppercase tracking-wide">{title}</p>
        <h3 className="text-2xl font-bold text-[#F5F5F5]">{value}</h3>
    </div>
);

const AdminDashboard = () => {
    const [adminUser, setAdminUser] = useState(null);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeLoads: 0,
        activeTrucks: 0,
        revenue: 0
    });

    useEffect(() => {
        const userData = localStorage.getItem('adminUser');
        if (userData) {
            setAdminUser(JSON.parse(userData));
        }
        fetchPendingUsers();
        fetchStats();
    }, []);

    const fetchPendingUsers = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.get('/api/admin/users?status=pending', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingUsers(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Error fetching pending users:", error);
            setPendingUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const usersRes = await axios.get('/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats({
                totalUsers: usersRes.data?.users?.length || usersRes.data?.total || 0,
                activeLoads: 0,
                activeTrucks: 0,
                revenue: 0
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const handleAction = async (userId, status) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`/api/admin/users/${userId}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPendingUsers(prev => prev.filter(u => u._id !== userId));
            fetchStats();
            alert(`User ${status} successfully.`);
        } catch (error) {
            console.error(`Error ${status} user:`, error);
            alert("Action failed.");
        }
    };

    return (
        <div className="p-6 md:p-10 bg-[#0F1111] min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <Shield className="text-[#D4AF37]" size={32} />
                    <h1 className="text-3xl font-bold text-[#F5F5F5]">ADMIN DASHBOARD</h1>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Total Users" value={stats.totalUsers} icon={Users} />
                    <StatCard title="Pending Approvals" value={pendingUsers.length} icon={Clock} />
                    <StatCard title="Active Loads" value={stats.activeLoads} icon={Package} />
                    <StatCard title="Active Trucks" value={stats.activeTrucks} icon={TruckIcon} />
                </div>

                {/* Pending Approvals */}
                <div className="bg-[#1A1D1D]/60 backdrop-blur-md rounded-lg shadow-xl border border-[#D4AF37]/30">
                    <div className="p-6 border-b border-[#D4AF37]/20">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-[#F5F5F5] flex items-center gap-2">
                                    <Clock className="text-[#D4AF37]" />
                                    PENDING USER APPROVALS ({pendingUsers.length})
                                </h2>
                                <p className="text-[#B0B3B8] text-sm mt-1">Review and approve new user registrations</p>
                            </div>
                            <button onClick={fetchPendingUsers} className="px-4 py-2 bg-[#D4AF37]/20 text-[#D4AF37] rounded hover:bg-[#D4AF37]/30 transition-colors text-sm font-bold border border-[#D4AF37]/50">
                                Refresh List
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-10 text-[#B0B3B8]">Loading...</div>
                    ) : pendingUsers.length === 0 ? (
                        <div className="text-center py-10 text-[#B0B3B8] bg-[#0F1111]/50">
                            No pending users found. All caught up!
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#0F1111] text-[#D4AF37] uppercase text-sm border-b border-[#D4AF37]/20">
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Role</th>
                                        <th className="p-4">Details</th>
                                        <th className="p-4">Contact</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#D4AF37]/10">
                                    {pendingUsers.map(u => (
                                        <tr key={u._id} className="hover:bg-[#D4AF37]/5 transition-colors">
                                            <td className="p-4 font-medium text-[#F5F5F5]">{u.name}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.role === 'carrier' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-[#B0B3B8]">
                                                {u.role === 'carrier' ? (
                                                    <>
                                                        <div><strong className="text-[#F5F5F5]">CNIC:</strong> {u.cnic}</div>
                                                        <div><strong className="text-[#F5F5F5]">City:</strong> {u.city}</div>
                                                        <div><strong className="text-[#F5F5F5]">License:</strong> {u.licenseNumber}</div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div><strong className="text-[#F5F5F5]">Company:</strong> {u.companyName}</div>
                                                        <div><strong className="text-[#F5F5F5]">NTN:</strong> {u.ntn}</div>
                                                        <div><strong className="text-[#F5F5F5]">City:</strong> {u.city}</div>
                                                    </>
                                                )}
                                            </td>
                                            <td className="p-4 text-sm text-[#B0B3B8]">
                                                <div>{u.email}</div>
                                                <div>{u.phone}</div>
                                            </td>
                                            <td className="p-4 text-right space-x-2">
                                                <button
                                                    onClick={() => handleAction(u._id, 'approved')}
                                                    className="inline-flex items-center gap-1 px-3 py-1 bg-[#004D40] text-white rounded hover:bg-[#00695c] transition-colors text-sm font-medium border border-[#004D40]"
                                                >
                                                    <Check size={16} /> Approve
                                                </button>
                                                <button
                                                    onClick={() => handleAction(u._id, 'rejected')}
                                                    className="inline-flex items-center gap-1 px-3 py-1 bg-red-900/50 text-red-200 rounded hover:bg-red-900/70 transition-colors text-sm font-medium border border-red-800"
                                                >
                                                    <X size={16} /> Reject
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
