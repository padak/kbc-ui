# Module: wr-storage (Keboola Storage Writer)

## Overview

The wr-storage module enables data migration and transfer between Keboola Storage instances. It allows users to copy tables from their Storage into another Keboola project (workspace), with support for table, database, or workspace selection as the target. The module handles inter-workspace data transfer, project selection, and flexible destination mapping.

## File Structure

```
wr-storage/
├── routes.js                              # Route configuration
└── react/
    └── components/
        ├── TargetProject.jsx              # Target workspace selection
        ├── InputMapping.jsx               # Source table selection
        ├── Destination.jsx                # Destination table naming
        └── adapters/
            ├── targetProject.js           # Target project adapter
            ├── inputMapping.js            # Input mapping adapter
            └── destination.js             # Destination adapter
```

## Routes & Configuration

### Route Structure

Uses `createRoute()` utility with index and row-level configuration:

```typescript
{
  componentId: 'keboola.wr-storage',
  index: {
    actions: [
      {
        name: 'info',
        cache: true,
        autoload: true,
        getPayload: actions.info
      }
    ],
    sections: [
      {
        render: CollapsibleSection with TargetProjectSection,
        onSave: targetProjectAdapter.createConfiguration,
        onLoad: targetProjectAdapter.parseConfiguration,
        isComplete: targetProjectAdapter.isComplete
      }
    ]
  },
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
        onLoad: destinationAdapter.parseConfiguration,
        onCreate: destinationAdapter.createEmptyConfiguration
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

### TargetProject.jsx (Workspace Selection)
- **Purpose**: Configure target workspace for data transfer
- **Props**:
  - `value`: Current target project configuration
  - `onChange`: Callback when target changes
  - `disabled`: Read-only mode flag
- **Features**:
  - Select from available workspaces/projects
  - List current workspace
  - Authentication with target workspace
  - Fetch available workspaces via API
- **Configuration Structure**:
  ```typescript
  {
    parameters: {
      storage: {
        targetProject: {
          projectId: string;     // Target project/workspace ID
          projectName: string;   // Display name
        }
      }
    }
  }
  ```

### InputMapping.jsx (Source Table Selection)
- **Purpose**: Configure source table from current Storage
- **Features**:
  - Select available storage tables
  - Display bucket organization
  - Search table names
  - Show table metadata

### Destination.jsx (Target Table Naming)
- **Purpose**: Configure target table name in destination workspace
- **Features**:
  - Specify destination table name
  - Destination bucket selection (if applicable)
  - Support for table transformation (if needed)
- **Configuration Structure**:
  ```typescript
  {
    storage: {
      input: {
        tables: [
          {
            source: string,      // Source table ID
            destination: string  // Target table name
          }
        ]
      }
    }
  }
  ```

## State Management

### Architecture
- **Pattern Used**: Configuration-driven with adapters
- **Stores**:
  - `InstalledComponentsStore`: Configuration storage
  - Workspaces store: Available workspace listing

### Data Flow

```
Component renders →
Load index config (target project) →
Load row configurations (table mappings) →
Display UI with current selections →
User updates settings →
Save via adapter →
Update remote configuration
```

### Configuration Structure

```typescript
{
  parameters: {
    storage: {
      targetProject: {
        projectId: string,
        projectName: string
      }
    }
  },
  storage: {
    input: {
      tables: [
        {
          source: string,      // Source table ID (in current project)
          destination: string  // Target table name (in target project)
        }
      ]
    }
  }
}
```

## API Endpoints

| Method | Endpoint | Purpose | Response |
|--------|----------|---------|----------|
| GET | `/components/{componentId}/action/info` | Get available workspaces | Workspace list |
| PUT | `components/{componentId}/{configId}/config` | Save configuration | Updated config |

## Docker Actions

### Available Actions

1. **info**
   - **Purpose**: Fetch list of available target workspaces
   - **Autoload**: true (loads on component view)
   - **Response**: List of available workspaces with IDs and names
   - **Use**: Populate workspace selection dropdown

## Key Features

### Workspace Selection

1. **Current Workspace**
   - Shows as option (if supported)
   - Copy tables within same project
   - Use case: Table reorganization

2. **Different Workspace**
   - Select from available target workspaces
   - Cross-project data transfer
   - Use case: Data sharing between projects

### Table Mapping

- **Source**: Single storage table
- **Destination**: Target table name in destination workspace
- **Naming**: Full destination table ID can be specified

### Multiple Transfers

- Configure multiple table transfers
- Each table gets own configuration row
- Independent destination names per transfer

## Configuration Workflow

1. **Select Target Workspace**
   - Click on target project section
   - Choose from available workspaces (fetched via info action)
   - Save target project selection

2. **Configure First Table Transfer**
   - Add new row configuration
   - Select source table from Storage
   - Enter destination table name
   - Save configuration

3. **Add More Transfers**
   - Each table gets own configuration row
   - Can transfer to different destination names
   - Independent transfer per row

4. **Manage Transfers**
   - View all configured transfers
   - Edit destination names
   - Delete individual transfers
   - Run to execute transfers

## Dependencies

### Internal Modules
- `@/modules/configurations/utils/createRoute` - Route factory
- `@/modules/configurations/utils/renderHelpers` - UI helpers (CollapsibleSection)
- `@/modules/configurations/utils/columnTypeConstants` - Column types
- `@/modules/workspaces/WorkspacesActions` - Workspace data loading

### External Packages
- `react-bootstrap` - UI components
- `@keboola/design` - Design system components

### Design System Components
- `Button` - Action buttons
- `FormGroup` - Form sections
- `Label` - Form labels
- `TextInput` - Text inputs
- `Select` - Dropdown selectors

## Notable Patterns

### Two-Level Configuration Pattern
- **Index Level**: Component-wide settings (target workspace)
- **Row Level**: Per-table transfer settings
- Allows multiple tables transferred via single component instance

### Adapter Pattern
- Separate adapters for each section (target project, input, destination)
- Each handles serialization/deserialization
- Conform function normalizes configuration on load

## User-Facing Features

### Feature 1: Workspace Selection
- **Description**: Choose destination project for data transfer
- **Workflow**:
  - View available workspaces
  - Select target workspace
  - Save selection
- **Use Cases**:
  - Transfer to staging workspace
  - Copy data to client workspace
  - Share data with partner workspace

### Feature 2: Table Transfer Configuration
- **Description**: Configure which tables to transfer and where
- **Workflow**:
  1. Select source table
  2. Enter destination table name
  3. Save configuration
  4. Run to transfer
- **Use Cases**:
  - Move data between projects
  - Archive historical data
  - Share subset of data with partners

### Feature 3: Multiple Table Transfer
- **Description**: Transfer multiple tables in single component
- **Workflow**:
  - Add multiple row configurations
  - Each row configured independently
  - All use same target workspace
  - Run all together

### Feature 4: Target Workspace Management
- **Description**: View and change target workspace
- **Features**:
  - See current target workspace
  - Change target anytime
  - Fetches available workspaces automatically
  - Validates workspace access

## Technical Debt & Observations

### Current Implementation
- Uses createRoute utility (consistent with other components)
- Row-level configuration for table mappings
- Simple adapter pattern for configuration handling

### Areas for Improvement
- Limited preview of what will be transferred
- Could show data size estimates
- Validation of destination table names
- Batch transfer progress indicator
- Better error messages for transfer failures

### Complexity Hotspots
1. **Workspace Selection**: Fetching available targets
2. **Cross-Project References**: Maintaining table IDs across projects
3. **Configuration Persistence**: Ensuring target project stays valid

### Migration Notes
- Could use TanStack Query for workspace listing
- Modern form library would improve UX
- TypeScript for type safety

## Related Modules

- `workspaces` - Workspace management
- `storage` - Keboola Storage core
- `components` - Base component management
- `configurations` - Configuration utilities

## Testing

### Key Test Scenarios
- Workspace listing and selection
- Table mapping configuration
- Destination table naming
- Multiple table transfers
- Configuration save/load
- Cross-project references
- Read-only mode

### Test Files
- Adapter test files for configuration conversion
- Component test files for UI interaction
- Mock workspace data for testing

