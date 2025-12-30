import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import { MapPin, Package, Truck, Calendar, Phone } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const MyLoads = () => {
    const { user } = useAuth();
    const [loads, setLoads] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyBids = async () => {
        try {
            const { data } = await api.get('/loads/bidded');
            setLoads(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyBids();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="flex flex-col gap-6">
            <h1 className="h2 text-gray-800">My Bids & Loads</h1>
            <div className="grid gap-4">
                {loads.map((load) => {
                    const myBid = load.bids.find(b => b.carrier === user._id || b.carrier._id === user._id);

                    return (
                        <Card key={load._id}>
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${myBid?.status === 'Accepted' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                            Bid: {myBid?.status || 'Pending'}
                                        </span>
                                        <span className="text-gray-500 text-sm">Load Status: {load.status}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-lg font-bold text-gray-800 mb-2">
                                        <span className="flex items-center gap-1"><MapPin size={18} className="text-emerald-600" /> {load.origin}</span>
                                        <span className="text-gray-400">→</span>
                                        <span className="flex items-center gap-1"><MapPin size={18} className="text-red-600" /> {load.destination}</span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Shipper: {load.shipper?.companyName || load.shipper?.name}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">My Bid Amount</p>
                                    <p className="text-xl font-bold text-emerald-600">Rs {myBid?.amount.toLocaleString()}</p>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default MyLoads;
