# Module: legacy-transformation

## Overview

The `legacy-transformation` module manages the legacy transformation system in Keboola Connection. This predecessor to `transformations-v2` supports SQL-based transformations on Snowflake backend and basic transformation management. While newer development has moved to transformations-v2 with dbt and multi-backend support, the legacy module remains for backward compatibility and handles existing transformation configurations.

The module is minimal in scope, providing primarily helper utilities and detail views for legacy transformation configurations that continue to run in production environments.

## File Structure

```
legacy-transformation/
├── helpers.ts                          # Utility functions for legacy transformation handling
└── react/
    └── pages/
        ├── transformation-detail/      # Legacy transformation detail page
        │   └── Description.tsx         # Transformation description component
        └── transformation-bucket/      # Legacy transformation bucket organization
```

## Routes

The legacy transformation module integrates with the components framework through the Generic Component system rather than having dedicated routes. Transformations are accessed via:

| Path | Component | Description |
|------|-----------|-------------|
| `/transformations/:component/:config` | GenericIndex | Legacy transformation detail (via Generic Component Framework) |

## Key Components

### helpers.ts
- **Location**: `apps/kbc-ui/src/scripts/modules/legacy-transformation/helpers.ts`
- **Purpose**: Utility functions for preparing legacy transformation configuration data
- **Key Functions**:
  - `prepareConfigForWorkspace()`: Converts legacy transformation config to workspace format
  - `prepareInputMapping()`: Prepares input table mappings
  - `prepareUniqueDestination()`: Generates unique output table names

### Description Component
- **Location**: `apps/kbc-ui/src/scripts/modules/legacy-transformation/react/pages/transformation-detail/Description.tsx`
- **Purpose**: Display transformation description in detail view
- **Features**:
  - Shows transformation metadata
  - Edit capability (when not in read-only mode)
  - Integration with configuration management

## Helper Functions

### prepareConfigForWorkspace(config: Map<string, any>)
Converts a legacy transformation configuration to workspace-compatible format:

```typescript
const prepareConfigForWorkspace = (config: Map<string, any>) => {
  return fromJS({
    configuration: {
      storage: {
        input: { tables: prepareInputMapping(config.get('input', Map())) },
        output: { tables: config.get('output', Map()) },
      },
      parameters: { packages: config.get('packages', List()) },
    },
  });
};
```

**Purpose**: Used when creating workspace environments from legacy transformations
**Input**: Immutable Map containing transformation configuration
**Output**: Immutable Map with workspace-formatted configuration

### prepareInputMapping(input: Map<string, any>)
Strips unnecessary properties from input table mappings:

```typescript
const prepareInputMapping = (input: Map<string, any>) => {
  return input.map((table) => table.delete('load_type'));
};
```

**Purpose**: Removes `load_type` property which is not needed in workspace context
**Input**: Immutable Map of input table mappings
**Output**: Immutable Map with cleaned mappings

### prepareUniqueDestination(tableMapping: Map, definedDestinations: List, suffixNumber: number)
Generates unique output table names to avoid conflicts:

```typescript
const prepareUniqueDestination = (
  tableMapping: Map<string, any>,
  definedDestinations: List<string>,
  suffixNumber = 2,
) => {
  const FILE_EXTENSION = '.csv';
  const originalDestination = tableMapping.get('destination');
  const destination =
    originalDestination.replace(FILE_EXTENSION, '') +
    '_' +
    suffixNumber +
    (originalDestination.includes(FILE_EXTENSION) ? FILE_EXTENSION : '');

  if (definedDestinations.includes(destination)) {
    return prepareUniqueDestination(tableMapping, definedDestinations, suffixNumber + 1);
  }

  return destination;
};
```

**Purpose**: Prevents output table name collisions when multiple tables have same name
**Algorithm**: 
- Takes original destination name
- Appends suffix (starting at 2, incremented recursively)
- Preserves file extension
- Recursively checks against already-defined destinations
- Returns first unique name

**Example**:
- Input: `output.csv` with existing `output.csv`, `output_2.csv`
- Output: `output_3.csv`

## Transformation Configuration Structure

