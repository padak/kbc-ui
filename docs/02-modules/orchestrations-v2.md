# Module: Orchestrations v2

## Overview

The orchestrations-v2 module provides the core orchestration UI and shared helper functions for building orchestrations (data pipeline workflows). This module primarily contains:

1. **Shared UI Components** - Reusable flow configuration cards used by both `flows` and `flows-v2`
2. **Helper Functions** - Utilities for orchestration data transformation (prepare, normalize, save)
3. **Legacy Orchestration Detail View** - Original implementation using React createClass
4. **Local State Management** - Draft storage for in-progress edits

**Note**: This is a shared utilities module, not a primary user-facing feature. The actual orchestration editing happens in `flows` (legacy) or `flows-v2` (modern).

## File Structure

```
orchestrations-v2/
├── Index.jsx                     # Legacy orchestration list view
├── IndexHeader.jsx               # Header for list view
├── Orchestration.jsx             # Legacy orchestration detail view
├── Tasks.jsx                     # Task management view
├── TasksHeader.jsx               # Tasks header
├── actions.js                    # Orchestration operations (save, delete)
├── constants.js                  # Routes and constants
├── helpers.js                    # Core transformation functions
├── helpers.test.js               # Helper tests
├── localState.js                 # Local state management
├── routes.jsx                    # Route definitions
└── components/
    ├── BlankOrchestrationPage.jsx # Empty state
    ├── JobsTable.jsx             # Execution history
    ├── Schedule.jsx              # Schedule configuration
    ├── TasksSummary.jsx          # Task count display
    ├── CreateOrchestration.jsx   # Create dialog
    └── ... (other UI components)
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/orchestrations` | `Index` | List all orchestrations (legacy) |
| `/orchestrations/:config` | `Orchestration` | Orchestration detail view (legacy) |
| `/orchestrations/:config/tasks` | `Tasks` | Task management (legacy) |

## Key Components

### Index (Legacy List View)
- **Location**: `apps/kbc-ui/src/scripts/modules/orchestrations-v2/Index.jsx`
- **Purpose**: Display list of orchestrations (using shared helpers)
- **Status**: Legacy - redirects to flows module for actual flows
- **Features**:
  - Search by name/description
  - List orchestrations
  - Quick stats and links

### Orchestration (Legacy Detail View)
- **Location**: `apps/kbc-ui/src/scripts/modules/orchestrations-v2/Orchestration.jsx`
- **Purpose**: Orchestration detail view with tabs
- **Status**: Legacy - original implementation
- **Features**:
  - Tasks summary
  - Schedule/trigger display
  - Notifications
  - Execution history
  - Enable/disable toggle

### Shared Helper Functions

**prepareOrchestration(orchestration, schedulers)**
- Attach schedulers to orchestration
- Used by both flows and orchestrations-v2
- Returns orchestration with schedulers array

**prepareOrchestrations(orchestrations, schedulers)**
- Map prepareOrchestration over all
- Returns collection with schedulers attached

**createTask(component, configuration, phaseId, taskIds)**
- Generate new task from component/config
- Auto-generate task ID
- Set name, componentId, configId
- Return Immutable Map

**preparePhasesWithTasks(phases, tasks)**
- Attach tasks to phases
- Used for hierarchical display
- Returns phases with task arrays

**addEmptyPhase(phases)**
- Create new phase with auto ID
- Add to phase list
- Default name "New Phase"

**prepareConfigurationForSave(configuration, phases, tasks, isNewUser)**
- Clean up config for save
- Handle fake component IDs
- Set phase dependencies (linear chain)
- Remove empty/unused tasks

## API Endpoints

| Method | Endpoint | Purpose | Response Type |
|--------|----------|---------|---------------|
| GET | `/api/v3/storage/components/keboola.orchestrator/configs` | List orchestrations | ComponentConfigurations |
| GET | `/api/v3/storage/components/keboola.orchestrator/configs/:id` | Get orchestration | ComponentConfiguration |
| PUT | `/api/v3/storage/components/keboola.orchestrator/configs/:id` | Update orchestration | Success |
| DELETE | `/api/v3/storage/components/keboola.orchestrator/configs/:id` | Delete orchestration | Success |
| GET | `/api/v3/storage/components/keboola.scheduler/configs` | Get schedulers | ComponentConfigurations |
| GET | `/api/v3/queue/jobs?component=keboola.orchestrator&config=:id` | Get jobs | Jobs |

## State Management

### Pattern Used
- **Component State**: React createClass with mixins (legacy)
- **Data State**: Immutable.js structures (Flux)
- **Local State**: In-memory drafts via localStorage
- **Routing**: Route-based state (URL params)

### Local State Management

