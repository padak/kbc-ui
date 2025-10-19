# Module: wr-google-sheets (Google Sheets Writer)

## Overview

The wr-google-sheets module enables data export from Keboola Storage into Google Sheets. It provides Google OAuth authentication, spreadsheet creation and management, sheet selection, and direct data writing. Users can write data to new or existing spreadsheets with configurable append/replace modes, and the module handles the complete lifecycle of spreadsheet management through the Keboola API.

## File Structure

```
wr-google-sheets/
├── routes.js                              # Route configuration
├── actionsProvisioning.js                 # Local state and actions management
├── storeProvisioning.js                   # Store definition with immutable.js
└── react/
    ├── pages/
    │   └── Index/
    │       └── Index.jsx                  # Main configuration page
    ├── components/
    │   ├── SheetsList.jsx                 # List of configured sheets
    │   ├── SheetModal.jsx                 # Modal dialog for sheet editing
    │   ├── SpreadsheetTab.jsx             # Spreadsheet selection/management
    │   ├── SheetTab.jsx                   # Sheet selection within spreadsheet
    │   ├── InputTab.jsx                   # Input table mapping
    │   ├── InputMapping.jsx               # Input mapping section
    │   └── WizardButtons.jsx              # Modal action buttons
```

## Routes & Configuration

### Route Structure

Uses `createRoute()` utility for single-level configuration:

```typescript
{
  name: 'keboola.wr-google-sheets',
  path: 'keboola.wr-google-sheets/:config',
  title: 'Google Sheets',
  lazy: async () => {
    // Dynamically imports Index component
    const Index = await import('./react/pages/Index/Index');
    return { Component: Index.default(COMPONENT_ID) };
  },
  requireData: [configRequiredData],      // Preloads configuration
  poll: configPoll                         // Periodic polling for updates
}
```

## Key Components

### Index.jsx (Main Component)
- **Purpose**: Orchestrates the entire Google Sheets configuration interface
- **Props**: None (component is created with COMPONENT_ID)
- **State Management**: 
  - Uses `storeMixins` from both InstalledComponentsStore and OauthStore
  - Uses `createStoreMixin` for reactive state updates
  - Manages local state through actions provisioning
- **Features**:
  - Displays list of configured sheets with enable/disable toggles
  - Search functionality for input tables
  - Add/edit/delete sheet configurations
  - OAuth authorization status checking
- **Key Methods**:
  - `renderTables()`: Renders SheetsList component
  - `renderTableModal()`: Renders SheetModal when editing
  - `handleSearchQueryChange()`: Updates search query in local state
  - `showTableModal()`: Opens modal for new/existing sheet
  - `invalidToRun()`: Checks if configuration is ready for execution

### SheetsList.jsx
- **Purpose**: Renders a table of configured sheets with actions
- **Props**:
  - `items`: Immutable List of sheet configurations
  - `inputTables`: Available storage tables for mapping
  - `buckets`: Available buckets for table organization
  - `readOnly`: Boolean for read-only mode
  - `onEditFn`: Callback to open sheet editor
  - `onDeleteFn`: Callback to delete sheet
  - `toggleEnabledFn`: Callback to toggle sheet enabled state
- **Configuration Structure** (each sheet object):
  ```typescript
  {
    id: string;                    // Unique identifier
    tableId: string;               // Source storage table ID
    fileId: string;                // Google Sheets spreadsheet ID
    sheetId: number;               // Sheet ID within spreadsheet
    sheetTitle: string;            // Display name of sheet
    action: 'update' | 'create';   // Write mode (append/replace)
    enabled: boolean;              // Whether to export this sheet
  }
  ```

### SheetModal.jsx
- **Purpose**: Modal dialog for creating/editing sheet configurations
- **State Management**:
  - Manages editing state for spreadsheet selection
  - Tracks sheet creation progress
  - Displays saving messages during API calls
- **Workflow**:
  1. Select or create a Google Sheets spreadsheet
  2. If creating new: calls `createSpreadsheet` action
  3. Select or create a sheet within the spreadsheet
  4. If creating new sheet: calls `addSheet` action
  5. Configure table mapping (source table → sheet)
  6. Save configuration

### SpreadsheetTab.jsx
- **Purpose**: Handles spreadsheet selection and creation
- **Features**:
  - Browse existing spreadsheets via OAuth
  - Create new spreadsheet with automatic naming
  - Input field for custom spreadsheet name
  - Async loading of spreadsheet list

### SheetTab.jsx
- **Purpose**: Manages sheet selection within a spreadsheet
- **Features**:
  - Lists all sheets in selected spreadsheet
  - Add new sheet functionality
  - Sheet title customization
  - Handles sheet creation via Docker action

### InputTab.jsx
- **Purpose**: Input table selection and mapping
- **Features**:
  - Search available storage tables
  - Display bucket organization
  - Select table to export
  - Show table metadata (columns, row count)

