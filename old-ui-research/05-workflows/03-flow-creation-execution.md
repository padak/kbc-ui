# Workflow: Flow Creation & Execution

## Overview

Flows (previously called Orchestrations) are the workflow orchestration system in Keboola Connection. They allow users to chain together multiple components (extractors, transformations, writers) into automated data pipelines with scheduling, error handling, and dependency management.

**URL Pattern**: `/admin/projects/{projectId}/flows`

**Module Reference**: See `docs/02-modules/flows-v2.md` for code details

## Prerequisites

- User must be authenticated and have access to the project
- User needs appropriate permissions to create/edit flows
- Components (extractors, transformations, writers) should be configured before adding to flows

---

## Flows Main Page

**Screenshot**: `docs/08-screenshots/06-flows-list.png`

**URL**: `/admin/projects/33/flows`

### Navigation Options

**Submenu Items** (from Flows button in sidebar):
1. **Flows** - Modern flow builder (current page)
2. **Conditional Flows Beta** - Advanced flows with conditional logic
3. **Orchestrations** - Legacy orchestration system

### Page Header

**Title**: "Flows"

**Action Buttons** (top right):
1. **Create Folder** - Organize flows into folders
2. **Create Flow** - Create new flow (green button)

**Components Used**:
- Button (variant: outline for folder, variant: primary for flow)

---

## Search and Filtering

**Search Bar**:
- Placeholder: "Search all flows (6)"
- Real-time filtering by flow name
- Searches across all flows

**Filter Buttons** (horizontal toggle group):
- **ALL** - Show all flows (default, blue highlight)
- **Scheduled** - Show only flows with active schedules
- **Not scheduled** - Show flows without schedules
- **Failed** - Show flows with recent failures
- **No configuration** - Show empty flows

**Components Used**:
- Input (with search icon)
- ToggleGroup (styled as pill buttons)

---

## Flows List View

### Table Structure

**Column Headers**:
1. **Name** (sortable) - Flow name with status badges
2. **Schedule** - Schedule description or "No Schedule"
3. **Last Change** (sortable) - Timestamp and user
4. **Run Results** - Visual indicator of recent runs
5. **Last Use** (sortable) - Last execution timestamp and user

**Checkbox Column**: Bulk selection for operations

### Flow Row Display

**Each Row Shows**:

**Example 1: "Sub-parent"**
- Checkbox for selection
- Flow name (clickable link)
- Schedule status: "No Schedule"
- Last change: "Oct 15 14:50" by "Petr EU Šimeček"
- Run results: Small bar chart showing recent run success/failure
- Last use: "Oct 15 14:50" by "Petr EU Šimeček"
- Options menu (three dots)

**Example 2: "My flow"**
- Flow name with **"NO CONFIGURATIONS"** badge (orange)
- No Schedule
- Last change timestamp
- Run results: "No run yet"
- Last use: "No run yet"

**Example 3: "Trigger 01"**
- Flow name with **"DISABLED"** badge (purple)
- Schedule: "At 57 minutes past the hour, every hour, every day (UTC)"
- Last change timestamp
- Run results: "No run yet"

**Components Used**:
- Custom table/list component
- Badge (for status indicators - "NO CONFIGURATIONS", "DISABLED")
- Link (for flow names)
- Avatar (for user icons)
- Mini chart (run results visualization)
- Button (icon button for options)

**Code Reference**: See `docs/02-modules/flows-v2.md` - Flows list component

---

## Flow Detail / Builder View

**Screenshot**: `docs/08-screenshots/07-flow-builder.png`

**URL**: `/admin/projects/33/flows/01k7kyn2e1ezc1etd0vvmwmfpy`

### Breadcrumb Navigation

**Path**: Flows > Parent

**Flow Icon**: Large circular flow icon (blue)

### Page Header

**Title**: "Parent" with edit button (pencil icon)
- Click to rename flow
- Dropdown menu for additional options

**Action Buttons** (right side):
1. **Add Description** - Add/edit flow description
2. **Run flow** - Execute flow immediately (green button with dropdown)
   - Dropdown shows run options
