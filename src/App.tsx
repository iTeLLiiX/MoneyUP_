import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/Onboarding.css';
import './styles/Payment.css';
import DashboardScreen from './screens/DashboardScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import PaymentScreen from './screens/PaymentScreen';

const App: React.FC = () => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(false);
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);

  useEffect(() => {
    // Check if onboarding was completed before
    const completed = localStorage.getItem('moneyup-onboarding-completed');
    const premium = localStorage.getItem('moneyup-premium-user');
    setIsOnboardingCompleted(completed === 'true');
    setIsPremiumUser(premium === 'true');
  }, []);

  // Listen for storage changes to update state
  useEffect(() => {
    const handleStorageChange = () => {
      const completed = localStorage.getItem('moneyup-onboarding-completed');
      const premium = localStorage.getItem('moneyup-premium-user');
      setIsOnboardingCompleted(completed === 'true');
      setIsPremiumUser(premium === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);


  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              isOnboardingCompleted ? (
                isPremiumUser ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/payment" replace />
                )
              ) : (
                <Navigate to="/onboarding" replace />
              )
            } 
          />
          <Route 
            path="/onboarding" 
            element={
              <OnboardingScreen />
            } 
          />
          <Route 
            path="/payment" 
            element={
              <PaymentScreen />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <DashboardScreen />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
