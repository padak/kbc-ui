# Module: Google Ads Extractor (ex-google-ads)

## Overview

The Google Ads Extractor (`ex-google-ads`) is a Keboola connector for extracting performance data from Google Ads accounts. The module enables users to:

- Authorize and manage Google Ads accounts
- Select specific customer accounts or account hierarchies
- Configure data extraction with custom date ranges
- Create and manage multiple extraction queries
- Support account hierarchies with parent and child accounts
- Filter extractions by enabled/disabled accounts
- Export reports as Keboola tables with customizable output settings

## File Structure

```
ex-google-ads/
├── routes.js
├── react/
│   └── components/
│       ├── AccountsSettings.jsx
│       ├── DataSource.jsx
│       └── SaveSettings.jsx
├── adapters/
│   ├── accountsSettings.js
│   ├── dataSource.js
│   ├── saveSettings.js
│   ├── actions.js
│   ├── conform.js
│   ├── tests.spec.def.js
│   └── tests.test.js
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/{componentId}/:config` | GenericConfigBody | Main configuration with accounts setup |
| `/{componentId}/:config/rows/:row` | ConfigurationRow | Individual data source and save settings |

## Key Components

### AccountsSettings
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-ads/react/components/AccountsSettings.jsx`
- **Purpose**: Account selection and hierarchy configuration at the configuration level
- **Props**:
  - `context: Map` - Configuration context with componentId
  - `value: object` - Current settings (customerId, onlyEnabledCustomers, getAccountChildren)
  - `actions: object` - Available actions including listAccounts
  - `onChange: function` - Update callback
  - `disabled: boolean` - Form disabled state
  - `readOnly: boolean` - Read-only mode
- **State**: None (controlled component)
- **Features**:
  - Multi-select account picker
  - Display child accounts in compact format
  - "Only enabled customers" toggle
  - "List individual subaccounts" toggle
  - Reload button to refresh available accounts
  - Async account loading with spinner

### AccountsSelect
- **Location**: Nested in AccountsSettings.jsx
- **Purpose**: Multi-select dropdown for Google Ads customer IDs
- **Features**:
  - Groups accounts with their child accounts
  - Display descriptive names and IDs
  - Custom option formatting
  - Loading and disabled states

### OnlyEnabledCustomersCheckbox
- **Location**: Exported from AccountsSettings.jsx
- **Purpose**: Checkbox to filter accounts by enabled status
- **Props**: value, onChange, isDisabled

### DataSource
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-ads/react/components/DataSource.jsx`
- **Purpose**: Configure query parameters for individual data source
- **Configuration**:
  - Query field (SQL or query configuration)
  - Date range (since/until with relative syntax like -1, now)

### SaveSettings
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-ads/react/components/SaveSettings.jsx`
- **Purpose**: Output table name and load options
- **Configuration**:
  - Output table name
  - Incremental loading options
  - Primary key specification

## Adapters

### accountsSettings
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-ads/adapters/accountsSettings.js`
- **Purpose**: Parse and serialize account configuration
- **Methods**:
  - `parseConfiguration(config)` - Extract account settings from saved config
  - `createConfiguration(localState)` - Create config from form state
  - `isComplete(config)` - Validate at least one account is selected
- **Structure**:
  ```javascript
  {
    customerId: ['123456789', '987654321'], // Array of customer IDs
    onlyEnabledCustomers: true,
    getAccountChildren: false
  }
  ```

### dataSource
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-ads/adapters/dataSource.js`
- **Purpose**: Parse and serialize query configuration
- **Methods**:
  - `parseConfiguration(config)` - Extract query parameters
  - `createConfiguration(localState)` - Create config from form state
- **Structure**:
  ```javascript
  {
    query: 'SELECT ...',
    since: '-1',      // Relative date (-N for N days ago)
    until: 'now'      // Relative or absolute date
  }
  ```

### saveSettings
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-ads/adapters/saveSettings.js`
- **Purpose**: Parse and serialize output table settings
- **Methods**:
  - `parseConfiguration(config)` - Extract output settings
  - `createConfiguration(localState)` - Create config from form state
  - `createEmptyConfiguration()` - Default empty output settings

