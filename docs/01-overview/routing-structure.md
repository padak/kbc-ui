# Routing Structure

## Introduction

The Keboola UI uses React Router 7 for client-side navigation with a hierarchical route structure. This document explains URL patterns, routing configuration, dynamic routing, and provides examples from actual modules documented in Phase 2 and Phase 3.

**Router Version**: React Router 7.5.2
**Pattern**: Nested routes with lazy loading
**Base Path**: `/admin/projects/{projectId}/`

---

## URL Pattern Structure

### Base URL Format

```
https://connection.{region}.keboola.com/admin/projects/{projectId}/{module}/{...params}

Examples:
https://connection.eu-central-1.keboola.com/admin/projects/33/dashboard
https://connection.eu-central-1.keboola.com/admin/projects/33/flows-v2
https://connection.eu-central-1.keboola.com/admin/projects/33/storage/in.c-geo/table/locations
```

### URL Hierarchy

```
/admin/projects/{projectId}/
    │
    ├─ dashboard                          # Home dashboard
    ├─ flows-v2                           # Flow list
    │   └─ {configId}                     # Flow detail
    │       └─ {tab}?                     # Optional tab (builder, runs, etc.)
    ├─ storage                            # Storage explorer
    │   ├─ {bucketId}                     # Bucket detail
    │   │   └─ table/{tableId}            # Table detail
    │   │       └─ {tab}?                 # Optional tab (schema, data, etc.)
    │   ├─ files                          # File management
    │   ├─ jobs                           # Storage jobs
    │   └─ events                         # Storage events
    ├─ transformations-v2                 # Transformations list
    │   └─ {configId}                     # Transformation detail
    │       └─ {tab}?                     # Optional tab
    ├─ components                         # Components catalog
    │   └─ {componentId}                  # Component detail
    │       └─ {configId}?                # Optional config
    ├─ workspaces                         # Workspaces list
    ├─ jobs                               # Job queue
    ├─ settings                           # Project settings
    └─ ... (other modules)
```

---

## React Router Configuration

### Route Definition Structure

Routes are defined using a nested structure with the following properties:

```typescript
export type RouteType = {
  path?: string;                        // URL path segment
  name: string;                         // Unique route identifier
  title: string | ((state) => string);  // Page title
  titleHandler?: () => JSX.Element;     // Custom title component
  lazy: () => Promise<{ Component }>;   // Code-split component
  headerButtonsHandler?: Component;     // Header buttons
  breadcrumbHandler?: Function;         // Breadcrumb logic
  requireData?: (() => any)[];          // Data loaders
  poll?: { skipFirst: boolean; action };// Polling config
  childRoutes?: RouteType[];            // Nested routes
};
```

### Root Router Setup

**File**: `apps/kbc-ui/src/scripts/utils/router/createReactRouterRoutes.tsx`

```typescript
import { Route } from 'react-router';
import { createReactRouterRoutes } from '@/utils/router/createReactRouterRoutes';

// Root route structure
const rootRoute = {
  path: 'admin/projects/:projectId',
  name: 'app',
  title: 'Keboola Connection',
  lazy: async () => {
    const App = await import('@/react/layout/App');
    return { Component: App.default };
  },
  childRoutes: [
    homeRoutes,          // Dashboard
    flowsV2Routes,       // Modern flows
    storageRoutes,       // Storage
    transformationsRoutes,
    workspacesRoutes,
    componentsRoutes,
    settingsRoutes,
    // ... other module routes
  ]
};

// Convert to React Router routes
export const routes = createReactRouterRoutes(rootRoute);
```

### Route Rendering

```typescript
<Route Component={App} errorElement={<ErrorPage />}>
  <Route index loader={redirectLoader(rootRoute.path)} />
  <Route path={rootRoute.path} lazy={rootRoute.lazy} loader={getLoader(rootRoute)} />

  {/* Child routes rendered recursively */}
  {rootRoute.childRoutes?.map((route) => composeRoutes(route))}

  {/* 404 fallback */}
  <Route path="*" element={<ErrorPage title="Page not found" />} />
</Route>
```

