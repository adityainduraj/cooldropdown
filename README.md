# LaraconSelect

A modern, accessible dropdown select for React + TypeScript. Fully customizable, type-safe, and performance-optimized with `React.memo`. No dependencies except React.

## Features
- Accessible (ARIA, keyboard navigation)
- TypeScript generics for type-safe options
- Customizable theme (colors, fonts, sizes)
- Smooth animations
- Controlled/uncontrolled usage
- Only React required

## Usage
```tsx
import LaraconSelect, { type SelectOption } from './components/LaraconSelect'

const options: SelectOption[] = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
]

<LaraconSelect options={options} onChange={(v) => console.log(v)} />
```

## API (Props)
| Prop           | Type                                      | Default                  | Description                       |
|----------------|-------------------------------------------|--------------------------|-----------------------------------|
| options        | SelectOption<T>[]                         | Built-in Laracon options | Options to display                |
| value          | T                                         | undefined                | Selected value (controlled)       |
| onChange       | (value: T, option: SelectOption<T>) => void | undefined                | Callback on selection             |
| placeholder    | string                                    | "Select a Laracon"       | Placeholder text                  |
| disabled       | boolean                                   | false                    | Disable the select                |
| theme          | Partial<SelectTheme>                      | Default theme            | Theme overrides                   |
| className      | string                                    | undefined                | Container CSS class               |
| style          | React.CSSProperties                       | undefined                | Inline styles                     |
| id             | string                                    | undefined                | HTML id                           |
| aria-label     | string                                    | undefined                | Accessibility label               |
| aria-labelledby| string                                    | undefined                | Accessibility label ref           |
| autoFocus      | boolean                                   | false                    | Auto focus on mount               |

## Custom Option Types
```tsx
interface User { id: number; name: string }
const userOptions: SelectOption<User>[] = [
  { value: { id: 1, name: 'Alice' }, label: 'Alice' }
]
<LaraconSelect<User> options={userOptions} onChange={user => console.log(user.name)} />
```

## Theming
```tsx
<LaraconSelect theme={{ width: '400px', colors: { accent: '#10B981' } }} />
```

## Accessibility & Keyboard
- Tab: focus
- Enter/Space: open/select
- Arrows: navigate
- Esc: close

## Required Files
- `src/components/LaraconSelect.tsx`
- `src/components/AnimatedChevron.tsx`
- `public/checkmark.svg`

## Browser Support
- React 19+, TypeScript 5+, modern browsers

---
Performance: Uses `React.memo` for optimal rendering.

Dependency: Only React is required.
