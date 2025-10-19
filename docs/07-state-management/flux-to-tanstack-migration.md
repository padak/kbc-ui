# Flux to TanStack Query Migration Guide

## Overview

This guide provides a step-by-step migration path from the legacy Flux architecture with Immutable.js to modern TanStack Query for server state management in the Keboola UI. The goal is to improve performance, developer experience, and maintainability while preserving existing functionality.

## Current State

**Legacy Pattern (40% of codebase):**
- Flux architecture with Dispatcher
- Immutable.js for data structures (Map/List)
- Manual cache invalidation
- Class-based stores with change events
- Mixed client and server state

**Target Pattern (Modern):**
- TanStack Query for server state
- Native JavaScript objects/arrays
- Automatic background refetching
- React hooks for data access
- Clear separation of server vs client state

## Why Migrate?

### Performance Issues with Legacy Pattern

1. **Immutable.js Overhead**:
   - Large bundle size (~60KB)
   - Performance overhead for deep equality checks
   - Memory overhead from persistent data structures
   - Verbose API (`.get()`, `.getIn()`, `.set()`, `.setIn()`)

2. **Manual Cache Management**:
   - No automatic background refetching
   - Manual invalidation logic scattered across codebase
   - Race conditions from concurrent requests
   - Stale data issues

3. **Coupling Issues**:
   - Tight coupling between stores
   - Difficult to test in isolation
   - Global state pollution
   - Hard to track data dependencies

### Benefits of TanStack Query

1. **Automatic Caching**:
   - Built-in cache with configurable TTL
   - Background refetching and revalidation
   - Optimistic updates
   - Automatic garbage collection

2. **Better DX**:
   - Simple hooks API (`useQuery`, `useMutation`)
   - DevTools for debugging
   - TypeScript support
   - Less boilerplate

3. **Performance**:
   - Smaller bundle size
   - Native JavaScript performance
   - Request deduplication
   - Parallel queries

## Migration Strategy

### Phase 1: Identify Module for Migration

**Priority Order:**
1. High-traffic, simple modules (e.g., trash, notifications)
2. Modules with performance issues (e.g., storage tables)
3. Complex modules with many dependencies (e.g., flows)

**Assessment Criteria:**
- Number of API calls
- Complexity of store logic
- Number of dependent modules
- User traffic and usage

### Phase 2: Analyze Current Implementation

For each module, document:
- All Flux stores used
- All API endpoints called
- Data transformation logic
- Cache invalidation triggers
- Dependencies on other stores

**Example Analysis (Storage Module):**

```typescript
// Current Flux Stores
- StorageBucketsStore (buckets data)
- StorageTablesStore (tables data)
- StorageFilesStore (files data)

// API Endpoints
GET /v2/storage/buckets
GET /v2/storage/tables/{id}
POST /v2/storage/tables/{id}/export
DELETE /v2/storage/tables/{id}

// Dependencies
- ComponentsStore (component metadata)
- DevBranchesStore (branch context)
- ApplicationStore (permissions)
```

### Phase 3: Create Query Key Structure

Organize query keys hierarchically:

```typescript
// constants/queryKeys.ts

export const storageApiKey = {
  all: () => ['storage'] as const,

  buckets: {
    all: () => [...storageApiKey.all(), 'buckets'] as const,
    list: () => [...storageApiKey.buckets.all(), 'list'] as const,
    detail: (bucketId: string) =>
      [...storageApiKey.buckets.all(), 'detail', bucketId] as const,
  },

  tables: {
    all: () => [...storageApiKey.all(), 'tables'] as const,
    list: () => [...storageApiKey.tables.all(), 'list'] as const,
    detail: (tableId: string) =>
      [...storageApiKey.tables.all(), 'detail', tableId] as const,
    snapshots: (tableId: string) =>
      [...storageApiKey.tables.all(), 'snapshots', tableId] as const,
  },
};
```

### Phase 4: Implement Query Hooks

Create dedicated hooks for each data fetching operation:

```typescript
// rqHooks/useBuckets.ts

import { useQuery } from '@tanstack/react-query';
import { storageApiKey } from '@/constants/queryKeys';
import { storageApi } from '@/modules/storage/api';

export const useBuckets = () => {
  return useQuery({
    queryKey: storageApiKey.buckets.list(),
    queryFn: () => storageApi.listBuckets(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes (formerly cacheTime)
  });
};

export const useBucket = (bucketId: string) => {
  return useQuery({
    queryKey: storageApiKey.buckets.detail(bucketId),
    queryFn: () => storageApi.getBucket(bucketId),
    enabled: !!bucketId, // Only fetch if bucketId exists
    staleTime: 5 * 60 * 1000,
  });
};
```

