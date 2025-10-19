# Module: Google Drive Extractor (ex-google-drive)

## Overview

The Google Drive Extractor (`ex-google-drive`) is a Keboola connector for extracting data from Google Sheets files stored in Google Drive. The module enables users to:

- Authorize and manage Google Drive access via OAuth
- Browse and select Google Sheets files and specific sheets
- Configure data extraction with optional processing (transposition, headers)
- Support multiple sheets from different files
- Manage sheet-specific output table mappings
- Enable/disable sheets for extraction
- Delete sheets from configuration

## File Structure

```
ex-google-drive/
├── routes.js
├── common.js
├── actionsProvisioning.js
├── storeProvisioning.js
├── react/
│   ├── Index/
│   │   ├── Index.jsx
│   │   ├── SheetsManagerModal.tsx
│   │   ├── SheetsSelector.tsx
│   │   ├── SheetsTable.jsx
│   │   └── OutputTableModal.jsx
│   └── components/
│       ├── HeaderColumnsMultiSelect.jsx
│       ├── ProcessorControls.jsx
│       └── ...
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/{componentId}/:config` | Index | Main sheet configuration and management |

## Key Components

### Index
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-drive/react/Index/Index.jsx`
- **Purpose**: Main container component for Google Drive sheet extraction configuration
- **State Management**: Flux with Immutable.js (via storeProvisioning)
- **Features**:
  - Displays list of configured sheets
  - Manages sheet addition/removal
  - Renders output table configuration modal
  - Shows authorization status
  - Validates configuration completeness (authorization + sheets)
- **Key Methods**:
  - `isAuthorized()` - Check OAuth authorization
  - `hasSheets()` - Check if any sheets configured
  - `invalidToRun()` - Validation for extraction execution

### SheetsManagerModal
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-drive/react/Index/SheetsManagerModal.tsx`
- **Purpose**: Modal for discovering and adding new sheets from Google Drive
- **Props**:
  - `show: boolean` - Modal visibility
  - `files?: List<Map>` - Currently selected files with sheets
  - `savedSheets: Map` - Already-configured sheets
  - `authorizedEmail: string` - User's authorized Google account
  - `onFilesChange: (files) => void` - Update files state
  - `onSaveSheets: (sheets) => Promise` - Save selected sheets
  - `onHide: () => void` - Close modal
- **Features**:
  - Google Picker integration for spreadsheet selection
  - Two-step flow: 1) Select files 2) Select sheets
  - Search/filter sheets by name
  - Shows already-added sheets as disabled
  - Async sheet metadata loading with concurrency limit
  - Error message display

### SheetsSelector
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-drive/react/Index/SheetsSelector.tsx`
- **Purpose**: Hierarchical table for sheet selection
- **Tech Stack**: TanStack React Table (v8+), React Hooks
- **Features**:
  - Two-level tree: File > Sheet
  - Checkbox selection with indeterminate states
  - Search highlighting
  - Prevents selection of already-added sheets
  - Sortable columns
  - Expandable file sections
- **Props**:
  - `files: List<Map>` - Files with sheets
  - `isLoading: boolean` - Loading state
  - `searchQuery: string` - Filter query
  - `savedSheets: Map` - Already selected sheets
  - `selectSheets: (sheets, selected) => void` - Selection callback

### SheetsTable
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-drive/react/Index/SheetsTable.jsx`
- **Purpose**: Display currently configured sheets with actions
- **Features**:
  - Shows file name and sheet name
  - Output table name
  - Enable/disable toggle
  - Delete button
  - Edit button for output configuration

### OutputTableModal
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-drive/react/Index/OutputTableModal.jsx`
- **Purpose**: Configure sheet-specific output settings
- **Features**:
  - Output table name mapping
  - Processor configuration (transposition, headers)
  - Primary key specification
  - Column header customization
- **Props**:
  - `show: boolean` - Modal visibility
  - `onSaveSheetFn: (sheet, processor) => Promise` - Save callback
  - `enableDeprecatedGoogleDriveTranspose: boolean` - Feature flag
  - Sheet and processor data

## Store Provisioning

### storeProvisioning
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-drive/storeProvisioning.js`
- **Purpose**: Flux store factory for configuration state
- **Returns**:
  - Store with methods for accessing configuration, sheets, OAuth status
  - Methods: `getLocalState()`, `isAuthorized()`, `sheets`, `processors`
  - Mixins array for store subscription

### actionsProvisioning
- **Location**: `apps/kbc-ui/src/scripts/modules/ex-google-drive/actionsProvisioning.js`
- **Purpose**: Action creators factory for configuration mutations
- **Key Actions**:
  - `saveNewSheets(sheets)` - Add sheets to configuration
  - `saveEditingSheet(sheet, processor)` - Update sheet settings
  - `deleteSheet(sheet)` - Remove sheet from configuration
  - `toggleSheetEnabled(sheet)` - Enable/disable extraction
  - `updateLocalState(path, value)` - Update UI state (modals, selections)

