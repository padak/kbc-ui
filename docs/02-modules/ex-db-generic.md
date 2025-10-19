# Module: ex-db-generic

## Overview

The `ex-db-generic` module provides a unified database extractor UI for multiple database types including MySQL, PostgreSQL, Oracle, Snowflake, MSSQL, Redshift, Firebird, and many others. It supports both simple table-based extraction and advanced SQL query modes, with capabilities for incremental loading, row-based configurations, and specialized connection features (SSH tunnels, SSL, Kerberos for Hive, etc.).

**Supported Databases**: MySQL, PostgreSQL, Redshift, Firebird, DB2, MSSQL, MSSQL CData, Oracle, Snowflake, NetSuite, Informix, Impala, Hive, Teradata, and variants (CSAS, KDS Team versions).

## File Structure

```
ex-db-generic/
├── routes.jsx                          # Route definitions
├── constants.js                        # Component IDs, incremental types, processors
├── constants.test.js
├── helpers.ts                          # Feature detection (SSH, SSL, CDC, split loading, etc.)
├── helpers.test.js
├── storeProvisioning.js               # Store factory and query getters
├── storeProvisioning.test.js
├── actionsProvisioning.js             # Action creators for credentials, queries, tables
├── templates/
│   ├── credentials.tsx                # Credentials field definitions per database
│   ├── customFields.js
│   ├── defaultPorts.js
│   ├── editorMode.js
│   └── helpAndHints.jsx
├── react/
│   ├── components/
│   │   ├── QueryActionButtons.jsx
│   │   ├── QueryDeleteButton.jsx
│   │   ├── QueryEditor.jsx
│   │   ├── QueryName.jsx
│   │   ├── CreateQueryElement.jsx
│   │   ├── AsynchActionError.jsx
│   │   ├── LastFetchedValue.jsx
│   │   ├── ColumnLoaderQueryEditor.jsx
│   │   ├── MigrateToRowsButton.jsx
│   │   ├── RefreshTables.tsx
│   │   └── ImportTables/
│   │       ├── ImportTablesModal.tsx
│   │       ├── ImportTablesForm.tsx
│   │       └── types.ts
│   └── pages/
│       ├── index/
│       │   └── Index.jsx
│       ├── query-detail/
│       │   └── QueryDetail.jsx
│       └── credentials/
│           ├── CredentialsPage.jsx
│           ├── CredentialsForm.jsx
│           ├── helpers.js
│           ├── InitQueriesForm.tsx
│           └── HiveCredentialsWithSave.tsx
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/:componentId/:config` | Index | Main configuration page listing all queries/tables |
| `/:componentId/:config/query/:query` | QueryDetail | Edit individual query or table |
| `/:componentId/:config/credentials` | CredentialsPage | Edit database connection credentials |

## Key Components

### storeProvisioning.js - Store Factory

**Location**: `apps/kbc-ui/src/scripts/modules/ex-db-generic/storeProvisioning.js`

**Purpose**: Creates and manages the store for a specific configuration, handling both row-based and standard configurations, credentials, queries, and table metadata.

**Key Methods**:
- `createStore(componentId, configId)` - Creates store instance
- `getCredentials()` - Get saved database credentials
- `getNewCredentials()` - Get credentials with defaults applied
- `hasValidCredentials(credentials)` - Validate credentials based on database requirements
- `getQueries()` / `getQueriesFiltered()` - List all queries or filtered by search
- `getConfigQuery(queryId)` - Get specific query (editing, new, or saved)
- `getSourceTables()` - Get available tables from database for selection
- `isRowConfiguration()` - Check if using row-based configuration

**Data Structure**:
- Credentials stored in `parameters.db`
- Queries stored in `parameters.tables` (standard) or as configuration rows (row-based)
- Local state tracks editing, saving, source tables, and filters

### actionsProvisioning.js - Actions

**Location**: `apps/kbc-ui/src/scripts/modules/ex-db-generic/actionsProvisioning.js`

**Purpose**: Handles all state mutations and API calls for credentials, queries, and table imports.

**Key Methods**:
- `testCredentials(configId, credentials)` - Test connection without saving
- `saveCredentialsEdit(configId, changeDescription)` - Save updated credentials
- `createQuery(configId)` - Create new query
- `saveQueryEdit(configId, queryId, changeDescription)` - Save query changes
- `deleteQuery(configId, queryId)` - Delete query or table
- `importTables(configId, tables, loadColumns)` - Bulk import tables as queries
- `getSourceTables(configId, queryId?, tableData?)` - Fetch available tables/columns from database
- `reloadSourceTables(componentId, configId, queryId)` - Refresh table list

