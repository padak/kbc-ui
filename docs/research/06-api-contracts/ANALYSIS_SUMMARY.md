# API Client Analysis Summary

Complete analysis of the Keboola API client package (`@keboola/api-client`) architecture, implementations, and patterns.

**Analysis Date:** October 18, 2025
**Package Location:** `packages/api-client/`
**Documentation:** 3 comprehensive markdown files (2,071 lines total)

## Executive Summary

The `@keboola/api-client` package provides a lightweight, middleware-based HTTP client infrastructure with 14 specialized API clients for interacting with Keboola's microservices. The architecture emphasizes type safety through OpenAPI integration, automatic token management, and clean separation of concerns.

### Key Statistics

- **14 API Clients Documented**
- **2+ Fetch Client Implementations** (Generic + OpenAPI-typed)
- **Middleware System** with built-in auth & callback support
- **100% TypeScript** with strict mode
- **OpenAPI Integration** via openapi-typescript package
- **Zero WebSocket Usage** (chat supports server-sent events)
- **React Integration** via Context API

## Analyzed Clients

### Core Infrastructure Clients

| Client | Location | Purpose | Auth | Base URL |
|--------|----------|---------|------|----------|
| Storage | `clients/storage/` | File, table, branch, workspace operations | Token | `{baseUrl}/v2/storage` |
| Management | `clients/management/` | Projects, features, users | Token + Middleware | `{baseUrl}/manage` |
| Encryption | `clients/encryption/` | Data encryption for secrets | None | Service URL |
| Verify | `clients/verify/` | Token validation utilities | Token | Provided parameter |

### AI & Chat Clients

| Client | Location | Purpose | Auth | Base URL |
|--------|----------|---------|------|----------|
| Chat | `clients/chat/` | AI chat, history, voting | Token + URL | Service URL + `/api` |
| DataScience | `clients/dataScience/` | App logs, configuration | Token | Service URL |

### Data & Query Clients

| Client | Location | Purpose | Auth | Base URL |
|--------|----------|---------|------|----------|
| QueryService | `clients/queryService/` | SQL queries, results | Token | Service URL |
| Editor | `clients/editor/` | SQL sessions, schema | Token | Service URL |
| Queue | `clients/queue/` | Job queue status | Token | Service URL |

### Security & Configuration

| Client | Location | Purpose | Auth | Base URL |
|--------|----------|---------|------|----------|
| Vault | `clients/vault/` | Variables, secrets | Token | Service URL |
| SyncActions | `clients/syncActions/` | MFA, git operations | Token | Service URL |

### Infrastructure & Services

| Client | Location | Purpose | Auth | Base URL |
|--------|----------|---------|------|----------|
| Sandboxes | `clients/sandboxes/` | Sandbox environments | Token | Service URL |
| Metastore | `clients/metastore/` | Repository, schema metadata | Token | Hardcoded canary |
| Telemetry | `clients/telemetry/` | Workspace provisioning | Token | Service URL |

## Architecture Overview

### Layered Architecture

```
┌─────────────────────────────────────────┐
│        React Integration Layer           │
│  (useApiClient hook, ApiClientProvider) │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│      ApiClient (Main Aggregator)        │
│ - Initialization & service setup        │
│ - Dynamic service discovery (getStackInfo)
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│    14 Specialized API Clients            │
│ (Storage, Chat, Editor, Vault, etc.)    │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  Fetch Client Layer                      │
│ - createGenericFetchClient (untyped)    │
│ - createOpenapiFetchClient (typed)      │
│ - Middleware chain execution            │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  Core Fetch Implementation               │
│ - HTTP method handling (GET/POST/etc)   │
│ - Request building and URL handling     │
│ - Response parsing (JSON/text)          │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│  Native Fetch API                        │
│  (Browser Fetch or Node.js compatible)  │
└──────────────────────────────────────────┘
```

### Middleware Chain Pattern

```
Request
   │
   ▼
┌─────────────────────────┐
│ Middleware 1            │
│ (Auth Middleware)       │
└────────────┬────────────┘
             │
             ▼
        ┌─────────────────────────┐
        │ Middleware 2            │
        │ (Callback Middleware)   │
        └────────────┬────────────┘
                     │
                     ▼
                ┌─────────────────────────┐
                │ ... More Middlewares    │
                └────────────┬────────────┘
                             │
                             ▼
                        ┌─────────────────────────┐
                        │ Core Fetch              │
                        │ (HTTP Request)          │
                        └────────────┬────────────┘
                                     │
                                     ▼
                        Response (with error handling)
```

## Type System Analysis

### Generic Type Parameters

All fetch methods support 4 type parameters:

```typescript
client.get<ResponseType, PathParams, QueryParams, BodyParams>()
```

