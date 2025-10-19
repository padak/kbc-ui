# Module: ex-azure-blob (Azure Blob Storage Extractor)

## Overview

The ex-azure-blob module provides extraction capabilities for files stored in Azure Blob Storage containers. It handles Azure authentication (storage account credentials or SAS tokens), container browsing, file selection with wildcard patterns, and CSV data parsing. The module supports incremental file loading and flexible data formatting configuration similar to the S3 extractor.

## File Structure

```
ex-azure-blob/
├── routes.js                           # Route definitions using createRoute utility
├── react/
│   ├── Configuration.jsx               # Main configuration component
│   ├── Connection.jsx                  # Azure credentials/connection form
│   ├── Source.jsx                      # Blob file path configuration
│   ├── Destination.tsx                 # Storage table naming and loading mode
│   └── ProcessingSettings.jsx          # File processing options
└── adapters/
    ├── Configuration.js                # Row configuration conversion
    ├── Connection.js                   # Azure credentials adapter
    └── [other adapters]
```

## Routes & Configuration

### Route Structure

Uses `createRoute()` utility with two levels:

1. **Index Level** (Component credentials):
   - Component: Connection section (Azure credentials)
   - Sections: Single section for Azure connection

2. **Row Level** (Extraction job):
   - Component: ConfigurationForm
   - Multiple extraction jobs per component instance

### Route Settings

```typescript
{
  componentId: 'kds.ex-azure-blob-storage-v2',
  index: {
    sections: [{
      render: CollapsibleSection with ConnectionSection
      onLoad: ConnectionAdapter.parseConfiguration,
      onSave: ConnectionAdapter.createConfiguration,
      isComplete: ConnectionAdapter.isComplete
    }]
  },
  row: {
    hasState: true,
    sections: [{
      render: ConfigurationForm,
      onSave: ConfigurationAdapter.createConfiguration,
      onLoad: ConfigurationAdapter.parseConfiguration,
      onCreate: ConfigurationAdapter.createEmptyConfiguration
    }],
    columns: [{
      name: 'Storage',
      type: TABLE_LINK_DEFAULT_BUCKET,
      value: (row) => row.getIn(['parameters', 'file', 'storage'])
    }]
  }
}
```

## Key Components

### Configuration.jsx (Main Component)
- **Purpose**: Orchestrates all configuration sub-sections
- **Props**:
  - `value`: Current configuration object
  - `onChange`: Callback for setting changes
  - `disabled`: Read-only mode flag
- **Child Components**:
  - `Source` - Azure blob file selection
  - `CsvSettings` - CSV parsing options
  - `Destination` - Storage table configuration
  - `ProcessingSettings` - File processing options
- **Configuration Structure**:
  ```typescript
  {
    file_name: string;               // Blob file path/prefix (e.g., "folder/subfolder/file_*")
    incremental: boolean;            // Append vs replace mode
    primary_key: string[];           // Table primary key columns
    storage: string;                 // Output table identifier
    delimiter: string;               // CSV delimiter
    enclosure: string;               // CSV field enclosure char
    columnsFrom: 'manual' | 'header' | 'auto';  // Column detection
    columns: string[];               // Manually specified columns
    addRowNumberColumn: boolean;     // Add row number column
    addFilenameColumn: boolean;      // Add filename column
    decompress: boolean;             // Auto-extract archives
    new_files_only: boolean;         // Only new files since last run
  }
  ```

### Connection.jsx (Azure Credentials)
- **Purpose**: Azure connection configuration
- **Features**:
  - **Account Name**: Azure storage account name (e.g., "mystorageaccount")
  - **Account Key / SAS Token**: Authentication credential
    - PasswordControl component hides sensitive input
    - Supports both account keys and SAS tokens
  - **Container Name**: Target blob container name
- **Props**:
  - `value`: Connection configuration object
  - `onChange`: Callback when credentials change
  - `disabled`: Read-only mode flag
- **Form Fields**:
  ```typescript
  {
    account_name: string;        // Azure storage account name
    account_key: string;         // Account key or SAS token (encrypted)
    container_name: string;      // Container within storage account
  }
  ```

### Source.jsx (Blob File Selection)
- **Purpose**: Azure blob file/prefix configuration
- **Features**:
  - **File Name**: File path or wildcard pattern
    - Examples: 
      - `folder/subfolder/test.csv` - Exact file
      - `test_*` - Files matching prefix
    - Supports wildcards for pattern matching
  - **New Files Only**: Incremental loading
    - Tracks last download timestamp
    - Next run starts from that point
    - Useful for continuous updates
- **Props**:
  - `value`: Source configuration with file_name and new_files_only
  - `onChange`: Callback for changes
  - `disabled`: Read-only mode

### Destination.tsx (Storage Configuration)
- **Purpose**: Output table configuration
- **Similar to S3**: Same destination/storage logic
- **Features**:
  - Storage table naming and validation
  - Incremental load mode
  - Primary key definition

### ProcessingSettings.jsx (File Processing)
- **Purpose**: File handling options
- **Similar to S3**: Same processing options
- **Features**:
  - Decompress archives
  - Add filename column
  - Add row number column

## Azure Authentication

### Connection Adapter

Converts between UI format and storage format:

```typescript
// UI Format
{
  account_name: 'mystorageaccount',
  account_key: 'primaryOrSecondaryKey',
  container_name: 'mycontainer'
}

// Storage Format
{
  parameters: {
    account_name: 'mystorageaccount',
    '#account_key': 'encrypted_key',  // # prefix for encryption
    container_name: 'mycontainer'
  }
}
```

### Key Functions

- **`parseConfiguration()`**: Converts stored format to UI format
- **`createConfiguration()`**: Converts UI format to storage format
- **`isComplete()`**: Validates required fields (account, key, container)

