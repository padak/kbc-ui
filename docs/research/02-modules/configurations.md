# Module: Configurations (Configuration Rows & Docker Actions)

## Overview

The Configurations module provides specialized handling for components that support configuration rows - repeatable configuration units for managing multiple similar operations within a single component instance. This module extends the core components infrastructure with row-level versioning, bulk operations, and docker-specific action handling. It's primarily used by components like database extractors (multiple queries), writers (multiple destinations), and transformers (multiple code blocks).

**Key Characteristics**:
- Configuration row management and versioning
- Bulk row operations (create, update, delete, reorder)
- Docker action execution and monitoring
- JSON and visual configuration editing for rows
- Row-level change tracking and history
- Collapsible section UI for complex configurations
- State management for row operations

**Status**: Core infrastructure - maintained for backward compatibility, new components use configurations module features

## File Structure

```
configurations/
├── ConfigurationsActionCreators.js           # Row state action dispatchers
├── ConfigurationsConstants.js                # Action types for row operations
├── ConfigurationsStore.js                    # Flux store for row editing
├── ConfigurationRowsActionCreators.js        # CRUD actions for rows
├── ConfigurationRowsConstants.js             # Row-specific action types
├── ConfigurationRowsStore.js                 # Flux store for row state
├── DockerActionsActionCreators.js            # Docker execution actions
├── DockerActionsConstants.js                 # Docker-specific action types
├── DockerActionsStore.js                     # Docker execution state store
├── RowVersionsActionCreators.js              # Row version history actions
├── RowVersionsConstants.js                   # Row versioning action types
├── RowVersionsStore.js                       # Row version history store
├── react/
│   ├── components/
│   │   ├── ChangeOrderHandle.jsx             # Drag handle for reordering
│   │   ├── ClearStateButton.jsx              # Clear row state action
│   │   ├── ConfigurationRowName.tsx          # Row name display/editor
│   │   ├── ConfigurationRows.jsx             # Row list container
│   │   ├── ConfigurationRowsTable.jsx        # Row table rendering
│   │   ├── ConfigurationRowsTableCell.jsx    # Individual cell renderer
│   │   ├── ConfigurationRowsTableRow.jsx     # Row element wrapper
│   │   ├── CreateConfigurationRowButton.tsx  # Add new row button
│   │   ├── DeleteConfigurationRowButton.jsx  # Delete row action
│   │   ├── IndexHeaderButton.jsx             # Header button in table
│   │   ├── IndexSections.jsx                 # Section divider
│   │   ├── JsonConfiguration.jsx             # JSON config editor for rows
│   │   ├── JsonConfigurationInput.jsx        # JSON input field
│   │   ├── RemoveSelectedRowsModal.tsx       # Bulk delete confirmation
│   │   ├── RowHeaderButton.jsx               # Row header action
│   │   ├── RunSelectedRowsModal.tsx          # Bulk execution modal
│   │   ├── StorageTableColumnsEditor.jsx     # Table column mapping
│   │   └── SyncActionSimpleValue.jsx         # Sync action value display
│   └── pages/
│       ├── Index.jsx                         # Row list page
│       ├── Row.jsx                           # Row detail page
│       └── Versions.jsx                      # Row version history page
└── utils/
    ├── columnTypeConstants.js                # Column type definitions
    ├── configurationState.js                 # State helpers
    ├── configurationState.test.js            # State helper tests
    ├── createCollapsibleSection.jsx          # Section UI factory
    ├── createColumnsEditorSection.js         # Column editor factory
    ├── createColumnsEditorSection.test.js    # Column editor tests
    ├── createRoute.js                        # Route factory
    ├── createRowVersionOnRollback.js         # Version rollback handler
    ├── helpers.tsx                           # Shared utilities
    ├── isParsableConfiguration.js            # Config validation
    ├── isParsableConfiguration.test.js       # Config validation tests
    ├── renderHelpers.jsx                     # Rendering utilities
    ├── sections.js                           # Section configuration
    └── sections.test.js                      # Section tests
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/components/:component/:config` | Index | Configuration rows list |
| `/components/:component/:config/row/:row` | Row | Single row detail view |
| `/components/:component/:config/row/:row/versions` | Versions | Row version history |

