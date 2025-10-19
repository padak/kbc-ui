# Module: Bucket Browser

## Overview

The Bucket Browser module provides a focused, preview-style interface for browsing and managing a single bucket's contents. It serves as a full-screen modal overlay that displays bucket overview with tables, events, and metadata. This module differs from the main Storage module by providing a scoped view of one bucket rather than the entire project storage hierarchy. It's primarily used as a secondary exploration interface accessible from the main Storage module and other parts of the application.

## File Structure

```
bucket-browser/
├── Index.tsx                          # Main bucket browser modal component
└── constants.ts                       # Route names and configuration
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/bucket-browser/:bucketId` | Index | Full-screen bucket preview modal |
| `/bucket-browser/:bucketId/events` | Index | Bucket events tab in modal |

## Key Components

### Index (Bucket Browser Main)
- **Location**: `apps/kbc-ui/src/scripts/modules/bucket-browser/Index.tsx`
- **Purpose**: Full-screen modal for browsing and managing a single bucket with its tables
- **Props**: None (route-driven)
- **State**: Uses store subscriptions for:
  - Bucket data (`StorageBucketsStore`)
  - Table data (`StorageTablesStore`)
  - Table operations (deleting, exporting, truncating, snapshotting)
  - Permissions (export, write access)
  - Application context (pay-as-you-go, URL templates, dev mode)
- **Child Components**:
  - BucketOverview (from storage module)
  - BucketEvents (from storage module)
  - BucketActions (action button menu)
  - TabNav (tab navigation)
  - FullScreenModal (modal wrapper)
- **Key Features**:
  - Displays bucket with all contained tables
  - Two tabs: Overview (default) and Events
  - Overview tab shows bucket metadata and table list
  - Events tab shows audit log for bucket changes
  - Action buttons for common bucket operations
  - "Explore in Storage" button to navigate to main storage module
  - Reload data button for manual refresh
  - Responsive design with scroll support
  - Dev branch integration with visual indicators
  - Permission-based feature visibility

### Tab System
The bucket browser implements tab-based navigation:

**Overview Tab**
- Displays bucket metadata:
  - Bucket name and stage (in/out)
  - Backend type (Snowflake, Redshift, etc.)
  - Storage backend info with tooltips
- Shows table list with:
  - Table names with icons
  - Row/column count
  - Last modification date
  - Creation metadata
  - Actions menu per table
- Displays bucket statistics:
  - Total storage used
  - Latest import information
  - Usage across configurations
- Integration with sandboxes:
  - Quick "Create Workspace" from bucket
  - Transformation component templates

**Events Tab**
- Shows audit trail of bucket operations
- Event types: created, modified, deleted, restored, shared
- Event details: timestamp, user, action, parameters
- Filterable by event type
- Export events functionality

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/v2/storage/buckets/{bucketId}` | Get bucket details |
| GET | `/v2/storage/buckets/{bucketId}/tables` | List tables in bucket |
| GET | `/v2/storage/buckets/{bucketId}/events` | Get bucket events |
| PUT | `/v2/storage/buckets/{bucketId}` | Update bucket metadata |
| DELETE | `/v2/storage/buckets/{bucketId}` | Delete bucket |
| POST | `/v2/storage/tables/{tableId}/export` | Export table from bucket |
| DELETE | `/v2/storage/tables/{tableId}` | Delete table from bucket |

## State Management

### Pattern Used
- **Primary**: Flux stores with Immutable.js (same as storage module)
- **Secondary**: React hooks for component lifecycle

### Key Stores
- **StorageBucketsStore**: Provides bucket data
- **StorageTablesStore**: Provides table data filtered for bucket
- **ApplicationStore**: Permission and feature flag context
- **DevBranchesStore**: Dev branch context
- **SandboxesStore**: Available workspaces

### Data Flow

```
Route Params (bucketId)
    ↓
useStores subscription to StorageBucketsStore, StorageTablesStore
    ↓
Bucket and table data populated from stores
    ↓
