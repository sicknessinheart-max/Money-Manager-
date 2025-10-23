
import { useState, useEffect, useCallback } from 'react';
import { database, ref, onValue, off, push, remove as fbRemove, update as fbUpdate } from '../services/firebase';
import { Transaction, UserCategory, Note, UserCategories, TransactionType } from '../types';

export const useFirebase = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [userCategories, setUserCategories] = useState<UserCategories>({ income: [], expense: [] });
    const [notes, setNotes] = useState<Note[]>([]);
    const [appCurrency, setAppCurrency] = useState<string>('USD');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const refs = [
            ref(database, 'transactions'),
            ref(database, 'userCategories'),
            ref(database, 'appSettings'),
            ref(database, 'notes')
        ];
        
        let loadedCount = 0;
        const totalToLoad = refs.length;

        const handleLoad = () => {
            loadedCount++;
            if (loadedCount === totalToLoad) {
                setLoading(false);
            }
        };

        const transactionsRef = refs[0];
        const categoriesRef = refs[1];
        const settingsRef = refs[2];
        const notesRef = refs[3];

        const unsubscribeTransactions = onValue(transactionsRef, (snapshot) => {
            const data = snapshot.val();
            const loadedTransactions: Transaction[] = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
            setTransactions(loadedTransactions);
            handleLoad();
        }, (err) => { setError('Failed to load transactions.'); console.error(err); setLoading(false); });

        const unsubscribeCategories = onValue(categoriesRef, (snapshot) => {
            const data = snapshot.val();
            const loadedCategories: UserCategories = { income: [], expense: [] };
            if (data) {
                Object.keys(data).forEach(key => {
                    const category: UserCategory = { id: key, ...data[key] };
                    if (category.type === 'income') loadedCategories.income.push(category);
                    else if (category.type === 'expense') loadedCategories.expense.push(category);
                });
            }
            setUserCategories(loadedCategories);
            handleLoad();
        }, (err) => { setError('Failed to load categories.'); console.error(err); setLoading(false); });

        const unsubscribeSettings = onValue(settingsRef, (snapshot) => {
            const data = snapshot.val();
            if (data && data.currency) {
                setAppCurrency(data.currency);
            }
            handleLoad();
        }, (err) => { setError('Failed to load settings.'); console.error(err); setLoading(false); });

        const unsubscribeNotes = onValue(notesRef, (snapshot) => {
            const data = snapshot.val();
            const loadedNotes: Note[] = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
            setNotes(loadedNotes);
            handleLoad();
        }, (err) => { setError('Failed to load notes.'); console.error(err); setLoading(false); });


        return () => {
            off(transactionsRef, 'value', unsubscribeTransactions);
            off(categoriesRef, 'value', unsubscribeCategories);
            off(settingsRef, 'value', unsubscribeSettings);
            off(notesRef, 'value', unsubscribeNotes);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addTransaction = useCallback(async (transactionData: Omit<Transaction, 'id' | 'timestamp'>) => {
        const transactionsRef = ref(database, 'transactions');
        const newTransaction = { ...transactionData, timestamp: Date.now() };
        await push(transactionsRef, newTransaction);
    }, []);

    const deleteTransaction = useCallback(async (id: string) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            const transactionRef = ref(database, `transactions/${id}`);
            await fbRemove(transactionRef);
        }
    }, []);
    
    const saveCategory = useCallback(async (categoryData: Omit<UserCategory, 'id'>, id?: string) => {
        if (id) {
            const categoryRef = ref(database, `userCategories/${id}`);
            await fbUpdate(categoryRef, categoryData);
        } else {
            const categoriesRef = ref(database, 'userCategories');
            await push(categoriesRef, categoryData);
        }
    }, []);

    const deleteCategory = useCallback(async (id: string) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            const categoryRef = ref(database, `userCategories/${id}`);
            await fbRemove(categoryRef);
        }
    }, []);

    const saveNote = useCallback(async (noteData: Omit<Note, 'id' | 'timestamp' | 'date'>) => {
        const notesRef = ref(database, 'notes');
        const newNote = {
            ...noteData,
            timestamp: Date.now(),
            date: new Date().toISOString()
        };
        await push(notesRef, newNote);
    }, []);

    const updateCurrency = useCallback(async (currency: string) => {
        const settingsRef = ref(database, 'appSettings');
        await fbUpdate(settingsRef, { currency });
    }, []);

    return {
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
    };
};
