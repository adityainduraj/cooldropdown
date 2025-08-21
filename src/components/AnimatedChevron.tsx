import React from 'react';

interface AnimatedChevronProps {
  isExpanded: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const AnimatedChevron: React.FC<AnimatedChevronProps> = ({ isExpanded, className, style }) => {
  return (
    <svg 
      width="12" 
      height="12" 
      viewBox="0 0 12 12" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path 
        d={isExpanded ? "M2.5 3.5L6 0.5L9.5 3.5" : "M2.5 1.25L6 4L9.5 1.25"} 
        stroke="#10B981" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={{
          transition: 'd 400ms cubic-bezier(0.23, 1, 0.32, 1)'
        }}
      />
      <path 
        d={isExpanded ? "M9.5 8.5L6 11.5L2.5 8.5" : "M9.5 10.75L6 8L2.5 10.75"} 
        stroke="#10B981" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={{
          transition: 'd 400ms cubic-bezier(0.23, 1, 0.32, 1)'
        }}
      />
    </svg>
  );
};

export default AnimatedChevron;