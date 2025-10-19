# State Management Patterns

## Introduction

The Keboola UI uses three distinct state management approaches reflecting the evolution of the codebase from legacy Flux architecture to modern React patterns. This document explains when each pattern is used, how data flows through each system, and provides real-world examples from the codebase.

**Current Distribution** (from Phase 2 analysis):
- **Flux + Immutable.js**: 40% (Legacy)
- **TanStack Query**: 30% (Modern server state)
- **Zustand**: 30% (Modern client state, especially canvas/AI)

---

## Overview: Three State Management Patterns

```
┌─────────────────────────────────────────────────────────────┐
│                    State Management                          │
├─────────────────┬──────────────────┬────────────────────────┤
│  Flux (Legacy)  │  TanStack Query  │  Zustand (Modern)      │
│  40%            │  30%             │  30%                   │
├─────────────────┼──────────────────┼────────────────────────┤
│ • Immutable.js  │ • Server cache   │ • Client state         │
│ • Manual subs   │ • Auto refetch   │ • Canvas state         │
│ • Boilerplate   │ • Mutations      │ • AI sessions          │
│ • Complex       │ • DevTools       │ • Undo/redo            │
└─────────────────┴──────────────────┴────────────────────────┘
```

---

## Pattern 1: Flux + Immutable.js (Legacy - 40%)

### Architecture

```
┌──────────────┐
│  Component   │
│  (View)      │
└──────┬───────┘
       │
       │ dispatch(action)
       ▼
┌──────────────┐
│  Dispatcher  │
│  (Flux)      │
└──────┬───────┘
       │
       │ forward to stores
       ▼
┌──────────────┐
│  Store       │
│  (State)     │
│  Immutable   │
└──────┬───────┘
       │
       │ emitChange()
       ▼
┌──────────────┐
│  Component   │
│  Re-render   │
└──────────────┘
```

### Key Characteristics

**Technologies**:
- `flux` 4.0.4 - Unidirectional data flow
- `immutable` 3.7.6 - Immutable data structures
- `eventemitter3` 5.0.1 - Event system

**When Used**:
- Legacy modules not yet migrated
- Complex nested state structures
- Modules with heavy business logic

**Pros**:
- Predictable state updates
- Time-travel debugging (immutability)
- Explicit action flow

**Cons**:
- Verbose boilerplate
- Manual subscriptions
- Performance overhead (Immutable.js)
- Difficult to test

### Example: Storage Module (Legacy Pattern)

**File**: `apps/kbc-ui/src/scripts/modules/storage/store.ts`

```typescript
import { Store } from 'flux/utils';
import Immutable from 'immutable';
import dispatcher from '@/Dispatcher';
import { ActionTypes } from './constants';

class StorageStore extends Store {
  // Immutable Map for state
  private _data = Immutable.fromJS({
    search: '',
    filters: {
      shared: false,
      entityType: null,
      devBranch: false
    },
    selectedRows: []
  });

  // Getter for component access
  getSearch(): string {
    return this._data.get('search');
  }

  getFilters(): Immutable.Map {
    return this._data.get('filters');
  }

  getSelectedRows(): string[] {
    return this._data.get('selectedRows').toJS();
  }

  // Handle dispatched actions
  __onDispatch(action: Action): void {
    switch (action.type) {
      case ActionTypes.STORAGE_SET_SEARCH:
        this._data = this._data.set('search', action.payload);
        this.__emitChange(); // Notify listeners
        break;

      case ActionTypes.STORAGE_TOGGLE_FILTER:
        this._data = this._data.setIn(
          ['filters', action.payload.key],
          action.payload.value
        );
        this.__emitChange();
        break;

      case ActionTypes.STORAGE_SELECT_ROW:
        const current = this._data.get('selectedRows');
        this._data = this._data.set(
          'selectedRows',
          current.push(action.payload)
        );
        this.__emitChange();
        break;

      default:
        // No state change
    }
  }
}

export default new StorageStore(dispatcher);
```

**Action Creators** (`apps/kbc-ui/src/scripts/modules/storage/actions.tsx`):

