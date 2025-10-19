# Module: Storage

## Overview

The Storage module is the core data management interface for Keboola, providing comprehensive functionality for managing buckets, tables, files, and snapshots. It implements a hierarchical data storage system with support for multiple database backends (Snowflake, Redshift, Synapse, Exasol, Teradata, BigQuery), data preview and sampling, schema editing, table operations, and storage snapshots for time travel and recovery.

## File Structure

```
storage/
├── Index.tsx                          # Main storage explorer component
├── Bucket.tsx                         # Bucket detail page
├── Table.tsx                          # Table detail page
├── Files.tsx                          # File management page
├── Events.tsx                         # Events page
├── Jobs.tsx                           # Jobs monitoring page
├── api.ts                             # Storage API wrapper
├── actions.tsx                        # Flux action creators
├── store.ts                           # Flux store for search/filters
├── types.ts                           # TypeScript type definitions
├── constants.ts                       # Routes, action types, constants
├── helpers.ts                         # Utility functions
├── components/
│   ├── IndexTable/                    # Main table component with hierarchical structure
│   ├── BucketOverview.tsx             # Bucket metadata display
│   ├── BucketActions.tsx              # Bucket action buttons
│   ├── TableOverview.tsx              # Table metadata display
│   ├── TableActions.tsx               # Table action buttons
│   ├── TableSchema.tsx                # Schema editor component
│   ├── DataSample.tsx                 # Data preview with filtering/sorting
│   ├── ExportModal.tsx                # Export configuration modal
│   ├── Snapshots.tsx                  # Snapshot/restore interface
│   ├── DeleteRowsModal/               # Row deletion workflow
│   ├── CreateBucketModal.tsx          # Bucket creation form
│   ├── CreateTableModal.tsx           # Table creation form
│   ├── DeleteBucketModal.tsx          # Bucket deletion confirmation
│   ├── DeleteTableModal.tsx           # Table deletion confirmation
│   ├── TruncateTableModal.tsx         # Table truncation confirmation
│   ├── CreateSnapshotModal.tsx        # Snapshot creation
│   ├── ColumnDatatypes.tsx            # Column type editor
│   ├── ColumnDescriptionModal.tsx     # Column metadata editor
│   ├── CreateColumnModal.tsx          # Column creation
│   ├── DeleteColumnsModal.tsx         # Column deletion
│   ├── UploadModal.tsx                # File upload interface
│   ├── RegisterExternalBucketModal.tsx# External bucket registration
│   └── [Additional UI components]
└── components/IndexTable/
    ├── IndexTable.tsx                 # Hierarchical table renderer
    ├── IndexTableResults.tsx          # Search results table
    └── components/
        ├── ExpandableTable.tsx        # Expandable rows
        ├── ResultsFlatTable.tsx       # Flat results rendering
        ├── BucketCell.tsx             # Bucket row cell
        ├── TableCell.tsx              # Table row cell
        ├── TableActions.tsx           # Row actions menu
        ├── BucketActions.tsx          # Bucket actions menu
        ├── CellSelection.tsx          # Multi-select checkbox
        ├── HeaderSelection.tsx        # Header multi-select
        └── LastChangeColumn.tsx       # Sorting column header
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/storage` | Index | Main storage explorer with bucket/table tree |
| `/storage/:bucketId/table/:tableId` | Table | Table detail view with schema, data, snapshots |
| `/storage/:bucketId` | Bucket | Bucket detail view with tables and events |
| `/storage/files` | Files | File storage management |
| `/storage/jobs` | Jobs | Storage job monitoring and history |
| `/storage/events` | Events | Storage-level events log |
| `/storage/data-streams` | DataStreams | Data stream configuration (optional) |

## Key Components

### Index (Main Storage Explorer)
- **Location**: `apps/kbc-ui/src/scripts/modules/storage/Index.tsx`
- **Purpose**: Main entry point for storage management, displays hierarchical bucket/table tree with search and filtering
- **Props**: None (store-driven)
- **State**: 
  - Search query and filters (Flux store)
  - Selected rows for bulk operations
  - Modal visibility states (delete, export, snapshot, workspace, share)
