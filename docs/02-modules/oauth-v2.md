# Module: OAuth v2 (OAuth Authorization Management)

## Overview

The OAuth v2 module provides comprehensive OAuth 2.0 authorization flow management for Keboola components that require third-party authentication (Google, Facebook, custom providers). It handles credential lifecycle management, authorization state tracking, token persistence in variables (for protected branches), and UI components for authorization workflows. The module integrates with the Vault system for secure credential storage in dev branches and supports both standard OAuth flows and direct token insertion methods.

**Key Characteristics**:
- OAuth 2.0 authorization flow handling (Google, Facebook, custom)
- Credential lifecycle management (create, retrieve, delete)
- Integration with Vault for variable-based credential storage
- Support for dev branch and production branch credentials
- Multiple authorization methods (OAuth popup, direct token)
- Component-specific authorization UI patterns
- Authorization state persistence
- Fallback handling for service unavailability

**Status**: Production - actively maintained with support for multiple OAuth providers

## File Structure

```
oauth-v2/
├── Constants.js                              # OAuth constants and action types
├── ActionCreators.js                         # Flux action dispatchers
├── Api.js                                    # OAuth service API wrapper
├── Store.js                                  # Flux store for credentials
├── OauthUtils.js                             # OAuth utility functions
├── helpers.ts                                # TypeScript helpers
├── helpers.test.ts                           # Helper function tests
├── react/
│   ├── Authorization.jsx                     # Main authorization container
│   ├── AuthorizationForm.tsx                 # OAuth popup form handler
│   ├── AuthorizationRow.tsx                  # Authorization row display
│   ├── AuthorizedBox.tsx                     # Authorized account display
│   ├── CustomAuthorizationFields.jsx         # Custom field inputs
│   ├── DirectTokenInsertFields.jsx           # Direct token input fields
│   ├── FacebookAuthorizeButton.tsx           # Facebook-specific button
│   ├── GoogleAuthorizeButton.tsx             # Google-specific button
│   ├── InstantAuthorizationFields.jsx        # Instant auth fields
│   └── RedirectionPlaceholder.tsx            # Redirect placeholder
└── [No separate pages - used as embedded component]
```

## Routes

OAuth v2 is primarily used as an embedded component in configuration pages, not as standalone routes.

**OAuth Redirect Route**:
- Route Name: `oauth-redirect`
- Used for callback handling after OAuth authorization
- Returns credentials ID via URL parameters

## Key Components & Patterns

### Constants (Constants.js)

**Purpose**: Centralized OAuth configuration and constants

**Key Exports**:
```javascript
export const ActionTypes = {
  OAUTHV2_LOAD_ALL_CREDENTIALS_SUCCESS: 'OAUTHV2_LOAD_ALL_CREDENTIALS_SUCCESS',
  OAUTHV2_LOAD_CREDENTIALS_SUCCESS: 'OAUTHV2_LOAD_CREDENTIALS_SUCCESS',
  OAUTHV2_DELETE_CREDENTIALS_SUCCESS: 'OAUTHV2_DELETE_CREDENTIALS_SUCCESS'
}

export const Constants = {
  OAUTH_VERSION_3: 3,  // Current OAuth version
  ROUTE_NAME: 'oauth-redirect',  // Callback route
  EXTERNAL_OAUTH_URL: 'https://external.keboola.com/oauth/index.html'
}
```

### API Layer (Api.js)

**Purpose**: REST client for OAuth credential operations

**Key Methods**:
```javascript
// Retrieve all credentials for branch
getAllCredentialsForBranch(branchId = null)
// branchId: null (project-wide), string (specific branch)

// Retrieve specific credential
getCredentials(componentId, id)

// Create/update credential via OAuth redirect
postCredentials(componentId, params, data)
// params: { id, authorizedFor, branchId }
// data: OAuth response or direct token

// Delete credential
deleteCredentials(componentId, id)
```

**Pattern - Dev/Production Split**:
```javascript
getAllCredentialsForBranch()  // Project-wide credentials
getAllCredentialsForBranch(productionBranchId)  // Production branch
getAllCredentialsForBranch(currentBranchId)  // Current dev branch
```

**Error Handling**:
```javascript
// 404 handling - new OAuth service may not be deployed
if (error?.response?.statusCode === 404 || error?.crossDomain) {
  return;  // Ignore error, service unavailable
}

// Service compatibility fallback
if (error?.response?.status === 422) {
  // Fallback to new service format with JSON stringification
  return createRequest('POST', ...).send({ '#data': JSON.stringify(data) })
}
```

### Action Creators (ActionCreators.js)

**Purpose**: Flux actions for credential operations

