# Module: Components (Shared Component Infrastructure)

## Overview

The Components module provides the shared infrastructure for managing, configuring, and versioning Keboola components. It serves as the foundation for all component-based operations including data sources (extractors), data destinations (writers), and transformations. This module implements the Flux architecture with Immutable.js for state management and provides comprehensive APIs for component lifecycle management, configuration versioning, metadata handling, and UI component generation for generic component types.

**Key Characteristics**:
- Flux architecture with Immutable.js data structures
- Comprehensive API wrapper for component operations (CRUD, versioning, metadata)
- Generic component UI pattern support (Generic UI, Generic Docker UI, etc.)
- Configuration metadata system (folders, creation tracking, templates)
- Component versioning and rollback functionality
- Storage mapping helpers (tables, files, buckets)
- Transformation backend size management
- Data type support detection and handling

**Status**: Core infrastructure - actively maintained and extended

## File Structure

```
components/
├── Constants.ts                              # Action types and feature flags
├── MetadataConstants.ts                      # Metadata keys and object types
├── helpers.js                                # Shared utility functions
├── helpers.test.js                           # Helper function tests
├── ComponentRunner.js                        # Component execution interface
├── ComponentsActionCreators.js               # Flux action creators
├── ComponentsApi.js                          # Components API wrapper
├── InstalledComponentsActionCreators.js      # Configuration action creators
├── InstalledComponentsApi.js                 # Configuration API wrapper
├── StorageActionCreators.js                  # Storage state management
├── StorageApi.js                             # Storage API wrapper
├── MetadataActionCreators.js                 # Metadata operation actions
├── VersionsActionCreators.jsx                # Version history actions
├── DockerActionsApi.js                       # Docker execution API
├── ImportApi.js                              # Import operation wrapper
├── TemplatesActionCreators.js                # Template management
├── TemplatesApi.js                           # Templates API wrapper
├── TemplatesConstants.js                     # Template-related constants
├── VersionsConstants.js                      # Versioning constants
├── Loading.tsx                               # Loading state component
├── ParallelismModal.tsx                      # Parallelism config modal
├── stores/
│   ├── ComponentsStore.js                    # Component registry store
│   ├── InstalledComponentsStore.js           # Configuration store
│   ├── VersionsStore.js                      # Versioning store
│   └── [Other Flux stores]
├── react/
│   ├── components/
│   │   ├── Configuration.jsx                 # JSON/visual config editor
│   │   ├── ConfigurationCopiedNotification.jsx
│   │   ├── ConfigurationRowEditField.jsx     # Row inline editing
│   │   ├── ConfigurationScheduleStatus.tsx   # Scheduler status display
│   │   ├── ConfigurationSchemaNotValidBox.jsx
│   │   ├── ConfigurationTemplateSelector.jsx # Template selection UI
│   │   ├── ActiveCountBadge.tsx              # Status badge
│   │   ├── BackendSizeIcons.tsx              # Backend size visuals
│   │   ├── BackendSizeSelect.jsx             # Backend size picker
│   │   ├── ComponentConfigurationLink.tsx    # Internal navigation link
│   │   ├── ComponentDescription.tsx          # Description display
│   │   ├── ComponentNameEdit.tsx             # Name inline editor
│   │   ├── CodeBlocksHeader.tsx              # Code blocks UI
│   │   ├── ColumnDataPreview.tsx             # Table column preview
│   │   ├── DiffVersionButton.tsx             # Version diff viewer
│   │   ├── DocumentationLink.tsx             # Doc external link
│   │   ├── ExternalBucketLink.tsx            # Bucket link
│   │   ├── ExternalProjectLink.tsx           # Project link
│   │   ├── GenericSyncActionsButton.tsx      # Sync actions
│   │   ├── IncrementalResetWarning.jsx       # Incremental mode warning
│   │   ├── JSONSchemaEditor.jsx              # Schema visual editor
│   │   ├── JSONSchemaEditorEditable.tsx      # Editable schema editor
│   │   ├── MappingsWrapper.jsx               # Mapping container
│   │   ├── PlatformNews.tsx                  # News feed integration
│   │   ├── ProcessTimeoutModal.tsx           # Process timeout config
│   │   ├── Processors.tsx                    # Processor list display
│   │   ├── QueryTimeoutModal.tsx             # Query timeout config
│   │   ├── RunComponentButton.tsx            # Execute component button
│   │   ├── RunComponentButtonModal.jsx       # Execution options modal
│   │   ├── SampleDataDetail.tsx              # Sample data viewer
│   │   ├── SapiTableSelector.jsx             # Table picker
│   │   ├── SidebarJobs.tsx                   # Job sidebar
│   │   ├── SidebarJobsRow.jsx                # Job list item
│   │   ├── SidebarVersions.jsx               # Versions sidebar
│   │   ├── SidebarVersionsRow.jsx            # Version list item
│   │   ├── VersionsTable.tsx                 # Versions history table
│   │   ├── generic/
│   │   │   ├── DeleteWhereInputs/            # Delete filter builder
│   │   │   │   ├── DeleteWhereInputs.tsx
│   │   │   │   ├── DeleteWhereRow.tsx
│   │   │   │   ├── LegacyForm.tsx
│   │   │   │   ├── StrtotimeInfoTooltip.tsx
│   │   │   │   ├── helpers.ts
│   │   │   │   └── constants.ts
│   │   │   ├── CollapsibleMapping/           # Collapsible table mappings
│   │   │   │   ├── CollapsibleMapping.tsx
│   │   │   │   └── helpers.ts
│   │   │   ├── FileInputMappingModal.tsx     # File input mapping
│   │   │   ├── FileOutputMappingModal.tsx    # File output mapping
│   │   │   ├── TableInputMappingModal.tsx    # Table input mapping
│   │   │   ├── TableOutputMappingModal.tsx   # Table output mapping
│   │   │   ├── TableInputMappingReadOnlyInfo.tsx
│   │   │   ├── PrimaryKeyWarning.tsx         # Primary key validation
│   │   │   ├── SnowflakeSqlTableExplainTooltip/
│   │   │   ├── variables/
│   │   │   │   ├── VariablesBox.tsx
│   │   │   │   └── VariableForm.tsx
│   │   │   └── code-blocks/
│   │   ├── migration/
│   │   │   ├── Migration.tsx
│   │   │   └── MigrationModalContent.tsx
│   │   └── notifications/
│   │       └── configurationScheduled.tsx
│   └── pages/
│       ├── [Component-specific pages]
└── utils/
    ├── helpers.js
    ├── [Component utilities]
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/components/:component` | Component list | List all configurations for a component |
| `/components/:component/:config` | Configuration | Configuration detail view |
| `/components/:component/:config/row/:row` | Configuration Row | Row detail view (if component supports rows) |
| `/components/:component/:config/versions` | Versions | Configuration version history |
| `/components/:component/:config/row/:row/versions` | Row Versions | Row version history |

