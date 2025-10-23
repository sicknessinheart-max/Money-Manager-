
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, UserCategories } from '../../types';
import { BASE_CATEGORIES } from '../../constants';

interface QuickExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => Promise<void>;
    userCategories: UserCategories;
    currency: string;
}

const QuickExpenseModal: React.FC<QuickExpenseModalProps> = ({ isOpen, onClose, onSave, userCategories, currency }) => {
    const [amount, setAmount] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);

    const expenseCategories = useMemo(() => {
        return [...BASE_CATEGORIES.expense, ...userCategories.expense];
    }, [userCategories]);

    useEffect(() => {
        if (expenseCategories.length > 0) {
            setCategory(expenseCategories[0].id);
        }
    }, [expenseCategories]);
    
    const handleSave = async () => {
        if (!amount || !category) {
            alert('Please enter an amount.');
            return;
        }
        setIsSaving(true);
        try {
            await onSave({
                type: 'expense',
                amount: parseFloat(amount),
                category,
                description: 'Quick expense',
                date: new Date().toISOString().split('T')[0],
            });
            onClose();
        } catch (error) {
            console.error("Failed to save quick expense", error);
            alert("Error saving transaction.");
        } finally {
            setIsSaving(false);
        }
    };
    
    if (!isOpen) return null;

    const quickAmounts = [5, 10, 20, 50, 100, 200];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-[var(--bg)] rounded-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-2">Quick Expense</h3>
                <p className="text-sm text-[var(--text-light)] mb-4">Select or enter an amount.</p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                    {quickAmounts.map(val => (
                        <button key={val} onClick={() => setAmount(val.toString())} className="p-4 bg-[var(--surface)] rounded-lg font-semibold border border-[var(--border)] hover:bg-blue-500 hover:text-white transition-colors">
                            {val}
                        </button>
                    ))}
                </div>
                <div className="mb-4">
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-3 bg-[var(--surface)] rounded-lg border border-[var(--border)]" placeholder="Custom amount" />
                </div>
                <div className="mb-6">
                    <label className="text-sm text-[var(--text-light)] mb-2 block">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
                        {expenseCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                        ))}
                    </select>
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

export default QuickExpenseModal;
