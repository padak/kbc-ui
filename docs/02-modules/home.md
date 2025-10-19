# Module: Home

## Overview

The home module provides the main dashboard/overview page for Keboola Connection projects. It displays real-time project activity, storage metrics, system status, team member presence, billing information, and warning alerts. The dashboard consolidates information from multiple sources (jobs, events, storage, users, billing) to give project administrators a comprehensive view of project health and recent activity. It uses a widget-based layout with various panels showing different aspects of the project.

## File Structure

```
home/
├── routes.js                           # Route definitions
├── ActionCreators.ts                   # Flux action creators
├── actions.ts                          # Action type exports
├── api.ts                              # API client for jobs and events
├── store.js                            # Flux store for dashboard data
├── constants.ts                        # Constants and limits
├── helpers.js                          # Utility functions
├── helpers.test.js                     # Helper tests
├── react/
│   ├── Index.jsx                       # Main dashboard page component
│   ├── HomeHeaderButtons.tsx           # Header action buttons
│   ├── ProjectDescriptionBox.tsx       # Project description display
│   ├── AdblockDetector.tsx             # Adblock warning
│   ├── BackendValidation.tsx           # Backend validation warnings
│   ├── DeprecatedComponents.tsx        # Deprecated component warnings
│   ├── Expiration.tsx                  # Project expiration alerts
│   ├── WorkspacesReadOnlyStorageAlert.tsx  # Read-only storage warning
│   ├── WorkspacesBillingAlert.tsx      # Billing alerts
│   └── components/
│       ├── StoragePanel.tsx            # Storage size and rows display
│       ├── ActiveUsers.tsx             # Active team members list
│       ├── ActiveUsersSimple.tsx       # Simplified active users
│       ├── LatestActivity.jsx          # Recent jobs and configuration edits
│       ├── LatestActivityJob.jsx       # Individual job row
│       ├── LatestActivityConfiguration.jsx  # Configuration edit row
│       ├── LatestActivityBranch.jsx    # Branch event row
│       ├── LatestConfigurationEdits.tsx # Recent config edits (optimized)
│       ├── NoConfigurationEdits.tsx    # Empty state for edits
│       ├── LastErrorsPanel.tsx         # Failed jobs display
│       ├── AccessPanel.tsx             # User access information
│       ├── DemoPreviewDashboard.tsx    # Demo preview mode dashboard
│       ├── ProductFruitsChecklists.tsx # Onboarding checklists
│       ├── SnowflakeDeprecatedPassword.tsx  # Snowflake deprecation warning
│       └── DeprecatedFacebookApi.tsx   # Facebook API deprecation warning
```

## Routes

| Path | Name | Component | Description |
|------|------|-----------|-------------|
| `dashboard` | `APP_ROUTE` | `Index.jsx` | Main dashboard overview |

## Key Components

### Index (Main Dashboard)
- **Location**: `react/Index.jsx`
- **Purpose**: Main dashboard layout and orchestration
- **Pattern**: Legacy class component with `createReactClass`
- **Stores**: ApplicationStore, ComponentsStore, InstalledComponentsStore, HomeStore, BillingStore, DevBranchesStore
- **Key Data**:
  - Project metrics (storage, rows)
  - Latest jobs and activities
  - Team member activity
  - Billing information
  - Project expiration
- **Layout**: Grid-based with multiple panels
- **Features**:
  - Real-time data updates via polling
  - Contextual alerts based on project state
  - Demo mode dashboard variant
  - CLI and MCP widget promotion

### StoragePanel
- **Location**: `react/components/StoragePanel.tsx`
- **Purpose**: Display total storage usage and row count
- **Props**: `sizeBytes`, `rowsCount`
- **Features**: Formatted file size, row count with link to storage detail

### LatestActivity
- **Location**: `react/components/LatestActivity.jsx`
- **Purpose**: Display recent jobs, configurations, and branch events
- **Features**:
  - Searchable activity list
  - Filter by type (Jobs, Configurations, All)
  - Lazy-loading pagination (10 items per page)
  - Component metadata display
  - Activity grouping (same edits counted)
- **Data Types**:
  - Jobs (background job executions)
  - Configuration edits (storage events)
  - Branch events (dev branch operations)

