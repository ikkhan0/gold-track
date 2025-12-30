import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { TrendingUp, TrendingDown, Minus, Filter } from 'lucide-react';
import { PAKISTAN_CITIES, ALL_VEHICLES } from '../constants/data';
import './MarketRates.css';

const MarketRates = () => {
    const [filters, setFilters] = useState({ origin: 'Karachi', destination: 'Lahore', vehicleType: 'Any' });

    // Market Rates Data (based on truckload.pk structure)
    const rates = [
        { lane: 'Karachi → Lahore', vehicle: '20ft Container', distance: '1,200 km', price: 'PKR 85,000 - 95,000', trend: 'up' },
        { lane: 'Karachi → Lahore', vehicle: '40ft Container', distance: '1,200 km', price: 'PKR 130,000 - 145,000', trend: 'stable' },
        { lane: 'Karachi → Islamabad', vehicle: '20ft Container', distance: '1,400 km', price: 'PKR 95,000 - 110,000', trend: 'up' },
        { lane: 'Karachi → Islamabad', vehicle: '40ft Container', distance: '1,400 km', price: 'PKR 145,000 - 165,000', trend: 'stable' },
        { lane: 'Lahore → Karachi', vehicle: 'Mazda T-3500', distance: '1,200 km', price: 'PKR 45,000 - 55,000', trend: 'down' },
        { lane: 'Lahore → Islamabad', vehicle: 'Shehzore (3 Tons)', distance: '350 km', price: 'PKR 25,000 - 30,000', trend: 'stable' },
        { lane: 'Multan → Karachi', vehicle: '10-Wheeler (22ft)', distance: '900 km', price: 'PKR 80,000 - 95,000', trend: 'up' },
        { lane: 'Faisalabad → Lahore', vehicle: 'Mazda T-3500', distance: '120 km', price: 'PKR 18,000 - 22,000', trend: 'stable' }
    ];

    return (
        <div className="market-rates-wrapper bg-dark">
            <div className="container">
                <div className="rates-header">
                    <h1 className="rates-title">MARKET RATES DASHBOARD</h1>
                    <p className="rates-subtitle">Track real-time trucking spot rates across major routes in Pakistan</p>
                </div>

                {/* Filter Bar */}
                <div className="filter-card card">
                    <div className="filter-grid">
                        <div className="filter-field">
                            <label className="filter-label">Origin</label>
                            <select
                                className="filter-select"
                                value={filters.origin}
                                onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
                            >
                                {PAKISTAN_CITIES.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-field">
                            <label className="filter-label">Destination</label>
                            <select
                                className="filter-select"
                                value={filters.destination}
                                onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                            >
                                {PAKISTAN_CITIES.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-field">
                            <label className="filter-label">Vehicle Type</label>
                            <select
                                className="filter-select"
                                value={filters.vehicleType}
                                onChange={(e) => setFilters({ ...filters, vehicleType: e.target.value })}
                            >
                                <option value="Any">Any Vehicle</option>
                                {ALL_VEHICLES.map(vehicle => (
                                    <option key={vehicle.value} value={vehicle.label}>{vehicle.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-button-wrapper">
                            <Button variant="primary" style={{ width: '100%', padding: '0.875rem 2rem' }}>
                                <Filter size={18} style={{ marginRight: '0.5rem' }} /> Filter
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Rates Table */}
                <div className="rates-list">
                    {rates.map((rate, idx) => (
                        <div key={idx} className="rate-card card">
                            <div className="rate-info">
                                <h3 className="rate-lane">{rate.lane}</h3>
                                <p className="rate-vehicle">{rate.vehicle} • {rate.distance}</p>
                            </div>

                            <div className="rate-pricing">
                                <div className="rate-price-box">
                                    <span className="rate-price">{rate.price}</span>
                                    <span className="rate-label">Spot Rate (Est.)</span>
                                </div>
                                <div className={`rate-trend ${rate.trend === 'up' ? 'trend-up' : rate.trend === 'down' ? 'trend-down' : 'trend-stable'}`}>
                                    {rate.trend === 'up' ? <TrendingUp size={20} /> :
                                        rate.trend === 'down' ? <TrendingDown size={20} /> : <Minus size={20} />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Disclaimer */}
                <div className="rates-disclaimer">
                    <strong>Disclaimer:</strong> Rates shown are estimates based on historical data and current market conditions. Actual rates may vary based on fuel prices, cargo specifics, seasonal demand, and carrier availability. For accurate quotes, please post your load.
                </div>

                {/* CTA */}
                <div className="rates-cta">
                    <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 700 }}>
                        Need Exact Pricing?
                    </h3>
                    <p style={{ color: 'var(--text-body)', marginBottom: '2rem' }}>
                        Post your load and receive competitive quotes from verified carriers
                    </p>
                    <Link to="/register">
                        <Button variant="primary" style={{ padding: '1rem 2.5rem' }}>Post a Load</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MarketRates;