Modal rendered with BucketOverview or BucketEvents component
```

## Dependencies

### Internal Modules
- `modules/storage` - BucketOverview, BucketEvents, BucketActions components
- `modules/admin/privileges` - Permission checking
- `modules/components/StorageActionCreators` - Bucket/table operations
- `modules/components/stores/StorageBucketsStore` - Bucket data
- `modules/components/stores/StorageTablesStore` - Table data
- `modules/dev-branches` - Dev branch context
- `modules/sandboxes` - Workspace integration
- `modules/sapi-events/BucketEventsService` - Event data loading

### External Packages
- `immutable` - Data structures
- `react-bootstrap` - Modal components
- `@keboola/design` - Design system components
- `@keboola/utils` - Utilities

### Design System Components
- `Button`, `ButtonLink`, `ButtonGroup` - Action buttons
- `Icon`, `IconButton` - Icons
- `Modal` - Modal wrapper
- `Separator` - Visual dividers

## Notable Patterns

### 1. Full-Screen Modal Pattern
Uses `FullScreenModal` wrapper to display bucket browser as overlay:

```typescript
<FullScreenModal className="full-screen-generic-overview" onHide={onHide}>
  <Modal.Header>
    {/* Breadcrumb and title */}
  </Modal.Header>
  <Modal.Body>
    {renderTabs()}
  </Modal.Body>
</FullScreenModal>
```

### 2. Tab-Based Navigation
Implements tab switching via route parameters:

```typescript
const activeTab = RoutesStore.getCurrentRouteParam('bucketTab') || bucketTabs.OVERVIEW;

const renderTabLink = (tab: string, label: string) => {
  return (
    <TabLink
      active={state.activeTab === tab}
      to={routeNames.BUCKET_PREVIEW}
      params={{ bucketId: state.bucketId, bucketTab: tab }}
      query={{ context: state.routerState.getIn(['location', 'query', 'context']) }}
    >
      {label}
    </TabLink>
  );
};
```

### 3. Modal Dismissal with Context
Properly handles modal close with location context preservation:

```typescript
const onHide = () => {
  const { pathname, query, hash } = parseLocationContext(
    state.routerState.get('location', Map()),
  );
  
  RoutesStore.getRouter().transitionTo(pathname, null, query, hash);
};
```

### 4. Permission-Based Feature Display
Shows features based on SAPI token permissions:

```typescript
const canExportTable = canExportTable(sapiToken);
const canWriteBucket = canWriteBucket(sapiToken, bucket);

// Features only shown if permissions allow
if (canExportTable) {
  // Show export button
}
```

### 5. Dev Branch Context Integration
Integrates with dev branch to show appropriate UI:

```typescript
const isDevModeActive = DevBranchesStore.isDevModeActive();

// Show dev branch indicator if applicable
if (isCreatedInDevBranch(bucket)) {
  return <Icon icon="git-branch" className="dev-indicator" />;
}
```

## User-Facing Features

### Feature 1: Browse Bucket Overview
- **Description**: View bucket metadata and contained tables
- **Workflow**:
  1. Open bucket browser from storage module
  2. See bucket name and backend type
  3. View backend-specific information (schema path, dataset name, etc.)
  4. Browse list of tables in bucket
  5. View table metadata (rows, columns, size, created date)
  6. See when each table was last modified

- **Components**: BucketOverview, TablesList

### Feature 2: Access Bucket Events
- **Description**: View audit trail of bucket changes
- **Workflow**:
  1. Click "Events" tab
  2. See list of bucket operations with timestamps
  3. View operation type (create, modify, delete, share, etc.)
  4. See user who performed operation
  5. View operation details (what changed)
  6. Filter by event type if needed
  7. Export event log

- **Components**: BucketEvents, Events

### Feature 3: Navigate to Table Browser
- **Description**: From bucket view, navigate to specific table details
- **Workflow**:
  1. In bucket overview, locate table
  2. Click table row or name
  3. Opens table browser modal (or navigates to table-browser module)
  4. View table schema, data sample, snapshots, etc.
  5. Can return to bucket view

- **Components**: TablesList with links to table-browser

### Feature 4: Perform Bucket Actions
- **Description**: Execute common bucket operations
- **Workflow**:
  1. Use action menu in bucket header
  2. Options vary by permissions and context:
     - Edit bucket name/description (if write access)
     - Delete bucket (if write access)
     - Share bucket (if sharing available)
     - Create snapshot (if supported)
  3. Action modals appear for confirmation/input
  4. Operation executes
  5. Confirmation notification shown

- **Components**: BucketActions

### Feature 5: Create Workspace from Bucket
- **Description**: Quick creation of transformation workspace using bucket tables
- **Workflow**:
  1. Select tables from bucket view
  2. Click "Create Workspace" button
  3. Workspace creation modal appears with table input mappings pre-filled
  4. Choose workspace type (Python, SQL, etc.)
  5. Configure workspace parameters
  6. Submit to create workspace

- **Components**: AddSandboxModal (from storage module)

### Feature 6: Navigate to Full Storage Explorer
- **Description**: Switch from bucket-focused view to full storage explorer
- **Workflow**:
  1. Click "Explore in Storage" button in header
  2. Modal closes
  3. Main Storage module opens with same bucket expanded
  4. Can navigate entire storage hierarchy from there

- **Components**: Navigation link to storage module

## Technical Debt & Observations

### Minimal Module
The bucket-browser module is quite minimal with only 2 files. Most functionality is delegated to storage module components:

```typescript
// Almost all content comes from storage module
<BucketOverview
  bucket={state.bucket}
  tables={state.tables}
  // ... many props
