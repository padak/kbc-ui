# Module: Notifications

## Overview

The Notifications module manages job completion and event-based notifications for Keboola components. It allows users to subscribe to events such as job success, failure, warnings, or long-running jobs and receive notifications via email or webhook. The module supports recurring subscriptions (for specific configurations) and one-time notifications (for individual jobs), with configurable triggers and recipient management.

## File Structure

```
notifications/
├── constants.ts                       # Event types, channels, operators
├── api.ts                             # Notification service API client
├── actions.ts                         # Flux action creators
├── helpers.ts                         # Utility functions for notification processing
├── Detail.tsx                         # Detail page (if applicable)
├── components/
│   ├── Notifications.tsx              # Main notification subscription UI
│   ├── NotificationBox.tsx            # Individual notification display
│   ├── OneTimeNotificationButton.tsx  # One-time notification button
│   └── ToleranceInput.tsx             # Duration tolerance input
└── store.ts                           # Flux store for notification state
```

## Routes

Notifications are typically embedded in configuration detail pages rather than having standalone routes. They appear in:
- Transformation/extractor/writer configuration detail pages
- Orchestration configuration detail pages
- Job detail pages (one-time notifications)

## Key Components

### Notifications
- **Location**: `apps/kbc-ui/src/scripts/modules/notifications/components/Notifications.tsx`
- **Purpose**: Display and manage all notification subscriptions for a specific component configuration
- **Props**:
  - `admins`: Map of admin user data
  - `allNotifications`: All project-level notifications (to filter current config)
  - `notifications`: List of notifications for this config (filtered)
  - `componentId`: Component ID (e.g., 'keboola.python-transformation-v2')
  - `configId`: Configuration ID
  - `readOnly`: Boolean to disable editing
- **State**:
  - Saving state per notification type
  - Form visibility for adding new notifications
  - Email/webhook input value
- **Display Elements**:
  - Notification type sections (Success, Failure, Warning, Long Running)
  - Recipient list (emails or webhooks) per type
  - Add/remove notification buttons
  - Tolerance input for long-running job notifications
  - Permission check (show/hide based on user privileges)
- **Key Features**:
  - Add multiple email recipients per event type
  - Support both email and webhook notifications
  - Configure tolerance for "job running long" warnings
  - Show saving/loading states
  - Handle API errors gracefully

### NotificationBox
- **Location**: `apps/kbc-ui/src/scripts/modules/notifications/components/NotificationBox.tsx`
- **Purpose**: Display individual notification subscription with metadata
- **Props**:
  - `notification`: Notification data (Immutable Map)
  - `title`: Human-readable event name
  - `text`: Description of the event
  - `icon`: Icon identifier
  - `emails`: List of email recipients
  - `webhooks`: List of webhook URLs
  - `type`: Event type constant
  - `onAdd`: Callback to add notification
  - `onRemove`: Callback to remove notification
  - `readOnly`: Disable editing
- **Display Elements**:
  - Icon with color indicator
  - Event type title and description
  - List of current recipients (emails/webhooks)
  - Add button with input field
  - Remove buttons next to each recipient
  - Loading indicator during API call

### OneTimeNotificationButton
- **Location**: `apps/kbc-ui/src/scripts/modules/notifications/components/OneTimeNotificationButton.tsx`
- **Purpose**: Allow users to set up one-time notifications for specific jobs
- **Props**:
  - `job`: Job data (Immutable Map)
  - `userEmail`: Current user's email
- **Display Elements**:
  - "Notify me" button
  - Modal/popover for email input
  - Form to add one-time notification
  - Success message after submission
- **Key Features**:
  - Pre-fills with current user email
  - Can specify alternative email
  - Notification expires after 3 days
  - Works for job success, failure, and warnings

