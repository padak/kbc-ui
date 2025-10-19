# Module: Data Catalog

## Overview

The Data Catalog module manages data sharing and discovery within Keboola Connection. It provides a unified interface for browsing, searching, and managing shared buckets across projects at both project and organization levels. The module supports multiple sharing strategies (organization-wide, project-specific, selected projects, specific users) and includes comprehensive table-level sharing capabilities.

Key features:
- Bucket sharing across projects and organizations
- Fine-grained search and filtering
- Table-level sharing within buckets
- User and project-based access control
- Shared bucket discovery ("Shared with You")
- Bucket ownership management
- Metadata-driven descriptions and categorization

## File Structure

```
data-catalog/
├── types/
│   ├── types.ts                        # TypeScript type definitions
│   └── index.ts                        # Type exports
├── utils/
│   ├── index.ts                        # Main utility exports
│   ├── findAdmin.ts                    # Admin detection utility
│   ├── getUserDetails.ts               # User info extraction
│   ├── getLinkToDetail.ts              # Route link generation
│   ├── sortingBuckets.ts               # Bucket sorting logic
│   ├── sortStorage.ts                  # Storage sorting helpers
│   └── sanitizeMetadata.ts             # Metadata sanitization
├── helpers.ts                          # Helper functions for descriptions
├── helpers.test.ts                     # Helper function tests
├── actions.ts                          # Flux actions for sharing
├── constants.tsx                       # Routes and constants
├── routes.ts                           # Route configuration
├── react/
│   ├── DataCatalogTable.tsx            # Main table component
│   ├── FilterButtons.tsx               # Filter button group
│   ├── FilterButton.tsx                # Individual filter button
│   ├── HeaderButtons.tsx               # Header action buttons
│   ├── Breadcrumb.tsx                  # Breadcrumb navigation
│   ├── LinkButton.tsx                  # Link to bucket button
│   ├── UnlinkButton.tsx                # Unlink bucket button
│   ├── BackendRow.tsx                  # Backend display row
│   ├── SharedWithYou.tsx               # "Shared with You" main view
│   ├── SharedWithYouBuckets.tsx        # Shared buckets list
│   ├── SharedBucketDetail.tsx          # Shared bucket detail view
│   ├── SharedBucketTables.tsx          # Tables in shared bucket
│   ├── SharedBucketHeaderButton.tsx    # Shared bucket header actions
│   ├── SharedToInfo.tsx                # Sharing info display
│   ├── LinkedBy.tsx                    # "Linked by" information
│   ├── UsedByProjectsList.tsx          # Projects using bucket list
│   ├── SharedFromThisProject.tsx       # "Shared from this Project" view
│   ├── SharedFromThisProjectBuckets.tsx# Project buckets list
│   ├── MySharedBucketDetail.tsx        # Owned shared bucket details
│   ├── MySharedBucketHeaderButton.tsx  # Owned bucket header actions
│   ├── ShareModal.tsx                  # Share bucket/tables modal
│   ├── ShareExistingBucket.tsx         # Share existing bucket step
│   ├── ShareWithSelect.tsx             # Recipient selection dropdown
│   ├── DataShareOwnerSelect.tsx        # Owner selection dropdown
│   ├── BucketColorSelect.tsx           # Bucket color picker
│   ├── UserRow.tsx                     # User list row component
│   ├── TabNavigation.tsx               # Tab navigation component
│   ├── ShareSelectedTables/
│   │   ├── ShareSelectedTables.tsx     # Share specific tables step
│   │   ├── TableSelection.tsx          # Table checkbox selection
│   │   ├── TableRow.tsx                # Table list row
│   │   ├── BucketRow.tsx               # Bucket grouping row
│   │   ├── SharingOptions.tsx          # Sharing type options
│   │   └── Search.tsx                  # Table search component
│   └── tableComponents/
│       ├── SortableHeader.tsx          # Sortable table header
│       ├── SharedLabel.tsx             # Shared status badge
│       ├── tableColumns/
│       │   ├── ownerColumn.tsx         # Owner column definition
│       │   ├── sizeColumn.tsx          # Size column definition
│       │   ├── lastModifiedColumn.tsx  # Last modified column
│       │   └── index.ts                # Column exports
│       ├── tableActions/
│       │   ├── ActionsDropdown.tsx     # Action menu
│       │   ├── EditSharing.tsx         # Edit sharing action
│       │   ├── DisableSharing.tsx      # Disable sharing action
│       │   ├── ForceUnlink.tsx         # Force unlink action
│       │   ├── modals/
│       │   │   ├── EditSharingModal.tsx
│       │   │   ├── DisableSharingModal.tsx
│       │   │   ├── ForceUnlinkModal.tsx
│       │   │   └── index.ts
│       │   └── index.ts
│       └── index.ts
└── __tests__/
    └── helpers.test.ts
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/data-catalog-shared-with-you` | SharedWithYou | View buckets shared with current user |
| `/data-catalog-shared-with-you/:projectId/:bucketId` | SharedBucketDetail | View tables in shared bucket |
| `/data-catalog-shared-from-this-project` | SharedFromThisProject | View buckets shared from current project |
| `/data-catalog-shared-from-this-project/:bucketId` | MySharedBucketDetail | View owned bucket sharing details |

