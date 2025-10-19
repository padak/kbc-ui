# Module: ex-dropbox-v2 (Dropbox File Extractor V2)

## Overview

The ex-dropbox-v2 module provides extraction capabilities for CSV files stored in Dropbox. It integrates with the Dropbox Chooser widget for file selection and supports manual Dropbox link insertion. The module manages file metadata, deduplication, and automatic output table naming based on Dropbox file information.

## File Structure

```
ex-dropbox-v2/
├── routes.ts                           # Route definition
├── Index.tsx                           # Main configuration component
├── actions/
│   └── ApplicationActions.ts           # Helper functions for file naming/sorting
└── components/
    └── DropboxFileSelectorModal.tsx   # File selection UI with tabs
```

## Routes & Configuration

### Route Configuration

```typescript
{
  name: componentId,
  path: `${componentId}/:config`,
  title: genericComponentTitle(componentId),
  requireData: [(params) => configRequiredData(componentId, params.config)],
  poll: configPoll(componentId),
  lazy: async () => {
    const Index = await import('./Index');
    return { Component: Index.default };
  }
}
```

## Key Components

### Index.tsx (Main Component)
- **Purpose**: Main configuration interface
- **Framework**: React hooks (useState, useStores)
- **State Management**: Uses `useStores()` for Flux integration
- **Props**: None (uses hooks to access stores)
- **Configuration Structure**:
  ```typescript
  {
    parameters: {
      config: {
        dropboxFiles: [
          {
            name: string;           // Display name
            '#link': string;        // Encrypted Dropbox link
            bytes?: number;         // File size
            timestamp: number;      // Unix timestamp when added
            hash: string;           // MD5 hash of filename
            output: string;         // Output table name
          }
        ]
      }
    }
  }
  ```

### File Selection Flow

#### Dropbox Chooser Integration
- **Component**: `DropboxChooser` from `react-dropbox-chooser`
- **Configuration**:
  - appKey: Retrieved from `process.env.DROPBOX_APP_KEY`
  - multiselect: false (single file only)
  - extensions: ['.csv']
- **Success Callback**: Receives file object from Dropbox
  - File object includes: name, link, bytes

#### Manual Link Insertion
- **Alternative Tab**: "Insert Link Manually"
- **Fields**:
  - Link: Full Dropbox share link
  - Name: Display name for output
- **Auto-Population**: Name auto-filled from link if empty
- **Link Cleaning**: Removes query parameters (`?dl=0` → clean URL)

### DropboxFileSelectorModal.tsx
- **Purpose**: File selection UI with two methods
- **Props**:
  - `show`: Modal visibility
  - `onHide`: Close handler
  - `selectedDropboxFiles`: Currently selected files
  - `handleCsvSelectChange`: Callback for Dropbox Chooser
  - `saveConfig`: Save handler for manual insertion
  - `cancelConfig`: Cancel handler
  - `canSaveConfig`: Save button enable state
  - `isSaving`: Save operation in progress
- **Tabs**:
  1. **Choose From Dropbox**: Uses Dropbox Chooser widget
  2. **Insert Link Manually**: Manual link and name entry

### Features

#### File Selection Methods

1. **Dropbox Chooser** (Automatic)
   - User clicks "Choose from Dropbox"
   - Dropbox file browser opens in popup
   - User selects CSV file
   - Returns file with name, link, bytes
   - Shows selected filename in modal

2. **Manual Link** (Manual)
   - User tabs to "Insert Link Manually"
   - Pastes Dropbox sharing link
   - Optionally customizes display name
   - Name auto-filled from link filename
   - Creates manual insertion record

#### File Metadata Tracking

For each file, module tracks:
- **name**: Dropbox filename (e.g., "sales_data.csv")
- **#link**: Encrypted Dropbox share URL (# = encrypted)
- **bytes**: File size in bytes (for UI display)
- **timestamp**: Unix timestamp when added (for dedup)
- **hash**: MD5 hash of filename (for dedup)
- **output**: Output table name (sanitized, auto-generated)
- **manualInsert**: Boolean flag (set for manually added)

#### Output Table Naming

1. **Auto-Generated Names**:
   - Derived from Dropbox filename
   - Example: "sales_data.csv" → "sales_data"
   - Sanitized for valid table names
   - Uses `string.sanitizeKbcTableIdString()`