3. **More options** menu (three dots)

**Components Used**:
- Breadcrumb
- Button (with dropdown)
- DropdownMenu

---

## Builder Tab Interface

**Active Tab**: Builder (shows visual canvas)

**Other Tabs**:
1. **Builder** - Visual flow editor (active)
2. **All Runs** - Execution history
3. **Schedules** - Configure scheduling
4. **Notifications** - Set up alerts
5. **Versions** - Version history

**Components Used**:
- Tabs component with icons

---

## Flow Canvas (Visual Builder)

**Screenshot**: `docs/08-screenshots/07-flow-builder.png`

### Canvas Layout

**Background**:
- Dotted grid pattern
- Light gray background
- Zoomable and pannable

**Components on Canvas**:
1. **Step Label** - "Step 1" (black badge at top)
2. **Task Card** - Contains the flow/component
3. **Add Button** - "+" button below to add next step
4. **Connection Lines** - Vertical lines connecting steps

### Task Card Display

**Example: "Sub-parent" Flow Task**

**Card Structure**:
- White card with border
- Flow icon (blue circular icon)
- Task name: "Sub-parent"
- Task type label: "Flow"
- Options menu on hover (gear icon, delete icon)

**Visual Features**:
- Rounded corners
- Shadow on hover
- Click to select (highlights border)
- Drag to reorder

**Components Used**:
- Custom React Flow canvas node
- Card component
- Avatar (for icons)
- Button (icon buttons for actions)

**Code Reference**: `apps/kbc-ui/src/scripts/modules/flows-v2/react/components/Canvas.tsx`

---

## Task Configuration Sidebar

**Screenshot**: `docs/08-screenshots/08-flow-task-config.png`

**Trigger**: Click on a task card in the flow

**Sidebar Display** (right side):

### Header
- Task icon
- Task name: "Sub-parent"
- Task type: "Flow"
- Close button (X)

### Action Buttons
1. **EDIT CONFIGURATION** (green button) - Open component configuration
2. **REPLACE CONFIGURATION** (outline button) - Choose different component

### Settings Section

**Toggle Switches**:
1. **Component Enabled** - Toggle on/off (enabled by default)
   - When off, task is skipped during execution
2. **Continue on Failure** - Toggle on/off (disabled by default)
   - When on, flow continues even if this task fails

**Status Information**:
- **Last Run**: Link to last execution (e.g., "Terminated")
- Click to view run details

### Additional Options

**Links**:
- **Set advanced parameters** - Configure memory limits, timeouts, etc.
- **Remove task** - Delete task from flow

**Components Used**:
- Sidebar/Sheet component
- Button (primary and outline variants)
- Switch/Toggle
- Link

---

## Common Workflows

### 1. Create New Flow

**Steps**:
1. From Flows list page, click "Create Flow" button
2. Modal opens:
   - Enter flow name (required)
   - Enter description (optional)
   - Select folder (optional)
3. Click "Create" button
4. Flow builder opens with empty canvas
5. Add first task using "+" button

**Components**: Modal, Form, Input, Button

**Code Reference**: `docs/02-modules/flows-v2.md` - CreateFlowModal

---

### 2. Add Tasks to Flow

**Steps**:
1. In flow builder, click "+" button on canvas
2. Task selector modal opens with tabs:
   - **Components** - List of extractors, writers, apps
   - **Transformations** - SQL, Python, R, dbt transformations
   - **Flows** - Nested flows (sub-flows)
   - **Data Apps** - Streamlit apps
3. Search or browse for component
4. Select component configuration
5. Click "Add to Flow"
6. Task appears on canvas
7. Repeat to add more tasks

**Visual Feedback**:
- Task card appears with animation
- Connection line drawn automatically
- Canvas auto-scrolls to new task

**Components**: Modal, Search input, List, Button

---

### 3. Configure Task Settings

