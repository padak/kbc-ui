# API Contracts Documentation Index

Complete documentation of all API clients, patterns, and utilities in the `@keboola/api-client` package.

## Start Here

**New to the API client?** Start with [README.md](./README.md) for a quick overview and service discovery explanation.

**Need a specific client?** Jump to [api-clients.md](./api-clients.md) for complete reference documentation.

**Learning the patterns?** Read [api-patterns.md](./api-patterns.md) for architecture and implementation details.

**Want the big picture?** Check [ANALYSIS_SUMMARY.md](./ANALYSIS_SUMMARY.md) for high-level analysis and findings.

---

## Documentation Files

### 1. README.md (294 lines)

**Quick Reference Guide** - Start here!

Contains:
- Package overview
- Client list with descriptions
- Quick reference section
- Basic usage patterns
- Service discovery explanation
- Architecture diagrams
- Key concepts
- Links to detailed documentation

**Read when:** You need a quick reference or overview

---

### 2. api-clients.md (1,017 lines)

**Complete API Client Reference** - The detailed guide

Documents all 14 clients:

**Core Infrastructure:**
- Storage Client (7 sub-modules: files, tables, branches, workspaces, mergeRequests, jobs, componentsAndConfigurations)
- Management Client (3 sub-modules: projects, features, users)
- Encryption Client
- Verify Client

**AI & Chat:**
- Chat Client (with streaming support)
- Data Science Client

**Data & Query:**
- Query Service Client
- Editor Client (with SQL sessions)
- Queue Client

**Security & Configuration:**
- Vault Client (with variable scoping)
- Sync Actions Client (Git Repository module)

**Infrastructure:**
- Sandboxes Client (with auto-pagination)
- Metastore Client (Repository & Schema modules)
- Telemetry Client (Provisioning module)

Each client includes:
- File location
- Base URL and endpoint
- Authentication method
- Complete method signatures
- Request/response types (TypeScript)
- Sub-module documentation
- Examples and usage notes

**Read when:** You need to:
- Find a specific client method
- Understand request/response types
- See type signatures
- Learn about sub-modules
- Get examples of usage

---

### 3. api-patterns.md (1,054 lines)

**Architecture, Patterns & Utilities** - Deep dive guide

Covers 9 major sections:

1. **Fetch Client Architecture**
   - Core components and lifecycle
   - HTTP methods and request building
   - Response parsing and error handling

2. **Middleware System**
   - Middleware function types
   - Chain execution pattern
   - Built-in middlewares (callbacks, auth)
   - Custom middleware examples

3. **Error Handling**
   - Error class hierarchy (ApiError, UserError, ManagementClientAuthError)
   - Error detection utilities
   - Validation status functions
   - Error handling patterns

4. **Authentication**
   - Token types and verification
   - Management token refresh flow (with diagram)
   - Session management
   - Header constants

5. **Type System**
   - Generic type parameters
   - Generic vs OpenAPI-typed clients
   - Type safety levels

6. **OpenAPI Integration**
   - Type extraction utilities
   - Schema definitions
   - Type generation process
   - Examples

7. **React Integration**
   - useApiClient hook
   - ApiClientProvider component
   - Context initialization
   - Usage patterns

8. **Utilities**
   - HTTP headers and content types
   - Response parsing
   - URL serialization
   - Polling utilities
   - Abort signals

9. **Common Patterns**
   - Sub-module factory pattern
   - Pagination handling
   - Generic type specialization
   - Streaming configuration
   - Best practices

**Read when:** You need to:
- Understand the architecture
- Implement custom middleware
- Handle errors properly
- Work with authentication
- Learn best practices
- Implement advanced patterns

---

### 4. ANALYSIS_SUMMARY.md (536 lines)

**High-Level Analysis** - Strategic overview

Contains:
- Executive summary and statistics
- Client analysis table (14 clients)
- Layered architecture diagram
- Middleware chain visualization
- Type system analysis
- Authentication pattern flows
- Error handling hierarchy
- Service discovery pattern
- Request/response handling
- React integration overview
- Key findings (strengths, limitations)
- Special features
- Usage statistics
- Recommendations for users and maintainers
- References

**Read when:** You need to:
- Understand the big picture
- See architecture diagrams
- Review findings and limitations
- Get recommendations
- Make architectural decisions
- Compare with alternatives

---

## Quick Navigation

### By Task

