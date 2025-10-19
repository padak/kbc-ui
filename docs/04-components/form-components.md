# Form Components

## Overview

The Keboola Design System provides a comprehensive set of form components built on top of Radix UI primitives with TailwindCSS styling. These components are organized into several categories:

- **Button Components**: Interactive buttons with various styles and states
- **Input Components**: Text inputs, textareas, and specialized input types
- **Selection Components**: Checkboxes, switches, and radio buttons
- **Helper Components**: Labels, help text, and form groups

All components support accessibility features, disabled states, and are styled with Tailwind CSS classes.

## Dependencies

- **Radix UI**: Unstyled, accessible component primitives
- **class-variance-authority (CVA)**: Type-safe CSS class composition
- **React**: React 18.3+ with hooks
- **TailwindCSS**: Utility-first CSS framework

---

## Button Components

### Button

The primary button component for user interactions.

**Location**: `/packages/design/src/components/Button/Button.tsx`

**Props**:
```typescript
type ButtonProps = {
  children: ReactNode;
  icon?: ComponentProps<typeof Icon>['icon'];
  isLoading?: boolean;
  block?: boolean;
  size?: 'large' | 'medium' | 'small' | 'extra-small'; // default: 'medium'
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'invisible' | 'inline'; // default: 'primary'
  disabled?: boolean; // default: false
  type?: 'button' | 'submit' | 'reset'; // default: 'button'
  className?: string;
} & ComponentProps<'button'>
```

**Variants**:
- `primary`: Solid primary color background (blue)
- `secondary`: Solid secondary color background (green)
- `outline`: White background with border
- `danger`: Solid error/danger color background (red)
- `invisible`: Transparent background with hover effect
- `inline`: Rounded transparent background

**Features**:
- Icon support with optional loading spinner
- Full-width block mode
- Loading state with animated spinner icon
- Disabled state with opacity and cursor changes
- Focus visible outline
- Supports all standard button attributes

**Example**:
```jsx
import { Button } from '@keboola/design';

// Basic button
<Button>Click me</Button>

// Primary button with icon
<Button icon="save" variant="primary">Save</Button>

// Loading state
<Button isLoading>Loading...</Button>

// Danger button disabled
<Button variant="danger" disabled>Delete</Button>

// Full-width block button
<Button block>Full Width</Button>
```

---

### IconButton

A button designed specifically for icon-only interactions.

**Location**: `/packages/design/src/components/Button/IconButton.tsx`

**Props**:
```typescript
type IconButtonProps = {
  icon: ComponentProps<typeof Icon>['icon']; // required
  iconClassName?: string;
  isFilledIcon?: boolean; // default: false
  isLoading?: boolean; // default: false
  size?: 'large' | 'medium' | 'small' | 'extra-small' | 'compact'; // default: 'medium'
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'invisible' | 'inline'; // default: 'primary'
  disabled?: boolean; // default: false
  type?: 'button' | 'submit' | 'reset'; // default: 'button'
  className?: string;
} & ComponentProps<'button'>
```

**Features**:
- Renders only an icon without text
- Supports filled icon styling (changes SVG color to secondary)
- Loading spinner replaces icon
- More compact than Button component
- Automatically sets `data-button-group-id="icon-button"` for ButtonGroup compatibility
- Available sizes include compact mode

**Example**:
```jsx
import { IconButton } from '@keboola/design';

// Basic icon button
<IconButton icon="trash" onClick={handleDelete} />

// Large icon button with filled icon
<IconButton icon="star" size="large" isFilledIcon />

// Loading icon button
<IconButton icon="download" isLoading />

// Danger icon button
<IconButton icon="alert" variant="danger" />
```

---

### ButtonGroup

A container component for grouping multiple buttons together.

**Location**: `/packages/design/src/components/Button/ButtonGroup.tsx`

**Props**:
```typescript
type ButtonGroupProps = {
  children: ReactNode;
  space?: 'extra-small' | 'small' | 'medium' | 'large'; // default: 'small'
  variant?: 'inline' | 'compact' | 'block'; // default: 'inline'
  className?: string;
} & ComponentProps<'div'>
```

**Variants**:
- `inline`: Buttons displayed with gap spacing (default)
- `compact`: Buttons connected with no gap, shared borders between adjacent buttons
- `block`: Full-width layout with flex-grow buttons

