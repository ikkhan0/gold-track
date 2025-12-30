import React from 'react';

const Help = () => {
    return (
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
            <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white', marginBottom: '1rem', textAlign: 'center' }}>
                    HELP CENTER
                </h1>
                <p style={{ color: 'var(--text-body)', textAlign: 'center', marginBottom: '3rem', fontSize: '1.125rem' }}>
                    Find answers to common questions about GoldTrack.pk
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {[
                        {
                            q: "How do I create an account?",
                            a: "Click 'Register' in the navigation, select your role (Carrier, Shipper, or Owner Operator), fill in your details, and submit. Your account will be activated after admin approval."
                        },
                        {
                            q: "How long does account approval take?",
                            a: "Account approval typically takes 24-48 hours. You'll receive an email notification once your account is approved."
                        },
                        {
                            q: "How do I post a load?",
                            a: "After logging in as a Shipper, go to Dashboard > Post Load, fill in the origin, destination, goods type, weight, and vehicle requirements, then submit."
                        },
                        {
                            q: "How do I find available loads?",
                            a: "After logging in as a Carrier, navigate to Dashboard > Find Loads. Use the filters to search by city, vehicle type, or weight."
                        },
                        {
                            q: "What payment methods are accepted?",
                            a: "GoldTrack uses a secure escrow system. Payment is held until delivery confirmation. We accept bank transfers and online payment methods."
                        },
                        {
                            q: "How do I track my shipment?",
                            a: "Real-time GPS tracking is available for all Gold Priority shipments. You can track from your Dashboard under 'My Shipments'."
                        }
                    ].map((item, i) => (
                        <div key={i} className="card" style={{ padding: '1.5rem' }}>
                            <h3 style={{ color: 'white', fontSize: '1.125rem', marginBottom: '0.75rem', fontWeight: 600 }}>
                                {item.q}
                            </h3>
                            <p style={{ color: 'var(--text-body)', lineHeight: 1.6 }}>
                                {item.a}
                            </p>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '3rem', textAlign: 'center', padding: '2rem', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '0.75rem', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                    <p style={{ color: 'var(--text-body)', marginBottom: '1rem' }}>
                        Still need help? Our support team is available 24/7
                    </p>
                    <a href="/contact" className="btn btn-primary">
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Help;
