# Data Apps Module Documentation

## Overview

The Data Apps module manages Streamlit-based data applications within Keboola. It provides:
- **Data App Creation and Configuration**: Setup and management of Streamlit applications
- **Deployment Management**: Deployment lifecycle from code to running apps
- **Dependency Management**: Package requirements handling and updates
- **Terminal Logs**: Real-time application output monitoring
- **Notifications**: Deployment and runtime event tracking
- **Credential Management**: Secure secrets and environment variables
- **Application Status Monitoring**: Track running, terminated, and error states

## Architecture

### Core Structure

```
apps/kbc-ui/src/scripts/modules/data-apps/
├── DataAppsStore.ts                # Flux store for data apps state
├── DataAppNameEdit.tsx             # Edit data app name inline
├── DetailStatusLabel.tsx            # Status label with details
├── Header.tsx                      # Module header component
├── Index.tsx                       # Main entry point
├── RedeployInfoAlert.tsx           # Redeploy notification
├── actions.ts                      # Action creators
├── constants.ts                    # Configuration constants
├── helpers.ts                      # Utility functions
├── components/
│   ├── DataApps.tsx               # Main data apps list component
│   ├── DeployDataApp.tsx          # Deploy action with modal
│   ├── DeleteDataApp.tsx          # Delete confirmation
│   ├── TerminateDataApp.tsx       # Terminate action
│   ├── OpenDataApp.tsx            # Open app link button
│   ├── AdditionalSettings.tsx     # UI customization settings
│   ├── AuthenticationSettings.tsx # Authentication configuration
│   ├── CredentialsModal.tsx       # Secrets/credentials UI
│   ├── SecretsBox.tsx             # Secrets display and management
│   ├── SecretForm.tsx             # Add/edit secret form
│   ├── ThemeSettings.tsx          # UI theme configuration
│   ├── UploadSecretsModal.tsx     # Bulk secrets upload
│   ├── Deployment/
│   │   ├── Deployment.tsx         # Deployment mode selector
│   │   ├── DeploymentCard.tsx     # Code vs Git deployment
│   │   ├── CodeField.tsx          # Inline code editor
│   │   └── PackagesCard/          # Dependency management
│   ├── NotificationsTab/          # Event notifications
│   └── TerminalLogsTab/           # Application output logs
```

## Key Features

### 1. Data App Lifecycle

#### States
- **notDeployed**: Configured but never deployed
- **running**: Currently executing
- **terminated**: Stopped by user
- **suspended**: Paused or sleeping
- **error**: Failed state

#### Status Display
```typescript
type DetailStatusLabel = {
  state: AppState;
  reason?: string;           // Error message
  message?: string;          // Additional context
};
```

### 2. Deployment System

#### Deployment Types
- **Code Deployment**: Direct inline code in platform
- **Git Deployment**: Pull from Git repository (future feature)

#### DeploymentCard Component
```typescript
// Manages deployment mode selection
type UIFormType = 'code' | 'git';

// Selects code or git based on current config
const [type, setType] = useState<UIFormType>(!!code ? 'code' : 'git');
```

#### Deployment Flow
1. **Size Selection**: Choose container size (tiny to large)
2. **Expiration Setup**: Auto-sleep timeout configuration
3. **Optional Updates**: Update package dependencies
4. **Confirm Deployment**: Submit deployment request
5. **Monitor Progress**: Track job status

### 3. Package Management

#### PackagesCard Features
- Upload requirements.txt
- Edit dependencies inline
- Freeze dependency versions
- Update dependencies option
- Delete packages option

#### Frozen Dependencies
```typescript
const isFreezeActive = 
  configJs.configuration.parameters?.dataApp?.freezeDependencies ?? false;

// When deploying with frozen deps:
// - Show "Update packages dependencies" checkbox
// - Allow opt-in to update when deploying
```

#### Requirements Upload
- Parse and validate requirements.txt
- Store in app configuration state
- Display in UI for editing
- Version frozen state indication

### 4. Credentials and Secrets

#### Secret Management
- Store environment variables securely
- Use Keboola vault integration
- Display as masked in UI
- Delete individual secrets
- Bulk upload secrets