### CredentialsForm - Credentials UI

**Location**: `apps/kbc-ui/src/scripts/modules/ex-db-generic/react/pages/credentials/CredentialsForm.jsx`

**Purpose**: Dynamic form for entering database connection credentials with database-specific fields.

**Features**:
- Dynamic field generation based on database type (MySQL, Oracle, Snowflake, etc.)
- Protected/encrypted password fields
- SSH tunnel configuration (for supported databases)
- SSL configuration (MySQL, PostgreSQL, MSSQL)
- Special auth modes (Snowflake key-pair, Hive Kerberos, Oracle Connect Through)
- Init queries (Oracle, MySQL)
- Hostname help with formatting examples
- Test connection button

**Field Types** (from `templates/credentials.tsx`):
- MySQL: host, port, user, password, database, transaction isolation level, network compression
- PostgreSQL: host, port, user, password, database
- Oracle: host (optional), port (optional), service name/SID, tnsnames, user, password, connect through
- Snowflake: host, port, user, auth method (password/key-pair), database, schema, warehouse
- MSSQL: host, port, user, password, database
- And specialized fields for 15+ other database types

### QueryEditor - Query Configuration

**Location**: `apps/kbc-ui/src/scripts/modules/ex-db-generic/react/components/QueryEditor.jsx`

**Purpose**: Editor for configuring what data to extract from the database.

**Modes**:
- **Simple Mode** (default): Select table, columns, primary key, incremental column
- **Advanced Mode**: Write custom SQL query with optional parameters

**Features**:
- Table selector with search (from `getSourceTables()`)
- Column picker with filtering
- Primary key selection
- Incremental loading configuration
- Column loader for lazy-loading column metadata
- Query name and output table configuration
- Split loading for parallel table chunks
- Support for processors (CSAS, column case conversion)

### ImportTables - Bulk Import UI

**Location**: `apps/kbc-ui/src/scripts/modules/ex-db-generic/react/components/ImportTables/`

**Purpose**: Modal for quickly importing multiple tables from the source database.

**Components**:
- `ImportTablesModal.tsx` - Modal container
- `ImportTablesForm.tsx` - Search and select tables
- Supports filtering by schema
- Loads columns for selected tables
- Sets primary keys automatically from source metadata

## Configuration Types

### Standard Configuration
- Stores all queries in `parameters.tables` array
- Single configuration object
- Simpler structure for legacy components

### Row-Based Configuration
- Each query stored as a separate configuration row
- Supports processors (parallel upload split, column case conversion)
- Enables per-query versioning and state management
- Supports by: MySQL, PostgreSQL, Oracle, MSSQL, Snowflake, Redshift, Firebird, Hive, Teradata, Informix, Impala, DB2, NetSuite

## Credentials Management

### Encryption & Protection

Protected fields (passwords) are handled specially:
1. Marked with `protected: true` in field definitions
2. Stored encrypted in configuration (`#password` naming convention)
3. On credentials edit, old encrypted values preserved if new value not provided
4. Validated during edit with `hasValidCredentials()`

### Validation

Database-specific validation in `hasValidCredentials()`:
- Required fields checked per database type
- SSH tunnel validation (if enabled: host, port, user, private key required)
- Snowflake auth: either password OR key-pair required
- Hive/CSAS: special validation for Kerberos vs password auth
- Oracle: validates tnsnames format if provided

### Special Authentication Methods

- **Snowflake Key-Pair**: Public/private key instead of password
- **Hive Kerberos**: Service principal, kinit principal, config file, keytab
- **Oracle Connect Through**: Proxy user name setup
- **Informix Protocol**: TCP/SSL protocol selection

## Incremental Loading

### Type Mapping

Each database supports specific column types for incremental loading:
- MySQL: timestamp, datetime, int types, decimal, float
- PostgreSQL: timestamp variants, numeric types
- Oracle: date, timestamp variants, numeric types
- Snowflake: extensive numeric and timestamp types
- Informix, Hive, Teradata: specific numeric and date types

Mapped in `constants.js` as `INCREMENTAL_FETCHING_TYPES`

### Configuration

