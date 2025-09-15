import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: 'de' | 'en';
  setLanguage: (lang: 'de' | 'en') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  de: {
    // Navigation
    'nav.overview': 'Übersicht',
    'nav.fixedCosts': 'Fixkosten',
    'nav.accounts': 'Konten',
    'nav.analysis': 'Analyse',
    'nav.settings': 'Einstellungen',
    'nav.logout': 'Abmelden',
    
    // Common
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.delete': 'Löschen',
    'common.edit': 'Bearbeiten',
    'common.add': 'Hinzufügen',
    'common.back': 'Zurück',
    'common.next': 'Weiter',
    'common.finish': 'Abschließen',
    'common.loading': 'Lädt...',
    'common.error': 'Fehler',
    'common.success': 'Erfolg',
    
    // Dashboard
    'dashboard.welcome': 'Willkommen zurück',
    'dashboard.monthlyIncome': 'Monatseinkommen',
    'dashboard.totalExpenses': 'Gesamtausgaben',
    'dashboard.available': 'Verfügbar',
    'dashboard.savingsRate': 'Sparquote',
    
    // Payment
    'payment.title': 'Zahlung',
    'payment.amount': '4,99€',
    'payment.description': 'Einmalige Zahlung für MoneyUP Premium',
    'payment.features': 'Was Sie erhalten',
    'payment.feature1': 'Vollzugriff auf alle MoneyUP-Features',
    'payment.feature2': 'Persönliche Finanzanalyse & Empfehlungen',
    'payment.feature3': 'MoneyBot AI-Assistent',
    'payment.feature4': 'Steueroptimierung & Sparpotentiale',
    'payment.feature5': 'Lifetime-Updates & Support',
    'payment.payNow': 'Jetzt 4,99€ zahlen',
    'payment.processing': 'Wird verarbeitet...',
    'payment.success': 'Zahlung erfolgreich!',
    'payment.successMessage': 'Vielen Dank für Ihren Kauf. Sie haben jetzt vollen Zugriff auf alle MoneyUP-Features.',
    
    // Onboarding
    'onboarding.welcome': 'Willkommen bei MoneyUP!',
    'onboarding.subtitle': 'Lassen Sie uns Ihre Finanzen erfassen - das dauert nur eine Minute!',
    'onboarding.start': 'Los geht\'s',
    'onboarding.personalInfo': 'Persönliche Informationen',
    'onboarding.income': 'Ihr monatliches Einkommen',
    'onboarding.incomeDescription': 'Geben Sie Ihr monatliches Nettoeinkommen ein. Dies hilft uns, Ihr Budget zu berechnen.',
    'onboarding.complete': 'Onboarding abschließen',
    'onboarding.saving': 'Speichert...',
    
    // Goals
    'goals.title': 'Sparziele',
    'goals.addGoal': 'Neues Ziel',
    'goals.activeGoals': 'Aktive Ziele',
    'goals.completedGoals': 'Abgeschlossene Ziele',
    'goals.totalTarget': 'Gesamtziel',
    'goals.achieved': 'Erreicht',
    'goals.progress': 'Fortschritt',
    
    // Achievements
    'achievements.title': 'Erfolge',
    'achievements.achieved': 'Erreicht',
    'achievements.points': 'Punkte',
    'achievements.unlocked': 'Erreichte Erfolge',
    'achievements.locked': 'Noch zu erreichen',
    
    // Settings
    'settings.title': 'Einstellungen',
    'settings.profile': 'Profil',
    'settings.appSettings': 'App-Einstellungen',
    'settings.privacy': 'Datenschutz & Sicherheit',
    'settings.dataManagement': 'Datenverwaltung',
    'settings.appInfo': 'App-Informationen',
    'settings.support': 'Support',
    
    // Transactions
    'transactions.title': 'Transaktionen',
    'transactions.addTransaction': 'Hinzufügen',
    'transactions.income': 'Einnahmen',
    'transactions.expenses': 'Ausgaben',
    'transactions.balance': 'Saldo',
    'transactions.description': 'Beschreibung',
    'transactions.amount': 'Betrag',
    'transactions.category': 'Kategorie',
    'transactions.date': 'Datum',
    
    // Debts
    'debts.title': 'Schulden',
    'debts.addDebt': 'Hinzufügen',
    'debts.totalDebt': 'Gesamtschulden',
    'debts.minimumPayments': 'Mindestzahlungen',
    'debts.interestPerMonth': 'Zinsen/Monat',
    'debts.activeDebts': 'Aktive Schulden',
    'debts.paidOff': 'Abbezahlte Schulden',
    
    // Expenses
    'expenses.title': 'Ausgaben',
    'expenses.addExpense': 'Hinzufügen',
    'expenses.totalExpenses': 'Gesamtausgaben',
    'expenses.numberOfExpenses': 'Anzahl Ausgaben',
    'expenses.average': 'Durchschnitt',
    'expenses.categories': 'Kategorien',
    'expenses.categoryBreakdown': 'Kategorie-Übersicht',
    'expenses.recentExpenses': 'Letzte Ausgaben',
  },
  en: {
    // Navigation
    'nav.overview': 'Overview',
    'nav.fixedCosts': 'Fixed Costs',
    'nav.accounts': 'Accounts',
    'nav.analysis': 'Analysis',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.finish': 'Finish',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    
    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.monthlyIncome': 'Monthly Income',
    'dashboard.totalExpenses': 'Total Expenses',
    'dashboard.available': 'Available',
    'dashboard.savingsRate': 'Savings Rate',
    
    // Payment
    'payment.title': 'Payment',
    'payment.amount': '4.99€',
    'payment.description': 'One-time payment for MoneyUP Premium',
    'payment.features': 'What you get',
    'payment.feature1': 'Full access to all MoneyUP features',
    'payment.feature2': 'Personal financial analysis & recommendations',
    'payment.feature3': 'MoneyBot AI assistant',
    'payment.feature4': 'Tax optimization & savings potential',
    'payment.feature5': 'Lifetime updates & support',
    'payment.payNow': 'Pay 4.99€ now',
    'payment.processing': 'Processing...',
    'payment.success': 'Payment successful!',
    'payment.successMessage': 'Thank you for your purchase. You now have full access to all MoneyUP features.',
    
    // Onboarding
    'onboarding.welcome': 'Welcome to MoneyUP!',
    'onboarding.subtitle': 'Let\'s capture your finances - it only takes a minute!',
    'onboarding.start': 'Let\'s go',
    'onboarding.personalInfo': 'Personal Information',
    'onboarding.income': 'Your monthly income',
    'onboarding.incomeDescription': 'Enter your monthly net income. This helps us calculate your budget.',
    'onboarding.complete': 'Complete onboarding',
    'onboarding.saving': 'Saving...',
    
    // Goals
    'goals.title': 'Savings Goals',
    'goals.addGoal': 'New Goal',
    'goals.activeGoals': 'Active Goals',
    'goals.completedGoals': 'Completed Goals',
    'goals.totalTarget': 'Total Target',
    'goals.achieved': 'Achieved',
    'goals.progress': 'Progress',
    
    // Achievements
    'achievements.title': 'Achievements',
    'achievements.achieved': 'Achieved',
    'achievements.points': 'Points',
    'achievements.unlocked': 'Unlocked Achievements',
    'achievements.locked': 'To be achieved',
    
    // Settings
    'settings.title': 'Settings',
    'settings.profile': 'Profile',
    'settings.appSettings': 'App Settings',
    'settings.privacy': 'Privacy & Security',
    'settings.dataManagement': 'Data Management',
    'settings.appInfo': 'App Information',
    'settings.support': 'Support',
    
    // Transactions
    'transactions.title': 'Transactions',
    'transactions.addTransaction': 'Add',
    'transactions.income': 'Income',
    'transactions.expenses': 'Expenses',
    'transactions.balance': 'Balance',
    'transactions.description': 'Description',
    'transactions.amount': 'Amount',
    'transactions.category': 'Category',
    'transactions.date': 'Date',
    
    // Debts
    'debts.title': 'Debts',
    'debts.addDebt': 'Add',
    'debts.totalDebt': 'Total Debt',
    'debts.minimumPayments': 'Minimum Payments',
    'debts.interestPerMonth': 'Interest/Month',
    'debts.activeDebts': 'Active Debts',
    'debts.paidOff': 'Paid Off Debts',
    
    // Expenses
    'expenses.title': 'Expenses',
    'expenses.addExpense': 'Add',
    'expenses.totalExpenses': 'Total Expenses',
    'expenses.numberOfExpenses': 'Number of Expenses',
    'expenses.average': 'Average',
    'expenses.categories': 'Categories',
    'expenses.categoryBreakdown': 'Category Breakdown',
    'expenses.recentExpenses': 'Recent Expenses',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'de' | 'en'>('de');

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('moneyup-language') as 'de' | 'en';
    if (savedLanguage && (savedLanguage === 'de' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: 'de' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('moneyup-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['de']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
