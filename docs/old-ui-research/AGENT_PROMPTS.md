# Agent Prompts for Code Analysis

This document contains the prompts for parallel agent analysis of the Keboola UI codebase.

## Agent Template

Each agent should produce markdown documentation following this structure:

```markdown
# Module: [Module Name]

## Overview
Brief description of what this module does and its role in the application.

## File Structure
```
module-name/
├── routes.tsx
├── components/
├── api.ts
├── store.ts (if Flux)
└── ...
```

## Routes
| Path | Component | Description |
|------|-----------|-------------|
| ... | ... | ... |

## Key Components
### ComponentName
- **Location**: `path/to/Component.tsx`
- **Purpose**: What it does
- **Props**: Key props
- **State**: How it manages state

## API Endpoints
| Method | Endpoint | Purpose | Response Type |
|--------|----------|---------|---------------|
| ... | ... | ... | ... |

## State Management
- **Pattern Used**: Flux / TanStack Query / Zustand / React State
- **Key Stores/Queries**: List of stores or query keys
- **Data Flow**: How data flows through the module

## Dependencies
### Internal
- List of other modules this depends on

### External
- Key npm packages used

## Notable Patterns
- Any interesting implementation details
- Complex logic
- Performance optimizations
- Legacy code that might need refactoring

## User-Facing Features
- What can users do in this module?
- What are the key workflows?

## Technical Debt & Observations
- Legacy patterns
- Areas that could be improved
- Complexity hotspots
```

---

## Group A: Core Features

### Agent 1: Core Admin & Settings
**Modules to analyze**: `admin`, `settings`, `home`

**Specific focus**:
- User management and privileges
- Project settings and configuration
- Dashboard layout and widgets
- Home page components

**Prompt**:
```
Analyze the following modules in apps/kbc-ui/src/scripts/modules/:
- admin/
- settings/
- home/

For each module, document:
1. All routes and their handlers
2. Key React components and their hierarchy
3. API calls made (check api.ts, actions.ts, hooks)
4. State management approach (check store.ts, TanStack Query usage)
5. User capabilities (what can users do?)
6. Any admin-only features

Pay special attention to:
- Privilege system in admin/
- Settings tabs and configuration options
- Dashboard widgets and customization

Output: Three markdown files (admin.md, settings.md, home.md) in the format specified above.
```

---

### Agent 2: Storage & Data Browser
**Modules to analyze**: `storage`, `bucket-browser`, `table-browser`

**Specific focus**:
- Storage bucket operations
- Table browsing and querying
- Data preview and export
- Schema management

**Prompt**:
```
Analyze the following modules in apps/kbc-ui/src/scripts/modules/:
- storage/
- bucket-browser/
- table-browser/

For each module, document:
1. All routes and navigation patterns
2. Key components (tables, modals, forms)
3. Storage API calls (list, create, delete, export)
4. Data preview mechanisms
5. Schema editing capabilities
6. File upload/download flows

Pay special attention to:
- Table rendering and virtualization
- Export modal and options
- Data sampling strategies
- Row deletion workflows

Output: Three markdown files in the format specified above.
```

---

### Agent 3: Flows & Orchestrations
**Modules to analyze**: `flows-v2`, `flows`, `orchestrations-v2`

**Specific focus**:
- Flow builder UI
- Flow execution and monitoring
- Orchestration scheduling
- Legacy vs new implementation

**Prompt**:
```
Analyze the following modules in apps/kbc-ui/src/scripts/modules/:
- flows-v2/ (current implementation)
- flows/ (legacy)
- orchestrations-v2/

For each module, document:
1. Route structure
2. Flow builder components and canvas
3. Flow execution logic
4. Scheduling configuration
5. Differences between v2 and legacy

Pay special attention to:
- Flow builder canvas implementation
- Node types and configurations
- Execution monitoring
- Schedule configuration UI

Output: Three markdown files in the format specified above.
```

---

### Agent 4: Transformations
**Modules to analyze**: `transformations-v2`, `legacy-transformation`

**Specific focus**:
- SQL/Python/R transformations
- Code editor integration
- Input/output mapping
- Transformation execution

**Prompt**:
```
Analyze the following modules in apps/kbc-ui/src/scripts/modules/:
- transformations-v2/
- legacy-transformation/

For each module, document:
1. Routes and page structure
2. Code editor components (CodeMirror integration)
3. Input/output mapping UI
4. Transformation types (SQL, Python, R, dbt)
5. Execution and monitoring
6. Differences between v2 and legacy

Pay special attention to:
- Code editor features (syntax highlighting, autocomplete)
- Mapping configuration UI
- Backend selection
- Sandbox integration

Output: Two markdown files in the format specified above.
```

