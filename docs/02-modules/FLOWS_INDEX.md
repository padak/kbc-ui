# Flow Builder Modules - Complete Documentation Index

This index provides quick navigation to the comprehensive documentation for the three flow builder modules: flows-v2 (modern), flows (legacy), and orchestrations-v2 (shared utilities).

## Quick Navigation

### Modern Implementation (Recommended for New Work)
- **[flows-v2.md](flows-v2.md)** - Next-generation flow builder using React Flow and Zustand
  - 507 lines of comprehensive documentation
  - Modern architecture with TypeScript
  - Advanced condition builder
  - Best practices for new development

### Legacy Implementation (Being Phased Out)
- **[flows.md](flows.md)** - Original orchestration builder using Flow Graph library
  - 529 lines of legacy architecture analysis
  - Class components and custom patterns
  - Migration path to flows-v2 documented
  - Reference for understanding legacy code

### Shared Utilities
- **[orchestrations-v2.md](orchestrations-v2.md)** - Helper functions and utilities
  - 489 lines of utility function documentation
  - Local state management patterns
  - Used by both flows and flows-v2
  - Future refactoring recommendations

## Module Comparison at a Glance

| Feature | flows-v2 | flows | orchestrations-v2 |
|---------|----------|-------|-------------------|
| **Status** | Modern (Recommended) | Legacy (Deprecated) | Shared Utilities |
| **Architecture** | Hooks + Zustand | Class Components | Pure Functions |
| **Canvas Library** | React Flow | Flow Graph | N/A (Helpers only) |
| **Drag-Drop** | Built-in | Custom | N/A |
| **State Management** | Zustand store | React class state | N/A |
| **TypeScript** | Yes (Strict) | Partial | Partial |
| **Components** | 100+ | 50+ | 20+ |
| **Lines of Code** | 15,000+ | 8,000+ | 800+ |
| **Advanced Conditions** | Yes | No | N/A |
| **Notifications Tasks** | Yes | No | N/A |
| **Variables** | Yes | No | N/A |
| **Retry Strategies** | Yes | No | N/A |
| **Hierarchical Jobs** | Yes | No | N/A |

## Key Differences

### Canvas Implementation
- **flows-v2**: React Flow (standard library, well-maintained, large community)
- **flows**: Custom Keboola Flow Graph (legacy, slower, limited customization)

### State Management
- **flows-v2**: Zustand for UI state + Immutable.js for data + TanStack Query for server
- **flows**: React class state for UI + Immutable.js (Flux) for data

### Component Architecture
- **flows-v2**: Modular, organized by feature, clear separation of concerns
- **flows**: Monolithic Builder component, mixed concerns

### User Experience
- **flows-v2**: Modern modal sidebar, advanced condition builder, better workflows
- **flows**: Inline modals, simpler condition system, basic workflows

## Feature Availability

### Common Features (Both Modules)
- Create and manage flows
- Organize tasks into phases
- Configure component parameters
- Set execution schedule (cron or event trigger)
- Setup notifications (email, webhook)
- Monitor execution history
- Enable/disable flows
- Manual flow runs

### flows-v2 Only Features
- Complex nested conditions (AND/OR combinations)
- Function operands in conditions (COUNT, DATE)
- Phase-level operators (ALL_TASKS_IN_PHASE, ANY_TASKS_IN_PHASE)
- Notifications as first-class tasks
- Variables system with JSON expressions
- Retry strategies with linear backoff
- Error message filtering
- Hierarchical execution monitoring
- Expandable job details
- Full-screen editor mode
- Undo/redo functionality

## Architecture Overview

### flows-v2 (Modern)
```
User Interface
  ├─ Detail View (React hooks)
  │   ├─ Builder Canvas (React Flow)
  │   ├─ Jobs Table (TanStack Table)
  │   ├─ Schedules (Scheduler module)
  │   └─ Notifications (Notifications module)
  ├─ useFlow Hook (Data collection)
  └─ BuilderProvider (Zustand Context)
      └─ BuilderStore (Canvas state)

Data Sources
  ├─ InstalledComponentsStore (Config, local state)
  ├─ JobsStore (Execution history)
  ├─ ComponentsStore (Component metadata)
  └─ ApplicationStore (Permissions, features)
```

### flows (Legacy)
```
User Interface
  ├─ Detail View (React class)
  │   ├─ Builder Canvas (Flow Graph)
  │   ├─ Jobs Table (Class component)
  │   ├─ Schedules (Scheduler module)
  │   └─ Notifications (Notifications module)
  └─ Builder Component (Main state)

Data Sources
  ├─ InstalledComponentsStore (Config)
  ├─ JobsStore (Execution history)
  ├─ ComponentsStore (Component metadata)
  └─ ApplicationStore (Permissions)
```

