# Module: ex-aws-s3 (AWS S3 Extractor)

## Overview

The ex-aws-s3 module provides extraction capabilities for files stored in Amazon S3 buckets. It handles AWS authentication (credentials or IAM roles), S3 bucket browsing, file selection with wildcard patterns, and CSV data parsing. The module supports incremental file loading, file decompression, and flexible data formatting configuration.

## File Structure

```
ex-aws-s3/
├── routes.js                           # Route definitions using createRoute utility
├── Configuration.jsx                   # Main configuration component
├── Configuration/
│   ├── Source.jsx                      # S3 bucket and file path configuration
│   ├── Destination.tsx                 # Storage table naming and loading mode
│   └── ProcessingSettings.jsx          # File processing options
└── adapters/
    ├── credentials.js                  # AWS credentials parsing/serialization
    ├── row.js                          # Row configuration conversion
    └── conform.js                      # Configuration normalization
```

## Routes & Configuration

### Route Structure

Uses `createRoute()` utility with two levels of configuration:

1. **Index Level** (Component credentials):
   - Component: AWS Login credentials section
   - Sections: Single section for AWS authentication

2. **Row Level** (Extraction job):
   - Component: ConfigurationForm (Main configuration)
   - Multiple extraction jobs per component instance

### Route Settings

```typescript
{
  componentId: 'keboola.ex-aws-s3',
  index: {
    actions: [GET_EXTERNAL_ID_ACTION],    // For STS role assumption
    onConform: conformCredentials,        // Normalize credentials
    sections: [{
      render: CollapsibleSection with Credentials component
      onSave: credentialsCreateConfiguration,
      onLoad: credentialsParseConfiguration,
      isComplete: credentialsIsComplete
    }]
  },
  row: {
    onConform: conform,                   // Normalize row config
    hasState: true,                       // Uses local state
    sections: [{
      render: ConfigurationForm,
      onSave: rowCreateConfiguration,
      onCreate: rowCreateEmptyConfiguration,
      onLoad: rowParseConfiguration
    }]
  }
}
```

## Key Components

### Configuration.jsx (Main Component)
- **Purpose**: Orchestrates all configuration sub-sections
- **Props**:
  - `value`: Current configuration object
  - `onChange`: Callback when user modifies settings
  - `disabled`: Read-only mode flag
- **Child Components**:
  - `Source` - S3 file selection
  - `CsvSettings` - CSV parsing options
  - `Destination` - Storage table configuration
  - `ProcessingSettings` - File processing options
- **Configuration Structure**:
  ```typescript
  {
    bucket: string;              // S3 bucket name
    key: string;                 // File path/prefix
    wildcard: boolean;           // Enable prefix matching
    subfolders: boolean;         // Recursive subfolder search
    newFilesOnly: boolean;       // Only new files since last run
    decompress: boolean;         // Auto-extract archives
    name: string;                // Output table name
    incremental: boolean;        // Append vs replace mode
    delimiter: string;           // CSV delimiter
    enclosure: string;           // CSV field enclosure char
    columnsFrom: 'manual' | 'header' | 'auto';  // Column detection
    columns: string[];           // Manually specified columns
    primaryKey: string[];        // Table primary key columns
    addRowNumberColumn: boolean; // Add s3_row_number
    addFilenameColumn: boolean;  // Add s3_filename
  }
  ```

### Source.jsx (S3 Configuration)
- **Purpose**: S3 bucket and file selection
- **Features**:
  - **S3 Bucket**: Required field (e.g., "mybucket")
  - **Search Key**: File path or prefix (e.g., "myfolder/myfile.csv")
    - No wildcard patterns in input (use checkbox instead)
    - Supports folder hierarchies
  - **Wildcard Toggle**: Enable prefix matching
    - When enabled: Matches all files starting with key
    - When disabled: Exact key matching
  - **Subfolders Toggle**: Include nested directories
    - Only enabled when wildcard is active
    - Recursively searches all subdirectories
  - **New Files Only**: Incremental loading
    - Stores timestamp of last download
    - Next run picks up from there
    - Useful for continuous updates

### Destination.tsx (Storage Configuration)
- **Purpose**: Output table configuration
- **Features**:
  - **Storage Table Name**: 
    - Auto-sanitized (removes invalid characters)
    - Validated for KBC table naming rules
    - Displays warning for suspicious names
  - **Incremental Load**:
    - When enabled: Updates existing table
    - With primary key: Updates rows
    - Without primary key: Appends rows
  - **Primary Key**:
    - Multi-select field
    - Allow custom column creation
    - Cannot change for existing tables
    - Required for updates-only mode

