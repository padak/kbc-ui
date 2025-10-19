# Writer Modules Overview

This document provides a comprehensive overview of all writer modules in the Keboola UI application. Writers are components that export data from Keboola Storage to external destinations.

## Writer Modules Summary

| Module | Destination | Auth Method | Features | Status |
|--------|-------------|-------------|----------|--------|
| [wr-google-sheets](wr-google-sheets.md) | Google Sheets | OAuth | Create/append to sheets | Full |
| [wr-google-drive](wr-google-drive.md) | Google Drive | OAuth | Create/append/replace files | Full |
| [wr-aws-s3](wr-aws-s3.md) | AWS S3 | IAM/Role | S3 path configuration | Full |
| [wr-onedrive](wr-onedrive.md) | Microsoft OneDrive | OAuth | Excel workbooks | Full |
| [wr-storage](wr-storage.md) | Keboola Storage | Internal | Cross-project transfer | Full |
| [wr-db](wr-db.md) | Multiple Databases | DB-specific | 14+ database support | Full |
| [wr-google-bigquery-v2](wr-google-bigquery-v2.md) | Google BigQuery | Service Account | Clustering, partitioning | Full |

## Module Categories

### Cloud Storage Writers
- **wr-google-sheets**: Spreadsheet export to Google Sheets
- **wr-google-drive**: File export to Google Drive
- **wr-aws-s3**: File export to AWS S3
- **wr-onedrive**: Excel export to Microsoft OneDrive
- **wr-storage**: Internal Keboola Storage transfer

### Data Warehouse Writers
- **wr-db**: Multi-database support (PostgreSQL, MySQL, Snowflake, Redshift, Oracle, etc.)
- **wr-google-bigquery-v2**: Google BigQuery with advanced features (clustering, partitioning)

## Common Patterns

### Authentication Methods

1. **OAuth 2.0** (Google Sheets, Google Drive, OneDrive)
   - User-managed authorization
   - Tokens stored securely
   - Managed by oauth-v2 module

2. **Service Account** (Google BigQuery)
   - JSON key-based authentication
   - Direct API access
   - Suitable for service-to-service

3. **Credentials** (AWS S3)
   - IAM access keys or STS roles
   - Cross-account support via external ID
   - Multiple authentication methods

4. **Database Credentials** (wr-db)
   - Database-specific formats
   - Encrypted password storage
   - Connection pooling support

### Configuration Levels

1. **Index Level** (Component-wide)
   - Authentication/credentials
   - Global settings
   - Target project/workspace

2. **Row Level** (Per-table export)
   - Source table selection
   - Destination configuration
   - Load mode/format options

### State Management Patterns

1. **Flux + Immutable.js** (wr-google-sheets, wr-google-drive)
   - Legacy but stable pattern
   - Used for interactive components

2. **Redux** (wr-db)
   - Complex state management
   - Multiple database support

3. **Configuration-Driven** (wr-storage, wr-onedrive, wr-google-bigquery-v2)
   - Adapter pattern for serialization
   - Simpler state model

## Feature Comparison

### Load Modes

| Feature | Description | Writers Supporting |
|---------|-------------|-------------------|
| Full Replace | Overwrite entire destination | All |
| Append | Add to existing destination | wr-google-sheets, wr-google-drive, wr-db, wr-google-bigquery-v2 |
| Incremental | Update based on primary key | wr-db, wr-google-bigquery-v2 |
| Delete Mode | Delete before re-insert | wr-db |

### Advanced Features

| Feature | Purpose | Writers |
|---------|---------|---------|
| Clustering | Optimize query performance | wr-google-bigquery-v2 |
| Partitioning | Organize data/reduce costs | wr-google-bigquery-v2 |
| Type Mapping | Override column types | wr-db, wr-google-bigquery-v2 |
| Path Organization | Organize files/tables | wr-aws-s3, wr-google-drive |
| Staging Modes | Different transfer methods | wr-db |

## Documentation Structure

Each writer module documentation includes:

1. **Overview**: Purpose and key capabilities
2. **File Structure**: Directory layout and key files
3. **Routes & Configuration**: How routing is configured
4. **Key Components**: Main UI components and their responsibilities
5. **State Management**: Data flow and store configuration
6. **Authentication**: How credentials are managed
7. **Configuration Workflow**: Step-by-step user workflow
8. **API Endpoints**: External API calls and integrations
9. **Dependencies**: Internal and external module dependencies
10. **Notable Patterns**: Code patterns and best practices
11. **User-Facing Features**: What end users can do
12. **Technical Debt**: Known issues and improvement opportunities
13. **Related Modules**: Cross-module dependencies
14. **Testing**: Test scenarios and coverage

