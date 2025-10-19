# Module: wr-aws-s3 (AWS S3 Writer)

## Overview

The wr-aws-s3 module enables data export from Keboola Storage into Amazon S3 buckets. It provides AWS authentication (IAM access keys or STS role assumption), S3 bucket and path configuration, and configurable file naming and formatting options. Users can write data to S3 with flexible prefix paths and multiple data format options.

## File Structure

```
wr-aws-s3/
├── routes.jsx                             # Route configuration
├── constants.ts                           # Login type constants
└── react/
    ├── components/
    │   └── Credentials.jsx                # AWS credentials form
    └── pages/
        └── Configuration.jsx              # Main configuration component
├── adapters/
    ├── configuration.js                   # Configuration adapter
    ├── credentials.js                     # Credentials parsing/validation
    └── conform.js                         # Configuration normalization
```

## Routes & Configuration

### Route Structure

Uses `createRoute()` utility with two levels of configuration:

1. **Index Level** (Component credentials):
   - Component: Credentials section for AWS authentication
   - Single section for AWS login setup

2. **Row Level** (Export job):
   - Component: ConfigurationForm (file destination and naming)
   - Multiple export jobs per component instance

### Route Settings

```typescript
{
  componentId: 'keboola.wr-aws-s3',
  index: {
    actions: [GET_EXTERNAL_ID_ACTION],    // For STS role assumption
    sections: [{
      render: CollapsibleSection with Credentials component,
      onSave: credentialsCreateConfiguration,
      onLoad: credentialsParseConfiguration,
      isComplete: credentialsIsComplete
    }]
  },
  row: {
    sections: [{
      render: ConfigurationForm,
      onSave: rowCreateConfiguration,
      onCreate: rowCreateEmptyConfiguration,
      onLoad: rowParseConfiguration
    }],
    columns: [
      { name: 'Source Table', type: TABLE_LINK },
      { name: 'Destination', type: VALUE }  // Shows S3 path
    ]
  }
}
```

## Key Components

### Credentials.jsx (AWS Authentication)
- **Purpose**: Handles AWS authentication setup
- **Props**:
  - `value`: Current credentials object
  - `onChange`: Callback when credentials change
  - `disabled`: Read-only mode flag
  - `context`: Component context including componentId
- **Login Types**:
  1. **Credentials Mode**: Access Key ID + Secret Access Key
  2. **Role Mode**: AWS Account ID + Role Name + External ID
- **Features**:
  - Login type selector dropdown
  - Input fields for credentials/role details
  - External ID generation for role assumption
  - Help text and documentation links
- **Credentials Structure**:
  ```typescript
  {
    loginType: 'credentials' | 'role',
    
    // Credentials mode
    awsAccessKeyId: string,
    awsSecretAccessKey: string,
    bucket: string,
    
    // Role mode
    accountId: string,
    roleName: string,
    externalId: string  // Auto-generated via Docker action
  }
  ```

### Configuration Form
- **Purpose**: Configure S3 file export settings
- **Configuration Structure**:
  ```typescript
  {
    prefix: string;               // S3 path prefix (folder path)
    destination: string;          // File name within bucket
    incremental: boolean;         // Append vs replace mode
    primaryKey: string[];         // Table primary key columns
    delimiter: string;            // CSV delimiter character
    enclosure: string;            // CSV field enclosure
    additionalColumns: boolean;   // Include metadata columns
  }
  ```
- **Features**:
  - Prefix path builder for S3 organization
  - File name configuration
  - Delimiter selection
  - Incremental load toggle
  - Primary key definition

## Key Features

### Credentials Management

1. **IAM Credentials**
   - Access Key ID (public identifier)
   - Secret Access Key (secret token)
   - Stored securely in configuration

2. **STS Role Assumption**
   - Cross-account access support
   - External ID for additional security
   - Auto-generated external ID via Docker action
   - More secure than storing long-term keys

### S3 Destination Configuration

1. **Bucket Selection**
   - Specified during credentials setup
   - Single bucket per configuration
   - All exports go to this bucket

2. **Prefix Path**
   - S3 path prefix (e.g., "data/exports/")
   - Creates directory-like structure
   - Applied to all files in configuration

3. **File Naming**
   - Destination field specifies file name
   - Combined with prefix for full S3 path
   - Example: prefix="data/" + destination="table.csv" → "data/table.csv"

### Data Formatting

- **CSV Format**: Standard comma-separated values
- **Delimiter Options**: Configurable (comma, semicolon, tab, etc.)
- **Field Enclosure**: Quote character configuration
- **Metadata Columns**: Optional row numbering and source info

### Load Modes

1. **Append Mode** (incremental: true)
   - Adds new data to existing file
   - Primary key defined for deduplication
   - Use case: Incremental updates

2. **Replace Mode** (incremental: false)
   - Overwrites file completely
   - Previous content deleted
   - Use case: Full refresh

## Data Flow

### Configuration Load
```
Component renders → 
InstalledComponentsStore.getConfigData() → 
Parse credentials (from index config) → 
Load row configurations (export jobs) →
Display in UI
```

### Credentials Save
```
User fills credentials → 
conform() validates input → 
credentialsCreateConfiguration() serializes → 
API saves to component.authorization section →
Update UI
```

### Export Configuration Save
```
User configures file destination → 
rowCreateConfiguration() serializes → 
API saves to row configuration →
Update UI with destination display
```

## Docker Actions

### Available Actions

1. **getExternalId**
   - **Purpose**: Generate external ID for STS role assumption
   - **Autoload**: true (loads on component view)
   - **Response**: External ID string for AWS role assumption
   - **Use**: Provides secure identifier for cross-account access