### ProcessingSettings.jsx (File Processing)
- **Purpose**: File handling and audit columns
- **Features**:
  - **Decompress**:
    - Automatically extract archives
    - Supports: ZIP, GZIP, BZIP2
    - All files from all archives → single table
  - **Add Filename Column**:
    - Adds `s3_filename` column
    - Stores processed file name
    - Useful for tracking source files
  - **Add Row Number Column**:
    - Adds `s3_row_number` column
    - Stores row number from source file
    - Helps with deduplication and row tracking

## AWS Authentication

### Credentials Adapter (`credentials.js`)

Supports two authentication methods:

#### 1. Access Key Credentials
```typescript
{
  loginType: 'credentials',
  accessKeyId: string;
  '#secretAccessKey': string;  // Secret key (# prefix for encryption)
}
```

#### 2. IAM Role Assumption
```typescript
{
  loginType: 'role',
  accountId: string;           // AWS Account ID
  roleName: string;            // IAM role name to assume
}
```

### Key Functions

- **`parseConfiguration()`**: Converts stored config to UI format
- **`createConfiguration()`**: Converts UI format to storage format
- **`isComplete()`**: Validates required auth fields present
- **`conform()`**: Adds default loginType if missing

## Row Configuration Adapter

### Data Transformation

The `row.js` adapter converts between UI format and processor-based configuration:

```typescript
// UI Format (local state)
{
  delimiter: ',',
  enclosure: '"',
  incremental: false,
  primaryKey: ['id'],
  // ... other fields
}

// Storage Format (processors)
{
  processors: {
    after: [
      {
        definition: { component: 'keboola.processor.create-manifest' },
        parameters: {
          delimiter: ',',
          enclosure: '"',
          incremental: false,
          primary_key: ['id'],
          columns_from: 'header'
        }
      },
      // ... other processors (skip-lines, decompress, move-files, etc.)
    ]
  }
}
```

### Processor Pipeline

Processors execute in sequence:

1. **SKIP_LINES**: Skip header row (if columns_from: 'header')
2. **DECOMPRESS**: Extract archive files (if decompress enabled)
3. **FLATTEN_FOLDERS**: Flatten nested folder structure
4. **ADD_FILENAME_COLUMN**: Add s3_filename if enabled
5. **ADD_ROW_NUMBER_COLUMN**: Add s3_row_number if enabled
6. **CREATE_MANIFEST**: Parse CSV and define columns
7. **MOVE_FILES**: Move to storage (destination)

## Configuration Storage

### Component-Level Configuration

```json
{
  "parameters": {
    "loginType": "credentials",
    "accessKeyId": "AKIAIOSFODNN7EXAMPLE",
    "#secretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
  }
}
```

### Row-Level Configuration

```json
{
  "parameters": {
    "bucket": "my-data-bucket",
    "key": "data/exported",
    "wildcard": true,
    "subfolders": true,
    "newFilesOnly": true,
    "decompress": false,
    "name": "imported_data",
    "incremental": true,
    "delimiter": ",",
    "enclosure": "\""
  },
  "processors": {
    "after": [
      {
        "definition": { "component": "keboola.processor.create-manifest" },
        "parameters": {
          "delimiter": ",",
          "enclosure": "\"",
          "columns_from": "header",
          "incremental": true,
          "primary_key": ["id"]
        }
      },
      {
        "definition": { "component": "keboola.processor.move-files" },
        "parameters": { "folder": "in/tables/my-bucket.csv" }
      }
    ]
  }
}
```

## State Management

### Pattern Used
**Configuration-driven with Adapters**

- Uses `createRoute()` utility for state management
- Stores configuration in component configuration storage
- Adapters convert between UI state and storage format
- No local Flux store (stateless architecture)

### Configuration Flow

```
User edits form
    ↓
onChange callback fires
    ↓
UI state updated (React component state)
    ↓
User clicks Save
    ↓
rowCreateConfiguration() transforms to storage format
    ↓
Configuration sent to backend storage
    ↓
Next load: rowParseConfiguration() transforms back to UI format
```

## CSV Data Parsing

### Column Detection Modes

