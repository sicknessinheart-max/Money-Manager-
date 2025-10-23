
import React from 'react';
import { Transaction, Category } from '../types';
import { money } from '../utils/formatter';

interface TransactionItemProps {
    transaction: Transaction;
    category?: Category;
    currency: string;
    onDelete: (id: string) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, category, currency, onDelete }) => {
    const { id, type, amount, description, date } = transaction;
    const isIncome = type === 'income';

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(id);
    };
    
    return (
        <div className="bg-[var(--surface)] rounded-xl p-4 mb-2 flex items-center justify-between transition-transform active:scale-[0.98]">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl">
                    {category?.icon || '❓'}
                </div>
                <div>
                    <p className="font-semibold text-sm">{description || category?.name || 'Uncategorized'}</p>
                    <p className="text-xs text-[var(--text-light)]">{new Date(date + 'T00:00:00').toLocaleDateString()}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <p className={`font-bold text-sm ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
                    {isIncome ? '+' : '-'}{money(amount, currency)}
                </p>
                <button onClick={handleDelete} className="text-[var(--text-light)] hover:text-red-500 text-xs">
                    <i className="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
    );
};

export default TransactionItem;
