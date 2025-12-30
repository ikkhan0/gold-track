import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { MapPin, Package, Truck, DollarSign } from 'lucide-react';
import api from '../../utils/api';
import { PAKISTAN_CITIES, ALL_VEHICLES, GOODS_TYPES } from '../../constants/data';

const PostLoad = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        origin: '', destination: '', goodsType: '', weight: '',
        requiredVehicle: 'Any', offerPrice: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/loads', formData);
            navigate('/dashboard/loads');
        } catch (error) {
            alert('Failed to post load. Ensure you are logged in as a Shipper.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'white', marginBottom: '1.5rem' }}>Post a New Load</h1>
            <Card className="p-8 bg-card">
                <form style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} onSubmit={handleSubmit}>

                    <div className="form-row">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h3 style={{ fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MapPin className="icon-gold" size={20} /> Route Details
                            </h3>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                                    Origin City
                                </label>
                                <select
                                    value={formData.origin}
                                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                                    required
                                    style={{ width: '100%' }}
                                >
                                    <option value="">Select Origin</option>
                                    {PAKISTAN_CITIES.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                                    Destination City
                                </label>
                                <select
                                    value={formData.destination}
                                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                    required
                                    style={{ width: '100%' }}
                                >
                                    <option value="">Select Destination</option>
                                    {PAKISTAN_CITIES.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h3 style={{ fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Package className="icon-gold" size={20} /> Cargo Details
                            </h3>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                                    Goods Type
                                </label>
                                <select
                                    value={formData.goodsType}
                                    onChange={(e) => setFormData({ ...formData, goodsType: e.target.value })}
                                    required
                                    style={{ width: '100%' }}
                                >
                                    <option value="">Select Goods Type</option>
                                    {GOODS_TYPES.map(goods => (
                                        <option key={goods.value} value={goods.label}>{goods.icon} {goods.label}</option>
                                    ))}
                                </select>
                            </div>
                            <Input
                                type="number"
                                label="Weight (Tons)"
                                placeholder="e.g. 15"
                                value={formData.weight}
                                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row" style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h3 style={{ fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Truck className="icon-gold" size={20} /> Vehicle & Rate
                            </h3>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                                    Required Vehicle
                                </label>
                                <select
                                    value={formData.requiredVehicle}
                                    onChange={(e) => setFormData({ ...formData, requiredVehicle: e.target.value })}
                                    style={{ width: '100%' }}
                                >
                                    <option>Any</option>
                                    {ALL_VEHICLES.map(vehicle => (
                                        <option key={vehicle.value} value={vehicle.label}>{vehicle.label}</option>
                                    ))}
                                </select>
                            </div>
                            <Input
                                type="number"
                                label="Offer Price (Rs)"
                                placeholder="Optional"
                                icon={<DollarSign size={16} />}
                                value={formData.offerPrice}
                                onChange={(e) => setFormData({ ...formData, offerPrice: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <Button variant="outline" type="button" onClick={() => navigate('/dashboard')}>Cancel</Button>
                        <Button variant="primary" style={{ padding: '0.75rem 2rem' }} isLoading={loading}>Post Load Now</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default PostLoad;
