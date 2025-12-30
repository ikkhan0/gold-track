import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const ServiceCarTowing = () => {
    return (
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
            <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
                        CAR TOWING SERVICES
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-body)', maxWidth: '42rem', margin: '0 auto' }}>
                        24/7 emergency car towing, luxury car transport, and roadside assistance across Pakistan.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                    {[
                        { title: '24/7 Emergency Service', desc: 'Round-the-clock emergency towing across Pakistan' },
                        { title: 'Safe & Secure', desc: 'Enclosed carriers for luxury vehicles' },
                        { title: 'Roadside Assistance', desc: 'Battery jump, tire change, fuel delivery' },
                        { title: 'Modern Fleet', desc: 'Latest flatbed and enclosed carriers' },
                        { title: 'Expert Operators', desc: 'Trained professionals with years of experience' },
                        { title: 'Quick Response', desc: '30-45 minutes response time in major cities' }
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
                        Towing Services & Pricing
                    </h2>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {[
                            { service: 'Emergency Breakdown Towing', details: '24/7 service within city', price: 'PKR 3,000 - 5,000' },
                            { service: 'Luxury Car Towing', details: 'Enclosed carrier, GPS tracking', price: 'PKR 8,000 - 15,000' },
                            { service: 'Flatbed Towing (Inter-city)', details: 'Karachi - Lahore', price: 'PKR 25,000 - 35,000' },
                            { service: 'Motorcycle Towing', details: 'Within city limits', price: 'PKR 1,500 - 2,500' },
                            { service: 'Roadside Assistance', details: 'Jump-start, tire change, fuel', price: 'PKR 1,000 - 2,000' }
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div>
                                    <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '0.25rem' }}>{item.service}</h4>
                                    <p style={{ color: 'var(--text-body)', fontSize: '0.875rem' }}>{item.details}</p>
                                </div>
                                <span style={{ color: 'var(--primary-gold)', fontWeight: 700, fontSize: '1.125rem' }}>{item.price}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card" style={{ padding: '2rem', marginBottom: '3rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    <h3 style={{ color: '#fca5a5', fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 700 }}>
                        Emergency Breakdown? Call Now!
                    </h3>
                    <p style={{ color: 'var(--text-body)', fontSize: '1.5rem', fontWeight: 700 }}>
                        📞 +92 300 1234567 (24/7)
                    </p>
                </div>

                <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '1rem', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                    <h3 style={{ color: 'white', fontSize: '1.75rem', marginBottom: '1rem', fontWeight: 700 }}>
                        Need Towing Service?
                    </h3>
                    <p style={{ color: 'var(--text-body)', marginBottom: '2rem' }}>
                        Fast, reliable, and professional vehicle recovery
                    </p>
                    <Link to="/contact">
                        <Button variant="primary" style={{ padding: '1rem 2.5rem' }}>Request Towing</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ServiceCarTowing;
