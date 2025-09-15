import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';

const PaymentScreen: React.FC = () => {
  const { markPremiumUser } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Mark as premium user
      markPremiumUser();
      
      setIsProcessing(false);
      
      // Navigate to dashboard after successful payment
      window.location.href = '/dashboard';
    }, 2000);
  };

  return (
    <div className="payment-container">
      <div className="payment-header">
        <img src="/MoneyUP.png" alt="MoneyUP" className="logo" />
        <h1>MoneyUP Premium</h1>
        <p>Schließen Sie Ihr Onboarding ab und erhalten Sie vollen Zugang</p>
      </div>

      <div className="payment-content">
        <div className="pricing-card">
          <div className="pricing-header">
            <h2>Premium Zugang</h2>
            <div className="price">
              <span className="currency">€</span>
              <span className="amount">4,99</span>
              <span className="period">einmalig</span>
            </div>
          </div>

          <div className="features-list">
            <div className="feature-item">
              <i className="fas fa-check-circle"></i>
              <span>Vollständige Finanzübersicht</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-check-circle"></i>
              <span>Intelligente Spar-Empfehlungen</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-check-circle"></i>
              <span>Detaillierte Berichte</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-check-circle"></i>
              <span>Ziel-Tracking</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-check-circle"></i>
              <span>Export-Funktionen</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-check-circle"></i>
              <span>Prioritäts-Support</span>
            </div>
          </div>

          <div className="payment-methods">
            <h3>Zahlungsmethode wählen</h3>
            <div className="payment-options">
              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-option-content">
                  <i className="fas fa-credit-card"></i>
                  <span>Kreditkarte</span>
                </div>
              </label>
              
              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-option-content">
                  <i className="fab fa-paypal"></i>
                  <span>PayPal</span>
                </div>
              </label>
              
              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="sepa"
                  checked={paymentMethod === 'sepa'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-option-content">
                  <i className="fas fa-university"></i>
                  <span>SEPA Lastschrift</span>
                </div>
              </label>
            </div>
          </div>

          <button 
            className="payment-button"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Verarbeitung...
              </>
            ) : (
              <>
                <i className="fas fa-lock"></i>
                Jetzt 4,99€ zahlen
              </>
            )}
          </button>

          <div className="security-info">
            <i className="fas fa-shield-alt"></i>
            <span>Sichere Zahlung mit SSL-Verschlüsselung</span>
          </div>
        </div>

        <div className="guarantee-section">
          <div className="guarantee-card">
            <i className="fas fa-shield-check"></i>
            <h3>30-Tage Geld-zurück-Garantie</h3>
            <p>Nicht zufrieden? Erhalten Sie Ihr Geld zurück - ohne Fragen.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentScreen;
