import React, { useState, useEffect } from 'react';
import { StatusBar, View } from './src/components/WebComponents/WebView';
import { StyleSheet } from './src/utils/WebStyleSheet';
import AppLayout from './src/components/Layout/AppLayout';
import { LanguageProvider } from './src/i18n/LanguageContext';
import { useAppStore } from './src/store/useAppStore';
import { SecurityService } from './src/services/SecurityService';
import GamificationEngine from './src/services/GamificationEngine';

// Import screens
import UebersichtScreen from './src/screens/UebersichtScreen';
import FixkostenScreen from './src/screens/FixkostenScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import PaymentScreen from './src/components/PaymentScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';
import GoalsScreen from './src/screens/GoalsScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import DebtScreen from './src/screens/DebtScreen';
import FixedCostsScreen from './src/screens/FixedCostsScreen';
import ExpenseEntryScreen from './src/screens/ExpenseEntryScreen';
import OnboardingFlow from './src/screens/OnboardingFlow';

// Define screen types
type ScreenType = 
  | 'Übersicht' 
  | 'Fixkosten'
  | 'Konten'
  | 'Analyse'
  | 'Einstellungen'
  | 'Onboarding' 
  | 'Payment'
  | 'Transactions'
  | 'Goals'
  | 'Achievements'
  | 'Settings'
  | 'Debts'
  | 'ExpenseEntry';

const App: React.FC = () => {
  const { initializeApp, user } = useAppStore();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('Onboarding'); // Startet mit Onboarding
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeServices = async () => {
      try {
        console.log('🚀 Initializing MONEYUP services...');
        
        // Initialize security service
        const securityService = SecurityService.getInstance();
        await securityService.initialize();
        console.log('✅ Security Service initialized');

        // Initialize gamification engine
        const gamificationEngine = GamificationEngine.getInstance();
        gamificationEngine.initialize();
        console.log('✅ Gamification Engine initialized');

        // Initialize app store
        await initializeApp();
        console.log('✅ App Store initialized');

        console.log('🎉 All MONEYUP services initialized successfully!');
        setIsInitialized(true);
      } catch (error) {
        console.error('❌ App initialization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeServices();
  }, [initializeApp]);

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as ScreenType);
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out user...');
      // You can add actual logout logic here
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleOnboardingComplete = () => {
    console.log("Onboarding abgeschlossen, wechsle zu Payment (4,99€)");
    setCurrentScreen('Payment');
  };

  const handlePaymentComplete = () => {
    console.log("Payment (4,99€) abgeschlossen, wechsle zur Übersicht");
    // Mark user as premium user
    localStorage.setItem('moneyup-premium-user', 'true');
    localStorage.setItem('moneyup-payment-date', new Date().toISOString());
    setCurrentScreen('Übersicht');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'Übersicht':
        return <UebersichtScreen />;
      case 'Fixkosten':
        return <FixkostenScreen />;
      case 'Konten':
        return <TransactionsScreen />;
      case 'Analyse':
        return <GoalsScreen />;
      case 'Einstellungen':
        return <SettingsScreen />;
      case 'Onboarding':
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
      case 'Payment':
        return <PaymentScreen onComplete={handlePaymentComplete} />;
      case 'Transactions':
        return <TransactionsScreen />;
      case 'Goals':
        return <GoalsScreen />;
      case 'Achievements':
        return <AchievementsScreen />;
      case 'Settings':
        return <SettingsScreen />;
      case 'Debts':
        return <DebtScreen />;
      case 'ExpenseEntry':
        return <ExpenseEntryScreen />;
      default:
        return <UebersichtScreen />;
    }
  };

  // Check if current screen is a special page (no sidebar)
  const isSpecialPage = ['Onboarding', 'Payment'].includes(currentScreen);

  return (
    <LanguageProvider>
      <View style={styles.container}>
        <StatusBar 
          barStyle="dark-content" 
          backgroundColor="#F9FAFB" 
          translucent={false}
        />
        
        <AppLayout
          currentPageName={currentScreen}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        >
          {renderCurrentScreen()}
        </AppLayout>
      </View>
    </LanguageProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
});

export default App;