## Key Components & Patterns

### Constants System (Constants.ts, MetadataConstants.ts)

**Purpose**: Centralized management of action types, feature flags, and metadata keys

**Key Exports**:
- `ActionTypes`: Flux dispatcher action constants covering:
  - Component loading (COMPONENTS_LOAD_SUCCESS)
  - Configuration operations (INSTALLED_COMPONENTS_CONFIGDATA_*)
  - Storage management (STORAGE_*)
  - Metadata operations (METADATA_*)
- `stagingStorageType`: Workspace backend types (WORKSPACE_SNOWFLAKE, WORKSPACE_BIGQUERY, etc.)
- `features`: Component feature detection (DEV_BRANCH_JOB_BLOCKED, HAS_SAMPLE_DATA, etc.)
- `BACKEND_SIZES`: Transformation compute sizes (XSMALL, SMALL, MEDIUM, LARGE)
- `ioType`: Input/output types (TABLE, FILE)
- `MetadataKeys`: Storage and configuration metadata keys
  - Storage: PROVIDER, BASE_TYPE, TYPE, DEFAULT, LENGTH, NULLABLE
  - Configuration: CONFIGURATION_FOLDER, CONFIGURATION_CREATED_FROM, TEMPLATES_INSTANCE_ID
  - Branch: PROJECT_DESCRIPTION, COMPONENT_DESCRIPTION_DEFAULT