### ActiveUsers
- **Location**: `react/components/ActiveUsers.tsx`
- **Purpose**: Show team members currently active in the project
- **Features**:
  - Activity status (Online / Active / Offline)
  - Last activity timestamp
  - User avatars
  - Pagination for large teams
  - Differentiation for invited vs active users
- **Thresholds**:
  - Online: Active in last 30 minutes
  - Active: Active in last 7 days
  - Offline: No activity in 7+ days

### LastErrorsPanel
- **Location**: `react/components/LastErrorsPanel.tsx`
- **Purpose**: Display failed and terminated jobs
- **Features**: Quick view of job failures for troubleshooting

### ProjectDescriptionBox
- **Location**: `react/ProjectDescriptionBox.tsx`
- **Purpose**: Display project description and visibility toggle
- **Features**: Collapsible project description from metadata

### Alert Components

#### Expiration
- Warns about upcoming project expiration
- Shows days remaining

#### BackendValidation
- Validates backend connectivity
- Shows connection errors

#### AdblockDetector
- Detects browser adblockers
- Warns about potential functionality issues

#### DeprecatedComponents
- Shows warnings for deprecated components/features
- Facebook API deprecation
- Snowflake password deprecation

#### WorkspacesReadOnlyStorageAlert
- Alerts when storage is in read-only mode

#### WorkspacesBillingAlert
- Shows billing-related alerts
- Credit warnings for PAYG projects

### DemoPreviewDashboard
- **Location**: `react/components/DemoPreviewDashboard.tsx`
- **Purpose**: Simplified dashboard for demo/preview mode
- **Features**: Limited data display for demo projects

## API Endpoints

| Method | Endpoint | Purpose | Response |
|--------|----------|---------|----------|
| GET | `/v2/storage/jobs` | Get recent jobs | Jobs list (limit: 50) |
| GET | `/v2/events` | Get recent events | Events list (limit: 200) |
| GET | `/v2/events?component=keboola.kbc` | Get latest Git event | Latest KBC event |

## State Management

- **Pattern Used**: Flux with Immutable.js
- **Key Store**: `HomeStore.js`
- **Store State**:
  ```typescript
  {
    isJobsLoaded: boolean,
    isActivitiesLoaded: boolean,
    isLatestGitEventLoaded: boolean,
    lastSeen: dayjs | null,           // When dashboard was last viewed
    jobs: List,                        // Recent jobs (sorted by creation time)
    activities: List,                  // Recent events (from SAPI)
    latestGitEvent: Map,               // Latest Git/Keboola-as-Code event
  }
  ```

## Data Flow

### Initial Load
1. **Route Load** - Dashboard route triggers `requireData`:
   - `pollableActions()` - Loads jobs, activities, latest git event, billing credits, installed components
   - Metadata loading (skipped in dev mode)

2. **Action Creators** - `ActionCreators.ts`:
   - `loadJobs()` - Fetches recent jobs via API
   - `loadActivities()` - Fetches recent events
   - `loadLatestGitEvent()` - Gets latest Git event
   - Store data in HomeStore via dispatcher

3. **Store Updates** - `HomeStore.js`:
   - Processes and sorts job data
   - Tracks load state
   - Stores last-seen timestamp in localStorage

4. **Component Rendering** - `Index.jsx`:
   - Pulls data from multiple stores
   - Computes derived state (activity aggregation, etc.)
   - Renders dashboard widgets

### Polling
- **Interval**: Defined in route polling configuration
- **Action**: `pollableActions()` repeats every N seconds
- **Data**: Updates jobs, activities, credits, components
- **Storage**: Stores updated data in HomeStore

### Activity Aggregation

Latest activity combines:
- **Jobs** - Marked with `type: ACTIVITY_TYPES.JOB`
- **Configuration Events** - Marked with `type: ACTIVITY_TYPES.CONFIGURATION`
- **Branch Events** - Marked with `type: ACTIVITY_TYPES.BRANCH`

Aggregation process:
1. Get all jobs (filtered to exclude internal workspace configurations)
2. Get all storage events and branch events
3. Combine and sort by date (newest first)
4. Filter out omitted components (Variables, Scheduler)
5. Lookup component metadata for each activity
6. Group consecutive same-event activities (edits counted together)

