# Architecture Overview

## Introduction

Keboola Connection UI is a comprehensive data operations platform built with modern React patterns, providing a visual interface for data extraction, transformation, loading (ETL), and orchestration. This document provides a high-level overview of the system architecture, component organization, and data flow.

**Codebase Stats** (from Phase 2 & 3 analysis):
- 49 modules documented
- 400+ React components
- 43+ design system components
- 14 API clients
- 71 documentation files (34,552 lines)

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         KEBOOLA CONNECTION UI                                │
│                         Browser Application                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
        ┌───────────▼──────────┐      ┌────────────▼────────────┐
        │   Frontend Layer     │      │   Design System Layer   │
        │   (Apps/Modules)     │      │   (@keboola/design)     │
        └───────────┬──────────┘      └─────────────────────────┘
                    │                              │
        ┌───────────▼──────────────────────────────▼───────────┐
        │           State Management Layer                     │
        │   • Flux (40% - Legacy)                             │
        │   • TanStack Query (30% - Modern)                   │
        │   • Zustand (30% - Canvas/AI)                       │
        └───────────┬──────────────────────────────────────────┘
                    │
        ┌───────────▼──────────────────────────────────────────┐
        │           API Client Layer                           │
        │   (@keboola/api-client - 14 typed clients)          │
        │   • Storage API      • Queue API                    │
        │   • Chat API         • Editor API                   │
        │   • Management API   • Vault API                    │
        │   • Telemetry API    • Sandboxes API               │
        └───────────┬──────────────────────────────────────────┘
                    │
        ┌───────────▼──────────────────────────────────────────┐
        │           Backend Services (External)                │
        │   • Storage API      • Encryption                   │
        │   • Queue            • Data Science                 │
        │   • Vault            • Metastore                    │
        │   • Telemetry        • Sync Actions                 │
        │   • AI Services      • Query Service                │
        └──────────────────────────────────────────────────────┘
```

---

## High-Level Architecture

### Frontend Architecture

**Monorepo Structure** (Yarn 4 Workspaces):

```
ui/
├── apps/
│   └── kbc-ui/                    # Main application
│       ├── src/scripts/modules/   # Feature modules (49 total)
│       ├── src/scripts/react/     # Core React components
│       └── src/scripts/stores/    # Flux stores
│
└── packages/
    ├── @keboola/design/          # Design system (43+ components)
    ├── @keboola/api-client/      # API client library (14 clients)
    ├── @keboola/flow-builder/    # React Flow utilities
    ├── @keboola/chat/            # Chat component
    ├── @keboola/utils/           # Shared utilities
    ├── @keboola/constants/       # Shared constants
    └── @keboola/codemirror-sfsql/# Snowflake SQL syntax
```

### Module Organization

**49 Feature Modules** organized by domain:

```
Core Modules (5):
├── admin              # RBAC and permissions
├── settings           # Project settings
├── home               # Dashboard
├── billing            # PAYG billing with Stripe
└── chat               # AI chat interface

Data Modules (8):
├── storage            # Tables and buckets (70+ components)
├── bucket-browser     # Bucket management
├── table-browser      # Table management
├── data-apps          # Streamlit deployment
├── data-catalog       # Data catalog
├── workspaces         # External databases
├── sandboxes          # 11 sandbox types
└── lineage            # Data lineage graph

Processing Modules (5):
├── flows-v2           # Modern flow builder (React Flow)
├── flows              # Legacy flows
├── orchestrations-v2  # Shared utilities
├── transformations-v2 # SQL/dbt transforms
└── legacy-transformation

AI Module (1):
└── ai                 # Waii SQL editor

Extractors (16):
├── ex-db-generic      # Generic DB (15+ databases)
├── ex-mongodb
├── ex-google-analytics-v4
├── ex-google-ads
├── ex-google-drive
├── ex-google-bigquery-v2
├── ex-facebook
├── ex-aws-s3
├── ex-azure-blob
├── ex-ftp
├── ex-dropbox-v2
├── ex-http
├── ex-generic
├── ex-storage
├── ex-email-attachments
└── ex-onedrive

Writers (7):
├── wr-db              # Generic DB writer (18+ databases)
├── wr-google-bigquery-v2
├── wr-google-sheets
├── wr-google-drive
├── wr-aws-s3
├── wr-onedrive
└── wr-storage

Infrastructure (6):
├── components         # Shared component logic
├── configurations     # Config rows
├── oauth-v2           # OAuth authorization
├── queue              # Job management
├── notifications      # Email/webhook
└── trash              # Recovery system

Analytics (3):
├── lineage            # React Flow graph
├── data-catalog       # Catalog with sharing
└── telemetry          # GoodData dashboards
```

**Module Reference**: See `docs/02-modules/` for detailed documentation

---

## Data Flow Through System

### 1. User Action Flow

```
User Action (UI)
    │
    ▼
