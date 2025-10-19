# Module: ex-onedrive

## Overview

OneDrive Extractor enables extraction of files from Microsoft OneDrive and SharePoint into Keboola Storage. Provides file selection and OAuth-based Microsoft authentication.

**Component ID**: `keboola.ex-onedrive`

## File Structure

```
ex-onedrive/
├── routes.js
├── adapters/
│   ├── conform.js
│   ├── index.js
│   └── row.js
├── react/
│   ├── AdvancedSettingsSection.tsx
│   ├── Row.tsx
│   └── ...
└── microsoftGraphApi.js
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| Index | AdvancedSettingsSection | Advanced settings and connection options |
| Row | Row | File selection and extraction configuration |

## Key Components

### AdvancedSettingsSection
- **Location**: `react/AdvancedSettingsSection.tsx`
- **Purpose**: Configure advanced OneDrive/SharePoint settings
- **Features**: Drive selection, folder options, performance settings

### Row Component
- **Location**: `react/Row.tsx`
- **Purpose**: Configure individual file extraction
- **Props**: 
  - `disabled`: Disable state
  - `onChange`: Change handler
  - `value`: Configuration
- **Features**: File selection, output table naming

### Microsoft Graph API
- **Location**: `microsoftGraphApi.js`
- **Purpose**: Microsoft Graph API integration
- **Functions**: File listing, metadata retrieval, OAuth handling

## Adapters

| Adapter | Purpose |
|---------|---------|
| `indexAdapter` | Index-level configuration (drives) |
| `rowAdapter` | Row-level configuration (files) |
| `conform` | Configuration validation |

## API Endpoints

| Method | Endpoint | Purpose | Response Type |
|--------|----------|---------|---------------|
| GET | `/api/components/{componentId}/configs/{configId}` | Retrieve config | Config |
| POST | `/api/components/{componentId}/configs/{configId}` | Save config | Config |

## State Management

- **Pattern Used**: Adapter-based with conform
- **Data Flow**: 
  1. Index configuration for drives/folders
  2. Row configuration for files
  3. Conformation via adapters
  4. Persisted to storage

## Dependencies

### Internal Modules
- `modules/configurations` - Configuration utilities
- `modules/configurations/utils` - Column types

### External Packages
- `immutable` - Data structures
- React - UI framework

### Microsoft Integration
- Microsoft Graph API for file access
- Azure AD for OAuth authentication

## Notable Patterns

1. **Microsoft Integration**: Direct Microsoft Graph API usage
2. **Adapter-based Config**: Separate adapters for index/row
3. **File-based Extraction**: Similar to Dropbox and Google Drive

## User-Facing Features

### Feature 1: OneDrive/SharePoint Connection
- **Description**: Connect to Microsoft OneDrive or SharePoint
- **Workflow**: Authenticate via Microsoft account → Grant access → Select drive/site
- **Components**: OAuth flow, advanced settings section

### Feature 2: File Selection
- **Description**: Browse and select files from OneDrive
- **Workflow**: Navigate folders → Select files → Configure output
- **Components**: Row component with file browser

### Feature 3: Advanced Settings
- **Description**: Configure advanced extraction options
- **Workflow**: Select drive type → Set folder options → Configure performance
- **Components**: AdvancedSettingsSection

## Related Modules

- `ex-dropbox-v2` - Similar cloud file extractor
- `ex-google-drive` - Google Cloud file extractor
- `configurations` - Base configuration module

## Technical Notes

- Microsoft Graph API integration
- OAuth-based authentication
- Supports both OneDrive personal and SharePoint
- File-based extraction (not database-based)
