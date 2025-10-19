# Technology Stack

## Introduction

Complete technology inventory for the Keboola Connection UI, documenting all major frameworks, libraries, build tools, and dependencies used in the application. This document is based on Phase 2 code analysis and package.json inspection.

---

## Technology Summary

```
Frontend Framework:  React 18.3.1
Language:           TypeScript 5.9.3
State Management:   Flux 4.0.4, TanStack Query 5.85.5, Zustand 5.0.8
Build Tool:         Rspack 1.5.2 (Webpack alternative)
Package Manager:    Yarn 4.5.3 (Berry)
Node Version:       22.x
Design System:      Radix UI + Tailwind CSS 3.4.17
Code Editors:       CodeMirror 5 & 6
```

---

## Core Frontend Stack

### React Ecosystem

| Package | Version | Purpose | Usage |
|---------|---------|---------|-------|
| **react** | 18.3.1 | Core UI library | Base framework for all components |
| **react-dom** | 18.3.1 | DOM rendering | Browser rendering |
| **react-router** | 7.5.2 | Client-side routing | Navigation and URL management |
| **prop-types** | 15.8.1 | Runtime type checking | Legacy components validation |

**Key Features Used**:
- React 18 Concurrent Features
- Suspense for code splitting
- Error Boundaries
- Hooks (useState, useEffect, useMemo, useCallback, useContext, etc.)
- Portals for modals

---

### TypeScript

| Package | Version | Purpose |
|---------|---------|---------|
| **typescript** | 5.9.3 | Type system |
| **@types/react** | 18.3.24 | React type definitions |
| **@types/react-dom** | 18.3.7 | React DOM types |
| **@types/node** | 22.18.0 | Node.js types |

**Configuration**:
- Strict mode enabled
- Full type coverage across codebase
- Custom type definitions in `types.ts` files
- Workspace-shared tsconfig (`@keboola/tsconfig`)

**TypeScript Features**:
```typescript
// Strict typing throughout
interface FlowTask {
  id: string;
  componentId: string;
  configId: string;
  enabled: boolean;
  continueOnFailure: boolean;
}

// Discriminated unions
type StatePattern =
  | { type: 'flux'; store: ImmutableMap }
  | { type: 'query'; queryKey: string[] }
  | { type: 'zustand'; store: StoreApi };
```

---

## State Management

### 1. Flux (Legacy - 40%)

| Package | Version | Purpose |
|---------|---------|---------|
| **flux** | 4.0.4 | Unidirectional data flow |
| **immutable** | 3.7.6 | Immutable data structures |
| **eventemitter3** | 5.0.1 | Event emitter (Flux dispatcher) |

**Usage Pattern**:
```typescript
// Legacy pattern still in use
class StorageStore extends Store {
  _data = Immutable.Map();

  handleAction(action: Action) {
    switch(action.type) {
      case 'LOAD_BUCKETS':
        this._data = this._data.set('buckets', action.payload);
        this.emitChange();
    }
  }
}
```

**Modules Using Flux**:
- storage (partial)
- flows (legacy)
- data-apps
- Most legacy extractors
- legacy-transformation

### 2. TanStack Query (Modern - 30%)

| Package | Version | Purpose |
|---------|---------|---------|
| **@tanstack/react-query** | 5.85.5 | Server state management |
| **@tanstack/react-query-devtools** | 5.85.5 | Development tools |

**Usage Pattern**:
```typescript
// Modern pattern - trash module (reference)
const { data: deletedComponents, isLoading } = useDeletedComponents();

const restoreMutation = useMutation({
  mutationFn: (configId: string) =>
    api.restoreConfiguration(configId),
  onSuccess: () => queryClient.invalidateQueries(['trash'])
});
```

**Modules Using TanStack Query**:
- trash (100% - reference implementation)
- flows-v2 (jobs/runs data)
- transformations-v2 (partial)
- Several modern extractors

**Benefits**:
- Automatic caching
- Background refetching
- Optimistic updates
- Simplified error handling
- DevTools integration

### 3. Zustand (Canvas/AI - 30%)

| Package | Version | Purpose |
|---------|---------|---------|
| **zustand** | 5.0.8 | Lightweight state management |

**Usage Pattern**:
```typescript
// Flow builder canvas state
const useBuilderStore = create<BuilderState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,

  addNode: (node) => set(state => ({
    nodes: [...state.nodes, node]
  })),

  updateNode: (id, updates) => set(state => ({
    nodes: state.nodes.map(n =>
      n.id === id ? { ...n, ...updates } : n
    )
  }))
}));
```

**Modules Using Zustand**:
- flows-v2 (builder state, undo/redo)
- ai (session state)
- lineage (graph state)

**Benefits**:
- No boilerplate
- Simple API
- Built-in devtools
- Middleware support (undo/redo)

---

