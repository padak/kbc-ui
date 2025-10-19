# Module: wr-db (Database Writers)

## Overview

The wr-db module provides a comprehensive framework for multiple database writers. It supports writing data to various database systems including PostgreSQL, MySQL, MSSQL, Snowflake, Redshift, Oracle, Exasol, Synapse, Hive, Impala, Firebolt, and others. The module handles database connections, table configuration, data type mapping, incremental loads, and staging approaches. Each database writer is configured through a mapping adapter with database-specific options.

## File Structure

```
wr-db/
├── routes.js                              # Dynamic route configuration
├── constants.js                           # Database component IDs and configs
├── actionCreators.js                      # Redux action creators
├── WritersApi.js                          # API communication
├── helpers.js                             # Utility functions
├── helpers.test.js                        # Helper tests
├── rowsActions.js                         # Row-level actions
├── v2-actions.js                          # Version 2 actions
├── store.js                               # Redux store configuration
├── react/
│   ├── pages/
│   │   ├── index/
│   │   │   └── Index.jsx                  # Main configuration page
│   │   ├── table/
│   │   │   └── Table.jsx                  # Table configuration
│   │   ├── credentials/
│   │   │   └── Credentials.jsx            # Database credentials
│   │   └── row/
│   │       └── Row.jsx                    # Row version history
│   └── components/
│       ├── ReadOnlyStorageAlert.jsx       # Storage alert
│       └── ResetCredentialsButton.jsx     # Credentials reset
├── mapping/
│   ├── index.js                           # Mapping factory
│   ├── snowflake.js                       # Snowflake mapping
│   ├── pgsql.js                           # PostgreSQL mapping
│   ├── mysql.js                           # MySQL mapping
│   ├── mssql.js                           # MSSQL mapping
│   ├── redshift.js                        # Redshift mapping
│   ├── oracle.js                          # Oracle mapping
│   ├── hive.js                            # Hive mapping
│   ├── impala.js                          # Impala mapping
│   ├── exasol.js                          # Exasol mapping
│   ├── synapse.js                         # Azure Synapse mapping
│   ├── firebolt.js                        # Firebolt mapping
│   └── ...
└── templates/
    └── [database]/                        # Database-specific templates
```

## Routes & Configuration

### Dynamic Route Generation

Routes are generated dynamically based on component IDs:

```typescript
// routes.js
export default function routes(componentsSetting) {
  return componentsSetting.map(([componentId, driver, isProvisioning = false]) => {
    return {
      name: componentId,
      path: `${componentId}/:config`,
      title: genericComponentTitle(componentId),
      poll: configPoll(componentId),
      lazy: async () => {
        const Index = await import('./react/pages/index/Index');
        return { Component: Index.default(componentId, driver, isProvisioning) };
      },
      requireData: [
        (params) => configRequiredData(componentId, params.config),
        (params) => {
          if (!isProvisioning || params.tableId) return Promise.resolve();
          return WorkspacesActions.getConfigurationWorkspaces(componentId, params.config);
        }
      ],
      childRoutes: [
        {
          name: componentId + '-table',
          path: 'table/:tableId',
          lazy: async () => {
            const { Table } = await import('./react/pages/table/Table');
            return { Component: Table(componentId) };
          }
        },
        {
          name: componentId + '-credentials',
          path: 'credentials',
          title: 'Credentials',
          lazy: async () => {
            const { Credentials } = await import('./react/pages/credentials/Credentials');
            return { Component: Credentials(componentId, driver, isProvisioning) };
          }
        },
        supportConfigRows(componentId) && {
          name: componentId + '-row',
          path: 'rows/:row',
          title: genericComponentTitle(componentId),
          poll: rowPoll(componentId),
          lazy: async () => {
            const { Row } = await import('./react/pages/row/Row');
            return { Component: Row(componentId) };
          }
        }
      ]
    };
  });
}
```

## Supported Databases

### Supported Writers