Component Event Handler
    │
    ├─────────────────┬─────────────────┬────────────────┐
    │ Legacy (Flux)   │ Modern (Query)  │ Canvas (Zustand)
    │ (40%)           │ (30%)           │ (30%)
    ▼                 ▼                 ▼
Flux Action      TanStack Mutation   Zustand Action
    │                 │                 │
    ▼                 ▼                 ▼
Store Update     Query Cache Update  Store Update
    │                 │                 │
    ▼                 ▼                 ▼
Component Re-render (via hooks/listeners)
    │
    ▼
UI Update
```

### 2. API Request Flow

```
Component
    │
    ▼
State Manager (Flux/TanStack/Zustand)
    │
    ▼
API Client (@keboola/api-client)
    │
    ├─ Request Middleware
    │  ├─ Add authentication (X-StorageApi-Token)
    │  ├─ Add branch context (X-KBC-RunId)
    │  └─ Add error handling
    │
    ▼
HTTP Request (superagent/fetch)
    │
    ▼
Backend Service API
    │
    ▼
Response Middleware
    │
    ├─ Parse JSON
    ├─ Handle errors
    └─ Transform data
    │
    ▼
State Update
    │
    ▼
Component Re-render
```

### 3. Real-time Data Flow (WebSocket)

```
Backend Event (Job/Flow execution)
    │
    ▼
WebSocket Connection
    │
    ▼
Event Handler (Flows-v2 store)
    │
    ▼
Zustand Store Update
    │
    ▼
React Flow Canvas Update
    │
    ▼
Visual Feedback (Running/Success/Error)
```

---

## Frontend/Backend Separation

### Frontend Responsibilities

**UI Layer**:
- User interface rendering
- User input validation
- Client-side routing
- State management
- Optimistic updates
- Error handling and display

**Business Logic**:
- Form validation
- Data transformation for display
- URL state management
- Local filtering/sorting
- Pagination (client-side)

**Example**: Storage module
- Frontend: Display bucket/table hierarchy, search, filtering, multi-select
- Backend: Store data, execute queries, enforce permissions

### Backend Responsibilities

**API Services**:
- Data persistence (PostgreSQL, Snowflake, etc.)
- Authentication and authorization
- Business rule enforcement
- Job execution and scheduling
- Component execution
- Data processing pipelines

**Example**: Job Queue
- Frontend: Display job status, retry controls, logs viewer
- Backend: Execute jobs, manage queue, store results, handle retries

### Communication Pattern

**Type-Safe API Clients**:
```typescript
// @keboola/api-client provides type-safe interfaces
import { storageClient } from '@keboola/api-client';

// TypeScript ensures type safety end-to-end
const buckets: Bucket[] = await storageClient.buckets.list({
  include: 'attributes,metadata'
});
```

**Authentication**:
- Token-based: `X-StorageApi-Token` header
- OAuth2 for third-party services
- Session management in browser localStorage

**Error Handling**:
- 4xx errors: User feedback with actionable messages
- 5xx errors: Error boundary with retry options
- Network errors: Offline detection and retry

---

## Deployment Architecture

### Build Process

```
Source Code (TypeScript/React)
    │
    ▼
Rspack Bundler (Modern alternative to Webpack)
    │
    ├─ TypeScript compilation (SWC)
    ├─ Code splitting
    ├─ Tree shaking
    ├─ CSS processing (Less + PostCSS + Tailwind)
    └─ Asset optimization
    │
    ▼
Production Bundle
    │
    ├─ main.js (core app)
    ├─ vendor.js (dependencies)
    ├─ [module].chunk.js (lazy-loaded modules)
    └─ styles.css
    │
    ▼
CDN Distribution
```

### Environment Configuration

**Multiple Environments**:
- Development: `yarn dev` (HMR enabled)
- Staging: Pre-production testing
- Production: `connection.keboola.com`
- EU Production: `connection.eu-central-1.keboola.com`

**Feature Flags**:
- Controlled rollout of new features
- A/B testing capabilities
- Backend-driven configuration

**Example** (from Phase 3 observations):
```typescript
// Feature flags control UI visibility
if (ApplicationStore.hasCurrentProjectFeature('FLOWS_V2')) {
  // Show modern flow builder
} else {
  // Show legacy flows
}
```

### Performance Optimizations

**Code Splitting**:
- Each module lazy-loaded on demand
- Design system tree-shaken
- Route-based splitting

**Bundle Analysis**:
```bash
# Main bundle: ~500KB gzipped
# Vendor bundle: ~300KB gzipped (React, libraries)
# Module chunks: 10-50KB each
```

**Caching Strategy**:
- TanStack Query cache (client-side)
- Service Worker (offline support)
- Browser cache headers
- CDN edge caching

---

## Component Relationships

### Design System → Modules

All modules consume design system components:

```
@keboola/design (Design System)
    │
    ├─► Button (used in 242+ files)
    ├─► Modal (used in 130+ files)
    ├─► Input (widespread)
    ├─► Table (19+ files)
    ├─► Card
    ├─► Tabs
    ├─► Badge
    └─► ... (43+ components total)
    │
    ▼
