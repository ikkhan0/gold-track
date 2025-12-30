import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Search, Package, MapPin, Settings, Truck, LogOut } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { t } = useI18n();
    const { user } = useAuth();

    const carrierItems = [
        { icon: <LayoutDashboard size={20} />, label: t('nav.dashboard'), path: '/dashboard' },
        { icon: <Search size={20} />, label: t('btn.findLoad'), path: '/dashboard/loads' },
        { icon: <Package size={20} />, label: 'My Bids', path: '/dashboard/my-loads' },
        { icon: <MapPin size={20} />, label: 'My Trucks', path: '/dashboard/trucks' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/dashboard/settings' },
    ];

    const shipperItems = [
        { icon: <LayoutDashboard size={20} />, label: t('nav.dashboard'), path: '/dashboard' },
        { icon: <Package size={20} />, label: 'Post a Load', path: '/dashboard/post-load' },
        { icon: <Truck size={20} />, label: 'My Postings', path: '/dashboard/my-postings' }, // Manage Bids here
        { icon: <Settings size={20} />, label: 'Settings', path: '/dashboard/settings' },
    ];

    const menuItems = user?.role === 'shipper' ? shipperItems : carrierItems;

    return (
        <aside className="w-64 bg-slate-900 text-white min-h-screen fixed left-0 top-0 overflow-y-auto hidden md:flex flex-col z-50">
            <div className="h-16 flex items-center px-6 border-b border-slate-700">
                <div className="flex items-center gap-2 font-bold text-xl text-emerald-400">
                    <Truck /> GoldTrack.pk
                </div>
            </div>

            <div className="flex-1 py-6 px-3">
                <nav className="flex flex-col gap-1">
                    {menuItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                                ${isActive ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
                            `}
                        >
                            {item.icon}
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t border-slate-700">
                <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                    <LogOut size={20} />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
