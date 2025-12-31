import React, { useState, useEffect } from 'react';
import { Truck, TrendingUp, DollarSign, Package, Clock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import '../Dashboard.css';

const StatCard = ({ title, value, icon: Icon, trend }) => (
    <div className="stat-card">
        <div className="stat-icon">
            <Icon size={20} />
        </div>
        <div className="stat-content">
            <p className="stat-card-title">{title}</p>
            <h3 className="stat-card-value">{value}</h3>
            {trend && <span className="stat-trend">↑ {trend}</span>}
        </div>
    </div>
);

const LoadRow = ({ load, onBid, onShowContact }) => {
    const ageMinutes = Math.floor((Date.now() - new Date(load.createdAt)) / 60000);
    const ageDisplay = ageMinutes < 60 ? `${ageMinutes}m` : `${Math.floor(ageMinutes / 60)}h`;
    
    // Format pickup date
    const pickupDate = load.pickupDate ? new Date(load.pickupDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD';

    // Special requirements badges
    const badges = [];
    if (load.specialRequirements?.hazmat) badges.push('⚠️ HAZMAT');
    if (load.specialRequirements?.oversize) badges.push('📏 OVERSIZE');
    if (load.specialRequirements?.teamDriver) badges.push('👥 TEAM');
    if (load.loadType === 'LTL') badges.push('📦 LTL');
    if (load.loadType === 'Partial') badges.push('📦 PARTIAL');

    return (
        <tr>
            <td style={{ color: '#D4AF37', fontWeight: 'bold' }}>{ageDisplay}</td>
            <td style={{ color: '#F5F5F5' }}>
                <div>
                    <div>{load.origin} <span style={{ color: '#D4AF37' }}>→</span> {load.destination}</div>
                    {badges.length > 0 && (
                        <div style={{ fontSize: '0.75rem', color: '#D4AF37', marginTop: '0.25rem' }}>
                            {badges.join(' • ')}
                        </div>
                    )}
                </div>
            </td>
            <td style={{ color: '#D4AF37', fontWeight: 'bold' }}>Rs {(load.offerPrice || 0).toLocaleString()}</td>
            <td style={{ color: '#B0B3B8' }}>{load.requiredVehicle}</td>
            <td style={{ color: '#B0B3B8' }}>{load.weight || 'N/A'} tons</td>
            <td style={{ color: '#B0B3B8', fontSize: '0.875rem' }}>{pickupDate}</td>
            <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#004D40', fontWeight: 'bold', fontSize: '0.875rem' }}>
                        CS: {load.shipper?.creditScore || 50}
                    </span>
                    <span style={{ color: '#B0B3B8', fontSize: '0.875rem' }}>
                        {load.shipper?.daysToPayAverage || 30}d
                    </span>
                </div>
            </td>
            <td>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button 
                        className="btn-primary" 
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', cursor: 'pointer', position: 'relative', zIndex: 1 }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onShowContact(load);
                        }}
                        type="button"
                    >
                        📞 Call Now
                    </button>
                    <button 
                        className="btn-outline" 
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', cursor: 'pointer', position: 'relative', zIndex: 1 }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onBid(load);
                        }}
                        type="button"
                    >
                        Bid
                    </button>
                </div>
            </td>
        </tr>
    );
};

const CarrierDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loads, setLoads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        activeJobs: 0,
        myTrucks: 0,
        pendingBids: 0,
        totalEarnings: 0
    });
    const [showBidModal, setShowBidModal] = useState(false);
    const [selectedLoad, setSelectedLoad] = useState(null);
    const [bidAmount, setBidAmount] = useState('');
    const [bidNote, setBidNote] = useState('');
    const [submittingBid, setSubmittingBid] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [contactInfo, setContactInfo] = useState(null);
    const [loadingContact, setLoadingContact] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [loadsRes, statsRes] = await Promise.all([
                api.get('/loads'),
                api.get('/dashboard/stats')
            ]);

            setLoads(loadsRes.data || []);
            setStats({
                activeJobs: statsRes.data?.activeJobs || 0,
                myTrucks: statsRes.data?.myTrucks || 0,
                pendingBids: statsRes.data?.pendingBids || 0,
                totalEarnings: statsRes.data?.totalEarnings || 0
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBid = (load) => {
        console.log('Bid button clicked for load:', load);
        setSelectedLoad(load);
        setBidAmount('');
        setBidNote('');
        setShowBidModal(true);
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
            setShowBidModal(false);
            setBidAmount('');
            setBidNote('');
            fetchDashboardData(); // Refresh data
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to place bid';
            alert(msg);
        } finally {
            setSubmittingBid(false);
        }
    };

    const handleShowContact = async (load) => {
        setSelectedLoad(load);
        setLoadingContact(true);
        setShowContactModal(true);
        
        try {
            // Record view first
            await api.post(`/loads/${load._id}/view`);
            
            // Get contact info
            const response = await api.post(`/loads/${load._id}/contact`);
            setContactInfo(response.data);
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to retrieve contact info';
            alert(msg);
            setShowContactModal(false);
        } finally {
            setLoadingContact(false);
        }
    };

    return (
        <div className="dashboard-container" style={{ padding: '2rem' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#F5F5F5', marginBottom: '0.5rem', textTransform: 'uppercase' }}>CARRIER DASHBOARD 🚛</h1>
                    <p style={{ color: '#B0B3B8' }}>Welcome back, {user?.name}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button onClick={() => navigate('/dashboard/loads')} className="btn-primary">
                        Find Loads
                    </button>
                    <button onClick={() => navigate('/dashboard/post-truck')} className="btn-secondary">
                        Post Truck
                    </button>
                    <button onClick={() => navigate('/dashboard/loads')} className="btn-outline">
                        Advanced Search
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard title="Active Jobs" value={stats.activeJobs} icon={Package} trend="+5%" />
                <StatCard title="My Trucks" value={stats.myTrucks} icon={Truck} />
                <StatCard title="Pending Bids" value={stats.pendingBids} icon={Clock} />
                <StatCard title="Total Earnings" value={`Rs ${stats.totalEarnings.toLocaleString()}`} icon={DollarSign} trend="+18%" />
            </div>

            {/* Available Loads Table */}
            <div className="dashboard-table-container">
                <div className="dashboard-table-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#F5F5F5', textTransform: 'uppercase' }}>AVAILABLE LOADS</h2>
                            <p style={{ color: '#B0B3B8', fontSize: '0.875rem', marginTop: '0.25rem' }}>Fresh opportunities - Act fast!</p>
                        </div>
                        <span className="status-badge status-open">
                            {loads.length} Loads Available
                        </span>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    {loading ? (
                        <div className="loading-state">Loading available loads...</div>
                    ) : loads.length === 0 ? (
                        <div className="empty-state">
                            <Truck size={48} />
                            <p>No loads available at the moment</p>
                        </div>
                    ) : (
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>AGE</th>
                                    <th>ROUTE</th>
                                    <th>RATE</th>
                                    <th>EQUIPMENT</th>
                                    <th>WEIGHT</th>
                                    <th>PICKUP</th>
                                    <th>CS/DTP</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loads.slice(0, 15).map(load => (
                                    <LoadRow key={load._id} load={load} onBid={handleBid} onShowContact={handleShowContact} />
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Contact Info Modal */}
            {showContactModal && selectedLoad && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowContactModal(false)}>
                    <div className="bg-slate-800 rounded-lg max-w-md w-full border border-slate-700" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-700">
                            <h2 className="text-2xl font-bold text-white">📞 Contact Details</h2>
                        </div>

                        <div className="p-6 space-y-4">
                            {loadingContact ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
                                    <p className="text-gray-400">Loading contact information...</p>
                                </div>
                            ) : contactInfo ? (
                                <>
                                    {/* Load Details */}
                                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                                        <p className="font-bold text-white mb-2">
                                            {selectedLoad.origin} <span className="text-[#D4AF37]">→</span> {selectedLoad.destination}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {selectedLoad.requiredVehicle} • {selectedLoad.weight || 'N/A'} tons • {selectedLoad.goodsType}
                                        </p>
                                        <p className="mt-2 text-[#D4AF37] font-bold">
                                            Offer: Rs {(selectedLoad.offerPrice || 0).toLocaleString()}
                                        </p>
                                        
                                        {/* Pickup Date */}
                                        {selectedLoad.pickupDate && (
                                            <p className="mt-2 text-sm text-gray-300">
                                                📅 Pickup: {new Date(selectedLoad.pickupDate).toLocaleDateString('en-US', { 
                                                    month: 'short', 
                                                    day: 'numeric', 
                                                    year: 'numeric' 
                                                })}
                                                {selectedLoad.pickupTime && ` at ${selectedLoad.pickupTime}`}
                                            </p>
                                        )}
                                        
                                        {/* Load Type */}
                                        {selectedLoad.loadType && selectedLoad.loadType !== 'Full' && (
                                            <p className="mt-1 text-sm">
                                                <span className="bg-[#D4AF37] text-[#0F1111] px-2 py-1 rounded text-xs font-bold">
                                                    {selectedLoad.loadType}
                                                </span>
                                            </p>
                                        )}
                                        
                                        {/* Dimensions */}
                                        {selectedLoad.dimensions && selectedLoad.dimensions.length && (
                                            <p className="mt-1 text-sm text-gray-400">
                                                📏 {selectedLoad.dimensions.length}' x {selectedLoad.dimensions.width}' x {selectedLoad.dimensions.height}'
                                            </p>
                                        )}
                                        
                                        {/* Special Requirements */}
                                        {selectedLoad.specialRequirements && Object.values(selectedLoad.specialRequirements).some(v => v) && (
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {selectedLoad.specialRequirements.hazmat && (
                                                    <span className="bg-red-900 text-red-200 px-2 py-1 rounded text-xs font-bold">⚠️ HAZMAT</span>
                                                )}
                                                {selectedLoad.specialRequirements.oversize && (
                                                    <span className="bg-orange-900 text-orange-200 px-2 py-1 rounded text-xs font-bold">📏 OVERSIZE</span>
                                                )}
                                                {selectedLoad.specialRequirements.teamDriver && (
                                                    <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs font-bold">👥 TEAM</span>
                                                )}
                                                {selectedLoad.specialRequirements.tarping && (
                                                    <span className="bg-slate-700 text-gray-200 px-2 py-1 rounded text-xs">Tarping</span>
                                                )}
                                                {selectedLoad.specialRequirements.liftgate && (
                                                    <span className="bg-slate-700 text-gray-200 px-2 py-1 rounded text-xs">Liftgate</span>
                                                )}
                                                {selectedLoad.specialRequirements.portEntry && (
                                                    <span className="bg-purple-900 text-purple-200 px-2 py-1 rounded text-xs font-bold">🚢 Port Entry</span>
                                                )}
                                            </div>
                                        )}
                                        
                                        {/* Load Notes */}
                                        {selectedLoad.loadNotes && (
                                            <div className="mt-3 p-2 bg-slate-800 rounded text-xs text-gray-300">
                                                <strong>Notes:</strong> {selectedLoad.loadNotes}
                                            </div>
                                        )}
                                    </div>

                                    {/* Contact Person */}
                                    <div className="bg-slate-900 p-4 rounded-lg border border-[#D4AF37]">
                                        <p className="text-sm text-gray-400 mb-1">Contact Person</p>
                                        <p className="text-xl font-bold text-white">{contactInfo.contact?.personName || 'N/A'}</p>
                                        {contactInfo.contact?.company && (
                                            <p className="text-sm text-gray-400 mt-1">{contactInfo.contact.company}</p>
                                        )}
                                    </div>

                                    {/* Mobile Number */}
                                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                                        <p className="text-sm text-gray-400 mb-2">Mobile Number</p>
                                        <p className="text-2xl font-bold text-[#D4AF37] mb-3">{contactInfo.contact?.mobile || 'N/A'}</p>
                                        <a
                                            href={`tel:${contactInfo.contact?.mobile}`}
                                            className="block w-full px-6 py-3 bg-[#D4AF37] text-[#0F1111] font-bold rounded-lg hover:bg-[#C9A532] transition text-center"
                                        >
                                            📱 Call Now
                                        </a>
                                    </div>

                                    {/* WhatsApp */}
                                    {contactInfo.contact?.whatsapp && (
                                        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                                            <p className="text-sm text-gray-400 mb-2">WhatsApp</p>
                                            <p className="text-lg font-bold text-white mb-3">{contactInfo.contact.whatsapp}</p>
                                            <a
                                                href={`https://wa.me/${contactInfo.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition text-center"
                                            >
                                                💬 Open WhatsApp
                                            </a>
                                        </div>
                                    )}

                                    {/* Analytics */}
                                    {contactInfo.analytics && (
                                        <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
                                            <p className="text-xs text-gray-500">
                                                {contactInfo.analytics.viewCount} views • {contactInfo.analytics.contactViewCount} contacts revealed
                                            </p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-4 text-gray-400">
                                    No contact information available
                                </div>
                            )}

                            {/* Close Button */}
                            <div className="pt-4">
                                <button
                                    onClick={() => setShowContactModal(false)}
                                    className="w-full px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bid Modal */}
            {showBidModal && selectedLoad && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowBidModal(false)}>
                    <div className="bg-slate-800 rounded-lg max-w-md w-full border border-slate-700" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-700">
                            <h2 className="text-2xl font-bold text-white">Place Bid</h2>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Load Details */}
                            <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                                <p className="font-bold text-white mb-2">
                                    {selectedLoad.origin} <span className="text-[#D4AF37]">→</span> {selectedLoad.destination}
                                </p>
                                <p className="text-sm text-gray-400">
                                    {selectedLoad.requiredVehicle} • {selectedLoad.weight || 'N/A'} tons • {selectedLoad.goodsType}
                                </p>
                                <p className="mt-2 text-[#D4AF37] font-bold">
                                    Shipper Offer: Rs {(selectedLoad.offerPrice || 0).toLocaleString()}
                                </p>
                            </div>

                            {/* Bid Amount */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Your Bid Amount (Rs) *</label>
                                <input
                                    type="number"
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(e.target.value)}
                                    placeholder="e.g. 90000"
                                    className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-700 rounded-lg focus:border-[#D4AF37] focus:outline-none"
                                />
                            </div>

                            {/* Note */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">Note (Optional)</label>
                                <textarea
                                    value={bidNote}
                                    onChange={(e) => setBidNote(e.target.value)}
                                    placeholder="I can pick it up tomorrow..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-900 text-white border border-slate-700 rounded-lg focus:border-[#D4AF37] focus:outline-none"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowBidModal(false)}
                                    disabled={submittingBid}
                                    className="flex-1 px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitBid}
                                    disabled={submittingBid}
                                    className="flex-1 px-6 py-3 bg-[#D4AF37] text-[#0F1111] font-bold rounded-lg hover:bg-[#C9A532] transition disabled:opacity-50"
                                >
                                    {submittingBid ? 'Submitting...' : 'Submit Bid'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarrierDashboard;
