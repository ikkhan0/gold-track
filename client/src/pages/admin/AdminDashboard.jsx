import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { Check, X, Shield, Clock } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingUsers = async () => {
        try {
            const res = await api.get('/admin/users?status=pending');
            setPendingUsers(res.data);
        } catch (error) {
            console.error("Error fetching pending users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const handleAction = async (userId, status) => {
        try {
            await api.put(`/admin/users/${userId}/status`, { status });
            // Remove from local list
            setPendingUsers(prev => prev.filter(u => u._id !== userId));
            alert(`User ${status} successfully.`);
        } catch (error) {
            console.error(`Error ${status} user:`, error);
            alert("Action failed.");
        }
    };

    if (user?.role !== 'admin') {
        return <div className="p-10 text-center text-red-500">Access Denied. Admins Only.</div>;
    }

    return (
        <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <Shield className="text-emerald-600" size={32} />
                    <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Clock className="text-yellow-500" />
                                Pending Approvals ({pendingUsers.length})
                            </h2>
                            <Button variant="outline" onClick={fetchPendingUsers} className="text-sm">Refresh List</Button>
                        </div>

                        {loading ? (
                            <div className="text-center py-10">Loading...</div>
                        ) : pendingUsers.length === 0 ? (
                            <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-lg">
                                No pending users found. All caught up!
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-100 text-slate-600 uppercase text-sm">
                                            <th className="p-4 rounded-tl-lg">Name</th>
                                            <th className="p-4">Role</th>
                                            <th className="p-4">Details</th>
                                            <th className="p-4">Contact</th>
                                            <th className="p-4 rounded-tr-lg text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {pendingUsers.map(u => (
                                            <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-4 font-medium text-slate-800">{u.name}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.role === 'carrier' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm text-slate-600">
                                                    {u.role === 'carrier' ? (
                                                        <>
                                                            <div><strong>CNIC:</strong> {u.cnic}</div>
                                                            <div><strong>City:</strong> {u.city}</div>
                                                            <div><strong>License:</strong> {u.licenseNumber}</div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div><strong>Company:</strong> {u.companyName}</div>
                                                            <div><strong>NTN:</strong> {u.ntn}</div>
                                                            <div><strong>City:</strong> {u.city}</div>
                                                        </>
                                                    )}
                                                </td>
                                                <td className="p-4 text-sm text-slate-600">
                                                    <div>{u.email}</div>
                                                    <div>{u.phone}</div>
                                                </td>
                                                <td className="p-4 text-right space-x-2">
                                                    <button
                                                        onClick={() => handleAction(u._id, 'approved')}
                                                        className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors text-sm font-medium"
                                                    >
                                                        <Check size={16} /> Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(u._id, 'rejected')}
                                                        className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm font-medium"
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
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
