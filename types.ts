
export type TransactionType = 'income' | 'expense';
export type View = 'dashboard' | 'transactions' | 'insights' | 'profile' | 'settings';
export type ModalType = 'addTransaction' | 'quickExpense' | 'splitBill' | 'note' | 'categoryEditor';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  isBase?: boolean;
}

export interface UserCategory extends Category {
  type: TransactionType;
}

export interface UserCategories {
  income: UserCategory[];
  expense: UserCategory[];
}

export interface Note {
  id: string;
  text: string;
  category: 'reminder' | 'goal' | 'idea' | 'review';
  date: string;
  timestamp: number;
}
