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
        requiredVehicle: 'Any', offerPrice: '',
        contactPersonName: '', contactMobile: '', contactWhatsApp: '',
        pickupDate: '', pickupTime: '', deliveryDate: '',
        loadType: 'Full', loadNotes: '',
        // Dimensions
        length: '', width: '', height: '',
        // Special requirements
        hazmat: false, oversize: false, teamDriver: false,
        tarping: false, liftgate: false
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Prepare payload with all fields
            const payload = {
                origin: formData.origin,
                destination: formData.destination,
                goodsType: formData.goodsType,
                weight: Number(formData.weight),
                requiredVehicle: formData.requiredVehicle,
                offerPrice: formData.offerPrice ? Number(formData.offerPrice) : undefined,
                contactPersonName: formData.contactPersonName,
                contactMobile: formData.contactMobile,
                contactWhatsApp: formData.contactWhatsApp || undefined,
                pickupDate: formData.pickupDate,
                pickupTime: formData.pickupTime || undefined,
                deliveryDate: formData.deliveryDate || undefined,
                loadType: formData.loadType,
                loadNotes: formData.loadNotes || undefined,
                // Dimensions (only send if at least one value exists)
                dimensions: (formData.length || formData.width || formData.height) ? {
                    length: formData.length ? Number(formData.length) : undefined,
                    width: formData.width ? Number(formData.width) : undefined,
                    height: formData.height ? Number(formData.height) : undefined
                } : undefined,
                // Special requirements
                specialRequirements: {
                    hazmat: formData.hazmat,
                    oversize: formData.oversize,
                    teamDriver: formData.teamDriver,
                    tarping: formData.tarping,
                    liftgate: formData.liftgate
                }
            };

            const response = await api.post('/loads', payload);
            alert('Load posted successfully!');
            navigate('/dashboard/my-postings');
        } catch (error) {
            console.error('Post load error:', error);
            const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to post load. Please try again.';
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'white', marginBottom: '1.5rem' }}>Post a New Load</h1>
            <Card className="p-8 bg-card">
                <form style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} onSubmit={handleSubmit}>

                    {/* Pickup & Delivery Section */}
                    <div className="form-row">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h3 style={{ fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                📅 Pickup & Delivery
                            </h3>
                            <Input
                                type="date"
                                label="Pickup Date *"
                                value={formData.pickupDate}
                                onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />
                            <Input
                                type="time"
                                label="Pickup Time (Optional)"
                                placeholder="e.g. 09:00 AM"
                                value={formData.pickupTime}
                                onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h3 style={{ fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                🎯 Delivery (Optional)
                            </h3>
                            <Input
                                type="date"
                                label="Expected Delivery Date"
                                value={formData.deliveryDate}
                                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                                min={formData.pickupDate || new Date().toISOString().split('T')[0]}
                            />
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>
                                    Load Type
                                </label>
                                <select
                                    value={formData.loadType}
                                    onChange={(e) => setFormData({ ...formData, loadType: e.target.value })}
                                    style={{ width: '100%' }}
                                >
                                    <option value="Full">Full Truckload (FTL)</option>
                                    <option value="LTL">Less Than Truckload (LTL)</option>
                                    <option value="Partial">Partial Load</option>
                                </select>
                            </div>
                        </div>
                    </div>

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

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h3 style={{ fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                📞 Contact Details
                            </h3>
                            <Input
                                type="text"
                                label="Contact Person Name *"
                                placeholder="Ahmed Khan"
                                value={formData.contactPersonName}
                                onChange={(e) => setFormData({ ...formData, contactPersonName: e.target.value })}
                                required
                            />
                            <Input
                                type="tel"
                                label="Contact Mobile *"
                                placeholder="0300-1234567"
                                value={formData.contactMobile}
                                onChange={(e) => setFormData({ ...formData, contactMobile: e.target.value })}
                                required
                            />
                            <Input
                                type="tel"
                                label="WhatsApp Number (if different)"
                                placeholder="0300-1234567"
                                value={formData.contactWhatsApp}
                                onChange={(e) => setFormData({ ...formData, contactWhatsApp: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Dimensions & Special Requirements */}
                    <div className="form-row" style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h3 style={{ fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                📏 Dimensions (Optional)
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                                <Input
                                    type="number"
                                    label="Length (ft)"
                                    placeholder="40"
                                    value={formData.length}
                                    onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                                />
                                <Input
                                    type="number"
                                    label="Width (ft)"
                                    placeholder="8"
                                    value={formData.width}
                                    onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                                />
                                <Input
                                    type="number"
                                    label="Height (ft)"
                                    placeholder="8"
                                    value={formData.height}
                                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h3 style={{ fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                ⚠️ Special Requirements
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-main)' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.hazmat}
                                        onChange={(e) => setFormData({ ...formData, hazmat: e.target.checked })}
                                        style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                                    />
                                    <span>Hazmat</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-main)' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.oversize}
                                        onChange={(e) => setFormData({ ...formData, oversize: e.target.checked })}
                                        style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                                    />
                                    <span>Oversize</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-main)' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.teamDriver}
                                        onChange={(e) => setFormData({ ...formData, teamDriver: e.target.checked })}
                                        style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                                    />
                                    <span>Team Driver</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-main)' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.tarping}
                                        onChange={(e) => setFormData({ ...formData, tarping: e.target.checked })}
                                        style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                                    />
                                    <span>Tarping</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-main)' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.liftgate}
                                        onChange={(e) => setFormData({ ...formData, liftgate: e.target.checked })}
                                        style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
                                    />
                                    <span>Liftgate</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Load Notes */}
                    <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <h3 style={{ fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
                            📝 Additional Instructions (Optional)
                        </h3>
                        <textarea
                            value={formData.loadNotes}
                            onChange={(e) => setFormData({ ...formData, loadNotes: e.target.value })}
                            placeholder="Any special instructions, delivery requirements, or additional information..."
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                backgroundColor: 'var(--bg-secondary)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '0.5rem',
                                color: 'white',
                                fontSize: '0.875rem',
                                resize: 'vertical'
                            }}
                        />
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
