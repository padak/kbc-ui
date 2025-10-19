# Zustand Usage Patterns

## Overview

Zustand is a lightweight state management library used in Keboola UI for client-side UI state, particularly in complex interactive components like the flow builder canvas. This guide covers when to use Zustand, best practices, and real-world patterns from the flows-v2 module.

## When to Use Zustand vs TanStack Query

### Use Zustand For:

1. **Complex UI State**
   - Canvas/graph positions and interactions
   - Multi-step form wizards
   - Complex selection states
   - Undo/redo functionality
   - Transient UI state that doesn't persist

2. **Derived State Computations**
   - Computed values from multiple sources
   - Complex state transformations
   - State that changes frequently

3. **State Shared Across Components**
   - Modal visibility states
   - Theme/settings
   - Global UI preferences
   - Sidebar/panel states

### Use TanStack Query For:

1. **Server State**
   - API responses
   - Database queries
   - Remote data
   - Backend synchronization

2. **Cached Data**
   - Data that needs background updates
   - Data shared across routes
   - Data with automatic revalidation

### Use React State For:

1. **Local Component State**
   - Form input values
   - Toggle states
   - Local visibility flags
   - Component-specific state

## Zustand vs Other Solutions

| Feature | Zustand | Redux | TanStack Query | React State |
|---------|---------|-------|----------------|-------------|
| Bundle Size | 1.2KB | 12KB | 13KB | 0KB (built-in) |
| Boilerplate | Minimal | High | Low | None |
| DevTools | Yes | Yes | Yes | No |
| Server State | No | Manual | Built-in | No |
| TypeScript | Excellent | Good | Excellent | Excellent |
| Learning Curve | Low | High | Medium | None |
| Use Case | Client UI | Global State | Server State | Local State |

## Core Concepts

### 1. Store Creation

Basic store with TypeScript:

```typescript
import { create } from 'zustand';

type BearStore = {
  bears: number;
  increase: () => void;
  decrease: () => void;
};

const useBearStore = create<BearStore>((set) => ({
  bears: 0,
  increase: () => set((state) => ({ bears: state.bears + 1 })),
  decrease: () => set((state) => ({ bears: state.bears - 1 })),
}));
```

### 2. Using the Store

```typescript
function BearCounter() {
  const bears = useBearStore((state) => state.bears);
  return <h1>{bears} bears</h1>;
}

function Controls() {
  const increase = useBearStore((state) => state.increase);
  const decrease = useBearStore((state) => state.decrease);

  return (
    <>
      <button onClick={increase}>+</button>
      <button onClick={decrease}>-</button>
    </>
  );
}
```

### 3. Selecting State

Only re-render when selected state changes:

```typescript
// Bad: Re-renders on any state change
const state = useBearStore();

// Good: Only re-renders when bears changes
const bears = useBearStore((state) => state.bears);

// Good: Only re-renders when increase changes (never, it's stable)
const increase = useBearStore((state) => state.increase);

// Good: Multiple selections with shallow equality
const { bears, increase } = useBearStore(
  (state) => ({
    bears: state.bears,
    increase: state.increase,
  }),
  shallow
);
```

## Real-World Pattern: Flow Builder Store

The flows-v2 module provides an excellent example of Zustand usage for complex canvas state management.

### Store Definition

