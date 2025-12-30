import React from 'react';

const Terms = () => {
    return (
        <div className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
            <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white', marginBottom: '1rem', textAlign: 'center' }}>
                    TERMS OF SERVICE
                </h1>
                <p style={{ color: 'var(--text-body)', textAlign: 'center', marginBottom: '3rem', fontSize: '0.875rem' }}>
                    Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: 'var(--text-body)', lineHeight: 1.8 }}>
                    <section>
                        <h2 style={{ color: 'var(--primary-gold)', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                            1. Acceptance of Terms
                        </h2>
                        <p>
                            By accessing and using GoldTrack.pk, you accept and agree to be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use our platform.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--primary-gold)', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                            2. User Accounts
                        </h2>
                        <p>
                            Users must provide accurate information during registration. Carriers must provide valid CNIC and
                            driver's license details. Account approval is at GoldTrack's discretion. Users are responsible for
                            maintaining account security.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--primary-gold)', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                            3. Platform Usage
                        </h2>
                        <p>
                            GoldTrack is a marketplace connecting shippers and carriers. We do not own vehicles or provide
                            transportation services directly. Users must comply with all applicable laws and regulations.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--primary-gold)', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                            4. Payments & Escrow
                        </h2>
                        <p>
                            All payments are processed through GoldTrack's secure escrow system. Payment is released to carriers
                            upon confirmed delivery. GoldTrack charges a service fee as outlined in our pricing policy.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--primary-gold)', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                            5. Liability & Disputes
                        </h2>
                        <p>
                            GoldTrack acts as a facilitator and is not liable for cargo damage or loss. Carriers must maintain
                            appropriate insurance. Disputes between users should be resolved directly; GoldTrack provides mediation
                            support upon request.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--primary-gold)', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                            6. Termination
                        </h2>
                        <p>
                            GoldTrack reserves the right to suspend or terminate accounts for violations of these terms, fraudulent
                            activity, or at our discretion.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--primary-gold)', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                            7. Governing Law
                        </h2>
                        <p>
                            These terms are governed by the laws of Pakistan. Any disputes shall be resolved in the courts of Karachi.
                        </p>
                    </section>

                    <section>
                        <h2 style={{ color: 'var(--primary-gold)', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                            8. Contact
                        </h2>
                        <p>
                            For questions about these terms, contact us at legal@goldtrack.pk
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms;
