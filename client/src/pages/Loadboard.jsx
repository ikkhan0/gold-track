import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Truck, Package, MapPin, TrendingUp } from 'lucide-react';
import './Loadboard.css';

const Loadboard = () => {
    // Sample teaser loads (limited info to encourage registration)
    const teaserLoads = [
        { id: 1, origin: 'Karachi', destination: 'Lahore', weight: '15 Tons', vehicle: '40ft Container', status: 'Active', bids: 5 },
        { id: 2, origin: 'Lahore', destination: 'Islamabad', weight: '8 Tons', vehicle: 'Mazda T-3500', status: 'Active', bids: 3 },
        { id: 3, origin: 'Faisalabad', destination: 'Karachi', weight: '20 Tons', vehicle: '10-Wheeler', status: 'Active', bids: 7 },
        { id: 4, origin: 'Multan', destination: 'Peshawar', weight: '5 Tons', vehicle: 'Shehzore', status: 'Active', bids: 2 },
        { id: 5, origin: 'Islamabad', destination: 'Quetta', weight: '12 Tons', vehicle: '22ft Truck', status: 'Active', bids: 4 },
        { id: 6, origin: 'Karachi', destination: 'Faisalabad', weight: '18 Tons', vehicle: '40ft Trailer', status: 'Active', bids: 6 },
    ];

    return (
        <div className="loadboard-wrapper bg-dark">
            <div className="container">
                {/* Hero Section */}
                <div className="loadboard-hero">
                    <h1 className="loadboard-title">
                        🚚 GOLDTRACK.PK LOADBOARD
                    </h1>
                    <p className="loadboard-subtitle">
                        Find Available Freight Across Pakistan
                    </p>
                    <p className="loadboard-description">
                        Browse FTL and LTL loads with bidding opportunities. Register as a carrier or owner-operator to start bidding and grow your business.
                    </p>
                </div>

                {/* Stats Bar */}
                <div className="loadboard-stats">
                    <div className="stat-item">
                        <Truck className="stat-icon" size={32} />
                        <div className="stat-value">500+</div>
                        <div className="stat-label">Active Loads</div>
                    </div>
                    <div className="stat-item">
                        <Package className="stat-icon" size={32} />
                        <div className="stat-value">1000+</div>
                        <div className="stat-label">Verified Carriers</div>
                    </div>
                    <div className="stat-item">
                        <MapPin className="stat-icon" size={32} />
                        <div className="stat-value">50+</div>
                        <div className="stat-label">Cities Covered</div>
                    </div>
                    <div className="stat-item">
                        <TrendingUp className="stat-icon" size={32} />
                        <div className="stat-value">95%</div>
                        <div className="stat-label">Success Rate</div>
                    </div>
                </div>

                {/* Teaser Loads - Blurred for non-registered users */}
                <div className="loads-teaser-section">
                    <h2 className="section-title">RECENT LOAD POSTINGS</h2>
                    <div className="loads-grid">
                        {teaserLoads.map((load) => (
                            <div key={load.id} className="load-teaser-card card">
                                <div className="load-header">
                                    <div className="load-route">
                                        <span className="route-origin">{load.origin}</span>
                                        <span className="route-arrow">→</span>
                                        <span className="route-destination">{load.destination}</span>
                                    </div>
                                    <span className="load-status">{load.status}</span>
                                </div>
                                <div className="load-details">
                                    <div className="load-detail-item">
                                        <span className="detail-label">Weight:</span>
                                        <span className="detail-value">{load.weight}</span>
                                    </div>
                                    <div className="load-detail-item">
                                        <span className="detail-label">Vehicle:</span>
                                        <span className="detail-value">{load.vehicle}</span>
                                    </div>
                                    <div className="load-detail-item">
                                        <span className="detail-label">Bids:</span>
                                        <span className="detail-value bids-count">{load.bids}</span>
                                    </div>
                                </div>
                                <div className="load-blur-overlay">
                                    <div className="blur-message">
                                        🔒 Register to view full details
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="loadboard-cta">
                    <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem', fontWeight: 700, textTransform: 'uppercase' }}>
                        Ready to Start Bidding?
                    </h2>
                    <p style={{ color: 'var(--text-body)', marginBottom: '2.5rem', fontSize: '1.125rem' }}>
                        Register now to access full load details, submit bids, and grow your freight business with GoldTrack.pk
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/register">
                            <Button variant="primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
                                Register as Carrier
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="outline" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
                                Register as Shipper
                            </Button>
                        </Link>
                    </div>
                    <p style={{ color: 'var(--text-body)', marginTop: '2rem', fontSize: '0.875rem' }}>
                        Already registered? <Link to="/login" style={{ color: 'var(--primary-gold)', fontWeight: 600 }}>Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Loadboard;
