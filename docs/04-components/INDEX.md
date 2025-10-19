# Design System Component Index

Complete reference of all components in the Keboola design system (`@keboola/design`).

## Table of Contents
1. [Form Components](#form-components)
2. [Layout Components](#layout-components)
3. [Navigation & Menu](#navigation--menu)
4. [Data Display](#data-display)
5. [Feedback & Alerts](#feedback--alerts)
6. [Code & Advanced](#code--advanced)
7. [Utilities & Providers](#utilities--providers)
8. [Composite Blocks](#composite-blocks)
9. [Export Quick Reference](#export-quick-reference)

---

## Form Components

### Input
**Location**: `/packages/design/src/components/Input/`

| Component | Type | Purpose | Key Variants | Usage |
|-----------|------|---------|--------------|-------|
| Input | Component | Base input wrapper | - | Container component |
| TextInput | Component | Text input field | text, email, password, tel, url | Single-line text entry |
| NumberInput | Component | Numeric input | number, min, max, step | Number entry with validation |
| ColorInput | Component | Color picker input | color | Color selection |

**Sub-exports**: `TextInput`, `NumberInput`, `ColorInput`

**Common Props**:
- `placeholder`: string
- `disabled`: boolean
- `defaultValue`: string
- `value`: string
- `onChange`: (value: string) => void
- `pattern`: regex pattern
- `required`: boolean

**Usage in kbc-ui**: Widespread across all data entry forms

---

### Textarea
**Location**: `/packages/design/src/components/Textarea/`

| Component | Purpose | Props | Variants |
|-----------|---------|-------|----------|
| Textarea | Multi-line text input | rows, cols, placeholder, disabled | resizable, readonly |

**Common Props**:
- `rows`: number (height)
- `cols`: number (width)
- `placeholder`: string
- `disabled`: boolean
- `resizable`: boolean
- `readOnly`: boolean

---

### FormGroup
**Location**: `/packages/design/src/components/FormGroup/`

| Component | Purpose | Sub-components | Features |
|-----------|---------|-----------------|----------|
| FormGroup | Composite form field wrapper | TextInput, NumberInput, ColorInput, Textarea, Help | Validation states, error handling |

**Sub-components**:
- `FormGroup.TextInput` - Text input with FormGroup context
- `FormGroup.NumberInput` - Number input with FormGroup context
- `FormGroup.ColorInput` - Color input with FormGroup context
- `FormGroup.Textarea` - Textarea with FormGroup context
- `FormGroup.Help` - Help text with error styling

**Validation States**:
- `state`: 'valid' | 'invalid' | 'default'

**Usage Example**:
```typescript
<FormGroup state={error ? 'invalid' : 'valid'}>
  <FormGroup.TextInput name="email" placeholder="Email" />
  {error && <FormGroup.Help>{error}</FormGroup.Help>}
</FormGroup>
```

**Usage in kbc-ui**: 50+ files with form compositions

---

### Checkbox
**Location**: `/packages/design/src/components/Checkbox/`

| Component | Purpose | Props | Behavior |
|-----------|---------|-------|----------|
| Checkbox | Single/multiple selection | checked, onChange, disabled, id | Toggle on/off |

**Props**:
- `checked`: boolean
- `onChange`: (checked: boolean) => void
- `disabled`: boolean
- `id`: string (for label association)
- `defaultChecked`: boolean

---

### Switch
**Location**: `/packages/design/src/components/Switch/`

| Component | Purpose | Props | Use Case |
|-----------|---------|-------|----------|
| Switch | Binary toggle control | checked, onChange, disabled | Enable/disable settings |

**Props**:
- `checked`: boolean
- `onChange`: (checked: boolean) => void
- `disabled`: boolean

---

### RadioGroup
**Location**: `/packages/design/src/components/RadioGroup/`

| Component | Purpose | Sub-components | Variants |
|-----------|---------|-----------------|----------|
| RadioGroup | Single selection from multiple | RadioGroupItem, RadioGroupItemRadio, RadioGroupItemButton, RadioGroupItemBlock | radio, button, block layouts |

**Sub-components**:
- `RadioGroupItem` - Base radio item
- `RadioGroupItemRadio` - Radio button variant
- `RadioGroupItemButton` - Button variant
- `RadioGroupItemBlock` - Block/card variant

**Props**:
- `value`: string (selected value)
- `onChange`: (value: string) => void
- `disabled`: boolean

**Usage in kbc-ui**: Configuration selections, settings

---

### Label
**Location**: `/packages/design/src/components/Label/`

| Component | Purpose | Props | Accessibility |
|-----------|---------|-------|-----------------|
| Label | Form field label | htmlFor, children | Screen reader support |

**Props**:
- `htmlFor`: string (connects to input id)
- `children`: ReactNode

---

### Clipboard
**Location**: `/packages/design/src/components/Clipboard/`

| Component | Purpose | Features | Behavior |
|-----------|---------|----------|----------|
| Clipboard | Copy-to-clipboard utility | Button, Icon, Tooltip | Shows feedback |

**Usage**: Wraps content that can be copied

---

### Popconfirm
**Location**: `/packages/design/src/components/Popconfirm/`

| Component | Purpose | Props | Use Case |
|-----------|---------|-------|----------|
| Popconfirm | Confirmation dialog | title, description, onConfirm, onCancel | Destructive actions |

**Triggers on**: Button click before action

---

### HelpBlock
**Location**: `/packages/design/src/components/HelpBlock/`

| Component | Purpose | Props | Style |
|-----------|---------|-------|-------|
| HelpBlock | Contextual help text | children, className | Muted text below form fields |

---

## Layout Components

### Card
**Location**: `/packages/design/src/components/Card/`

| Component | Purpose | Composition | Use Case |
|-----------|---------|-------------|----------|
| Card | Content container | Semantic div wrapper | Group related content |

**Props**:
- `className`: string
- `children`: ReactNode

---

### Modal
**Location**: `/packages/design/src/components/Modal/`

| Component | Purpose | Sub-components | Features |
|-----------|---------|-----------------|----------|
| Modal | Dialog overlay | Trigger, Content, Header, Body, Footer, Icon, Close, Overlay | Radix UI Dialog based |

**Sub-components**:
- `Modal.Trigger` - Opens modal
- `Modal.Content` - Modal container
- `Modal.Header` - Header section
- `Modal.Body` - Body section
- `Modal.Footer` - Footer section
- `Modal.Title` - Modal title
- `Modal.Description` - Modal description
- `Modal.Icon` - Icon display
- `Modal.Close` - Close button
- `Modal.Overlay` - Semi-transparent overlay

**Usage Count in kbc-ui**: 130+ files

**Common Pattern**:
```typescript
<Modal>
  <Modal.Trigger>Open</Modal.Trigger>
  <Modal.Content>
    <Modal.Header>
      <Modal.Icon />
      <Modal.Title>Title</Modal.Title>
    </Modal.Header>
    <Modal.Body>Content</Modal.Body>
    <Modal.Footer>
      <Button>Action</Button>
    </Modal.Footer>
  </Modal.Content>
</Modal>
```

---

### Sidebar
**Location**: `/packages/design/src/components/Sidebar/`

| Component | Purpose | Sub-components | Features |
|-----------|---------|-----------------|----------|
| Sidebar | Collapsible navigation | Provider, Menu, Group, Header, Footer, Content, Trigger | Responsive, customizable |

**Sub-components**:
- `SidebarProvider` - Context provider, required wrapper
- `Sidebar` - Main container
- `SidebarHeader` - Header section
- `SidebarContent` - Scrollable content area
- `SidebarFooter` - Footer section
- `SidebarTrigger` - Toggle button
- `SidebarMenu` - Navigation menu
  - `SidebarMenuItem` - Menu item
  - `SidebarMenuButton` - Menu button
  - `SidebarMenuAction` - Action menu
- `SidebarGroup` - Menu group
  - `SidebarGroupLabel` - Group label
  - `SidebarGroupContent` - Group content
  - `SidebarGroupAction` - Group action
- `SidebarSeparator` - Visual divider

**Hooks**:
- `useSidebar()` - Access sidebar state

**Common Pattern**:
```typescript
<SidebarProvider>
  <Sidebar>
    <SidebarHeader>Logo</SidebarHeader>
    <SidebarContent>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton>Item</SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarContent>
    <SidebarFooter>Footer</SidebarFooter>
  </Sidebar>
</SidebarProvider>
```

---

### Sheet
**Location**: `/packages/design/src/components/Sheet/`

| Component | Purpose | Similar To | Behavior |
|-----------|---------|------------|----------|
| Sheet | Full-screen modal drawer | Modal | Slides from side |

**Variants**: Top, right, bottom, left positions

---

### Resizable
**Location**: `/packages/design/src/components/Resizable/`

| Component | Purpose | Features | Use Case |
|-----------|---------|----------|----------|
| Resizable | Resizable panel container | Drag to resize, persist size | Split layouts |

**Sub-components**:
- `ResizablePanelGroup` - Container
- `ResizablePanel` - Resizable panel
- `ResizableHandle` - Drag handle

---

### ScrollArea
**Location**: `/packages/design/src/components/ScrollArea/`

| Component | Purpose | Props | Use Case |
|-----------|---------|-------|----------|
| ScrollArea | Custom scrollbar styling | horizontal, vertical | Large content areas |

**Features**: Native-like scrollbars, custom styling

---

### Wrapper
**Location**: `/packages/design/src/components/Wrapper/`

| Component | Purpose | Props | Use Case |
|-----------|---------|-------|----------|
| Wrapper | Basic layout wrapper | className | Container div |

---

### Separator
**Location**: `/packages/design/src/components/Separator/`

| Component | Purpose | Props | Variants |
|-----------|---------|-------|----------|
| Separator | Visual divider | className, orientation | horizontal, vertical |

---

## Navigation & Menu

### Button
**Location**: `/packages/design/src/components/Button/`

| Component | Purpose | Variants | Sizes |
|-----------|---------|----------|-------|
| Button | Primary action button | primary, secondary, outline, danger, invisible, inline | large, medium, small, extra-small |
| ButtonGroup | Grouped buttons | - | - |
| ButtonInline | Inline variant | - | - |
| ButtonLink | Link-styled button | - | - |
| IconButton | Icon-only button | Same | large, medium, small, extra-small, compact |

**Props**:
- `variant`: 'primary' | 'secondary' | 'outline' | 'danger' | 'invisible' | 'inline'
- `size`: 'large' | 'medium' | 'small' | 'extra-small'
- `icon`: IconType
- `isLoading`: boolean
- `disabled`: boolean
- `block`: boolean (full width)
- `onClick`: () => void

**Usage Count in kbc-ui**: 242+ files

**Common Props**:
```typescript
// Primary action
<Button variant="primary" size="medium">Save</Button>

// Destructive
<Button variant="danger">Delete</Button>

// Loading state
<Button isLoading>Processing...</Button>

// With icon
<Button icon="check">Confirm</Button>

// Icon button
<IconButton icon="pencil" size="medium" />
```

---

### DropdownMenu
**Location**: `/packages/design/src/components/DropdownMenu/`

| Component | Purpose | Sub-items | Features |
|-----------|---------|-----------|----------|
| DropdownMenu | Context menu | Multiple variants | Nested menus, radio groups |

**Sub-components** (20+):
- `DropdownMenuTrigger` - Button that opens menu
- `DropdownMenuContent` - Menu container
- `DropdownMenuItem` - Simple menu item
- `DropdownMenuButtonItem` - Button-style item
- `DropdownMenuAnchorItem` - Link-style item
- `DropdownMenuCheckboxItem` - Checkbox item
- `DropdownMenuRadioItem` - Radio item
- `DropdownMenuRadioGroup` - Radio group container
- `DropdownMenuSwitchItem` - Toggle item
- `DropdownMenuLabel` - Menu label
- `DropdownMenuSeparator` - Divider
- `DropdownMenuGroup` - Item grouping
- `DropdownMenuSub` - Nested menu
- `DropdownMenuSubTrigger` - Nested menu trigger
- `DropdownMenuSubContent` - Nested menu content
- `DropdownMenuIconButtonItem` - Icon button item
- `DropdownMenuItemGroup` - Item grouping variant
- `DropdownMenuItemDescription` - Item description

**Common Pattern**:
```typescript
<DropdownMenu>
  <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuButtonItem>Edit</DropdownMenuButtonItem>
    <DropdownMenuSeparator />
    <DropdownMenuButtonItem variant="danger">Delete</DropdownMenuButtonItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

### NavigationMenu
**Location**: `/packages/design/src/components/NavigationMenu/`

| Component | Purpose | Sub-components | Use Case |
|-----------|---------|-----------------|----------|
| NavigationMenu | Hierarchical navigation | List, Item, ListItem, Button, ListButton | App navigation |

**Sub-components**:
- `NavigationMenuList` - Menu list
- `NavigationMenuListItem` - List item
- `NavigationMenuListButton` - Button item

---

### Command
**Location**: `/packages/design/src/components/Command/`

| Component | Purpose | Features | Use Case |
|-----------|---------|----------|----------|
| Command | Command palette / search interface | Keyboard shortcuts, filtering | Search, quick actions |

**Sub-components**:
- `CommandInput` - Search input
- `CommandList` - Results list
- `CommandGroup` - Result grouping
- `CommandItem` - Single result

---

## Data Display

### Table
**Location**: `/packages/design/src/components/Table/`

| Component | Purpose | Sub-components | Composition |
|-----------|---------|-----------------|-----------|
| Table | Data table | Header, Body, Footer, Row, Cell, Head | Semantic table structure |

**Sub-components**:
- `Table.Header` - Table header
- `Table.Head` - Header cell (th)
- `Table.Body` - Table body
- `Table.Row` - Table row
- `Table.Cell` - Table cell (td)
- `Table.Footer` - Table footer

**Usage Count in kbc-ui**: 19 files

**Common Pattern**:
```typescript
<Table>
  <Table.Header>
    <Table.Row>
      <Table.Head>Name</Table.Head>
      <Table.Head>Status</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {data.map(row => (
      <Table.Row key={row.id}>
        <Table.Cell>{row.name}</Table.Cell>
        <Table.Cell>{row.status}</Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>
```

---

### Timeline
**Location**: `/packages/design/src/components/Timeline/`

| Component | Purpose | Structure | Use Case |
|-----------|---------|-----------|----------|
| Timeline | Chronological event display | Root, Item, Point, Title, Description | Job runs, events history |

---

### Badge
**Location**: `/packages/design/src/components/Badge/`

| Component | Purpose | Variants | Props |
|-----------|---------|----------|-------|
| Badge | Status/category labels | Multiple color variants | asChild, className |

**Common Props**:
```typescript
<Badge variant="secondary">Tag</Badge>
<Badge variant="destructive">Error</Badge>
```

---

### Avatar
**Location**: `/packages/design/src/components/Avatar/`

| Component | Purpose | Props | Fallback |
|-----------|---------|-------|----------|
| Avatar | User profile images | src, alt, initials | Shows initials |

---

### Icon
**Location**: `/packages/design/src/components/Icon/`

| Component | Purpose | Icon Library | Props |
|-----------|---------|--------------|-------|
| Icon | SVG icon display | FontAwesome 6 | icon, size, className |

**Usage**: Core utility used throughout

**Common Icons**:
- check, circle-check
- x, circle-x
- pencil, trash
- download, upload
- chevron-up, chevron-down
- menu, search
- bell, settings
- And 500+ more from FontAwesome

---

## Feedback & Alerts

### Alert
**Location**: `/packages/design/src/components/Alert.tsx`

| Component | Purpose | Variants | Features |
|-----------|---------|----------|----------|
| Alert | Notifications | info, warning, error, success | Collapsible, closeable, withIcon |

**Props**:
- `variant`: 'info' | 'warning' | 'error' | 'success'
- `title`: ReactNode
- `collapsible`: boolean
- `isOpen`: boolean
- `onToggle`: (open: boolean) => void
- `withIcon`: boolean
- `onClose`: () => void

**Common Pattern**:
```typescript
<Alert variant="info" title="Info">
  Information message
</Alert>

<Alert variant="error" variant="danger" onClose={handleClose}>
  Error message
</Alert>
```

---

### Popover
**Location**: `/packages/design/src/components/Popover/`

| Component | Purpose | Similar To | Props |
|-----------|---------|------------|-------|
| Popover | Floating information box | Tooltip | More interactive |

**Sub-components**:
- `PopoverTrigger` - Opens popover
- `PopoverContent` - Popover box

---

### Tooltip
**Location**: `/packages/design/src/components/Tooltip/`

| Component | Purpose | Props | Behavior |
|-----------|---------|-------|----------|
| Tooltip | Hover-triggered help text | title, children | Shows on hover |
| TooltipProvider | Context provider | Required wrapper | - |

**Usage Pattern**:
```typescript
<TooltipProvider>
  <Tooltip title="Help text">
    <Button>Hover me</Button>
  </Tooltip>
</TooltipProvider>
```

---

### Collapse
**Location**: `/packages/design/src/components/Collapse.tsx`

| Component | Purpose | Props | Animation |
|-----------|---------|-------|-----------|
| Collapse | Collapsible content | trigger, children, isOpen | Smooth expand/collapse |

---

### CollapsiblePanel
**Location**: `/packages/design/src/components/CollapsiblePanel.tsx`

| Component | Purpose | Props | Use Case |
|-----------|---------|-------|----------|
| CollapsiblePanel | Panel with collapse header | title, children, defaultOpen | Group related content |

---

### ProgressBar
**Location**: `/packages/design/src/components/ProgressBar/`

| Component | Purpose | Props | Variants |
|-----------|---------|-------|----------|
| ProgressBar | Progress indicator | value, max, label | percentage display |

---

### Skeleton
**Location**: `/packages/design/src/components/Skeleton/`

| Component | Purpose | Props | Use Case |
|-----------|---------|-------|----------|
| Skeleton | Loading placeholder | className, width, height | Shows during data load |
| SkeletonList | List of skeletons | count, className | Multiple placeholders |

---

### DotsLoader
**Location**: `/packages/design/src/components/DotsLoader.tsx`

| Component | Purpose | Animation | Props |
|-----------|---------|-----------|-------|
| DotsLoader | Animated loading indicator | Bouncing dots | className |

---

### EmptySearchContent
**Location**: `/packages/design/src/components/EmptySearchContent.tsx`

| Component | Purpose | Props | Text |
|-----------|---------|-------|------|
| EmptySearchContent | Empty state for searches | - | "No results found" |

---

### KeyCode
**Location**: `/packages/design/src/components/KeyCode.tsx`

| Component | Purpose | Props | Appearance |
|-----------|---------|-------|------------|
| KeyCode | Keyboard key display | keys, children | Styled key badges |

---

### Link
**Location**: `/packages/design/src/components/Link.tsx`

| Component | Purpose | Props | Styling |
|-----------|---------|-------|---------|
| Link | Styled link | href, target, children | Consistent styling |

---

### PanelWithDetails
**Location**: `/packages/design/src/components/PanelWithDetails.tsx`

| Component | Purpose | Props | Behavior |
|-----------|---------|-------|----------|
| PanelWithDetails | Panel with expandable details | title, details | Click to expand |

---

## Code & Advanced

### CodeEditor
**Location**: `/packages/design/src/components/CodeEditor/`

| Component | Purpose | Language | Features |
|-----------|---------|----------|----------|
| CodeEditor | Full-featured code editor | JavaScript, Python, JSON, SQL, etc. | Monaco Editor powered |

**Features**:
- Syntax highlighting
- Code folding
- Line numbers
- Minimap
- Diff mode support
- Theme support
- Read-only mode

**Sub-components**:
- `SimpleEditor` - Basic editor
- `DiffEditor` - Side-by-side diff
- `ButtonToolbar` - Editor toolbar
- `ToggleComponentHelp` - Help toggle

---

### SqlEditor
**Location**: `/packages/design/src/components/CodeEditor/`

| Component | Purpose | Language | Specialized |
|-----------|---------|----------|------------|
| SqlEditor | SQL-specific editor | SQL | SQL syntax highlighting |

---

## Utilities & Providers

### ThemeProvider
**Location**: `/packages/design/src/components/ThemeProvider/`

| Component | Purpose | Props | Required |
|-----------|---------|-------|----------|
| ThemeProvider | Theme context | children, theme | Wrap app root |

---

### Toggle
**Location**: `/packages/design/src/components/Toggle/`

| Component | Purpose | Props | Behavior |
|-----------|---------|-------|----------|
| Toggle | Manual toggle button | pressed, onPressed, icon, variant | Click to toggle |

---

### Tabs
**Location**: `/packages/design/src/components/Tabs.tsx`

| Component | Purpose | Sub-components | Props |
|-----------|---------|-----------------|-------|
| Tabs | Tabbed content interface | Content, Trigger (list) | defaultValue, value, onChange |

**Sub-components**:
- `TabsContent` - Tab pane content
- `Trigger` - Tab button (exported from root)

**Common Pattern**:
```typescript
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

---

### Search
**Location**: `/packages/design/src/components/Search/`

| Component | Purpose | Sub-components | Features |
|-----------|---------|-----------------|----------|
| Search | Search input with filtering | SearchForm | Optimized for queries |

**Sub-components**:
- `Search` - Main search input
- `SearchForm` - Form wrapper

---

### SearchForm
**Location**: `/packages/design/src/components/Search/`

| Component | Purpose | Props | Integration |
|-----------|---------|-------|------------|
| SearchForm | Form-based search | onSubmit, onChange | Works with forms |

---

## Composite Blocks

### SplitButton
**Location**: `/packages/design/src/blocks/SplitButton/`

| Component | Purpose | Composition | Use Case |
|-----------|---------|-------------|----------|
| SplitButton | Button with dropdown menu | Button + DropdownMenu | Primary action + options |

---

### PromptInput
**Location**: `/packages/design/src/blocks/PromptInput/`

| Component | Purpose | Features | Use Case |
|-----------|---------|----------|----------|
| PromptInput | AI prompt input | Submit, clear, formatting | AI features |

---

### EmptyConfigurationActionCard
**Location**: `/packages/design/src/blocks/EmptyConfigurationActionCard/`

| Component | Purpose | Props | Use Case |
|-----------|---------|-------|----------|
| EmptyConfigurationActionCard | Empty state action card | icon, title, description, action | Configuration flow |

---

## Export Quick Reference

### Main Exports (from `/packages/design/src/index.ts`)

**Button Components**
```typescript
export * from './components/Button';
// Exports: Button, ButtonGroup, ButtonInline, ButtonLink, IconButton
```

**Form Components**
```typescript
export * from './components/Input';
export * from './components/Textarea';
export * from './components/Checkbox';
export * from './components/Switch';
export * from './components/RadioGroup';
export * from './components/Label';
export { FormGroup, type ValidityState } from './components/FormGroup';
export * from './components/HelpBlock';
```

**Layout Components**
```typescript
export * from './components/Card';
export * from './components/Modal';
export * from './components/Sidebar';
export { useSidebar, SidebarProvider } from './components/Sidebar';
export * from './components/Sheet';
export * from './components/Separator';
export * from './components/ScrollArea';
```

**Navigation & Menu**
```typescript
export * from './components/DropdownMenu';
export * from './components/NavigationMenu';
export * from './components/Command';
```

**Data Display**
```typescript
export * from './components/Table';
export * from './components/Timeline';
export * from './components/Badge';
export * from './components/Avatar';
export * from './components/Icon';
```

**Feedback**
```typescript
export { Alert, type Props as AlertProps } from './components/Alert';
export * from './components/Popover';
export { Tooltip, TooltipProvider, type Props as TooltipProps } from './components/Tooltip';
export { Collapse } from './components/Collapse';
export { CollapsiblePanel } from './components/CollapsiblePanel';
export * from './components/ProgressBar';
export { Skeleton } from './components/Skeleton/Skeleton';
export { SkeletonList } from './components/Skeleton/SkeletonList';
export { DotsLoader } from './components/DotsLoader';
export { EmptySearchContent } from './components/EmptySearchContent';
export { KeyCode } from './components/KeyCode';
export { Link } from './components/Link';
export { PanelWithDetails } from './components/PanelWithDetails';
```

**Code & Advanced**
```typescript
export { CodeEditor, SqlEditor } from './components/CodeEditor';
```

**Utilities & Providers**
```typescript
export * from './components/ThemeProvider';
export * from './components/Toggle';
export { Tabs, TabsContent, type Trigger } from './components/Tabs';
export * from './components/Search';
export * from './components/Resizable';
export * from './components/Clipboard';
export * from './components/Popconfirm';
```

**Blocks**
```typescript
export * from './blocks/SplitButton';
export * from './blocks/EmptyConfigurationActionCard';
export * from './blocks/PromptInput';
```

**Utilities**
```typescript
export { cn, copyToClipboard } from './utils';
export { Slot } from '@radix-ui/react-slot';
export type { Variant } from './components/Button/types';
```

---

## Usage Statistics

### Component Popularity (in kbc-ui app)

| Rank | Component | Files | Primary Use |
|------|-----------|-------|------------|
| 1 | Button | 242+ | Actions, controls |
| 2 | Modal | 130+ | Dialogs, forms, confirmations |
| 3 | Input | Widespread | Data entry |
| 4 | Table | 19 | Data display |
| 5 | Icon | Core | Visual indicators |
| 6 | Badge | 10+ | Status labels |
| 7 | Alert | 15+ | Notifications |
| 8 | Tooltip | 10+ | Help text |
| 9 | FormGroup | 20+ | Form organization |
| 10 | DropdownMenu | 20+ | Context menus |

---

## Component Dependencies

### External Dependencies
- **Radix UI**: Core component primitives
- **Monaco Editor**: Code editing (CodeEditor only)
- **React Hook Form**: Form state (FormGroup)
- **Class Variance Authority (CVA)**: Variant management
- **Tailwind CSS**: Styling

### Internal Dependencies
- **Icon**: Used by many components (Button, Alert, etc.)
- **Tooltip**: Enhanced with TooltipProvider
- **Modal**: Base for Sheet and other dialogs

---

## Accessibility Features by Component

| Component | ARIA | Keyboard | Focus |
|-----------|------|----------|-------|
| Button | ✓ | ✓ | ✓ |
| Input | ✓ | ✓ | ✓ |
| Modal | ✓ | ✓ | Trapped |
| Table | ✓ | ✓ | ✓ |
| DropdownMenu | ✓ | ✓ | Trapped |
| Sidebar | ✓ | ✓ | ✓ |
| Tooltip | ✓ | Via trigger | - |
| RadioGroup | ✓ | ✓ | ✓ |
| Checkbox | ✓ | ✓ | ✓ |
| Switch | ✓ | ✓ | ✓ |

---

## See Also

- [Components Guide](./README.md) - Comprehensive guide
- [Storybook](http://localhost:6006) - Interactive component explorer
- [Radix UI Documentation](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