**Usage Pattern**:
```typescript
import { ActionTypes, features, MetadataKeys } from '@/modules/components/Constants';
import { ObjectTypes, BaseTypes } from '@/modules/components/MetadataConstants';
```

### API Layer (InstalledComponentsApi.js)

**Purpose**: Unified REST API client for all component configuration operations

**Key Methods**:
- **Retrieval**: `getComponentConfiguration()`, `getComponentConfigurations()`, `getProductionComponents()`
- **CRUD**: `createConfiguration()`, `updateComponentConfiguration()`, `deleteConfiguration()`
- **Rows**: `createConfigurationRow()`, `updateConfigurationRow()`, `deleteConfigurationRow()`
- **Versions**: `getComponentConfigVersions()`, `rollbackVersion()`, `createConfigCopy()`
- **Metadata**: `saveConfigurationMetadata()`, `deleteConfigurationMetadata()`
- **Encryption**: `encryptConfiguration()`

**Pattern - Dev/Production Split**:
```javascript
// Production versions available for most methods
getComponentConfiguration(componentId, configId)  // Dev branch
getProductionComponentConfiguration(componentId, configId)  // Production

// Branch-aware operations
updateComponentConfiguration(componentId, configId, data, changeDescription)
```

**Key Features**:
- `forceProduction` option for forcing production branch access
- Automatic change description tracking
- Support for both dev and production configurations
- Versioning with rollback capability

### Action Creators (InstalledComponentsActionCreators.js)

**Purpose**: Flux action dispatch layer for component state mutations

**Key Patterns**:

1. **Async Action Pattern**:
```javascript
loadComponentConfigData(componentId, configId) {
  // Dispatch START action
  // Execute async operation
  // Dispatch SUCCESS or ERROR action
}
```

2. **Configuration Save Pattern**:
```javascript
saveComponentConfigData(componentId, configId, configData, changeDescription)
  // Validates data
  // Encodes sensitive fields
  // Saves via API
  // Reloads versions
```

3. **Metadata Operations**:
```javascript
setConfigurationMetadata(componentId, configId, metadata)
// Updates configuration metadata (folder, templates, etc.)

setConfigurationMetadata() with MetadataKeys.CONFIGURATION_FOLDER
```

### Shared Helpers (helpers.js)

**Purpose**: Reusable utility functions for component operations

**Key Functions**:

1. **Component Filtering & Validation**:
```typescript
getAllowedTransformations(allTransformations, sapiToken, projectFeatures, stackFeatures)
// Filters transformations by available backends and project features

getAllowedPatternComponents(allPatternComponents, isDevModeActive)
// Filters components based on dev mode compatibility

isComponentDeprecated(componentId)
// Checks deprecation flag
```

2. **Metadata Handling**:
```typescript
findCreatedFromMetadata(componentId, configId, allMetadata)
// Extracts "created from" information for configuration cloning

prepareFoldersFromMetadata(metadata)
// Prepares folder structure from metadata

saveFolderToMetadata(componentId, configId, folder, options)
// Persists folder assignment
```

3. **Storage Type Resolution**:
```typescript
getDestinationTypeFromStagingStorage(type, componentId)
// Determines if output should be table or file based on staging storage

getSourceTypeFromStagingStorage(type)
// Determines input storage type
```