Query can specify:
- `incrementalFetchingColumn` - Which column tracks last fetch
- `incrementalFetchingLimit` - Row limit per fetch (optional)

## Feature Detection

Helper functions determine capabilities per database (`helpers.ts`):

- `supportConfigRows(componentId)` - Row-based config support
- `supportSimpleSetup(componentId)` - Table selection mode
- `supportSplitLoading(componentId)` - Parallel table chunk loading
- `hasSshTunnel(componentId)` - SSH tunnel support
- `hasSsl(componentId)` - SSL configuration
- `hasCdc(componentId)` - Change Data Capture (MSSQL)
- `hasInitQueries(componentId)` - Init query support (Oracle, MySQL)
- `supportConvertColumnCase(componentId)` - Column case conversion (single tenant)

## Query Structure

```javascript
{
  id: string,                           // Unique query ID
  name: string,                         // Query/table display name
  enabled: boolean,                     // Whether query runs on sync
  outputTable: string,                  // Destination table in storage (in.c-bucket.table)
  
  // Simple mode fields
  table: {
    tableName: string,
    schema: string
  },
  columns: string[],                    // Selected columns
  primaryKey: string[],                 // Primary key columns
  incremental: boolean,
  incrementalFetchingColumn: string,
  incrementalFetchingLimit: number,
  
  // Advanced mode fields
  query: string,                        // Custom SQL query
  
  // State
  advancedMode: boolean,
  state: object                         // Query state (last values, etc.)
}
```

## Table Import Workflow

1. User clicks "Import Tables" button
2. `getSourceTables()` called to fetch list from database
3. User selects tables from modal
4. If not already loaded, `getSourceTables()` called again with column load flag
5. `importTables()` called with selected tables
6. For each table:
   - Generates query with table name
   - Sets output table to `in.c-{component}-{config}.{table}`
   - Extracts primary keys from table metadata
   - Creates as new query (or row in row-based config)

## State Management Pattern

### Local State Structure
```javascript
{
  editingCredentials: Map,              // Credentials being edited
  isSavingCredentials: boolean,
  
  editingQueries: Map<queryId, Query>,  // Queries in edit mode
  newQueries: Map<queryId, Query>,      // Created but not saved queries
  isSaving: Map<queryId, boolean>,
  
  sourceTables: List<Table>,            // Available tables from database
  loading: boolean,
  error: string,
  
  pending: Map,                         // Track async operations
  queriesFilter: string                 // Search filter
}
```

### Data Flow
1. Component renders from store state
2. User input → `actionCreators.updateEditing*()`
3. Save/test → `Docker action` (backend) → `updateLocalState()` → store state
4. Emit store change → component re-renders

## API Interactions

### Docker Actions
Called via `callDockerAction(componentId, action, data)`:

- `testConnection` - Validates database credentials
  - Input: credentials in `parameters.db`
  - Output: `{ status: 'success'|'error', message? }`

- `getTables` - Fetches available tables and columns
  - Input: credentials in `parameters.db`, optional `tableListFilter`
  - Output: `{ status, tables: [{ name, schema, columns: [{ name, type, primaryKey }] }] }`

## State Persistence

### Configuration Row Processors

Special processors for row configurations:
- **Parallel Upload** (MSSQL Hive CSAS): `definition: { component: KEBOOLA_PROCESSOR_SPLIT_TABLE }, parameters: { mode: 'slices', numberOfSlices: 60 }`
- **Column Case Conversion** (single tenant): `definition: { component: KDS_TEAM_PROCESSOR_CONVERT_COLUMN_CASE }, parameters: { convert_to: 'lowercase' }`

### Migration Support

- `migrateConfig()` - Migrates from standard config to row-based
- `dismissMigrationAlert()` - Dismiss migration prompt

## Shared Patterns vs Database-Specific

### Shared Patterns
- Credentials template system (database-specific fields)
- Query creation and editing workflow
- Import tables functionality
- Incremental loading UI
- Validation framework
- SSH/SSL support components

### Database-Specific Implementation
- Credentials fields in `templates/credentials.tsx`
- Incremental column type mapping in `constants.js`
- Feature detection via helper functions
- Init queries for Oracle/MySQL
- Hive Kerberos authentication
- Snowflake key-pair auth
- Oracle tnsnames file support
- Informix protocol selection
- NetSuite account/role ID handling

## Notable Patterns

