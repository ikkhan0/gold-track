import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const ServicePackersMovers = () => {
    return (
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
            <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
                        PACKERS & MOVERS SERVICES
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-body)', maxWidth: '42rem', margin: '0 auto' }}>
                        End-to-end relocation solutions with professional packing and safe transportation.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                    {[
                        { title: 'Professional Packing', desc: 'Expert packing with quality materials' },
                        { title: 'Safe Transportation', desc: 'Modern fleet for secure moves' },
                        { title: 'Goods Insurance', desc: 'Comprehensive coverage option' },
                        { title: 'Trained Staff', desc: 'Experts in handling delicate items' },
                        { title: 'Free Materials', desc: 'Complimentary boxes and packing supplies' },
                        { title: 'Furniture Dismantling', desc: 'Expert dismantling and reassembly' }
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
                        Service Packages & Pricing
                    </h2>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {[
                            { pkg: 'Studio/1 Bedroom', details: 'Packing, loading, transport, unloading', price: 'PKR 25,000 - 35,000' },
                            { pkg: '2 Bedroom Apartment', details: 'Full service with furniture dismantling', price: 'PKR 40,000 - 55,000' },
                            { pkg: '3 Bedroom House', details: 'Complete relocation with insurance', price: 'PKR 60,000 - 80,000' },
                            { pkg: '4+ Bedroom / Villa', details: 'Premium service with specialized handling', price: 'PKR 90,000+' },
                            { pkg: 'Office Relocation', details: 'IT equipment, furniture, files', price: 'Custom Quote' }
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div>
                                    <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '0.25rem' }}>{item.pkg}</h4>
                                    <p style={{ color: 'var(--text-body)', fontSize: '0.875rem' }}>{item.details}</p>
                                </div>
                                <span style={{ color: 'var(--primary-gold)', fontWeight: 700, fontSize: '1.125rem' }}>{item.price}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '1rem', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                    <h3 style={{ color: 'white', fontSize: '1.75rem', marginBottom: '1rem', fontWeight: 700 }}>
                        Get Your Free Moving Quote
                    </h3>
                    <p style={{ color: 'var(--text-body)', marginBottom: '2rem' }}>
                        Professional relocation services tailored to your needs
                    </p>
                    <Link to="/register">
                        <Button variant="primary" style={{ padding: '1rem 2.5rem' }}>Request Quote</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ServicePackersMovers;