### Authentication Types

1. **Account Key**
   - Primary or secondary access key
   - Full access to storage account
   - Provided in Azure portal

2. **SAS Token**
   - Shared Access Signature
   - Limited scope and expiration
   - More secure for shared access

## Configuration Storage

### Component-Level Configuration

```json
{
  "parameters": {
    "account_name": "mystorageaccount",
    "#account_key": "encrypted_key_or_sas_token",
    "container_name": "mycontainer"
  }
}
```

### Row-Level Configuration

```json
{
  "parameters": {
    "file": {
      "file_name": "data/export_*.csv",
      "new_files_only": true,
      "storage": "in/tables/imported_data"
    },
    "delimiter": ",",
    "enclosure": "\"",
    "incremental": true,
    "primary_key": ["id"],
    "columns_from": "header"
  }
}
```

## File Selection Examples

### Exact File Match
```
file_name: 'data/export.csv'
new_files_only: false
→ Matches: data/export.csv only
```

### Wildcard Pattern
```
file_name: 'data/2024_*'
new_files_only: false
→ Matches: data/2024_01.csv, data/2024_02.csv, etc.
```

### Incremental Updates
```
file_name: 'logs/*'
new_files_only: true
→ Matches: logs/any_file pattern
→ Only files modified since last run
```

## State Management

### Pattern Used
**Configuration-driven with Adapters**

- Similar to S3 extractor
- Uses `createRoute()` utility
- No local Flux store
- Adapters handle transformation

### Configuration Flow

Same as S3:
```
User edits form
    ↓
onChange fires
    ↓
User clicks Save
    ↓
ConfigurationAdapter transforms
    ↓
Configuration stored
    ↓
Next load: Adapter transforms back
```

## CSV Data Parsing

### Column Detection Modes

1. **Header Mode** (columnsFrom: 'header')
   - First row becomes column names
   - Automatically skipped from data

2. **Auto Mode** (columnsFrom: 'auto')
   - Auto-detects CSV structure
   - Generates column names if needed

3. **Manual Mode** (columnsFrom: 'manual')
   - User specifies columns explicitly
   - Field names provided manually

### CSV Options

- **Delimiter**: Field separator (`,`, `;`, etc.)
- **Enclosure**: Quote character (`"`, `'`, etc.)
- **Incremental**: Replace vs append mode

## Comparison with S3 Extractor

| Feature | S3 | Azure Blob |
|---------|----|----|
| Authentication | Access Key / IAM Role | Account Key / SAS Token |
| File Selection | Bucket + Key | Container + File Name |
| Wildcard Support | Yes (prefix) | Yes (pattern) |
| Incremental Loading | Yes (timestamp) | Yes (timestamp) |
| Decompression | Yes | Yes |
| CSV Parsing | Yes | Yes |
| Column Detection | Auto/Header/Manual | Auto/Header/Manual |
| Audit Columns | Filename, Row Number | Row Number Column |

## User-Facing Workflows

### Workflow 1: Basic Azure Blob Import
1. Configure Azure connection (account, key, container)
2. Enter blob file path or wildcard
3. Configure CSV format
4. Set output table name
5. Click Save and Run

### Workflow 2: Incremental Updates
1. Configure as above with new_files_only: true
2. Scheduler runs extraction
3. Component tracks last modified timestamp
4. Next run only imports new files
5. Data appended/updated in table

### Workflow 3: Archive Extraction
1. Configure path to ZIP/compressed files
2. Enable Decompress option
3. Set incremental mode
4. All extracted files → single table

## Notable Patterns

1. **Adapter Pattern**: Similar to S3
   - Configuration transformation
   - Encryption handling (#prefix)
   - Validation logic

2. **Component-Level vs Row-Level**:
   - Connection stored at component level
   - Extraction config at row level
   - Allows multiple jobs with same auth

3. **Wildcard Pattern Matching**:
   - File name supports `*` patterns
   - Container name fixed (no wildcards)
   - Simpler than S3 prefix/wildcard handling

## Technical Debt & Observations

1. **Named Parameter Inconsistency**:
   - Uses `file_name` (snake_case)
   - Other components use camelCase
   - Could be standardized

2. **New Files Only Field**:
   - Named `new_files_only` not `newFilesOnly`
   - Inconsistent with S3 naming
   - May cause confusion across modules

3. **Limited File Browsing**:
   - No UI file picker (unlike some cloud storages)
   - Users must know exact paths or patterns
   - Could add browser dialog

4. **Error Handling**:
   - Authentication errors shown inline
   - Network timeouts not well-handled
   - No retry logic

## API Integration

### Component Backend Actions

1. **Connection Validation**
   - Validates Azure credentials
   - Tests container access
   - Returns success/error

2. **File Listing** (via Docker action)
   - Lists blobs matching pattern
   - Returns metadata (name, size, modified)
   - Used for verification

3. **Blob Extraction** (via processor)
   - Downloads from container
   - Parses CSV format
   - Stores in Keboola Storage

## Related Modules

- `modules/ex-aws-s3` - S3 extractor (similar pattern)
- `modules/storage` - Storage table management
- `modules/configurations` - Configuration utilities
- `@keboola/design` - UI components
- `@keboola/utils` - Utility functions

## Testing

- Connection adapter tests
- Configuration transformation tests
- Wildcard pattern matching tests
- CSV parsing configuration tests
- Integration tests with mock Azure

## References

- [Azure Blob Storage Documentation](https://docs.microsoft.com/en-us/azure/storage/blobs/)
- [Azure Storage Account Keys](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-keys-manage)
- [Azure Storage SAS](https://docs.microsoft.com/en-us/azure/storage/common/storage-sas-overview)
- [Azure SDK for JavaScript](https://github.com/Azure/azure-sdk-for-js)