## State Management

### Architecture
- **Pattern Used**: Flux with Immutable.js for state management
- **Stores**:
  - `InstalledComponentsStore`: Component configuration and local state
  - `OauthStore`: Google OAuth credentials

### Data Flow

1. **Configuration Load**:
   ```
   Component renders → storeProvisioning() → 
   InstalledComponentsStore.getConfigData() → 
   Extract tables, mappings, and OAuth credentials
   ```

2. **Table Save**:
   ```
   User edits sheet → updateTable() → 
   saveTables() → componentsActions.saveComponentConfigData() → 
   API call → Update local state with result
   ```

3. **Spreadsheet Creation**:
   ```
   User creates spreadsheet → createSpreadsheet() → 
   callDockerAction('createSpreadsheet', {configData}) → 
   API executes Docker action → Returns new spreadsheet ID
   ```

### Key State Paths

Configuration stored at:
```
{
  parameters: {
    tables: [
      {
        id: string,
        tableId: string,
        fileId: string,        // Spreadsheet ID
        sheetId: number,       // Sheet ID
        sheetTitle: string,
        action: 'update',
        enabled: boolean
      }
    ]
  },
  storage: {
    input: {
      tables: [
        {
          source: string,      // Source table ID
          destination: string, // Sheet title
          limit: 1 (if disabled)
        }
      ]
    }
  },
  authorization: {
    oauth_api: {
      credentials: {
        id: string,
        appSecret: string,
        data: string
      }
    }
  }
}
```

Local state paths:
```
{
  _: {
    pending: {},             // Pending operations
    saving: {}               // Saving states
  },
  SheetModal: {
    savingMessage: string    // Current operation message
  }
}
```

## OAuth & Authentication

### Google OAuth Flow

1. **Authorization Check**:
   - `storeProvisioning.isAuthorized()` checks for OAuth credentials
   - Credentials retrieved from OauthStore using component ID

2. **Credential Storage**:
   - Stored in config under `authorization.oauth_api.credentials`
   - Contains OAuth tokens and app secrets
   - Managed by OAuth module

3. **API Actions**:
   - `createSpreadsheet`: Creates new Google Sheets document
   - `addSheet`: Adds new sheet to existing spreadsheet
   - Both require valid OAuth credentials

## Docker Actions

### Available Actions

1. **createSpreadsheet**
   - **Purpose**: Create new Google Sheets spreadsheet
   - **Payload**: Configuration object with table definition
   - **Response**: 
     ```typescript
     {
       status: 'ok' | 'error',
       spreadsheet: {
         spreadsheetId: string,
         sheets: [{ properties: { sheetId: number } }]
       },
       message?: string
     }
     ```

2. **addSheet**
   - **Purpose**: Add new sheet to existing spreadsheet
   - **Payload**: Configuration with spreadsheet ID and sheet properties
   - **Response**:
     ```typescript
     {
       status: 'ok' | 'error',
       sheet: {
         sheetId: number
       },
       message?: string
     }
     ```

## API Endpoints

| Method | Endpoint | Purpose | Response |
|--------|----------|---------|----------|
| POST | `components/{componentId}/{configId}/action/run` | Create/update spreadsheet | Action result |
| PUT | `components/{componentId}/{configId}/config/rows` | Save sheet configuration | Updated config |

## Dependencies

### Internal Modules
- `@/modules/components/DockerActionsApi` - Docker action execution
- `@/modules/components/InstalledComponentsActionCreators` - Component actions
- `@/modules/components/stores/InstalledComponentsStore` - Component store
- `@/modules/oauth-v2/Store` - OAuth credentials management
- `@/modules/wr-db/helpers` - Shared writer helpers (table filtering)

### External Packages
- `immutable` - Immutable data structures (List, Map)
- `underscore` - Utility functions
- `react-immutable-render-mixin` - Immutable state rendering
- `create-react-class` - Legacy React class creation

### Design System Components
- `Button` - Action buttons
- `EmptyConfigurationActionCard` - Empty state UI
- `Search` - Table search input
- `FormGroup`, `Label` - Form elements
- `HelpBlock` - Inline help text

## Data Write Modes

### Update Mode (Append)
- **Configuration**: `action: 'update'`
- **Behavior**: Appends new data to existing sheet
- **Limitations**: No deduplification
- **Use Case**: Incremental data updates

### Create Mode
- **Configuration**: `action: 'create'`
- **Behavior**: Replaces entire sheet content with new data
- **Effect**: Clears all existing data first
- **Use Case**: Full data refresh

## Destination Management

### Spreadsheet Selection
1. **Create New**: Generates new Google Sheets spreadsheet
   - Auto-naming: Uses table name or timestamp
   - Creates initial sheet automatically
   - Returns spreadsheet and sheet IDs

