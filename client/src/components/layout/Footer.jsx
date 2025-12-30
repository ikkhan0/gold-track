import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-grid">
                    {/* Brand Column */}
                    <div>
                        <Link to="/" className="footer-brand-logo">
                            <Truck size={32} />
                            <span>GOLD<span className="footer-brand-highlight">TRACK</span></span>
                        </Link>
                        <p className="footer-brand-description">
                            Pakistan's #1 Digital Logistics Platform. We connect shippers with reliable carriers for efficient, transparent, and secure cargo movement across the nation.
                        </p>
                        <div className="footer-social-links">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="footer-social-link">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Services Column */}
                    <div>
                        <h3 className="footer-column-title">Services</h3>
                        <ul className="footer-links-list">
                            <li><Link to="/services/ftl" className="footer-link">Full Truckload (FTL)</Link></li>
                            <li><Link to="/services/ltl" className="footer-link">Part Load (LTL)</Link></li>
                            <li><Link to="/services/car-moving" className="footer-link">Car Moving</Link></li>
                            <li><Link to="/services/packers-movers" className="footer-link">Packers & Movers</Link></li>
                            <li><Link to="/services/car-towing" className="footer-link">Car Towing</Link></li>
                            <li><Link to="/services/container-transport" className="footer-link">Container Transport</Link></li>
                        </ul>
                    </div>

                    {/* Quick Links Column */}
                    <div>
                        <h3 className="footer-column-title">Platform</h3>
                        <ul className="footer-links-list">
                            {[
                                { name: 'Load Board', link: '/loads' },
                                { name: 'Market Rates', link: '/market-rates' },
                                { name: 'How It Works', link: '/how-it-works' },
                                { name: 'For Carriers', link: '/register' },
                                { name: 'For Shippers', link: '/register' },
                                { name: 'Help Center', link: '/help' }
                            ].map(item => (
                                <li key={item.name}>
                                    <Link to={item.link} className="footer-link">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h3 className="footer-column-title">Contact</h3>
                        <ul className="footer-contact-list">
                            <li className="footer-contact-item">
                                <MapPin className="footer-contact-icon" size={20} />
                                <span>
                                    GoldTrack Logistics Hub<br />
                                    Main Shahrah-e-Faisal<br />
                                    Karachi, Pakistan
                                </span>
                            </li>
                            <li className="footer-contact-item">
                                <Phone className="footer-contact-icon" size={20} />
                                <span>+92 300 1234567</span>
                            </li>
                            <li className="footer-contact-item">
                                <Mail className="footer-contact-icon" size={20} />
                                <span>support@goldtrack.pk</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} GoldTrack.pk. All rights reserved.</p>
                    <div className="footer-bottom-links">
                        <Link to="/privacy" className="footer-bottom-link">Privacy Policy</Link>
                        <Link to="/terms" className="footer-bottom-link">Terms of Service</Link>
                        <Link to="/contact" className="footer-bottom-link">Contact</Link>
                    </div>
                    <div className="footer-made-in-pk">
                        <span>Made in Pakistan</span>
                        <span>🇵🇰</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
