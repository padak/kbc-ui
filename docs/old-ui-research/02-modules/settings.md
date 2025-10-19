# Module: Settings

## Overview

The settings module provides comprehensive project administration and configuration interfaces for Keboola Connection. It allows users to manage project details, team members, API tokens, CLI synchronization, feature toggles, AI description rules, and MCP (Model Context Protocol) server integration. The module uses a tabbed interface for navigation and manages complex hierarchical data structures including organizations, users, features, and integration configurations.

## File Structure

```
settings/
├── routes.js                           # Route definitions and lazy-loaded components
├── actions.js                          # Flux action creators for data loading
├── SettingsStore.js                    # Flux store for settings data
├── manageApi.js                        # API client for manage API
├── constants.ts                        # Action types and route names
├── helpers.ts                          # Utility functions
├── CliSync.jsx                         # CLI synchronization page
├── Project.jsx                         # Project settings page
├── Users.jsx                           # User management page
├── Tokens.tsx                          # Token management page
├── components/
│   ├── SettingsTabs.tsx               # Tab navigation component
│   ├── ProjectDetails.tsx              # Project info and details
│   ├── UpdateProjectButton.tsx         # Project update UI
│   ├── UpdateProjectModal.tsx          # Project update modal
│   ├── DeleteProject.tsx               # Project deletion UI
│   ├── StorageBackend.tsx              # Storage configuration display
│   ├── UpdateStorageButton.tsx         # Storage update UI
│   ├── UpdateStorageModal.tsx          # Storage update modal
│   ├── ChangeOrganizationButton.tsx    # Organization change UI
│   ├── ChangeOrganizationModal.tsx     # Organization selection modal
│   ├── DataTakeout.tsx                 # Data export functionality
│   ├── DataPersistency.tsx             # Data persistence settings
│   ├── InviteUserHeaderButton.tsx      # User invitation UI
│   └── TerminalWithKbcInit.tsx         # CLI terminal display
├── FeaturesTab/
│   ├── index.ts                        # Export
│   └── FeaturesTab.tsx                 # Feature management UI
├── AiRulesTab/
│   ├── index.ts                        # Export
│   ├── helpers.ts                      # AI rule utilities
│   ├── helpers.test.ts                 # Tests for AI helpers
│   ├── AiRulesTab.tsx                  # AI rules editor
│   └── components/
│       ├── index.ts                    # Export
│       ├── ComponentsRules.tsx         # Per-component rules
│       ├── RuleEditor.tsx              # Rule editing interface
│       └── ComponentRule.tsx           # Individual rule display
└── McpServerTab/
    ├── Detail.tsx                      # Main MCP server page
    ├── Header.tsx                      # MCP header with actions
    ├── helpers.ts                      # MCP utilities
    ├── tools.ts                        # MCP tools configuration
    └── components/
        ├── Intro.tsx                   # MCP introduction
        ├── TabHeader.tsx               # Tab styling component
        ├── LoginToKeboola.tsx          # Authentication flow
        ├── IntroVideo.tsx              # Video introduction
        ├── ClaudeRemote.tsx            # Claude.ai setup
        ├── ClaudeDesktop.tsx           # Claude Desktop setup
        ├── ChatGpt.tsx                 # ChatGPT setup
        ├── Cursor.tsx                  # Cursor IDE setup
        ├── Make.tsx                    # Make.com setup
        ├── Windsurf.tsx                # Windsurf setup
        ├── Other.tsx                   # Other tools
        ├── Editor.tsx                  # Code/config editor
        ├── List.tsx                    # MCP servers list
        ├── Tools.tsx                   # Available tools
        ├── Instruction.tsx             # Instructions display
        ├── IntegrationUrl.tsx          # Integration URL display
        ├── InstallNode.tsx             # Node.js installation
        ├── McpJson.tsx                 # MCP JSON config
        ├── PromoWidget.tsx             # Promotional widget
        └── ClaudeRemote.tsx            # Claude remote integration
```

## Routes

