
import React, { useState, useEffect } from 'react';
import { UserCategory } from '../../types';
import { EMOJIS } from '../../constants';

interface CategoryEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (category: Omit<UserCategory, 'id'>, id?: string) => Promise<void>;
    mode: 'add' | 'edit';
    category?: UserCategory;
}

const CategoryEditorModal: React.FC<CategoryEditorModalProps> = ({ isOpen, onClose, onSave, mode, category }) => {
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('❓');
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    useEffect(() => {
        if (mode === 'edit' && category) {
            setName(category.name);
            setIcon(category.icon);
            setType(category.type);
        } else {
            setName('');
            setIcon('❓');
            setType('expense');
        }
    }, [mode, category, isOpen]);

    const handleSave = async () => {
        if (!name.trim()) {
            alert('Please enter a category name.');
            return;
        }
        setIsSaving(true);
        try {
            await onSave({ name, icon, type }, category?.id);
            onClose();
        } catch (error) {
            console.error("Failed to save category", error);
            alert("Error saving category.");
        } finally {
            setIsSaving(false);
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-[var(--bg)] rounded-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-4">{mode === 'add' ? 'Add Category' : 'Edit Category'}</h3>
                <div className="mb-4">
                    <label className="text-sm text-[var(--text-light)] mb-2 block">Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-[var(--surface)] rounded-lg border border-[var(--border)]" placeholder="e.g., Groceries" />
                </div>
                <div className="mb-4 relative">
                    <label className="text-sm text-[var(--text-light)] mb-2 block">Icon</label>
                    <button onClick={() => setIsPickerOpen(!isPickerOpen)} className="w-16 h-16 text-3xl bg-[var(--surface)] rounded-lg border border-[var(--border)]">
                        {icon}
                    </button>
                    {isPickerOpen && (
                        <div className="absolute top-full mt-2 grid grid-cols-6 gap-1 p-2 bg-[var(--surface)] rounded-lg shadow-lg border border-[var(--border)] max-h-48 overflow-y-auto z-10">
                            {EMOJIS.map(emoji => (
                                <button key={emoji} onClick={() => { setIcon(emoji); setIsPickerOpen(false); }} className="text-2xl p-1 rounded-md hover:bg-[var(--border)]">
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="mb-6">
                    <label className="text-sm text-[var(--text-light)] mb-2 block">Type</label>
                    <select value={type} onChange={e => setType(e.target.value as 'income' | 'expense')} className="w-full p-3 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
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

export default CategoryEditorModal;