---

## Route Examples from Modules

### 1. Dashboard (Simple Route)

**URL**: `/admin/projects/{projectId}/dashboard`

**Route Definition** (`apps/kbc-ui/src/scripts/modules/home/routes.ts`):

```typescript
const homeRoutes = {
  name: 'home',
  path: 'dashboard',
  title: 'Dashboard',
  lazy: async () => {
    const Home = await import('./Home');
    return { Component: Home.default };
  },
  headerButtonsHandler: HomeHeader,
  requireData: [
    () => loadDashboardData(),
    () => loadProjectUsers(),
    () => loadRecentActivity()
  ]
};
```

**From Phase 3 Workflow**: See `docs/05-workflows/01-dashboard-navigation.md`

---

### 2. Flows (Nested with Tabs)

**URLs**:
- List: `/admin/projects/{projectId}/flows-v2`
- Detail: `/admin/projects/{projectId}/flows-v2/{configId}`
- Tab: `/admin/projects/{projectId}/flows-v2/{configId}/builder`

**Route Definition** (`apps/kbc-ui/src/scripts/modules/flows-v2/routes.tsx`):

```typescript
const flowsV2Routes = {
  name: 'flows-v2',
  title: () => ComponentsStore.getComponent(KEBOOLA_FLOW).get('name'),
  lazy: async () => {
    const Index = await import('./Index');
    return { Component: Index.default };
  },
  headerButtonsHandler: IndexHeader,
  requireData: [
    (params) => {
      if (params.config) {
        return Promise.resolve(); // Skip for detail pages
      }
      return Promise.all([
        loadAll(),
        loadNotifications(),
        loadComponentsMetadata(KEBOOLA_FLOW)
      ]);
    }
  ],
  childRoutes: [
    {
      name: 'flows-v2-detail',
      path: ':config/:tab?',  // :config required, :tab optional
      title: genericComponentTitle(KEBOOLA_FLOW),
      breadcrumbHandler: folderBreadcrumbHandler,
      lazy: async () => {
        const Detail = await import('./Detail');
        return { Component: Detail.default };
      },
      headerButtonsHandler: DetailHeader,
      requireData: [
        (params) => {
          // Load different data based on active tab
          if (params.tab === 'notifications') {
            return loadNotifications();
          }
          if (params.tab === 'all-runs') {
            return loadComponentJobs(KEBOOLA_FLOW, params.config);
          }
          if (params.tab === 'versions') {
            return loadVersions(KEBOOLA_FLOW, params.config);
          }

          // Default: load flow configuration
          return loadFlow(params.config);
        }
      ]
    }
  ]
};
```

**Tab Constants** (`constants.ts`):

```typescript
export const tabs = {
  BUILDER: 'builder',
  ALL_RUNS: 'all-runs',
  SCHEDULES: 'schedules',
  NOTIFICATIONS: 'notifications',
  VERSIONS: 'versions'
} as const;

// Usage in navigation
<Link to={createUrl('flows-v2-detail', { config: flowId }, { tab: tabs.BUILDER })}>
  Builder
</Link>
```

**From Phase 3 Workflow**: See `docs/05-workflows/03-flow-creation-execution.md`

---

### 3. Storage (Deep Nesting)

**URLs**:
- List: `/admin/projects/{projectId}/storage`
- Bucket: `/admin/projects/{projectId}/storage/{bucketId}`
- Table: `/admin/projects/{projectId}/storage/{bucketId}/table/{tableId}`
- Table Tab: `/admin/projects/{projectId}/storage/{bucketId}/table/{tableId}/schema`

**Route Definition** (`apps/kbc-ui/src/scripts/modules/storage/routes.tsx`):

