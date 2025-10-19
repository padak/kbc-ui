# Module: transformations-v2

## Overview

The `transformations-v2` module handles the new generation of transformation management in Keboola Connection. It provides a modern, component-based architecture for managing various transformation types including SQL-based transformations, dbt projects (both local and remote), and support for multiple data warehouse backends (Snowflake, BigQuery, PostgreSQL, Redshift, MSSQL).

The module integrates with the Generic Component framework, supporting multiple transformation engines: legacy SQL transformations, Snowflake transformations, and dbt transformations with different backends.

## File Structure

```
transformations-v2/
├── Index.tsx                           # Main entry point with search/filtering
├── TransformationsConfigs.tsx          # Main configs display and filtering logic
├── HeaderButtons.tsx                   # Header buttons for creating/managing transformations
├── DbtDetail.tsx                       # Detailed dbt transformation configuration UI
├── DbtDiscovery.tsx                    # dbt discovery page with compiled queries and timing
├── routes.tsx                          # Route definitions and navigation structure
├── constants.ts                        # Configuration constants and component mappings
├── helpers.ts                          # Helper functions for data transformation
├── helpers.test.ts                     # Tests for helper functions
├── components/
│   ├── NewTransformationButton.tsx     # Button to create new transformation
│   ├── ModalWizard.tsx                 # Multi-step wizard for transformation creation
│   ├── ExecutionStepModal.tsx          # Modal for editing dbt execution steps
│   ├── ThreadsModal.tsx                # Modal for setting dbt thread count
│   ├── CompileResults.tsx              # Display compiled dbt SQL queries
│   ├── GanttChart.tsx                  # Visualization of dbt model execution timing
│   ├── types.ts                        # TypeScript types for components
│   └── configuration-modal/
│       ├── ModalSkeleton.tsx           # Form wrapper for transformation creation
│       ├── GeneralForm.tsx             # General transformation configuration form
│       ├── SelectFormGroup.tsx         # Reusable select dropdown component
│       └── WarehouseInput.tsx          # Backend/warehouse selection component
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/transformations-v2` | Index | Main transformations list with search |
| `/transformations-v2/:component/:config` | GenericIndex | Transformation detail and configuration |
| `/transformations-v2/:component/:config/discovery` | DbtDiscovery | dbt project discovery and SQL compilation view |
| `/transformations-v2/:component/:config/versions` | Versions | Configuration version history |
| `/transformations-v2/:component/:config/notifications` | NotificationDetail | Configuration notifications |
| `/transformations-v2/shared-codes` | SharedCodesIndex | Shared code management |
| `/transformations-v2/shared-codes/:config/:row` | SharedCodesDetail | Shared code editing |

## Key Components

### Index
- **Location**: `apps/kbc-ui/src/scripts/modules/transformations-v2/Index.tsx`
- **Purpose**: Main entry point for the transformations module. Displays all installed transformations with search functionality
- **Props**: None (uses stores)
- **State**: 
  - `filterQuery`: Search query for filtering transformations
- **Features**:
  - Search across transformations and folders
  - Dynamic placeholder showing transformation and folder counts
  - Empty state handling for accounts without pay-as-you-go

### TransformationsConfigs
- **Location**: `apps/kbc-ui/src/scripts/modules/transformations-v2/TransformationsConfigs.tsx`
- **Purpose**: Core component that fetches and displays all transformation configurations with filtering support
- **State Management**: Connects to multiple stores (ApplicationStore, ComponentsStore, InstalledComponentsStore, SandboxesStore, etc.)
- **Features**:
  - Fetches transformation metadata and status
  - Filters configurations by search query (name, description, folder)
  - Integrates sandbox availability
  - Shows latest job status for each configuration
  - Supports pay-as-you-go notifications