## Google APIs Integration

### GooglePicker
- **Location**: `modules/google-utils/react/GooglePicker`
- **Purpose**: Native Google Picker for file selection
- **Configuration**:
  - Views: My Drive, Team Drive, Shared, Starred, Recent sheets
  - Dialog title and button label customizable
  - Requires Sheets API for sheet details

### Sheets API
- **Location**: `modules/google-utils/react/SheetsApi`
- **Purpose**: Load sheet metadata from selected files
- **Function**: `listSheets(fileId)` - Get sheets in a spreadsheet
- **Returns**: Array of sheet objects with ID and title

## User-Facing Features

### Feature 1: Sheet Selection and Discovery
- **Description**: Browse Google Drive and select sheets for extraction
- **Workflow**:
  1. Authorize Google Drive access
  2. Click "New Sheet" button
  3. Use Google Picker to select spreadsheet document
  4. System loads sheet list from selected files
  5. Search/filter sheets by name
  6. Select desired sheets (already-added sheets disabled)
  7. Save selection
- **Components**: SheetsManagerModal, GooglePicker, SheetsSelector

### Feature 2: Sheet Management
- **Description**: View, edit, enable/disable, and remove configured sheets
- **Workflow**:
  1. View list of configured sheets with output table mappings
  2. Click Edit to customize output table name and processing
  3. Toggle sheet enabled/disabled state
  4. Delete sheet from configuration
- **Components**: SheetsTable, OutputTableModal

### Feature 3: Output Configuration
- **Description**: Map Google Sheets to Keboola output tables with optional processing
- **Workflow**:
  1. In OutputTableModal, set output table name
  2. Configure processor options:
     - Header row (which row contains column names)
     - Transposition (pivot rows/columns)
     - Column header customization
  3. Specify primary keys for incremental loading
  4. Save output configuration
- **Components**: OutputTableModal, HeaderColumnsMultiSelect, ProcessorControls

### Feature 4: File Hierarchy Navigation
- **Description**: Browse multiple files with their sheets in hierarchical view
- **Features**:
  - Expandable file list
  - Shows sheet count per file
  - Search filters by file or sheet name
  - Auto-expand when searching

## Configuration Structure

### Sheet Object
```javascript
{
  fileId: 'google-drive-file-id',
  fileTitle: 'Spreadsheet Name',
  sheetId: 0,  // Google Sheets sheet ID
  sheetTitle: 'Sheet Name',
  enabled: true
}
```

### Processor Configuration (Per-Sheet)
```javascript
{
  fileName: 'fileId_sheetId.csv',
  headers: 1,  // Row number for headers (1-based)
  transpose: false,
  customHeaders: ['column1', 'column2'],
  primaryKey: ['id']  // For incremental loading
}
```

## State Management

- **Pattern Used**: Flux architecture with Immutable.js
- **Key Stores**:
  - Provisioned store with configuration data
  - Local state for UI (modals, selections)
- **Data Flow**:
  1. Configuration loaded via storeProvisioning
  2. User adds sheets → SheetsManagerModal state updated
  3. On save, actionsProvisioning.saveNewSheets called
  4. Configuration persisted to API
  5. Store updates, components re-render

### Local State Structure
```javascript
{
  SheetsManagerModal: {
    show: boolean,
    files: List<Map>  // Files and sheets selected for addition
  },
  TableModal: {
    sheet: Map,      // Sheet being edited
    processor: Map   // Output configuration
  }
}
```

## Dependencies

### Internal Modules
- `modules/google-utils/react/GooglePicker` - File selection UI
- `modules/google-utils/react/SheetsApi` - Sheets metadata API
- `modules/components/react/pages/GenericConfigBody` - Layout
- `modules/simplified-ui` - Legacy UI support

### External Packages
- `react` - v18+
- `immutable` - v4+ (data structures)
- `react-bootstrap` - Modal components
- `@tanstack/react-table` - v8+ (hierarchical selector)
- `bluebird` - Promise utilities
- `@keboola/design` - UI components (Button, Icon, Modal)

## Notable Patterns

### Google Picker Integration
- Uses native Google Picker dialog for UX consistency
- Multiple view templates (My Drive, Team Drive, Recent, Starred)
- Filters to spreadsheet documents only
- Returns file metadata (id, name)

### Concurrent Sheet Loading
- After file selection, concurrently loads sheet metadata
- `Promise.map(..., { concurrency: 3 })` limits parallel requests
- Updates file object with sheets array

### Hierarchical Selection
- SheetsSelector renders two-level tree (file > sheet)
- Supports selecting individual sheets or entire files
- Checkbox indeterminate states for mixed selections
- Search expands all sections automatically

### Local State Management
- UI state (modals, selections) stored separately from configuration
- Modals are single-purpose - add sheets or edit output
- State cleared after successful save

