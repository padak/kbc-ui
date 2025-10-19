# Module: ex-ftp (FTP/FTPS/SFTP Extractor)

## Overview

The ex-ftp module provides extraction capabilities for files accessed via FTP, FTPS (secure FTP), or SFTP protocols. It handles multiple authentication methods (password-based and SSH key-based), connection configuration with approved hostnames, file path selection with wildcard patterns, and CSV data parsing. The module supports incremental file loading, archive decompression, and flexible data formatting.

## File Structure

```
ex-ftp/
├── routes.ts                           # Route definitions
├── SourceServer.tsx                    # FTP/FTPS/SFTP connection configuration
├── SourcePath.tsx                      # File path and processing configuration
├── SourcePath/
│   ├── DownloadSettings.tsx            # Path and decompression options
│   ├── SaveSettings.tsx                # Output table configuration
│   ├── HeaderPrimaryKey.tsx            # Column detection and primary key
│   └── AuditBox.tsx                    # Audit columns (filename, row number)
└── adapters/
    ├── SourceServer.ts                 # Server configuration conversion
    ├── SourcePath.ts                   # Path configuration conversion
    └── conform.ts                      # Configuration normalization
```

## Routes & Configuration

### Route Structure

Uses `createRoute()` utility with two levels:

1. **Index Level** (Server configuration):
   - Component: SourceServerSection
   - Sections: Single section for FTP/SFTP connection

2. **Row Level** (File extraction job):
   - Component: SourcePathSection
   - Multiple extraction jobs per server config

### Route Settings

```typescript
{
  componentId: string,
  index: {
    onConform: conformSource,
    sections: [{
      render: CollapsibleSection with SourceServerSection
      onLoad: SourceServerAdapter.parseConfiguration,
      onSave: SourceServerAdapter.createConfiguration,
      isComplete: SourceServerAdapter.isComplete
    }]
  },
  row: {
    hasState: false,
    onConform: SourcePathAdapter.onConform,
    sections: [{
      render: SourcePathSection,
      onSave: SourcePathAdapter.createConfiguration,
      onLoad: SourcePathAdapter.parseConfiguration,
      onCreate: SourcePathAdapter.createEmptyConfiguration
    }]
  }
}
```

## Key Components

### SourceServer.tsx (Connection Configuration)
- **Purpose**: FTP/FTPS/SFTP connection setup
- **Props**:
  - `value`: Server configuration object
  - `context`: Component context (immutable Map)
  - `imageParameters`: Component image parameters
  - `onChange`: Callback for configuration changes
  - `readOnly`: Read-only mode flag
  - `isChanged`: Track if changes made
  - `disabled`: Disable form flag
- **Configuration Structure**:
  ```typescript
  {
    connectionType: 'FTP' | 'FTPS' | 'SFTP';  // Protocol selection
    host: string;                    // Hostname or IP address
    port: number;                    // Port number
    username: string;                // Login username
    password: string;                // Login password (encrypted #)
    privateKey: string;              // SSH private key (SFTP only)
    ignorePassiveAddress: boolean;  // Ignore PASV reply address
    ssh?: {                          // SSH tunnel options
      enabled?: boolean;
      shost?: string;
      sport?: number;
      suser?: string;
      spass?: string;
    }
  }
  ```

### SourcePath.tsx (File Path Configuration)
- **Purpose**: File path and extraction options
- **Sub-Components**:
  - `DownloadSettings` - Path and decompression
  - `SaveSettings` - Output table configuration
  - `HeaderPrimaryKey` - Column detection and key
  - `AuditBox` - Audit column options
- **Configuration Structure**:
  ```typescript
  {
    path: string;                    // Remote file path/pattern
    onlyNewFiles: boolean;           // Only new files since last run
    decompress: boolean;             // Extract archives
    incremental: boolean;            // Append vs replace mode
    delimiter: string;               // CSV delimiter
    name: string;                    // Output table name
    enclosure: string;               // CSV field enclosure char
    columnsFrom: 'manual' | 'header' | 'auto';
    columns: string[];               // Manually specified columns
    primaryKey: string[];            // Table primary key
    addRowNumberColumn: boolean;     // Add row number column
    addFilenameColumn: boolean;      // Add filename column
  }
  ```

### SourceServer Component Details

#### Connection Type Selection
- **FTP**: Standard File Transfer Protocol (port 21)
- **FTPS**: FTP with TLS/SSL encryption (port 21)
- **SFTP**: SSH File Transfer Protocol (port 22)

#### Hostname Configuration
- **Approved Hostnames**:
  - Component can restrict to pre-approved hosts
  - Read from `imageParameters.approvedHostnames`
  - Shows dropdown instead of text input
  - Each host includes port number
  - Prevents connecting to arbitrary servers
  
