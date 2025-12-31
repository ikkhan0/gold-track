import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import api from '../../../utils/api';

const MyPostings = () => {
    const navigate = useNavigate();
    const [loads, setLoads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLoad, setSelectedLoad] = useState(null);
    const [showBidModal, setShowBidModal] = useState(false);

    useEffect(() => {
        fetchMyPostings();
    }, []);

    const fetchMyPostings = async () => {
        try {
            const { data } = await api.get('/loads/posted');
            setLoads(data);
        } catch (error) {
            console.error('Failed to fetch postings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptBid = async (loadId, bidId) => {
        if (!window.confirm('Accept this bid?')) return;

        try {
            await api.put(`/loads/${loadId}/bids/${bidId}`, { status: 'Accepted' });
            alert('Bid accepted! Carrier has been notified.');
            fetchMyPostings();
            setShowBidModal(false);
        } catch (error) {
            alert('Failed to accept bid: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleRejectBid = async (loadId, bidId) => {
        if (!window.confirm('Reject this bid?')) return;

        try {
            await api.put(`/loads/${loadId}/bids/${bidId}`, { status: 'Rejected' });
            alert('Bid rejected.');
            fetchMyPostings();
        } catch (error) {
            alert('Failed to reject bid: ' + (error.response?.data?.message || error.message));
        }
    };

    const viewBids = (load) => {
        setSelectedLoad(load);
        setShowBidModal(true);
    };

    const getStatusColor = (status) => {
        const colors = {
            'Open': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
            'Assigned': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            'In-Transit': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
            'Delivered': 'bg-green-500/20 text-green-400 border-green-500/30',
            'Cancelled': 'bg-red-500/20 text-red-400 border-red-500/30'
        };
        return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">My Load Postings</h1>
                    <p className="text-gray-400">Manage your posted loads and review bids</p>
                </div>

                {loading ? (
                    <div className="text-center text-gray-400 py-12">Loading...</div>
                ) : loads.length === 0 ? (
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-12 text-center">
                        <Package size={64} className="mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-400 mb-4">No postings yet</p>
                        <button
                            onClick={() => navigate('/dashboard/post-load')}
                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors"
                        >
                            Post Your First Load
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {loads.map(load => (
                            <div key={load._id} className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-emerald-500/50 transition-all">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-3">
                                            <span className="text-emerald-400 font-mono text-sm">{load.loadNumber || 'N/A'}</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(load.status)}`}>
                                                {load.status}
                                            </span>
                                            <span className={`px-2 py-1 rounded text-sm ${load.bids?.length > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                {load.bids?.length || 0} Bids
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-400">Route:</span>
                                                <p className="text-white font-medium">
                                                    {load.origin} <span className="text-emerald-400">→</span> {load.destination}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Goods:</span>
                                                <p className="text-white font-medium">{load.goodsType} ({load.weight} tons)</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Offer:</span>
                                                <p className="text-white font-bold">Rs {(load.offerPrice || 0).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {load.status === 'Open' && load.bids?.length > 0 && (
                                            <button
                                                onClick={() => viewBids(load)}
                                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                <Eye size={16} />
                                                Review Bids
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Bid Review Modal */}
                {showBidModal && selectedLoad && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                            <div className="p-6 border-b border-slate-700">
                                <h2 className="text-2xl font-bold text-white">
                                    Bids for {selectedLoad.origin} → {selectedLoad.destination}
                                </h2>
                                <p className="text-gray-400 text-sm mt-1">{selectedLoad.bids?.length} total bids</p>
                            </div>

                            <div className="p-6 space-y-4">
                                {selectedLoad.bids?.map((bid) => (
                                    <div key={bid._id} className="bg-slate-900 border border-slate-700 rounded-lg p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-white font-bold">{bid.carrier?.name || 'Unknown Carrier'}</h3>
                                                <p className="text-gray-400 text-sm">{bid.carrier?.companyName}</p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className="text-green-400 font-semibold text-sm">
                                                        CS: {bid.carrier?.creditScore || 50}
                                                    </span>
                                                    <span className="text-gray-400 text-sm">
                                                        {bid.carrier?.daysToPayAverage || 30}d to pay
                                                    </span>
                                                    <span className="text-amber-400 text-sm">
                                                        ⭐ {bid.carrier?.rating || 5.0}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-emerald-400">Rs {(bid.amount || 0).toLocaleString()}</p>
                                                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold border ${bid.status === 'Pending' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                                                        bid.status === 'Accepted' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                                            'bg-red-500/20 text-red-400 border-red-500/30'
                                                    }`}>
                                                    {bid.status}
                                                </span>
                                            </div>
                                        </div>

                                        {bid.note && (
                                            <div className="bg-slate-800 rounded p-3 mb-3">
                                                <p className="text-gray-300 text-sm">{bid.note}</p>
                                            </div>
                                        )}

                                        {bid.status === 'Pending' && (
                                            <div className="flex gap-2 pt-3 border-t border-slate-700">
                                                <button
                                                    onClick={() => handleAcceptBid(selectedLoad._id, bid._id)}
                                                    className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <CheckCircle size={16} />
                                                    Accept Bid
                                                </button>
                                                <button
                                                    onClick={() => handleRejectBid(selectedLoad._id, bid._id)}
                                                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <XCircle size={16} />
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 border-t border-slate-700">
                                <button
                                    onClick={() => setShowBidModal(false)}
                                    className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPostings;
