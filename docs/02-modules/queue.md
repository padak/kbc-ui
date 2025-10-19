# Module: Queue

## Overview

The Queue module provides comprehensive job management functionality for Keboola, enabling monitoring, tracking, and control of all executed jobs. It displays job history with advanced filtering, detailed job information including logs and errors, performance statistics, job termination capabilities, and support for different job types (orchestrations, transformations, data apps). The module tracks job status across their lifecycle from creation through completion, with real-time updates and error handling.

## File Structure

```
queue/
├── constants.ts                       # Job status constants, route names, limits
├── actions.ts                         # Flux action creators (legacy)
├── helpers.ts                         # Utility functions for job processing
├── jobResolver.ts                     # Component and config lookup utilities
├── components/
│   ├── JobsTable.tsx                  # Main jobs list table component
│   ├── JobsGraphWithPaging.tsx        # Job execution graph visualization
│   ├── JobsGraphMemo.tsx              # Memoized graph rendering
│   ├── JobErrorModal.tsx              # Error details modal with AI explanation
│   ├── JobErrorModalContent.tsx       # Error modal content component
│   ├── JobErrorResult.tsx             # Error result display
│   ├── ChildJobs.tsx                  # Child jobs viewer
│   ├── TriggeredJob.tsx               # Triggered job indicator
│   ├── ScheduledJob.tsx               # Scheduled job indicator
│   ├── InternalDataAppJob.tsx         # Data app job indicator
│   ├── ConfigRowsInfo.tsx             # Configuration rows display
│   ├── ContinueOnFailureIcon.tsx      # Continue-on-failure indicator
│   └── RunIdTooltip.tsx               # Run ID tooltip helper
└── react/pages/
    ├── JobsList.tsx                   # Main jobs list page
    └── JobDetail.tsx                  # Job detail page (log, result, config)
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/queue` | JobsList | Main job history and monitoring interface |
| `/queue/job/:jobId` | JobDetail | Detailed job view with logs, results, and performance |

## Key Components

### JobsList (Main Jobs Monitoring)
- **Location**: `apps/kbc-ui/src/scripts/modules/queue/react/pages/JobsList.tsx`
- **Purpose**: Display paginated job history with advanced filtering, sorting, and job execution statistics
- **Props**: None (store-driven via Flux)
- **State**: 
  - Jobs list with pagination (limit: 100, offset-based)
  - Query filters (status, component, config, date range, duration range)
  - Sorting (by date, duration, status)
  - Selected job for detail view
- **Child Components**:
  - JobsTable (paginated job list)
  - JobsGraphWithPaging (execution timeline graph)
  - Filter controls (status, date, duration, component)
- **Key Features**:
  - Infinite scroll or pagination for job history
  - Real-time job status updates
  - Filter by job status (created, waiting, processing, success, error, terminated, etc.)
  - Filter by component type and configuration
  - Performance statistics (slow/fast indicator)
  - Quick access to job details and error messages

### JobsTable
- **Location**: `apps/kbc-ui/src/scripts/modules/queue/components/JobsTable.tsx`
- **Purpose**: Render paginated job list with columns for job info, status, timing, and actions
- **Props**:
  - `jobs`: Map of job objects
  - `admins`: Map of admin user data
  - `sapiToken`: Storage API token (for notification permissions)
  - `currentAdmin`: Current user info
  - `notifications`: List of notification subscriptions
  - `isLoading`: Loading state
  - `isLoadMore`: Load more state
  - `offset`: Pagination offset
  - `changeQuery`: Query parameter update callback
  - `query`: Current query parameters
- **State**: 
  - Pagination state (handles load more via InfiniteScroll)
  - Display state (expanded rows, modals)
- **Key Features**:
  - Infinite scroll pagination with load more button
  - Job row with: status badge, component icon, config name, duration, created time/user
  - Job type indicators (triggered, scheduled, data app)
  - Child jobs tree (expandable)
  - Row actions: view details, terminate job, setup notifications
  - Error indicator with tooltip
  - Performance comparison (slower/faster than average)

### JobDetail
- **Location**: `apps/kbc-ui/src/scripts/modules/queue/react/pages/JobDetail.tsx`
- **Purpose**: Display comprehensive job information including full log, error details, configuration, and performance metrics
- **Props**: Job ID from URL
- **State**: 
  - Job data (fetched from API)
  - Log view state (filtering, search)
  - Expanded sections (config, results, child jobs)
  - Modal states (error details, logs export)
