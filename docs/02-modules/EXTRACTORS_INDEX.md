# Extractor Modules - Quick Reference Index

## Quick Navigation

| # | Module | Component ID | Type | Auth Method | Pattern |
|---|--------|---|------|-----|---------|
| 1 | [ex-aws-s3](ex-aws-s3.md) | `keboola.ex-aws-s3` | File | AWS Keys | Adapter |
| 2 | [ex-azure-blob](ex-azure-blob.md) | `keboola.ex-azure-blob-storage-v2` | File | Azure | Adapter |
| 3 | [ex-db-generic](ex-db-generic.md) | Multiple (MySQL, PostgreSQL, etc.) | Query | DB URIs | Provisioning |
| 4 | [ex-dropbox-v2](ex-dropbox-v2.md) | `keboola.ex-dropbox-v2` | File | OAuth2 | Hook-based |
| 5 | [ex-email-attachments](ex-email-attachments.md) | `keboola.ex-email-attachments` | File | OAuth2 | Provisioning |
| 6 | [ex-facebook](ex-facebook.md) | 6 variants | Query | OAuth2 | Provisioning |
| 7 | [ex-ftp](ex-ftp.md) | Multiple variants | File | User/SSH | Adapter |
| 8 | [ex-generic](ex-generic.md) | `keboola.ex-generic-v2` | Query | 7+ methods | Complex |
| 9 | [ex-google-ads](ex-google-ads.md) | `keboola.ex-google-ads` | Query | OAuth2 | Adapter |
| 10 | [ex-google-analytics-v4](ex-google-analytics-v4.md) | `keboola.ex-google-analytics-v4` | Query | OAuth2 | Simplified |
| 11 | [ex-google-bigquery-v2](ex-google-bigquery-v2.md) | 2 variants | Query | Service Acct | Adapter |
| 12 | [ex-google-drive](ex-google-drive.md) | `keboola.ex-google-drive` | File | OAuth2 | Provisioning |
| 13 | [ex-http](ex-http.md) | `keboola.ex-http` | Query | API Key/Basic | Adapter |
| 14 | [ex-mongodb](ex-mongodb.md) | `keboola.ex-mongodb` | Query | URI/Auth | Provisioning |
| 15 | [ex-onedrive](ex-onedrive.md) | `keboola.ex-onedrive` | File | OAuth2 | Adapter |
| 16 | [ex-storage](ex-storage.md) | `keboola.ex-storage` | Cross-proj | Token | Adapter |

## By Architecture Pattern

### Adapter-based (Simple, Testable)
- [ex-aws-s3](ex-aws-s3.md)
- [ex-azure-blob](ex-azure-blob.md)
- [ex-ftp](ex-ftp.md)
- [ex-google-ads](ex-google-ads.md)
- [ex-google-bigquery-v2](ex-google-bigquery-v2.md)
- [ex-http](ex-http.md)
- [ex-onedrive](ex-onedrive.md)
- [ex-storage](ex-storage.md)

### Provisioning Pattern (Complex Factory)
- [ex-db-generic](ex-db-generic.md)
- [ex-facebook](ex-facebook.md)
- [ex-email-attachments](ex-email-attachments.md)
- [ex-google-drive](ex-google-drive.md)
- [ex-mongodb](ex-mongodb.md)

### Modern Hook-based
- [ex-dropbox-v2](ex-dropbox-v2.md)

### Large Modular (40+ components)
- [ex-generic](ex-generic.md)

### Simplified UI
- [ex-google-analytics-v4](ex-google-analytics-v4.md)

## By Data Type

### File-based Extractors
Extract files from cloud storage or mailboxes
- [ex-aws-s3](ex-aws-s3.md) - AWS S3
- [ex-azure-blob](ex-azure-blob.md) - Azure Blob
- [ex-dropbox-v2](ex-dropbox-v2.md) - Dropbox
- [ex-email-attachments](ex-email-attachments.md) - Email
- [ex-ftp](ex-ftp.md) - FTP/SFTP
- [ex-google-drive](ex-google-drive.md) - Google Drive
- [ex-onedrive](ex-onedrive.md) - OneDrive/SharePoint

