# Complexity Assessment - Keboola Connection UI Migration

**Version**: 1.0
**Date**: 2025-10-19
**Status**: Complete
**Purpose**: Assess technical complexity and effort for feature migration

---

## Table of Contents

1. [Overview](#overview)
2. [Complexity Scoring Model](#complexity-scoring-model)
3. [Feature Complexity Breakdown](#feature-complexity-breakdown)
4. [Dependencies & Blockers](#dependencies--blockers)
5. [Migration Challenges](#migration-challenges)
6. [Technical Debt Impact](#technical-debt-impact)
7. [Risk Assessment](#risk-assessment)
8. [Effort Estimation](#effort-estimation)

---

## Overview

This document assesses the technical complexity of migrating 121 features from the current Keboola UI to a new platform. Each feature is rated on multiple complexity dimensions with specific migration challenges identified.

**Assessment Scope**:
- 121 total features
- 49 documented modules
- 400+ React components
- Multiple state management patterns
- Complex dependencies

**Complexity Factors**:
- Code complexity (lines, logic, patterns)
- State management migration
- API integration complexity
- UI component complexity
- Dependency management
- Testing requirements

---

## Complexity Scoring Model

### T-Shirt Sizing

| Size | Effort | Complexity Score | Days | Developer Profile |
|------|--------|------------------|------|-------------------|
| **XS** | Trivial | 1 | 1-2 days | Junior |
| **S** | Simple | 2 | 3-5 days | Mid-level |
| **M** | Moderate | 3 | 1-2 weeks | Mid-level |
| **L** | Complex | 4 | 3-4 weeks | Senior |
| **XL** | Very Complex | 5 | 5-8 weeks | Senior/Architect |
| **XXL** | Extremely Complex | 6+ | 8+ weeks | Architect + Team |

### Complexity Dimensions (1-5 scale each)

1. **Code Complexity**: Lines of code, logic complexity, patterns
2. **State Migration**: Flux → TanStack Query/Zustand difficulty
3. **API Integration**: Number of endpoints, authentication, error handling
4. **UI Complexity**: Component count, interactions, canvas/graphs
5. **Dependencies**: External libs, shared modules, coupling

**Total Complexity Score** = Sum of dimensions (5-25)

**T-Shirt Size Mapping**:
- 5-7: XS
- 8-10: S
- 11-14: M
- 15-18: L
- 19-22: XL
- 23+: XXL

---

## Feature Complexity Breakdown

### Infrastructure & Core Features

#### Authentication & Login
**Size**: S (Simple)
**Effort**: 3-5 days
**Complexity Score**: 8

| Dimension | Score | Notes |
|-----------|-------|-------|
| Code Complexity | 2 | Standard auth flow |
| State Migration | 1 | Minimal state |
| API Integration | 2 | Login endpoint, token refresh |
| UI Complexity | 2 | Simple form |
| Dependencies | 1 | Standard auth libs |

**Challenges**:
- OAuth provider integration
- Token management
- Session persistence

**Dependencies**: None (foundation)
**Risk**: Low

---

#### API Client Integration
**Size**: M (Moderate)
**Effort**: 1-2 weeks
**Complexity Score**: 12

| Dimension | Score | Notes |
|-----------|-------|-------|
| Code Complexity | 3 | 14 API clients |
| State Migration | 2 | Middleware setup |
| API Integration | 3 | Multiple endpoints |
| UI Complexity | 1 | No UI |
| Dependencies | 3 | Core dependency |

**Challenges**:
- Migrate from custom API client to modern (Axios/Fetch + TanStack Query)
- Request/response middleware
- Error handling patterns
- Retry logic
- Authentication token injection

**Dependencies**: Authentication
**Risk**: Medium (core dependency)

**Migration Path**:
1. Create API client wrapper
2. Implement middleware (auth, error handling)
3. Setup TanStack Query integration
4. Migrate endpoint by endpoint

---

#### State Management Setup
**Size**: M (Moderate)
**Effort**: 1-2 weeks
**Complexity Score**: 13

| Dimension | Score | Notes |
|-----------|-------|-------|
| Code Complexity | 3 | Pattern definition |
| State Migration | 4 | Flux → TanStack Query |
| API Integration | 2 | Query/mutation setup |
| UI Complexity | 1 | No UI |
| Dependencies | 3 | Foundation for all |

**Challenges**:
- Define TanStack Query patterns
- Setup Zustand stores for UI state
- Implement optimistic updates
- Cache management strategy
- Query invalidation patterns

**Dependencies**: API Client
**Risk**: High (architectural decision)

**Recommended Stack**:
- TanStack Query for server state
- Zustand for UI state
- React Context for theme/user preferences
- immer for immutable updates (replace Immutable.js)

---

### Storage Features

#### Table & Bucket Browser
**Size**: L (Complex)
**Effort**: 3-4 weeks
**Complexity Score**: 17

| Dimension | Score | Notes |
|-----------|-------|-------|
| Code Complexity | 4 | 70+ components |
| State Migration | 4 | Complex Flux stores |
| API Integration | 3 | Storage API (many endpoints) |
| UI Complexity | 4 | Lists, sorting, filtering |
| Dependencies | 2 | Design system |

**Challenges**:
- 70+ React components to migrate
- Complex Flux store → TanStack Query
- Immutable.js → native JS
- Virtual scrolling for performance
- Real-time updates
- Breadcrumb navigation
- Multi-level sorting and filtering

**Current Architecture**:
```
storage/
├── StorageStore.js (Flux, 500+ lines)
├── BucketStore.js (Flux)
├── TableStore.js (Flux)
├── 70+ React components
└── Immutable.js throughout
```

**Target Architecture**:
```
storage/
├── api/
│   ├── useStorageQuery.ts (TanStack Query)
│   ├── useBucketsQuery.ts
│   └── useTablesQuery.ts
├── components/
│   ├── BucketBrowser.tsx
│   ├── TableBrowser.tsx
│   └── ... (70 components)
└── hooks/
    └── useStorageState.ts (Zustand for UI state)
```

**Migration Steps**:
1. Week 1: Setup TanStack Query hooks for Storage API
2. Week 2: Migrate bucket browser components
3. Week 3: Migrate table browser components
4. Week 4: Virtual scrolling, performance optimization

**Dependencies**: State Management, API Client, Design System
**Risk**: Medium (many components, but well-structured)

---

#### Data Preview & Sampling
**Size**: M (Moderate)
**Effort**: 1-2 weeks
**Complexity Score**: 12

| Dimension | Score | Notes |
|-----------|-------|-------|
| Code Complexity | 3 | Data grid, filters |
| State Migration | 2 | Simpler than browser |
| API Integration | 2 | Preview endpoint |
| UI Complexity | 3 | Interactive data grid |
| Dependencies | 2 | Table browser |

**Challenges**:
- Virtual scrolling for 1000+ rows
- Column filtering and search
- CSV export
- Loading states

**Recommended Library**: TanStack Table or AG Grid
**Dependencies**: Table Browser
**Risk**: Low

---

### Extractor Features

#### Database Extractor (Generic)
**Size**: XL (Very Complex)
**Effort**: 5-6 weeks
**Complexity Score**: 21

| Dimension | Score | Notes |
|-----------|-------|-------|
| Code Complexity | 5 | 15+ databases, provisioning |
| State Migration | 4 | Complex Flux + Immutable |
| API Integration | 4 | Many DB-specific endpoints |
| UI Complexity | 4 | Multi-step wizard, credentials |
| Dependencies | 4 | OAuth, components, workspaces |

**Challenges**:
- 15+ database types with different configs
- Provisioning pattern (factory-based)
- Complex credential management
- SSH tunnel configuration
- Connection testing
- Table selection wizard
- Incremental loading setup

**Current Architecture**:
```
ex-db-generic/
├── react/
│   ├── pages/
│   │   ├── credentials/ (per-database)
│   │   ├── query-page/
│   │   └── index/
│   ├── components/ (50+)
│   └── provisioning/
├── adapters/ (configuration serialization)
├── constants.js (database mappings)
└── storeProvisioning.js (factory pattern)
```

**Migration Complexity Factors**:
1. **Provisioning Pattern**: Factory creates database-specific stores/components
2. **Credential Formats**: Each database has unique credential schema
3. **Feature Variations**: Some DBs support SSH, some don't; different query capabilities
4. **Type Mappings**: Database-specific type conversions
5. **Testing**: Must test connection for each database type

**Migration Strategy**:
1. Week 1-2: Core extractor framework (generic)
2. Week 3: Top 3 databases (MySQL, PostgreSQL, Snowflake)
3. Week 4: Next 5 databases (MSSQL, Redshift, BigQuery, Oracle, MariaDB)
4. Week 5: Remaining databases
5. Week 6: Testing, bug fixes

**Dependencies**: OAuth, Components, Workspaces
**Risk**: High (most complex extractor)

**Simplification Opportunities**:
- Replace provisioning with composition pattern
- Unified credential interface
- Shared UI components for common features
- Type-safe configuration with Zod or similar

---

#### Cloud Storage Extractors (S3, Azure, etc.)
**Size**: S-M (Simple to Moderate)
**Effort**: 1-2 weeks each
**Complexity Score**: 8-10

| Dimension | Score | Notes |
|-----------|-------|-------|
| Code Complexity | 2 | Adapter pattern, clean |
| State Migration | 2 | Minimal state |
| API Integration | 2 | Single component API |
| UI Complexity | 2 | Credentials + file selection |
| Dependencies | 2 | OAuth for some |

**Challenges**:
- OAuth flows (Google Drive, Dropbox, OneDrive)
- IAM credentials (AWS, Azure)
- File picker interfaces
- Wildcard file selection

**Pattern**: Adapter-based (simpler than provisioning)

**Dependencies**: OAuth (for Google/Microsoft), Components
**Risk**: Low

---

#### Generic API Extractor
**Size**: XXL (Extremely Complex)
**Effort**: 8-10 weeks
**Complexity Score**: 24

| Dimension | Score | Notes |
|-----------|-------|-------|
| Code Complexity | 5 | 40+ components |
| State Migration | 5 | Very complex state |
| API Integration | 5 | 7+ auth methods, chaining |
| UI Complexity | 5 | Advanced configuration UI |
| Dependencies | 4 | OAuth, many libs |

**Challenges**:
- 40+ React components
- 7+ authentication methods (OAuth 2.0, API Key, Basic, JWT, etc.)
- Request chaining and dependencies
- Advanced pagination strategies
- Response filtering and transformation
- JSONPath and template expressions
- Nested object configuration

**Current Architecture**:
```
ex-generic/
├── react/
│   ├── components/ (40+)
│   │   ├── ConfigurationForm/
│   │   ├── AuthenticationForm/
│   │   ├── PaginationForm/
│   │   ├── ResponseFilter/
│   │   └── ...
│   └── pages/
├── modules/ (auth, pagination, etc.)
└── templates/ (config templates)
```

**Migration Recommendation**:
- Consider building new from scratch with modern patterns
- Focus on most-used features first
- Simplify UI with better abstractions
- Use form libraries (React Hook Form + Zod)

**Dependencies**: OAuth, Components, many external libs
**Risk**: Very High (most complex feature overall)

**Alternative Approach**:
- Migrate basic features only (P0: API Key, Basic Auth, simple pagination)
- Advanced features in later phases (P2: OAuth 2.0 flows, request chaining, advanced filtering)

---

### Writer Features

#### Database Writer (Generic)
**Size**: XL (Very Complex)
**Effort**: 5-6 weeks
**Complexity Score**: 20

| Dimension | Score | Notes |
|-----------|-------|-------|
| Code Complexity | 5 | 18+ databases, Redux |
| State Migration | 5 | Redux → TanStack Query |
| API Integration | 4 | Many endpoints |
| UI Complexity | 4 | Table mapping, staging |
| Dependencies | 2 | Workspaces |

**Challenges**:
- 18+ database types
- Redux state management (complex)
- Database-specific type mapping
- Staging modes (S3, SCP, direct)
- Incremental/delete load modes
- SSL/TLS configuration
- SSH tunnel support

**Current Architecture**:
```
wr-db/
├── react/
│   └── pages/ (per-database)
├── actionCreators.js (Redux)
├── store.js (Redux)
├── mapping/ (database-specific)
└── templates/ (config templates)
```

**Migration Complexity**:
- Redux → TanStack Query (complex state)
- Maintain database-specific logic
- Type mapping for each database
- Staging configuration

**Migration Strategy**:
1. Week 1-2: Core writer framework
2. Week 3: Top 3 databases (Snowflake, PostgreSQL, MySQL)
3. Week 4: Next 5 databases (MSSQL, Redshift, BigQuery, Oracle, MariaDB)
4. Week 5: Remaining databases
5. Week 6: Testing, optimization

**Dependencies**: Workspaces
**Risk**: High (Redux migration, many databases)

---

#### Google BigQuery Writer (Advanced)
**Size**: M-L (Moderate to Complex)
**Effort**: 2-3 weeks
**Complexity Score**: 14

| Dimension | Score | Notes |
|-----------|-------|-------|
| Code Complexity | 3 | Advanced features |
| State Migration | 3 | Moderate state |
| API Integration | 3 | BigQuery API |
| UI Complexity | 3 | Clustering, partitioning |
| Dependencies | 2 | OAuth |

**Challenges**:
- Service account authentication
- Clustering configuration UI
- Partitioning configuration UI
- Column type overrides
- Load type options

**Advanced Features**:
- Clustering for query optimization
- Partitioning for cost reduction
- Custom type mapping

**Dependencies**: OAuth, Components
**Risk**: Medium

---

### Flow & Orchestration Features

#### Visual Flow Builder (React Flow)
**Size**: XXL (Extremely Complex)
**Effort**: 8-10 weeks
**Complexity Score**: 23

| Dimension | Score | Notes |
|-----------|-------|-------|
| Code Complexity | 5 | 100+ components |
| State Migration | 5 | Zustand (already modern) |
| API Integration | 3 | Flow API |
| UI Complexity | 5 | Canvas, drag-drop, real-time |
| Dependencies | 5 | React Flow, many features |

**Challenges**:
- 100+ React components
- React Flow canvas integration
- Zustand store (undo/redo)
- Drag-and-drop (dnd-kit)
- Real-time execution updates
- Complex edge rendering (conditions)
- Auto-layout algorithm
- Task configuration sidebar
- Phase management
- Condition builder

**Current Architecture** (Already Modern):
```
flows-v2/
├── builder/
│   ├── BuilderCanvas.tsx (React Flow)
│   ├── store/
│   │   ├── store.ts (Zustand)
│   │   └── undoRedoStore.ts
│   ├── nodes/ (Phase, AddNode, EmptyNode)
│   ├── edges/ (EdgeWithButton, AloneEdge)
│   └── components/ (30+)
├── components/
│   └── JobsTable/ (TanStack Table)
└── hooks/
    └── useFlow.ts
```

**Migration Advantage**: Already uses modern patterns!
- React Flow (just update version)
- Zustand (already in place)
- TanStack Table (for jobs table)
- TypeScript throughout

**Migration Strategy**:
1. Week 1-2: Upgrade React Flow to latest, setup in new app
2. Week 3-4: Migrate canvas and node components
3. Week 5-6: Migrate edge rendering and conditions
4. Week 7: Task configuration sidebar
5. Week 8: Testing, optimization

**Dependencies**: React Flow library, Components
**Risk**: Medium (complex but already modern architecture)

**Key Success Factor**: Maintain Zustand store structure, leverage React Flow patterns

---

#### Flow Conditions
**Size**: L (Complex)
**Effort**: 3-4 weeks
**Complexity Score**: 16

| Dimension | Score | Notes |
|-----------|-------|-------|
| Code Complexity | 4 | Nested logic, builder |
| State Migration | 3 | Moderate state |
| API Integration | 2 | Condition API |
| UI Complexity | 4 | Condition builder UI |
| Dependencies | 3 | Flow builder |

**Challenges**:
- Nested AND/OR operators
- Multiple condition types
- Condition builder UI (drag-drop)
- Visual representation on canvas
- Validation logic

**Dependencies**: Flow Builder
**Risk**: Medium

---

### Transformation Features

#### SQL Transformations
**Size**: L (Complex)
**Effort**: 4-5 weeks
**Complexity Score**: 17

| Dimension | Score | Notes |
|-----------|-------|-------|
| Code Complexity | 4 | Multiple backends |
| State Migration | 3 | Moderate state |
| API Integration | 3 | Transformation API |
| UI Complexity | 4 | Code editor, mappings |
| Dependencies | 3 | CodeMirror, components |

**Challenges**:
- 5 backend types (Snowflake, BigQuery, PostgreSQL, Redshift, MSSQL)
- SQL code editor (CodeMirror 6)
- Input/output mapping configuration
- Variable support
- Query validation
- Sandbox integration for testing

**Current Architecture**:
```
transformations-v2/
├── DbtDetail.tsx
├── components/
│   ├── ModalWizard.tsx
│   └── configuration-modal/
└── helpers.ts
```

**Code Editor Requirements**:
- CodeMirror 6 integration
- SQL syntax highlighting
- Autocomplete
- Variable interpolation
- Error markers

**Migration Strategy**:
1. Week 1: Setup CodeMirror 6
2. Week 2: Input/output mapping UI
3. Week 3: Variable system
4. Week 4: Backend-specific configurations
5. Week 5: Testing, validation

**Dependencies**: CodeMirror, Components, Sandboxes
**Risk**: Medium

---

#### dbt Transformations
**Size**: XL (Very Complex)
**Effort**: 6-8 weeks
**Complexity Score**: 21

| Dimension | Score | Notes |
|-----------|-------|-------|
| Code Complexity | 5 | Git, dbt, multiple backends |
| State Migration | 4 | Complex state |
| API Integration | 4 | Git, dbt, backends |
| UI Complexity | 4 | Multi-step config, discovery |
| Dependencies | 4 | Git, CodeMirror, Gantt |

**Challenges**:
- Git repository integration (deploy keys, webhooks)
- Multiple dbt types (local vs remote)
- Multiple backends (BigQuery, Snowflake, PostgreSQL, Redshift, MSSQL)
- Execution step configuration (run, test, docs, freshness)
- Thread count configuration
- Discovery mode (compiled SQL, Gantt chart)
- Input/output mapping
- Notifications

**Advanced Features**:
- Compiled SQL preview (CodeMirror)
- Gantt chart visualization (execution timing)
- Git authentication

**Migration Strategy**:
1. Week 1-2: Git integration
2. Week 3: Local dbt
3. Week 4-5: Remote dbt (multiple backends)
4. Week 6: Discovery mode (compiled SQL)
5. Week 7: Gantt chart visualization
6. Week 8: Testing, optimization

**Dependencies**: Git, CodeMirror, Gantt chart library (D3 or similar)
**Risk**: High (Git integration complexity)

---

### Development & Analysis Features

#### Workspaces
**Size**: L (Complex)
**Effort**: 4-5 weeks
**Complexity Score**: 16

| Dimension | Score | Notes |
|-----------|-------|-------|
| Code Complexity | 3 | Provisioning, credentials |
| State Migration | 4 | Flux → TanStack Query |
| API Integration | 3 | Workspace API |
| UI Complexity | 3 | Credential display, modals |
| Dependencies | 3 | Multiple backends |

**Challenges**:
- Provision external database workspaces
- Credential management (password reset, storage)
- Configuration-specific workspace grouping
- Production-only API access flag
- Support for various database backends

**Migration**: Flux → TanStack Query

**Dependencies**: Database backends
**Risk**: Medium

---

#### Sandboxes (11 Types)
**Size**: XL (Very Complex)
**Effort**: 6-8 weeks
**Complexity Score**: 19

| Dimension | Score | Notes |
|-----------|-------|-------|
| Code Complexity | 4 | 11 sandbox types |
| State Migration | 4 | Flux + TanStack Query (hybrid) |
| API Integration | 4 | Sandbox API, provisioning |
| UI Complexity | 4 | Size config, data loading |
| Dependencies | 3 | Storage, billing |

**Challenges**:
- 11 sandbox types (Snowflake, BigQuery, Redshift, Synapse, Exasol, Python, R, Julia, RStudio, JupyterLab, Octave)
- Size configuration (tiny to large)
- Resource allocation
- Data loading/unloading
- Storage mapping
- Snowflake-specific login types
- Sandbox sharing
- Billing integration

**Migration Strategy**:
1. Week 1-2: Core sandbox framework
2. Week 3: Top 3 sandboxes (Snowflake, Python/Jupyter, R/RStudio)
3. Week 4-5: Remaining SQL sandboxes
4. Week 6-7: Remaining container sandboxes
5. Week 8: Testing, optimization

**Dependencies**: Storage, Billing
**Risk**: High (many types, complex provisioning)

---

#### Data Apps (Streamlit)
**Size**: L (Complex)
**Effort**: 4-6 weeks
**Complexity Score**: 18

| Dimension | Score | Notes |
|-----------|-------|-------|
| Code Complexity | 4 | Deployment, logs, secrets |
| State Migration | 4 | Flux → TanStack Query |
| API Integration | 4 | Data Science API |
| UI Complexity | 4 | Terminal logs, package mgmt |
| Dependencies | 2 | Vault |

**Challenges**:
- Code and Git deployment types
- Dependency freezing and package updates
- Secrets management via Keboola vault
- Real-time terminal log streaming
- Deployment status tracking
- Notifications

**Migration**: Flux + Immutable.js → TanStack Query

**Dependencies**: Vault (secrets), Notifications
**Risk**: Medium

---

### AI Features

#### AI SQL Editor (Waii)
**Size**: XL (Very Complex)
**Effort**: 6-8 weeks
**Complexity Score**: 20

| Dimension | Score | Notes |
|-----------|-------|-------|
| Code Complexity | 4 | Session mgmt, query exec |
| State Migration | 3 | Zustand (already modern) |
| API Integration | 5 | Waii API, AI Service |
| UI Complexity | 4 | Editor, results, catalog |
| Dependencies | 4 | CodeMirror, AI service |

**Challenges**:
- Waii API integration (third-party)
- Session management
- Query execution with pagination
- Result caching
- Data catalog browsing
- Conversation management
- Feedback system
- Error explanation
- Component suggestions

**Current Architecture** (Already Modern):
```
ai/
├── components/
│   ├── Editor.tsx (CodeMirror)
│   ├── QueryResults.tsx
│   └── CatalogPanel.tsx
├── hooks/
│   ├── useCreateSession.ts
│   ├── useRunQueries.ts
│   └── useTablePreview.ts
└── store.ts (Zustand)
```

**Migration Advantage**: Already uses Zustand + TanStack Query patterns

**Migration Strategy**:
1. Week 1-2: Waii API integration
2. Week 3: Session management
3. Week 4: Query execution
4. Week 5: Data catalog integration
5. Week 6: Conversation and feedback
6. Week 7-8: Testing, optimization

**Dependencies**: Waii API, CodeMirror, AI Service
**Risk**: Medium (third-party API dependency)

---

#### AI Chat Interface
**Size**: M-L (Moderate to Complex)
**Effort**: 3-4 weeks
**Complexity Score**: 15

| Dimension | Score | Notes |
|-----------|-------|-------|
| Code Complexity | 3 | Chat UI, streaming |
| State Migration | 2 | React Context (already modern) |
| API Integration | 4 | AI Service, streaming |
| UI Complexity | 4 | Multiple layouts |
| Dependencies | 2 | AI service |

**Challenges**:
- Real-time message streaming
- Multiple layout modes (fullscreen, sidebar, sheet)
- Context persistence with URL params
- Feature flag-driven layout selection
- Survey integration

**Current Architecture** (Already Modern):
```
chat/
├── ChatProvider.tsx (React Context)
├── components/
│   ├── FullscreenChat.tsx
│   ├── SidebarChat.tsx
│   └── SheetChatContent.tsx
└── useChat.ts
```

**Migration Advantage**: Already modern architecture

**Dependencies**: AI Service
**Risk**: Low

---

### Administration Features

#### RBAC (Roles & Permissions)
**Size**: XL (Very Complex)
**Effort**: 5-6 weeks
**Complexity Score**: 19

| Dimension | Score | Notes |
|-----------|-------|-------|
| Code Complexity | 4 | Complex permissions |
| State Migration | 4 | Flux → TanStack Query |
| API Integration | 4 | Admin API |
| UI Complexity | 4 | Role mgmt, audit |
| Dependencies | 3 | Throughout app |

**Challenges**:
- Complex permission model
- Role assignment UI
- User invitations
- Permission propagation throughout app
- Access audit
- Security-critical feature

**Security Requirements**:
- Permission checks on every route
- Action-level permissions
- Resource-level permissions
- Audit logging

**Migration Strategy**:
1. Week 1: Permission model design
2. Week 2-3: Role management UI
3. Week 4: User invitation flow
4. Week 5: Permission enforcement
5. Week 6: Security audit, testing

**Dependencies**: Affects all features
**Risk**: High (security-critical)

---

## Dependencies & Blockers

### Dependency Graph

```
Foundation Layer (Week 1-4):
├── Authentication & Login (Week 1)
├── Routing & Navigation (Week 1)
├── API Client Integration (Week 2)
└── State Management Setup (Week 2-3)
    └── Design System Integration (Week 3-4)

Core Features Layer (Week 5-12):
├── Storage Browser (Week 5-7)
│   ├── Data Preview (Week 8)
│   └── Schema Management (Week 9)
├── Job Queue (Week 6-7)
└── Configuration Management (Week 8)

Data Integration Layer (Week 13-26):
├── OAuth Integration (Week 13)
├── Extractors
│   ├── Database Extractor (Week 14-18) [BLOCKER for many features]
│   ├── Cloud Storage (Week 19-21)
│   └── API Extractors (Week 22-26)
└── Writers
    ├── Database Writer (Week 19-23)
    └── Cloud Storage Writers (Week 24-26)

Orchestration Layer (Week 27-38):
├── Flow Builder (Week 27-34) [MAJOR COMPLEXITY]
│   ├── Phases & Tasks (Week 35)
│   ├── Conditions (Week 36)
│   └── Scheduling (Week 37)
└── Execution Monitoring (Week 38)

Transformation Layer (Week 39-48):
├── SQL Transformations (Week 39-42)
├── dbt Local (Week 43-45)
└── dbt Remote (Week 46-48)

Advanced Features Layer (Week 49-64):
├── Workspaces (Week 49-52)
├── Sandboxes (Week 53-58)
├── Data Apps (Week 59-62)
└── AI Features (Week 63-64)
```

### Critical Path

**Blockers** (must complete before others):

1. **Authentication** → Everything
2. **API Client** → All features
3. **State Management** → All features
4. **Design System** → All UI
5. **Storage Browser** → Extractors, Writers, Transformations
6. **OAuth** → Google/Microsoft integrations
7. **Database Extractor/Writer** → Most workflows
8. **Flow Builder** → Orchestration
9. **RBAC** → Production deployment

### Parallel Development Opportunities

Features that can be developed in parallel:

**Group A** (Weeks 13-26):
- Extractors (3 developers)
- Writers (2 developers)
- OAuth (1 developer)

**Group B** (Weeks 27-38):
- Flow Builder (2 developers)
- Execution Monitoring (1 developer)
- Job Queue enhancements (1 developer)

**Group C** (Weeks 39-48):
- SQL Transformations (2 developers)
- dbt Local (2 developers)
- dbt Remote (2 developers)

**Group D** (Weeks 49-64):
- Workspaces (1 developer)
- Sandboxes (2 developers)
- Data Apps (1 developer)
- AI Features (2 developers)

---

## Migration Challenges

### Challenge 1: State Management Migration (Flux → TanStack Query)

**Affected Features**: 40-50 features (40% of codebase)

**Complexity**: High

**Challenges**:
- Flux dispatcher pattern → TanStack Query hooks
- Immutable.js → native JS + immer
- Manual cache invalidation → automatic
- Synchronous store access → async queries

**Example Migration**:

**Before (Flux)**:
```javascript
// StorageStore.js
const StorageStore = Reflux.createStore({
  listenables: StorageActions,

  init() {
    this.buckets = Immutable.Map();
  },

  onLoadBucketsCompleted(buckets) {
    this.buckets = Immutable.fromJS(buckets);
    this.trigger(this.buckets);
  }
});

// Component
const BucketList = React.createClass({
  mixins: [Reflux.connect(StorageStore, 'buckets')],

  render() {
    return this.state.buckets.map(bucket => ...);
  }
});
```

**After (TanStack Query)**:
```typescript
// api/buckets.ts
export const useBucketsQuery = () => {
  return useQuery({
    queryKey: ['storage', 'buckets'],
    queryFn: async () => {
      const response = await storageClient.listBuckets();
      return response.data;
    }
  });
};

// Component
const BucketList: React.FC = () => {
  const { data: buckets, isLoading } = useBucketsQuery();

  if (isLoading) return <Skeleton />;
  return buckets.map(bucket => ...);
};
```

**Migration Effort**: 2-3 days per module

**Total Effort**: 30-40 weeks across all modules (can be parallelized)

---

### Challenge 2: Component Class → Function Migration

**Affected Features**: 30-40% of components

**Complexity**: Medium

**Challenges**:
- Class lifecycle → useEffect
- Component state → useState
- Mixins → custom hooks
- Refs (string refs → useRef)

**Migration Pattern**:

**Before**:
```javascript
const MyComponent = React.createClass({
  getInitialState() {
    return { count: 0 };
  },

  componentDidMount() {
    this.loadData();
  },

  loadData() {
    // fetch data
  },

  render() {
    return <div>{this.state.count}</div>;
  }
});
```

**After**:
```typescript
const MyComponent: React.FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // fetch data
  };

  return <div>{count}</div>;
};
```

**Migration Effort**: 1-2 hours per component

**Total Effort**: 15-20 weeks (can be parallelized)

---

### Challenge 3: Immutable.js Removal

**Affected Features**: 40% of codebase

**Complexity**: Medium

**Challenges**:
- Immutable.Map → plain object
- Immutable.List → array
- Deep equality checks
- Nested updates

**Migration Pattern**:

**Before**:
```javascript
// Update nested property
const newState = state.setIn(['bucket', 'id', 'name'], 'New Name');

// Map over list
const bucketNames = buckets.map(b => b.get('name'));
```

**After (with immer)**:
```typescript
// Update nested property
const newState = produce(state, draft => {
  draft.bucket.id.name = 'New Name';
});

// Map over array
const bucketNames = buckets.map(b => b.name);
```

**Migration Effort**: 1 day per module

**Total Effort**: 10-15 weeks (can be parallelized)

---

### Challenge 4: Provisioning Pattern Refactoring

**Affected Features**: Database extractor, Database writer, Facebook extractor, etc.

**Complexity**: High

**Challenges**:
- Factory pattern → composition
- Dynamic component creation
- Database-specific logic
- Type safety

**Current Pattern** (Provisioning):
```javascript
// Factory creates different components per database
const provisioningConfiguration = {
  mysql: {
    StoreConstructor: MySQLStore,
    Component: MySQLCredentials
  },
  postgres: {
    StoreConstructor: PostgreSQLStore,
    Component: PostgreSQLCredentials
  }
};

const createStore = (dbType) => {
  const config = provisioningConfiguration[dbType];
  return new config.StoreConstructor();
};
```

**Target Pattern** (Composition):
```typescript
// Unified component with type-specific renderers
interface DatabaseConfig {
  type: DatabaseType;
  credentials: DatabaseCredentials;
}

const DatabaseExtractor: React.FC<{ config: DatabaseConfig }> = ({ config }) => {
  const CredentialsForm = credentialComponents[config.type];

  return (
    <div>
      <CredentialsForm config={config} />
      {/* Common UI */}
    </div>
  );
};
```

**Migration Effort**: 2-3 weeks per provisioned module

**Total Effort**: 8-12 weeks

---

### Challenge 5: Redux → TanStack Query (Database Writer)

**Affected Features**: Database writer (wr-db)

**Complexity**: Very High

**Challenges**:
- Complex Redux state → TanStack Query + Zustand
- Action creators → mutations
- Reducers → query cache
- Middleware → query middleware

**Migration Effort**: 4-5 weeks

---

### Challenge 6: React Flow Canvas (Flow Builder)

**Affected Features**: Flow builder

**Complexity**: Very High (but already modern)

**Challenges**:
- Upgrade React Flow to latest version
- Maintain undo/redo functionality
- Custom node types
- Custom edge types
- Auto-layout algorithm

**Advantages**:
- Already uses React Flow
- Already uses Zustand
- Already TypeScript

**Migration Effort**: 6-8 weeks (mostly porting, not rewriting)

---

## Technical Debt Impact

### High-Impact Debt

| Debt Item | Affected Features | Migration Impact | Resolution |
|-----------|-------------------|------------------|------------|
| **Flux Stores** | 40% of features | High - must migrate all | TanStack Query |
| **Immutable.js** | 40% of features | Medium - performance issue | Native JS + immer |
| **Class Components** | 30% of features | Medium - modern patterns | Function components |
| **Provisioning Pattern** | 5 modules | High - complex refactor | Composition pattern |
| **Redux (wr-db)** | 1 module | High - complex state | TanStack Query + Zustand |
| **String Refs** | Many components | Low - easy fix | useRef |
| **Mixins** | Many components | Medium - refactor to hooks | Custom hooks |

### Technical Debt Cleanup Effort

**Total Effort**: 60-80 weeks (can be parallelized)

**Breakdown**:
- Flux → TanStack Query: 30-40 weeks
- Immutable.js removal: 10-15 weeks
- Class → Function: 15-20 weeks
- Provisioning refactor: 8-12 weeks
- Redux migration: 4-5 weeks

**Recommended Approach**: Incremental migration
- Don't block on debt cleanup
- Clean up debt as features are migrated
- Prioritize high-impact debt (Flux, Immutable.js)

---

## Risk Assessment

### High-Risk Features

| Feature | Risk Level | Risk Factors | Mitigation |
|---------|------------|--------------|------------|
| **Visual Flow Builder** | High | Complexity, user expectations | Early prototype, user testing |
| **Database Extractor** | High | 15+ databases, provisioning | Phased rollout, extensive testing |
| **Database Writer** | High | Redux migration, 18+ databases | Architecture review, pair programming |
| **Generic API Extractor** | Very High | 40+ components, complexity | Consider rebuild vs migrate |
| **RBAC** | High | Security-critical | Security audit, penetration testing |
| **dbt Transformations** | Medium-High | Git integration, multiple backends | Git expert on team |
| **Sandboxes** | Medium-High | 11 types, provisioning | Phased rollout by type |

### Risk Mitigation Strategies

1. **Prototype High-Risk Features Early** (Weeks 1-4)
   - Flow Builder (React Flow integration)
   - Database Extractor (provisioning pattern)
   - Generic API Extractor (evaluate rebuild)

2. **Security Review** (Throughout)
   - RBAC design review (Week 1)
   - OAuth implementation review (Week 13)
   - Penetration testing (Week 60)

3. **User Testing** (Regular)
   - Flow Builder (Weeks 30, 34, 38)
   - Database configs (Week 20)
   - Transformation UI (Week 42)

4. **Performance Testing** (Regular)
   - Storage browser (Week 8)
   - Data preview (Week 10)
   - Flow execution (Week 38)

---

## Effort Estimation

### Summary by Category

| Category | Features | Total Complexity | Effort (weeks) | Developer Profile |
|----------|----------|------------------|----------------|-------------------|
| **Infrastructure** | 8 | Medium-High | 14 | Senior |
| **Storage** | 8 | Medium-High | 18 | Mid-Senior |
| **Extractors** | 16 | High | 52 | Mid-Senior |
| **Writers** | 7 | High | 26 | Mid-Senior |
| **Flows** | 8 | Very High | 30 | Senior |
| **Transformations** | 6 | High | 22 | Senior |
| **Development** | 5 | High | 22 | Senior |
| **Administration** | 6 | High | 20 | Senior |
| **AI** | 5 | Medium-High | 18 | Mid-Senior |
| **Monitoring** | 8 | Medium | 14 | Mid |
| **Others** | 44 | Medium | 58 | Mid |
| **Total** | 121 | - | ~294 weeks | - |

### Timeline Scenarios

#### Scenario A: Small Team (2-3 developers)
**Timeline**: 24-36 months
**Risk**: High (long timeline, team burnout)
**Recommendation**: Not recommended

#### Scenario B: Medium Team (4-5 developers)
**Timeline**: 12-18 months
**Risk**: Medium
**Recommendation**: Recommended for phased migration
**Team Composition**:
- 1 Tech Lead / Architect (Senior)
- 2 Senior Frontend Developers
- 1 Frontend Developer (React Flow)
- 1 Full-stack Developer

#### Scenario C: Large Team (6-8 developers)
**Timeline**: 9-12 months
**Risk**: Low (coordination complexity)
**Recommendation**: Recommended for fast migration
**Team Composition**:
- 1 Tech Lead / Architect
- 3 Senior Frontend Developers
- 2 Frontend Developers
- 1 React Flow Specialist
- 1 Full-stack Developer

### Recommended Approach: Medium Team (4-5 developers) - 12-18 months

**Phase 1** (Months 1-3): Foundation + Storage
- Infrastructure, API, State Management
- Storage browser and data preview

**Phase 2** (Months 4-6): Data Integration
- Top extractors (database, cloud storage)
- Top writers (database, cloud storage)
- OAuth integration

**Phase 3** (Months 7-9): Orchestration
- Flow builder
- Execution monitoring
- Scheduling

**Phase 4** (Months 10-12): Transformations
- SQL transformations
- dbt transformations

**Phase 5** (Months 13-15): Advanced Features
- Workspaces, Sandboxes, Data Apps
- Remaining extractors/writers

**Phase 6** (Months 16-18): Polish & Launch
- UI enhancements, performance
- Security audit, bug fixes
- Production launch

---

## Conclusion

**Total Estimated Effort**: ~294 weeks of development
**Recommended Team Size**: 4-5 developers
**Recommended Timeline**: 12-18 months
**Total Cost Estimate**: $1.2M - $1.8M

**Highest Complexity Features**:
1. Generic API Extractor (XXL, 8-10 weeks)
2. Visual Flow Builder (XXL, 8-10 weeks)
3. Database Extractor (XL, 5-6 weeks)
4. Database Writer (XL, 5-6 weeks)
5. dbt Transformations (XL, 6-8 weeks)
6. Sandboxes (XL, 6-8 weeks)
7. AI SQL Editor (XL, 6-8 weeks)

**Critical Success Factors**:
1. Early prototype of high-risk features
2. Experienced team (React, TypeScript, TanStack Query)
3. Phased migration approach
4. Regular user testing
5. Security review for RBAC
6. Performance testing throughout

**Key Risks**:
1. Generic API Extractor - consider rebuild
2. Flow Builder - complex but modern
3. Database configs - 15+ databases
4. Technical debt migration - Flux, Immutable.js, Redux

**Recommended Mitigation**:
- Start with prototypes (Weeks 1-4)
- Hire experienced developers
- Incremental migration
- Regular testing and feedback

---

**Related Documents**:
- [feature-catalog.md](feature-catalog.md)
- [user-journeys.md](user-journeys.md)
- [feature-priority-matrix.md](feature-priority-matrix.md)

---

*Generated: 2025-10-19*
*Version: 1.0*
*Based on: 121 features, 49 modules, 400+ components*
