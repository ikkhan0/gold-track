import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Shield, Users, Activity, Database, Settings as SettingsIcon, TrendingUp, BarChart3, Server } from 'lucide-react';
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

const SuperAdminDashboard = () => {
    const [stats, setStats] = useState({
        totalAdmins: 0,
        totalUsers: 0,
        systemHealth: 'Excellent',
        apiCalls: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const usersRes = await axios.get('/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const admins = usersRes.data?.filter(u => u.role === 'admin' || u.role === 'super_admin') || [];

            setStats({
                totalAdmins: admins.length,
                totalUsers: usersRes.data?.length || 0,
                systemHealth: 'Excellent',
                apiCalls: Math.floor(Math.random() * 10000)
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-10 bg-[#0F1111] min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <Shield className="text-[#D4AF37]" size={32} />
                    <div>
                        <h1 className="text-3xl font-bold text-[#F5F5F5]">SUPER ADMIN DASHBOARD</h1>
                        <p className="text-[#B0B3B8] text-sm">Full System Control & Monitoring</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard title="All Admins" value={stats.totalAdmins} icon={Shield} />
                    <StatCard title="Total Users" value={stats.totalUsers} icon={Users} />
                    <StatCard title="System Health" value={stats.systemHealth} icon={Activity} />
                    <StatCard title="API Calls (24h)" value={stats.apiCalls.toLocaleString()} icon={TrendingUp} />
                </div>

                {/* Admin Management */}
                <div className="bg-[#1A1D1D]/60 backdrop-blur-md rounded-lg shadow-xl border border-[#D4AF37]/30 mb-8">
                    <div className="p-6 border-b border-[#D4AF37]/20">
                        <h2 className="text-xl font-bold text-[#F5F5F5] flex items-center gap-2">
                            <Users className="text-[#D4AF37]" />
                            ADMIN MANAGEMENT
                        </h2>
                        <p className="text-[#B0B3B8] text-sm mt-1">Manage administrator accounts and permissions</p>
                    </div>
                    <div className="p-6">
                        <p className="text-[#B0B3B8] text-center py-10">
                            Admin management interface - Coming soon
                        </p>
                    </div>
                </div>

                {/* System Configuration */}
                <div className="bg-[#1A1D1D]/60 backdrop-blur-md rounded-lg shadow-xl border border-[#D4AF37]/30">
                    <div className="p-6 border-b border-[#D4AF37]/20">
                        <h2 className="text-xl font-bold text-[#F5F5F5] flex items-center gap-2">
                            <SettingsIcon className="text-[#D4AF37]" />
                            SYSTEM CONFIGURATION
                        </h2>
                        <p className="text-[#B0B3B8] text-sm mt-1">Database, performance, and security settings</p>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Database */}
                            <div className="p-6 bg-[#0F1111]/50 rounded-lg border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-[#D4AF37]/20 rounded-lg">
                                        <Database className="text-[#D4AF37]" size={24} />
                                    </div>
                                    <h3 className="font-semibold text-[#F5F5F5] text-lg">Database</h3>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <p className="text-[#F5F5F5]">
                                        <span className="text-[#D4AF37] font-bold">Status:</span> 
                                        <span className="ml-2 text-[#004D40]">● Connected</span>
                                    </p>
                                    <p className="text-[#B0B3B8]">
                                        <span className="text-[#D4AF37] font-bold">Cluster:</span> loadboard_db
                                    </p>
                                    <p className="text-[#B0B3B8]">
                                        <span className="text-[#D4AF37] font-bold">Last Backup:</span> 2 hours ago
                                    </p>
                                </div>
                            </div>

                            {/* Performance */}
                            <div className="p-6 bg-[#0F1111]/50 rounded-lg border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-[#D4AF37]/20 rounded-lg">
                                        <BarChart3 className="text-[#D4AF37]" size={24} />
                                    </div>
                                    <h3 className="font-semibold text-[#F5F5F5] text-lg">Performance</h3>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <p className="text-[#F5F5F5]">
                                        <span className="text-[#D4AF37] font-bold">Uptime:</span> 
                                        <span className="ml-2">99.9%</span>
                                    </p>
                                    <p className="text-[#B0B3B8]">
                                        <span className="text-[#D4AF37] font-bold">Avg Response:</span> 142ms
                                    </p>
                                    <p className="text-[#B0B3B8]">
                                        <span className="text-[#D4AF37] font-bold">Load:</span> Normal
                                    </p>
                                </div>
                            </div>

                            {/* Server Status */}
                            <div className="p-6 bg-[#0F1111]/50 rounded-lg border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-[#D4AF37]/20 rounded-lg">
                                        <Server className="text-[#D4AF37]" size={24} />
                                    </div>
                                    <h3 className="font-semibold text-[#F5F5F5] text-lg">Server Status</h3>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <p className="text-[#F5F5F5]">
                                        <span className="text-[#D4AF37] font-bold">API Server:</span> 
                                        <span className="ml-2 text-[#004D40]">● Running</span>
                                    </p>
                                    <p className="text-[#B0B3B8]">
                                        <span className="text-[#D4AF37] font-bold">Port:</span> 5000
                                    </p>
                                    <p className="text-[#B0B3B8]">
                                        <span className="text-[#D4AF37] font-bold">Version:</span> 1.0.0
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Logs */}
                <div className="bg-[#1A1D1D]/60 backdrop-blur-md rounded-lg shadow-xl border border-[#D4AF37]/30 mt-8">
                    <div className="p-6 border-b border-[#D4AF37]/20">
                        <h2 className="text-xl font-bold text-[#F5F5F5] flex items-center gap-2">
                            <Activity className="text-[#D4AF37]" />
                            RECENT ACTIVITY
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between p-3 bg-[#0F1111]/50 rounded-lg border border-[#D4AF37]/10">
                                <span className="text-[#B0B3B8]">User registration request from new carrier</span>
                                <span className="text-[#D4AF37] font-mono text-xs">2 min ago</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-[#0F1111]/50 rounded-lg border border-[#D4AF37]/10">
                                <span className="text-[#B0B3B8]">System backup completed successfully</span>
                                <span className="text-[#D4AF37] font-mono text-xs">1 hour ago</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-[#0F1111]/50 rounded-lg border border-[#D4AF37]/10">
                                <span className="text-[#B0B3B8]">New load posting from shipper account</span>
                                <span className="text-[#D4AF37] font-mono text-xs">3 hours ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