```typescript
import dispatcher from '@/Dispatcher';
import { ActionTypes } from './constants';

export function setSearch(query: string): void {
  dispatcher.dispatch({
    type: ActionTypes.STORAGE_SET_SEARCH,
    payload: query
  });
}

export function toggleFilter(key: string, value: boolean): void {
  dispatcher.dispatch({
    type: ActionTypes.STORAGE_TOGGLE_FILTER,
    payload: { key, value }
  });
}

export function selectRow(rowId: string): void {
  dispatcher.dispatch({
    type: ActionTypes.STORAGE_SELECT_ROW,
    payload: rowId
  });
}
```

**Component Usage**:

```typescript
import React, { useEffect, useState } from 'react';
import StorageStore from './store';
import * as StorageActions from './actions';

const StorageIndex: React.FC = () => {
  // Manual subscription to store
  const [search, setSearch] = useState(StorageStore.getSearch());
  const [filters, setFilters] = useState(StorageStore.getFilters().toJS());

  useEffect(() => {
    // Listen for store changes
    const onChange = () => {
      setSearch(StorageStore.getSearch());
      setFilters(StorageStore.getFilters().toJS());
    };

    const token = StorageStore.addListener(onChange);

    // Cleanup subscription
    return () => token.remove();
  }, []);

  return (
    <div>
      <input
        value={search}
        onChange={(e) => StorageActions.setSearch(e.target.value)}
      />
      {/* filters UI */}
    </div>
  );
};
```

**Data Flow**:

```
User types in search box
    │
    ▼
onChange handler calls StorageActions.setSearch()
    │
    ▼
Dispatcher receives action: { type: 'STORAGE_SET_SEARCH', payload: 'test' }
    │
    ▼
StorageStore.__onDispatch() handles action
    │
    ▼
StorageStore._data.set('search', 'test')
    │
    ▼
StorageStore.__emitChange() fires
    │
    ▼
Component listener triggers
    │
    ▼
setSearch(StorageStore.getSearch()) updates local state
    │
    ▼
Component re-renders with new search value
```

### Modules Using Flux

**Fully Flux-based**:
- `storage` (partial - being migrated)
- `flows` (legacy)
- `data-apps`
- `ex-facebook`
- `ex-aws-s3` (legacy config)
- `legacy-transformation`
- `settings` (partial)

**Common Pattern**:
- `store.ts` - Flux store with Immutable.js
- `actions.tsx` - Action creators
- `constants.ts` - Action type constants
- Components subscribe manually with `addListener()`

---

## Pattern 2: TanStack Query (Modern Server State - 30%)

### Architecture

```
┌──────────────┐
│  Component   │
└──────┬───────┘
       │
       │ useQuery / useMutation
       ▼
┌──────────────────┐
│  TanStack Query  │
│  Cache           │
└──────┬───────────┘
       │
       │ auto fetch/refetch
       ▼
┌──────────────┐
│  API Client  │
└──────┬───────┘
       │
       │ HTTP request
       ▼
┌──────────────┐
│  Backend     │
└──────────────┘
```

### Key Characteristics

**Technologies**:
- `@tanstack/react-query` 5.85.5
- `@tanstack/react-query-devtools` 5.85.5

**When Used**:
- Server state (data from APIs)
- Lists, tables, data fetching
- Modern modules (new/refactored)
- Real-time data with polling

**Pros**:
- Automatic caching
- Background refetching
- Optimistic updates
- Built-in loading/error states
- DevTools for debugging
- Minimal boilerplate

**Cons**:
- Learning curve (different paradigm)
- Requires proper query key management
- Not ideal for complex client state

### Example: Trash Module (Reference Implementation)

**File**: `apps/kbc-ui/src/scripts/modules/trash/rqHooks/useDeletedComponents.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import type { DeletedComponent } from '../types';

export const DELETED_COMPONENTS_QUERY_KEY = ['trash', 'deleted-components'];

/**
 * Fetch all deleted components with automatic caching
 */
export function useDeletedComponents() {
  return useQuery({
    queryKey: DELETED_COMPONENTS_QUERY_KEY,
    queryFn: async (): Promise<DeletedComponent[]> => {
      const response = await api.getDeletedComponents();
      return response.components;
    },
    staleTime: 30_000, // Consider fresh for 30s
    gcTime: 5 * 60_000, // Keep in cache for 5 min
    refetchOnWindowFocus: true, // Refetch when user returns
  });
}
```

**Mutation Hook** (`useRestoreConfiguration.ts`):

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { DELETED_COMPONENTS_QUERY_KEY } from './useDeletedComponents';

