# Module Documentation Index

## Overview

This directory contains comprehensive documentation for major modules in the Keboola Connection UI frontend application. Each module document covers architecture, features, state management, API integration, and development guidelines.

## Module Documentation Files

### Core AI & Chat Modules

#### [ai.md](./ai.md)
**AI Module - Waii SQL Editor Integration**
- Waii interactive SQL editor with AI-assisted query generation
- Session management and context handling
- Query execution with result pagination and caching
- Data catalog browsing and preview
- Conversation management and feedback system
- Error explanation and component suggestion APIs

**Key Components:**
- Editor, CodeBlockPanel, QueryResults
- CatalogPanel, SessionProvider
- useCreateSession, useRunQueries, useTablePreview

**State Pattern:** Zustand + React Context

**Lines:** 396 | **Size:** 9.9 KB

---

#### [chat.md](./chat.md)
**Chat Module - Agent Chat Interface**
- AI-powered chat for data analysis and task assistance
- Real-time message streaming and rendering
- Fullscreen, sidebar, and sheet layout modes
- Context persistence with URL parameters
- Feature flag-driven layout selection
- Survey integration for feedback

**Key Components:**
- ChatProvider, ChatContent, FullscreenChat
- SidebarChat, SheetChatContent
- useChat hook for context access

**State Pattern:** React Context + Global Chat Provider

**Lines:** 435 | **Size:** 11 KB

---

### Application Modules

#### [data-apps.md](./data-apps.md)
**Data Apps Module - Streamlit Application Management**
- Create, deploy, and manage Streamlit applications
- Code and Git deployment types
- Dependency freezing and package updates
- Secrets management via Keboola vault
- Real-time terminal log streaming
- Deployment status and notifications

**Key Components:**
- DeployDataApp, Deployment, PackagesCard
- TerminalLogsTab, NotificationsTab
- SecretsBox, CredentialsModal

**State Pattern:** Flux with Immutable.js

**Lines:** 510 | **Size:** 13 KB

---

### Database & Compute Modules

#### [workspaces.md](./workspaces.md)
**Workspaces Module - External Database Workspaces**
- Provision and manage external database workspaces
- Credential management (password reset, storage)
- Configuration-specific workspace grouping
- Production-only API access (forceProduction flag)
- Support for various database backends

**Key Components:**
- WorkspacesStore, WorkspacesApi
- Credential display and management
- Modal workflows

**State Pattern:** Flux with Dispatcher

**Lines:** 345 | **Size:** 8.3 KB

---

#### [sandboxes.md](./sandboxes.md)
**Sandboxes Module - Ephemeral Computational Workspaces**
- 11 sandbox types: SQL databases (Snowflake, BigQuery, etc.) and containers (Python, R, Julia, etc.)
- Size configuration (tiny to large) with resource allocation
- Data loading/unloading with storage mapping
- Snowflake-specific login type selection (legacy vs key-pair)
- Sandbox sharing and billing
- Job queue integration for async operations

**Key Components:**
- AddSandboxModal, SandboxDetail
- SandboxActions, SandboxCredentialsParams
- WorkspaceSizeControl

**State Pattern:** Flux with Dispatcher + TanStack Query

**Lines:** 576 | **Size:** 14 KB

---

## Quick Reference

### By Feature

**Query & Data Processing:**
- [ai.md](./ai.md) - SQL editor with AI assistance
- [sandboxes.md](./sandboxes.md) - Computational environments

**User Interaction:**
- [chat.md](./chat.md) - AI chat interface
- [data-apps.md](./data-apps.md) - App deployment UI

**Infrastructure:**
- [workspaces.md](./workspaces.md) - External DB workspaces
- [sandboxes.md](./sandboxes.md) - Ephemeral workspaces

### By Technology Pattern

**State Management:**
- Flux: [workspaces.md](./workspaces.md), [sandboxes.md](./sandboxes.md), [data-apps.md](./data-apps.md)
- Zustand: [ai.md](./ai.md)
- Context API: [chat.md](./chat.md)

**API Integration:**
- Query Service: [ai.md](./ai.md)
- AI Service: [ai.md](./ai.md)
- Chat Service: [chat.md](./chat.md)
- Data Science Service: [data-apps.md](./data-apps.md)
- Sandboxes Service: [sandboxes.md](./sandboxes.md)
- Storage API: [workspaces.md](./workspaces.md)