- **Custom Hostname**:
  - When no approved hosts defined
  - Users enter custom hostname
  - Separate port field available

#### Authentication Methods
- **Password Authentication**:
  - Username + password (works for FTP, FTPS, SFTP)
  - Password encrypted with # prefix in config
  
- **SSH Key Authentication** (SFTP only):
  - Supports private key in PEM format
  - Shows textarea for key input
  - Accepts keys with or without BEGIN/END markers
  - Hidden when connectionType !== 'SFTP'

#### Advanced Options
- **Ignore Passive Address** (FTP/FTPS):
  - Ignores IP address from PASV reply
  - Useful for NAT/firewall scenarios
  - Helpful: "Ignore the IP address returned from the server on the PASV reply"

- **SSH Tunnel Options**:
  - Separate SSH hop for connection
  - SshForm component handles configuration
  - Supports port forwarding through jump host

#### Connection Testing
- **TestCredentialsButtonGroup**:
  - Appears when not in read-only mode
  - Tests connection with provided credentials
  - Shows loading/success/error states
  - Calls `testConnection` Docker action

### SourcePath Component Details

#### DownloadSettings
- **Remote File Path**:
  - Supports glob patterns: `data/files/*.csv`
  - Can use wildcards and directory traversal
  - Examples:
    - `/data/export.csv` - Exact file
    - `/data/*.csv` - All CSV files
    - `/data/**/*.csv` - Recursive search

- **Decompress**:
  - Auto-extract: ZIP, GZIP, BZIP2
  - All files from all archives → single table

- **Only New Files**:
  - Tracks last modification timestamp
  - Next run only imports newer files
  - Useful for incremental updates

#### SaveSettings
- **Output Table Name**:
  - Used as Keboola storage table identifier
  - Validated and sanitized

- **Incremental Load**:
  - True: Append rows to table
  - False: Replace entire table
  - With primary key: Update matching rows

- **Delimiter & Enclosure**:
  - CSV parsing configuration
  - Delimiter: `,`, `;`, `\t`, etc.
  - Enclosure: `"`, `'`, etc.

#### HeaderPrimaryKey
- **Column Detection**:
  - Manual: User specifies columns
  - Header: First row as column names
  - Auto: Auto-detect structure

- **Primary Key**:
  - Multi-select field
  - Used for incremental mode updates
  - Cannot change for existing tables

#### AuditBox
- **Add Row Number Column**:
  - Adds `ftp_row_number` column
  - Tracks row position in source file

- **Add Filename Column**:
  - Adds `ftp_filename` column
  - Tracks which file row came from

## Authentication & Security

### Credentials Handling

All sensitive data encrypted:

```typescript
{
  '#password': 'encrypted_password',
  '#privateKey': 'encrypted_ssh_key',
  '#spass': 'encrypted_ssh_password'  // SSH tunnel
}
```

### FTP Connection Types

| Type | Port | Encryption | Auth Methods | Use Case |
|------|------|-----------|---|---|
| FTP | 21 | None | Password | Internal networks only |
| FTPS | 21 | TLS/SSL | Password | Secure FTP connection |
| SFTP | 22 | SSH | Password + Key | Secure SSH-based transfer |

### SSH Key Management
- Supports OpenSSH and PuTTY key formats
- Accepts keys with/without BEGIN/END markers
- Should not include passwords in private keys
- Keys validated on connection test

## Configuration Storage

### Component-Level (Server Config)

```json
{
  "parameters": {
    "connectionType": "SFTP",
    "host": "ftp.example.com",
    "port": 22,
    "username": "sftp_user",
    "#password": "encrypted_password",
    "privateKey": "-----BEGIN RSA PRIVATE KEY-----\n...",
    "ignorePassiveAddress": false,
    "ssh": {
      "enabled": false,
      "shost": "",
      "sport": 22,
      "suser": "",
      "#spass": ""
    }
  }
}
```

### Row-Level (File Extraction Config)

```json
{
  "parameters": {
    "path": "/data/export_*.csv",
    "onlyNewFiles": true,
    "decompress": false,
    "incremental": true,
    "delimiter": ",",
    "name": "imported_data",
    "enclosure": "\"",
    "columnsFrom": "header",
    "primaryKey": ["id"],
    "addRowNumberColumn": false,
    "addFilenameColumn": true
  },
  "processors": {
    "after": [
      {
        "definition": { "component": "keboola.processor.create-manifest" },
        "parameters": {
          "delimiter": ",",
          "enclosure": "\"",
          "incremental": true,
          "primary_key": ["id"],
          "columns_from": "header"
        }
      }
    ]
  }
}
```

## File Path Examples

### Exact File
```
path: '/export/data.csv'
→ Downloads: /export/data.csv only
```