### Legacy Transformation Schema
```typescript
{
  id: string;
  name: string;
  description?: string;
  type?: string;
  component: string;  // Component ID (e.g., 'keboola.snowflake-transformation')
  configuration?: {
    storage?: {
      input?: {
        tables: {
          source: string;        // Storage table ID
          destination: string;   // Alias in transformation
          load_type?: string;    // APPEND or CLONE (removed in workspace prep)
          columns?: string[];
          where_column?: string;
          where_values?: string[];
        }[];
      };
      output?: {
        tables: {
          source: string;        // Generated table/file name
          destination: string;   // Storage table to write to
          primary_key?: string[];
          incremental?: boolean;
        }[];
      };
    };
    parameters?: {
      packages?: string[];
      script?: string;           // SQL script
      queries?: string[];        // Multiple queries
    };
  };
}
```

## Transformation Types

### Supported Legacy Components
- **keboola.snowflake-transformation**: SQL transformations on Snowflake backend
- **keboola.legacy-transformation**: Original legacy transformation component (SNOWFLAKE_BACKEND_TRANSFORMATIONS)

### Backend
- **Snowflake**: Only supported backend for legacy transformations
- Connected via Keboola Storage's Snowflake connection

## Input/Output Mapping

### Input Mappings (Legacy)
```typescript
{
  source: "bucket.table",           // Source table in storage
  destination: "my_input_table",    // Alias in transformation
  load_type: "APPEND",              // APPEND or CLONE (workspace strips this)
  columns: ["col1", "col2"],        // Optional: specific columns only
  where_column: "date",             // Optional: filter by column
  where_values: ["2024-01-01"]      // Optional: filter values
}
```

### Output Mappings (Legacy)
```typescript
{
  source: "output_table",           // Generated table/file
  destination: "bucket.output",     // Target storage table
  primary_key: ["id"],              // Optional: primary key
  incremental: false                // Optional: incremental load
}
```

## Workspace Integration

### Legacy to Workspace Migration
Helper functions facilitate converting legacy transformation configs to workspace format:

1. **Configuration Conversion**: `prepareConfigForWorkspace()` transforms the config structure
2. **Mapping Preparation**: Input mappings cleaned via `prepareInputMapping()`
3. **Name Resolution**: Output names made unique with `prepareUniqueDestination()`

**Use Case**: When creating sandbox/workspace environments from existing legacy transformation configurations

## State Management

### Pattern Used
- **Flux with Immutable.js**: Configuration state management
- **Generic Component Framework**: Leverages parent component framework for most state

### Key Stores
- **InstalledComponentsStore**: Configuration metadata
- **ComponentsStore**: Component definitions
- **StorageTablesStore**: Available storage tables

### Integration Points
- Legacy transformations accessed through Generic Component framework
- Description component displays metadata
- Configurations editable via GenericConfigBody wrapper

## Dependencies

### Internal Modules
- `modules/components`: Generic component framework
- `modules/components/stores`: Component and configuration stores
- `react/hooks/useStores`: Store connection hook

### External Packages
- **immutable**: List, Map for immutable data structures
- **react**: Component framework

### Design System Components
- Used implicitly through Generic Component framework

## Technical Debt & Observations

### Legacy Patterns
- Module is minimal and focused on backward compatibility
- Uses older Flux patterns with Immutable.js
- Functions are simple utility helpers without complex logic
- Lacks comprehensive TypeScript typing

### Code Quality
- Helper functions are pure and well-isolated
- No state management complexity
- Minimal components
- Good separation of concerns

### Migration Path
- New transformations should use `transformations-v2` module
- Legacy transformations continue to work for backward compatibility
- Helper functions provide migration utilities for workspace creation

## Code Examples

### Using prepareConfigForWorkspace
```typescript
import { prepareConfigForWorkspace } from '@/modules/legacy-transformation/helpers';

const legacyConfig = Map({
  input: Map({
    table1: Map({
      source: 'bucket.table',
      destination: 'my_table',
      load_type: 'APPEND',
    }),
  }),
  output: Map({
    table1: Map({
      source: 'output.csv',
      destination: 'bucket.output',
    }),
  }),
  packages: List(['some-package']),
});

const workspaceConfig = prepareConfigForWorkspace(legacyConfig);
// Result:
// {
//   configuration: {
//     storage: {
//       input: { 
//         tables: { 
//           table1: {
//             source: 'bucket.table',
//             destination: 'my_table'
//             // load_type removed
//           }
//         }
//       },
//       output: { 
//         tables: { 
//           table1: {...}
//         }
//       }
//     },
//     parameters: { packages: ['some-package'] }
//   }
// }
```