## Key Differences

### wr-google-sheets vs wr-google-drive

| Aspect | Sheets | Drive |
|--------|--------|-------|
| Destination | Google Sheets spreadsheets | Google Drive files |
| Format | Native spreadsheet | CSV/Excel files |
| Write Modes | Update (append), Create | Create, Append, Replace |
| Use Case | Collaboration, structured data | File storage, multiple formats |

### wr-db (Multi-database)

Supports 14+ database types:
- PostgreSQL, MySQL, MariaDB
- MSSQL, SQL Server
- Snowflake, Redshift
- Oracle, Exasol
- Azure Synapse
- Hive, Impala
- Firebolt, others

Each with database-specific:
- Connection parameters
- Type mappings
- Staging modes
- Load strategies

### wr-google-bigquery-v2 (Data Warehouse)

Specialized for BigQuery:
- Service Account authentication
- Dataset/table hierarchy
- Clustering configuration
- Partitioning strategies
- Advanced type system
- Load job monitoring

## Dependencies Map

```
All Writers depend on:
├── components (base framework)
├── storage (source tables)
├── configurations (utilities)
└── oauth-v2 (if OAuth-based)

wr-db additionally:
├── workspaces (provisioning)
└── mapping (database-specific)

wr-google-bigquery-v2:
└── service account management
```

## Development Guidelines

### Adding a New Writer Module

1. **Create Module Directory**: `src/scripts/modules/wr-[name]/`

2. **Implement Core Files**:
   - `routes.js` - Route configuration
   - React components for UI
   - Adapters for configuration conversion

3. **Handle Authentication**:
   - Use oauth-v2 for OAuth-based
   - Implement credentials management
   - Store credentials securely

4. **Configure State Management**:
   - Choose: Flux, Redux, or Config-driven
   - Implement adapters for serialization
   - Handle local state for UI

5. **Create Documentation**:
   - Follow template in `_TEMPLATE.md`
   - Document authentication flow
   - List configuration options
   - Include workflow examples

### Common Implementation Steps

1. **Routes**: Define URL structure and lazy loading
2. **Components**: Create React components for UI
3. **Adapters**: Implement configuration parsing/serialization
4. **State**: Set up store/state management
5. **API**: Integrate with backend APIs
6. **Tests**: Write unit and integration tests
7. **Docs**: Document module and usage

## Performance Considerations

### Large Data Exports

1. **Streaming**: Use streaming for large datasets
2. **Batching**: Process data in batches
3. **Compression**: Enable compression where available
4. **Staging**: Use staging (S3, staging tables) for efficiency

### Connection Optimization

1. **Connection Pooling**: For database writers
2. **Rate Limiting**: Respect API rate limits
3. **Retry Logic**: Handle transient failures
4. **Monitoring**: Track job execution times

## Security Considerations

### Credential Storage

- Passwords encrypted with leading `#` prefix
- Secure storage in API
- Never log credentials
- Clear sensitive data from memory

### OAuth Tokens

- Stored in `authorization.oauth_api.credentials`
- Refresh handled by oauth-v2 module
- Revoke access on logout

### Access Control

- Respect workspace permissions
- Validate database connections
- Check API permissions
- Handle authentication errors

## Testing Strategy

### Unit Tests
- Configuration parsing
- Adapter logic
- State management
- Component rendering

### Integration Tests
- Credential validation
- Full configuration workflow
- Data export execution
- Error handling

### E2E Tests
- Complete user workflows
- Cross-browser compatibility
- Error scenarios
- Performance with large data

## Future Improvements

### Across All Writers
- TypeScript migration
- Modern React hooks
- TanStack Query for server state
- Improved error messages
- Better data previews

### Specific Modules
- wr-db: Database-specific UI customization
- wr-google-bigquery-v2: Query impact preview
- Cloud Storage: Folder hierarchy UI
- All: Progress indicators for long operations

## Resources

- [Keboola API Documentation](https://developers.keboola.com/)
- [Storage API](https://developers.keboola.com/apis/storage/)
- [Component Configuration](https://developers.keboola.com/components/api/configuration/)
- [OAuth V2 Flow](https://developers.keboola.com/oauth/)

