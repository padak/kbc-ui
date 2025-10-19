# Module: wr-google-bigquery-v2 (Google BigQuery Writer V2)

## Overview

The wr-google-bigquery-v2 module enables data export from Keboola Storage to Google BigQuery. It provides Google Service Account authentication, dataset selection, table configuration with load type options (append/replace), clustering, partitioning, and column editing capabilities. The module is designed for data warehouse scenarios with support for advanced BigQuery features.

## File Structure

```
wr-google-bigquery-v2/
├── routes.js                              # Route configuration
├── react/
│   └── components/
│       ├── ServiceAccountSection.jsx      # Google Service Account setup
│       ├── TargetDatasetSection.jsx       # BigQuery dataset selection
│       ├── TargetTableSection.jsx         # Target table configuration
│       ├── LoadTypeSection.jsx            # Load type (append/replace)
│       ├── ClusteringSection.jsx          # Clustering configuration
│       └── PartitioningSection.jsx        # Partitioning configuration
├── adapters/
│   ├── serviceAccount.js                  # Service account adapter
│   ├── targetDataset.js                   # Dataset adapter
│   ├── targetTable.js                     # Table adapter
│   ├── loadType.js                        # Load type adapter
│   ├── clustering.js                      # Clustering adapter
│   ├── partitioning.js                    # Partitioning adapter
│   └── rowConform.js                      # Configuration normalization
├── helpers/
│   └── columnsEditorDefinition.js         # Column editor setup
└── mapping/
    └── ... (Multiple database adapters)
```

## Routes & Configuration

### Route Structure

Uses `createRoute()` utility with index and row-level configuration:

```typescript
{
  componentId: 'keboola.wr-google-bigquery-v2',
  index: {
    sections: [
      {
        render: CollapsibleSection with ServiceAccountSection,
        onSave: serviceAccount.createConfiguration,
        onLoad: serviceAccount.parseConfiguration,
        isComplete: serviceAccount.isComplete
      },
      {
        render: CollapsibleSection with TargetDatasetSection,
        onSave: targetDataset.createConfiguration,
        onLoad: targetDataset.parseConfiguration,
        isComplete: targetDataset.isComplete
      }
    ]
  },
  row: {
    onConform: rowConform,
    parseTableId: (row) => row.getIn(['storage', 'input', 'tables', 0, 'source']),
    hasState: false,
    sections: [
      {
        render: TargetTableSection,
        onSave: targetTable.createConfiguration,
        onLoad: targetTable.parseConfiguration,
        onCreate: targetTable.createEmptyConfiguration
      },
      {
        render: LoadTypeSection,
        onSave: loadType.createConfiguration,
        onLoad: loadType.parseConfiguration
      },
      {
        render: ClusteringSection,
        onSave: clustering.createConfiguration,
        onLoad: clustering.parseConfiguration
      },
      {
        render: PartitioningSection,
        onSave: partitioning.createConfiguration,
        onLoad: partitioning.parseConfiguration
      },
      createColumnsEditorSection(columnsEditorDefinition)
    ],
    columns: [
      { name: 'Source Table', type: TABLE_LINK },
      { name: 'BigQuery Table', type: VALUE },
      { name: 'Clustering', type: VALUE, value: (row) => row.getIn(...) ? 'On' : 'Off' },
      { name: 'Partitioning', type: VALUE }
    ]
  }
}
```

## Key Components

### ServiceAccountSection.jsx (Authentication)
- **Purpose**: Configure Google Service Account authentication
- **Props**:
  - `value`: Current service account configuration
  - `onChange`: Callback when account changes
  - `additionalProps`: Documentation link
- **Features**:
  - Paste JSON service account key
  - Validate key format
  - Extract project ID
  - Test permissions
- **Configuration Structure**:
  ```typescript
  {
    authorization: {
      service_account: {
        project_id: string,
        private_key: string,
        client_email: string,
        client_id: string,
        type: 'service_account'
      }
    }
  }
  ```
- **Validation**:
  - Required: project_id, private_key, client_email
  - JSON format validation
  - BigQuery API permissions check

