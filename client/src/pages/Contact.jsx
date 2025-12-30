import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import contactSupportImg from '../assets/contact-support.png';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        }, 1000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="contact-wrapper bg-dark">
            <div className="container">
                <div className="contact-header">
                    <h1 className="contact-title">GET IN TOUCH</h1>
                    <p className="contact-subtitle">
                        Have questions? We're here to help. Reach out to Pakistan's premier freight network.
                    </p>
                </div>

                <div className="contact-grid">
                    {/* Contact Form */}
                    <div className="contact-form-section">
                        <div className="card" style={{ padding: '2.5rem' }}>
                            <h2 style={{ color: 'white', fontSize: '1.75rem', marginBottom: '1.5rem', fontWeight: 700 }}>
                                SEND US A MESSAGE
                            </h2>

                            {success ? (
                                <div className="success-message">
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                                    <h3 style={{ color: 'var(--primary-gold)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                                        Message Sent!
                                    </h3>
                                    <p style={{ color: 'var(--text-body)' }}>
                                        Thank you for contacting us. We'll get back to you within 24 hours.
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={() => setSuccess(false)}
                                        style={{ marginTop: '1.5rem' }}
                                    >
                                        Send Another Message
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="contact-form">
                                    <div className="form-row">
                                        <Input
                                            name="name"
                                            label="Full Name"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                        <Input
                                            name="email"
                                            label="Email Address"
                                            type="email"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-row">
                                        <Input
                                            name="phone"
                                            label="Phone Number"
                                            placeholder="0300-1234567"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                        <Input
                                            name="subject"
                                            label="Subject"
                                            placeholder="General Inquiry"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                                            Message
                                        </label>
                                        <textarea
                                            name="message"
                                            rows="5"
                                            placeholder="Tell us how we can help you..."
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            style={{ width: '100%' }}
                                        />
                                    </div>

                                    <Button
                                        variant="primary"
                                        type="submit"
                                        isLoading={loading}
                                        style={{ width: '100%', padding: '1rem', fontSize: '1.125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    >
                                        <Send size={20} /> Send Message
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="contact-info-section">
                        <div className="contact-info-card card">
                            <MapPin className="contact-icon" size={32} />
                            <h3 className="contact-info-title">Head Office</h3>
                            <p className="contact-info-text">
                                GoldTrack Logistics Hub<br />
                                Main Shahrah-e-Faisal<br />
                                Karachi, 75500, Pakistan
                            </p>
                        </div>

                        <div className="contact-info-card card">
                            <Phone className="contact-icon" size={32} />
                            <h3 className="contact-info-title">Phone Support</h3>
                            <p className="contact-info-text">
                                Customer Service: <a href="tel:+923001234567" className="contact-link">+92 300 1234567</a><br />
                                WhatsApp: <a href="https://wa.me/923001234567" className="contact-link">+92 300 1234567</a><br />
                                Toll-Free: 0800-GOLDTRACK
                            </p>
                        </div>

                        <div className="contact-info-card card">
                            <Mail className="contact-icon" size={32} />
                            <h3 className="contact-info-title">Email Support</h3>
                            <p className="contact-info-text">
                                General: <a href="mailto:support@goldtrack.pk" className="contact-link">support@goldtrack.pk</a><br />
                                Sales: <a href="mailto:sales@goldtrack.pk" className="contact-link">sales@goldtrack.pk</a><br />
                                Technical: <a href="mailto:tech@goldtrack.pk" className="contact-link">tech@goldtrack.pk</a>
                            </p>
                        </div>

                        <div className="contact-info-card card">
                            <Clock className="contact-icon" size={32} />
                            <h3 className="contact-info-title">Business Hours</h3>
                            <p className="contact-info-text">
                                Monday - Friday: 9:00 AM - 6:00 PM<br />
                                Saturday: 10:00 AM - 4:00 PM<br />
                                Sunday: Closed<br />
                                <span style={{ color: 'var(--primary-gold)', fontWeight: 600 }}>
                                    Emergency Support: 24/7
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Support Image Banner */}
                <div className="contact-image-section card" style={{ marginBottom: '3rem', overflow: 'hidden', padding: 0 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', alignItems: 'center', minHeight: '350px' }}>
                        <div style={{ padding: '3rem' }}>
                            <h2 style={{ color: 'var(--primary-gold)', fontSize: '2rem', marginBottom: '1rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                24/7 Dedicated Support
                            </h2>
                            <p style={{ color: 'var(--text-body)', fontSize: '1.125rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                                Our expert team is always ready to assist you with any logistics needs. From load posting to delivery tracking, we're here to ensure your freight moves smoothly across Pakistan.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <div>
                                    <div style={{ color: 'var(--primary-gold)', fontSize: '2rem', fontWeight: 700 }}>500+</div>
                                    <div style={{ color: 'var(--text-body)', fontSize: '0.875rem' }}>Daily Shipments</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--primary-gold)', fontSize: '2rem', fontWeight: 700 }}>1000+</div>
                                    <div style={{ color: 'var(--text-body)', fontSize: '0.875rem' }}>Verified Carriers</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--primary-gold)', fontSize: '2rem', fontWeight: 700 }}>15min</div>
                                    <div style={{ color: 'var(--text-body)', fontSize: '0.875rem' }}>Avg Response Time</div>
                                </div>
                            </div>
                        </div>
                        <div style={{
                            height: '100%',
                            background: `linear-gradient(135deg, rgba(0, 77, 64, 0.3) 0%, rgba(212, 175, 55, 0.3) 100%), url(${contactSupportImg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '2rem',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(135deg, rgba(0, 77, 64, 0.7) 0%, rgba(15, 17, 17, 0.8) 100%)'
                            }}></div>
                            <div style={{
                                position: 'relative',
                                textAlign: 'center',
                                zIndex: 1
                            }}>
                                <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎧</div>
                                <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                    We're Here to Help
                                </div>
                                <div style={{ color: 'var(--text-body)' }}>
                                    Expert Support Team
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Banner */}
                <div className="contact-cta">
                    <h3 style={{ color: 'white', fontSize: '1.75rem', marginBottom: '1rem', fontWeight: 700 }}>
                        Need Immediate Assistance?
                    </h3>
                    <p style={{ color: 'var(--text-body)', marginBottom: '2rem' }}>
                        Our customer support team is available 24/7 via WhatsApp for urgent inquiries
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer">
                            <Button variant="primary" style={{ padding: '1rem 2.5rem' }}>
                                📱 Chat on WhatsApp
                            </Button>
                        </a>
                        <Link to="/help">
                            <Button variant="outline" style={{ padding: '1rem 2.5rem' }}>
                                View FAQ
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