### ToleranceInput
- **Location**: `apps/kbc-ui/src/scripts/modules/notifications/components/ToleranceInput.tsx`
- **Purpose**: Allow configuration of duration tolerance for long-running job alerts
- **Props**:
  - `value`: Current tolerance percentage
  - `onChange`: Callback with new value
  - `disabled`: Disable editing
- **Display Elements**:
  - Number input field
  - "% overtime" label
  - Explanation text (e.g., "Alert if job takes 110% of average time")
  - Validation feedback

## API Endpoints

| Method | Endpoint | Purpose | Response Type |
|--------|----------|---------|---------------|
| GET | `/notifications/project-subscriptions` | List all notifications | Notification[] |
| POST | `/notifications/project-subscriptions` | Create notification | Notification |
| DELETE | `/notifications/project-subscriptions/:id` | Remove notification | - |

## Notification Data Structure

### Notification
```typescript
type Notification = {
  id: string | number;
  event: string;                      // e.g., 'job-succeeded', 'job-failed'
  expiresAt?: string;                 // e.g., '+3 days' for one-time
  filters: NotificationFilter[];       // Conditions for triggering
  recipient: {
    channel: 'email' | 'webhook';
    address?: string;                 // Email address
    url?: string;                      // Webhook URL
  };
}

type NotificationFilter = {
  field: string;                      // e.g., 'job.component.id', 'branch.id'
  value: string | number;             // Filter value
  operator?: string;                  // '==' or '>='
}
```

## Event Types & Constants

### Job Events
```typescript
// Standard job events
EVENT_JOB_SUCCESS = 'job-succeeded'                    // Job completed successfully
EVENT_JOB_FAILED = 'job-failed'                        // Job failed with error
EVENT_JOB_WARNING = 'job-succeeded-with-warning'       // Job succeeded with warnings
EVENT_JOB_PROCESSING = 'job-processing-long'           // Job running longer than threshold

// Phase job events (for orchestrations)
EVENT_PHASE_JOB_SUCCESS = 'phase-job-succeeded'
EVENT_PHASE_JOB_FAILED = 'phase-job-failed'
EVENT_PHASE_JOB_WARNING = 'phase-job-succeeded-with-warning'
```

### Notification Channels
```typescript
CHANNELS = {
  EMAIL: 'email',        // Email notification
  WEBHOOK: 'webhook',    // HTTP POST webhook
}
```

### Filter Fields
```typescript
FIELD_JOB_ID = 'job.id'                              // Specific job
FIELD_JOB_COMPONENT_ID = 'job.component.id'          // Component type
FIELD_JOB_CONFIGURATION_ID = 'job.configuration.id'  // Configuration ID
FIELD_BRANCH_ID = 'branch.id'                        // Dev branch ID
FIELD_JOB_DURATION_OVERTIME_PERCENTAGE = 'durationOvertimePercentage' // Duration threshold
```

### Filter Operators
```typescript
OPERATOR_EQUAL = '=='                 // Exact match
OPERATOR_BIGGER_OR_EQUAL = '>='       // Greater than or equal (for duration %)
```

### Default Values
```typescript
DEFAULT_TOLERANCE = 20                // 20% overtime to trigger long-running alert
```

## State Management

- **Pattern Used**: Flux architecture with Immutable.js (legacy)
- **Key Stores**:
  - `NotificationsStore`: Manages all project-level notifications
    - `notifications`: List of all subscriptions
    - Loading state
- **Data Flow**:
  1. Component loads notifications via `loadNotifications()`
  2. Action creators fetch from API
  3. Dispatcher triggers store update
  4. Store emits change
  5. Component re-renders with fresh list
  6. User adds/removes notification
  7. API call made immediately
  8. Store updated with new list
  9. Optimistic updates (UI updates before confirmation)
- **Query Structure**:
  - `loadNotifications()`: Load if not cached
  - `loadNotificationsForce()`: Force reload from API
  - `addNotification()`: Create new subscription
  - `removeNotification()`: Delete subscription

## Dependencies

