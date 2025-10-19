# Module: Flows v2 (Modern Flow Builder)

## Overview

The flows-v2 module is a complete redesign of the orchestration/flow system using modern React patterns and React Flow for canvas-based visual flow building. It provides a visual builder for creating data pipelines with phases, tasks, conditions, and notifications. This is the next-generation flow builder replacing the legacy flows module.

**Key Differences from Legacy:**
- Uses React Flow for canvas management instead of custom Graph component
- Zustand for builder state management instead of React component state
- TypeScript with strict typing throughout
- Advanced condition builder with nested operators
- Support for notifications and variable tasks as first-class citizens
- Undo/redo functionality built-in
- Modern modular architecture with clear separation of concerns

## File Structure

```
flows-v2/
├── Index.tsx                      # Main list view with filtering
├── Detail.tsx                     # Detail view layout coordinator
├── DetailHeader.tsx               # Header actions and info
├── IndexHeader.tsx                # Search and filters header
├── Versions.tsx                   # Version history view
├── actions.ts                     # Flow save/update actions
├── constants.ts                   # Routes, tabs, defaults
├── helpers.ts                     # Utilities and state helpers
├── hooks/
│   └── useFlow.ts                # Main data collection hook
├── builder/
│   ├── Builder.tsx               # Main builder component wrapper
│   ├── BuilderCanvas.tsx         # React Flow canvas implementation
│   ├── types.ts                  # TypeScript type definitions
│   ├── helpers.ts                # Canvas and layout helpers
│   ├── hooks.ts                  # Canvas-specific hooks
│   ├── actions.ts                # Builder state actions
│   ├── store/
│   │   ├── BuilderProvider.tsx   # Context provider setup
│   │   ├── store.ts              # Zustand store definition
│   │   └── undoRedoStore.ts      # Undo/redo state management
│   ├── nodes/
│   │   ├── Phase.tsx             # Phase node component
│   │   ├── AddNode.tsx           # Add new phase node
│   │   └── EmptyNode.tsx         # Empty state node
│   ├── edges/
│   │   ├── EdgeWithButton.tsx    # Conditional edges with buttons
│   │   └── AloneEdge.tsx         # Simple edges
│   └── components/
│       ├── CanvasControls.tsx    # Zoom and pan controls
│       ├── Sidebar.tsx           # Right sidebar for modals
│       ├── TaskDetailModal.tsx   # Edit job task settings
│       ├── TaskParamsModal.tsx   # Configure component params
│       ├── ConditionDetailModal.tsx # Build flow conditions
│       ├── NotificationDetailModal.tsx # Setup notifications
│       ├── VariableDetailModal.tsx    # Setup variables
│       ├── Conditions/            # Condition builder components
│       ├── DndProvider.tsx        # Drag and drop setup
│       ├── Search.tsx             # Task search in builder
│       ├── PhaseTask.tsx          # Task in phase rendering
│       ├── TaskBox.tsx            # Task card component
│       ├── TaskDelay.tsx          # Delay configuration
│       ├── TaskRetryContent.tsx   # Retry strategy UI
│       └── ... (many more UI components)
├── components/
│   ├── JobsTable/
│   │   ├── JobsTable.tsx          # Main jobs/runs table
│   │   ├── Table.tsx              # TanStack table wrapper
│   │   ├── PhaseCell.tsx          # Phase display in table
│   │   ├── ConditionCell.tsx      # Condition display
│   │   ├── TaskJobCell.tsx        # Task job display
│   │   ├── StatusCell.tsx         # Status badge
│   │   ├── DurationCell.tsx       # Execution time
│   │   └── ... (other cell types)
│   ├── FlowConfigs.tsx            # Flow list cards
│   ├── FlowActions.tsx            # Flow menu actions
│   ├── ActivateFlowSwitch.tsx    # Enable/disable toggle
│   └── Tabs.tsx                   # Tab navigation
└── routes.tsx                     # Route definitions

```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/flows-v2` | `Index` | List all flows with search and filters |
| `/flows-v2/:config` | `Detail` | Flow detail view with builder and tabs |
| `/flows-v2/:config/versions` | `Versions` | Version history of a flow |

## Key Components

### Index (List View)
- **Location**: `apps/kbc-ui/src/scripts/modules/flows-v2/Index.tsx`
- **Purpose**: Display list of flows with advanced filtering (scheduled, failed, no config)
- **Props**: None (uses stores directly)
- **State Management**: Immutable.js for filter state, store hooks for data
- **Features**:
  - Search by flow name, description, folder
  - Filter by: scheduled/not scheduled, failed status, no configuration
  - Folder-based organization
  - Latest job status indicators
  - Template instance tracking

### Detail (Detail View)
- **Location**: `apps/kbc-ui/src/scripts/modules/flows-v2/Detail.tsx`
- **Purpose**: Coordinate flow detail page with tabs and builder
- **Props**: None (uses hooks)
- **State Management**: `useFlow` hook collects all data
- **Child Components**:
  - `Tabs` - Tab navigation
  - `FlowActions` - Menu and run button
  - `Builder` - Flow canvas editor
  - `JobsTable` - Execution history
  - `Schedules` - Trigger and schedule config
  - `Notifications` - Notification setup
  - `Versions` - Version history

### Builder (Canvas)
- **Location**: `apps/kbc-ui/src/scripts/modules/flows-v2/builder/BuilderCanvas.tsx`
- **Purpose**: Main React Flow canvas implementation
- **Props**: Flow configuration, components, read-only flag
- **State Management**: Zustand store via context
- **Features**:
  - Phase nodes with nested tasks
  - Drag-to-canvas task addition
  - Condition-based flow routing
  - Full/half-screen modes
  - Auto-layout with ELK
  - Search and filtering within builder

### Sidebar (Modal Manager)
- **Location**: `apps/kbc-ui/src/scripts/modules/flows-v2/builder/components/Sidebar.tsx`
- **Purpose**: Route to correct detail modal based on selected item
- **Child Modals**:
  - `TaskDetailModal` - Configure job tasks
  - `ConditionDetailModal` - Build conditions
  - `NotificationDetailModal` - Setup notifications
  - `VariableDetailModal` - Setup variables
  - `AddTaskModal` - Add new task

### JobsTable
- **Location**: `apps/kbc-ui/src/scripts/modules/flows-v2/components/JobsTable/JobsTable.tsx`
- **Purpose**: Display execution history with nested rows
- **Props**: Jobs, admins, all components, loading state
- **Features**:
  - Hierarchical table (Jobs > Phases > Tasks > Retries)
  - Status indicators
  - Duration tracking
  - Expandable rows
  - Links to job details

## API Endpoints

| Method | Endpoint | Purpose | Response Type |
|--------|----------|---------|---------------|
| GET | `/api/v3/storage/components/keboola.flow/configs` | List flows | ComponentConfigurations |
| GET | `/api/v3/storage/components/keboola.flow/configs/:id` | Get flow details | ComponentConfiguration |
| PUT | `/api/v3/storage/components/keboola.flow/configs/:id` | Update flow config | Success response |
| DELETE | `/api/v3/storage/components/keboola.flow/configs/:id` | Delete flow | Success response |
| GET | `/api/v3/storage/components/keboola.scheduler/configs` | Get schedulers | ComponentConfigurations |
| GET | `/api/v3/queue/jobs?component=keboola.flow&config=:id` | Get flow jobs | Jobs |

## State Management

### Pattern Used
- **Canvas State**: Zustand with DevTools (builder-store)
- **Data State**: Immutable.js stores (legacy Flux pattern)
- **Server State**: TanStack Query (jobs, triggers, notifications)
- **Local State**: Component state + local storage

### Key Stores/Queries

**BuilderStore (Zustand)** - Canvas/UI State
- `nodes` - React Flow nodes (phases, add buttons, empty state)
- `edges` - React Flow edges with conditions
- `selectedTaskId`, `selectedPhaseId`, `selectedConditionId` - Current selection
- `nodeDragging` - Dragging state
- `searchQuery` - Search term in builder
- Actions: `setNodes`, `onNodesChange`, `onEdgesChange`, `refreshLayout`

**useFlow Hook** - Data Collection
- Aggregates from multiple stores
- Returns flow config, phases, tasks, jobs, schedulers
- Determines UI capabilities (run allowed, dev mode, etc.)
- Detects if flow has unsaved changes

**Local State** - Temporary Changes
- Stored in `InstalledComponentsStore.getLocalState(KEBOOLA_FLOW, configId)`
- Holds draft phases/tasks before save
- Stores running job reference
- Cleared on successful save

### Data Flow

```
useFlow Hook
  ├── InstalledComponentsStore (flow config)
  ├── RoutesStore (current config ID)
  ├── JobsStore (latest jobs)
  ├── EventTriggersStore (event triggers)
  ├── NotificationsStore (notifications)
  ├── ApplicationStore (permissions, features)
  └── DevBranchesStore (dev mode status)
        ↓
  Detail Component
  ├── Builder (passes config/phases/tasks)
  │   └── BuilderProvider (Zustand context)
  │       └── BuilderCanvas (React Flow)
  ├── JobsTable (passes jobs)
  ├── Tabs (manages active tab)
  └── Schedules/Notifications (specific configs)
