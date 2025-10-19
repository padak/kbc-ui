# Design System Directory Structure

Complete directory structure of the Keboola Design System components.

## Package Structure

```
/packages/design/src/
├── components/                          # 34 component directories + 10 single files
│   ├── Alert.tsx                        # Alert notification component
│   ├── Alert.stories.tsx               # Alert storybook stories
│   ├── Avatar.tsx                       # Avatar user component
│   ├── Avatar.stories.tsx              # Avatar stories
│   ├── Collapse.tsx                     # Collapse component
│   ├── Collapse.stories.tsx            # Collapse stories
│   ├── CollapsiblePanel.tsx            # Collapsible panel component
│   ├── CollapsiblePanel.stories.tsx    # CollapsiblePanel stories
│   ├── DotsLoader.tsx                   # Animated dots loader
│   ├── EmptySearchContent.tsx          # Empty search state
│   ├── EmptySearchContent.stories.tsx  # Empty search stories
│   ├── KeyCode.tsx                      # Keyboard key display
│   ├── KeyCode.stories.tsx             # KeyCode stories
│   ├── Link.tsx                         # Styled link
│   ├── Link.stories.tsx                # Link stories
│   ├── PanelWithDetails.tsx            # Panel with expandable details
│   ├── PanelWithDetails.stories.tsx    # PanelWithDetails stories
│   ├── Tabs.tsx                         # Tabbed content
│   ├── Tabs.stories.tsx                # Tabs stories
│   │
│   ├── Badge/                           # Badge component directory
│   │   ├── Badge.tsx
│   │   ├── Badge.stories.tsx
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   ├── Button/                          # Button component (6 variants)
│   │   ├── Button.tsx
│   │   ├── Button.stories.tsx
│   │   ├── ButtonGroup.tsx
│   │   ├── ButtonGroup.stories.tsx
│   │   ├── ButtonInline.tsx
│   │   ├── ButtonInline.stories.tsx
│   │   ├── ButtonLink.tsx
│   │   ├── ButtonLink.stories.tsx
│   │   ├── IconButton.tsx
│   │   ├── IconButton.stories.tsx
│   │   ├── styles.ts
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── Card/                            # Card layout component
│   │   ├── Card.tsx
│   │   ├── index.ts
│   │   └── styles.ts
│   │
│   ├── Checkbox/                        # Checkbox form component
│   │   ├── Checkbox.tsx
│   │   ├── Checkbox.stories.tsx
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   ├── Clipboard/                       # Clipboard utility
│   │   ├── Clipboard.tsx
│   │   ├── Clipboard.stories.tsx
│   │   ├── ClipboardButton.tsx
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   ├── CodeEditor/                      # Code editor components
│   │   ├── CodeEditor.tsx               # Main code editor
│   │   ├── CodeEditor.stories.tsx
│   │   ├── SqlEditor.tsx                # SQL-specific editor
│   │   ├── SimpleEditor.tsx
│   │   ├── DiffEditor.tsx
│   │   ├── ButtonToolbar.tsx
│   │   ├── ToggleComponentHelp.tsx
│   │   ├── helpers.ts
│   │   └── index.ts
│   │
│   ├── Command/                         # Command palette
│   │   ├── Command.tsx
│   │   ├── Command.stories.tsx
│   │   ├── CommandDialog.tsx
│   │   ├── CommandEmpty.tsx
│   │   ├── CommandGroup.tsx
│   │   ├── CommandInput.tsx
│   │   ├── CommandItem.tsx
│   │   ├── CommandList.tsx
│   │   ├── CommandSeparator.tsx
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   ├── DropdownMenu/                    # Dropdown menu (20+ sub-components)
│   │   ├── DropdownMenu.tsx
│   │   ├── DropdownMenu.stories.tsx
│   │   ├── DropdownMenuTrigger.tsx
│   │   ├── DropdownMenuContent.tsx
│   │   ├── DropdownMenuItem.tsx
│   │   ├── DropdownMenuButtonItem.tsx
│   │   ├── DropdownMenuAnchorItem.tsx
│   │   ├── DropdownMenuCheckboxItem.tsx
│   │   ├── DropdownMenuRadioItem.tsx
│   │   ├── DropdownMenuRadioGroup.tsx
│   │   ├── DropdownMenuSwitchItem.tsx
│   │   ├── DropdownMenuLabel.tsx
│   │   ├── DropdownMenuSeparator.tsx
│   │   ├── DropdownMenuGroup.tsx
│   │   ├── DropdownMenuSub.tsx
│   │   ├── DropdownMenuSubTrigger.tsx
│   │   ├── DropdownMenuSubContent.tsx
│   │   ├── DropdownMenuIconButtonItem.tsx
│   │   ├── DropdownMenuItemGroup.tsx
│   │   ├── DropdownMenuItemDescription.tsx
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   ├── FormGroup/                       # Form field wrapper
│   │   ├── FormGroup.tsx
│   │   ├── FormGroup.stories.tsx
│   │   ├── FormGroupColorInput.tsx
│   │   ├── FormGroupHelp.tsx
│   │   ├── FormGroupNumberInput.tsx
│   │   ├── FormGroupTextarea.tsx
│   │   ├── FormGroupTextInput.tsx
│   │   ├── context.ts
│   │   ├── types.ts
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   ├── HelpBlock/                       # Help text component
│   │   ├── HelpBlock.tsx
│   │   ├── HelpBlock.stories.tsx
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   ├── Icon/                            # Icon library
│   │   ├── Icon.tsx
│   │   ├── Icon.stories.tsx
│   │   ├── icon-registry.tsx
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── Input/                           # Input components
│   │   ├── Input.tsx
│   │   ├── Input.stories.tsx
│   │   ├── Input.test.tsx
│   │   ├── TextInput.tsx
│   │   ├── NumberInput.tsx
│   │   ├── ColorInput/                  # Color input variant
│   │   │   ├── ColorInput.tsx
│   │   │   ├── ColorInput.stories.tsx
│   │   │   └── index.ts
│   │   ├── InputClearButton.tsx
│   │   ├── styles.ts
│   │   ├── utils.ts
│   │   └── index.ts
│   │
│   ├── Label/                           # Form label
│   │   ├── Label.tsx
│   │   ├── Label.stories.tsx
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   ├── Modal/                           # Modal dialog
│   │   ├── Modal.tsx
│   │   ├── Modal.stories.tsx
│   │   ├── ModalBody.tsx
│   │   ├── ModalCloseIcon.tsx
│   │   ├── ModalContent.tsx
│   │   ├── ModalDescription.tsx
│   │   ├── ModalFooter.tsx
│   │   ├── ModalHeader.tsx
│   │   ├── ModalIcon.tsx
│   │   ├── ModalOverlay.tsx
│   │   ├── ModalTitle.tsx
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   ├── NavigationMenu/                  # Navigation menu
│   │   ├── NavigationMenu.tsx
│   │   ├── NavigationMenu.stories.tsx
│   │   ├── NavigationMenuList.tsx
│   │   ├── NavigationMenuListItem.tsx
│   │   ├── NavigationMenuListButton.tsx
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   ├── Popconfirm/                      # Confirmation popover
│   │   ├── Popconfirm.tsx
│   │   ├── Popconfirm.stories.tsx
│   │   ├── PopconfirmContent.tsx
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   ├── Popover/                         # Floating popover
│   │   ├── Popover.tsx
│   │   ├── Popover.stories.tsx
│   │   ├── PopoverContent.tsx
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   ├── ProgressBar/                     # Progress indicator
│   │   ├── ProgressBar.tsx
│   │   ├── ProgressBar.stories.tsx
│   │   ├── ProgressBarContent.tsx
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   ├── RadioGroup/                      # Radio button group
│   │   ├── RadioGroup.tsx
│   │   ├── RadioGroup.stories.tsx
│   │   ├── RadioGroupItem.tsx
│   │   ├── RadioGroupItemRadio.tsx
│   │   ├── RadioGroupItemButton.tsx
│   │   ├── RadioGroupItemBlock.tsx
│   │   ├── RadioGroupSeparator.tsx
│   │   ├── context.ts
│   │   ├── types.ts
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   ├── Resizable/                       # Resizable panels
│   │   ├── Resizable.tsx
│   │   ├── Resizable.stories.tsx
│   │   ├── ResizableHandle.tsx
│   │   ├── ResizablePanel.tsx
│   │   ├── ResizablePanelGroup.tsx
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   ├── ScrollArea/                      # Custom scrollbar
│   │   ├── ScrollArea.tsx
│   │   ├── ScrollArea.stories.tsx
│   │   ├── ScrollAreaViewport.tsx
│   │   ├── ScrollAreaScrollbar.tsx
│   │   ├── ScrollAreaThumb.tsx
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   ├── Search/                          # Search component
│   │   ├── Search.tsx
│   │   ├── Search.stories.tsx
│   │   ├── SearchForm.tsx
│   │   ├── SearchForm.stories.tsx
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   ├── Separator/                       # Visual divider
│   │   ├── Separator.tsx
│   │   ├── Separator.stories.tsx
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   ├── Sheet/                           # Full-screen drawer
│   │   ├── Sheet.tsx
│   │   ├── Sheet.stories.tsx
│   │   ├── SheetContent.tsx
│   │   ├── SheetTrigger.tsx
│   │   ├── SheetHeader.tsx
│   │   ├── SheetFooter.tsx
│   │   ├── SheetTitle.tsx
│   │   ├── SheetDescription.tsx
│   │   ├── SheetClose.tsx
│   │   ├── SheetOverlay.tsx
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   ├── Sidebar/                         # Navigation sidebar
│   │   ├── Sidebar.tsx
│   │   ├── Sidebar.stories.tsx
│   │   ├── SidebarContent.tsx
│   │   ├── SidebarFooter.tsx
│   │   ├── SidebarHeader.tsx
│   │   ├── SidebarTrigger.tsx
│   │   ├── SidebarSeparator.tsx
│   │   ├── SidebarMenu/
│   │   │   ├── SidebarMenu.tsx
│   │   │   ├── SidebarMenuItem.tsx
│   │   │   ├── SidebarMenuButton.tsx
│   │   │   ├── SidebarMenuAction.tsx
│   │   │   ├── SidebarMenuIconWrapper.tsx
│   │   │   ├── SidebarMenuSheetButton.tsx
│   │   │   ├── styles.ts
│   │   │   └── index.ts
│   │   ├── SidebarGroup/
│   │   │   ├── SidebarGroup.tsx
│   │   │   ├── SidebarGroupLabel.tsx
│   │   │   ├── SidebarGroupContent.tsx
│   │   │   ├── SidebarGroupAction.tsx
│   │   │   ├── styles.ts
│   │   │   └── index.ts
│   │   ├── SidebarProvider/
│   │   │   ├── SidebarProvider.tsx
│   │   │   ├── context.ts
│   │   │   ├── useOpenState.ts
│   │   │   ├── useSidebarState.ts
│   │   │   └── index.ts
│   │   ├── constants.ts
│   │   ├── useElement.ts
│   │   ├── useScrollbarPosition.ts
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   ├── Skeleton/                        # Loading placeholders
│   │   ├── Skeleton.tsx
│   │   ├── Skeleton.stories.tsx
│   │   ├── SkeletonList.tsx
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   ├── Switch/                          # Toggle switch
│   │   ├── Switch.tsx
│   │   ├── Switch.stories.tsx
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   ├── Table/                           # Data table
│   │   ├── Table.tsx
│   │   ├── Table.stories.tsx
│   │   ├── TableBody.tsx
│   │   ├── TableCell.tsx
│   │   ├── TableFooter.tsx
│   │   ├── TableHead.tsx
│   │   ├── TableHeader.tsx
│   │   ├── TableRow.tsx
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   ├── Textarea/                        # Multi-line input
│   │   ├── Textarea.tsx
│   │   ├── Textarea.stories.tsx
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   ├── ThemeProvider/                   # Theme context
│   │   ├── ThemeProvider.tsx
│   │   ├── useTheme.ts
│   │   ├── context.ts
│   │   └── index.ts
│   │
│   ├── Timeline/                        # Event timeline
│   │   ├── Timeline.tsx
│   │   ├── Timeline.stories.tsx
│   │   ├── TimelineItem.tsx
│   │   ├── TimelinePoint.tsx
│   │   ├── TimelineTitle.tsx
│   │   ├── TimelineDescription.tsx
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   ├── Toggle/                          # Toggle button
│   │   ├── Toggle.tsx
│   │   ├── Toggle.stories.tsx
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   ├── Tooltip/                         # Hover tooltip
│   │   ├── Tooltip.tsx
│   │   ├── Tooltip.stories.tsx
│   │   ├── TooltipContent.tsx
│   │   ├── TooltipProvider.tsx
│   │   ├── TooltipTrigger.tsx
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   └── Wrapper/                         # Layout wrapper
│       ├── Wrapper.tsx
│       ├── index.ts
│       └── styles.ts
│
├── blocks/                              # Composite components
│   ├── SplitButton/
│   │   ├── SplitButton.tsx
│   │   ├── SplitButton.stories.tsx
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   ├── PromptInput/
│   │   ├── PromptInput.tsx
│   │   ├── PromptInput.stories.tsx
│   │   ├── PromptInputClear.tsx
│   │   ├── styles.ts
│   │   └── index.ts
│   │
│   └── EmptyConfigurationActionCard/
│       ├── EmptyConfigurationActionCard.tsx
│       ├── EmptyConfigurationActionCard.stories.tsx
│       ├── styles.ts
│       └── index.ts
│
├── index.ts                             # Main export file (50+ lines)
├── utils/
│   ├── cn.ts                            # Class name utility
│   ├── copyToClipboard.ts              # Clipboard utility
│   └── index.ts
│
└── constants/
    └── keyCodes.ts                      # Keyboard codes
```