### DbtDetail
- **Location**: `apps/kbc-ui/src/scripts/modules/transformations-v2/DbtDetail.tsx`
- **Purpose**: Main configuration UI for dbt transformations. Provides form for editing dbt project settings
- **Key Features**:
  - **Database Connection**: For remote dbt (BigQuery, PostgreSQL, Redshift, MSSQL, Snowflake), configure connection parameters
  - **Git Repository**: Configure dbt project repository URL with optional authentication
  - **Input/Output Mapping**: Configure storage bucket input/output tables using TableInputMapping and TableOutputMapping
  - **Execution Steps**: Define and reorder dbt execution steps (run, test, docs generate, source freshness, etc.)
  - **Freshness Configuration**: Set freshness thresholds for source data validation
  - **Debug Button**: Run `dbt debug` command for troubleshooting
  - **Threads Configuration**: Set number of parallel threads (1-8)
  - **Backend Size**: Select Snowflake compute cluster size (Jobs or Dynamic backend)
  - **dbt Documentation**: Generate and view dbt project documentation

### DbtDiscovery
- **Location**: `apps/kbc-ui/src/scripts/modules/transformations-v2/DbtDiscovery.tsx`
- **Purpose**: Post-execution analysis page for dbt transformations
- **Child Components**:
  - **GanttChart**: Interactive D3.js visualization of model execution timeline
  - **CompileResults**: Display compiled SQL from dbt compilation artifacts
- **Features**:
  - Shows model execution timing breakdown
  - Displays compiled queries for debugging
  - Requires successful dbt run for data availability

### HeaderButtons
- **Location**: `apps/kbc-ui/src/scripts/modules/transformations-v2/HeaderButtons.tsx`
- **Purpose**: Renders header buttons for creating new transformations and folders
- **Child Components**:
  - **CreateFolderButton**: Create new folder for organizing transformations
  - **NewTransformationButton**: Launch transformation creation wizard

### NewTransformationButton
- **Location**: `apps/kbc-ui/src/scripts/modules/transformations-v2/components/NewTransformationButton.tsx`
- **Purpose**: Button that triggers the ModalWizard for creating new transformations
- **Features**:
  - Handles navigation to newly created transformation
  - Disabled in read-only mode

### ModalWizard
- **Location**: `apps/kbc-ui/src/scripts/modules/transformations-v2/components/ModalWizard.tsx`
- **Purpose**: Multi-step wizard for creating new transformations
- **Steps**:
  1. Component Selection (ListModal)
  2. Configuration Form (ModalSkeleton with GeneralForm)
- **Features**:
  - Lists available transformation components filtered by permissions
  - Loads component details before showing creation form
  - Filters out remote dbt transformations from initial list (can be selected as backend option)

### ModalSkeleton
- **Location**: `apps/kbc-ui/src/scripts/modules/transformations-v2/components/configuration-modal/ModalSkeleton.tsx`
- **Purpose**: Form wrapper and submission handler for transformation creation
- **Contains**: GeneralForm with validation and error handling

### GeneralForm
- **Location**: `apps/kbc-ui/src/scripts/modules/transformations-v2/components/configuration-modal/GeneralForm.tsx`
- **Purpose**: Form fields for general transformation configuration
- **Fields**:
  - **Name**: Transformation name (required)
  - **Description**: Optional transformation description
  - **Warehouse**: Backend warehouse selection (dbt transformations only)
  - **Backend Version**: Runtime/image tag selection (if available)
  - **Folder**: Optional folder organization
  - **Code Pattern**: Predefined code pattern selection (if available)

### WarehouseInput
- **Location**: `apps/kbc-ui/src/scripts/modules/transformations-v2/components/configuration-modal/WarehouseInput.tsx`
- **Purpose**: Dropdown for selecting warehouse/backend for dbt transformations
- **Options**:
  - Keboola Storage (default, if component is usable)
  - Remote dbt backends: BigQuery, PostgreSQL, Redshift, MSSQL, Snowflake

### ExecutionStepModal
- **Location**: `apps/kbc-ui/src/scripts/modules/transformations-v2/components/ExecutionStepModal.tsx`
- **Purpose**: Modal for editing individual dbt execution steps
- **Features**:
  - Edit existing execution steps
  - Add new execution steps with command suggestions
  - Step validation

