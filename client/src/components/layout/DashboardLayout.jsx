import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, Bell, User } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { toggleLanguage, language } = useI18n();

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar (Desktop) */}
            <Sidebar />

            {/* Mobile Sidebar Overlay (Placeholder for future implementation) */}

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                {/* Dashboard Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-30 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button className="md:hidden p-2 text-gray-600">
                            <Menu />
                        </button>
                        <h2 className="text-xl font-bold text-gray-800 hidden sm:block">Dashboard</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={toggleLanguage} className="text-sm font-medium text-gray-600 hover:text-emerald-600">
                            {language === 'en' ? 'اردو' : 'English'}
                        </button>
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
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
