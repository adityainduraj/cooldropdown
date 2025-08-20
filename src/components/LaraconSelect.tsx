import React, { useState, useRef, useEffect } from 'react';

const LaraconSelect: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [citySlideDirection, setCitySlideDirection] = useState<'out' | 'in' | 'none'>('none');
  const [pressedOptionIndex, setPressedOptionIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Centralized transition timings
  const MAIN_EASING = 'cubic-bezier(0.23, 1, 0.32, 1)';
  const ICON_TRANSITION = 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)';
  const SCALE_TRANSITION = `transform 100ms ${MAIN_EASING}`;
  const CHECKMARK_TRANSITION = 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)';
  const SLIDE_TRANSITION = `transform 350ms ease-in-out, opacity 200ms ease-in-out`;
  const CITY_TRANSITION = `transform 300ms ${MAIN_EASING}, opacity 200ms ${MAIN_EASING}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  const options = [
    'Denver, USA',
    'Brisbane, Australia', 
    'Amsterdam, Netherlands',
    'Gandhinagar, India'
  ];

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
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
           zIndex: 100,
           transition: SCALE_TRANSITION,
           transform: isPressed ? 'scale(0.99)' : 'scale(1)'
         }}
         onClick={() => setIsOpen(!isOpen)}
         onMouseDown={() => setIsPressed(true)}
         onMouseUp={() => setIsPressed(false)}
         onMouseLeave={() => setIsPressed(false)}
       >
         {/* Text content container */}
         <div style={{ position: 'relative', flex: 1, height: '48px', display: 'flex', alignItems: 'center', width: '100%', overflow: 'hidden' }}>
           {/* Default state - positioned absolutely */}
           <span
             style={{
               position: 'absolute',
               left: '16px',
               right: '60px',
               fontFamily: 'Inter',
               fontWeight: 600,
               fontSize: '16px',
               letterSpacing: '-2%',
               color: '#FFFFFF',
               whiteSpace: 'nowrap',
               transform: selectedOption ? 'translateY(-20px)' : 'translateY(0px)',
               opacity: selectedOption ? 0 : 1,
               transition: SLIDE_TRANSITION
             }}
           >
             Select a Laracon
           </span>
           
           {/* Selected state - positioned absolutely */}
           <div style={{ 
             position: 'absolute',
             left: '16px',
             right: '60px',
             display: 'flex',
             alignItems: 'center',
             transform: selectedOption ? 'translateY(0px)' : 'translateY(20px)',
             opacity: selectedOption ? 1 : 0,
             transition: SLIDE_TRANSITION
           }}>
             {/* Checkmark - slides in with text content */}
             <img 
               src="/checkmark.svg" 
               alt="Selected" 
               style={{
                 width: '12px',
                 height: '12px',
                 marginRight: '12px'
               }}
             />
             
             {/* Text content */}
             <div style={{ 
               display: 'flex',
               flexDirection: 'column'
             }}>
             <div
               style={{
                 fontFamily: 'Inter',
                 fontWeight: 600,
                 fontSize: '11px',
                 letterSpacing: '-2%',
                 color: '#737373',
                 lineHeight: 1
               }}
             >
               Laracon
             </div>
             <div
               key={selectedOption}
               style={{
                 fontFamily: 'Inter',
                 fontWeight: 600,
                 fontSize: '16px',
                 letterSpacing: '-2%',
                 color: '#FFFFFF',
                 marginTop: '0px',
                 whiteSpace: 'nowrap',
                 overflow: 'hidden',
                 textOverflow: 'ellipsis',
                 transition: CITY_TRANSITION,
                 transform: citySlideDirection === 'out' ? 'translateY(-15px)' : citySlideDirection === 'in' ? 'translateY(15px)' : 'translateY(0px)',
                 opacity: isTransitioning ? 0 : 1
               }}
              >
                {selectedOption}
              </div>
            </div>
           </div>
         </div>
        
<span style={{ position: 'relative', width: '12px', height: '12px', marginRight: '16px', display: 'inline-block' }}>
           <img 
             src="/expand.svg" 
             alt="Expand" 
             style={{
               position: 'absolute',
               top: 0,
               left: 0,
               width: '12px',
               height: '12px',
               opacity: isOpen ? 0 : 1,
               transition: ICON_TRANSITION
             }}
           />
           <img 
             src="/collapse.svg" 
             alt="Collapse" 
             style={{
               position: 'absolute',
               top: 0,
               left: 0,
               width: '12px',
               height: '12px',
               opacity: isOpen ? 1 : 0,
               transition: ICON_TRANSITION
             }}
           />
         </span>
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
               transformOrigin: 'right center',
                transform: isOpen ? `translateY(0) translateX(${index * 2}px) rotate(-${index + 1}deg)` : `translateY(-${60 + (index * 60)}px) translateX(0) rotate(0deg)`,
                scale: pressedOptionIndex === index ? '0.99' : '1',
                opacity: isOpen ? 1 : 0.05,
                transition: `transform 400ms cubic-bezier(0.23, 1, 0.32, 1) ${index * 80}ms, opacity 300ms ease ${index * 80 + 100}ms, scale 100ms cubic-bezier(0.23, 1, 0.32, 1)`,
               pointerEvents: isOpen ? 'auto' : 'none'
             }}
             onClick={() => {
               if (selectedOption && selectedOption !== option) {
                 setCitySlideDirection('out');
                 setIsTransitioning(true);
                 setTimeout(() => {
                   setSelectedOption(option);
                   setCitySlideDirection('in');
                 }, 150);
                 setTimeout(() => {
                   setCitySlideDirection('none');
                   setIsTransitioning(false);
                 }, 200);
               } else {
                 setSelectedOption(option);
               }
             }}
             onMouseDown={() => setPressedOptionIndex(index)}
             onMouseUp={() => setPressedOptionIndex(null)}
             onMouseLeave={() => setPressedOptionIndex(null)}
           >
             <img 
               src="/checkmark.svg" 
               alt="Selected" 
               style={{
                 width: '12px',
                 height: '12px',
                 marginLeft: '16px',
                 opacity: selectedOption === option ? 1 : 0,
                 transition: CHECKMARK_TRANSITION
               }}
             />
             <span
               style={{
                 fontFamily: 'Inter',
                 fontWeight: 600,
                 fontSize: '16px',
                 letterSpacing: '-2%',
                 color: '#FFFFFF',
                 marginLeft: '12px'
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