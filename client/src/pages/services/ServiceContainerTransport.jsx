import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const ServiceContainerTransport = () => {
    return (
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
            <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
                        CONTAINER TRANSPORT SERVICES
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-body)', maxWidth: '42rem', margin: '0 auto' }}>
                        Professional 20ft and 40ft container transport from Karachi ports to all major cities.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                    {[
                        { title: '3-Point Export Hauling', desc: 'Yard pickup → Port → Empty return' },
                        { title: '3-Point Import Hauling', desc: 'Port pickup → Destination → Empty return' },
                        { title: 'Port Shuttling', desc: 'Container movements within port area' },
                        { title: 'Skilled Drivers', desc: 'Experienced in container handling' }
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
                        Container Sizes & Pricing
                    </h2>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {[
                            { size: '20ft Standard Container', route: 'Karachi Port - Lahore', price: 'PKR 85,000 - 95,000' },
                            { size: '40ft Standard Container', route: 'Karachi Port - Islamabad', price: 'PKR 130,000 - 145,000' },
                            { size: '40ft High Cube', route: 'Karachi Port - Faisalabad', price: 'PKR 140,000 - 155,000' },
                            { size: 'Port Shuttling (within port)', route: 'Karachi Port / Port Qasim', price: 'PKR 8,000 - 12,000' }
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div>
                                    <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '0.25rem' }}>{item.size}</h4>
                                    <p style={{ color: 'var(--text-body)', fontSize: '0.875rem' }}>{item.route}</p>
                                </div>
                                <span style={{ color: 'var(--primary-gold)', fontWeight: 700, fontSize: '1.125rem' }}>{item.price}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card" style={{ padding: '2rem', marginBottom: '3rem', background: 'rgba(0, 77, 64, 0.1)', border: '1px solid rgba(0, 77, 64, 0.3)' }}>
                    <h3 style={{ color: 'var(--secondary-green)', fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 700 }}>
                        Ports We Serve
                    </h3>
                    <ul style={{ color: 'var(--text-body)', lineHeight: 2, listStyle: 'none', paddingLeft: 0 }}>
                        <li>✓ Karachi Port</li>
                        <li>✓ Port Qasim</li>
                        <li>✓ All Inland Container Depots (ICDs)</li>
                    </ul>
                </div>

                <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '1rem', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                    <h3 style={{ color: 'white', fontSize: '1.75rem', marginBottom: '1rem', fontWeight: 700 }}>
                        Request Container Transport Service
                    </h3>
                    <p style={{ color: 'var(--text-body)', marginBottom: '2rem' }}>
                        Import/export container hauling with professional service
                    </p>
                    <Link to="/register">
                        <Button variant="primary" style={{ padding: '1rem 2.5rem' }}>Get Quote</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ServiceContainerTransport;
