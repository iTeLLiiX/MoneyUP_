import React, { useState, useEffect } from 'react';

interface AccessibilitySettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    largeText: false,
    highContrast: false,
    simplifiedMode: false,
    voiceGuidance: false,
    reducedMotion: false
  });

  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem('moneyup-accessibility-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    // Apply settings to document
    const root = document.documentElement;
    
    if (settings.largeText) {
      root.style.setProperty('--font-size-base', '1.25rem');
      root.style.setProperty('--font-size-lg', '1.5rem');
      root.style.setProperty('--font-size-xl', '1.75rem');
      root.style.setProperty('--font-size-2xl', '2rem');
      root.style.setProperty('--font-size-3xl', '2.5rem');
    } else {
      root.style.setProperty('--font-size-base', '1rem');
      root.style.setProperty('--font-size-lg', '1.125rem');
      root.style.setProperty('--font-size-xl', '1.25rem');
      root.style.setProperty('--font-size-2xl', '1.5rem');
      root.style.setProperty('--font-size-3xl', '1.875rem');
    }

    if (settings.highContrast) {
      root.style.setProperty('--neutral-50', '#ffffff');
      root.style.setProperty('--neutral-100', '#f0f0f0');
      root.style.setProperty('--neutral-200', '#d0d0d0');
      root.style.setProperty('--neutral-300', '#a0a0a0');
      root.style.setProperty('--neutral-400', '#707070');
      root.style.setProperty('--neutral-500', '#404040');
      root.style.setProperty('--neutral-600', '#202020');
      root.style.setProperty('--neutral-700', '#000000');
      root.style.setProperty('--neutral-800', '#000000');
      root.style.setProperty('--neutral-900', '#000000');
    } else {
      root.style.setProperty('--neutral-50', '#fafafa');
      root.style.setProperty('--neutral-100', '#f5f5f5');
      root.style.setProperty('--neutral-200', '#e5e5e5');
      root.style.setProperty('--neutral-300', '#d4d4d4');
      root.style.setProperty('--neutral-400', '#a3a3a3');
      root.style.setProperty('--neutral-500', '#737373');
      root.style.setProperty('--neutral-600', '#525252');
      root.style.setProperty('--neutral-700', '#404040');
      root.style.setProperty('--neutral-800', '#262626');
      root.style.setProperty('--neutral-900', '#171717');
    }

    if (settings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0s');
    } else {
      root.style.setProperty('--animation-duration', '0.3s');
    }

    // Save settings
    localStorage.setItem('moneyup-accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  const handleSettingChange = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px'
        }}>
          <div>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1f2937',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <i className="fas fa-universal-access" style={{ color: '#10b981' }}></i>
              Barrierefreiheit
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              margin: '8px 0 0 0'
            }}>
              Passen Sie die App an Ihre Bedürfnisse an
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: '#6b7280',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              transition: 'background-color 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Large Text Mode */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            backgroundColor: settings.largeText ? '#f0fdf4' : '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: settings.largeText ? '#10b981' : '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: settings.largeText ? '#ffffff' : '#6b7280'
              }}>
                <i className="fas fa-text-height"></i>
              </div>
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: 0
                }}>
                  Große Schrift
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '4px 0 0 0'
                }}>
                  Erhöht die Schriftgröße für bessere Lesbarkeit
                </p>
              </div>
            </div>
            <button
              onClick={() => handleSettingChange('largeText')}
              style={{
                width: '48px',
                height: '24px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: settings.largeText ? '#10b981' : '#d1d5db',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background-color 0.2s ease'
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                position: 'absolute',
                top: '2px',
                left: settings.largeText ? '26px' : '2px',
                transition: 'left 0.2s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}></div>
            </button>
          </div>

          {/* High Contrast Mode */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            backgroundColor: settings.highContrast ? '#f0fdf4' : '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: settings.highContrast ? '#10b981' : '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: settings.highContrast ? '#ffffff' : '#6b7280'
              }}>
                <i className="fas fa-adjust"></i>
              </div>
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: 0
                }}>
                  Hoher Kontrast
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '4px 0 0 0'
                }}>
                  Erhöht den Kontrast für bessere Sichtbarkeit
                </p>
              </div>
            </div>
            <button
              onClick={() => handleSettingChange('highContrast')}
              style={{
                width: '48px',
                height: '24px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: settings.highContrast ? '#10b981' : '#d1d5db',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background-color 0.2s ease'
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                position: 'absolute',
                top: '2px',
                left: settings.highContrast ? '26px' : '2px',
                transition: 'left 0.2s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}></div>
            </button>
          </div>

          {/* Simplified Mode */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            backgroundColor: settings.simplifiedMode ? '#f0fdf4' : '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: settings.simplifiedMode ? '#10b981' : '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: settings.simplifiedMode ? '#ffffff' : '#6b7280'
              }}>
                <i className="fas fa-magic"></i>
              </div>
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: 0
                }}>
                  Vereinfachter Modus
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '4px 0 0 0'
                }}>
                  Zeigt nur die wichtigsten Funktionen an
                </p>
              </div>
            </div>
            <button
              onClick={() => handleSettingChange('simplifiedMode')}
              style={{
                width: '48px',
                height: '24px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: settings.simplifiedMode ? '#10b981' : '#d1d5db',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background-color 0.2s ease'
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                position: 'absolute',
                top: '2px',
                left: settings.simplifiedMode ? '26px' : '2px',
                transition: 'left 0.2s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}></div>
            </button>
          </div>

          {/* Voice Guidance */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            backgroundColor: settings.voiceGuidance ? '#f0fdf4' : '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: settings.voiceGuidance ? '#10b981' : '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: settings.voiceGuidance ? '#ffffff' : '#6b7280'
              }}>
                <i className="fas fa-volume-up"></i>
              </div>
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: 0
                }}>
                  Sprachführung
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '4px 0 0 0'
                }}>
                  Spricht wichtige Informationen vor
                </p>
              </div>
            </div>
            <button
              onClick={() => handleSettingChange('voiceGuidance')}
              style={{
                width: '48px',
                height: '24px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: settings.voiceGuidance ? '#10b981' : '#d1d5db',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background-color 0.2s ease'
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                position: 'absolute',
                top: '2px',
                left: settings.voiceGuidance ? '26px' : '2px',
                transition: 'left 0.2s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}></div>
            </button>
          </div>

          {/* Reduced Motion */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            backgroundColor: settings.reducedMotion ? '#f0fdf4' : '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: settings.reducedMotion ? '#10b981' : '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: settings.reducedMotion ? '#ffffff' : '#6b7280'
              }}>
                <i className="fas fa-pause"></i>
              </div>
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: 0
                }}>
                  Weniger Animationen
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '4px 0 0 0'
                }}>
                  Reduziert Animationen für bessere Konzentration
                </p>
              </div>
            </div>
            <button
              onClick={() => handleSettingChange('reducedMotion')}
              style={{
                width: '48px',
                height: '24px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: settings.reducedMotion ? '#10b981' : '#d1d5db',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background-color 0.2s ease'
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                position: 'absolute',
                top: '2px',
                left: settings.reducedMotion ? '26px' : '2px',
                transition: 'left 0.2s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}></div>
            </button>
          </div>
        </div>

        <div style={{
          marginTop: '32px',
          padding: '20px',
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '12px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <i className="fas fa-lightbulb" style={{ color: '#0369a1' }}></i>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#0369a1',
              margin: 0
            }}>
              Tipp
            </h4>
          </div>
          <p style={{
            fontSize: '14px',
            color: '#0369a1',
            margin: 0,
            lineHeight: '1.5'
          }}>
            Diese Einstellungen werden automatisch gespeichert und beim nächsten Besuch wiederhergestellt. 
            Sie können jederzeit zwischen den Modi wechseln.
          </p>
        </div>

        {/* Reset Button */}
        <div style={{
          marginTop: '20px',
          textAlign: 'center'
        }}>
          <button
            onClick={() => {
              // Reset all accessibility settings
              const defaultSettings = {
                largeText: false,
                highContrast: false,
                simplifiedMode: false,
                voiceGuidance: false,
                reducedMotion: false
              };
              localStorage.setItem('moneyup-accessibility-settings', JSON.stringify(defaultSettings));
              window.location.reload();
            }}
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <i className="fas fa-undo"></i>
            Alle Einstellungen zurücksetzen
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessibilitySettings;
