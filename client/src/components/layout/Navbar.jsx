import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Truck, Globe } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import Button from '../ui/Button';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { t, toggleLanguage, language } = useI18n();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo */}
                <NavLink to="/" className="navbar-logo">
                    <Truck size={32} />
                    <span>GOLD<span className="navbar-logo-highlight">TRACK</span></span>
                </NavLink>

                {/* Desktop Nav */}
                <div className="navbar-desktop">
                    <NavLink to="/" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                        {t('nav.home')}
                    </NavLink>

                    {/* Services Dropdown */}
                    <div className="navbar-dropdown">
                        <button className="navbar-dropdown-button">
                            Services
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div className="navbar-dropdown-menu">
                            <NavLink to="/services/ftl" className="navbar-dropdown-item">
                                Full Truckload (FTL)
                            </NavLink>
                            <NavLink to="/services/ltl" className="navbar-dropdown-item">
                                Part Load (LTL)
                            </NavLink>
                            <NavLink to="/services/car-moving" className="navbar-dropdown-item">
                                Car Moving
                            </NavLink>
                            <NavLink to="/services/packers-movers" className="navbar-dropdown-item">
                                Packers & Movers
                            </NavLink>
                            <NavLink to="/services/car-towing" className="navbar-dropdown-item">
                                Car Towing
                            </NavLink>
                            <NavLink to="/services/container-transport" className="navbar-dropdown-item">
                                Container Transport
                            </NavLink>
                        </div>
                    </div>

                    <NavLink to="/how-it-works" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                        How It Works
                    </NavLink>
                    <NavLink to="/market-rates" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                        Market Rates
                    </NavLink>

                    <div className="navbar-divider"></div>

                    <div className="navbar-actions">
                        <button onClick={toggleLanguage} className="navbar-lang-button">
                            <Globe />
                            {language === 'en' ? 'UR' : 'EN'}
                        </button>
                        <NavLink to="/login">
                            <Button variant="ghost" className="navbar-login-btn">{t('nav.login')}</Button>
                        </NavLink>
                        <NavLink to="/register">
                            <Button variant="primary" className="navbar-register-btn">{t('nav.register')}</Button>
                        </NavLink>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button className="navbar-mobile-toggle" onClick={toggleMenu}>
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="navbar-mobile-menu animate-fade-in">
                    <div className="navbar-mobile-menu-content">
                        <NavLink to="/" onClick={toggleMenu} className="navbar-mobile-link">
                            {t('nav.home')}
                        </NavLink>
                        <div className="navbar-mobile-services">
                            <span className="navbar-mobile-services-title">Services</span>
                            {['Full Truckload', 'Car Moving', 'Packers & Movers'].map(item => (
                                <NavLink key={item} to="#" className="navbar-mobile-service-link">{item}</NavLink>
                            ))}
                        </div>
                        <NavLink to="/how-it-works" onClick={toggleMenu} className="navbar-mobile-link">
                            How It Works
                        </NavLink>

                        <div className="navbar-mobile-actions">
                            <button onClick={toggleLanguage} className="navbar-mobile-lang">
                                <Globe />
                                Switch to {language === 'en' ? 'Urdu' : 'English'}
                            </button>
                            <NavLink to="/login" onClick={toggleMenu} style={{ width: '100%' }}>
                                <Button variant="outline" style={{ width: '100%', textTransform: 'uppercase' }}>{t('nav.login')}</Button>
                            </NavLink>
                            <NavLink to="/register" onClick={toggleMenu} style={{ width: '100%' }}>
                                <Button variant="primary" style={{ width: '100%', textTransform: 'uppercase', fontWeight: 700 }}>{t('nav.register')}</Button>
                            </NavLink>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