## API Endpoints

| Method | Endpoint | Purpose | Response |
|--------|----------|---------|----------|
| POST | `components/{componentId}/action/run` | Get External ID | `{ 'external-id': string }` |
| PUT | `components/{componentId}/config` | Save credentials | Updated component config |
| PUT | `components/{componentId}/{configId}/rows/{rowId}` | Save export config | Updated row |

## Dependencies

### Internal Modules
- `@/modules/configurations/utils/createRoute` - Route factory
- `@/modules/configurations/utils/columnTypeConstants` - Column type definitions
- `@/modules/components/DockerActionsApi` - Docker action execution

### External Packages
- `react-bootstrap` - UI components
- `@keboola/utils` - Utility functions
- `@keboola/design` - Design system components

### Design System Components
- `FormGroup` - Form sections
- `Label` - Form labels
- `TextInput` - Text input fields
- `HelpBlock` - Help text
- `PasswordControl` - Secure password input

## Constants

### Login Types
```typescript
{
  CREDENTIALS: 'credentials',  // IAM access key authentication
  ROLE: 'role'                 // STS role assumption
}
```

### Actions
```typescript
{
  GET_EXTERNAL_ID_ACTION: {
    name: 'getExternalId',
    cache: true,              // Cache result
    autoload: true,           // Load automatically
    getPayload: () => ({})
  }
}
```

## Notable Patterns

### Credential Type Selection Pattern
```typescript
// Component shows different form based on loginType
{this.props.value.loginType === LOGIN_TYPES.ROLE ? (
  // Show role-based fields
  <>
    <AccountIdField />
    <RoleNameField />
    <ExternalIdField />
  </>
) : (
  // Show credentials fields
  <>
    <AccessKeyIdField />
    <SecretAccessKeyField />
  </>
)}
```

### Conditional Field Rendering
- UI changes based on authentication method selected
- Sensitive fields use PasswordControl component
- Help text varies by auth method
- External ID auto-loads for role assumption

### Configuration Adapter Pattern
- Separate adapters for credentials and row config
- Each handles serialization/deserialization
- Conform function normalizes on load
- Preserve unknown fields through save cycles

## User-Facing Features

### Feature 1: AWS Authentication Setup
- **Description**: Configure AWS access for S3 bucket
- **Options**:
  1. IAM Credentials: Use Access Key ID and Secret Access Key
  2. Role Assumption: Use AWS account ID and role name
- **Workflow**:
  - Select authentication method
  - Enter credentials or role details
  - For role: External ID auto-generated
  - Save credentials

### Feature 2: S3 Export Configuration
- **Description**: Set up file exports to S3
- **Workflow**:
  1. Select source table from Storage
  2. Configure S3 path (prefix)
  3. Set file name (destination)
  4. Configure CSV formatting
  5. Choose load mode (append/replace)
  6. Enable export

### Feature 3: Multiple Exports
- **Description**: Export multiple tables from single component
- **Per-export Configuration**:
  - Different file names per table
  - Independent load modes
  - Same bucket and credentials

### Feature 4: Path Organization
- **Description**: Organize exports in S3 "folders"
- **Example Paths**:
  - `data/exports/` - For export files
  - `backup/` - For backup exports
  - `archive/YYYY-MM-DD/` - Date-based organization

## Configuration Workflow

1. **Set Up AWS Credentials**
   - Choose authentication method (credentials or role)
   - If credentials: Enter Access Key ID and Secret Access Key
   - If role: Enter Account ID and Role Name
   - Save credentials securely

2. **Configure First Export**
   - Select source table from Storage
   - Set S3 prefix (optional organization path)
   - Set file name/destination
   - Configure CSV format (delimiter, enclosure)
   - Choose load mode (append or replace)

3. **Add More Exports**
   - Each table gets own export configuration
   - Can have different file names and paths
   - Independent load mode settings
   - Same AWS credentials used

4. **Manage Exports**
   - View table of all exports
   - Edit export settings anytime
   - Delete exports individually
   - See full S3 path in export list

## Technical Debt & Observations

### Legacy Patterns
- Uses `createRoute` factory function (vs modern routing)
- Form-based configuration (vs schema-driven forms)
- Direct DOM manipulation for dynamic fields

### Areas for Improvement
- Limited validation of S3 paths
- No preview of final S3 path
- Could use better organization UI for prefixes
- Role assumption setup could be more user-friendly
- Limited error messages for credential validation

### Complexity Hotspots
1. **STS Role Assumption**: External ID generation and validation
2. **Path Building**: Combining prefix and destination correctly
3. **Credentials Storage**: Sensitive data handling

### Migration Notes
- Could benefit from modern form library (React Hook Form)
- Schema-driven configuration UI would be cleaner
- TanStack Query would improve data fetching
- TypeScript migration would help with type safety

## Related Modules

- `wr-google-sheets` - Google Sheets writer (similar table export pattern)
- `wr-google-drive` - Google Drive writer (similar file export pattern)
- `ex-aws-s3` - AWS S3 extractor (reverse operation)
- `components` - Base component management

## Testing

### Key Test Scenarios
- Credentials validation (access key and role methods)
- External ID generation for role assumption
- S3 path construction
- Load mode behavior (append vs replace)
- Multiple export configurations
- Read-only mode

### Test Files
- `adapters/configuration.test.js` - Configuration adapter tests
- `adapters/credentials.test.js` - Credentials parsing tests
- Configuration spec files for test definitions