## Component Count Summary

| Category | Count | Examples |
|----------|-------|----------|
| Form Components | 11 | Input, Textarea, Checkbox, FormGroup, etc. |
| Layout Components | 8 | Card, Modal, Sidebar, Sheet, etc. |
| Navigation & Menu | 6 | Button, DropdownMenu, NavigationMenu, Command |
| Data Display | 5 | Table, Timeline, Badge, Avatar, Icon |
| Feedback & Alerts | 13 | Alert, Tooltip, Collapse, ProgressBar, etc. |
| Code & Advanced | 2 | CodeEditor, SqlEditor |
| Utilities & Providers | 6 | ThemeProvider, Toggle, Tabs, Search, etc. |
| Composite Blocks | 3 | SplitButton, PromptInput, EmptyConfigurationActionCard |
| **Total** | **54+** | (Including sub-components) |

## File Statistics

- **Total Directories**: 34 component folders
- **Single-file Components**: 10
- **TypeScript Files**: 150+
- **Story Files**: 40+
- **Test Files**: 5+
- **Style Files**: 40+
- **Utility Files**: 10+

## Key Files

### Main Entry Point
- `/packages/design/src/index.ts` - All exports (50+ lines)

### Configuration
- `tsconfig.json` - TypeScript config
- `tailwind.config.ts` - Tailwind CSS config
- `postcss.config.ts` - PostCSS config

