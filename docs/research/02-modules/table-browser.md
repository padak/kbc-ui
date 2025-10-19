# Module: Table Browser

## Overview

The Table Browser module provides a focused, full-screen modal interface for browsing and managing detailed table information. It serves as a complementary view to the main Storage module, displaying comprehensive table metadata, schema, data preview, snapshots, usage statistics, and lineage. This module allows users to explore individual tables in depth without the hierarchical bucket/table navigation of the main storage interface. It's particularly useful for data discovery, schema validation, and table-specific operations.

## File Structure

```
table-browser/
├── Index.tsx                          # Main table browser modal component
└── constants.ts                       # Route names and configuration
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/table-browser/:tableId` | Index | Full-screen table preview modal (Overview tab) |
| `/table-browser/:tableId/schema` | Index | Table schema editor tab |
| `/table-browser/:tableId/data-sample` | Index | Data preview tab |
| `/table-browser/:tableId/events` | Index | Table events tab |
| `/table-browser/:tableId/snapshots` | Index | Snapshots and restore tab |
| `/table-browser/:tableId/usage` | Index | Table usage statistics tab |
| `/table-browser/:tableId/lineage` | Index | Data lineage visualization tab |

## Key Components

### Index (Table Browser Main)
- **Location**: `apps/kbc-ui/src/scripts/modules/table-browser/Index.tsx`
- **Purpose**: Full-screen modal for browsing and managing table details with multiple tabs
- **Props**: None (route-driven)
- **State**: Uses store subscriptions for:
  - Table data (`StorageTablesStore`)
  - Related bucket data (`StorageBucketsStore`)
  - Table snapshots (`StorageTablesStore`)
  - Table aliases and links (computed from table data)
  - Permissions (write bucket, manage buckets)
  - Application context (feature flags, project ID, AI lineage)
  - Dev branch context
- **Child Components**:
  - TableOverview (table metadata display)
  - TableSchema (schema editor)
  - DataSample (data preview)
  - TableEvents (event audit log)
  - Snapshots (snapshot management)
  - TableUsage (usage statistics)
  - TablesLineage (AI-powered data lineage - optional)
  - ColumnsPreview (column listing)
  - DataSampleColumnOrderInfo (column ordering UI)
  - DataSampleHelp (data preview help)
  - TableActions (action menu)
  - TabNav (tab navigation)
  - FullScreenModal (modal wrapper)
- **Key Features**:
  - Seven tabs for different aspects of table management
  - Comprehensive table metadata display
  - Full schema editor with column operations
  - Data preview with filtering, sorting, searching
  - Snapshot management and time-travel recovery
  - Usage tracking across configurations
  - Optional AI-powered data lineage visualization
  - Integration with dev branches and feature flags
  - Permission-based feature visibility
  - Responsive modal design
  - Breadcrumb navigation to parent bucket

### Tab System
The table browser implements comprehensive tab-based navigation:

**Overview Tab** (Default)
- Table metadata:
  - Table name, type indicators (typed, external, alias)
  - Row and column counts
  - Storage size and datatype information
  - Creation date and last modification
  - Backend-specific schema/table names
- Alias management:
  - List of created aliases for this table
  - Alias filter configuration
  - Links to other projects
- Import history:
  - Latest imports graph
  - Import metadata
- Primary key info:
  - Current primary key columns
  - Option to set/modify primary key

**Schema Tab**
- Column list with:
  - Column names and data types
  - Type indicators (nullable, default, etc.)
  - Column descriptions (markdown support)
  - Usage indicators (which aliases use this column)
- Column operations:
  - Add new column with type selection
  - Edit column description
  - Change column type (with validation)
  - Delete columns
- Primary key management:
  - Set primary key
  - Modify existing key
  - Delete primary key
- Usage tracking:
  - Shows where each column is used
  - Validation when changing types

**Data Sample Tab**
- Table data preview:
  - First N rows from table (limit configurable)
  - All columns from table
- Search and filtering:
  - Full-text search by value or column name
  - WHERE clause filtering
  - Multi-column sorting
  - Column reordering (persisted in localStorage)
- Display options:
  - Column visibility toggle
  - Copy cell values to clipboard
  - Responsive column width
  - Row count display
- Navigation:
  - Pagination for large results
  - Offset tolerance for dynamic columns

**Events Tab**
- Audit trail of table changes:
  - All operations (create, modify, delete, export, etc.)
  - Timestamps and user information
  - Detailed change descriptions
