# Sandboxes Module Documentation

## Overview

The Sandboxes module manages ephemeral computational workspaces for data processing. It provides:
- **Sandbox Provisioning**: Create isolated environments for different languages/databases
- **Sandbox Lifecycle**: Manage creation, restoration, termination, and sharing
- **Data Loading**: Transfer data in/out of workspaces
- **Credential Management**: Store and display connection details
- **Transformation Integration**: Create transformations from sandbox configurations
- **Backend Management**: Support for multiple database and computing backends

## Architecture

### Core Structure

```
apps/kbc-ui/src/scripts/modules/sandboxes/
├── SandboxesApi.ts                 # API client for sandbox service
├── SandboxesStore.ts               # Flux store for sandbox state
├── SandboxesActions.ts             # Action creators
├── Actions.ts                      # Helper actions
├── Constants.ts                    # Constants and configuration
├── helpers.ts                      # Utility functions
├── types.ts                        # Type definitions
├── queries.ts                      # TanStack Query definitions
├── routes.tsx                      # Route definitions
├── components/
│   ├── Sandboxes.tsx              # Main sandbox list
│   ├── SandboxesIndex.tsx         # Index wrapper
│   ├── SandboxDetail.tsx          # Sandbox details view
│   ├── SandboxStatusLabel.tsx     # Status display
│   ├── AddSandboxModal/           # Creation workflow
│   ├── SandboxActions/            # Action buttons
│   ├── SandboxCredentialsParams/  # Credential display
│   └── WorkspaceSizeControl.tsx   # Size selection UI
```

## Key Features

### 1. Sandbox Types

#### Database Sandboxes
```typescript
const SANDBOX_TYPE = {
  SNOWFLAKE: 'snowflake',         // SQL workspace
  REDSHIFT: 'redshift',           // AWS data warehouse
  EXASOL: 'exasol',              // In-memory database
  TERADATA: 'teradata',          // Enterprise database
  BIGQUERY: 'bigquery',          // Google BigQuery
  SYNAPSE: 'synapse',            // Azure Synapse
};
```

#### Container-Based Sandboxes
```typescript
const CONTAINER_BASED = [
  SANDBOX_TYPE.JULIA,             // Julia computing environment
  SANDBOX_TYPE.PYTHON,            // Python environment
  SANDBOX_TYPE.PYTHON_SNOWPARK,   // Python + Snowpark
  SANDBOX_TYPE.R,                 // R computing environment
  SANDBOX_TYPE.STREAMLIT,         // Streamlit web apps
];
```

#### Client-Requiring Sandboxes
```typescript
const NEED_CLIENT_TO_CONNECT = [
  SANDBOX_TYPE.REDSHIFT,
  SANDBOX_TYPE.SYNAPSE,
  SANDBOX_TYPE.EXASOL,
  SANDBOX_TYPE.TERADATA,
  SANDBOX_TYPE.BIGQUERY,
];
```

### 2. Sandbox Sizes

#### Size Configuration
```typescript
const SANDBOX_SIZES = {
  TINY: 'tiny',         // 8 GB RAM, 1 CPU core
  SMALL: 'small',       // 16 GB RAM, 2 CPU cores
  MEDIUM: 'medium',     // 32 GB RAM, 4 CPU cores
  LARGE: 'large',       // 120 GB RAM, 14 CPU cores
};

const SANDBOX_LABELS = {
  tiny: 'XSmall - 8 GB RAM, 1 CPU core, 1TB SSD shared',
  small: 'Small - 16 GB RAM, 2 CPU cores, 1TB SSD shared',
  medium: 'Medium - 32 GB RAM, 4 CPU cores, 1TB SSD shared',
  large: 'Large - 120 GB RAM, 14 CPU cores, 1TB dedicated',
};
```