1. **Header Mode** (columns_from: 'header')
   - First row of CSV becomes column names
   - Automatically skipped from data
   - SKIP_LINES processor removes it

2. **Auto Mode** (columns_from: 'auto')
   - Component auto-detects structure
   - Generates column names if not present
   - Useful for unknown formats

3. **Manual Mode** (columns_from: 'manual')
   - User specifies columns explicitly
   - Field names provided manually
   - Useful when header is not reliable

### CSV Options

- **Delimiter**: Field separator (usually `,` or `;`)
- **Enclosure**: Quote character (usually `"`)
- **Incremental**: How to handle existing tables
  - False: Replace entire table
  - True: Append or update based on primary key

## File Selection Examples

### Exact File Match
```
bucket: 'my-bucket'
key: 'data/export.csv'
wildcard: false
→ Matches: data/export.csv only
```

### Prefix with Wildcard
```
bucket: 'my-bucket'
key: 'data/2024'
wildcard: true
subfolders: false
→ Matches: data/2024*.csv, data/2024-report.csv
→ Excludes: data/2024/subfolder/file.csv
```

### Recursive Subdirectories
```
bucket: 'my-bucket'
key: 'data'
wildcard: true
subfolders: true
newFilesOnly: true
→ Matches: data/**/*.csv recursively
→ Only files modified since last run
```

## User-Facing Workflows

### Workflow 1: Basic S3 File Import
1. Configure AWS credentials (access key or IAM role)
2. Enter S3 bucket name
3. Specify file path (exact or prefix with wildcard)
4. Configure CSV format (delimiter, enclosure)
5. Set output table name
6. Click Save and Run

### Workflow 2: Incremental Daily Updates
1. Configure as above with newFilesOnly: true
2. Scheduler runs extraction daily
3. Component tracks last download timestamp
4. Next run only imports new files
5. Data appended to table (with primary key for updates)

### Workflow 3: Archive Extraction
1. Configure S3 path to ZIP files
2. Enable Decompress option
3. Set incremental mode
4. All files from all archives → single table
5. Filenames tracked via s3_filename column

## Notable Patterns

1. **Adapter Pattern**: Configuration transformation
   - parseConfiguration() for load
   - createConfiguration() for save
   - isComplete() for validation
   - conform() for normalization

2. **Processor Pipeline**: Modular file processing
   - Each processor handles specific task
   - Processors run in defined order
   - Easy to add new processors

3. **Column Detection**: Flexible CSV parsing
   - Supports auto-detection
   - Allows manual specification
   - Works with header rows

4. **Incremental Loading**: Timestamp-based tracking
   - Stores last file modified time
   - Next run starts from that point
   - Reduces redundant imports

## Technical Debt & Observations

1. **Component-Level vs Row-Level**:
   - Component stores credentials
   - Each row stores extraction job config
   - Could be simplified with per-row auth

2. **Processor Configuration**:
   - Uses storage processor IDs (magic strings)
   - No type safety for processor definitions
   - Changes require coordinating with backend

3. **Error Handling**:
   - Limited validation of S3 path patterns
   - No preview of files before import
   - Connection errors not always clear

4. **AWS Authentication Types**:
   - Both methods require separate UI
   - Could use unified approach
   - IAM role requires external account setup

## API Integration

### Component Backend Actions

1. **GET_EXTERNAL_ID_ACTION**
   - Retrieves external ID for STS role assumption
   - Used for IAM role-based authentication
   - Enables cross-account role assumption

2. **S3 File Listing** (via Docker action)
   - Lists files matching pattern
   - Returns file metadata
   - Used for file selection UI

3. **File Extraction** (via processor pipeline)
   - Downloads from S3
   - Parses CSV/text
   - Stores in Keboola Storage

## Related Modules

- `modules/wr-aws-s3` - S3 writer with shared Credentials component
- `modules/storage` - Storage table management
- `modules/configurations` - Configuration utilities (createRoute)
- `@keboola/design` - UI components
- `@keboola/utils` - Utility functions (string sanitization)

## Testing

- Adapter transformation tests (credentials, row)
- Configuration validation tests
- CSV parsing configuration tests
- S3 path pattern matching tests
- Integration tests with mock S3

## References

- [AWS S3 API Documentation](https://docs.aws.amazon.com/s3/index.html)
- [AWS IAM Roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)
- [AWS STS AssumeRole](https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html)
- [Keboola Component Processors](https://developers.keboola.com/extend/component/processors)
