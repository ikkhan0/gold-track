import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { Plus, Truck, Edit2, Trash2 } from 'lucide-react';

import api from '../../utils/api';

const VehicleManager = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newVehicle, setNewVehicle] = useState({
        vehicleType: 'Shehzore', registrationNumber: '', capacity: '', driverName: '', driverPhone: ''
    });

    const fetchVehicles = async () => {
        try {
            const { data } = await api.get('/vehicles');
            setVehicles(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchVehicles();
    }, []);

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        try {
            await api.post('/vehicles', newVehicle);
            fetchVehicles();
            setIsModalOpen(false);
            setNewVehicle({ vehicleType: 'Shehzore', registrationNumber: '', capacity: '', driverName: '', driverPhone: '' });
        } catch (error) {
            alert('Failed to add vehicle');
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="h2 text-gray-800">Fleet Management</h1>
                    <p className="text-gray-500">Manage your trucks and drivers</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} className="mr-2" /> Add Vehicle
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((v) => (
                    <Card key={v._id} className="hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                                <span className="font-bold text-xs">{(v.vehicleType || v.type || 'VEH').substring(0, 3).toUpperCase()}</span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${v.status === 'Active' ? 'status-badge status-open' : 'bg-orange-100 text-orange-700'}`}>
                                {v.status}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{v.vehicleType || v.type}</h3>
                        <p className="text-gray-500 text-sm mb-4">Reg: {v.registrationNumber || v.regNumber}</p>

                        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">{v.capacity} Tons</span>
                            <div className="flex gap-2">
                                <button className="p-2 text-gray-400 hover:text-blue-600 bg-gray-50 rounded hover:bg-blue-50 transition-colors">
                                    <Edit2 size={16} />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-red-600 bg-gray-50 rounded hover:bg-red-50 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal title="Add New Vehicle" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form className="flex flex-col gap-4" onSubmit={handleAddVehicle}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Vehicle Type</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#D4AF37]"
                                value={newVehicle.vehicleType}
                                onChange={(e) => setNewVehicle({ ...newVehicle, vehicleType: e.target.value })}
                            >
                                <option>Suzuki Open</option>
                                <option>Shehzore</option>
                                <option>Mazda (Open)</option>
                                <option>Mazda (Container)</option>
                                <option>10-Wheeler</option>
                                <option>22-Wheeler</option>
                                <option>Flatbed</option>
                            </select>
                        </div>
                        <Input
                            label="Reg Number"
                            placeholder="LEC-1234"
                            value={newVehicle.registrationNumber}
                            onChange={(e) => setNewVehicle({ ...newVehicle, registrationNumber: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Capacity (Tons)"
                            type="number"
                            placeholder="3.5"
                            value={newVehicle.capacity}
                            onChange={(e) => setNewVehicle({ ...newVehicle, capacity: e.target.value })}
                        />
                        <Input
                            label="Driver Name"
                            placeholder="Ali Raza"
                            value={newVehicle.driverName}
                            onChange={(e) => setNewVehicle({ ...newVehicle, driverName: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Save Vehicle</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default VehicleManager;