- Event filtering and search
- Export event log functionality

**Snapshots Tab** (Not for aliases)
- Snapshot list:
  - Snapshot identifiers and creation dates
  - Description and metadata
  - Creator information
- Snapshot operations:
  - Create new snapshot with description
  - Restore table to previous snapshot
  - Delete snapshots
  - View snapshot details

**Usage Tab**
- Configuration usage:
  - List of components using this table
  - Component types and IDs
  - Configuration names
  - Last modification dates
- Usage statistics:
  - How often table is accessed
  - What types of operations use it
- Related configurations:
  - Links to configurations
  - Usage patterns

**Lineage Tab** (Optional, AI-powered)
- Data lineage visualization:
  - Upstream data sources
  - Downstream dependencies
  - Transformation chain
  - Component dependencies
- Interactive graph:
  - Click to explore relationships
  - Filter by relationship type
  - Zoom and pan
- Requires feature flags:
  - `hasAiLineage`: AI lineage enabled for project
  - `hasAllowedAi`: User has AI feature access
  - Not shown in dev mode

## API Endpoints

| Method | Endpoint | Purpose | Response Type |
|--------|----------|---------|---------------|
| GET | `/v2/storage/tables/{tableId}` | Get table details and schema | Table |
| GET | `/v2/storage/tables/{tableId}/data-preview` | Get data preview rows | DataPreview |
| GET | `/v2/storage/tables/{tableId}/snapshots` | List table snapshots | SnapshotList |
| GET | `/v2/storage/tables/{tableId}/events` | Get table event audit log | EventList |
| PUT | `/v2/storage/tables/{tableId}` | Update table metadata | Table |
| POST | `/v2/storage/tables/{tableId}/columns` | Add column | Column |
| PUT | `/v2/storage/tables/{tableId}/columns/{columnName}` | Update column metadata | Column |
| DELETE | `/v2/storage/tables/{tableId}/columns` | Delete columns | - |
| DELETE | `/v2/storage/tables/{tableId}/rows` | Delete rows with conditions | - |
| POST | `/v2/storage/tables/{tableId}/export` | Export table | Job |
| POST | `/v2/storage/tables/{tableId}/snapshots` | Create snapshot | Snapshot |
| DELETE | `/v2/storage/tables/{tableId}/snapshots/{snapshotId}` | Delete snapshot | - |
| POST | `/v2/storage/tables/{tableId}/restore-from-snapshot` | Restore from snapshot | - |
| GET | `/v2/storage/tables/{tableId}?include=aliases` | Get table with aliases | Table |

## State Management

### Pattern Used
- **Primary**: Flux stores with Immutable.js
- **Secondary**: React hooks for component lifecycle
- **Tertiary**: localStorage for data sample column ordering

### Key Stores
- **StorageTablesStore**: Provides table data and snapshots
  - `getTable(id)`: Individual table data
  - `getTableSnapshots(id)`: Snapshot list
  - `getAddingColumn()`: Column creation state
  - `getDeletingColumn()`: Column deletion state
- **StorageBucketsStore**: Parent bucket data
- **ApplicationStore**: Permissions, project ID, feature flags
- **DevBranchesStore**: Dev branch context
- **ComponentsStore**: Configuration usage data
- **InstalledComponentsStore**: Configuration instances
- **StackFeaturesStore**: Feature availability

### Data Flow

```
Route Params (tableId)
    ↓
useStores subscription to StorageTablesStore, StorageBucketsStore, etc.
    ↓
Table data and related data loaded from stores
    ↓
Computed derived data (aliases, links, permissions)
    ↓
Modal rendered with appropriate tab content
    ↓
User interacts with table (modify schema, preview data, etc.)
    ↓
Action creators update stores
    ↓
Component re-renders with new data
```

## Dependencies

### Internal Modules
- `modules/storage` - TableOverview, TableSchema, DataSample, Snapshots, TableEvents, TableUsage, ColumnsPreview, TableActions, ExportModal, DeleteRowsModal
- `modules/lineage/TablesLineage` - Data lineage visualization (optional)
- `modules/admin/privileges` - Permission checking (canWriteBucket, canManageBuckets)
- `modules/components/StorageActionCreators` - Table operations
- `modules/components/stores/StorageTablesStore` - Table data
- `modules/components/stores/StorageBucketsStore` - Bucket data
- `modules/components/stores/ComponentsStore` - Configuration data
- `modules/components/stores/InstalledComponentsStore` - Configuration instances
- `modules/dev-branches` - Dev branch context
- `modules/stack-features/Store` - Feature flags