| Path | Name | Component | Description |
|------|------|-----------|-------------|
| `settings` | `project-settings` | `Project.jsx` | Main project settings overview |
| `settings/users` | `users-settings` | `Users.jsx` | User management and invitations |
| `settings/tokens` | `tokens-settings` | `Tokens.tsx` | API token management |
| `settings/tokens/new-token` | `tokens-settings-new` | `NewToken` | Create new API token |
| `settings/tokens/:tokenId` | `tokens-settings-detail` | `Detail` | View/edit specific token |
| `settings/cli` | `cli-settings` | `CliSync.jsx` | CLI synchronization setup |
| `settings/features` | `features` | `FeaturesTab.tsx` | Feature toggles management |
| `settings/ai-rules` | `ai-rules` | `AiRulesTab.tsx` | AI description rules |
| `settings/mcp-server` | `mcp-server` | `Detail.tsx` (McpServerTab) | MCP server integration |

## Key Components

### SettingsTabs
- **Location**: `components/SettingsTabs.tsx`
- **Purpose**: Tab navigation wrapper for all settings pages
- **Props**: `children: ReactNode`
- **State**: Uses feature flags to show/hide tabs based on:
  - Protected default branch (hides CLI)
  - AI allowed feature (shows AI Rules)
  - MCP page availability (shows MCP Server)
- **Key Features**: Clears "new user" flag on mount

### Project Settings
- **Location**: `Project.jsx`
- **Purpose**: Displays and manages project information
- **Components Rendered**:
  - `ProjectDetails` - Name, description, organization
  - `StorageBackend` - Backend type and configuration
  - `DataTakeout` - Data export/takeout
  - `DataPersistency` - Persistent storage settings
  - `DeleteProject` - Project deletion interface
- **State**: Pulls from SettingsStore (project, user, organizations)
- **Permissions**: Uses privilege functions for visibility control

### Users Management
- **Location**: `Users.jsx`
- **Purpose**: Manage project team members
- **Displays**:
  - Active users with roles (Admin, Guest, Read-only, etc.)
  - Join requests from pending members
  - Pending invitations
  - User status (MFA enabled, joined date, expiration)
- **Features**:
  - Approve/reject join requests
  - Invite new users
  - Revoke access
  - Cancel invitations
  - Track "invited by" information
- **States**: Tracks deleting/approving/rejecting states per user

### Tokens Management
- **Location**: `Tokens.tsx`
- **Purpose**: API token management
- **Features**:
  - Display all project tokens
  - Create new tokens
  - View token details with permission scopes
  - Delete tokens
  - Refresh token secrets
  - Send tokens to email
- **Integration**: Uses tokens module components and stores

### CLI Sync
- **Location**: `CliSync.jsx`
- **Purpose**: CLI tool synchronization and local development
- **Features**: Instructions for setting up KBC CLI

### FeaturesTab
- **Location**: `FeaturesTab/FeaturesTab.tsx`
- **Purpose**: Toggle project features
- **Features**: Manage which optional features are enabled for the project

### AiRulesTab
- **Location**: `AiRulesTab/AiRulesTab.tsx`
- **Purpose**: Configure AI-generated descriptions for components
- **Features**:
  - Global default instructions
  - Per-component custom rules
  - Rule editing with preview
  - Metadata persistence
- **State**: Uses DevBranchesStore for metadata

### McpServerTab
- **Location**: `McpServerTab/Detail.tsx`
- **Purpose**: MCP (Model Context Protocol) server integration
- **Features**:
  - Integration instructions for various tools:
    - Claude.ai (remote)
    - Claude Desktop
    - ChatGPT
    - Cursor IDE
    - Make.com
    - Windsurf
  - Configuration guides
  - Available MCP tools documentation
  - Integration URL management
- **State**: Manages active tab selection

## API Endpoints

### Session & Authentication

| Method | Endpoint | Purpose | Response |
|--------|----------|---------|----------|
| POST | `/manage/projects/{projectId}/session-token` | Get session token | `{ token, user, admin }` |
| GET | `/manage/projects/{projectId}/verify-token` | Verify token validity | Status confirmation |

### Project Management

