# State Management Architecture

## Overview

The Keboola UI uses a hybrid state management architecture that combines three distinct patterns, each optimized for its specific use case. This document describes the overall architecture, data flow, and best practices for managing state across the application.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Keboola UI State                             │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                ┌─────────────────┼─────────────────┐
                │                 │                 │
                ▼                 ▼                 ▼
┌───────────────────────┐ ┌──────────────┐ ┌─────────────────┐
│   Server State        │ │ Client State │ │  Local State    │
│  (TanStack Query)     │ │  (Zustand)   │ │ (React State)   │
└───────────────────────┘ └──────────────┘ └─────────────────┘
│                         │                │                  │
│ • API responses         │ • UI positions │ • Form inputs    │
│ • Database data         │ • Selections   │ • Toggles        │
│ • Remote resources      │ • Modal state  │ • Temp values    │
│ • Cached queries        │ • Canvas state │ • Local flags    │
│                         │ • Undo/redo    │                  │
└───────────────────────┘ └──────────────┘ └─────────────────┘
```

## State Categories

### 1. Server State (TanStack Query)

**Definition:** Data that lives on the server and is synchronized to the client.

**Characteristics:**
- Asynchronous
- Potentially stale
- Shared across users
- Requires background updates
- Needs cache management

**Examples:**
- Component configurations
- Storage buckets and tables
- Flow definitions
- Job execution history
- User permissions
- Project settings

**Implementation:**
```typescript
// Fetch server state
const { data, isLoading, error } = useQuery({
  queryKey: ['tables', tableId],
  queryFn: () => fetchTable(tableId),
  staleTime: 5 * 60 * 1000,
});

// Mutate server state
const mutation = useMutation({
  mutationFn: (updates) => updateTable(tableId, updates),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tables'] });
  },
});
```

### 2. Client State (Zustand)

**Definition:** UI state that exists only on the client and doesn't need server synchronization.

**Characteristics:**
- Synchronous
- Client-only
- Shared across components
- Frequently updated
- Transient

**Examples:**
- Canvas node positions
- Selected items
- Modal visibility
- Sidebar state
- Search filters
- Undo/redo stacks

**Implementation:**
```typescript
const useUIStore = create((set) => ({
  selectedItems: [],
  isModalOpen: false,
  toggleModal: () => set((state) => ({ isModalOpen: !state.isModalOpen })),
  selectItem: (id) => set((state) => ({
    selectedItems: [...state.selectedItems, id]
  })),
}));
```

### 3. Local State (React State)

**Definition:** Component-specific state that doesn't need to be shared.

**Characteristics:**
- Synchronous
- Component-scoped
- Simple
- Ephemeral
- No persistence needed

**Examples:**
- Form field values
- Toggle states
- Hover states
- Input focus
- Local validation

**Implementation:**
```typescript
const [isOpen, setIsOpen] = useState(false);
const [inputValue, setInputValue] = useState('');
```

### 4. Legacy State (Flux + Immutable.js)

**Status:** Being phased out

**Characteristics:**
- Global stores
- Immutable data structures
- Manual invalidation
- Event-based updates
- High overhead

**Migration Path:** See [Flux to TanStack Migration Guide](./flux-to-tanstack-migration.md)

## Current State Distribution

Based on codebase analysis:

```
┌────────────────────────────────────────────────┐
│ State Management Distribution                  │
├────────────────────────────────────────────────┤
│ Flux + Immutable.js:     40% (legacy)          │
│ TanStack Query:          30% (modern)          │
│ Zustand:                 30% (modern)          │
└────────────────────────────────────────────────┘
```

**Modules by Pattern:**

**Flux (Legacy - 40%):**
- storage (tables, buckets)
- flows (legacy builder)
- transformations
- components (core stores)
- most extractors/writers

**TanStack Query (Modern - 30%):**
- trash (reference implementation)
- notifications
- Some new features in flows-v2
- Data apps (partial)

**Zustand (Modern - 30%):**
- flows-v2 (builder canvas)
- Complex UI components
- Modal management

## Data Flow Patterns

### Pattern 1: Server State with Optimistic Updates

```typescript
┌─────────────────────────────────────────────────────────────┐
│                    Optimistic Update Flow                    │
└─────────────────────────────────────────────────────────────┘

1. User clicks "Delete Table"
   │
   ▼
2. onMutate: Update cache optimistically
   │  - Cancel ongoing queries
   │  - Snapshot current state
   │  - Update cache with expected result
   │
   ▼
3. UI updates immediately (optimistic)
   │
   ▼