2. **Use Existing**: Select from user's Google Drive
   - OAuth permissions required
   - Lists all accessible spreadsheets
   - User filters/searches by name

### Sheet Management
1. **Create New Sheet**: 
   - Creates sheet in selected spreadsheet
   - Customizable sheet title
   - Automatic naming if needed

2. **Use Existing Sheet**:
   - Select from sheets in spreadsheet
   - Limited to one table per sheet per config
   - Sheet title becomes destination name

## Configuration Workflow

1. **Authorize Google Account**
   - Click auth button
   - Redirect to Google OAuth
   - Grant Keboola access to Google Drive
   - OAuth token stored securely

2. **Configure Export**
   - Select source table from Storage
   - Choose write mode (append/replace)
   - Select destination spreadsheet (new or existing)
   - Choose destination sheet (new or existing)
   - Give sheet meaningful title

3. **Add Multiple Exports**
   - Each table can export to different sheets
   - Multiple tables can export to same spreadsheet
   - Each gets separate configuration entry

4. **Manage Exports**
   - Enable/disable individual exports
   - Edit destination spreadsheet/sheet
   - Delete export configuration
   - Search through configurations

## Notable Patterns

### Local State Management Pattern
```javascript
// Prepare local state with nested path support
function prepareLocalState(path) {
  const ls = store.getLocalState(path);
  const updateLocalSubstateFn = (subPath, newData) => {
    // Supports nested updates with array path concatenation
    updateLocalState([].concat(path).concat(subPath), newData);
  };
  return {
    localState: ls,
    updateLocalState: updateLocalSubstateFn,
    prepareLocalState: (newSubPath) => prepareLocalState([].concat(path).concat(newSubPath))
  };
}
```

### Configuration Preservation Pattern
When toggling enabled state, the module:
1. Sets limit to 1 when disabled (prevents partial export)
2. Removes limit when enabled (allows full export)
3. This pattern ensures data consistency without deleting config

### Error Handling Pattern
```javascript
// Docker actions wrapped with error handling
.then((data) => {
  if (data.status === 'error' || !data.spreadsheet) {
    throw new SyncActionError(
      data.message || 'Default error message',
      exceptionId
    );
  }
  return data;
})
```

## User-Facing Features

### Feature 1: Sheet Configuration
- **Description**: Set up export of storage tables to Google Sheets
- **Workflow**: 
  1. Add new export configuration
  2. Select source table
  3. Select destination (new or existing spreadsheet)
  4. Choose destination sheet
  5. Configure write mode
  6. Enable export
- **Components**: SheetModal, SpreadsheetTab, SheetTab

### Feature 2: Multiple Exports
- **Description**: Export multiple tables from single configuration
- **Workflow**: Each table gets own entry with independent settings
- **Components**: SheetsList, SheetModal (repeated for each table)

### Feature 3: Sheet Management
- **Description**: Create new sheets dynamically or use existing ones
- **Workflow**: 
  - Create spreadsheet if needed
  - Create sheet if needed
  - Both done automatically via Docker actions
- **Components**: SpreadsheetTab, SheetTab

### Feature 4: OAuth Integration
- **Description**: Secure Google account authorization
- **Workflow**: OAuth flow handled by oauth-v2 module
- **Status Indicator**: Shows authorization status in UI

## Technical Debt & Observations

### Legacy Patterns
- Uses `create-react-class` instead of modern functional components
- `immutable.js` with Flux pattern (vs modern TanStack Query)
- `react-immutable-render-mixin` for state subscriptions

### Areas for Improvement
- Limited error messages to users (errors mostly in console)
- No progress indicator during long-running Docker actions
- Modal dialog UX could use loading skeleton states
- Search functionality only on table selection, not on sheet configurations

### Complexity Hotspots
1. **Spreadsheet/Sheet Creation**: Two-step async process
2. **Mapping Preservation**: Complex logic to maintain mappings during updates
3. **Table Enable/Disable**: Must handle limit parameter correctly

### Migration Notes
- Could migrate to TanStack Query for server state
- Could use Zustand for local UI state
- React component migration from class to functional components would improve maintainability

## Related Modules

- `wr-db` - Database writers (similar multi-table pattern)
- `wr-google-drive` - Google Drive writer (similar OAuth flow)
- `wr-onedrive` - OneDrive writer (similar cloud storage pattern)
- `oauth-v2` - OAuth authentication framework
- `components` - Base component management

## Testing

### Key Test Scenarios
- OAuth authorization flow
- Spreadsheet creation with error handling
- Sheet addition with error handling
- Table enable/disable toggle
- Search functionality
- Configuration save/load
- Read-only mode (disabled state)

### Test Files
- Located in individual component directories
- Focus on adapter logic for configuration conversion
- Test data fixtures for various configuration states

