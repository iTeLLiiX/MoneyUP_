import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { transactionService, Transaction } from '../services/TransactionService';
import AddTransactionModal from '../components/AddTransactionModal';
import HelpTooltip from '../components/HelpTooltip';
import WelcomeTutorial from '../components/WelcomeTutorial';
import AccessibilitySettings from '../components/AccessibilitySettings';
import VoiceAssistant from '../components/VoiceAssistant';
import SimplifiedMode from '../components/SimplifiedMode';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import BankConnectionSettings from '../components/BankConnectionSettings';
import '../styles/ModernDesign.css';

const DashboardScreen: React.FC = () => {
  const { user } = useAppStore();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [showWelcomeTutorial, setShowWelcomeTutorial] = useState(false);
  const [showAccessibilitySettings, setShowAccessibilitySettings] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showBankConnectionSettings, setShowBankConnectionSettings] = useState(false);
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    largeText: false,
    highContrast: false,
    simplifiedMode: false,
    voiceGuidance: false,
    reducedMotion: false
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [bankSettings, setBankSettings] = useState<any>(null);

  useEffect(() => {
    const loadUserData = () => {
      try {
        console.log('🔍 Starting data load...');
        
        // Try to get from localStorage first (most complete data)
        const savedData = localStorage.getItem('moneyup-user-profile');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          console.log('🔍 Loaded from localStorage user-profile:', parsedData);
          setUserData(parsedData);
          setIsLoading(false);
          return;
        }
        
        // Try to get from onboarding progress
        const onboardingData = localStorage.getItem('moneyup-onboarding-progress');
        if (onboardingData) {
          const parsedOnboarding = JSON.parse(onboardingData);
          console.log('🔍 Loaded from onboarding progress:', parsedOnboarding);
          setUserData(parsedOnboarding);
          setIsLoading(false);
          return;
        }
        
        // Try to get from store as fallback
        if (user) {
          console.log('🔍 Loaded from store:', user);
          setUserData(user);
        } else {
          console.log('🔍 No data found anywhere');
          setUserData(null);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    };

    const loadTransactions = () => {
      const allTransactions = transactionService.getTransactions();
      setTransactions(allTransactions);
      
      // Create sample transactions if none exist
      if (allTransactions.length === 0) {
        transactionService.createSampleTransactions();
        setTransactions(transactionService.getTransactions());
      }
    };

    const checkTutorialStatus = () => {
      const tutorialCompleted = localStorage.getItem('moneyup-tutorial-completed');
      if (!tutorialCompleted) {
        setShowWelcomeTutorial(true);
      }
    };

    const loadAccessibilitySettings = () => {
      const savedSettings = localStorage.getItem('moneyup-accessibility-settings');
      if (savedSettings) {
        setAccessibilitySettings(JSON.parse(savedSettings));
      }
    };

    const loadBankSettings = () => {
      try {
        const savedSettings = localStorage.getItem('moneyup-bank-settings');
        if (savedSettings) {
          setBankSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Error loading bank settings:', error);
      }
    };

    loadUserData();
    loadTransactions();
    checkTutorialStatus();
    loadAccessibilitySettings();
    loadBankSettings();
  }, [user]);

  const handleTransactionAdded = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleBankSettingsUpdate = (settings: any) => {
    setBankSettings(settings);
    // Reload transactions if bank connection is active
    if (settings.method === 'bank') {
      const allTransactions = transactionService.getTransactions();
      setTransactions(allTransactions);
    }
  };

  const handleTutorialComplete = () => {
    localStorage.setItem('moneyup-tutorial-completed', 'true');
    setShowWelcomeTutorial(false);
  };

  const handleTutorialClose = () => {
    setShowWelcomeTutorial(false);
  };

  const handleVoiceTransaction = (type: 'income' | 'expense', amount: number, description: string, category: string) => {
    const transaction = transactionService.addTransaction({
      amount,
      description,
      category,
      type,
      date: new Date().toISOString().split('T')[0]
    });
    handleTransactionAdded(transaction);
  };

  if (isLoading) {
    return (
      <div className="onboarding-container">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <img src="/MoneyUP.png" alt="MoneyUP" className="logo" style={{ height: '80px' }} />
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #10b981',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Lade Ihr Dashboard...</p>
        </div>
      </div>
    );
  }

  // Get monthly income from all possible sources
  const monthlyIncome = userData?.income?.monthlyNetIncome || 
                       userData?.personalInfo?.monthlyIncome || 
                       userData?.monthlyIncome || 
                       (userData?.income && userData.income.monthlyNetIncome) || 0;
  
  console.log('🔍 Monthly Income Sources:', {
    'userData?.income?.monthlyNetIncome': userData?.income?.monthlyNetIncome,
    'userData?.personalInfo?.monthlyIncome': userData?.personalInfo?.monthlyIncome,
    'userData?.monthlyIncome': userData?.monthlyIncome,
    'final monthlyIncome': monthlyIncome
  });
  
  // Calculate real-time financial metrics from transactions
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
  const currentMonthStart = `${currentMonth}-01`;
  const currentMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];

  const currentMonthIncome = transactionService.getTotalIncome(currentMonthStart, currentMonthEnd);
  const currentMonthExpenses = transactionService.getTotalExpenses(currentMonthStart, currentMonthEnd);
  const currentMonthBalance = currentMonthIncome - currentMonthExpenses;
  
  // Calculate real fixed costs from onboarding data
  const calculateFixedCosts = () => {
    let totalFixedCosts = 0;
    
    if (userData?.housing) {
      totalFixedCosts += (userData.housing.rent || 0);
      totalFixedCosts += (userData.housing.utilities || 0);
      totalFixedCosts += (userData.housing.otherHousing || 0);
      totalFixedCosts += ((userData.housing.homeInsurance || 0) / 12);
    }
    
    if (userData?.transport) {
      totalFixedCosts += (userData.transport.fuel || 0);
      totalFixedCosts += (userData.transport.publicTransport || 0);
      totalFixedCosts += (userData.transport.maintenance || 0);
      totalFixedCosts += ((userData.transport.carInsurance || 0) / 12);
      totalFixedCosts += ((userData.transport.carTax || 0) / 12);
    }
    
    if (userData?.insurance) {
      totalFixedCosts += (userData.insurance.healthInsurance || 0);
      totalFixedCosts += (userData.insurance.disabilityInsurance || 0);
      totalFixedCosts += (userData.insurance.pensionInsurance || 0);
      totalFixedCosts += (userData.insurance.privatePension || 0);
      totalFixedCosts += (userData.insurance.otherInsurance || 0);
      totalFixedCosts += ((userData.insurance.liabilityInsurance || 0) / 12);
    }
    
    if (userData?.digital) {
      totalFixedCosts += (userData.digital.internet || 0);
      totalFixedCosts += (userData.digital.mobile || 0);
      totalFixedCosts += (userData.digital.streaming || 0);
      totalFixedCosts += (userData.digital.software || 0);
      totalFixedCosts += (userData.digital.cloud || 0);
      totalFixedCosts += (userData.digital.gaming || 0);
    }
    
    if (userData?.health) {
      totalFixedCosts += (userData.health.medication || 0);
      totalFixedCosts += (userData.health.fitness || 0);
      totalFixedCosts += (userData.health.wellness || 0);
      totalFixedCosts += (userData.health.alternativeMedicine || 0);
      totalFixedCosts += (userData.health.otherHealth || 0);
      totalFixedCosts += ((userData.health.dental || 0) / 12);
    }
    
    if (userData?.education) {
      totalFixedCosts += (userData.education.education || 0);
      totalFixedCosts += (userData.education.books || 0);
      totalFixedCosts += (userData.education.hobbies || 0);
      totalFixedCosts += (userData.education.restaurant || 0);
      totalFixedCosts += (userData.education.entertainment || 0);
      totalFixedCosts += ((userData.education.travel || 0) / 12);
    }
    
    console.log('🔍 Fixed Costs Calculation:', {
      housing: userData?.housing,
      transport: userData?.transport,
      insurance: userData?.insurance,
      digital: userData?.digital,
      health: userData?.health,
      education: userData?.education,
      totalFixedCosts,
      userDataKeys: userData ? Object.keys(userData) : 'No userData'
    });
    
    return totalFixedCosts;
  };
  
  const fixedCosts = calculateFixedCosts();
  const availableBudget = monthlyIncome - fixedCosts;

  // Use real transaction data for current month stats
  const displayIncome = currentMonthIncome > 0 ? currentMonthIncome : monthlyIncome;
  const displayExpenses = currentMonthExpenses > 0 ? currentMonthExpenses : fixedCosts;
  const displayBalance = currentMonthBalance !== 0 ? currentMonthBalance : availableBudget;
  const displaySavingsRate = displayIncome > 0 ? ((displayBalance / displayIncome) * 100).toFixed(1) : '0';
  
  // Debug: Log calculations
  console.log('🔍 Financial Calculations:', {
    monthlyIncome,
    currentMonthIncome,
    currentMonthExpenses,
    fixedCosts,
    displayIncome,
    displayExpenses,
    displayBalance,
    displaySavingsRate,
    availableBudget
  });

  // Show simplified mode if enabled
  if (accessibilitySettings.simplifiedMode) {
    return (
      <>
        <SimplifiedMode
          transactions={transactions}
          onAddTransaction={() => setIsAddTransactionModalOpen(true)}
          monthlyIncome={displayIncome}
          monthlyExpenses={displayExpenses}
        />
        
        <AddTransactionModal
          isOpen={isAddTransactionModalOpen}
          onClose={() => setIsAddTransactionModalOpen(false)}
          onTransactionAdded={handleTransactionAdded}
        />
        
        <VoiceAssistant
          onTransactionAdd={handleVoiceTransaction}
          isEnabled={accessibilitySettings.voiceGuidance}
        />
        
        <AccessibilitySettings
          isOpen={showAccessibilitySettings}
          onClose={() => setShowAccessibilitySettings(false)}
        />
      </>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Übersicht', icon: 'fas fa-chart-pie' },
    { id: 'transactions', label: 'Transaktionen', icon: 'fas fa-list' },
    { id: 'onboarding', label: 'Onboarding', icon: 'fas fa-user-circle' },
    { id: 'budget', label: 'Budget', icon: 'fas fa-wallet' },
    { id: 'goals', label: 'Ziele', icon: 'fas fa-target' },
    { id: 'reports', label: 'Berichte', icon: 'fas fa-chart-bar' },
    { id: 'settings', label: 'Einstellungen', icon: 'fas fa-cog' }
  ];

  const renderOverview = () => (
    <div>
      {/* Welcome Section */}
      <div className="onboarding-step">
        <div className="step-header">
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#f0fdf4',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '32px',
            color: '#10b981'
          }}>
            <i className="fas fa-hand-wave"></i>
          </div>
          <h2>Willkommen zurück, {userData?.name || userData?.personalInfo?.name || 'Nutzer'}!</h2>
          <p>Hier sehen Sie Ihre Finanzen auf einen Blick - einfach und verständlich.</p>
          
          {/* Debug Info for User */}
          {userData && (
            <div style={{ 
              backgroundColor: '#f0f9ff', 
              border: '1px solid #bae6fd', 
              borderRadius: '8px', 
              padding: '12px', 
              marginTop: '16px',
              fontSize: '12px',
              color: '#0369a1'
            }}>
              <strong>📊 Ihre Onboarding-Daten:</strong><br/>
              Name: {userData?.name || userData?.personalInfo?.name || 'Nicht angegeben'}<br/>
              Einkommen: {monthlyIncome.toLocaleString()} €<br/>
              Fixkosten: {fixedCosts.toLocaleString()} €<br/>
              Verfügbares Budget: {availableBudget.toLocaleString()} €<br/>
              Bankverbindung: {userData?.bankConnection?.method === 'bank' ? 'Bank verbunden' : 'Manuell'}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="onboarding-step">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Finanzübersicht</h2>
          {(bankSettings || userData?.bankConnection) && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '20px',
              backgroundColor: (bankSettings?.method === 'bank' || userData?.bankConnection?.method === 'bank') ? '#ecfdf5' : '#f3f4f6',
              border: `1px solid ${(bankSettings?.method === 'bank' || userData?.bankConnection?.method === 'bank') ? '#10b981' : '#d1d5db'}`
            }}>
              <i className={`fas ${(bankSettings?.method === 'bank' || userData?.bankConnection?.method === 'bank') ? 'fa-cloud' : 'fa-edit'}`} 
                 style={{ color: (bankSettings?.method === 'bank' || userData?.bankConnection?.method === 'bank') ? '#10b981' : '#6b7280', fontSize: '12px' }}></i>
              <span style={{ 
                fontSize: '12px', 
                fontWeight: '500', 
                color: (bankSettings?.method === 'bank' || userData?.bankConnection?.method === 'bank') ? '#10b981' : '#6b7280' 
              }}>
                {(bankSettings?.method === 'bank' || userData?.bankConnection?.method === 'bank') ? 'Bank verbunden' : 'Manuell'}
              </span>
            </div>
          )}
        </div>
        <p style={{ 
          fontSize: '14px', 
          color: '#6b7280', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          Diese Zahlen zeigen Ihnen, wie es um Ihre Finanzen steht
        </p>
        <div className="modern-grid modern-grid-4">
          <div className="modern-card modern-fade-in" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
            <HelpTooltip 
              title="Einkommen" 
              content={currentMonthIncome > 0 ? 'Ihr Einkommen in diesem Monat aus allen Transaktionen' : 'Ihr geplantes monatliches Einkommen aus dem Onboarding'}
            >
              <div className="modern-icon" style={{ margin: '0 auto var(--space-4)' }}>
                <i className="fas fa-euro-sign"></i>
              </div>
            </HelpTooltip>
            <div className="modern-heading-3" style={{ marginBottom: 'var(--space-2)' }}>
              {displayIncome.toLocaleString('de-DE')}€
            </div>
            <div className="modern-text-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {currentMonthIncome > 0 ? 'Einkommen (aktuell)' : 'Monatliches Einkommen'}
            </div>
          </div>
          
          <div className="modern-card modern-fade-in" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
            <div className={`modern-icon ${currentMonthExpenses > 0 ? 'modern-icon-error' : (availableBudget > 0 ? 'modern-icon-success' : 'modern-icon-error')}`} style={{ margin: '0 auto var(--space-4)' }}>
              <i className="fas fa-chart-bar"></i>
            </div>
            <div className="modern-heading-3" style={{ marginBottom: 'var(--space-2)' }}>
              {displayExpenses.toLocaleString('de-DE')}€
            </div>
            <div className="modern-text-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {currentMonthExpenses > 0 ? 'Ausgaben (aktuell)' : 'Verfügbares Budget'}
            </div>
          </div>
          
          <div className="modern-card modern-fade-in" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
            <div className={`modern-icon ${displayBalance > 0 ? 'modern-icon-success' : 'modern-icon-error'}`} style={{ margin: '0 auto var(--space-4)' }}>
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="modern-heading-3" style={{ marginBottom: 'var(--space-2)' }}>
              {displayBalance.toLocaleString('de-DE')}€
            </div>
            <div className="modern-text-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Verfügbares Budget
            </div>
          </div>
          
          <div className="modern-card modern-fade-in" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
            <div className="modern-icon" style={{ margin: '0 auto var(--space-4)' }}>
              <i className="fas fa-exchange-alt"></i>
            </div>
            <div className="modern-heading-3" style={{ marginBottom: 'var(--space-2)' }}>
              {transactions.length}
            </div>
            <div className="modern-text-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Transaktionen
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="onboarding-step">
        <h2>Letzte Transaktionen</h2>
        <p style={{ 
          fontSize: '14px', 
          color: '#6b7280', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          Hier sehen Sie Ihre letzten Einnahmen und Ausgaben
        </p>
        <div style={{ marginTop: '20px' }}>
          {transactions.slice(0, 5).map((transaction) => {
            const category = transactionService.getCategoryById(transaction.category);
            const date = new Date(transaction.date);
            const formattedDate = date.toLocaleDateString('de-DE', { 
              day: '2-digit', 
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            });
            
            return (
              <div key={transaction.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                marginBottom: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <i 
                    className={category?.icon || 'fas fa-circle'} 
                    style={{ color: category?.color || '#6b7280' }}
                  ></i>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1f2937' }}>
                      {transaction.description}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {category?.name || 'Unbekannt'} • {formattedDate}
                    </div>
                  </div>
                </div>
                <div style={{ 
                  color: transaction.type === 'income' ? '#10b981' : '#dc2626', 
                  fontWeight: '600' 
                }}>
                  {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString('de-DE')}€
                </div>
              </div>
            );
          })}
          
          {transactions.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#6b7280'
            }}>
              <i className="fas fa-receipt" style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}></i>
              <p>Noch keine Transaktionen vorhanden</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="onboarding-step">
        <h2>Schnellaktionen</h2>
        <p style={{ 
          fontSize: '14px', 
          color: '#6b7280', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          Was möchten Sie als nächstes tun?
        </p>
        <div className="modern-grid modern-grid-2" style={{ marginTop: 'var(--space-6)' }}>
          <button 
            className="modern-btn-primary" 
            style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)' }}
            onClick={() => setIsAddTransactionModalOpen(true)}
          >
            <i className="fas fa-plus"></i>
            Transaktion hinzufügen
          </button>
          <button 
            className="modern-btn-secondary" 
            style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)' }}
            onClick={() => setShowBankConnectionSettings(true)}
          >
            <i className="fas fa-university"></i>
            Bankverbindung
          </button>
        </div>
        
        <div className="modern-grid modern-grid-2" style={{ marginTop: 'var(--space-4)' }}>
          <button 
            className="modern-btn-secondary" 
            style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)' }}
            onClick={() => setShowWelcomeTutorial(true)}
          >
            <i className="fas fa-question-circle"></i>
            Hilfe & Tutorial
          </button>
          <button 
            className="modern-btn-secondary" 
            style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)' }}
            onClick={() => setShowAccessibilitySettings(true)}
          >
            <i className="fas fa-universal-access"></i>
            Barrierefreiheit
          </button>
        </div>
      </div>
    </div>
  );

  const renderOnboarding = () => {
    // Debug: Log all userData to console
    console.log('🔍 Debug - UserData:', userData);
    console.log('🔍 Debug - localStorage user-profile:', localStorage.getItem('moneyup-user-profile'));
    console.log('🔍 Debug - localStorage onboarding-progress:', localStorage.getItem('moneyup-onboarding-progress'));
    console.log('🔍 Debug - localStorage onboarding-completed:', localStorage.getItem('moneyup-onboarding-completed'));
    
    // Try to load data directly
    const directUserProfile = localStorage.getItem('moneyup-user-profile');
    const directOnboardingProgress = localStorage.getItem('moneyup-onboarding-progress');
    console.log('🔍 Debug - Direct user-profile:', directUserProfile ? JSON.parse(directUserProfile) : null);
    console.log('🔍 Debug - Direct onboarding-progress:', directOnboardingProgress ? JSON.parse(directOnboardingProgress) : null);
    
    return (
      <div>
        <div className="onboarding-step">
          <div className="step-header">
            <h2>
              <i className="fas fa-user-circle" style={{ marginRight: '12px', color: '#10b981' }}></i>
              Ihre Onboarding-Daten
            </h2>
            <p>Alle Daten aus Ihrem Onboarding-Prozess</p>
            
            {/* Debug Info */}
            <div style={{ 
              backgroundColor: '#f0f9ff', 
              border: '1px solid #bae6fd', 
              borderRadius: '8px', 
              padding: '12px', 
              marginBottom: '20px',
              fontSize: '12px',
              color: '#0369a1'
            }}>
              <strong>🔍 Debug-Information:</strong><br/>
              UserData vorhanden: {userData ? '✅ Ja' : '❌ Nein'}<br/>
              PersonalInfo: {userData?.personalInfo ? '✅ Ja' : '❌ Nein'}<br/>
              BankConnection: {userData?.bankConnection ? '✅ Ja' : '❌ Nein'}<br/>
              Housing: {userData?.housing ? '✅ Ja' : '❌ Nein'}<br/>
              Transport: {userData?.transport ? '✅ Ja' : '❌ Nein'}<br/>
              Goals: {userData?.goals ? '✅ Ja' : '❌ Nein'}
            </div>
          </div>
        
        {userData ? (
          <div className="modern-grid modern-grid-2" style={{ gap: 'var(--space-4)' }}>
            {/* Personal Info */}
            <div className="modern-card" style={{ padding: 'var(--space-4)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: 'var(--space-3)' }}>
                <i className="fas fa-user" style={{ marginRight: '8px', color: '#10b981' }}></i>
                Persönliche Daten
              </h3>
              <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
                <p><strong>Name:</strong> {userData.personalInfo?.name || userData.name || 'Nicht angegeben'}</p>
                <p><strong>Alter:</strong> {userData.personalInfo?.age || userData.age || 'Nicht angegeben'}</p>
                <p><strong>Beruf:</strong> {userData.personalInfo?.occupation || userData.occupation || 'Nicht angegeben'}</p>
                <p><strong>Familienstand:</strong> {userData.personalInfo?.familyStatus || userData.familyStatus || 'Nicht angegeben'}</p>
                <p><strong>Kinder:</strong> {userData.personalInfo?.children || userData.children || 0}</p>
              </div>
            </div>

            {/* Income */}
            <div className="modern-card" style={{ padding: 'var(--space-4)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: 'var(--space-3)' }}>
                <i className="fas fa-euro-sign" style={{ marginRight: '8px', color: '#10b981' }}></i>
                Einkommen
              </h3>
              <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
                <p><strong>Monatliches Nettoeinkommen:</strong> {userData.income?.monthlyNetIncome || userData.personalInfo?.monthlyIncome || userData.monthlyIncome || 0} €</p>
                {userData.income?.incomeSources && userData.income.incomeSources.length > 0 && (
                  <p><strong>Einkommensquellen:</strong> {userData.income.incomeSources.join(', ')}</p>
                )}
              </div>
            </div>

            {/* Bank Connection */}
            {userData.bankConnection && (
              <div className="modern-card" style={{ padding: 'var(--space-4)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: 'var(--space-3)' }}>
                  <i className="fas fa-university" style={{ marginRight: '8px', color: '#10b981' }}></i>
                  Bankverbindung
                </h3>
                <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
                  <p><strong>Methode:</strong> {userData.bankConnection.method === 'bank' ? 'Bank verbunden' : 'Manuell'}</p>
                  {userData.bankConnection.selectedBank && (
                    <p><strong>Bank:</strong> {userData.bankConnection.selectedBank}</p>
                  )}
                  {userData.bankConnection.connectedAccounts && userData.bankConnection.connectedAccounts.length > 0 && (
                    <p><strong>Verbundene Konten:</strong> {userData.bankConnection.connectedAccounts.length}</p>
                  )}
                </div>
              </div>
            )}

            {/* Housing */}
            {userData.housing && (
              <div className="modern-card" style={{ padding: 'var(--space-4)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: 'var(--space-3)' }}>
                  <i className="fas fa-home" style={{ marginRight: '8px', color: '#10b981' }}></i>
                  Wohnen
                </h3>
                <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
                  <p><strong>Wohnart:</strong> {userData.housing.housingType || 'Nicht angegeben'}</p>
                  <p><strong>Miete:</strong> {userData.housing.rent || 0} €</p>
                  <p><strong>Nebenkosten:</strong> {userData.housing.utilities || 0} €</p>
                  <p><strong>Hausratversicherung:</strong> {userData.housing.homeInsurance || 0} €</p>
                </div>
              </div>
            )}

            {/* Transport */}
            {userData.transport && (
              <div className="modern-card" style={{ padding: 'var(--space-4)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: 'var(--space-3)' }}>
                  <i className="fas fa-car" style={{ marginRight: '8px', color: '#10b981' }}></i>
                  Mobilität
                </h3>
                <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
                  <p><strong>Transportart:</strong> {userData.transport.transportType || 'Nicht angegeben'}</p>
                  <p><strong>Kraftstoff:</strong> {userData.transport.fuel || 0} €</p>
                  <p><strong>KFZ-Versicherung:</strong> {userData.transport.carInsurance || 0} €</p>
                  <p><strong>Öffentliche Verkehrsmittel:</strong> {userData.transport.publicTransport || 0} €</p>
                </div>
              </div>
            )}

            {/* Goals */}
            {userData.goals && (
              <div className="modern-card" style={{ padding: 'var(--space-4)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: 'var(--space-3)' }}>
                  <i className="fas fa-target" style={{ marginRight: '8px', color: '#10b981' }}></i>
                  Finanzziele
                </h3>
                <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
                  <p><strong>Ziel:</strong> {userData.goals.financialGoal || 'Nicht angegeben'}</p>
                  <p><strong>Sparziel:</strong> {userData.goals.savingsGoal || 0} €</p>
                  <p><strong>Zeitrahmen:</strong> {userData.goals.timeframe || 'Nicht angegeben'}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="modern-card" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
            <i className="fas fa-exclamation-triangle" style={{ fontSize: '48px', color: '#f59e0b', marginBottom: 'var(--space-4)' }}></i>
            <h3 style={{ color: '#1f2937', marginBottom: 'var(--space-2)' }}>Keine Onboarding-Daten gefunden</h3>
            <p style={{ color: '#6b7280' }}>Bitte führen Sie das Onboarding durch, um Ihre Daten zu sehen.</p>
          </div>
        )}
        </div>
      </div>
    );
  };

  const renderBudget = () => (
    <div>
      <div className="onboarding-step">
        <div className="step-header">
          <h2>
            <i className="fas fa-wallet" style={{ marginRight: '12px', color: '#10b981' }}></i>
            Budget-Übersicht
          </h2>
          <p>Ihr monatliches Budget basierend auf Ihren Onboarding-Daten</p>
        </div>
        
        <div className="modern-grid modern-grid-2" style={{ gap: 'var(--space-4)' }}>
          {/* Income Overview */}
          <div className="modern-card" style={{ padding: 'var(--space-4)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: 'var(--space-3)' }}>
              <i className="fas fa-euro-sign" style={{ marginRight: '8px', color: '#10b981' }}></i>
              Einkommen
            </h3>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981', marginBottom: 'var(--space-2)' }}>
              {displayIncome.toLocaleString()} €
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              Monatliches Nettoeinkommen
            </p>
          </div>

          {/* Fixed Costs */}
          <div className="modern-card" style={{ padding: 'var(--space-4)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: 'var(--space-3)' }}>
              <i className="fas fa-home" style={{ marginRight: '8px', color: '#ef4444' }}></i>
              Fixkosten
            </h3>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444', marginBottom: 'var(--space-2)' }}>
              {fixedCosts.toLocaleString()} €
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              Aus Onboarding-Daten berechnet
            </p>
          </div>

          {/* Available Budget */}
          <div className="modern-card" style={{ padding: 'var(--space-4)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: 'var(--space-3)' }}>
              <i className="fas fa-piggy-bank" style={{ marginRight: '8px', color: availableBudget > 0 ? '#10b981' : '#ef4444' }}></i>
              Verfügbares Budget
            </h3>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: availableBudget > 0 ? '#10b981' : '#ef4444', 
              marginBottom: 'var(--space-2)' 
            }}>
              {availableBudget.toLocaleString()} €
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              {availableBudget > 0 ? 'Für variable Ausgaben' : 'Überzogen - Ausgaben reduzieren'}
            </p>
          </div>

          {/* Savings Rate */}
          <div className="modern-card" style={{ padding: 'var(--space-4)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: 'var(--space-3)' }}>
              <i className="fas fa-chart-line" style={{ marginRight: '8px', color: '#10b981' }}></i>
              Sparquote
            </h3>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981', marginBottom: 'var(--space-2)' }}>
              {displaySavingsRate}%
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              Anteil des verfügbaren Budgets
            </p>
          </div>
        </div>

        {/* Detailed Fixed Costs Breakdown */}
        <div className="modern-card" style={{ padding: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: 'var(--space-4)' }}>
            <i className="fas fa-list" style={{ marginRight: '8px', color: '#10b981' }}></i>
            Fixkosten-Aufschlüsselung
          </h3>
          
          <div className="modern-grid modern-grid-2" style={{ gap: 'var(--space-3)' }}>
            {/* Housing */}
            {userData?.housing && (
              <div style={{ padding: 'var(--space-3)', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: 'var(--space-2)' }}>
                  <i className="fas fa-home" style={{ marginRight: '6px', color: '#10b981' }}></i>
                  Wohnen
                </h4>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  <p>Miete: {(userData.housing.rent || 0).toLocaleString()} €</p>
                  <p>Nebenkosten: {(userData.housing.utilities || 0).toLocaleString()} €</p>
                  <p>Versicherung: {(userData.housing.homeInsurance || 0).toLocaleString()} €</p>
                  <p><strong>Gesamt: {((userData.housing.rent || 0) + (userData.housing.utilities || 0) + (userData.housing.homeInsurance || 0)).toLocaleString()} €</strong></p>
                </div>
              </div>
            )}

            {/* Transport */}
            {userData?.transport && (
              <div style={{ padding: 'var(--space-3)', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: 'var(--space-2)' }}>
                  <i className="fas fa-car" style={{ marginRight: '6px', color: '#10b981' }}></i>
                  Mobilität
                </h4>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  <p>Kraftstoff: {(userData.transport.fuel || 0).toLocaleString()} €</p>
                  <p>Versicherung: {(userData.transport.carInsurance || 0).toLocaleString()} €</p>
                  <p>ÖPNV: {(userData.transport.publicTransport || 0).toLocaleString()} €</p>
                  <p><strong>Gesamt: {((userData.transport.fuel || 0) + (userData.transport.carInsurance || 0) + (userData.transport.publicTransport || 0)).toLocaleString()} €</strong></p>
                </div>
              </div>
            )}

            {/* Insurance */}
            {userData?.insurance && (
              <div style={{ padding: 'var(--space-3)', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: 'var(--space-2)' }}>
                  <i className="fas fa-shield-alt" style={{ marginRight: '6px', color: '#10b981' }}></i>
                  Versicherungen
                </h4>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  <p>Krankenversicherung: {(userData.insurance.healthInsurance || 0).toLocaleString()} €</p>
                  <p>Haftpflicht: {(userData.insurance.liabilityInsurance || 0).toLocaleString()} €</p>
                  <p>Rente: {(userData.insurance.pensionInsurance || 0).toLocaleString()} €</p>
                  <p><strong>Gesamt: {((userData.insurance.healthInsurance || 0) + (userData.insurance.liabilityInsurance || 0) + (userData.insurance.pensionInsurance || 0)).toLocaleString()} €</strong></p>
                </div>
              </div>
            )}

            {/* Digital */}
            {userData?.digital && (
              <div style={{ padding: 'var(--space-3)', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: 'var(--space-2)' }}>
                  <i className="fas fa-wifi" style={{ marginRight: '6px', color: '#10b981' }}></i>
                  Digital & Services
                </h4>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  <p>Internet: {(userData.digital.internet || 0).toLocaleString()} €</p>
                  <p>Mobil: {(userData.digital.mobile || 0).toLocaleString()} €</p>
                  <p>Streaming: {(userData.digital.streaming || 0).toLocaleString()} €</p>
                  <p><strong>Gesamt: {((userData.digital.internet || 0) + (userData.digital.mobile || 0) + (userData.digital.streaming || 0)).toLocaleString()} €</strong></p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderGoals = () => (
    <div>
      <div className="onboarding-step">
        <div className="step-header">
          <h2>
            <i className="fas fa-target" style={{ marginRight: '12px', color: '#10b981' }}></i>
            Finanzziele
          </h2>
          <p>Ihre Ziele aus dem Onboarding</p>
        </div>
        
        {userData?.goals ? (
          <div className="modern-grid modern-grid-1" style={{ gap: 'var(--space-4)' }}>
            <div className="modern-card" style={{ padding: 'var(--space-4)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: 'var(--space-4)' }}>
                <i className="fas fa-bullseye" style={{ marginRight: '8px', color: '#10b981' }}></i>
                Ihr Hauptziel
              </h3>
              <div style={{ fontSize: '16px', color: '#374151', marginBottom: 'var(--space-3)' }}>
                <strong>Ziel:</strong> {userData.goals.financialGoal || 'Nicht angegeben'}
              </div>
              <div style={{ fontSize: '16px', color: '#374151', marginBottom: 'var(--space-3)' }}>
                <strong>Sparziel:</strong> {(userData.goals.savingsGoal || 0).toLocaleString()} €
              </div>
              <div style={{ fontSize: '16px', color: '#374151', marginBottom: 'var(--space-4)' }}>
                <strong>Zeitrahmen:</strong> {userData.goals.timeframe || 'Nicht angegeben'}
              </div>
              
              {/* Progress Calculation */}
              {userData.goals.savingsGoal > 0 && (
                <div style={{ 
                  padding: 'var(--space-3)', 
                  backgroundColor: '#f0fdf4', 
                  borderRadius: '8px',
                  border: '1px solid #bbf7d0'
                }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#166534', marginBottom: 'var(--space-2)' }}>
                    Fortschritt
                  </h4>
                  <p style={{ fontSize: '12px', color: '#166534' }}>
                    Monatlich sparen: {availableBudget > 0 ? Math.min(availableBudget, userData.goals.savingsGoal / 12).toLocaleString() : 0} €
                  </p>
                  <p style={{ fontSize: '12px', color: '#166534' }}>
                    Geschätzte Zeit: {availableBudget > 0 ? Math.ceil(userData.goals.savingsGoal / Math.min(availableBudget, userData.goals.savingsGoal / 12)) : '∞'} Monate
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="modern-card" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
            <i className="fas fa-exclamation-triangle" style={{ fontSize: '48px', color: '#f59e0b', marginBottom: 'var(--space-4)' }}></i>
            <h3 style={{ color: '#1f2937', marginBottom: 'var(--space-2)' }}>Keine Ziele definiert</h3>
            <p style={{ color: '#6b7280' }}>Führen Sie das Onboarding durch, um Ihre Finanzziele zu definieren.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderReports = () => (
    <div>
      <div className="onboarding-step">
        <div className="step-header">
          <h2>
            <i className="fas fa-chart-bar" style={{ marginRight: '12px', color: '#10b981' }}></i>
            Berichte & Analysen
          </h2>
          <p>Finanzberichte basierend auf Ihren Onboarding-Daten</p>
        </div>
        
        <div className="modern-grid modern-grid-2" style={{ gap: 'var(--space-4)' }}>
          {/* Monthly Overview */}
          <div className="modern-card" style={{ padding: 'var(--space-4)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: 'var(--space-3)' }}>
              <i className="fas fa-calendar" style={{ marginRight: '8px', color: '#10b981' }}></i>
              Monatsübersicht
            </h3>
            <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
              <p><strong>Einnahmen:</strong> {displayIncome.toLocaleString()} €</p>
              <p><strong>Fixkosten:</strong> {fixedCosts.toLocaleString()} €</p>
              <p><strong>Variable Kosten:</strong> {Math.max(0, displayExpenses - fixedCosts).toLocaleString()} €</p>
              <p><strong>Verfügbar:</strong> {availableBudget.toLocaleString()} €</p>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="modern-card" style={{ padding: 'var(--space-4)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: 'var(--space-3)' }}>
              <i className="fas fa-pie-chart" style={{ marginRight: '8px', color: '#10b981' }}></i>
              Kategorie-Aufteilung
            </h3>
            <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
              <p><strong>Wohnen:</strong> {userData?.housing ? ((userData.housing.rent || 0) + (userData.housing.utilities || 0) + (userData.housing.homeInsurance || 0)).toLocaleString() : 0} €</p>
              <p><strong>Mobilität:</strong> {userData?.transport ? ((userData.transport.fuel || 0) + (userData.transport.carInsurance || 0) + (userData.transport.publicTransport || 0)).toLocaleString() : 0} €</p>
              <p><strong>Versicherungen:</strong> {userData?.insurance ? ((userData.insurance.healthInsurance || 0) + (userData.insurance.liabilityInsurance || 0) + (userData.insurance.pensionInsurance || 0)).toLocaleString() : 0} €</p>
              <p><strong>Digital:</strong> {userData?.digital ? ((userData.digital.internet || 0) + (userData.digital.mobile || 0) + (userData.digital.streaming || 0)).toLocaleString() : 0} €</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div>
      <div className="onboarding-step">
        <div className="step-header">
          <h2>
            <i className="fas fa-cog" style={{ marginRight: '12px', color: '#10b981' }}></i>
            Einstellungen
          </h2>
          <p>Verwalten Sie Ihre Onboarding-Daten und App-Einstellungen</p>
        </div>
        
        <div className="modern-grid modern-grid-1" style={{ gap: 'var(--space-4)' }}>
          {/* Edit Onboarding */}
          <div className="modern-card" style={{ padding: 'var(--space-4)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: 'var(--space-3)' }}>
              <i className="fas fa-edit" style={{ marginRight: '8px', color: '#10b981' }}></i>
              Onboarding bearbeiten
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: 'var(--space-4)' }}>
              Bearbeiten Sie Ihre Onboarding-Daten, um Ihre Finanzübersicht zu aktualisieren.
            </p>
            <button
              onClick={() => {
                // Reset onboarding completion and redirect to onboarding
                localStorage.setItem('moneyup-onboarding-completed', 'false');
                window.location.href = 'onboarding-app.html';
              }}
              style={{
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
            >
              <i className="fas fa-edit" style={{ marginRight: '8px' }}></i>
              Onboarding bearbeiten
            </button>
          </div>

          {/* Bank Connection Settings */}
          <div className="modern-card" style={{ padding: 'var(--space-4)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: 'var(--space-3)' }}>
              <i className="fas fa-university" style={{ marginRight: '8px', color: '#10b981' }}></i>
              Bankverbindung
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: 'var(--space-4)' }}>
              Verwalten Sie Ihre Bankverbindung und Konten.
            </p>
            <button
              onClick={() => setShowBankConnectionSettings(true)}
              style={{
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
            >
              <i className="fas fa-university" style={{ marginRight: '8px' }}></i>
              Bankverbindung verwalten
            </button>
          </div>

          {/* Data Export */}
          <div className="modern-card" style={{ padding: 'var(--space-4)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: 'var(--space-3)' }}>
              <i className="fas fa-download" style={{ marginRight: '8px', color: '#10b981' }}></i>
              Daten exportieren
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: 'var(--space-4)' }}>
              Exportieren Sie alle Ihre Onboarding-Daten als JSON-Datei.
            </p>
            <button
              onClick={() => {
                const data = {
                  userProfile: userData,
                  transactions: transactions,
                  exportDate: new Date().toISOString()
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `moneyup-data-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              style={{
                backgroundColor: '#8b5cf6',
                color: '#ffffff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8b5cf6'}
            >
              <i className="fas fa-download" style={{ marginRight: '8px' }}></i>
              Daten exportieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div>
      <div className="onboarding-step">
        <h2>Transaktionen</h2>
        <div style={{ marginTop: '20px' }}>
          {transactions.length > 0 ? (
            transactions.map((transaction) => {
              const category = transactionService.getCategoryById(transaction.category);
              const date = new Date(transaction.date);
              const formattedDate = date.toLocaleDateString('de-DE', { 
                day: '2-digit', 
                month: '2-digit',
                year: 'numeric'
              });
              
              return (
                <div key={transaction.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  backgroundColor: '#ffffff'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: category?.color + '20' || '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i 
                        className={category?.icon || 'fas fa-circle'} 
                        style={{ color: category?.color || '#6b7280', fontSize: '16px' }}
                      ></i>
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1f2937' }}>
                        {transaction.description}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {category?.name || 'Unbekannt'} • {formattedDate}
                      </div>
                    </div>
                  </div>
                  <div style={{ 
                    color: transaction.type === 'income' ? '#10b981' : '#dc2626', 
                    fontWeight: '600'
                  }}>
                    {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString('de-DE')}€
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#6b7280'
            }}>
              <i className="fas fa-receipt" style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}></i>
              <p>Noch keine Transaktionen vorhanden</p>
            </div>
          )}
        </div>
        
        <button 
          className="btn-primary" 
          style={{ width: '100%', marginTop: '20px' }}
          onClick={() => setIsAddTransactionModalOpen(true)}
        >
          <i className="fas fa-plus"></i> Transaktion hinzufügen
        </button>
      </div>
    </div>
  );

  return (
    <div className="onboarding-container">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        padding: '20px',
        textAlign: 'center',
        color: '#ffffff'
      }}>
        <img src="/MoneyUP.png" alt="MoneyUP" className="logo" style={{ height: '60px', marginBottom: '10px' }} />
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700' }}>MoneyUP Dashboard</h1>
        <p style={{ margin: '8px 0 0', opacity: 0.9 }}>
          {userData?.name || userData?.personalInfo?.name ? `${userData.name || userData.personalInfo.name}, ` : ''}
          hier ist Ihr Dashboard
        </p>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        background: '#ffffff',
        padding: '0 20px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        overflowX: 'auto',
        gap: '0'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '16px 20px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              borderBottom: activeTab === tab.id ? '2px solid #10b981' : '2px solid transparent',
              color: activeTab === tab.id ? '#10b981' : '#6b7280',
              fontWeight: activeTab === tab.id ? '600' : '500',
              fontSize: '14px',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <i className={tab.icon}></i>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="onboarding-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'transactions' && renderTransactions()}
        {activeTab === 'onboarding' && renderOnboarding()}
        {activeTab === 'budget' && renderBudget()}
        {activeTab === 'goals' && renderGoals()}
        {activeTab === 'reports' && renderReports()}
        {activeTab === 'settings' && renderSettings()}
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddTransactionModalOpen}
        onClose={() => setIsAddTransactionModalOpen(false)}
        onTransactionAdded={handleTransactionAdded}
      />

      {/* Welcome Tutorial */}
      {showWelcomeTutorial && (
        <WelcomeTutorial
          isVisible={true}
          onClose={handleTutorialClose}
          onComplete={handleTutorialComplete}
        />
      )}

      {/* Accessibility Settings */}
      <AccessibilitySettings
        isOpen={showAccessibilitySettings}
        onClose={() => setShowAccessibilitySettings(false)}
      />

      {/* Voice Assistant */}
      <VoiceAssistant
        onTransactionAdd={handleVoiceTransaction}
        isEnabled={accessibilitySettings.voiceGuidance}
      />

      {/* Bank Connection Settings */}
      <BankConnectionSettings
        isVisible={showBankConnectionSettings}
        onClose={() => setShowBankConnectionSettings(false)}
        onUpdate={handleBankSettingsUpdate}
      />
    </div>
  );
};

export default DashboardScreen;