- **Child Components**: 
  - StorageTabs (tab navigation)
  - Search (query input with filter buttons)
  - IndexTable (hierarchical bucket/table display)
  - IndexTableResults (search results display)
  - Multiple modals (Delete, Export, Snapshot, CreateWorkspace, Share)
- **Key Features**:
  - Hierarchical display with bucket expansion/collapse
  - Full-text search across buckets and tables
  - Multi-criteria filtering (sharing, entity type, dev branch)
  - Bulk operations on selected rows
  - Integration with workspaces and sharing systems

### IndexTable / IndexTableResults
- **Location**: `apps/kbc-ui/src/scripts/modules/storage/components/IndexTable/`
- **Purpose**: Renders the main bucket/table tree with rows, columns, sorting, selection
- **Props**:
  - `buckets`: Map of buckets with nested tables
  - `expandedBuckets`: Map tracking which buckets are expanded
  - `deletingTables`/`deletingBuckets`: Loading states
  - `exportingTables`/`createSnapshotsTables`: Operation states
  - Various callback handlers
- **State**: 
  - Sorting state (entity, order)
  - Expanded buckets (toggled via callbacks)
  - Selection (checkboxes for multi-select)
- **Rendering Strategy**:
  - Uses TanStack Table for column definition and sorting
  - Implements expandable row pattern for bucket->table hierarchy
  - Each row contains: selection checkbox, name/icon, metadata, actions menu, status indicators
  - Includes header with column sorting controls
  - Real-time status indicators for pending operations (deleting, exporting, snapshotting)

### BucketOverview
- **Location**: `apps/kbc-ui/src/scripts/modules/storage/components/BucketOverview.tsx`
- **Purpose**: Display bucket metadata, statistics, tables, and usage information
- **Props**:
  - `bucket`: Bucket data (Immutable Map)
  - `tables`: Tables in bucket
  - `allBuckets`: All buckets (for aliases/links)
  - Various action/state props
- **State**: Class component with local state for modals
- **Display Elements**:
  - Bucket name and stage (in/out)
  - Backend info (Snowflake, Redshift, etc.) with backend-specific details
  - Sharing and linking information
  - Table list with TablesList component
  - Storage usage statistics
  - Latest imports with graph visualization

### TableOverview
- **Location**: `apps/kbc-ui/src/scripts/modules/storage/components/TableOverview.tsx`
- **Purpose**: Display table metadata, structure, aliases, and usage
- **Props**:
  - `table`: Table data (Immutable Map)
  - `tableAliases`: Array of alias table references
  - `tableLinks`: External project links
  - Various callback props
- **Display Elements**:
  - Table name and type indicators
  - Column count and row count
  - Primary key information
  - Creation date and last change info
  - Alias filter configuration
  - Import history graph
  - Usage statistics across configurations

### TableSchema
- **Location**: `apps/kbc-ui/src/scripts/modules/storage/components/TableSchema.tsx`
- **Purpose**: Display and edit table schema with column metadata
- **Props**:
  - `table`: Table data
  - `tables`: All tables (for type information)
  - `canWriteBucket`: Permission to modify schema
  - Metadata and column deletion state
- **State**: Class component managing:
  - Selected columns for bulk operations
  - Modal visibility (create column, edit description, delete columns)
  - Sample data for column type preview
- **Features**:
  - Column list with type, description, and usage indicators
  - Add column functionality with type selection
  - Edit column description (markdown support)
  - Bulk column deletion with confirmation
  - Column usage indicator (shows which aliases use this column)
  - Type change validation (warns if column used in aliases)
  - Sample data preview for context

### DataSample
- **Location**: `apps/kbc-ui/src/scripts/modules/storage/components/DataSample.tsx`
- **Purpose**: Display table data preview with filtering, sorting, and search capabilities
- **Props**:
  - `table`: Table metadata
  - `bucket`: Bucket metadata (for backend info)
  - `backend`: Database backend type
  - `fullScreen`: Enable full-screen mode
  - `onChangeColumnOrder`: Callback for column reordering