2. **Deduplication**:
   - Multiple selections of same file tracked
   - Hash prevents exact duplicates
   - Merges with existing entries by hash
   - Keeps most recent timestamp

3. **Name Conflicts**:
   - When multiple files → same output name
   - Appends hash suffix to conflicting entries
   - Ensures unique table names
   - Only applies to conflicts (not all)

## Configuration Storage

### Configuration Structure

```json
{
  "parameters": {
    "config": {
      "dropboxFiles": [
        {
          "name": "sales_data.csv",
          "#link": "https://encrypted.dropbox.url",
          "bytes": 1024000,
          "timestamp": 1697553600,
          "hash": "a1b2c3d4",
          "output": "sales_data",
          "manualInsert": false
        },
        {
          "name": "Custom Report",
          "#link": "https://encrypted.dropbox.url2",
          "bytes": 512000,
          "timestamp": 1697553601,
          "hash": "x9y8z7w6",
          "output": "custom_report",
          "manualInsert": true
        }
      ]
    }
  }
}
```

## State Management

### Pattern Used
**Redux-like Actions + Flux Store Integration**

- `useStores()` hook retrieves app state
- Local component state via `useState()`
- Configuration updates via `actions.saveComponentConfigData()`
- Local state via `actions.updateLocalState()`

### Key State Paths

1. **Configuration State**:
   - `['parameters', 'config', 'dropboxFiles']` - File list

2. **Local State**:
   - `['selectedDropboxFiles']` - Files being added
   - Used for modal interaction

### Data Flow

```
User clicks "New file"
    ↓
Modal opens
    ↓
User selects from Dropbox OR inserts link
    ↓
selectedDropboxFiles updated in local state
    ↓
User clicks "Create file"
    ↓
saveConfig() called
    ↓
Files merged with existing
    ↓
Deduplication applied
    ↓
Unique names generated
    ↓
Configuration saved
    ↓
Modal closes
    ↓
Table reloads with new files
```

## File Deduplication Logic

### Algorithm

```typescript
1. Merge: [...oldFiles, ...newFiles]
2. Index by hash: Group files by MD5(filename)
3. Keep newest: For each hash, keep most recent timestamp
4. Handle conflicts:
   - Group output names
   - If multiple files → same output name:
     - Sort by timestamp (oldest first)
     - First keeps original name
     - Rest append hash suffix (e.g., "_a1b2")
5. Return: Deduplicated array sorted by timestamp
```

### Example

```
User adds:
- sales_data.csv (new)
- sales_data.csv (same file, different link)

Result:
- Single entry with newer timestamp
- Or merged with unique output names if links differ
```

## File Deletion

### Delete Handler

- User clicks delete icon in file table
- `handleDeletingSingleElement(index)` called
- Removes file at index from configuration
- Saves configuration with change description
- Triggers change description: "Delete file {name}"

### Deletion Confirmation

- No confirmation dialog (direct deletion)
- Change shows in action history
- Reversible via undo (if available)

## File Extraction (Run Single File)

### Run Individual File

User can run extraction for single file:

1. Clicks "Run Extraction" on file row
2. `handleUploadingSingleElement()` creates run params:
   ```typescript
   {
     config: configId,
     configData: {
       parameters: {
         config: {
           dropboxFiles: [{single_file}]
         }
       }
     }
   }
   ```
3. Component runs with just that file
4. Results stored in corresponding output table

### Run All Files

- Default behavior when running component
- Processes all configured files
- Parallel or sequential based on component

## User-Facing Workflows

### Workflow 1: Add File via Dropbox Chooser
1. Click "New file" button
2. Modal opens, "Choose From Dropbox" tab active
3. Click "Choose from Dropbox" button
4. Browser pop-up opens (disable pop-up blocker)
5. User navigates and selects CSV file
6. Pop-up closes, filename displayed in modal
7. Click "Create file"
8. File added to configuration
9. Modal closes

### Workflow 2: Add File via Manual Link
1. Click "New file" button
2. Modal opens
3. Click "Insert Link Manually" tab
4. Paste Dropbox sharing link
5. Name auto-fills from filename
6. Optionally customize name
7. Click "Create file"
8. File added to configuration
9. Modal closes

### Workflow 3: Run Extraction for Single File
1. View file list in configuration
2. Click "Run Extraction" in row actions
3. Component runs extraction for that file only
4. Results appear in corresponding output table
5. Can view results immediately