#### Size Support by Type
```typescript
const SUPPORT_SIZES = [
  SANDBOX_TYPE.JULIA,
  SANDBOX_TYPE.PYTHON,
  SANDBOX_TYPE.PYTHON_SNOWPARK,
  SANDBOX_TYPE.STREAMLIT,
  SANDBOX_TYPE.R,
];
```

### 3. Sandbox Lifecycle

#### States
- **creating**: Initial provisioning in progress
- **active**: Ready for use
- **terminated**: Stopped by user
- **error**: Failed state
- **sleeping**: Auto-sleep timeout active

#### Creation Flow
1. **Select Type**: Choose sandbox backend (SQL database or container)
2. **Configure Settings**: 
   - Set size for container-based
   - Set backend size for Snowflake
   - Select login type for Snowflake
   - Set inactivity timeout
3. **Load Data**: Optional initial data loading
4. **Wait for Ready**: Polling until active status
5. **Display Credentials**: Show connection details

#### Key Actions
```typescript
// Create new sandbox
createSandbox(
  name: string,
  type: SandboxType,
  options: {
    shared: boolean;
    readOnlyStorageAccess: boolean;
    loginType?: 'snowflake-legacy-service' | 'snowflake-person-keypair';
    publicKey?: string;              // For key-pair auth
    backendSize?: string;            // For Snowflake
  },
  params: Map<string, any>
)

// Restore from sleep
restoreSandbox(sandboxId: string)

// Load data into sandbox
loadData(sandboxId: string, configId: string, mapping: Mapping)

// Unload data from sandbox
unloadData(sandboxId: string, configId: string)

// Share sandbox with project
shareSandbox(sandboxId: string, shared: boolean)

// Delete sandbox
deleteSandbox(sandboxId: string)

// Terminate (stop) sandbox
terminateSandbox(sandboxId: string)
```

### 4. Credentials and Connection Details

#### Connection Information by Type

**Database Sandboxes:**
```typescript
type DatabaseCredentials = {
  host: string;           // Database host
  user: string;           // Connection user
  password?: string;      // Connection password (masked in UI)
  database?: string;      // Default database/schema
  port?: number;          // Database port
};
```

**Snowflake-Specific:**
```typescript
type SnowflakeCredentials = {
  host: string;           // Snowflake account URL
  user: string;
  password: string;
  warehouse?: string;     // Compute warehouse
  db?: string;           // Default database
  schema?: string;       // Default schema
};
```

**BigQuery:**
```typescript
type BigQueryCredentials = {
  workspaceDetails: {
    projectId: string;
    datasetId: string;
    credentials?: object; // JSON key file
  };
};
```

#### Credential Components
- **SandboxCredentialsParams**: Display connection parameters
- **PasswordDescriptionItem**: Show password field
- **KeyPairDescriptionsItem**: Show SSH key details
- **BigQuerySandboxParams**: BigQuery-specific parameters

### 5. Storage Access

#### ReadOnly Storage Access
```typescript
const SUPPORTS_READONLY_STORAGE_ACCESS_TOGGLE = [
  SANDBOX_TYPE.SNOWFLAKE,
];

const FORCE_READONLY_STORAGE_ACCESS = [
  SANDBOX_TYPE.PYTHON_SNOWPARK,
  SANDBOX_TYPE.BIGQUERY,
];

const ONLY_READONLY_STORAGE = [
  SANDBOX_TYPE.TERADATA,
];
```

#### Storage Mapping
```typescript
type Mapping = {
  input?: {
    tables?: TableInputMapping[];
    files?: FileInputMapping[];
  };
  output?: {
    tables?: TableOutputMapping[];
    files?: FileOutputMapping[];
  };
};

type TableInputMapping = {
  source: string;           // Storage table
  destination: string;      // Workspace table
  columns?: string[];       // Optional column filter
};
```

### 6. Auto-Sleep Configuration

#### Settings
```typescript
const AUTO_SLEEP_DEFAULT = 1;  // Hours
const AUTO_SLEEP_OPTIONS = [1, 2, 4, 8, 12, 16, 20, 24];

// Custom timeout in seconds allowed
const AUTO_SLEEP_NODE = 
  'Workspace will automatically switch to sleep mode if inactive for selected period.';
```