## UI Component Libraries

### Design System (@keboola/design)

**Core Library**: Radix UI (accessible primitives)

| Radix Package | Purpose |
|--------------|---------|
| @radix-ui/react-dialog | Modal, Sheet |
| @radix-ui/react-dropdown-menu | Dropdown menus |
| @radix-ui/react-select | Select component |
| @radix-ui/react-tabs | Tab navigation |
| @radix-ui/react-checkbox | Checkbox input |
| @radix-ui/react-radio-group | Radio buttons |
| @radix-ui/react-switch | Toggle switch |
| @radix-ui/react-tooltip | Tooltips |
| @radix-ui/react-alert-dialog | Confirmation dialogs |
| @radix-ui/react-popover | Popovers |

**Styling**:
- **Tailwind CSS** 3.4.17 (utility-first CSS)
- **Class Variance Authority (CVA)** for component variants
- **PostCSS** 8.5.6 for CSS processing
- **Less** 4.4.1 (legacy stylesheets)

**Component Variants**:
```typescript
// CVA pattern for variants
const buttonVariants = cva("tw-btn", {
  variants: {
    variant: {
      default: "tw-bg-primary tw-text-white",
      outline: "tw-border tw-border-primary",
      ghost: "tw-bg-transparent"
    },
    size: {
      sm: "tw-px-2 tw-py-1",
      md: "tw-px-4 tw-py-2",
      lg: "tw-px-6 tw-py-3"
    }
  }
});
```

### Legacy UI (Bootstrap 3)

| Package | Version | Purpose |
|---------|---------|---------|
| **bootstrap** | 3.4.1 | CSS framework (legacy) |
| **react-bootstrap** | 0.33.1 | React Bootstrap components |

**Note**: Being phased out in favor of `@keboola/design`

---

## Code Editors

### CodeMirror

| Package | Version | Purpose |
|---------|---------|---------|
| **codemirror** | 5.65.13 | CodeMirror 5 (legacy) |
| **react-codemirror2** | 8.0.1 | React wrapper for CM5 |
| **@keboola/codemirror-sfsql** | workspace | Snowflake SQL syntax |

**Languages Supported**:
- SQL (multiple dialects)
- Python
- R
- Julia
- JavaScript
- JSON
- YAML
- Markdown

**Features**:
- Syntax highlighting
- Auto-completion
- Linting
- Variable substitution highlighting
- Query folding

**Usage Example**:
```typescript
// SQL editor in transformations
<SqlEditor
  value={code}
  onChange={handleChange}
  mode="text/x-snowflake-sql"
  variables={transformationVariables}
/>
```

---

## Data Visualization

### React Flow (Canvas/Diagrams)

| Package | Version | Purpose |
|---------|---------|---------|
| **@xyflow/react** | 12.6.0 | Canvas-based node editor |
| **elkjs** | 0.10.0 | Graph layout algorithm |

**Usage**:
- Flow builder (flows-v2)
- Data lineage graph
- Visual pipeline editor

**Features**:
- Drag & drop nodes
- Custom edge rendering
- Auto-layout
- Minimap
- Zoom/pan controls

### D3.js (Charts)

| Package | Version | Purpose |
|---------|---------|---------|
| **d3** | 7.9.0 | Data visualization core |
| **d3-array** | 3.2.4 | Array manipulation |
| **d3-scale** | 4.0.2 | Scales and axes |
| **d3-axis** | 3.0.0 | Axis rendering |
| **d3-time-format** | 4.1.0 | Time formatting |
| **recharts** | 2.15.1 | React chart library |

**Usage**:
- Job duration charts
- Activity graphs
- Data quality metrics
- Billing visualizations

---

## Data Management

### Tables & Lists

| Package | Version | Purpose |
|---------|---------|---------|
| **@tanstack/react-table** | 8.21.3 | Headless table library |
| **@tanstack/react-virtual** | 3.13.12 | Virtual scrolling |
| **sortablejs** | 1.15.6 | Drag & drop sorting |

**TanStack Table Features**:
- Column sorting
- Filtering
- Pagination
- Row selection
- Column resizing
- Virtual scrolling (for large datasets)

**Usage**:
```typescript
// Storage table with 1000+ rows
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
});
```

### Forms & Validation

| Package | Version | Purpose |
|---------|---------|---------|
| **react-select** | 5.10.1 | Select dropdowns |
| **react-input-autosize** | 3.0.0 | Auto-sizing inputs |
| **react-textarea-autosize** | 8.3.4 | Auto-sizing textareas |
| **react-dropzone** | 14.2.3 | File upload |

---

## Utilities

### Date & Time

| Package | Version | Purpose |
|---------|---------|---------|
| **dayjs** | 1.11.3 | Date manipulation |
| **@breejs/later** | 4.2.0 | Cron parsing |
| **cronstrue** | 3.2.0 | Cron to human-readable |
| **litepicker** | 2.0.12 | Date picker |