#### CredentialsModal Structure
```typescript
// Supports key-value secret pairs
type Secret = {
  name: string;              // Environment variable name
  value: string;             // Secret value (masked)
};

// Upload interface
type SecretsUpload = {
  secrets: Secret[];
};
```

#### SecretForm
- Add new secrets individually
- Edit existing secrets
- Validation of names and values
- Confirmation before deletion

### 5. Application Configuration

#### Size Configuration
```typescript
type SandboxSize = 'tiny' | 'small' | 'medium' | 'large';

// Mapped to:
// tiny: 8 GB RAM, 1 CPU core, 1TB SSD shared
// small: 16 GB RAM, 2 CPU cores, 1TB SSD shared
// medium: 32 GB RAM, 4 CPU cores, 1TB SSD shared
// large: 120 GB RAM, 14 CPU cores, 1TB dedicated
```

#### Expiration Configuration
```typescript
// Auto-sleep timeout in seconds
// Default: varies by configuration
// Minimum: depends on pay-as-you-go plan
```

### 6. Deployment Modal

#### DeployDataApp Component
```typescript
const DeployDataApp = (props: {
  mode: 'sidebar' | 'menuitem';      // Render context
  config: Map<string, any>;          // Component config
  readOnly: boolean;                 // Edit permission
  hasPayAsYouGo: boolean;            // Plan features
  app?: ExistingApp;                 // Current app
  onKeyDown?: (event) => void;       // Keyboard handler
})
```

#### Deployment Steps
1. **Load Current Settings**: Retrieve size, expiration, freeze status
2. **Size Selection**: `WorkspaceSizeControl` component
3. **Expiration Setup**: `TimeoutControl` with custom options
4. **Dependency Updates**: Checkbox if freeze active
5. **Confirmation**: Submit with all settings

#### Deployment Response
```typescript
// After deployment:
// - App transitions to 'running' state
// - Terminal logs become available
// - Notifications show deployment events
// - 10-second deployment prevention cooldown
```

### 7. Terminal Logs

#### TerminalLogsTab Features
- Real-time application output
- Syntax highlighting
- Auto-scroll on new output
- Download logs button
- Clear logs action

#### TerminalLogs Component
- Uses ANSI color parsing
- Fixed-width font display
- Scrollable container
- Responsive layout

#### DownloadButton
- Export logs as text file
- Timestamped filename
- Includes all captured output

### 8. Notifications

#### NotificationTab Features
- Event history display
- Deployment events
- Error notifications
- User actions (start, stop, deploy)
- Timestamp tracking

#### Event Types
- Deployment started
- Deployment completed
- Deployment failed
- App started
- App stopped
- Errors occurred

### 9. Status Monitoring

#### RedeployInfoAlert
- Shows when redeploy required
- Lists configuration changes
- Suggests deployment action
- Links to deployment modal

#### Status Labels
```typescript
// DetailStatusLabel shows:
// - Current state
// - Reason (if error)
// - Additional message
// - Visual indicators (color, icon)
```

## State Management

### Flux Store Pattern
```typescript
// DataAppsStore manages:
type Store = {
  dataApps: ExistingApp[];    // All data apps
  isLoaded: boolean;          // Load state
};

// Dispatcher actions:
// DATA_APPS_LOAD_SUCCESS
// DATA_APP_LOAD_SUCCESS
// DATA_APPS_CREATE_SUCCESS
// DATA_APP_DELETE_SUCCESS
```

### App Configuration Structure
```typescript
type DataAppConfig = {
  name: string;
  description: string;
  state: 'running' | 'terminated' | ...;
  configuration: {
    parameters: {
      dataApp?: {
        freezeDependencies?: boolean;
        inactivityTimeout?: number;
        size?: SandboxSize;
      };
    };
  };
  state?: {
    data_app?: {
      'requirements.txt'?: string;
    };
  };
};
```

## Action Creators

### updateApp
```typescript
// Update app configuration and optionally deploy
updateApp(
  app: ExistingApp,
  config: Map<string, any>,
  state: 'running' | 'terminated',
  updateDependencies: boolean
): Promise<any>
```

### deleteApp
```typescript
// Delete data app completely
deleteApp(componentId: string, configId: string): Promise<any>
```

