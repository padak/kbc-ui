# Module: ex-mongodb

## Overview

The `ex-mongodb` module provides a specialized MongoDB data extractor UI. Unlike the generic database extractor, MongoDB has a document-oriented model requiring different configuration and query approaches. The module supports collection selection, MongoDB query and sort syntax, two export modes (raw and mapping), incremental loading via tracking fields, and row-based configuration for individual exports.

**Key Capabilities**: Collection extraction, MongoDB queries and filters, document flattening via mapping, incremental fetching, SSH tunnel and SSL support, row-based versioning.

## File Structure

```
ex-mongodb/
├── routes.jsx                         # Route definitions
├── constants.js                       # Constants: route names, protocols, ports, export modes
├── helpers.js                         # Validation helpers for queries, credentials, mapping
├── helpers.test.js
├── storeProvisioning.js               # Store factory and export getters
├── storeProvisioning.test.js
├── actionsProvisioning.js             # Action creators for credentials and exports
├── react/
│   ├── components/
│   │   ├── QueryActionButtons.jsx
│   │   ├── QueryDeleteButton.jsx
│   │   ├── QueryEditor.jsx
│   │   ├── QueryName.jsx
│   │   ├── CreateQueryElement.jsx
│   │   └── MigrateToRowsButton.tsx
│   └── pages/
│       ├── index/
│       │   └── Index.jsx
│       ├── query-detail/
│       │   └── QueryDetail.jsx
│       ├── credentials/
│       │   ├── CredentialsPage.jsx
│       │   └── CredentialsForm.jsx
│       └── row/
│           ├── Detail.tsx
│           └── RowDetailHeader.tsx
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/:config` | Index | Main configuration page listing all exports |
| `/:config/rows/:row` | Detail | Edit individual row-based export |
| `/:config/query/:query` | QueryDetail | Edit export configuration (deprecated, rows-based) |
| `/:config/credentials` | CredentialsPage | Edit MongoDB connection credentials |

## Key Components

### storeProvisioning.js - Store Factory

**Location**: `apps/kbc-ui/src/scripts/modules/ex-mongodb/storeProvisioning.js`

**Purpose**: Creates and manages store for MongoDB configuration, handling credentials, exports, and incremental tracking state.

**Key Methods**:
- `createStore(componentId, configId)` - Creates store instance
- `getCredentials()` - Get saved MongoDB connection credentials
- `getNewCredentials()` - Get credentials with default ports applied
- `hasValidCredentials(credentials)` - Validate credentials based on protocol
- `getQueries()` / `getQueriesFiltered()` - List all exports or filtered by search
- `getConfigQuery(queryId)` - Get specific export (editing, new, or saved)
- `getQueriesPendingActions()` - Track ongoing operations
- `getLocalState()` - Access local editing state

**Data Structure**:
- Credentials stored in `parameters.db`
- Exports stored in `parameters.exports` (list of export configs)
- Local state tracks editing, saving, pending operations
- Component state tracks last fetched values for incremental loading

### actionsProvisioning.js - Actions

**Location**: `apps/kbc-ui/src/scripts/modules/ex-mongodb/actionsProvisioning.js`

**Purpose**: Handles credential and export state mutations, API calls, and migration.

**Key Methods**:
- `testCredentials(configId, credentials)` - Test MongoDB connection
- `saveCredentialsEdit(configId, changeDescription)` - Save updated credentials
- `createNewQuery(configId)` - Create new export
- `saveQueryEdit(configId, queryId, changeDescription)` - Save export changes
- `deleteQuery(configId, queryId)` - Delete export
- `updateEditingQuery(configId, query)` - Update query in edit mode
- `resetQueryState(configId, queryId)` - Clear incremental state for export
- `resetQueryEdit(configId, queryId)` - Discard unsaved changes
- `changeQueryEnabledState(configId, qid, newValue)` - Enable/disable export

### CredentialsForm - Connection UI

**Location**: `apps/kbc-ui/src/scripts/modules/ex-mongodb/react/pages/credentials/CredentialsForm.jsx`

**Purpose**: Dynamic form for MongoDB connection with protocol variants.