**Features**:
- Manages spacing between buttons
- Compact variant removes gaps and merges borders
- Block variant makes buttons fill available space
- Automatically handles focus states and border interactions
- Special handling for outline variant buttons in compact mode

**Example**:
```jsx
import { Button, ButtonGroup } from '@keboola/design';

// Inline buttons with gap
<ButtonGroup variant="inline" space="medium">
  <Button>Cancel</Button>
  <Button variant="primary">Save</Button>
</ButtonGroup>

// Compact connected buttons
<ButtonGroup variant="compact">
  <Button variant="outline">Option 1</Button>
  <Button variant="outline">Option 2</Button>
  <Button variant="outline">Option 3</Button>
</ButtonGroup>

// Full-width block layout
<ButtonGroup variant="block">
  <Button>Left</Button>
  <Button>Center</Button>
  <Button>Right</Button>
</ButtonGroup>
```

---

### ButtonLink

A button-styled link component using Radix UI Slot.

**Location**: `/packages/design/src/components/Button/ButtonLink.tsx`

**Props**:
```typescript
type ButtonLinkProps = {
  children: ReactNode;
  onClick?: (e: MouseEvent) => void;
  size?: 'large' | 'medium' | 'small' | 'extra-small'; // default: 'medium'
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'invisible' | 'inline'; // default: 'primary'
  disabled?: boolean; // default: false
  className?: string;
}
```

**Features**:
- Renders as an anchor element by default (uses Slot)
- Styled like a Button
- Disabled state prevents navigation and click propagation
- Supports all button variants and sizes
- Text color inheritance for links

**Example**:
```jsx
import { ButtonLink } from '@keboola/design';

// Button-styled link
<ButtonLink>
  <a href="/dashboard">Go to Dashboard</a>
</ButtonLink>

// Disabled link
<ButtonLink disabled>
  <a href="/admin">Admin</a>
</ButtonLink>
```

---

### ButtonInline

A lightweight inline button typically used for secondary actions.

**Location**: `/packages/design/src/components/Button/ButtonInline.tsx`

**Props**:
```typescript
type ButtonInlineProps = {
  children?: ReactNode;
  variant?: 'link' | 'link-reverse' | 'custom'; // default: 'link'
  color?: 'link' | 'dark' | 'danger' | 'custom'; // default: 'link'
  type?: 'button' | 'submit' | 'reset'; // default: 'button'
  disabled?: boolean;
  className?: string;
} & ComponentProps<'button'>
```

**Variants**:
- `link`: Shows underline by default, removes on hover
- `link-reverse`: No underline by default, adds on hover
- `custom`: No styling applied, useful for custom styling

**Color Options**:
- `link`: Secondary color (blue)
- `dark`: Neutral dark color
- `danger`: Error/danger red color
- `custom`: No color applied

**Features**:
- Minimal styling, ideal for inline actions
- Underline controlled by variant
- Color-coded for different action types
- Full disabled state support

**Example**:
```jsx
import { ButtonInline } from '@keboola/design';

// Standard link button
<ButtonInline>Learn more</ButtonInline>

// Dark color link
<ButtonInline color="dark">More options</ButtonInline>

// Danger color (typically for delete)
<ButtonInline color="danger" variant="link-reverse">Remove</ButtonInline>
```

---

## Input Components

### Input

The main text input component with support for prefixes, suffixes, and clear button.

**Location**: `/packages/design/src/components/Input/Input.tsx`

**Props**:
```typescript
type InputProps = {
  prefix?: ReactNode;
  rightSuffix?: ReactNode;
  leftSuffix?: ReactNode;
  allowClear?: boolean; // default: false
  onClear?: () => void;
  testId?: string;
  value?: string | null;
  defaultValue?: string | null;
  state?: 'default' | 'error' | 'warning'; // default: 'default'
  sizing?: 'default' | 'small'; // default: 'default'
  variant?: 'primary' | 'secondary'; // default: 'primary'
  disableFocusEffect?: boolean; // default: false
  type?: 'text' | 'email' | 'password' | 'number' | 'url' | etc;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
} & ComponentProps<'input'>
```

**Variants**:
- `primary`: White background with secondary focus ring
- `secondary`: Neutral-100 background