### Documentation
- `/docs/04-components/README.md` - Comprehensive guide
- `/docs/04-components/INDEX.md` - Component reference
- `/docs/04-components/SUMMARY.md` - This summary

## Most Complex Components

1. **Sidebar** (16 files)
   - Provider, Menu, Group, Header, Footer, Trigger
   - Context and hooks management

2. **DropdownMenu** (20+ sub-components)
   - Menu, Trigger, Content, Items
   - Radio groups, checkboxes, nested menus

3. **Modal** (11 files)
   - Header, Body, Footer, Icon, Close, Overlay
   - Complete dialog system

4. **CodeEditor** (8 files)
   - SimpleEditor, DiffEditor, SqlEditor
   - Monaco Editor integration

5. **FormGroup** (11 files)
   - Form field wrapper with validation
   - Input type variants

## Component Dependencies Map

```
Icon ─┬─→ Button
      ├─→ Alert
      ├─→ Tooltip
      └─→ Many others

Modal ─→ ModalContent, ModalHeader, ModalBody, ModalFooter

Sidebar ─→ SidebarProvider (Context)
         ├─→ SidebarMenu
         ├─→ SidebarGroup
         └─→ Navigation structure

FormGroup ─→ Input variants (TextInput, NumberInput, ColorInput)
          ├─→ Textarea
          └─→ Label

ThemeProvider ─→ Required at app root
```

