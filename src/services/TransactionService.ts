export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  type: 'income' | 'expense';
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
}

export const TRANSACTION_CATEGORIES: TransactionCategory[] = [
  // Income Categories
  { id: 'salary', name: 'Gehalt', icon: 'fas fa-briefcase', color: '#10b981', type: 'income' },
  { id: 'freelance', name: 'Freelance', icon: 'fas fa-laptop', color: '#10b981', type: 'income' },
  { id: 'investment', name: 'Investitionen', icon: 'fas fa-chart-line', color: '#10b981', type: 'income' },
  { id: 'bonus', name: 'Bonus', icon: 'fas fa-gift', color: '#10b981', type: 'income' },
  { id: 'other_income', name: 'Sonstiges Einkommen', icon: 'fas fa-plus-circle', color: '#10b981', type: 'income' },
  
  // Expense Categories
  { id: 'groceries', name: 'Lebensmittel', icon: 'fas fa-shopping-cart', color: '#dc2626', type: 'expense' },
  { id: 'transport', name: 'Transport', icon: 'fas fa-car', color: '#dc2626', type: 'expense' },
  { id: 'housing', name: 'Wohnen', icon: 'fas fa-home', color: '#dc2626', type: 'expense' },
  { id: 'utilities', name: 'Nebenkosten', icon: 'fas fa-bolt', color: '#dc2626', type: 'expense' },
  { id: 'health', name: 'Gesundheit', icon: 'fas fa-heartbeat', color: '#dc2626', type: 'expense' },
  { id: 'entertainment', name: 'Unterhaltung', icon: 'fas fa-film', color: '#dc2626', type: 'expense' },
  { id: 'restaurant', name: 'Restaurant', icon: 'fas fa-utensils', color: '#dc2626', type: 'expense' },
  { id: 'shopping', name: 'Einkaufen', icon: 'fas fa-shopping-bag', color: '#dc2626', type: 'expense' },
  { id: 'education', name: 'Bildung', icon: 'fas fa-graduation-cap', color: '#dc2626', type: 'expense' },
  { id: 'insurance', name: 'Versicherung', icon: 'fas fa-shield-alt', color: '#dc2626', type: 'expense' },
  { id: 'other_expense', name: 'Sonstige Ausgaben', icon: 'fas fa-minus-circle', color: '#dc2626', type: 'expense' }
];

class TransactionService {
  private readonly STORAGE_KEY = 'moneyup-transactions';

  // Get all transactions
  getTransactions(): Transaction[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading transactions:', error);
      return [];
    }
  }

  // Get transactions by date range
  getTransactionsByDateRange(startDate: string, endDate: string): Transaction[] {
    const transactions = this.getTransactions();
    return transactions.filter(transaction => 
      transaction.date >= startDate && transaction.date <= endDate
    );
  }

  // Get transactions by category
  getTransactionsByCategory(categoryId: string): Transaction[] {
    const transactions = this.getTransactions();
    return transactions.filter(transaction => transaction.category === categoryId);
  }

  // Get transactions by type
  getTransactionsByType(type: 'income' | 'expense'): Transaction[] {
    const transactions = this.getTransactions();
    return transactions.filter(transaction => transaction.type === type);
  }

  // Add new transaction
  addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Transaction {
    const transactions = this.getTransactions();
    const newTransaction: Transaction = {
      ...transaction,
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    transactions.push(newTransaction);
    this.saveTransactions(transactions);
    return newTransaction;
  }

  // Update transaction
  updateTransaction(id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>): Transaction | null {
    const transactions = this.getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    
    if (index === -1) return null;
    
    transactions[index] = {
      ...transactions[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.saveTransactions(transactions);
    return transactions[index];
  }

  // Delete transaction
  deleteTransaction(id: string): boolean {
    const transactions = this.getTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    
    if (filtered.length === transactions.length) return false;
    
    this.saveTransactions(filtered);
    return true;
  }

  // Get category by ID
  getCategoryById(categoryId: string): TransactionCategory | undefined {
    return TRANSACTION_CATEGORIES.find(cat => cat.id === categoryId);
  }

  // Get categories by type
  getCategoriesByType(type: 'income' | 'expense'): TransactionCategory[] {
    return TRANSACTION_CATEGORIES.filter(cat => cat.type === type);
  }

  // Calculate total income for a period
  getTotalIncome(startDate?: string, endDate?: string): number {
    let transactions = this.getTransactionsByType('income');
    
    if (startDate && endDate) {
      transactions = transactions.filter(t => t.date >= startDate && t.date <= endDate);
    }
    
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
  }

  // Calculate total expenses for a period
  getTotalExpenses(startDate?: string, endDate?: string): number {
    let transactions = this.getTransactionsByType('expense');
    
    if (startDate && endDate) {
      transactions = transactions.filter(t => t.date >= startDate && t.date <= endDate);
    }
    
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
  }

  // Get balance for a period
  getBalance(startDate?: string, endDate?: string): number {
    return this.getTotalIncome(startDate, endDate) - this.getTotalExpenses(startDate, endDate);
  }

  // Get spending by category
  getSpendingByCategory(startDate?: string, endDate?: string): { [categoryId: string]: number } {
    let transactions = this.getTransactionsByType('expense');
    
    if (startDate && endDate) {
      transactions = transactions.filter(t => t.date >= startDate && t.date <= endDate);
    }
    
    return transactions.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as { [categoryId: string]: number });
  }

  // Save transactions to localStorage
  private saveTransactions(transactions: Transaction[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  }

  // Create sample transactions for demo
  createSampleTransactions(): void {
    const sampleTransactions: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        amount: 2800,
        description: 'Monatsgehalt',
        category: 'salary',
        type: 'income',
        date: new Date().toISOString().split('T')[0]
      },
      {
        amount: 45.80,
        description: 'Einkauf Supermarkt',
        category: 'groceries',
        type: 'expense',
        date: new Date().toISOString().split('T')[0]
      },
      {
        amount: 65.20,
        description: 'Tankstelle',
        category: 'transport',
        type: 'expense',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0] // Yesterday
      },
      {
        amount: 850,
        description: 'Miete',
        category: 'housing',
        type: 'expense',
        date: new Date().toISOString().split('T')[0]
      },
      {
        amount: 32.50,
        description: 'Restaurant',
        category: 'restaurant',
        type: 'expense',
        date: new Date(Date.now() - 172800000).toISOString().split('T')[0] // 2 days ago
      }
    ];

    sampleTransactions.forEach(transaction => {
      this.addTransaction(transaction);
    });
  }
}

export const transactionService = new TransactionService();