- **Display Elements**:
  - Job header: status badge, timing, component/config info, user
  - Job log (scrollable, with line numbers and filtering)
  - Error section (if failed) - can trigger AI error explanation
  - Job result section (success/warning/error message)
  - Job configuration (immutable display)
  - Child jobs list (if orchestration)
  - Performance metrics (duration comparison, slowdown percentage)

### JobErrorModal
- **Location**: `apps/kbc-ui/src/scripts/modules/queue/components/JobErrorModal.tsx`
- **Purpose**: Display detailed error information with optional AI-powered error explanation
- **Props**:
  - `job`: Job data (Immutable Map)
  - `useAi`: Whether to offer AI explanation
  - `errorMessage`: Short error message text
- **State**:
  - AI explanation message (loading, error, or result)
  - Feedback status (like/dislike on AI explanation)
  - Correlation ID (for tracking AI requests)
- **Key Features**:
  - Full error stack trace display
  - Error context and logs
  - "Explain with AI" button (if enabled)
  - AI response with feedback mechanism (helpful/not helpful)
  - Link to support if issue persists
  - Graceful error handling for AI failures

### JobsGraphWithPaging
- **Location**: `apps/kbc-ui/src/scripts/modules/queue/components/JobsGraphWithPaging.tsx`
- **Purpose**: Visualize job execution timeline with performance statistics
- **Props**:
  - `jobs`: Array of jobs to visualize
  - `isLoading`: Loading state
  - `query`: Query parameters
- **Display Elements**:
  - Horizontal timeline of recent jobs (limit 28)
  - Job blocks colored by status (green/success, red/error, orange/warning, gray/processing)
  - Duration indicators (height or position represents time)
  - Hover tooltip with job summary
  - Average duration line for performance comparison
  - Click to navigate to job detail

## API Endpoints

| Method | Endpoint | Purpose | Response Type |
|--------|----------|---------|---------------|
| GET | `/v2/storage/jobs` | List jobs with filters | JobList (paginated) |
| GET | `/v2/storage/jobs/:jobId` | Get job details | Job |
| POST | `/v2/storage/jobs/:jobId/kill` | Terminate running job | Job (updated) |
| GET | `/v2/storage/jobs/:jobId/log` | Get job execution log | Log (text/streaming) |

## State Management

- **Pattern Used**: Flux architecture with Immutable.js (legacy)
- **Key Stores**:
  - `QueueStore`: Manages jobs list, current job, loading states
  - `StorageStore`: Contains jobs within storage module state
- **Data Flow**: 
  1. Component dispatches action to load jobs
  2. Action creators make API request
  3. Response triggers dispatcher action
  4. Store updates and emits change event
  5. Component re-renders with updated data
- **Query Parameters**: Maintained via URL state
  - `limit`, `offset`: Pagination
  - `status`: Job status filter
  - `componentType`, `component`: Component filter
  - `config`, `row`: Configuration/row filter
  - `tokenDescription`: User filter
  - `createdTimeFrom`, `endTimeTo`: Date range filter
  - `durationSecondsFrom`, `durationSecondsTo`: Duration range filter
  - `parentRunId`, `runId`: Parent/run ID filter
  - `sortBy`, `sortOrder`: Sort parameters

## Job Statuses & Constants

### Job Status Values
```typescript
JOBS_STATUS = {
  CREATED: 'created',        // Just created
  WAITING: 'waiting',        // Waiting to start
  PROCESSING: 'processing',  // Currently running
  SUCCESS: 'success',        // Completed successfully
  ERROR: 'error',            // Failed with error
  TERMINATING: 'terminating',// Being stopped
  TERMINATED: 'terminated',  // Stopped by user
  CANCELLED: 'cancelled',    // Cancelled
  WARNING: 'warning',        // Completed with warnings
}
```

### Job Status Groups
- **Running**: CREATED, WAITING, PROCESSING, TERMINATING
- **Finished**: SUCCESS, ERROR, WARNING, TERMINATED, CANCELLED
- **Failed**: ERROR, TERMINATED, CANCELLED
- **Success**: SUCCESS, WARNING

### Job Types
```typescript
JOBS_TYPES = {
  CONTAINER: 'container',                      // Standard container job
  ORCHESTRATION_CONTAINER: 'orchestrationContainer', // Orchestration
  PHASE_CONTAINER: 'phaseContainer',           // Phase in orchestration
  RETRY_CONTAINER: 'retryContainer',           // Retry attempt
  STANDARD: 'standard',                        // Standard job
}
```

