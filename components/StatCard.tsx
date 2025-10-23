
import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    icon?: string;
    colorClass?: string;
    children?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass, children }) => {
    return (
        <div className="bg-[var(--surface)] rounded-2xl p-5 relative overflow-hidden">
            {children ? (
                children
            ) : (
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-[var(--text-light)]">{title}</p>
                        <p className={`text-lg font-semibold ${colorClass}`}>{value}</p>
                    </div>
                    {icon && (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass?.replace('text-', 'bg-')} bg-opacity-10`}>
                            <i className={`fas ${icon} ${colorClass}`}></i>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StatCard;