### External Packages
- `immutable` - Data structures
- `react-bootstrap` - Modal components
- `@keboola/design` - Design system components
- `@keboola/api-client` - API client
- `@keboola/utils` - Utilities

### Design System Components
- `Button`, `ButtonLink`, `ButtonGroup` - Action buttons
- `Icon`, `IconButton` - Icons
- `Modal` - Modal wrapper
- `Alert` - Alerts
- `RadioGroup` - Form controls
- `Tooltip` - Help tooltips

## Notable Patterns

### 1. Multi-Tab Interface Pattern
Implements tab switching via route parameters with conditional rendering:

```typescript
const activeTab = RoutesStore.getCurrentRouteParam('tableTab') || tableTabs.OVERVIEW;

const renderTabContent = () => {
  if (activeTab === tableTabs.SCHEMA) {
    return <TableSchema {...props} />;
  }
  if (activeTab === tableTabs.DATA_SAMPLE) {
    return <DataSample {...props} />;
  }
  // ... other tabs
};
```

### 2. Computed Data from Store Selectors
Derives table aliases and links from table data:

```typescript
const tableAliases = getTableAliases(state.table, state.tables, state.sapiToken);
const tableLinks = getTableLinks(
  state.table,
  state.buckets.get(state.table.getIn(['bucket', 'id']), Map())
);
```

### 3. Feature Flag-Based Tab Visibility
Shows lineage tab only when feature is enabled:

```typescript
{state.hasAiLineage &&
  state.hasAllowedAi &&
  !state.isDevModeActive &&
  renderTabLink(tableTabs.LINEAGE, <BetaTitle>Data Lineage</BetaTitle>)}
```

### 4. Permission-Based Feature Display
Controls visibility based on user permissions:

```typescript
const canWriteBucket = canWriteBucket(sapiToken, bucket);
const canManageBuckets = canManageBuckets(sapiToken);

// Show schema edit UI only if permissions allow
if (canWriteBucket) {
  return <TableSchema canWriteBucket={true} {...props} />;
}
```

### 5. Breadcrumb Navigation
Shows path back to parent bucket:

```typescript
<div className="breadcrumb">
  <RouterLink
    to={bucketBrowserRouteNames.BUCKET_PREVIEW}
    params={{ bucketId: state.bucket.get('id') }}
  >
    <Icon icon="folder" />
    {state.bucket.get('displayName')}
  </RouterLink>
</div>
```

### 6. Modal Dismissal with Context Preservation
Handles modal close while maintaining navigation context:

```typescript
const onHide = () => {
  const { pathname, query, hash } = parseLocationContext(
    state.routerState.get('location', Map()),
  );
  
  RoutesStore.getRouter().transitionTo(pathname, null, query, hash);
};
```

### 7. Force Update for Complex State
Uses forceUpdate for cases where Immutable.js equality doesn't work:

```typescript
const forceUpdate = useForceUpdate();

// Pass to child components that modify state outside React
<DataSample
  onChangeColumnOrder={forceUpdate}
/>
```

## User-Facing Features

### Feature 1: View and Understand Table Structure
- **Description**: Browse complete table metadata and schema
- **Workflow**:
  1. Open table browser from storage module
  2. View table name, type, and general information
  3. See row/column counts and storage size
  4. Click "Schema" tab to explore columns
  5. View column names, types, and descriptions
  6. Click column to see detailed type information
  7. View column usage in aliases
  8. See primary key configuration

- **Components**: TableOverview, TableSchema, ColumnsPreview

### Feature 2: Edit Table Schema
- **Description**: Modify table structure by adding, modifying, or deleting columns
- **Workflow**:
  1. Open table browser with write access
  2. Click "Schema" tab
  3. Click "Add Column" button
  4. Enter column name and select data type
  5. Optional: add column description (markdown supported)
  6. Save column - appears in table
  7. To modify column:
     - Click column name to edit
     - Change type or description
     - System validates changes (warns if type change might break aliases)
  8. To delete columns:
     - Select columns with checkboxes
     - Click "Delete Selected Columns"
     - Confirm deletion

- **Components**: TableSchema, CreateColumnModal, ColumnDescriptionModal, ColumnDatatypes, DeleteColumnsModal