### Pagination & Limits
- `JOBS_LIMIT`: 100 (default list limit)
- `LATEST_JOBS_LIMIT`: 3 (recent jobs display)
- `MAX_JOBS_LIMIT`: 500 (max allowed)
- `JOBS_LIMIT_FOR_GRAPH`: 28 (graph visualization)
- `JOBS_LIMIT_FOR_RUN_RESULTS`: 10 (run results display)

### Performance Thresholds
- `JOB_IS_SLOWER_PERCENTAGE`: 110 (110% of average = slower)
- `JOB_IS_FASTER_PERCENTAGE`: 90 (90% of average = faster)
- `JOB_MINIMUM_DURATION_SECONDS_TO_SHOW_STATS`: 120
- `JOB_MINIMUM_DIFFERENCE_SECONDS_TO_SHOW_STATS`: 30

## Dependencies

### Internal Modules
- `admin`: Job termination permissions, user/admin information
- `components`: Component metadata, component type resolution
- `notifications`: Job completion notifications setup
- `dev-branches`: Branch ID filtering for jobs
- `configurations`: Configuration name and type lookup
- `ai`: AI-powered error explanations

### External Packages
- `@tanstack/react-query`: Optional for data fetching (in newer patterns)
- `react-infinite-scroller`: Infinite scroll pagination
- `immutable`: Immutable data structures
- `dayjs`: Date/time formatting

### Design System Components
- `Button`: Action buttons
- `Modal`: Error/details modals
- `Table`: Job list table
- `Badge`: Status badges
- `Icon`: Component type icons
- `Tooltip`: Info tooltips
- `Loader`: Loading indicator

## Notable Patterns

### Job Termination Flow
```typescript
// 1. User clicks terminate button on running job
// 2. Component calls ActionCreators.terminateJob(jobId)
// 3. Action makes POST request to /v2/storage/jobs/:jobId/kill
// 4. On success, job status updates to TERMINATING
// 5. Frontend polls job status until TERMINATED
// 6. Table re-renders with updated status
```

### Performance Statistics
Jobs calculate performance relative to average:
- If job duration > (average × 110%), mark as "slower than usual"
- If job duration < (average × 90%), mark as "faster than usual"
- Only show for jobs > 2 minutes duration with > 30 second difference
- Used to surface potential issues or improvements

### Job Type Indicators
Different job types display unique indicators:
- **Triggered jobs**: Calendar icon with "Triggered" label (manual execution)
- **Scheduled jobs**: Calendar icon with scheduled time (periodic execution)
- **Data app jobs**: Data app icon and name
- **Standard jobs**: User who triggered + timestamp

### Child Jobs
Orchestration jobs can have child jobs:
- Display as expandable tree in table
- Can recursively contain more children (phases, retries)
- Each child shown with status, component, duration
- Used for workflow tracing and debugging

## User-Facing Features

### Feature 1: Job History Browsing
- **Description**: View all executed jobs with pagination and filtering
- **Workflow**: 
  1. Navigate to Queue page
  2. See recent 100 jobs in table
  3. Scroll down to load more (infinite scroll)
  4. Use filters to narrow by status, component, date
  5. Click job row to view details
- **Components**: JobsList, JobsTable, Filter controls

### Feature 2: Job Filtering & Search
- **Description**: Find specific jobs by various criteria
- **Filters**:
  - Status (all running/finished jobs)
  - Component type (extractor, writer, transformation, etc.)
  - Specific configuration
  - Date range (from/to)
  - Duration range (min/max seconds)
  - User who triggered
  - Run ID (for grouping multiple attempts)
- **Components**: Filter UI, JobsTable with filtered rendering

### Feature 3: Job Details & Logs
- **Description**: View full job execution details and complete log
- **Workflow**:
  1. Click on job in list
  2. Navigate to job detail page
  3. See job header with status, timing, component
  4. Scroll through full execution log
  5. View error message if failed
  6. Optionally see AI explanation of error
- **Components**: JobDetail, JobErrorModal

### Feature 4: Error Analysis with AI
- **Description**: Get AI-powered explanations for job failures
- **Workflow**:
  1. View failed job details
  2. Click "Explain with AI" button
  3. AI analyzes error and provides explanation
  4. User provides feedback (helpful/not helpful)
  5. Feedback tracked for AI improvement
- **Components**: JobErrorModal, AI integration

