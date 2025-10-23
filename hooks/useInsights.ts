
import { useMemo } from 'react';
import { Transaction, UserCategories } from '../types';
import { BASE_CATEGORIES } from '../constants';
import { money } from '../utils/formatter';

interface InsightEngineProps {
    transactions: Transaction[];
    userCategories: UserCategories;
    currency: string;
}

export const useInsights = ({ transactions, userCategories, currency }: InsightEngineProps) => {

    const allCategories = useMemo(() => ({
        income: [...BASE_CATEGORIES.income, ...userCategories.income],
        expense: [...BASE_CATEGORIES.expense, ...userCategories.expense],
    }), [userCategories]);
    
    const findCategory = (type: 'income' | 'expense', id: string) => allCategories[type].find(c => c.id === id);

    const recurring = useMemo(() => {
        if (transactions.length < 2) return [];
        const recurring = [];
        const transactionGroups: { [key: string]: Transaction[] } = {};

        transactions.forEach(t => {
            const key = `${t.type}_${t.category}_${Math.round(t.amount)}`;
            if (!transactionGroups[key]) transactionGroups[key] = [];
            transactionGroups[key].push(t);
        });

        for (const key in transactionGroups) {
            const group = transactionGroups[key];
            if (group.length >= 2) {
                const dates = group.map(t => new Date(t.date).getTime()).sort();
                const intervals = [];
                for (let i = 1; i < dates.length; i++) {
                    intervals.push(dates[i] - dates[i-1]);
                }
                const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
                const daysBetween = avgInterval / (1000 * 60 * 60 * 24);

                let frequency = null;
                if (daysBetween >= 25 && daysBetween <= 35) frequency = 'Monthly';
                else if (daysBetween >= 6 && daysBetween <= 8) frequency = 'Weekly';

                if (frequency) {
                    const lastDate = dates[dates.length - 1];
                    const nextDate = new Date(lastDate + avgInterval).toISOString().split('T')[0];
                    recurring.push({ ...group[0], frequency, nextDate });
                }
            }
        }
        return recurring;
    }, [transactions]);

    const anomalies = useMemo(() => {
        const anomalies: any[] = [];
        const expenses = transactions.filter(t => t.type === 'expense');
        if (expenses.length < 5) return [];

        const categoryStats: { [key: string]: number[] } = {};
        expenses.forEach(t => {
            if (!categoryStats[t.category]) categoryStats[t.category] = [];
            categoryStats[t.category].push(t.amount);
        });

        for (const categoryId in categoryStats) {
            const amounts = categoryStats[categoryId];
            if (amounts.length >= 3) {
                const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
                const stdDev = Math.sqrt(amounts.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / amounts.length);
                
                expenses.forEach(t => {
                    if (t.category === categoryId && t.amount > mean + 2 * stdDev) {
                        anomalies.push({
                            transaction: t,
                            reason: 'Unusually high',
                            typical: mean,
                            percentAbove: ((t.amount - mean) / mean * 100).toFixed(0)
                        });
                    }
                });
            }
        }
        return anomalies;
    }, [transactions]);

    const velocity = useMemo(() => {
        const now = new Date();
        const startOfThisWeek = new Date(now);
        startOfThisWeek.setDate(now.getDate() - now.getDay());
        startOfThisWeek.setHours(0,0,0,0);
        
        const startOfLastWeek = new Date(startOfThisWeek);
        startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);
        
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        let thisWeekTotal = 0, lastWeekTotal = 0, thisMonthTotal = 0, lastMonthTotal = 0;

        transactions.filter(t => t.type === 'expense').forEach(t => {
            const date = new Date(t.date + 'T00:00:00');
            if (date >= startOfThisWeek) thisWeekTotal += t.amount;
            else if (date >= startOfLastWeek && date < startOfThisWeek) lastWeekTotal += t.amount;

            if (date >= thisMonthStart) thisMonthTotal += t.amount;
            else if (date >= lastMonthStart && date <= lastMonthEnd) lastMonthTotal += t.amount;
        });

        const weekChange = lastWeekTotal > 0 ? ((thisWeekTotal - lastWeekTotal) / lastWeekTotal * 100) : (thisWeekTotal > 0 ? 100 : 0);
        const monthChange = lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal * 100) : (thisMonthTotal > 0 ? 100 : 0);

        return {
            weekly: { current: thisWeekTotal, change: weekChange, trend: weekChange > 10 ? 'up' : weekChange < -10 ? 'down' : 'stable' },
            monthly: { current: thisMonthTotal, change: monthChange, trend: monthChange > 10 ? 'up' : monthChange < -10 ? 'down' : 'stable' }
        };
    }, [transactions]);
    
    const analysis = useMemo(() => {
        if (transactions.length === 0) return null;
        const now = new Date();
        const thisMonthTransactions = transactions.filter(t => {
            const d = new Date(t.date + 'T00:00:00');
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });
        const income = thisMonthTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const expenses = thisMonthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        const balance = income - expenses;
        const savingsRate = income > 0 ? (balance / income) * 100 : 0;
        return { savingsRate, balance };
    }, [transactions]);
    
    const recommendations = useMemo(() => {
        const recs = [];
        if (velocity.weekly.change > 20) {
            recs.push({ type: 'warning', icon: '⚠️', title: 'Spending Surge', message: `Spending is up ${velocity.weekly.change.toFixed(0)}% this week.` });
        }
        if (anomalies.length > 0) {
            const top = anomalies[0];
            const catName = findCategory('expense', top.transaction.category)?.name || 'expense';
            recs.push({ type: 'info', icon: '🔍', title: 'Unusual Transaction', message: `${money(top.transaction.amount, currency)} on ${catName} was ${top.percentAbove}% higher than usual.` });
        }
        if (analysis && analysis.balance < 0) {
            recs.push({ type: 'danger', icon: '🚨', title: 'Negative Balance', message: `You've spent ${money(Math.abs(analysis.balance), currency)} more than your income this month.` });
        }
        if (analysis && analysis.savingsRate < 10 && analysis.savingsRate > 0) {
            recs.push({ type: 'warning', icon: '💸', title: 'Low Savings Rate', message: `Your savings rate is ${analysis.savingsRate.toFixed(0)}% this month. Aim for 20%!` });
        }
        return recs.slice(0, 3);
    }, [velocity, anomalies, analysis, currency, findCategory]);


    return { recurring, anomalies, velocity, analysis, recommendations, findCategory };
};
