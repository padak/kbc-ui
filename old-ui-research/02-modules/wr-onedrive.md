# Module: wr-onedrive (OneDrive Writer)

## Overview

The wr-onedrive module enables data export from Keboola Storage into Microsoft OneDrive. It provides Microsoft OAuth authentication, workbook (Excel file) selection and creation, worksheet (sheet) management, and table mapping configuration. Users can write data to Excel workbooks stored in OneDrive with flexible configuration of destination workbooks and worksheets.

## File Structure

```
wr-onedrive/
├── routes.js                              # Route configuration
├── action.js                              # Docker action helpers
└── react/
    ├── Destination.jsx                    # Workbook/worksheet selection
    ├── InputMapping.jsx                   # Input table mapping
    └── adapters/
        ├── conform.js                     # Configuration normalization
        ├── destination.js                 # Destination adapter
        └── inputMapping.js                # Input mapping adapter
```

## Routes & Configuration

### Route Structure

Uses `createRoute()` utility for row-level configuration only:

```typescript
{
  componentId: KEBOOLA_WR_ONEDRIVE,
  row: {
    hasState: false,
    onConform: conform,
    sections: [
      {
        render: InputMappingSection,
        onSave: inputMappingAdapter.createConfiguration,
        onLoad: inputMappingAdapter.parseConfiguration,
        onCreate: inputMappingAdapter.createEmptyConfiguration
      },
      {
        render: DestinationSection,
        onSave: destinationAdapter.createConfiguration,
        onLoad: destinationAdapter.parseConfiguration
      }
    ],
    columns: [
      {
        name: 'Source Table',
        type: TABLE_LINK,
        value: (row) => row.getIn(['storage', 'input', 'tables', 0, 'source'])
      },
      {
        name: 'Destination Table',
        type: VALUE,
        value: (row) => row.getIn(['storage', 'input', 'tables', 0, 'destination'])
      }
    ]
  }
}
```

## Key Components

### Destination.jsx (Workbook/Worksheet Selection)
- **Purpose**: Configure OneDrive workbook and worksheet destination
- **State Management**:
  - Uses OauthStore for Microsoft credentials
  - Manages workbook and worksheet selection state
- **Workflow**:
  1. Select or create workbook (Excel file) in OneDrive
  2. If creating new: calls `createWorkbook` Docker action
  3. Select or create worksheet (sheet) in workbook
  4. If creating new: calls `createWorksheet` Docker action
  5. Save destination configuration
- **Configuration Structure**:
  ```typescript
  {
    parameters: {
      workbook: {
        fileId: string;        // OneDrive file ID
        driveId: string;       // OneDrive drive ID
        path: string;          // OneDrive path (used for creation)
      },
      worksheet: {
        name: string;          // Sheet name
      }
    }
  }
  ```

### InputMapping.jsx (Table Selection)
- **Purpose**: Configure source table to export
- **Features**:
  - Select source table from Storage
  - Display table metadata
  - Search available tables
  - Show bucket organization

## Docker Actions

### Available Actions

1. **createWorkbook**
   - **Purpose**: Create new Excel workbook in OneDrive
   - **Payload**:
     ```typescript
     {
       parameters: {
         workbook: {
           path: string          // OneDrive path for new file
         }
       },
       authorization: {
         oauth_api: {
           credentials: {        // Microsoft OAuth credentials
             appKey: string,
             data: string,
             appSecret: string
           }
         }
       }
     }
     ```
   - **Response**:
     ```typescript
     {
       workbook: {
         fileId: string,
         driveId: string
       }
     }
     ```

2. **createWorksheet**
   - **Purpose**: Add new sheet to existing workbook
   - **Payload**:
     ```typescript
     {
       parameters: {
         workbook: {
           fileId: string,
           driveId: string
         },
         worksheet: {
           name: string          // New sheet name
         }
       },
       authorization: {
         oauth_api: {
           credentials: { /* ... */ }
         }
       }
     }
     ```
   - **Response**:
     ```typescript
     {
       status: 'ok' | 'error',
       message?: string
     }
     ```

3. **getWorksheets**
   - **Purpose**: List all worksheets in a workbook
   - **Payload**: Workbook IDs and credentials
   - **Response**: List of worksheet metadata

## API Endpoints

| Method | Endpoint | Purpose | Response |
|--------|----------|---------|----------|
| POST | `components/{componentId}/{configId}/action/run` | Create workbook/worksheet | Action result |
| PUT | `components/{componentId}/{configId}/config` | Save configuration | Updated config |

## Key Features

### Microsoft OAuth Flow

1. **Authorization**
   - Redirect to Microsoft OAuth
   - Grant Keboola access to OneDrive
   - Token stored in configuration

2. **Credential Storage**
   - Stored in config under `authorization.oauth_api.credentials`
   - Contains app key, app secret, and OAuth token
   - Managed by OAuth module

### Workbook Management

1. **Create New Workbook**
   - Specify OneDrive path
   - Auto-create Excel file
   - Returns workbook IDs

2. **Use Existing Workbook**
   - Browse OneDrive files
   - Select Excel workbook
   - Store workbook IDs for future writes

### Worksheet Management

1. **Create New Sheet**
   - Specify sheet name
   - Add to existing workbook
   - Returns sheet metadata

2. **Use Existing Sheet**
   - List sheets in workbook
   - Select sheet by name
   - Limited to one table per sheet per config

### Data Mapping

- **Source**: Single storage table
- **Destination**: Specific worksheet in workbook
- **Mapping**: Table columns to worksheet columns

## Configuration Workflow

1. **Authorize Microsoft Account**
   - Click auth button
   - Redirect to Microsoft OAuth
   - Grant Keboola access to OneDrive
   - OAuth token stored securely