```typescript
// flows-v2/builder/store/store.ts

import type { Edge, EdgeChange, NodeChange } from '@xyflow/react';
import { applyEdgeChanges, applyNodeChanges } from '@xyflow/react';
import { createStore } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useShallow } from 'zustand/shallow';

type BuilderState = {
  // Canvas state
  nodes: AppNode[];
  edges: Edge[];
  layoutTrigger: string;

  // Selection state
  selectedTaskId: string | null;
  selectedPhaseId: string | null;
  selectedConditionId: string | null;
  selectedAddButton: string | null;

  // UI state
  nodeDragging: boolean;
  searchQuery: string;

  // Context (from external sources)
  context: Context;
  flowStatus: FlowStatus;

  // Actions
  setNodes: (nodes: AppNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  setSelectedTaskId: (id: string | null) => void;
  resetSelected: () => void;
  refreshLayout: () => void;
  onNodesChange: (changes: NodeChange<AppNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<Edge>[]) => void;
};

export const createBuilderStore = (initialState) => {
  return createStore<BuilderState>()(
    devtools(
      (set, get) => ({
        // Initial state
        nodes: initialState.nodes,
        edges: initialState.edges,
        layoutTrigger: generateUUID(),
        selectedTaskId: null,
        selectedPhaseId: null,
        selectedConditionId: null,
        selectedAddButton: null,
        nodeDragging: false,
        searchQuery: '',
        context: initialState.context,
        flowStatus: initialState.flowStatus,

        // Actions
        setNodes: (nodes) => set({ nodes }),
        setEdges: (edges) => set({ edges }),

        setSelectedTaskId: (taskId) =>
          set({
            selectedTaskId: taskId,
            selectedPhaseId: null,
            selectedAddButton: null,
            selectedConditionId: null,
          }),

        setSelectedPhaseId: (phaseId) =>
          set({
            selectedPhaseId: phaseId,
            selectedTaskId: null,
            selectedAddButton: null,
            selectedConditionId: null,
          }),

        resetSelected: () =>
          set({
            selectedTaskId: null,
            selectedPhaseId: null,
            selectedConditionId: null,
            selectedAddButton: null,
          }),

        refreshLayout: () => set({ layoutTrigger: generateUUID() }),

        onNodesChange: (changes) => {
          set({ nodes: applyNodeChanges(changes, get().nodes) });
        },

        onEdgesChange: (changes) => {
          set({ edges: applyEdgeChanges(changes, get().edges) });
        },
      }),
      { name: 'builder-store' } // DevTools name
    )
  );
};
```

### Context Provider Pattern

For component-scoped stores:

```typescript
// flows-v2/builder/store/BuilderProvider.tsx

import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import { useShallow } from 'zustand/shallow';

export const BuilderContext = createContext<BuilderStore | null>(null);

export const BuilderProvider = ({ config, phases, tasks, children }) => {
  const storeRef = useRef<BuilderStore>();

  // Prepare initial data
  const { nodes, edges } = useMemo(
    () => prepareFlowData(phases, tasks, components),
    [phases, tasks, components]
  );

  // Create store only once
  if (!storeRef.current) {
    storeRef.current = createBuilderStore({ nodes, edges, context });
  }

  // Update store when external data changes
  useLayoutEffect(() => {
    if (!storeRef.current) return;

    const currentNodes = storeRef.current.getState().nodes;
    const sameNodes = compareNodes(currentNodes, nodes);

    if (!sameNodes) {
      storeRef.current.getState().setNodes(nodes);
    }
  }, [nodes, edges]);

  return (
    <BuilderContext.Provider value={storeRef.current}>
      {children}
    </BuilderContext.Provider>
  );
};

// Custom hook with shallow comparison
export const useBuilderStore = <T,>(selector: (state: BuilderState) => T) => {
  const store = useContext(BuilderContext);

  if (!store) {
    throw new Error('Missing BuilderProvider in the tree.');
  }

  return useStore(store, useShallow(selector));
};
```

### Usage in Components

```typescript
// flows-v2/builder/BuilderCanvas.tsx

import { useBuilderStore } from './store';

const BuilderCanvas = () => {
  // Select only what you need
  const [nodes, edges, onNodesChange, onEdgesChange] = useBuilderStore(
    (state) => [
      state.nodes,
      state.edges,
      state.onNodesChange,
      state.onEdgesChange,
    ]
  );

  const selectedTaskId = useBuilderStore((state) => state.selectedTaskId);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
    />
  );
};
```

## Best Practices

### 1. Organize Store by Feature

Group related state and actions:

```typescript
type BuilderStore = {
  // Selection feature
  selection: {
    taskId: string | null;
    phaseId: string | null;
  };
  setSelection: (type: 'task' | 'phase', id: string | null) => void;
  clearSelection: () => void;

  // Canvas feature
  canvas: {
    nodes: Node[];
    edges: Edge[];
    zoom: number;
  };
  updateCanvas: (updates: Partial<CanvasState>) => void;

  // Search feature
  search: {
    query: string;
    results: SearchResult[];
  };
  setSearchQuery: (query: string) => void;
};
```

### 2. Use Slices for Large Stores

Split large stores into smaller slices:

```typescript
// selectionSlice.ts
const createSelectionSlice = (set, get) => ({
  selectedTaskId: null,
  selectedPhaseId: null,
  setSelectedTaskId: (id) => set({ selectedTaskId: id, selectedPhaseId: null }),
  setSelectedPhaseId: (id) => set({ selectedPhaseId: id, selectedTaskId: id }),
  clearSelection: () => set({ selectedTaskId: null, selectedPhaseId: null }),
});

// canvasSlice.ts
const createCanvasSlice = (set, get) => ({
  nodes: [],
  edges: [],
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
});

// Combined store
const useStore = create((set, get) => ({
  ...createSelectionSlice(set, get),
  ...createCanvasSlice(set, get),
}));
```

