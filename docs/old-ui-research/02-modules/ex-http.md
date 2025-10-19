# Module: ex-http

## Overview

HTTP Extractor provides simple REST API data extraction with flexible authentication, configurable credentials, and CSV output settings. Designed as a simpler alternative to ex-generic for basic API extraction needs.

**Component ID**: `keboola.ex-http`

## File Structure

```
ex-http/
├── routes.ts
├── adapters/
│   ├── conform.ts
│   ├── credentials.ts
│   └── row.ts
└── react/
    └── components/
        ├── Credentials.tsx
        └── Configuration.tsx
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| Index | CredentialsForm | Base URL and connection options |
| Row | ConfigurationForm | Individual HTTP request configuration |

## Key Components

### CredentialsForm
- **Location**: `react/components/Credentials.tsx`
- **Purpose**: Configure base URL and connection settings
- **Props**: 
  - `value`: Configuration object
  - `onChange`: Change handler
  - `disabled`: Disable state
- **Features**: Base URL, timeout, headers, authentication setup

### ConfigurationForm
- **Location**: `react/components/Configuration.tsx`
- **Purpose**: Configure individual HTTP requests
- **Features**: 
  - HTTP method selection
  - Path configuration
  - Request parameters
  - Output settings

## Adapters

| Adapter | Purpose |
|---------|---------|
| `credentialsAdapter` | Base URL and connection parsing |
| `rowAdapter` | Request configuration parsing |
| `conform` | Configuration validation |

## API Endpoints

| Method | Endpoint | Purpose | Response Type |
|--------|----------|---------|---------------|
| GET | `/api/components/{componentId}/configs/{configId}` | Retrieve config | Config |
| POST | `/api/components/{componentId}/configs/{configId}` | Save config | Config |

## State Management

- **Pattern Used**: Adapter-based with Immutable.js
- **Data Flow**: Form → Adapters → Conformation → Storage

## Dependencies

### Internal Modules
- `modules/configurations` - Configuration utilities
- `modules/configurations/utils` - Column types

### External Packages
- `immutable` - Data structures
- React - UI framework

## Notable Patterns

1. **Processor-based File Movement**: Uses `KEBOOLA_PROCESSOR_MOVE_FILES`
2. **TypeScript Adapters**: Fully typed adapter functions
3. **Separate Credentials/Request Config**: Credentials at index, requests at row level

## User-Facing Features

### Feature 1: Base Configuration
- **Description**: Configure API base URL and global settings
- **Workflow**: Enter URL → Set timeout → Add headers → Save
- **Components**: Credentials form

### Feature 2: Request Configuration
- **Description**: Configure individual HTTP requests
- **Workflow**: Set HTTP method → Enter endpoint → Add parameters → Configure output
- **Components**: Configuration form

## Related Modules

- `ex-generic` - Advanced API extractor with more features
- `ex-aws-s3` - Similar file extraction pattern
- `configurations` - Base configuration module

## Technical Notes

- Simplified compared to ex-generic
- TypeScript for type safety
- No complex authentication methods (unlike ex-generic)
- Processor-based output handling
