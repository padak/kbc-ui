# Module: Google Analytics v4 Extractor (ex-google-analytics-v4)

## Overview

The Google Analytics v4 Extractor (`ex-google-analytics-v4`) is a Keboola connector that enables users to extract data from both the Google Analytics Universal Analytics API (older version) and the Google Analytics Data API v1 (GA4). The module handles:

- OAuth authorization with Google Analytics accounts
- Profile/Property selection and management
- Query configuration with dimensions, metrics, and filters
- Support for multiple extraction endpoints (Data API, Reports API, MCF API)
- Date range configuration with relative and absolute dates
- Incremental loading with last run date tracking
- Sample query execution for validation
- Both legacy Universal Analytics (UA) and modern GA4 extraction

## File Structure

```
ex-google-analytics-v4/
├── routes.js
├── Index.jsx
├── Row.jsx
├── LegacyIndex.jsx
├── actions.js
├── constants.js
├── helpers.js
└── components/
    ├── Profiles.jsx
    ├── ProfilesManagerModal.jsx
    ├── ProfilesSelector.tsx
    ├── ProfilesTable.tsx
    ├── QueryEditor.jsx
    ├── QuerySample.jsx
    ├── EndpointSelect.jsx
    ├── GaMultiSelect.jsx
    ├── ProfileSelector.jsx
    ├── DataApiFilters.tsx
    ├── AntiSampling.tsx
    ├── DateRangeModal.jsx
    ├── DateRangesSelector.jsx
    ├── TwoVersionsApiWarning.tsx
    └── UrlParserModal.jsx
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/{componentId}/:config` | `Index` | Main configuration page with profiles and queries management |
| `/{componentId}/:config/rows/:row` | `Row` | Individual query configuration and editing |

## Key Components

### Index
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-analytics-v4/Index.jsx`
- **Purpose**: Main container component for GA4 configuration management
- **State Management**: Flux with Immutable.js
- **Key Props**: None (uses store mixins)
- **Child Components**: Profiles, GenericRows, SimplifiedUi
- **Features**:
  - Displays list of configured Google Analytics profiles/properties
  - Shows query rows organized by profiles
  - Manages profile addition/removal
  - Supports both legacy (simplified UI) and new profile-based configurations
  - Auto-detects which UI to show based on configuration state

### Row
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-analytics-v4/Row.jsx`
- **Purpose**: Individual query configuration editor
- **State Management**: Flux for configuration state, local component state for samples
- **Key Features**:
  - Query editor with dimensions, metrics, and filters
  - Sample data execution
  - URL parser for Google Analytics reports
  - Segment loading for old API profiles
  - Enable/disable query toggle
  - Delete row functionality

### Profiles
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-analytics-v4/components/Profiles.jsx`
- **Purpose**: Display and manage Google Analytics profiles/properties
- **Props**:
  - `profiles: List` - Immutable list of configured profiles
  - `hasCredentialsId: boolean` - OAuth authorization status
  - `handleSave: function` - Callback to save profile changes
  - `readOnly: boolean` - Edit mode restriction
- **Child Components**: ProfilesManagerModal, ProfilesTable

### ProfilesManagerModal
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-analytics-v4/components/ProfilesManagerModal.jsx`
- **Purpose**: Modal for discovering and adding new profiles/properties
- **Features**:
  - Loads available profiles from Google Analytics via Docker action
  - Hierarchical display: Account > Property > Profile
  - Search filtering by profile name
  - Multi-select capability
  - Shows already-added profiles as disabled
  - Error/warning message display

### ProfilesSelector
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-analytics-v4/components/ProfilesSelector.tsx`
- **Purpose**: Hierarchical table component for profile selection
- **Tech Stack**: TanStack React Table (v8+), React Hooks
- **Features**:
  - Three-level tree structure (Type > Account > Profile)
  - Checkbox selection with indeterminate states
  - Sortable columns
  - Search highlighting
  - Prevents selection of already-added profiles
  - Expandable sections

### ProfilesTable
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-analytics-v4/components/ProfilesTable.tsx`
- **Purpose**: Display table of already-selected profiles
- **Features**: Edit/delete actions, profile information display