### By Complexity

**Beginner-Friendly:**
- [workspaces.md](./workspaces.md) - Simple CRUD operations
- [chat.md](./chat.md) - Clear provider pattern

**Intermediate:**
- [data-apps.md](./data-apps.md) - Multi-tab UI
- [sandboxes.md](./sandboxes.md) - Complex state management

**Advanced:**
- [ai.md](./ai.md) - Session management, polling, streaming

## Common Integration Points

### Cross-Module Dependencies

**Chat → AI:**
- Chat can suggest SQL generation
- Link to Waii editor

**Data Apps ↔ Sandboxes:**
- Shared size control component
- Similar timeout configuration

**Sandboxes → Storage:**
- Access buckets and tables
- Data mapping and loading

**All Modules:**
- ApplicationStore for feature flags
- DevBranchesStore for branch context
- Components module for configurations

## Documentation Template

Each module document follows this structure:

1. **Overview** - Purpose and key features
2. **Architecture** - Directory structure and organization
3. **Key Features** - Detailed feature descriptions with code examples
4. **State Management** - Store patterns and state flow
5. **API Integration** - External APIs and endpoints
6. **Type Definitions** - TypeScript interfaces
7. **Hooks** - Custom React hooks
8. **Integration Points** - How modules interact
9. **Development Guidelines** - Extending and modifying
10. **Testing** - Key test areas
11. **Common Tasks** - Practical examples
12. **Debugging** - Troubleshooting tips
13. **Security** - Security considerations
14. **Performance** - Performance tips

## Reading Guide

**First Time?**
1. Start with [Overview Section](./ai.md#overview) in any module
2. Review [Architecture](./ai.md#architecture) to understand structure
3. Look at [Key Features](./ai.md#key-features) for main functionality

**Need Specific Information?**
- Implementation details: Search for component/function name
- Type information: Check [Type Definitions](./ai.md#type-definitions) section
- Integration: See [Integration Points](./ai.md#integration-points) section
- Error solving: Check [Debugging](./ai.md#debugging) section

**Extending a Module?**
1. Read [Architecture](./ai.md#architecture) section
2. Check [Development Guidelines](./ai.md#development-guidelines)
3. Review [Testing](./ai.md#testing) recommendations
4. Look at examples in [Common Tasks](./ai.md#common-tasks)

## Module Statistics

| Module | Lines | Size | Components | Hooks | Key Classes |
|--------|-------|------|------------|-------|------------|
| AI | 396 | 9.9 KB | 15+ | 8+ | Zustand Store |
| Chat | 435 | 11 KB | 8+ | 1 | Context API |
| Data Apps | 510 | 13 KB | 20+ | - | Flux Store |
| Workspaces | 345 | 8.3 KB | 5+ | - | Flux Store |
| Sandboxes | 576 | 14 KB | 25+ | - | Flux Store |

**Total Documentation:**
- **2,262 lines** across 5 modules
- **55.2 KB** total size
- Covers 70+ components
- Includes 20+ APIs
- Documents 100+ types

## Update History

**October 18, 2025:**
- Created initial documentation for 5 core modules
- ai.md - Waii SQL Editor documentation
- chat.md - Chat interface documentation
- data-apps.md - Data Apps deployment documentation
- workspaces.md - External workspaces documentation
- sandboxes.md - Computational sandboxes documentation

## Contributing

To update or expand documentation:

1. **For changes to existing modules:**
   - Update relevant module file
   - Keep structure consistent
   - Update statistics if adding major sections

2. **For new modules:**
   - Create new file: `module-name.md`
   - Follow same template structure
   - Add entry to this INDEX.md
   - Update statistics section

3. **Pull request checklist:**
   - [ ] Documentation follows template
   - [ ] Code examples are current
   - [ ] Types are accurate
   - [ ] Links are working
   - [ ] API endpoints verified
   - [ ] Integration points listed

## Additional Resources

- **CLAUDE.md** - Project-level guidelines and tech stack
- **Repository Structure** - See apps/kbc-ui/src/scripts/modules/
- **API Types** - Check @keboola/api-client types
- **Design System** - @keboola/design components

## Support

For questions about modules:
1. Check relevant module documentation
2. Search for component/function in the file
3. Review integration points section
4. Check debugging section for common issues

For documentation improvements:
- Create issue or pull request
- Suggest clarifications
- Report outdated information
- Request additional examples