| Database | Component ID | Driver | Staging | Special Features |
|----------|-------------|--------|---------|------------------|
| PostgreSQL | `keboola.wr-db-pgsql` | pgsql | STAGE, SCP | Standard SQL |
| MySQL | `keboola.wr-db-mysql` | mysql | STAGE, SCP | Connection pooling |
| MSSQL/T-SQL | `keboola.wr-db-mssql-v2` | mssql | STAGE | BULK INSERT |
| Snowflake | `keboola.wr-db-snowflake` | snowflake | S3, GCS | Native cloud storage |
| Redshift | `keboola.wr-redshift-v2` | redshift | S3 | AWS-native |
| Oracle | `keboola.wr-db-oracle` | oracle | STAGE, SCP | Bulk operations |
| Exasol | `kds.team-wr-exasol` | exasol | HTTP | Direct DB |
| Azure Synapse | `keboola.wr-db-synapse` | synapse | Azure Blob | Azure-native |
| Hive | `keboola.wr-db-hive` | hive | HDFS | Big Data |
| Impala | `keboola.wr-db-impala` | impala | HDFS | MPP |
| Firebolt | `kds.team-wr-firebolt` | firebolt | S3 | Analytics DB |

## Key Components

### Index.jsx (Main Configuration Page)
- **Purpose**: Main entry point for database writer configuration
- **Props**: `componentId` (string), `driver` (string), `isProvisioning` (boolean)
- **Features**:
  - Database credentials setup/update
  - Table configuration
  - Export configuration list
  - Database connection testing
  - Read-only mode handling
- **State Management**:
  - Uses Redux store (via actionCreators)
  - Local state for UI controls
  - Workspace selection for provisioning

### Credentials.jsx
- **Purpose**: Database connection credentials setup
- **Config Structure**:
  ```typescript
  {
    authorization: {
      [driverConfig.key]: {
        host?: string;
        port?: number;
        user: string;
        '#password': string;  // Encrypted
        database?: string;
        schema?: string;
        warehouse?: string;   // Snowflake
        bucket?: string;      // S3/Azure
        [driverSpecific]: any
      }
    }
  }
  ```
- **Features**:
  - Connection parameter input
  - Secure password storage
  - Connection testing
  - Driver-specific fields
  - Provisioning support (workspaces)

### Table.jsx (Table Configuration)
- **Purpose**: Configure individual table exports
- **Configuration Paths**:
  ```typescript
  {
    parameters: {
      tables: [
        {
          dbName: string;           // Target table name
          export: boolean;          // Enable export
          incremental: boolean;     // Incremental load mode
          primaryKey: string[];     // Primary key columns
          useDelete: boolean;       // Delete rows mode
          dataTypes: {},            // Column type mappings
          typeOverride: boolean;    // Override types
          tableId: string;          // Source table ID
        }
      ]
    },
    storage: {
      input: {
        tables: [{
          source: string;           // Storage table ID
          destination: string;      // DB table name
          whereColumn?: string;     // Incremental condition
          whereOperator?: string;
          whereValues?: string[];
        }]
      }
    }
  }
  ```
- **Features**:
  - Table name configuration
  - Column type definition
  - Incremental load setup
  - Primary key configuration
  - Delete mode configuration
  - Data type overrides

### Row.jsx (Version History)
- **Purpose**: View and manage table configuration versions
- **Features**:
  - Version history viewing
  - Restore previous versions
  - Version comparison
  - Change annotations
  - Author information

## Database Mapping

### Mapping Adapters

Each database has a mapping adapter in `mapping/` that defines:

```typescript
// Example: snowflake.js
export default {
  driverName: 'snowflake',
  isSnowflake: true,
  
  dataTypes: {
    "VARCHAR": { dbName: "VARCHAR" },
    "INTEGER": { dbName: "NUMBER" },
    "DECIMAL": { dbName: "NUMBER" },
    // ... more type mappings
  },
  
  stagingModes: ['S3', 'GCS'],
  
  // Database-specific configuration options
  supportedLoadTypes: ['incremental', 'delete'],
  supportsDelete: true,
  supportsNullable: false,  // Snowflake nullable disabled
  
  // Transformation features
  supportsClustering: true,
  supportsPartitioning: true
};
```