#### Timeout Features
- Automatic sleep after inactivity period
- Configurable per sandbox
- Can only change during restoration
- Applies to container-based types

### 7. Snowflake Workspace Configuration

#### Login Types
```typescript
const workspaceLoginTypeTextMap = {
  'snowflake-legacy-service': {
    label: 'SSO / Password Authentication',
    description: 'Legacy Service',
    // SSO + single-factor password auth
  },
  'snowflake-person-keypair': {
    label: 'SSO / Key Pair Authentication',
    description: 'Person',
    // SSO + secure key pair auth (recommended)
  },
};
```

#### Backend Size
```typescript
const WAREHOUSE_SIZE_MAPPING = {
  KEBOOLA_PROD: 'Default',
  KEBOOLA_SMALL: 'Small',
  KEBOOLA_MEDIUM: 'Medium',
  KEBOOLA_LARGE: 'Large',
};

const SUPPORT_BACKEND_SIZE = [SANDBOX_TYPE.SNOWFLAKE];
```

### 8. Sandbox Sharing

#### Sharing Mechanism
```typescript
// Enable sharing
ENABLE_SHARING_MESSAGE = 
  'You are about to enable sharing of this workspace. ' +
  'Workspace will be available to all project users.';

// Disable sharing
DISABLE_SHARING_MESSAGE = 
  'You are about to disable sharing of this workspace.';
```

#### Sharing Rules
- Shared sandboxes available to all project users
- Non-shared sandboxes restricted to owner
- Sharing managed by token permissions

### 9. Billing and Features

#### Billable Sandboxes
```typescript
const BILLABLE = [
  SANDBOX_TYPE.JULIA,
  SANDBOX_TYPE.PYTHON,
  SANDBOX_TYPE.PYTHON_SNOWPARK,
  SANDBOX_TYPE.R,
];
```

#### Stack Features
- Dynamic user workspace support (per-type)
- Feature flag checking
- Pay-as-you-go plan variations

## State Management

### Flux Store Pattern
```typescript
type SandboxesState = {
  sandboxes: Map<string, SandboxDetail>;
  pendingActions: Map<string, Map<string, boolean>>;
  processingJobs: List<Job>;
  isLoading: boolean;
  isLoaded: boolean;
};

// Actions:
// SANDBOXES_LOAD
// SANDBOXES_LOAD_SUCCESS
// SANDBOXES_LOAD_ERROR
// SANDBOXES_DELETE / DELETE_SUCCESS
// SANDBOXES_RESTORE / RESTORE_SUCCESS
// SANDBOXES_TERMINATE / TERMINATE_SUCCESS
// SANDBOXES_SHARE / SHARE_SUCCESS
// SANDBOXES_LOAD_DATA / LOAD_DATA_SUCCESS
// SANDBOXES_UNLOAD_DATA / UNLOAD_DATA_SUCCESS
```

### Job Tracking
```typescript
const PENDING_JOB_STATUSES = [
  JOBS_STATUS.CREATED,
  JOBS_STATUS.PROCESSING,
  JOBS_STATUS.WAITING,
];

// Monitor jobs from queue module
// Filter by KEBOOLA_SANDBOXES component
```

## API Integration

### Sandboxes Service
```typescript
// Load all sandboxes
GET /sandboxes

// Get specific sandbox
GET /sandboxes/{id}

// Update sandbox settings
PUT /sandboxes/{id}

// Get project settings
GET /projects/current
```

### Data Manipulation
```typescript
// Load data into sandbox
POST /sandboxes/{id}/load-data

// Unload data from sandbox
POST /sandboxes/{id}/unload-data
```

## Helper Functions

### resolveSandboxTypeFromComponentId
- Map component ID to sandbox type
- Handle stack-specific variations
- Return null if not a sandbox component