```typescript
export const storageRoutes = {
  name: 'storage',
  title: 'Storage',
  headerButtonsHandler: HeaderButtons,
  lazy: async () => {
    const Index = await import('./Index');
    return { Component: Index.default };
  },
  requireData: [
    () => tokenVerify(),
    () => StorageActionCreators.loadBucketsAndTables()
  ],
  childRoutes: [
    {
      name: 'storage-jobs',
      path: 'jobs',
      title: 'Storage',
      breadcrumbHandler: DummyBreadcrumb,
      lazy: async () => {
        const Jobs = await import('./Jobs');
        return { Component: Jobs.default };
      },
      poll: {
        skipFirst: true,
        action: () => loadJobs()
      },
      requireData: [
        (_, query) => {
          if (query.jobId) {
            return loadJob(query.jobId);
          }
          loadJobs(); // Fire and forget
        }
      ]
    },
    {
      name: 'storage-events',
      path: 'events',
      title: 'Storage',
      lazy: async () => {
        const Events = await import('./Events');
        return { Component: Events.default };
      }
    },
    {
      name: 'storage-bucket',
      path: ':bucketId/:tab?',
      title: (routerState) => routerState.params.bucketId,
      titleHandler: BucketTitle,
      breadcrumbHandler: (breadcrumbs, params) => {
        return [...breadcrumbs, <BucketLabelsFromStore bucketId={params.bucketId} />];
      },
      lazy: async () => {
        const Bucket = await import('./Bucket');
        return { Component: Bucket.default };
      },
      headerButtonsHandler: CreateTableButton,
      requireData: [
        (params) => loadBucketDetail(params.bucketId)
      ],
      childRoutes: [
        {
          name: 'storage-table',
          path: 'table/:tableId/:tab?',
          title: (routerState) => routerState.params.tableId,
          titleHandler: TableTitle,
          breadcrumbHandler: (breadcrumbs, params) => {
            return [...breadcrumbs, <TableRouteLabels tableId={params.tableId} />];
          },
          lazy: async () => {
            const Table = await import('./Table');
            return { Component: Table.default };
          },
          requireData: [
            (params) => {
              // Load different data based on tab
              if (params.tab === 'schema') {
                return loadTableSchema(params.tableId);
              }
              if (params.tab === 'data-sample') {
                return loadTableDataSample(params.tableId);
              }
              return loadTableDetail(params.tableId);
            }
          ]
        }
      ]
    }
  ]
};
```

**Storage Tab Constants**:

```typescript
export const tableTabs = {
  OVERVIEW: 'overview',
  SCHEMA: 'schema',
  DATA_SAMPLE: 'data-sample',
  EVENTS: 'events',
  SNAPSHOTS: 'snapshots',
  USAGE: 'usage'
} as const;

export const bucketTabs = {
  OVERVIEW: 'overview',
  EVENTS: 'events'
} as const;
```

**From Phase 3 Workflow**: See `docs/05-workflows/02-storage-operations.md`

---

### 4. Transformations (Component-Based)

**URLs**:
- List: `/admin/projects/{projectId}/transformations-v2`
- Detail: `/admin/projects/{projectId}/transformations-v2/{configId}`
- Tab: `/admin/projects/{projectId}/transformations-v2/{configId}/code`

**Route Definition** (`apps/kbc-ui/src/scripts/modules/transformations-v2/routes.tsx`):

```typescript
const transformationsRoutes = {
  name: 'transformations-v2',
  title: 'Transformations',
  lazy: async () => {
    const Index = await import('./Index');
    return { Component: Index.default };
  },
  headerButtonsHandler: IndexHeader,
  requireData: [
    () => loadTransformations(),
    () => loadStorageBuckets()
  ],
  childRoutes: [
    {
      name: 'transformations-v2-detail',
      path: ':config/:tab?',
      title: genericComponentTitle(KEBOOLA_TRANSFORMATION),
      breadcrumbHandler: folderBreadcrumbHandler,
      lazy: async () => {
        const Detail = await import('./Detail');
        return { Component: Detail.default };
      },
      headerButtonsHandler: DetailHeader,
      requireData: [
        (params) => {
          if (params.tab === 'notifications') {
            return loadNotifications();
          }
          if (params.tab === 'versions') {
            return loadVersions(KEBOOLA_TRANSFORMATION, params.config);
          }
          return loadTransformation(params.config);
        }
      ]
    }
  ]
};
```