### Last Seen Tracking
- Stored in localStorage: `DASHBOARD_LAST_SEEN`
- Updated when activities are loaded
- Used to show "New since last view" indicator
- Skipped in dev branch mode

## Key Features & Workflows

### 1. Real-Time Project Overview
- View project storage usage in real-time
- See number of rows in storage
- Quick storage overview widget

### 2. Activity Monitoring
- Watch recent jobs execution
- Monitor configuration changes
- Track dev branch operations
- Searchable activity history
- Group same operations together

### 3. Team Presence
- See active team members
- View last activity timestamps
- Online/Active/Offline status
- Identify who's working in project

### 4. Error Monitoring
- View failed jobs
- Terminated job details
- Quick troubleshooting

### 5. System Health
- Backend validation status
- Adblock detection
- Project expiration warnings
- Billing alerts
- Deprecated component warnings

### 6. Quick Navigation
- Links to relevant modules from dashboard
- Storage quick link
- Configuration links from activity
- Team management link

## Helper Functions

### Activity Query Building
```typescript
createQueryToGetActivities() -> string
// Builds ElasticSearch query for storage and branch events
// Filters out internal workspace configurations
```

### Activity Processing
```typescript
getActiveUsers(admins, activities) -> Map
// Extracts active users from activity list
// Groups by creator/token

groupSameActivity(activity) -> List
// Groups consecutive identical events
// Counts occurrences

injectLastSeenRow(activity, lastSeen) -> List
// Inserts "last seen" marker in activity stream

getCreatedTime(item) -> string
// Extracts creation time from event

splitIntoChunks(list, size) -> List<List>
// Splits list into chunks for pagination
```

### Campaign Tracking
```typescript
isValidCampaignTarget(target) -> boolean
getCampaignTarget(target) -> string
getCampaignTag(location) -> string | null
mapTargetToRoute(target) -> Route | null
// URL campaign parameter tracking for promotions
```

## Constants

```typescript
DASHBOARD_JOBS_LIMIT = 50              // Max jobs to fetch
DASHBOARD_EVENTS_LIMIT = 200           // Max events to fetch
BOX_ROWS_LIMITS = 40                   // Max rows per widget

ACTIVITY_TYPES = {
  JOB: 'JOB',
  CONFIGURATION: 'CONFIGURATION',
  BRANCH: 'BRANCH',
}

ACTIVITY_OMITTED_COMPONENTS = [        // Hidden from activity
  KEBOOLA_VARIABLES,
  KEBOOLA_SCHEDULER,
]

STORAGE_EVENTS = {                     // Storage event types
  CREATED, EDITED, DELETED, PURGED,
  RESTORED, ROLLBACK, COPIED, etc.
}

DEV_BRANCH_EVENTS = {                  // Branch event types
  CREATED, DELETED
}
```

## Dependencies

### Internal
- `@/modules/admin/privileges` - Permission checks
- `@/modules/billing/` - Billing information
- `@/modules/components/` - Component data
- `@/modules/dev-branches/` - Dev branch state
- `@/modules/keboola-as-code/` - KBC activity
- `@/modules/settings/` - Settings links
- `@/modules/sapi-events/` - Event API
- `@/modules/queue/` - Job queue API
- `@/stores/ApplicationStore` - Global app state

### External
- `react` - UI components
- `immutable` - Data structures
- `@keboola/design` - Design system
- `dayjs` - Date utilities
- `@keboola/utils` - String utilities

## Notable Patterns

### 1. Multi-Source Data Aggregation

Dashboard combines data from multiple independent sources:
- Jobs from queue API
- Events from storage events API
- Git events from KBC component
- Billing credits from billing API
- Component metadata from components store

This is orchestrated in the store's `getLatestActivity()` method.

### 2. Smart Activity Grouping

Consecutive identical operations are grouped together:
- Multiple configuration edits collapsed into count
- Row edits to same config combined
- Improves readability of activity list

### 3. Lazy Loading in Activity List

Activity displays 10 items initially, loads more on scroll to improve performance with large datasets.

### 4. Activity Type Filtering

