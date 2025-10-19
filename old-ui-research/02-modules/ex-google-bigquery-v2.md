# Module: Google BigQuery Extractor v2 (ex-google-bigquery-v2)

## Overview

The Google BigQuery Extractor v2 (`ex-google-bigquery-v2`) is a Keboola connector for extracting data from Google BigQuery data warehouses. The module supports:

- Service account authentication via JSON key
- Dataset and table browsing and selection
- SQL query execution against BigQuery
- Incremental fetching with timestamp/numeric columns
- Loading options (replace vs append, primary keys)
- Optional AVRO file output (for avro variant)
- Unload configuration for query results
- Both direct table queries and custom SQL queries

## File Structure

```
ex-google-bigquery-v2/
├── routes.jsx
├── constants.js
├── react/
│   └── components/
│       ├── DataSource.jsx
│       ├── Query.jsx
│       ├── TableOutput.jsx
│       ├── FileOutputSettings.jsx
│       ├── IncrementalFetching.jsx
│       ├── LoadingOptions.jsx
│       └── Unload.jsx
├── adapters/
│   ├── source.js
│   ├── query.js
│   ├── tableOutputSettings.js
│   ├── fileOutputSettings.js
│   ├── incrementalFetching.js
│   ├── loadingOptions.js
│   ├── unload.js
│   ├── rowConform.js
│   └── rowOnSave.js
└── actions/
    ├── getTables.js
    └── getColumns.js
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/{componentId}/:config` | GenericConfigBody | Service account and unload configuration |
| `/{componentId}/:config/rows/:row` | ConfigurationRow | Data source, query, and output settings |

## Key Components

### DataSource (Index/Row level)
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-bigquery-v2/react/components/DataSource.jsx`
- **Purpose**: Select BigQuery dataset and table
- **Features**:
  - Dataset browser
  - Table browser with schema preview
  - Table selection with descriptions
  - API integration for table metadata

### Query
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-bigquery-v2/react/components/Query.jsx`
- **Purpose**: Configure SQL query execution
- **Features**:
  - SQL editor
  - Advanced mode toggle
  - Legacy SQL vs Standard SQL support
  - Query validation and syntax highlighting

### TableOutput
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-bigquery-v2/react/components/TableOutput.jsx`
- **Purpose**: Map BigQuery results to Keboola output table
- **Features**:
  - Output table name specification
  - Table destination configuration
  - Default bucket routing

### FileOutputSettings
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-bigquery-v2/react/components/FileOutputSettings.jsx`
- **Purpose**: AVRO file output configuration (for AVRO variant)
- **Features**:
  - Output file name
  - Format options
  - Compression settings

### IncrementalFetching
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-bigquery-v2/react/components/IncrementalFetching.jsx`
- **Purpose**: Configure incremental data loading
- **Features**:
  - Column selection for incremental key
  - Data type validation (INTEGER, FLOAT, TIMESTAMP, DATE, etc.)
  - Limit configuration for row count

### LoadingOptions
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-bigquery-v2/react/components/LoadingOptions.jsx`
- **Purpose**: Table loading behavior configuration
- **Features**:
  - Load type (Replace vs Append)
  - Primary key specification (for deduplication)
  - Delete/update conditions

### Unload
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-bigquery-v2/react/components/Unload.jsx`
- **Purpose**: Configure BigQuery unload settings
- **Features**:
  - Destination dataset configuration
  - Dataset location selection (multi-region, regional)
  - Temporary dataset management

## Adapters

### source
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-bigquery-v2/adapters/source.js`
- **Purpose**: Parse/serialize dataset and table selection
- **Structure**:
  ```javascript
  {
    datasetId: 'my_dataset',
    tableId: 'my_table',
    query: null  // or SQL query if using query mode
  }
  ```