**States**:
- `default`: Neutral styling with blue focus border
- `error`: Red border and ring on focus
- `warning`: Orange border and ring on focus

**Features**:
- Controlled and uncontrolled value support
- Optional clear button (X icon) for clearing input
- Prefix support for icons/labels before input
- Left and right suffix support for icons/buttons after input
- Focus effects with ring styling
- Read-only state with disabled styling
- Automatic focus effect disable option

**Example**:
```jsx
import { Input } from '@keboola/design';

// Basic input
<Input placeholder="Enter text" />

// Input with clear button
<Input allowClear onClear={() => setValue('')} />

// Email input with prefix
<Input type="email" prefix={<Icon icon="envelope" />} />

// Error state
<Input state="error" value={inputValue} onChange={handleChange} />

// Warning state with suffix
<Input state="warning" rightSuffix={<HelpBlock state="warning">Required field</HelpBlock>} />

// Read-only input
<Input readOnly defaultValue="Read-only text" />
```

---

### Textarea

A multi-line text input component with auto-sizing capabilities.

**Location**: `/packages/design/src/components/Textarea/Textarea.tsx`

**Props**:
```typescript
type TextareaProps = {
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
  onValueBlur?: (value: string) => void;
  suffix?: ReactNode;
  maxRows?: number | 'unlimited'; // default: 4
  minRows?: number; // default: 1
  disableResize?: boolean; // default: false
  state?: 'default' | 'error' | 'warning'; // default: 'default'
  variant?: 'primary' | 'secondary'; // default: 'primary'
  className?: string;
} & ComponentProps<typeof TextareaAutosize>
```

**Features**:
- Auto-sizing with configurable min/max rows
- Optional suffix for icons/additional content
- Value change callbacks with current value
- Blur callbacks with final value
- Resize control (vertical only by default)
- Same state and variant system as Input
- Uses `react-textarea-autosize` library

**Example**:
```jsx
import { Textarea } from '@keboola/design';

// Basic textarea
<Textarea placeholder="Enter description" />

// Auto-sizing with limits
<Textarea minRows={2} maxRows={10} />

// No resize
<Textarea disableResize />

// With value change callback
<Textarea 
  onValueChange={(value) => console.log('Changed:', value)}
  onValueBlur={(value) => console.log('Blurred:', value)}
/>

// Error state
<Textarea state="error" defaultValue="Previous input" />

// With suffix
<Textarea suffix={<span className="text-neutral-400">500 chars max</span>} />
```

---

### FormGroup

A wrapper component that groups form inputs with labels and help text. Includes specialized sub-components for common input types.

**Location**: `/packages/design/src/components/FormGroup/FormGroup.tsx`

**Props**:
```typescript
type FormGroupProps = {
  children: ReactNode;
  state?: 'default' | 'error' | 'warning'; // default: 'default'
  className?: string;
  testId?: string;
}
```

**Sub-components**:
- `FormGroup.TextInput`: Wrapper for text inputs
- `FormGroup.NumberInput`: Wrapper for number inputs
- `FormGroup.ColorInput`: Wrapper for color picker inputs
- `FormGroup.Textarea`: Wrapper for textareas
- `FormGroup.Help`: Help text component

**Features**:
- Context-based state management passed to children
- Flexible layout with flex column and gap
- Testable with `testId` prop
- Compound component pattern for organized structure

**Example**:
```jsx
import { FormGroup, Label, Input, HelpBlock } from '@keboola/design';

// Basic form group
<FormGroup state="default">
  <Label htmlFor="username">Username</Label>
  <FormGroup.TextInput id="username" />
  <FormGroup.Help>Enter your username</FormGroup.Help>
</FormGroup>

// Error state with help
<FormGroup state="error">
  <Label htmlFor="email">Email</Label>
  <FormGroup.TextInput id="email" />
  <FormGroup.Help>Invalid email format</FormGroup.Help>
</FormGroup>

// Number input
<FormGroup state="warning">
  <Label htmlFor="quantity">Quantity</Label>
  <FormGroup.NumberInput id="quantity" />
  <FormGroup.Help>Minimum 1 item required</FormGroup.Help>
</FormGroup>
```

---

### HelpBlock

A helper component for displaying help text, error messages, and warnings.