**Steps**:
1. Click task card on canvas
2. Sidebar opens on right
3. Configure settings:
   - Toggle "Component Enabled" if needed
   - Toggle "Continue on Failure" for error handling
   - Click "Set advanced parameters" for:
     - Memory allocation
     - Execution timeout
     - Retry settings
4. Click outside or close to save (auto-save)

**Components**: Sidebar, Switch, Link, Form

---

### 4. Organize Flow into Steps/Phases

**Steps**:
1. Drag tasks vertically to reorder
2. Tasks automatically group into steps
3. Step labels update ("Step 1", "Step 2", etc.)
4. Use parallel execution:
   - Drag tasks horizontally
   - Tasks side-by-side run in parallel
5. Steps execute sequentially (Step 1 → Step 2 → Step 3)

**Visual Indicators**:
- Step labels show grouping
- Horizontal positioning shows parallelism
- Vertical lines show execution order

---

### 5. Run Flow Manually

**Steps**:
1. From flow detail page, click "Run flow" button
2. Dropdown shows options:
   - **Run entire flow** - Execute all tasks
   - **Run from this task** - Start from specific task (when task selected)
3. Click desired option
4. Flow execution starts
5. Navigate to "All Runs" tab to monitor
6. Real-time updates show:
   - Current step
   - Task status (running, success, failed)
   - Execution time

**Components**: Button with dropdown, Progress indicators

---

### 6. Schedule Flow Execution

**Steps**:
1. From flow detail, click "Schedules" tab
2. Click "Create Schedule" button
3. Configure schedule:
   - **Type**: Recurring or One-time
   - **Frequency**: Hourly, Daily, Weekly, Monthly, Custom cron
   - **Time**: Specific time (UTC or project timezone)
   - **Enabled**: Toggle to activate/deactivate
4. Click "Save Schedule"
5. Schedule appears in list
6. Flow automatically runs at scheduled times

**Cron Expression Examples**:
- `0 * * * *` - Every hour
- `0 2 * * *` - Daily at 2 AM
- `0 9 * * 1` - Weekly on Monday at 9 AM

**Components**: Form, Select, TimePicker, Toggle, Button

---

### 7. View Flow Execution History

**Steps**:
1. From flow detail, click "All Runs" tab
2. Table displays execution history:
   - Run ID
   - Status (Success, Failed, Terminated, Running)
   - Start time
   - Duration
   - Triggered by (user or schedule)
3. Click any run to view details:
   - Step-by-step execution log
   - Task-level status
   - Error messages
   - Data processed
4. Click individual task for detailed logs

**Status Indicators**:
- **Success** - Green checkmark
- **Failed** - Red X with error details
- **Running** - Blue spinner
- **Terminated** - Gray stop icon

**Components**: Table, Status badges, Link, Timeline

---

### 8. Set Up Notifications

**Steps**:
1. From flow detail, click "Notifications" tab
2. Click "Add Notification" button
3. Configure notification:
   - **Trigger**: On success, On failure, On both
   - **Channel**: Email, Webhook, Slack
   - **Recipients**: Email addresses or webhook URLs
   - **Message**: Custom message template
4. Click "Save Notification"
5. Receive alerts when flow executes

**Notification Types**:
- **Email** - Send to team members
- **Webhook** - POST to external service
- **Slack** - Send to Slack channel

**Components**: Form, Select, Textarea, Button

**Code Reference**: `docs/02-modules/notifications.md`

---

### 9. Create Nested Flows (Sub-flows)

**Steps**:
1. Create parent flow
2. Create child flow separately
3. In parent flow builder, click "+" to add task
4. Select "Flows" tab in task selector
5. Choose child flow configuration
6. Add to parent flow
7. Child flow appears as task card
8. When parent runs, child flow executes as single task

**Benefits**:
- Reusable flow components
- Modular pipeline design
- Easier maintenance
- Better organization

**Example**:
- Parent: "Daily ETL Pipeline"
  - Step 1: "Extract Data" (sub-flow with multiple extractors)
  - Step 2: "Transform Data" (sub-flow with transformations)
  - Step 3: "Load Data" (sub-flow with writers)

