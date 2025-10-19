# Writer Modules Documentation Index

Complete documentation for all writer modules in the Keboola UI application. Writers are components that export data from Keboola Storage to external destinations.

## Quick Links

### Cloud Storage & File Writers
1. **[wr-google-sheets](wr-google-sheets.md)** - Export to Google Sheets
   - OAuth authentication
   - Spreadsheet and sheet creation
   - Append/replace modes
   - Real-time data sharing

2. **[wr-google-drive](wr-google-drive.md)** - Export to Google Drive
   - OAuth authentication
   - Folder and file organization
   - Create/append/replace modes
   - CSV/Excel format options

3. **[wr-aws-s3](wr-aws-s3.md)** - Export to AWS S3
   - IAM credentials or STS roles
   - S3 path configuration
   - CSV formatting options
   - Incremental/replace modes

4. **[wr-onedrive](wr-onedrive.md)** - Export to Microsoft OneDrive
   - Microsoft OAuth authentication
   - Workbook and worksheet creation
   - Excel format support
   - Cloud collaboration

### Data Warehouse Writers
5. **[wr-db](wr-db.md)** - Multi-Database Writer
   - Support for 14+ databases:
     - PostgreSQL, MySQL, MariaDB
     - MSSQL, SQL Server
     - Snowflake, Redshift
     - Oracle, Exasol
     - Azure Synapse
     - Hive, Impala, Firebolt
   - Database-specific type mapping
   - Staging modes (S3, SCP, direct)
   - Incremental/delete load modes
   - Complex credential management

6. **[wr-google-bigquery-v2](wr-google-bigquery-v2.md)** - Google BigQuery
   - Service Account authentication
   - Dataset management
   - Advanced features:
     - Clustering for query optimization
     - Partitioning for cost reduction
     - Column type overrides
     - Load type configuration

### Internal Writers
7. **[wr-storage](wr-storage.md)** - Keboola Storage Transfer
   - Cross-project/workspace data transfer
   - Internal authentication
   - Table mapping
   - Multi-table support

## Documentation for Each Module

### File Structure
Each module documentation includes:
- Overview and purpose
- File structure
- Routes and configuration
- Key components
- State management
- Authentication flow
- Configuration workflow
- API endpoints
- Dependencies
- Notable patterns
- User-facing features
- Technical debt/observations
- Related modules
- Testing approach

### Common Sections

#### Overview
High-level description of what the module does and its key capabilities.

#### Routes & Configuration
How the component's routing is structured, typically:
- Index level for component-wide settings (credentials, target project)
- Row level for per-table export settings

#### Key Components
Main React components with:
- Purpose
- Props and their types
- State management
- Key methods
- Configuration structure

#### Authentication
How credentials are managed:
- OAuth flow for Google products
- Service accounts for BigQuery
- Database-specific credentials for wr-db
- IAM/roles for AWS S3

#### Configuration Workflow
Step-by-step user journey:
1. Setting up authentication
2. Configuring destination
3. Mapping source tables
4. Setting export options
5. Enabling and running

#### API Endpoints
External API calls and their purposes

#### Dependencies
Internal modules and external packages used

#### Technical Debt & Observations
- Legacy patterns still in use
- Areas for improvement
- Complexity hotspots
- Migration notes

## Key Concepts

### Authentication Methods

| Method | Writers | Use Case |
|--------|---------|----------|
| OAuth 2.0 | Google Sheets, Drive, OneDrive | User-managed auth, SaaS APIs |
| Service Account | BigQuery | Service-to-service, GCP APIs |
| Credentials (Key/Secret) | AWS S3 | AWS API access |
| Database Native | wr-db | Direct database connection |

### Configuration Levels

Writers typically have two configuration levels:

1. **Index (Component-wide)**
   - Credentials/authentication
   - Target project or workspace
   - Default settings

2. **Row (Per-table)**
   - Source table selection
   - Destination configuration
   - Load mode and format options

### Load Modes

