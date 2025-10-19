# Module: Trash

## Overview

The Trash module manages deleted component configurations, providing users with a recovery mechanism for accidentally deleted items. It displays a searchable, filterable list of deleted components and their configurations with detailed metadata. The module supports selective restoration of individual configurations, bulk deletion to permanently purge items, and filtering by creator/admin. It integrates with TanStack Query for data fetching and provides a clean, intuitive UI for managing deleted items before they reach permanent deletion.

## File Structure

```
trash/
├── constants.ts                       # Route names
├── routes.ts                          # Route definition
├── types.ts                           # TypeScript type definitions
├── utils.ts                           # Utility functions (filtering, sorting, etc.)
├── react/
│   ├── pages/
│   │   └── TrashIndex.tsx             # Main trash list page
│   └── components/
│       ├── TrashHeaderButtons.tsx     # Header action buttons
│       ├── DeletedComponentRow.tsx    # Component row with configurations
│       ├── DeletedConfigurationRow.tsx# Configuration row with actions
│       ├── DeleteConfigurationButton.tsx # Permanent delete button
│       ├── RestoreConfigurationButton.tsx # Restore button
│       └── EmptyBox.tsx               # Empty state display
└── rqHooks/
    ├── useDeletedComponents.ts        # Fetch deleted components (React Query)
    ├── useDeleteComponent.tsx         # Delete component mutation
    ├── useDeleteAllComponents.ts      # Bulk delete mutation
    ├── useRestoreConfiguration.ts     # Restore configuration mutation
    └── useRestoreMultipleConfigurations.tsx # Bulk restore mutation
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/settings-trash` | TrashIndex | Main trash management interface |

## Key Components

### TrashIndex (Main Trash Page)
- **Location**: `apps/kbc-ui/src/scripts/modules/trash/react/pages/TrashIndex.tsx`
- **Purpose**: Display all deleted components and configurations with search and filtering
- **Props**: None (store-driven)
- **State**:
  - Search query (URL-based)
  - Filter (all, or by admin/creator)
  - Deleted components data (from React Query)
  - Loading/error states
- **Child Components**:
  - TrashHeaderButtons (header actions)
  - Search input (real-time search)
  - RadioGroup filter (all vs my components)
  - DeletedComponentRow (each component)
  - EmptyBox (empty state)
  - LazyList (lazy rendering for performance)