---

## Canvas Interactions

### Visual Editing

**Drag & Drop**:
- Click and drag task cards to reorder
- Drop between existing tasks
- Drop horizontally for parallel execution
- Smooth animations during drag

**Zoom & Pan**:
- Mouse wheel to zoom in/out
- Click and drag canvas background to pan
- Mini-map in corner shows overall view
- Zoom controls (+ / - buttons)

**Selection**:
- Click task to select (highlights border)
- Click background to deselect
- Multi-select with Ctrl/Cmd + Click
- Drag selection box for multiple tasks

---

## Flow Builder Features

### Step Organization

**Automatic Grouping**:
- Tasks at same vertical level = same step
- Step labels auto-generate
- Rename steps by clicking label
- Collapse/expand steps for cleaner view

**Parallel Execution**:
- Tasks side-by-side run simultaneously
- Useful for independent extractors
- Reduces total execution time
- Visual indicator shows parallelism

**Sequential Execution**:
- Tasks vertically stacked run in order
- Next step waits for previous to complete
- Error in step stops flow (unless "Continue on Failure")

---

## Error Handling

### Task-Level Options

**Continue on Failure**:
- Enable per task
- Flow continues even if task fails
- Useful for non-critical tasks
- Failed tasks marked in run history

**Retry Logic**:
- Set in advanced parameters
- Automatic retry on transient errors
- Configurable retry count (1-5)
- Exponential backoff

### Flow-Level Options

**Global Settings**:
- Stop on first failure (default)
- Continue through all tasks
- Partial success handling
- Failure notifications

---

## Versions Tab

**Purpose**: Track flow configuration changes

**Features**:
- View all historical versions
- See who made changes and when
- Compare versions side-by-side
- Restore previous version
- Version comments/notes

**Components**: Timeline, Diff viewer, Button

---

## Empty States

### No Flows Created

**Display**:
- Empty state illustration
- "Create your first flow" message
- "Create Flow" call-to-action button
- Link to documentation

**Components**: EmptyState, Button

### Empty Flow (No Tasks)

**Display**:
- Empty canvas with grid
- Large "+" button in center
- Helper text: "Add your first task to get started"
- Quick start guide link

---

## Loading States

### Flow List Loading

**Display**:
- Skeleton rows (3-5 placeholders)
- Shimmer animation
- Maintains table structure

**Components**: Skeleton

### Canvas Loading

**Display**:
- Spinner in center
- "Loading flow..." text
- Fades to canvas when ready

**Components**: Spinner

---

## Error States

### Failed to Load Flow

**Display**:
- Error icon
- "Failed to load flow" message
- "Retry" button
- Link to support

**Components**: Alert (variant: error), Button

### Flow Execution Failed

**Display**:
- Red X icon on failed tasks
- Error message in task details
- Link to full error log
- Suggested fix (if available)

**Components**: Alert, Link

---

## Permission-Based UI

### Admin Users
- Full access to create/edit flows
- Can delete flows
- Can modify schedules
- Can view all runs

### Regular Users
- Can create and edit own flows
- Can run flows manually
- Can view run history
- Cannot delete flows created by others

### Read-Only Users
- View flows only
- Cannot edit or run
- Cannot create schedules
- Can view run history

**Code Reference**: See `docs/02-modules/admin.md` for RBAC implementation

---

## Keyboard Shortcuts

