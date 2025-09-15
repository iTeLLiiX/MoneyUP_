import React from 'react';

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  value: string | number;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  onClick?: () => void;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  subtitle,
  value,
  icon,
  trend,
  trendValue,
  onClick,
  className = ''
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'var(--success)';
      case 'down': return 'var(--error)';
      default: return 'var(--gray-500)';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return 'fas fa-arrow-up';
      case 'down': return 'fas fa-arrow-down';
      default: return '';
    }
  };

  return (
    <div 
      className={`moneyup-card ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="moneyup-card-header">
        <div className="moneyup-card-icon">
          {icon.startsWith('fas ') ? (
            <i className={icon} style={{ color: '#10b981', fontSize: '24px' }}></i>
          ) : (
            icon
          )}
        </div>
        <div>
          <h3 className="moneyup-card-title">{title}</h3>
          {subtitle && <p className="moneyup-card-subtitle">{subtitle}</p>}
        </div>
      </div>
      
      <div className="moneyup-card-content">
        <div style={{ 
          display: 'flex', 
          alignItems: 'baseline', 
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <span style={{ 
            fontSize: '32px', 
            fontWeight: '700', 
            color: 'var(--gray-900)',
            letterSpacing: '-0.025em'
          }}>
            {value}
          </span>
          
          {trend && trendValue && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
              fontSize: '14px',
              fontWeight: '600',
              color: getTrendColor()
            }}>
              {getTrendIcon() && (
                <i className={getTrendIcon()} style={{ fontSize: '12px' }}></i>
              )}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        
        {onClick && (
          <div style={{ 
            fontSize: '12px', 
            color: 'var(--moneyup-primary)', 
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            Tippen für Details
            <i className="fas fa-arrow-right" style={{ fontSize: '10px' }}></i>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