### Feature 5: Job Termination
- **Description**: Stop running jobs manually
- **Workflow**:
  1. View running job in list
  2. Click "Terminate" action button
  3. Confirm termination in dialog
  4. Job status changes to TERMINATING
  5. Poll until TERMINATED or ERROR
  6. Display updated status in list
- **Components**: JobsTable, TerminationAction

### Feature 6: Performance Monitoring
- **Description**: Visualize job execution patterns and spot anomalies
- **Workflow**:
  1. View jobs timeline/graph on Queue page
  2. See visual representation of recent job executions
  3. Identify slow/fast jobs with indicators
  4. Click job blocks to navigate to details
  5. Analyze performance trends over time
- **Components**: JobsGraphWithPaging

### Feature 7: One-Time Job Notifications
- **Description**: Get notified when specific job completes
- **Workflow**:
  1. View job details or in jobs table
  2. Click "Notify me" button
  3. Enter email for one-time notification
  4. Job completion triggers email
  5. Notification expires after 3 days
- **Components**: OneTimeNotificationButton

## Technical Debt & Observations

### Flux Architecture
- Module still uses legacy Flux pattern with Immutable.js
- Could be migrated to TanStack Query for cleaner data fetching
- Dispatcher pattern is replaced with React Query in newer modules

### Pagination Strategy
- Currently uses offset-based pagination (not cursor-based)
- Could hit performance issues with large offsets
- Consider keyset pagination for large datasets

### Real-Time Updates
- Jobs display shows snapshot at load time
- No automatic polling for status updates
- Manual refresh required to see status changes
- Could benefit from WebSocket updates for real-time status

### Query Parameter Management
- Query state maintained in URL params
- Could be centralized in route/state management
- Complex query validation and parsing needed

### Component Complexity
- JobsTable is large and handles many concerns
- Could be split into smaller components
- Render performance could suffer with 100+ jobs

## Code Examples

### Loading Jobs with Filters
```typescript
// From JobsList component
const handleFilterChange = (key: string, value: string) => {
  const query = {
    ...currentQuery,
    [key]: value,
    offset: 0, // Reset pagination on filter change
  };
  // Navigate with new query params
  navigate(`/queue?${qs.stringify(query)}`);
};

// This triggers JobsList re-render with new data
```

### Job Status Badge Logic
```typescript
// In JobsTable row rendering
const statusBadge = (job) => {
  const status = job.get('status');
  const statusConfig = {
    [JOBS_STATUS.SUCCESS]: { color: 'green', icon: 'check' },
    [JOBS_STATUS.ERROR]: { color: 'red', icon: 'times' },
    [JOBS_STATUS.WARNING]: { color: 'orange', icon: 'exclamation' },
    [JOBS_STATUS.PROCESSING]: { color: 'blue', icon: 'spinner' },
    // ... other statuses
  };
  
  return <StatusBadge {...statusConfig[status]} />;
};
```

### Terminating a Job
```typescript
// Action creator for job termination
const terminateJob = (jobId: string) => {
  dispatcher.handleViewAction({
    type: ActionTypes.JOB_TERMINATE,
    jobId,
  });

  return QueueApi.terminateJob(jobId)
    .then((job) => {
      dispatcher.handleViewAction({
        type: ActionTypes.JOB_TERMINATE_SUCCESS,
        job,
      });
    })
    .catch((error) => {
      dispatcher.handleViewAction({
        type: ActionTypes.JOB_TERMINATE_ERROR,
        jobId,
        error,
      });
      throw error;
    });
};
```

## Related Modules

- `admin`: Permissions for job termination and viewing
- `components`: Component metadata and type information
- `notifications`: Job completion notification system
- `configurations`: Configuration metadata lookup
- `storage`: Storage operations that create jobs
- `transformations-v2`: Transformation job tracking
- `flows`: Orchestration job tracking

## Testing

- Key test files: `queue.test.ts`, `queue-helpers.test.ts`
- Test coverage: Job filtering, status parsing, pagination logic
- Important test cases:
  - Job status transitions
  - Query parameter parsing and validation
  - Pagination offset calculations
  - Performance threshold logic
  - Error message extraction and display
- Integration tests: Job list filtering, detail navigation, termination flow

## UI/UX Notes

- Jobs table supports infinite scroll for better UX
- Color-coded status badges for quick visual recognition
- Hover tooltips on truncated text (component names, configs)
- Performance indicators highlight anomalies
- Job detail page has sticky header for easy reference
- Error modal can expand for full stack trace
- AI explanation streaming for better perceived performance

