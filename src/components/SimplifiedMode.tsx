import React from 'react';
import { Transaction } from '../services/TransactionService';

interface SimplifiedModeProps {
  transactions: Transaction[];
  onAddTransaction: () => void;
  monthlyIncome: number;
  monthlyExpenses: number;
}

const SimplifiedMode: React.FC<SimplifiedModeProps> = ({
  transactions,
  onAddTransaction,
  monthlyIncome,
  monthlyExpenses
}) => {
  const balance = monthlyIncome - monthlyExpenses;
  const recentTransactions = transactions.slice(0, 3);

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#1f2937',
          margin: '0 0 8px 0'
        }}>
          MoneyUP
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#6b7280',
          margin: 0
        }}>
          Ihre Finanzen - einfach und übersichtlich
        </p>
      </div>

      {/* Main Balance Card */}
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        borderRadius: '20px',
        padding: '40px',
        textAlign: 'center',
        color: 'white',
        marginBottom: '30px',
        boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          margin: '0 0 16px 0',
          opacity: 0.9
        }}>
          Ihr aktueller Saldo
        </h2>
        <div style={{
          fontSize: '48px',
          fontWeight: '800',
          margin: '0 0 8px 0'
        }}>
          {balance >= 0 ? '+' : ''}{balance.toLocaleString('de-DE')}€
        </div>
        <p style={{
          fontSize: '16px',
          margin: 0,
          opacity: 0.8
        }}>
          {balance >= 0 ? 'Sie haben Geld übrig!' : 'Sie geben mehr aus als Sie einnehmen'}
        </p>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: '#f0fdf4',
          border: '2px solid #bbf7d0',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#16a34a',
            marginBottom: '8px'
          }}>
            {monthlyIncome.toLocaleString('de-DE')}€
          </div>
          <div style={{
            fontSize: '16px',
            color: '#16a34a',
            fontWeight: '600'
          }}>
            Einkommen
          </div>
        </div>
        
        <div style={{
          background: '#fef2f2',
          border: '2px solid #fecaca',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#dc2626',
            marginBottom: '8px'
          }}>
            {monthlyExpenses.toLocaleString('de-DE')}€
          </div>
          <div style={{
            fontSize: '16px',
            color: '#dc2626',
            fontWeight: '600'
          }}>
            Ausgaben
          </div>
        </div>
      </div>

      {/* Add Transaction Button */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <button
          onClick={onAddTransaction}
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            padding: '20px 40px',
            fontSize: '20px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
          }}
        >
          <i className="fas fa-plus" style={{ fontSize: '18px' }}></i>
          Transaktion hinzufügen
        </button>
      </div>

      {/* Recent Transactions */}
      {recentTransactions.length > 0 && (
        <div>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 20px 0',
            textAlign: 'center'
          }}>
            Letzte Transaktionen
          </h3>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: transaction.type === 'income' ? '#f0fdf4' : '#fef2f2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: transaction.type === 'income' ? '#16a34a' : '#dc2626'
                  }}>
                    <i className={`fas ${transaction.type === 'income' ? 'fa-plus' : 'fa-minus'}`}></i>
                  </div>
                  <div>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '4px'
                    }}>
                      {transaction.description}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#6b7280'
                    }}>
                      {new Date(transaction.date).toLocaleDateString('de-DE')}
                    </div>
                  </div>
                </div>
                <div style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: transaction.type === 'income' ? '#16a34a' : '#dc2626'
                }}>
                  {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString('de-DE')}€
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Button */}
      <div style={{
        textAlign: 'center',
        marginTop: '40px'
      }}>
        <button
          onClick={() => {
            // Temporarily disable simplified mode to access settings
            const currentSettings = JSON.parse(localStorage.getItem('moneyup-accessibility-settings') || '{}');
            currentSettings.simplifiedMode = false;
            localStorage.setItem('moneyup-accessibility-settings', JSON.stringify(currentSettings));
            window.location.reload();
          }}
          style={{
            background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}
        >
          <i className="fas fa-cog"></i>
          Einstellungen ändern
        </button>
      </div>

      {/* Help Text */}
      <div style={{
        textAlign: 'center',
        marginTop: '20px',
        padding: '20px',
        background: '#f0f9ff',
        border: '1px solid #bae6fd',
        borderRadius: '12px'
      }}>
        <p style={{
          fontSize: '16px',
          color: '#0369a1',
          margin: 0,
          lineHeight: '1.5'
        }}>
          <i className="fas fa-lightbulb" style={{ marginRight: '8px' }}></i>
          Tipp: Klicken Sie auf "Transaktion hinzufügen", um Ihre Einnahmen und Ausgaben zu erfassen.
        </p>
      </div>
    </div>
  );
};

export default SimplifiedMode;