## Key Components & Patterns

### Configuration Rows System

**Purpose**: Support components with repeatable configuration units

**Row Structure**:
```typescript
ConfigurationRow: {
  id: string  // Unique row identifier
  name: string
  description?: string
  created: timestamp
  version: number
  changeDescription?: string
  creator: { description: email }
  configuration: { ... }  // Row-specific configuration
  state?: { ... }  # Component state (filters, execution state)
}
```

### Action Creators (ConfigurationRowsActionCreators.js)

**Purpose**: Flux action dispatch for row operations

**Key Methods**:

1. **Row CRUD Operations**:
```javascript
// Create new row
createSimpleRow(componentId, configId, rowData, changeDescription)

// Update existing row
updateRow(componentId, configId, rowId, rowData, changeDescription)

// Delete single row
deleteRow(componentId, configId, rowId, changeDescription)

// Delete multiple rows (bulk)
deleteSimple(componentId, configId, rowId, changeDescription)
```

2. **Row State Management**:
```javascript
// Clear row state (filters, execution state)
clearRowState(componentId, configId, rowId)

// Update row state
updateRowState(componentId, configId, rowId, stateData)
```

3. **Row Cloning**:
```javascript
// Clone from version (similar to config copy)
createRowVersion(componentId, configId, rowId, version, name)
```

4. **Bulk Operations**:
```javascript
// Run multiple rows
runMultiple(rows)

// Delete selected rows with confirmation
deleteSelected(componentId, configId, selectedRowIds)
```

**Implementation Pattern**:
```javascript
export const createSimpleRow = (componentId, configId, data, changeDescription) => {
  return ensureComponentWithDetails(componentId)
    .then((component) => injectDefaultsFromConfigurationSchema(data, component.get('configurationRowSchema')))
    .then((data) => {
      const dataToSavePrepared = JSON.stringify(
        preferEncryptedAttributes(
          prepareDataForSaveInDevBranch(componentId, data)
        )
      )
      return InstalledComponentsApi.encryptConfiguration(componentId, dataToSavePrepared)
    })
    .then((result) => {
      const dataToSaveEncrypted = {
        configuration: JSON.stringify(result),
        changeDescription: changeDescription
      }
      return InstalledComponentsApi.createConfigurationRow(
        componentId,
        configId,
        dataToSaveEncrypted,
        changeDescription
      )
    })
}
```

### Configuration Store (ConfigurationsStore.js)

**Purpose**: Flux store managing row editing states

**Key Methods**:

1. **Configuration Access**:
```javascript
get(componentId, configId)
// Returns full configuration object including rows

getConfiguration(componentId, configId)
// Returns configuration.configuration property

getPendingActions(componentId, configId)
// Returns actions currently in progress
```

2. **JSON Editor State**:
```javascript
getEditingJsonConfigurationString(componentId, configId)
// Returns current JSON text (from edit state or stored config)

getEditingJsonConfiguration(componentId, configId)
// Returns parsed JSON object

isEditingJsonConfiguration(componentId, configId)
// Checks if JSON editor is open

isEditingJsonConfigurationValid(componentId, configId)
// Validates JSON syntax
```

3. **Visual Editor State**:
```javascript
getEditingConfiguration(componentId, configId, parseFn)
// Returns editing state for form fields with parse function

hasJsonEditor(componentId, configId, parseFn, createFn, conformFn)
// Force-opens JSON editor if config can't be parsed back to original state
```

### Configurations Store (ConfigurationRowsStore.js)

**Purpose**: Flux store tracking individual row state

**Key Methods**:

1. **Row Retrieval**:
```javascript
getRows(componentId, configId)
// Map<rowId, RowData>

getRow(componentId, configId, rowId)
// Immutable Map of single row

getSelectedRows(componentId, configId)
// Array of selected row IDs
```

2. **Row Selection**:
```javascript
getSelectedRows(componentId, configId)
updateSelectedRows(componentId, configId, rowIds)
toggleRowSelection(componentId, configId, rowId)
```

