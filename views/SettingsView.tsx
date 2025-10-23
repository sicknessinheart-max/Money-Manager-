import React from 'react';
import { UserCategory, UserCategories } from '../types';
import { BASE_CATEGORIES } from '../constants';

interface SettingsViewProps {
    userCategories: UserCategories;
    currency: string;
    theme: 'light' | 'dark';
    onUpdateCurrency: (currency: string) => void;
    onOpenCategoryModal: (mode: 'add' | 'edit', category?: UserCategory) => void;
    onDeleteCategory: (id: string) => void;
    onBack: () => void;
    onToggleTheme: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
    userCategories, currency, onUpdateCurrency, onOpenCategoryModal, onDeleteCategory, onBack, theme, onToggleTheme 
}) => {
    return (
        <div className="p-6">
            <div className="flex items-center mb-6">
                 <button onClick={onBack} className="mr-4 text-xl"><i className="fas fa-arrow-left"></i></button>
                <h2 className="text-2xl font-bold">Settings</h2>
            </div>
            
            <div className="bg-[var(--surface)] rounded-2xl p-4 mb-4">
                <h3 className="text-lg font-semibold px-2 mb-2">Categories</h3>
                <CategoryList 
                    title="Income"
                    baseCategories={BASE_CATEGORIES.income}
                    userCategories={userCategories.income}
                    onEdit={(cat) => onOpenCategoryModal('edit', cat)}
                    onDelete={onDeleteCategory}
                />
                 <CategoryList 
                    title="Expense"
                    baseCategories={BASE_CATEGORIES.expense}
                    userCategories={userCategories.expense}
                    onEdit={(cat) => onOpenCategoryModal('edit', cat)}
                    onDelete={onDeleteCategory}
                />
                <button 
                    onClick={() => onOpenCategoryModal('add')}
                    className="w-full mt-4 p-3 bg-blue-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2">
                    <i className="fas fa-plus-circle"></i> Add New Category
                </button>
            </div>

            <div className="bg-[var(--surface)] rounded-2xl p-4 mb-4">
                 <h3 className="text-lg font-semibold px-2 mb-2">General</h3>
                <div className="flex justify-between items-center p-2">
                    <p>Currency</p>
                    <select 
                        value={currency} 
                        onChange={(e) => onUpdateCurrency(e.target.value)} 
                        className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg border border-[var(--border)]"
                    >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="JPY">JPY</option>
                        <option value="CAD">CAD</option>
                        <option value="AUD">AUD</option>
                    </select>
                </div>
            </div>

            <div className="bg-[var(--surface)] rounded-2xl p-4">
                 <h3 className="text-lg font-semibold px-2 mb-2">Appearance</h3>
                <div className="flex justify-between items-center p-2">
                    <p>Dark Mode</p>
                    <button
                        onClick={onToggleTheme}
                        className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors duration-300 ${
                            theme === 'dark' ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'
                        }`}
                        role="switch"
                        aria-checked={theme === 'dark'}
                    >
                        <span className="sr-only">Toggle dark mode</span>
                        <span
                            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                                theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                            }`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};


interface CategoryListProps {
    title: string;
    baseCategories: UserCategory[];
    userCategories: UserCategory[];
    onEdit: (category: UserCategory) => void;
    onDelete: (id: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ title, baseCategories, userCategories, onEdit, onDelete }) => (
    <div className="mb-4">
        <p className="font-medium text-sm text-[var(--text-light)] px-2 mb-1">{title} Categories</p>
        {[...baseCategories, ...userCategories].map(cat => (
             <div key={cat.id} className="flex justify-between items-center p-2 border-b border-[var(--border)] last:border-b-0">
                <div className="flex items-center gap-3">
                    <span className="text-xl">{cat.icon}</span>
                    <span>{cat.name} {cat.isBase && <span className="text-xs text-[var(--text-light)]">(Base)</span>}</span>
                </div>
                {!cat.isBase && (
                     <div className="flex items-center gap-2">
                        <button onClick={() => onEdit(cat)} className="text-[var(--text-light)] hover:text-blue-500"><i className="fas fa-edit"></i></button>
                        <button onClick={() => onDelete(cat.id)} className="text-[var(--text-light)] hover:text-red-500"><i className="fas fa-trash-alt"></i></button>
                    </div>
                )}
            </div>
        ))}
    </div>
);

export default SettingsView;
