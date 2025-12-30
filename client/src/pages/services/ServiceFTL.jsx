import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const ServiceFTL = () => {
    return (
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
            <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
                {/* Hero */}
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
                        FULL TRUCKLOAD (FTL) SERVICES
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-body)', maxWidth: '42rem', margin: '0 auto' }}>
                        Dedicated truck transportation for large shipments across Pakistan. Your goods, your truck, direct delivery.
                    </p>
                </div>

                {/* Features Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                    {[
                        { title: 'Dedicated Truck', desc: 'Exclusive vehicle for your cargo only, no shared space' },
                        { title: 'Faster Delivery', desc: 'Direct routes without stops for LTL pickups' },
                        { title: 'Bulk Discounts', desc: 'Cost-effective for shipments over 10+ tons' },
                        { title: 'Secure Transport', desc: 'Sealed trucks with GPS tracking and insurance' }
                    ].map((item, i) => (
                        <div key={i} className="card" style={{ padding: '2rem' }}>
                            <h3 style={{ color: 'var(--primary-gold)', fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 700 }}>
                                {item.title}
                            </h3>
                            <p style={{ color: 'var(--text-body)', lineHeight: 1.6 }}>{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Pricing */}
                <div className="card" style={{ padding: '3rem', marginBottom: '4rem' }}>
                    <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '2rem', fontWeight: 700 }}>
                        Vehicle Types & Capacity
                    </h2>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {[
                            { vehicle: 'Mazda T-3500 (Open)', capacity: '3.5 Tons', route: 'Karachi - Lahore', price: 'PKR 45,000 - 55,000' },
                            { vehicle: '10-Wheeler (22ft)', capacity: '15 Tons', route: 'Karachi - Islamabad', price: 'PKR 95,000 - 110,000' },
                            { vehicle: '40ft Trailer', capacity: '25 Tons', route: 'Karachi - Faisalabad', price: 'PKR 130,000 - 150,000' }
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div>
                                    <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '0.25rem' }}>{item.vehicle}</h4>
                                    <p style={{ color: 'var(--text-body)', fontSize: '0.875rem' }}>{item.capacity} • {item.route}</p>
                                </div>
                                <span style={{ color: 'var(--primary-gold)', fontWeight: 700, fontSize: '1.125rem' }}>{item.price}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '1rem', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                    <h3 style={{ color: 'white', fontSize: '1.75rem', marginBottom: '1rem', fontWeight: 700 }}>
                        Ready to Ship Your Full Truckload?
                    </h3>
                    <p style={{ color: 'var(--text-body)', marginBottom: '2rem' }}>
                        Post your load and get instant quotes from verified carriers
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link to="/register">
                            <Button variant="primary" style={{ padding: '1rem 2.5rem' }}>Post a Load</Button>
                        </Link>
                        <Link to="/market-rates">
                            <Button variant="outline" style={{ padding: '1rem 2.5rem' }}>View Market Rates</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceFTL;