## Export Patterns

### Direct Component Exports
```typescript
export * from './components/Button';
export * from './components/Input';
export * from './components/Modal';
```

### Named Exports
```typescript
export { FormGroup, type ValidityState } from './components/FormGroup';
export { Tooltip, TooltipProvider } from './components/Tooltip';
export { useSidebar, SidebarProvider } from './components/Sidebar';
```

### Type Exports
```typescript
export type { Variant } from './components/Button/types';
export type { Props as AlertProps } from './components/Alert';
```

### Utility Exports
```typescript
export { cn, copyToClipboard } from './utils';
export { Slot } from '@radix-ui/react-slot';
```

## Development Commands

```bash
# Start Storybook for design system
yarn dev --filter=@keboola/design

# Build design package
yarn build --filter=@keboola/design

# Run tests
yarn test --filter=@keboola/design

# Lint
yarn lint --filter=@keboola/design

# Type check
yarn type-check --filter=@keboola/design
```

## Related Paths

- Components: `/packages/design/src/components/`
- Blocks: `/packages/design/src/blocks/`
- Exports: `/packages/design/src/index.ts`
- Documentation: `/docs/04-components/`
- Utilities: `/packages/design/src/utils/`
- Package: `/packages/design/`

---

**Total Lines of Code**: 5000+
**Components**: 43+
**Sub-components**: 100+
**Last Updated**: October 18, 2025