### Wildcard Pattern
```
path: '/data/2024-*.csv'
→ Downloads: /data/2024-01.csv, /data/2024-02.csv, etc.
```

### Recursive Pattern
```
path: '/data/**/*.csv'
→ Downloads: All CSV files in /data/ recursively
```

### With Only New Files
```
path: '/reports/*.csv'
onlyNewFiles: true
→ Downloads: CSV files modified since last run
```

## State Management

### Pattern Used
**Configuration-driven with Adapters**

- Uses `createRoute()` utility
- Server config at component level
- Path config at row level
- Adapters handle transformation

### Data Flow

```
User configures server
    ↓
clicks Test Connection
    ↓
Docker action validates connection
    ↓
Configuration saved
    ↓
User configures path/extraction
    ↓
User clicks Save
    ↓
Adapters transform config
    ↓
Configuration stored
    ↓
Component execution: Download → Parse → Store
```

## CSV Data Parsing

### Column Detection Modes

1. **Header Mode**
   - First row becomes column names
   - Skipped from data import

2. **Auto Mode**
   - Auto-detects CSV structure
   - Generates column names if needed

3. **Manual Mode**
   - User specifies columns explicitly
   - Useful for complex formats

### CSV Options

- **Delimiter**: Field separator
- **Enclosure**: Quote character
- **Incremental**: Append vs replace

## User-Facing Workflows

### Workflow 1: Setup SFTP Connection
1. Select "SFTP" connection type
2. Enter hostname (or select from approved list)
3. Verify port (default 22)
4. Enter username
5. Choose authentication:
   - Password: Enter password
   - SSH Key: Paste private key
6. Click "Test Connection"
7. If successful, save configuration

### Workflow 2: Configure File Extraction
1. Enter remote file path/pattern
2. Choose optional: New files only, Decompress
3. Configure CSV format (delimiter, enclosure)
4. Set output table name
5. Select column detection mode
6. Define primary key if incremental
7. Save and run extraction

### Workflow 3: Incremental Daily Updates
1. Configure SFTP connection with test
2. Set path with wildcard pattern
3. Enable "Only New Files"
4. Configure incremental mode + primary key
5. Set scheduler to run daily
6. Component tracks timestamps automatically
7. Each run only imports new/modified files

## Notable Patterns

1. **Multi-Protocol Support**:
   - Single module handles 3 protocols
   - Conditional UI based on protocol selection
   - Shared configuration structure

2. **Approved Hostnames**:
   - Component-level security configuration
   - Restricts user-configurable connections
   - Enforced via imageParameters

3. **SSH Key Support**:
   - More secure than password-only
   - Handles various key formats
   - Optional private key passphrases supported

4. **Processor Pipeline**:
   - Similar to S3/Azure modules
   - Uses create-manifest for CSV parsing
   - Modular and extensible

## Technical Debt & Observations

1. **ConnectionType Field Naming**:
   - Inconsistent casing with other extractors
   - Could standardize field naming

2. **SSH Tunnel Configuration**:
   - SshForm component adds complexity
   - Could be documented better
   - Most users don't need this feature

3. **Approved Hostnames**:
   - Component-level security
   - Cannot be changed via UI
   - Requires backend configuration

4. **Error Handling**:
   - Connection errors could be more specific
   - No timeout configuration options
   - Limited retry logic

5. **Legacy Component**:
   - Uses Immutable.js still
   - Could benefit from modernization
   - Some React patterns outdated

## API Integration

### Docker Actions

1. **testConnection**
   - Validates FTP/FTPS/SFTP connection
   - Tests authentication
   - Verifies file access
   - Returns success/error

2. **File Download & Processing**
   - Lists matching files
   - Downloads selected files
   - Parses CSV format
   - Stores in Keboola Storage

### Component Backend

- Handles FTP/FTPS/SFTP protocols
- Manages SSH connections
- Processes file transfers
- Implements retry logic

## Related Modules

- `modules/ex-aws-s3` - Cloud storage extractor
- `modules/ex-azure-blob` - Azure blob extractor
- `modules/storage` - Storage table management
- `@keboola/design` - UI components
- `SshForm` - SSH configuration component

## Testing

- Server adapter configuration tests
- Path adapter conversion tests
- SSH key parsing tests
- CSV format configuration tests
- FTP connection mocking tests
- Integration tests with test FTP server

## References

- [RFC 959 - FTP Protocol](https://tools.ietf.org/html/rfc959)
- [RFC 4217 - FTPS Security](https://tools.ietf.org/html/rfc4217)
- [RFC 4251 - SSH Protocol](https://tools.ietf.org/html/rfc4251)
- [IETF Draft - SFTP](https://tools.ietf.org/html/draft-ietf-secsh-filexfer-extensions)