### Phase 5: Implement Mutation Hooks

Create hooks for data modification operations:

```typescript
// rqHooks/useDeleteTable.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { storageApiKey } from '@/constants/queryKeys';
import { storageApi } from '@/modules/storage/api';
import { showNotification } from '@/utils/notifications';

export const useDeleteTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tableId: string) => storageApi.deleteTable(tableId),

    onSuccess: (data, tableId) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({
        queryKey: storageApiKey.tables.list()
      });
      queryClient.invalidateQueries({
        queryKey: storageApiKey.buckets.all()
      });

      // Show success notification
      showNotification({
        type: 'success',
        message: 'Table deleted successfully',
      });
    },

    onError: (error) => {
      showNotification({
        type: 'error',
        message: `Failed to delete table: ${error.message}`,
      });
    },
  });
};
```

### Phase 6: Implement Optimistic Updates

For better UX, implement optimistic updates:

```typescript
// rqHooks/useUpdateTable.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { storageApiKey } from '@/constants/queryKeys';
import { storageApi } from '@/modules/storage/api';

export const useUpdateTable = (tableId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: TableUpdates) =>
      storageApi.updateTable(tableId, updates),

    // Optimistic update
    onMutate: async (updates) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: storageApiKey.tables.detail(tableId)
      });

      // Snapshot previous value
      const previousTable = queryClient.getQueryData(
        storageApiKey.tables.detail(tableId)
      );

      // Optimistically update cache
      queryClient.setQueryData(
        storageApiKey.tables.detail(tableId),
        (old) => ({ ...old, ...updates })
      );

      // Return context with snapshot
      return { previousTable };
    },

    // Rollback on error
    onError: (err, updates, context) => {
      queryClient.setQueryData(
        storageApiKey.tables.detail(tableId),
        context?.previousTable
      );
    },

    // Refetch on success or error
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: storageApiKey.tables.detail(tableId)
      });
    },
  });
};
```

### Phase 7: Update Components

Replace store usage with query hooks:

**Before (Flux + Immutable.js):**

```typescript
import { Map } from 'immutable';
import StorageTablesStore from '@/modules/components/stores/StorageTablesStore';
import useStores from '@/react/hooks/useStores';

const TableDetail = ({ tableId }) => {
  const state = useStores(
    () => ({
      table: StorageTablesStore.getTable(tableId, Map()),
      isDeleting: StorageTablesStore.getDeletingTables().has(tableId),
    }),
    [tableId],
    [StorageTablesStore]
  );

  const handleDelete = () => {
    StorageActionCreators.deleteTable(tableId)
      .then(() => {
        // Navigate away
      })
      .catch((error) => {
        // Handle error
      });
  };

  if (!state.table || state.table.isEmpty()) {
    return <Loader />;
  }

  return (
    <div>
      <h1>{state.table.get('name')}</h1>
      <p>{state.table.get('description')}</p>
      <Button
        onClick={handleDelete}
        disabled={state.isDeleting}
      >
        Delete
      </Button>
    </div>
  );
};
```

**After (TanStack Query):**

```typescript
import { useTable, useDeleteTable } from './rqHooks';

const TableDetail = ({ tableId }) => {
  const { data: table, isLoading, isError } = useTable(tableId);
  const deleteMutation = useDeleteTable();

  const handleDelete = () => {
    deleteMutation.mutate(tableId, {
      onSuccess: () => {
        // Navigate away
      },
    });
  };

  if (isLoading) return <Loader />;
  if (isError) return <Error />;
  if (!table) return null;

  return (
    <div>
      <h1>{table.name}</h1>
      <p>{table.description}</p>
      <Button
        onClick={handleDelete}
        disabled={deleteMutation.isPending}
      >
        Delete
      </Button>
    </div>
  );
};
```

### Phase 8: Remove Immutable.js

Convert data structures to native JavaScript:

**Before:**

```typescript
import { Map, List, fromJS } from 'immutable';

const table = Map({
  id: 'in.c-bucket.table',
  name: 'My Table',
  columns: List(['id', 'name', 'email']),
});

const name = table.get('name');
const columns = table.get('columns').toJS();
const updatedTable = table.set('name', 'New Name');
```

**After:**

```typescript
const table = {
  id: 'in.c-bucket.table',
  name: 'My Table',
  columns: ['id', 'name', 'email'],
};

const name = table.name;
const columns = table.columns;
const updatedTable = { ...table, name: 'New Name' };
```

