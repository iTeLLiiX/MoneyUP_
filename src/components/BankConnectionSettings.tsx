import React, { useState, useEffect } from 'react';

interface BankConnectionSettingsProps {
  isVisible: boolean;
  onClose: () => void;
  onUpdate: (settings: any) => void;
}

interface BankAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  bank: string;
  isConnected: boolean;
}

const BankConnectionSettings: React.FC<BankConnectionSettingsProps> = ({ 
  isVisible, 
  onClose, 
  onUpdate 
}) => {
  const [connectionMethod, setConnectionMethod] = useState<'manual' | 'bank'>('manual');
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [connectedAccounts, setConnectedAccounts] = useState<BankAccount[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  const banks = [
    { id: 'sparkasse', name: 'Sparkasse', logo: '🏦' },
    { id: 'volksbank', name: 'Volksbank', logo: '🏛️' },
    { id: 'deutsche-bank', name: 'Deutsche Bank', logo: '🏢' },
    { id: 'commerzbank', name: 'Commerzbank', logo: '🏦' },
    { id: 'ing', name: 'ING', logo: '🟠' },
    { id: 'n26', name: 'N26', logo: '🔵' },
  ];

  const accountTypes = [
    { id: 'checking', name: 'Girokonto', icon: '💳' },
    { id: 'savings', name: 'Sparkonto', icon: '💰' },
    { id: 'credit', name: 'Kreditkarte', icon: '💳' },
    { id: 'investment', name: 'Depot', icon: '📈' },
  ];

  useEffect(() => {
    if (isVisible) {
      loadSettings();
    }
  }, [isVisible]);

  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('moneyup-bank-settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setConnectionMethod(settings.method || 'manual');
        setSelectedBank(settings.selectedBank || '');
        setConnectedAccounts(settings.connectedAccounts || []);
      }
    } catch (error) {
      console.error('Error loading bank settings:', error);
    }
  };

  const saveSettings = () => {
    const settings = {
      method: connectionMethod,
      selectedBank,
      connectedAccounts,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('moneyup-bank-settings', JSON.stringify(settings));
    onUpdate(settings);
  };

  const handleConnectBank = async () => {
    if (!selectedBank) return;
    
    setIsConnecting(true);
    
    // Simulate bank connection process
    setTimeout(() => {
      const newAccounts: BankAccount[] = [
        {
          id: '1',
          name: 'Girokonto Hauptkonto',
          type: 'checking',
          balance: 2500.00,
          bank: selectedBank,
          isConnected: true
        },
        {
          id: '2',
          name: 'Sparkonto',
          type: 'savings',
          balance: 15000.00,
          bank: selectedBank,
          isConnected: true
        },
        {
          id: '3',
          name: 'Visa Kreditkarte',
          type: 'credit',
          balance: -450.00,
          bank: selectedBank,
          isConnected: true
        }
      ];
      
      setConnectedAccounts(newAccounts);
      setIsConnecting(false);
      saveSettings();
    }, 2000);
  };

  const handleDisconnectAccount = (accountId: string) => {
    setConnectedAccounts(prev => 
      prev.map(account => 
        account.id === accountId 
          ? { ...account, isConnected: false }
          : account
      )
    );
    saveSettings();
  };

  const handleSyncTransactions = async () => {
    setIsConnecting(true);
    
    // Simulate transaction sync
    setTimeout(() => {
      // Add some sample transactions from bank
      const sampleTransactions = [
        {
          id: Date.now().toString(),
          amount: -89.50,
          description: 'Tankstelle Shell',
          category: 'transport',
          type: 'expense' as const,
          date: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString()
        },
        {
          id: (Date.now() + 1).toString(),
          amount: -25.80,
          description: 'Supermarkt Rewe',
          category: 'groceries',
          type: 'expense' as const,
          date: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString()
        }
      ];
      
      // Add to existing transactions
      const existingTransactions = JSON.parse(localStorage.getItem('moneyup-transactions') || '[]');
      const updatedTransactions = [...sampleTransactions, ...existingTransactions];
      localStorage.setItem('moneyup-transactions', JSON.stringify(updatedTransactions));
      
      setIsConnecting(false);
      alert('Transaktionen erfolgreich synchronisiert!');
    }, 1500);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '700px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            color: '#6b7280',
            cursor: 'pointer',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.color = '#374151';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#6b7280';
          }}
        >
          <i className="fas fa-times"></i>
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px'
          }}>
            <i className="fas fa-university"></i>
          </div>
          <div>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1f2937',
              margin: 0,
              marginBottom: '4px'
            }}>
              Bankverbindung
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              margin: 0
            }}>
              Verwalten Sie Ihre Bankkonten und Transaktionen
            </p>
          </div>
        </div>

        {/* Connection Method Selection */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '16px'
          }}>
            Datenverwaltung
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div
              style={{
                padding: '20px',
                border: `2px solid ${connectionMethod === 'manual' ? '#10b981' : '#e5e7eb'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: connectionMethod === 'manual' ? '#ecfdf5' : 'white'
              }}
              onClick={() => setConnectionMethod('manual')}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px'
              }}>
                <i className="fas fa-edit" style={{ color: '#10b981', fontSize: '20px' }}></i>
                <h4 style={{ margin: 0, color: '#1f2937' }}>Manuell</h4>
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                Alle Daten lokal speichern und manuell verwalten
              </p>
            </div>
            
            <div
              style={{
                padding: '20px',
                border: `2px solid ${connectionMethod === 'bank' ? '#10b981' : '#e5e7eb'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: connectionMethod === 'bank' ? '#ecfdf5' : 'white'
              }}
              onClick={() => setConnectionMethod('bank')}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px'
              }}>
                <i className="fas fa-cloud" style={{ color: '#10b981', fontSize: '20px' }}></i>
                <h4 style={{ margin: 0, color: '#1f2937' }}>Bank verbinden</h4>
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                Automatische Synchronisation mit Ihren Bankkonten
              </p>
            </div>
          </div>
        </div>

        {/* Bank Selection */}
        {connectionMethod === 'bank' && (
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              Bank auswählen
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '12px',
              marginBottom: '24px'
            }}>
              {banks.map(bank => (
                <div
                  key={bank.id}
                  style={{
                    padding: '16px',
                    border: `2px solid ${selectedBank === bank.id ? '#10b981' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: selectedBank === bank.id ? '#ecfdf5' : 'white'
                  }}
                  onClick={() => setSelectedBank(bank.id)}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{bank.logo}</div>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    {bank.name}
                  </span>
                </div>
              ))}
            </div>

            {selectedBank && (
              <button
                onClick={handleConnectBank}
                disabled={isConnecting}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  background: isConnecting 
                    ? '#9ca3af' 
                    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isConnecting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isConnecting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Verbinde...
                  </>
                ) : (
                  <>
                    <i className="fas fa-link"></i>
                    Bank verbinden
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Connected Accounts */}
        {connectedAccounts.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              Verbundene Konten
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {connectedAccounts.map(account => (
                <div
                  key={account.id}
                  style={{
                    padding: '16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: account.isConnected ? '#f9fafb' : '#fee2e2'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: account.isConnected ? '#10b981' : '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '16px'
                    }}>
                      {accountTypes.find(t => t.id === account.type)?.icon || '💳'}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '16px', color: '#1f2937' }}>
                        {account.name}
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                        {banks.find(b => b.id === account.bank)?.name} • 
                        {account.balance >= 0 ? '+' : ''}{account.balance.toFixed(2)} €
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {account.isConnected && (
                      <button
                        onClick={handleSyncTransactions}
                        disabled={isConnecting}
                        style={{
                          padding: '8px 12px',
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '12px',
                          cursor: isConnecting ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <i className="fas fa-sync-alt"></i> Sync
                      </button>
                    )}
                    <button
                      onClick={() => handleDisconnectAccount(account.id)}
                      style={{
                        padding: '8px 12px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      <i className="fas fa-unlink"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Info */}
        <div style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          border: '1px solid #93c5fd',
          borderRadius: '12px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <i className="fas fa-shield-alt" style={{ color: '#3b82f6', fontSize: '20px', marginTop: '2px' }}></i>
            <div>
              <h5 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1e40af',
                margin: 0,
                marginBottom: '8px'
              }}>
                Sicherheit & Datenschutz
              </h5>
              <p style={{
                color: '#1e40af',
                fontSize: '14px',
                lineHeight: '1.5',
                margin: 0
              }}>
                Alle Bankverbindungen werden verschlüsselt übertragen und sicher gespeichert. 
                Wir verwenden die neuesten Sicherheitsstandards und geben Ihre Daten niemals an Dritte weiter.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              background: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Schließen
          </button>
          <button
            onClick={saveSettings}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <i className="fas fa-save"></i> Speichern
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankConnectionSettings;
