import React, { useReducer, useRef, useEffect, useMemo, useCallback } from 'react';
import AnimatedChevron from './AnimatedChevron';

// Types and Interfaces
export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface SelectTheme {
  width: string;
  height: string;
  borderRadius: string;
  background: string;
  border: string;
  shadow: string;
  colors: {
    text: string;
    placeholder: string;
    accent: string;
    disabled: string;
  };
  font: {
    family: string;
    weight: number;
    size: string;
    letterSpacing: string;
  };
  transitions: {
    main: string;
    scale: string;
    checkmark: string;
    slide: string;
    crossfade: string;
  };
}

export interface LaraconSelectProps<T = string> {
  options?: SelectOption<T>[];
  value?: T;
  onChange?: (value: T, option: SelectOption<T>) => void;
  placeholder?: string;
  disabled?: boolean;
  theme?: Partial<SelectTheme>;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  autoFocus?: boolean;
}

// Default theme
const defaultTheme: SelectTheme = {
  width: '336px',
  height: '48px',
  borderRadius: '12px',
  background: 'linear-gradient(90deg, rgba(20, 20, 20, 1) 0%, rgba(31, 31, 31, 1) 100%)',
  border: '1px solid #262626',
  shadow: `
    0px 9px 20px 0px rgba(0, 0, 0, 0.76),
    0px 37px 37px 0px rgba(0, 0, 0, 0.66),
    0px 83px 50px 0px rgba(0, 0, 0, 0.39),
    0px 148px 59px 0px rgba(0, 0, 0, 0.11),
    0px 231px 65px 0px rgba(0, 0, 0, 0.01)
  `,
  colors: {
    text: '#FFFFFF',
    placeholder: '#FFFFFF',
    accent: '#10B981',
    disabled: '#737373',
  },
  font: {
    family: 'Inter',
    weight: 600,
    size: '16px',
    letterSpacing: '-2%',
  },
  transitions: {
    main: 'cubic-bezier(0.23, 1, 0.32, 1)',
    scale: 'transform 100ms cubic-bezier(0.23, 1, 0.32, 1)',
    checkmark: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slide: 'transform 240ms cubic-bezier(0.4, 0, 0.2, 1), opacity 240ms cubic-bezier(0.4, 0, 0.2, 1), scale 240ms cubic-bezier(0.4, 0, 0.2, 1)',
    crossfade: 'opacity 225ms ease-in-out',
  },
};

// Default options for backward compatibility
const defaultOptions: SelectOption[] = [
  { value: 'Denver, USA', label: 'Denver, USA' },
  { value: 'Brisbane, Australia', label: 'Brisbane, Australia' },
  { value: 'Amsterdam, Netherlands', label: 'Amsterdam, Netherlands' },
  { value: 'Gandhinagar, India', label: 'Gandhinagar, India' },
];

// State management with useReducer
interface SelectState {
  isOpen: boolean;
  isPressed: boolean;
  selectedOption: string | null;
  isTransitioning: boolean;
  previousOption: string | null;
  pressedOptionIndex: number | null;
  hoveredOptionIndex: number | null;
  focusedOptionIndex: number | null;
}

type SelectAction =
  | { type: 'TOGGLE_DROPDOWN' }
  | { type: 'CLOSE_DROPDOWN' }
  | { type: 'OPEN_DROPDOWN' }
  | { type: 'SET_PRESSED'; payload: boolean }
  | { type: 'SET_OPTION'; payload: string; previousOption?: string }
  | { type: 'SET_TRANSITIONING'; payload: boolean }
  | { type: 'CLEAR_PREVIOUS_OPTION' }
  | { type: 'SET_PRESSED_OPTION'; payload: number | null }
  | { type: 'SET_HOVERED_OPTION'; payload: number | null }
  | { type: 'SET_FOCUSED_OPTION'; payload: number | null }
  | { type: 'CLEAR_INTERACTION_STATES' };

const initialState: SelectState = {
  isOpen: false,
  isPressed: false,
  selectedOption: null,
  isTransitioning: false,
  previousOption: null,
  pressedOptionIndex: null,
  hoveredOptionIndex: null,
  focusedOptionIndex: null,
};