### Credentials Protection
Protected fields preserve existing encrypted values when re-editing, enabling password updates while maintaining encrypted storage.

### Lazy Column Loading
Columns loaded separately from table list to improve performance - initially show tables only, load columns on-demand per table.

### Store Factory Pattern
Each configuration instance gets its own store created by `createStore()`, enabling multiple configs in state simultaneously without conflicts.

### State Normalization
Mix of Immutable.js Maps/Lists for config state with JavaScript objects for form data, handled carefully during save/load cycles.

## Technical Debt & Observations

- **Legacy Flux Architecture**: Uses older Flux pattern with Immutable.js instead of modern TanStack Query
- **Mixed Language**: Blend of old JSX with newer TSX files (gradual migration underway)
- **createReactClass**: Still used in some components instead of function components
- **Protected Fields Pattern**: Complex logic around encrypted field preservation on re-edit could be simplified
- **Database-Specific Complexity**: 15+ database types with specialized fields make credentials form complex
- **Row Configuration Migration**: Still supports legacy standard config format with migration path

## Dependencies

### Internal Modules
- `components/InstalledComponentsActionCreators` - Save/update config
- `components/stores/InstalledComponentsStore` - Fetch config data
- `configurations/ConfigurationRowsActionCreators` - Row CRUD operations
- `components/DockerActionsApi` - Call backend Docker actions (testConnection, getTables)
- `simplified-ui/HeaderButtons` - Page header buttons
- `stack-features/Store` - Feature flags

### Design System Components
- `Alert`, `Button`, `Card`, `FormGroup`, `Label`, `Link`, `Modal`, `Select`, `TextInput` from `@keboola/design`
- Bootstrap `FormControl`
- Custom components: `SshForm`, `SSLForm`, `TestCredentialsButtonGroup`, `PasswordControl`

### Utilities
- `@keboola/utils` - String sanitization, validation
- `underscore` - Collection utilities
- `immutable` - Data structures
- `bluebird` - Promise utilities

## User-Facing Features

### Feature 1: Simple Table Extraction
- Select table from database
- Pick columns to extract
- Identify primary key
- Set output destination table
- Configure incremental loading if applicable

### Feature 2: Advanced SQL Queries
- Write custom SQL query
- Parameter support
- Scheduled execution
- Query validation before save

### Feature 3: Bulk Table Import
- Search and select multiple tables
- Auto-load column metadata
- Auto-detect primary keys from source
- Create all queries in one operation

### Feature 4: Database Connection Management
- Test connection before saving
- Support 15+ database types
- SSH tunnel for secure connections
- SSL encryption
- Special auth: Kerberos, key-pairs, proxies

### Feature 5: Incremental Loading
- Select eligible columns for tracking
- System maintains fetch checkpoints
- Efficient delta processing

## Code Examples

### Store Access Pattern
```javascript
const store = storeProvisioning.createStore(componentId, configId);
const credentials = store.getCredentials();
const queries = store.getQueriesFiltered();
const isValid = store.hasValidCredentials(editingCredentials);
```

### Action Pattern
```javascript
const actions = actionsProvisioning.createActions(componentId);
actions.saveCredentialsEdit(configId, 'Update credentials')
  .then(() => {
    // Navigate or reload
  });

actions.importTables(configId, [
  { schema: 'public', tableName: 'users' },
  { schema: 'public', tableName: 'orders' }
], true);
```

### Credentials Field Definition
```typescript
const mysqlFields = [
  commonFields.host,
  commonFields.port,
  commonFields.user,
  commonFields.password,
  { ...commonFields.database, required: false },
  {
    label: 'Transaction Isolation Level',
    name: 'transactionIsolationLevel',
    type: 'select',
    options: [
      { value: 'REPEATABLE READ', label: 'Repeatable read' },
      // ...
    ],
  },
];
```

## Related Modules

- `ex-mongodb` - MongoDB-specific extractor with different query model
- `transformations-v2` - Uses extracted tables as transformation inputs
- `storage` - Destination for extracted data
- `configurations` - Configuration versioning and row management

## Testing

Test files follow the main source structure:
- `constants.test.js` - Constants validation
- `helpers.test.js` - Feature detection functions
- `storeProvisioning.test.js` - Store factory and query logic

Key areas tested:
- Credential validation per database type
- Query structure generation
- Feature detection
- Protected field handling
- Query name generation
