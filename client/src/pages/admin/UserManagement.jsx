import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Check, X, Edit, Trash2, Eye, UserCheck, UserX, Ban } from 'lucide-react';
import './UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        role: '',
        status: '',
        search: ''
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        fetchUsers();
    }, [filters]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const params = new URLSearchParams();
            if (filters.role) params.append('role', filters.role);
            if (filters.status) params.append('status', filters.status);
            if (filters.search) params.append('search', filters.search);

            const response = await axios.get(`http://localhost:5000/api/admin/users?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data.users || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Failed to fetch users: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setShowViewModal(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setEditForm({
            name: user.name,
            email: user.email,
            phone: user.phone,
            city: user.city || '',
            province: user.province || '',
            address: user.address || '',
            companyName: user.companyName || '',
            role: user.role,
            status: user.status
        });
        setShowEditModal(true);
    };

    const submitEditUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`http://localhost:5000/api/admin/users/${selectedUser._id}`, editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('User updated successfully!');
            setShowEditModal(false);
            fetchUsers();
        } catch (error) {
            alert('Error updating user: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleApprove = async (userId) => {
        if (!window.confirm('Approve this user?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`http://localhost:5000/api/admin/users/${userId}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
            alert('User approved successfully!');
        } catch (error) {
            alert('Error approving user: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleReject = async (userId) => {
        if (!window.confirm('Reject this user?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`http://localhost:5000/api/admin/users/${userId}/reject`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
            alert('User rejected');
        } catch (error) {
            alert('Error rejecting user: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleSuspend = async (userId) => {
        if (!window.confirm('Suspend this user?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`http://localhost:5000/api/admin/users/${userId}/suspend`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
            alert('User suspended');
        } catch (error) {
            alert('Error suspending user: ' + (error.response?.data?.message || error.message));
        }
    };

    const getRoleBadgeColor = (role) => {
        const colors = {
            super_admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            admin: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            shipper: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
            broker: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
            fleet_owner: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
            owner_operator: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            carrier: 'bg-teal-500/20 text-teal-400 border-teal-500/30'
        };
        return colors[role] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    };

    const getStatusBadgeColor = (status) => {
        const colors = {
            approved: 'bg-green-500/20 text-green-400 border-green-500/30',
            pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
            rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
            suspended: 'bg-red-500/20 text-red-400 border-red-500/30'
        };
        return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    };

    return (
        <div className="user-management">
            <div className="page-header">
                <h1>User Management</h1>
                <p>Manage and approve user accounts</p>
            </div>

            {/* Filters */}
            <div className="filters-section">
                <div className="filter-group">
                    <label>Role</label>
                    <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
                        <option value="">All Roles</option>
                        <option value="shipper">Shipper</option>
                        <option value="carrier">Carrier</option>
                        <option value="broker">Broker</option>
                        <option value="fleet_owner">Fleet Owner</option>
                        <option value="owner_operator">Owner Operator</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Status</label>
                    <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>

                <div className="filter-group search-group">
                    <label>Search</label>
                    <div className="search-input">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, email, company..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Users Table */}
            {loading ? (
                <div className="loading-state">Loading users...</div>
            ) : users.length === 0 ? (
                <div className="empty-state">No users found</div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Company</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                                            {user.role?.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${getStatusBadgeColor(user.status)}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td>{user.companyName || '-'}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button onClick={() => handleViewUser(user)} className="btn-icon" title="View Details">
                                                <Eye size={16} />
                                            </button>
                                            <button onClick={() => handleEditUser(user)} className="btn-icon" title="Edit User">
                                                <Edit size={16} />
                                            </button>
                                            {user.status === 'pending' && (
                                                <>
                                                    <button onClick={() => handleApprove(user._id)} className="btn-icon success" title="Approve">
                                                        <UserCheck size={16} />
                                                    </button>
                                                    <button onClick={() => handleReject(user._id)} className="btn-icon danger" title="Reject">
                                                        <UserX size={16} />
                                                    </button>
                                                </>
                                            )}
                                            {user.status === 'approved' && (
                                                <button onClick={() => handleSuspend(user._id)} className="btn-icon warning" title="Suspend">
                                                    <Ban size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* View User Modal */}
            {showViewModal && selectedUser && (
                <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>User Details</h2>
                            <button onClick={() => setShowViewModal(false)} className="close-btn">×</button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <label>Name:</label>
                                    <p>{selectedUser.name}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Email:</label>
                                    <p>{selectedUser.email}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Phone:</label>
                                    <p>{selectedUser.phone}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Role:</label>
                                    <p><span className={`badge ${getRoleBadgeColor(selectedUser.role)}`}>{selectedUser.role}</span></p>
                                </div>
                                <div className="detail-item">
                                    <label>Status:</label>
                                    <p><span className={`badge ${getStatusBadgeColor(selectedUser.status)}`}>{selectedUser.status}</span></p>
                                </div>
                                <div className="detail-item">
                                    <label>Company:</label>
                                    <p>{selectedUser.companyName || '-'}</p>
                                </div>
                                <div className="detail-item">
                                    <label>City:</label>
                                    <p>{selectedUser.city || '-'}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Province:</label>
                                    <p>{selectedUser.province || '-'}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Credit Score:</label>
                                    <p>{selectedUser.creditScore || 50}</p>
                                </div>
                                <div className="detail-item">
                                    <label>Days to Pay:</label>
                                    <p>{selectedUser.daysToPayAverage || 30} days</p>
                                </div>
                                <div className="detail-item">
                                    <label>Rating:</label>
                                    <p>⭐ {selectedUser.rating || 5.0} ({selectedUser.reviewCount || 0} reviews)</p>
                                </div>
                                <div className="detail-item">
                                    <label>Joined:</label>
                                    <p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Edit User</h2>
                            <button onClick={() => setShowEditModal(false)} className="close-btn">×</button>
                        </div>
                        <form onSubmit={submitEditUser}>
                            <div className="modal-body">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Name *</label>
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email *</label>
                                        <input
                                            type="email"
                                            value={editForm.email}
                                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone *</label>
                                        <input
                                            type="text"
                                            value={editForm.phone}
                                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Company Name</label>
                                        <input
                                            type="text"
                                            value={editForm.companyName}
                                            onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>City</label>
                                        <input
                                            type="text"
                                            value={editForm.city}
                                            onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Province</label>
                                        <input
                                            type="text"
                                            value={editForm.province}
                                            onChange={(e) => setEditForm({ ...editForm, province: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Role</label>
                                        <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}>
                                            <option value="shipper">Shipper</option>
                                            <option value="carrier">Carrier</option>
                                            <option value="broker">Broker</option>
                                            <option value="fleet_owner">Fleet Owner</option>
                                            <option value="owner_operator">Owner Operator</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Status</label>
                                        <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="suspended">Suspended</option>
                                        </select>
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Address</label>
                                        <textarea
                                            value={editForm.address}
                                            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => setShowEditModal(false)} className="btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
