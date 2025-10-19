# Module: wr-google-drive (Google Drive Writer)

## Overview

The wr-google-drive module enables data export from Keboola Storage into Google Drive. It provides Google OAuth authentication, folder selection and creation, file management with create/append/replace modes, and CSV/Excel export formatting. Users can upload tabular data directly to Google Drive with flexible destination configuration and multiple data formatting options.

## File Structure

```
wr-google-drive/
├── routes.js                              # Route configuration
├── actionsProvisioning.js                 # Local state and actions management
├── storeProvisioning.js                   # Store definition with immutable.js
└── react/
    ├── pages/
    │   └── Index/
    │       └── Index.jsx                  # Main configuration page
    ├── components/
    │   ├── FilesList.jsx                  # List of configured file exports
    │   ├── FileModal.jsx                  # Modal dialog for file editing
    │   ├── FileTab.jsx                    # File selection/creation
    │   ├── ActionTab.jsx                  # Write mode (create/append/replace)
    │   └── InputTab.jsx                   # Input table mapping
```

## Routes & Configuration

### Route Structure

Uses `createRoute()` utility for single-level configuration:

```typescript
{
  name: 'keboola.wr-google-drive',
  path: 'keboola.wr-google-drive/:config',
  title: 'Google Drive',
  lazy: async () => {
    const Index = await import('./react/pages/Index/Index');
    return { Component: Index.default(COMPONENT_ID) };
  },
  requireData: [configRequiredData],      // Preloads configuration
  poll: configPoll                         // Periodic polling for updates
}
```

## Key Components

### Index.jsx (Main Component)
- **Purpose**: Orchestrates the entire Google Drive configuration interface
- **Props**: None (component is created with COMPONENT_ID)
- **State Management**: 
  - Uses `storeMixins` from InstalledComponentsStore and OauthStore
  - Uses `createStoreMixin` for reactive state updates
  - Manages local state through actions provisioning
- **Features**:
  - Displays list of configured file exports with enable/disable toggles
  - Search functionality for input tables
  - Add/edit/delete file export configurations
  - OAuth authorization status checking
- **Key Methods**:
  - `renderTables()`: Renders FilesList component
  - `renderTableModal()`: Renders FileModal when editing
  - `handleSearchQueryChange()`: Updates search query in local state
  - `showTableModal()`: Opens modal for new/existing file
  - `invalidToRun()`: Checks if configuration is ready for execution

### FilesList.jsx
- **Purpose**: Renders a table of configured file exports with actions
- **Props**:
  - `items`: Immutable List of file export configurations
  - `inputTables`: Available storage tables for mapping
  - `buckets`: Available buckets for table organization
  - `readOnly`: Boolean for read-only mode
  - `onEditFn`: Callback to open file editor
  - `onDeleteFn`: Callback to delete file export
  - `toggleEnabledFn`: Callback to toggle file export enabled state
- **Configuration Structure** (each file object):
  ```typescript
  {
    id: string;                    // Unique identifier
    tableId: string;               // Source storage table ID
    fileId: string;                // Google Drive file ID
    action: 'create' | 'append' | 'replace';  // Write mode
    enabled: boolean;              // Whether to export this file
    convert: boolean;              // Convert to specific format (CSV/Excel)
    folder: {
      id: string;                  // Google Drive folder ID
      title: string;               // Folder name
    }
  }
  ```

### FileModal.jsx
- **Purpose**: Modal dialog for creating/editing file export configurations
- **State Management**:
  - Manages editing state for folder/file selection
  - Tracks file creation progress
  - Displays saving messages during API calls
- **Workflow**:
  1. Select or create folder (optional)
  2. Select or create file within folder
  3. Configure write mode (create/append/replace)
  4. Configure table mapping (source table → file)
  5. Save configuration

### FileTab.jsx
- **Purpose**: Handles file selection and creation
- **Features**:
  - Browse existing files via OAuth
  - Create new file with automatic naming
  - Input field for custom file name
  - Async loading of file list in selected folder
  - Folder navigation