### Workflow 4: Delete File from Configuration
1. View file list
2. Click delete icon (trash) in row
3. File removed from configuration
4. Change reflected immediately
5. Output table remains (if already created)

## Notable Patterns

1. **Dropbox Chooser Widget**:
   - Uses npm package `react-dropbox-chooser`
   - Provides native Dropbox UI
   - Requires app key from environment
   - Returns rich file metadata

2. **Manual Insertion Support**:
   - Dual-method approach
   - Handles shared links and personal links
   - Auto-generates sensible names
   - Flexible for various use cases

3. **File Deduplication**:
   - Intelligent merging of file list
   - Prevents duplicate entries
   - Handles name conflicts
   - Preserves user intent

4. **Metadata Hashing**:
   - MD5 hash of filename for dedup key
   - Timestamp for version tracking
   - Both used in conflict resolution

5. **Encryption**:
   - Links prefixed with `#` for encryption
   - Sensitive URLs never exposed in logs
   - Backend handles encryption/decryption

## Configuration Objects

### DropboxFile Type
```typescript
type DropboxFile = {
  name: string;              // Display name
  manualInsert: boolean;     // User manually entered
  link: string;              // Dropbox share link (not encrypted)
  bytes?: number;            // File size
}
```

### Stored DropboxFile Type
```typescript
{
  name: string;              // Dropbox filename
  '#link': string;           // Encrypted link
  bytes?: number;            // File size
  timestamp: number;         // When added (Unix)
  hash: string;              // MD5(name) for dedup
  output: string;            // Output table name
  manualInsert?: boolean;    // Flag for manual
}
```

## Application Actions Helper

### Functions (ApplicationActions.ts)

1. **getDestinationName(filename)**
   - Extracts table name from filename
   - Removes extension and path
   - Used for auto-naming

2. **sortTimestampsInAscendingOrder()**
   - Comparator for sorting by timestamp
   - Ascending: Oldest first

3. **sortTimestampsInDescendingOrder()**
   - Comparator for sorting by timestamp
   - Descending: Newest first

## Error Handling

### Connection Errors
- Dropbox Chooser: Handled by widget
- Network errors: Shown in modal
- Auth errors: User should reauthenticate

### Validation
- Link format validation
- File size limits (if enforced)
- Output table name validation

### User Feedback
- Loading states during save
- Success/error messages
- Change descriptions for audit

## Technical Debt & Observations

1. **Legacy Immutable.js**:
   - Uses Immutable.js for state
   - Modern codebase prefers plain objects
   - Should migrate to modern patterns

2. **React Hooks + Legacy Store**:
   - Mixing hooks with Flux pattern
   - Creates complexity
   - Should fully migrate to hooks + TanStack Query

3. **Pop-up Dependency**:
   - Dropbox Chooser requires pop-up enabled
   - Users may not know to disable blocker
   - Could improve UX with guidance

4. **Manual Link Validation**:
   - Limited validation of Dropbox links
   - No preview of file before adding
   - Could test link validity upfront

5. **Single File at a Time**:
   - Chooser: multiselect = false
   - Requires multiple clicks for batch adds
   - Could support multi-select

## API Integration

### Dropbox API

1. **Chooser Widget**
   - Part of Dropbox API
   - Requires app key
   - OAuth handled by Dropbox

2. **File Extraction** (Backend)
   - Component backend downloads files
   - Processes CSV format
   - Stores in Keboola Storage

### Component Backend Actions

- File download via Dropbox API
- CSV parsing
- Storage table management

## Related Modules

- `modules/components` - Component management
- `modules/storage` - Storage table operations
- `@keboola/design` - UI components
- `@keboola/utils` - String utilities
- `react-dropbox-chooser` - External Dropbox widget

## Testing

- File deduplication algorithm tests
- Name conflict resolution tests
- Configuration serialization tests
- Component render tests
- Modal interaction tests
- File list management tests

## References

- [Dropbox Chooser](https://www.dropbox.com/developers/chooser)
- [Dropbox SDK for JavaScript](https://github.com/dropbox/dropbox-sdk-js)
- [Dropbox API Documentation](https://www.dropbox.com/developers/documentation)
- [react-dropbox-chooser Package](https://www.npmjs.com/package/react-dropbox-chooser)

## Environment Variables

```env
DROPBOX_APP_KEY=<your_dropbox_app_key>
```

Required for Dropbox Chooser functionality. Obtained from Dropbox App Console.
