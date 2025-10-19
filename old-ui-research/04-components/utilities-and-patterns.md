# Utilities and Patterns

This document provides comprehensive guidance on utilities and common patterns used throughout the `@keboola/design` system.

## Table of Contents

1. [Utility Functions](#utility-functions)
2. [Constants](#constants)
3. [Styling Approach](#styling-approach)
4. [Common Patterns](#common-patterns)

---

## Utility Functions

The design system provides a collection of utility functions located in `packages/design/src/utils/`. These utilities are exported from `packages/design/src/utils/index.ts` for easy access.

### Class Name Management

#### `cn()` - Class Name Merger

Combines Tailwind CSS classes intelligently, merging conflicts and handling custom `tw-` prefixed classes.

**Location:** `packages/design/src/utils/classNames.ts`

**Dependencies:**
- `clsx` - Conditional class concatenation
- `tailwind-merge` - Intelligent Tailwind conflict resolution with custom prefix support

**Usage:**

```typescript
import { cn } from '@keboola/design';

// Basic usage
const className = cn(
  'tw-flex tw-items-center',
  'tw-gap-2',
  isDisabled && 'tw-opacity-40',
  customClass
);

// Merges conflicting classes intelligently
const merged = cn(
  'tw-flex tw-flex-row', // Base
  isColumn && 'tw-flex-col' // Overrides with column if needed
);
```

**Implementation Details:**
- Uses `extendTailwindMerge()` with `tw-` prefix configuration
- Handles boolean values, undefined, strings, and object mappings
- Deduplicates class names automatically

#### `extractExternalClasses()` - Class Extraction

Separates external classes (prefixed with `extCls-`) from Tailwind classes.

**Usage:**

```typescript
const [externalClasses, tailwindClasses] = extractExternalClasses(
  'tw-flex extCls-custom-wrapper tw-gap-2'
);

// externalClasses: 'extCls-custom-wrapper'
// tailwindClasses: 'tw-flex tw-gap-2'
```

**Use Cases:**
- Separating third-party styling from Tailwind
- Applying external styles separately from component styles
- Managing component composition with external class overrides

### DOM Manipulation Utilities

#### `mergeRefs()` - Reference Composition

Composes multiple React refs (both callback and RefObject types) into a single callback ref.

**Location:** `packages/design/src/utils/mergeRefs.ts`

**Usage:**

```typescript
import { mergeRefs } from '@keboola/design';
import { forwardRef, useRef } from 'react';

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ value, ...props }, forwardedRef) => {
    const internalRef = useRef<HTMLInputElement>(null);
    
    return (
      <input
        {...props}
        value={value}
        ref={mergeRefs(forwardedRef, internalRef)}
      />
    );
  }
);
```

**Benefits:**
- Enables simultaneous use of forwarded refs and internal refs
- Handles both callback refs and RefObject refs
- No manual ref synchronization needed

**Implementation:**
- Distinguishes between callback refs (functions) and RefObject refs (objects)
- Calls callback refs, assigns to `current` for RefObjects
- Safely handles null/undefined refs

#### `copyToClipboard()` - Clipboard Integration

Simple wrapper around the Clipboard API for copying text to clipboard.

**Location:** `packages/design/src/utils/copyToClipboard.ts`

**Usage:**

```typescript
import { copyToClipboard } from '@keboola/design';

const handleCopyClick = async () => {
  try {
    await copyToClipboard('Text to copy');
    // Show success message
  } catch (error) {
    // Handle copy failure
  }
};
```

**Returns:** `Promise<void>`

**Browser Support:** Requires modern browsers with Clipboard API support (IE11+)

### Timing Utilities

#### `debounce()` - Function Debouncing

Creates a debounced version of a function that delays execution until after a specified delay.

**Location:** `packages/design/src/utils/debounce.ts`

**Usage:**

```typescript
import { debounce } from '@keboola/design';

const handleSearch = debounce((query: string) => {
  performSearch(query);
}, 300);

// In component
<input onChange={(e) => handleSearch(e.target.value)} />
```

**Parameters:**
- `fn` - Function to debounce
- `delay` - Delay in milliseconds

**Type Safety:**
- Preserves function signature through generics
- Maintains parameter types

**Implementation:**
- Clears previous timeout on each call
- Executes function after specified delay of inactivity

#### `noop()` - No-Operation Function

A simple function that does nothing, used as a default callback.

**Location:** `packages/design/src/utils/noop.ts`

**Usage:**

```typescript
import { noop } from '@keboola/design';

const MyComponent = ({ onClose = noop }) => {
  // Safe to call even if onClose is not provided
  return <button onClick={onClose}>Close</button>;
};
```

**Returns:** `undefined`

### String Utilities

#### `createPrefixedString()` - Template Literal Prefixing

Higher-order function for creating prefixed strings using template literals.

**Location:** `packages/design/src/utils/createPrefixedString.ts`

**Usage:**

```typescript
import { createPrefixedString } from '@keboola/design';

const testId = createPrefixedString('input');
const id = testId`field`; // 'input-field'
```

**Pattern:**
- Factory function returns a template tag
- Template tag combines prefix with template literals
- Useful for consistent naming schemes

---

## Constants

### Key Codes

**Location:** `packages/design/src/constants/keyCodes.ts`

Standard keyboard event codes for accessibility and keyboard interaction handling.

**Available Codes:**

```typescript
export const keyCodes = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  SPACE: ' ',
};
```

**Usage:**

```typescript
import { keyCodes } from '@keboola/design';

const handleKeyUp = (event: KeyboardEvent) => {
  if (event.key === keyCodes.ESCAPE) {
    closeMenu();
  } else if (event.key === keyCodes.ENTER) {
    submitForm();
  }
};
```

**Benefits:**
- Type-safe keyboard handling
- Centralized constants prevent typos
- Consistent keyboard behavior across components

---

## Styling Approach

### Tailwind CSS with Custom Prefix

The design system uses Tailwind CSS with a custom `tw-` prefix to avoid conflicts with legacy CSS.

#### Prefix Configuration

All Tailwind classes use the `tw-` prefix:

```typescript
// Correct
'tw-flex tw-items-center tw-gap-2'

// Incorrect (without prefix)
'flex items-center gap-2'
```

#### External Classes

Non-Tailwind classes use the `extCls-` prefix:

```typescript
'tw-flex extCls-custom-wrapper'
```

The `cn()` function and `extractExternalClasses()` handle separation of these classes.

### Class Variance Authority (CVA)

CVA is used for complex component styling with variants and compound variants.

**Location:** Typically in `styles.ts` files within component directories

#### Basic CVA Usage

```typescript
import { cva } from 'class-variance-authority';

export const buttonStyles = cva(
  // Base classes (always applied)
  [
    'tw-flex',
    'tw-items-center',
    'tw-justify-center',
    'tw-rounded',
  ],
  {
    // Default variant values
    defaultVariants: {
      size: 'medium',
      variant: 'primary',
    },
    
    // Named variant groups
    variants: {
      size: {
        small: 'tw-px-3 tw-py-1.5',
        medium: 'tw-px-4 tw-py-2',
        large: 'tw-px-6 tw-py-3',
      },
      variant: {
        primary: 'tw-bg-primary-500 tw-text-white',
        secondary: 'tw-bg-secondary-500 tw-text-white',
        outline: 'tw-border tw-border-neutral-200 tw-text-neutral-800',
      },
    },
    
    // Combinations of variants
    compoundVariants: [
      {
        size: 'large',
        variant: 'outline',
        className: 'tw-border-2',
      },
    ],
  }
);
```

#### CVA in Components

```typescript
import type { VariantProps } from 'class-variance-authority';
import { buttonStyles } from './styles';

type ButtonProps = {
  children: ReactNode;
} & VariantProps<typeof buttonStyles> &
  ComponentProps<'button'>;

export const Button = ({
  children,
  size = 'medium',
  variant = 'primary',
  className,
  ...buttonProps
}: ButtonProps) => {
  const styles = buttonStyles({ size, variant, className });
  
  return (
    <button className={styles} {...buttonProps}>
      {children}
    </button>
  );
};
```

#### Real-World Example: Input Component

**File:** `packages/design/src/components/Input/styles.ts`

```typescript
export const inputWrapperVariants = cva(
  [
    'tw-flex tw-items-center tw-gap-2',
    'tw-rounded tw-border tw-border-solid tw-border-neutral-200',
    'tw-transition-all',
    'has-[input:focus]:tw-ring-4',
  ],
  {
    defaultVariants: {
      variant: 'primary',
      state: 'default',
      sizing: 'default',
    },
    variants: {
      variant: {
        primary: ['tw-bg-white'],
        secondary: ['tw-bg-neutral-100', 'tw-border-neutral-100'],
      },
      state: {
        default: [
          'has-[input:focus]:tw-border-secondary-500',
          'has-[input:focus]:tw-ring-secondary-200',
        ],
        error: [
          'tw-border-error-500',
          'has-[input:focus]:tw-border-error-500',
          'has-[input:focus]:tw-ring-error-200',
        ],
        warning: [
          'tw-border-warning-500',
          'has-[input:focus]:tw-border-warning-500',
          'has-[input:focus]:tw-ring-warning-200',
        ],
      },
      sizing: {
        default: ['tw-py-2.5'],
        small: ['tw-py-2'],
      },
    },
    compoundVariants: [
      {
        variant: 'secondary',
        state: 'error',
        className: ['tw-bg-error-100'],
      },
      {
        variant: 'secondary',
        state: 'warning',
        className: ['tw-bg-warning-100'],
      },
    ],
  }
);
```

### Composition Pattern

Classes are typically organized in layers:

```typescript
// Reset - Remove browser defaults
'tw-border-none tw-bg-transparent tw-outline-none'

// Base - Structural and typographic base
'tw-flex tw-items-center tw-gap-2'
'tw-text-sm tw-font-medium'

// States - Different states (hover, focus, disabled)
'hover:tw-bg-neutral-100'
'focus:tw-ring-4 focus:tw-ring-secondary-200'
'disabled:tw-opacity-40 disabled:tw-cursor-not-allowed'

// Variants - Different visual styles
'data-[state=open]:tw-animate-in'
'data-[state=closed]:tw-animate-out'
```

---

## Common Patterns

### 1. Forward References with Type Safety

Used when components need to expose DOM element references.

**Pattern:**

```typescript
import { forwardRef } from 'react';
import type { ComponentProps, ElementRef } from 'react';

type Props = {
  // Component-specific props
  disabled?: boolean;
} & ComponentProps<'input'>;

export const Input = forwardRef<ElementRef<'input'>, Props>(
  ({ disabled, ...props }, ref) => {
    return (
      <input ref={ref} disabled={disabled} {...props} />
    );
  }
);
```

**Benefits:**
- Type-safe ref forwarding
- `ElementRef<'input'>` automatically types as `HTMLInputElement`
- Proper TypeScript inference for `ComponentProps<'input'>`

**Examples in Codebase:**
- `Button`, `Input`, `Textarea` components
- Form-related components that need direct DOM access

### 2. Radix UI Integration Pattern

Components wrap Radix UI primitives, adding styling and composition.

**Pattern:**

```typescript
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { cn } from '../../utils';

export const DropdownMenuContent = ({ 
  className, 
  sideOffset = 4,
  ...props 
}) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      sideOffset={sideOffset}
      className={cn(
        'tw-bg-white tw-border tw-border-neutral-100 tw-rounded-md',
        'data-[state=open]:tw-animate-in',
        'data-[state=closed]:tw-animate-out',
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
);
```

**Key Points:**
- Import from `@radix-ui/react-*` packages
- Wrap primitives with Tailwind styling
- Preserve Radix data attributes in CSS selectors
- Use `Portal` for overlays and dropdowns
- Forward all remaining props to Radix component

**Radix Packages Used:**
- `@radix-ui/react-dialog` - Modal, Dialog
- `@radix-ui/react-dropdown-menu` - Dropdown menus
- `@radix-ui/react-checkbox` - Checkboxes
- `@radix-ui/react-radio-group` - Radio buttons
- `@radix-ui/react-switch` - Toggle switches
- `@radix-ui/react-tabs` - Tabbed interfaces
- `@radix-ui/react-tooltip` - Tooltips
- `@radix-ui/react-scroll-area` - Custom scrollbars
- `@radix-ui/react-popover` - Popovers
- `@radix-ui/react-toggle` - Toggle buttons

### 3. Compound Components

Multi-part components that work together as a cohesive unit.

**Example Pattern:**

```typescript
// Main component
export const Tooltip = ({ tooltip, children, ...props }: Props) => {
  const [open, setOpen] = useState(false);
  
  return (
    <TooltipRoot open={open} onOpenChange={setOpen}>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </TooltipRoot>
  );
};

// Expose sub-components
Tooltip.Root = TooltipRoot;
Tooltip.Content = TooltipContent;
Tooltip.Trigger = TooltipTrigger;
```

**Usage:**

```typescript
// Simple usage with all defaults
<Tooltip tooltip="Help text">{children}</Tooltip>

// Advanced usage with sub-components
<Tooltip.Root open={isOpen} onOpenChange={setIsOpen}>
  <Tooltip.Trigger>{children}</Tooltip.Trigger>
  <Tooltip.Content className="tw-max-w-xs">
    Extended help content
  </Tooltip.Content>
</Tooltip.Root>
```

**Benefits:**
- Flexible composition
- Backwards compatible
- Enables advanced customization

### 4. Controlled vs Uncontrolled Pattern

Components support both controlled and uncontrolled modes.

**Example: Input Component**

```typescript
type Props = {
  value?: ComponentProps<'input'>['value'] | null;
  defaultValue?: ComponentProps<'input'>['defaultValue'] | null;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ value, defaultValue, onChange, ...props }, ref) => {
    // Determine if controlled
    const isControlled = value !== undefined;
    const valueProp = isControlled 
      ? { value: value ?? '' }
      : { defaultValue: defaultValue ?? '' };
    
    return (
      <input
        {...valueProp}
        onChange={onChange}
        ref={ref}
        {...props}
      />
    );
  }
);
```

**Usage:**

```typescript
// Uncontrolled (component manages state)
<Input defaultValue="Initial" onChange={handleChange} />

// Controlled (parent manages state)
const [value, setValue] = useState('');
<Input value={value} onChange={(e) => setValue(e.target.value)} />
```

**Benefits:**
- Flexibility for different use cases
- No forcing parent state management
- Simpler component interface when not needed

### 5. Wrapper Component Pattern

Conditionally wraps components with additional elements.

**Location:** `packages/design/src/components/Wrapper/Wrapper.tsx`

**Pattern:**

```typescript
export type WrapperFn = (children: ReactNode) => ReactNode;

type Props = {
  condition: boolean;
  wrapper: WrapperFn;
  children: ReactNode;
};

export const Wrapper = ({ condition, wrapper, children }: Props) =>
  condition ? wrapper(children) : children;
```

**Usage:**

```typescript
import { Wrapper, type WrapperFn } from '@keboola/design';

export const Checkbox = ({ children, ...props }: Props) => {
  const withLabel: WrapperFn = (child) => (
    <div className="tw-flex tw-items-center tw-gap-2">
      {child}
      <Label>{children}</Label>
    </div>
  );
  
  return (
    <Wrapper condition={children != null} wrapper={withLabel}>
      <CheckboxRoot {...props} />
    </Wrapper>
  );
};
```

**Benefits:**
- Cleaner conditional rendering
- Reusable wrapper logic
- Type-safe wrapper functions

### 6. Radix Data Attributes for Styling

Use Radix data attributes in Tailwind selectors.

**Pattern:**

```typescript
className={cn(
  // Base state
  'tw-hidden',
  
  // State-based visibility
  'data-[state=open]:tw-block',
  'data-[state=closed]:tw-hidden',
  
  // Position-based styling
  'data-[side=top]:tw-slide-in-from-bottom-2',
  'data-[side=bottom]:tw-slide-in-from-top-2',
  
  // Animations based on state
  'data-[state=open]:tw-animate-in',
  'data-[state=closed]:tw-animate-out',
)}
```

**Common Radix Attributes:**
- `data-state` - Component state (open/closed, checked/unchecked)
- `data-side` - Popover/dropdown side (top, bottom, left, right)
- `data-align` - Alignment (start, center, end)
- `data-disabled` - Disabled state
- `data-placeholder-shown` - Placeholder visibility

### 7. Component Composition with CSS Modules Fallback

External classes for legacy CSS compatibility.

**Pattern:**

```typescript
export const buttonStyles = ({ className }: { className?: string }) => {
  const [externalClasses, restClassNames] = extractExternalClasses(className);
  
  return cn(
    externalClasses, // Apply external classes first
    'tw-flex tw-items-center tw-justify-center', // Base styles
    'hover:tw-bg-primary-600', // Interaction states
    restClassNames, // Additional Tailwind classes
  );
};
```

**Use Cases:**
- Gradual migration from CSS modules
- Integration with legacy styling
- Complex third-party styling integration

### 8. Focus Ring Patterns

Consistent focus indicators using Tailwind.

**Pattern:**

```typescript
// Base focus styling
'focus-visible:tw-outline',
'focus-visible:tw-outline-2',
'focus-visible:tw-outline-secondary-500',
'focus-visible:tw-outline-offset-2',

// Alternative with box-shadow
'focus-visible:tw-ring-4',
'focus-visible:tw-ring-secondary-200',
'focus-visible:tw-ring-offset-2',

// Disable on active (click)
'[&:not(:active)]:not-disabled:focus-visible:tw-outline-secondary-500',
```

### 9. Has Selector for State Styling

Using CSS `:has()` selector to style parent based on child state.

**Pattern:**

```typescript
// Style parent when input has focus
'has-[input:focus]:tw-ring-4'
'has-[input:focus]:tw-border-secondary-500'

// Style parent when input is readonly
'has-[input[readonly]]:tw-bg-neutral-150'
'has-[input[readonly]]:tw-border-neutral-150'

// Style parent when input is checked
'has-[input:checked]:tw-text-secondary-500'
```

### 10. Icon Integration Pattern

Consistent icon handling throughout components.

**Pattern:**

```typescript
import { Icon } from '../Icon';

export const Button = ({ icon, isLoading, children }: Props) => {
  return (
    <button>
      {isLoading && (
        <Icon 
          spin 
          icon="spinner" 
          className="tw-inline-block tw-size-4 tw-align-middle"
        />
      )}
      {icon && !isLoading && (
        <Icon 
          icon={icon} 
          className="tw-inline-block tw-size-4 tw-align-middle"
        />
      )}
      {children}
    </button>
  );
};
```

**Icon Sizing Convention:**
- `tw-size-3` - Extra small (12px)
- `tw-size-4` - Small (16px)
- `tw-size-5` - Medium (20px)
- `tw-size-6` - Large (24px)

### 11. Type-Safe Variant Props

Using CVA with TypeScript for type-safe variants.

**Pattern:**

```typescript
import type { VariantProps } from 'class-variance-authority';

// In styles.ts
export const cardVariants = cva([...], { 
  variants: { ... } 
});

// In component.tsx
type CardProps = {
  children: ReactNode;
} & VariantProps<typeof cardVariants> &
    ComponentProps<'div'>;

export const Card = ({ children, padding = 'medium', ...props }: CardProps) => {
  const styles = cardVariants({ padding });
  return <div className={styles} {...props}>{children}</div>;
};
```

**Benefits:**
- IDE autocomplete for variant values
- Type checking for invalid variants
- Self-documenting component props

### 12. Storybook Decorators

Wrapping stories with providers and context.

**Location:** `packages/design/src/utils/decorators.tsx`

**Pattern:**

```typescript
import { withTooltipProvider } from '@keboola/design';

export default {
  component: Button,
  decorators: [withTooltipProvider],
};

export const Example = {
  args: { children: 'Click me' },
};
```

**Commonly Used Decorators:**
- `withTooltipProvider` - Provides Tooltip context
- Custom providers for routing, theme, etc.

---

## Best Practices

### 1. **Always use `cn()` for class composition**

```typescript
// Good
className={cn(baseClasses, conditional && 'tw-opacity-50', customClass)}

// Avoid
className={`${baseClasses} ${conditional ? 'tw-opacity-50' : ''} ${customClass}`}
```

### 2. **Organize classes into logical groups**

```typescript
// Good - Organized by category
cn(
  // Reset
  'tw-border-none tw-bg-transparent',
  // Layout
  'tw-flex tw-items-center tw-gap-2',
  // Typography
  'tw-text-sm tw-font-medium',
  // States
  'hover:tw-bg-neutral-100'
)
```

### 3. **Use CVA for complex variants**

```typescript
// Good - For components with many variants
export const buttonStyles = cva([...], { variants: {...} })

// Avoid - Inline complex logic
className={`${size === 'large' ? '...' : '...'} ${variant === 'primary' ? '...' : '...'}`}
```

### 4. **Preserve Radix data attributes in styles**

```typescript
// Good - Uses Radix attributes
'data-[state=open]:tw-block'

// Avoid - Doesn't leverage Radix
className={isOpen ? 'tw-block' : 'tw-hidden'}
```

### 5. **Use `mergeRefs()` when needing internal + forwarded refs**

```typescript
// Good
const internalRef = useRef(null);
return <input ref={mergeRefs(forwardedRef, internalRef)} />;

// Avoid - Manual ref synchronization
useEffect(() => {
  if (forwardedRef) {
    if (typeof forwardedRef === 'function') {
      forwardedRef(internalRef.current);
    } else {
      forwardedRef.current = internalRef.current;
    }
  }
}, [forwardedRef]);
```

### 6. **Provide meaningful default values**

```typescript
// Good
const MyComponent = ({ size = 'medium', disabled = false }: Props) => {}

// Avoid - Forcing caller to always provide
const MyComponent = ({ size, disabled }: Props) => {}
```

---

## Package Dependencies

Key dependencies for utilities and patterns:

- **`class-variance-authority`** - CVA for variant management
- **`clsx`** - Conditional class names
- **`tailwind-merge`** - Smart Tailwind class merging
- **`@radix-ui/*`** - Unstyled UI primitives (15+ packages)
- **`react`** - React 18.3+