/>
```

### Potential Consolidation
Could be consolidated into storage module as a modal route rather than separate module. However, keeping separate maintains loose coupling and allows independent feature development.

### Missing Features
- No direct workspace creation UI (uses storage module's AddSandboxModal)
- Limited bucket-specific operations compared to storage module
- No bucket export functionality from this view

### Performance Considerations
- Loads full bucket data from store on each render
- No lazy loading or pagination for large bucket tables
- Consider adding virtualization if bucket has thousands of tables

## Code Examples

### Example 1: Store Subscription for Bucket Data
```typescript
// In Index.tsx
const state = useStores(
  () => {
    const routerState = RoutesStore.getRouterState();
    const bucketId = RoutesStore.getCurrentRouteParam('bucketId');
    const bucket = StorageBucketsStore.getBucket(bucketId, Map());
    const allTables = StorageTablesStore.getAll() as Map<string, any>;
    const tables = allTables.filter(
      (table) => table.getIn(['bucket', 'id']) === bucketId
    ) as Map<string, any>;

    return {
      bucket,
      tables,
      bucketId,
      activeTab: RoutesStore.getCurrentRouteParam('bucketTab') || bucketTabs.OVERVIEW,
      // ... other state
    };
  },
  [],
  [StorageTablesStore, StorageBucketsStore, RoutesStore],
);
```

### Example 2: Tab Navigation
```typescript
// In Index.tsx
const renderTabLink = (tab: string, label: string) => {
  return (
    <TabLink
      active={state.activeTab === tab}
      to={routeNames.BUCKET_PREVIEW}
      params={{ bucketId: state.bucketId, bucketTab: tab }}
      query={{ context: state.routerState.getIn(['location', 'query', 'context']) }}
    >
      {label}
    </TabLink>
  );
};

// Render both tabs
<TabNav className="no-shrink pr-2">
  {renderTabLink(bucketTabs.OVERVIEW, 'Overview')}
  {renderTabLink(bucketTabs.EVENTS, 'Events')}
</TabNav>
```

### Example 3: Conditional Tab Content
```typescript
// In Index.tsx
const renderTabContent = () => {
  if (state.activeTab === bucketTabs.EVENTS) {
    return (
      <BucketEvents 
        eventsFactory={eventsFactory(state.bucket.get('id'))} 
        admins={state.admins} 
      />
    );
  }

  return (
    <BucketOverview
      bucket={state.bucket}
      tables={state.tables}
      // ... many props
    />
  );
};
```

### Example 4: Data Reload Button
```typescript
// In Index.tsx
const [isReloadingData, setIsReloadingData] = useState(false);

<Button
  variant="outline"
  onClick={() => {
    setIsReloadingData(true);
    StorageActionCreators.loadBucketDetailForce(state.bucketId).finally(() => {
      setIsReloadingData(false);
    });
  }}
  disabled={isReloadingData}
>
  {isReloadingData ? <Loader /> : <Icon icon="rotate" fixedWidth />}
  Reload Data
</Button>
```

## Related Modules

- `modules/storage` - Core storage functionality, reuses many components
- `modules/table-browser` - Complementary module for table-focused browsing
- `modules/admin/privileges` - Permission system
- `modules/sandboxes` - Workspace creation integration
- `modules/sapi-events` - Event data source

## Testing

### Test Coverage
- Limited test files (bucket-browser is minimal module)
- Most testing coverage in storage module for reused components

### Testing Approach
- Mock route parameters
- Test store subscriptions with mock data
- Verify tab switching logic
- Test modal dismissal and context preservation

### Integration Points to Test
- Store subscription lifecycle
- Route parameter extraction
- Tab navigation and state
- Permission-based feature visibility
