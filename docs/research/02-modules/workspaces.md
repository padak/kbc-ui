# Workspaces Module Documentation

## Overview

The Workspaces module manages external database workspaces for components like extractors and writers. It provides:
- **Workspace Creation**: Provision new database workspaces
- **Workspace Management**: List, update, and delete workspaces
- **Credential Management**: Store and reset connection credentials
- **Configuration Integration**: Link workspaces to component configurations

## Architecture

### Core Structure

```
apps/kbc-ui/src/scripts/modules/workspaces/
├── WorkspacesStore.js              # Flux store for workspace state
├── WorkspacesActions.js            # Action creators
├── WorkspacesApi.js                # API client
├── Constants.js                    # Constants and configuration
├── helpers.js                      # Utility functions
└── helpers.test.js                 # Tests
```

## Key Features

### 1. Workspace Store

#### State Structure
```typescript
type WorkspacesStore = {
  workspaces: {
    [componentId: string]: {
      [configId: string]: {
        [workspaceId: string]: WorkspaceDetail
      }
    }
  }
}
```

#### Workspace Detail
```typescript
type WorkspaceDetail = {
  id: string;
  name: string;
  connection: {
    user: string;              // Connection user identifier
    password?: string;         // (Only when just created)
    host?: string;            // Database host
  };
  backend?: string;           // Database backend (e.g., 'snowflake')
  status: 'ready' | 'pending';
}
```

### 2. API Operations

#### loadConfigurationWorkspaces
- Fetches all workspaces for a component configuration
- Endpoint: `GET /components/{componentId}/configs/{configId}/workspaces`
- Returns array of workspace details

#### createConfigurationWorkspace
```typescript
// Create new workspace
createConfigurationWorkspace(
  componentId: string,
  configId: string,
  params: {
    name: string;
    backend: string;          // e.g., 'snowflake'
    // ... other backend-specific params
  }
)

// Snowflake-specific handling:
// - Auto-sets networkPolicy: 'user' if backend === 'snowflake'
```

#### deleteWorkspace
- Async deletion: `DELETE /workspaces/{workspaceId}?async=true`
- Allows workspace cleanup
- Returns deletion job

#### resetPassword
- Reset workspace connection password
- Endpoint: `POST /workspaces/{workspaceId}/password`
- Returns new password

### 3. Workspace Lifecycle

#### Workspace Creation Flow
1. **Select Component/Config**: Choose which configuration to create for
2. **Configure Workspace**: Set backend, name, parameters
3. **Submit Request**: Call createConfigurationWorkspace API
4. **Wait for Ready**: Workspace transitions from pending to ready
5. **Retrieve Credentials**: User copies password for connection

#### Workspace States
- **pending**: Provisioning in progress
- **ready**: Available for use
- **error**: Failed to provision

### 4. Credential Management

#### Password Storage
- Only stored in memory after creation
- User must copy immediately
- Can reset via resetPassword API
- Not persisted in UI state after modal close

#### Connection Parameters
```typescript
// Available after workspace ready:
type ConnectionParams = {
  user: string;              // Connection username
  password: string;          // Retrieved after creation/reset
  host: string;             // Database hostname (some backends)
}
```

### 5. Stores Integration

#### Updates
- **CONFIGURATION_WORKSPACE_CREATE_SUCCESS**: Add new workspace to store
- **CONFIGURATION_WORKSPACES_LOAD_SUCCESS**: Merge loaded workspaces
- **CONFIGURATION_WORKSPACES_DELETE_SUCCESS**: Remove workspace
- **CONFIGURATION_WORKSPACES_PASSWORD_RESET_SUCCESS**: Update password
- **CONFIGURATION_WORKSPACES_HIDE_PASSWORD**: Remove cached password

#### Helper Functions
```typescript
// Prepare workspace data for storage
prepareConfigurationWorkspaces(workspaces: Immutable.Map)

// Update workspace connection parameters
updateWorkspaceParameters(workspace: Immutable.Map)
```

## State Management

### Flux Pattern
```typescript
// Actions flow:
// 1. Component dispatches action
// 2. WorkspacesStore receives via dispatcher
// 3. Store merges/updates internal state
// 4. Store emits change notification
// 5. Components subscribe and re-render
```