### TargetDatasetSection.jsx (Dataset Selection)
- **Purpose**: Select or create target BigQuery dataset
- **Features**:
  - List available datasets in project
  - Create new dataset
  - Set dataset location
  - Dataset metadata (size, tables count)
- **Configuration Structure**:
  ```typescript
  {
    parameters: {
      datasetId: string;        // BigQuery dataset ID
      location?: string;        // Dataset location (US, EU, etc.)
      description?: string;     // Dataset description
    }
  }
  ```

### TargetTableSection.jsx (Table Configuration)
- **Purpose**: Configure target table name and properties
- **Features**:
  - Specify BigQuery table name
  - Auto-naming from source table
  - Table description/metadata
  - Column mapping
- **Configuration Structure**:
  ```typescript
  {
    parameters: {
      tables: [
        {
          dbName: string;           // BigQuery table name
          sourceTableId: string;    // Source storage table ID
        }
      ]
    },
    storage: {
      input: {
        tables: [
          {
            source: string;         // Storage table ID
            destination: string;    // BigQuery table name
          }
        ]
      }
    }
  }
  ```

### LoadTypeSection.jsx (Load Mode)
- **Purpose**: Configure how data is loaded into BigQuery
- **Options**:
  1. **Append**: Add rows to existing table (preserves current data)
  2. **Replace**: Overwrite entire table (deletes previous data)
  3. **Incremental**: Update based on primary key
- **Configuration Structure**:
  ```typescript
  {
    parameters: {
      tables: [
        {
          loadType: 'append' | 'replace' | 'incremental',
          primaryKey: string[];    // For incremental
        }
      ]
    }
  }
  ```

### ClusteringSection.jsx (Clustering)
- **Purpose**: Configure BigQuery table clustering
- **Features**:
  - Enable/disable clustering
  - Select cluster columns
  - Up to 4 columns supported
  - Improves query performance
- **Configuration Structure**:
  ```typescript
  {
    parameters: {
      tables: [
        {
          clustering: true,
          clusteringColumns: [
            'customer_id',
            'date',
            'country'
          ]
        }
      ]
    }
  }
  ```
- **Performance Impact**:
  - Faster queries on clustered columns
  - Reduced data scanned
  - Small storage overhead

### PartitioningSection.jsx (Partitioning)
- **Purpose**: Configure BigQuery table partitioning
- **Options**:
  1. **Time-based**: By ingestion time, timestamp column, or date column
  2. **Range**: By integer column ranges
  3. **None**: No partitioning
- **Configuration Structure**:
  ```typescript
  {
    parameters: {
      tables: [
        {
          partitioning: 'ingestion_time' | 'timestamp' | 'date' | 'range' | null,
          partitioningColumn?: string,     // For timestamp/date
          partitioningRange?: {
            start: number,
            end: number,
            interval: number
          }
        }
      ]
    }
  }
  ```
- **Performance Benefits**:
  - Partition pruning for faster queries
  - Better data organization
  - Flexible retention per partition

### Columns Editor
- **Purpose**: Define and override column types
- **Features**:
  - Automatic type detection from source
  - Manual type override per column
  - Big Query type support
  - Column description/metadata
- **Types Supported**:
  - STRING, BYTES
  - INTEGER, NUMERIC, BIGNUMERIC
  - FLOAT, DOUBLE
  - BOOLEAN
  - TIMESTAMP, DATE, TIME
  - STRUCT, ARRAY, GEOGRAPHY

## State Management

### Architecture
- **Pattern Used**: Configuration-driven with adapters
- **Stores**: InstalledComponentsStore for configuration

### Configuration Structure

```typescript
{
  authorization: {
    service_account: {
      project_id: string,
      private_key: string,
      client_email: string,
      client_id: string,
      type: 'service_account'
    }
  },
  parameters: {
    datasetId: string,
    tables: [
      {
        dbName: string,
        sourceTableId: string,
        loadType: 'append' | 'replace' | 'incremental',
        clustering: boolean,
        clusteringColumns: string[],
        partitioning: string | null,
        partitioningColumn?: string,
        primaryKey?: string[],
        columns: {
          [columnName]: {
            dbName: string,
            type: string,
            nullable?: boolean,
            description?: string
          }
        }
      }
    ]
  },
  storage: {
    input: {
      tables: [
        {
          source: string,
          destination: string
        }
      ]
    }
  }
}
```