### actions
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-ads/adapters/actions.js`
- **Purpose**: Define async actions for component
- **Exports**:
  - `listAccounts(configData)` - Load available customer accounts
  - Returns payload with authorization credentials for API call

### conform
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-ads/adapters/conform.js`
- **Purpose**: Normalize configuration on load
- **Operations**: Data validation and transformation

## API Endpoints

| Method | Endpoint | Purpose | Response Type |
|--------|----------|---------|---------------|
| POST | `/docker-action/{componentId}/listAccounts` | List available Google Ads customer accounts | AccountsResponse |

## State Management

- **Pattern Used**: Adapter-based configuration (createRoute pattern)
- **Configuration Structure**:
  - Index level: Accounts, authorization
  - Row level: Data source (query), output settings
- **Data Flow**:
  1. Configuration loaded via adapter `parseConfiguration`
  2. Form state updated via `onChange` callbacks
  3. On save, adapter `createConfiguration` converts form to Keboola config
  4. Configuration persisted to API

### Configuration Example
```javascript
{
  parameters: {
    customerId: ['123456789'],
    onlyEnabledCustomers: true,
    getAccountChildren: false
  },
  authorization: {
    oauth_api: {
      id: 'oauth-credentials-id'
    }
  }
}
```

## Dependencies

### Internal Modules
- `modules/components/DockerActionsApi` - Call Docker actions for accounts listing
- `modules/components/DockerActionsActionCreators` - Manage async actions
- `modules/configurations/utils/createRoute` - Generic route configuration
- `modules/configurations/utils/renderHelpers` - CollapsibleSection UI helper
- `modules/configurations/utils/columnTypeConstants` - Table column definitions

### External Packages
- `react` - v18+
- `immutable` - Immutable.js for data structures
- `react-bootstrap` - Form components (FormGroup, ControlLabel)
- `@keboola/design` - UI components (Button, HelpBlock, Alert)

## Notable Patterns

### Account Hierarchy Display
- Parent accounts may have child accounts (subaccounts)
- Display format: `AccountName (ID) - ChildAccount1, ChildAccount2`
- Supports flat listing of subaccounts via `getAccountChildren` toggle

### OAuth Integration
- OAuth credentials stored in `authorization.oauth_api.id`
- Credentials required for account listing action
- Specific authorization required for Google Ads API access

### Configuration Structure
- **Global Config**: Account selection (index level)
- **Per-Row Config**: Query + output settings
- Supports multiple extraction queries from same accounts
- Each row can have independent date ranges

### Action Caching
- `listAccounts` action cached to avoid repeated API calls
- Autoload enabled - fetches on configuration view
- Reload button allows manual refresh

## User-Facing Features

### Feature 1: Account Selection
- **Description**: Choose which Google Ads customer accounts to extract from
- **Workflow**:
  1. Configure Google Ads OAuth credentials
  2. Click "Add Accounts" or reload available accounts
  3. Select one or more customer accounts
  4. Toggle "Only enabled customers" to filter
  5. Toggle "List individual subaccounts" to expand hierarchy
  6. Save configuration
- **Components**: AccountsSettings, AccountsSelect

### Feature 2: Query Configuration
- **Description**: Define what data to extract via query parameters
- **Workflow**:
  1. Navigate to individual data source row
  2. Enter query (SQL or structured query)
  3. Set date range (since: -N for relative dates, until: now/date)
  4. Save query configuration
- **Components**: DataSource
- **Supported Date Formats**:
  - `-1` = one day ago
  - `-30` = thirty days ago
  - `now` = today
  - Absolute dates also supported

### Feature 3: Output Settings
- **Description**: Configure how extracted data is saved to Keboola Storage
- **Workflow**:
  1. In data source row, go to "Save Settings"
  2. Specify output table name
  3. Configure incremental loading if needed
  4. Set primary keys for deduplication
  5. Save settings
