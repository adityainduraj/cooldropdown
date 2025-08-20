import React, { useState } from 'react';

const LaraconSelect: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const options = [
    'Denver, USA',
    'Brisbane, Australia', 
    'Amsterdam, Netherlands',
    'Gandhinagar, India'
  ];

  return (
    <div style={{ position: 'relative' }}>
      {/* Shadow layer - positioned behind everything */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '336px',
          height: '48px',
          borderRadius: '12px',
          boxShadow: `
            0px 9px 20px 0px rgba(0, 0, 0, 0.76),
            0px 37px 37px 0px rgba(0, 0, 0, 0.66),
            0px 83px 50px 0px rgba(0, 0, 0, 0.39),
            0px 148px 59px 0px rgba(0, 0, 0, 0.11),
            0px 231px 65px 0px rgba(0, 0, 0, 0.01)
          `,
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />
      
      {/* Main button - no shadow */}
      <div
        style={{
          width: '336px',
          height: '48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(90deg, rgba(20, 20, 20, 1) 0%, rgba(31, 31, 31, 1) 100%)',
          border: '1px solid #262626',
          borderRadius: '12px',
          cursor: 'pointer',
          position: 'relative',
          zIndex: 100
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          style={{
            fontFamily: 'Inter',
            fontWeight: 600,
            fontSize: '16px',
            letterSpacing: '-2%',
            color: '#FFFFFF',
            marginLeft: '16px'
          }}
        >
          Select a Laracon
        </span>
        
        <img 
          src="/expand.svg" 
          alt="Expand" 
          style={{
            width: '12px',
            height: '12px',
            marginRight: '16px'
          }}
        />
      </div>
      
      <div style={{ position: 'absolute', top: '60px', left: 0 }}>
        {options.map((option, index) => (
          <div
            key={option}
            style={{
              width: '336px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              background: 'linear-gradient(90deg, rgba(20, 20, 20, 1) 0%, rgba(31, 31, 31, 1) 100%)',
              border: '1px solid #262626',
              borderRadius: '12px',
              cursor: 'pointer',
              marginTop: index === 0 ? '0' : '12px',
              position: 'relative',
              zIndex: 99 - index,
              transform: isOpen ? 'translateY(0)' : `translateY(-${60 + (index * 60)}px)`,
              opacity: isOpen ? 1 : 0,
              transition: `transform 400ms cubic-bezier(0.4, 0, 0.2, 1) ${index * 80}ms, opacity 300ms ease ${index * 80}ms`,
              pointerEvents: isOpen ? 'auto' : 'none'
            }}
            onClick={() => setIsOpen(false)}
          >
            <span
              style={{
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: '16px',
                letterSpacing: '-2%',
                color: '#FFFFFF',
                marginLeft: '16px'
              }}
            >
              {option}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LaraconSelect;