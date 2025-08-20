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
          boxShadow: `
            0px 9px 20px 0px rgba(0, 0, 0, 0.76),
            0px 37px 37px 0px rgba(0, 0, 0, 0.66),
            0px 83px 50px 0px rgba(0, 0, 0, 0.39),
            0px 148px 59px 0px rgba(0, 0, 0, 0.11),
            0px 231px 65px 0px rgba(0, 0, 0, 0.01)
          `,
          cursor: 'pointer'
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
      
      {isOpen && (
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
                marginTop: index === 0 ? '0' : '12px'
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
      )}
    </div>
  );
};

export default LaraconSelect;