```

## Dependencies

### Internal Modules
- `modules/components` - Component and configuration management
- `modules/queue` - Job execution and monitoring
- `modules/scheduler` - Schedule and trigger management
- `modules/event-trigger` - Event trigger configuration
- `modules/notifications` - Notification system
- `modules/storage` - Storage buckets and tables
- `modules/orchestrations-v2` - Shared orchestration helpers
- `modules/admin` - Permission checks
- `modules/dev-branches` - Development mode features

### External Packages
- `@xyflow/react` - Canvas rendering and graph management
- `zustand` - Client state management for canvas
- `@tanstack/react-query` - Server state management
- `@tanstack/react-table` - Table component
- `immutable` - Immutable data structures
- `react-beautiful-dnd` - Drag and drop (legacy, still used in some places)
- `@keboola/design` - Design system components
- `dayjs` - Date manipulation

### Design System Components
- `Button`, `Card`, `Modal`, `Badge`, `Tooltip`
- `Search`, `Icon`, `Separator`
- `Table` (from react-table wrapper)

## Notable Patterns

### 1. Zustand Builder Store
```typescript
// Context-based store with DevTools enabled
const store = useBuilderStore((state) => [
  state.nodes,
  state.edges,
  state.selectedTaskId,
]);
```

### 2. Local State for Draft Changes
```typescript
// Store draft phases/tasks in local state before save
updateLocalStateValue(configId, ['phases'], phases);
updateLocalStateValue(configId, ['tasks'], tasks);
// Retrieve on next load
const phases = getLocalStateValue(configId, ['phases'], defaultPhases);
```

### 3. Flow Validation
```typescript
// Comprehensive validation of flow structure
isFlowValid(phases, tasks) - checks all phases and tasks
shouldAllowRunFlow(tasks) - ensures at least one configured task
jobVersionMatch(config, job) - checks job runs with current version
```

### 4. Condition Normalization
- Complex condition trees normalized to OR-of-ANDs form
- Supports nested phase operators (ALL_TASKS_IN_PHASE, ANY_TASKS_IN_PHASE)
- Function operands (COUNT, DATE) for advanced conditions

### 5. React Flow Integration
- Custom node types: Phase (tasks container), Add (new phase), Empty (initial state)
- Custom edge types: EdgeWithButton (has condition info), AloneEdge (simple)
- Auto-layout using ELK algorithm
- Handles viewport persistence via URL search params

### 6. Autosave Pattern
```typescript
// Conditional autosave when config selected
if (options?.autosave && ApplicationStore.hasEnabledFlowAutosave()) {
  saveFlow(config, tasks, phases);
}
```

## User-Facing Features

### Feature 1: Visual Flow Builder
- **Description**: Drag-and-drop interface to create data processing pipelines
- **Workflow**:
  1. Add phases (parallel/sequential processing groups)
  2. Add tasks to phases (component configurations)
  3. Set task ordering and delays
  4. Configure retry and failure handling
  5. Set conditions for branching/looping
- **Components**: BuilderCanvas, Phase node, TaskBox, ConditionDetailModal

### Feature 2: Advanced Conditions
- **Description**: Set up complex branching based on job status, duration, errors, table counts
- **Operators**: AND/OR, comparison operators (=, !=, <, >, contains)
- **Subjects**: Task status, job duration, output tables, error messages, phase status
- **Functions**: COUNT (task results), DATE (scheduling)
- **Workflow**:
  1. Click edge between phases to add condition
  2. Build condition tree (OR of AND groups)
  3. Specify goto phase when condition matches
- **Components**: ConditionDetailModal, ConditionForm, Condition

### Feature 3: Notifications
- **Description**: Send notifications on flow success/failure
- **Types**: Email, webhook
- **Workflow**:
  1. Add notification task to phase
  2. Configure recipients
  3. Set message template
  4. Use variables from previous tasks
- **Components**: NotificationDetailModal, PhaseNotificationTask

### Feature 4: Variables
- **Description**: Create and pass data between tasks
- **Types**: Literal values, JSON from previous task output
- **Workflow**:
  1. Add variable task
  2. Define value or source expression
  3. Reference in downstream task configurations
- **Components**: VariableDetailModal, PhaseVariableTask

### Feature 5: Task Retry Configuration
- **Description**: Automatically retry failed tasks
- **Options**: Max retries, delay strategy, error filters
- **Workflow**:
  1. Click task in builder
  2. Set retry strategy (linear backoff)
  3. Define retry conditions (error contains pattern)
  4. Enable/disable via toggle
- **Components**: TaskRetryContent, DetailModal

### Feature 6: Execution Monitoring
- **Description**: View flow execution history with detailed task breakdown
- **Features**:
  - Hierarchical view: Flow > Phase > Task > Retry
  - Expandable rows for details
  - Status indicators and durations
  - Links to detailed logs
- **Components**: JobsTable, various Cell components

### Feature 7: Schedule Management
- **Description**: Set up cron or event-based flow triggers
- **Types**: Cron schedule, event triggers (on table changes)
- **Features**:
  - Visual cron builder (coming)
  - Event trigger cooldown period
  - Data streams support
- **Components**: Schedules component (from scheduler module)

## Technical Debt & Observations

### Migration Notes
1. **Legacy Builder Still Exists**: `/flows/` module uses old architecture
   - Uses class components and render props
   - Custom drag-drop implementation
   - Mixed Flux and local state
   - Plan: Eventually sunset in favor of flows-v2

2. **Condition UI Complexity**:
   - Deeply nested condition tree UI is complex
   - Could benefit from simplified builder for common cases
   - Performance: may need optimization for large condition trees

3. **Local Storage Approach**:
   - Draft changes stored in local state, not persisted
   - Lost on refresh during editing
   - Could add localStorage persistence for better UX

4. **Canvas Layout**:
   - Auto-layout uses ELK which can be slow for large flows
   - Manual layout controls still needed for complex flows
   - Viewport state persisted in URL search params

5. **Type Safety**:
   - Good TypeScript coverage in new code
   - Some legacy components still use any types
   - Config structure typing could be stricter

6. **Performance Considerations**:
   - Zustand store includes devtools in all environments
   - Large job tables may need virtualization
   - React Flow re-renders on every node change

### Areas for Improvement
- Add keyboard shortcuts for common actions
- Implement undo/redo UI controls
- Add flow templates/examples
- Improve condition builder UX for complex scenarios
- Add bulk task configuration
- Performance: lazy load large job histories
- Better error messages and recovery flows

## Code Examples

### Getting Flow Data
```typescript
const store = useFlow();
const configId = store.configId;
const phases = store.phases;
const tasks = store.tasks;
const isChanged = store.isChanged;
```

### Adding a New Task
```typescript
const newTask = prepareNewJobTask(phaseId, componentId, configurationId);
const tasks = context.tasks.push(newTask);
updateLocalStateValue(configId, ['tasks'], tasks);
setSelectedTaskId(newTask.get('id'));
```

### Saving Flow Changes
```typescript
saveFlow(config, tasks, phases, 'Added new task')
  .then(() => {
    // Local state cleared automatically
    showNotification('Flow saved');
  })
  .catch((error) => {
    handleError(error);
  });
