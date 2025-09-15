import React, { useState } from 'react';

interface HelpTooltipProps {
  title: string;
  content: string;
  children: React.ReactNode;
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({ title, content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        style={{ cursor: 'help' }}
      >
        {children}
      </div>
      
      {isVisible && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#1f2937',
          color: '#ffffff',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          marginBottom: '8px',
          maxWidth: '300px',
          whiteSpace: 'normal'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>
            {title}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>
            {content}
          </div>
          
          {/* Arrow */}
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid #1f2937'
          }}></div>
        </div>
      )}
    </div>
  );
};

export default HelpTooltip;
