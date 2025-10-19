# Code Editor Components

## Overview

The design system provides a comprehensive suite of code editor components built on **CodeMirror 6** through the UIW wrapper (`@uiw/react-codemirror`). These components support multiple programming languages with syntax highlighting, autocompletion, and theme customization.

**Location**: `packages/design/src/components/CodeEditor/`

**Exported Components**:
- `CodeEditor` - Main general-purpose editor with diff view support
- `SqlEditor` - Specialized SQL editor with Snowflake/PL-SQL support

**Internal Components**:
- `SimpleEditor` - Basic editor wrapper for non-diff views
- `DiffEditor` - Side-by-side diff viewer for content comparison

---

## 1. CodeEditor Component

### Location
`packages/design/src/components/CodeEditor/CodeEditor.tsx`

### Purpose
General-purpose code editor with support for multiple languages and optional diff view display.

### Props Interface

```typescript
type Props = {
  // Core content
  value: string;
  onChange: (value: string) => void;
  
  // Language & display
  mode?: LANGUAGE_MODE;                    // Default: 'application/json'
  placeholder?: string;                    // Default: ''
  showDiff?: boolean;                      // Default: false
  previousValue?: string;                  // Default: '' (shown in diff view)
  
  // Editing features
  readOnly?: boolean;                      // Default: false
  autocompletions?: string[];              // Default: []
  withAutocomplete?: boolean;               // Default: false
  completeAny?: boolean;                    // Default: false (activates on typing)
  withToggleCommentHint?: boolean;          // Default: false
  
  // Behavior
  withAutofocus?: boolean;                  // Default: false
  extraKeys?: Record<string, () => void>;   // Custom keyboard shortcuts
  
  // UI customization
  help?: ReactNode;                         // Help text below editor
  helpPostfix?: ReactNode;                  // Additional help content
  renderAdditionalButtons?: (value?: string) => ReactNode;  // Custom button bar
  className?: string;                      // Additional CSS classes
};
```

### Supported Languages (LANGUAGE_MODE)

```typescript
type LANGUAGE_MODE =
  | 'application/json'       // JSON (default)
  | 'text/x-python'          // Python
  | 'text/x-sql'             // Standard SQL
  | 'text/x-sfsql'           // Snowflake SQL
  | 'text/x-plsql'           // PL/SQL (Oracle dialect)
  | 'text/x-rsrc'            // R
  | 'text/x-julia';          // Julia
```

### Features

| Feature | Details |
|---------|---------|
| **Syntax Highlighting** | Language-aware highlighting for all supported modes |
| **Linting** | JSON parsing linter for `application/json` mode |
| **Autocompletion** | Optional with custom suggestions or generic word completion |
| **Line Wrapping** | Enabled by default |
| **Diff View** | Side-by-side comparison with `showDiff={true}` |
| **Read-Only Mode** | Disabled editing with visual feedback |
| **Custom Keybindings** | Support via `extraKeys` prop |
| **Help Text** | Toggleable hints for autocomplete and comments |
| **Copy Button** | Toolbar with clipboard copy functionality |

### CodeMirror Extensions Used

```typescript
// Language mode (selected based on 'mode' prop)
getLanguageMode(mode)

// Line wrapping
EditorView.lineWrapping

// JSON linting
linter(jsonParseLinter()) // Only for JSON mode

// Autocompletion
autocompletion({ activateOnTyping: completeAny })
EditorState.languageData.of(...)

// Custom keybindings
keymap.of([...])

// Theme
EditorView.theme(getBaseThemeStyles(showDiff))
```

### Configuration Options

#### Autocompletion Setup
```typescript
// Option 1: Custom word suggestions
<CodeEditor
  withAutocomplete={true}
  autocompletions={['SELECT', 'FROM', 'WHERE']}
/>

// Option 2: Generic word completion
<CodeEditor
  withAutocomplete={true}
  completeAny={true}
/>
```

#### Custom Keyboard Shortcuts
```typescript
<CodeEditor
  extraKeys={{
    'Ctrl-Enter': () => console.log('Execute'),
    'Ctrl-/': () => console.log('Comment'),
  }}
/>
```

