import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import './TruckManagement.css';
import './LoadManagement.css'; // Reuse table styles

const TruckManagement = () => {
    const [trucks, setTrucks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchTrucks();
    }, [page]);

    const fetchTrucks = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`http://localhost:5000/api/admin/trucks?page=${page}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTrucks(response.data.trucks || []);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching trucks:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this truck posting?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`http://localhost:5000/api/admin/trucks/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTrucks();
        } catch (error) {
            alert('Error deleting truck: ' + error.response?.data?.message);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="truck-management">
            <div className="page-header">
                <h1>Truck Management</h1>
                <p>Manage carrier truck availability postings</p>
            </div>

            <div className="table-card">
                {loading ? (
                    <div className="loading">Loading trucks...</div>
                ) : (
                    <div className="table-wrapper">
                        <table className="loads-table"> {/* Reuse class */}
                            <thead>
                                <tr>
                                    <th>Carrier</th>
                                    <th>Truck Info</th>
                                    <th>Location</th>
                                    <th>Availability</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trucks.map(truck => (
                                    <tr key={truck._id}>
                                        <td>
                                            <div className="carrier-info">
                                                <strong>{truck.carrier?.companyName || 'Unknown'}</strong>
                                                <div className="text-sm text-gray">{truck.carrier?.name}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="truck-badge">{truck.equipmentType}</span>
                                            <div className="text-sm mt-1">{truck.truck?.registrationNumber}</div>
                                        </td>
                                        <td>
                                            <div className="route-info">
                                                <span>{truck.currentLocation}</span>
                                                {truck.destination && (
                                                    <>
                                                        <span className="route-arrow">→</span>
                                                        <span>{truck.destination}</span>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td>{formatDate(truck.availableDate)}</td>
                                        <td>
                                            <button
                                                className="btn-delete"
                                                onClick={() => handleDelete(truck._id)}
                                                title="Delete Posting"
                                            >
                                                <Trash2 size={18} />
                                            </button>
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
        </div>
    );
};

export default TruckManagement;