### resolveComponentIdFromSandboxType
- Map sandbox type to component ID
- Handle stack variations (CSAS Python)
- Support legacy transformations

### prepareSandboxes
- Filter sandboxes for UI display
- Preserve existing credentials
- Merge with configuration data
- Filter by token and type

### prepareCreatingSandboxes
- Extract creating sandboxes from job queue
- Merge with configuration data
- Handle pending creation state

### mergeConfigurations
- Merge storage mappings
- Preserve unique tables
- Handle incremental loading options
- Skip packages if needed

### createNewWorkspaceFromTransformation
- Convert transformation to sandbox config
- Handle legacy transformations specially
- Preserve storage mappings
- Store transformation metadata

### hasBasicAuthEnabled
- Check if app proxy basic auth configured
- Used for UI access control

## Type Definitions

```typescript
type SandboxType = 
  | 'snowflake'
  | 'redshift'
  | 'exasol'
  | 'teradata'
  | 'bigquery'
  | 'julia'
  | 'python'
  | 'python-snowpark'
  | 'synapse'
  | 'r'
  | 'streamlit';

type SandboxDetail = {
  id: string;
  type: SandboxType;
  name: string;
  description?: string;
  active: boolean;
  shared: boolean;
  readOnlyStorageAccess: boolean;
  host?: string;
  user?: string;
  password?: string;
  status: 'ready' | 'pending' | 'error';
  configuration: {
    id: string;
    name: string;
  };
};

type WorkspaceStep = 'sandbox_list' | 'sandbox_create' | 'sandbox_update';
```

## Development Guidelines

### Adding New Sandbox Type
1. Add to SANDBOX_TYPE constant
2. Map component ID in resolution helpers
3. Define size support
4. Create credential display component
5. Add to appropriate feature lists
6. Update tests

### Extending Storage Mapping
1. Define new mapping type
2. Add to Mapping type
3. Implement merger logic
4. Update UI components
5. Test with various configurations

### Adding Stack Features
1. Define feature flag
2. Check in StackFeaturesStore
3. Conditionally show UI
4. Document requirements

## Testing

### Key Areas
- Sandbox creation and deletion
- Credential management
- Storage data loading/unloading
- Transformation integration
- Size and timeout configuration
- Sharing functionality
- Error states and recovery

### Mock Requirements
- API responses
- Store state
- Job queue
- Component configuration
- Stack features

## Common Tasks

### Create SQL Sandbox
```typescript
// User creates Snowflake sandbox
// 1. Select Snowflake type
// 2. Set size and timeout
// 3. Choose login type
// 4. Set shared flag
// 5. Submit creation
// 6. Wait for ready
// 7. Display credentials
```

### Load Data
```typescript
// User loads data into container
// 1. Select tables to load
// 2. Configure input mapping
// 3. Submit load request
// 4. Monitor progress
// 5. Display loaded tables
```

### Create Transformation from Sandbox
```typescript
// User saves sandbox as transformation
// 1. Click "Create Transformation"
// 2. Select target component
// 3. Submit configuration
// 4. Store metadata link
// 5. Create transformation config
```

### Share Sandbox
```typescript
// User shares sandbox with project
// 1. Click share action
// 2. Confirm sharing
// 3. Update sandbox shared flag
// 4. All users can now access
```

## Security Considerations

- Token-based access control
- Read-only storage option for data protection
- Encrypted credential transmission
- Sandboxes isolated from each other
- Configuration metadata encryption
- Production-only workspace access

## Performance

- Lazy load sandbox details
- Pagination for large lists
- Cache configuration data
- Async job polling
- Efficient state updates
- Minimal re-renders

## Debugging

### Issues
- **Sandbox creation fails**: Check job queue status
- **Data loading fails**: Verify storage mappings
- **Credentials not showing**: Check credential component
- **Status not updating**: Monitor job polling
- **Size not supported**: Verify SUPPORT_SIZES for type