---

### Agent 5: AI, Chat, Workspaces & Data Apps
**Modules to analyze**: `ai`, `chat`, `data-apps`, `workspaces`, `sandboxes`

**Specific focus**:
- AI SQL generation (Waii)
- Chat interface
- Workspace management
- Data app deployment

**Prompt**:
```
Analyze the following modules in apps/kbc-ui/src/scripts/modules/:
- ai/ (especially ai/waii/)
- chat/
- data-apps/
- workspaces/
- sandboxes/

For each module, document:
1. Routes and UI structure
2. Key components
3. API integrations (especially AI APIs)
4. State management
5. User workflows

Pay special attention to:
- AI SQL editor components and query execution
- Chat message handling and streaming
- Workspace creation and credential management
- Data app deployment process
- Sandbox types and provisioning

Output: Five markdown files in the format specified above.
```

---

## Group B: Extractors

### Agent 6: Database Extractors
**Modules to analyze**: `ex-db-generic`, `ex-mongodb`

**Prompt**:
```
Analyze the following extractor modules in apps/kbc-ui/src/scripts/modules/:
- ex-db-generic/
- ex-mongodb/

For each module, document:
1. Configuration UI structure
2. Credentials management
3. Table selection and filtering
4. Query builder (if applicable)
5. Incremental loading configuration
6. Shared patterns vs specific implementations

Pay special attention to:
- Database connection testing
- Credential encryption
- Query configuration
- Incremental fetch settings

Output: Two markdown files in the format specified above.
```

---

### Agent 7: Google Extractors
**Modules to analyze**: `ex-google-analytics-v4`, `ex-google-drive`, `ex-google-sheets`, `ex-google-ads`

**Prompt**:
```
Analyze Google extractor modules in apps/kbc-ui/src/scripts/modules/:
- ex-google-analytics-v4/
- ex-google-drive/ (if exists)
- ex-google-sheets/ (if exists)
- ex-google-ads/ (if exists)

For each module, document:
1. OAuth integration
2. Configuration UI
3. Resource selection (accounts, properties, files)
4. Data extraction options
5. Scheduling and incremental loading

Pay special attention to:
- OAuth flow
- Account/property picker UI
- Metric/dimension selection
- Date range configuration

Output: Markdown files for each module found.
```

---

### Agent 8: Cloud Storage Extractors
**Modules to analyze**: `ex-facebook`, `ex-aws-s3`, `ex-azure-blob`, `ex-ftp`

**Prompt**:
```
Analyze cloud storage and social media extractors in apps/kbc-ui/src/scripts/modules/:
- ex-facebook/
- ex-aws-s3/
- ex-azure-blob/ (if exists)
- ex-ftp/ (if exists)

For each module, document:
1. Authentication/authorization
2. File/object selection
3. Configuration options
4. Data parsing (CSV, JSON, etc.)
5. Incremental loading

Pay special attention to:
- Facebook OAuth and permissions
- S3 bucket browsing
- File format configuration
- Path patterns

Output: Markdown files for each module found.
```

---

### Agent 9: Generic & HTTP Extractors
**Modules to analyze**: `ex-http`, `ex-generic`, `ex-storage`, `ex-email-attachments`

**Prompt**:
```
Analyze generic and utility extractors in apps/kbc-ui/src/scripts/modules/:
- ex-http/
- ex-generic/
- ex-storage/
- ex-email-attachments/ (if exists)

For each module, document:
1. Configuration schema
2. UI generation from schema
3. Generic vs specific patterns
4. Advanced configuration options

Pay special attention to:
- ex-generic pattern (how it generates UI from config schema)
- HTTP request configuration
- Authentication types
- Response parsing

Output: Markdown files for each module found.
```

---

### Agent 10: Other Extractors
**Modules to analyze**: Any remaining extractors (ex-*)

**Prompt**:
```
Find and analyze all remaining extractor modules (ex-*) in apps/kbc-ui/src/scripts/modules/ that haven't been covered by other agents.

For each module, document:
1. Purpose and data source
2. Configuration UI
3. Authentication method
4. Unique features
5. Shared patterns

Output: Markdown files for each module found, following the template.
```

---

## Group C: Writers & Infrastructure

### Agent 11: Database Writers
**Modules to analyze**: `wr-db`, `wr-google-bigquery-v2`