### QueryEditor
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-analytics-v4/components/QueryEditor.jsx`
- **Purpose**: Main query configuration interface
- **Features**:
  - Endpoint selection (Data API, Reports API, MCF)
  - Date range configuration
  - Dimensions and metrics multi-select
  - Anti-sampling options
  - Data API filters (for GA4)
  - Sample data viewer
  - URL parser for legacy reports

### DataApiFilters
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-analytics-v4/components/DataApiFilters.tsx`
- **Purpose**: Filter configuration UI for Google Analytics Data API (GA4)
- **Features**:
  - Keep empty rows toggle
  - Metric filters (numeric: ==, <, <=, >, >=)
  - Dimension filters (string patterns: exact, begins, ends, contains, regexp)
  - Between filter for metrics
  - String list filters for dimensions
  - Case sensitivity toggle

## API Endpoints

| Method | Endpoint | Purpose | Response Type |
|--------|----------|---------|---------------|
| POST | `/docker-action/{componentId}/sampleJson` | Test query execution | SampleDataResponse |
| POST | `/docker-action/{componentId}/segments` | Load available segments | SegmentsResponse |
| POST | `/docker-action/{componentId}/getProfilesProperties` | Load available profiles/properties | ProfilesResponse |

## State Management

- **Pattern Used**: Flux architecture with Immutable.js (legacy), TanStack Query for API calls
- **Key Stores**:
  - `InstalledComponentsStore` - Configuration data
  - `ConfigurationRowsStore` - Row configurations
  - `OAuthStore` - OAuth credentials
  - `GapiStore` - Analytics metadata (dimensions/metrics)
  - `ComponentsStore` - Component metadata
- **Data Flow**:
  1. Configuration loaded from store → state
  2. User modifies profiles → API call via actions
  3. Profiles saved via `InstalledComponentsActionCreators.saveComponentConfigData`
  4. Row queries modified → stored in editing state
  5. Saved via `ConfigurationRowsActionCreators.saveConfigurationSimple`

## Dependencies

### Internal Modules
- `modules/components/InstalledComponentsActionCreators` - Save configuration
- `modules/configurations/ConfigurationRowsActionCreators` - Manage query rows
- `modules/oauth-v2/Store` - OAuth credential management
- `modules/google-utils/helpers` - Profile type detection and utilities
- `modules/google-utils/react/GapiFlux` - Analytics metadata (dimensions/metrics)
- `modules/simplified-ui` - Legacy UI support

### External Packages
- `react` - v18+
- `immutable` - v4+ (data structures)
- `react-bootstrap` - Modal, Form components
- `@tanstack/react-table` - v8+ (hierarchical profile selector)
- `@keboola/design` - Button, Modal, Icon components

## Notable Patterns

### OAuth Integration
- OAuth credentials stored in `configuration.authorization.oauth_api`
- Profiles/properties stored in `parameters.profiles` (old API) or `parameters.properties` (new API)
- `authorizeConfiguration` helper merges OAuth credentials with config for API calls

### Dual API Support
- **Old API (Universal Analytics)**: 
  - Uses `profiles`, `webPropertyId`, `id` fields
  - Supports MCF (Multi-Channel Funnels) endpoint
  - Segments available
  - Predefined queries in `PREDEFINED_QUERIES.OLD_API`
- **New API (GA4 Data API)**:
  - Uses `properties`, `propertyKey` fields
  - Single Data API endpoint
  - Predefined queries in `PREDEFINED_QUERIES.NEW_API`

### Query Configuration
- Queries stored with `endpoint` type indicator
- Date ranges support relative (-N days, today) and absolute formats
- Dimension/metric names prefixed with `ga:` (old) or unprefixed (new)
- Output table name auto-generated from row name

### Sample Query Execution
- Docker action `sampleJson` used for testing
- Runs with current query configuration
- Returns paginated sample data or error
- Helps users validate queries before extraction

## User-Facing Features

### Feature 1: Profile/Property Management
- **Description**: Add, view, and manage Google Analytics profiles or GA4 properties
- **Workflow**:
  1. Click "Add Profiles" button
  2. Authorize if needed
  3. Search and select desired profiles
  4. System loads profile details
  5. Save selection
- **Components**: Profiles, ProfilesManagerModal, ProfilesSelector, ProfilesTable

### Feature 2: Query Configuration
- **Description**: Create extraction queries specifying dimensions, metrics, and filters
- **Workflow**:
  1. Create new query row or edit existing
  2. Select profile/property to extract from
  3. Choose date range (relative or absolute)
  4. Select metrics and dimensions
  5. Apply optional filters
  6. Run sample to validate
  7. Save configuration
- **Components**: QueryEditor, DataApiFilters, DateRangesSelector, GaMultiSelect