**From Phase 3 Workflow**: See `docs/05-workflows/04-transformation-workflow.md`

---

## Dynamic Routing Patterns

### 1. URL Parameters

**Path Parameters** (`:param`):
```typescript
// Route definition
path: ':config/:tab?'

// Accessing in component
import { useParams } from 'react-router';

const Detail = () => {
  const { config, tab } = useParams<{ config: string; tab?: string }>();
  // config: "123"
  // tab: "builder" or undefined
};
```

**Query Parameters** (`?key=value`):
```typescript
// URL: /storage?search=customers&shared=true

import { useLocation } from 'react-router';
import qs from 'qs';

const Index = () => {
  const location = useLocation();
  const query = qs.parse(location.search, { ignoreQueryPrefix: true });

  const search = query.search; // "customers"
  const shared = query.shared === 'true'; // true
};
```

### 2. Programmatic Navigation

**Using `createUrl` helper**:
```typescript
import { createUrl } from '@/utils/router/createUrl';
import { useNavigate } from 'react-router';

const Component = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to flow detail
    const url = createUrl(
      'flows-v2-detail',
      { config: '123' },
      { tab: 'builder' }
    );
    navigate(url);
    // Result: /admin/projects/33/flows-v2/123?tab=builder
  };
};
```

**Using `Link` component**:
```typescript
import { Link } from 'react-router';
import { createUrl } from '@/utils/router/createUrl';

<Link to={createUrl('storage-table', {
  bucketId: 'in.c-geo',
  tableId: 'locations'
}, { tab: 'schema' })}>
  View Schema
</Link>
```

### 3. Route Guards & Permissions

**Feature Flag Checks**:
```typescript
const getDisabledRoutes = (): string[] => {
  let disabledRoutes: string[] = DevBranchesStore.isDevModeActive()
    ? routesDisabledInBranch
    : routesDisabledInProduction;

  if (ApplicationStore.isDemoPreview()) {
    disabledRoutes = disabledRoutes.concat(routesDisabledInDemoPreview);
  }

  if (ApplicationStore.hasProtectedDefaultBranch()) {
    disabledRoutes = disabledRoutes.concat(routesDisabledInSox);
  }

  return [...new Set(disabledRoutes)];
};
```

**Disabled Routes** (`routes.ts`):
```typescript
export const routesDisabledInBranch = [
  'settings-billing',
  'settings-trash',
  'data-apps'
];

export const routesDisabledInProduction = [
  'settings-dev-branch-new',
  'settings-dev-branch-detail'
];

export const routesDisabledInSox = [
  'transformations-sandbox',
  'workspaces'
];
```

---

## Data Loading & Code Splitting

### Lazy Loading Components

All routes use lazy loading for code splitting:

```typescript
lazy: async () => {
  // Dynamic import (Webpack/Rspack creates separate chunk)
  const Module = await import('./Index');
  return { Component: Module.default };
}
```

**Result**: Each module becomes a separate JavaScript chunk:
```
dist/
├── main.js                  # Core app
├── vendor.js                # Dependencies
├── flows-v2.chunk.js       # Flows module (loaded on demand)
├── storage.chunk.js        # Storage module (loaded on demand)
└── transformations.chunk.js # Transformations module
```

### Data Preloading with `requireData`

Routes can specify data to load before rendering:

```typescript
requireData: [
  // Simple loader
  () => loadBuckets(),

  // Conditional loader based on params
  (params) => {
    if (params.config) {
      return loadConfig(params.config);
    }
  },

  // Loader with query params
  (params, query) => {
    if (query.jobId) {
      return loadJob(query.jobId);
    }
  }
]
```

**Execution**:
1. User navigates to route
2. Router executes all `requireData` functions
3. Waits for all promises to resolve
4. Renders component with data available

### Polling for Real-Time Updates

```typescript
poll: {
  skipFirst: true,        // Don't poll immediately
  action: () => loadJobs() // Function to call on interval
}
```

**Usage**: Job monitoring, flow execution status, etc.

---

## Breadcrumb Navigation

### Breadcrumb Handler Pattern

```typescript
breadcrumbHandler: ({ breadcrumbs, params }) => {
  // breadcrumbs: Array of previous breadcrumb elements
  // params: Route parameters

  return [
    ...breadcrumbs,
    <BucketLabelsFromStore bucketId={params.bucketId} />
  ];
}
```

### Example: Storage Breadcrumb Trail

**URL**: `/admin/projects/33/storage/in.c-geo/table/locations`

**Breadcrumbs**:
```
Storage > in.c-geo > locations
```

**Generated by**:
```typescript
// Root storage route
breadcrumbs = ['Storage']

// Bucket route adds bucket name
breadcrumbs = ['Storage', 'in.c-geo']

// Table route adds table name
breadcrumbs = ['Storage', 'in.c-geo', 'locations']
```

### Folder-Based Breadcrumbs

For components with folders (flows, transformations):

```typescript
import folderBreadcrumbHandler from '@/utils/folderBreadcrumbHandler';

breadcrumbHandler: ({ breadcrumbs, params }) => {
  return folderBreadcrumbHandler(
    breadcrumbs,
    KEBOOLA_FLOW,      // Component ID
    params.config,     // Config ID
    routeNames.ROOT    // Root route name
  );
}
```

**Result**:
```
Flows > Marketing > Daily Reports > config-name
```

---

## Route Configuration Examples

### Complete Module Route Structure

**Example**: Workspaces module

```typescript
const workspacesRoutes = {
  name: 'workspaces',
  title: 'Workspaces',
  lazy: async () => import('./Index'),
  headerButtonsHandler: WorkspacesHeader,
  requireData: [
    () => loadWorkspaces(),
    () => loadCredentials()
  ],
  childRoutes: [
    {
      name: 'workspaces-detail',
      path: ':workspaceId/:tab?',
      title: (state) => state.params.workspaceId,
      titleHandler: WorkspaceTitle,
      breadcrumbHandler: workspaceBreadcrumbs,
      lazy: async () => import('./Detail'),
      headerButtonsHandler: WorkspaceDetailHeader,
      requireData: [
        (params) => loadWorkspace(params.workspaceId),
        (params) => {
          if (params.tab === 'jobs') {
            return loadWorkspaceJobs(params.workspaceId);
          }
        }
      ],
      poll: {
        skipFirst: true,
        action: (params) => refreshWorkspaceStatus(params.workspaceId)
      }
    }
  ]
};
```

---

## URL State Management

### Syncing UI State with URL

**Search in URL** (Storage example):
```typescript
import { useNavigate, useLocation } from 'react-router';
import qs from 'qs';

const StorageIndex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = qs.parse(location.search, { ignoreQueryPrefix: true });

  const handleSearchChange = (search: string) => {
    const newQuery = { ...query, search };
    navigate({
      pathname: location.pathname,
      search: qs.stringify(newQuery)
    });
  };

  return (
    <SearchInput
      value={query.search || ''}
      onChange={handleSearchChange}
    />
  );
};
```

**Benefits**:
- Shareable URLs (copy/paste preserves state)
- Browser back/forward works
- Bookmark-able filtered views

### Filter State in URL

**Example**: Storage filters

```
/storage?search=customers&shared=true&entityType=table
```