### 3. Derive State Instead of Storing It

Compute derived values on the fly:

```typescript
const useBuilderStore = create<BuilderState>((set, get) => ({
  nodes: [],
  edges: [],

  // Derived getters (not stored)
  getSelectedNode: () => {
    const { nodes, selectedTaskId } = get();
    return nodes.find((n) => n.id === selectedTaskId);
  },

  getPhaseNodes: (phaseId: string) => {
    return get().nodes.filter((n) => n.data.phaseId === phaseId);
  },
}));

// Usage
const selectedNode = useBuilderStore((state) => state.getSelectedNode());
```

### 4. Action Patterns

**Simple Actions:**

```typescript
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

**Complex Actions with Multiple Updates:**

```typescript
const useStore = create((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });

    try {
      const user = await api.login(credentials);
      set({ user, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
```

**Actions with Side Effects:**

```typescript
const useStore = create((set, get) => ({
  theme: 'light',

  setTheme: (theme) => {
    set({ theme });
    // Side effect: Update localStorage
    localStorage.setItem('theme', theme);
    // Side effect: Update CSS variable
    document.documentElement.setAttribute('data-theme', theme);
  },
}));
```

### 5. Middleware Usage

**DevTools:**

```typescript
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    (set) => ({
      bears: 0,
      increase: () => set((state) => ({ bears: state.bears + 1 })),
    }),
    { name: 'bear-store' } // Name in DevTools
  )
);
```

**Persist:**

```typescript
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage', // localStorage key
      // Optional: custom storage
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
```

**Immer (for immutable updates):**

```typescript
import { immer } from 'zustand/middleware/immer';

const useStore = create(
  immer((set) => ({
    nested: { count: 0 },
    increase: () =>
      set((state) => {
        state.nested.count += 1; // Mutate draft, Immer handles immutability
      }),
  }))
);
```

**Combining Middleware:**

```typescript
const useStore = create(
  devtools(
    persist(
      immer((set) => ({
        // ... state
      })),
      { name: 'my-store' }
    ),
    { name: 'my-store-devtools' }
  )
);
```

### 6. Selector Patterns

**Single Value:**

```typescript
const bears = useStore((state) => state.bears);
```

**Multiple Values with Shallow:**

```typescript
import { shallow } from 'zustand/shallow';

const { bears, increase } = useStore(
  (state) => ({
    bears: state.bears,
    increase: state.increase,
  }),
  shallow
);
```

**Derived Values:**

```typescript
const hasMultipleBears = useStore((state) => state.bears > 1);
```

**Memoized Selectors:**

```typescript
import { useMemo } from 'react';

const useFilteredNodes = (searchQuery) => {
  return useStore(
    useMemo(
      () => (state) =>
        state.nodes.filter((node) =>
          node.data.name.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      [searchQuery]
    )
  );
};
```

### 7. TypeScript Patterns

**Typed Store:**

```typescript
type State = {
  count: number;
  text: string;
};

type Actions = {
  increment: () => void;
  setText: (text: string) => void;
};

type Store = State & Actions;

const useStore = create<Store>((set) => ({
  count: 0,
  text: '',
  increment: () => set((state) => ({ count: state.count + 1 })),
  setText: (text) => set({ text }),
}));
```

**Typed Selector:**

```typescript
const useStoreSelector = <T,>(selector: (state: Store) => T): T => {
  return useStore(selector);
};

// Usage with type inference
const count = useStoreSelector((state) => state.count); // number
```

**Typed Actions:**

```typescript
type Action =
  | { type: 'INCREMENT' }
  | { type: 'SET_TEXT'; payload: string }
  | { type: 'RESET' };

const useStore = create<Store>((set) => ({
  count: 0,
  text: '',

  dispatch: (action: Action) => {
    switch (action.type) {
      case 'INCREMENT':
        return set((state) => ({ count: state.count + 1 }));
      case 'SET_TEXT':
        return set({ text: action.payload });
      case 'RESET':
        return set({ count: 0, text: '' });
    }
  },
}));
```

## Performance Considerations

### 1. Avoid Over-Selecting

```typescript
// Bad: Selects everything, re-renders on any change
const state = useStore();

// Good: Selects only what's needed
const count = useStore((state) => state.count);
```

### 2. Memoize Expensive Selectors

```typescript
const useExpensiveData = () => {
  return useStore(
    (state) => {
      // Expensive computation
      return state.items
        .filter((item) => item.active)
        .sort((a, b) => a.name.localeCompare(b.name));
    },
    // Shallow comparison prevents unnecessary recalculations
    shallow
  );
};
```

### 3. Split Large Stores

```typescript
// Bad: One large store
const useAppStore = create((set) => ({
  user: null,
  theme: 'light',
  sidebar: { open: false },
  notifications: [],
  // ... 50 more properties
}));

// Good: Multiple focused stores
const useUserStore = create((set) => ({ user: null }));
const useThemeStore = create((set) => ({ theme: 'light' }));
const useSidebarStore = create((set) => ({ open: false }));
const useNotificationStore = create((set) => ({ notifications: [] }));
```

### 4. Transient Updates

For high-frequency updates that don't need to trigger re-renders:

```typescript
const useStore = create((set, get) => ({
  position: { x: 0, y: 0 },

  // Normal update: Triggers re-renders
  setPosition: (x, y) => set({ position: { x, y } }),

  // Transient update: Updates state but doesn't notify subscribers
  setPositionTransient: (x, y) => {
    get().position.x = x;
    get().position.y = y;
  },
}));
```

### 5. Batch Updates

```typescript
const useStore = create((set) => ({
  first: '',
  last: '',
  email: '',

  // Bad: Three separate updates
  updateUser: (user) => {
    set({ first: user.first });
    set({ last: user.last });
    set({ email: user.email });
  },

  // Good: Single batched update
  updateUser: (user) => {
    set({
      first: user.first,
      last: user.last,
      email: user.email,
    });
  },
}));
```

## Testing Zustand Stores

### Unit Testing Actions

```typescript
import { renderHook, act } from '@testing-library/react';
import { useBuilderStore } from './store';

describe('BuilderStore', () => {
  it('should update selected task', () => {
    const { result } = renderHook(() => useBuilderStore());

    act(() => {
      result.current.setSelectedTaskId('task-1');
    });

    expect(result.current.selectedTaskId).toBe('task-1');
    expect(result.current.selectedPhaseId).toBe(null);
  });

  it('should clear selection', () => {
    const { result } = renderHook(() => useBuilderStore());

    act(() => {
      result.current.setSelectedTaskId('task-1');
      result.current.clearSelection();
    });

    expect(result.current.selectedTaskId).toBe(null);
  });
});
```

### Testing with Provider

```typescript
const wrapper = ({ children }) => (
  <BuilderProvider config={mockConfig} phases={mockPhases} tasks={mockTasks}>
    {children}
  </BuilderProvider>
);

it('should access store from context', () => {
  const { result } = renderHook(
    () => useBuilderStore((state) => state.nodes),
    { wrapper }
  );

  expect(result.current).toHaveLength(3);
});
```

### Integration Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react';

describe('BuilderCanvas Integration', () => {
  it('should update selection when node clicked', () => {
    render(
      <BuilderProvider {...props}>
        <BuilderCanvas />
      </BuilderProvider>
    );

    const node = screen.getByTestId('node-task-1');
    fireEvent.click(node);

    expect(screen.getByTestId('selected-task')).toHaveTextContent('task-1');
  });
});
```

## Common Use Cases

### 1. Modal Management

```typescript
type ModalStore = {
  modals: {
    addTask: boolean;
    editTask: boolean;
    deleteConfirm: boolean;
  };
  openModal: (modal: keyof ModalStore['modals']) => void;
  closeModal: (modal: keyof ModalStore['modals']) => void;
  closeAllModals: () => void;
};

const useModalStore = create<ModalStore>((set) => ({
  modals: {
    addTask: false,
    editTask: false,
    deleteConfirm: false,
  },

  openModal: (modal) =>
    set((state) => ({
      modals: { ...state.modals, [modal]: true },
    })),

  closeModal: (modal) =>
    set((state) => ({
      modals: { ...state.modals, [modal]: false },
    })),

  closeAllModals: () =>
    set({
      modals: {
        addTask: false,
        editTask: false,
        deleteConfirm: false,
      },
    }),
}));

// Usage
const isAddTaskOpen = useModalStore((state) => state.modals.addTask);
const openModal = useModalStore((state) => state.openModal);

<button onClick={() => openModal('addTask')}>Add Task</button>
```

### 2. Undo/Redo

```typescript
type UndoRedoStore = {
  past: State[];
  present: State;
  future: State[];
  set: (newPresent: State) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
};

const useUndoRedoStore = create<UndoRedoStore>((set, get) => ({
  past: [],
  present: initialState,
  future: [],

  set: (newPresent) =>
    set((state) => ({
      past: [...state.past, state.present],
      present: newPresent,
      future: [],
    })),

  undo: () =>
    set((state) => {
      if (state.past.length === 0) return state;

      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, state.past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [state.present, ...state.future],
      };
    }),

  redo: () =>
    set((state) => {
      if (state.future.length === 0) return state;

      const next = state.future[0];
      const newFuture = state.future.slice(1);

      return {
        past: [...state.past, state.present],
        present: next,
        future: newFuture,
      };
    }),

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
}));
```

### 3. Form State

```typescript
type FormStore = {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;

  setFieldValue: (field: string, value: any) => void;
  setFieldError: (field: string, error: string) => void;
  setFieldTouched: (field: string) => void;
  submit: (onSubmit: (values: any) => Promise<void>) => void;
  reset: () => void;
};

const useFormStore = create<FormStore>((set, get) => ({
  values: {},
  errors: {},
  touched: {},
  isSubmitting: false,

  setFieldValue: (field, value) =>
    set((state) => ({
      values: { ...state.values, [field]: value },
      errors: { ...state.errors, [field]: '' },
    })),

  setFieldError: (field, error) =>
    set((state) => ({
      errors: { ...state.errors, [field]: error },
    })),

  setFieldTouched: (field) =>
    set((state) => ({
      touched: { ...state.touched, [field]: true },
    })),

  submit: async (onSubmit) => {
    set({ isSubmitting: true });
    try {
      await onSubmit(get().values);
      get().reset();
    } catch (error) {
      console.error(error);
    } finally {
      set({ isSubmitting: false });
    }
  },

  reset: () => set({ values: {}, errors: {}, touched: {}, isSubmitting: false }),
}));
```

### 4. Search/Filter State

```typescript
type SearchStore = {
  query: string;
  filters: {
    status: string[];
    tags: string[];
    dateRange: [Date | null, Date | null];
  };
  results: SearchResult[];
  isSearching: boolean;

  setQuery: (query: string) => void;
  setFilter: (type: keyof SearchStore['filters'], value: any) => void;
  clearFilters: () => void;
  search: () => Promise<void>;
};

const useSearchStore = create<SearchStore>((set, get) => ({
  query: '',
  filters: {
    status: [],
    tags: [],
    dateRange: [null, null],
  },
  results: [],
  isSearching: false,

  setQuery: (query) => set({ query }),

  setFilter: (type, value) =>
    set((state) => ({
      filters: { ...state.filters, [type]: value },
    })),

  clearFilters: () =>
    set({
      filters: {
        status: [],
        tags: [],
        dateRange: [null, null],
      },
    }),

  search: async () => {
    set({ isSearching: true });
    try {
      const { query, filters } = get();
      const results = await api.search(query, filters);
      set({ results, isSearching: false });
    } catch (error) {
      set({ isSearching: false });
      console.error(error);
    }
  },
}));
```

## Debugging Tips

### 1. DevTools Integration

```typescript
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    (set) => ({
      count: 0,
      increase: () => set((state) => ({ count: state.count + 1 }), false, 'increase'),
    }),
    { name: 'Counter Store' }
  )
);

// Actions will appear in Redux DevTools with custom names
```

### 2. Logging Middleware

```typescript
const log = (config) => (set, get, api) =>
  config(
    (...args) => {
      console.log('  applying', args);
      set(...args);
      console.log('  new state', get());
    },
    get,
    api
  );

const useStore = create(log((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
})));
```

### 3. State Snapshots

```typescript
const useStore = create((set, get) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  getSnapshot: () => JSON.stringify(get()),
  restoreSnapshot: (snapshot) => set(JSON.parse(snapshot)),
}));

// In development
window.getStoreSnapshot = useStore.getState().getSnapshot;
window.restoreStoreSnapshot = useStore.getState().restoreSnapshot;
```

## References

- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Zustand TypeScript Guide](https://docs.pmnd.rs/zustand/guides/typescript)
- [Zustand Best Practices](https://docs.pmnd.rs/zustand/guides/practice-with-no-store-actions)
- [flows-v2 Implementation](../02-modules/flows-v2.md)
- [Zustand vs Redux](https://dev.to/franklin030601/zustand-vs-redux-a-simple-comparison-2pom)

## Summary

Zustand is ideal for:
- Complex UI state (canvas positions, selections)
- Transient state (dragging, hovering)
- Cross-component state (modals, themes)
- Derived computations
- Undo/redo functionality

Use with TanStack Query for server state and React state for local component state to create a complete state management solution.
