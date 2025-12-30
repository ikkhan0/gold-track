import React from 'react';

const Privacy = () => {
    return (
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
            <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white', marginBottom: '1rem', textAlign: 'center' }}>
                    PRIVACY POLICY
                </h1>
                <p style={{ color: 'var(--text-body)', textAlign: 'center', marginBottom: '3rem', fontSize: '0.875rem' }}>
                    Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: 'var(--text-body)', lineHeight: 1.8 }}>
                    <section>
                        <h2 style={{ color: 'var(--primary-gold)', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                            1. Information We Collect
                        </h2>
                        <p>
                            GoldTrack.pk collects information you provide when registering (name, email, phone, CNIC, license details),
                            location data for shipment tracking, and transaction information for payment processing.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--primary-gold)', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                            2. How We Use Your Information
                        </h2>
                        <p>
                            We use your data to facilitate logistics services, verify carrier and shipper identities, process payments
                            through our secure escrow system, and provide customer support.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--primary-gold)', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                            3. Data Security
                        </h2>
                        <p>
                            GoldTrack employs industry-standard encryption and security measures to protect your personal information.
                            All payment transactions are processed through secure, PCI-compliant channels.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--primary-gold)', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                            4. Data Sharing
                        </h2>
                        <p>
                            We do not sell your personal information. Data is shared only with relevant parties (shippers/carriers)
                            to complete logistics transactions, and with payment processors for transaction completion.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--primary-gold)', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                            5. Your Rights
                        </h2>
                        <p>
                            You have the right to access, correct, or delete your personal data. Contact us at privacy@goldtrack.pk
                            to exercise these rights.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--primary-gold)', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                            6. Contact Us
                        </h2>
                        <p>
                            For privacy-related inquiries, contact us at:<br />
                            Email: privacy@goldtrack.pk<br />
                            Phone: +92 300 1234567
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
