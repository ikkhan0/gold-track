import React, { useState } from 'react';
import { Search, MapPin, Truck, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import { PAKISTAN_CITIES } from '../../../constants/data';

const FindTrucks = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        currentLocation: '',
        destination: '',
        equipmentType: 'Any',
        availableDate: '',
        minWeight: '',
        maxAge: 1440 // 24 hours in minutes
    });
    const [trucks, setTrucks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSearched(true);

        try {
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key]) params.append(key, filters[key]);
            });

            const { data } = await api.get(`/trucks/search?${params}`);
            setTrucks([...(data.exactMatches || []), ...(data.similarMatches || [])]);
        } catch (error) {
            console.error('Failed to search trucks:', error);
            alert('Failed to search trucks: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleContact = async (truckId) => {
        try {
            await api.post(`/trucks/availability/${truckId}/contact`);
            alert('Contact recorded. Carrier details are visible below.');
        } catch (error) {
            console.error('Failed to record contact:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Find Available Trucks 🚛</h1>
                    <p className="text-gray-400">Search for carriers and available trucks near you</p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                <MapPin size={16} className="inline mr-1" />
                                Current Location
                            </label>
                            <select
                                value={filters.currentLocation}
                                onChange={(e) => setFilters({ ...filters, currentLocation: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-700 rounded-lg"
                            >
                                <option value="">Any location</option>
                                {PAKISTAN_CITIES.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                <MapPin size={16} className="inline mr-1" />
                                Destination
                            </label>
                            <select
                                value={filters.destination}
                                onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-700 rounded-lg"
                            >
                                <option value="">Any destination</option>
                                {PAKISTAN_CITIES.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                <Truck size={16} className="inline mr-1" />
                                Equipment Type
                            </label>
                            <select
                                value={filters.equipmentType}
                                onChange={(e) => setFilters({ ...filters, equipmentType: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-700 rounded-lg"
                            >
                                <option value="Any">Any Type</option>
                                <option value="Mazda">Mazda</option>
                                <option value="Shehzore">Shehzore</option>
                                <option value="10-Wheeler">10-Wheeler</option>
                                <option value="22-Wheeler">22-Wheeler</option>
                                <option value="Trailer-40ft">Trailer 40ft</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Minimum Weight (kg)</label>
                            <input
                                type="number"
                                value={filters.minWeight}
                                onChange={(e) => setFilters({ ...filters, minWeight: e.target.value })}
                                placeholder="e.g., 5000"
                                className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-700 rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Available From</label>
                            <input
                                type="date"
                                value={filters.availableDate}
                                onChange={(e) => setFilters({ ...filters, availableDate: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-700 rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                <Filter size={16} className="inline mr-1" />
                                Search Back
                            </label>
                            <select
                                value={filters.maxAge}
                                onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-700 rounded-lg"
                            >
                                <option value="120">Last 2 hours</option>
                                <option value="240">Last 4 hours</option>
                                <option value="1440">Last 24 hours</option>
                                <option value="10080">Last 7 days</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Search size={20} />
                        {loading ? 'Searching...' : 'Search Available Trucks'}
                    </button>
                </form>

                {/* Results */}
                {searched && (
                    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
                        <div className="p-6 border-b border-slate-700">
                            <h2 className="text-2xl font-bold text-white">Search Results</h2>
                            <p className="text-gray-400 text-sm mt-1">
                                {loading ? 'Searching...' : `${trucks.length} trucks found`}
                            </p>
                        </div>

                        {loading ? (
                            <div className="p-12 text-center text-gray-400">Searching for trucks...</div>
                        ) : trucks.length === 0 ? (
                            <div className="p-12 text-center text-gray-400">
                                <Truck size={64} className="mx-auto mb-4 opacity-50" />
                                <p>No trucks found matching your criteria</p>
                                <p className="text-sm mt-2">Try adjusting your search filters</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-700">
                                {trucks.map((truck) => (
                                    <div key={truck._id} className="p-6 hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-3">
                                                    <h3 className="text-xl font-bold text-white">
                                                        {truck.truck?.vehicleType} - {truck.truck?.registrationNumber}
                                                    </h3>
                                                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-semibold border border-emerald-500/30">
                                                        Available
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                    <div>
                                                        <span className="text-gray-400 text-sm">Location:</span>
                                                        <p className="text-white font-medium">{truck.currentLocation}</p>
                                                    </div>
                                                    {truck.destination && (
                                                        <div>
                                                            <span className="text-gray-400 text-sm">Heading to:</span>
                                                            <p className="text-white font-medium">{truck.destination}</p>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <span className="text-gray-400 text-sm">Capacity:</span>
                                                        <p className="text-white font-medium">{truck.maxWeight.toLocaleString()} kg</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400 text-sm">Available:</span>
                                                        <p className="text-white font-medium">
                                                            {new Date(truck.availableDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Carrier Info */}
                                                <div className="flex items-center gap-4 p-4 bg-slate-900 rounded-lg">
                                                    <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                                                        {truck.carrier?.name?.charAt(0)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-white font-semibold">{truck.carrier?.name}</h4>
                                                        <p className="text-gray-400 text-sm">{truck.carrier?.companyName || 'Independent Carrier'}</p>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-center">
                                                            <span className="text-green-400 font-bold text-lg">
                                                                {truck.carrier?.creditScore || 50}
                                                            </span>
                                                            <p className="text-gray-400 text-xs">Credit Score</p>
                                                        </div>
                                                        <div className="text-center">
                                                            <span className="text-amber-400 font-bold text-lg">
                                                                {truck.carrier?.daysToPayAverage || 30}d
                                                            </span>
                                                            <p className="text-gray-400 text-xs">Days to Pay</p>
                                                        </div>
                                                        <div className="text-center">
                                                            <span className="text-yellow-400 font-bold text-lg">
                                                                ⭐ {truck.carrier?.rating || 5.0}
                                                            </span>
                                                            <p className="text-gray-400 text-xs">Rating</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="ml-6 flex flex-col gap-2">
                                                <button
                                                    onClick={() => handleContact(truck._id)}
                                                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors"
                                                >
                                                    Contact Carrier
                                                </button>
                                                {truck.expectedRatePerKM && (
                                                    <div className="text-center bg-slate-900 p-2 rounded">
                                                        <p className="text-emerald-400 font-bold text-lg">
                                                            Rs {truck.expectedRatePerKM}/km
                                                        </p>
                                                        <p className="text-gray-400 text-xs">Expected Rate</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindTrucks;
