import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, MapPin, Calendar, DollarSign, Package } from 'lucide-react';
import api from '../../../utils/api';
import { PAKISTAN_CITIES, ALL_VEHICLES } from '../../../constants/data';

const PostTruck = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [myTrucks, setMyTrucks] = useState([]);
    const [formData, setFormData] = useState({
        truck: '',
        currentLocation: '',
        destination: '',
        availableDate: new Date().toISOString().split('T')[0],
        deadheadOriginRadius: 50,
        deadheadDestinationRadius: 100,
        loadType: 'Full',
        equipmentType: 'Any',
        maxLength: 40,
        maxWeight: 20000,
        expectedRatePerKM: '',
        contactMethod: 'Any',
        notes: '',
        openToBackhaul: true
    });

    useEffect(() => {
        fetchMyTrucks();
    }, []);

    const fetchMyTrucks = async () => {
        try {
            const { data } = await api.get('/vehicles');
            setMyTrucks(data);
        } catch (error) {
            console.error('Failed to fetch trucks:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                maxWeight: Number(formData.maxWeight),
                maxLength: Number(formData.maxLength),
                deadheadOriginRadius: Number(formData.deadheadOriginRadius),
                deadheadDestinationRadius: Number(formData.deadheadDestinationRadius),
                expectedRatePerKM: formData.expectedRatePerKM ? Number(formData.expectedRatePerKM) : undefined
            };

            await api.post('/trucks/availability', payload);
            alert('Truck availability posted successfully!');
            navigate('/dashboard/trucks');
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to post truck availability';
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">Post Truck Availability</h1>
                    <p className="text-gray-400">Let shippers know your truck is available for work</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-8">
                    {/* Truck Selection */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Truck className="text-[#D4AF37]" size={24} />
                            Select Truck
                        </h3>
                        
                        {myTrucks.length === 0 ? (
                            <div className="bg-slate-900 border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                                <Truck className="mx-auto mb-4 text-gray-500" size={48} />
                                <h4 className="text-white font-bold mb-2">No Vehicles Found</h4>
                                <p className="text-gray-400 mb-4">You need to add your vehicles first before posting availability</p>
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard/vehicles')}
                                    className="px-6 py-3 bg-[#D4AF37] text-[#0F1111] font-bold rounded-lg hover:bg-[#C9A532] transition"
                                >
                                    Add Your First Vehicle
                                </button>
                            </div>
                        ) : (
                            <>
                                <select
                                    value={formData.truck}
                                    onChange={(e) => setFormData({ ...formData, truck: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-700 rounded-lg focus:border-[#D4AF37] focus:outline-none"
                                >
                                    <option value="">Select a truck</option>
                                    {myTrucks.map(truck => (
                                        <option key={truck._id} value={truck._id}>
                                            {truck.vehicleType} - {truck.registrationNumber} ({truck.capacity}kg capacity)
                                        </option>
                                    ))}
                                </select>
                                <p className="text-gray-400 text-sm mt-2">
                                    Don't see your truck? <button type="button" onClick={() => navigate('/dashboard/vehicles')} className="text-[#D4AF37] hover:underline">Add a new vehicle</button>
                                </p>
                            </>
                        )}
                    </div>

                    {/* Location Details */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <MapPin className="text-[#D4AF37]" size={24} />
                            Location Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Current Location *</label>
                                <select
                                    value={formData.currentLocation}
                                    onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-700 rounded-lg"
                                >
                                    <option value="">Select city</option>
                                    {PAKISTAN_CITIES.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Destination (Optional)</label>
                                <select
                                    value={formData.destination}
                                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-700 rounded-lg"
                                >
                                    <option value="">Any destination</option>
                                    {PAKISTAN_CITIES.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Availability & Preferences */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Calendar className="text-[#D4AF37]" size={24} />
                            Availability & Preferences
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Available From</label>
                                <input
                                    type="date"
                                    value={formData.availableDate}
                                    onChange={(e) => setFormData({ ...formData, availableDate: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-700 rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Load Type</label>
                                <select
                                    value={formData.loadType}
                                    onChange={(e) => setFormData({ ...formData, loadType: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-700 rounded-lg"
                                >
                                    <option value="Full">Full Load Only</option>
                                    <option value="Partial">Partial Load Only</option>
                                    <option value="Any">Any (Full or Partial)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Deadhead to Pickup (km)
                                </label>
                                <input
                                    type="number"
                                    value={formData.deadheadOriginRadius}
                                    onChange={(e) => setFormData({ ...formData, deadheadOriginRadius: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-700 rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Deadhead from Delivery (km)
                                </label>
                                <input
                                    type="number"
                                    value={formData.deadheadDestinationRadius}
                                    onChange={(e) => setFormData({ ...formData, deadheadDestinationRadius: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-700 rounded-lg"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <DollarSign className="text-emerald-400" size={24} />
                            Pricing (Optional)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Expected Rate/KM (Rs)</label>
                                <input
                                    type="number"
                                    value={formData.expectedRatePerKM}
                                    onChange={(e) => setFormData({ ...formData, expectedRatePerKM: e.target.value })}
                                    placeholder="e.g., 25"
                                    className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-700 rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Preferred Contact Method</label>
                                <select
                                    value={formData.contactMethod}
                                    onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-700 rounded-lg"
                                >
                                    <option value="Any">Any Method</option>
                                    <option value="Phone">Phone Only</option>
                                    <option value="WhatsApp">WhatsApp Only</option>
                                    <option value="In-App">In-App Only</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Additional Notes */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Additional Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={3}
                            placeholder="Any special requirements or information..."
                            className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-700 rounded-lg resize-none"
                        />
                    </div>

                    {/* Backhaul Option */}
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.openToBackhaul}
                            onChange={(e) => setFormData({ ...formData, openToBackhaul: e.target.checked })}
                            className="w-5 h-5 text-[#D4AF37] bg-slate-900 border-slate-700 rounded focus:ring-[#D4AF37] focus:ring-2"
                        />
                        <span className="text-white font-medium">Open to backhaul opportunities</span>
                    </label>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-8 py-3 bg-[#D4AF37] hover:bg-[#C9A532] text-[#0F1111] font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Posting...' : 'Post Truck Availability'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostTruck;