### Internal Modules
- `admin`: User privileges check (canManageNotifications)
- `components`: Component metadata and type lookup
- `dev-branches`: Current branch ID for branch-specific notifications
- `queue`: Job type detection (phase jobs, standard jobs)

### External Packages
- `immutable.js`: Immutable data structures
- `bluebird`: Promise utilities

### Design System Components
- `Button`: Action buttons
- `Input`: Email/webhook input fields
- `Modal`: Popover for adding notifications
- `Icon`: Event type icons
- `Badge`: Channel badges (email/webhook)
- `Loading`: Spinner during operations

## Notable Patterns

### Preparing Notification Payload
```typescript
// Helper function to build subscription for API
const prepareNotification = (params: {
  channel: CHANNEL;
  componentId: string;
  configurationId: string;
  notifications: List<any>;
  eventType: string;
  value: string;  // Email or webhook URL
}) => {
  return {
    event: params.eventType,
    filters: [
      { field: FIELD_BRANCH_ID, value: getCurrentBranchId() },
      { field: FIELD_JOB_COMPONENT_ID, value: params.componentId, operator: OPERATOR_EQUAL },
      { field: FIELD_JOB_CONFIGURATION_ID, value: params.configurationId, operator: OPERATOR_EQUAL },
      // For long-running: add duration tolerance
      params.eventType === EVENT_JOB_PROCESSING && {
        field: FIELD_JOB_DURATION_OVERTIME_PERCENTAGE,
        value: (tolerance / 100),  // Convert percentage to decimal
        operator: OPERATOR_BIGGER_OR_EQUAL,
      },
    ].filter(Boolean),
    recipient:
      params.channel === CHANNELS.WEBHOOK
        ? { channel: CHANNELS.WEBHOOK, url: params.value }
        : { channel: CHANNELS.EMAIL, address: params.value },
  };
};
```

### Branch-Specific Filtering
```typescript
// Only show notifications for current dev branch or default branch
const filterCurrentBranchNotifications = (notifications: Record<string, unknown>[]) => {
  const currentBranchId = DevBranchesStore.isDevModeActive()
    ? DevBranchesStore.getCurrentId()
    : DevBranchesStore.getDefaultBranchId();

  return notifications.filter((notification) => {
    const branchFilter = notification.filters.find(
      (f) => f.field === FIELD_BRANCH_ID,
    );
    
    // Include if no branch filter or branch matches current
    return !branchFilter || branchFilter.value === currentBranchId.toString();
  });
};
```

### One-Time Notifications
```typescript
// Create temporary subscriptions that expire in 3 days
const prepareOneTimeNotifications = (job: Map<string, any>, email: string) => {
  const events = isPhaseJob(job)
    ? [EVENT_PHASE_JOB_SUCCESS, EVENT_PHASE_JOB_FAILED, EVENT_PHASE_JOB_WARNING]
    : [EVENT_JOB_SUCCESS, EVENT_JOB_FAILED, EVENT_JOB_WARNING];

  return events.map((event) => {
    return {
      event: event,
      expiresAt: '+3 days',  // Automatic expiration
      filters: [
        { field: FIELD_JOB_ID, value: job.get('id') },
        { field: FIELD_BRANCH_ID, value: job.get('branchId') || getDefaultBranchId() },
      ],
      recipient: { channel: 'email', address: email },
    };
  });
};
```

### Tolerance Update Logic
```typescript
// Update duration overtime percentage for long-running job alert
const updateNotificationTolerance = (notification: Map<string, any>, tolerance: string) => {
  const parsedTolerance = parseInt(tolerance, 10) || 1;

  if (notification.get('event') !== EVENT_JOB_PROCESSING) {
    return notification;  // Only affects long-running alerts
  }

  return notification.update('filters', (filters) => {
    return filters.map((filter) => {
      if (filter.get('field') !== FIELD_JOB_DURATION_OVERTIME_PERCENTAGE) {
        return filter;
      }
      // Convert percentage to decimal for API (20% -> 0.20)
      return filter.set('value', parsedTolerance / 100);
    });
  });
};
```