#### Diff View
```typescript
<CodeEditor
  value={newCode}
  previousValue={oldCode}
  showDiff={true}
/>
```

### Usage Example

```typescript
import { CodeEditor } from '@keboola/design';

export const MyCodeEditor = () => {
  const [code, setCode] = useState('{"key": "value"}');

  return (
    <CodeEditor
      value={code}
      onChange={setCode}
      mode="application/json"
      placeholder="Enter JSON..."
      withAutocomplete={true}
      help="Tip: Use Ctrl+Space for autocomplete"
    />
  );
};
```

---

## 2. SqlEditor Component

### Location
`packages/design/src/components/CodeEditor/SqlEditor.tsx`

### Purpose
Specialized SQL editor with Snowflake and PL-SQL support, including intelligent autocomplete for database schemas.

### Props Interface

```typescript
type Props = {
  // Core content
  value: string;
  onChange?: (value: string) => void;
  
  // Database schema
  schema?: SQLNamespace;        // Database/schema structure for autocompletion
  defaultDatabase?: string;     // Pre-selected database name
  defaultSchema?: string;       // Pre-selected schema name
  
  // Editor behavior
  readOnly?: boolean;           // Default: false
  autoFocus?: boolean;          // Default: false
  placeholder?: string;         // Default: ''
  
  // Display
  lineNumbers?: boolean;        // Default: true
  className?: string;           // Additional CSS classes
  
  // Event handlers
  onChange?: (value: string) => void;
  onSelectionChange?: (text: string) => void;  // Called when selection changes
  onCreateEditor?: (view: EditorView, state: EditorState) => void;  // Called after editor creation
  onDestroyEditor?: () => void; // Cleanup on component unmount
  onBlurEditor?: (view: EditorView) => void;   // Called on blur
  
  // Custom keybindings
  extraKeys?: KeyBinding[];     // Additional keyboard shortcuts
};
```

### SQL Schema Structure (SQLNamespace)

```typescript
type SQLNamespace = {
  [databaseName: string]: {
    [schemaName: string]: {
      [tableName: string]: string[];  // Array of column names
    }
  }
};

// Example:
const schema: SQLNamespace = {
  'MY_DATABASE': {
    'PUBLIC': {
      'CUSTOMERS': ['id', 'name', 'email'],
      'ORDERS': ['order_id', 'customer_id', 'amount'],
    }
  }
};
```

### Features

| Feature | Details |
|---------|---------|
| **SQL Variants** | Snowflake (via custom dialect) + standard SQL + PL-SQL |
| **Schema Autocomplete** | Intelligent suggestions for databases, schemas, tables, columns |
| **Uppercase Keywords** | SQL keywords automatically uppercased |
| **Line Wrapping** | Enabled by default |
| **Line Numbers** | Toggleable via prop |
| **Selection Tracking** | Event handler for selection changes |
| **Read-Only Mode** | Disabled editing with visual feedback |
| **Custom Keybindings** | Support via `extraKeys` prop |
| **Focused Theme** | Custom styling with border/shadow on focus |

### CodeMirror Integration

```typescript
// Language support
@codemirror/lang-sql with extensions:
- installExtensions() - Snowflake-specific setup
- autocompleteStyles - Snowflake custom autocomplete styling

// Extensions used
EditorView.lineWrapping
keymap.of([...defaultKeymap, ...extraKeys])
EditorView.theme(theme)
EditorView.domEventHandlers({ blur: ... })

// Default setup
{
  drawSelection: false,
  defaultKeymap: false,
  completionKeymap: false,
  lineNumbers: true (configurable)
}
```

### Supported SQL Dialects

| Dialect | Mode | Details |
|---------|------|---------|
| **Snowflake** | Configured via Keboola custom package | Full autocomplete support |
| **Standard SQL** | `@codemirror/lang-sql` | Generic SQL support |
| **PL-SQL** | `@codemirror/lang-sql` with `dialect: PLSQL` | Oracle PL-SQL support |