4. mutationFn: Send API request
   │
   ├──▶ Success
   │    │
   │    ▼
   │    5. onSuccess: Invalidate related queries
   │    │
   │    ▼
   │    6. Background refetch
   │    │
   │    ▼
   │    7. UI updates with server data
   │
   └──▶ Error
        │
        ▼
        5. onError: Rollback to snapshot
        │
        ▼
        6. Show error message
        │
        ▼
        7. UI reverts to previous state
```

**Example:**
```typescript
const useDeleteTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tableId) => api.deleteTable(tableId),

    onMutate: async (tableId) => {
      // Cancel queries
      await queryClient.cancelQueries({ queryKey: ['tables'] });

      // Snapshot
      const previous = queryClient.getQueryData(['tables']);

      // Optimistic update
      queryClient.setQueryData(['tables'], (old) =>
        old.filter((t) => t.id !== tableId)
      );

      return { previous };
    },

    onError: (err, tableId, context) => {
      // Rollback
      queryClient.setQueryData(['tables'], context.previous);
    },

    onSettled: () => {
      // Refetch
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
};
```

### Pattern 2: Derived State Composition

```typescript
┌─────────────────────────────────────────────────────────────┐
│                  Derived State Pattern                       │
└─────────────────────────────────────────────────────────────┘

Server State (TanStack Query)
│  - Tables data
│  - Buckets data
│  - Configurations
│
├──▶ Combine with Client State (Zustand)
│    │  - Selected items
│    │  - Search query
│    │  - Filters
│    │
│    ▼
│    Derived Computed State
│    │  - Filtered tables
│    │  - Sorted results
│    │  - Selected table details
│    │
│    ▼
│    Component Renders
```

**Example:**
```typescript
const TableList = () => {
  // Server state
  const { data: tables } = useTables();

  // Client state
  const { selectedIds, searchQuery } = useUIStore((state) => ({
    selectedIds: state.selectedIds,
    searchQuery: state.searchQuery,
  }));

  // Derived state (computed on render)
  const filteredTables = useMemo(() => {
    return tables
      .filter((t) => t.name.includes(searchQuery))
      .filter((t) => selectedIds.includes(t.id));
  }, [tables, searchQuery, selectedIds]);

  return <div>{filteredTables.map(renderTable)}</div>;
};
```

### Pattern 3: Canvas State Management (React Flow + Zustand)

```typescript
┌─────────────────────────────────────────────────────────────┐
│              Canvas State Flow (flows-v2)                    │
└─────────────────────────────────────────────────────────────┘

Server State (TanStack Query)
│  - Flow configuration
│  - Phases definition
│  - Tasks definition
│
▼
Zustand Store (Builder)
│  - Nodes (derived from phases/tasks)
│  - Edges (derived from conditions)
│  - Selected nodes
│  - Canvas viewport
│
▼
React Flow Canvas
│  - Visual rendering
│  - Drag and drop
│  - User interactions
│
▼
User Interaction (drag, click, etc.)
│
▼
Zustand Actions
│  - Update nodes
│  - Update selection
│  - Update viewport
│
▼
Local State Changes (optimistic)
│
▼
Save Action
│
▼
Server Mutation (TanStack Query)
│
▼
Cache Invalidation
│
▼
Background Refetch
│
▼
Zustand Store Update (from server)
```

**Example:**
```typescript
// Server state
const { data: flow } = useFlow(flowId);

// Transform to canvas state
const { nodes, edges } = useMemo(
  () => prepareFlowData(flow.phases, flow.tasks),
  [flow]
);

// Zustand store
const useBuilderStore = create((set) => ({
  nodes,
  edges,
  selectedNodeId: null,

  onNodesChange: (changes) =>
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    })),

  setSelectedNode: (id) => set({ selectedNodeId: id }),
}));

// React Flow integration
<ReactFlow
  nodes={nodes}
  edges={edges}
  onNodesChange={onNodesChange}
/>
```

## Caching Strategies

### 1. Cache Configuration

**Default Settings:**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      gcTime: 10 * 60 * 1000,        // 10 minutes (garbage collection)
      refetchOnWindowFocus: true,     // Refetch when window focused
      refetchOnReconnect: true,       // Refetch on reconnect
      retry: 3,                       // Retry failed requests 3 times
    },
  },
});
```

