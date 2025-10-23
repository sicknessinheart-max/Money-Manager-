
import React, { useState, useMemo } from 'react';
import { Transaction } from '../../types';
import { money } from '../../utils/formatter';

interface SplitBillModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => Promise<void>;
    currency: string;
}

const SplitBillModal: React.FC<SplitBillModalProps> = ({ isOpen, onClose, onSave, currency }) => {
    const [total, setTotal] = useState('');
    const [people, setPeople] = useState('2');
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const perPerson = useMemo(() => {
        const totalAmount = parseFloat(total) || 0;
        const numPeople = parseInt(people) || 1;
        return totalAmount / numPeople;
    }, [total, people]);

    const handleSave = async () => {
        if (perPerson <= 0) {
            alert('Please enter a valid total amount and number of people.');
            return;
        }
        setIsSaving(true);
        try {
            await onSave({
                type: 'expense',
                amount: perPerson,
                category: 'other-expense',
                description: `${description || 'Split bill'} (1 of ${people})`,
                date: new Date().toISOString().split('T')[0],
            });
            onClose();
        } catch (error) {
            console.error("Failed to save split expense", error);
            alert("Error saving transaction.");
        } finally {
            setIsSaving(false);
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-[var(--bg)] rounded-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-4">Split Bill</h3>
                <div className="mb-4">
                    <label className="text-sm text-[var(--text-light)] mb-2 block">Total Amount</label>
                    <input type="number" value={total} onChange={e => setTotal(e.target.value)} className="w-full p-3 bg-[var(--surface)] rounded-lg border border-[var(--border)]" placeholder="0.00" />
                </div>
                <div className="mb-4">
                    <label className="text-sm text-[var(--text-light)] mb-2 block">Number of People</label>
                    <input type="number" value={people} onChange={e => setPeople(e.target.value)} className="w-full p-3 bg-[var(--surface)] rounded-lg border border-[var(--border)]" min="1" step="1" />
                </div>
                <div className="mb-4 p-4 bg-[var(--surface)] rounded-lg">
                    <p className="text-sm text-[var(--text-light)]">Each person pays:</p>
                    <p className="text-2xl font-bold">{money(perPerson, currency)}</p>
                </div>
                <div className="mb-6">
                    <label className="text-sm text-[var(--text-light)] mb-2 block">Your Share Description</label>
                    <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 bg-[var(--surface)] rounded-lg border border-[var(--border)]" placeholder="e.g., Dinner with friends" />
                </div>
                <div className="flex gap-2">
                    <button className="flex-1 p-3 rounded-lg bg-[var(--surface)] font-semibold" onClick={onClose}>Cancel</button>
                    <button className="flex-1 p-3 rounded-lg bg-blue-500 text-white font-semibold flex items-center justify-center" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Save My Share'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SplitBillModal;