### query
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-bigquery-v2/adapters/query.js`
- **Purpose**: Parse/serialize SQL query configuration
- **Structure**:
  ```javascript
  {
    query: 'SELECT * FROM table',
    useLegacySql: true,
    advancedMode: true
  }
  ```

### tableOutputSettings
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-bigquery-v2/adapters/tableOutputSettings.js`
- **Purpose**: Parse/serialize table output configuration
- **Structure**:
  ```javascript
  {
    tableName: 'output_table',
    bucket: 'out.c-default'
  }
  ```

### incrementalFetching
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-bigquery-v2/adapters/incrementalFetching.js`
- **Purpose**: Parse/serialize incremental loading settings
- **Structure**:
  ```javascript
  {
    incrementalFetchingColumn: 'last_updated',
    limit: 0  // 0 = unlimited
  }
  ```

### loadingOptions
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-bigquery-v2/adapters/loadingOptions.js`
- **Purpose**: Parse/serialize loading behavior
- **Structure**:
  ```javascript
  {
    loadType: 'replace' | 'append',
    primaryKey: ['id'],
    deleteWhereColumn: null,
    deleteWhereValue: null
  }
  ```

### unload
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-bigquery-v2/adapters/unload.js`
- **Purpose**: Parse/serialize unload configuration
- **Structure**:
  ```javascript
  {
    datasetId: 'keboola_temp_dataset',
    location: 'US'
  }
  ```

### rowConform
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-bigquery-v2/adapters/rowConform.js`
- **Purpose**: Normalize row configuration on load
- **Operations**: Validation and data transformation

### rowOnSave
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-bigquery-v2/adapters/rowOnSave.js`
- **Purpose**: Transform row configuration before saving
- **Operations**: Validation and serialization

## Actions

### getTables
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-bigquery-v2/actions/getTables.js`
- **Purpose**: Async action to load dataset tables
- **Returns**: Array of tables with metadata

### getColumns
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-bigquery-v2/actions/getColumns.js`
- **Purpose**: Async action to load table column schema
- **Returns**: Array of columns with types

## Configuration Structure

### Index (Global) Configuration
```javascript
{
  parameters: {
    serviceAccount: { /* service account JSON */ }
  }
}
```

### Row (Per-Query) Configuration
```javascript
{
  parameters: {
    query: {
      // Data source (one of):
      datasetId: 'dataset',
      tableId: 'table',
      query: 'SELECT * FROM ...',  // OR custom query
      
      // Output
      tableName: 'output_table',
      
      // Incremental loading
      incrementalFetchingColumn: 'timestamp',
      
      // Loading options
      primaryKey: ['id'],
      incremental: false,
      
      // Legacy SQL
      useLegacySql: false
    }
  }
}
```

## State Management

- **Pattern Used**: Adapter-based configuration (createRoute pattern)
- **Configuration Structure**:
  - Index level: Service account (shared), Unload settings
  - Row level: Data source, Query, Output, Incremental, Loading
- **Data Flow**:
  1. Configuration loaded via adapter `parseConfiguration`
  2. Form state updated via `onChange` callbacks
  3. On save, adapter `createConfiguration` converts form to Keboola config
  4. Configuration persisted to API

## Constants

### DatasetLocations
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-bigquery-v2/constants.js`
- **Purpose**: Predefined BigQuery dataset locations
- **Options**:
  - Multi-region: US, EU
  - America: Iowa, Las Vegas, Los Angeles, Montreal, Northern Virginia, Oregon, Salt Lake City, São Paulo, Santiago, South Carolina, Toronto
  - Europe: Belgium, Finland, Frankfurt, London, Netherlands, Warsaw, Zürich
  - Asia Pacific: Delhi, Hong Kong, Jakarta, Melbourne, Mumbai, Osaka, Seoul, Singapore, Sydney, Taiwan, Tokyo

### DefaultDatasetLocation
- Default: US

### IncrementalFetchingAllowedTypes
- INTEGER, FLOAT, NUMERIC, BIGNUMERIC, TIMESTAMP, DATE, TIME, DATETIME