### Database-Specific Features

**Snowflake:**
- Cloud-native storage (S3, GCS, Azure)
- Nullable column restriction
- Clustering options
- Native partitioning

**PostgreSQL/MySQL:**
- Standard SQL syntax
- STAGE or SCP staging
- Standard incremental loads
- Full transaction support

**MSSQL:**
- BULK INSERT
- T-SQL specific functions
- Azure compatibility
- Identity column handling

**Redshift:**
- S3 staging only
- Column encoding options
- Compression support
- UNLOAD support

**Oracle:**
- Bulk operations
- Large Object (LOB) support
- Partitioned tables
- Package procedures

**Exasol:**
- HTTP staging
- Direct database connection
- Native compression
- In-memory features

## Load Modes

### Full Load (Replace)
- Replaces entire table content
- No primary key required
- Truncates before load
- Use case: Dimension tables, snapshots

### Incremental Load
- **Configuration**:
  ```typescript
  {
    incremental: true,
    primaryKey: ['id'],        // Required for upsert
    useDelete: false           // Append mode
  }
  ```
- **Behavior**: Inserts new rows, updates existing on primary key
- **Use case**: Fact tables, event logs

### Delete Mode (Full Replace with Delete)
- **Configuration**:
  ```typescript
  {
    incremental: true,
    useDelete: true,           // Delete before re-insert
    primaryKey: ['id'],
    whereColumn?: 'load_date'
  }
  ```
- **Behavior**: Deletes matching rows, then inserts all data
- **Use case**: Conditional historical data, date-based updates

## State Management

### Redux Architecture

```typescript
// store.js - Redux store with Immutable.js
{
  configuration: {
    [componentId]: {
      [configId]: {
        credentials: {},
        tables: [],
        parameters: {},
        authorization: {},
        storage: {}
      }
    }
  },
  tableEdit: {},      // Current table being edited
  editing: {},        // Editing state
  columnEdit: {}      // Column type editing
}
```

### Action Types

| Action | Trigger | Updates |
|--------|---------|---------|
| `WR_DB_GET_CONFIGURATION_SUCCESS` | Load config | Store configuration |
| `WR_DB_SET_TABLE_START` | Save table | Loading state |
| `WR_DB_SET_TABLE_SUCCESS` | Table saved | Update store |
| `WR_DB_SAVE_CREDENTIALS_START` | Save credentials | Loading state |
| `WR_DB_SAVE_COLUMNS_SUCCESS` | Column types updated | Store columns |
| `WR_DB_DELETE_TABLE_START` | Delete table | Loading state |
| `WR_DB_ADD_TABLE_START` | Add table | Loading state |

## Data Type Mapping

### Type Conversion

Each database has specific type mappings:

```typescript
// Storage type → Database type
{
  "VARCHAR": "VARCHAR(255)",      // Text columns
  "TEXT": "TEXT",                 // Long text
  "INTEGER": "BIGINT",            // Numbers
  "DECIMAL": "DECIMAL(10,2)",     // Decimals
  "BOOLEAN": "BOOLEAN",           // Boolean
  "TIMESTAMP": "DATETIME",        // Datetime
  "DATE": "DATE"                  // Date
}
```

### Type Override

- Users can override default type mappings
- Per-column customization
- Database-specific syntax support
- Validation against database capabilities

## Staging Modes

### Staging Approaches

1. **S3 Staging** (Snowflake, Redshift)
   - Upload to S3 bucket
   - Database reads from S3
   - Most efficient for large data
   - Requires S3 credentials

2. **Direct Connection** (Most databases)
   - JDBC connection
   - Direct data transfer
   - Lower latency
   - Connection pooling

3. **SCP Staging** (PostgreSQL, MySQL)
   - Secure copy protocol
   - File transfer to server
   - Database reads local files
   - SSH access required

