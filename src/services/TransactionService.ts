import AsyncStorage from '@react-native-async-storage/async-storage';

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
  { id: 'salary', name: 'Gehalt', icon: 'briefcase', color: '#10b981', type: 'income' },
  { id: 'freelance', name: 'Freelance', icon: 'laptop', color: '#10b981', type: 'income' },
  { id: 'investment', name: 'Investitionen', icon: 'trending-up', color: '#10b981', type: 'income' },
  { id: 'bonus', name: 'Bonus', icon: 'gift', color: '#10b981', type: 'income' },
  { id: 'other_income', name: 'Sonstiges Einkommen', icon: 'plus-circle', color: '#10b981', type: 'income' },
  
  // Expense Categories
  { id: 'groceries', name: 'Lebensmittel', icon: 'shopping-cart', color: '#dc2626', type: 'expense' },
  { id: 'transport', name: 'Transport', icon: 'car', color: '#dc2626', type: 'expense' },
  { id: 'housing', name: 'Wohnen', icon: 'home', color: '#dc2626', type: 'expense' },
  { id: 'utilities', name: 'Nebenkosten', icon: 'zap', color: '#dc2626', type: 'expense' },
  { id: 'health', name: 'Gesundheit', icon: 'heart', color: '#dc2626', type: 'expense' },
  { id: 'entertainment', name: 'Unterhaltung', icon: 'film', color: '#dc2626', type: 'expense' },
  { id: 'restaurant', name: 'Restaurant', icon: 'utensils', color: '#dc2626', type: 'expense' },
  { id: 'shopping', name: 'Einkaufen', icon: 'shopping-bag', color: '#dc2626', type: 'expense' },
  { id: 'education', name: 'Bildung', icon: 'graduation-cap', color: '#dc2626', type: 'expense' },
  { id: 'insurance', name: 'Versicherung', icon: 'shield', color: '#dc2626', type: 'expense' },
  { id: 'other_expense', name: 'Sonstige Ausgaben', icon: 'minus-circle', color: '#dc2626', type: 'expense' }
];

class TransactionService {
  private readonly STORAGE_KEY = 'moneyup-transactions';

  // Get all transactions
  async getTransactions(): Promise<Transaction[]> {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading transactions:', error);
      return [];
    }
  }

  // Get transactions by date range
  async getTransactionsByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    const transactions = await this.getTransactions();
    return transactions.filter(transaction => 
      transaction.date >= startDate && transaction.date <= endDate
    );
  }

  // Get transactions by category
  async getTransactionsByCategory(categoryId: string): Promise<Transaction[]> {
    const transactions = await this.getTransactions();
    return transactions.filter(transaction => transaction.category === categoryId);
  }

  // Get transactions by type
  async getTransactionsByType(type: 'income' | 'expense'): Promise<Transaction[]> {
    const transactions = await this.getTransactions();
    return transactions.filter(transaction => transaction.type === type);
  }

  // Add new transaction
  async addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    const transactions = await this.getTransactions();
    const newTransaction: Transaction = {
      ...transaction,
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    transactions.push(newTransaction);
    await this.saveTransactions(transactions);
    return newTransaction;
  }

  // Update transaction
  async updateTransaction(id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>): Promise<Transaction | null> {
    const transactions = await this.getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    
    if (index === -1) return null;
    
    transactions[index] = {
      ...transactions[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await this.saveTransactions(transactions);
    return transactions[index];
  }

  // Delete transaction
  async deleteTransaction(id: string): Promise<boolean> {
    const transactions = await this.getTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    
    if (filtered.length === transactions.length) return false;
    
    await this.saveTransactions(filtered);
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
  async getTotalIncome(startDate?: string, endDate?: string): Promise<number> {
    let transactions = await this.getTransactionsByType('income');
    
    if (startDate && endDate) {
      transactions = transactions.filter(t => t.date >= startDate && t.date <= endDate);
    }
    
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
  }

  // Calculate total expenses for a period
  async getTotalExpenses(startDate?: string, endDate?: string): Promise<number> {
    let transactions = await this.getTransactionsByType('expense');
    
    if (startDate && endDate) {
      transactions = transactions.filter(t => t.date >= startDate && t.date <= endDate);
    }
    
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
  }

  // Get balance for a period
  async getBalance(startDate?: string, endDate?: string): Promise<number> {
    const income = await this.getTotalIncome(startDate, endDate);
    const expenses = await this.getTotalExpenses(startDate, endDate);
    return income - expenses;
  }

  // Get spending by category
  async getSpendingByCategory(startDate?: string, endDate?: string): Promise<{ [categoryId: string]: number }> {
    let transactions = await this.getTransactionsByType('expense');
    
    if (startDate && endDate) {
      transactions = transactions.filter(t => t.date >= startDate && t.date <= endDate);
    }
    
    return transactions.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as { [categoryId: string]: number });
  }

  // Save transactions to AsyncStorage
  private async saveTransactions(transactions: Transaction[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  }

  // Create sample transactions for demo
  async createSampleTransactions(): Promise<void> {
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

    for (const transaction of sampleTransactions) {
      await this.addTransaction(transaction);
    }
  }
}

export const transactionService = new TransactionService();