## Dependencies

### Internal Modules
- `modules/wr-google-bigquery-v2/adapters/serviceAccount` - Service account auth
- `modules/configurations/utils/createRoute` - Generic route configuration
- `modules/configurations/utils/columnTypeConstants` - Table column definitions
- `modules/configurations/utils/renderHelpers` - CollapsibleSection UI

### External Packages
- `react` - v18+
- `immutable` - v4+
- `react-bootstrap` - Form components
- `@keboola/design` - UI components
- `@keboola/constants` - Documentation URLs

## User-Facing Features

### Feature 1: Data Source Selection
- **Description**: Choose BigQuery table or custom query as data source
- **Workflow**:
  1. Configure service account key
  2. In data source section, select dataset
  3. Select table (with schema preview)
  4. OR enter custom SQL query
  5. Save data source configuration
- **Components**: DataSource, Query

### Feature 2: Incremental Loading
- **Description**: Automatically fetch only data changed since last run
- **Workflow**:
  1. In incremental fetching section, select column
  2. Column must be numeric or timestamp type
  3. Set optional limit for max rows
  4. System tracks last extracted value
  5. Next run fetches only newer rows
- **Supported Types**: INTEGER, FLOAT, NUMERIC, BIGNUMERIC, TIMESTAMP, DATE, TIME, DATETIME
- **Components**: IncrementalFetching

### Feature 3: Loading Options
- **Description**: Control how data is loaded into Keboola Storage
- **Workflow**:
  1. Choose load type (replace existing table or append)
  2. For append mode, optionally set primary key
  3. For deduplication, specify delete conditions
  4. Save loading options
- **Load Types**:
  - Replace: Clear table and load fresh data
  - Append: Add data to existing table
- **Components**: LoadingOptions

### Feature 4: Table Output Mapping
- **Description**: Map BigQuery results to Keboola Storage table
- **Workflow**:
  1. Specify output table name
  2. System routes to default bucket
  3. Table created if not exists
  4. Data loaded per loading options
- **Components**: TableOutput, FileOutputSettings

### Feature 5: AVRO File Output (AVRO Variant)
- **Description**: Export BigQuery data as AVRO files
- **Workflow**:
  1. Configure unload destination
  2. Set file name pattern
  3. Configure compression
  4. Results exported to files
- **Components**: FileOutputSettings, Unload

### Feature 6: Unload Configuration
- **Description**: Configure BigQuery temporary dataset for unload operations
- **Workflow**:
  1. Specify dataset ID for temp tables
  2. Select dataset location
  3. System creates temp dataset if needed
  4. Temp data cleaned up after extraction
- **Components**: Unload
- **Location Options**: Multi-region (US, EU) or regional

## Technical Debt & Observations

- **Multiple Adapters**:
  - Separate adapters for each configuration section
  - No shared validation logic
  - Could benefit from centralized schema validation

- **Dual SQL Support**:
  - Supports both Legacy SQL and Standard SQL
  - Legacy SQL deprecated but still supported
  - Code could be cleaned up once migration complete

- **Configuration Complexity**:
  - Many optional parameters
  - Some combinations mutually exclusive (table vs query)
  - Could benefit from validation library

- **Error Handling**:
  - Limited component-level error display
  - Errors likely surfaced via Docker actions
  - Could improve inline validation

- **Type Safety**:
  - Mostly JavaScript (not TypeScript)
  - Manual prop validation with PropTypes
  - No runtime schema validation

- **Testing**:
  - Adapters have test files with specs
  - Component tests limited
  - Integration tests via Docker actions

## Code Examples

### Query Configuration Adapter
```javascript
const createConfiguration = (localState) => {
  return fromJS({
    parameters: {
      query: {
        query: localState.get('query', ''),
        useLegacySql: localState.get('useLegacySql', true),
        advancedMode: localState.get('advancedMode', true),
      },
    },
  });
};

const parseConfiguration = (configData) => {
  return fromJS({
    query: configData.getIn(['parameters', 'query', 'query'], ''),
    useLegacySql: configData.getIn(['parameters', 'query', 'useLegacySql'], true),
    advancedMode: configData.getIn(['parameters', 'query', 'advancedMode'], true),
  });
};
```