const selectReducer = (state: SelectState, action: SelectAction): SelectState => {
  switch (action.type) {
    case 'TOGGLE_DROPDOWN':
      return { ...state, isOpen: !state.isOpen, focusedOptionIndex: state.isOpen ? null : 0 };
    case 'CLOSE_DROPDOWN':
      return { ...state, isOpen: false, focusedOptionIndex: null };
    case 'OPEN_DROPDOWN':
      return { ...state, isOpen: true, focusedOptionIndex: 0 };
    case 'SET_PRESSED':
      return { ...state, isPressed: action.payload };
    case 'SET_OPTION':
      return {
        ...state,
        selectedOption: action.payload,
        previousOption: action.previousOption || null,
        isTransitioning: !!action.previousOption,
      };
    case 'SET_TRANSITIONING':
      return { ...state, isTransitioning: action.payload };
    case 'CLEAR_PREVIOUS_OPTION':
      return { ...state, previousOption: null };
    case 'SET_PRESSED_OPTION':
      return { ...state, pressedOptionIndex: action.payload };
    case 'SET_HOVERED_OPTION':
      return { ...state, hoveredOptionIndex: action.payload };
    case 'SET_FOCUSED_OPTION':
      return { ...state, focusedOptionIndex: action.payload };
    case 'CLEAR_INTERACTION_STATES':
      return {
        ...state,
        pressedOptionIndex: null,
        hoveredOptionIndex: null,
      };
    default:
      return state;
  }
};