3. **Row Ordering**:
```javascript
// Order maintained in rows map via Immutable.js ordering
// Reorder via action dispatch and state mutation
```

### UI Components

#### CreateConfigurationRowButton.tsx

**Purpose**: Button and workflow for adding new configuration rows

**Props**:
```typescript
type Props = {
  component: Map<string, any>
  configId: string
  onRowCreated: (rowId: string) => void
  tables?: Map<string, any>
  buckets?: Map<string, any>
  configData?: Map<string, any>
  emptyConfig?: (tableId: string | null, name: string) => Map<string, any>
  objectName?: string  // e.g., 'Query', 'Row', 'Output'
}
```

**Key Features**:
- Modal for entering row name and configuration
- Optional table selector for writers with simple table input
- Automatic configuration generation from template
- Success callback with row ID

**Implementation**:
```typescript
const handleCreate: OnCreate = (tableId, name, options) => {
  let configData = options?.forceData ?? emptyConfig?.(tableId, webalize(tableId ?? '')) ?? Map()
  
  // Handle writers with simple table input
  if (hasWriterSimpleTableInput(component)) {
    configData = configData.setIn(
      ['storage', 'input', 'tables'],
      fromJS([{ source: tableId, destination: `${tableId}.csv` }])
    )
  }
  
  return createSimpleRow(
    component.get('id'),
    configId,
    {
      name,
      description: options?.description ?? '',
      configuration: JSON.stringify(configData.toJS())
    },
    `${objectName} ${name} added`
  )
}
```

#### RemoveSelectedRowsModal.tsx

**Purpose**: Confirmation dialog for bulk row deletion

**Props**:
```typescript
type Props = {
  show: boolean
  onHide: () => void
  onDone: () => void
  componentId: string
  configId: string
  selected: string[]
  rows: Map<string, any>
}
```

**Key Features**:
- Shows count of rows to delete
- Executes deletion sequentially
- Individual change descriptions per row
- Loading state during deletion
- Auto-closes on success

**Implementation**:
```typescript
onConfirm={() => {
  setIsProcessing(true)
  return Promise.each(props.selected, (rowId) => {
    return ConfigurationRowsActionCreators.deleteSimple(
      props.componentId,
      props.configId,
      rowId,
      `Row ${props.rows.getIn([rowId, 'name'], rowId)} deleted`
    )
  })
    .tap(props.onDone)
    .finally(() => setIsProcessing(false))
}}
```

#### RunSelectedRowsModal.tsx

**Purpose**: Modal for bulk execution of multiple rows

**Features**:
- Select subset of rows to execute
- Execution options (backend size, etc.)
- Progress tracking
- Result aggregation

#### ConfigurationRowName.tsx

**Purpose**: Inline editor for row names

**Pattern**:
```typescript
type Props = {
  rowId: string
  rowName: string
  onSave: (newName: string) => Promise<void>
}
```

### Configuration State Helpers (utils/configurationState.js)

**Purpose**: Utilities for row state management

**Key Functions**:

1. **State Initialization**:
```javascript
emptyComponentState()
// Creates default state object for component type

// Each component type has specific state shape
// e.g., extractor: { filters: {...}, offset: 0 }
//       transformation: { backend: 'small', parallelism: 1 }
```

2. **State Removal**:
```javascript
removeTableFromInputTableState(state, tableId)
// Removes table reference from filters/mappings when table deleted
```

### JSON Configuration Helpers (utils/)

**Purpose**: JSON schema and configuration utilities

**Key Functions**:

1. **Parsability Check**:
```javascript
isParsableConfiguration(conformedConfig, parseFn, createFn)
// Verifies that config can be parsed back to original form
// Used to determine if JSON editor should be force-opened

// If config.toJS() != createFn(parseFn(config))
// then force JSON editor mode
```

2. **Visual Editor Conformance**:
```javascript
// Utility to transform config to form acceptable to visual editor
// E.g., flattening nested arrays, normalizing field names
conformConfiguration(config)
```

