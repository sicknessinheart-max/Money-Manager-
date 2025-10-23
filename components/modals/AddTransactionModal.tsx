
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, TransactionType, UserCategories } from '../../types';
import { BASE_CATEGORIES } from '../../constants';

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => Promise<void>;
    userCategories: UserCategories;
    initialData?: Partial<Transaction> & { isRepeat?: boolean };
    currency: string;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onSave, userCategories, initialData, currency }) => {
    const [type, setType] = useState<TransactionType>(initialData?.type || 'expense');
    const [amount, setAmount] = useState<string>(initialData?.amount?.toString() || '');
    const [category, setCategory] = useState<string | null>(initialData?.category || null);
    const [description, setDescription] = useState<string>(initialData?.description || '');
    const [date, setDate] = useState<string>(initialData?.date || new Date().toISOString().split('T')[0]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (initialData) {
            setType(initialData.type || 'expense');
            setAmount(initialData.amount?.toString() || '');
            setCategory(initialData.category || null);
            setDescription(initialData.description || '');
            setDate(initialData.isRepeat ? new Date().toISOString().split('T')[0] : (initialData.date || new Date().toISOString().split('T')[0]));
        } else {
             setType('expense');
             setAmount('');
             setCategory(null);
             setDescription('');
             setDate(new Date().toISOString().split('T')[0]);
        }
    }, [initialData]);

    const allCategories = useMemo(() => ({
        income: [...BASE_CATEGORIES.income, ...userCategories.income],
        expense: [...BASE_CATEGORIES.expense, ...userCategories.expense],
    }), [userCategories]);

    useEffect(() => {
        if (!category || !allCategories[type].some(c => c.id === category)) {
            setCategory(allCategories[type][0]?.id || null);
        }
    }, [type, category, allCategories]);

    const handleSave = async () => {
        if (!amount || !category || !date) {
            alert('Please fill in Amount, Category, and Date.');
            return;
        }
        setIsSaving(true);
        try {
            await onSave({
                type,
                amount: parseFloat(amount),
                category,
                description,
                date,
            });
            onClose();
        } catch (error) {
            console.error("Failed to save transaction", error);
            alert("Error saving transaction.");
        } finally {
            setIsSaving(false);
        }
    };
    
    if (!isOpen) return null;

    const currentCategories = allCategories[type];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-[var(--bg)] rounded-2xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-4">Add Transaction</h3>
                <div className="flex gap-2 mb-4">
                    <button 
                        className={`flex-1 p-3 rounded-lg font-semibold transition-colors ${type === 'income' ? 'bg-blue-500 text-white' : 'bg-[var(--surface)]'}`}
                        onClick={() => setType('income')}
                    >
                        Income
                    </button>
                    <button 
                        className={`flex-1 p-3 rounded-lg font-semibold transition-colors ${type === 'expense' ? 'bg-blue-500 text-white' : 'bg-[var(--surface)]'}`}
                        onClick={() => setType('expense')}
                    >
                        Expense
                    </button>
                </div>

                <div className="mb-4">
                    <label className="text-sm text-[var(--text-light)] mb-2 block">Amount ({currency})</label>
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-3 bg-[var(--surface)] rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" />
                </div>
                <div className="mb-4">
                    <label className="text-sm text-[var(--text-light)] mb-2 block">Category</label>
                    <div className="grid grid-cols-4 gap-2">
                        {currentCategories.map(cat => (
                            <div key={cat.id} onClick={() => setCategory(cat.id)} className={`flex flex-col items-center p-2 rounded-lg cursor-pointer border-2 ${category === cat.id ? 'border-blue-500 bg-blue-500/10' : 'border-transparent bg-[var(--surface)]'}`}>
                                <span className="text-2xl mb-1">{cat.icon}</span>
                                <span className="text-xs text-center">{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="text-sm text-[var(--text-light)] mb-2 block">Description</label>
                    <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 bg-[var(--surface)] rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Coffee with friends" />
                </div>
                <div className="mb-6">
                    <label className="text-sm text-[var(--text-light)] mb-2 block">Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 bg-[var(--surface)] rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="flex gap-2">
                    <button className="flex-1 p-3 rounded-lg bg-[var(--surface)] font-semibold" onClick={onClose}>Cancel</button>
                    <button className="flex-1 p-3 rounded-lg bg-blue-500 text-white font-semibold flex items-center justify-center" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddTransactionModal;