### ThreadsModal
- **Location**: `apps/kbc-ui/src/scripts/modules/transformations-v2/components/ThreadsModal.tsx`
- **Purpose**: Modal dialog for setting dbt thread count (1-8)
- **Features**:
  - Slider picker for intuitive selection
  - Saves to configuration
  - Disabled in read-only mode

### CompileResults
- **Location**: `apps/kbc-ui/src/scripts/modules/transformations-v2/components/CompileResults.tsx`
- **Purpose**: Display compiled dbt SQL queries from latest run
- **Features**:
  - Fetches compiled SQL from dbt artifacts
  - Read-only CodeEditor for viewing
  - Copy to clipboard functionality
  - Loading and error states

### GanttChart
- **Location**: `apps/kbc-ui/src/scripts/modules/transformations-v2/components/GanttChart.tsx`
- **Purpose**: Interactive D3.js visualization of dbt model execution timing
- **Features**:
  - Timeline view with multiple threads
  - Brush selection for zooming
  - Hover tooltips showing timing details
  - Responsive to window resize
  - Calculates and displays execution duration

## Transformation Types and Backends

### Supported Transformation Components
Defined in `constants.ts`:

- **KEBOOLA_LEGACY_TRANSFORMATION**: Legacy SQL transformations (Snowflake)
- **KEBOOLA_SNOWFLAKE_TRANSFORMATION**: Direct Snowflake SQL transformations
- **KEBOOLA_DBT_TRANSFORMATION**: dbt with Keboola Storage backend
- **KEBOOLA_TEST_DBT_TRANSFORMATION**: Test dbt component
- **KEBOOLA_DBT_TRANSFORMATION_LOCAL_BIGQUERY**: dbt with local BigQuery
- **KEBOOLA_DBT_TRANSFORMATION_REMOTE_BIGQUERY**: dbt with remote BigQuery
- **KEBOOLA_DBT_TRANSFORMATION_REMOTE_POSTGRESQL**: dbt with PostgreSQL
- **KEBOOLA_DBT_TRANSFORMATION_REMOTE_REDSHIFT**: dbt with Amazon Redshift
- **KEBOOLA_DBT_TRANSFORMATION_REMOTE_SNOWFLAKE**: dbt with Snowflake (remote)
- **KEBOOLA_DBT_TRANSFORMATION_REMOTE_MSSQL**: dbt with Microsoft SQL Server

### Remote dbt Transformations
- KEBOOLA_DBT_TRANSFORMATION_REMOTE_MSSQL
- KEBOOLA_DBT_TRANSFORMATION_REMOTE_BIGQUERY
- KEBOOLA_DBT_TRANSFORMATION_REMOTE_POSTGRESQL
- KEBOOLA_DBT_TRANSFORMATION_REMOTE_REDSHIFT
- KEBOOLA_DBT_TRANSFORMATION_REMOTE_SNOWFLAKE

### Database Connection Parameters
Configured in `DBT_CONNECTION_INPUTS` constant - each backend has specific input fields:
- **MSSQL**: server, port, user, password, schema, database
- **BigQuery**: project, dataset, key_content, location
- **PostgreSQL**: host, port, user, password, dbname, schema
- **Redshift**: host, port, user, password, dbname, schema
- **Snowflake**: host, warehouse, database, schema, user, password

## Code Editor Integration

### CodeEditor Component
- **Location**: `apps/kbc-ui/src/scripts/react/common/CodeEditor.jsx`
- **Technology**: CodeMirror 5 (legacy wrapper)
- **Features**:
  - Syntax highlighting for SQL, Python, R, JSON
  - Autocomplete (Ctrl+Space or Option+Space)
  - Toggle comments (Ctrl+/ or Cmd+/)
  - Search support (optional)
  - Read-only mode
  - Fixed and responsive sizing

### Code Blocks
- **Location**: `apps/kbc-ui/src/scripts/modules/components/react/components/generic/code-blocks/`
- **Components**:
  - **Block.jsx**: Individual code block wrapper with execution and removal
  - **Code.jsx**: CodeMirror editor instance for code editing
  - **CodeBlocksEditor.jsx**: Main UI for managing multiple code blocks
  - **CodeBlocksConfiguration.jsx**: Configuration form for code blocks