**Location**: `/packages/design/src/components/HelpBlock/HelpBlock.tsx`

**Props**:
```typescript
type HelpBlockProps = {
  children?: ReactNode;
  state?: 'default' | 'error' | 'warning'; // default: 'default'
  className?: string;
  testId?: string;
}
```

**States**:
- `default`: Neutral gray text
- `error`: Red error text
- `warning`: Orange warning text

**Features**:
- Renders as `<p>` element
- Returns `null` if no children
- Small text size (xs)
- No margin by default

**Example**:
```jsx
import { HelpBlock } from '@keboola/design';

// Default help text
<HelpBlock>This field is optional</HelpBlock>

// Error message
<HelpBlock state="error">This field is required</HelpBlock>

// Warning message
<HelpBlock state="warning">This value will be overwritten</HelpBlock>

// Standalone with custom styling
<HelpBlock state="error" className="tw-mt-2">
  Username must be at least 3 characters
</HelpBlock>
```

---

### Label

A semantic label component for form inputs.

**Location**: `/packages/design/src/components/Label/Label.tsx`

**Props**:
```typescript
type LabelProps = {
  htmlFor?: string | number;
  id?: string | number;
  children?: ReactNode;
  className?: string;
} & ComponentProps<typeof RLabel.Root>
```

**Sub-components**:
- `Label.Optional`: Component for marking fields as optional

**Features**:
- Based on Radix UI Label
- Accessible form labeling
- Support for optional indicator
- Neutral styling

**Example**:
```jsx
import { Label } from '@keboola/design';

// Basic label
<Label htmlFor="email">Email Address</Label>

// Label with optional indicator
<Label htmlFor="phone">
  Phone <Label.Optional />
</Label>

// Standalone label
<Label>Choose an option</Label>
```

---

## Selection Components

### Checkbox

A checkbox input component with optional label support.

**Location**: `/packages/design/src/components/Checkbox/Checkbox.tsx`

**Props**:
```typescript
type CheckboxProps = {
  id?: string | number;
  children?: ReactNode; // If provided, renders with associated label
  checked?: boolean | 'indeterminate';
  onCheckedChange?: (checked: boolean | 'indeterminate') => void;
  disabled?: boolean;
  className?: string;
} & ComponentProps<typeof RCheckbox.Root>
```

**States**:
- `unchecked`: Default state with neutral border
- `checked`: Blue background with white checkmark
- `indeterminate`: Neutral state with minus icon

**Features**:
- Radix UI Root + Indicator primitives
- Indeterminate state support for partial selection
- Auto-generated ID if not provided
- Automatic label association when children provided
- Disabled state with reduced opacity
- Focus-visible styling

**Example**:
```jsx
import { Checkbox } from '@keboola/design';

// Basic checkbox
<Checkbox id="agree" onCheckedChange={setAgreed}>
  I agree to terms
</Checkbox>

// Indeterminate state
<Checkbox 
  checked="indeterminate"
  onChange={() => setChecked(true)}
>
  All items
</Checkbox>

// Standalone checkbox without label
<Checkbox id="subscribe" />

// Disabled checkbox
<Checkbox disabled checked>
  Disabled option
</Checkbox>
```

---

### Switch

A toggle/switch component for boolean states.

**Location**: `/packages/design/src/components/Switch/Switch.tsx`

**Props**:
```typescript
type SwitchProps = {
  id?: string | number;
  children?: ReactNode; // If provided, renders with associated label
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean; // default: false
  size?: 'small' | 'medium' | 'large'; // default: 'medium'
  className?: string;
} & ComponentProps<typeof RSwitch.Root>
```

**Sizes**:
- `small`: 24px width × 16px height
- `medium`: 32px width × 16px height (default)
- `large`: 40px width × 20px height

**Features**:
- Radix UI Root + Thumb primitives
- Three size options
- Smooth animation on toggle
- Auto-generated ID if not provided
- Automatic label association
- Shadow effect on thumb
- Disabled state with reduced opacity
- Focus-visible outline and ring