4. **Backend Size Management**:
```typescript
supportsDynamicBackendSize(transformationComponent)
// Checks if component supports dynamic sizing

getTransformationBackendSizes(componentId)
// Returns available sizes for component

getLargerBackendSize(componentId, currentBackendSize)
// Gets next larger size option
```

5. **UI Feature Detection**:
```typescript
hasGenericUI(component)
// Checks for generic UI flag

hasGenericDockerUI(component)
// Checks for Docker UI support

hasGenericCodeBlocksUI(component)
// Checks for code blocks support

hasVariables()
// Checks if variables are available
```

6. **Configuration Routing**:
```typescript
resolveRouterLinkParams(componentId, configId, rowId, version)
// Determines correct route for component type (transformation, extractor, etc.)
// Handles special cases (orchestrator, flows, sandboxes)
```

### Configuration Store (InstalledComponentsStore.js, ConfigurationsStore.js)

**Purpose**: Flux store managing all loaded component configurations

**Key Methods**:

1. **Data Access**:
```javascript
getConfig(componentId, configId)  // Full config object
getConfigData(componentId, configId)  // Configuration section only
getComponentConfigurations(componentId)  // All configs for component
```

2. **Immutable Structure**:
```
Config: {
  id: string
  name: string
  description: string
  created: timestamp
  version: number
  changeDescription: string
  creator: { description: email, features: [...] }
  configuration: { ... }  // Component-specific config
  rows: [ ... ]  # If component supports rows
  state: { ... }  # Component state (filters, etc.)
}
```

3. **Editing State**:
```javascript
getEditingConfiguration(componentId, configId)
// Gets current edit state for form fields

getPendingActions(componentId, configId)
// Tracks ongoing operations (saving, deleting)
```

### Component Metadata System

**Purpose**: Track configuration provenance, organization, and templating

**Metadata Keys**:
- `CONFIGURATION_FOLDER`: Organize configs into logical folders
- `CONFIGURATION_CREATED_FROM`: Track configuration cloning (componentId, configId)
- `TEMPLATES_INSTANCE_ID`: Link to template instance for config creation

**Operations**:
```javascript
// Save folder assignment
saveFolderToMetadata(componentId, configId, 'my-folder')

// Retrieve folder
getFolderFromMetadata(metadata)

// Prepare folder structure
prepareFoldersFromMetadata(allMetadata)
// Returns Map<componentId, Map<configId, folderName>>

// Get config origin
findCreatedFromMetadata(componentId, configId, allMetadata)
// Returns: { componentId, configurationId, name, isDeleted }
```

### Generic Component UI Patterns

**Purpose**: Support reusable UI patterns for common component configurations

**Feature Detection**:
```typescript
const features = {
  GENERIC_UI: 'generic-ui'  // Standard JSON schema editor
  GENERIC_DOCKER_UI: 'generic-docker-ui'  // Docker-specific inputs
  GENERIC_CODE_BLOCKS_UI: 'generic-code-blocks-ui'  // Code editor
  GENERIC_PACKAGES_UI: 'generic-packages-ui'  // Package selection
  GENERIC_TEMPLATES_UI: 'generic-templates-ui'  // Template support
  GENERIC_DOCKER_UI_ROWS: 'generic-docker-ui-rows'  // Row-based UI
}
```

**UI Component Hierarchy**:
1. **Configuration.jsx**: Main container for config editing
   - Chooses between JSON schema editor or code editor
   - Supports both visual and raw JSON editing
   - Handles save/cancel workflows

2. **JSONSchemaEditorEditable.tsx**: Visual form builder
   - Renders based on JSON schema
   - Validates against schema constraints
   - Supports nested objects and arrays

3. **Generic Mapping Components**: Common input/output patterns
   - FileInputMappingModal, FileOutputMappingModal
   - TableInputMappingModal, TableOutputMappingModal
   - DeleteWhereInputs: Filter/condition builder
   - CollapsibleMapping: Expandable mapping list

### Versioning System

**Purpose**: Track configuration history with rollback capability