**Per-Query Overrides:**
```typescript
// Frequently changing data
const { data } = useQuery({
  queryKey: ['jobs'],
  queryFn: fetchJobs,
  staleTime: 30 * 1000,     // 30 seconds
  refetchInterval: 5000,    // Poll every 5 seconds
});

// Rarely changing data
const { data } = useQuery({
  queryKey: ['config'],
  queryFn: fetchConfig,
  staleTime: 30 * 60 * 1000,  // 30 minutes
  gcTime: 60 * 60 * 1000,     // 1 hour
});
```

### 2. Cache Invalidation Strategies

**Granular Invalidation:**
```typescript
// Invalidate specific query
queryClient.invalidateQueries({
  queryKey: ['table', tableId]
});

// Invalidate query family
queryClient.invalidateQueries({
  queryKey: ['tables']
});

// Invalidate with predicate
queryClient.invalidateQueries({
  predicate: (query) =>
    query.queryKey[0] === 'tables' &&
    query.state.data?.bucketId === bucketId,
});
```

**Mutation-Based Invalidation:**
```typescript
const useUpdateTable = (tableId) => {
  return useMutation({
    mutationFn: (updates) => api.updateTable(tableId, updates),
    onSuccess: () => {
      // Invalidate specific table
      queryClient.invalidateQueries({
        queryKey: ['table', tableId]
      });

      // Invalidate table list
      queryClient.invalidateQueries({
        queryKey: ['tables']
      });

      // Invalidate related bucket
      queryClient.invalidateQueries({
        queryKey: ['bucket', bucketId]
      });
    },
  });
};
```

### 3. Prefetching Strategy

**On Route Change:**
```typescript
const navigate = useNavigate();
const queryClient = useQueryClient();

const handleNavigate = (tableId) => {
  // Prefetch before navigation
  queryClient.prefetchQuery({
    queryKey: ['table', tableId],
    queryFn: () => fetchTable(tableId),
  });

  navigate(`/tables/${tableId}`);
};
```

**On Hover:**
```typescript
<Link
  to={`/table/${tableId}`}
  onMouseEnter={() => {
    queryClient.prefetchQuery({
      queryKey: ['table', tableId],
      queryFn: () => fetchTable(tableId),
    });
  }}
>
  View Table
</Link>
```

**Parallel Prefetching:**
```typescript
useEffect(() => {
  // Prefetch related data
  Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['bucket', bucketId],
      queryFn: () => fetchBucket(bucketId),
    }),
    queryClient.prefetchQuery({
      queryKey: ['tables', bucketId],
      queryFn: () => fetchTables(bucketId),
    }),
  ]);
}, [bucketId]);
```

### 4. Background Refetching

**Automatic Background Updates:**
```typescript
const { data } = useQuery({
  queryKey: ['jobs'],
  queryFn: fetchJobs,
  // Refetch in background every 30 seconds
  refetchInterval: 30 * 1000,
  // Continue refetching even when tab not focused
  refetchIntervalInBackground: true,
});
```

**Conditional Refetching:**
```typescript
const { data } = useQuery({
  queryKey: ['job', jobId],
  queryFn: () => fetchJob(jobId),
  // Only refetch if job is running
  refetchInterval: (data) =>
    data?.status === 'running' ? 5000 : false,
});
```

## Optimistic Update Patterns

### Pattern 1: Simple Optimistic Update

```typescript
const useToggleStatus = (itemId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newStatus) => api.updateStatus(itemId, newStatus),

    onMutate: async (newStatus) => {
      // Cancel refetch
      await queryClient.cancelQueries({ queryKey: ['item', itemId] });

      // Snapshot
      const previous = queryClient.getQueryData(['item', itemId]);

      // Optimistic update
      queryClient.setQueryData(['item', itemId], (old) => ({
        ...old,
        status: newStatus,
      }));

      return { previous };
    },

    onError: (err, newStatus, context) => {
      queryClient.setQueryData(['item', itemId], context.previous);
    },
  });
};
```

### Pattern 2: List Optimistic Update

```typescript
const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId) => api.deleteItem(itemId),

    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: ['items'] });

      const previous = queryClient.getQueryData(['items']);

      // Remove item from list optimistically
      queryClient.setQueryData(['items'], (old) =>
        old.filter((item) => item.id !== itemId)
      );

      return { previous };
    },

    onError: (err, itemId, context) => {
      queryClient.setQueryData(['items'], context.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};
```

### Pattern 3: Complex Multi-Query Update