**Example**:
```jsx
import { Switch } from '@keboola/design';

// Basic switch
<Switch checked={enabled} onCheckedChange={setEnabled}>
  Enable notifications
</Switch>

// Different sizes
<Switch size="small">Small toggle</Switch>
<Switch size="large">Large toggle</Switch>

// Disabled switch
<Switch disabled>
  Unavailable option
</Switch>

// Standalone without label
<Switch checked={value} onCheckedChange={setValue} />
```

---

### RadioGroup

A group component for radio button selection with multiple variants.

**Location**: `/packages/design/src/components/RadioGroup/RadioGroup.tsx`

**Props**:
```typescript
type RadioGroupProps<Value> = {
  value?: Value | null;
  defaultValue?: Value | null;
  onChange?: (value: Value) => void;
  variant?: 'radio' | 'button' | 'radio-block'; // default: 'radio'
  orientation?: 'horizontal' | 'vertical'; // default: 'horizontal'
  disabled?: boolean; // default: false
  className?: string;
  children: ReactNode;
} & ComponentProps<typeof RRadioGroup.Root>
```

**Variants**:
- `radio`: Standard radio button with label (vertical layout)
- `button`: Button-style selection with secondary border and color
- `radio-block`: Full-width card-style selection with border

**Orientations**:
- `horizontal`: Items displayed in a row with small gap
- `vertical`: Items displayed in column with medium gap

**Features**:
- Generic type support for strongly typed values
- Radio variant with circular indicator
- Button variant with filled background on selection
- Block variant with card-like appearance
- Context-based variant/orientation passing to items
- Full disabled state support

**Example**:
```jsx
import { RadioGroup } from '@keboola/design';

// Standard radio buttons
<RadioGroup value={size} onChange={setSize} orientation="vertical">
  <RadioGroup.Item value="small">Small</RadioGroup.Item>
  <RadioGroup.Item value="medium">Medium</RadioGroup.Item>
  <RadioGroup.Item value="large">Large</RadioGroup.Item>
</RadioGroup>

// Button-style selection
<RadioGroup value={view} onChange={setView} variant="button">
  <RadioGroup.Item value="list">List</RadioGroup.Item>
  <RadioGroup.Item value="grid">Grid</RadioGroup.Item>
</RadioGroup>

// Block-style selection (full-width cards)
<RadioGroup 
  value={plan} 
  onChange={setPlan} 
  variant="radio-block"
  orientation="vertical"
>
  <RadioGroup.Item value="basic">Basic Plan</RadioGroup.Item>
  <RadioGroup.Item value="premium">Premium Plan</RadioGroup.Item>
</RadioGroup>

// Disabled radio group
<RadioGroup disabled>
  <RadioGroup.Item value="option1">Option 1</RadioGroup.Item>
  <RadioGroup.Item value="option2">Option 2</RadioGroup.Item>
</RadioGroup>
```

---

### RadioGroup.Item

Individual radio item component that adapts based on parent RadioGroup variant.

**Location**: `/packages/design/src/components/RadioGroup/RadioGroupItem.tsx`

**Props**:
```typescript
type RadioGroupItemProps<T> = {
  value: T;
  children?: ReactNode;
  disabled?: boolean;
  className?: string;
}
```

**Behavior**:
- **Radio Variant**: Displays as standard radio button with label
- **Button Variant**: Displays as button with border and hover effects
- **Radio-Block Variant**: Displays as full-width card with dot indicator

**Features**:
- Smart component selection based on context
- Consistent value handling across variants
- Hover and active state styling
- Focus-visible styling for accessibility
- Disabled state support

**Example**:
```jsx
// Items automatically render based on RadioGroup variant
<RadioGroup variant="radio">
  <RadioGroup.Item value="yes">Yes</RadioGroup.Item> {/* Renders as radio */}
</RadioGroup>

<RadioGroup variant="button">
  <RadioGroup.Item value="yes">Yes</RadioGroup.Item> {/* Renders as button */}
</RadioGroup>

<RadioGroup variant="radio-block">
  <RadioGroup.Item value="yes">Yes</RadioGroup.Item> {/* Renders as block */}
</RadioGroup>
```

---

### RadioGroup.Separator

Optional separator component for grouping radio items.

**Location**: `/packages/design/src/components/RadioGroup/RadioGroupSeparator.tsx`

**Features**:
- Visual divider between radio groups or groups of items
- Respects parent orientation

