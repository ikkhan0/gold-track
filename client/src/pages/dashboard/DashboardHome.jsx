import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import { Truck, Package, Clock, DollarSign } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon, color }) => (
    <Card className="flex items-center gap-4 p-6 border-l-4" style={{ borderLeftColor: color }}>
        <div className={`p-4 rounded-full bg-opacity-10`} style={{ backgroundColor: color }}>
            {React.cloneElement(icon, { size: 24, color: color })}
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
    </Card>
);

const DashboardHome = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        title1: 'Loading...', value1: '-',
        title2: 'Loading...', value2: '-',
        title3: 'Loading...', value3: '-',
        title4: 'Loading...', value4: '-',
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/dashboard/stats');
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats");
            }
        };
        fetchStats();
    }, []);

    const handleAction = () => {
        if (user?.role === 'shipper') navigate('/dashboard/post-load');
        else navigate('/dashboard/loads');
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="h2 text-gray-800">Dashboard Overview</h1>
                    <p className="text-gray-500">Welcome back, {user?.name}</p>
                </div>
                <button className="btn btn-primary" onClick={handleAction}>
                    {user?.role === 'shipper' ? 'Post New Load' : 'Find New Loads'}
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title={stats.title1}
                    value={stats.value1}
                    icon={<Package />}
                    color="#059669" // emerald-600
                />
                <StatCard
                    title={stats.title2}
                    value={stats.value2}
                    icon={<Truck />}
                    color="#0284c7" // sky-600
                />
                <StatCard
                    title={stats.title3}
                    value={stats.value3}
                    icon={<Clock />}
                    color="#d97706" // amber-600
                />
                <StatCard
                    title={stats.title4}
                    value={stats.value4}
                    icon={<DollarSign />}
                    color="#7c3aed" // violet-600
                />
            </div>

            {/* Recent Activity Section */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="h3 text-lg">Recent Loads</h3>
                            <a href="#" className="text-emerald-600 text-sm hover:underline">View All</a>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-gray-500 text-sm border-b">
                                        <th className="pb-3 font-medium">Load ID</th>
                                        <th className="pb-3 font-medium">Route</th>
                                        <th className="pb-3 font-medium">Status</th>
                                        <th className="pb-3 font-medium">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {[1, 2, 3].map((i) => (
                                        <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="py-4">#LD-782{i}</td>
                                            <td className="py-4 font-medium">Karachi <span className="text-gray-400">→</span> Lahore</td>
                                            <td className="py-4">
                                                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                                                    In Transit
                                                </span>
                                            </td>
                                            <td className="py-4 font-medium">Rs 85,000</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                <div>
                    <Card className="h-full bg-emerald-900 text-white relative overflow-hidden text-center flex flex-col items-center justify-center p-8">
                        <div className="absolute top-0 right-0 p-32 bg-emerald-800 rounded-full -mr-16 -mt-16 opacity-50"></div>
                        <Truck size={48} className="mb-4 text-secondary relative z-10" />
                        <h3 className="text-2xl font-bold mb-2 relative z-10">Premium Member</h3>
                        <p className="text-emerald-200 mb-6 relative z-10">Access exclusive high-paying loads with Premium.</p>
                        <button className="btn btn-secondary w-full relative z-10">Upgrade Now</button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