**Poll Configuration**: Both routes poll for data every 30 seconds to reflect sharing changes

## Key Components

### DataCatalogTable
- **Location**: `react/DataCatalogTable.tsx`
- **Purpose**: Main table component for displaying buckets with search, filtering, and sorting
- **Props**:
  - `buckets: Map<string, any>` - Immutable map of buckets
  - `getColumns: (query: string) => BucketColumn[]` - Column factory function
  - `sourceTab: SourceTab` - Current tab identifier
  - `currentAdmin: Map<string, any>` - Admin user info
  - `sorter: (a, b) => number` - Custom sort function
- **State**: 
  - `query: string` - Search query from URL
  - `searchFilters: Map<string, any>` - Active filters
- **Key Features**:
  - Uses TanStack React Table for rendering
  - Responsive column visibility (hides size and last_modified on small screens)
  - Keyboard navigation with `onTableRowKeyDown`
  - Handles middle-click for new window opening
  - Integrates with routing for detail navigation

### SharedWithYou
- **Location**: `react/SharedWithYou.tsx`
- **Purpose**: Main view for buckets shared with current user
- **Data Flow**:
  1. Fetches shared buckets from API (action: `loadSharedBuckets()`)
  2. Loads local buckets for linked info (action: `loadBucketsAndTables()`)
  3. Processes metadata for descriptions
  4. Groups by source project
- **Key Pattern**: Combines external shared data with local linked bucket info

### ShareModal
- **Location**: `react/ShareModal.tsx`
- **Purpose**: Multi-step modal for sharing buckets or tables
- **Props**:
  - `showModal: boolean` - Modal visibility
  - `onHide: () => void` - Close handler
  - `modalStep?: ShareModalStep` - Initial step (EXISTING_BUCKET or SELECTED_TABLES)
- **Steps**:
  1. Choose share type or existing bucket
  2. Select recipient (user, project, or predefined group)
  3. Confirm sharing
- **Key Pattern**: Controlled component with internal state for multi-step workflow

### ShareSelectedTables
- **Location**: `react/ShareSelectedTables/ShareSelectedTables.tsx`
- **Purpose**: Step 2 of modal - select specific tables to share
- **Workflow**:
  1. Display buckets with table checkboxes
  2. Allow search filtering
  3. Select sharing options
  4. Create new bucket from selected tables and share it
- **Key Action**: Calls `actions.shareBucket()` to create alias tables and share

### TableComponents
- **Location**: `react/tableComponents/`
- **Purpose**: Modular table column and action definitions
- **Patterns**:
  - Columns are factory functions: `(query: string) => ColumnDef[]`
  - Actions are configurable dropdown menu items
  - Modals for destructive operations (unlink, disable sharing)

## API Endpoints

| Method | Endpoint | Purpose | Response Type |
|--------|----------|---------|---------------|
| GET | `/v2/storage/shared-buckets` | Get shared buckets | List of shared bucket objects |
| GET | `/v2/storage/buckets` | Get project buckets | Map of bucket objects |
| POST | `/v2/storage/buckets` | Create new bucket (for sharing) | Bucket object with ID |
| POST | `/v2/storage/buckets/{id}/tables` | Create alias table | Table object |
| POST | `/v2/storage/buckets/{id}/share` | Share bucket | Sharing info |
| DELETE | `/v2/storage/buckets/{id}/share` | Unshare bucket | Empty response |
| PATCH | `/v2/storage/buckets/{id}/owner` | Update bucket owner | Bucket object |

## State Management

### Patterns Used
1. **Flux Pattern**: For bucket/table state and sharing actions
2. **React State**: Component-level UI state (modal steps, filters)
3. **Immutable.js**: Persistent data structures for performance

### Key Stores/Queries
- **StorageBucketsStore**: Central bucket state from Flux
  - `getBucket(bucketId)`: Get bucket by ID
  - `getSharedBucket(bucketId, currentProjectId, sourceProjectId)`: Get shared bucket
  - Updates triggered by `Storage` action creators

- **Local State**:
  - Search query from URL
  - Active filters (sharing, ownership)
  - Modal step and visibility