export function useRestoreConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (configId: string) => {
      return api.restoreConfiguration(configId);
    },

    // Optimistic update (instant UI feedback)
    onMutate: async (configId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: DELETED_COMPONENTS_QUERY_KEY
      });

      // Snapshot current data
      const previousData = queryClient.getQueryData(
        DELETED_COMPONENTS_QUERY_KEY
      );

      // Optimistically update
      queryClient.setQueryData(
        DELETED_COMPONENTS_QUERY_KEY,
        (old: DeletedComponent[] | undefined) => {
          return old?.filter(c => c.configId !== configId);
        }
      );

      // Return context for rollback
      return { previousData };
    },

    // Rollback on error
    onError: (err, configId, context) => {
      queryClient.setQueryData(
        DELETED_COMPONENTS_QUERY_KEY,
        context?.previousData
      );
    },

    // Refetch on success
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: DELETED_COMPONENTS_QUERY_KEY
      });
    }
  });
}
```

**Component Usage** (`TrashIndex.tsx`):

```typescript
import React from 'react';
import { useDeletedComponents } from '../rqHooks/useDeletedComponents';
import { useRestoreConfiguration } from '../rqHooks/useRestoreConfiguration';

const TrashIndex: React.FC = () => {
  // Automatic data fetching, caching, and error handling
  const {
    data: components,
    isLoading,
    isError,
    error,
    refetch
  } = useDeletedComponents();

  const restoreMutation = useRestoreConfiguration();

  const handleRestore = async (configId: string) => {
    try {
      await restoreMutation.mutateAsync(configId);
      // Success feedback handled by mutation
    } catch (err) {
      // Error already rolled back by mutation
      console.error('Failed to restore:', err);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage error={error} />;

  return (
    <div>
      {components?.map(component => (
        <ComponentRow
          key={component.id}
          component={component}
          onRestore={handleRestore}
          isRestoring={restoreMutation.isPending}
        />
      ))}
    </div>
  );
};
```

**Data Flow**:

```
Component mounts
    │
    ▼
useDeletedComponents() hook called
    │
    ▼
TanStack Query checks cache
    │
    ├─ Cache HIT → Return cached data immediately
    │   └─ Background refetch (if stale)
    │
    └─ Cache MISS → Show loading state
        │
        ▼
    Execute queryFn: api.getDeletedComponents()
        │
        ▼
    Store result in cache
        │
        ▼
    Return data to component
        │
        ▼
    Component renders with data

─────────────────────────────────────

User clicks "Restore" button
    │
    ▼
restoreMutation.mutateAsync(configId)
    │
    ▼
onMutate: Optimistically remove from UI
    │
    ▼
mutationFn: api.restoreConfiguration()
    │
    ├─ SUCCESS
    │   └─ onSuccess: Invalidate cache, refetch data
    │
    └─ ERROR
        └─ onError: Rollback optimistic update
```

### Modules Using TanStack Query

**Full Migration**:
- `trash` (100% - reference implementation)
- Modern extractors (partial)

**Partial Migration**:
- `flows-v2` (jobs/runs data)
- `transformations-v2` (some endpoints)
- `storage` (beginning migration)

**Common Patterns**:
- `rqHooks/` directory with custom hooks
- Query keys in constants
- Optimistic updates for mutations
- Background refetching for real-time data

---

## Pattern 3: Zustand (Modern Client State - 30%)

### Architecture

```
┌──────────────┐
│  Component   │
└──────┬───────┘
       │
       │ useStore(selector)
       ▼
┌──────────────────┐
│  Zustand Store   │
│  (Reactive)      │
└──────┬───────────┘
       │
       │ set/get
       ▼
┌──────────────┐
│  State       │
│  (Plain JS)  │
└──────────────┘
```

### Key Characteristics

**Technologies**:
- `zustand` 5.0.8

**When Used**:
- Canvas state (React Flow)
- Complex UI state
- Undo/redo functionality
- AI session state
- Client-only state (not from API)

**Pros**:
- Minimal boilerplate
- No providers needed
- Built-in devtools
- Middleware support (persist, undo/redo)
- TypeScript-friendly
- Fast and lightweight

**Cons**:
- Less opinionated (need patterns)
- No built-in API integration

### Example: Flow Builder (flows-v2)

**File**: `apps/kbc-ui/src/scripts/modules/flows-v2/builder/store/store.ts`

```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Node, Edge } from '@xyflow/react';

export interface BuilderState {
  // Canvas state
  nodes: Node[];
  edges: Edge[];
  selectedNode: string | null;

  // Modal state
  isTaskModalOpen: boolean;
  editingTaskId: string | null;

  // Actions
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  updateNode: (id: string, updates: Partial<Node>) => void;
  deleteNode: (id: string) => void;
  selectNode: (id: string | null) => void;
  openTaskModal: (taskId: string) => void;
  closeTaskModal: () => void;
}

export const useBuilderStore = create<BuilderState>()(
  devtools(
    (set, get) => ({
      // Initial state
      nodes: [],
      edges: [],
      selectedNode: null,
      isTaskModalOpen: false,
      editingTaskId: null,

      // Actions
      setNodes: (nodes) => set({ nodes }),
      setEdges: (edges) => set({ edges }),

      addNode: (node) => set((state) => ({
        nodes: [...state.nodes, node]
      })),

      updateNode: (id, updates) => set((state) => ({
        nodes: state.nodes.map(n =>
          n.id === id ? { ...n, ...updates } : n
        )
      })),

      deleteNode: (id) => set((state) => ({
        nodes: state.nodes.filter(n => n.id !== id),
        edges: state.edges.filter(e =>
          e.source !== id && e.target !== id
        )
      })),

      selectNode: (id) => set({ selectedNode: id }),

      openTaskModal: (taskId) => set({
        isTaskModalOpen: true,
        editingTaskId: taskId
      }),

      closeTaskModal: () => set({
        isTaskModalOpen: false,
        editingTaskId: null
      })
    }),
    { name: 'FlowBuilder' } // DevTools name
  )
);
```

**Undo/Redo Middleware** (`undoRedoStore.ts`):

```typescript
import { create } from 'zustand';
import { temporal } from 'zundo'; // Undo/redo middleware

export interface CanvasState {
  nodes: Node[];
  edges: Edge[];
}

export const useUndoRedoStore = create<CanvasState>()(
  temporal(
    (set) => ({
      nodes: [],
      edges: [],
      // ... actions
    }),
    {
      limit: 50, // Max undo steps
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges
        // Don't include modal state in undo/redo
      })
    }
  )
);

