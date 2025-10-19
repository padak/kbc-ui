# Module: ex-storage

## Overview

Storage Extractor (ex-storage) enables extraction of tables from another Keboola Storage project into the current project. Provides project-to-project data transfer capabilities with table selection and configuration options.

**Component ID**: `keboola.ex-storage`

## File Structure

```
ex-storage/
├── routes.js
├── adapters/
│   ├── actions.js
│   ├── sourceProject.js
│   ├── sourceTable.js
│   └── saveSettings.js
└── react/
    └── components/
        ├── SourceProject.tsx
        ├── SourceTable.tsx
        └── SaveSettings.tsx
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| Index | SourceProjectSection | Source project configuration |
| Row | SourceTableSection + SaveSettingsSection | Table and save settings |

## Key Components

### SourceProject Component
- **Location**: `react/components/SourceProject.tsx`
- **Purpose**: Configure source Keboola project
- **Props**: 
  - `disabled`: Disable state
  - `onChange`: Change handler
  - `value`: Configuration
- **Features**: Project ID, API token, region/stack selection

### SourceTable Component
- **Location**: `react/components/SourceTable.tsx`
- **Purpose**: Select and configure source table
- **Props**: Same as SourceProject
- **Features**: Table selection, bucket selection, filtering

### SaveSettings Component
- **Location**: `react/components/SaveSettings.tsx`
- **Purpose**: Configure destination and load options
- **Features**: Output table name, incremental load, primary key

## Adapters

| Adapter | Purpose |
|---------|---------|
| `sourceProjectAdapter` | Source project configuration |
| `sourceTableAdapter` | Source table selection |
| `saveSettingsAdapter` | Output and load settings |
| `actions.sourceInfo` | Fetch source project info |

## API Endpoints

| Method | Endpoint | Purpose | Response Type |
|--------|----------|---------|---------------|
| GET | `/api/components/{componentId}/configs/{configId}` | Retrieve config | Config |
| POST | `/api/components/{componentId}/configs/{configId}` | Save config | Config |
| GET | `https://sourcestack.keboola.com/storage/projects/{projectId}` | Get source project info | ProjectInfo |

## State Management

- **Pattern Used**: Adapter-based with actions
- **Actions**: 
  - `sourceInfo`: Autoload source project information
  - Action caching enabled
- **Data Flow**: 
  1. Source project configured
  2. Project info fetched
  3. Tables loaded from source
  4. Table selected
  5. Output settings configured
  6. Saved to storage

## Dependencies

### Internal Modules
- `modules/configurations` - Configuration utilities
- `modules/configurations/utils` - Column types

### External Packages
- `immutable` - Data structures
- React - UI framework
- Axios - HTTP requests to source storage

## Notable Patterns

1. **Cross-Project Transfer**: Project-to-project data movement
2. **Info Autoload**: Source project info cached and autoloaded
3. **Dynamic Table Loading**: Tables fetched from source project
4. **Configuration Separation**: Source project, table, and settings separate adapters

## User-Facing Features

### Feature 1: Source Project Configuration
- **Description**: Connect to source Keboola Storage project
- **Workflow**: Enter project ID → Provide API token → Select region → Verify
- **Components**: SourceProject component

### Feature 2: Table Selection
- **Description**: Select which tables to extract from source
- **Workflow**: Browse source buckets → Select tables → Configure filters
- **Components**: SourceTable component

### Feature 3: Output Configuration
- **Description**: Configure destination and loading options
- **Workflow**: Set output table name → Choose incremental load → Configure keys
- **Components**: SaveSettings component

## Technical Debt & Observations

- Cross-project communication adds complexity
- API token security considerations (passing credentials)
- Region/stack selection important for API endpoint routing
- Assumes source project is accessible

## Code Examples

### Configuration Structure
```typescript
{
  sourceProject: {
    projectId: "12345",
    apiToken: "#encrypted_token",
    region: "us-east-1"
  },
  sourceTable: {
    bucket: "in.c-storage-project",
    table: "my_table"
  },
  saveSettings: {
    tableName: "imported_data",
    incremental: false,
    primaryKey: ["id"]
  }
}
```

## Related Modules

- `configurations` - Base configuration module
- `storage` - Storage management utilities
- `components` - Base component management

## Testing

- Test coverage in adapters
- Approach: Adapter transformation logic
- Special consideration for cross-project API calls
