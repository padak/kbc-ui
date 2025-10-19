# Module: Flows (Legacy Orchestration)

## Overview

The flows module is the original orchestration/flow builder UI, built on top of the legacy Keboola Flow Graph component. This module is being gradually replaced by the modern `flows-v2` module but remains the primary flow building interface for now.

**Key Characteristics**:
- Uses legacy React class components with createReactClass
- Custom drag-and-drop implementation
- Flux architecture with Immutable.js data structures
- Flow Graph library for canvas rendering
- Still maintains full feature parity with flows-v2 during migration
- Shared some utilities with orchestrations-v2

**Status**: Legacy - new development should use flows-v2

## File Structure

```
flows/
├── Index.tsx                       # Main list view with filtering
├── Detail.tsx                      # Detail view and tab coordinator
├── DetailHeader.tsx                # Header with actions
├── IndexHeader.tsx                 # Search and filter header
├── Versions.tsx                    # Version history view
├── actions.ts                      # Flow operations (save, delete)
├── constants.ts                    # Routes, tabs, constants
├── helpers.ts                      # Utilities and helpers
├── helpers.test.ts                 # Helper tests
├── hooks/
│   └── useFlow.ts                 # Data collection hook
├── components/
│   ├── Builder.jsx                # Main builder class component
│   ├── Box.tsx                    # Canvas container
│   ├── Phase.jsx                  # Phase row in UI
│   ├── Task.jsx                   # Task item in phase
│   ├── Row.jsx                    # Generic row component
│   ├── ConfigurationRow.jsx       # Configuration row
│   ├── TaskCount.tsx              # Task counter badge
│   ├── PhaseLabel.tsx             # Phase name header
│   ├── PhaseActions.tsx           # Phase toolbar
│   ├── TaskActions.tsx            # Task toolbar
│   ├── Status.jsx                 # Status indicator
│   ├── TaskIcon.tsx               # Component type icon
│   ├── TaskName.tsx               # Task name display
│   ├── TaskParamsModal.tsx        # Edit component params
│   ├── TaskDetailModal/           # Task configuration modal
│   │   ├── TaskDetailModal.tsx
│   │   ├── ComponentDetail.tsx
│   │   ├── ConfigurationDetail.tsx
│   │   ├── Folder.tsx
│   │   ├── SelectSpecificRows.tsx
│   │   ├── LastRun.tsx
│   │   └── BackendSize.tsx
│   ├── AddTaskModal/              # Add task dialog
│   │   ├── AddTaskModal.tsx
│   │   ├── AddTaskComponentRow.tsx
│   │   ├── SearchedList.tsx
│   │   └── helpers.ts
│   ├── JobsTable.tsx              # Execution history table
│   ├── RunResults.tsx             # Run results view
│   ├── RunSelectedModal.tsx       # Run specific config dialog
│   ├── FloatingTask.jsx           # Dragging task preview
│   ├── EmptyNode.jsx              # Empty flow placeholder
│   ├── RetryButton.jsx            # Quick retry button
│   ├── BackToFlowButton.tsx       # Navigation button
│   ├── ActivateFlowSwitch.tsx     # Enable/disable toggle
│   ├── FlowConfigs.tsx            # Shared flow cards component
│   ├── FlowActions.tsx            # Shared flow actions
│   ├── CreateFirstFlowButton.tsx  # Onboarding button
│   ├── CreateConfiguration.tsx    # Create config workflow
│   ├── NewConfigurationModal.tsx  # Create modal
│   ├── PhaseEditModal.tsx         # Edit phase name
│   ├── PhaseInput.jsx             # Phase name input
│   ├── Tabs.jsx                   # Tab navigation
│   ├── ComponentType.jsx          # Component type label
│   ├── PhaseOutput.jsx            # Phase execution output
│   ├── Spinner.jsx                # Loading spinner
│   └── ... (other UI components)
├── routes.tsx                     # Route definitions
└── index.tsx                      # Module entry point

```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/flows` | `Index` | List all flows with search and filters |
| `/flows/:config` | `Detail` | Flow detail view with builder and tabs |
| `/flows/:config/versions` | `Versions` | Version history of a flow |

## Key Components

### Index (List View)
- **Location**: `apps/kbc-ui/src/scripts/modules/flows/Index.tsx`
- **Purpose**: Display list of all orchestrations (using shared prepareOrchestrations helper)
- **Props**: None (uses stores)
- **State**: Search query, filter state (via route query params)
- **Features**:
  - Search by name, description, folder
  - Filter by schedule status and job status
  - Shows latest job status
  - New user onboarding card

### Detail (Detail View)
- **Location**: `apps/kbc-ui/src/scripts/modules/flows/Detail.tsx`
- **Purpose**: Coordinate flow detail view with tabs and builder
- **Props**: None (uses hooks)
- **State**: Active tab, template instance info
- **Child Components**:
  - `Builder` - Main canvas editor
  - `Tabs` - Tab navigation
  - `FlowActions` - Menu actions
  - `JobsTable` - Execution history
  - `Schedules` - Trigger and cron config
  - `Notifications` - Email/webhook config
  - `Versions` - Change history

### Builder (Canvas)
- **Location**: `apps/kbc-ui/src/scripts/modules/flows/components/Builder.jsx`
- **Purpose**: Main orchestration canvas using Flow Graph library
- **Class Component**: Maintains state for phases, tasks, dragging
- **State**:
  - `phases` - Phase definitions
  - `tasks` - Task configurations
  - `selected` - Currently selected phase/task
  - `dragging` - Dragging state and preview
  - `showAddTaskModal` - Modal visibility
  - `editParamsTask` - Task params being edited
- **Features**:
  - Drag-and-drop tasks onto canvas
  - Inline phase/task editing
  - Floating task preview while dragging
  - Auto-scroll during drag
  - Inline task deletion

### Phase
- **Location**: `apps/kbc-ui/src/scripts/modules/flows/components/Phase.jsx`
- **Purpose**: Render a phase row with its tasks
- **Props**: Phase data, tasks, handlers
- **Features**:
  - Collapse/expand phase
  - Show task count
  - Drag drop target for tasks
  - Edit phase name
  - Delete phase

### Task
- **Location**: `apps/kbc-ui/src/scripts/modules/flows/components/Task.jsx`
- **Purpose**: Render a single task item in a phase
- **Props**: Task data, phase, handlers
- **Features**:
  - Show component icon and name
  - Drag source for moving/reordering
  - Click to edit
  - Context menu with actions
  - Status indicator from last run

### JobsTable
- **Location**: `apps/kbc-ui/src/scripts/modules/flows/components/JobsTable.tsx`
- **Purpose**: Display execution history table
- **Props**: Jobs, config ID, admin info
- **Features**:
  - List recent jobs
  - Show phase and task execution details
  - Duration and timestamp display
  - Status badges
  - Admin info for manual runs

### AddTaskModal
- **Location**: `apps/kbc-ui/src/scripts/modules/flows/components/AddTaskModal/AddTaskModal.tsx`
- **Purpose**: Dialog to add or edit tasks
- **Props**: Components, configurations, handlers
- **Features**:
  - Search components
  - Filter by type
  - Select or create configuration
  - Component metadata display

### TaskDetailModal
- **Location**: `apps/kbc-ui/src/scripts/modules/flows/components/TaskDetailModal/TaskDetailModal.tsx`
- **Purpose**: Configure task (component selection, backend size, rows)
- **Props**: Task, components, configurations
- **Features**:
  - Component info display
  - Backend size selection
  - Specific rows filtering
  - Last run info
  - Configuration parameters

## API Endpoints

| Method | Endpoint | Purpose | Response Type |
|--------|----------|---------|---------------|
| GET | `/api/v3/storage/components/keboola.orchestrator/configs` | List orchestrations | ComponentConfigurations |
| GET | `/api/v3/storage/components/keboola.orchestrator/configs/:id` | Get orchestration | ComponentConfiguration |
| PUT | `/api/v3/storage/components/keboola.orchestrator/configs/:id` | Update config | Success |
| DELETE | `/api/v3/storage/components/keboola.orchestrator/configs/:id` | Delete config | Success |
| POST | `/api/v3/storage/components/keboola.orchestrator/configs/:id/versions` | Create version | Version |
| GET | `/api/v3/storage/components/keboola.scheduler/configs` | Get schedulers | ComponentConfigurations |
| GET | `/api/v3/queue/jobs?component=keboola.orchestrator&config=:id` | Get execution jobs | Jobs |

## State Management

### Pattern Used
- **Canvas State**: React class component local state
- **Data State**: Immutable.js in stores (Flux pattern)
- **Server State**: Flux stores with query results
- **Routing**: Route-based state (URL query params)

### Key Stores/Components

**Builder Class Component**
- Manages phases, tasks, dragging, selection
- Direct DOM manipulation with refs (bounds, autoscroll)
- Manual event handlers for drag-drop

**Flow Stores (Flux)**
- `InstalledComponentsStore` - Configuration data
- `ComponentsStore` - Component metadata
- `JobsStore` - Job execution data
- `ApplicationStore` - User and permissions
- `RoutesStore` - Route and query state

**useFlow Hook**
- Collects data from multiple stores
- Similar pattern to flows-v2 hook but less comprehensive
- Used in Detail view to access flow data

### Data Flow

```
Index Component
  └── prepareOrchestrations() helper
      ├── InstalledComponentsStore (flows)
      └── InstalledComponentsStore (schedulers)
            ↓
      Filter and display FlowConfigs

