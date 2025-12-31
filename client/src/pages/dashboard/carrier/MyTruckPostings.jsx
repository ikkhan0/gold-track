import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, MapPin, Calendar, DollarSign, Eye, Trash2, Edit, Package } from 'lucide-react';
import api from '../../../utils/api';

const MyTruckPostings = () => {
    const navigate = useNavigate();
    const [postings, setPostings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPosting, setSelectedPosting] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchMyPostings();
    }, []);

    const fetchMyPostings = async () => {
        try {
            const { data } = await api.get('/trucks/availability/my-postings');
            setPostings(data);
        } catch (error) {
            console.error('Failed to fetch postings:', error);
            alert('Failed to load your truck postings');
        } finally {
            setLoading(false);
        }
    };

    const handleView = (posting) => {
        setSelectedPosting(posting);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this posting?')) return;

        try {
            await api.delete(`/trucks/availability/${id}`);
            alert('Posting deleted successfully');
            fetchMyPostings();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete posting');
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            Available: 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]',
            Booked: 'bg-blue-500/20 text-blue-400 border-blue-500',
            Expired: 'bg-gray-500/20 text-gray-400 border-gray-500'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.Available}`}>
                {status}
            </span>
        );
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-PK', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <div className="text-white text-xl">Loading your postings...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">My Truck Postings</h1>
                        <p className="text-gray-400">Manage your posted truck availability</p>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard/post-truck')}
                        className="px-6 py-3 bg-[#D4AF37] text-[#0F1111] font-bold rounded-lg hover:bg-[#C9A532] transition"
                    >
                        + Post New Truck
                    </button>
                </div>

                {/* Postings Grid */}
                {postings.length === 0 ? (
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
                        <Truck className="mx-auto mb-4 text-gray-500" size={64} />
                        <h3 className="text-xl font-bold text-white mb-2">No Postings Yet</h3>
                        <p className="text-gray-400 mb-6">Start posting your truck availability to find loads</p>
                        <button
                            onClick={() => navigate('/dashboard/post-truck')}
                            className="px-6 py-3 bg-[#D4AF37] text-[#0F1111] font-bold rounded-lg hover:bg-[#C9A532] transition"
                        >
                            Post Your First Truck
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {postings.map((posting) => (
                            <div
                                key={posting._id}
                                className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-[#D4AF37] transition"
                            >
                                {/* Status Badge */}
                                <div className="flex justify-between items-start mb-4">
                                    {getStatusBadge(posting.status)}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleView(posting)}
                                            className="p-2 bg-slate-700 rounded hover:bg-slate-600 transition"
                                            title="View Details"
                                        >
                                            <Eye size={16} className="text-gray-300" />
                                        </button>
                                        {posting.status === 'Available' && (
                                            <button
                                                onClick={() => handleDelete(posting._id)}
                                                className="p-2 bg-red-900/30 rounded hover:bg-red-900/50 transition"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} className="text-red-400" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Truck Info */}
                                <div className="mb-4">
                                    <div className="flex items-center gap-2 text-white font-bold mb-2">
                                        <Truck size={20} className="text-[#D4AF37]" />
                                        {posting.truck?.vehicleType || 'N/A'}
                                    </div>
                                    <p className="text-gray-400 text-sm">
                                        {posting.truck?.registrationNumber || 'No Reg#'}
                                    </p>
                                </div>

                                {/* Route */}
                                <div className="mb-4 space-y-2">
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <MapPin size={16} className="text-[#D4AF37]" />
                                        <span className="text-sm">From: {posting.currentLocation}</span>
                                    </div>
                                    {posting.destination && (
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <MapPin size={16} className="text-blue-400" />
                                            <span className="text-sm">To: {posting.destination}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="space-y-2 text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} />
                                        Available: {formatDate(posting.availableDate)}
                                    </div>
                                    {posting.expectedRatePerKM && (
                                        <div className="flex items-center gap-2">
                                            <DollarSign size={14} />
                                            Rate: Rs {posting.expectedRatePerKM}/km
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Package size={14} />
                                        {posting.loadType} | {posting.equipmentType}
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between text-xs text-gray-500">
                                    <span>{posting.viewCount || 0} views</span>
                                    <span>{posting.contactCount || 0} contacts</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* View Modal */}
            {showModal && selectedPosting && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Posting Details</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-white text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status */}
                            <div>
                                <label className="text-gray-400 text-sm">Status</label>
                                <div className="mt-1">{getStatusBadge(selectedPosting.status)}</div>
                            </div>

                            {/* Truck Details */}
                            <div>
                                <label className="text-gray-400 text-sm">Truck</label>
                                <div className="mt-1 text-white font-bold">
                                    {selectedPosting.truck?.vehicleType} - {selectedPosting.truck?.registrationNumber}
                                </div>
                                <div className="text-gray-400 text-sm mt-1">
                                    Capacity: {selectedPosting.truck?.capacity || 'N/A'} tons
                                </div>
                            </div>

                            {/* Location */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-gray-400 text-sm">Current Location</label>
                                    <div className="mt-1 text-white">{selectedPosting.currentLocation}</div>
                                    <div className="text-gray-500 text-xs mt-1">
                                        Radius: {selectedPosting.deadheadOriginRadius} km
                                    </div>
                                </div>
                                {selectedPosting.destination && (
                                    <div>
                                        <label className="text-gray-400 text-sm">Destination</label>
                                        <div className="mt-1 text-white">{selectedPosting.destination}</div>
                                        <div className="text-gray-500 text-xs mt-1">
                                            Radius: {selectedPosting.deadheadDestinationRadius} km
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Dates & Rates */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-gray-400 text-sm">Available Date</label>
                                    <div className="mt-1 text-white">{formatDate(selectedPosting.availableDate)}</div>
                                </div>
                                {selectedPosting.expectedRatePerKM && (
                                    <div>
                                        <label className="text-gray-400 text-sm">Expected Rate</label>
                                        <div className="mt-1 text-white">Rs {selectedPosting.expectedRatePerKM}/km</div>
                                    </div>
                                )}
                            </div>

                            {/* Load & Equipment */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-gray-400 text-sm">Load Type</label>
                                    <div className="mt-1 text-white">{selectedPosting.loadType}</div>
                                </div>
                                <div>
                                    <label className="text-gray-400 text-sm">Equipment Type</label>
                                    <div className="mt-1 text-white">{selectedPosting.equipmentType}</div>
                                </div>
                            </div>

                            {/* Capacity */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-gray-400 text-sm">Max Weight</label>
                                    <div className="mt-1 text-white">{selectedPosting.maxWeight} kg</div>
                                </div>
                                <div>
                                    <label className="text-gray-400 text-sm">Max Length</label>
                                    <div className="mt-1 text-white">{selectedPosting.maxLength} ft</div>
                                </div>
                            </div>

                            {/* Notes */}
                            {selectedPosting.notes && (
                                <div>
                                    <label className="text-gray-400 text-sm">Notes</label>
                                    <div className="mt-1 text-white bg-slate-900 p-3 rounded">
                                        {selectedPosting.notes}
                                    </div>
                                </div>
                            )}

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-[#D4AF37]">{selectedPosting.viewCount || 0}</div>
                                    <div className="text-gray-400 text-sm">Views</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-[#D4AF37]">{selectedPosting.contactCount || 0}</div>
                                    <div className="text-gray-400 text-sm">Contacts</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-gray-400 text-sm">Posted</div>
                                    <div className="text-white text-sm">{formatDate(selectedPosting.createdAt)}</div>
                                </div>
                            </div>

                            {/* Booking Info */}
                            {selectedPosting.status === 'Booked' && selectedPosting.bookedBy && (
                                <div className="bg-blue-900/20 border border-blue-500/30 rounded p-4">
                                    <h3 className="text-blue-400 font-bold mb-2">Booked By</h3>
                                    <div className="text-white">{selectedPosting.bookedBy.name || 'N/A'}</div>
                                    <div className="text-gray-400 text-sm">{selectedPosting.bookedBy.companyName || 'N/A'}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyTruckPostings;