## Key Features

### Google Service Account Authentication

1. **Service Account Key**
   - JSON key file downloaded from Google Cloud Console
   - Contains project ID, private key, and credentials
   - Stored securely in configuration
   - Used for BigQuery API authentication

2. **Permissions Required**
   - `bigquery.datasets.get`
   - `bigquery.datasets.update`
   - `bigquery.tables.create`
   - `bigquery.tables.update`
   - `bigquery.tables.get`

### BigQuery Dataset Configuration

1. **Existing Dataset**
   - Select from available datasets in project
   - View dataset properties (size, tables, updated)
   - Use existing table structure

2. **New Dataset**
   - Create with custom name
   - Set location (US, EU, asia-northeast1, etc.)
   - Dataset is created automatically

### Table Load Types

#### Append Mode
- **Behavior**: Adds rows to existing table
- **Existing Data**: Preserved
- **Schema**: Must match existing (auto-extends if compatible)
- **Use Case**: Incremental data loading, logs, events

#### Replace Mode
- **Behavior**: Overwrites entire table
- **Existing Data**: Deleted
- **Schema**: Can change between loads
- **Use Case**: Snapshot tables, dimension tables

#### Incremental Mode
- **Behavior**: Updates based on primary key
- **Existing Data**: Updated rows modified, new rows added
- **Primary Key**: Required for matching
- **Use Case**: Fact tables with updates

### Clustering

- **Purpose**: Organize data for faster queries
- **Supported Columns**: 1-4 columns
- **Types Supported**: Columns used for filtering
- **Cost Impact**: Minimal storage increase, significant query performance gain
- **Use Case**: Sales data by region/product, logs by service/severity

### Partitioning

- **Ingestion Time**: Partition by when data was loaded
- **Timestamp/Date**: Partition by column values
- **Range**: Integer-based partition ranges
- **Cost Impact**: Reduced query costs through partition pruning
- **Use Case**: Time-series data, historical data retention

## API Integration

### Service Account Setup
- Paste JSON service account key
- Extract credentials automatically
- Test API connectivity
- Store securely

### Dataset Operations
- List available datasets
- Create new dataset with location
- Update dataset settings
- Manage dataset access

### Table Operations
- Create new tables with schema
- Update existing table schema
- Manage table clustering/partitioning
- Stream data to table

### Query/Load Jobs
- Monitor load job status
- Handle errors and retries
- Track job execution time
- Display results

## Configuration Workflow

1. **Set Up Service Account**
   - Get JSON key from Google Cloud Console
   - Paste into ServiceAccountSection
   - Verify project ID extracted
   - Test permissions

2. **Select Target Dataset**
   - Choose existing dataset or create new
   - Set location for new datasets
   - View dataset properties

3. **Configure First Table**
   - Select source table from Storage
   - Specify BigQuery table name
   - Choose load type (append/replace/incremental)
   - Save table configuration

4. **Configure Clustering (Optional)**
   - Enable clustering if useful for queries
   - Select cluster columns (1-4)
   - Consider query patterns

5. **Configure Partitioning (Optional)**
   - Select partitioning strategy
   - Choose partition column if time-based
   - Configure retention if needed

6. **Configure Columns (Optional)**
   - Review auto-detected types
   - Override types if needed
   - Add descriptions
   - Set nullable flags

7. **Add More Tables**
   - Each table gets own configuration
   - Independent load type per table
   - Shared dataset and service account

8. **Run and Monitor**
   - Enable table exports
   - Run to execute load
   - Monitor job execution
   - View results in BigQuery

## Dependencies

### Internal Modules
- `@/modules/configurations/utils/createRoute` - Route factory
- `@/modules/configurations/utils/createColumnsEditorSection` - Column editor
- `@/constants/URLS` - Documentation links

### External Packages
- `@keboola/constants` - Keboola constants
- `@keboola/utils` - Utility functions
- React Bootstrap - UI components

### Design System Components
- `FormGroup` - Form sections
- `Label` - Form labels
- `TextInput` - Text inputs
- `Select` - Dropdowns
- `CheckBox` - Boolean toggles
- `MultiSelect` - Multiple selection
- `Button` - Actions

