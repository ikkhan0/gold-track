import React from 'react';

const Card = ({ children, className = '', glass = false }) => {
    const baseClass = glass ? 'glass-card' : 'card';
    return (
        <div className={`${baseClass} ${className}`}>
            {children}
        </div>
    );
};

export default Card;