### Output Mapping
- Each sheet has independent output table name
- Processor configuration stored per sheet
- Column headers and primary keys configurable
- Transposition option for pivoting data

## Technical Debt & Observations

- **Modern TypeScript**: 
  - SheetsManagerModal and SheetsSelector use TypeScript
  - Good type definitions for complex data structures
  - Other components still in JSX

- **Flux Pattern Aging**:
  - Uses Flux architecture which is dated
  - Store provisioning pattern is convoluted
  - Could benefit from migration to Zustand or Context API

- **Concurrency Handling**:
  - Promise.map with concurrency works well
  - No rate limiting beyond concurrency count
  - Could add timeout handling

- **Error Handling**:
  - Limited error messages to user
  - API errors logged but not surfaced
  - Could improve user feedback

- **Performance**:
  - SheetsSelector rebuilds on search query change
  - No virtualization for large file/sheet lists
  - Acceptable for typical use cases (< 1000 files)

- **Feature Flags**:
  - `FEATURE_DEPRECATED_GOOGLE_DRIVE_TRANSPOSE` used for transposition
  - Indicates older feature being phased out
  - Code could be cleaned up once flag removed

## Code Examples

### Sheet Selection Handling
```typescript
const onPickSpreadsheet = (data: Record<string, any>) => {
  let files = this.props.files ?? List();

  // Add newly picked files
  data
    .filter((file: any) => file.type === 'document')
    .forEach((file: any) => {
      if (!files.find((f: Map) => f.get('id') === file.id)) {
        files = files.push(fromJS(file));
      }
    });

  // Concurrently load sheets from new files
  this.setState({ isLoading: true });
  return Promise.map(
    files.filter((file) => !file.has('sheets')),
    (file: Map) => {
      return listSheets(file.get('id')).then((data) => {
        const sheets = data.result.sheets.map((sheet) => ({
          sheetId: sheet.properties.sheetId,
          sheetTitle: sheet.properties.title,
        }));
        files = files.map((f: Map) =>
          f.get('id') === file.get('id') ? f.set('sheets', fromJS(sheets)) : f
        );
      });
    },
    { concurrency: 3 }
  )
    .then(() => this.props.onFilesChange(files))
    .finally(() => this.setState({ isLoading: false }));
};
```

### Saving Selected Sheets
```typescript
const handleSave = () => {
  const files = this.props.files ?? List();

  // Transform selected sheets to sheet objects
  const itemsToSave = files
    .map((file: Map) => {
      return file
        .get('sheets', List())
        .filter((sheet: Map) => !!sheet.get('selected'))
        .map((sheet: Map) => {
          return fromJS({
            fileId: file.get('id'),
            fileTitle: file.get('name'),
            sheetId: sheet.get('sheetId'),
            sheetTitle: sheet.get('sheetTitle'),
          });
        });
    })
    .flatten(true);

  // Save and clear selections
  this.props.onSaveSheets(itemsToSave).then(() => {
    this.props.onFilesChange(
      files.map((file: Map) => {
        return file.set(
          'sheets',
          file.get('sheets', List()).map((sheet: Map) => sheet.set('selected', false))
        );
      })
    );
    this.props.onHide();
  });
};
```

### Hierarchical Table Rendering
```typescript
// SheetsSelector uses TanStack React Table
const columns = useMemo(() => [
  {
    accessorKey: 'data',
    header: ({ table }: any) => (
      <Checkbox
        checked={isAllSelected}
        indeterminate={isSomeSelected}
        onChange={() => selectSheets(rows.flat(), !isAllSelected && !isSomeSelected)}
      />
    ),
    cell: ({ row }: any) => {
      if (row.depth === 1) {  // Sheet level
        return (
          <Checkbox
            checked={row.original.data.sheet.get('selected')}
            onChange={(checked) => selectSheets([row.original.data], checked)}
          />
        );
      }
      // File level - show parent checkbox
      return <Checkbox {...checkboxProps} />;
    },
  },
], [selectSheets, isSaved]);
```

## Related Modules

- `modules/oauth-v2` - OAuth credential management
- `modules/google-utils` - Shared Google API utilities (Picker, Sheets API)
- `ex-google-analytics-v4` - Similar OAuth and profile selection patterns
- `ex-google-ads` - Similar account selection UI
- `modules/configurations` - Generic configuration management

## Testing

- **Coverage**: Limited - components lack unit tests
- **Key Test Areas** (if tests existed):
  - Sheet selection logic
  - File/sheet hierarchy rendering
  - Output configuration persistence
  - Google Picker integration
  - Error handling
- **Testing Approach**: Jest with React Testing Library (for modern components)

## Migration Notes

- **To Modern Stack**:
  - Move storeProvisioning/actionsProvisioning to Zustand stores
  - Convert remaining JSX components to TypeScript
  - Replace Google Picker with custom file browser if API changes
  - Add comprehensive component tests
  - Consider moving to React Query for API calls