```typescript
const useCreateTask = (flowId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task) => api.createTask(flowId, task),

    onMutate: async (task) => {
      // Cancel multiple related queries
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ['flow', flowId] }),
        queryClient.cancelQueries({ queryKey: ['tasks', flowId] }),
        queryClient.cancelQueries({ queryKey: ['jobs', flowId] }),
      ]);

      // Snapshot all
      const previousFlow = queryClient.getQueryData(['flow', flowId]);
      const previousTasks = queryClient.getQueryData(['tasks', flowId]);

      // Optimistic update to tasks list
      queryClient.setQueryData(['tasks', flowId], (old) => [
        ...old,
        { ...task, id: 'temp-' + Date.now() },
      ]);

      // Optimistic update to flow
      queryClient.setQueryData(['flow', flowId], (old) => ({
        ...old,
        taskCount: old.taskCount + 1,
      }));

      return { previousFlow, previousTasks };
    },

    onError: (err, task, context) => {
      queryClient.setQueryData(['flow', flowId], context.previousFlow);
      queryClient.setQueryData(['tasks', flowId], context.previousTasks);
    },

    onSuccess: (newTask) => {
      // Replace temp ID with real ID
      queryClient.setQueryData(['tasks', flowId], (old) =>
        old.map((t) => (t.id.startsWith('temp-') ? newTask : t))
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['flow', flowId] });
      queryClient.invalidateQueries({ queryKey: ['tasks', flowId] });
    },
  });
};
```

## Server State vs Client State Decision Tree

```
┌─────────────────────────────────────────────────────────────┐
│              State Management Decision Tree                  │
└─────────────────────────────────────────────────────────────┘

Start: Need to manage state
│
├─ Does it come from server/API?
│  │
│  ├─ YES → Use TanStack Query
│  │        Examples: Tables, configurations, jobs
│  │
│  └─ NO → Continue
│
├─ Does it need to persist across sessions?
│  │
│  ├─ YES → Use Zustand with persist middleware
│  │        Examples: Theme, user preferences
│  │
│  └─ NO → Continue
│
├─ Is it shared across multiple components?
│  │
│  ├─ YES → Use Zustand
│  │        Examples: Modal state, selections
│  │
│  └─ NO → Continue
│
├─ Is it complex UI state (canvas, graphs)?
│  │
│  ├─ YES → Use Zustand
│  │        Examples: Flow builder, data lineage
│  │
│  └─ NO → Continue
│
├─ Is it just component-specific?
│  │
│  └─ YES → Use React State
│           Examples: Form inputs, toggles
│
└─ Still using Flux/Immutable.js?
   │
   └─ Plan migration to appropriate pattern above
```

## Anti-Patterns to Avoid

### 1. Storing Server State in Zustand

```typescript
// ❌ BAD: Server data in Zustand
const useStore = create((set) => ({
  tables: [],
  fetchTables: async () => {
    const tables = await api.fetchTables();
    set({ tables });
  },
}));

// ✅ GOOD: Server data in TanStack Query
const { data: tables } = useQuery({
  queryKey: ['tables'],
  queryFn: api.fetchTables,
});
```

### 2. Storing UI State in TanStack Query

```typescript
// ❌ BAD: UI state in query
const { data: isModalOpen } = useQuery({
  queryKey: ['modal-state'],
  queryFn: () => Promise.resolve(false),
});

// ✅ GOOD: UI state in Zustand or React state
const [isModalOpen, setIsModalOpen] = useState(false);
```

### 3. Prop Drilling Instead of Context

```typescript
// ❌ BAD: Passing through many levels
<Parent>
  <Child selection={selection} setSelection={setSelection}>
    <GrandChild selection={selection} setSelection={setSelection}>
      <GreatGrandChild selection={selection} setSelection={setSelection} />
    </GrandChild>
  </Child>
</Parent>

// ✅ GOOD: Use Zustand for shared state
const useSelectionStore = create((set) => ({
  selection: [],
  setSelection: (selection) => set({ selection }),
}));

// Access directly in any component
const selection = useSelectionStore((state) => state.selection);
```

### 4. Over-Fetching in Loops

```typescript
// ❌ BAD: Query in map
{items.map((item) => (
  <ItemDetail key={item.id} id={item.id} />
))}

function ItemDetail({ id }) {
  // Creates N queries!
  const { data } = useQuery(['item', id], () => fetchItem(id));
  return <div>{data.name}</div>;
}

// ✅ GOOD: Single query with useQueries
const results = useQueries({
  queries: items.map((item) => ({
    queryKey: ['item', item.id],
    queryFn: () => fetchItem(item.id),
  })),
});
```

### 5. Mixing Immutable.js with Native Objects

