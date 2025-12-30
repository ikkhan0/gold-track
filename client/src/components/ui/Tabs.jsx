import React, { useState } from 'react';

const Tabs = ({ tabs, defaultTab, onTabChange }) => {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

    const handleTabClick = (id) => {
        setActiveTab(id);
        if (onTabChange) onTabChange(id);
    };

    return (
        <div className="w-full">
            <div className="flex p-1 bg-slate-100 rounded-lg mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`flex-1 py-3 px-4 rounded-md text-sm font-bold transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-white text-emerald-700 shadow-md transform scale-100'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                            }`}
                    >
                        {tab.icon && <span className="mr-2 inline-block align-middle">{tab.icon}</span>}
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="animate-fade-in">
                {tabs.find(t => t.id === activeTab)?.content}
            </div>
        </div>
    );
};

export default Tabs;
