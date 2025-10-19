# Module: ex-email-attachments

## Overview

The `ex-email-attachments` module provides functionality for extracting and importing email attachments. It connects to email accounts (primarily via cloud storage services) to retrieve file attachments and import them into storage.

This is a specialized extractor for email-based workflows, useful for automating data collection from email attachments (invoices, reports, datasets, etc.).

## File Structure

```
ex-email-attachments/
├── routes.js                                    # Route configuration
├── react/
│   ├── Index.jsx                               # Main configuration UI
│   └── components/
│       └── Configuration.jsx                   # Email attachment settings
├── storeProvisioning.js                        # Store configuration
└── actionsProvisioning.js                      # Actions configuration
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/keboola.ex-email-attachments/:config` | Index | Main configuration interface |

## Key Concepts

### Single-Level Configuration

Unlike ex-http and ex-storage with multiple configuration levels, ex-email-attachments uses a simpler single configuration per component instance.

### Lazy Route Loading

The route uses async lazy loading:

```typescript
lazy: async () => {
  const Index = await import('./react/Index');
  return { Component: Index.default };
}
```

This pattern is consistent with other components and allows code splitting.

### Required Data

The route includes data requirements:

```typescript
requireData: [(params) => configRequiredData(componentId, params.config)]
```

This ensures configuration data is loaded before rendering.

## Architecture Patterns

### Store Provisioning

**Location**: `storeProvisioning.js`
**Purpose**: Configure the Flux store for this component

Uses the store provisioning pattern to set up:
- Initial state
- Store registration
- Data listeners

### Actions Provisioning

**Location**: `actionsProvisioning.js`
**Purpose**: Configure actions for updating email attachment configuration

Provides action creators for:
- Configuration updates
- Email account connection
- Attachment selection/filtering

## Store Configuration

The module uses the Flux pattern (consistent with legacy components):

1. **Store Registration**: Component registers its data store
2. **Action Listeners**: Store listens for configuration changes
3. **Initial State**: Configuration loaded on component mount

### Configuration State

```typescript
{
  // Email account configuration
  accountId: string              // Connected email account ID
  accountType: string            // 'gmail', 'outlook', etc.
  
  // Filtering options
  fromDate?: string              // Email date filter (from)
  toDate?: string                // Email date filter (to)
  senderFilter?: string          // Filter by sender email
  subjectFilter?: string         // Filter by subject
  
  // Attachment options
  attachmentTypes?: string[]      // File types to import (.pdf, .xlsx, etc.)
  
  // Output configuration
  outputBucket: string           // Destination storage bucket
  outputFolder: string           // Folder within bucket
}
```

## User Interface

The component provides a UI (Index.jsx) for:

1. **Email Account Selection**:
   - OAuth connection to Gmail/Outlook
   - Account management

2. **Email Filtering**:
   - Date range selection
   - Sender/subject filtering
   - Search options

3. **Attachment Settings**:
   - File type filtering
   - Naming conventions
   - Deduplication options

4. **Output Configuration**:
   - Destination bucket
   - Folder structure
   - File organization

## Generic Component Integration

The module integrates with generic components infrastructure:

```typescript
import { genericComponentTitle } from '@/utils/genericComponentTitle';
import { configPoll } from '@/utils/genericPolls';
import { configRequiredData } from '@/utils/genericRequiredData';

// Uses standard utilities for:
// - Component titles
// - Configuration polling
// - Data requirements
```

This allows consistent behavior with other components.

## Polling and Data Management

### Configuration Polling

```typescript
poll: configPoll(componentId)
```

Automatically polls for configuration changes:
- Detects when configuration is modified
- Updates component state
- Refreshes UI

### Data Requirements

```typescript
requireData: [(params) => configRequiredData(componentId, params.config)]
```

Ensures all required data is available:
- Configuration loaded
- Component metadata available
- Related data fetched

## OAuth Integration

The module likely integrates with OAuth for email account connection:

1. **OAuth Flow**: User authorizes email access
2. **Token Storage**: OAuth token stored securely
3. **Account Management**: Add/remove email accounts
4. **Scope Handling**: Requests appropriate email/attachment scopes

## Notable Patterns

### 1. Lazy Component Loading

```typescript
lazy: async () => {
  const Index = await import('./react/Index');
  return { Component: Index.default };
}
```

Enables code splitting for better performance.

### 2. Configuration Provisioning

Separates concerns using provisioning modules:
- `storeProvisioning.js`: Store setup
- `actionsProvisioning.js`: Action setup

This pattern makes it easier to test and modify the configuration.

### 3. Generic Component Utilities

