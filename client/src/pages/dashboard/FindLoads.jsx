import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { Filter, MapPin, DollarSign, Calendar, Truck, Phone, Package } from 'lucide-react';
import api from '../../utils/api';

const FindLoads = () => {
    const [bidModalOpen, setBidModalOpen] = useState(false);
    const [selectedLoad, setSelectedLoad] = useState(null);
    const [loads, setLoads] = useState([]);
    const [filters, setFilters] = useState({ origin: '', destination: '', vehicle: '' });
    const [loading, setLoading] = useState(true);
    const [bidAmount, setBidAmount] = useState('');
    const [bidNote, setBidNote] = useState('');
    const [submittingBid, setSubmittingBid] = useState(false);

    const fetchLoads = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.origin) params.append('origin', filters.origin);
            if (filters.destination) params.append('destination', filters.destination);
            if (filters.vehicle && filters.vehicle !== 'Any') params.append('vehicle', filters.vehicle);

            const { data } = await api.get(`/loads?${params.toString()}`);
            setLoads(data);
        } catch (error) {
            console.error("Failed to fetch loads", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchLoads();
    }, []);

    const handleBid = (load) => {
        setSelectedLoad(load);
        setBidAmount('');
        setBidNote('');
        setBidModalOpen(true);
    };

    const submitBid = async () => {
        if (!bidAmount || bidAmount <= 0) {
            alert('Please enter a valid bid amount');
            return;
        }

        setSubmittingBid(true);
        try {
            await api.post(`/loads/${selectedLoad._id}/bid`, {
                amount: Number(bidAmount),
                note: bidNote
            });
            alert('Bid placed successfully!');
            setBidModalOpen(false);
            setBidAmount('');
            setBidNote('');
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to place bid';
            alert(msg);
        } finally {
            setSubmittingBid(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
            {/* Filters Sidebar */}
            <div className="w-full lg:w-80 flex-shrink-0 space-y-4 overflow-y-auto">
                <Card className="p-4">
                    <div className="flex items-center gap-2 font-bold mb-4 text-gray-700">
                        <Filter size={20} /> Filters
                    </div>
                    <div className="space-y-4">
                        <Input
                            label="Origin"
                            placeholder="City Name"
                            icon={<MapPin size={16} />}
                            value={filters.origin}
                            onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
                        />
                        <Input
                            label="Destination"
                            placeholder="City Name"
                            icon={<MapPin size={16} />}
                            value={filters.destination}
                            onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                        />
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Vehicle Type</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white"
                                value={filters.vehicle}
                                onChange={(e) => setFilters({ ...filters, vehicle: e.target.value })}
                            >
                                <option value="">Any</option>
                                <option value="Mazda">Mazda</option>
                                <option value="Shehzore">Shehzore</option>
                                <option value="10-Wheeler">10-Wheeler</option>
                            </select>
                        </div>
                        <Button className="w-full" onClick={fetchLoads}>Apply Filters</Button>
                    </div>
                </Card>
            </div>

            {/* Load List */}
            <div className="flex-1 overflow-y-auto pr-2">
                {loading ? <div className="text-center p-10">Loading loads...</div> : (
                    <div className="grid gap-4">
                        {loads.length === 0 && <div className="text-center p-10 text-gray-500">No loads found match your criteria.</div>}
                        {loads.map((load) => (
                            <Card key={load._id} className="hover:shadow-md transition-shadow border-l-4 border-l-[#D4AF37]">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold px-2 py-1 rounded border border-[#D4AF37]/30">
                                                {load.requiredVehicle}
                                            </span>
                                            <span className="text-gray-500 text-sm flex items-center gap-1">
                                                <Calendar size={14} /> {new Date(load.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-lg font-bold text-gray-800 mb-2">
                                            <span className="flex items-center gap-1"><MapPin size={18} className="text-[#D4AF37]" /> {load.origin}</span>
                                            <span className="text-gray-400">→</span>
                                            <span className="flex items-center gap-1"><MapPin size={18} className="text-red-600" /> {load.destination}</span>
                                        </div>
                                        <div className="flex gap-4 text-sm text-gray-600">
                                            <span className="flex items-center gap-1"><Package size={16} /> {load.goodsType}</span>
                                            <span className="flex items-center gap-1"><Truck size={16} /> {load.weight} Tons</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-row md:flex-col justify-between items-end gap-2 text-right">
                                        <div>
                                            <p className="text-gray-500 text-xs uppercase font-bold">Offer Rate</p>
                                            <p className="text-2xl font-bold text-[#D4AF37]">
                                                {load.offerPrice ? `Rs ${load.offerPrice.toLocaleString()}` : 'Negotiable'}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" className="p-2" title="Contact">
                                                <Phone size={20} />
                                            </Button>
                                            <Button onClick={() => handleBid(load)}>Place Bid</Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Bid Modal */}
            <Modal title={`Bid on Load`} isOpen={bidModalOpen} onClose={() => setBidModalOpen(false)}>
                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-bold">{selectedLoad?.origin} → {selectedLoad?.destination}</p>
                        <p className="text-sm text-gray-600">{selectedLoad?.requiredVehicle} • {selectedLoad?.weight} Tons • {selectedLoad?.goodsType}</p>
                        <p className="mt-2 text-[#D4AF37] font-bold">Shipper Offer: {selectedLoad?.offerPrice ? `Rs ${selectedLoad.offerPrice.toLocaleString()}` : 'Open'}</p>
                    </div>
                    <Input 
                        label="Your Bid Amount (Rs)" 
                        type="number" 
                        placeholder="e.g. 90000"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                    />
                    <Input 
                        label="Note (Optional)" 
                        placeholder="I can pick it up tomorrow..."
                        value={bidNote}
                        onChange={(e) => setBidNote(e.target.value)}
                    />
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={() => setBidModalOpen(false)} disabled={submittingBid}>Cancel</Button>
                        <Button onClick={submitBid} disabled={submittingBid}>
                            {submittingBid ? 'Submitting...' : 'Submit Bid'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
export default FindLoads;