- **State**: Class component with:
  - `rows`: List of preview rows
  - `sortBy`: Map of column sort directions
  - `filters`: Map of active filters
  - `activeFilters`: Map of display filters
  - `searchQuery`: Search text in location state
  - `searchType`: Search type (KEY, VALUE, ALL)
- **Data Loading**: 
  - Calls `dataPreview` action to fetch filtered/sorted rows
  - Uses cancellable promises to prevent race conditions
  - Supports column offset tolerance for dynamic column reordering
- **Features**:
  - Full-text search across row values or column headers
  - Multi-column sorting with UI indicators
  - Row filtering with WHERE clause construction
  - Column reordering with localStorage persistence
  - Column search/filtering
  - Responsive table height calculation
  - Copy-to-clipboard for cell values

### ExportModal
- **Location**: `apps/kbc-ui/src/scripts/modules/storage/components/ExportModal.tsx`
- **Purpose**: Configure and trigger table export operations
- **Props**:
  - `show`: Modal visibility
  - `tables`: Selected tables to export (List of Maps)
  - `onSubmit`: Export trigger callback
  - `onHide`: Close handler
- **State**: Class component with:
  - `exportAs`: Selected export format (GZIP, CSV, XLSX)
  - `isLoading`: Operation state
  - `exports`: Previous export history (for single table)
  - `showAllExports`: Pagination toggle for export list
- **Export Formats**:
  - GZIP: Compressed CSV (100 GB limit)
  - CSV: Plain CSV (100 GB limit)
  - XLSX: Excel format (250 MB limit)
- **Features**:
  - Export size validation with limit warnings
  - Previous exports display for redownload
  - Single/multiple table support (multiple exports as one file)
  - File size display and formatting
  - Contact support link for oversized exports

### DeleteRowsModal
- **Location**: `apps/kbc-ui/src/scripts/modules/storage/components/DeleteRowsModal/`
- **Purpose**: Multi-step workflow for deleting table rows with conditions
- **Components**:
  - `DeleteRowsModal.tsx`: Main modal container with step logic
  - `FormStep.tsx`: Row deletion form with WHERE conditions and date filters
  - `PreviewStep.tsx`: Preview of rows to be deleted with confirmation
  - `TableRowsPreview.tsx`: Table display of preview rows
- **Props**:
  - `show`: Modal visibility
  - `table`: Table to delete rows from
  - `onHide`: Close handler
- **Workflow**:
  1. FormStep: User enters deletion criteria (WHERE filters, date range)
  2. Preview generated via `api.storage.tables.getDataPreview()`
  3. PreviewStep: User confirms deletion of matched rows
  4. Deletion executed via storage API
- **Features**:
  - Multiple WHERE filter conditions
  - Date range filtering (changedSince/changedUntil)
  - Row preview before deletion
  - Error handling for no matching rows

### Snapshots
- **Location**: `apps/kbc-ui/src/scripts/modules/storage/components/Snapshots.tsx`
- **Purpose**: Manage table snapshots for backup and time-travel recovery
- **Props**:
  - `snapshots`: List of available snapshots
  - `table`: Table data
  - `creatingFromSnapshot`: Operation state
- **Features**:
  - List existing snapshots with creation date and description
  - Create new snapshot with description
  - Restore table from snapshot
  - Delete snapshots
  - Snapshot metadata display

## API Endpoints