Uses shared utilities for common patterns:
- Title generation
- Data polling
- Data requirements

Ensures consistency with other components.

## User-Facing Features

### Feature 1: Email Account Connection

**Description**: Securely connect to Gmail, Outlook, or other email providers

**Workflow**:
1. Click "Connect Email Account"
2. Authorize OAuth access
3. Account added to configuration
4. Can manage multiple accounts

**Components**: Index (OAuth integration)

### Feature 2: Email Filtering

**Description**: Filter emails by date, sender, subject

**Workflow**:
1. Set date range (from/to)
2. Optionally filter by sender email
3. Optionally filter by subject keywords
4. Only matching emails processed

**Components**: Configuration (filter UI)

### Feature 3: Attachment Type Selection

**Description**: Select which file types to import

**Workflow**:
1. Specify attachment types (.pdf, .xlsx, .csv, etc.)
2. Only matching attachments downloaded
3. Supports multiple types

**Components**: Configuration (attachment type selector)

### Feature 4: Output Organization

**Description**: Configure how attachments are stored

**Workflow**:
1. Select destination bucket
2. Configure folder structure
3. Set naming conventions
4. Enable deduplication if needed

**Components**: Configuration (output settings)

## Dependencies

### Internal Modules

- `modules/configurations`: Configuration management
- `modules/components`: Component store and utilities
- `utils/genericComponentTitle`: Standard component titles
- `utils/genericPolls`: Configuration polling
- `utils/genericRequiredData`: Data requirements

### External Packages

- React (for UI)
- OAuth libraries (for email provider integration)
- Immutable.js (for state management)

### Email Providers

- Gmail API (for Gmail support)
- Microsoft Graph API (for Outlook support)
- Potentially others (IMAP, Exchange, etc.)

## Related Modules

- **ex-generic**: Flexible API connector (more general)
- **ex-http**: File downloader (similar file import concept)
- **ex-storage**: Cross-project extractor
- **configurations**: Core configuration infrastructure

## Technical Debt & Observations

### Potential Areas

Based on the file structure, this module likely has:

1. **OAuth Setup**: Complex OAuth token management
2. **Email API Integration**: API calls to fetch emails/attachments
3. **File Storage**: Handling file uploads to Keboola storage
4. **Filtering Logic**: Complex email filtering

### Design Patterns

The module appears to follow:
- Flux for state management (like other legacy components)
- Provisioning pattern for configuration
- Generic component utilities for consistency

### Opportunities for Improvement

1. **Migration to Hooks**: Could modernize store pattern to React hooks
2. **Type Safety**: Adding TypeScript for better type checking
3. **Testing**: Comprehensive test coverage for OAuth flows
4. **Error Handling**: Robust error handling for email API failures

## Code Examples

### Route Configuration

```javascript
// From routes.js
export default {
  name: componentId,
  path: `${componentId}/:config`,
  title: genericComponentTitle(componentId),
  lazy: async () => {
    const Index = await import('./react/Index');
    return { Component: Index.default };
  },
  requireData: [(params) => configRequiredData(componentId, params.config)],
  poll: configPoll(componentId),
};
```

### Store Provisioning

```javascript
// From storeProvisioning.js
// Sets up Flux store:
// - Registers component store
// - Initializes configuration state
// - Sets up event listeners
```

### Actions Provisioning

```javascript
// From actionsProvisioning.js
// Provides action creators:
// - updateConfiguration()
// - connectEmailAccount()
// - disconnectEmailAccount()
// - saveFilterSettings()
```

## Testing Strategy

### Likely Test Areas

1. **OAuth Flows**: Testing authorization and token refresh
2. **Email Filtering**: Unit tests for filter logic
3. **Configuration**: Integration tests for configuration saving
4. **Store**: Tests for Flux store actions and listeners

### Testing Approach

- Unit tests for filtering logic
- Integration tests for OAuth flows
- Component tests for UI interactions
- Store tests for state management

## Conclusion

The ex-email-attachments module provides email-based data import functionality for Keboola. While the implementation details are limited by the file structure, the module follows established patterns:

1. **Generic Component Integration**: Uses shared utilities for consistency
2. **Flux Store Pattern**: Consistent with legacy components
3. **Provisioning Pattern**: Separates configuration concerns
4. **Lazy Loading**: Enables code splitting

The module demonstrates how to build a specialized extractor that integrates with external services (email providers) while maintaining consistency with the broader Keboola architecture.

Its main strength would be:
- Simplified email-to-storage workflows
- Secure OAuth integration
- Flexible filtering and formatting options
- Scheduled, recurring imports

The architecture allows easy extension for additional email providers or storage destinations.
