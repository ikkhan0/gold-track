import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../context/I18nContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Tabs from '../components/ui/Tabs';
import Accordion from '../components/ui/Accordion';
import { MapPin, Truck, DollarSign, ShieldCheck, Package } from 'lucide-react';

import heroLuxury from '../assets/hero-luxury.png';
import './Home.css';

const Home = () => {
    const { t } = useI18n();
    const [searchTab, setSearchTab] = useState('loads');

    const searchTabs = [
        {
            id: 'loads',
            label: 'Quick Rate Check',
            icon: <DollarSign size={16} />,
            content: (
                <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="quick-rate-inputs" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Input placeholder="Origin (City)" icon={<MapPin size={18} />} />
                        <Input placeholder="Destination (City)" icon={<MapPin size={18} />} />
                    </div>
                    <select>
                        <option value="">Vehicle Type</option>
                        <option value="mazda">Mazda</option>
                        <option value="shehzore">Shehzore</option>
                        <option value="flatbed">Flatbed</option>
                    </select>
                    <Button variant="primary">Check Rates Instantly</Button>
                </form>
            )
        },
        {
            id: 'trucks',
            label: 'Find a Truck',
            icon: <Truck size={16} />,
            content: (
                <div style={{ textAlign: 'center', padding: '1rem', border: '1px solid rgba(212, 175, 55, 0.3)', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '0.5rem' }}>
                    <p style={{ fontWeight: 500, color: 'var(--primary-gold)', marginBottom: '1rem' }}>Priority Truck Booking</p>
                    <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                        <Input placeholder="Pickup Location" icon={<MapPin size={18} />} />
                        <Button variant="primary">Search Available Trucks</Button>
                    </form>
                </div>
            )
        }
    ];

    const faqItems = [
        { title: "How do I book a truck?", content: "Simply create an account, post your load details featuring pickup and dropoff locations, and wait for verified carriers to bid. You can choose the best quote." },
        { title: "Is my payment secure?", content: "Yes, GoldTrack uses a secure escrow system. We hold the payment until you confirm the safe delivery of your goods." },
        { title: "Are the carriers verified?", content: "Absolutely. Every carrier on our platform undergoes a strict verification process including CNIC and Driver's License checks." },
        { title: "What types of trucks are available?", content: "We have a wide range of vehicles including Mazda, Shehzore, Flatbeds, 22-Wheelers, and specialized car carriers." }
    ];

    return (
        <div className="home-wrapper">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-bg">
                    <img src={heroLuxury} alt="Premium Logistics Network" />
                    <div className="hero-gradient-main"></div>
                    <div className="hero-gradient-bottom"></div>
                </div>

                <div className="container hero-content-wrapper">
                    {/* Hero Text */}
                    <div className="hero-text">
                        <div className="hero-badge animate-fade-in">
                            <span className="hero-badge-dot"></span>
                            <span className="hero-badge-text">Pakistan's Premium Freight Network</span>
                        </div>

                        <h1 className="hero-title animate-slide-up">
                            MOVE FREIGHT <br />
                            <span className="hero-title-gradient">WITH PRECISION</span>
                        </h1>

                        <p className="hero-description animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            Experience the gold standard in logistics. GoldTrack connects shippers with verified carriers for <span className="hero-description-highlight">guaranteed speed & security.</span>
                        </p>

                        <div className="hero-buttons animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <Link to="/register">
                                <Button variant="primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
                                    Get Started Now
                                </Button>
                            </Link>
                            <Link to="/market-rates">
                                <Button variant="outline" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
                                    View Market Rates
                                </Button>
                            </Link>
                        </div>

                        <div className="hero-trust-bar animate-fade-in" style={{ animationDelay: '0.4s' }}>
                            <p className="trust-bar-title">Trusted by Industry Leaders</p>
                            <div className="trust-bar-companies">
                                <span>Karachi Port Trust</span>
                                <span>Pakistan Railways</span>
                                <span>National Logistics Cell</span>
                                <span>Faisalabad Traders</span>
                            </div>
                        </div>
                    </div>

                    {/* Search Widget */}
                    <div className="search-widget animate-slide-up" style={{ animationDelay: '0.3s' }}>
                        <div className="search-widget-glow"></div>
                        <div className="search-widget-card">
                            <div className="search-widget-inner">
                                <h3 className="search-widget-title">
                                    <span className="icon-gold">⚡</span> Quick Rate Check
                                </h3>
                                <Tabs
                                    tabs={searchTabs}
                                    defaultTab="loads"
                                    onTabChange={setSearchTab}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section container">
                <div className="features-header">
                    <h2 className="features-title">Why Choose GoldTrack.pk?</h2>
                    <p className="features-subtitle">The most reliable logistics network connecting shippers and carriers across Pakistan.</p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <Truck className="icon-gold" size={32} />
                        </div>
                        <h3 className="feature-title">Verified Carriers</h3>
                        <p className="feature-description">All trucks and drivers are verified via CNIC and License checks.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <ShieldCheck className="icon-gold" size={32} />
                        </div>
                        <h3 className="feature-title">Gold Priority</h3>
                        <p className="feature-description">Guaranteed delivery times for urgent shipments. Premium tracking included.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <DollarSign className="icon-gold" size={32} />
                        </div>
                        <h3 className="feature-title">Secure Escrow</h3>
                        <p className="feature-description">Transparent pricing. Pay safely through our escrow system.</p>
                    </div>
                </div>

                {/* Services Section */}
                <div className="services-section">
                    <div className="services-header">
                        <span className="services-label">Premium Logistics</span>
                        <h2 className="services-title">Our Services</h2>
                    </div>

                    <div className="services-grid">
                        {['Full Truckload (FTL)', 'Part Load (LTL)', 'Car Moving Services', 'Packers & Movers', 'Car Towing Services', 'Container Transport'].map((service, i) => (
                            <div key={i} className="service-card">
                                <div className="service-card-header">
                                    <div className="service-icon-wrapper">
                                        <Truck size={24} />
                                    </div>
                                    <span className="service-link">View Details →</span>
                                </div>
                                <h3 className="service-name">{service}</h3>
                                <p className="service-description">Reliable and efficient {service.toLowerCase()} across Pakistan.</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Loadboard CTA Section */}
            <section className="container" style={{ marginBottom: '4rem' }}>
                <div style={{
                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(0, 77, 64, 0.1) 100%)',
                    border: '2px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '1.5rem',
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    maxWidth: '56rem',
                    margin: '0 auto'
                }}>
                    <Package className="icon-gold" size={48} style={{ margin: '0 auto 1.5rem' }} />
                    <h2 style={{ color: 'white', fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase' }}>
                        Browse Available Loads
                    </h2>
                    <p style={{ color: 'var(--text-body)', fontSize: '1.125rem', marginBottom: '2.5rem', maxWidth: '40rem', margin: '0 auto 2.5rem' }}>
                        View active freight loads across Pakistan. Register to access full load details, submit competitive bids, and grow your business.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/loadboard">
                            <Button variant="primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
                                View Loadboard
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="outline" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
                                Register as Carrier
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="container" style={{ maxWidth: '56rem', paddingBottom: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 className="features-title" style={{ fontSize: '1.875rem' }}>Frequently Asked Questions</h2>
                    <p className="features-subtitle">Common questions about shipping and carrier services.</p>
                </div>
                <Accordion items={faqItems} />
            </section>
        </div>
    );
};

export default Home;