| Method | Endpoint | Purpose | Response Type |
|--------|----------|---------|---------------|
| GET | `/v2/storage/buckets` | List all buckets | BucketList |
| GET | `/v2/storage/buckets/{bucketId}` | Get bucket details | Bucket |
| POST | `/v2/storage/buckets` | Create new bucket | Bucket |
| PUT | `/v2/storage/buckets/{bucketId}` | Update bucket | Bucket |
| DELETE | `/v2/storage/buckets/{bucketId}` | Delete bucket | - |
| GET | `/v2/storage/buckets/{bucketId}/tables` | List tables in bucket | TableList |
| GET | `/v2/storage/tables/{tableId}` | Get table details | Table |
| POST | `/v2/storage/buckets/{bucketId}/tables` | Create table | Table |
| PUT | `/v2/storage/tables/{tableId}` | Update table | Table |
| DELETE | `/v2/storage/tables/{tableId}` | Delete table | - |
| GET | `/v2/storage/tables/{tableId}/data-preview` | Get data preview (rows) | DataPreview |
| DELETE | `/v2/storage/tables/{tableId}/rows` | Delete rows with conditions | - |
| POST | `/v2/storage/tables/{tableId}/columns` | Add column | Column |
| PUT | `/v2/storage/tables/{tableId}/columns/{columnName}` | Update column metadata | Column |
| DELETE | `/v2/storage/tables/{tableId}/columns` | Delete columns | - |
| POST | `/v2/storage/tables/{tableId}/snapshots` | Create snapshot | Snapshot |
| GET | `/v2/storage/tables/{tableId}/snapshots` | List snapshots | SnapshotList |
| DELETE | `/v2/storage/tables/{tableId}/snapshots/{snapshotId}` | Delete snapshot | - |
| POST | `/v2/storage/tables/{tableId}/restore-from-snapshot` | Restore from snapshot | - |
| POST | `/v2/storage/tables/{tableId}/export` | Export table | Job |
| GET | `/v2/storage/files` | List files | FileList |
| POST | `/v2/storage/files` | Upload file | File |
| DELETE | `/v2/storage/files/{fileId}` | Delete file | - |

## State Management

### Pattern Used
- **Primary**: Flux architecture with Immutable.js for main data (buckets, tables, files)
- **Secondary**: React state for UI ephemeral state (modal visibility, selection, loading)
- **Tertiary**: localStorage for DataSample column ordering

### Key Stores/Queries
- **StorageStore** (`store.ts`): Local UI state
  - `searchQuery`: Current search text
  - `searchFilters`: Applied search filters (entity type, sharing, dev branch)
  - `expandedBuckets`: Map of expanded bucket IDs
  - `bucketsSort`: Sort configuration (entity, order)
  - `showAllBuckets`: Toggle for showing all buckets

- **StorageBucketsStore** (from components module): Bucket data
  - `getAll()`: All buckets in project
  - `getBucket(id)`: Specific bucket
  - `getPendingBucketsActions()`: Deletion/operation states

- **StorageTablesStore** (from components module): Table data
  - `getAll()`: All tables across buckets
  - `getTable(id)`: Specific table
  - `getDeletingTables()`: Tables being deleted
  - `getExportingTables()`: Tables being exported
  - `getCreatingSnapshotsTables()`: Snapshots being created
  - `getTableSnapshots(id)`: Snapshots for table

### Data Flow

```
User Action (UI)
    ↓
Action Creator (actions.tsx)
    ↓
API Call via StorageActionCreators or apiClient
    ↓
Dispatcher
    ↓
Store Update (StorageStore, StorageBucketsStore, StorageTablesStore)
    ↓
Component Re-render via useStores hook
```

**Example: Delete Table**
1. User clicks delete button on table row
2. `handleOpenDeleteTableModal()` triggered
3. `DeleteTableModal` component displayed with confirmation
4. User confirms → `deleteTable(tableId)` called
5. `StorageActionCreators.deleteTable()` makes API call
6. `StorageTablesStore` emits change with `deletingTables` state
7. UI shows loading indicator
8. API completes → tables reloaded
9. Confirmation notification displayed

## Dependencies

### Internal Modules
- `modules/admin/privileges` - Permission checking (canWriteBucket, canExportTable, etc.)
- `modules/components/StorageActionCreators` - Storage API wrapper
- `modules/components/stores/StorageBucketsStore` - Bucket data store
- `modules/components/stores/StorageTablesStore` - Table data store
- `modules/components/MetadataActionCreators` - Column metadata operations
- `modules/dev-branches` - Dev branch context and helpers
- `modules/sandboxes` - Workspace/sandbox integration
- `modules/lineage/TablesLineage` - Data lineage visualization
- `modules/sapi-events` - Event logging
- `modules/data-catalog/react/ShareModal` - Sharing functionality
- `modules/stack-features/Store` - Feature flags