### ActionTab.jsx
- **Purpose**: Configure write action and behavior
- **Features**:
  - Select write mode: create (new file), append (append rows), replace (overwrite)
  - Format options: CSV, Excel, etc.
  - Preview of action consequences
  - Action description

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

2. **File Save**:
   ```
   User edits file → updateTable() → 
   saveTables() → componentsActions.saveComponentConfigData() → 
   API call → Update local state with result
   ```

3. **File Creation**:
   ```
   User creates file → createFileAction() → 
   callDockerAction('createFile', {configData}) → 
   API executes Docker action → Returns new file ID
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
        fileId: string,        // Google Drive file ID
        action: 'create' | 'append' | 'replace',
        enabled: boolean,
        convert: boolean,      // Format conversion flag
        folder: {
          id: string,
          title: string
        }
      }
    ]
  },
  storage: {
    input: {
      tables: [
        {
          source: string,      // Source table ID
          destination: string, // File name
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
    saving: {},              // Saving states
    deleting: {}             // Deletion states
  },
  FileModal: {
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
   - `createFile`: Creates new Google Drive file
   - Both requires valid OAuth credentials

## Docker Actions

### Available Actions

1. **createFile**
   - **Purpose**: Create new Google Drive file with initial data
   - **Payload**: Configuration object with table and folder definition
   - **Response**: 
     ```typescript
     {
       status: 'ok' | 'error',
       file: {
         id: string,
         folder: {
           id: string,
           title: string
         }
       },
       message?: string
     }
     ```

## API Endpoints

| Method | Endpoint | Purpose | Response |
|--------|----------|---------|----------|
| POST | `components/{componentId}/{configId}/action/run` | Create file | Action result |
| PUT | `components/{componentId}/{configId}/config/rows` | Save file configuration | Updated config |

## Dependencies

### Internal Modules
- `@/modules/components/DockerActionsApi` - Docker action execution
- `@/modules/components/InstalledComponentsActionCreators` - Component actions
- `@/modules/components/stores/InstalledComponentsStore` - Component store
- `@/modules/oauth-v2/Store` - OAuth credentials management
- `@/modules/wr-db/helpers` - Shared writer helpers

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

### Create Mode
- **Configuration**: `action: 'create'`
- **Behavior**: Creates new file with exported data
- **File Naming**: Auto-generated or user-specified
- **Use Case**: New file per export run

### Append Mode
- **Configuration**: `action: 'append'`
- **Behavior**: Adds rows to existing file
- **Existing Data**: Preserved, new rows added at bottom
- **Use Case**: Incremental data updates

### Replace Mode
- **Configuration**: `action: 'replace'`
- **Behavior**: Overwrites entire file content with new data
- **Effect**: Removes all previous content
- **Use Case**: Full data refresh

## Destination Management

### Folder Selection
1. **Root Directory**: Upload files to Google Drive root
   - No folder selection needed
   - Files appear in user's main Drive

2. **Specific Folder**: Upload to chosen folder
   - Browse and select from existing folders
   - Creates folder automatically if needed
   - Folder ID stored in configuration

### File Management
1. **Create New File**: 
   - Generates new Google Drive file
   - Auto-naming: Uses table name or timestamp
   - Returns file ID for future writes

2. **Use Existing File**:
   - Select from files in chosen folder
   - Write mode determines behavior
   - File ID stored in configuration

### Format Conversion
- **CSV Format**: Standard comma-separated values
- **Excel Format**: XLSX format for spreadsheet applications
- **Conversion Flag**: `convert` boolean in configuration

## Configuration Workflow

1. **Authorize Google Account**
   - Click auth button
   - Redirect to Google OAuth
   - Grant Keboola access to Google Drive
   - OAuth token stored securely

2. **Configure Export**
   - Select source table from Storage
   - Choose write mode (create/append/replace)
   - Select destination folder or use root
   - Choose file name or create new file
   - Configure format conversion if needed

3. **Add Multiple Exports**
   - Each table can export to different files
   - Multiple tables can export to same folder
   - Each gets separate configuration entry
   - Independent write mode per export

4. **Manage Exports**
   - Enable/disable individual exports
   - Edit destination folder/file
   - Delete export configuration
   - Search through configurations
   - Change write mode and format anytime

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

### File Management Pattern
```javascript
// File creation is conditional - only creates if:
// 1. fileId not already set AND
// 2. action is not 'create' (create action uses existing file)
if (!table.get('fileId') && table.get('action') !== 'create') {
  return createFileAction(table)
    .then((data) => {
      // Store returned file ID and folder info
      return updateTable(
        table
          .set('fileId', data.file.id)
          .setIn(['folder', 'id'], data.file.folder.id)
          .setIn(['folder', 'title'], data.file.folder.title),
        mapping
      );
    });
}
```

### Configuration Preservation Pattern
When toggling enabled state:
1. Sets limit to 1 when disabled (prevents partial export)
2. Removes limit when enabled (allows full export)
3. Preserves all other configuration

### Error Handling Pattern
```javascript
// Docker actions wrapped with error handling
.then((data) => {
  if (data.status === 'error' || !data.file) {
    throw new SyncActionError(
      data.message || 'There was an error while creating the file',
      exceptionId
    );
  }
  return data;
})
```

## User-Facing Features

### Feature 1: File Export Configuration
- **Description**: Set up export of storage tables to Google Drive files
- **Workflow**: 
  1. Add new export configuration
  2. Select source table
  3. Choose folder destination
  4. Select or create file
  5. Configure write mode
  6. Enable export
- **Components**: FileModal, FileTab, ActionTab

### Feature 2: Multiple File Exports
- **Description**: Export multiple tables from single configuration
- **Workflow**: Each table gets own entry with independent settings
- **Components**: FilesList, FileModal (repeated for each table)

### Feature 3: File Action Modes
- **Description**: Flexible write modes for different scenarios
- **Options**:
  - Create: New file each run
  - Append: Add to existing file
  - Replace: Update existing file completely
- **Components**: ActionTab

### Feature 4: OAuth Integration
- **Description**: Secure Google account authorization
- **Workflow**: OAuth flow handled by oauth-v2 module
- **Status Indicator**: Shows authorization status in UI

### Feature 5: Folder Organization
- **Description**: Organize exports in Google Drive folders
- **Workflow**: 
  - Select existing folder
  - Create new folder if needed
  - Upload files to chosen location
- **Components**: FileTab

## Technical Debt & Observations

### Legacy Patterns
- Uses `create-react-class` instead of modern functional components
- `immutable.js` with Flux pattern (vs modern TanStack Query)
- `react-immutable-render-mixin` for state subscriptions

### Areas for Improvement
- Limited error messages to users (errors mostly in console)
- No progress indicator during long-running Docker actions
- Format conversion UI could be more intuitive
- Write mode selection could have better preview of consequences
- Folder navigation could use breadcrumb trail

### Complexity Hotspots
1. **File Creation Logic**: Conditional creation based on action mode
2. **Folder/File Selection**: Two-level hierarchy
3. **Mapping Preservation**: Must handle during file updates
4. **Action Mode Behavior**: Three different modes with distinct behaviors

### Migration Notes
- Could migrate to TanStack Query for server state
- Could use Zustand for local UI state
- React component migration from class to functional components would improve maintainability
- Consider adding TypeScript for better type safety

## Related Modules

- `wr-db` - Database writers (similar multi-table pattern)
- `wr-google-sheets` - Google Sheets writer (similar OAuth flow)
- `wr-onedrive` - OneDrive writer (similar cloud storage pattern)
- `oauth-v2` - OAuth authentication framework
- `components` - Base component management

## Testing

### Key Test Scenarios
- OAuth authorization flow
- File creation with error handling
- Different write modes (create/append/replace)
- Folder selection and creation
- Table enable/disable toggle
- Search functionality
- Configuration save/load
- Read-only mode (disabled state)
- Format conversion options

### Test Files
- Located in individual component directories
- Focus on adapter logic for configuration conversion
- Test data fixtures for various configuration states

