import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, Bell, User } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { toggleLanguage, language } = useI18n() || { toggleLanguage: () => { }, language: 'en' };
    const { user, loading } = useAuth() || { loading: true };
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F1111] flex items-center justify-center">
                <div className="text-[#D4AF37] text-xl font-bold animate-pulse">Loading GoldTrack...</div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <div className="min-h-screen bg-[#0F1111] flex">
            {/* Sidebar (Desktop) */}
            <Sidebar />

            {/* Mobile Sidebar Overlay (Placeholder for future implementation) */}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen transition-all duration-300" style={{ marginLeft: window.innerWidth >= 768 ? '256px' : '0' }}>
                {/* Dashboard Header */}
                <header className="h-16 bg-slate-950 border-b border-yellow-600/30 flex items-center justify-between px-4 sticky top-0 z-30 shadow-lg">
                    <div className="flex items-center gap-3">
                        <button className="md:hidden p-2 text-[#B0B3B8] hover:text-[#F5F5F5]">
                            <Menu />
                        </button>
                        <h2 className="text-xl font-bold text-[#F5F5F5] hidden sm:block">Dashboard</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={toggleLanguage} className="text-sm font-medium text-[#B0B3B8] hover:text-[#D4AF37]">
                            {language === 'en' ? 'اردو' : 'English'}
                        </button>
                        <button className="p-2 text-[#B0B3B8] hover:bg-[#2A2D2D] hover:text-[#D4AF37] rounded-full relative transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-[#1A1D1D]"></span>
                        </button>
                        <div className="h-8 w-8 bg-[#D4AF37]/20 rounded-full flex items-center justify-center text-[#D4AF37] font-bold border border-[#D4AF37]">
                            IK
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
