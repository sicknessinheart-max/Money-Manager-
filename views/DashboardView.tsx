
import React, { useMemo } from 'react';
import { Transaction, UserCategories } from '../types';
import { money } from '../utils/formatter';
import StatCard from '../components/StatCard';
import TransactionItem from '../components/TransactionItem';
import { BASE_CATEGORIES } from '../constants';

interface DashboardViewProps {
    transactions: Transaction[];
    currency: string;
    userCategories: UserCategories;
    deleteTransaction: (id: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ transactions, currency, userCategories, deleteTransaction }) => {

    const allCategories = useMemo(() => ({
        income: [...BASE_CATEGORIES.income, ...userCategories.income],
        expense: [...BASE_CATEGORIES.expense, ...userCategories.expense],
    }), [userCategories]);

    const findCategory = (type: 'income' | 'expense', id: string) => allCategories[type].find(c => c.id === id);

    const { income, expenses, balance } = useMemo(() => {
        const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const balance = income - expenses;
        return { income, expenses, balance };
    }, [transactions]);

    const recentTransactions = transactions.slice(0, 5);
    
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[var(--text)]">Money Manager</h1>
                <p className="text-[var(--text-light)]">Welcome back!</p>
            </div>

            <StatCard title="Total Balance" value="">
                <div className="text-center p-4">
                    <p className="text-sm text-[var(--text-light)] mb-1">Total Balance</p>
                    <h2 className="text-3xl font-bold text-[var(--text)]">{money(balance, currency)}</h2>
                </div>
            </StatCard>

            <div className="grid grid-cols-2 gap-4 my-6">
                <StatCard 
                    title="Income"
                    value={money(income, currency)}
                    icon="fa-arrow-up"
                    colorClass="text-green-500"
                />
                <StatCard 
                    title="Expenses"
                    value={money(expenses, currency)}
                    icon="fa-arrow-down"
                    colorClass="text-red-500"
                />
            </div>
            
            <div>
                <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                {recentTransactions.length > 0 ? (
                    recentTransactions.map(t => (
                        <TransactionItem 
                            key={t.id}
                            transaction={t}
                            category={findCategory(t.type, t.category)}
                            currency={currency}
                            onDelete={deleteTransaction}
                        />
                    ))
                ) : (
                    <p className="text-[var(--text-light)] text-center py-4">No recent transactions.</p>
                )}
            </div>
        </div>
    );
};

export default DashboardView;