// Undo/redo controls
export const useUndoRedo = () => {
  const undo = useUndoRedoStore.temporal.undo;
  const redo = useUndoRedoStore.temporal.redo;
  const canUndo = useUndoRedoStore.temporal.canUndo;
  const canRedo = useUndoRedoStore.temporal.canRedo;

  return { undo, redo, canUndo, canRedo };
};
```

**Component Usage** (`BuilderCanvas.tsx`):

```typescript
import React, { useCallback } from 'react';
import ReactFlow from '@xyflow/react';
import { useBuilderStore } from '../store/store';

const BuilderCanvas: React.FC = () => {
  // Select only needed state (automatic re-render optimization)
  const nodes = useBuilderStore(state => state.nodes);
  const edges = useBuilderStore(state => state.edges);
  const updateNode = useBuilderStore(state => state.updateNode);

  const onNodesChange = useCallback((changes) => {
    // Update nodes through store
    const updatedNodes = applyNodeChanges(changes, nodes);
    useBuilderStore.getState().setNodes(updatedNodes);
  }, [nodes]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onNodeClick={(_, node) => {
        useBuilderStore.getState().selectNode(node.id);
      }}
    />
  );
};
```

**Data Flow**:

```
User drags node on canvas
    │
    ▼
ReactFlow onNodesChange event
    │
    ▼
useBuilderStore.getState().setNodes(updatedNodes)
    │
    ▼
Zustand store updates nodes array
    │
    ▼
All components using nodes selector re-render automatically
    │
    ▼
Canvas reflects new positions

─────────────────────────────────────

User clicks "Undo" button
    │
    ▼
useUndoRedo().undo()
    │
    ▼
Temporal middleware pops state from history
    │
    ▼
Previous nodes/edges restored
    │
    ▼
