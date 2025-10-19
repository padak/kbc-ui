# Keboola Design System - Components Guide

A comprehensive guide to the Keboola design system components library (`@keboola/design`).

## Quick Reference

- **Total Components**: 43+ (including sub-components and utilities)
- **Component Directories**: 34
- **Single-file Components**: 10
- **Additional Blocks**: 3 composite components
- **Location**: `/packages/design/src/components/`
- **Export Point**: `/packages/design/src/index.ts`

## Component Categories

### Form Components (Input, Output, State)
- **Input**: Text, number, and color input fields
- **Textarea**: Multi-line text input
- **Checkbox**: Single and multiple selections
- **Switch**: Binary toggle control
- **RadioGroup**: Single selection from multiple options
- **Label**: Form field labels
- **FormGroup**: Composite form field wrapper with validation
- **Clipboard**: Copy-to-clipboard utility
- **Popconfirm**: Confirmation popup for destructive actions
- **HelpBlock**: Contextual help text

### Layout Components (Structure, Containers)
- **Card**: Content container with styling
- **Modal**: Dialog/popup overlays with header, body, footer
- **Sidebar**: Collapsible navigation sidebar with menu system
- **Sheet**: Full-screen modal drawer
- **Resizable**: Resizable container panels
- **ScrollArea**: Custom scrollable areas
- **Wrapper**: Basic layout wrapper
- **Separator**: Visual divider

### Navigation & Menu
- **Button**: Primary action button with variants (primary, secondary, outline, danger, invisible, inline)
- **ButtonGroup**: Grouped button controls
- **ButtonInline**: Inline button variant
- **ButtonLink**: Button styled as link
- **IconButton**: Icon-only button
- **DropdownMenu**: Context menu with sub-items, checkboxes, radio groups
- **NavigationMenu**: Hierarchical navigation structure
- **Command**: Command palette / search interface

### Data Display
- **Table**: Data table with header, body, footer, row, cell components
- **Timeline**: Chronological event display
- **Badge**: Status/category labels
- **Avatar**: User profile images
- **Icon**: SVG icon component with library

### Feedback & Content
- **Alert**: Alerts/notifications with variants (info, warning, error, success)
- **Popover**: Floating information box
- **Tooltip**: Hover-triggered help text with provider
- **Collapse**: Collapsible content section
- **CollapsiblePanel**: Panel with collapse header
- **ProgressBar**: Progress indicator
- **Skeleton**: Loading placeholder
- **DotsLoader**: Animated loading indicator
- **EmptySearchContent**: Empty state placeholder
- **KeyCode**: Keyboard key display
- **Link**: Styled link component
- **PanelWithDetails**: Panel with expandable details

### Code & Advanced
- **CodeEditor**: Full-featured code editor with Monaco
- **SqlEditor**: SQL-specific code editor
- **FormGroup**: Advanced form field composition system

### Utilities & Providers
- **ThemeProvider**: Theme context provider
- **Toggle**: Manual toggle control
- **Tabs**: Tabbed content interface
- **Search**: Search input with filtering
- **SearchForm**: Form-based search

### Composite Blocks
- **SplitButton**: Button with dropdown menu
- **PromptInput**: AI prompt input component
- **EmptyConfigurationActionCard**: Empty state action card

## Component Statistics

### Most Used Components (in kbc-ui)
| Component | Usage Count | Primary Use |
|-----------|------------|-------------|
| Button | 242+ files | Actions, submissions |
| Modal | 130+ files | Dialogs, forms, confirmations |
| Input | Widespread | Form inputs |
| Table | 19 files | Data display |
| Icon | Core utility | Visual indicators |

## Import Patterns

### Default Import
```typescript
import { Button, Modal, Input } from '@keboola/design';
```