| Mode | Behavior | Use Case |
|------|----------|----------|
| Append | Add rows to destination | Logs, events, incremental |
| Replace | Overwrite destination | Snapshots, dimensions |
| Incremental | Update on primary key | Fact tables, slowly changing |
| Delete Mode | Delete then insert | Conditional updates |

## State Management Patterns

### Flux + Immutable.js
Used by: wr-google-sheets, wr-google-drive
- Established pattern
- Good for interactive UIs
- Complex but predictable

### Redux
Used by: wr-db
- Complex state requirements
- Many databases with different configs
- Full action/reducer pattern

### Configuration-Driven
Used by: wr-storage, wr-onedrive, wr-google-bigquery-v2
- Adapters for serialization
- Simpler state model
- Prefer composition

## Development Guide

### To Understand a Writer

1. Read the Overview section
2. Understand the Routes & Configuration
3. Review Key Components
4. Check Authentication flow
5. Follow Configuration Workflow
6. Look at Code Examples in Notable Patterns

### To Modify a Writer

1. Understand the current state management pattern
2. Locate the relevant component/adapter
3. Follow existing patterns for consistency
4. Update tests
5. Update documentation

### To Add a New Writer

1. Create module: `apps/kbc-ui/src/scripts/modules/wr-[name]/`
2. Implement routes.js with lazy loading
3. Create React components for UI
4. Implement adapters for configuration
5. Set up state management (choose pattern)
6. Integrate authentication
7. Write tests
8. Create documentation following this template

## Quick Reference

### Most Complex
- **wr-db**: 14+ databases, complex staging, type mapping
- **wr-google-bigquery-v2**: Advanced BigQuery features (clustering, partitioning)

### Most Straightforward
- **wr-storage**: Simple internal transfer
- **wr-aws-s3**: Straightforward S3 export
- **wr-onedrive**: Similar to Google products

### Best for Learning
1. Start: wr-storage (simplest)
2. Progress: wr-aws-s3, wr-onedrive
3. Intermediate: wr-google-sheets, wr-google-drive
4. Advanced: wr-db, wr-google-bigquery-v2

## Common Tasks

### Find Where X Happens
- Config saved? → Look in adapters/
- Component renders? → Look in react/components/
- Data fetched? → Check WritersApi.js or similar
- OAuth? → Check oauth-v2 module
- State updates? → Check actionCreators.js or stores/

### Add New Feature
1. Plan: Which component/adapter?
2. Implement: Follow existing patterns
3. Test: Add unit/integration tests
4. Document: Update docs

### Debug Issue
1. Check browser console for errors
2. Use Redux DevTools (if Redux)
3. Check API calls in Network tab
4. Verify configuration structure
5. Check test files for expected behavior

## Related Documentation

- [WRITERS_OVERVIEW.md](WRITERS_OVERVIEW.md) - Comprehensive overview of all writers
- [_TEMPLATE.md](_TEMPLATE.md) - Template for creating module documentation
- [Main Module Index](README.md) - Index of all modules

## Architecture Overview

```
Writer Module Structure
├── routes.js                    # Route definition
├── [actionCreators.js]         # State management (if using Redux)
├── [store.js]                  # Store setup (if using Redux)
├── react/
│   ├── components/             # React components
│   └── pages/                  # Page components
├── adapters/                   # Config parsing/serialization
├── [mapping/]                  # Database-specific mappings (if applicable)
└── [templates/]                # Templates for DB-specific configs
```

## Common Dependencies

All writers depend on:
- `components` - Base component framework
- `storage` - Source table data
- `configurations` - Configuration utilities

Most OAuth writers depend on:
- `oauth-v2` - OAuth authentication

Database writer depends on:
- `workspaces` - Workspace management
- `mapping` - Database adapters

## Next Steps

1. **To Learn a Module**: Pick a module and read its documentation top to bottom
2. **To Modify Code**: Use documentation + code inspection
3. **To Add Features**: Reference existing patterns in similar modules
4. **To Debug**: Use documentation to understand data flow

---

*Last Updated: October 2024*
*Documentation Format Version: 2.0*