### terminateApp
```typescript
// Stop running data app
terminateApp(componentId: string, configId: string): Promise<any>
```

## API Integration

### Data Science Service APIs
- Create data app configuration
- Update data app settings
- Deploy data app
- Terminate data app
- Delete data app
- Fetch app status

### Query Service Integration
- Terminal logs streaming
- Job status polling
- Deployment progress tracking

## Type Definitions

```typescript
// Data app instance
type ExistingApp = {
  id: string;
  name: string;
  description?: string;
  state: AppState;
  createdAt: string;
  updatedAt: string;
  configuration: DataAppConfiguration;
};

// Application state
type AppState = 'running' | 'terminated' | 'suspended' | 'notDeployed' | 'error';

// Deployment configuration
type DeploymentConfig = {
  code?: string;              // Inline Python/Streamlit code
  gitRepository?: string;     // Git repo URL (future)
  branch?: string;            // Git branch (future)
};

// Size type
type SandboxSize = 'tiny' | 'small' | 'medium' | 'large';
```

## Constants

### Deployment Paths
- `SIZE_PATH`: Path to size configuration in state
- `EXPIRATION_PATH`: Path to timeout configuration
- `EXPIRATION_PATH_FALLBACK`: Legacy expiration path

### Default Values
- `DEFAULT_EXPIRATION`: Default auto-sleep timeout
- `MINIMUM_EXPIRATION`: Minimum timeout based on plan
- `AUTO_SLEEP_NOTE`: User-facing explanation

## Helpers

### isAppConfigured
- Checks if app has code or git config
- Disables deploy button if not configured

### getDeployActionLabel
- Returns 'Deploy' or 'Redeploy' based on state
- Contextual button text

### prepareExpiration
- Extracts timeout from config
- Falls back to default if missing
- Validates against minimum

## Integration Points

### With Sandboxes Module
- Shares size selection component
- Similar configuration structure
- Reuses timeout control

### With Storage Module
- App storage backend
- Access to buckets and tables
- Data integration

### With Components Module
- Configuration storage
- Component metadata
- Version tracking

### With Queue Module
- Deployment job tracking
- Status monitoring
- Job history

## Development Guidelines

### Adding New Settings
1. Extend `DataAppConfiguration` type
2. Add UI component in components/
3. Update helpers for value extraction
4. Store in configuration state
5. Persist via API on deploy

### Creating New Tabs
1. Create file in appropriate subdirectory
2. Export index entry point
3. Register in main DataApps component
4. Add tab selector UI

### Extending Notifications
1. Add event type constant
2. Implement display component
3. Update dispatcher action handler
4. Trigger from action creators

## Testing

### Key Areas
- Deployment workflow
- Package management
- Secret handling
- Status transitions
- Log streaming
- Error handling

### Mock Requirements
- DataAppsStore mock
- API response mocks
- Job polling mocks
- Terminal streaming mock

## Common Tasks

### Deploy Data App
```typescript
// User clicks Deploy button
// 1. Show deployment modal
// 2. Select size and timeout
// 3. Confirm deployment
// 4. Update app state to 'running'
// 5. Show success notification
```

### Add Secret
```typescript
// User adds environment variable
// 1. Open credentials modal
// 2. Enter name and value
// 3. Submit to API
// 4. Vault stores secret
// 5. Display in secrets list
```

### Monitor Deployment
```typescript
// User watches deployment progress
// 1. Terminal logs stream
// 2. Status updates in real-time
// 3. Notifications show events
// 4. Auto-close on completion
```

### Update Dependencies
```typescript
// User clicks "Update packages dependencies"
// 1. Option shown only if freeze active
// 2. Flag set in deployment params
// 3. App resolves new versions
// 4. Updates frozen versions
// 5. Redeploys with new versions
```

## Security Considerations

- Secrets stored in Keboola vault
- Masked display in UI
- API-level validation
- Configuration encryption
- Token-based authentication
- Secure terminal output

## Performance

- Lazy load terminal logs
- Pagination for large histories
- Efficient state updates
- Memoized components
- Minimal re-renders

## Debugging

### Common Issues
- Deployment fails → Check terminal logs for errors
- Secrets not available → Verify vault setup
- Status not updating → Check API connection
- Logs not streaming → Verify job ID and polling

