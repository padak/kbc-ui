# Overview Documentation

High-level architectural and technical documentation for the Keboola Connection UI project.

**Created**: 2025-10-19 (Phase 4)
**Based on**: Phase 2 (71 files, 34,552 lines of code analysis) + Phase 3 (4 workflows, 12 screenshots)

---

## Documents in this Directory

### 1. [Architecture Overview](./architecture-overview.md) (601 lines)

Comprehensive system architecture documentation covering:
- High-level architecture diagram (ASCII art)
- Module organization (49 modules)
- Data flow through the system
- Frontend/backend separation
- Component relationships
- Deployment architecture
- Technical debt assessment

**Key Topics**:
- Monorepo structure (Yarn workspaces)
- Module categorization (Core, Data, Processing, AI, Extractors, Writers, Infrastructure, Analytics)
- Data flow patterns (User actions, API requests, WebSocket updates)
- Architectural patterns (Adapter, Canvas, Session, Provisioning)

---

### 2. [Technology Stack](./technology-stack.md) (735 lines)

Complete technology inventory and dependency analysis:
- Frontend stack (React 18.3+, TypeScript 5.7+)
- Build tools (Rspack 1.5.2, SWC)
- State management (Flux, TanStack Query, Zustand)
- UI libraries (Radix UI, Tailwind CSS)
- Code editors (CodeMirror 5/6)
- Visualization (React Flow, D3.js, Recharts)
- Testing framework (Jest, Testing Library)

**Key Topics**:
- Package.json analysis
- Version compatibility matrix
- Bundle size optimization
- Dependency analysis
- Future technology considerations

---

### 3. [State Management Patterns](./state-management-patterns.md) (937 lines)

Detailed explanation of three state management approaches:
- **Flux + Immutable.js** (40% - Legacy)
- **TanStack Query** (30% - Modern server state)
- **Zustand** (30% - Modern client state)

**Key Topics**:
- Architecture diagrams for each pattern
- Real code examples from modules
- Data flow explanations
- When to use each pattern
- Migration guidelines (Flux → TanStack Query/Zustand)
- Performance optimizations

**Example Modules**:
- Flux: `storage` (legacy), `data-apps`
- TanStack Query: `trash` (reference implementation)
- Zustand: `flows-v2` (canvas state), `ai` (session state)

---

### 4. [Routing Structure](./routing-structure.md) (897 lines)

React Router 7 configuration and URL patterns:
- URL pattern structure and hierarchy
- Route definition syntax
- Dynamic routing (params, query strings)
- Route examples from all major modules
- Data preloading with `requireData`
- Breadcrumb navigation
- Lazy loading and code splitting
- URL state management

**Key Topics**:
- Nested route structure
- Route guards and permissions
- Programmatic navigation
- Legacy URL redirects
- Examples from Dashboard, Flows, Storage, Transformations

---

## Quick Navigation

**Looking for...**
- System architecture? → [architecture-overview.md](./architecture-overview.md)
- Tech stack details? → [technology-stack.md](./technology-stack.md)
- How state works? → [state-management-patterns.md](./state-management-patterns.md)
- URL patterns? → [routing-structure.md](./routing-structure.md)

**Module deep-dives**: See `docs/02-modules/` (49 files)

**UI workflows**: See `docs/05-workflows/` (4 files)

**Components**: See `docs/04-components/` (7 files)

**API contracts**: See `docs/06-api-contracts/` (5 files)

---

## Statistics

**Total Lines**: 3,170 lines of documentation
**Total Size**: ~79 KB
**Documents**: 4 comprehensive guides

**Coverage**:
- 49 modules analyzed
- 400+ components documented
- 14 API clients detailed
- 3 state patterns explained
- 100+ route examples

---

## How to Use This Documentation

### For New Developers

1. Start with [architecture-overview.md](./architecture-overview.md) to understand the big picture
2. Review [technology-stack.md](./technology-stack.md) to learn the tools
3. Read [state-management-patterns.md](./state-management-patterns.md) to understand data flow
4. Check [routing-structure.md](./routing-structure.md) for navigation patterns

### For Existing Developers

- Need to add a new module? See architecture patterns in `architecture-overview.md`
- Choosing state management? See decision matrix in `state-management-patterns.md`
- Adding new routes? See examples in `routing-structure.md`
- Upgrading dependencies? Check version matrix in `technology-stack.md`

### For Architects

- System design: `architecture-overview.md` (component relationships, data flow)
- Technical strategy: `technology-stack.md` (future considerations, migration priorities)
- Modernization: `state-management-patterns.md` (Flux → modern patterns)
- Performance: All documents contain optimization sections

---

## Cross-References

**Phase 2 Analysis**: `docs/PHASE_2_COMPLETE.md` - Code analysis summary

**Phase 3 Exploration**: `docs/PHASE_3_COMPLETE.md` - UI workflow documentation

**Modernization Strategy**: `docs/MODERNIZATION_ASSESSMENT.md` - Strategic recommendations

**Module Index**: `docs/02-modules/INDEX.md` - All 49 modules

**Workflow Examples**: `docs/05-workflows/` - 4 documented user workflows

---

## Updates

This documentation reflects the state of the codebase as of **2025-10-19**.

**Last Phase 2 Analysis**: 71 files, 34,552 lines documented
**Last Phase 3 Exploration**: 4 workflows, 12 screenshots captured

To update this documentation:
1. Review code changes in relevant modules
2. Update architecture diagrams if structure changed
3. Update technology stack if dependencies changed
4. Update state patterns if new patterns introduced
5. Update routing if route structure changed

---

**Phase 4 Complete** - Overview documentation created