**API Operations**:
```javascript
getComponentConfigVersions(componentId, configId)
// Returns list of all versions with metadata

getComponentConfigByVersion(componentId, configId, versionId)
// Retrieves specific version

rollbackVersion(componentId, configId, version)
// Restores configuration to previous version

createConfigCopy(componentId, configId, version, name)
// Clones config from specific version with new name
```

**Version Object Structure**:
```
Version: {
  version: number
  created: timestamp
  creatorToken: { description: email }
  changeDescription: string
  configurationVersion: number
}
```

**Rollback Logic**:
```javascript
// 1. Load version history
VersionsActionCreators.loadVersionsForce(componentId, configId)

// 2. Select version to restore
const versionId = versions.get(0).get('version')

// 3. Execute rollback
VersionsActionCreators.rollbackVersion(componentId, configId, versionId)

// 4. Reload configuration
InstalledComponentsActionCreators.loadComponentConfigDataForce(componentId, configId)
```

## Data Types & Interfaces

### Component Type Definition

```typescript
Component: {
  id: string  // Unique component identifier
  name: string
  description: string
  type: 'extractor' | 'writer' | 'transformation' | 'application' | 'other'
  category?: string
  flags: string[]  // Feature flags (generic-ui, deprecated, etc.)
  features: string[]  // Feature requirements
  emptyConfiguration?: {}  // Default config template
  emptyConfigurationRow?: {}  // Default row template
  configurationSchema?: Map  // JSON schema for config
  configurationRowSchema?: Map  # JSON schema for rows
  dataTypesConfiguration?: {
    dataTypesSupport: 'none' | 'hints' | 'authoritative'
  }
}
```

### Configuration Row System

**Purpose**: Support components with repeatable configuration units

**Usage Contexts**:
- Database extractors (multiple queries/tables)
- File uploaders (multiple file mappings)
- Data writers (multiple table destinations)

**Row Operations**:
```javascript
createConfigurationRow(componentId, configId, rowData, changeDescription)
updateConfigurationRow(componentId, configId, rowId, rowData, changeDescription)
deleteConfigurationRow(componentId, configId, rowId, changeDescription)
```

**Row Versioning**:
```javascript
getComponentConfigRowVersions(componentId, configId, rowId)
rollbackRowVersion(componentId, configId, rowId, version)
```

## Common Patterns

### 1. Configuration Load Pattern

```javascript
// Load with cache
InstalledComponentsActionCreators.loadComponentConfigData(componentId, configId)
  .then(() => {
    const config = InstalledComponentsStore.getConfig(componentId, configId)
  })

// Force reload
InstalledComponentsActionCreators.loadComponentConfigDataForce(componentId, configId)
```

### 2. Configuration Save Pattern

```javascript
// Update configuration
const updatedConfig = currentConfig.setIn(['parameters', 'key'], value)

// Save with tracking
InstalledComponentsActionCreators.saveComponentConfigData(
  componentId,
  configId,
  updatedConfig,
  'Updated parameter'
).then(() => {
  // Refresh versions
  VersionsActionCreators.loadVersionsForce(componentId, configId)
})
```

### 3. Metadata Operations Pattern

```javascript
// Save folder structure
InstalledComponentsActionCreators.setConfigurationMetadata(
  componentId,
  configId,
  [{ key: MetadataKeys.CONFIGURATION_FOLDER, value: 'folder-name' }]
)

// Retrieve metadata
const metadata = InstalledComponentsStore.getConfigMetadata(componentId, configId)
const folder = getFolderFromMetadata(metadata)
```

### 4. Version Rollback Pattern

```javascript
// 1. Load versions if not cached
const versions = VersionsStore.getVersions(componentId, configId)

// 2. Select version
const versionToRestore = versions.get(targetVersion)

// 3. Rollback
VersionsActionCreators.rollbackVersion(componentId, configId, versionToRestore.get('version'))
  .then(() => {
    // Reload data
    InstalledComponentsActionCreators.loadComponentConfigDataForce(componentId, configId)
  })
```