**Usage**:
```typescript
// Human-readable cron
cronstrue.toString('0 9 * * 1-5');
// "At 09:00 AM, Monday through Friday"

// Relative time
dayjs(job.createdTime).fromNow();
// "2 hours ago"
```

### String & Data Processing

| Package | Version | Purpose |
|---------|---------|---------|
| **underscore** | 1.13.7 | Utility functions |
| **lodash.defaultsdeep** | 4.6.1 | Deep object merging |
| **qs** | 6.14.0 | Query string parsing |
| **linkify-it** | 5.0.0 | URL detection |
| **diff** | 8.0.2 | Text diffing |
| **remove-markdown** | 0.6.2 | Strip markdown |

### UI Utilities

| Package | Version | Purpose |
|---------|---------|---------|
| **react-hotkeys-hook** | 5.1.0 | Keyboard shortcuts |
| **cmdk** | 1.1.1 | Command palette |
| **react-intersection-observer** | 9.16.0 | Visibility detection |
| **memoize-one** | 6.0.0 | Memoization |

**Command Palette**:
```typescript
// Global search (⌘K)
<Command>
  <CommandInput placeholder="Search..." />
  <CommandList>
    <CommandGroup heading="Flows">
      {flows.map(flow => <CommandItem>{flow.name}</CommandItem>)}
    </CommandGroup>
  </CommandList>
</Command>
```

---

## Build Tools

### Rspack (Module Bundler)

| Package | Version | Purpose |
|---------|---------|---------|
| **@rspack/cli** | 1.5.2 | Command-line interface |
| **@rspack/core** | 1.5.2 | Core bundler (Rust-based) |
| **@rspack/plugin-react-refresh** | 1.5.0 | Fast Refresh for HMR |

**Why Rspack over Webpack**:
- 10x faster builds (Rust-based)
- Drop-in Webpack replacement
- Better tree shaking
- Improved caching

**Build Configuration**:
- Code splitting by route
- CSS extraction
- Asset optimization
- Source maps
- Environment variables via dotenv

### Transpilation

| Package | Version | Purpose |
|---------|---------|---------|
| **@swc/core** | 1.12.7 | TypeScript/JavaScript compiler (Rust) |
| **@swc/helpers** | 0.5.17 | Runtime helpers |
| **@swc/jest** | 0.2.39 | Jest transformer |

**SWC vs Babel**:
- 20x faster compilation
- Native TypeScript support
- Smaller bundle size
- Better performance

### CSS Processing

| Package | Version | Purpose |
|---------|---------|---------|
| **postcss** | 8.5.6 | CSS transformation |
| **tailwindcss** | 3.4.17 | Utility CSS framework |
| **less** | 4.4.1 | CSS preprocessor (legacy) |
| **less-loader** | 12.3.0 | Webpack Less loader |
| **postcss-loader** | 8.1.1 | PostCSS Webpack loader |

**Tailwind Configuration**:
- Custom prefix: `tw-` (to avoid conflicts with Bootstrap)
- Shared config: `@keboola/tailwind-config`
- JIT mode enabled
- Custom color palette

---

## Testing

### Testing Stack

| Package | Version | Purpose |
|---------|---------|---------|
| **jest** | 30.1.1 | Test runner |
| **@testing-library/react** | 16.3.0 | React testing utilities |
| **@testing-library/jest-dom** | 6.8.0 | Custom matchers |
| **jest-environment-jsdom** | 30.1.1 | DOM environment |
| **mockdate** | 3.0.5 | Date mocking |