### External Packages
- `immutable` - Immutable data structures
- `react-bootstrap` - Modal, form components
- `@keboola/design` - Design system components (Button, Icon, Modal, etc.)
- `@keboola/api-client` - API client for data operations
- `@keboola/utils` - String manipulation utilities
- `bluebird` - Promise utilities (Promise.each, etc.)
- `underscore` - Utility functions
- `qs` - Query string parsing/serialization

### Design System Components
- `Button`, `ButtonLink`, `IconButton`, `Icon` - Action triggers
- `Modal` - Modal dialogs
- `Search` - Search input with filters
- `Alert` - Alerts and notifications
- `Tooltip`, `InfoTooltip` - Contextual help
- `RadioGroup`, `Checkbox` - Form controls
- `Separator` - Visual dividers
- `ClipboardInline` - Copy-to-clipboard

## Notable Patterns

### 1. Flux Architecture with Immutable.js
The module maintains backward compatibility with Flux while components use React hooks. Data is stored as Immutable Maps/Lists to prevent accidental mutations and enable deep equality comparisons.

```typescript
// Store getter example
const buckets = StorageBucketsStore.getAll(); // Returns Immutable Map
const tables = buckets.get('bucketId').get('tables'); // Immutable operations
```

### 2. useStores Hook for Store Subscriptions
Components subscribe to multiple stores at once with cleanup:

```typescript
const state = useStores(
  () => {
    return {
      bucket: StorageBucketsStore.getBucket(bucketId),
      tables: StorageTablesStore.getAll(),
      // ... other store data
    };
  },
  [], // Dependencies
  [StorageBucketsStore, StorageTablesStore], // Stores to listen to
);
```

### 3. Hierarchical Table Rendering
The IndexTable implements a bucket/table hierarchy using depth tracking:

```typescript
// Flatten hierarchy for table rendering
const data = buckets.flatMap((bucket) => [
  { item: bucket, depth: 0, parentId: null },
  ...bucket.get('tables').map((table) => ({
    item: table,
    depth: 1,
    parentId: bucket.get('id'),
  }))
]);
```

### 4. Modal State Management
Modals are managed at Index level with dedicated state properties:

```typescript
const [state, setState] = useState({
  showDeleteModal: false,
  selected: [],
  // ... other modal states
});

// Open modal with context
const handleOpenDeleteModal = (selected) => {
  setState(prev => ({
    ...prev,
    showDeleteModal: true,
    selected,
  }));
};
```

### 5. Column Order Persistence
DataSample persists column order in localStorage:

```typescript
// Save order
localStorage.setItem(TABLE_COLUMNS_ORDER + tableId, JSON.stringify(order));

// Load order
const savedOrder = localStorage.getItem(TABLE_COLUMNS_ORDER + tableId);
```

### 6. Filtering and Sorting with URL State
Search filters are persisted in URL query string:

```typescript
// Update URL and store
RoutesStore.getRouter().updateQuery({
  q: searchQuery,
  filter: qs.stringify(filters.toJS()),
});
```

### 7. Dev Branch Integration
Components check dev branch context to show appropriate warnings/UI:

```typescript
if (isCreatedInDevBranch(table)) {
  return <DevBranchWarning />;
}
```

## User-Facing Features

### Feature 1: Browse and Manage Buckets
- **Description**: Browse hierarchical bucket/table structure, expand/collapse buckets, view bucket metadata
- **Workflow**:
  1. Navigate to Storage module
  2. View all project buckets in left panel or expandable tree
  3. Click bucket to expand and see contained tables
  4. Click bucket name to open bucket detail view
  5. View bucket metadata: backend type, creation date, storage usage
  6. Create new bucket with "Create Bucket" button
  7. Edit bucket name and description
  8. Delete bucket (with confirmation)

- **Components**: Index, IndexTable, BucketOverview, CreateBucketModal, DeleteBucketModal