### Route Factory (utils/createRoute.js)

**Purpose**: Dynamic route generation for row-based components

**Pattern**:
```javascript
createRoute({
  componentType: 'database-extractor',
  rowName: 'query',
  sections: [
    { id: 'credentials', label: 'Credentials' },
    { id: 'query', label: 'SQL Query' },
    { id: 'output', label: 'Output' }
  ]
})

// Generates routes like:
// /components/keboola.db-generic-mysql/config-123/row/query-1
// /components/keboola.db-generic-mysql/config-123/row/query-1/credentials
```

### Docker Actions (DockerActionsActionCreators.js)

**Purpose**: Manage component execution and status tracking

**Key Methods**:

```javascript
run(componentId, configId, rowId)
// Execute specific row

runMultiple(configIds)
// Execute multiple configurations/rows

getStatus(componentId, configId, rowId)
// Check execution status

cancel(jobId)
// Cancel ongoing execution
```

### Sections & Layout (utils/sections.js)

**Purpose**: Define configuration sections for visual editor

**Pattern**:
```javascript
createCollapsibleSection({
  id: 'authorization',
  title: 'Authorization',
  description: 'OAuth credentials',
  expanded: false,
  render: (config) => {
    // Returns JSX for this section
  }
})

createColumnsEditorSection({
  id: 'columns',
  title: 'Output Columns',
  description: 'Define column mappings',
  configPath: ['parameters', 'columns'],
  columnTypes: COLUMN_TYPES
})
```

## Configuration Row Versioning

**Purpose**: Track changes to individual rows over time

**API Operations**:
```javascript
getComponentConfigRowVersions(componentId, configId, rowId)
// Get version history for specific row

getComponentConfigRowByVersion(componentId, configId, rowId, versionId)
// Retrieve row configuration at specific version

rollbackRowVersion(componentId, configId, rowId, version)
// Restore row to previous version

createConfigRowCopy(componentId, configId, rowId, version)
// Clone row from specific version
```

**Version Storage**:
- Each row version stored independently
- Change descriptions track mutations
- Creator tokens identify authors
- Timestamps mark creation

## Row Selection & Bulk Operations

**Selection State**:
```javascript
state.selectedRows = {
  [componentId]: {
    [configId]: ['row-1', 'row-2', ...]
  }
}
```

**Bulk Operations**:
1. **Bulk Delete**:
   - User selects rows
   - Opens RemoveSelectedRowsModal
   - Iterates through selected IDs
   - Updates selection on completion

2. **Bulk Execute**:
   - User selects rows to run
   - Opens RunSelectedRowsModal
   - Executes via docker actions
   - Tracks results per row

3. **Bulk Reorder**:
   - Drag-and-drop via ChangeOrderHandle
   - Updates row ordering
   - Persists ordering in store

## Data Types & Interfaces

### Row Versioning Structure

```typescript
RowVersion: {
  version: number
  created: timestamp
  creatorToken: { description: email }
  changeDescription: string
  configurationVersion: number
  configuration: { ... }  // Full row config at this version
}
```

### Row State Structure

```typescript
RowState: {
  filters?: { ... }  // Component-specific filters
  isExecuting?: boolean
  lastRunResult?: { ... }
  executionParams?: { backend: string, parallelism: number }
  cursor?: string  // Pagination cursor for incremental loads
}
```

## Common Patterns

### 1. Create Row Pattern

```typescript
// 1. Open modal with row template
const [showCreateModal, setShowCreateModal] = useState(false)

// 2. Get row template
const emptyRow = component.get('emptyConfigurationRow', Map())

// 3. Collect user input (name, configuration)
const onCreate = (name, config) => {
  return createSimpleRow(
    component.get('id'),
    configId,
    {
      name,
      description: '',
      configuration: JSON.stringify(config.toJS())
    },
    `Row ${name} created`
  ).then((newRow) => {
    onRowCreated(newRow.id)
  })
}
```

### 2. Delete Rows Pattern

