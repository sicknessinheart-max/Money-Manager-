
import React, { useState, useCallback, useMemo } from 'react';
import { Transaction } from '../types';

interface SpeedDialProps {
    onAction: (action: string, preset?: any) => void;
    lastTransaction?: Transaction;
}

interface Action {
    icon: string;
    label: string;
    color: string;
    action: string;
    preset?: any;
}

const SpeedDial: React.FC<SpeedDialProps> = ({ onAction, lastTransaction }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = useCallback(() => setIsOpen(prev => !prev), []);
    const close = useCallback(() => setIsOpen(false), []);

    const actions = useMemo(() => {
        const hour = new Date().getHours();
        const contextualActions: Action[] = [];
      
        if (hour >= 11 && hour <= 14) {
            contextualActions.push({ icon: 'fa-utensils', label: 'Add Lunch', color: 'text-orange-500', action: 'preset', preset: { type: 'expense', category: 'food', description: 'Lunch' } });
        } else if (hour >= 6 && hour <= 10) {
            contextualActions.push({ icon: 'fa-coffee', label: 'Add Coffee', color: 'text-yellow-600', action: 'preset', preset: { type: 'expense', category: 'food', description: 'Coffee' } });
        }
      
        if (lastTransaction) {
            contextualActions.push({ icon: 'fa-redo', label: `Repeat Last`, color: 'text-gray-500', action: 'repeat', preset: lastTransaction });
        }
        
        return [
            { icon: 'fa-minus-circle', label: 'Quick Expense', color: 'text-red-500', action: 'quick-expense' },
            { icon: 'fa-plus-circle', label: 'Add Income', color: 'text-green-500', action: 'quick-income' },
            ...contextualActions,
            { icon: 'fa-calculator', label: 'Split Bill', color: 'text-blue-500', action: 'split' },
            { icon: 'fa-sticky-note', label: 'Add Note', color: 'text-purple-500', action: 'note' },
        ].slice(0, 5); // Limit actions
    }, [lastTransaction]);

    const handleActionClick = (action: Action) => {
        close();
        onAction(action.action, action.preset);
    };

    return (
        <div className="fixed bottom-24 right-5 z-40">
            {isOpen && <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30" onClick={close}></div>}
            
            <div className={`absolute bottom-20 right-0 flex flex-col items-end gap-4 transition-all duration-300 ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-5'}`}>
                {actions.map((action, index) => (
                    <div key={index} className="flex items-center gap-3 cursor-pointer" onClick={() => handleActionClick(action)}>
                        <span className="bg-[var(--surface)] text-sm font-medium py-1 px-3 rounded-md shadow-md">{action.label}</span>
                        <div className={`w-12 h-12 rounded-full bg-[var(--surface)] flex items-center justify-center shadow-lg ${action.color}`}>
                            <i className={`fas ${action.icon}`}></i>
                        </div>
                    </div>
                ))}
            </div>

            <button
                className={`w-14 h-14 rounded-full text-white flex items-center justify-center text-2xl shadow-lg transition-all duration-300 z-40 relative ${isOpen ? 'bg-red-500 rotate-45' : 'bg-blue-500'}`}
                onClick={toggle}
            >
                <i className="fas fa-plus"></i>
            </button>
        </div>
    );
};

export default SpeedDial;