```

### Building Complex Conditions
```typescript
const condition = {
  type: 'operator',
  operator: 'OR',
  operands: [
    {
      type: 'operator',
      operator: 'AND',
      operands: [
        {
          type: 'operator',
          operator: 'EQUALS',
          operands: [
            { type: 'task', task: 'task-1', value: 'job.status' },
            { type: 'const', value: 'success' },
          ],
        },
      ],
    },
  ],
};
```

### Accessing Builder State
```typescript
const [nodes, edges, selectedTaskId, setSelectedTaskId] = useBuilderStore(
  (state) => [
    state.nodes,
    state.edges,
    state.selectedTaskId,
    state.setSelectedTaskId,
  ],
);
```

## Related Modules

- `flows` (legacy) - Original flow builder, being phased out
- `orchestrations-v2` - Legacy orchestration UI, shared helpers
- `scheduler` - Schedule and trigger management for flows
- `queue` - Job execution and monitoring
- `components` - Component catalog and configuration management
- `notifications` - Notification delivery system

## Testing

### Test Coverage
- Unit tests for helpers: `helpers.test.ts`, `helpers.test.tsx`
- Unit tests for Condition Builder: `Conditions/helpers.test.tsx`
- Integration tests for flow operations
- E2E tests in `packages/e2e-testing`

### Key Test Areas
- Condition normalization and validation
- Phase and task management
- Node/edge comparisons
- Layout calculations
- Autosave logic

### Testing Approach
- Jest for unit tests
- React Testing Library for component tests
- TanStack Query mock in tests
- Immutable.js test data builders

## File Statistics

- **Total TypeScript/TSX Files**: 100+
- **Main Components**: 40+
- **Builder Helpers**: 5 key utility files
- **Test Files**: 10+ test suites
- **Lines of Code**: ~15,000 (including components)