Detail Component
  └── useFlow Hook
      ├── RoutesStore (configId, route params)
      ├── InstalledComponentsStore (config)
      ├── JobsStore (jobs)
      ├── EventTriggersStore (triggers)
      └── ApplicationStore (permissions)
            ↓
      Builder (class component)
      ├── Phase (row)
      │   └── Task (item)
      └── Modals (edit, add, params)
```

## Dependencies

### Internal Modules
- `modules/components` - Component registry and configs
- `modules/queue` - Job execution and history
- `modules/scheduler` - Schedule management
- `modules/event-trigger` - Event triggers
- `modules/notifications` - Notification setup
- `modules/orchestrations-v2` - Shared helpers (prepareOrchestration, etc.)
- `modules/storage` - Storage metadata
- `modules/admin` - Permission checks

### External Packages
- `@keboola/flow-builder` - Canvas rendering library
- `react-bootstrap` - Modal, Bootstrap components
- `immutable` - Immutable data structures
- `react-beautiful-dnd` - Drag and drop system
- `underscore` - Utility functions
- `@keboola/design` - Design system

### Design System Components
- `Button`, `Modal`, `Tooltip`, `Icon`
- `Badge`, `Card`, `Spinner`
- Bootstrap components (Row, Col, Modal)

## Notable Patterns

### 1. Drag and Drop with Floating Preview
```typescript
// FloatingTask renders at cursor position while dragging
onDragStart() → updateBounds() → FloatingTask mounts
// Autoscroll during drag
this.autoscrollIntervalRef = setInterval(() => {
  if (shouldScroll) scroll();
})
```

### 2. Phase and Task Grouping
```typescript
// Tasks organized by phase ID
phases.map(phase => {
  const phaseTasks = tasks.filter(t => t.phase === phase.id);
  return renderPhase(phase, phaseTasks);
})
```

### 3. Shared FlowConfigs Component
```typescript
// Both flows and orchestrations-v2 use same card component
<FlowConfigs configurations={flows} ... />
// Displays flow info, latest job, actions
```

### 4. Component Selection with Folder Navigation
```typescript
// AddTaskModal shows folder tree
// Click folder to navigate
// Components listed at bottom
// Can create new configuration inline
```

### 5. Modal Stack Management
```typescript
// Multiple modals can be open
showAddTaskModal && <AddTaskModal />
showTaskDetailModal && <TaskDetailModal />
editParamsTask && <TaskParamsModal />
// State tracks which ones are visible
```

## User-Facing Features

### Feature 1: Drag-and-Drop Builder
- **Description**: Build orchestrations by dragging components onto phases
- **Workflow**:
  1. Click "Add Task" or drag from sidebar
  2. Search/select component
  3. Select configuration (or create)
  4. Drag to position in phase or create new phase
- **Components**: Builder, AddTaskModal, FloatingTask, Phase

### Feature 2: Phase Management
- **Description**: Organize tasks into parallel or sequential phases
- **Workflow**:
  1. Phases execute in sequence
  2. Tasks within phase can run in parallel
  3. Click phase to rename
  4. Drag phases to reorder
- **Components**: Phase, PhaseEditModal, PhaseLabel

### Feature 3: Task Configuration
- **Description**: Configure component behavior for task
- **Options**:
  - Backend size selection
  - Row filtering (run on specific rows)
  - Component parameters
  - Last run info
- **Workflow**:
  1. Click task to open detail modal
  2. Select configuration
  3. Set backend size if applicable
  4. Configure specific rows if needed
  5. View/configure component parameters
- **Components**: TaskDetailModal, ConfigurationDetail, SelectSpecificRows

### Feature 4: Execution Monitoring
- **Description**: View orchestration run history
- **Features**:
  - List recent executions
  - Show which phases/tasks ran
  - Display execution times
  - Mark manual vs scheduled runs
- **Components**: JobsTable

### Feature 5: Schedule Configuration
- **Description**: Schedule orchestration to run on cron or event trigger
- **Features**:
  - Cron expression builder
  - Event trigger setup
  - Manual run button
- **Components**: Schedules (from scheduler module)

### Feature 6: Run Selected
- **Description**: Run specific configuration without full orchestration
- **Workflow**:
  1. Select one or more tasks
  2. Click "Run Selected"
  3. Execute just those tasks
- **Components**: RunSelectedModal

## Technical Debt & Observations

### Legacy Architecture Issues

1. **Class Components**:
   - Builder uses `createReactClass` with mixins
   - Harder to maintain than modern hooks
   - PropTypes instead of TypeScript
   - Manual lifecycle management

2. **Flow Graph Library**:
   - Custom graph rendering component
   - Not widely maintained
   - Performance issues with large flows
   - Limited customization
   - Replaced by React Flow in flows-v2

3. **Manual Drag-Drop**:
   - Custom implementation instead of library
   - Complex bounds and autoscroll logic
   - Difficult to debug and extend
   - Replaced by react-beautiful-dnd and React Flow

4. **State Management**:
   - Mixed Flux stores and component state
   - No clear separation of concerns
   - Local state updates don't always sync
   - Immutable.js boilerplate

5. **Code Organization**:
   - Many component files in single directory
   - No clear separation between UI and logic
   - Monolithic Builder component (400+ lines)

### Migration Path to flows-v2

This module is gradually being phased out:
1. New features implemented in flows-v2 first
2. Feature parity maintained during transition
3. Eventually redirect /flows to /flows-v2
4. Archives kept for reference
5. Timeline: Targeting Q4 2024-Q1 2025

### Performance Issues
- Large flows can be slow to render
- Drag operations have throttled event handlers
- Jobs table not virtualized
- Graph library re-renders often

### Missing Features (vs flows-v2)
- Conditions (advanced branching)
- Notifications as tasks
- Variables as tasks
- Retry strategies
- Advanced undo/redo
- Better full-screen editing

## Code Examples

### Creating a New Task
```typescript
const newTask = createTask(component, configuration, phaseId, existingTaskIds);
// Returns: { id, name, phase, task: { componentId, configId, mode } }
tasks.push(newTask);
```

### Saving Flow Changes
```typescript
saveFlow(config, tasks, phases)
  .then(() => {
    updateLocalStateValue(configId, ['phases'], phases);
    updateLocalStateValue(configId, ['tasks'], tasks);
  })
  .catch(error => showError(error));