### Feature 3: Advanced Filtering (GA4 Data API)
- **Description**: Apply metric and dimension filters to refine data extraction
- **Workflow**:
  1. In query editor, select metric or dimension
  2. Choose filter type (numeric, string, between, list)
  3. Configure filter values
  4. Sample query shows filtered results
- **Components**: DataApiFilters

### Feature 4: Predefined Query Templates
- **Description**: Quick-start extraction templates for common analytics use cases
- **Available Templates**:
  - Audience Overview, Behavior Overview
  - Acquisition/Traffic Analysis
  - Conversion/Goals
  - E-commerce (revenue, products, purchases)
  - Demographics (user breakdown by location, device, etc.)
  - Engagement & Events (GA4)
  - Monetization (GA4)
- **Usage**: System can auto-populate query configurations

### Feature 5: Incremental Loading
- **Description**: Automatically extract only new data since last run
- **Configuration**: 
  - Special date value `lastRunDate` triggers incremental mode
  - Only rows created/modified since last extraction are fetched
  - Reduces API quota usage and improves performance

## Technical Debt & Observations

- **Legacy Support**: Code maintains support for old Universal Analytics API alongside GA4
  - Two separate profile structures (profiles vs properties)
  - Conditional rendering based on API version
  - LegacyIndex.jsx for old-style configuration (deprecated)
  - Could benefit from dedicated GA4-only module

- **Mixed Architecture**: Combines Flux (old) with TanStack Query hooks
  - ProfilesSelector uses modern React hooks with TanStack Table
  - Other components use legacy createReactClass with Immutable.js
  - Gradual migration path needed

- **Complex State Management**: 
  - Multiple stores involved (Flux pattern)
  - OAuth credentials fetched from OAuthStore
  - Metadata fetched from GapiStore (dimensions/metrics)
  - Query editing state separate from saved state
  - Could benefit from Zustand or Redux refactor

- **Performance Considerations**:
  - ProfilesSelector rebuilds table for each search keystroke
  - Large profile hierarchies could lag (no virtualization)
  - Metadata loading synchronous at component mount

- **Type Safety**: 
  - Mix of JSX/JS files with limited TypeScript adoption
  - Recent components (ProfilesSelector, DataApiFilters) moved to TypeScript
  - PropTypes used but incomplete coverage

## Code Examples

### Loading Profiles
```typescript
const loadProfiles = () => {
  this.setState({ isLoading: true });
  return callDockerAction(this.props.componentId, 'getProfilesProperties', {
    configData: authorizeConfiguration(Map(), this.props.oauthCredentials).toJS(),
  })
    .then((result) => {
      if (result.status === 'error') {
        throw new SyncActionError(result.message, result.exceptionId);
      }
      this.setState({
        loadedProfiles: prepareProfiles(result),
        error: List(result.messages),
      });
    })
    .finally(() => this.setState({ isLoading: false }));
};
```

### Profile Type Detection
```typescript
// Distinguish between old API (Universal Analytics) and new API (GA4)
const isOldProfile = (profile) => profile.has('webPropertyId');

// Helper for profile name formatting
const getProfileName = (profile) => {
  if (isOldProfile(profile)) {
    return `${profile.get('name')} (${profile.get('webPropertyId')}/${profile.get('id')})`;
  }
  return `GA4 - Data API (${propertyKey})`;
};
```

### Query Configuration Preparation
```typescript
const prepareQuery = (parameters, rowName, endpoint) => {
  let query = parameters.set('endpoint', endpoint);
  
  if (!query.hasIn(['query', 'dateRanges'])) {
    query = query.setIn(['query', 'dateRanges'], DEFAULT_DATE_RANGES);
  }
  
  if (!query.get('outputTable')) {
    query = query.set('outputTable', sanitizeKbcTableIdString(rowName));
  }
  
  return query;
};
```

## Related Modules

- `modules/oauth-v2` - OAuth credential management
- `modules/google-utils` - Shared Google API utilities
- `modules/configurations` - Generic configuration management
- `ex-google-drive` - Google Drive file extractor (similar OAuth flow)
- `ex-google-ads` - Google Ads extractor (similar account selection)

## Testing

- **Coverage**: Mixed - some adapters have spec tests, components lack coverage
- **Test Files**: `adapters/*.test.js` and `adapters/*.spec.def.js`
- **Key Test Areas**:
  - Query conforming and validation
  - Profile data preparation
  - Predefined query matching
  - Date range handling
  - Sample query execution error handling
- **Testing Approach**: Jest with Immutable.js assertions
