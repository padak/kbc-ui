# Module: Admin

## Overview

The admin module is a utility module that provides privilege and permission management functions for the Keboola Connection application. It serves as the central place for implementing role-based access control (RBAC) logic, determining what actions users can perform based on their role, token permissions, and project/organization settings. Unlike other modules, admin doesn't have dedicated routes or components—it's a pure utility module accessed throughout the application.

## File Structure

```
admin/
├── api.js                    # API endpoints for billing and admin operations
├── constants.js              # Action type constants for Flux
├── privileges.ts             # Core privilege checking functions
└── privileges.test.ts        # Unit tests for privilege functions
```

## Routes

This module does not define routes. It's purely a utility module consumed by other modules for permission checks.

## Key Components

Admin is not a traditional module with components. Instead, it provides utility functions through the `privileges.ts` file.

### Privileges Export
- **Location**: `privileges.ts`
- **Purpose**: Centralized authority for determining user capabilities based on token role and application state
- **Pattern**: Pure functions that take Immutable.js Map objects and return boolean values
- **Key Dependencies**: ApplicationStore, DevBranchesStore, ComponentsStore

## API Endpoints

| Method | Endpoint | Purpose | Response Type |
|--------|----------|---------|---------------|
| GET | `/pay-as-you-go/billing/credits` | Get purchase history | Array of purchases |
| GET | `/pay-as-you-go/billing/configuration` | Get PAYG billing config | Billing configuration |
| GET | `/pay-as-you-go/billing/stripe-customer` | Get Stripe customer info | Customer data |
| GET | `/pay-as-you-go/billing/top-up/{projectId}` | Get top-up settings | Top-up configuration |
| PUT | `/pay-as-you-go/billing/stripe-customer` | Update Stripe customer | Updated customer data |
| PUT | `/pay-as-you-go/billing/top-up` | Update top-up settings | Updated settings |
| POST | `/pay-as-you-go/billing/create-payment-request` | Create payment request | Payment request ID |
| POST | `/admin/account/session-token` | Generate admin session token | Admin token |

## State Management

- **Pattern Used**: No state management - pure utility functions
- **Key Exports**: 40+ privilege checking functions
- **Data Flow**: Unidirectional - functions read from stores but don't modify them

## Core Privilege Functions

### Role-Based Functions

```typescript
isAdminOrShare(token: Map<string, any>) -> boolean
isProductionManager(token: Map<string, any>) -> boolean
isDeveloperOrReviewer(token: Map<string, any>) -> boolean
isProductionManagerInProduction(token: Map<string, any>) -> boolean
```

### Project & Organization Management

```typescript
canChangeProjectOrganization(user, organizationsViaMaintainer, project) -> boolean
hasAccessToProjectOrganization(user, organizations, organizationsViaMaintainer, project) -> boolean
canDeleteProject(user, token, organizationsViaMaintainer, project) -> boolean
canAccessProject(projectId) -> boolean
```

### Job & Configuration Execution

```typescript
canRunJob(token) -> boolean
canRunConfigDataJob(token) -> boolean
canResetState(token, component, settings) -> boolean
```

### User Management

```typescript
canManageUsers(token) -> boolean
canManageNotifications(token) -> boolean
```

### Storage & Bucket Management

```typescript
canManageBuckets(token) -> boolean
canLoadSharedBuckets(token) -> boolean
canManageExternalBuckets(token) -> boolean
canManageSharedBucket(token) -> boolean
canManageBucket(token, bucket) -> boolean
canWriteBucket(token, bucket) -> boolean
canManageTokenRestrictions(token) -> boolean
canLinkBucket(token) -> boolean
canUnlinkBucket(token, bucket) -> boolean
isExternalBucket(bucket) -> boolean
isLinkedBucket(bucket) -> boolean
isSharingAvailable(token) -> boolean
```

### Development Branch & Version Control

```typescript
canManageDevBranch(token) -> boolean
canDeleteDevBranch(token) -> boolean
canManageSchedule(token) -> boolean
canManageTriggers(token, schedule) -> boolean
canActivateSchedule(token) -> boolean
canApproveDevBranchReview(token, admin, mergeRequest) -> boolean
```

### Token Management

```typescript
canManageTokens(token) -> boolean
canCreateToken(token) -> boolean
```

### Data & Export

```typescript
canExportTable(token) -> boolean
canDownloadSlicedFile(token) -> boolean
canCreateAliasTable(token, bucket) -> boolean
canPullTable(table) -> boolean
canPurgeTrash(token) -> boolean
```

### Features & Configuration

```typescript
canManageVariables(token) -> boolean
canManageVariable(token, variable) -> boolean
canManageProjectFeatures(token) -> boolean
canCreateExternalAuthorization(token) -> boolean
canManageReadOnlyStorageForProvisionedCredentials(driver) -> boolean
```