### Query-based Extractors
Extract via APIs or database queries
- [ex-db-generic](ex-db-generic.md) - SQL Databases
- [ex-facebook](ex-facebook.md) - Facebook/Instagram APIs
- [ex-generic](ex-generic.md) - REST APIs (advanced)
- [ex-google-ads](ex-google-ads.md) - Google Ads API
- [ex-google-analytics-v4](ex-google-analytics-v4.md) - GA4 API
- [ex-google-bigquery-v2](ex-google-bigquery-v2.md) - BigQuery SQL
- [ex-http](ex-http.md) - REST APIs (simple)
- [ex-mongodb](ex-mongodb.md) - MongoDB queries

### Cross-project Extractors
Transfer data between Keboola projects
- [ex-storage](ex-storage.md) - Keboola Storage

## By Authentication Method

### OAuth 2.0 (11 modules)
- [ex-dropbox-v2](ex-dropbox-v2.md) - Dropbox
- [ex-email-attachments](ex-email-attachments.md) - Email providers
- [ex-facebook](ex-facebook.md) - Facebook/Instagram
- [ex-google-ads](ex-google-ads.md) - Google
- [ex-google-analytics-v4](ex-google-analytics-v4.md) - Google
- [ex-google-bigquery-v2](ex-google-bigquery-v2.md) - Google Cloud
- [ex-google-drive](ex-google-drive.md) - Google
- [ex-onedrive](ex-onedrive.md) - Microsoft

### Cloud Service Credentials (3 modules)
- [ex-aws-s3](ex-aws-s3.md) - AWS Access Keys
- [ex-azure-blob](ex-azure-blob.md) - Azure credentials
- [ex-google-bigquery-v2](ex-google-bigquery-v2.md) - Service account JSON

### Database/Connection URIs (1 module)
- [ex-db-generic](ex-db-generic.md) - With SSH tunneling

### Username/Password (1 module)
- [ex-ftp](ex-ftp.md) - With SSH keys

### API Key/Token (2 modules)
- [ex-http](ex-http.md) - API Key, Basic Auth
- [ex-storage](ex-storage.md) - API Token

## Features Comparison

### Most Complex
- **[ex-generic](ex-generic.md)**: 40+ components, 7+ auth methods, full API configuration

### Most User-friendly
- **[ex-dropbox-v2](ex-dropbox-v2.md)**: File picker interface, intuitive
- **[ex-google-analytics-v4](ex-google-analytics-v4.md)**: Simplified UI

### Best for Advanced Users
- **[ex-generic](ex-generic.md)**: Ultimate REST API flexibility
- **[ex-mongodb](ex-mongodb.md)**: Aggregation pipeline support
- **[ex-db-generic](ex-db-generic.md)**: Multi-database support

### Best for Simple Use Cases
- **[ex-http](ex-http.md)**: Basic REST API
- **[ex-google-analytics-v4](ex-google-analytics-v4.md)**: Quick GA4 setup

## Documentation Details

Each module documentation includes:
- Overview and purpose
- Component ID(s)
- File structure
- Route configurations
- Key components
- API endpoints
- State management patterns
- Dependencies
- Notable patterns
- User-facing features
- Technical debt notes
- Code examples
- Related modules
- Testing information

## Comprehensive Guides

- [EXTRACTORS_COMPLETE.md](EXTRACTORS_COMPLETE.md) - Complete overview of all extractors with patterns and insights
- [_TEMPLATE.md](_TEMPLATE.md) - Documentation template for future modules

## Related Documentation

- Architecture overview: See CLAUDE.md for module structure
- Component IDs: `apps/kbc-ui/src/constants/componentIds.js`
- Base configurations module: See `docs/02-modules/configurations.md`
- State management: See architecture documentation

## Quick Facts

- **Total Extractors**: 16 main modules
- **Total Component IDs**: 30+ (including variants)
- **Most Common Pattern**: Adapter-based (44%)
- **Most Common Auth**: OAuth 2.0 (69%)
- **Documentation Total**: 4,873 lines
- **Languages**: JavaScript, TypeScript
- **State Management**: Flux, React Hooks, TanStack Query, Immutable.js

## Notes for Development

1. **Type Safety**: Prefer TypeScript for new modules (ex-ftp, ex-http, ex-generic as examples)
2. **Pattern**: Adapter pattern generally preferred over provisioning for simplicity
3. **Testing**: Adapter patterns have better test coverage
4. **Migration**: Legacy modules candidate for modernization to TanStack Query
5. **Documentation**: Keep aligned with this template for consistency