### Component Composition
```typescript
// Modal composition
<Modal>
  <Modal.Trigger>Open</Modal.Trigger>
  <Modal.Content>
    <Modal.Header>
      <Modal.Title>Title</Modal.Title>
    </Modal.Header>
    <Modal.Body>Content</Modal.Body>
    <Modal.Footer>
      <Button>Action</Button>
    </Modal.Footer>
  </Modal.Content>
</Modal>

// Table composition
<Table>
  <Table.Header>
    <Table.Row>
      <Table.Head>Column</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Data</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

### Sub-components
- Button variants: `Button`, `ButtonGroup`, `ButtonInline`, `ButtonLink`, `IconButton`
- Input types: `Input` (TextInput), `NumberInput`, `ColorInput`
- Menu items: `DropdownMenuButtonItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioItem`, etc.
- Sidebar parts: `Sidebar`, `SidebarProvider`, `SidebarMenu`, `SidebarGroup`, etc.

## Common Prop Combinations

### Buttons
```typescript
// Primary action
<Button variant="primary" size="medium">Save</Button>

// Destructive action
<Button variant="danger" size="medium">Delete</Button>

// Loading state
<Button isLoading>Processing...</Button>

// With icon
<Button icon="check">Confirm</Button>

// Block level
<Button block>Full width</Button>
```

### Form Elements
```typescript
// Input with validation
<FormGroup state="error">
  <FormGroup.TextInput />
  <FormGroup.Help>Error message</FormGroup.Help>
</FormGroup>

// Color input
<FormGroup>
  <FormGroup.ColorInput />
</FormGroup>

// Textarea
<FormGroup>
  <FormGroup.Textarea />
</FormGroup>
```

### Alerts
```typescript
// Info alert
<Alert variant="info" title="Information">
  Message content
</Alert>

// Warning (collapsible)
<Alert variant="warning" title="Warning" collapsible isOpen={true}>
  Warning details
</Alert>

// Error with close button
<Alert variant="error" onClose={() => handleClose()}>
  Error message
</Alert>
```

## Export Structure

The design system exports are organized in `/packages/design/src/index.ts`:

### Named Exports
- All components from individual directories
- Type exports for props and variants
- Utility functions (`cn`, `copyToClipboard`)

### Re-exports from Radix UI
- `Slot` from `@radix-ui/react-slot`

### Utility Functions
- `cn()`: Class name merging (from cva)
- `copyToClipboard()`: Clipboard utility

## Real-World Usage Examples

### Modal with Form
```typescript
import { Modal, Button, FormGroup, Input } from '@keboola/design';

