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
  autoCollapse?: boolean;
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
    slide: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1), opacity 250ms cubic-bezier(0.4, 0, 0.2, 1)',
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
  autoCollapse = false,
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

  // Track if navigation is via keyboard
  const keyboardNavRef = useRef(false);
  const [mainCellFocused, setMainCellFocused] = React.useState(false);

  // Toggle auto-collapse behavior
  const [autoCollapseState, setAutoCollapseState] = React.useState(autoCollapse);

  // Handle option selection
  const handleOptionSelect = useCallback((option: SelectOption<T>) => {
    if (option.disabled) return;

    const optionValue = String(option.value);
    const currentValue = state.selectedOption;
    const isChanging = currentValue && currentValue !== optionValue;

    dispatch({
      type: 'SET_OPTION',
      payload: optionValue,
      previousOption: isChanging ? currentValue : (currentValue || 'placeholder')
    });
    dispatch({ type: 'CLEAR_INTERACTION_STATES' });

    // Handle transition timing
    setTimeout(() => dispatch({ type: 'SET_TRANSITIONING', payload: false }), 10);
    setTimeout(() => dispatch({ type: 'CLEAR_PREVIOUS_OPTION' }), 310);

    // Close dropdown if auto-collapse is enabled
    if (autoCollapseState) {
      dispatch({ type: 'CLOSE_DROPDOWN' });
      buttonRef.current?.focus();
    }

    if (onChange) onChange(option.value, option);
  }, [state.selectedOption, onChange, autoCollapseState]);

  // Keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled) return;

    const { key } = event;
    const isNavigationKey = ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key);

    if (isNavigationKey) {
      event.preventDefault();
      if (!state.isOpen) {
        dispatch({ type: 'OPEN_DROPDOWN' });
      } else {
        let newIndex = 0;
        switch (key) {
          case 'ArrowDown':
            newIndex = state.focusedOptionIndex === null ? 0 :
              Math.min(state.focusedOptionIndex + 1, options.length - 1);
            break;
          case 'ArrowUp':
            newIndex = state.focusedOptionIndex === null ? options.length - 1 :
              Math.max(state.focusedOptionIndex - 1, 0);
            break;
          case 'Home':
            newIndex = 0;
            break;
          case 'End':
            newIndex = options.length - 1;
            break;
        }
        dispatch({ type: 'SET_FOCUSED_OPTION', payload: newIndex });
      }
    } else {
      switch (key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (!state.isOpen) {
            dispatch({ type: 'OPEN_DROPDOWN' });
          } else if (state.focusedOptionIndex !== null) {
            handleOptionSelect(options[state.focusedOptionIndex]);
          }
          break;
        case 'Escape':
          event.preventDefault();
          dispatch({ type: 'CLOSE_DROPDOWN' });
          buttonRef.current?.focus();
          break;
      }
    }
  }, [disabled, state.isOpen, state.focusedOptionIndex, options, handleOptionSelect]);

  // Track navigation method (keyboard vs mouse)
  useEffect(() => {
    const trackKeyboardNav = () => keyboardNavRef.current = true;
    const trackMouseNav = () => keyboardNavRef.current = false;

    window.addEventListener('keydown', trackKeyboardNav);
    window.addEventListener('mousedown', trackMouseNav);

    return () => {
      window.removeEventListener('keydown', trackKeyboardNav);
      window.removeEventListener('mousedown', trackMouseNav);
    };
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
        onFocus={() => setMainCellFocused(true)}
        onBlur={() => setMainCellFocused(false)}
      >
        {/* Keyboard focus border for main cell (only when closed and focused via keyboard) */}
        {keyboardNavRef.current && mainCellFocused && !state.isOpen && (
          <span
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: '2px solid #10B981',
              borderRadius: theme.borderRadius,
              pointerEvents: 'none',
              boxSizing: 'border-box',
              zIndex: 999
            }}
          />
        )}
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
          {/* State 1: Placeholder text only */}
          {!state.selectedOption && (
            <span
              style={{
                position: 'absolute',
                left: '16px',
                right: '60px',
                fontFamily: theme.font.family,
                fontWeight: theme.font.weight,
                fontSize: theme.font.size,
                letterSpacing: theme.font.letterSpacing,
                color: theme.colors.placeholder,
                whiteSpace: 'nowrap',
                transform: 'translateX(0px)',
                opacity: 1,
                filter: 'blur(0px)',
                transition: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1), opacity 250ms cubic-bezier(0.4, 0, 0.2, 1), filter 250ms cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {placeholder}
            </span>
          )}
          
          {/* State 1: Placeholder exiting */}
          {state.selectedOption && state.previousOption === 'placeholder' && state.isTransitioning && (
            <span
              style={{
                position: 'absolute',
                left: '16px',
                right: '60px',
                fontFamily: theme.font.family,
                fontWeight: theme.font.weight,
                fontSize: theme.font.size,
                letterSpacing: theme.font.letterSpacing,
                color: theme.colors.placeholder,
                whiteSpace: 'nowrap',
                transform: 'translateX(16px)',
                opacity: 0,
                filter: 'blur(1px) drop-shadow(1px 0 0 currentColor) drop-shadow(-1px 0 0 currentColor)',
                transition: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1), opacity 250ms cubic-bezier(0.4, 0, 0.2, 1), filter 250ms cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {placeholder}
            </span>
          )}
          
          {/* State 2: Selected state with checkmark + Laracon + city */}
          {state.selectedOption && (() => {
            const isFromPlaceholder = state.previousOption === 'placeholder';
            const isTransitioningIn = isFromPlaceholder && state.isTransitioning;
            const shouldDelay = isFromPlaceholder && !state.isTransitioning;
            
            return (
              <div style={{ 
                position: 'absolute',
                top: 'calc(50% - 5px)',
                transform: isTransitioningIn ? 'translateY(-50%) translateX(-16px)' : 'translateY(-50%) translateX(0px)',
                left: '16px',
                right: '60px',
                display: 'flex',
                alignItems: 'flex-start',
                opacity: isTransitioningIn ? 0 : 1,
                filter: isTransitioningIn ? 'blur(1px) drop-shadow(-1px 0 0 currentColor) drop-shadow(1px 0 0 currentColor)' : 'blur(0px)',
                transition: `transform 250ms cubic-bezier(0.4, 0, 0.2, 1) ${shouldDelay ? '75ms' : '0ms'}, opacity 250ms cubic-bezier(0.4, 0, 0.2, 1) ${shouldDelay ? '75ms' : '0ms'}, filter 250ms cubic-bezier(0.4, 0, 0.2, 1) ${shouldDelay ? '75ms' : '0ms'}`
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
                    {/* Current city - shows immediately when transitioning from placeholder, slides in when changing cities */}
                    {(() => {
                      const isCityTransition = state.previousOption && state.previousOption !== 'placeholder';
                      const isTransitioningOut = isCityTransition && state.isTransitioning;
                      const shouldDelay = isCityTransition && !state.isTransitioning;
                      
                      return (
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
                            transform: isTransitioningOut ? 'translateY(0px) translateX(-0px)' : 'translateY(0px) translateX(0px)',
                            opacity: isTransitioningOut ? 0 : 1,
                            filter: isTransitioningOut ? 'blur(1px) drop-shadow(-1px 0 0 currentColor) drop-shadow(1px 0 0 currentColor)' : 'blur(0px)',
                            transition: `transform 250ms cubic-bezier(0.4, 0, 0.2, 1) ${shouldDelay ? '75ms' : '0ms'}, opacity 250ms cubic-bezier(0.4, 0, 0.2, 1) ${shouldDelay ? '75ms' : '0ms'}, filter 250ms cubic-bezier(0.4, 0, 0.2, 1) ${shouldDelay ? '75ms' : '0ms'}`
                          }}
                        >
                          {state.selectedOption}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            );
          })()}
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
               background: '#171717',
               border: theme.border,
               borderRadius: theme.borderRadius,
               cursor: option.disabled ? 'not-allowed' : 'pointer',
               marginTop: index === 0 ? '0' : '12px',
               position: 'relative',
               zIndex: 99 - index,
               transformOrigin: 'right center',
               transform: `${state.isOpen ?
                 `translateY(0) translateX(${index * 2}px) rotate(-${index + 1}deg)` :
                 `translateY(-${60 + (index * 60)}px) translateX(0) rotate(0deg)`}`,
               scale: state.pressedOptionIndex === index && !option.disabled ? '0.99' : '1',
               filter: state.isOpen ? 'blur(0px)' : 'blur(2px)',
               opacity: state.isOpen ? (option.disabled ? 0.5 : 1) : 0.05,
               transition: `scale 250ms cubic-bezier(0.4, 0, 0.2, 1), transform 300ms ${theme.transitions.main} ${index * 60}ms, opacity 225ms ease ${index * 60 + 75}ms, filter 300ms ${theme.transitions.main} ${index * 60}ms`,
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
                        ((state.hoveredOptionIndex === index || (keyboardNavRef.current && state.focusedOptionIndex === index)) && !option.disabled ? 0.25 : 0)),
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
            {/* Keyboard focus border */}
            {keyboardNavRef.current && state.focusedOptionIndex === index && (
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: '2px solid #10B981',
                  borderRadius: theme.borderRadius,
                  pointerEvents: 'none',
                  boxSizing: 'border-box',
                  zIndex: 999
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Toggle for auto-collapse behavior */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          fontFamily: theme.font.family,
          fontWeight: theme.font.weight,
          fontSize: theme.font.size,
          letterSpacing: theme.font.letterSpacing,
          color: '#059669',
          cursor: 'pointer',
          userSelect: 'none',
          zIndex: 10000,
          transition: 'all 0.15s ease'
        }}
        onClick={() => setAutoCollapseState(!autoCollapseState)}
        onMouseEnter={(e) => {
          const underline = e.currentTarget.querySelector('.underline') as HTMLElement;
          if (underline) underline.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          const underline = e.currentTarget.querySelector('.underline') as HTMLElement;
          if (underline) underline.style.opacity = '0';
        }}
      >
        auto collapse: {autoCollapseState ? 'on' : 'off'}
        <div
          className="underline"
          style={{
            position: 'absolute',
            bottom: '-2px',
            left: '0',
            right: '0',
            height: '2px',
            backgroundColor: '#059669',
            opacity: '0',
            transition: 'opacity 0.15s ease'
          }}
        />
      </div>
    </div>
  );
}

export default React.memo(LaraconSelect) as typeof LaraconSelect;
