import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Eye, Edit } from 'lucide-react';
import './LoadManagement.css';

const LoadManagement = () => {
    const [loads, setLoads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedLoad, setSelectedLoad] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchLoads();
    }, [page]);

    const fetchLoads = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`/api/admin/loads?page=${page}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLoads(response.data.loads || []);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching loads:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this load? This cannot be undone.')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`/api/admin/loads/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchLoads(); // Refresh list
        } catch (error) {
            alert('Error deleting load: ' + error.response?.data?.message);
        }
    };

    const handleViewLoad = (load) => {
        setSelectedLoad(load);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedLoad(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="load-management">
            <div className="page-header">
                <h1>Load Management</h1>
                <p>Monitor and manage all load postings</p>
            </div>

            <div className="table-card">
                {loading ? (
                    <div className="loading">Loading loads...</div>
                ) : (
                    <div className="table-wrapper">
                        <table className="loads-table">
                            <thead>
                                <tr>
                                    <th>Shipper</th>
                                    <th>Route</th>
                                    <th>Details</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loads.map(load => (
                                    <tr key={load._id}>
                                        <td>
                                            <div className="shipper-info">
                                                <strong>{load.shipper?.companyName || 'Unknown'}</strong>
                                                <div className="text-sm text-gray">{load.shipper?.name}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="route-info">
                                                <span>{load.origin}</span>
                                                <span className="route-arrow">→</span>
                                                <span>{load.destination}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="load-details">
                                                <span title="Goods Type">{load.goodsType}</span>
                                                <span className="separator">•</span>
                                                <span title="Weight">{load.weight} Tons</span>
                                                <span className="separator">•</span>
                                                <span title="Vehicle">{load.requiredVehicle}</span>
                                            </div>
                                        </td>
                                        <td>{formatDate(load.pickupDate)}</td>
                                        <td>
                                            <span className={`status-badge status-${load.status.toLowerCase()}`}>
                                                {load.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    className="btn-view"
                                                    onClick={() => handleViewLoad(load)}
                                                    title="View Load Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => handleDelete(load._id)}
                                                    title="Delete Load"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            <div className="pagination">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                >Previous</button>
                <span>Page {page} of {totalPages}</span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                >Next</button>
            </div>

            {/* Load Details Modal */}
            {showModal && selectedLoad && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Load Details</h2>
                            <button className="modal-close" onClick={closeModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-group">
                                <h3>Shipper Information</h3>
                                <p><strong>Company:</strong> {selectedLoad.shipper?.companyName || 'N/A'}</p>
                                <p><strong>Contact:</strong> {selectedLoad.shipper?.name || 'N/A'}</p>
                                <p><strong>Email:</strong> {selectedLoad.shipper?.email || 'N/A'}</p>
                            </div>
                            <div className="detail-group">
                                <h3>Route Details</h3>
                                <p><strong>Origin:</strong> {selectedLoad.origin}</p>
                                <p><strong>Destination:</strong> {selectedLoad.destination}</p>
                                <p><strong>Distance:</strong> {selectedLoad.distance || 'N/A'} KM</p>
                            </div>
                            <div className="detail-group">
                                <h3>Load Information</h3>
                                <p><strong>Goods Type:</strong> {selectedLoad.goodsType}</p>
                                <p><strong>Weight:</strong> {selectedLoad.weight} Tons</p>
                                <p><strong>Required Vehicle:</strong> {selectedLoad.requiredVehicle}</p>
                                <p><strong>Offer Price:</strong> PKR {selectedLoad.offerPrice?.toLocaleString()}</p>
                            </div>
                            <div className="detail-group">
                                <h3>Schedule</h3>
                                <p><strong>Pickup Date:</strong> {formatDate(selectedLoad.pickupDate)}</p>
                                <p><strong>Delivery Date:</strong> {formatDate(selectedLoad.deliveryDate)}</p>
                            </div>
                            <div className="detail-group">
                                <h3>Status</h3>
                                <p>
                                    <span className={`status-badge status-${selectedLoad.status.toLowerCase()}`}>
                                        {selectedLoad.status}
                                    </span>
                                </p>
                            </div>
                            {selectedLoad.specialInstructions && (
                                <div className="detail-group">
                                    <h3>Special Instructions</h3>
                                    <p>{selectedLoad.specialInstructions}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoadManagement;