The `localState.js` provides functions to manage draft edits:

```typescript
// Store draft changes
updateLocalStateValue(configId, path, value);

// Retrieve draft changes
getLocalStateValue(configId, path, defaultValue);

// Clear local state after save
clearLocalState(configId);
```

Used to store:
- Draft phases before save
- Draft tasks before save
- Running job reference
- Edit state

### Data Flow

```
List View (Index)
  ├── prepareOrchestrations()
  │   ├── InstalledComponentsStore.getComponentConfigurations()
  │   └── scheduler configurations
  └── Filter and display

Detail View (Orchestration)
  ├── InstalledComponentsStore (config)
  ├── JobsStore (execution history)
  ├── EventTriggersStore (event triggers)
  ├── ApplicationStore (permissions)
  └── Render details
      ├── Tasks summary
      ├── Schedule
      ├── Notifications
      └── Jobs table
```

## Dependencies

### Internal Modules
- `modules/components` - Component registry and configs
- `modules/queue` - Job execution data
- `modules/scheduler` - Schedule management
- `modules/event-trigger` - Event triggers
- `modules/notifications` - Notification setup
- `modules/flows` - Shared FlowConfigs component
- `modules/admin` - Permission utilities

### External Packages
- `immutable` - Immutable data structures
- `react` - React framework
- `@keboola/design` - Design system
- `@keboola/utils` - Utility functions

### Design System Components
- `Button`, `Modal`, `Icon`, `Badge`, `Tooltip`

## Notable Patterns

### 1. Helper Function Exports
```typescript
export {
  prepareOrchestration,
  prepareOrchestrations,
  preparePhasesWithTasks,
  createTask,
  addEmptyPhase,
  shouldAddEmptyPhase,
  prepareConfigurationForSave,
  groupTasksToPhasesByComponentType,
};
```

All helpers are pure functions taking/returning Immutable structures.

### 2. Orchestration Preparation
```typescript
// Every orchestration gets associated schedulers
const orchestration = prepareOrchestration(config, schedulers);
// orchestration.schedulers contains related schedulers
```

### 3. Task Creation with Auto-ID
```typescript
const task = createTask(
  component,          // Component object
  configuration,      // Configuration object or null
  phaseId,           // Parent phase ID
  existingTaskIds    // Array of IDs to avoid duplicates
);
// Returns: { id: 'auto-generated', name: '...', task: {...} }
```

### 4. Phase Dependency Chaining
```typescript
// During save, create linear dependency chain
let dependsOnForNext = List();
phases = phases.map(phase => {
  const phaseWithDep = phase.set('dependsOn', dependsOnForNext);
  dependsOnForNext = fromJS([phase.get('id')]);
  return phaseWithDep;
});
// Each phase depends only on previous
```

### 5. Component Type Grouping
```typescript
// Group tasks by component type into phases
const result = groupTasksToPhasesByComponentType(allComponents, tasks);
// Returns: { phases: [...], tasks: [...] }
// Extractors → Extractors phase, Writers → Writers phase, etc.
```

## User-Facing Features

### Feature 1: Orchestration Management
- **Description**: Create, edit, and manage orchestrations
- **Workflow**:
  1. Create new orchestration
  2. Add tasks (component configurations)
  3. Set execution order/phases
  4. Configure schedule
  5. Run and monitor
- **Components**: Orchestration detail view, task management

### Feature 2: Task Management
- **Description**: Add, order, and configure tasks
- **Workflow**:
  1. Navigate to Tasks tab
  2. Search components
  3. Add configurations
  4. Organize into phases
  5. Save
- **Components**: Tasks view, task modal

### Feature 3: Schedule Management
- **Description**: Set cron schedule or event trigger
- **Features**:
  - Cron expression input
  - Event trigger setup
  - Manual run option
- **Components**: Schedule component

### Feature 4: Execution Monitoring
- **Description**: View orchestration execution history
- **Features**:
  - List recent executions
  - Show task execution status
  - Display execution time
  - Admin info for manual runs
- **Components**: JobsTable component

## Technical Debt & Observations

### Legacy Code Issues

1. **createReactClass with Mixins**
   - Old React pattern, hard to maintain
   - PropTypes instead of TypeScript
   - Complex lifecycle management
   - No hooks support

2. **Shared Responsibility**
   - Module serves both as UI and utilities
   - Makes separation of concerns difficult
   - Hard to test UI and logic independently

3. **Local State Approach**
   - Draft changes stored in memory
   - Lost on refresh
   - No localStorage persistence
   - Multiple components manage state separately

4. **Immutable.js Overuse**
   - Verbose syntax for simple operations
   - Performance overhead
   - Learning curve for new developers

