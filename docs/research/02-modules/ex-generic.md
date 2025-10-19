# Module: ex-generic

## Overview

Generic HTTP Extractor v2 (Ex-Generic) is a powerful, flexible extractor for REST APIs. It supports complex API configurations including authentication methods, pagination, custom parameters, user data, job scheduling, and data mapping.

**Component ID**: `keboola.ex-generic-v2`

## File Structure

```
ex-generic/
├── routes.tsx
├── Detail.tsx
├── Header.tsx
├── constants.ts
├── helpers.ts
├── actions.ts
├── components/
│   ├── DetailContent.tsx
│   ├── SidebarMenu.tsx
│   ├── Base.tsx
│   ├── Authentication.tsx
│   ├── Endpoints.tsx
│   ├── Parameters.tsx
│   ├── Pagination.tsx
│   ├── UserData.tsx
│   ├── JobParameters.tsx
│   ├── MappingEditor.tsx
│   └── [many more components]
└── react/
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/:config/menu` | Detail | Main configuration interface |
| `/:config/menu/:menu` | Detail (nested) | Configuration section pages |

## Key Components

### Detail Component
- **Location**: `Detail.tsx`
- **Purpose**: Main configuration interface with sidebar menu and content area
- **Features**:
  - Visual editor with sidebar navigation
  - JSON mode for advanced configuration
  - Variable support and integration
  - Configuration tabs and info panel

### SidebarMenu Component
- **Location**: `components/SidebarMenu.tsx`
- **Purpose**: Navigation menu for configuration sections
- **Items**:
  - Base (URL, method, timeout)
  - Authentication (API key, OAuth, Basic, Bearer, Custom)
  - General (output bucket, incremental)
  - Endpoints (define sub-endpoints)
  - Parameters (user-facing parameters)
  - Pagination (handling API pagination)
  - User Data (custom user context)
  - Advanced (retry logic, debug)
  - Job Parameters (scheduling)

### Authentication Component
- **Location**: `components/Authentication.tsx`
- **Purpose**: Configure API authentication method
- **Supported Methods**:
  - None
  - API Key (header/query)
  - Bearer Token
  - Basic Auth (username/password)
  - OAuth 2.0
  - Custom (user-defined)

### Endpoints Component
- **Location**: `components/Endpoints.tsx`
- **Purpose**: Define API endpoints and sub-endpoints
- **Features**: Endpoint creation, deletion, URL templating

### Pagination Component
- **Location**: `components/Pagination.tsx` & `NewPagination.tsx`
- **Purpose**: Configure pagination strategies
- **Strategies**: Offset, limit, cursor, scroll ID, page number

### MappingEditor Component
- **Location**: `components/MappingEditor.tsx`
- **Purpose**: Configure data mapping from API response to table columns
- **Features**: Column selection, type mapping, nested data handling

## Constants

### MENUS
```typescript
{
  BASE: 'base',
  ADVANCED: 'advanced',
  PARAMETERS: 'parameters',
  USER_DATA: 'user-data',
  PAGINATIONS: 'paginations'
}
```

### AUTH_METHODS
```typescript
{
  NONE: 'none',
  API_KEY: 'api-key',
  BEARER: 'bearer',
  OAUTH2: 'oauth2',
  QUERY: 'query',
  BASIC: 'basic',
  CUSTOM: 'custom'
}
```

### PARAMETER_TYPE
```typescript
{
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  ENCRYPTED: 'encrypted',
  FUNCTION: 'function'
}
```

## API Endpoints

| Method | Endpoint | Purpose | Response Type |
|--------|----------|---------|---------------|
| GET | `/api/components/{componentId}/configs/{configId}` | Retrieve config | Config |
| POST | `/api/components/{componentId}/configs/{configId}` | Save config | Config |
| POST | `/api/components/{componentId}/test` | Test API endpoint | TestResult |

## State Management

- **Pattern Used**: TanStack Query + Zustand + Flux
- **Storage**: InstalledComponentsStore
- **Data Flow**: 
  1. Configuration loaded from API
  2. Parsed into Detail component state
  3. User modifies via menu sections
  4. Saved back to API
  5. Update triggers re-render

## Dependencies

### Internal Modules
- `modules/components` - Component management
- `modules/configurations` - Configuration utilities
- `modules/simplified-ui` - Header buttons
- `modules/storage` - Bucket/table metadata

### External Packages
- `underscore` - Utility functions
- `immutable` - Data structures
- `react` - UI framework

### Design System Components
- Modal, Button, Input, Tabs from @keboola/design

## Notable Patterns

1. **Flexible Authentication**: Supports 7+ authentication methods
2. **Hierarchical Configuration**: Menu-based organization of settings
3. **Visual + JSON Editor**: User choice between UI and direct JSON editing
4. **Parameter System**: User-defined parameters with templates and functions
5. **Pagination Strategies**: Multiple pagination methods for different APIs
6. **Mapping Editor**: Sophisticated nested data mapping

## User-Facing Features

### Feature 1: API Connection
- **Description**: Configure API endpoint and connection options
- **Workflow**: Enter base URL → Set timeout → Add headers
- **Components**: Base menu section

### Feature 2: Authentication Setup
- **Description**: Configure authentication for API
- **Workflow**: Select method → Enter credentials/tokens → Test
- **Components**: Authentication component

### Feature 3: Endpoint Configuration
- **Description**: Define which endpoints to extract data from
- **Workflow**: Create endpoints → Configure per-endpoint options → Map data
- **Components**: Endpoints component

### Feature 4: Parameter Management
- **Description**: Define user-facing parameters for configuration
- **Workflow**: Create parameters → Set type/validation → Use in URLs/queries
- **Components**: Parameters component

### Feature 5: Data Mapping
- **Description**: Map API response fields to table columns
- **Workflow**: Preview API response → Select fields → Configure types
- **Components**: MappingEditor, InferMapping

## Technical Debt & Observations

- Large monolithic module (40+ components)
- Complex state management (mix of patterns)
- Visual editor incompatibility fallback to JSON
- Many reserved configuration names (maintenance burden)
- Could benefit from component composition refactoring

## Code Examples

### Configuration Structure
```typescript
{
  http: {
    baseUrl: "https://api.example.com",
    timeout: 30,
    retryConfig: {
      codes: [408, 429, 500, 502, 503, 504],
      maxRetries: 3
    }
  },
  authentication: {
    type: "api-key",
    apiKeyPosition: "header",
    apiKey: "#encrypted_key"
  },
  jobs: [
    {
      endpoint: "/users",
      dataType: "users",
      dataField: "data",
      pagination: {
        type: "offset",
        limit: 100
      }
    }
  ],
  mappings: [
    {
      column: "user_id",
      dataField: "id",
      dataType: "string"
    }
  ]
}
```

## Related Modules

- `ex-http` - Simplified HTTP extractor
- `ex-generic-ui` - Older version UI components
- `components` - Base component management

## Testing

- Test files: `helpers.test.ts`
- Approach: Helper function unit tests
- Coverage: Limited, mainly helpers