**Key Methods**:

1. **Credential Loading**:
```javascript
loadAllCredentials()
// Load project-wide, production, and current branch credentials
// Returns Promise resolved when all credentials loaded

loadCredentials(componentId, id)
// Load specific credential if not cached
// Returns cached promise or loads

loadCredentialsForce(componentId, id)
// Force reload credential regardless of cache
```

2. **Credential Management**:
```javascript
postCredentials(componentId, params, data)
// Create/update credential
// Automatically loads variables for protected branches

deleteCredentials(componentId, id)
// Delete credential
// Automatically cleans up associated variables
```

**Implementation Pattern**:
```javascript
loadCredentialsForce(componentId, id) {
  return oauthApi
    .getCredentials(componentId, id)
    .tap(() => ApplicationStore.hasProtectedDefaultBranch() && variablesActions.loadVariables())
    .then((result) => {
      dispatcher.handleViewAction({
        type: Constants.ActionTypes.OAUTHV2_LOAD_CREDENTIALS_SUCCESS,
        componentId,
        id,
        credentials: Immutable.fromJS(result)
      })
      return result
    })
    .catch(handleLoadErrors)
}
```

### Flux Store (Store.js)

**Purpose**: Manage credential state across branches

**Key Methods**:

1. **Credential Access**:
```javascript
hasCredentials(componentId, credentialsId)
// Check if credentials cached

getCredentialsById(componentId, credentialsId)
// Get specific credential by ID
// Returns Immutable Map or empty Map

getCredentials(componentId, configData)
// Get credentials referenced in config
// Extracts ID from configData.authorization.oauth_api.id
```

2. **Branch-Scoped Access**:
```javascript
getAllCredentials()
// Returns all credentials across branches
// Flattened by branch (projectWide, production, current)

// Internal structure:
credentialsByBranchScope: {
  projectWide: { credentialId -> credential },
  production: { credentialId -> credential },
  current: { credentialId -> credential }
}
```

3. **State Reduction**:
```javascript
case Constants.ActionTypes.OAUTHV2_LOAD_ALL_CREDENTIALS_SUCCESS:
  // Organize credentials by branch scope
  _store = _store.set('credentialsByBranchScope',
    action.credentials.map((credentialsByBranch) =>
      credentialsByBranch
        .toMap()
        .mapKeys((key, credentialsObject) => credentialsObject.get('id'))
    )
  )
```

### OAuth Utilities (OauthUtils.js)

**Purpose**: Core OAuth flow and credential processing logic

**Key Functions**:

1. **Credential Creation**:
```javascript
function createConfiguration(componentId, configId, credentialsId, wrapperComponentId) {
  // Build configuration object with OAuth reference
  const configuration = installedComponentsStore
    .getConfigData(wrapperComponentId ?? componentId, configId) || Map()
  
  const credentials = Map({ id: credentialsId, version: Constants.OAUTH_VERSION_3 })
  
  return configuration.setIn(
    wrapperComponentId ? ['parameters', componentId] : ['authorization', 'oauth_api'],
    credentials
  )
}
```

2. **OAuth Redirect Processing**:
```javascript
export function processRedirectData(
  componentId,
  configId,
  credentialsId,
  branchId,
  wrapperComponentId,
  skipSave
) {
  // 1. Load credentials from OAuth response
  // 2. Optionally save to variable (protected branch)
  // 3. Update configuration with credential reference
  // 4. Send success notification
  // 5. Reload configuration
}
```

3. **Variable-Based Storage**:
```javascript
export function saveCredentialsIntoVariable(componentId, configId, branchId, credentialsId) {
  // Only if protected branch (dev branch) with credentials in variables feature
  
  // Generate variable key: 'oauth_<component>_<configId>_<sequence>'
  // Create variable with:
  // - key: generated key
  // - value: credentialsId
  // - attributes: { branchId, componentId, configId }
  // - flags: ['oauthCredentialsId']
  
  // Variable replaces literal credentialsId in configuration
}
```

4. **Credentials ID Parsing**:
```javascript
export function parseCredentialsId(credentialsId) {
  // If protected branch and credentialsId is variable reference
  // Resolve variable value from vault
  
  if (isVariableName(credentialsId)) {
    const variable = findVariable(parseVariableName(credentialsId))
    return variable?.value ?? credentialsId
  }
  
  return credentialsId
}
```

5. **External Authorization Link**:
```javascript
export function generateLink(componentId, configId) {
  // Generate temporary token with component access
  // Return URL to external OAuth UI with token and config reference
  
  // External URL format:
  // https://external.keboola.com/oauth/index.html?token=...&sapiUrl=...#/:componentId/:configId
}
```