### Phase Job Detection
```typescript
// Orchestrations have phase jobs, other components don't
const supportsWarningNotifications = (componentId: string) => {
  return componentId === KEBOOLA_ORCHESTRATOR;
};
```

## User-Facing Features

### Feature 1: Email Notifications on Job Success
- **Description**: Get notified via email when a job completes successfully
- **Workflow**:
  1. Open configuration detail page
  2. Scroll to Notifications section
  3. Click "Add" under "Success" event type
  4. Enter email address(es) - comma-separated for multiple
  5. Click "Save" or press Enter
  6. Email added to list
  7. On each successful job, user receives email notification
- **Components**: Notifications, NotificationBox

### Feature 2: Email Notifications on Job Failure
- **Description**: Get notified via email when a job fails
- **Workflow**:
  1. Open configuration detail page
  2. Click "Add" under "Failure" event type
  3. Enter email address
  4. Save
  5. On job failure, email sent to all subscribers
- **Components**: Notifications, NotificationBox

### Feature 3: Long-Running Job Alerts
- **Description**: Get alerted if job takes longer than expected
- **Workflow**:
  1. Open configuration detail page
  2. Find "Long Running" event type
  3. See default tolerance (20%)
  4. Click input to change tolerance (e.g., 30% means alert if > 130% average time)
  5. Save
  6. If job duration exceeds threshold, notification sent
  7. Notification sent mid-job (not waiting for completion)
- **Components**: Notifications, ToleranceInput, NotificationBox

### Feature 4: Webhook Notifications
- **Description**: Send notifications to custom webhook URLs for integration with external systems
- **Workflow**:
  1. Open configuration detail page
  2. Click "Add" under desired event type
  3. Switch channel to "Webhook"
  4. Enter webhook URL
  5. Save
  6. On event, HTTP POST sent to webhook with job data
  7. Can be used with Slack, custom applications, etc.
- **Components**: Notifications, NotificationBox

### Feature 5: One-Time Job Notifications
- **Description**: Set up temporary notification for a specific job
- **Workflow**:
  1. View job in queue or job detail page
  2. Click "Notify me" button on job row
  3. Enter email (pre-filled with current user)
  4. Confirm
  5. Notification created with 3-day expiration
  6. On job completion, user gets email
  7. Notification automatically removed after 3 days
- **Components**: OneTimeNotificationButton, Job queue/detail pages

### Feature 6: Remove Notifications
- **Description**: Unsubscribe from notifications
- **Workflow**:
  1. Open configuration detail page
  2. In Notifications section, see list of recipients
  3. Click "x" or remove button next to email/webhook
  4. Confirm deletion
  5. Notification immediately removed
  6. User stops receiving notifications
- **Components**: Notifications, NotificationBox

### Feature 7: Dev Branch Notifications
- **Description**: Manage separate notifications for dev branches
- **Workflow**:
  1. Switch to dev branch (experimental mode)
  2. Open configuration detail page
  3. Notifications shown for current dev branch only
  4. Can add/remove notifications specific to dev branch
  5. Switch back to main branch
  6. Different notification list shown
  7. Each branch has independent subscriptions
- **Components**: Notifications (with branch filtering)

## Technical Debt & Observations

### Flux Architecture
- Module uses legacy Flux pattern
- Could be refactored to use TanStack Query
- Store updates are relatively simple

### API Integration
- Notifications service is external microservice
- Could add retry logic for failed operations
- Error handling could be improved with user feedback

### Form Handling
- Manual input validation
- Could use React Hook Form
- Comma-separated email parsing is fragile

### Real-Time Updates
- Notifications don't auto-sync if updated in another tab
- Could use WebSocket for real-time updates
- Manual refresh required to see changes

### Branch Context
- Filtering by branch ID adds complexity
- Not all components may be branch-aware
- Could simplify by centralizing branch context