## Input/Output Mapping UI

### TableInputMapping
- **Location**: `apps/kbc-ui/src/scripts/modules/components/react/components/generic/TableInputMapping.jsx`
- **Purpose**: Configure which storage tables feed into the transformation
- **Features**:
  - Add/remove table mappings
  - Configure source table and destination alias
  - Generate dbt sources option
  - Data type and column configuration

### TableOutputMapping
- **Location**: `apps/kbc-ui/src/scripts/modules/components/react/components/generic/TableOutputMapping.jsx`
- **Purpose**: Configure which transformation outputs write back to storage
- **Features**:
  - Map generated tables to storage destinations
  - Configure primary key
  - Incremental load settings

### MappingsWrapper
- Provides consistent styling and layout for mapping UIs

## API Integration

### Docker Actions API
- **Purpose**: Execute synchronous Docker actions for transformations
- **Location**: `apps/kbc-ui/src/scripts/modules/components/DockerActionsApi.ts`
- **Used For**:
  - `dbtDebug`: Run dbt debug command
  - `dbtCompile`: Compile dbt project and return generated SQL
  - `dbtRunResults`: Get execution timing data from artifacts
  - `dbtDocs`: Generate and retrieve dbt documentation HTML

### Artifact Management
- dbt transformations store compilation and run artifacts
- Used to populate discovery page (compiled SQL, timing data)
- Accessible via Docker sync actions

## State Management

### Pattern Used
- **Flux with Immutable.js**: Core application state (stores, configurations)
- **React Local State**: Form data, modal visibility, UI state
- **TanStack Query**: Data fetching and caching (if used in components)

### Key Stores
- **InstalledComponentsStore**: Configuration metadata and data
- **ComponentsStore**: Available components and their definitions
- **StorageTablesStore**: Available storage tables for mapping
- **ApplicationStore**: User permissions, project features
- **RoutesStore**: Current route and parameters
- **NotificationsStore**: Notifications for configurations
- **JobsStore**: Job execution history

### Data Flow
1. User navigates to transformations module
2. InstalledComponentsStore fetches all transformation configurations
3. Metadata fetched for folder information and status
4. Filtered and displayed in TransformationConfigs
5. User creates/edits configuration → form state managed locally
6. Save action → InstalledComponentsActionCreators.saveComponentConfigData
7. Configuration updated in store and displayed

## Dependencies

### Internal Modules
- `modules/components`: Generic component framework (GenericIndex, GenericConfigBody)
- `modules/components/helpers`: getAllowedTransformations, getFolderFromMetadata
- `modules/shared-codes`: Shared code management
- `modules/notifications`: Notification handling
- `modules/sandboxes`: Sandbox/workspace integration
- `modules/runtimes`: Backend version management
- `modules/dev-branches`: Development branch handling
- `modules/oracle-transformation`: Oracle-specific features
- `modules/stack-features`: Feature flags

### External Packages
- **react-bootstrap**: Modal, FormControl, ControlLabel
- **immutable**: List, Map for immutable data structures
- **bluebird**: Promise utilities
- **underscore**: Utility functions
- **d3-array**, **d3-axis**, **d3-brush**, **d3-scale**, **d3-selection**, **d3-time-format**: D3.js visualization
- **react-codemirror2**: CodeMirror editor wrapper (via CodeEditor)
- **dayjs**: Date/time utilities

### Design System Components
- Button, ButtonGroup, IconButton, Icon
- Modal, FormGroup, Label, TextInput, Textarea
- Badge, Tooltip, HelpBlock, Link
- Select, Checkbox
- ClipboardIcon for copy functionality

## Configuration Structure