- **Key Features**:
  - Real-time search across component and config names/descriptions
  - Filter by creator (show all or only current admin's deletions)
  - Displays components with configuration count
  - Shows who deleted and when
  - Lazy rendering for performance with many deleted items

### DeletedComponentRow
- **Location**: `apps/kbc-ui/src/scripts/modules/trash/react/components/DeletedComponentRow.tsx`
- **Purpose**: Display a component with its deleted configurations
- **Props**:
  - `component`: Deleted component data
  - `allComponents`: All components (for lookup)
  - `readOnly`: Disable modifications
  - `onDelete`: Delete callback
  - `onRestore`: Restore callback
  - `isDeleting`: Loading state
  - `adminEmail`: Current admin email (for filtering)
- **Display Elements**:
  - Component icon and name
  - Component type (extractor, writer, transformation, etc.)
  - Count of deleted configurations
  - Expandable list of configurations
  - Component-level actions (delete all, restore all)
- **Key Features**:
  - Expandable/collapsible configuration list
  - Shows "Obsolete Component" warning if component no longer exists
  - Different styling based on restoration availability

### DeletedConfigurationRow
- **Location**: `apps/kbc-ui/src/scripts/modules/trash/react/components/DeletedConfigurationRow.tsx`
- **Purpose**: Display individual configuration with deletion info and actions
- **Props**:
  - `configuration`: Config data (id, name, description, creator)
  - `component`: Parent component info
  - `readOnly`: Disable modifications
  - `isDeleting`: Loading state
  - `isRestoring`: Loading state
  - `onDelete`: Delete callback
  - `onRestore`: Restore callback
  - `showCreator`: Display creator info
- **Display Elements**:
  - Configuration name
  - Configuration description
  - Creator token (who created/last modified)
  - Creation date and time
  - Delete button (with warning)
  - Restore button
  - Status indicators (being deleted/restored)
- **Key Features**:
  - Shows reason if restoration not available
  - Inline action buttons
  - Confirmation before destructive actions
  - Loading states during operations

### TrashHeaderButtons
- **Location**: `apps/kbc-ui/src/scripts/modules/trash/react/components/TrashHeaderButtons.tsx`
- **Purpose**: Display header action buttons
- **Props**:
  - `hasDeleted`: Boolean indicating if trash is not empty
  - `onDeleteAll`: Callback to permanently delete all
  - `canDelete`: Permission check
  - `isDeleting`: Loading state
- **Display Elements**:
  - "Empty Trash" button (permanently delete all)
  - Confirmation dialog before action
  - Loading indicator
- **Key Features**:
  - Prominent destructive action
  - Requires confirmation
  - Disabled if no permissions

### DeleteConfigurationButton
- **Location**: `apps/kbc-ui/src/scripts/modules/trash/react/components/DeleteConfigurationButton.tsx`
- **Purpose**: Permanently delete a single configuration
- **Props**:
  - `configuration`: Config to delete
  - `component`: Parent component info
  - `onDelete`: Delete callback
  - `isDeleting`: Loading state
  - `disabled`: Disable button
- **Display Elements**:
  - Delete icon and label
  - Hover tooltip with explanation
  - Confirmation modal before deletion
- **Key Features**:
  - Shows irreversible warning
  - Requires explicit confirmation
  - Disables after deletion

### RestoreConfigurationButton
- **Location**: `apps/kbc-ui/src/scripts/modules/trash/react/components/RestoreConfigurationButton.tsx`
- **Purpose**: Restore a deleted configuration
- **Props**:
  - `configuration`: Config to restore
  - `component`: Parent component
  - `onRestore`: Restore callback
  - `isRestoring`: Loading state
  - `disabled`: Disable button (if not restorable)
  - `disabledReason`: Reason if disabled
- **Display Elements**:
  - Restore icon and label
  - Tooltip with restoration reason (if disabled)
  - Loading state
- **Key Features**:
  - Disabled for non-restorable items
  - Shows reason for disabled state
  - Quick restore action

## API Endpoints (via InstalledComponentsApi)

| Method | Endpoint | Purpose | Response Type |
|--------|----------|---------|---------------|
| GET | `/v2/components/:componentId/config-rows/deleted` | List deleted configs | DeletedConfig[] |
| POST | `/v2/components/:componentId/:configId/restore` | Restore configuration | Configuration |
| DELETE | `/v2/components/:componentId/:configId` | Permanently delete | - |

## State Management

- **Pattern Used**: TanStack React Query (modern data fetching)
- **Key Hooks**:
  - `useDeletedComponents()`: Fetch all deleted components for project
  - `useRestoreConfiguration()`: Restore single configuration mutation
  - `useRestoreMultipleConfigurations()`: Restore multiple configurations mutation
  - `useDeleteComponent()`: Permanently delete single configuration mutation
  - `useDeleteAllComponents()`: Permanently delete all configurations mutation
- **Query Keys**:
  - `storageApiKey.trash()`: Main deleted components list
- **Data Flow**:
  1. Page loads, triggers `useDeletedComponents()` query
  2. React Query fetches from API
  3. Components render with loading state
  4. User interacts (search, filter, restore, delete)
  5. Mutations triggered for restore/delete actions
  6. Query invalidated after successful mutation
  7. Data automatically refetched and UI updated
  8. Optimistic updates for better perceived performance

## Deleted Item Data Types

### DeletedComponent
```typescript
type DeletedComponent = {
  id: string;                          // Component ID (e.g., 'keboola.python-transformation-v2')
  name: string;                        // Component name
  type: ComponentType;                 // Component type (extractor, writer, etc.)
  configurations: Configuration[];     // List of deleted configurations
}

type ComponentType = 
  | 'extractor'
  | 'writer'
  | 'transformation'
  | 'application'
  | 'data-app'
  | 'orchestration'
  | 'other'
```

### Configuration (Deleted)
```typescript
type Configuration = {
  id: string;                          // Config ID
  name: string;                        // Config name
  description: string;                 // Config description
  currentVersion: {
    created: string;                  // ISO timestamp of deletion
    creatorToken: {
      description: string;            // Admin email/name who deleted
    };
  };
  creatorToken: {
    description: string;              // Token description
  };
  isSample?: boolean;                 // Whether it's a sample config
}
```

## Filtering & Search Logic

### Search Implementation
```typescript
// Search across multiple fields with word matching
const getFilteredConfigurations = (
  component: { configurations?: Configuration[] },
  searchQuery: string,
) => {
  let configurations = component.configurations || [];

  if (searchQuery) {
    configurations = configurations.filter((config) => {
      return matchByWords(
        [config.id, config.name, config.description ?? ''],
        searchQuery,
      );
    });
  }

  // Sort by deletion date (newest first)
  return configurations.sort((a, b) => {
    const createdA = dayjs(a.currentVersion.created).unix();
    const createdB = dayjs(b.currentVersion.created).unix();
    return createdB - createdA;
  });
};
```

### Filter by Admin
```typescript
// Show only configurations deleted by current admin
const getFilteredComponents = (
  filter: FilterValues,
  searchQuery: string,
  deletedComponents: DeletedComponent[],
  adminEmail: string,
) => {
  let components = deletedComponents;

  if (filter === FILTERS.COMPONENTS) {
    components = components
      .map((component) => ({
        ...component,
        configurations: component.configurations.filter(
          (config) => config.creatorToken.description === adminEmail,
        ),
      }))
      .filter((component) => component.configurations.length !== 0);
  }

  // Apply search filtering...
  return components;
};
```

## Restoration Constraints

### Non-Restorable Components
```typescript
const getDisabledRestoreReason = (componentId: string) => {
  // Workspaces and Data Apps are ephemeral - can't restore
  if ([KEBOOLA_SANDBOXES, KEBOOLA_DATA_APPS].includes(componentId)) {
    return `${
      componentId === KEBOOLA_SANDBOXES ? 'Workspaces' : 'Data Apps'
    } are shortlived interactive development environments. Once deleted they cannot be restored.`;
  }

  // Obsolete components without any UI - can't restore
  if (isObsoleteComponent(componentId)) {
    return 'The configuration of an obsolete component cannot be restored.';
  }

  return '';
};
```

### Obsolete Component Detection
```typescript
const isObsoleteComponent = (componentId: string) => {
  const component = ComponentsStore.getComponent(componentId);

  if (!component || [KEBOOLA_SANDBOXES].includes(componentId)) {
    return false;
  }

  // If no UI available (no URI + no generic UI), it's obsolete
  return (
    component.get('uri') &&
    !hasGenericUI(component) &&
    !hasGenericDockerUI(component) &&
    !hasGenericTemplatesUI(component)
  );
};
```

## Dependencies

### Internal Modules
- `admin`: User privileges (canPurgeTrash)
- `components`: Component metadata and type information
- `installed-components`: Configuration API operations
- `dev-branches`: Dev branch context
- `application-store`: Current admin information
- `constants`: Component IDs, filter types

### External Packages
- `@tanstack/react-query`: Data fetching and caching
- `dayjs`: Date formatting (creation/deletion dates)
- `immutable`: Immutable data structures

### Design System Components
- `Button`: Restore, delete, action buttons
- `Icon`: Component type icons, action icons
- `Modal`: Confirmation dialogs
- `RadioGroup`: Filter selector
- `Search`: Search input component
- `Badge`: Status indicators
- `Table`/`List`: Item display

## Notable Patterns

### Restoration Workflow
```typescript
// In useRestoreConfiguration hook
const restoreConfiguration = (
  componentId: string,
  configurationId: string,
  configurationName: string,
) => {
  return installedComponentsApi.restoreConfiguration(componentId, configurationId)
    .then(() => {
      // Show success notification
      ApplicationActionCreators.sendNotification({
        type: 'success',
        message: configurationRestoredNotification(
          componentId,
          configurationId,
          configurationName,
        ),
      });
      return null;
    });
};
```

### Bulk Operations
```typescript
// Delete all components at once
const handleDeleteAllComponents = () => {
  return Promise.map(
    allConfigurations,
    (config) => deleteComponent(config.componentId, config.id),
    { concurrency: 3 },  // Limit concurrent requests
  );
};
```

### Component Name Mapping
```typescript
// Orchestrator displays as "Flow" in trash UI
const mapOrchestratorToFlow = (component: DeletedComponent) => ({
  ...component,
  name: 'Flow',
});
```

### Search Query State
```typescript
// Maintain search in URL for shareable links
const [searchQuery, setSearchQuery] = useState(
  RoutesStore.getRouterState().getIn(['location', 'query', 'q'], ''),
);

// Update URL when search changes
const handleSearch = (query: string) => {
  setSearchQuery(query);
  navigate(`?q=${encodeURIComponent(query)}`);
};
```

## User-Facing Features

### Feature 1: View Deleted Items
- **Description**: Browse all recently deleted components and configurations
- **Workflow**:
  1. Navigate to Settings > Recently Deleted
  2. See all deleted components with configuration counts
  3. Components grouped by type
  4. Shows who deleted and when
  5. Expandable component list to see configurations
- **Components**: TrashIndex, DeletedComponentRow

### Feature 2: Search Deleted Items
- **Description**: Find specific deleted items by name or description
- **Workflow**:
  1. Open trash page
  2. Enter search query in search box
  3. Results filtered in real-time
  4. Searches config name, ID, and description
  5. Highlights matching items
  6. Clear search to reset
- **Components**: TrashIndex, Search input

### Feature 3: Filter by Creator
- **Description**: Show only items deleted by current admin
- **Workflow**:
  1. On trash page, see "All Components" and "My Components" options
  2. Select "My Components" to filter
  3. Only configs deleted by current admin shown
  4. Useful for accountability and finding own deletions
  5. Switch back to "All" to see all deletions
- **Components**: TrashIndex, RadioGroup filter

### Feature 4: Restore Configuration
- **Description**: Recover a deleted configuration back to active status
- **Workflow**:
  1. Find configuration in trash
  2. Click "Restore" button
  3. Confirmation dialog appears
  4. Click "Confirm" or "Yes"
  5. Configuration restored to project
  6. Success notification shown
  7. Configuration now active in component
- **Components**: RestoreConfigurationButton, DeletedConfigurationRow

### Feature 5: Permanent Deletion
- **Description**: Permanently remove deleted items (cannot be undone)
- **Workflow**:
  1. Find configuration to permanently delete
  2. Click "Delete" or trash icon
  3. Warning modal explains permanent nature
  4. User must confirm they understand
  5. Configuration permanently removed
  6. Cannot be recovered
- **Components**: DeleteConfigurationButton

### Feature 6: Bulk Restore
- **Description**: Restore multiple configurations at once
- **Workflow**:
  1. Select multiple configurations
  2. Click "Restore All" button
  3. Confirmation dialog
  4. All selected items restored
  5. Success message
- **Components**: TrashIndex (if batch selection enabled)

### Feature 7: Empty Trash
- **Description**: Permanently delete all deleted items at once
- **Workflow**:
  1. On trash page, click "Empty Trash" button (in header)
  2. Strong warning dialog appears
  3. Must type confirmation text (e.g., "DELETE ALL")
  4. User confirms understanding
  5. All deleted items removed permanently
  6. Trash now empty
- **Components**: TrashHeaderButtons

### Feature 8: View Deletion Details
- **Description**: See who deleted items and when
- **Workflow**:
  1. View deleted configuration
  2. See creator/deleter information
  3. See exact deletion timestamp
  4. Can identify patterns of deletion
  5. Useful for auditing and accountability
- **Components**: DeletedConfigurationRow

## Technical Debt & Observations

### React Query Integration
- Module uses modern TanStack Query pattern (good)
- Well-structured hooks for different operations
- Clean separation of concerns

### Performance
- Lazy rendering with LazyList for many items
- Search could be debounced for better performance
- Sorting happens in memory (OK for typical trash sizes)

### Search Implementation
- Currently in-memory search (fine for typical sizes)
- Could implement server-side search if trash grows large
- Word matching is simple but effective

### UI Complexity
- Tree structure (component -> configurations) is clear
- Could benefit from table view as alternative
- Expandable rows work well for this data

### Error Handling
- API errors could have more detailed messaging
- Retry logic for failed mutations could help
- Network errors should show appropriate UI

### Restoration Logic
- Component availability check is good (obsolete detection)
- Workspaces/Data Apps correctly marked as non-restorable
- Could cache component metadata to avoid lookups

### Data Freshness
- Query invalidation after mutations is proper
- Could implement shorter cache times for trash
- Manual refresh button could be useful

## Code Examples

### Using useDeletedComponents Hook
```typescript
const TrashIndex = () => {
  const deletedComponents = useDeletedComponents();

  if (deletedComponents.isLoading) {
    return <Loader />;
  }

  if (deletedComponents.isError) {
    return <Error message={deletedComponents.error.message} />;
  }

  return (
    <div>
      {deletedComponents.data.map((component) => (
        <DeletedComponentRow key={component.id} component={component} />
      ))}
    </div>
  );
};
```

### Using useRestoreConfiguration Hook
```typescript
const DeletedConfigurationRow = ({ configuration, component }) => {
  const restoreMutation = useRestoreConfiguration();

  const handleRestore = () => {
    restoreMutation.mutate({
      componentId: component.id,
      configurationId: configuration.id,
      configurationName: configuration.name,
    });
  };

  return (
    <button
      onClick={handleRestore}
      disabled={restoreMutation.isPending}
    >
      {restoreMutation.isPending ? 'Restoring...' : 'Restore'}
    </button>
  );
};
```

### Searching and Filtering
```typescript
const handleSearchChange = (query: string) => {
  setSearchQuery(query);

  const filtered = getFilteredComponents(
    filter,
    query,
    deletedComponents.data,
    currentAdmin.email,
  );

  setFilteredComponents(filtered);
};
```

## Related Modules

- `admin`: User permissions for trash management
- `components`: Component metadata and type info
- `installed-components`: Configuration restore API
- `settings`: Trash link in settings navigation
- `notifications`: Notification on successful restore
- `dev-branches`: Branch context for filtering

## Testing

- Key test files: `trash.test.ts`, `utils.test.ts`
- Test coverage:
  - Search filtering across multiple fields
  - Admin filtering logic
  - Restoration availability checks (obsolete components)
  - Workspaces/Data Apps non-restoration
  - Component type detection
  - Deleted item sorting (by date)
  - Orchestrator name mapping
- Important test cases:
  - Search matches partial strings
  - Filter shows only current admin's deletions
  - Non-restorable components show reason
  - Obsolete component detection
  - Empty trash with no items
  - Large trash performance (100+ items)
  - Concurrent restore/delete operations
- Integration tests:
  - Complete restore workflow
  - Complete permanent delete workflow
  - Bulk operations
  - Error handling for API failures

## Auditing & Compliance

- Deletion history tracked via creator field
- Timestamps preserved (deletion date)
- Audit trail: who deleted what and when
- Grace period before permanent deletion
- Admin can recover own or others' deletions (if permissions allow)
- Workspace/Data App deletion is immediate (no recovery)

## UI/UX Considerations

- Clear visual distinction between restorable and non-restorable items
- Prominent warning for permanent deletions
- Success feedback on restore
- Search results highlighted
- Empty state when trash is empty
- Grouped by component type for organization
- Newest deletions shown first (most relevant)

## Recovery Strategy

- 30-day retention typically (configurable)
- After retention period, permanent deletion
- Configurations restored to previous state
- Creator/last-modified info preserved
- Related data (versions, history) restored with config