## Component Feature Flags

**Generic UI Flags**:
- `generic-ui`: Standard JSON schema editor support
- `generic-docker-ui`: Docker component with parameters
- `generic-code-blocks-ui`: Code block editor
- `generic-packages-ui`: Package/library selection
- `generic-templates-ui`: Template support
- `generic-docker-ui-rows`: Row-based editing

**Capability Flags**:
- `deprecated`: Component no longer recommended
- `dev-branch-job-blocked`: Cannot run in dev branches
- `dev-branch-configuration-unsafe`: Dev branch modifications dangerous
- `allow-use-file-storage-only`: File storage restricted
- `allow-tag-override`: Tag customization enabled
- `has-sample-data`: Sample data available
- `has-simplified-ui`: Simplified configuration interface

## Transformation-Specific Helpers

**Backend Type Detection**:
```typescript
isSQLBased(transformationComponent)  // Uses workspace backend
isContainerBased(transformationComponent)  // Uses container backend
```

**Available Backend Sizes**:
```typescript
BACKEND_SIZES = {
  XSMALL: 'xsmall',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
}

// Snowflake transformations support smaller set
SNOWFLAKE_BACKEND_TRANSFORMATIONS: ['keboola.snowflake', ...]
transformationBackendSizes.snowflake = ['small', 'medium', 'large']
```

## Testing

**Test Files**:
- `helpers.test.js`: Helper function tests
- Configuration CRUD operations
- Metadata persistence and retrieval
- Version rollback scenarios

**Key Test Patterns**:
- Mock Flux dispatcher and stores
- Immutable.js data structure manipulation
- API call mocking with expected responses
- State mutation verification

## State Management Architecture

**Flux Flow**:
```
Component → Action Creators → API → Dispatcher → Stores → Component
                              ↓
                         Console logging
```

**Key Stores**:
1. **ComponentsStore**: Component definitions and capabilities
2. **InstalledComponentsStore**: Loaded configurations
3. **VersionsStore**: Version history and diffs
4. **Application/Dev Branch Stores**: Context (project, branch, features)

**Immutable Data Structures**:
- All data uses Immutable.js Maps and Lists
- Enables efficient change detection
- Supports undo/redo patterns
- Time travel debugging with Redux DevTools

## Security Considerations

**Encrypted Fields**:
- Sensitive parameters marked with `#` prefix
- Encrypted via `encryptConfiguration()` API before storage
- Automatically decrypted on load
- Never logged in raw form

**Access Control**:
- Configuration access tied to component permissions
- Production vs dev branch separation
- Token-based API access
- Feature flag gating for advanced features

## Performance Optimization

**Caching Strategy**:
```javascript
if (Store.hasComponentDetails(componentId)) {
  return cached data
} else {
  load and cache
}
```

**Lazy Loading**:
- Configurations loaded on-demand per component
- Versions loaded only when accessed
- Metadata loaded when needed

**Batch Operations**:
- Version loading batched where possible
- Metadata updates combined into single API call

## Troubleshooting

**Common Issues**:

1. **Configuration not updating**: 
   - Check if in production branch view (dev changes invisible in production)
   - Verify component has write permissions
   - Check browser console for validation errors

2. **Version history empty**:
   - Component may not support versioning
   - No changes have been made yet
   - Force reload with `loadVersionsForce()`

3. **Metadata not persisting**:
   - Verify metadata key is in `USED_METADATA_KEYS`
   - Check for API response errors
   - Ensure sufficient permissions

4. **Generic UI not rendering**:
   - Verify component has `generic-ui` flag
   - Check JSON schema validity
   - Validate against schema in browser DevTools

## Future Directions

- Migration to modern React Query for server state management
- TypeScript adoption for stricter type safety
- React 18 patterns with better Suspense integration
- Real-time collaboration features
- Advanced diff/merge capabilities for configurations