**Prompt**:
```
Analyze database writer modules in apps/kbc-ui/src/scripts/modules/:
- wr-db/
- wr-google-bigquery-v2/

For each module, document:
1. Configuration UI
2. Credentials management
3. Table creation options
4. Write mode configuration (append, overwrite, incremental)
5. Column mapping

Pay special attention to:
- Database connection UI
- Table schema configuration
- Primary key setup
- Incremental update logic

Output: Two markdown files in the format specified above.
```

---

### Agent 12: Other Writers
**Modules to analyze**: `wr-google-sheets`, `wr-google-drive`, `wr-aws-s3`, `wr-onedrive`, remaining writers

**Prompt**:
```
Analyze remaining writer modules (wr-*) in apps/kbc-ui/src/scripts/modules/:
- wr-google-sheets/
- wr-google-drive/
- wr-aws-s3/ (if exists)
- wr-onedrive/ (if exists)
- Any other wr-* modules

For each module, document:
1. Purpose and destination
2. OAuth/authentication
3. Destination selection (folder, file, sheet)
4. Data formatting options
5. Write mode configuration

Output: Markdown files for each module found.
```

---

### Agent 13: Component Infrastructure
**Modules to analyze**: `components`, `configurations`, `oauth-v2`

**Prompt**:
```
Analyze infrastructure modules in apps/kbc-ui/src/scripts/modules/:
- components/ (shared component logic)
- configurations/
- oauth-v2/

For each module, document:
1. Shared utilities and helpers
2. Generic configuration patterns
3. OAuth flow implementation
4. Component metadata handling
5. Configuration versioning

Pay special attention to:
- Generic component UI patterns
- Configuration copy/delete flows
- OAuth authorization flow
- Component registration

Output: Three markdown files in the format specified above.
```

---

### Agent 14: Queue, Billing & Notifications
**Modules to analyze**: `queue`, `billing`, `notifications`, `trash`

**Prompt**:
```
Analyze system modules in apps/kbc-ui/src/scripts/modules/:
- queue/ (job management)
- billing/
- notifications/
- trash/

For each module, document:
1. Routes and UI structure
2. Job monitoring and cancellation (queue)
3. Billing information display
4. Notification system
5. Trash recovery

Pay special attention to:
- Job detail views
- Real-time updates
- Billing credit display
- Notification types and triggers
- Trash recovery workflow

Output: Four markdown files in the format specified above.
```

---

### Agent 15: Lineage, Catalog & Telemetry
**Modules to analyze**: `lineage`, `data-catalog`, `telemetry`

**Prompt**:
```
Analyze analytics and metadata modules in apps/kbc-ui/src/scripts/modules/:
- lineage/
- data-catalog/
- telemetry/

For each module, document:
1. Visualization components
2. Graph rendering (lineage)
3. Catalog search and browsing
4. Telemetry dashboards
5. Data fetching strategies

Pay special attention to:
- Lineage graph implementation
- Node and edge rendering
- Catalog filtering and search
- Dashboard embedding

Output: Three markdown files in the format specified above.
```

---

## Design System Analysis

### Agent 16: Component Inventory
**Focus**: `packages/design/`

**Prompt**:
```
Analyze the design system in packages/design/:

1. List all components in packages/design/src/components/
2. For each component, document:
   - Component name
   - File location
   - Props interface
   - Variants (if using CVA)
   - Dependencies (Radix UI, etc.)
   - Usage examples from Storybook

3. Identify component categories:
   - Form components
   - Layout components
   - Feedback components
   - Navigation components
   - Code editor components

4. Document utility functions in utils/
5. Document styling approach (Tailwind, CVA)
6. Find usage patterns in kbc-ui

Output:
- components-inventory.md (complete component catalog)
- design-system-patterns.md (common patterns and guidelines)
```

---

## API Client Analysis

### Agent 17: API Contracts
**Focus**: `packages/api-client/`

**Prompt**:
```
Analyze the API client in packages/api-client/:

1. Document all client modules:
   - storage client
   - chat client
   - editor client (new)
   - query service client
   - sync actions client
   - telemetry client
   - AI client (if exists)

2. For each client, document:
   - Base URL / endpoint
   - Available methods
   - Request/response types
   - Error handling
   - Authentication approach

3. Find schema definitions in __generated__/schema.d.ts files
4. Document common patterns (createFetchClient usage)
5. Identify WebSocket usage

Output:
- api-clients.md (complete API documentation)
- api-patterns.md (common patterns and utilities)
```

---

## Summary

- **17 agents total**
- **Group A** (5 agents): Core features
- **Group B** (5 agents): Extractors
- **Group C** (5 agents): Writers & infrastructure
- **Design System** (1 agent): Component inventory
- **API Client** (1 agent): API contracts

Each agent produces structured markdown documentation that will be stored in the appropriate docs/ subdirectory.
