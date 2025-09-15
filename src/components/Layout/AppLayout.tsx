import React, { useState } from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
  currentPageName: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  currentPageName, 
  onNavigate, 
  onLogout 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const primaryNavigation = [
    { id: 'Übersicht', label: 'Übersicht', icon: 'fas fa-home' },
    { id: 'Fixkosten', label: 'Fixkosten', icon: 'fas fa-chart-bar' },
    { id: 'Konten', label: 'Konten', icon: 'fas fa-credit-card' },
    { id: 'Analyse', label: 'Analyse', icon: 'fas fa-chart-line' },
  ];

  const secondaryNavigation = [
    { id: 'Sparziele', label: 'Sparziele', icon: 'fas fa-target' },
    { id: 'Erfolge', label: 'Erfolge', icon: 'fas fa-trophy' },
    { id: 'Schulden', label: 'Schulden', icon: 'fas fa-exclamation-triangle' },
    { id: 'Einstellungen', label: 'Einstellungen', icon: 'fas fa-cog' },
  ];

  const isSpecialPage = ['Onboarding', 'Payment'].includes(currentPageName);

  if (isSpecialPage) {
    return (
      <div style={{ flex: 1, backgroundColor: '#f8fafc' }}>
        {children}
      </div>
    );
  }

  return (
    <div className="moneyup-app">
      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-left">
          <span>9:41</span>
        </div>
        <div className="status-right">
          <span><i className="fas fa-signal" style={{ fontSize: '14px' }}></i></span>
          <span><i className="fas fa-wifi" style={{ fontSize: '14px' }}></i></span>
          <span><i className="fas fa-battery-three-quarters" style={{ fontSize: '14px' }}></i></span>
        </div>
      </div>

      {/* App Header */}
      <div className="app-header">
        <div className="header-left">
          <button 
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '24px', 
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              transition: 'background-color 0.2s'
            }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <i className="fas fa-bars" style={{ fontSize: '20px' }}></i>
          </button>
          <div>
            <h1 className="header-title">MoneyUP</h1>
            <p className="header-subtitle">
              {[...primaryNavigation, ...secondaryNavigation].find(item => item.id === currentPageName)?.label || currentPageName}
            </p>
          </div>
        </div>
        
        <div className="header-right">
          <button 
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '20px', 
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              transition: 'background-color 0.2s'
            }}
            onClick={onLogout}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <i className="fas fa-user" style={{ fontSize: '18px' }}></i>
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">MoneyUP</h2>
          <p className="sidebar-subtitle">Finanzverwaltung</p>
        </div>
        
        <div className="sidebar-content">
          {/* Primary Navigation */}
          {primaryNavigation.map((item) => (
            <a
              key={item.id}
              className={`sidebar-item ${currentPageName === item.id ? 'active' : ''}`}
              onClick={() => {
                onNavigate(item.id);
                setSidebarOpen(false);
              }}
            >
              <span className="sidebar-icon">
                {item.icon.startsWith('fas ') ? (
                  <i className={item.icon} style={{ color: '#10b981', fontSize: '20px' }}></i>
                ) : (
                  item.icon
                )}
              </span>
              <span className="sidebar-label">{item.label}</span>
            </a>
          ))}
          
          <div style={{ height: '20px', borderBottom: '1px solid #e5e7eb', margin: '0 20px' }} />
          
          {/* Secondary Navigation */}
          {secondaryNavigation.map((item) => (
            <a
              key={item.id}
              className={`sidebar-item ${currentPageName === item.id ? 'active' : ''}`}
              onClick={() => {
                onNavigate(item.id);
                setSidebarOpen(false);
              }}
            >
              <span className="sidebar-icon">
                {item.icon.startsWith('fas ') ? (
                  <i className={item.icon} style={{ color: '#10b981', fontSize: '20px' }}></i>
                ) : (
                  item.icon
                )}
              </span>
              <span className="sidebar-label">{item.label}</span>
            </a>
          ))}
          
          <div style={{ height: '20px' }} />
          
          <a className="sidebar-item" onClick={onLogout}>
            <span className="sidebar-icon">
              <i className="fas fa-sign-out-alt" style={{ color: '#10b981', fontSize: '20px' }}></i>
            </span>
            <span className="sidebar-label">Abmelden</span>
          </a>
        </div>
      </div>

      {/* App Content */}
      <div className="app-content">
        {children}
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        {primaryNavigation.map((item) => (
          <a
            key={item.id}
            className={`nav-item ${currentPageName === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">
              {item.icon.startsWith('fas ') ? (
                <i className={item.icon} style={{ color: '#10b981', fontSize: '20px' }}></i>
              ) : (
                item.icon
              )}
            </span>
            <span className="nav-label">{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
};


export default AppLayout;