## Notable Patterns

### Service Account Key Parsing
```javascript
// Parse JSON service account key
try {
  const keyData = JSON.parse(pastedKey);
  if (keyData.project_id && keyData.private_key && keyData.client_email) {
    // Valid key format
    saveConfiguration({
      project_id: keyData.project_id,
      private_key: keyData.private_key,
      // ... rest of fields
    });
  }
} catch (e) {
  throw new Error('Invalid JSON key format');
}
```

### Two-Level Configuration
- **Index**: Service account, dataset (component-wide)
- **Row**: Table, load type, clustering, partitioning (per-table)
- Allows multiple tables to same dataset

### Adapter Pattern
- Separate adapters for each section
- Each handles parsing/serialization
- Conform function normalizes on load
- Validation per section

## User-Facing Features

### Feature 1: Service Account Setup
- **Description**: Configure Google BigQuery authentication
- **Workflow**:
  1. Create service account in Google Cloud Console
  2. Download JSON key
  3. Paste into configuration
  4. Verify connectivity
- **Components**: ServiceAccountSection

### Feature 2: Dataset Selection
- **Description**: Choose target BigQuery dataset
- **Workflow**:
  1. View available datasets
  2. Select existing or create new
  3. Configure location for new
  4. Save selection
- **Components**: TargetDatasetSection

### Feature 3: Table Export
- **Description**: Configure table mapping and load mode
- **Workflow**:
  1. Select source table
  2. Enter BigQuery table name
  3. Choose load type
  4. Save configuration
- **Components**: TargetTableSection, LoadTypeSection

### Feature 4: Clustering
- **Description**: Optimize table queries with clustering
- **Workflow**:
  1. Enable clustering checkbox
  2. Select cluster columns
  3. Save configuration
  4. Queries on cluster columns faster
- **Components**: ClusteringSection

### Feature 5: Partitioning
- **Description**: Organize table data for cost/performance
- **Workflow**:
  1. Select partition strategy
  2. Choose partition column (if time-based)
  3. Configure retention (optional)
  4. Save configuration
- **Components**: PartitioningSection

### Feature 6: Column Configuration
- **Description**: Define table schema and column types
- **Workflow**:
  1. Review auto-detected column types
  2. Override types as needed
  3. Add column descriptions
  4. Set nullable flags
  5. Save configuration
- **Components**: Columns Editor

## Technical Debt & Observations

### Current Implementation
- Uses createRoute utility (standard pattern)
- Config-driven approach with adapters
- Comprehensive feature set for BigQuery

### Areas for Improvement
- Column editor UI could be more intuitive
- Clustering/partitioning preview would be helpful
- Dataset size estimation before creating
- Query performance impact prediction
- Better error messages for schema mismatches
- Data preview before load

### Complexity Hotspots
1. **Service Account Parsing**: JSON validation and security
2. **Type Mapping**: BigQuery type system vs Storage types
3. **Clustering/Partitioning**: Understanding impact on costs
4. **Incremental Loads**: Primary key handling and deduplication

### Migration Opportunities
- TypeScript for type safety
- Modern form library for better UX
- TanStack Query for server state
- Column editor as standalone component

## Related Modules

- `wr-db` - Database writers (similar pattern)
- `storage` - Keboola Storage source
- `components` - Base component framework
- `configurations` - Configuration utilities

## Testing

### Key Test Scenarios
- Service account key validation
- Dataset creation and selection
- Table configuration save/load
- Load type behavior (append/replace/incremental)
- Clustering column selection
- Partitioning configuration
- Column type mapping
- Multiple table handling
- Error handling (invalid credentials, API errors)

### Test Fixtures
- Valid service account keys
- Invalid key formats
- Mock BigQuery datasets and tables
- Sample column configurations
- Various partitioning scenarios

## Resources

- [BigQuery Documentation](https://cloud.google.com/bigquery/docs)
- [Service Account Setup Guide](https://cloud.google.com/docs/authentication/getting-started)
- [Table Clustering Guide](https://cloud.google.com/bigquery/docs/clustering-intro)
- [Table Partitioning Guide](https://cloud.google.com/bigquery/docs/partitioned-tables)

