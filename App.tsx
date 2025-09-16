import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppStore } from './src/store/useAppStore';
import OnboardingScreen from './src/screens/OnboardingScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import PaymentScreen from './src/screens/PaymentScreen';

const App: React.FC = () => {
  const { currentScreen, isInitialized, initializeApp } = useAppStore();

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  if (!isInitialized) {
    return null; // Loading state
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Onboarding':
        return <OnboardingScreen />;
      case 'Payment':
        return <PaymentScreen />;
      case 'Übersicht':
        return <DashboardScreen />;
      default:
        return <OnboardingScreen />;
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      {renderScreen()}
    </SafeAreaProvider>
  );
};

export default App;