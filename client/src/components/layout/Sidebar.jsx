import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Search, Package, MapPin, Settings, Truck, LogOut } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    // Safety check for translations
    const { t } = useI18n() || { t: (key) => key };
    const { user, logout } = useAuth() || {};
    const navigate = useNavigate();

    const carrierItems = [
        { icon: <LayoutDashboard size={20} />, label: t ? t('nav.dashboard') : 'Dashboard', path: '/dashboard' },
        { icon: <Search size={20} />, label: t ? t('btn.findLoad') : 'Find Loads', path: '/dashboard/loads' },
        { icon: <Package size={20} />, label: 'My Bids', path: '/dashboard/my-loads' },
        { icon: <MapPin size={20} />, label: 'My Trucks', path: '/dashboard/trucks' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/dashboard/settings' },
    ];

    const shipperItems = [
        { icon: <LayoutDashboard size={20} />, label: t ? t('nav.dashboard') : 'Dashboard', path: '/dashboard' },
        { icon: <Package size={20} />, label: 'Post a Load', path: '/dashboard/post-load' },
        { icon: <Truck size={20} />, label: 'My Postings', path: '/dashboard/my-postings' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/dashboard/settings' },
    ];

    // Default to carrier if user role is undefined
    const userRole = user?.role?.toLowerCase();
    const menuItems = (userRole === 'shipper' || userRole === 'broker') ? shipperItems : carrierItems;

    const handleLogout = () => {
        if (logout) logout();
        navigate('/login');
    };

    if (!user && !localStorage.getItem('user')) {
        // Optional: Render nothing or skeleton if strictly loading, but better to show sidebar
    }

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-yellow-600/30 flex flex-col z-50 shadow-2xl">
            <div className="h-16 border-b border-yellow-600/30 flex items-center justify-center px-4 bg-slate-950">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <Truck className="text-yellow-500" />
                    <span className="text-white">Gold</span>
                    <span className="text-yellow-500">Track</span>
                    <span className="text-white">.pk</span>
                </div>
            </div>

            <div className="flex-1 py-6 px-3 overflow-y-auto bg-slate-900">
                <nav className="flex flex-col gap-1">
                    {menuItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium
                                ${isActive ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-slate-900 shadow-lg border border-yellow-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'}
                            `}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t border-yellow-600/30 bg-slate-950">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-red-900/20 rounded-lg transition-all border border-transparent hover:border-red-500/50"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