### Data Flow
1. Route handler triggers `requireData` (loading initial data)
2. Flux actions populate stores
3. Components subscribe to stores and update on changes
4. User interactions (search, filter, share) dispatch new actions
5. Stores update, components re-render
6. Poll configuration keeps data fresh every 30 seconds

## Dependencies

### Internal Modules
- `modules/storage` - Bucket and table management
- `modules/components` - Metadata and component info
- `modules/admin` - Permission checking and user privileges
- `modules/billing` - Back link for navigation

### External Packages
- **@tanstack/react-table**: Table rendering and management
- **immutable**: Persistent data structures
- **bluebird**: Promise utilities (Promise.each for sequential operations)

### Design System Components
- `Button`, `Modal`, `Select`, `Input`, `Badge`
- `Search` component with typeahead
- `cn` utility for conditional classes

## Notable Patterns

### Shared Bucket Preparation
The module implements sophisticated bucket preparation for sharing:

```typescript
// Combines shared buckets and local linked buckets
prepareSharedBuckets(sharedBuckets, linkedBuckets, projectId)
// Returns enriched bucket data with linking information
// Handles edge case: bucket shared then later linked locally
```

### Metadata-Driven Descriptions
Descriptions are extracted with fallback logic:

```typescript
getSharedBucketDescription(bucket)
// First tries: SHARED_DESCRIPTION metadata (user-provided sharing context)
// Falls back to: DESCRIPTION metadata (general bucket description)
// Final fallback: "No description available"
```

### Search Filtering with Multiple Criteria
Three-level filtering applied in sequence:

```typescript
getFilteredSortedBuckets(buckets, searchFilters, currentAdmin, query, sorter)
1. Query filter: Match name, description, or ID
2. Sharing filter: Check if linked or shared
3. Ownership filter: Check if current user is owner
// Returns filtered and sorted array
```

### Dynamic Column Configuration
Columns are generated based on context:

```typescript
getColumns(query: string): BucketColumn[]
// Columns adapt based on:
// - Current tab (shared with you vs. from this project)
// - Search context (highlight matching fields)
// - Available space (responsive visibility)
```

### Multi-Step Sharing Workflow
Shares are created via Promise sequence:

```typescript
shareBucket({ name, displayName, tables, ... }, sapiToken)
1. Create new bucket
2. Create alias table for each selected table (Promise.each - sequential)
3. Share bucket to recipients
4. Save description metadata
5. Update owner if specified
6. Set color if provided
7. If error: Delete bucket and re-throw
```

### Responsive Table Component
Hides columns on small screens:

```typescript
const HIDDEN_COLUMNS_FOR_SMALL_SCREEN = ['last_modified', 'size']
// useMatchMedia toggles visibility at 1024px breakpoint
```

## User-Facing Features

### Feature 1: Discover Shared Buckets
- **Description**: Browse buckets other projects have shared with you
- **Entry Point**: "Data Catalog" → "Shared with You" tab
- **Workflow**:
  1. View grouped list of shared buckets by source project
  2. Click bucket to see contained tables
  3. View sharing permissions and linked status
- **Components**: `SharedWithYou`, `SharedWithYouBuckets`, `DataCatalogTable`

### Feature 2: Link Shared Buckets
- **Description**: Create local alias bucket to access shared tables
- **Entry Point**: Shared bucket detail → "Link Bucket" button
- **Workflow**:
  1. Creates alias bucket in current project
  2. Creates alias tables for selected tables
  3. Tables become accessible in local Storage
- **Components**: `LinkButton`, `SharedBucketDetail`

### Feature 3: Share Project Buckets
- **Description**: Share buckets with other projects or users
- **Entry Point**: "Data Catalog" → "Shared from This Project" → "Share Bucket"
- **Workflow**:
  1. Modal opens with two options:
     - Share entire existing bucket
     - Share specific tables from any buckets
  2. Select recipient type (organization, projects, users)
  3. Configure owner and color
  4. Confirm sharing
- **Components**: `ShareModal`, `ShareExistingBucket`, `ShareSelectedTables`

### Feature 4: Share Specific Tables
- **Description**: Create new bucket with selected tables for sharing
- **Entry Point**: Share Modal → "Share Selected Tables" option
- **Workflow**:
  1. Search and select tables from any project buckets
  2. System creates new bucket with selected tables (as aliases)
  3. Shares bucket to selected recipients
- **Components**: `ShareSelectedTables`, `TableSelection`, `SharingOptions`

### Feature 5: Manage Shared Buckets
- **Description**: Edit sharing settings or unshare buckets
- **Entry Point**: "Shared from This Project" → bucket dropdown menu
- **Actions**:
  - Edit sharing (change recipient or permissions)
  - Disable sharing (remove all sharing)
  - Force unlink (remove linked buckets in other projects)