```typescript
const filters = {
  search: query.search || '',
  shared: query.shared === 'true',
  entityType: query.entityType || null
};
```

---

## Route Organization by Module

### Route File Locations

Each module defines its routes in `routes.tsx`:

```
apps/kbc-ui/src/scripts/modules/
├── home/routes.ts
├── flows-v2/routes.tsx
├── storage/routes.tsx
├── transformations-v2/routes.tsx
├── workspaces/routes.tsx
├── components/routes.tsx
├── settings/routes.tsx
└── ... (other modules)
```

### Centralized Route Registry

All module routes imported into main routes file:

**File**: `apps/kbc-ui/src/scripts/routes.tsx`

```typescript
import { homeRoutes } from '@/modules/home/routes';
import { flowsV2Routes } from '@/modules/flows-v2/routes';
import { storageRoutes } from '@/modules/storage/routes';
import { transformationsRoutes } from '@/modules/transformations-v2/routes';
// ... other imports

export const rootRoute = {
  path: 'admin/projects/:projectId',
  name: 'app',
  title: 'Keboola Connection',
  lazy: async () => import('@/react/layout/App'),
  childRoutes: [
    homeRoutes,
    flowsV2Routes,
    storageRoutes,
    transformationsRoutes,
    workspacesRoutes,
    componentsRoutes,
    settingsRoutes,
    billingRoutes,
    trashRoutes,
    // ... other routes
  ]
};
```

---

## Redirects & Legacy Routes

### Redirect Patterns

**Old URL to new URL**:
```typescript
<Route
  path="old-path/:param"
  loader={({ params }) =>
    replace(createUrl('new-route', params))
  }
/>
```

**Example**: Storage legacy redirects

```typescript
export const getStorageRedirects = (): ReactElement[] => [
  // Old table URL → New table URL
  <Route
    key="storage-table-old"
    path="storage/tables/:tableId"
    loader={({ params }) => {
      const [bucketId, tableName] = params.tableId.split('.');
      return replace(createUrl('storage-table', {
        bucketId: `in.${bucketId}`,
        tableId: `${bucketId}.${tableName}`
      }));
    }}
  />,
  // ... other redirects
];
```

---

## Cross-References

**Architecture**: `docs/01-overview/architecture-overview.md`

**Workflow Examples**:
- Dashboard: `docs/05-workflows/01-dashboard-navigation.md`
- Storage: `docs/05-workflows/02-storage-operations.md`
- Flows: `docs/05-workflows/03-flow-creation-execution.md`
- Transformations: `docs/05-workflows/04-transformation-workflow.md`

**Module Documentation**: `docs/02-modules/` (49 module files)

**State Management**: `docs/01-overview/state-management-patterns.md`

---

## Summary

The Keboola UI routing system features:

1. **Hierarchical Structure**: Nested routes matching UI hierarchy
2. **Lazy Loading**: Code splitting for optimal performance
3. **Data Preloading**: `requireData` ensures data availability
4. **URL State**: Search, filters, tabs persist in URL
5. **Type Safety**: TypeScript route parameters
6. **Breadcrumbs**: Automatic hierarchical navigation
7. **Guards**: Feature flags and permission-based routing
8. **Redirects**: Legacy URL support

**Key Patterns**:
- Module routes in `module/routes.tsx`
- Centralized in `routes.tsx`
- Lazy component loading
- Conditional data loading
- URL-based state management

**Common Routes**:
- List view: `/module`
- Detail view: `/module/:id`
- Tabbed detail: `/module/:id/:tab?`
- Nested resource: `/module/:parentId/child/:childId`

---

**Last Updated**: 2025-10-19 (Phase 4)
**React Router Version**: 7.5.2
**Related Documents**:
- `docs/01-overview/architecture-overview.md`
- `docs/05-workflows/` (4 workflow documents)
- `docs/02-modules/` (49 module documents)
