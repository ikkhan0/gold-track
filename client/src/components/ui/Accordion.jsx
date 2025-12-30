import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const AccordionItem = ({ title, children, isOpen, onClick }) => {
    return (
        <div className="border-b border-slate-100 last:border-0">
            <button
                className="w-full py-5 px-6 flex justify-between items-center bg-white hover:bg-slate-50 transition-colors text-left"
                onClick={onClick}
            >
                <span className={`text-lg font-semibold ${isOpen ? 'text-emerald-700' : 'text-slate-700'}`}>
                    {title}
                </span>
                {isOpen ? (
                    <ChevronUp className="text-emerald-500" size={20} />
                ) : (
                    <ChevronDown className="text-slate-400" size={20} />
                )}
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="p-6 pt-0 text-slate-600 leading-relaxed bg-white">
                    {children}
                </div>
            </div>
        </div>
    );
};

const Accordion = ({ items }) => {
    const [openIndex, setOpenIndex] = useState(0);

    const handleClick = (index) => {
        setOpenIndex(index === openIndex ? -1 : index);
    };

    return (
        <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
            {items.map((item, index) => (
                <AccordionItem
                    key={index}
                    title={item.title}
                    isOpen={index === openIndex}
                    onClick={() => handleClick(index)}
                >
                    {item.content}
                </AccordionItem>
            ))}
        </div>
    );
};

export default Accordion;