**Test Utilities**:
```typescript
// Component testing
import { render, screen, fireEvent } from '@testing-library/react';

test('button renders correctly', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

---

## API & HTTP

### HTTP Clients

| Package | Version | Purpose |
|---------|---------|---------|
| **superagent** | 10.2.0 | HTTP client (legacy) |
| **node-fetch** | 3.3.2 | Fetch polyfill |

**API Architecture**:
- `@keboola/api-client` package wraps HTTP calls
- Type-safe clients for all services
- Automatic retry logic
- Request/response interceptors

---

## Authentication & Security

| Package | Version | Purpose |
|---------|---------|---------|
| **@azure/msal-browser** | 3.0.1 | Microsoft auth (Azure AD) |
| **dompurify** | 3.2.6 | XSS protection |

**Authentication Flow**:
1. User enters credentials
2. Backend returns storage token
3. Token stored in localStorage
4. Token sent in `X-StorageApi-Token` header
5. OAuth2 for third-party integrations

---

## Third-Party Integrations

### Payment Processing

| Package | Version | Purpose |
|---------|---------|---------|
| **@stripe/stripe-js** | 7.3.0 | Stripe client |
| **@stripe/react-stripe-js** | 3.7.0 | React Stripe components |

**Usage**: PAYG billing module

### Analytics & Monitoring

| Package | Version | Purpose |
|---------|---------|---------|
| **@sentry/react** | 10.17.0 | Error tracking |
| **@gooddata/sdk-ui-dashboard** | 10.42.0 | Embedded dashboards |
| **react-product-fruits** | 2.2.61 | User onboarding |

### Other Integrations

| Package | Version | Purpose |
|---------|---------|---------|
| **react-dropbox-chooser** | 0.0.5 | Dropbox file picker |
| **canvas-confetti** | 1.6.0 | Celebration animations |

---

## Development Tools

### Linting & Formatting

| Package | Version | Purpose |
|---------|---------|---------|
| **eslint** | 9.34.0 | JavaScript linter |
| **prettier** | 3.6.2 | Code formatter |
| **stylelint** | 16.10.0 | CSS linter |
| **@tanstack/eslint-plugin-query** | 5.60.1 | TanStack Query linting |

**ESLint Plugins**:
- Import alias validation
- React hooks rules
- TypeScript rules
- TanStack Query best practices

### Monorepo Management

| Package | Version | Purpose |
|---------|---------|---------|
| **turbo** | 2.5.6 | Monorepo build system |
| **syncpack** | 13.0.4 | Dependency version sync |
| **knip** | 5.39.1 | Find unused dependencies |

**Turbo Features**:
- Parallel builds
- Incremental builds
- Smart caching
- Remote caching support

---

## Package Manager

### Yarn 4 (Berry)

**Version**: 4.5.3

**Features**:
- Plug'n'Play (PnP) mode
- Zero-installs (optional)
- Workspace support
- Built-in TypeScript support

**Workspace Structure**:
```json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

**Commands**:
```bash
# Development
yarn dev --filter=@keboola/kbc-ui

# Build all packages
yarn build

# Run tests
yarn test

# Type checking
yarn type-check

# Linting
yarn lint
```

---

## Version Compatibility Matrix

| Tool | Version | Requirement |
|------|---------|-------------|
| Node.js | 22.x | Required |
| Yarn | 4.5.3 | Required |
| TypeScript | 5.9.3 | Required |
| React | 18.3.1 | Required |
| Rspack | 1.5.2+ | Required |

**Browser Support**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Dependency Analysis

### Bundle Size Contributors

**Largest Dependencies**:
1. React ecosystem (~200KB)
2. @gooddata/sdk-* (~150KB)
3. @xyflow/react (~100KB)
4. d3 libraries (~80KB)
5. codemirror (~70KB)

### Optimization Opportunities

**Tree Shaking**:
- Lodash → lodash-es or individual imports
- Moment.js → dayjs (already done)
- Underscore → modern alternatives

**Code Splitting**:
- Each module lazy-loaded
- Design system tree-shaken
- Vendor chunks separated

---

## Future Technology Considerations

**Potential Upgrades** (from MODERNIZATION_ASSESSMENT.md):

1. **Next.js 14+** - For better SSR and routing
2. **Vite** - Alternative to Rspack (faster HMR)
3. **React Query v6** - When available
4. **CodeMirror 6** - Full migration from CM5
5. **Tailwind v4** - Oxide engine (faster)

**Migration Priorities**:
1. Complete Flux → TanStack Query
2. Bootstrap 3 → Complete design system migration
3. CodeMirror 5 → CodeMirror 6
4. Class components → Hooks

---

## Cross-References

**Architecture**: `docs/01-overview/architecture-overview.md`

**State Management Details**: `docs/01-overview/state-management-patterns.md`

**Module Documentation**: `docs/02-modules/` (49 files)

**Component Library**: `docs/04-components/` (Design system docs)

**API Clients**: `docs/06-api-contracts/api-clients.md`

---

## Summary

The Keboola UI uses a **modern, type-safe technology stack** with:

1. **React 18.3** with TypeScript 5.9 for type safety
2. **Mixed state management** (Flux → TanStack Query migration)
3. **Rspack** for fast, efficient builds
4. **Radix UI + Tailwind** for accessible, customizable components
5. **Monorepo architecture** with Yarn 4 workspaces

**Strengths**:
- Full TypeScript coverage
- Modern build tools (Rspack, SWC)
- Comprehensive component library
- Performance-focused (virtual scrolling, code splitting)

**Technical Debt**:
- Legacy Flux + Immutable.js (40% of code)
- Bootstrap 3 (being replaced)
- Mixed state patterns (needs consolidation)

---

**Last Updated**: 2025-10-19 (Phase 4)
**Package Versions**: From `package.json` analysis
**Related Documents**:
- `docs/01-overview/architecture-overview.md`
- `docs/01-overview/state-management-patterns.md`
- `docs/MODERNIZATION_ASSESSMENT.md`