### Feature 2: Table Management and Schema Editing
- **Description**: View table structure, edit schema (columns, types, primary keys), add/remove columns
- **Workflow**:
  1. Select table from bucket
  2. Click "Schema" tab
  3. View current columns with types and descriptions
  4. Add new column with type selection
  5. Edit column description (markdown support)
  6. Change column type (with validation if used in aliases)
  7. Delete columns with confirmation
  8. Set/change primary key
  9. Track column usage across aliases

- **Components**: TableSchema, ColumnDatatypes, ColumnDescriptionModal, CreateColumnModal, DeleteColumnsModal, CreatePrimaryKey

### Feature 3: Data Preview and Filtering
- **Description**: Preview table data with filtering, sorting, and searching capabilities
- **Workflow**:
  1. Select table and click "Data Sample" tab
  2. See preview of first N rows
  3. Search rows by column value or name
  4. Sort by clicking column headers (multi-sort supported)
  5. Filter with WHERE clauses (column = value, column > value, etc.)
  6. Reorder columns (persisted in localStorage)
  7. Copy cell values to clipboard
  8. View filtered row count
  9. Navigate through large datasets with pagination

- **Components**: DataSample, DataSampleColumnOrderInfo, DataSampleHelp

### Feature 4: Export Tables
- **Description**: Export selected tables in various formats (CSV, GZIP, XLSX)
- **Workflow**:
  1. Select one or more tables
  2. Click "Export" button
  3. Select export format (GZIP, CSV, XLSX)
  4. System validates file size against format limit
  5. Shows warning if export exceeds format limit
  6. For single table: shows previous exports for redownload
  7. Submit export
  8. Job created in Jobs section
  9. Download exported file when complete

- **Components**: ExportModal, JobsTable

### Feature 5: Delete Table Rows
- **Description**: Delete table rows matching specific conditions
- **Workflow**:
  1. Select table and click "Delete Rows" action
  2. Define deletion criteria:
     - Add WHERE filters (column conditions)
     - Optional date range (changedSince/changedUntil)
  3. Preview rows that will be deleted
  4. Confirm deletion
  5. Rows deleted via API
  6. Confirmation notification shown

- **Components**: DeleteRowsModal (FormStep, PreviewStep, TableRowsPreview)

### Feature 6: Snapshots and Restore
- **Description**: Create snapshots of table state for backup and time-travel recovery
- **Workflow**:
  1. Select table and click "Snapshots" tab
  2. View list of existing snapshots with creation dates
  3. Create new snapshot with optional description
  4. Restore table to previous snapshot state (creates new version)
  5. Delete snapshots to free up storage
  6. Compare snapshot metadata

- **Components**: Snapshots, CreateSnapshotModal

### Feature 7: Search and Filter Storage
- **Description**: Search buckets and tables by name, filter by type and sharing status
- **Workflow**:
  1. Use search box at top of storage explorer
  2. Type bucket or table name (> 1 character for search)
  3. Apply filters:
     - Entity type: All, Buckets, Tables, Dev branch
     - Sharing: All, Linked, Shared
  4. Results displayed in dedicated table
  5. Clear search to return to hierarchical view
  6. Filter state persisted in URL

- **Components**: Index, IndexTableResults, Search

### Feature 8: File Management
- **Description**: Upload, view, and manage files in storage
- **Workflow**:
  1. Navigate to Files tab
  2. View file list with metadata (size, created date, tags)
  3. Upload new files with optional tags
  4. Search files by name/tag
  5. Download files
  6. Delete files
  7. Set file expiration

- **Components**: Files, FilesTable, UploadModal, UploadFileButton

## Technical Debt & Observations

### Legacy Patterns
1. **Flux Architecture**: Core data management still uses Flux with Immutable.js, while new code increasingly uses TanStack Query and React hooks. This creates a dual state management paradigm.
2. **Class Components**: Some complex components (DataSample, TableSchema, BucketOverview) are still class components rather than functional components with hooks.
3. **Immutable.js**: Heavy use of Immutable.js throughout increases bundle size and has a learning curve. Could migrate to native JavaScript objects over time.