### Feature 3: Preview Table Data
- **Description**: Browse and explore table data with search, filter, and sort
- **Workflow**:
  1. Click "Data Sample" tab
  2. View first N rows (default limit 1000)
  3. Search rows:
     - Enter search term in search box
     - Choose search type: by column name (KEY) or value (VALUE) or both (ALL)
     - Results filtered and displayed
  4. Sort data:
     - Click column header to sort ascending
     - Click again to sort descending
     - Holds Shift and click for multi-column sort
  5. Filter rows:
     - Add WHERE conditions (column = value, > , <, etc.)
     - Multiple conditions combined with AND
     - See row count change as filters applied
  6. Reorder columns:
     - Drag column headers to reorder
     - Order persisted in localStorage
     - "Reset Column Order" button to restore default
  7. Copy cell values:
     - Right-click or click copy icon in cell
     - Value copied to clipboard

- **Components**: DataSample, DataSampleColumnOrderInfo, DataSampleHelp

### Feature 4: Manage Snapshots
- **Description**: Create backups and restore tables to previous states
- **Workflow**:
  1. Click "Snapshots" tab (not for aliases)
  2. View list of existing snapshots:
     - Snapshot ID and creation date
     - Description if provided
     - Creator information
  3. Create snapshot:
     - Click "Create Snapshot"
     - Enter optional description
     - System creates snapshot (may take time)
     - Confirmation message shown
  4. Restore from snapshot:
     - Select snapshot from list
     - Click "Restore" button
     - Confirm restoration (overwrites current data)
     - System restores table data
  5. Delete snapshot:
     - Click delete icon next to snapshot
     - Confirm deletion
     - Snapshot removed (frees storage)

- **Components**: Snapshots, CreateSnapshotModal

### Feature 5: Monitor Table Events
- **Description**: View complete audit trail of table changes
- **Workflow**:
  1. Click "Events" tab
  2. See list of events with timestamps
  3. Event types visible: create, modify, delete, export, restore, etc.
  4. View event details:
     - User who performed action
     - What changed (column added, type modified, etc.)
     - Timestamp of change
  5. Optional: filter by event type
  6. Optional: export event log

- **Components**: TableEvents, Events

### Feature 6: Track Table Usage
- **Description**: See where table is used across configurations
- **Workflow**:
  1. Click "Usage" tab
  2. View list of components using this table:
     - Component type (Extractor, Transformation, etc.)
     - Component name and ID
     - Configuration using table
     - Last modification date
  3. Click configuration to navigate to it
  4. See usage patterns:
     - Input mapping: table used as input data source
     - Output mapping: component writes to this table
  5. Understand table importance:
     - Many configurations depend on this table
     - Changes might have broad impact

- **Components**: TableUsage

### Feature 7: Explore Data Lineage (Optional)
- **Description**: Visualize AI-powered data lineage showing data flow
- **Workflow**:
  1. Table must have AI lineage feature enabled
  2. Click "Data Lineage" tab (Beta)
  3. See interactive graph showing:
     - Upstream data sources feeding into table
     - Downstream uses of table data
     - Transformation chains
     - Component dependencies
  4. Interact with graph:
     - Click nodes to explore relationships
     - Hover for details
     - Zoom and pan to navigate
     - Filter by relationship type
  5. Understand data flow:
     - Where data comes from (data sources, previous transformations)
     - Where data goes (downstream components, other tables)

- **Components**: TablesLineage (from lineage module)

### Feature 8: Navigate to Bucket View
- **Description**: Switch to bucket-focused view
- **Workflow**:
  1. Click breadcrumb with bucket name
  2. Table browser modal closes
  3. Bucket browser modal opens
  4. View all tables in bucket
  5. Can return to table view from bucket overview

- **Components**: Breadcrumb navigation link

## Technical Debt & Observations

### Complex Tab System
The number of tabs (7) creates complexity in the main Index component with conditional rendering logic:

```typescript
const renderTabContent = () => {
  // Long if-else chain for each tab type
  if (activeTab === tableTabs.SCHEMA) { ... }
  if (activeTab === tableTabs.DATA_SAMPLE) { ... }
  // etc.
};
```

Could be refactored with a tab registry pattern or tab component mapping.

### Reuse from Storage Module
Most components are imported from storage module rather than implemented locally. This makes table-browser lightweight but tightly couples it to storage:

```typescript
import TableSchema from '@/modules/storage/components/TableSchema';
import DataSample from '@/modules/storage/components/DataSample';
// ... many more imports
```

### Data Derivation
Significant computation happens to derive aliases and links:

```typescript
const tableAliases = getTableAliases(state.table, state.tables, state.sapiToken);
const tableLinks = getTableLinks(state.table, state.buckets.get(...));
```

Could benefit from memoization if table lists become very large.

### Feature Flag Complexity
Shows/hides lineage tab based on multiple feature flags:

```typescript
{state.hasAiLineage &&
  state.hasAllowedAi &&
  !state.isDevModeActive &&
  ...}
```

Could be extracted to a computed property for clarity.

## Code Examples

### Example 1: Store Subscription with Derived Data
```typescript
// In Index.tsx
const state = useStores(
  () => {
    const tableId = RoutesStore.getCurrentRouteParam('tableId');
    const table = StorageTablesStore.getTable(tableId, Map(), { 
      caseInsensitiveFallback: true 
    });
    const bucket = table.get('bucket', Map());
    
    return {
      table,
      bucket,
      tableId,
      activeTab: RoutesStore.getCurrentRouteParam('tableTab') || tableTabs.OVERVIEW,
      tables: StorageTablesStore.getAll() as Map<string, any>,
      buckets: StorageBucketsStore.getAll(),
      snapshots: StorageTablesStore.getTableSnapshots(tableId),
      // ... many other properties
    };
  },
  [],
  [StorageTablesStore, StorageBucketsStore, RoutesStore],
);
```

### Example 2: Computed Aliases and Links
```typescript
// In Index.tsx
const tableAliases = getTableAliases(state.table, state.tables, state.sapiToken);
const tableLinks = getTableLinks(
  state.table,
  state.buckets.get(state.table.getIn(['bucket', 'id']), Map())
);

// Pass to TableSchema for usage display
<TableSchema
  tableAliases={tableAliases}
  tableLinks={tableLinks}
  {...otherProps}
/>
```

### Example 3: Conditional Tab Rendering
```typescript
// In Index.tsx
const renderTabContent = () => {
  if (state.activeTab === tableTabs.SCHEMA) {
    return (
      <TableSchema
        sapiToken={state.sapiToken}
        tables={state.tables}
        table={state.table}
        // ... more props
      />
    );
  }

  if (state.activeTab === tableTabs.DATA_SAMPLE) {
    return (
      <DataSample
        backend={state.bucket.get('backend')}
        table={state.table}
        bucket={state.bucket}
        onChangeColumnOrder={forceUpdate}
      />
    );
  }
  
  // ... other tabs
};
```

### Example 4: Breadcrumb Navigation
```typescript
// In Index.tsx
const renderBreadcrumb = () => {
  const location = state.routerState.get('location', Map());
  
  return (
    <div className="breadcrumb">
      <RouterLink
        className="active dark muted"
        to={bucketBrowserRouteNames.BUCKET_PREVIEW}
        query={{ context: location.getIn(['query', 'context']) }}
        params={{ bucketId: state.bucket.get('id') }}
      >
        <Icon icon="folder" />
        {state.bucket.get('displayName')}
      </RouterLink>
    </div>
  );
};
```

## Related Modules

- `modules/storage` - Core storage functionality, reuses most components
- `modules/bucket-browser` - Complementary module for bucket-focused browsing
- `modules/lineage/TablesLineage` - Data lineage visualization (optional)
- `modules/admin/privileges` - Permission system
- `modules/sapi-events` - Event data source
- `modules/components` - Storage API integration

## Testing

### Test Coverage
- Limited test files in table-browser (minimal module)
- Most testing coverage in storage module for reused components

### Testing Approach
- Mock route parameters to test table ID extraction
- Mock store data for different table types (regular, alias, external)
- Test tab switching logic
- Test breadcrumb navigation
- Test feature flag-based UI (lineage tab visibility)
- Test permission-based feature visibility

### Integration Points to Test
- Store subscription lifecycle
- Route parameter extraction (case-insensitive fallback)
- Tab navigation and state persistence
- Computed derived data (aliases, links)
- Modal dismissal with context preservation
- Permission-based feature visibility (schema editing, usage tab)

### Notable Testing Gaps
- No comprehensive E2E tests for all tab workflows
- Limited testing for cross-module integration (storage ↔ table-browser)
- Error handling for missing/deleted tables needs coverage