**Protocol Support**:
- **Default (mongodb://)**: Traditional URI scheme
  - Fields: host, port, username, password, authentication database, database
- **SRV (mongodb+srv://)**: MongoDB Atlas style
  - Fields: host (FQDN), username, password, authentication database, database
  - Port not required
- **Custom URI**: Direct connection string
  - Fields: URI, password (if needed)
  - Must not include password in URI itself

**Additional Features**:
- SSH tunnel configuration (host, user, port, private key)
- SSL/TLS certificate configuration
- Test connection button
- Password field with encryption support

**Field Structure**:
```javascript
{
  protocol: '',                         // '', 'mongodb+srv', 'custom_uri'
  host: string,
  port: number,                         // Optional for SRV
  user: string,
  '#password': string,                  // Protected field
  authenticationDatabase: string,       // Optional
  database: string,
  ssh: {
    enabled: boolean,
    sshHost: string,
    user: string,
    sshPort: number,
    keys: {
      public: string,
      '#private': string
    }
  },
  ssl: {
    enabled: boolean,
    // SSL certificate fields
  }
}
```

## Export Configuration Model

Unlike SQL extractors with table/column model, MongoDB uses document collections and flexible mapping.

### Query Structure

```javascript
{
  id: string,                           // Unique export ID
  name: string,                         // Export display name
  enabled: boolean,                     // Whether export runs on sync
  collection: string,                   // MongoDB collection name
  mode: 'raw' | 'mapping',              // Export mode
  
  // Query options
  query: string,                        // MongoDB query JSON (optional)
  sort: string,                         // MongoDB sort JSON (optional)
  
  // Incremental tracking
  incremental: boolean,
  incrementalFetchingColumn: string,    // Field to track for delta
  
  // Mapping mode fields
  mapping: object | string,             // Column mapping definition (if mode='mapping')
  includeParentInPK: boolean,           // Include parent object in primary key
  
  // Output configuration
  tableName: string,                    // Destination table name
  
  // State
  state: object                         // Component state (last fetched values)
}
```

### Export Modes

#### Raw Mode
- Exports documents as-is without flattening
- All document fields become columns
- Nested objects and arrays handled based on extraction backend
- Simpler setup for flat collections

#### Mapping Mode
- Applies custom column mapping to flatten nested structures
- Mapping definition: field path → destination column name
- Handles nested objects and arrays via path syntax (dot notation)
- More control but requires schema understanding

Example mapping:
```json
{
  "_id": "id",
  "user.name": "user_name",
  "user.email": "user_email",
  "tags[0]": "first_tag",
  "metadata": "full_metadata"
}
```

## Credentials Management

### Connection String Variants

**Standard (mongodb://)**:
```
mongodb://user:password@host:port/database?authSource=admin
```

**SRV (mongodb+srv://)**:
```
mongodb+srv://user:password@cluster.mongodb.net/database
```

**Custom URI**:
- User provides complete URI
- Password field stores authentication password if needed
- Useful for connection strings with special characters or Compass exports

### Validation Rules

`hasValidCredentials()` checks:

1. **Standard Protocol** (`mongodb://`):
   - host, port, user, password, database all required
   - SRV protocol: port optional
   - Password can be empty if saved credential exists

2. **SRV Protocol** (`mongodb+srv://`):
   - host (FQDN), user, password, database required
   - port optional and ignored
   - Password can be empty if saved credential exists

3. **Custom URI Protocol** (`custom_uri`):
   - URI non-empty
   - Password required

4. **SSH Tunnel** (if enabled):
   - All standard fields valid
   - sshHost, user, sshPort all required
   - Private key required (`keys.#private`)

5. **SSL/TLS** (if enabled):
   - Certificate/key files configured

### Protected Fields

- `#password` - Encrypted password field
- `ssh.keys.#private` - Encrypted SSH private key
- Existing encrypted values preserved on re-edit if new value not provided

## Query and Filter Support

### MongoDB Query Syntax

`query` field accepts MongoDB query operators:
```javascript
{
  "status": "active",
  "age": { "$gt": 18 },
  "tags": { "$in": ["featured", "new"] }
}
```

Validated as JSON before save.

### MongoDB Sort Syntax

`sort` field specifies result ordering:
```javascript
{
  "created_at": -1,
  "name": 1
}
```

Validated as JSON before save.

### Validation

Both fields:
- Optional (can be empty string)
- When provided, must be valid JSON
- Checked in `isValidQuery()` helper

## Incremental Loading

### Mechanism

Incremental loading tracks progress via MongoDB field values:
- Set `incrementalFetchingColumn` to field name (e.g., "updated_at", "_id")
- System stores last value fetched in component state
- Next run fetches only documents changed since last value
- Efficient for large collections

### State Tracking

Stored in component state (not config):
```javascript
{
  component: {
    lastFetchedRow: {
      [exportId]: {
        value: lastFetchedValue,  // Last observed value
        timestamp: ...,
      }
    }
  }
}
```

### Workflow

1. First run: fetch all documents, store max value of incremental column
2. Subsequent runs: use `query` like `{ "updated_at": { "$gt": lastValue } }`
3. User can reset via `resetQueryState()` to fetch from beginning

## Configuration Types

### Standard Config (Legacy)
- All exports in `parameters.exports` array
- Single configuration object
- Supported but discouraged

### Row-Based Config (Current)
- Each export stored as separate configuration row
- Each row has its own state (last fetched value)
- Per-export versioning and history
- Cleaner organization, better for large numbers of exports

Migration path:
- `migrateToRows()` - Migrates exports from array to rows
- Copies state for each export
- Updates configuration after migration

## State Management

### Local State Structure
```javascript
{
  editingCredentials: Map,              // Credentials being edited
  isSavingCredentials: boolean,
  
  newCredentials: Map,                  // New credentials (optional)
  
  editingQueries: Map<queryId, Query>,  // Exports in edit mode
  newQueries: Map<queryId, Query>,      // Created but not saved
  isSaving: Map<queryId, boolean>,
  isChanged: Map<queryId, boolean>,     // Track unsaved changes
  
  pending: Map,                         // Track pending operations
  queriesFilter: string                 // Search filter text
}
```

### Data Flow

1. Component renders from store state
2. User input → `actionCreators.updateEditingQuery()`
3. Save → `prepareQueryToSave()` → config save → `updateLocalState()`
4. Store change event → component re-renders
5. Test connection → `callDockerAction('testConnection')`

### Query Preparation

`prepareQueryToSave()` helper:
- Converts mapping string to JSON object (if in mapping mode)
- Deletes mapping for raw mode
- Handles incremental vs. query/sort mutually exclusive logic:
  - If query OR sort provided: delete incremental column
  - If incremental column provided: delete query and sort

## API Interactions

### Docker Actions

Called via `callDockerAction(componentId, action, data)`:

- `testConnection` - Validates MongoDB credentials
  - Input: connection in `parameters.db`, empty exports list
  - Output: `{ status: 'success'|'error', message? }`

### Configuration Rows API

For row-based exports:
- `RowsActions.createSimple()` - Create new row
- `RowsActions.updateSimple()` - Update row
- `RowsActions.delete()` - Delete row
- Row configuration includes parameters object with export config

## Validation Framework

### Query Validation

`isValidQuery(query)` checks:
- Name: non-empty
- Collection: non-empty
- Query (if provided): valid JSON
- Sort (if provided): valid JSON
- Mode-specific:
  - Raw mode: always valid
  - Mapping mode: mapping object must be valid JSON, must be an object

### Mapping Validation

`isMappingValid(mapping)`:
- Accept Map or string
- If string, parse as JSON
- Validate as JSON object

### Combined Validation

- Name and collection required
- Query and sort optional but must be valid JSON if provided
- If raw mode: only name, collection, query, sort matter
- If mapping mode: additionally requires valid mapping

## Helper Functions

### isValidQuery(query)
Comprehensive query structure validation - used before save to prevent invalid configs.

### isMappingValid(mapping)
Checks mapping object is valid JSON with proper structure for column mapping.

### updateProtectedProperties(newCredentials, oldCredentials)
Preserves encrypted password if not changed - allows re-editing without re-entering password.

### migrateToRows(configId)
Migrates exports from array-based to row-based configuration:
1. Delete existing configuration rows
2. For each export in array:
   - Create new configuration row
   - Copy export config to row parameters
   - Preserve incremental state if exists
3. Save updated config without exports array

### prepareQueryToSave(query)
Prepares query for save:
1. Convert mapping string to JSON if mapping mode
2. Delete mapping if raw mode
3. Handle incremental vs. query/sort exclusivity
4. Set tableName from query name if not set

## Shared Patterns with ex-db-generic

### Similarities
- Store factory pattern (`createStore()`)
- Local state management with Immutable.js
- Protected field encryption handling
- Credentials testing via Docker action
- createReactClass-based components
- Legacy Flux architecture

### Differences
- Document-oriented model vs. table/column
- Two export modes (raw/mapping) vs. simple/advanced SQL
- No table/column metadata loading
- Simpler validation (queries are flexible JSON)
- No split loading or parallel features
- Row-based configuration built-in (not optional)

## Notable Patterns

### Mapping Mode Flexibility
Allows flattening complex nested MongoDB documents to relational table format without requiring backend changes.

### Incremental Field Tracking
Simple approach to delta processing - stores last value of a field and filters on next run, avoiding complex state.

### Protocol Polymorphism
Single credentials form handles three different MongoDB URI schemes with different field requirements.

### Query String Handling
Query and sort fields stored as JSON strings, validated before save, flexible for future syntax enhancements.

## Technical Debt & Observations

- **Legacy Architecture**: Uses older Flux with Immutable.js, not modern TanStack Query
- **Mixed Language**: Some new TSX files (RowDetailHeader, MigrateToRowsButton) alongside older JSX
- **Row Migration**: Still supports array-based config with migration path, complexity worth simplifying
- **Query Preparation**: Logic to convert mapping string/Map is tangled with incremental handling
- **State Tracking**: Per-row lastFetchedValue stored in component state instead of configuration metadata

## Dependencies

### Internal Modules
- `components/InstalledComponentsActionCreators` - Save/load config
- `components/stores/InstalledComponentsStore` - Config data access
- `components/DockerActionsApi` - Docker action calls
- `configurations/ConfigurationRowsActionCreators` - Row CRUD

### Design System Components
- `Alert`, `FormGroup`, `HelpBlock`, `Icon`, `Label`, `TextInput`, `Tooltip` from `@keboola/design`
- Bootstrap `FormControl`
- Custom components: `PasswordControl`, `Select`, `SshForm`, `SSLForm`, `TestCredentialsButtonGroup`

### Utilities
- `@keboola/utils` - String utilities (webalize)
- `underscore` - Collection utilities
- `immutable` - Map, List data structures
- `bluebird` - Promise utilities

## User-Facing Features

### Feature 1: MongoDB Connection Setup
- Three protocol options: standard, SRV, custom URI
- Optional SSH tunnel
- Optional SSL/TLS
- Test connection before saving
- Auto-detects authentication database

### Feature 2: Collection Export Configuration
- Select collection name
- Optional MongoDB query filter (JSON)
- Optional sort specification (JSON)
- Choose export mode (raw or mapped)

### Feature 3: Raw Mode Export
- Exports documents without transformation
- All fields become columns
- Simpler setup for simple schemas

### Feature 4: Mapping Mode Export
- Custom column mapping definition
- Flatten nested objects via path notation
- Handle arrays and complex structures
- Full control over output schema

### Feature 5: Incremental Loading
- Select field to track (typically timestamp or ID)
- Automatic delta processing
- Reset capability to re-fetch from beginning
- Efficient for ongoing syncs

## Code Examples

### Store Access
```javascript
const store = storeProvisioning.createStore(componentId, configId);
const credentials = store.getCredentials();
const exports = store.getQueriesFiltered();
const isValid = store.hasValidCredentials(editingCredentials);
```

### Actions Usage
```javascript
const actions = actionsProvisioning.createActions(componentId);

// Save credentials
actions.saveCredentialsEdit(configId, 'Update MongoDB URI')
  .then(() => RoutesStore.getRouter().transitionTo(...));

// Create new export
const newExport = actions.createNewQuery(configId);

// Update export
actions.updateEditingQuery(configId, exportWithChanges);

// Save export
actions.saveQueryEdit(configId, exportId, 'Configure collection export')
  .then(() => {
    // Navigate or reload
  });

// Test credentials
actions.testCredentials(configId, editingCredentials)
  .then(result => {
    if (result.status === 'success') {
      // Connection valid
    }
  });
```

### Query Validation
```javascript
import { isValidQuery, isMappingValid } from './helpers';

if (!isValidQuery(export)) {
  console.error('Invalid export configuration');
}

if (export.mode === 'mapping' && !isMappingValid(export.mapping)) {
  console.error('Invalid mapping');
}
```

### Mapping Configuration Example
```javascript
// Flattening nested MongoDB document
const query = {
  name: 'Users Export',
  collection: 'users',
  mode: 'mapping',
  mapping: {
    '_id': 'id',
    'profile.firstName': 'first_name',
    'profile.lastName': 'last_name',
    'profile.email': 'email',
    'tags': 'all_tags'
  },
  incremental: false,
  tableName: 'users'
};
```

## Related Modules

- `ex-db-generic` - Generic SQL database extractor (similar patterns)
- `storage` - Destination for exported data
- `configurations` - Row versioning and history
- `transformations-v2` - Data transformation and processing

## Testing

Test coverage includes:
- `helpers.test.js` - Query validation, mapping validation
- `storeProvisioning.test.js` - Store factory behavior
- `actionsProvisioning.js` - Action logic (implicit testing)

Key test areas:
- Credential validation for each protocol
- Query structure validation
- Mapping validation
- Protected field handling
- Migration from array to rows