| Method | Endpoint | Purpose | Response |
|--------|----------|---------|----------|
| GET | `/manage/projects` | Get current project | Project details |
| PUT | `/manage/projects/{projectId}` | Update project details | Updated project |
| DELETE | `/manage/projects/{projectId}` | Delete project | Confirmation |
| PUT | `/manage/projects/{projectId}/storage` | Update storage backend | Updated storage config |
| GET | `/manage/organizations` | List accessible organizations | Organizations list |
| GET | `/manage/maintainers` | List maintainers | Maintainers list |
| GET | `/manage/maintainers/{id}/organizations` | Get maintainer's orgs | Organizations list |
| PUT | `/manage/projects/{projectId}/organization/{orgId}` | Change organization | Confirmation |

### User Management

| Method | Endpoint | Purpose | Response |
|--------|----------|---------|----------|
| GET | `/manage/projects/{projectId}/users` | List project users | Users, invitations, join requests |
| POST | `/manage/projects/{projectId}/users` | Invite user | Confirmation |
| DELETE | `/manage/projects/{projectId}/users/{email}` | Remove user | Confirmation |
| PATCH | `/manage/projects/{projectId}/join-requests/{id}` | Approve/reject join | Confirmation |
| DELETE | `/manage/projects/{projectId}/invitations/{id}` | Cancel invitation | Confirmation |

### Features

| Method | Endpoint | Purpose | Response |
|--------|----------|---------|----------|
| GET | `/manage/projects/{projectId}/features` | Get project features | Features list |

## State Management

- **Pattern Used**: Flux with Immutable.js (legacy pattern)
- **Key Store**: `SettingsStore.js`
- **Store State**:
  ```typescript
  {
    project: Map,                          // Current project details
    token: Map,                            // Session token with user info
    organizationsViaMaintainer: Map,       // Orgs grouped by maintainer
    organizations: List,                   // Accessible organizations
    users: List,                           // Project members
    joinRequests: List,                    // Pending join requests
    invitations: List,                     // Sent invitations
    features: List,                        // Project features
  }
  ```

## Data Flow

1. **Route Loading** - `requireData` in routes.js triggers:
   - `generateSessionToken()` - Creates/verifies session token
   - `loadProject()` - Fetches project details
   - `loadOrganizationsViaMaintainer()` - Gets org hierarchy
   - `loadOrganizations()` - Gets accessible orgs
   - `loadFeatures()` - Gets feature list
   - `loadUsers()` - Gets team members and requests

2. **Action Creators** - Actions in `actions.js`:
   - Check if data already loaded (from SettingsStore)
   - If not, call API via `manageApi.js`
   - Dispatch Flux actions with response data

3. **Store Updates** - SettingsStore registers dispatcher:
   - Receives action payload
   - Updates internal state
   - Emits change event

4. **Component Updates** - React components:
   - Use `createStoreMixin` to subscribe to changes
   - Call store getter methods in `getStateFromStores()`
   - Re-render when state changes

## Session Token Polling

- **Interval**: Continuously polled to maintain session
- **Handler**: `sessionTokenPoller` defined in routes.js
- **Behavior**: 
  - Calls `generateSessionToken()` with retry logic
  - Handles session expiration (302 redirect to login)
  - Allows user to work without re-login

## Key Features & Workflows

### Project Management Workflow
1. View project name, ID, description
2. Update project details (name, description)
3. Change storage backend (if permitted)
4. Change project organization (if maintainer/super-admin)
5. Export project data (data takeout)
6. Delete project

### User Management Workflow
1. View all team members and their roles
2. See join requests from pending members
3. Approve/reject join requests
4. Invite new users by email
5. View invitation status
6. Remove users from project
7. Track MFA status and join dates

### Token Management Workflow
1. List all project API tokens
2. Create new token with scope selection
3. View token details and restrictions
4. Refresh token secret (rotate credentials)
5. Send token to user via email
6. Delete token

### AI Rules Configuration
1. Set global default instructions for AI
2. Create component-specific overrides
3. Edit and preview rules
4. Save rules to project metadata
5. Rules used for auto-description generation

### MCP Server Integration Workflow
1. View integration URL for MCP server
2. Select target tool (Claude.ai, ChatGPT, etc.)
3. Copy integration configuration
4. Follow installation instructions
5. View available MCP tools documentation