6. **Direct Token Insertion**:
```javascript
export function saveDirectData(componentId, configId, authorizedFor, branchId, data) {
  // Create credential without OAuth popup
  // Useful for tokens obtained outside normal flow
  
  const credentialsId = prepareCredentialsId(componentId, configId, branchId)
  
  return OauthActions.postCredentials(
    componentId,
    { id: credentialsId, authorizedFor, branchId },
    data
  )
}
```

### TypeScript Helpers (helpers.ts)

**Purpose**: Service detection and credential ID generation

**Key Functions**:

1. **Service Detection**:
```typescript
export const isGoogleService = (componentId: string) => {
  return (
    [KDS_EX_DV360, KDS_TEAM_EX_YOUTUBE_ANALYTICS].includes(componentId) ||
    ['google', 'gmail', 'gsuite', 'gcalendar'].some((key) => componentId.includes(key))
  )
}

export const isFacebookService = (componentId: string) => {
  return FACEBOOK_COMPONENT_IDS.includes(componentId)
}
```

2. **Return URL Generation**:
```typescript
export const getReturnUrl = (credentialsId: string) => {
  const returnUrl = new URL(
    `${window.location.origin}${ApplicationStore.getProjectPageUrl(Constants.ROUTE_NAME)}`
  )
  returnUrl.searchParams.append('credentialsId', credentialsId)
  return returnUrl.toString()
}
```

3. **Credentials ID Preparation**:
```typescript
export const prepareCredentialsId = (
  componentId?: string,
  configId?: string,
  branchId?: string
) => {
  // Build ID from available parts: component-config-branch-uuid
  return [componentId, configId, branchId, generateUUID()]
    .filter(Boolean)
    .join('-')
}
```

### React Components

#### AuthorizationForm.tsx

**Purpose**: Handles OAuth popup window and form submission

**Props**:
```typescript
type Props = {
  authorizedFor: string  // Account identifier (email, username)
  componentId: string
  configId?: string
  wrapperComponentId?: string  // If wrapping another component
  branchId?: string
  children: ReactNode
  onComplete?: (credentials: { id: string; version: number }) => void
  skipSave?: boolean  // Don't save to config
}
```

**Key Features**:
- POST form to OAuth authorize endpoint
- Opens popup window for user interaction
- Listens for post-message from popup on completion
- Populates form fields with required parameters
- Handles redirect data processing

**Implementation Pattern**:
```typescript
const handleSubmit = useCallback(
  (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    const credentialsId = prepareCredentialsId(componentId, configId, branchId)
    setFallbackCredentialsId(credentialsId)
    
    appendHiddenInput('id', credentialsId)
    appendHiddenInput('token', ApplicationStore.getSapiTokenString())
    appendHiddenInput('returnUrl', getReturnUrl(credentialsId))
    appendHiddenInput('authorizedFor', authorizedFor)
    
    if (branchId && branchId !== 'null') {
      appendHiddenInput('branchId', branchId)
    }
    
    windowRef.current = windowOpen('', 'popup,toolbar=no,menubar=no', 'OAuthPopup')
    formElementRef.current?.submit()
  },
  [appendHiddenInput, authorizedFor, branchId, componentId, configId]
)
```

**Window Communication**:
```typescript
useEffect(() => {
  const windowEventHandler = (event: MessageEvent) => {
    if (event.data?.isAuthorized) {
      processRedirectData(
        componentId,
        configId,
        event.data.credentialsId || fallbackCredentialsId,
        branchId,
        wrapperComponentId,
        skipSave
      ).then((credentialsId) => {
        windowRef.current?.close()
        onComplete?.({ id: credentialsId, version: Constants.OAUTH_VERSION_3 })
      })
      
      window.removeEventListener('message', windowEventHandler)
    }
  }
  
  window.addEventListener('message', windowEventHandler, false)
  
  return () => {
    window.removeEventListener('message', windowEventHandler)
  }
}, [...dependencies])
```

#### AuthorizedBox.tsx

**Purpose**: Display authorized account information

**Props**:
```typescript
type Props = {
  credentials: {
    creator: { description: string }  // Email of authorizer
    created: string  // ISO timestamp
    authorizedFor: string  // Account identifier
  }
  admins: Map<string, Map<string, any>>  # All project admins
  onReset: () => Promise<unknown>  # Delete credential callback
  readOnly?: boolean
  simpleMode?: boolean
  suffixToTrim?: string  # Remove suffix from display name
}
```

**Features**:
- Avatar with admin information
- Truncated account identifier display
- Creation date and creator email
- Reset authorization button with confirmation
- Simple mode for minimal display