### Transformation Configuration Schema
```typescript
{
  id: string;
  name: string;
  description?: string;
  version: number;
  configuration: {
    storage?: {
      input?: {
        tables: TableMapping[];
      };
      output?: {
        tables: TableMapping[];
      };
    };
    parameters?: {
      dbt?: {
        threads: number;              // 1-8
        executeSteps: ExecutionStep[];
        freshness?: FreshnessConfig;
        modelNames?: string[];        // Deprecated
      };
      remoteDwh?: {
        // Warehouse-specific connection params
      };
      generateSources?: boolean;
      packages?: string[];
    };
    runtime?: {
      tag?: string;                   // Backend version
      backend?: {
        type?: string;                // Jobs or Dynamic
      };
      codePattern?: {
        componentId?: string;
      };
    };
  };
}
```

## Execution and Monitoring

### Running Transformations
- Click "Run transformation" button in sidebar
- Executes active execution steps in order
- Monitor via job queue
- View results in job detail page

### Execution Steps
- Reorderable list of dbt commands to execute
- Can be activated/deactivated individually
- Common steps: `dbt run`, `dbt test`, `dbt docs generate`, `dbt source freshness`
- Custom steps can be added via ExecutionStepModal

### dbt Debug
- Special execution that runs only `dbt debug`
- Helps troubleshoot connection and project issues
- Results available in job execution logs

### Freshness Monitoring
- Enabled when "dbt source freshness" step is active
- Configurable warning and error thresholds
- Time periods: minute, hour, day
- Validates data recency in source tables

## Notable Patterns

### Form Data Management
- Local state for form with `useState`
- Comparison with stored data to detect changes
- Reset and save functionality with SaveButtons component
- Change descriptions for audit trail

### Immutable Data Structures
- All store data using Immutable.js
- Functional updates using `.setIn()`, `.deleteIn()`, `.mergeDeep()`
- Type safety with `.get()` and `.getIn()` accessors

### Lazy Loading Routes
- Routes use dynamic imports via `lazy: async () => import(...)`
- Reduces initial bundle size
- Data loading via `requireData` callbacks

### Modal Wizards
- Multi-step state management with `componentState`
- Loading states during async operations (component loading, API calls)
- Back button for navigation between steps

### Backend Selection
- dbt transformations allow backend selection between Keboola Storage and remote DWH
- WarehouseInput component handles presentation
- Different connection forms for each backend type
- Stored in `parameters.remoteDwh`

### Readonly State
- Multiple readonly checks throughout module
- Prevents form submission and edit operations
- Tooltips explain why fields are disabled
- Integrated with ApplicationStore.isReadOnly()

## User-Facing Features

### Create Transformation
- **Workflow**:
  1. Click "Create Transformation" button
  2. Select transformation type from component list
  3. Fill in name, description, folder, backend, version
  4. Optional: select code pattern
  5. Submit to create configuration
  6. Redirected to configuration detail page

### Configure dbt Project
- **Steps**:
  1. Provide Git repository URL for dbt project
  2. Configure database connection (if remote dbt)
  3. Add input table mappings from storage
  4. Define execution steps (run, test, docs, etc.)
  5. Set freshness requirements if needed
  6. Configure thread count and backend size
  7. Save and run

### Discovery & Analysis
- **Available After Run**:
  - View Model Timing: Gantt chart of model execution timeline
  - View Compiled Queries: Final SQL generated from dbt templates
  - Copy compiled SQL for analysis

### Execution Step Management
- Drag to reorder steps
- Toggle active/inactive
- Edit step command
- Remove steps
- Add new steps with modal

## Technical Debt & Observations

### Legacy Code Blocks
- `code-blocks` directory uses older React class patterns
- CodeEditor wraps CodeMirror 5 (consider updating to CodeMirror 6)
- Some components mix JSX and older Flux patterns

### Migration Opportunities
- TableInputMapping/TableOutputMapping could use more modern patterns
- Consider consolidating duplicate form component logic
- Error handling could be more consistent across modals

### Performance Considerations
- Large dbt projects with many models may cause Gantt chart rendering delays
- Debounced resize handler on GanttChart
- Filter operations on all transformations could be optimized with useMemo