## Dependencies

### Internal
- `@/modules/admin/privileges` - Permission checking
- `@/modules/components/MetadataActionCreators` - Metadata management
- `@/modules/components/StorageActionCreators` - Storage operations
- `@/modules/dev-branches/DevBranchesStore` - Dev branch state
- `@/modules/tokens` - Token module components
- `@/modules/stack-features/Store` - Feature flags
- `@/stores/ApplicationStore` - Global app state

### External
- `react` - UI components
- `immutable` - Data structures
- `@keboola/design` - Design system components
- `@keboola/api-client` - API client types

## Notable Patterns

### 1. Session Token Polling Pattern

Sessions are kept alive by polling `/manage/projects/{projectId}/session-token`. The application tracks token changes and handles 302 redirects that indicate expired sessions.

### 2. Hierarchical Organization Loading

The module loads organizations in two ways:
- Direct user organizations (`organizations`)
- Organizations user maintains (`organizationsViaMaintainer`)

This allows super-admins to manage projects across multiple organizations.

### 3. Feature-Based Route Hiding

Routes use feature flags to conditionally show tabs:
```typescript
if (tab.routeName === routeNames.AI_RULES && !StackFeaturesStore.hasAllowedAi()) {
  return false; // Hide tab
}
```

### 4. Lazy-Loaded Routes

All settings pages use dynamic imports for code splitting:
```typescript
lazy: async () => {
  const Project = await import('./Project');
  return { Component: Project.default };
}
```

### 5. Data Deduplication

Actions check if data is already loaded before making API calls:
```typescript
if (SettingsStore.isProjectLoaded()) {
  return Promise.resolve(); // Skip API call
}
```

### 6. Modal-Based Updates

Complex operations (update project, change organization, etc.) use modal dialogs rather than inline forms to prevent accidental changes.

## User-Facing Features

1. **Project Settings** - View and modify project metadata
2. **Team Management** - Invite, manage, and remove team members
3. **API Tokens** - Create and manage API access tokens
4. **Storage Backend** - Configure storage systems (Snowflake, BigQuery, Redshift)
5. **Organization Management** - Move projects between organizations
6. **Data Management** - Export project data (data takeout)
7. **Feature Toggles** - Enable/disable experimental features
8. **AI Configuration** - Set up AI description generation rules
9. **MCP Integration** - Integrate project with Claude, ChatGPT, etc.
10. **CLI Sync** - Configure local CLI synchronization

## Technical Debt & Observations

### 1. Mixed Flux and React Patterns

Settings uses legacy Flux architecture alongside newer React patterns. Some components use:
- Old-style class components with `createReactClass`
- Store mixins for data subscription
- New-style functional components with hooks

This inconsistency could be modernized.

### 2. Session Token Coupling

The session token is tightly coupled to settings operations. If the session expires during an operation, the user loses their session across the entire application.

### 3. Complex Privilege Logic in Components

Many components directly import and call privilege functions. This could be abstracted into a custom hook or permission provider.

### 4. Immutable.js Data Structures

The store uses Immutable.js Maps extensively. Modern alternatives like TypeScript interfaces would be more maintainable.

### 5. API Client Design

The `manageApi.js` file creates request promises directly rather than using the modern `@keboola/api-client` package. This should be refactored for consistency.

### 6. Metadata Storage for AI Rules

AI rules are stored in project metadata via DevBranchesStore. This works but creates coupling between the settings module and metadata systems.

### 7. MCP Server Configuration Complexity

The MCP server tab has many sub-components for different tools. This could benefit from a more templated approach.

## Testing

The module includes tests for:
- AI rule helpers (`AiRulesTab/helpers.test.ts`)
- Privilege checking integration
- Component rendering with various permission levels

## Future Improvements

1. Migrate from Flux to TanStack Query for data fetching
2. Modernize class components to functional components with hooks
3. Refactor privilege checks into a permission context
4. Replace Immutable.js with TypeScript interfaces
5. Extract API calls to centralized API client
6. Simplify MCP configuration with template system
7. Add more comprehensive error handling and user feedback

