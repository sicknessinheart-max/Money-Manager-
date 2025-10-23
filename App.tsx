
import React, { useState, useCallback, useMemo } from 'react';
import { View, ModalType, Transaction, Category } from './types';
import { useFirebase } from './hooks/useFirebase';
import DashboardView from './views/DashboardView';
import TransactionsView from './views/TransactionsView';
import InsightsView from './views/InsightsView';
import ProfileView from './views/ProfileView';
import SettingsView from './views/SettingsView';
import BottomNav from './components/BottomNav';
import SpeedDial from './components/SpeedDial';
import AddTransactionModal from './components/modals/AddTransactionModal';
import QuickExpenseModal from './components/modals/QuickExpenseModal';
import SplitBillModal from './components/modals/SplitBillModal';
import NoteModal from './components/modals/NoteModal';
import CategoryEditorModal from './components/modals/CategoryEditorModal';

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<View>('dashboard');
    const [activeModal, setActiveModal] = useState<ModalType | null>(null);
    const [modalProps, setModalProps] = useState<any>({});

    const {
        transactions,
        userCategories,
        notes,
        appCurrency,
        loading,
        error,
        addTransaction,
        deleteTransaction,
        saveCategory,
        deleteCategory,
        saveNote,
        updateCurrency,
    } = useFirebase();

    const openModal = useCallback((modalType: ModalType, props: any = {}) => {
        setActiveModal(modalType);
        setModalProps(props);
    }, []);

    const closeModal = useCallback(() => {
        setActiveModal(null);
        setModalProps({});
    }, []);
    
    const sortedTransactions = useMemo(() => {
        return [...transactions].sort((a, b) => b.timestamp - a.timestamp);
    }, [transactions]);


    const renderView = () => {
        switch (currentView) {
            case 'dashboard':
                return <DashboardView transactions={sortedTransactions} currency={appCurrency} userCategories={userCategories} deleteTransaction={deleteTransaction} />;
            case 'transactions':
                return <TransactionsView transactions={sortedTransactions} currency={appCurrency} userCategories={userCategories} deleteTransaction={deleteTransaction} />;
            case 'insights':
                return <InsightsView transactions={transactions} userCategories={userCategories} currency={appCurrency} />;
            case 'settings':
                return <SettingsView 
                    userCategories={userCategories} 
                    currency={appCurrency} 
                    onUpdateCurrency={updateCurrency} 
                    onOpenCategoryModal={(mode, category) => openModal('categoryEditor', { mode, category })}
                    onDeleteCategory={deleteCategory}
                    onBack={() => setCurrentView('dashboard')}
                />;
            case 'profile':
                 return <ProfileView />;
            default:
                return <DashboardView transactions={sortedTransactions} currency={appCurrency} userCategories={userCategories} deleteTransaction={deleteTransaction} />;
        }
    };
    
    return (
        <div className="h-full w-full flex flex-col bg-[var(--bg)] text-[var(--text)]">
            <main className="flex-1 overflow-y-auto overflow-x-hidden pb-24">
                {loading && <div className="p-6 text-center text-[var(--text-light)]">Loading data...</div>}
                {error && <div className="p-6 text-center text-red-500">{error}</div>}
                {!loading && !error && renderView()}
            </main>
            
            <SpeedDial
                onAction={(action, preset) => {
                    switch(action) {
                        case 'quick-expense': openModal('quickExpense'); break;
                        case 'quick-income': openModal('addTransaction', { type: 'income' }); break;
                        case 'split': openModal('splitBill'); break;
                        case 'note': openModal('note'); break;
                        case 'preset': openModal('addTransaction', preset); break;
                        case 'repeat': openModal('addTransaction', { ...preset, isRepeat: true }); break;
                    }
                }}
                lastTransaction={sortedTransactions[0]}
            />

            <BottomNav currentView={currentView} setCurrentView={setCurrentView} />

            {activeModal === 'addTransaction' && (
                <AddTransactionModal
                    isOpen={true}
                    onClose={closeModal}
                    onSave={addTransaction}
                    userCategories={userCategories}
                    initialData={modalProps}
                    currency={appCurrency}
                />
            )}
             {activeModal === 'quickExpense' && (
                <QuickExpenseModal
                    isOpen={true}
                    onClose={closeModal}
                    onSave={addTransaction}
                    userCategories={userCategories}
                    currency={appCurrency}
                />
            )}
            {activeModal === 'splitBill' && (
                <SplitBillModal
                    isOpen={true}
                    onClose={closeModal}
                    onSave={addTransaction}
                    currency={appCurrency}
                />
            )}
            {activeModal === 'note' && (
                <NoteModal
                    isOpen={true}
                    onClose={closeModal}
                    onSave={saveNote}
                />
            )}
            {activeModal === 'categoryEditor' && (
                <CategoryEditorModal
                    isOpen={true}
                    onClose={closeModal}
                    onSave={saveCategory}
                    mode={modalProps.mode}
                    category={modalProps.category}
                />
            )}
        </div>
    );
};

export default App;
