import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { MapPin, Package, Truck, Calendar, ChevronDown, ChevronUp, Phone, Check, X } from 'lucide-react';
import api from '../../utils/api';

const MyPostings = () => {
    const [loads, setLoads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedLoad, setExpandedLoad] = useState(null);

    const fetchMyLoads = async () => {
        try {
            const { data } = await api.get('/loads/posted');
            setLoads(data);
        } catch (error) {
            console.error("Failed to fetch my loads", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyLoads();
    }, []);

    const toggleExpand = (id) => {
        if (expandedLoad === id) setExpandedLoad(null);
        else setExpandedLoad(id);
    };

    const handleBidAction = async (loadId, bidId, status) => {
        try {
            await api.put(`/loads/${loadId}/bids/${bidId}`, { status });
            fetchMyLoads(); // Refresh to show updated status
            alert(`Bid ${status}`);
        } catch (error) {
            alert('Action failed');
        }
    };

    if (loading) return <div>Loading your postings...</div>;

    return (
        <div className="flex flex-col gap-6">
            <h1 className="h2 text-gray-800">My Posted Loads</h1>

            {loads.length === 0 ? (
                <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl">
                    You haven't posted any loads yet.
                </div>
            ) : (
                <div className="grid gap-4">
                    {loads.map((load) => (
                        <Card key={load._id} className="transition-all">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${load.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {load.status}
                                        </span>
                                        <span className="text-gray-500 text-sm flex items-center gap-1">
                                            <Calendar size={14} /> Posted: {new Date(load.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-lg font-bold text-gray-800 mb-2">
                                        <span className="flex items-center gap-1"><MapPin size={18} className="text-emerald-600" /> {load.origin}</span>
                                        <span className="text-gray-400">→</span>
                                        <span className="flex items-center gap-1"><MapPin size={18} className="text-red-600" /> {load.destination}</span>
                                    </div>
                                    <div className="flex gap-4 text-sm text-gray-600">
                                        <span>{load.goodsType}</span>
                                        <span>{load.weight} Tons</span>
                                        <span>{load.requiredVehicle}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end justify-between">
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">Target Offer</p>
                                        <p className="font-bold text-emerald-600">{load.offerPrice ? `Rs ${load.offerPrice}` : 'Open'}</p>
                                    </div>
                                    <Button variant="outline" className="text-sm mt-3" onClick={() => toggleExpand(load._id)}>
                                        {expandedLoad === load._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        {load.bids.length} Bids
                                    </Button>
                                </div>
                            </div>

                            {/* Bids Section */}
                            {expandedLoad === load._id && (
                                <div className="mt-6 pt-4 border-t border-gray-100 bg-gray-50/50 -mx-6 px-6 pb-2">
                                    <h4 className="font-bold text-gray-700 mb-3">Received Bids</h4>
                                    {load.bids.length === 0 ? (
                                        <p className="text-sm text-gray-500">No bids received yet.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {load.bids.map((bid) => (
                                                <div key={bid._id} className="bg-white p-3 rounded border border-gray-200 flex justify-between items-center">
                                                    <div>
                                                        <p className="font-bold text-gray-800">{bid.carrier?.name} <span className="text-xs font-normal text-gray-500">({bid.carrier?.fleetType || 'Carrier'})</span></p>
                                                        <p className="text-emerald-700 font-bold">Rs {bid.amount.toLocaleString()}</p>
                                                        {bid.note && <p className="text-xs text-gray-500 italic">"{bid.note}"</p>}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {bid.status === 'Pending' ? (
                                                            <>
                                                                <button onClick={() => handleBidAction(load._id, bid._id, 'Rejected')} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Reject">
                                                                    <X size={18} />
                                                                </button>
                                                                <button onClick={() => handleBidAction(load._id, bid._id, 'Accepted')} className="p-2 text-green-600 hover:bg-green-50 rounded" title="Accept">
                                                                    <Check size={18} />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <span className={`text-xs font-bold px-2 py-1 rounded ${bid.status === 'Accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                {bid.status}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPostings;