Modules (49 total)
    │
    ├─► flows-v2 (100+ components)
    ├─► storage (70+ components)
    ├─► transformations-v2
    ├─► workspaces
    └─► ... (others)
```

### Shared Utilities

```
@keboola/utils
    │
    ├─► string utilities
    ├─► date formatting (dayjs)
    ├─► validation helpers
    └─► common hooks
    │
    ▼
All Modules
```

### API Client → Modules

```
@keboola/api-client (14 clients)
    │
    ├─► storageClient → storage, bucket-browser, table-browser
    ├─► queueClient → queue, flows-v2, orchestrations
    ├─► chatClient → chat, ai
    ├─► editorClient → transformations-v2
    ├─► vaultClient → data-apps, workspaces
    └─► ... (others)
```

---

## Key Architectural Patterns

### 1. Adapter Pattern (Extractors/Writers)

Generic components adapted for specific data sources:

```typescript
// Generic extractor framework
interface ExtractorAdapter {
  renderConfig: () => JSX.Element;
  validate: (config: Config) => ValidationResult;
  transformParams: (formData: FormData) => ComponentConfig;
}

// Specific implementations
class MySQLAdapter implements ExtractorAdapter { ... }
class PostgreSQLAdapter implements ExtractorAdapter { ... }
class MongoDBAdapter implements ExtractorAdapter { ... }
```

**Modules**: `ex-db-generic`, `wr-db`

### 2. Canvas Pattern (Visual Builders)

React Flow for drag-and-drop visual editing:

```typescript
// Flows v2 uses React Flow + Zustand
const BuilderCanvas = () => {
  const nodes = useBuilderStore(state => state.nodes);
  const edges = useBuilderStore(state => state.edges);

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

**Modules**: `flows-v2`, `lineage`

### 3. Session Pattern (AI Features)

Stateful sessions with backend sync:

```typescript
// AI SQL editor session management
const { session, isLoading } = useSession();
const { sendMessage } = useChat(session.id);

// Session persists across page reloads
// State synced with backend
```

**Modules**: `ai`, `chat`

### 4. Provisioning Pattern (Workspace Management)

Dynamic resource provisioning and lifecycle management:

```typescript
// Workspace lifecycle
create → provision → connect → use → terminate
```

**Modules**: `workspaces`, `sandboxes`

---

## Technical Debt & Migration Status

### Legacy vs Modern Split

**Legacy (40%)**:
- Flux + Immutable.js
- Class components
- Manual store subscriptions
- Verbose action creators

**Modern (60%)**:
- TanStack Query + Zustand
- Functional components with hooks
- Automatic cache management
- Simplified state logic

### Migration Path

**Completed Migrations**:
- trash → TanStack Query (reference implementation)
- flows-v2 → Zustand for canvas state
- Several extractors → modern patterns

**In Progress**:
- Storage → TanStack Query migration
- Flows → Complete v2 migration
- Settings → Zustand refactor

**Not Started**:
- Legacy extractors (ex-facebook, etc.)
- Legacy transformations
- Some infrastructure modules

**Reference**: See `docs/MODERNIZATION_ASSESSMENT.md` for detailed analysis

---

## Cross-References

**Module Details**: `docs/02-modules/` - 49 module documentation files

**UI Workflows**: `docs/05-workflows/` - 4 documented user workflows
- Dashboard navigation
- Storage operations
- Flow creation & execution
- Transformation workflow

**Components**: `docs/04-components/` - Design system documentation
- Form components
- Code editors
- Utilities and patterns

**API Contracts**: `docs/06-api-contracts/` - API client documentation
- 14 API clients
- Type contracts
- Middleware patterns

---

## Summary

The Keboola Connection UI is a well-architected monorepo application with:

1. **Modular Design**: 49 feature modules with clear separation of concerns
2. **Type Safety**: Full TypeScript coverage with strict typing
3. **Modern Patterns**: Gradual migration from Flux to TanStack Query/Zustand
4. **Design System**: 43+ reusable components ensuring consistency
5. **API Layer**: 14 type-safe clients with centralized error handling
6. **Performance**: Code splitting, lazy loading, and efficient caching
7. **Scalability**: Monorepo structure supports independent module development

**Key Strengths**:
- Strong type safety
- Modular architecture
- Comprehensive design system
- Clean API separation

**Areas for Improvement**:
- Complete Flux → TanStack Query migration
- Reduce bundle size
- Add more E2E tests
- Improve mobile responsiveness

---

**Last Updated**: 2025-10-19 (Phase 4)
**Related Documents**:
- `docs/MODERNIZATION_ASSESSMENT.md` - Strategic assessment
- `docs/PHASE_3_COMPLETE.md` - UI exploration results
- `docs/01-overview/technology-stack.md` - Detailed tech inventory
- `docs/01-overview/state-management-patterns.md` - State patterns
- `docs/01-overview/routing-structure.md` - Routing details