### Store Queries
```typescript
// Get workspace by user identifier
getConfigurationWorkspaceByConnectionUser(
  componentId: string,
  configId: string,
  workspaceUser: string
): Map<string, any>
```

## Type Definitions

```typescript
// Workspace document
type WorkspaceConfiguration = {
  id: string;
  componentId: string;
  configId: string;
  name: string;
  backend: string;
  connection: ConnectionInfo;
  status: 'ready' | 'pending' | 'error';
  createdAt: string;
  updatedAt: string;
};

// Connection credentials
type ConnectionInfo = {
  user: string;
  password?: string;           // Only after creation
  host?: string;
  port?: number;
};
```

## API Endpoints

### Storage API
All calls use forceProduction flag to bypass dev branch mode:

```typescript
// Create workspace in configuration
POST /components/{componentId}/configs/{configId}/workspaces
forceProduction: true

// List workspaces in configuration
GET /components/{componentId}/configs/{configId}/workspaces
forceProduction: true

// Delete workspace
DELETE /workspaces/{workspaceId}?async=true
forceProduction: true

// Reset workspace password
POST /workspaces/{workspaceId}/password
forceProduction: true
```

## Constants

```typescript
// Route names
const routeNames = {
  WORKSPACES: 'workspaces',
  WORKSPACE: 'workspace',
  WORKSPACE_VERSIONS: 'workspace-versions',
};

// Action types
const ActionTypes = {
  CONFIGURATION_WORKSPACE_CREATE_SUCCESS,
  CONFIGURATION_WORKSPACES_LOAD_SUCCESS,
  CONFIGURATION_WORKSPACES_DELETE_SUCCESS,
  CONFIGURATION_WORKSPACES_PASSWORD_RESET_SUCCESS,
  CONFIGURATION_WORKSPACES_HIDE_PASSWORD,
};
```

## Integration Points

### With Components Module
- Load component configurations
- Store workspace metadata in component config
- Component version tracking

### With Storage Module
- Workspace storage in production-only mode
- Bucket and table access from workspace

### With API Client
- Token-based authentication
- Error handling
- Request logging

## Development Guidelines

### Adding Workspace Support to Component
1. Register component in configuration
2. Add workspace creation logic
3. Store workspace reference in config
4. Display workspace credentials to user
5. Update workspace list when needed

### Modifying Workspace Structure
1. Update type definitions
2. Add API endpoint support
3. Update Store to handle new fields
4. Migrate existing data if needed

### Handling Workspace Errors
1. Check status field
2. Retry if pending/temporary error
3. Show user-friendly error message
4. Provide reset/delete option

## Testing

### Key Areas
- Workspace creation
- Credential management
- Password reset
- Workspace deletion
- Store updates
- API error handling

### Mock Requirements
- API responses
- Store state
- Dispatcher
- Success/error scenarios

## Common Tasks

### Load Workspaces
```typescript
// User views workspace list
// 1. Call loadConfigurationWorkspaces
// 2. Store updates with results
// 3. Components re-render with list
```

### Create Workspace
```typescript
// User creates new workspace
// 1. Submit creation form
// 2. Call createConfigurationWorkspace
// 3. Store adds to state
// 4. Show credentials modal
// 5. User copies password
```

### Reset Password
```typescript
// User forgets password
// 1. Click reset password action
// 2. Call resetPassword API
// 3. Store updates cached password
// 4. Show new password in modal
```

### Delete Workspace
```typescript
// User removes workspace
// 1. Click delete action
// 2. Show confirmation
// 3. Call deleteWorkspace API
// 4. Store removes from state
// 5. Refresh component config
```

## Security Considerations

- Passwords only shown immediately after creation
- forceProduction flag prevents dev branch access
- Token-based authentication
- Credentials not logged or exposed
- API encryption for transmission

## Performance

- Lazy load workspace lists
- Cache workspaces in store
- Batch updates from API
- Minimal re-renders

## Debugging

### Issues
- **Not Loading**: Check API endpoint, authentication
- **Creation Fails**: Check backend selection, parameters
- **Password Reset Fails**: Verify workspace ID
- **State Not Updating**: Check dispatcher, action types