5. **Helper Functions**
   - While good (pure functions), they're scattered
   - Could be in a shared utils module
   - Used by both flows and flows-v2

### Where Code is Used

**Shared Helpers** (used by multiple modules):
- `helpers.js` - Imported by flows, flows-v2
- `localState.js` - Used by flow modules for draft management
- Task creation and grouping functions

**Legacy UI** (being phased out):
- `Index.jsx` - Old orchestration list
- `Orchestration.jsx` - Old detail view
- Replaced by flows module

**Never Used**:
- Some old components if flows module fully replaces

### Migration Plan

1. **Move Helpers**:
   - Extract pure functions to utilities module
   - No UI dependencies needed
   - Share between flows and flows-v2

2. **Deprecate Legacy UI**:
   - Redirect /orchestrations to /flows
   - Keep helpers accessible
   - Archive legacy components

3. **Consolidate Local State**:
   - Move to flows/flows-v2 modules
   - Use localStorage for persistence
   - Better state management

## Code Examples

### Preparing Orchestrations
```typescript
const orchestrations = prepareOrchestrations(
  InstalledComponentsStore.getComponentConfigurations(KEBOOLA_ORCHESTRATOR),
  InstalledComponentsStore.getComponentConfigurations(KEBOOLA_SCHEDULER),
);
// Each orchestration now has .schedulers array
```

### Creating a Task
```typescript
const newTask = createTask(
  component,
  configuration,
  'phase-1',
  existingTaskIds
);
// Returns Immutable task structure ready to add to config
```

### Saving Configuration
```typescript
const cleanConfig = prepareConfigurationForSave(
  config,
  phases,
  tasks,
  isNewUser
);
// Remove temp fields, set dependencies, clean up
```

### Managing Local State
```typescript
// Store draft phases
updateLocalStateValue(configId, ['phases'], newPhases);

// Retrieve draft phases
const phases = getLocalStateValue(
  configId,
  ['phases'],
  config.getIn(['configuration', 'phases'])
);

// Clear after save
clearLocalState(configId);
```

### Grouping Tasks by Type
```typescript
const { phases, tasks } = groupTasksToPhasesByComponentType(
  allComponents,
  tasksList
);
// Auto-organize tasks into phases by component type
```

## Related Modules

- `flows` (legacy) - Primary flow builder, uses orchestrations-v2 helpers
- `flows-v2` (modern) - Modern flow builder, also uses shared helpers
- `scheduler` - Schedule and trigger management
- `queue` - Job execution and monitoring
- `components` - Component registry and management
- `notifications` - Notification system

## Testing

### Test Coverage
- Unit tests for helpers
- Tests for orchestration preparation
- Tests for task creation and grouping

### Key Test Areas
- prepareOrchestration/prepareOrchestrations
- Task creation with ID generation
- Phase preparation with tasks
- Configuration save preparation
- Component type grouping

### Test Files
- `orchestrations-v2/helpers.test.js` - Main test suite
- Tests verify data transformations

### Testing Approach
- Jest for unit tests
- Immutable test data
- Pure function testing
- Mock component data

## Usage from Other Modules

### From flows module
```typescript
import { prepareOrchestrations } from '@/modules/orchestrations-v2/helpers';
import { updateLocalStateValue } from '@/modules/orchestrations-v2/localState';

const flows = prepareOrchestrations(orchestrations, schedulers);
updateLocalStateValue(configId, ['phases'], newPhases);
```

### From flows-v2 module
```typescript
import {
  getLocalStateValue,
  updateLocalStateValue,
  clearLocalState,
} from '@/modules/flows-v2/helpers';

const phases = getLocalStateValue(configId, ['phases'], defaultPhases);
updateLocalStateValue(configId, ['tasks'], newTasks);
```

## Future Direction

### Recommended Actions

1. **Extract Helpers to Shared Utils**
   ```
   packages/utils/flow-helpers/
   ├── prepare.ts
   ├── create.ts
   ├── group.ts
   └── save.ts
   ```

2. **Deprecate Legacy UI**
   - Keep helpers and local state
   - Remove legacy components
   - Redirect routes to flows module

3. **Consolidate Local State**
   - Provide abstraction in flows modules
   - Use localStorage for persistence
   - Better state lifecycle management

4. **Update Tests**
   - Migrate to TypeScript tests
   - Improve test coverage
   - Add integration tests with flows-v2

## Module Statistics

- **Pure Helper Files**: 2 (helpers.js, localState.js)
- **Legacy UI Components**: 5+ (Index, Orchestration, Tasks, etc.)
- **Test Files**: 1 main test suite
- **Lines of Code**: ~800 (helpers + local state)
- **Usage**: Heavily used by flows and flows-v2