```

### Grouping Tasks by Phase
```typescript
const preparePhasesWithTasks = (phases, tasks) => {
  return phases.map(phase => {
    const phaseTasks = tasks.filter(t => t.get('phase') === phase.get('id'));
    return phase.set('tasks', phaseTasks);
  });
};
```

### Filtering Flows
```typescript
const flows = prepareOrchestrations(
  InstalledComponentsStore.getComponentConfigurations(KEBOOLA_ORCHESTRATOR),
  InstalledComponentsStore.getComponentConfigurations(KEBOOLA_SCHEDULER),
);
// Attaches associated schedulers to each flow
```

## Related Modules

- `flows-v2` (modern) - Next-generation flow builder (recommended for new work)
- `orchestrations-v2` - Legacy orchestration module with similar helpers
- `scheduler` - Schedule and trigger management
- `queue` - Job execution and monitoring
- `components` - Component catalog and configuration
- `notifications` - Notification delivery system
- `storage` - Storage metadata and management

## Testing

### Test Coverage
- Unit tests for helpers
- Limited component tests
- Legacy mixins make testing difficult
- Most testing done through E2E tests

### Key Test Areas
- prepareOrchestrations helper
- Task creation and grouping
- Phase management
- Configuration saving

### Testing Approach
- Jest for unit tests
- Limited React Testing Library usage
- Manual testing more prevalent
- E2E tests in packages/e2e-testing

### Test Files
- `flows/helpers.test.ts` - Helper function tests
- `flows/components/AddTaskModal/helpers.test.tsx` - Task modal tests
- Various E2E test scenarios

## Migration Guidelines for flows-v2

When working on flows features, prefer flows-v2:

1. **New features** → flows-v2 first
2. **Bug fixes** → Apply to both if critical
3. **Refactoring** → Focus on flows-v2
4. **Documentation** → Reference flows-v2 as source of truth
5. **Type safety** → Migrate to TypeScript types

Timeline for full migration:
- Phase 1 (Current): Feature parity
- Phase 2 (Q4 2024): Redirect /flows → /flows-v2
- Phase 3 (Q1 2025): Archive legacy code