export function EditModal() {
  return (
    <Modal>
      <Modal.Trigger>Edit</Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Edit Configuration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            <FormGroup.TextInput placeholder="Name" />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Save</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
```

### Data Table with Actions
```typescript
import { Table, Button, IconButton, Icon } from '@keboola/design';

export function DataTable({ data }) {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head>Actions</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map(row => (
          <Table.Row key={row.id}>
            <Table.Cell>{row.name}</Table.Cell>
            <Table.Cell>{row.status}</Table.Cell>
            <Table.Cell>
              <IconButton icon="pencil" />
              <IconButton icon="trash" />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
```

### Navigation Menu
```typescript
import { Sidebar, SidebarProvider, SidebarMenu } from '@keboola/design';

export function Navigation() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarMenu>
          <SidebarMenu.Item>
            <SidebarMenu.Button>Home</SidebarMenu.Button>
          </SidebarMenu.Item>
          <SidebarMenu.Item>
            <SidebarMenu.Button>Settings</SidebarMenu.Button>
          </SidebarMenu.Item>
        </SidebarMenu>
      </Sidebar>
    </SidebarProvider>
  );
}
```

## Variant Systems

### Button Variants
- `primary` - Main action (blue)
- `secondary` - Secondary action (gray)
- `outline` - Outlined style
- `danger` - Destructive action (red)
- `invisible` - No visible background
- `inline` - Inline text button

### Button Sizes
- `large`
- `medium` (default)
- `small`
- `extra-small`

### Icon Button Sizes
- `large`, `medium`, `small`, `extra-small`, `compact`

### Alert Variants
- `info` - Information (blue)
- `warning` - Warning (amber)
- `error` - Error (red)
- `success` - Success (green)

### Badge Variants
- Multiple color variants (check Badge component)

### Input States
- `valid` - Passes validation
- `invalid` - Validation failed
- `default` - No validation state

## Accessibility Features

- **Semantic HTML**: Components use proper HTML semantics
- **ARIA Labels**: Built-in ARIA support
- **Keyboard Navigation**: Full keyboard support for interactive components
- **Focus Management**: Proper focus handling in modals and menus
- **Color Contrast**: WCAG AA compliant colors
- **Screen Reader Support**: Labels and descriptions for screen readers

## Performance Considerations

- **React.memo**: Used on expensive components
- **Composition over Props**: Allows tree-shaking and smaller bundles
- **Lazy Loading**: Code editors and heavy components support lazy loading
- **Virtual Scrolling**: Tables support virtualization for large datasets

## Theming

### ThemeProvider
```typescript
import { ThemeProvider } from '@keboola/design';

export function App() {
  return (
    <ThemeProvider>
      {/* Your app */}
    </ThemeProvider>
  );
}
```

### Theme Customization
- Tailwind CSS for styling
- CSS variables for colors
- Theme context for app-wide customization

## Dependencies

- **Radix UI**: Headless component primitives
- **React Hook Form**: Form state management
- **Monaco Editor**: Code editing
- **Class Variance Authority (CVA)**: Variant management
- **Tailwind CSS**: Styling framework

## Best Practices

1. **Use Composition**: Leverage component composition for flexibility
2. **Type Safety**: Always use TypeScript prop types
3. **Consistent Spacing**: Use Tailwind spacing classes
4. **Keyboard Accessible**: Test with keyboard navigation
5. **Mobile Responsive**: Test on multiple screen sizes
6. **Error States**: Always include error handling
7. **Loading States**: Show loading indicators for async operations
8. **Accessible Labels**: Use proper labels for form fields

## Common Patterns

### Loading States
```typescript
const [isLoading, setIsLoading] = useState(false);

<Button isLoading={isLoading} onClick={handleAsync}>
  Submit
</Button>
```

### Validation States
```typescript
<FormGroup state={isInvalid ? 'invalid' : 'valid'}>
  <FormGroup.TextInput />
  {isInvalid && <FormGroup.Help>Error message</FormGroup.Help>}
</FormGroup>
```

### Conditional Rendering
```typescript
{hasError ? (
  <Alert variant="error">Something went wrong</Alert>
) : (
  <Content />
)}
```

## Migration Guide

### From Legacy Components
If migrating from older component libraries:

1. Replace custom buttons with `Button` component
2. Use `Modal` instead of custom dialog wrappers
3. Replace form inputs with `FormGroup` composition
4. Use `Table` for consistent data display
5. Use `Alert` for notifications
6. Use `Tooltip` with provider for consistent hover text

## Troubleshooting

### Common Issues

**Issue**: Components not styled correctly
- **Solution**: Ensure ThemeProvider is at root
- **Solution**: Check Tailwind CSS is configured

**Issue**: Modal not closing
- **Solution**: Ensure Modal.Close component is used
- **Solution**: Check onOpenChange prop

**Issue**: Table not scrolling
- **Solution**: Use ScrollArea for large tables
- **Solution**: Apply fixed height to container

## Contributing

When adding new components to the design system:

1. Create component in `/packages/design/src/components/`
2. Export from component's index.ts
3. Export from `/packages/design/src/index.ts`
4. Add Storybook stories
5. Write TypeScript types
6. Include JSDoc comments
7. Test accessibility
8. Add examples to this documentation

## Resources

- Storybook: `yarn dev --filter=@keboola/design` then navigate to Storybook
- Radix UI Docs: https://www.radix-ui.com/
- Tailwind CSS: https://tailwindcss.com/
- Icon Library: Check Icon component for available icons
- Monaco Editor Docs: https://microsoft.github.io/monaco-editor/

## See Also

- [Component Index](./INDEX.md) - Detailed component reference table
- [Design System Documentation](../README.md)
- [Keboola UI Documentation](../../README.md)
