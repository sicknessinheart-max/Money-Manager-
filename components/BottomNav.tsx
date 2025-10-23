
import React from 'react';
import { View } from '../types';

interface NavItemProps {
  view: View;
  label: string;
  icon: string;
  currentView: View;
  onClick: (view: View) => void;
}

const NavItem: React.FC<NavItemProps> = ({ view, label, icon, currentView, onClick }) => (
    <div
        className={`flex-1 flex flex-col items-center p-2 cursor-pointer transition-all duration-200 ${currentView === view ? 'text-[var(--primary)]' : 'text-[var(--text-light)]'}`}
        onClick={() => onClick(view)}
    >
        <i className={`fas ${icon} text-xl mb-1`}></i>
        <span className="text-xs font-medium">{label}</span>
    </div>
);

interface BottomNavProps {
    currentView: View;
    setCurrentView: (view: View) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setCurrentView }) => {
    const navItems: { view: View; label: string; icon: string }[] = [
        { view: 'dashboard', label: 'Home', icon: 'fa-home' },
        { view: 'transactions', label: 'History', icon: 'fa-list' },
        { view: 'insights', label: 'Insights', icon: 'fa-brain' },
        { view: 'profile', label: 'Profile', icon: 'fa-user' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-[var(--bg)] border-t border-[var(--border)] z-50 backdrop-blur-sm bg-opacity-80">
            <div className="flex max-w-lg mx-auto">
                {navItems.map(item => (
                    <NavItem
                        key={item.view}
                        view={item.view}
                        label={item.label}
                        icon={item.icon}
                        currentView={currentView}
                        onClick={setCurrentView}
                    />
                ))}
            </div>
        </div>
    );
};

export default BottomNav;