- **Components**: SaveSettings

### Feature 4: Account Hierarchy Support
- **Description**: Handle Google Ads account structures with parent and child accounts
- **Features**:
  - Shows parent account with child accounts listed
  - Can select parent to include all enabled child accounts
  - "List individual subaccounts" option expands each child as separate entry
  - "Only enabled customers" filters to active accounts only

## Technical Debt & Observations

- **Simple Adapter Pattern**: 
  - Uses manual adapter functions for configuration parsing
  - No type safety - relies on key paths (e.g., `.getIn(['parameters', 'customerId'])`)
  - Could benefit from TypeScript interfaces

- **Limited Validation**:
  - `isComplete` checks only if customerId array non-empty
  - No validation of query syntax
  - No validation of date range format

- **Minimal Component Logic**:
  - Components are relatively simple, mostly form UI
  - Complex logic would live in Docker action
  - Good separation of concerns but could use more error handling

- **Error Handling**:
  - Account loading errors displayed but not in component
  - Query execution errors would be in logs
  - Could benefit from inline error messages

- **Testing**:
  - Adapters have basic test coverage
  - Component tests missing
  - Integration tests rely on mock data

- **No State Management Library**:
  - Uses Immutable.js for config data
  - No Zustand/Redux for UI state
  - Simple enough for current requirements

## Code Examples

### Account Loading
```javascript
const listAccounts = (configData) => {
  if (!configData.has('authorization')) {
    return false;
  }

  return fromJS({
    configData: { authorization: configData.get('authorization') },
  });
};
```

### Account Configuration Adapter
```javascript
const parseConfiguration = (configuration) => {
  return Immutable.fromJS({
    customerId: configuration.getIn(['parameters', 'customerId'], []),
    onlyEnabledCustomers: configuration.getIn(['parameters', 'onlyEnabledCustomers'], true),
    getAccountChildren: configuration.getIn(['parameters', 'getAccountChildren'], false),
  });
};

const createConfiguration = (localState) => {
  return Immutable.fromJS({
    parameters: {
      customerId: localState.get('customerId', []),
      onlyEnabledCustomers: localState.get('onlyEnabledCustomers', true),
      getAccountChildren: localState.get('getAccountChildren', false),
    },
  });
};
```

### Route Configuration
```javascript
const routeSettings = {
  componentId: KEBOOLA_EX_GOOGLE_ADS,
  componentType: 'extractor',
  index: {
    sections: [
      {
        render: CollapsibleSection({
          title: 'Accounts',
          contentComponent: AccountsSettings,
          options: { includeSaveButtons: true },
        }),
        onSave: accountsSettingsAdapter.createConfiguration,
        onLoad: accountsSettingsAdapter.parseConfiguration,
        isComplete: accountsSettingsAdapter.isComplete,
      },
    ],
  },
  row: {
    sections: [
      { /* DataSource configuration */ },
      { /* SaveSettings configuration */ },
    ],
  },
};
```

## Related Modules

- `modules/oauth-v2` - OAuth credential management
- `ex-google-analytics-v4` - Similar profile/account selection pattern
- `ex-google-drive` - Similar sheet selection and authorization
- `modules/configurations` - Generic row/configuration management
- `wr-google-bigquery-v2` - Related Google service writer

## Testing

- **Coverage**: Moderate - adapters tested, components not
- **Test Files**: `adapters/tests.test.js`, `adapters/tests.spec.def.js`
- **Key Test Areas**:
  - Account configuration parsing
  - Configuration serialization
  - Validation of complete accounts
  - Query adapter data transformations
- **Testing Approach**: Jest with Immutable.js assertions

## Migration Notes

- **To Modern Patterns**:
  - Consider moving to TypeScript for type safety
  - Use Zod or similar for runtime validation
  - Add more comprehensive component testing
  - Move to custom hooks instead of class-based components
  - Consider moving account selection to modal similar to ex-google-analytics-v4
