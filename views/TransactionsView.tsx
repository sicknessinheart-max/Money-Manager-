import React, { useMemo, useState } from 'react';
import { Transaction, UserCategories } from '../types';
import TransactionItem from '../components/TransactionItem';
import { BASE_CATEGORIES } from '../constants';

interface TransactionsViewProps {
    transactions: Transaction[];
    currency: string;
    userCategories: UserCategories;
    deleteTransaction: (id: string) => void;
}

const TransactionsView: React.FC<TransactionsViewProps> = ({ transactions, currency, userCategories, deleteTransaction }) => {
    
    const allCategories = useMemo(() => ({
        income: [...BASE_CATEGORIES.income, ...userCategories.income],
        expense: [...BASE_CATEGORIES.expense, ...userCategories.expense],
    }), [userCategories]);
    
    const findCategory = (type: 'income' | 'expense', id: string) => allCategories[type].find(c => c.id === id);

    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        type: 'all' as 'all' | 'income' | 'expense',
        category: 'all',
        startDate: '',
        endDate: '',
    });

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters({
            type: 'all',
            category: 'all',
            startDate: '',
            endDate: '',
        });
        setSearchTerm('');
    };

    const removeFilter = (key: keyof typeof filters) => {
        const defaultValues = {
            type: 'all',
            category: 'all',
            startDate: '',
            endDate: '',
        };
        handleFilterChange(key, defaultValues[key]);
    };

    const activeFilters = useMemo(() => {
        const active: { key: keyof typeof filters, label: string }[] = [];
        if (filters.type !== 'all') {
            active.push({ key: 'type', label: `Type: ${filters.type.charAt(0).toUpperCase() + filters.type.slice(1)}` });
        }
        if (filters.category !== 'all') {
            const cat = [...allCategories.income, ...allCategories.expense].find(c => c.id === filters.category);
            if (cat) active.push({ key: 'category', label: `${cat.name}` });
        }
        if (filters.startDate) {
            active.push({ key: 'startDate', label: `From: ${filters.startDate}` });
        }
        if (filters.endDate) {
            active.push({ key: 'endDate', label: `To: ${filters.endDate}` });
        }
        return active;
    }, [filters, allCategories]);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const descriptionMatch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
            const typeMatch = filters.type === 'all' || t.type === filters.type;
            const categoryMatch = filters.category === 'all' || t.category === filters.category;
            
            const transactionDate = new Date(t.date + 'T00:00:00');
            const startDate = filters.startDate ? new Date(filters.startDate + 'T00:00:00') : null;
            const endDate = filters.endDate ? new Date(filters.endDate + 'T00:00:00') : null;

            const startDateMatch = !startDate || transactionDate >= startDate;
            const endDateMatch = !endDate || transactionDate <= endDate;
            
            return descriptionMatch && typeMatch && categoryMatch && startDateMatch && endDateMatch;
        });
    }, [transactions, searchTerm, filters]);


    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">All Transactions</h2>
            
            <div className="sticky top-0 bg-[var(--bg)] py-3 z-10 -mx-6 px-6 border-b border-[var(--border)]">
                <div className="flex gap-2">
                    <div className="relative flex-grow">
                        <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-light)]"></i>
                        <input
                            type="text"
                            placeholder="Search description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-3 pl-10 bg-[var(--surface)] rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        onClick={() => setIsFilterModalOpen(true)}
                        className={`w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[var(--surface)] rounded-lg border transition-colors relative ${activeFilters.length > 0 ? 'border-blue-500 text-blue-500' : 'border-[var(--border)]'}`}
                        aria-label="Toggle filters"
                    >
                        <i className="fas fa-sliders-h"></i>
                         {activeFilters.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{activeFilters.length}</span>
                        )}
                    </button>
                </div>
                 {activeFilters.length > 0 && (
                    <div className="flex flex-wrap gap-2 items-center pt-3">
                        {activeFilters.map(filter => (
                            <div key={filter.key} className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                                {filter.label}
                                <button onClick={() => removeFilter(filter.key)} className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100">
                                    <i className="fas fa-times-circle text-[11px]"></i>
                                </button>
                            </div>
                        ))}
                        <button onClick={resetFilters} className="text-xs text-red-500 font-semibold ml-auto pr-1 hover:underline">
                            Clear all
                        </button>
                    </div>
                )}
            </div>

            <div className="pt-4 pb-16">
                {filteredTransactions.length > 0 ? (
                    filteredTransactions.map(t => (
                        <TransactionItem 
                            key={t.id}
                            transaction={t}
                            category={findCategory(t.type, t.category)}
                            currency={currency}
                            onDelete={deleteTransaction}
                        />
                    ))
                ) : (
                    <p className="text-[var(--text-light)] text-center py-10">
                        {transactions.length > 0 ? 'No transactions match your filters.' : 'You have no transactions yet.'}
                    </p>
                )}
            </div>
            
             {isFilterModalOpen && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsFilterModalOpen(false)}></div>
                    <div className="fixed bottom-0 left-0 right-0 bg-[var(--bg)] rounded-t-2xl p-4 pt-5 max-h-[80vh] overflow-y-auto z-50 shadow-2xl animate-slide-up">
                        <div className="flex justify-between items-center mb-5 px-2">
                            <h3 className="text-lg font-bold">Filters</h3>
                            <button onClick={() => setIsFilterModalOpen(false)} className="text-[var(--text-light)]"><i className="fas fa-times text-xl"></i></button>
                        </div>

                        <div className="space-y-6 px-2">
                            <div>
                                <label className="text-sm font-semibold text-[var(--text-light)] mb-2 block tracking-wider">TYPE</label>
                                <div className="flex rounded-lg border border-[var(--border)] p-1 bg-[var(--surface)]">
                                    {(['all', 'income', 'expense'] as const).map(type => (
                                        <button key={type} onClick={() => handleFilterChange('type', type)} className={`flex-1 text-sm p-2 rounded-md font-semibold transition-colors capitalize ${filters.type === type ? 'bg-blue-500 text-white' : 'text-[var(--text-light)]'}`}>
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-[var(--text-light)] mb-2 block tracking-wider">CATEGORY</label>
                                <select value={filters.category} onChange={e => handleFilterChange('category', e.target.value)} className="w-full p-3 bg-[var(--surface)] rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="all">All Categories</option>
                                    <optgroup label="Income">
                                        {allCategories.income.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                                    </optgroup>
                                    <optgroup label="Expense">
                                        {allCategories.expense.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                                    </optgroup>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-[var(--text-light)] mb-2 block tracking-wider">DATE RANGE</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input type="date" value={filters.startDate} onChange={e => handleFilterChange('startDate', e.target.value)} className="w-full p-3 bg-[var(--surface)] rounded-lg border border-[var(--border)]" placeholder="Start Date" />
                                    <input type="date" value={filters.endDate} onChange={e => handleFilterChange('endDate', e.target.value)} className="w-full p-3 bg-[var(--surface)] rounded-lg border border-[var(--border)]" placeholder="End Date" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 px-2 pb-2">
                            <button onClick={() => { resetFilters(); setIsFilterModalOpen(false); }} className="w-full p-3 text-sm text-red-500 font-semibold rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors">
                                Reset All Filters
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TransactionsView;