**UI Pattern**:
```typescript
<div className="tw-flex tw-items-center tw-justify-start tw-rounded-lg tw-bg-neutral-50 tw-p-4">
  <Avatar user={{ name, email }} fallback={description} />
  <div>
    <Truncated text={description} />
    {!simpleMode && (
      <div>
        Creator email | Created date
      </div>
    )}
  </div>
  {!readOnly && (
    <ResetButton onReset={onReset} />
  )}
</div>
```

#### GoogleAuthorizeButton.tsx & FacebookAuthorizeButton.tsx

**Purpose**: Service-specific authorization button components

**Features**:
- Service logo and branding
- Pre-configured for OAuth flow
- Handles service-specific parameters
- Error boundary handling

#### Authorization.jsx

**Purpose**: Main authorization container component

**Features**:
- Authorization form wrapper
- Handles multiple authorization methods
- State tracking for authorization status
- Error handling and notifications

#### DirectTokenInsertFields.jsx

**Purpose**: UI for direct token input (no OAuth flow)

**Features**:
- Token input field with paste support
- Token validation
- Manual authorization option

#### CustomAuthorizationFields.jsx

**Purpose**: Custom field inputs for service-specific parameters

**Features**:
- Dynamic field rendering
- Validation and error display
- Component-specific requirements

## OAuth Flow Diagrams

### Standard OAuth Flow

```
1. User clicks authorize button
   ↓
2. AuthorizationForm opens popup
   ↓
3. Popup redirects to OAuth service
   ↓
4. OAuth service prompts user for login/consent
   ↓
5. OAuth service redirects back to external URL
   ↓
6. External OAuth app exchanges code for token
   ↓
7. External app posts message to parent window
   ↓
8. Parent processes redirect data
   ↓
9. Credentials saved to store and (optionally) config
```

### Protected Branch with Variables

```
1. OAuth flow completes
   ↓
2. Credentials ID created and stored
   ↓
3. saveCredentialsIntoVariable() called
   ↓
4. Variable created in vault with:
   - key: 'oauth_<component>_<configId>_<seq>'
   - value: credentials ID
   - attributes: { branchId, componentId, configId }
   - flags: ['oauthCredentialsId']
   ↓
5. Configuration saved with:
   - authorization.oauth_api.id = 'var:oauth_...'
   ↓
6. On credential retrieval:
   - parseCredentialsId() resolves variable
   - Returns actual credentials ID
```

## Credential Lifecycle

### Creation
1. User initiates authorization
2. Credentials ID generated (component-config-branch-uuid)
3. OAuth popup or direct token flow
4. Credentials stored in OAuth service
5. Optionally saved as variable in vault (protected branch)
6. Configuration updated with credential reference

### Usage
1. Load configuration with credential reference
2. Parse credential ID (resolve variables if needed)
3. Load credentials from OAuth store
4. Use credentials for API calls

### Reset/Deletion
1. User clicks reset authorization
2. Delete credentials API called
3. Configuration updated (remove authorization)
4. Variable deleted if exists (protected branch)
5. Configuration re-saved

## State Management Architecture

**Flux Stores**:
1. **OauthV2Store**: Credentials by component and ID
2. **VariablesStore**: Variable references to credentials
3. **ApplicationStore**: Branch context (dev/production)

**Action Flow**:
```
React Component
  ↓
AuthorizationForm (popup handling)
  ↓
OauthActions.postCredentials()
  ↓
OauthApi.postCredentials()
  ↓
Dispatcher
  ↓
OauthStore (update credentials)
  ↓
React Component (re-render)
```

## Branch-Aware Credential Management

**Project-Wide Credentials**:
- Stored at project level
- Accessible from any branch
- Visible in production branch

**Branch-Specific Credentials**:
- Stored per dev branch
- Only accessible in specific branch
- Used when protected branch has variables enabled

**Protected Branch Integration**:
- Credentials stored as variables
- Variables scoped to branch
- Automatic resolution on load

## Data Types & Interfaces

### Credential Object

```typescript
Credential: {
  id: string  // Credentials ID
  componentId: string
  created: ISO timestamp
  creator: {
    description: string  // Email of authorizer
    features: string[]
  }
  authorizedFor: string  // Account identifier (email, etc.)
  version: number  # Always 3 for OAuth v2
  branchId?: string  # For branch-specific credentials
}
```

### Credential Store Structure

```typescript
Store: {
  credentials: {
    [componentId]: {
      [credentialsId]: Credential
    }
  }
  credentialsByBranchScope: {
    projectWide: { [credentialsId]: Credential }
    production: { [credentialsId]: Credential }
    current: { [credentialsId]: Credential }
  }
}
```