2. **Configure Workbook**
   - Create new workbook or select existing
   - If creating: specify path in OneDrive
   - Gets workbook ID for future reference

3. **Configure Worksheet**
   - Create new worksheet or select existing
   - Specify worksheet name
   - Gets sheet metadata

4. **Configure Mapping**
   - Select source table from Storage
   - Destination worksheet automatically set
   - Table columns map to sheet columns

5. **Save Configuration**
   - All settings persisted
   - Ready for data export

## State Management

### Architecture
- **Pattern Used**: Configuration-driven with row-level settings
- **Stores**:
  - `OauthStore`: Microsoft OAuth credentials
  - `InstalledComponentsStore`: Configuration storage

### Data Flow

```
Component renders →
Load row configuration →
Parse workbook/worksheet IDs →
Display UI with current selection →
User updates destination →
Save via adapter →
Update remote configuration
```

### Configuration Structure

```typescript
{
  storage: {
    input: {
      tables: [
        {
          source: string,      // Source table ID
          destination: string  // Destination worksheet name
        }
      ]
    }
  },
  parameters: {
    workbook: {
      fileId: string,
      driveId: string,
      path: string             // For creation
    },
    worksheet: {
      name: string
    }
  },
  authorization: {
    oauth_api: {
      credentials: {
        appKey: string,
        data: string,
        appSecret: string
      }
    }
  }
}
```

## Dependencies

### Internal Modules
- `@/modules/components/stores/InstalledComponentsStore` - Configuration store
- `@/modules/oauth-v2/Store` - OAuth credentials management
- `@/modules/components/DockerActionsApi` - Docker action execution
- `@/constants/componentIds` - Component ID constants

### External Packages
- `immutable` - Immutable data structures (Map)
- `react-bootstrap` - UI components
- `@keboola/design` - Design system components

### Design System Components
- `Button` - Action buttons
- `FormGroup` - Form sections
- `Label` - Form labels
- `TextInput` - Text inputs
- `HelpBlock` - Help text

## Notable Patterns

### Credential Extraction Pattern
```javascript
// Extract OAuth credentials for Docker actions
const getCredentials = (configId) => {
  const configData = InstalledComponentsStore.getConfigData(COMPONENT_ID, configId);
  const credentials = AuthStore.getCredentials(COMPONENT_ID, configData) || Map();
  
  return Map({
    appKey: credentials.get('appKey'),
    '#data': credentials.get('#data'),          // OAuth token
    '#appSecret': credentials.get('#appSecret')
  });
};
```

### Action Wrapper Pattern
```javascript
// Wrap Docker actions with error handling
const createWorkbook = (configId, path) => {
  const params = {
    configData: Map()
      .setIn(['parameters', 'workbook', 'path'], path)
      .setIn(['authorization', 'oauth_api', 'credentials'], getCredentials(configId))
      .toJS()
  };
  
  return callDockerAction(COMPONENT_ID, 'createWorkbook', params)
    .then((result) => {
      if (result.status === 'error') {
        throw new SyncActionError(
          result.message || 'An error occurred while creating workbook',
          result.exceptionId
        );
      }
      return result;
    });
};
```

### Error Handling Pattern
- All Docker actions wrapped with error handling
- Errors throw SyncActionError with message and exceptionId
- User sees error message in UI
- Stack trace available in browser console

## User-Facing Features

### Feature 1: OneDrive Workbook Selection
- **Description**: Choose where to write data in OneDrive
- **Options**:
  1. Create new workbook: New Excel file created automatically
  2. Use existing workbook: Select from OneDrive files
- **Workflow**:
  - Select creation or existing option
  - If creating: Enter path in OneDrive
  - If existing: Browse and select workbook

### Feature 2: Worksheet Management
- **Description**: Configure target sheet within workbook
- **Options**:
  1. Create new worksheet: New sheet added to workbook
  2. Use existing worksheet: Select from sheets in workbook
- **Workflow**:
  - Select creation or existing option
  - If creating: Enter sheet name
  - If existing: Select from list

### Feature 3: Table Mapping
- **Description**: Configure which table to export
- **Workflow**:
  - Select source table from Storage
  - Destination worksheet auto-populated
  - Save configuration

### Feature 4: OAuth Integration
- **Description**: Secure Microsoft account authorization
- **Workflow**: OAuth flow handled by oauth-v2 module
- **Status**: Authorization status shown in UI

## Technical Debt & Observations

### Legacy Patterns
- Uses older component patterns (not fully modern)
- Configuration-heavy approach (less state management)
- Limited error messaging

### Areas for Improvement
- Workbook/worksheet selection UI could be more intuitive
- Breadcrumb trail for OneDrive navigation would help
- Preview of what will be written would be useful
- Better handling of long file/sheet names in UI

### Complexity Hotspots
1. **OAuth Credential Extraction**: Multiple wrapping levels
2. **Workbook/Worksheet Creation**: Two-step async process
3. **Error Handling**: Need to catch and display errors properly

### Migration Notes
- Could use TypeScript for better type safety
- Modern React hooks would simplify components
- TanStack Query for server state management
- Better separation of concerns between adapter and UI

## Related Modules

- `wr-google-sheets` - Google Sheets writer (similar multi-step config)
- `wr-google-drive` - Google Drive writer (similar OAuth pattern)
- `oauth-v2` - OAuth authentication framework
- `components` - Base component management

## Testing

### Key Test Scenarios
- Microsoft OAuth authorization flow
- Workbook creation with error handling
- Worksheet creation and listing
- Table/worksheet mapping
- Configuration save/load
- Error message display
- Read-only mode

### Test Files
- Adapter test files for configuration conversion
- Component test files for UI interaction
- Mock OAuth credentials for testing