- **Components**: `ActionsDropdown`, modals for each action

### Feature 6: Search and Filter
- **Description**: Find buckets by name, ID, or description
- **Search**: Works across all shared bucket data
- **Filters**:
  - LINKED: Show only linked/shared buckets
  - MINE: Show only buckets I own
  - ALL: Show all buckets
- **Components**: `DataCatalogTable`, `FilterButtons`, `FilterButton`

## Technical Debt & Observations

### Current Limitations
1. **Promise-based API**: Uses older Bluebird Promise library instead of native Promises
2. **Immutable.js Everywhere**: All data structures use Immutable.js, adds cognitive load
3. **Modal as Container**: ShareModal is a class component managing complex state
4. **Flux Pattern**: Sharing logic still uses older Flux pattern instead of React Query

### Potential Issues
1. **Sort Stability**: Custom sorter functions could have inconsistent results
2. **Metadata Extraction**: Multiple metadata lookups could be consolidated
3. **Responsive Issues**: Table columns hidden at fixed breakpoint, not responsive
4. **Search Performance**: Search across large bucket lists could be slow

### Areas for Improvement
1. Migrate from Flux to React Query for data fetching
2. Convert ShareModal to functional component with hooks
3. Use native Promises and async/await instead of Bluebird
4. Consolidate metadata extraction logic
5. Implement virtual scrolling for large bucket lists
6. Add more granular access control UI

### Migration Notes
- Data Catalog is heavily Flux-dependent
- Good candidate for React Query migration alongside lineage
- Table component uses TanStack React Table (already modern)
- Modal sharing workflow would benefit from React Hook Form

## Code Examples

### Sharing a Bucket
```typescript
// From actions.ts
DataCatalogActions.shareBucket(
  {
    name: 'shared-bucket-xyz',
    displayName: 'My Shared Data',
    description: 'Data for external team',
    stage: 'out',
    tables: new Map([['table1', 'table1'], ['table2', 'table2']]),
    sharedType: SHARED_TYPES.ORGANIZATION_MEMBER,
    color: '#FF5733',
    ownerId: 12345,
  },
  sapiToken,
);

// Internally performs:
// 1. Storage.createBucket()
// 2. Storage.createAliasTable() for each table
// 3. Storage.shareBucket('organization', bucketId, {})
// 4. Metadata.saveMetadata() for description
// 5. Storage.updateBucketOwnerAction() if owner provided
// 6. Storage.updateBucket() if color provided
```

### Searching and Filtering Buckets
```typescript
// Filtering applied in sequence
const filtered = getFilteredSortedBuckets(
  buckets.toArray(),
  Map({
    [FILTERS_GROUP.SHARING]: FILTERS.LINKED,  // Show only linked
    [FILTERS_GROUP.OWNERSHIP]: FILTERS.MINE,  // Show only mine
  }),
  currentAdmin,
  'data',  // Search term
  (a, b) => a.get('displayName').localeCompare(b.get('displayName')),  // Sort by name
);
// Returns: only linked buckets I own that match "data"
```

### Table Column Definition
```typescript
// Column factories create context-aware columns
const ownerColumn: ColumnDef<BucketType> = {
  accessorKey: 'owner.name',
  header: 'Owner',
  cell: (info) => {
    const owner = info.row.original.getIn(['owner', 'name']);
    const email = info.row.original.getIn(['owner', 'email']);
    return <div>{owner} ({email})</div>;
  },
  size: 200,
};
```

## Related Modules

- `modules/storage` - Core bucket and table management
- `modules/billing` - Back link from billing to data catalog
- `modules/admin` - Permission checking for sharing actions
- `modules/components` - Metadata constants and utilities

## Testing

### Test Files
- `helpers.test.ts`: Tests for description extraction and utility functions

### Coverage Areas
1. Metadata extraction with fallbacks
2. Bucket filtering with multiple criteria
3. Sharing action validation
4. Table selection and alias creation

### Testing Approach
- Unit tests for pure helper functions
- Mock Immutable.js data structures for tests
- Integration tests for Flux action dispatches
- Component tests using React Testing Library

## Accessibility

- Sortable headers clearly indicate sort direction
- Filter buttons labeled with aria-label
- Search input has clear label and placeholder
- Tables support keyboard navigation (arrow keys, enter)
- Modal forms include proper labels and error messages
- Color picker includes text labels, not just colors

## Performance Considerations

1. **Immutable.js Structures**: Enables structural sharing and memoization
2. **Metadata Caching**: Descriptions extracted once and memoized
3. **Column Visibility**: Responsive toggling prevents unnecessary renders
4. **Table Virtualization**: Could benefit from virtual scrolling (future)
5. **Search Debouncing**: Could be added to search component for large lists