```typescript
// ❌ BAD: Inconsistent data structures
const table = Map({ id: '1', name: 'Table' });
const updatedTable = { ...table.toJS(), status: 'active' };

// ✅ GOOD: Use one consistently (prefer native)
const table = { id: '1', name: 'Table' };
const updatedTable = { ...table, status: 'active' };
```

## Performance Best Practices

### 1. Minimize Re-renders

```typescript
// ❌ BAD: Selects entire store
const store = useStore();

// ✅ GOOD: Select only what's needed
const count = useStore((state) => state.count);

// ✅ BETTER: Multiple selections with shallow
const { count, increment } = useStore(
  (state) => ({
    count: state.count,
    increment: state.increment,
  }),
  shallow
);
```

### 2. Memoize Expensive Computations

```typescript
// In Zustand store
const useStore = create((set, get) => ({
  items: [],

  // ✅ GOOD: Derived getter (computed on access)
  getSortedItems: () => {
    return get().items.slice().sort((a, b) => a.name.localeCompare(b.name));
  },
}));

// In component
const sortedItems = useMemo(
  () => store.getSortedItems(),
  [store.items]
);
```

### 3. Use Structural Sharing

```typescript
// TanStack Query does this automatically
const { data } = useQuery({
  queryKey: ['items'],
  queryFn: fetchItems,
  // Only changed objects trigger re-renders
});

// For Zustand, use immer middleware
const useStore = create(
  immer((set) => ({
    nested: { deep: { value: 0 } },
    updateValue: (val) =>
      set((state) => {
        state.nested.deep.value = val; // Immer handles immutability
      }),
  }))
);
```

### 4. Batch Updates

```typescript
// ❌ BAD: Multiple set calls
set({ first: 'John' });
set({ last: 'Doe' });
set({ email: 'john@example.com' });

// ✅ GOOD: Single batched update
set({
  first: 'John',
  last: 'Doe',
  email: 'john@example.com',
});
```

### 5. Lazy Query Initialization

```typescript
// Only fetch when needed
const { data, refetch } = useQuery({
  queryKey: ['heavy-data'],
  queryFn: fetchHeavyData,
  enabled: false, // Don't fetch on mount
});

// Trigger manually
<button onClick={() => refetch()}>Load Data</button>
```

## Testing Strategies

### Testing TanStack Query

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

test('should fetch data', async () => {
  const { result } = renderHook(() => useTable('table-1'), {
    wrapper: createWrapper(),
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toEqual(mockTable);
});
```

### Testing Zustand

```typescript
import { renderHook, act } from '@testing-library/react';
import { useStore } from './store';

test('should increment counter', () => {
  const { result } = renderHook(() => useStore());

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

### Integration Testing

```typescript
test('should update server and client state', async () => {
  const { result: query } = renderHook(() => useTable('table-1'), {
    wrapper: createWrapper(),
  });

  const { result: mutation } = renderHook(() => useUpdateTable('table-1'), {
    wrapper: createWrapper(),
  });

  await waitFor(() => expect(query.current.isSuccess).toBe(true));

  act(() => {
    mutation.current.mutate({ name: 'New Name' });
  });

  await waitFor(() => expect(mutation.current.isSuccess).toBe(true));
  await waitFor(() => expect(query.current.data.name).toBe('New Name'));
});
```

## Migration Roadmap

### Phase 1: New Modules (Complete)
- ✅ trash module
- ✅ Some flows-v2 features
- ✅ New data apps features

### Phase 2: Medium Complexity (Q1 2025)
- [ ] storage (tables)
- [ ] notifications
- [ ] transformations (new features)

### Phase 3: Complex Modules (Q2-Q3 2025)
- [ ] flows (complete migration to flows-v2 pattern)
- [ ] components (core stores)
- [ ] extractors/writers (incremental)

### Phase 4: Cleanup (Q4 2025)
- [ ] Remove Flux dependencies
- [ ] Remove Immutable.js
- [ ] Update build configuration
- [ ] Final performance optimization

## References

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [React Documentation - State Management](https://react.dev/learn/managing-state)
- [Flux to TanStack Migration Guide](./flux-to-tanstack-migration.md)
- [Zustand Usage Patterns](./zustand-usage-patterns.md)

## Summary

The Keboola UI uses a pragmatic, multi-pattern approach to state management:

1. **TanStack Query** for server state (API data, caching, background updates)
2. **Zustand** for complex client state (UI interactions, selections, canvas)
3. **React State** for local component state (forms, toggles, temporary values)
4. **Flux (Legacy)** being gradually migrated to modern patterns

This hybrid architecture optimizes for developer experience, performance, and maintainability while supporting gradual migration from legacy patterns.