4. **Azure Blob** (Synapse)
   - Upload to Azure Blob Storage
   - Database reads from blob
   - Azure-native approach
   - Requires storage credentials

## Incremental Loading

### Upsert Strategy (Default)

```
1. Check for matching primary keys
2. UPDATE matching rows
3. INSERT new rows
```

### Delete + Insert Strategy

```
1. Delete rows matching condition (if specified)
2. INSERT all rows
```

### Configuration Example

```javascript
{
  incremental: true,
  primaryKey: ['customer_id'],
  useDelete: false,              // Upsert mode
  whereColumn: 'load_date',      // Optional condition
  whereOperator: '>',
  whereValues: ['2024-01-01']
}
```

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `components/{componentId}/{configId}` | Get configuration |
| POST | `components/{componentId}/{configId}/save-credentials` | Save DB credentials |
| PUT | `components/{componentId}/{configId}/save-table` | Save table config |
| DELETE | `components/{componentId}/{configId}/delete-table` | Delete table |
| GET | `components/{componentId}/{configId}/rows/{rowId}` | Get row history |

## Dependencies

### Internal Modules
- `@/modules/components` - Component management
- `@/modules/workspaces` - Workspace data
- `@/modules/configurations` - Configuration utilities
- `@/utils/errors/SyncActionError` - Error handling

### External Packages
- `redux`, `react-redux` - State management
- `immutable` - Immutable data structures
- `bluebird` - Promise utilities

### Design System Components
- `Button` - Actions
- `Modal` - Dialogs
- `FormGroup` - Form sections
- `Select` - Dropdowns
- `TextInput` - Text fields

## Configuration Workflow

1. **Set Up Database Connection**
   - Navigate to credentials tab
   - Enter connection parameters (host, port, database, user, password)
   - Test connection
   - Save credentials

2. **Create First Table Mapping**
   - Add new table configuration
   - Select source table from Storage
   - Set target table name
   - Configure columns and types
   - Set primary key for incremental loads

3. **Configure Load Mode**
   - Choose: Full load, Incremental (upsert), or Delete mode
   - For incremental: Define primary key
   - For delete mode: Configure deletion conditions (optional)

4. **Add More Tables**
   - Each table gets own configuration
   - Independent load mode per table
   - Shared database connection

5. **Enable and Run**
   - Enable individual table exports
   - Run configuration to execute
   - Monitor execution in job history

## Technical Debt & Observations

### Legacy Architecture
- Redux with Immutable.js (modern apps use TanStack Query)
- Class components throughout
- Direct API calls (vs modern query clients)
- Old routing patterns

### Areas for Improvement
- Massive file sizes (routes.js very large)
- Type safety (no TypeScript)
- Limited error messages to users
- Complex state management
- Database connection pooling not visible
- Type mapping UI could be more intuitive

### Complexity Hotspots
1. **Dynamic Database Support**: 14+ database types with different configs
2. **Type Mapping**: Complex per-database type conversions
3. **Staging Modes**: Different staging approaches per database
4. **Incremental Logic**: Upsert vs delete mode handling
5. **Provisioning**: Workspace-specific configuration for provisioning

### Migration Path
- Migrate to TanStack Query for server state
- Convert to functional components with hooks
- Add TypeScript for type safety
- Simplify state management with Zustand
- Extract database-specific logic into plugins

## Related Modules

- `storage` - Keboola Storage source
- `components` - Base component framework
- `workspaces` - Workspace management
- `configurations` - Configuration utilities
- `oauth-v2` - OAuth for some databases

## Testing

### Key Test Scenarios
- Credentials validation
- Database connection testing
- Table configuration save/load
- Data type mapping
- Incremental load logic
- Delete mode handling
- Multiple table handling
- Staging mode selection
- Error handling and recovery

### Test Files
- `helpers.test.js` - Helper function tests
- Individual component test files
- Adapter tests for each database
- Integration tests for load scenarios

### Test Data
- Sample credentials for each database
- Mock table configurations
- Type mapping test cases
- Incremental load scenarios