### Tolerance Input
- Limited UI for duration percentage input
- Could have slider or preset options
- Default (20%) may not suit all use cases

## Code Examples

### Adding Email Notification
```typescript
// In Notifications component
const handleAddNotification = (channel: CHANNEL, type: string, value: string) => {
  const newNotifications = value
    .split(',')  // Support multiple emails
    .filter((v) => !!v && !getCurrentEmails(type).includes(v.toLowerCase()))
    .map((email) => {
      return prepareNotification({
        channel,
        componentId: props.componentId,
        configurationId: props.configId,
        notifications: props.notifications,
        eventType: type,
        value: email.trim(),
      });
    });

  onChange(type, () => {
    return Promise.map(newNotifications, addNotification, { concurrency: 3 });
  });
};
```

### Loading and Filtering Notifications
```typescript
// In configuration detail component
useEffect(() => {
  loadNotificationsForce().then(() => {
    const allNotifications = NotificationsStore.getAll();
    const filtered = filterCurrentBranchNotifications(allNotifications);
    const configSpecific = filtered.filter(
      (n) => n.getIn(['filters', 0, 'value']) === configId,
    );
    setNotifications(configSpecific);
  });
}, [configId]);
```

### Setting Up One-Time Notification
```typescript
// In job detail or queue component
const handleNotifyMe = (email: string) => {
  const oneTimeNotifs = prepareOneTimeNotifications(job, email);
  
  return Promise.map(oneTimeNotifs, (notif) => {
    return addNotification(notif);
  }).then(() => {
    showSuccessMessage('Notification set up! You will be notified for 3 days.');
  });
};
```

## Related Modules

- `queue`: Job status changes trigger notifications
- `admin`: User privileges for managing notifications
- `components`: Component type information
- `dev-branches`: Branch context for notification filtering
- `storage`: Storage operations that create jobs
- `configurations`: Configuration metadata lookup

## Testing

- Key test files: `notifications.test.ts`, `helpers.test.ts`
- Test coverage:
  - Notification payload preparation
  - Branch filtering logic
  - Tolerance value parsing
  - Email/webhook validation
  - One-time notification expiration
- Important test cases:
  - Multiple email recipients
  - Branch-specific filtering
  - Duration tolerance conversion (% to decimal)
  - Phase job vs standard job event types
  - Obsolete component handling
  - Phase job vs standard job warning support
- Integration tests:
  - Add/remove notification flow
  - Tolerance update flow
  - One-time notification creation
  - Branch context filtering

## Email Template Examples

### Job Success Notification
```
Subject: Job Completed Successfully - [Config Name]

Your job has completed successfully!

Configuration: [Config Name]
Component: [Component Name]
Duration: [X minutes Y seconds]
Completed at: [Timestamp]

[Link to Job Details]
```

### Job Failure Notification
```
Subject: Job Failed - [Config Name]

Your job failed with the following error:

Configuration: [Config Name]
Error: [Error Message]
Duration: [X minutes]
Failed at: [Timestamp]

[Link to Job Details with Full Error]
```

### Long-Running Alert
```
Subject: Job Running Longer Than Expected - [Config Name]

Your job is running longer than expected.

Configuration: [Config Name]
Duration so far: [X minutes]
Average duration: [Y minutes] (20% overtime)
Started at: [Timestamp]

[Link to Job Details]
```

## Webhook Payload Example

```json
{
  "event": "job-succeeded",
  "job": {
    "id": "123456789",
    "component": {
      "id": "keboola.python-transformation-v2",
      "name": "Python Transformation"
    },
    "configuration": {
      "id": "my-config-123",
      "name": "My Transformation"
    },
    "status": "success",
    "startTime": "2024-01-15T10:00:00Z",
    "endTime": "2024-01-15T10:05:30Z",
    "duration": 330,
    "message": "Job completed successfully"
  }
}
```