Dashboard allows filtering activity by type to focus on:
- Jobs (job executions)
- Configurations (storage changes)
- All types combined

### 5. "Last Seen" Tracking

Stores when user last viewed dashboard in localStorage. Visual indicator shows activity since last view.

### 6. Demo Mode Simplification

Demo/preview projects show simplified dashboard with limited data to avoid information overload for new users.

### 7. Polling with Incremental Updates

Instead of re-fetching all data, polling updates incrementally:
- Gets latest jobs since last poll
- Gets latest events since last poll
- Merges with existing data

### 8. Local Storage for Preferences

- `DASHBOARD_LAST_SEEN` - Last dashboard view time
- `IS_PROJECT_DESCRIPTION_HIDDEN` - Toggle description visibility
- `HIDE_CLI_BOX` - Hide CLI promotional widget
- `HIDE_DASHBOARD_MCP_WIDGET` - Hide MCP widget

## User-Facing Features

1. **Project Overview** - At-a-glance project statistics
2. **Storage Dashboard** - Total storage usage and row count
3. **Recent Activity** - Jobs, configurations, branch operations
4. **Team Activity** - Who's online and their last activity
5. **Error Dashboard** - Failed jobs and issues
6. **System Status** - Backend validation, warnings, alerts
7. **Quick Navigation** - Links to relevant modules
8. **Promotional Widgets** - CLI and MCP integration promotions
9. **Expiration Alerts** - Project expiration warnings
10. **Billing Information** - Credit balance for PAYG projects

## Technical Debt & Observations

### 1. Legacy Flux Architecture

The home module still uses Flux with Immutable.js. Modern equivalent would use TanStack Query with React hooks.

### 2. Multiple Component State Sources

Dashboard reads from 6+ different stores. This creates complex data dependencies and makes testing harder.

### 3. Activity Query Complexity

The ElasticSearch query in `createQueryToGetActivities()` is complex and hard to maintain. Could benefit from query builder abstraction.

### 4. Immutable.js Overhead

Converting between Immutable and JavaScript objects (via `.toJS()`) in components creates performance overhead.

### 5. Component Metrics Structure

Project metrics stored as nested maps (`['metrics', 'storage.dataSizeBytes', 'value']`) is not type-safe.

### 6. Hardcoded Active/Online Thresholds

Activity time thresholds (30 min, 7 days) are hardcoded. Could be configurable.

### 7. Mixed Component Styles

Dashboard mixes:
- Legacy class components with createReactClass
- Modern functional components with hooks
- Store mixins for data subscription

This should be unified.

### 8. Missing Error Boundaries

Dashboard doesn't have error boundaries. A single component failure crashes the whole dashboard.

### 9. Polling Optimization

Polling fetches all jobs and events up to limits, even if unchanged. Could implement change detection.

### 10. localStorage Fragmentation

Uses multiple localStorage keys with inconsistent naming patterns. Could be centralized.

## Testing

The module includes:
- `helpers.test.js` - Tests for helper functions
- Activity grouping logic
- Campaign target mapping
- Chunk splitting

## Performance Considerations

1. **Lazy Loading** - Activity list paginates to avoid rendering 200+ items
2. **Component Memoization** - Some components use React.memo for expensive renders
3. **Virtual Scrolling** - Could improve performance for large activity lists
4. **Query Caching** - Activities and jobs cached in store, updated via polling
5. **localStorage Optimization** - Last seen stored in localStorage to avoid API call

## Future Improvements

1. Migrate from Flux to TanStack Query
2. Modernize class components to functional components
3. Add error boundaries for resilience
4. Implement virtual scrolling for activity lists
5. Replace Immutable.js with TypeScript types
6. Add performance monitoring/metrics
7. Create configurable dashboard layouts
8. Add dashboard customization (which widgets to show)
9. Implement more sophisticated change detection for polling
10. Add real-time updates via WebSockets

## Integration with Other Modules

Dashboard integrates with:
- **Billing Module** - Shows credit balance
- **Components Module** - Displays component info in activities
- **Dev Branches** - Shows branch operation activity
- **Queue Module** - Displays job status
- **Events Module** - Fetches activity events
- **Settings Module** - Links to team management
- **KBC Module** - Shows Git/KBC events

