
import React from 'react';
import { Transaction, UserCategories } from '../types';
import { useInsights } from '../hooks/useInsights';
import { money } from '../utils/formatter';

interface InsightsViewProps {
    transactions: Transaction[];
    userCategories: UserCategories;
    currency: string;
}

const InsightsView: React.FC<InsightsViewProps> = ({ transactions, userCategories, currency }) => {
    const { recurring, velocity, analysis, recommendations, findCategory } = useInsights({ transactions, userCategories, currency });
    
    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                    <i className="fas fa-brain text-blue-500 text-xl"></i>
                    <h2 className="text-2xl font-bold">AI Insights</h2>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            
            {transactions.length < 3 && <p className="text-center text-[var(--text-light)] py-8">Add more transactions to unlock AI insights.</p>}

            {transactions.length >= 3 && (
                <>
                    <div className="mb-6">
                        <div className="flex flex-wrap -m-1">
                            {analysis && analysis.balance >= 0 && <InsightBadge color="success" icon="fa-check-circle">{analysis.savingsRate.toFixed(0)}% Saved</InsightBadge>}
                             {analysis && analysis.balance < 0 && <InsightBadge color="danger" icon="fa-times-circle">Overspending</InsightBadge>}
                            {velocity.weekly.trend === 'up' && <InsightBadge color="danger" icon="fa-arrow-up">Spending Up</InsightBadge>}
                            {velocity.weekly.trend === 'down' && <InsightBadge color="success" icon="fa-arrow-down">Spending Down</InsightBadge>}
                            {recurring.length > 0 && <InsightBadge color="info" icon="fa-redo">{recurring.length} Recurring</InsightBadge>}
                        </div>
                    </div>
                    
                    <Section title="Recommendations">
                        {recommendations.length > 0 ? recommendations.map((rec, i) => (
                            <RecommendationCard key={i} {...rec} />
                        )) : <p className="text-sm text-[var(--text-light)]">No specific recommendations right now. Keep up the good work!</p>}
                    </Section>
                    
                    <Section title="Patterns Detected">
                        {recurring.length > 0 ? recurring.slice(0, 3).map(r => (
                            <PatternCard 
                                key={r.id}
                                icon={findCategory(r.type, r.category)?.icon || '❓'}
                                title={r.description || findCategory(r.type, r.category)?.name || 'Recurring'}
                                subtitle={`${r.frequency} • ${money(r.amount, currency)}`}
                                value={`Next: ${new Date(r.nextDate).toLocaleDateString()}`}
                            />
                        )) : <p className="text-sm text-[var(--text-light)]">No recurring patterns detected yet.</p>}
                    </Section>
                    
                     <Section title="Spending Velocity">
                        <div className="grid grid-cols-2 gap-4">
                           <VelocityCard title="This Week" amount={money(velocity.weekly.current, currency)} change={velocity.weekly.change} />
                           <VelocityCard title="This Month" amount={money(velocity.monthly.current, currency)} change={velocity.monthly.change} />
                        </div>
                    </Section>
                </>
            )}
        </div>
    );
};

// Helper sub-components for styling
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8">
        <h3 className="text-sm font-semibold text-[var(--text-light)] mb-3 uppercase tracking-wider">{title}</h3>
        {children}
    </div>
);

const InsightBadge: React.FC<{ color: 'success'|'danger'|'info'; icon: string; children: React.ReactNode }> = ({ color, icon, children }) => {
    const colors = {
        success: 'border-green-500 text-green-500',
        danger: 'border-red-500 text-red-500',
        info: 'border-blue-500 text-blue-500',
    };
    return (
        <div className={`inline-flex items-center gap-2 py-2 px-4 bg-[var(--surface)] border rounded-full text-sm font-medium m-1 ${colors[color]}`}>
            <i className={`fas ${icon}`}></i>
            <span>{children}</span>
        </div>
    );
};

const RecommendationCard: React.FC<{ type: string, icon: string, title: string, message: string }> = ({ type, icon, title, message }) => {
    const colors = {
        warning: 'border-l-yellow-500',
        danger: 'border-l-red-500',
        info: 'border-l-blue-500',
        success: 'border-l-green-500'
    };
    return (
        <div className={`bg-[var(--surface)] rounded-lg p-4 mb-3 border-l-4 ${colors[type as keyof typeof colors]}`}>
            <div className="flex items-start gap-3">
                <span className="text-xl">{icon}</span>
                <div>
                    <p className="font-semibold text-sm">{title}</p>
                    <p className="text-xs text-[var(--text-light)]">{message}</p>
                </div>
            </div>
        </div>
    );
}

const PatternCard: React.FC<{ icon: string, title: string, subtitle: string, value: string }> = ({ icon, title, subtitle, value }) => (
    <div className="bg-[var(--surface)] rounded-lg p-3 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
                <p className="font-medium text-sm">{title}</p>
                <p className="text-xs text-[var(--text-light)]">{subtitle}</p>
            </div>
        </div>
        <span className="text-xs text-[var(--text-light)] font-medium">{value}</span>
    </div>
);

const VelocityCard: React.FC<{ title: string, amount: string, change: number }> = ({ title, amount, change }) => {
    const isUp = change > 10;
    const isDown = change < -10;
    const color = isUp ? 'text-red-500' : isDown ? 'text-green-500' : 'text-[var(--text-light)]';
    const icon = isUp ? '↑' : isDown ? '↓' : '→';

    return (
        <div className="bg-[var(--surface)] rounded-lg p-4">
            <p className="text-xs text-[var(--text-light)] mb-1">{title}</p>
            <p className="font-semibold text-lg">{amount}</p>
            <div className={`text-xs font-bold flex items-center gap-1 ${color}`}>
                <span>{icon}</span>
                <span>{Math.abs(change).toFixed(0)}%</span>
            </div>
        </div>
    );
}


export default InsightsView;