**On Flow Canvas**:
- `Space + Drag` - Pan canvas
- `Ctrl/Cmd + +` - Zoom in
- `Ctrl/Cmd + -` - Zoom out
- `Ctrl/Cmd + 0` - Reset zoom
- `Delete` - Delete selected task
- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Y` - Redo
- `Ctrl/Cmd + S` - Save flow (auto-save already active)

**On Flow List**:
- `c` - Create new flow
- `/` - Focus search
- `↑/↓` - Navigate list
- `Enter` - Open selected flow

---

## Technical Implementation

### State Management
- **Pattern**: Zustand (modern local state)
- **Store**: FlowBuilderStore for canvas state
- **Actions**: Flux actions for API calls
- **Real-time**: WebSocket updates for running flows

**Code Reference**: See `docs/02-modules/flows-v2.md` - Architecture section

### Canvas Technology
- **Library**: React Flow (react-flow-renderer)
- **Nodes**: Custom React components
- **Edges**: Custom connection lines
- **Rendering**: Canvas-based for performance
- **Interactions**: Drag-drop, zoom, pan

### API Endpoints
- `GET /v2/flows` - List all flows
- `GET /v2/flows/{id}` - Get flow details
- `POST /v2/flows` - Create new flow
- `PUT /v2/flows/{id}` - Update flow
- `DELETE /v2/flows/{id}` - Delete flow
- `POST /v2/flows/{id}/run` - Execute flow
- `GET /v2/flows/{id}/runs` - Get run history
- `POST /v2/flows/{id}/schedules` - Create schedule

**Code Reference**: See `docs/06-api-contracts/api-clients.md`

### Performance Optimizations
- Virtual rendering for large flows
- Debounced auto-save (500ms)
- Lazy loading of run history
- Cached flow configurations
- WebSocket for live updates

---

## Advanced Features

### Conditional Flows (Beta)

**Access**: Flows menu > "Conditional Flows Beta"

**Features**:
- If/else branching logic
- Conditional task execution
- Dynamic parameter passing
- Variable evaluation
- Advanced error handling

**Use Cases**:
- Data quality checks before processing
- Different paths for different data volumes
- Environment-specific logic

---

### Flow Templates

**Purpose**: Pre-built flow patterns

**Common Templates**:
- Daily data sync
- ETL pipeline
- Data quality monitoring
- Incremental load pattern
- Full refresh pattern

**Usage**:
- Select template when creating flow
- Customize tasks and schedule
- Save as personal template

---

## Best Practices

### Flow Organization

**Naming Conventions**:
- Descriptive names: "Daily Sales ETL"
- Include frequency: "Hourly Metrics Sync"
- Note environment: "Production Data Load"

**Folder Structure**:
- Group by data source
- Group by business function
- Group by schedule frequency

### Error Handling

**Recommendations**:
- Enable "Continue on Failure" for non-critical tasks
- Set up failure notifications
- Add retry logic for flaky components
- Test flows in development first

### Performance

**Optimization Tips**:
- Use parallel execution for independent tasks
- Schedule during off-peak hours
- Monitor execution times
- Optimize slow transformations
- Break large flows into smaller sub-flows

---

## Cross-References

### Related Workflows
- Storage Operations: Input/output for flow tasks
- Transformations: Common flow tasks
- Component Configuration: Required before adding to flows
- Job Monitoring: View flow execution details

### Module Documentation
- Flows-v2 module: `docs/02-modules/flows-v2.md`
- Legacy flows: `docs/02-modules/flows.md`
- Orchestrations-v2: `docs/02-modules/orchestrations-v2.md`
- Queue/Jobs: `docs/02-modules/queue.md`

### Design System
- Button: `docs/04-components/form-components.md`
- Tabs: `docs/04-components/INDEX.md`
- Modal: `docs/04-components/INDEX.md`
- Badge: `docs/04-components/INDEX.md`
- Switch: `docs/04-components/form-components.md`
- Sidebar/Sheet: `docs/04-components/INDEX.md`

---

## Notes

- Flows replaced legacy Orchestrations (still available for backwards compatibility)
- Flow builder uses React Flow library for canvas interactions
- Real-time updates via WebSocket during flow execution
- Auto-save prevents data loss
- Nested flows can be up to 3 levels deep (recommended max: 2)
- Canvas supports 100+ tasks (performance tested)
- Schedule timezone defaults to UTC (configurable per project)
- Flow execution logs retained for 30 days (configurable)

---

**Last Updated**: 2025-10-18
**Phase**: 3 - UI Exploration
**Status**: Complete