### orchestrations-v2 (Utilities)
```
Pure Helper Functions
  ├─ prepareOrchestrations()
  ├─ createTask()
  ├─ preparePhasesWithTasks()
  ├─ groupTasksToPhasesByComponentType()
  ├─ prepareConfigurationForSave()
  └─ prepareNextForSave()

Local State Management
  ├─ getLocalStateValue()
  ├─ updateLocalStateValue()
  └─ clearLocalState()
```

## When to Use Each Module

### Use flows-v2 if you:
- Are building new features
- Want modern React patterns
- Need TypeScript support
- Require advanced conditions
- Want better performance
- Need undo/redo functionality

### Use flows (legacy) if you:
- Are maintaining existing code
- Need to understand legacy patterns
- Are troubleshooting old flows
- Need specific legacy behavior

### Use orchestrations-v2 if you:
- Are creating helper functions
- Need to transform flow data
- Are managing local state
- Are integrating with both flows and flows-v2

## Migration Timeline

**Current**: Feature parity development
**Q4 2024**: Complete feature parity, begin redirect
**Q1 2025**: Full migration to flows-v2
**Post-Q1**: Archive legacy flows module

## Code Examples by Module

### flows-v2: Using Builder Store
```typescript
import { useBuilderStore } from '@/modules/flows-v2/builder/store/store';

const [nodes, edges, selectedTaskId, setSelectedTaskId] = useBuilderStore((state) => [
  state.nodes,
  state.edges,
  state.selectedTaskId,
  state.setSelectedTaskId,
]);
```

### flows-v2: Managing Local State
```typescript
import { updateLocalStateValue, getLocalStateValue } from '@/modules/flows-v2/helpers';

const phases = getLocalStateValue(configId, ['phases'], defaultPhases);
updateLocalStateValue(configId, ['phases'], newPhases);
```

### flows: Class Component State
```typescript
class Builder extends Component {
  state = {
    phases: [],
    tasks: [],
    selected: null,
  };
  
  handleAddTask = () => {
    this.setState({ showAddTaskModal: true });
  };
}
```

### orchestrations-v2: Helper Functions
```typescript
import { prepareOrchestrations, createTask } from '@/modules/orchestrations-v2/helpers';

const orchestrations = prepareOrchestrations(configs, schedulers);
const newTask = createTask(component, configuration, phaseId, existingIds);
```

## Documentation Features

All three documentation files include:

1. **Overview** - Purpose, status, key characteristics
2. **File Structure** - Complete directory organization with descriptions
3. **Routes** - URL routing tables with component mapping
4. **Key Components** - Detailed analysis of main components
5. **API Endpoints** - REST API endpoints used by module
6. **State Management** - Patterns, stores, and data flow
7. **Dependencies** - Internal, external, and design system
8. **Notable Patterns** - Code examples showing key patterns
9. **User-Facing Features** - Feature descriptions with user workflows
10. **Technical Debt** - Known issues and improvement areas
11. **Code Examples** - Practical implementation patterns
12. **Related Modules** - Dependencies and relationships
13. **Testing** - Test coverage and testing approach

## Performance Considerations

### flows-v2 Advantages
- React Flow optimized for large graphs
- Zustand prevents unnecessary re-renders
- Better component memoization
- Efficient change detection
- Canvas virtualization ready

### flows Issues
- Custom Graph library slower
- No virtualization
- More re-renders on state changes
- Performance degrades with 50+ phases

## Recommendation for New Development

**Use flows-v2 for all new work.**

The flows module is legacy and being phased out. New features should only be added to flows-v2. Bug fixes to flows should only be applied to critical issues to avoid duplicating effort.

## Getting Help

### For flows-v2 Questions:
- See [flows-v2.md](flows-v2.md) for complete documentation
- Look at Zustand store documentation
- Check React Flow examples
- Review type definitions in builder/types.ts

### For flows (Legacy) Questions:
- See [flows.md](flows.md) for legacy patterns
- Understand class component pattern
- Review Flow Graph library docs (if needed)
- Check propTypes definitions

### For Helper/Utility Questions:
- See [orchestrations-v2.md](orchestrations-v2.md)
- Review pure function implementations
- Check test files for usage examples
- Look at how flows and flows-v2 use these helpers

## Related Documentation

- [Scheduler Module](scheduler.md) - Schedule and trigger management
- [Queue Module](queue.md) - Job execution and monitoring
- [Components Module](components.md) - Component registry
- [Notifications Module](notifications.md) - Notification system
- [Storage Module](storage.md) - Storage integration

## File Statistics

| Module | Lines | Size | Components | Status |
|--------|-------|------|------------|--------|
| flows-v2.md | 507 | 18.9 KB | 100+ | Modern |
| flows.md | 529 | 18.4 KB | 50+ | Legacy |
| orchestrations-v2.md | 489 | 14.4 KB | Utilities | Shared |
| **Total** | **1,525** | **51.7 KB** | - | - |

---

**Last Updated**: October 18, 2025
**Status**: Complete and Ready for Use