Canvas automatically updates
```

### Modules Using Zustand

**Full Implementation**:
- `flows-v2` (builder state, undo/redo)
- `ai` (session state, conversation)
- `lineage` (graph state)

**Common Patterns**:
- `store/` directory for Zustand stores
- Middleware: `devtools`, `persist`, `temporal` (undo/redo)
- Selector-based subscriptions for performance
- Actions defined in same file as state

---

## When to Use Each Pattern

### Decision Matrix

| Use Case | Pattern | Reason |
|----------|---------|--------|
| Fetch list of items from API | TanStack Query | Automatic caching, refetching |
| Canvas/graph editing | Zustand | Client state, undo/redo support |
| Complex nested form state | Zustand | Simpler than Flux, flexible |
| Real-time data (polling) | TanStack Query | Built-in refetch intervals |
| Legacy module (not migrating yet) | Flux | Keep existing pattern |
| Global app settings | Zustand + persist | Simple, persisted to localStorage |
| Optimistic mutations | TanStack Query | Built-in rollback support |
| Undo/redo functionality | Zustand + temporal | Middleware support |

### Migration Guidelines

**Flux → TanStack Query** (for API data):
```typescript
// Before (Flux)
class MyStore extends Store {
  _data = Immutable.Map();

  handleAction(action) {
    if (action.type === 'LOAD_DATA') {
      this._data = Immutable.fromJS(action.payload);
      this.emitChange();
    }
  }
}

// After (TanStack Query)
function useMyData() {
  return useQuery({
    queryKey: ['myData'],
    queryFn: api.loadData
  });
}
```

**Flux → Zustand** (for client state):
```typescript
// Before (Flux)
class UIStore extends Store {
  _isOpen = false;

  handleAction(action) {
    if (action.type === 'TOGGLE_MODAL') {
      this._isOpen = !this._isOpen;
      this.emitChange();
    }
  }
}

// After (Zustand)
const useUIStore = create((set) => ({
  isOpen: false,
  toggleModal: () => set((state) => ({ isOpen: !state.isOpen }))
}));
```

---

## Performance Considerations

### TanStack Query Optimizations

**1. Query Key Structure**:
```typescript
// Good: Hierarchical keys
['flows', flowId, 'jobs', { status: 'running' }]

// Bad: Flat keys
['flowsJobsRunning']
```

**2. Stale Time Configuration**:
```typescript
// Frequently changing data
staleTime: 30_000 // 30 seconds

// Rarely changing data
staleTime: 5 * 60_000 // 5 minutes
```

**3. Selective Invalidation**:
```typescript
// Invalidate specific query
queryClient.invalidateQueries({ queryKey: ['flows', flowId] });

// Invalidate all flows queries
queryClient.invalidateQueries({ queryKey: ['flows'] });
```

### Zustand Optimizations

**1. Selector-based Subscriptions**:
```typescript
// Good: Only re-renders when nodes change
const nodes = useBuilderStore(state => state.nodes);

// Bad: Re-renders on ANY state change
const store = useBuilderStore();
```

**2. Shallow Equality**:
```typescript
import { shallow } from 'zustand/shallow';

// Compare array by reference
const [nodes, edges] = useBuilderStore(
  state => [state.nodes, state.edges],
  shallow
);
```

---

## Cross-References

**Architecture**: `docs/01-overview/architecture-overview.md`

**Technology Stack**: `docs/01-overview/technology-stack.md`

**Module Examples**:
- Flux: `docs/02-modules/storage.md`, `docs/02-modules/flows.md`
- TanStack Query: `docs/02-modules/trash.md`
- Zustand: `docs/02-modules/flows-v2.md`, `docs/02-modules/ai.md`

**Modernization Plan**: `docs/MODERNIZATION_ASSESSMENT.md`

---

## Summary

The Keboola UI uses **three state management patterns**:

1. **Flux + Immutable.js** (40%) - Legacy pattern being phased out
   - Verbose but predictable
   - Used in older modules
   - Migration to TanStack Query in progress

2. **TanStack Query** (30%) - Modern server state
   - Automatic caching and refetching
   - Ideal for API data
   - Reference: `trash` module

3. **Zustand** (30%) - Modern client state
   - Simple API, minimal boilerplate
   - Perfect for canvas/AI state
   - Built-in undo/redo support

**Migration Strategy**:
- API data: Flux → TanStack Query
- Client state: Flux → Zustand
- New features: TanStack Query + Zustand (no Flux)

---

**Last Updated**: 2025-10-19 (Phase 4)
**Analysis Source**: Phase 2 code review (71 files, 49 modules)
**Related Documents**:
- `docs/01-overview/architecture-overview.md`
- `docs/MODERNIZATION_ASSESSMENT.md`