### Complexity Hotspots
1. **IndexTable Hierarchical Rendering**: The bucket/table tree rendering logic is complex with depth tracking and nested selection states. Could benefit from a dedicated tree component library.
2. **DataSample Filtering**: Complex logic for filter parsing, WHERE clause construction, and multi-column sorting. Well-tested but high maintenance burden.
3. **Modal State Explosion**: 8+ modal visibility states in Index component make component harder to follow. Could use a state machine approach.

### Areas for Improvement
1. **Accessibility**: Table components could better support keyboard navigation (arrow keys, tab navigation).
2. **Performance**: Large table lists could benefit from virtualization (react-window or react-virtualized).
3. **Error Handling**: Some API errors silently fail; could improve error messaging and recovery workflows.
4. **Type Safety**: Many Map operations lack proper typing; could use stricter TypeScript generics.

### Migration Notes
- **Flux → TanStack Query**: Tables and buckets data could migrate to TanStack Query for better cache management and background updates.
- **Class Components → Functional**: DataSample, TableSchema, and others could be converted to functional components with hooks.
- **Immutable.js → Native Objects**: Consider gradual migration to native JavaScript objects for better compatibility.

## Code Examples

### Example 1: Fetching and Displaying Bucket Data
```typescript
// In Index.tsx
const state = useStores(
  () => {
    const bucketId = RoutesStore.getCurrentRouteParam('bucketId');
    const bucket = StorageBucketsStore.getBucket(bucketId, Map());
    const tables = StorageTablesStore.getAll().filter(
      (table) => table.getIn(['bucket', 'id']) === bucketId,
    );
    
    return { bucket, tables };
  },
  [],
  [StorageBucketsStore, StorageTablesStore],
);
```

### Example 2: Filtering and Sorting Data Preview
```typescript
// In DataSample.tsx
const fetchDataPreview = () => {
  const params = {
    limit: previewLimit,
    order_by: prepareOrderBy(this.state.sortBy),
    where_filters: prepareWhereFilters(this.state.filters),
    columns: selectedColumns,
  };
  
  dataPreview(this.props.table.get('id'), params)
    .then((rows) => {
      this.setState({ rows: List(rows), isLoading: false });
    })
    .catch(handleError);
};
```

### Example 3: Multi-Step Modal for Deleting Rows
```typescript
// In DeleteRowsModal.tsx
const [step, setStep] = useState(STEPS.FORM);
const [params, setParams] = useState(DEFAULT_PARAMS);

const loadPreview = async () => {
  const previewData = await api.storage.tables.getDataPreview(
    table.get('id'),
    { limit: previewLimit, ...validParams }
  );
  
  setPreviewData(previewData);
  setStep(STEPS.PREVIEW);
};
```

### Example 4: Managing Selected Rows for Bulk Operations
```typescript
// In Index.tsx
const handleOpenDeleteModal = (selected: Map<string, any>[]) => {
  const selectedBuckets = selected.filter((row) => row.has('stage'));
  const selectedTables = selected.filter((row) => !row.has('stage'));
  
  // Dispatch appropriate deletion function
  if (selectedBuckets.length > 0) {
    deleteBucketsAndTables(selected);
  }
};
```

## Related Modules

- `modules/components` - Core storage API client and action creators
- `modules/admin` - Privilege/permission checking
- `modules/dev-branches` - Dev branch context and operations
- `modules/sandboxes` - Workspace creation from storage tables
- `modules/data-catalog` - Data sharing and discovery
- `modules/lineage` - Data lineage visualization
- `modules/sapi-events` - Event logging and history

## Testing

### Test Coverage
- Unit tests for helpers (filtering, sorting, validation) in `helpers.test.ts`
- Component tests for critical modals (export, delete, create)
- Integration tests for multi-step workflows

### Key Test Files
- `helpers.test.ts`: Helper function validation (1000+ LOC)
- `RefreshExternalBucketMenuItem.test.tsx`: External bucket operations

### Testing Approach
- Jest for unit tests
- React Testing Library for component tests
- Immutable.js equality assertions for store state
- Mock StorageActionCreators and API responses
- Test user workflows (not implementation details)

### Notable Gaps
- Limited E2E tests for complex workflows
- DataSample component lacks unit tests (complex class component)
- Export modal size validation needs expanded test coverage
