# LaraconSelect Component

A highly customizable, accessible dropdown select component built with React and TypeScript. Features smooth animations, keyboard navigation, and a comprehensive theming system.

## Features

- **Fully accessible** with ARIA attributes and keyboard navigation
- **TypeScript support** with generic types for type-safe option handling
- **Customizable theming** for colors, fonts, dimensions, and animations
- **Smooth animations** with staggered transitions and crossfade effects
- **Zero dependencies** beyond React
- **Performance optimized** with React.memo and proper memoization

## Basic Usage

```tsx
import LaraconSelect from './components/LaraconSelect'

// Default usage with built-in Laracon options
<LaraconSelect />
```

## Custom Options

```tsx
import LaraconSelect, { type SelectOption } from './components/LaraconSelect'

const options: SelectOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3', disabled: true }
]

<LaraconSelect 
  options={options}
  placeholder="Choose an option"
  onChange={(value, option) => console.log('Selected:', value)}
/>
```

## Controlled Component

```tsx
const [selectedValue, setSelectedValue] = useState<string>()

<LaraconSelect
  options={options}
  value={selectedValue}
  onChange={(value) => setSelectedValue(value)}
/>
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `SelectOption<T>[]` | Default Laracon options | Array of options to display |
| `value` | `T` | `undefined` | Currently selected value (for controlled mode) |
| `onChange` | `(value: T, option: SelectOption<T>) => void` | `undefined` | Callback fired when selection changes |
| `placeholder` | `string` | `"Select a Laracon"` | Placeholder text when no option selected |
| `disabled` | `boolean` | `false` | Whether the component is disabled |
| `theme` | `Partial<SelectTheme>` | Default theme | Custom theme overrides |
| `className` | `string` | `undefined` | CSS class for the container |
| `style` | `React.CSSProperties` | `undefined` | Inline styles for the container |
| `id` | `string` | `undefined` | HTML id attribute |
| `aria-label` | `string` | `undefined` | Accessibility label |
| `aria-labelledby` | `string` | `undefined` | Reference to labeling element |
| `autoFocus` | `boolean` | `false` | Auto focus on mount |

### SelectOption Interface

```tsx
interface SelectOption<T = string> {
  value: T
  label: string
  disabled?: boolean
}
```

### Theme Customization

```tsx
const customTheme = {
  width: '400px',
  height: '56px',
  borderRadius: '8px',
  colors: {
    text: '#ffffff',
    placeholder: '#ffffff',
    accent: '#10B981',
    disabled: '#737373'
  },
  font: {
    family: 'Inter',
    weight: 600,
    size: '16px',
    letterSpacing: '-2%'
  }
}

<LaraconSelect theme={customTheme} />
```

## TypeScript Generics

For type-safe handling of complex option values:

```tsx
interface User {
  id: number
  name: string
  email: string
}

const userOptions: SelectOption<User>[] = [
  { 
    value: { id: 1, name: 'John', email: 'john@example.com' }, 
    label: 'John Doe' 
  }
]

<LaraconSelect<User>
  options={userOptions}
  onChange={(user, option) => {
    // user is fully typed as User
    console.log(user.email)
  }}
/>
```

## Keyboard Navigation

- **Tab** - Focus the component
- **Space/Enter** - Open dropdown or select focused option
- **Arrow Up/Down** - Navigate through options
- **Home/End** - Jump to first/last option
- **Escape** - Close dropdown

## Accessibility

The component includes comprehensive accessibility features:
- ARIA roles and properties
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Semantic HTML structure

## Required Files

Ensure these files are present in your project:

```
src/components/
├── LaraconSelect.tsx
├── AnimatedChevron.tsx
public/
└── checkmark.svg
```

## Browser Support

Modern browsers supporting ES2022+ and CSS transforms. Built with React 19+ and TypeScript 5+.
