import React, { useState } from 'react';

interface WelcomeTutorialProps {
  isVisible: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const WelcomeTutorial: React.FC<WelcomeTutorialProps> = ({ isVisible, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Willkommen bei MoneyUP",
      content: "Wir zeigen Ihnen in 3 einfachen Schritten, wie Sie Ihre Finanzen verwalten können.",
      icon: "fas fa-hand-wave"
    },
    {
      title: "Transaktionen hinzufügen",
      content: "Klicken Sie auf 'Transaktion hinzufügen', um Ihre Einnahmen und Ausgaben zu erfassen. Sie können auch die Schnell-Buttons verwenden!",
      icon: "fas fa-plus-circle"
    },
    {
      title: "Finanzen im Blick",
      content: "Hier sehen Sie immer Ihre aktuellen Finanzen. Grün bedeutet gut, Rot bedeutet Achtung!",
      icon: "fas fa-chart-line"
    },
    {
      title: "Fertig",
      content: "Sie sind bereit! Fügen Sie Ihre erste Transaktion hinzu und behalten Sie den Überblick über Ihre Finanzen.",
      icon: "fas fa-check-circle"
    }
  ];

  if (!isVisible) return null;

  const currentTutorial = tutorialSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '500px',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Progress Indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '32px'
        }}>
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: index <= currentStep ? '#10b981' : '#e5e7eb',
                transition: 'background-color 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Tutorial Content */}
        <div style={{
          fontSize: '48px',
          marginBottom: '24px',
          color: '#10b981'
        }}>
          <i className={currentTutorial.icon}></i>
        </div>

        <h2 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '16px'
        }}>
          {currentTutorial.title}
        </h2>

        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          lineHeight: '1.6',
          marginBottom: '32px'
        }}>
          {currentTutorial.content}
        </p>

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center'
        }}>
          {currentStep > 0 && (
            <button
              onClick={handlePrevious}
              style={{
                padding: '12px 24px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                color: '#6b7280',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#10b981';
                e.currentTarget.style.color = '#10b981';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.color = '#6b7280';
              }}
            >
              Zurück
            </button>
          )}

          <button
            onClick={handleNext}
            style={{
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#10b981',
              color: '#ffffff',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#059669';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#10b981';
            }}
          >
            {currentStep === tutorialSteps.length - 1 ? 'Los geht\'s!' : 'Weiter'}
          </button>
        </div>

        {/* Skip Button */}
        <button
          onClick={onClose}
          style={{
            marginTop: '16px',
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            fontSize: '14px',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Tutorial überspringen
        </button>
      </div>
    </div>
  );
};

export default WelcomeTutorial;
