import React, { useState, useRef, useEffect } from 'react';
import AnimatedChevron from './AnimatedChevron';

const LaraconSelect: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousOption, setPreviousOption] = useState<string | null>(null);
  const [pressedOptionIndex, setPressedOptionIndex] = useState<number | null>(null);
  const [hoveredOptionIndex, setHoveredOptionIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Centralized transition timings
  const MAIN_EASING = 'cubic-bezier(0.23, 1, 0.32, 1)';
  const SCALE_TRANSITION = `transform 100ms ${MAIN_EASING}`;
  const CHECKMARK_TRANSITION = 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)';
  const SLIDE_TRANSITION = `transform 240ms cubic-bezier(0.4, 0, 0.2, 1), opacity 240ms cubic-bezier(0.4, 0, 0.2, 1), scale 240ms cubic-bezier(0.4, 0, 0.2, 1)`;
  const CITY_CROSSFADE = `opacity 225ms ease-in-out`;

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
           transform: isPressed ? 'scale(0.99)' : 'scale(1)',
           WebkitTapHighlightColor: 'transparent',
           WebkitTouchCallout: 'none',
           WebkitUserSelect: 'none',
           outline: 'none'
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
                transform: selectedOption ? 'translateY(-20px) scale(0.95)' : 'translateY(0px) scale(1)',
                opacity: selectedOption ? 0 : 1,
                transition: SLIDE_TRANSITION
              }}
            >
             Select a Laracon
           </span>
           
            {/* Selected state - positioned absolutely */}
              <div style={{ 
                position: 'absolute',
                top: 'calc(50% - 5px)',
                transform: selectedOption ? 'translateY(-50%) scale(1)' : 'translateY(calc(-50% + 20px)) scale(0.95)',
                left: '16px',
                right: '60px',
                display: 'flex',
                alignItems: 'flex-start',
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
                   marginRight: '12px',
                   marginTop: '12.5px'
                 }}
               />
              
              {/* Text content - 27px total height */}
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: '7px'
              }}>
              <div
                style={{
                  fontFamily: 'Inter',
                  fontWeight: 600,
                  fontSize: '11px',
                  letterSpacing: '-2%',
                  color: '#737373',
                  lineHeight: '16px',
                  height: '8px',
                  overflow: 'visible'
                }}
              >
                Laracon
              </div>
               <div style={{ 
                 position: 'relative',
                 height: '12px',
                 overflow: 'visible'
               }}>
                 {/* Previous option (exiting) */}
                 {previousOption && isTransitioning && (
                   <div
                     style={{
                       position: 'absolute',
                       top: 0,
                       left: 0,
                       right: 0,
                       fontFamily: 'Inter',
                       fontWeight: 600,
                       fontSize: '16px',
                       letterSpacing: '-2%',
                       color: '#FFFFFF',
                       lineHeight: '24px',
                       whiteSpace: 'nowrap',
                       overflow: 'hidden',
                       textOverflow: 'ellipsis',
                       transition: CITY_CROSSFADE,
                       opacity: 0
                     }}
                   >
                     {previousOption}
                   </div>
                 )}
                 
                 {/* Current option (entering) */}
                 <div
                   key={selectedOption}
                   style={{
                     fontFamily: 'Inter',
                     fontWeight: 600,
                     fontSize: '16px',
                     letterSpacing: '-2%',
                     color: '#FFFFFF',
                     lineHeight: '24px',
                     whiteSpace: 'nowrap',
                     overflow: 'hidden',
                     textOverflow: 'ellipsis',
                     transition: CITY_CROSSFADE,
                     opacity: isTransitioning ? 0 : 1
                   }}
                 >
                   {selectedOption}
                 </div>
               </div>
             </div>
            </div>
         </div>
         
<div style={{ width: '12px', height: '12px', marginRight: '16px', display: 'flex', alignItems: 'center' }}>
            <AnimatedChevron isExpanded={isOpen} />
          </div>
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
                 transition: `transform 300ms cubic-bezier(0.23, 1, 0.32, 1) ${index * 60}ms, opacity 225ms ease ${index * 60 + 75}ms, scale 75ms cubic-bezier(0.23, 1, 0.32, 1)`,
               pointerEvents: isOpen ? 'auto' : 'none',
               WebkitTapHighlightColor: 'transparent',
               WebkitTouchCallout: 'none',
               WebkitUserSelect: 'none',
               outline: 'none'
             }}
               onClick={() => {
                 if (selectedOption && selectedOption !== option) {
                   setPreviousOption(selectedOption);
                   setSelectedOption(option);
                   setIsTransitioning(true);
                   setHoveredOptionIndex(null); // Clear hover state when selecting
                   setTimeout(() => {
                     setIsTransitioning(false);
                   }, 10);
                   setTimeout(() => {
                     setPreviousOption(null);
                   }, 310);
                 } else {
                   setSelectedOption(option);
                   setHoveredOptionIndex(null); // Clear hover state when selecting
                 }
               }}
              onMouseDown={() => setPressedOptionIndex(index)}
              onMouseUp={() => setPressedOptionIndex(null)}
              onMouseLeave={() => {
                setPressedOptionIndex(null);
                setHoveredOptionIndex(null);
              }}
              onMouseEnter={() => setHoveredOptionIndex(index)}
           >
              <img 
                src="/checkmark.svg" 
                alt="Selected" 
                style={{
                  width: '12px',
                  height: '12px',
                  marginLeft: '16px',
                  opacity: selectedOption === option ? 1 : 
                          (previousOption === option && isTransitioning ? 1 : 
                          (hoveredOptionIndex === index ? 0.25 : 0)),
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