### Usage Example

```typescript
import { SqlEditor } from '@keboola/design';
import type { SQLNamespace } from '@codemirror/lang-sql';

export const MyDatabaseQueryEditor = () => {
  const [query, setQuery] = useState('SELECT * FROM customers');
  const [selectedText, setSelectedText] = useState('');

  const schema: SQLNamespace = {
    'production': {
      'public': {
        'customers': ['id', 'name', 'email'],
        'orders': ['id', 'customer_id', 'total'],
      }
    }
  };

  return (
    <SqlEditor
      value={query}
      onChange={setQuery}
      onSelectionChange={setSelectedText}
      schema={schema}
      defaultDatabase="production"
      defaultSchema="public"
      placeholder="Enter SQL query..."
      className="tw-min-h-52"
    />
  );
};
```

### Storybook Story Example

```typescript
const schema: SQLNamespace = {
  'MY_DATABASE': {
    'MY_SCHEMA': {
      'table1': ['col1', 'col2'],
      'table2': ['colA', 'colB'],
    },
  },
};

<SqlEditor
  value="SELECT * FROM table1"
  schema={schema}
  defaultDatabase="MY_DATABASE"
  defaultSchema="MY_SCHEMA"
  placeholder="Enter your SQL query here..."
/>
```

---

## 3. SimpleEditor Component

### Location
`packages/design/src/components/CodeEditor/SimpleEditor.tsx`

### Purpose
Internal component providing basic CodeMirror integration for non-diff editor views.

### Props Interface

```typescript
type Props = {
  value: string;
  onChange: (value: string) => void;
  commonExtensions: Extension[];    // Shared extensions from CodeEditor
  placeholder: string;
  autoFocus: boolean;
  readOnly: boolean;
};
```

### Features

- Memoized for performance optimization
- Supports placeholder text
- Respects read-only state
- Uses shared extension setup from parent `CodeEditor`

### Internal Use Only

This component is not exported and is used internally by `CodeEditor` for standard (non-diff) editing views.

---

## 4. DiffEditor Component

### Location
`packages/design/src/components/CodeEditor/DiffEditor.tsx`

### Purpose
Side-by-side diff viewer showing changes between original and modified content.

### Props Interface

```typescript
type Props = {
  value: string;                    // Modified content
  onChange: (value: string) => void;
  commonExtensions: Extension[];    // Shared extensions
  previousValue: string;            // Original content
  placeholder: string;
  readOnly: boolean;
};
```

### Features

| Feature | Details |
|---------|---------|
| **Side-by-Side View** | Original (left) vs Modified (right) |
| **Change Highlighting** | Visual indicators for changed lines |
| **Debounced Updates** | 200ms debounce on edit to reduce re-renders |
| **Read-Only Original** | Left pane always non-editable |
| **Selection Matching** | Highlights matching selections across panes |
| **Theme Consistency** | Unified theme across both editors |

### Change Highlighting Colors

```typescript
// From helpers.ts
Original (left):   backgroundColor: error[100]   // Light red
Modified (right):  backgroundColor: primary[100] // Light blue
Original gutter:   backgroundColor: error[200]
Modified gutter:   backgroundColor: primary[200]
```

### Internal Use Only

This component is managed by `CodeEditor` when `showDiff={true}`.

---

## 5. Theme & Styling

### Location
`packages/design/src/components/CodeEditor/helpers.ts`

### Base Theme Configuration

```typescript
const customTheme = githubLightInit({
  settings: {
    fontFamily: `'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New'`,
    background: colors.neutral[50],
    gutterBackground: colors.neutral[100],
    gutterBorder: 'transparent',
    lineHighlight: 'transparent',
    selection: colors.secondary[500],
  },
});
```

### Base Theme Styles

```typescript
getBaseThemeStyles(showDiff?: boolean) returns:
  - Line height: 20px
  - Selection color: secondary[500]
  - Read-only background: neutral[150]
  - Read-only gutter: neutral[200]
  - Overflow anchor: none (for stability)
  - No fold gutter display
  - Line numbers padding: 20px left, 6px right
  - String token color: warning[700]
  - Diff view colors (when showDiff=true)
```