## Common Patterns

### 1. Initialize OAuth Authorization

```typescript
<AuthorizationForm
  authorizedFor="user@example.com"
  componentId="keboola.ex-google-analytics"
  configId="config-123"
  branchId={currentBranchId}
  onComplete={(credentials) => {
    // Credentials saved to config automatically
    // Reload configuration
    loadComponentConfigData(componentId, configId)
  }}
>
  <GoogleAuthorizeButton />
</AuthorizationForm>
```

### 2. Load and Display Credentials

```typescript
// 1. Load credentials
OauthActions.loadCredentials(componentId, credentialsId)

// 2. Get from store
const credentials = OauthStore.getCredentialsById(componentId, credentialsId)

// 3. Display in UI
<AuthorizedBox
  credentials={credentials}
  admins={admins}
  onReset={() => {
    return OauthActions.deleteCredentials(componentId, credentialsId)
      .then(() => {
        // Remove from configuration
        deleteCredentialsAndConfigAuth(componentId, configId)
      })
  }}
/>
```

### 3. Reset Authorization

```typescript
// 1. Delete credentials
OauthActions.deleteCredentials(componentId, credentialsId)

// 2. Remove from configuration
const newConfig = configData.delete('authorization')

// 3. Delete variable if exists
if (isVariableName(credentialsId)) {
  vaultActions.deleteVariable(variable)
}

// 4. Save configuration
InstalledComponentsActionCreators.saveComponentConfigData(
  componentId,
  configId,
  newConfig,
  'Reset authorization'
)
```

### 4. Handle Protected Branch Credentials

```typescript
// Automatic in processRedirectData:

// 1. Check if protected branch
if (ApplicationStore.hasProtectedDefaultBranch()) {
  // 2. Save to variable
  saveCredentialsIntoVariable(componentId, configId, branchId, credentialsId)
    .then((variableReference) => {
      // 3. Use variable in config
      const config = configuration.setIn(
        ['authorization', 'oauth_api', 'id'],
        variableReference
      )
    })
}
```

## Security Considerations

**Token Security**:
- Tokens stored in OAuth service, not Keboola API
- Credentials ID references token, not token itself
- Never logged in raw form
- Can be revoked per credential

**Branch Isolation**:
- Dev branch credentials only accessible in dev branch
- Production branch credentials always accessible
- Variables provide additional scoping for protected branches

**Authorization Lifecycle**:
- User account revocation handled server-side
- Token expiration managed by OAuth service
- Credentials can be reset at any time
- No persistent local storage of tokens

## Performance Optimization

**Caching**:
- Credentials loaded and cached in store
- Cached per component and credential ID
- Force reload available if needed

**Lazy Loading**:
- Credentials loaded on-demand
- All credentials loaded once at project startup
- Branch-specific credentials loaded per branch context

**Variable Resolution**:
- Variable parsing done at render time
- Cached after first resolution
- Minimal performance impact

## Error Handling

**Service Unavailability**:
```javascript
// Graceful degradation when OAuth service down
handleLoadErrors(error) {
  if (error?.response?.statusCode === 404 || error?.crossDomain) {
    return;  // Silently ignore
  }
  throw error;
}
```

**Authorization Failures**:
- OAuth service error messages surfaced to user
- Invalid token rejection handled
- Automatic retry on transient failures

**Variable Resolution Failures**:
- Falls back to literal credential ID
- Error notification to user
- Manual correction available

## Testing

**Key Test Files**:
- `helpers.test.ts`: Helper function tests

**Test Patterns**:
- Mock OAuth API responses
- Simulate window post-message events
- Variable resolution mocking
- Immutable store operations

## Troubleshooting

**Common Issues**:

1. **OAuth popup blocked**:
   - Browser popup blocker active
   - Check browser console for errors
   - Verify popup configuration

2. **Authorization not saving**:
   - Check configuration has write permissions
   - Verify OAuth service responding
   - Check dev branch vs production context

3. **Credentials not loading**:
   - Force reload with `loadCredentialsForce()`
   - Check credential ID format
   - Verify variable references if using protected branch

4. **Variables not resolving**:
   - Check vault integration
   - Verify variable exists
   - Check branch scope matching

## Related Modules

- **components**: Configuration management
- **vault**: Variable storage for protected branches
- **services**: OAuth service endpoint management

## Future Directions

- Support for more OAuth providers (Microsoft, GitHub, etc.)
- OAuth token refresh handling
- Multiple authorizations per component
- Authorization sharing across configurations
- Advanced audit logging for authorization changes