### Handling Output Name Conflicts
```typescript
import { prepareUniqueDestination } from '@/modules/legacy-transformation/helpers';

const tableMapping = Map({ destination: 'output.csv' });
const existing = List(['output.csv', 'output_2.csv', 'output_3.csv']);

const uniqueName = prepareUniqueDestination(tableMapping, existing);
// Result: 'output_4.csv'
```

### Preparing Input Mappings for Workspace
```typescript
import { prepareInputMapping } from '@/modules/legacy-transformation/helpers';

const inputMapping = Map({
  table1: Map({
    source: 'bucket.source',
    destination: 'my_table',
    load_type: 'APPEND',
    columns: ['col1', 'col2'],
  }),
});

const cleaned = prepareInputMapping(inputMapping);
// Result: columns cleaned, load_type removed
```

## Related Modules

- `modules/transformations-v2`: Modern transformation module (recommended for new work)
- `modules/components`: Generic component framework (parent)
- `modules/shared-codes`: Shared code storage
- `modules/queue`: Job execution

## Differences from transformations-v2

### Core Differences

| Feature | Legacy | transformations-v2 |
|---------|--------|-------------------|
| **Backend Support** | Snowflake only | Snowflake + BigQuery + PostgreSQL + Redshift + MSSQL |
| **Transformation Engine** | SQL scripts | SQL + dbt + Code Blocks |
| **Configuration Style** | Simple SQL scripts | Complex with execution steps |
| **Debugging** | Script execution | dbt debug, SQL compilation |
| **Analysis Tools** | Basic | Gantt charts, model timing, compiled queries |
| **Repository Support** | Inline code | Git repository integration |
| **Workspace Integration** | Basic helper utilities | Full workspace support |
| **Backend Selection** | Fixed to Snowflake | Selectable per transformation |
| **Thread Configuration** | N/A | 1-8 configurable threads |
| **Freshness Monitoring** | N/A | dbt source freshness |

### Migration Considerations

**Why Migrate to transformations-v2?**
- Support for multiple data warehouse backends
- dbt integration for advanced data transformations
- Better debugging and analysis tools
- Git repository support for version control
- More flexible execution steps and parameters
- Active development and feature additions

**Backward Compatibility**
- Legacy transformations continue to execute
- No forced migration path
- Helper utilities available for workspace creation
- Can coexist with modern transformations

## File Summary

| File | Purpose |
|------|---------|
| `helpers.ts` | Core utility functions for config transformation |
| `react/pages/transformation-detail/Description.tsx` | Display transformation description |
| `react/pages/transformation-bucket/` | Legacy bucket organization views |

## Testing

- **Coverage**: Limited due to minimal module scope
- **Unit Tests**: None explicitly shown in module
- **Integration**: Tested through Generic Component Framework
- **E2E Testing**: Available in `packages/e2e-testing`

## Component Lifecycle

### Creating a Legacy Transformation
1. User creates transformation via Components framework
2. Type selected as legacy transformation component
3. Configuration stored with input/output mappings
4. Displayed in transformation list

### Running a Legacy Transformation
1. Configuration selected from list
2. Transformation executed via component runner
3. SQL script executed on Snowflake backend
4. Output tables written to storage
5. Results available in job queue

### Workspace Creation from Legacy
1. Legacy configuration retrieved
2. `prepareConfigForWorkspace()` converts configuration
3. Input mappings cleaned via `prepareInputMapping()`
4. Output names made unique via `prepareUniqueDestination()`
5. Workspace environment created with converted config

## Notes for Developers

### When to Use This Module
- Working with existing legacy transformations
- Creating workspace environments from legacy configs
- Debugging legacy transformation issues
- Understanding historical transformation patterns

### When NOT to Use This Module
- Creating new transformations (use transformations-v2)
- Implementing multi-backend support
- Using dbt or advanced features
- Starting new transformation management

### Future Considerations
- Module may be deprecated as legacy transformations sunset
- Migration tools may be developed
- Helper functions provide transition path
- Monitor for deprecation announcements
