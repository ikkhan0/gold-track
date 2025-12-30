import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    // Load saved language from localStorage
    useEffect(() => {
        const savedLang = localStorage.getItem('app_language');
        if (savedLang) {
            setLanguage(savedLang);
        }
    }, []);

    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'ur' : 'en';
        setLanguage(newLang);
        localStorage.setItem('app_language', newLang);
        // Update body direction for Urdu if needed (RTL)
        document.body.dir = newLang === 'ur' ? 'rtl' : 'ltr';
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <I18nContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </I18nContext.Provider>
    );
};

export const useI18n = () => useContext(I18nContext);