### OpenAPI Type Extraction

```
OpenAPI Schema (paths['/endpoint']['method'])
    │
    ├─ OpenapiQueryType ──► Query parameter types
    ├─ OpenapiPathType ──► URL path parameter types
    ├─ OpenapiBodyType ──► Request body types
    └─ OpenapiReturnType ──► Response data types
```

### Type Safety Levels

1. **Generic Client** - Minimal type checking, string-based URLs
2. **OpenAPI Client** - Full type safety with URL constraints
3. **Specialized Clients** - Hand-crafted types for enhanced DX

## Authentication Patterns

### Token Types

- **Storage API Token** (`X-StorageApi-Token`)
  - Used by: 11 clients
  - Provides: Data and service access
  
- **Management API Token** (`X-Kbc-Manageapitoken`)
  - Used by: Management client
  - Features: Automatic validation and session creation
  - Special: Auth middleware handles refresh

### Management Token Flow

```
                 ┌─ Verify token validity
                 │
Request ────────▶│─ Token valid? ─┬─ YES ─► Continue to API
                 │               │
                 │               └─ NO
                 │                 │
                 │                 ▼
                 │         ┌─ Check environment
                 │         │
                 │         ├─ DEV: Create session token (from admin token)
                 │         └─ PROD: Create session token (via admin endpoint)
                 │
                 └─ Set token in headers
                    │
                    ▼
                Response
```

## Error Handling Architecture

### Error Class Hierarchy

```
                    Error (native)
                      │
        ├─────────────┼─────────────┤
        │             │             │
        ▼             ▼             ▼
    ApiError     UserError    ManagementClientAuthError
    │                         │
    ├─ response               ├─ userMessage
    ├─ request                └─ apiResponse
    └─ data


type FetchClientError = TypeError | ApiError | SyntaxError | DOMException;
```

### Validation Status Functions

```typescript
// Default: 200-299 is success
validStatus(apiResponse) → boolean | ApiError

// Custom: Can return specific error types
validStatus = (apiResponse) => {
  if (error401) return new ManagementClientAuthError(...);
  if (error422) return new ApiError(...);
  return response.status >= 200 && response.status <= 299;
}
```

## Service Discovery Pattern

### Dynamic Service URLs

```
Initialization:
1. Call storage.getStackInfo() with no params
2. Returns StackInfo with services[] array
3. Extract service URLs by service ID
4. Initialize all service-specific clients

Supported Services:
- vault
- data-science
- encryption
- sandboxes
- telemetry
- editor
- query
- queue
- kai-assistant (Chat)
- sync-actions
```

### StackInfo Structure

```typescript
{
  api: string;                    // API endpoint
  services: [{
    id: ServiceId;               // 'vault', 'data-science', etc.
    url: string;                 // Service URL
  }];
  features: string[];            // Available features
  components: Component[];        // Registered components
  urlTemplates: {
    orchestrationJob: string;    // URL template for jobs
  };
  // ... additional metadata
}
```

## Request Building

### URL Construction

```
Base URL: https://api.keboola.com
Endpoint: /jobs/{id}
Path params: { id: '123' }
Query params: { limit: 10 }

Result:
https://api.keboola.com/jobs/123?limit=10
```

### Request Body Handling

```
Content-Type Detection:
- application/json ─► JSON.stringify()
- multipart/form-data ─► FormData
- text/plain ─► String as-is
- undefined ─► Empty body
```

## Response Handling

### Content-Type Detection

```
Response Headers: Content-Type: application/json

1. Check status = 204? ─► Return null
2. Check Content-Type header?
   ├─ application/json ─► response.json()
   └─ Missing/other ─► Try JSON.parse(text)
                       ├─ Success ─► Return JSON
                       └─ Fail ─► Return text
```

## Pagination Strategy

### Automatic Pagination Example

```typescript
// Sandboxes client
getSandboxes(branchId) {
  1. Fetch initial page (_getSandboxes)
  2. Check nextPageToken
  3. While nextPageToken exists:
     - Fetch next page
     - Append to results
     - Update nextPageToken
  4. Return all accumulated data
}
```

## React Integration

### Context-Based API

```
┌─────────────────────────────────┐
│   App Root                      │
│ ┌───────────────────────────────┤
│ │ <ApiClientProvider value={...}│
│ │ ┌─────────────────────────────┤
│ │ │ useApiClient()              │
│ │ │ (returns initialized client)│
│ │ └─────────────────────────────┤
│ └───────────────────────────────┤
└─────────────────────────────────┘
```

### Initialization Pattern

```
1. Create ApiClient instance
2. Call init(options) with tokens
3. Connect to ApiClientProvider
4. Components use useApiClient() hook
5. All middleware/auth configured globally
```

## Key Findings

