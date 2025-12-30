import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, MessageSquare, CheckCircle, Truck, PackageCheck } from 'lucide-react';
import Button from '../components/ui/Button';
import './HowItWorks.css';

const HowItWorks = () => {
    const steps = [
        {
            id: 1,
            title: "Post Your Load",
            desc: "Create a detailed load posting specifying pickup location, destination, cargo type, weight, and delivery timeline.",
            details: "Specify cargo type, weight, dimensions, special requirements, and preferred delivery dates",
            icon: <FileText size={32} />
        },
        {
            id: 2,
            title: "Market & Admin Notification",
            desc: "Your load is automatically reviewed by our system and broadcasted to verified carriers who match your requirements.",
            details: "Automated notifications sent to qualified carriers matching your route and equipment requirements",
            icon: <Search size={32} />
        },
        {
            id: 3,
            title: "Receive Competitive Quotes",
            desc: "Qualified carriers submit their best bids through our real-time auction-style bidding system.",
            details: "Compare carrier profiles, ratings, insurance coverage, and estimated delivery times",
            icon: <MessageSquare size={32} />
        },
        {
            id: 4,
            title: "Accept Best Offer",
            desc: "Compare quotes based on price, carrier ratings, and fleet quality, then select the best option for your needs.",
            details: "Direct communication with chosen carrier to finalize pickup schedule and special instructions",
            icon: <CheckCircle size={32} />
        },
        {
            id: 5,
            title: "Service Mobilization",
            desc: "The carrier dispatches the truck and begins the pickup process. You can track the status in real-time.",
            details: "GPS tracking, driver contact information, and estimated arrival times provided",
            icon: <Truck size={32} />
        },
        {
            id: 6,
            title: "Delivery & Closure",
            desc: "Cargo is delivered safely to the destination. Payments are released upon proof of delivery and service completion.",
            details: "Digital signatures, photos, and completion certificates with automatic invoicing",
            icon: <PackageCheck size={32} />
        }
    ];

    return (
        <div className="how-it-works-wrapper bg-dark">
            <div className="container">
                <div className="how-it-works-header">
                    <h1 className="how-it-works-title">SIMPLE STEPS TO MOVE YOUR CARGO</h1>
                    <p className="how-it-works-subtitle">
                        From posting your load to delivery completion - experience seamless logistics in 6 easy steps
                    </p>
                </div>

                <div className="timeline-container">
                    <div className="timeline-line"></div>

                    <div className="steps-list">
                        {steps.map((step, index) => (
                            <div key={step.id} className={`step-item ${index % 2 === 0 ? 'step-left' : 'step-right'}`}>
                                <div className="step-card card">
                                    <div className="step-card-bg-icon">{step.icon}</div>
                                    <div className="step-header">
                                        <div className="step-number">{step.id}</div>
                                        <h3 className="step-title">{step.title}</h3>
                                    </div>
                                    <p className="step-description">{step.desc}</p>
                                    <p className="step-details">{step.details}</p>
                                </div>

                                <div className="step-timeline-icon">{step.icon}</div>

                                <div className="step-spacer"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Why Choose Section */}
                <div className="why-choose-section">
                    <h2 className="section-title">WHY CHOOSE OUR PROCESS?</h2>
                    <div className="features-grid">
                        {[
                            { title: 'Transparent Pricing', desc: 'Competitive bidding ensures fair market rates' },
                            { title: 'Verified Network', desc: 'All carriers are screened and approved' },
                            { title: 'Real-time Tracking', desc: 'Monitor your shipment throughout the journey' },
                            { title: 'Secure Transactions', desc: 'Protected payments and insurance coverage' }
                        ].map((item, i) => (
                            <div key={i} className="feature-card card">
                                <h4 style={{ color: 'var(--primary-gold)', fontSize: '1.125rem', marginBottom: '0.5rem', fontWeight: 700 }}>{item.title}</h4>
                                <p style={{ color: 'var(--text-body)' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="cta-section">
                    <h3 className="cta-title">Ready to Ship Your Cargo?</h3>
                    <p className="cta-subtitle">Join thousands of businesses using GoldTrack.pk for reliable transportation</p>
                    <Link to="/register">
                        <Button variant="primary" style={{ padding: '1rem 3rem', fontSize: '1.125rem' }}>Post Your First Load</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
