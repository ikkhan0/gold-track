import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const ServiceLTL = () => {
    return (
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
            <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
                        PART LOAD (LTL) SERVICES
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-body)', maxWidth: '42rem', margin: '0 auto' }}>
                        Share truck space and save costs. Perfect for smaller shipments under 10 tons.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                    {[
                        { title: 'Cost Efficient', desc: 'Pay only for the space you use, shared logistics costs' },
                        { title: 'Flexible Shipping', desc: 'No minimum weight requirement, ship as little as 100kg' },
                        { title: 'Regular Routes', desc: 'Daily departures on major Pakistan routes' },
                        { title: 'Safe Handling', desc: 'Professional sorting and loading with cargo insurance' }
                    ].map((item, i) => (
                        <div key={i} className="card" style={{ padding: '2rem' }}>
                            <h3 style={{ color: 'var(--primary-gold)', fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 700 }}>
                                {item.title}
                            </h3>
                            <p style={{ color: 'var(--text-body)', lineHeight: 1.6 }}>{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="card" style={{ padding: '3rem', marginBottom: '4rem' }}>
                    <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '2rem', fontWeight: 700 }}>
                        Pricing by Weight
                    </h2>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {[
                            { weight: '100kg - 500kg', route: 'Karachi - Lahore', price: 'PKR 15/kg' },
                            { weight: '500kg - 2 Tons', route: 'Karachi - Islamabad', price: 'PKR 12/kg' },
                            { weight: '2 - 5 Tons', route: 'Karachi - Multan', price: 'PKR 10/kg' },
                            { weight: '5 - 10 Tons', route: 'Any Major Route', price: 'PKR 8/kg' }
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div>
                                    <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '0.25rem' }}>{item.weight}</h4>
                                    <p style={{ color: 'var(--text-body)', fontSize: '0.875rem' }}>{item.route}</p>
                                </div>
                                <span style={{ color: 'var(--primary-gold)', fontWeight: 700, fontSize: '1.125rem' }}>{item.price}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '1rem', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                    <h3 style={{ color: 'white', fontSize: '1.75rem', marginBottom: '1rem', fontWeight: 700 }}>
                        Ship Your Part Load Today
                    </h3>
                    <p style={{ color: 'var(--text-body)', marginBottom: '2rem' }}>
                        Get instant quotes for LTL shipments
                    </p>
                    <Link to="/register">
                        <Button variant="primary" style={{ padding: '1rem 2.5rem' }}>Get Quote Now</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ServiceLTL;