### Type Safety
- Mixed usage of TypeScript and JavaScript
- Some components (e.g., code-blocks) lack type definitions
- Consider gradual TypeScript migration

### Feature Flags
- Remote dbt transformations gated by allowed components list
- Pay-as-you-go affects available transformation types
- Dev mode restrictions on no-code dbt

## Code Examples

### Creating a New Transformation
```typescript
// Data preparation before API call
const prepareTransformationData = (component: Map<string, any>, tempData: Map<string, any>) => {
  let configuration = Map();

  if (hasGenericCodeBlocksUI(component)) {
    configuration = configuration.setIn(['parameters', 'blocks'], prepareBlocks());
  }

  if (tempData.get('image_tag')) {
    configuration = configuration.setIn(['runtime', 'tag'], tempData.get('image_tag'));
  }

  return {
    componentId: component.get('id'),
    data: Map({
      name: tempData.get('name'),
      description: tempData.get('description', ''),
      configuration: JSON.stringify(configuration.toJS()),
    }).toJS(),
  };
};
```

### Fetching and Displaying Compiled SQL
```typescript
// From CompileResults.tsx
const CompileResults = ({ componentId, configId, configData, onLoad }) => {
  const [data, setData] = useState('');
  
  useEffect(() => {
    callDockerAction(componentId, 'dbtCompile', {
      configData: prepareDbtSyncActionConfigData(configId, configData),
    }).then((response) => {
      if (response?.status === 'error') {
        setError(response?.message);
        return;
      }
      
      const compiledSql = fromJSOrdered(response.compiled)
        .map((sql, name) => `/* ===== ${name} ===== */\n\n${sql}`)
        .join('\n\n');
        
      setData(compiledSql);
      onLoad(compiledSql);
    });
  }, []);
  
  return <CodeEditor value={data} options={{ mode: 'text/x-sql', readOnly: true }} />;
};
```

### Handling Form Changes with Save Buttons
```typescript
// From DbtDetail.tsx
const handleSaveThreads = (threads: number) => {
  return InstalledComponentsActionCreators.saveComponentConfigData(
    componentId,
    configId,
    configData.setIn(['parameters', 'dbt', 'threads'], threads),
    'Change threads',
  );
};
```

## Related Modules

- `modules/components`: Base infrastructure for generic component configuration
- `modules/shared-codes`: Shared code storage and management
- `modules/queue`: Job execution and monitoring
- `modules/sandboxes`: Workspace/sandbox functionality for transformations
- `modules/runtimes`: Backend runtime/version management
- `modules/dev-branches`: Development branch support
- `legacy-transformation`: Legacy SQL transformation module (predecessor)

## Testing

- **Test Coverage**: `helpers.test.ts` covers utility functions
- **Unit Tests**: Jest with Immutable.js test patterns
- **E2E Testing**: Available in `packages/e2e-testing`
- **Key Test Scenarios**:
  - Transformation creation flow
  - Form validation
  - Execution step management
  - Backend selection logic
  
## Files Summary

| File | Purpose |
|------|---------|
| `Index.tsx` | Entry point with search |
| `TransformationsConfigs.tsx` | Main list display and filtering |
| `HeaderButtons.tsx` | Top action buttons |
| `DbtDetail.tsx` | dbt configuration UI |
| `DbtDiscovery.tsx` | Post-run analysis page |
| `routes.tsx` | Route definitions |
| `constants.ts` | Component IDs and config constants |
| `helpers.ts` | Data transformation utilities |
| `components/NewTransformationButton.tsx` | Create button |
| `components/ModalWizard.tsx` | Creation wizard |
| `components/ExecutionStepModal.tsx` | Step editor modal |
| `components/ThreadsModal.tsx` | Thread selector |
| `components/CompileResults.tsx` | Compiled SQL display |
| `components/GanttChart.tsx` | Execution timing visualization |
| `components/configuration-modal/ModalSkeleton.tsx` | Form wrapper |
| `components/configuration-modal/GeneralForm.tsx` | Creation form fields |
| `components/configuration-modal/WarehouseInput.tsx` | Backend selector |