### Phase 9: Remove Flux Store

Once all components migrated:

1. Remove store file
2. Remove action creators
3. Remove constants
4. Update tests
5. Remove from Dispatcher registration

### Phase 10: Testing

Update tests to use TanStack Query:

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBuckets } from './useBuckets';

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

describe('useBuckets', () => {
  it('should fetch buckets', async () => {
    const { result } = renderHook(() => useBuckets(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(3);
  });
});
```

## Module-by-Module Migration Strategy

### Priority 1: Simple Modules (Week 1-2)

**trash** (Already migrated - reference implementation)
- Single store
- Simple CRUD operations
- No complex dependencies
- Use as template

**notifications**
- Similar to trash
- CRUD + webhooks
- Good learning module

### Priority 2: Medium Complexity (Week 3-6)

**storage (tables)**
- Multiple stores
- Complex relationships
- High traffic
- Critical path

**storage (buckets)**
- Depends on tables
- Shared functionality
- Test migration patterns

### Priority 3: Complex Modules (Week 7-12)

**flows-v2**
- Keep Zustand for UI state
- Migrate Flux stores to TanStack Query
- Maintain canvas performance

**components**
- Central dependency
- Affects many modules
- Requires careful coordination

## Common Pitfalls and Solutions

### Pitfall 1: Over-fetching

**Problem:** Fetching too much data on every render

**Solution:** Use proper staleTime and gcTime

```typescript
useQuery({
  queryKey: ['heavy-data'],
  queryFn: fetchHeavyData,
  staleTime: 10 * 60 * 1000, // Consider fresh for 10 minutes
  gcTime: 30 * 60 * 1000,    // Keep in cache for 30 minutes
});
```

### Pitfall 2: Waterfall Requests

**Problem:** Sequential requests when parallel is possible

**Solution:** Use useQueries for parallel fetching

```typescript
import { useQueries } from '@tanstack/react-query';

const results = useQueries({
  queries: tableIds.map((id) => ({
    queryKey: storageApiKey.tables.detail(id),
    queryFn: () => fetchTable(id),
  })),
});
```

### Pitfall 3: Forgotten Invalidations

**Problem:** Cache not updated after mutations

**Solution:** Comprehensive invalidation strategy

```typescript
// Invalidate specific query
queryClient.invalidateQueries({
  queryKey: storageApiKey.tables.detail(tableId)
});

// Invalidate all tables
queryClient.invalidateQueries({
  queryKey: storageApiKey.tables.all()
});

// Invalidate with predicate
queryClient.invalidateQueries({
  predicate: (query) =>
    query.queryKey[0] === 'storage' &&
    query.state.data?.bucketId === bucketId
});
```

### Pitfall 4: Mixing Client and Server State

**Problem:** Storing UI state in TanStack Query

**Solution:** Use TanStack Query only for server state

```typescript
// BAD: UI state in query
const { data: isModalOpen } = useQuery(['modal-state']);

// GOOD: UI state in React state
const [isModalOpen, setIsModalOpen] = useState(false);

// GOOD: Server state in query
const { data: tables } = useQuery(['tables']);
```

### Pitfall 5: Immutable.js Mixing

**Problem:** Mixing Immutable.js with native objects

**Solution:** Convert all at once or use adapters

```typescript
// Adapter pattern during migration
const adaptImmutableToJS = (immutableData) => {
  if (Map.isMap(immutableData) || List.isList(immutableData)) {
    return immutableData.toJS();
  }
  return immutableData;
};
```

## Testing During Migration

### Parallel Implementation

Run both implementations side-by-side:

```typescript
const USE_NEW_IMPLEMENTATION = process.env.REACT_APP_USE_TANSTACK === 'true';

const TableList = () => {
  if (USE_NEW_IMPLEMENTATION) {
    return <TableListNew />;
  }
  return <TableListLegacy />;
};
```

### Feature Flags

Use feature flags for gradual rollout:

```typescript
const useFeatureFlag = (flag: string) => {
  return ApplicationStore.hasFeature(flag);
};

const TableList = () => {
  const useTanStackQuery = useFeatureFlag('tanstack-query-storage');

  if (useTanStackQuery) {
    return <TableListNew />;
  }
  return <TableListLegacy />;
};
```

### Comparison Testing

Compare outputs of old and new implementations:

```typescript
describe('Migration Validation', () => {
  it('should return same data structure', async () => {
    // Old implementation
    const oldData = StorageTablesStore.getTable(tableId).toJS();

    // New implementation
    const { result } = renderHook(() => useTable(tableId));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const newData = result.current.data;

    expect(newData).toEqual(oldData);
  });
});
```

## Performance Optimization

### 1. Prefetching

Prefetch data before it's needed:

```typescript
const prefetchTable = (tableId: string) => {
  queryClient.prefetchQuery({
    queryKey: storageApiKey.tables.detail(tableId),
    queryFn: () => fetchTable(tableId),
  });
};

// Prefetch on hover
<Link
  to={`/table/${tableId}`}
  onMouseEnter={() => prefetchTable(tableId)}
>
  View Table
</Link>
```

### 2. Structural Sharing

TanStack Query automatically shares unchanged data:

```typescript
// Automatically optimized - only changed parts re-render
const { data: tables } = useQuery({
  queryKey: ['tables'],
  queryFn: fetchTables,
  // No need for manual memoization
});
```

### 3. Selective Subscriptions

Subscribe only to needed data:

```typescript
// Select specific fields
const { data: tableName } = useQuery({
  queryKey: storageApiKey.tables.detail(tableId),
  queryFn: () => fetchTable(tableId),
  select: (data) => data.name, // Only re-render when name changes
});
```

### 4. Infinite Queries

For paginated data:

```typescript
const useTablesInfinite = (bucketId: string) => {
  return useInfiniteQuery({
    queryKey: storageApiKey.tables.list(),
    queryFn: ({ pageParam = 0 }) =>
      fetchTables(bucketId, { offset: pageParam, limit: 50 }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length * 50 : undefined,
  });
};
```

## Monitoring and Debugging

### React Query DevTools

Add DevTools to your app:

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Query Invalidation Tracking

Log invalidations in development:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Log when queries become stale
      onSettled: (data, error, query) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('[Query Settled]', query.queryKey);
        }
      },
    },
  },
});
```

### Performance Monitoring

Track query performance:

```typescript
queryClient.setMutationDefaults(['update-table'], {
  onMutate: () => {
    const start = performance.now();
    return { start };
  },
  onSettled: (data, error, variables, context) => {
    const duration = performance.now() - context.start;
    console.log(`Mutation took ${duration}ms`);
  },
});
```

## Migration Checklist

### Pre-Migration
- [ ] Identify module for migration
- [ ] Document current Flux stores
- [ ] List all API endpoints
- [ ] Map data dependencies
- [ ] Create migration plan

### Implementation
- [ ] Create query key structure
- [ ] Implement query hooks
- [ ] Implement mutation hooks
- [ ] Add optimistic updates
- [ ] Update components
- [ ] Remove Immutable.js conversions
- [ ] Remove Flux store
- [ ] Remove action creators

### Testing
- [ ] Write unit tests for hooks
- [ ] Update component tests
- [ ] Integration testing
- [ ] Performance testing
- [ ] Comparison with legacy

### Deployment
- [ ] Feature flag implementation
- [ ] Gradual rollout (10%, 25%, 50%, 100%)
- [ ] Monitor error rates
- [ ] Monitor performance metrics
- [ ] Collect user feedback

### Cleanup
- [ ] Remove legacy code
- [ ] Remove feature flags
- [ ] Update documentation
- [ ] Remove Immutable.js (if no longer needed)
- [ ] Update build configuration

## Success Metrics

Track these metrics during migration:

1. **Bundle Size**: Should decrease (Immutable.js removal)
2. **Request Count**: Should decrease (better caching)
3. **Time to Interactive**: Should improve
4. **Error Rate**: Should remain stable or decrease
5. **Cache Hit Rate**: Should increase
6. **Developer Velocity**: Should improve over time

## References

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Migration from Redux to React Query](https://tkdodo.eu/blog/react-query-and-forms)
- [Effective React Query Keys](https://tkdodo.eu/blog/effective-react-query-keys)
- [React Query Error Handling](https://tkdodo.eu/blog/react-query-error-handling)
- [Practical React Query](https://tkdodo.eu/blog/practical-react-query)

## Real-World Example: Trash Module

See `/Users/padak/github/kbc-ui/apps/kbc-ui/src/scripts/modules/trash/` for a complete reference implementation of this migration pattern. The trash module successfully migrated from Flux to TanStack Query and serves as the template for future migrations.

**Key Files:**
- `rqHooks/useDeletedComponents.ts` - Query hook
- `rqHooks/useDeleteComponent.tsx` - Mutation hook
- `rqHooks/useRestoreConfiguration.ts` - Mutation with invalidation
- `react/pages/TrashIndex.tsx` - Component using hooks