## Authorization Patterns

### 1. Protected Default Branch Pattern

When a project has a protected default branch, the privilege model shifts:

```typescript
// In production (protected branch)
if (ApplicationStore.hasProtectedDefaultBranch()) {
  return isProductionManager(token);
}
// In dev branches
if (DevBranchesStore.isDevModeActive()) {
  return isDeveloperOrReviewer(token);
}
```

### 2. Read-Only Check Pattern

Most write operations check if the application is read-only:

```typescript
if (!ApplicationStore.isReadOnly()) {
  // Allow operation
}
```

### 3. Organization Member Pattern

Organization members have elevated permissions:

```typescript
if (token.getIn(['admin', 'isOrganizationMember'], false)) {
  // Allow organization-level operations
}
```

### 4. Device Branch Mode Pattern

Dev mode has different permissions than production:

```typescript
if (!DevBranchesStore.isDevModeActive() && ApplicationStore.hasProtectedDefaultBranch()) {
  return isProductionManager(token);
}
```

## ADMIN_ROLES

The module uses predefined admin roles from constants:

- **ADMIN**: Full project control
- **SHARE**: Sharing and collaboration permissions
- **PRODUCTION_MANAGER**: Controls production workflows
- **DEVELOPER**: Development branch access
- **REVIEWER**: Review and approval of changes
- **GUEST**: Limited read-only access
- **READ_ONLY**: No write permissions

## Dependencies

### Internal
- `ApplicationStore` - Current project and organization state
- `DevBranchesStore` - Development branch and dev mode state
- `ComponentsStore` - Installed components information
- Admin role constants

### External
- `immutable` - Map and List data structures

## Notable Patterns

### 1. Conditional Permission Based on Application State

Privileges change based on project features:
- Protected default branch changes to production manager model
- Dev branches activate different permission sets
- PAYG and demo preview projects have restrictions

### 2. Feature-Based Access Control

```typescript
canManageExternalBuckets(token) {
  if (!ApplicationStore.hasExternalBuckets()) {
    return false; // Feature not available
  }
  // ... role checks
}
```

### 3. Token Restriction for Production Managers

```typescript
canManageTokenRestrictions(token) {
  return !isProductionManager(token); // Restricted role cannot manage restrictions
}
```

### 4. Cascade of Permission Checks

Some functions combine multiple checks:

```typescript
canDeleteProject(user, token, organizationsViaMaintainer, project) {
  if (canChangeProjectOrganization(user, organizationsViaMaintainer, project)) 
    return true;
  if (ApplicationStore.hasProtectedDefaultBranch()) 
    return isProductionManager(token);
  return isAdminOrShare(token);
}
```

## User-Facing Features

Users don't directly interact with the admin module. Instead, the application uses these privilege functions to:

1. **Enable/disable UI elements** - Buttons, menus hidden if user lacks permissions
2. **Control API calls** - Requests fail if user lacks permissions
3. **Manage role-based workflows** - Different UI flows for different roles
4. **Enforce organization policies** - Protected branches, SAML roles, etc.

## Technical Debt & Observations

### 1. Legacy Immutable.js Usage

The module extensively uses Immutable.js Maps and Lists. Modern patterns would use TypeScript types more directly. However, this is consistent with the broader application architecture.

### 2. Multiple Levels of State Dependencies

Functions check ApplicationStore, DevBranchesStore, and other global stores. This creates implicit dependencies that could be made more explicit.

### 3. Complex Conditional Logic

Some privilege functions have deeply nested conditionals based on multiple feature flags and project states. This could benefit from a more declarative RBAC system.

### 4. No Caching

Privilege functions perform checks each time they're called. With high-frequency calls from React components, memoization could improve performance.

### 5. Billing API Integration

The `api.js` file contains billing-specific endpoints that seem tangentially related to core admin functionality. These could potentially be separated into a billing-specific module.

### 6. Session Token Generation

The `createAdminAccountSessionToken` function handles PHP session redirects (302 Found), suggesting tight coupling with legacy backend authentication systems.

## Testing

The module includes `privileges.test.ts` for unit testing privilege functions. Tests likely verify:

- Role-based access control logic
- Protected branch mode transitions
- Feature flag interactions
- Organization member access

## Integration Points

Admin privileges are consumed by:

- **Components Module** - Determining if users can create/edit configurations
- **Storage Module** - Bucket and table management permissions
- **Billing Module** - Payment and subscription management
- **Settings Module** - User and project management
- **Dev Branches** - Branch creation and merge approval
- **Tokens Module** - Token creation and management
- **Flows Module** - Workflow execution permissions