**I want to use the API client in my component:**
1. Read: [README.md - Quick Reference](./README.md#quick-reference)
2. Read: [README.md - React Integration](./README.md#react-integration)
3. Reference: [api-clients.md - Client Initialization](./api-clients.md#client-initialization)

**I need to call a specific API:**
1. Reference: [api-clients.md](./api-clients.md) - Find your client
2. Look up: Method signatures and types
3. Check: Error handling in [api-patterns.md](./api-patterns.md#error-handling)

**I'm handling errors:**
1. Reference: [api-patterns.md - Error Handling](./api-patterns.md#error-handling)
2. Use: Error detection utilities
3. Check: Error handling patterns section

**I'm adding custom middleware:**
1. Read: [api-patterns.md - Middleware System](./api-patterns.md#middleware-system)
2. Check: Built-in middleware examples
3. Use: Custom middleware pattern

**I'm implementing advanced patterns:**
1. Read: [api-patterns.md - Common Patterns](./api-patterns.md#common-patterns)
2. Reference: Specific pattern section
3. Check: Best practices

**I need to understand the architecture:**
1. Start: [README.md - Architecture Diagram](./README.md#architecture-diagram)
2. Read: [ANALYSIS_SUMMARY.md - Architecture Overview](./ANALYSIS_SUMMARY.md#architecture-overview)
3. Deep dive: [api-patterns.md - Fetch Client Architecture](./api-patterns.md#fetch-client-architecture)

### By Client

**Storage Client:**
- [api-clients.md - Storage Client](./api-clients.md#storage-client)
- Sub-modules: Files, Tables, Branches, Workspaces, Merge Requests, Jobs, Components

**Chat Client:**
- [api-clients.md - Chat Client](./api-clients.md#chat-client)
- Features: History, voting, streaming configuration

**Query Service Client:**
- [api-clients.md - Query Service Client](./api-clients.md#query-service-client)
- Features: Job creation, status, results, history

**Editor Client:**
- [api-clients.md - Editor Client](./api-clients.md#editor-client)
- Features: SQL sessions, schema, query execution, table preview

**Management Client:**
- [api-clients.md - Management Client](./api-clients.md#management-client)
- Auth middleware: [api-patterns.md - createAuthMiddleware](./api-patterns.md#createauthmiddleware-management-client)
- Sub-modules: Projects, Features, Users

**For all clients:** See [api-clients.md](./api-clients.md) for complete reference

### By Concept

**Middleware:**
- Overview: [api-patterns.md - Middleware System](./api-patterns.md#middleware-system)
- Architecture: [ANALYSIS_SUMMARY.md - Middleware Chain Pattern](./ANALYSIS_SUMMARY.md#middleware-chain-pattern)
- Types: [api-patterns.md - Middleware Function Type](./api-patterns.md#middleware-function-type)

**Authentication:**
- Patterns: [api-patterns.md - Authentication](./api-patterns.md#authentication)
- Flow: [ANALYSIS_SUMMARY.md - Management Token Flow](./ANALYSIS_SUMMARY.md#management-token-flow)
- Examples: [api-patterns.md - Management Token Refresh Flow](./api-patterns.md#management-token-refresh-flow)

**Error Handling:**
- Classes: [api-patterns.md - Error Types](./api-patterns.md#error-types)
- Hierarchy: [ANALYSIS_SUMMARY.md - Error Class Hierarchy](./ANALYSIS_SUMMARY.md#error-class-hierarchy)
- Patterns: [api-patterns.md - Error Handling Pattern](./api-patterns.md#error-handling-pattern)

**Types:**
- System: [api-patterns.md - Type System](./api-patterns.md#type-system)
- OpenAPI: [api-patterns.md - OpenAPI Integration](./api-patterns.md#openapi-integration)
- Analysis: [ANALYSIS_SUMMARY.md - Type System Analysis](./ANALYSIS_SUMMARY.md#type-system-analysis)

**Service Discovery:**
- Concept: [README.md - Service Discovery](./README.md#service-discovery)
- Pattern: [ANALYSIS_SUMMARY.md - Service Discovery Pattern](./ANALYSIS_SUMMARY.md#service-discovery-pattern)
- Stack Info: [api-clients.md - getStackInfo](./api-clients.md#getstackinfoquery-getstackinfoquery-signal-abortsignal)

---

## Search Guide

Find topics across all documentation:

```bash
# Search for a specific client
grep -n "^## .* Client" *.md

# Search for middleware patterns
grep -in "middleware" *.md | head -20

# Search for error handling
grep -in "error\|exception" *.md | head -20

# Search for authentication
grep -in "auth\|token" *.md | head -20

# Search for React integration
grep -in "react\|useApiClient\|provider" *.md | head -20

# Find all examples
grep -n "^// \|^```" *.md | head -30
```

---

## Statistics

| Document | Lines | Purpose |
|----------|-------|---------|
| README.md | 294 | Quick reference and overview |
| api-clients.md | 1,017 | Complete client reference |
| api-patterns.md | 1,054 | Architecture and patterns |
| ANALYSIS_SUMMARY.md | 536 | High-level analysis |
| **TOTAL** | **2,901** | **Complete documentation** |

---

## Key Takeaways

### Architecture
- Layered design: React → ApiClient → Service Clients → Fetch Client → Fetch API
- Middleware chain pattern for request/response interception
- Service discovery through stack info
- OpenAPI type integration for type safety

### Clients
- 14 specialized clients for different services
- Each with focused responsibilities
- Some with sub-modules for related operations
- Automatic pagination and session management in some cases

### Patterns
- Factory pattern for client creation
- Middleware for cross-cutting concerns
- Error normalization and handling
- Type-safe URL paths via OpenAPI
- React context for global access

### Authentication
- Storage API token for most services
- Management API token with auto-refresh
- Session token creation (dev vs prod)
- Token verification utilities

### Best Practices
- Always handle AbortSignal for cancellation
- Use callback middleware for monitoring
- Prefer OpenAPI-typed clients
- Validate custom data before operations
- Close resources when done (sessions)

---

## Related Resources

- [CLAUDE.md](../../CLAUDE.md) - Project structure and development guidelines
- `packages/api-client/` - Source code directory
- `packages/api-client/src/clients/` - Individual client implementations
- `packages/api-client/src/fetchClient/` - Core fetch client

---

## Document Management

**Created:** October 18, 2025
**Total Content:** 2,901 lines across 4 comprehensive markdown files
**Coverage:** 100% of API client modules
**Quality:** Production-ready documentation with examples

**Maintenance:** Update when:
- New clients are added
- Existing client APIs change
- Architecture patterns evolve
- Best practices are discovered

---

## Navigation

[← Back to docs](../) | [View README →](./README.md) | [View API Clients →](./api-clients.md) | [View Patterns →](./api-patterns.md) | [View Summary →](./ANALYSIS_SUMMARY.md)
