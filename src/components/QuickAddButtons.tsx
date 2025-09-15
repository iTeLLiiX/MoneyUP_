import React from 'react';

interface QuickAddButtonsProps {
  onQuickAdd: (type: 'income' | 'expense', category: string, description: string, amount?: number) => void;
}

const QuickAddButtons: React.FC<QuickAddButtonsProps> = ({ onQuickAdd }) => {
  const quickActions = [
    // Income
    { type: 'income' as const, category: 'salary', description: 'Gehalt', icon: 'fas fa-briefcase', color: '#10b981' },
    { type: 'income' as const, category: 'freelance', description: 'Freelance', icon: 'fas fa-laptop', color: '#10b981' },
    
    // Common Expenses
    { type: 'expense' as const, category: 'groceries', description: 'Lebensmittel', icon: 'fas fa-shopping-cart', color: '#dc2626' },
    { type: 'expense' as const, category: 'transport', description: 'Tankstelle', icon: 'fas fa-car', color: '#dc2626' },
    { type: 'expense' as const, category: 'restaurant', description: 'Restaurant', icon: 'fas fa-utensils', color: '#dc2626' },
    { type: 'expense' as const, category: 'entertainment', description: 'Unterhaltung', icon: 'fas fa-film', color: '#dc2626' },
  ];

  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ 
        fontSize: '18px', 
        fontWeight: '600', 
        color: '#1f2937', 
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <i className="fas fa-bolt" style={{ color: '#10b981' }}></i>
        Schnell hinzufügen
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px'
      }}>
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => onQuickAdd(action.type, action.category, action.description)}
            style={{
              padding: '16px 12px',
              border: `2px solid ${action.color}20`,
              borderRadius: '12px',
              backgroundColor: `${action.color}10`,
              color: action.color,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              minHeight: '80px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = `${action.color}20`;
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 4px 12px ${action.color}30`;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = `${action.color}10`;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <i className={action.icon} style={{ fontSize: '20px' }}></i>
            <span style={{ 
              fontSize: '12px', 
              fontWeight: '600',
              textAlign: 'center',
              lineHeight: '1.2'
            }}>
              {action.description}
            </span>
          </button>
        ))}
      </div>
      
      <div style={{
        marginTop: '12px',
        padding: '12px',
        backgroundColor: '#f0f9ff',
        border: '1px solid #bae6fd',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#0369a1',
        textAlign: 'center'
      }}>
        <i className="fas fa-info-circle" style={{ marginRight: '6px' }}></i>
        Tippen Sie auf eine Kategorie, um schnell eine Transaktion hinzuzufügen
      </div>
    </div>
  );
};

export default QuickAddButtons;