function LaraconSelect<T = string>({
  options = defaultOptions as SelectOption<T>[],
  value,
  onChange,
  placeholder = 'Select a Laracon',
  disabled = false,
  theme: themeOverride,
  className,
  style,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  autoFocus = false,
}: LaraconSelectProps<T>) {
  const [state, dispatch] = useReducer(selectReducer, {
    ...initialState,
    selectedOption: value ? String(value) : null,
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Merge theme with defaults
  const theme = useMemo(() => ({
    ...defaultTheme,
    ...themeOverride,
    colors: { ...defaultTheme.colors, ...themeOverride?.colors },
    font: { ...defaultTheme.font, ...themeOverride?.font },
    transitions: { ...defaultTheme.transitions, ...themeOverride?.transitions },
  }), [themeOverride]);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        dispatch({ type: 'CLOSE_DROPDOWN' });
      }
    };

    if (state.isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [state.isOpen]);

  // Auto focus
  useEffect(() => {
    if (autoFocus && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [autoFocus]);

  // Sync external value changes
  useEffect(() => {
    const newValue = value ? String(value) : null;
    if (newValue !== state.selectedOption) {
      dispatch({ type: 'SET_OPTION', payload: newValue || '', previousOption: state.selectedOption || undefined });
    }
  }, [value, state.selectedOption]);

  // Handle option selection
  const handleOptionSelect = useCallback((option: SelectOption<T>) => {
    if (option.disabled) return;

    const optionValue = String(option.value);
    const currentValue = state.selectedOption;

    if (currentValue && currentValue !== optionValue) {
      dispatch({ type: 'SET_OPTION', payload: optionValue, previousOption: currentValue });
      dispatch({ type: 'CLEAR_INTERACTION_STATES' });
      
      setTimeout(() => {
        dispatch({ type: 'SET_TRANSITIONING', payload: false });
      }, 10);
      
      setTimeout(() => {
        dispatch({ type: 'CLEAR_PREVIOUS_OPTION' });
      }, 310);
    } else {
      dispatch({ type: 'SET_OPTION', payload: optionValue });
      dispatch({ type: 'CLEAR_INTERACTION_STATES' });
    }

    // Don't close dropdown on selection - keep original behavior
    // dispatch({ type: 'CLOSE_DROPDOWN' });
    // buttonRef.current?.focus();
    
    if (onChange) {
      onChange(option.value, option);
    }
  }, [state.selectedOption, onChange]);

  // Keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!state.isOpen) {
          dispatch({ type: 'OPEN_DROPDOWN' });
        } else if (state.focusedOptionIndex !== null) {
          const option = options[state.focusedOptionIndex];
          handleOptionSelect(option);
          // Don't close dropdown - maintain original behavior
        }
        break;
      case 'Escape':
        event.preventDefault();
        dispatch({ type: 'CLOSE_DROPDOWN' });
        buttonRef.current?.focus();
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!state.isOpen) {
          dispatch({ type: 'OPEN_DROPDOWN' });
        } else {
          const nextIndex = state.focusedOptionIndex === null ? 0 : 
            Math.min(state.focusedOptionIndex + 1, options.length - 1);
          dispatch({ type: 'SET_FOCUSED_OPTION', payload: nextIndex });
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!state.isOpen) {
          dispatch({ type: 'OPEN_DROPDOWN' });
        } else {
          const prevIndex = state.focusedOptionIndex === null ? options.length - 1 : 
            Math.max(state.focusedOptionIndex - 1, 0);
          dispatch({ type: 'SET_FOCUSED_OPTION', payload: prevIndex });
        }
        break;
      case 'Home':
        event.preventDefault();
        if (state.isOpen) {
          dispatch({ type: 'SET_FOCUSED_OPTION', payload: 0 });
        }
        break;
      case 'End':
        event.preventDefault();
        if (state.isOpen) {
          dispatch({ type: 'SET_FOCUSED_OPTION', payload: options.length - 1 });
        }
        break;
    }
  }, [disabled, state.isOpen, state.focusedOptionIndex, options, handleOptionSelect]);

  // Button click handler
  const handleButtonClick = useCallback(() => {
    if (disabled) return;
    dispatch({ type: 'TOGGLE_DROPDOWN' });
  }, [disabled]);

  // Mouse handlers
  const handleMouseDown = useCallback(() => {
    if (!disabled) dispatch({ type: 'SET_PRESSED', payload: true });
  }, [disabled]);

  const handleMouseUp = useCallback(() => {
    dispatch({ type: 'SET_PRESSED', payload: false });
  }, []);

  const handleMouseLeave = useCallback(() => {
    dispatch({ type: 'SET_PRESSED', payload: false });
  }, []);

  return (
    <div 
      style={{ position: 'relative', ...style }} 
      ref={dropdownRef}
      className={className}
    >
      {/* Shadow layer - positioned behind everything */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: theme.width,
          height: theme.height,
          borderRadius: theme.borderRadius,
          boxShadow: theme.shadow,
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />
      
      {/* Main button - no shadow */}
      <div
        ref={buttonRef}
        role="combobox"
        aria-expanded={state.isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        tabIndex={disabled ? -1 : 0}
        id={id}
        style={{
          width: theme.width,
          height: theme.height,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: theme.background,
          border: theme.border,
          borderRadius: theme.borderRadius,
          cursor: disabled ? 'not-allowed' : 'pointer',
          position: 'relative',
          zIndex: 100,
          transition: theme.transitions.scale,
          transform: state.isPressed && !disabled ? 'scale(0.99)' : 'scale(1)',
          opacity: disabled ? 0.6 : 1,
          WebkitTapHighlightColor: 'transparent',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          outline: 'none'
        }}
        onClick={handleButtonClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
      >
        {/* Text content container */}
        <div style={{ 
          position: 'relative', 
          flex: 1, 
          height: theme.height, 
          display: 'flex', 
          alignItems: 'center', 
          width: '100%', 
          overflow: 'hidden' 
        }}>
          {/* Default state - positioned absolutely */}
          <span
            style={{
              position: 'absolute',
              left: '16px',
              right: '60px',
              fontFamily: theme.font.family,
              fontWeight: theme.font.weight,
              fontSize: theme.font.size,
              letterSpacing: theme.font.letterSpacing,
              color: state.selectedOption ? theme.colors.disabled : theme.colors.placeholder,
              whiteSpace: 'nowrap',
              transform: state.selectedOption ? 'translateY(-20px) scale(0.95)' : 'translateY(0px) scale(1)',
              opacity: state.selectedOption ? 0 : 1,
              transition: theme.transitions.slide
            }}
          >
            {placeholder}
          </span>
          
          {/* Selected state - positioned absolutely */}
          <div style={{ 
            position: 'absolute',
            top: 'calc(50% - 5px)',
            transform: state.selectedOption ? 'translateY(-50%) scale(1)' : 'translateY(calc(-50% + 20px)) scale(0.95)',
            left: '16px',
            right: '60px',
            display: 'flex',
            alignItems: 'flex-start',
            opacity: state.selectedOption ? 1 : 0,
            transition: theme.transitions.slide
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
                  fontFamily: theme.font.family,
                  fontWeight: theme.font.weight,
                  fontSize: '11px',
                  letterSpacing: theme.font.letterSpacing,
                  color: theme.colors.disabled,
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
                {state.previousOption && state.isTransitioning && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      fontFamily: theme.font.family,
                      fontWeight: theme.font.weight,
                      fontSize: theme.font.size,
                      letterSpacing: theme.font.letterSpacing,
                      color: theme.colors.text,
                      lineHeight: '24px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      transition: theme.transitions.crossfade,
                      opacity: 0
                    }}
                  >
                    {state.previousOption}
                  </div>
                )}
                
                {/* Current option (entering) */}
                <div
                  key={state.selectedOption}
                  style={{
                    fontFamily: theme.font.family,
                    fontWeight: theme.font.weight,
                    fontSize: theme.font.size,
                    letterSpacing: theme.font.letterSpacing,
                    color: theme.colors.text,
                    lineHeight: '24px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    transition: theme.transitions.crossfade,
                    opacity: state.isTransitioning ? 0 : 1
                  }}
                >
                  {state.selectedOption}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ 
          width: '12px', 
          height: '12px', 
          marginRight: '16px', 
          display: 'flex', 
          alignItems: 'center' 
        }}>
          <AnimatedChevron isExpanded={state.isOpen} />
        </div>
      </div>
      
      {/* Dropdown options */}
      <div 
        role="listbox"
        style={{ position: 'absolute', top: '60px', left: 0 }}
      >
        {options.map((option, index) => (
          <div
            key={`${option.value}-${index}`}
            role="option"
            aria-selected={String(option.value) === state.selectedOption}
            aria-disabled={option.disabled}
            tabIndex={-1}
            style={{
              width: theme.width,
              height: theme.height,
              display: 'flex',
              alignItems: 'center',
              background: theme.background,
              border: theme.border,
              borderRadius: theme.borderRadius,
              cursor: option.disabled ? 'not-allowed' : 'pointer',
              marginTop: index === 0 ? '0' : '12px',
              position: 'relative',
              zIndex: 99 - index,
              transformOrigin: 'right center',
              transform: state.isOpen ? 
                `translateY(0) translateX(${index * 2}px) rotate(-${index + 1}deg)` : 
                `translateY(-${60 + (index * 60)}px) translateX(0) rotate(0deg)`,
              scale: state.pressedOptionIndex === index ? '0.99' : '1',
              opacity: state.isOpen ? (option.disabled ? 0.5 : 1) : 0.05,
              transition: `transform 300ms ${theme.transitions.main} ${index * 60}ms, opacity 225ms ease ${index * 60 + 75}ms, scale 75ms ${theme.transitions.main}`,
              pointerEvents: state.isOpen ? 'auto' : 'none',
              WebkitTapHighlightColor: 'transparent',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              outline: 'none'
            }}
            onClick={() => handleOptionSelect(option)}
            onMouseDown={() => !option.disabled && dispatch({ type: 'SET_PRESSED_OPTION', payload: index })}
            onMouseUp={() => dispatch({ type: 'SET_PRESSED_OPTION', payload: null })}
            onMouseLeave={() => {
              dispatch({ type: 'SET_PRESSED_OPTION', payload: null });
              dispatch({ type: 'SET_HOVERED_OPTION', payload: null });
            }}
            onMouseEnter={() => !option.disabled && dispatch({ type: 'SET_HOVERED_OPTION', payload: index })}
          >
            <img 
              src="/checkmark.svg" 
              alt="Selected" 
              style={{
                width: '12px',
                height: '12px',
                marginLeft: '16px',
                opacity: String(option.value) === state.selectedOption ? 1 : 
                        (state.previousOption === String(option.value) && state.isTransitioning ? 1 : 
                        (state.hoveredOptionIndex === index && !option.disabled ? 0.25 : 0)),
                transition: theme.transitions.checkmark
              }}
            />
            <span
              style={{
                fontFamily: theme.font.family,
                fontWeight: theme.font.weight,
                fontSize: theme.font.size,
                letterSpacing: theme.font.letterSpacing,
                color: option.disabled ? theme.colors.disabled : theme.colors.text,
                marginLeft: '12px'
              }}
            >
              {option.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(LaraconSelect) as typeof LaraconSelect;