```typescript
// 1. Collect selected row IDs
const selectedRows = ConfigurationRowsStore.getSelectedRows(componentId, configId)

// 2. Show confirmation modal
<RemoveSelectedRowsModal
  show={showDelete}
  selected={selectedRows}
  rows={rows}
  onConfirm={() => {
    return Promise.each(selectedRows, (rowId) => {
      return ConfigurationRowsActionCreators.deleteSimple(
        componentId,
        configId,
        rowId,
        `Row deleted`
      )
    })
  }}
/>

// 3. Clear selection on completion
ConfigurationRowsActionCreators.updateSelectedRows(componentId, configId, [])
```

### 3. Update Row Pattern

```typescript
// 1. Load row data
const row = ConfigurationRowsStore.getRow(componentId, configId, rowId)
const config = JSON.parse(row.get('configuration'))

// 2. Update configuration
const updated = config.setIn(['parameters', 'key'], newValue)

// 3. Save row
return ConfigurationRowsActionCreators.updateRow(
  componentId,
  configId,
  rowId,
  {
    name: row.get('name'),
    description: row.get('description'),
    configuration: JSON.stringify(updated.toJS())
  },
  'Updated parameter'
)
```

### 4. Rollback Row Version Pattern

```typescript
// 1. Load row version history
RowVersionsActionCreators.loadRowVersions(componentId, configId, rowId)

// 2. Select version
const versionToRestore = versions.get(0)

// 3. Execute rollback
RowVersionsActionCreators.rollbackRowVersion(
  componentId,
  configId,
  rowId,
  versionToRestore.get('version')
).then(() => {
  // Create new version tracking rollback
  createRowVersionOnRollback(
    componentId,
    configId,
    rowId,
    versionToRestore
  )
})
```

## State Management Architecture

**Flux Stores**:
1. **ConfigurationRowsStore**: Row data and selection
2. **ConfigurationsStore**: Configuration editing state
3. **RowVersionsStore**: Row version history
4. **DockerActionsStore**: Execution status

**Action Flow**:
```
Component
  ↓
ConfigurationRowsActionCreators (update selected, create, delete)
  ↓
InstalledComponentsApi (row CRUD operations)
  ↓
Dispatcher
  ↓
ConfigurationRowsStore (update state)
  ↓
Component (re-render on change)
```

## Security Considerations

**Configuration Encryption**:
- Row configurations encrypted same as parent config
- Sensitive fields marked with `#` prefix
- Encrypted before storage via encryptConfiguration()
- Automatically decrypted on load

**State Management**:
- Row selection state is client-side only
- Bulk operations generate individual change descriptions
- Each mutation tracked with creator token

## Performance Optimization

**Caching**:
- Row lists cached in store
- Versions loaded on-demand
- Selection state maintained in memory

**Lazy Loading**:
- Row details loaded when viewing row detail page
- Version history loaded only when versions tab accessed
- State loaded with initial row load

## Testing

**Key Test Files**:
- `configurationState.test.js`: State initialization and manipulation
- `isParsableConfiguration.test.js`: Config validation logic
- `sections.test.js`: Section configuration generation

**Test Patterns**:
- Mock stores and action creators
- Immutable.js data structures
- API call mocking
- State mutation verification

## Troubleshooting

**Common Issues**:

1. **Row creation fails**:
   - Check component has `configurationRowSchema`
   - Verify configuration JSON is valid
   - Check encryption endpoint is accessible

2. **Bulk operations slow**:
   - Sequential deletion by design (API limitation)
   - Large selections may take time
   - Consider splitting into smaller batches

3. **Row state not persisting**:
   - State stored in component state property
   - May be cleared by refresh
   - Call saveComponentConfigData() to persist

4. **Visual editor won't open**:
   - Check isParsableConfiguration() result
   - Verify JSON schema validity
   - Force JSON editor mode if needed

## Related Modules

- **components**: Core component infrastructure
- **configurations**: Row state management
- **storage**: Table and bucket references
- **flows-v2**: Flow tasks use row-based configuration

## Future Directions

- Improved drag-and-drop for row reordering
- Real-time row execution progress
- Collaborative row editing
- Row templating and duplication UI
- Advanced row filtering and search
