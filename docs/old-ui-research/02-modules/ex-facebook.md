# Module: ex-facebook

## Overview

Facebook Extractor enables extraction of data from Facebook/Instagram platforms including page insights, ads data, and Instagram metrics. Supports multiple component variants for different data sources (Facebook Pages, Ads, Instagram).

**Component IDs**: Multiple variants
- `keboola.ex-facebook`
- `keboola.ex-facebook-pages`
- `keboola.ex-facebook-ads`
- `keboola.ex-facebook-ads-v2`
- `keboola.ex-instagram`
- `keboola.ex-instagram-v2`

## File Structure

```
ex-facebook/
├── routes.js
├── constants.ts
├── helpers.ts
├── actionsProvisioning.js
├── storeProvisioning.js
├── react/
│   ├── Index/
│   │   ├── Index.jsx
│   │   ├── HeaderButtons.jsx
│   │   └── QueryNameEdit.jsx
│   └── ...
└── templates/
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/:config` | Index | Queries management page |
| `/:config/query/:queryId` | QueryDetail | Individual query editor |

## Key Components

### Constants
- **Location**: `constants.ts`
- **Purpose**: Component IDs, query types, API versions, limits
- **Key Constants**:
  - `FACEBOOK_COMPONENT_IDS`: Array of all Facebook component variants
  - `QUERY_TYPE`: Types of queries (nested, async-insights)
  - `FB_API_VERSIONS`: Supported Graph API versions (v23.0, v22.0)
  - `LIMIT_*`: Min/max/default values for pagination

### Index Component
- **Location**: `react/Index/Index.jsx`
- **Purpose**: Query list and management
- **Features**: Create/delete queries, view query list

### Query Detail Component
- **Location**: `react/Index/Query.jsx`
- **Purpose**: Query editor and configuration
- **Features**: Facebook query builder, insights selection, filter options

## API Endpoints

| Method | Endpoint | Purpose | Response Type |
|--------|----------|---------|---------------|
| GET | `/api/components/{componentId}/configs/{configId}` | Retrieve queries | Config |
| POST | `/api/components/{componentId}/queries` | Create query | Query |
| DELETE | `/api/components/{componentId}/queries/:id` | Delete query | - |

## State Management

- **Pattern Used**: Provisioning pattern with Flux
- **Stores**: 
  - `storeProvisioning.js`: Creates component-specific stores
  - `store()`: Factory function that returns Store instance
  - Manages queries, pages, accounts
- **Actions**: 
  - `actionsProvisioning.js`: Action creators for query operations
  - Component-specific action dispatch

## Dependencies

### Internal Modules
- `modules/components` - Component management
- `modules/configurations` - Configuration utilities
- `modules/simplified-ui` - Header buttons

### External Packages
- `immutable` - Data structures
- `react` - UI framework

### Design System Components
- Various from @keboola/design

## Notable Patterns

1. **Multi-variant Architecture**: Single module handles multiple Facebook data sources
2. **Query-based Extraction**: Flexible query definition for different metrics
3. **Provisioning Pattern**: Dynamic store creation per component
4. **API Version Support**: Manages multiple Facebook Graph API versions
5. **Nested Query Support**: Can fetch nested relationships in single query

## User-Facing Features

### Feature 1: Account Connection
- **Description**: Connect Facebook/Instagram business account
- **Workflow**: Authenticate → Select business account → Grant permissions
- **Components**: OAuth flow, account selector

### Feature 2: Query Management
- **Description**: Create and manage data extraction queries
- **Workflow**: Create query → Select metrics → Configure filters → Save
- **Components**: Query list, query editor

### Feature 3: Metrics Selection
- **Description**: Choose which metrics to extract (insights, engagement, etc.)
- **Workflow**: Browse available metrics → Add to query → Configure parameters
- **Components**: Metric selector in query editor

### Feature 4: Query Execution
- **Description**: Run configured queries to extract data
- **Workflow**: Select query → Execute → Monitor progress → Data flows to storage
- **Components**: Query action buttons

## Technical Debt & Observations

- Provisioning pattern complexity (multiple component IDs managed)
- API version management (hardcoded versions in constants)
- Legacy Flux pattern (could migrate to modern state management)
- Query builder UI might be overly complex for basic use cases

## Code Examples

### Component ID Detection
```typescript
const FACEBOOK_COMPONENT_IDS = [
  KEBOOLA_EX_FACEBOOK,
  KEBOOLA_EX_FACEBOOK_PAGES,
  KEBOOLA_EX_FACEBOOK_ADS,
  KEBOOLA_EX_FACEBOOK_ADS_V_2,
  KEBOOLA_EX_INSTAGRAM,
  KEBOOLA_EX_INSTAGRAM_V_2,
];
```

### Query Types
```typescript
export const QUERY_TYPE = {
  NESTED: 'nested-query',
  ASYNC_INSIGHTS: 'async-insights-query',
};
```

## Related Modules

- `ex-google-analytics-v4` - Similar analytics extractor
- `ex-google-ads` - Similar ads platform extractor
- `components` - Base component management
- `wr-facebook` - Facebook writer component

## Testing

- Test helpers: `helpers.ts` with utility functions
- Approach: Unit tests for helpers and constants
- Coverage: Limited, mainly constants and helper functions