**Example**:
```jsx
<RadioGroup orientation="vertical">
  <RadioGroup.Item value="option1">Option 1</RadioGroup.Item>
  <RadioGroup.Item value="option2">Option 2</RadioGroup.Item>
  <RadioGroup.Separator />
  <RadioGroup.Item value="option3">Option 3</RadioGroup.Item>
</RadioGroup>
```

---

## Styling System

All form components use the following styling approach:

1. **Class Variance Authority (CVA)**: Defines variant and state combinations
2. **TailwindCSS**: Utility classes for styling
3. **Tailwind Preflight**: `tailwindcss-preflight` class for style resets
4. **Custom Utilities**: `cn()` function for merging class names

### Common Patterns

**Color Tokens**:
- Primary: `primary-500`, `primary-600` (blue)
- Secondary: `secondary-500`, `secondary-600`, `secondary-700` (green)
- Error: `error-500`, `error-600`, `error-700` (red)
- Warning: `warning-500` (orange)
- Neutral: `neutral-100`, `neutral-200`, `neutral-400`, `neutral-500`, `neutral-800`

**Focus Styling**:
- `focus-visible` for keyboard navigation
- Ring with color-coded token
- Outline offset for visual depth

**Disabled Styling**:
- Opacity reduction (typically 40-50%)
- Cursor change to `not-allowed`
- Prevented event handlers

---

## Accessibility Features

All form components include:

- Semantic HTML elements
- ARIA attributes via Radix UI
- Keyboard navigation support
- Focus indicators
- Label associations with `htmlFor`
- Disabled state visual feedback
- Color not sole indicator (uses icons/text)
- Sufficient contrast ratios

---

## TypeScript Support

All components are fully typed with:
- Exported type definitions
- Generic type support (e.g., RadioGroup)
- Prop overloading for different use cases
- Component props extending native HTML elements

---

## Usage in Forms

### Complete Form Example

```jsx
import { 
  Button, 
  FormGroup, 
  Input, 
  Checkbox, 
  RadioGroup, 
  Switch,
  Label,
  HelpBlock,
  Textarea
} from '@keboola/design';
import { useState } from 'react';

export const UserForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    newsletter: false,
    plan: 'basic',
    notifications: true,
    bio: '',
    errors: {}
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate and submit
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Email Input */}
      <FormGroup state={formData.errors.email ? 'error' : 'default'}>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          allowClear
          placeholder="your@email.com"
        />
        {formData.errors.email && (
          <FormGroup.Help state="error">{formData.errors.email}</FormGroup.Help>
        )}
      </FormGroup>

      {/* Password Input */}
      <FormGroup>
        <Label htmlFor="password">Password</Label>
        <FormGroup.TextInput
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <FormGroup.Help>Minimum 8 characters required</FormGroup.Help>
      </FormGroup>

      {/* Checkbox */}
      <Checkbox
        id="newsletter"
        checked={formData.newsletter}
        onCheckedChange={(checked) => setFormData({ ...formData, newsletter: checked })}
      >
        Subscribe to newsletter
      </Checkbox>

      {/* Radio Group */}
      <FormGroup>
        <Label>Select Plan</Label>
        <RadioGroup 
          value={formData.plan} 
          onChange={(plan) => setFormData({ ...formData, plan })}
          variant="button"
        >
          <RadioGroup.Item value="basic">Basic</RadioGroup.Item>
          <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
          <RadioGroup.Item value="enterprise">Enterprise</RadioGroup.Item>
        </RadioGroup>
      </FormGroup>

      {/* Switch */}
      <Switch
        checked={formData.notifications}
        onCheckedChange={(notifications) => setFormData({ ...formData, notifications })}
      >
        Enable notifications
      </Switch>

      {/* Textarea */}
      <FormGroup>
        <Label htmlFor="bio">Bio <Label.Optional /></Label>
        <FormGroup.Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          minRows={3}
          maxRows={8}
        />
      </FormGroup>

      {/* Submit */}
      <Button type="submit" variant="primary" block>
        Create Account
      </Button>
    </form>
  );
};
```

---

## Notes

- All components support `className` prop for additional styling
- Components integrate with `react-hook-form` and other form libraries
- Disabled states are fully supported on all interactive components
- Test IDs are available on most components for testing purposes
- Components follow Keboola's design tokens and color system