### Strengths

1. **Clean Separation** - Each service has its own client module
2. **Type Safety** - OpenAPI integration + TypeScript strict mode
3. **Extensibility** - Middleware pattern allows adding cross-cutting concerns
4. **Error Handling** - Multiple error types for different scenarios
5. **DX** - React hooks + context API for seamless integration
6. **Dynamic Discovery** - Service URLs fetched from stack info
7. **Authentication** - Automatic token management for Management API
8. **Pagination** - Transparent automatic pagination where needed

### Limitations

1. **Hardcoded Metastore URL** - Not discovered from stack info (uses canary)
2. **No WebSocket** - Chat uses server-sent events instead
3. **No Request Retry** - Retry logic must be added via middleware
4. **No Caching** - All requests hit the API (rely on TanStack Query)
5. **FormData Limited** - Basic form-data support, no multipart streaming

## Special Features

### 1. Encryption Client Integration

- Encrypts individual values: `encrypt(data)`
- Encrypts secret fields in objects: `encryptSecrets(data)` (prefix with `#`)
- Uses `KBC:` prefix for encrypted values

### 2. Chat Client Streaming

```typescript
const config = client.chat.getStreamingConfig();
// Returns:
// {
//   apiUrl: string;
//   headers: Record<string, string>;
// }
// Can be used with EventSource or WebSocket
```

### 3. Editor Client Session Pattern

```typescript
1. Create session: createSession()
2. Get schema: getSessionSchema()
3. Execute queries: createQueryJob()
4. Cleanup: unload()
```

### 4. Variable Scoping in Vault

```typescript
// All variables
getVariables(query)

// Branch-scoped variables
getVariablesByBranchId(branchId)

// Project-wide variables
getProjectWideVariables() // internally uses branchId='null'
```

## Comparison with Alternative Patterns

### vs. axios

**@keboola/api-client advantages:**
- Middleware chain instead of interceptors
- OpenAPI type generation
- Specialized clients per service
- Smaller bundle size
- Custom error handling

### vs. GraphQL

**@keboola/api-client advantages:**
- RESTful alignment with API
- Simpler for CRUD operations
- Better for microservice architecture
- No over-fetching management needed

### vs. Fetch API directly

**@keboola/api-client advantages:**
- Middleware support
- Automatic content-type handling
- Query parameter serialization
- OpenAPI type safety
- Response parsing
- Error normalization

## Usage Statistics

**Clients per Service:**
- 1 core client (Storage) with 7 sub-modules
- 8 single-responsibility clients
- 3 composite clients (Management, Metastore, Telemetry with sub-modules)
- 1 utility client (Verify)

**Middleware Usage:**
- Callback middleware: ~All clients use
- Auth middleware: Management client only
- Custom middleware: Application layer

**HTTP Methods:**
- GET: Most clients (storage, vault, chat, etc.)
- POST: All clients (create operations)
- PATCH: Some clients (updates)
- DELETE: Some clients (deletions)
- PUT: Rare usage

## Files Generated

### Documentation Created

1. **api-clients.md** (1017 lines)
   - Complete client reference
   - All 14 clients documented
   - Type signatures and examples

2. **api-patterns.md** (1054 lines)
   - Architecture and patterns
   - Error handling
   - Authentication flows
   - React integration
   - Utilities and examples

3. **README.md**
   - Overview and quick reference
   - Service discovery explanation
   - Architecture diagrams
   - Related documentation

4. **ANALYSIS_SUMMARY.md** (this file)
   - High-level analysis
   - Statistics and comparisons
   - Key findings

## Recommendations

### For Users

1. Use `ApiClientProvider` for React apps
2. Always provide `callbacks` for monitoring
3. Handle `isAbortError` for request cancellation
4. Prefer OpenAPI-typed clients when available
5. Use `isApiError` for API-specific error handling

### For Maintenance

1. Keep OpenAPI schemas in sync with APIs
2. Review middleware order when adding new middleware
3. Consider adding retry middleware for production
4. Monitor token refresh logs in Management client
5. Document any custom middleware added

### For Enhancement

1. Add request retry middleware
2. Implement response caching layer
3. Add request deduplication
4. Create GraphQL bridge if needed
5. Add request timeout utilities

## References

**Source Files:**
- `packages/api-client/src/` - Implementation
- `packages/api-client/src/fetchClient/` - Core infrastructure
- `packages/api-client/src/clients/` - Individual clients
- `packages/api-client/src/react/` - React integration

**Package Configuration:**
- `packages/api-client/package.json` - Dependencies
- `packages/api-client/tsconfig.json` - TypeScript config

**Related Documentation:**
- `CLAUDE.md` - Project guidelines
- Individual client `__generated__/schema.d.ts` - OpenAPI types