### SqlEditor Theme Overrides

```typescript
theme = {
  ...getBaseThemeStyles(),
  '&.cm-editor': {
    border: 'solid 1px transparent',
    background: white,
    borderRadius: '8px',
    paddingTop: '8px',
    paddingBottom: '8px',
  },
  '&.cm-editor:focus-within': {
    borderColor: secondary[500],
    boxShadow: `0 0 0 4px ${secondary[200]}`,
  },
  ...autocompleteStyles,
};
```

### CSS Classes

The wrapper div applies Tailwind classes for layout control:

```typescript
// CodeEditor wrapper classes
'tw-relative tw-flex tw-min-h-0 tw-flex-col'
'[&_.cm-mergeViewEditor]:tw-overflow-visible'
'[&_.cm-mergeViewEditors]:tw-h-full'
'[&_>div]:tw-h-full [&_>div]:tw-overflow-auto'
'[&_>div]:tw-bg-neutral-50'
```

---

## 6. Supporting Components

### ButtonToolbar
Located: `packages/design/src/components/CodeEditor/ButtonToolbar.tsx`

Renders action buttons in the editor's top-right corner, including:
- **Clipboard Copy Button**: Inline copy functionality
- **Custom Buttons**: Via `renderAdditionalButtons` prop

```typescript
<ButtonToolbar value={value}>
  {renderAdditionalButtons?.(value)}
</ButtonToolbar>
```

### AutocompleteHelp
Located: `packages/design/src/components/CodeEditor/AutocompleteHelp.tsx`

Displays hint text about autocomplete functionality (e.g., "Press Ctrl+Space for suggestions").

### ToggleComponentHelp
Located: `packages/design/src/components/CodeEditor/ToggleComponentHelp.tsx`

Displays hint text about comment toggling functionality.

---

## 7. CodeMirror Dependencies

### Core Packages

| Package | Version | Purpose |
|---------|---------|---------|
| `@uiw/react-codemirror` | ^4.25.2 | React wrapper for CodeMirror 6 |
| `@uiw/codemirror-theme-github` | ^4.25.2 | GitHub Light theme |
| `react-codemirror-merge` | ^4.25.2 | Diff view support |
| `debounce` | ^2.2.0 | Debounce updates in diff editor |

### Language Support Packages

| Package | Version | Languages |
|---------|---------|-----------|
| `@codemirror/lang-json` | ^6.0.2 | JSON |
| `@codemirror/lang-python` | ^6.2.1 | Python |
| `@codemirror/lang-sql` | ^6.10.0 | SQL, PL-SQL |
| `@codemirror/legacy-modes` | ^6.5.2 | Julia, R (legacy) |

### Keboola Custom Packages

| Package | Purpose |
|---------|---------|
| `@keboola/codemirror-lang-snowflake` | Snowflake SQL language support |
| `@keboola/codemirror-sfsql` | Snowflake SQL legacy mode |

### Feature Packages

| Package | Version | Purpose |
|---------|---------|---------|
| `@codemirror/autocomplete` | ^6.19.0 | Autocompletion |
| `@codemirror/commands` | ^6.9.0 | Default keyboard commands |
| `@codemirror/lint` | ^6.9.0 | Linting support |
| `@codemirror/search` | ^6.5.11 | Search/highlight functionality |
| `@codemirror/view` | ^6.38.4 | View configuration |
| `@codemirror/language` | ^6.11.3 | Language support framework |

---

## 8. Configuration & Setup

### BASIS_SETUP Constants

```typescript
// Used by all editors
export const BASIS_SETUP = { 
  drawSelection: false 
};

// SqlEditor specific
{
  drawSelection: false,
  defaultKeymap: false,
  completionKeymap: false,
  lineNumbers: true // configurable
}
```

### Extension Pipeline

Every editor constructs extensions in this order:

1. **Language Mode** - Selected based on `mode` or dialect prop
2. **Linting** - If applicable (JSON only)
3. **Line Wrapping** - Always enabled
4. **Language Data** - For autocompletion suggestions
5. **Keybindings** - Custom + defaults
6. **Autocompletion** - If enabled
7. **Theme** - Unified custom theme

---

## 9. Common Patterns & Examples

### Basic JSON Editor
```typescript
<CodeEditor
  value={jsonCode}
  onChange={setJsonCode}
  mode="application/json"
/>
```

### Python Editor with Autocomplete
```typescript
<CodeEditor
  value={pythonCode}
  onChange={setPythonCode}
  mode="text/x-python"
  withAutocomplete={true}
  completeAny={true}
/>
```

### Read-Only SQL Viewer
```typescript
<CodeEditor
  value={sqlCode}
  onChange={() => {}}
  mode="text/x-sql"
  readOnly={true}
/>
```

### Diff Viewer
```typescript
<CodeEditor
  value={newValue}
  previousValue={oldValue}
  onChange={setNewValue}
  showDiff={true}
  help="Red = removed, Blue = added"
/>
```

### Custom Keyboard Shortcuts
```typescript
<CodeEditor
  value={code}
  onChange={setCode}
  extraKeys={{
    'Ctrl-Enter': () => handleExecute(),
    'Ctrl-S': () => handleSave(),
  }}
/>
```

---

## 10. Event Handling

### CodeEditor Events
- `onChange(value)` - Content changed
- `renderAdditionalButtons(value)` - Render custom buttons per editor state

### SqlEditor Events
- `onChange(value)` - Content changed
- `onSelectionChange(text)` - User selection changed
- `onCreateEditor(view, state)` - Editor instance created
- `onDestroyEditor()` - Editor instance destroyed
- `onBlurEditor(view)` - Editor loses focus

---

## 11. Accessibility Considerations

### Keyboard Navigation
- Tab navigation through controls
- Escape key handled to prevent propagation in parent modals
- Custom keybindings via `extraKeys`

### Screen Readers
- Line numbers announced
- Syntax highlighting provides visual structure
- Help text provides context via HelpBlock component

### Read-Only State
- Visual feedback (neutral background)
- Keyboard shortcuts disabled
- Content selectable but not editable

---

## 12. Performance Optimizations

### Memoization
- `SimpleEditor` and `DiffEditor` use React.memo
- Extensions memoized with useMemo
- Prevents unnecessary re-renders

### Debouncing
- DiffEditor debounces onChange by 200ms
- Reduces update frequency during rapid editing

### Overflow Anchor Control
- Sets `overflowAnchor: none` to prevent layout shift
- Improves scrolling stability during edits

---

## 13. Known Limitations & Considerations

| Limitation | Details | Workaround |
|------------|---------|-----------|
| **JSON Linting Only** | Only `application/json` mode has linting | Other languages require external linters |
| **No Multiple Cursors** | CodeMirror configured without multi-cursor | Intentional design choice |
| **Selection Draw Disabled** | Draw selection feature turned off globally | Lighter rendering footprint |
| **Custom Language Parsing** | Legacy modes (R, Julia) use legacy parser | Limited feature support |
| **Snowflake Dialect** | Requires custom Keboola package | Standard SQL as fallback |

---

## 14. Future Enhancement Opportunities

- [ ] Additional language support (JavaScript, TypeScript, XML, YAML)
- [ ] Theme customization (dark mode, color schemes)
- [ ] Advanced autocomplete with API integration
- [ ] Bracket matching and code folding
- [ ] Format on save / prettier integration
- [ ] Error diagnostics beyond JSON linting
- [ ] Collaborative editing support
- [ ] Code snippet library

---

## Related Documentation

- **Design System**: `packages/design/README.md`
- **Button Toolbar**: ButtonToolbar component inline docs
- **Theme System**: Tailwind config at `packages/tailwind-config/`
- **CodeMirror 6 Docs**: https://codemirror.net/docs/
- **UIW CodeMirror Wrapper**: https://github.com/uiwjs/react-codemirror

