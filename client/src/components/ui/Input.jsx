import React from 'react';

const Input = ({
    label,
    error,
    icon,
    className = '',
    ...props
}) => {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        {icon}
                    </div>
                )}
                <input
                    className={`w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all ${icon ? 'pl-10' : ''
                        } ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
                    {...props}
                />
            </div>
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
};

export default Input;