### Incremental Fetching Adapter
```javascript
const createConfiguration = (localState) => {
  return fromJS({
    parameters: {
      query: {
        incrementalFetchingColumn: localState.get('incrementalFetchingColumn', ''),
        limit: localState.get('limit', 0),
      },
    },
  });
};

const parseConfiguration = (configuration) => {
  return fromJS({
    incrementalFetchingColumn: configuration.getIn(
      ['parameters', 'query', 'incrementalFetchingColumn'],
      ''
    ),
    limit: configuration.getIn(['parameters', 'query', 'limit'], 0),
  });
};
```

### Route Configuration
```javascript
const routeSettings = (componentId) => ({
  componentId,
  index: {
    sections: [
      {
        render: CollapsibleSection({
          title: 'Google Service Account Key',
          contentComponent: ServiceAccountSection,
        }),
        onSave: serviceAccountAdapter.createConfiguration,
        onLoad: serviceAccountAdapter.parseConfiguration,
        isComplete: serviceAccountAdapter.isComplete,
      },
      {
        render: CollapsibleSection({
          title: 'Unload Configuration',
          contentComponent: UnloadSection,
        }),
        onSave: unloadAdapter.createConfiguration,
        onLoad: unloadAdapter.parseConfiguration,
        isComplete: unloadAdapter.isComplete,
      },
    ],
  },
  row: {
    sections: [
      {
        render: DataSourceSection,
        onSave: sourceAdapter.createConfiguration,
        onLoad: sourceAdapter.parseConfiguration,
      },
      {
        render: TableOutputSection,
        onSave: tableOutputSettingsAdapter.createConfiguration,
        onLoad: tableOutputSettingsAdapter.parseConfiguration,
      },
      {
        render: IncrementalFetchingSection,
        onSave: incrementalFetchingAdapter.createConfiguration,
        onLoad: incrementalFetchingAdapter.parseConfiguration,
      },
      {
        render: QuerySection,
        onSave: queryAdapter.createConfiguration,
        onLoad: queryAdapter.parseConfiguration,
      },
    ],
  },
});
```

## Related Modules

- `modules/wr-google-bigquery-v2` - BigQuery writer (complements extractor)
- `ex-google-analytics-v4` - Similar OAuth and configuration patterns
- `ex-google-ads` - Similar account selection
- `modules/configurations` - Generic configuration management

## Testing

- **Coverage**: Moderate - adapters tested with spec files
- **Test Files**: `adapters/*.test.js` and `adapters/*.spec.def.js`
- **Key Test Areas**:
  - Adapter parseConfiguration/createConfiguration
  - Configuration validation
  - Query building
  - Incremental fetching validation
- **Testing Approach**: Jest with Immutable.js assertions

## BigQuery-Specific Notes

### Dataset Locations
- MultiRegion options (US, EU) for replicated data
- Regional options for data residency compliance
- Choose location based on data residency requirements

### Incremental Fetching
- Requires numeric or timestamp column
- System tracks last extracted value
- Next extraction starts from that point
- Useful for large tables with new data appended

### SQL Dialect
- Standard SQL: Recommended, modern SQL syntax
- Legacy SQL: Old dialect, deprecated but supported
- Choose based on query complexity

### Temporary Datasets
- Used during AVRO export operations
- Auto-created in specified location
- Cleaned up after extraction
- Location important for compliance

## Migration Notes

- **Future Improvements**:
  - Migrate adapters to TypeScript for type safety
  - Use Zod or similar for runtime validation
  - Add schema validation for configuration
  - Migrate to modern React hooks pattern
  - Add comprehensive component testing
  - Move away from Legacy SQL (deprecated)

