import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const ServiceCarMoving = () => {
    return (
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
            <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
                        CAR MOVING SERVICES
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-body)', maxWidth: '42rem', margin: '0 auto' }}>
                        Professional car carrier services across Pakistan. Safe vehicle transport with 4-5 days delivery.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                    {[
                        { title: 'Shared Car-Carrier', desc: 'Cost-effective transportation using secure shared trailers' },
                        { title: 'Door-to-Door & Yard-to-Yard', desc: 'Flexible pickup and delivery options' },
                        { title: 'Transit Insurance', desc: 'Optional comprehensive coverage during transport' },
                        { title: '4-5 Days Delivery', desc: 'Reliable delivery between major Pakistani cities' }
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
                        Vehicle Types & Pricing
                    </h2>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {[
                            { type: 'Mini Vehicles (Alto, Passo)', route: 'Karachi - Lahore', price: 'PKR 22,000 - 25,000' },
                            { type: 'Hatchbacks (Cultus, Swift)', route: 'Karachi - Islamabad', price: 'PKR 26,000 - 30,000' },
                            { type: 'Sedans (Civic, Corolla)', route: 'Karachi - Lahore', price: 'PKR 30,000 - 35,000' },
                            { type: 'SUVs (Fortuner, Prado)', route: 'Karachi - Islamabad', price: 'PKR 40,000 - 50,000' }
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div>
                                    <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '0.25rem' }}>{item.type}</h4>
                                    <p style={{ color: 'var(--text-body)', fontSize: '0.875rem' }}>{item.route}</p>
                                </div>
                                <span style={{ color: 'var(--primary-gold)', fontWeight: 700, fontSize: '1.125rem' }}>{item.price}</span>
                            </div>
                        ))}
                    </div>
                    <p style={{ color: 'var(--text-body)', fontSize: '0.875rem', marginTop: '1.5rem', fontStyle: 'italic' }}>
                        *Rates may vary based on route and season
                    </p>
                </div>

                <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '1rem', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                    <h3 style={{ color: 'white', fontSize: '1.75rem', marginBottom: '1rem', fontWeight: 700 }}>
                        Book Your Car Transport
                    </h3>
                    <p style={{ color: 'var(--text-body)', marginBottom: '2rem' }}>
                        Safe and secure vehicle transportation across Pakistan
                    </p>
                    <Link to="/register">
                        <Button variant="primary" style={{ padding: '1rem 2.5rem' }}>Get Quote</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ServiceCarMoving;
