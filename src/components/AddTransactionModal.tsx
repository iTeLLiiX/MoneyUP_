import React, { useState } from 'react';
import { transactionService, Transaction, TRANSACTION_CATEGORIES } from '../services/TransactionService';
import QuickAddButtons from './QuickAddButtons';
import '../styles/ModernDesign.css';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionAdded: (transaction: Transaction) => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onTransactionAdded
}) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    type: 'expense' as 'income' | 'expense',
    date: new Date().toISOString().split('T')[0]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickAdd = (type: 'income' | 'expense', category: string, description: string, amount?: number) => {
    setFormData(prev => ({
      ...prev,
      type,
      category,
      description,
      amount: amount ? amount.toString() : prev.amount
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description || !formData.category) {
      alert('Bitte füllen Sie alle Felder aus.');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Bitte geben Sie einen gültigen Betrag ein.');
      return;
    }

    setIsSubmitting(true);

    try {
      const transaction = transactionService.addTransaction({
        amount,
        description: formData.description,
        category: formData.category,
        type: formData.type,
        date: formData.date
      });

      onTransactionAdded(transaction);
      
      // Reset form
      setFormData({
        amount: '',
        description: '',
        category: '',
        type: 'expense',
        date: new Date().toISOString().split('T')[0]
      });
      
      onClose();
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Fehler beim Hinzufügen der Transaktion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTypeChange = (type: 'income' | 'expense') => {
    setFormData(prev => ({ ...prev, type, category: '' }));
  };

  const getFilteredCategories = () => {
    return TRANSACTION_CATEGORIES.filter(cat => cat.type === formData.type);
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
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="modern-card" style={{
        padding: 'var(--space-8)',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-xl)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <div>
            <h2 className="modern-heading-2">
              Transaktion hinzufügen
            </h2>
            <p className="modern-text-sm" style={{ margin: 'var(--space-1) 0 0 0' }}>
              Fügen Sie Ihre Einnahmen und Ausgaben hinzu
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
              padding: '4px',
              borderRadius: '4px',
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

        {/* Quick Add Buttons */}
        <QuickAddButtons onQuickAdd={handleQuickAdd} />

        <form onSubmit={handleSubmit}>
          {/* Transaction Type */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Art der Transaktion
            </label>
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: `2px solid ${formData.type === 'expense' ? '#10b981' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  background: formData.type === 'expense' ? '#f0fdf4' : '#ffffff',
                  color: formData.type === 'expense' ? '#10b981' : '#6b7280',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <i className="fas fa-minus-circle"></i>
                Ausgabe
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: `2px solid ${formData.type === 'income' ? '#10b981' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  background: formData.type === 'income' ? '#f0fdf4' : '#ffffff',
                  color: formData.type === 'income' ? '#10b981' : '#6b7280',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <i className="fas fa-plus-circle"></i>
                Einkommen
              </button>
            </div>
          </div>

          {/* Amount */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Betrag
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="z.B. 25,50"
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 40px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10b981';
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
              <span style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '16px',
                fontWeight: '600',
                color: '#6b7280'
              }}>
                €
              </span>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Beschreibung
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="z.B. Einkauf bei Rewe"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#10b981';
                e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
              required
            />
          </div>

          {/* Category */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Kategorie
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box',
                backgroundColor: '#ffffff'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#10b981';
                e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
              required
            >
              <option value="">Wählen Sie eine Kategorie</option>
              {getFilteredCategories().map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            
            {formData.category && (
              <div style={{
                marginTop: '8px',
                padding: '8px 12px',
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#0369a1'
              }}>
                <i className="fas fa-info-circle" style={{ marginRight: '4px' }}></i>
                {formData.type === 'income' ? 'Einkommen wird zu Ihrem Budget hinzugefügt' : 'Ausgabe wird von Ihrem Budget abgezogen'}
              </div>
            )}
          </div>

          {/* Date */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Datum
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#10b981';
                e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
              required
            />
          </div>

          {/* Submit Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{
                flex: 1,
                height: '48px',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{
                flex: 1,
                height: '48px',
                fontSize: '16px',
                fontWeight: '600',
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                  Speichert...
                </>
              ) : (
                <>
                  <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
                  Hinzufügen
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
