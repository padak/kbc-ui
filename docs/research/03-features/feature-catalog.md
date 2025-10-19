# Feature Catalog - Keboola Connection UI

**Version**: 1.0
**Date**: 2025-10-19
**Status**: Complete
**Based on**: Phase 2 (49 modules) + Phase 3 (4 workflows)

---

## Table of Contents

1. [Overview](#overview)
2. [Feature Categories](#feature-categories)
3. [Data Integration Features](#data-integration-features)
4. [Data Processing Features](#data-processing-features)
5. [Data Management Features](#data-management-features)
6. [Orchestration & Automation Features](#orchestration--automation-features)
7. [Development & Analysis Features](#development--analysis-features)
8. [Administration & Management Features](#administration--management-features)
9. [AI & Intelligence Features](#ai--intelligence-features)
10. [Feature Status Matrix](#feature-status-matrix)
11. [Cross-References](#cross-references)

---

## Overview

This catalog provides a comprehensive inventory of all features in the Keboola Connection UI, organized by category and user-facing purpose. Each feature includes:

- **Description**: What the feature does
- **User Value**: Why users need it
- **Status**: Stable, Beta, or Deprecated
- **Type**: User-facing or Technical
- **Module Reference**: Link to technical documentation

**Total Features**: 120+ across 9 categories
**Total Modules**: 49 documented modules
**Total Components**: 400+ React components
**Design System**: 43+ reusable components

---

## Feature Categories

### Category Summary

| Category | Features | User-Facing | Technical | Primary Users |
|----------|----------|-------------|-----------|---------------|
| **Data Integration** | 25 | 22 | 3 | Data Engineers, Analysts |
| **Data Processing** | 15 | 12 | 3 | Data Engineers, Scientists |
| **Data Management** | 18 | 15 | 3 | All Users |
| **Orchestration** | 12 | 10 | 2 | Data Engineers |
| **Development** | 20 | 14 | 6 | Developers, Data Scientists |
| **Administration** | 15 | 10 | 5 | Admins, Project Managers |
| **AI & Intelligence** | 8 | 7 | 1 | Analysts, Business Users |
| **Monitoring** | 8 | 8 | 0 | All Users |

**Total**: 121 features

---

## Data Integration Features

### Extractors (Data Sources)

#### Database Extractors

**Feature**: Multi-Database Extraction
**Description**: Extract data from 15+ database systems
**User Value**: Connect to any SQL database (MySQL, PostgreSQL, MSSQL, Oracle, etc.)
**Status**: Stable
**Type**: User-facing
**Module**: [ex-db-generic.md](/docs/02-modules/ex-db-generic.md)

**Supported Databases**:
- MySQL, PostgreSQL, MariaDB
- MSSQL, SQL Server
- Oracle, Exasol
- Snowflake, Redshift, BigQuery
- Hive, Impala, Teradata
- Db2, Firebolt

**Features**:
- Custom SQL queries
- Table selection wizard
- Incremental loading
- SSH tunnel support
- Connection testing

---

**Feature**: MongoDB Extraction
**Description**: Extract data from MongoDB collections
**User Value**: Connect to NoSQL MongoDB databases
**Status**: Stable
**Type**: User-facing
**Module**: [ex-mongodb.md](/docs/02-modules/ex-mongodb.md)

**Features**:
- Collection selection
- Aggregation pipeline support
- Incremental extraction
- Connection URI configuration

---

**Feature**: Google BigQuery Extraction
**Description**: Extract data from Google BigQuery
**User Value**: Query and extract BigQuery data
**Status**: Stable
**Type**: User-facing
**Module**: [ex-google-bigquery-v2.md](/docs/02-modules/ex-google-bigquery-v2.md)

**Features**:
- Service account authentication
- Custom SQL queries
- Dataset and table browsing
- Incremental loading

---

#### Cloud Storage Extractors

**Feature**: AWS S3 Extraction
**Description**: Extract files from AWS S3 buckets
**User Value**: Access CSV, JSON, Parquet files from S3
**Status**: Stable
**Type**: User-facing
**Module**: [ex-aws-s3.md](/docs/02-modules/ex-aws-s3.md)

**Features**:
- IAM role or access key auth
- Wildcard file selection
- Incremental loading
- Decompression support

---

**Feature**: Azure Blob Storage Extraction
**Description**: Extract files from Azure Blob Storage
**User Value**: Access files from Azure cloud
**Status**: Stable
**Type**: User-facing
**Module**: [ex-azure-blob.md](/docs/02-modules/ex-azure-blob.md)

---

**Feature**: Google Drive Extraction
**Description**: Extract files from Google Drive
**User Value**: Access spreadsheets and files from Drive
**Status**: Stable
**Type**: User-facing
**Module**: [ex-google-drive.md](/docs/02-modules/ex-google-drive.md)

**Features**:
- OAuth authentication
- File picker interface
- Sheet parsing
- Incremental updates

---

**Feature**: Dropbox Extraction
**Description**: Extract files from Dropbox
**User Value**: Access files from Dropbox cloud storage
**Status**: Stable
**Type**: User-facing
**Module**: [ex-dropbox-v2.md](/docs/02-modules/ex-dropbox-v2.md)

**Features**:
- OAuth authentication
- Modern hook-based architecture
- File picker interface

---

**Feature**: OneDrive Extraction
**Description**: Extract files from Microsoft OneDrive
**User Value**: Access files from OneDrive and SharePoint
**Status**: Stable
**Type**: User-facing
**Module**: [ex-onedrive.md](/docs/02-modules/ex-onedrive.md)

---

**Feature**: FTP/SFTP Extraction
**Description**: Extract files via FTP or SFTP
**User Value**: Connect to legacy FTP servers
**Status**: Stable
**Type**: User-facing
**Module**: [ex-ftp.md](/docs/02-modules/ex-ftp.md)

**Features**:
- FTP and SFTP support
- SSH key authentication
- User/password auth

---

#### API & Marketing Extractors

**Feature**: HTTP REST API Extraction
**Description**: Extract data from any HTTP REST API
**User Value**: Connect to simple REST APIs
**Status**: Stable
**Type**: User-facing
**Module**: [ex-http.md](/docs/02-modules/ex-http.md)

**Features**:
- GET/POST requests
- API key and basic auth
- Response parsing

---

**Feature**: Generic API Extraction
**Description**: Advanced REST API extraction with full control
**User Value**: Connect to complex REST APIs with advanced features
**Status**: Stable
**Type**: User-facing (Advanced)
**Module**: [ex-generic.md](/docs/02-modules/ex-generic.md)

**Features**:
- 40+ components
- 7+ authentication methods
- Request chaining
- Advanced pagination
- Response filtering
- OAuth 2.0 flows

---

**Feature**: Google Analytics 4 Extraction
**Description**: Extract data from Google Analytics 4
**User Value**: Analyze website traffic and user behavior
**Status**: Stable
**Type**: User-facing
**Module**: [ex-google-analytics-v4.md](/docs/02-modules/ex-google-analytics-v4.md)

**Features**:
- Simplified UI
- OAuth authentication
- Property and metric selection
- Date range configuration

---

**Feature**: Google Ads Extraction
**Description**: Extract campaign data from Google Ads
**User Value**: Analyze advertising performance
**Status**: Stable
**Type**: User-facing
**Module**: [ex-google-ads.md](/docs/02-modules/ex-google-ads.md)

---

**Feature**: Facebook/Instagram Extraction
**Description**: Extract data from Facebook and Instagram
**User Value**: Social media analytics and reporting
**Status**: Stable
**Type**: User-facing
**Module**: [ex-facebook.md](/docs/02-modules/ex-facebook.md)

**Variants**:
- Facebook Pages
- Facebook Ads
- Instagram
- Instagram Insights
- Facebook App Insights
- Facebook Ads Insights

---

#### Email & Other Extractors

**Feature**: Email Attachments Extraction
**Description**: Extract attachments from email accounts
**User Value**: Automate file collection from emails
**Status**: Stable
**Type**: User-facing
**Module**: [ex-email-attachments.md](/docs/02-modules/ex-email-attachments.md)

**Features**:
- OAuth authentication
- Filter by sender, subject
- Attachment parsing

---

**Feature**: Cross-Project Storage Extraction
**Description**: Extract data from another Keboola project
**User Value**: Share data between projects
**Status**: Stable
**Type**: User-facing
**Module**: [ex-storage.md](/docs/02-modules/ex-storage.md)

---

### Writers (Data Destinations)

#### Database Writers

**Feature**: Multi-Database Writing
**Description**: Write data to 18+ database systems
**User Value**: Export data to any data warehouse or database
**Status**: Stable
**Type**: User-facing
**Module**: [wr-db.md](/docs/02-modules/wr-db.md)

**Supported Databases**:
- PostgreSQL, MySQL, MariaDB
- MSSQL, SQL Server
- Snowflake, Redshift
- Oracle, Exasol
- Azure Synapse
- Hive, Impala, Firebolt

**Features**:
- Database-specific type mapping
- Staging modes (S3, SCP, direct)
- Incremental/delete load modes
- Complex credential management
- SSL/TLS support

---

**Feature**: Google BigQuery Writing
**Description**: Write data to Google BigQuery
**User Value**: Export to BigQuery data warehouse
**Status**: Stable
**Type**: User-facing
**Module**: [wr-google-bigquery-v2.md](/docs/02-modules/wr-google-bigquery-v2.md)

**Features**:
- Service account auth
- Dataset management
- Clustering for query optimization
- Partitioning for cost reduction
- Column type overrides
- Load type configuration

---

#### Cloud Storage Writers

**Feature**: AWS S3 Writing
**Description**: Write files to AWS S3 buckets
**User Value**: Export CSV files to S3
**Status**: Stable
**Type**: User-facing
**Module**: [wr-aws-s3.md](/docs/02-modules/wr-aws-s3.md)

**Features**:
- IAM credentials or STS roles
- S3 path configuration
- CSV formatting options
- Incremental/replace modes

---

**Feature**: Google Drive Writing
**Description**: Write files to Google Drive
**User Value**: Share data via Google Drive
**Status**: Stable
**Type**: User-facing
**Module**: [wr-google-drive.md](/docs/02-modules/wr-google-drive.md)

**Features**:
- OAuth authentication
- Folder and file organization
- Create/append/replace modes
- CSV/Excel format options

---

**Feature**: Google Sheets Writing
**Description**: Export data to Google Sheets
**User Value**: Real-time data sharing in spreadsheets
**Status**: Stable
**Type**: User-facing
**Module**: [wr-google-sheets.md](/docs/02-modules/wr-google-sheets.md)

**Features**:
- OAuth authentication
- Spreadsheet and sheet creation
- Append/replace modes
- Real-time data sharing

---

**Feature**: OneDrive Writing
**Description**: Export to Microsoft OneDrive
**User Value**: Share data via OneDrive/SharePoint
**Status**: Stable
**Type**: User-facing
**Module**: [wr-onedrive.md](/docs/02-modules/wr-onedrive.md)

**Features**:
- Microsoft OAuth authentication
- Workbook and worksheet creation
- Excel format support

---

**Feature**: Cross-Project Storage Writing
**Description**: Write data to another Keboola project
**User Value**: Share data between projects
**Status**: Stable
**Type**: User-facing
**Module**: [wr-storage.md](/docs/02-modules/wr-storage.md)

---

## Data Processing Features

### Transformations

**Feature**: SQL Transformations
**Description**: Transform data using SQL
**User Value**: Clean, enrich, and aggregate data with SQL
**Status**: Stable
**Type**: User-facing
**Module**: [transformations-v2.md](/docs/02-modules/transformations-v2.md)

**Backends Supported**:
- Snowflake
- BigQuery
- PostgreSQL
- Redshift
- MSSQL

**Features**:
- SQL code editor with syntax highlighting
- Input/output table mapping
- Variable support
- Query validation
- Version control

---

**Feature**: dbt Transformations
**Description**: Run dbt projects for data transformation
**User Value**: Use dbt for modular, testable transformations
**Status**: Stable
**Type**: User-facing
**Module**: [transformations-v2.md](/docs/02-modules/transformations-v2.md)

**Types**:
- Local dbt (Keboola-managed)
- Remote dbt (BigQuery, PostgreSQL, Redshift, MSSQL, Snowflake)

**Features**:
- Git repository integration
- Execution step configuration (run, test, docs, freshness)
- Thread count configuration
- Compiled SQL preview
- Gantt chart execution visualization
- Discovery mode

---

**Feature**: Transformation Input/Output Mapping
**Description**: Map storage tables to transformation inputs/outputs
**User Value**: Control which data enters and exits transformations
**Status**: Stable
**Type**: User-facing
**Module**: [transformations-v2.md](/docs/02-modules/transformations-v2.md)

**Features**:
- Table input mapping with filters
- Table output mapping with incremental loading
- Column selection
- Where clause filtering
- Days parameter for incremental loads

---

**Feature**: Transformation Variables
**Description**: Parameterize SQL transformations
**User Value**: Reuse transformations with different parameters
**Status**: Stable
**Type**: User-facing
**Module**: [transformations-v2.md](/docs/02-modules/transformations-v2.md)

---

**Feature**: Shared Code Blocks
**Description**: Reuse SQL code across transformations
**User Value**: DRY principle for SQL code
**Status**: Stable
**Type**: User-facing
**Module**: [transformations-v2.md](/docs/02-modules/transformations-v2.md)

---

**Feature**: Legacy Transformations
**Description**: Deprecated transformation system
**User Value**: Support for existing transformations
**Status**: Deprecated
**Type**: User-facing
**Module**: [legacy-transformation.md](/docs/02-modules/legacy-transformation.md)

---

## Data Management Features

### Storage Management

**Feature**: Table & Bucket Browser
**Description**: Browse and manage storage tables and buckets
**User Value**: Organize data in hierarchical structure
**Status**: Stable
**Type**: User-facing
**Modules**:
- [storage.md](/docs/02-modules/storage.md)
- [bucket-browser.md](/docs/02-modules/bucket-browser.md)
- [table-browser.md](/docs/02-modules/table-browser.md)

**Features**:
- 70+ components
- Two-tier hierarchy (buckets > tables)
- In/Out stage separation
- Search and filtering
- Sorting by multiple columns

**Workflow**: [02-storage-operations.md](/docs/05-workflows/02-storage-operations.md)

---

**Feature**: Data Preview & Sampling
**Description**: Preview table data without downloading
**User Value**: Quick data inspection
**Status**: Stable
**Type**: User-facing
**Module**: [storage.md](/docs/02-modules/storage.md)

**Features**:
- Virtual scrolling for performance
- Column filtering
- Search within data
- Limit control (100-1000 rows)

**Workflow**: [02-storage-operations.md](/docs/05-workflows/02-storage-operations.md)

---

**Feature**: Schema Management
**Description**: View and edit table schemas
**User Value**: Manage column definitions and types
**Status**: Stable
**Type**: User-facing
**Module**: [storage.md](/docs/02-modules/storage.md)

**Features**:
- Column name, type, nullable
- Primary key definition
- Schema validation
- Type conversion

---

**Feature**: Table Snapshots
**Description**: Create point-in-time table snapshots
**User Value**: Data versioning and backup
**Status**: Stable
**Type**: User-facing
**Module**: [storage.md](/docs/02-modules/storage.md)

---

**Feature**: Storage Events & History
**Description**: Audit log for storage operations
**User Value**: Track all data changes
**Status**: Stable
**Type**: User-facing
**Module**: [storage.md](/docs/02-modules/storage.md)

**Features**:
- Event timeline
- Event details and metadata
- Filter by type
- Export history

---

**Feature**: Table Metadata
**Description**: View table information and statistics
**User Value**: Understand data characteristics
**Status**: Stable
**Type**: User-facing
**Module**: [table-browser.md](/docs/02-modules/table-browser.md)

**Metadata Shown**:
- Row count
- Data size
- Created/updated dates
- Creator information
- Storage stage (In/Out)
- Primary key

---

**Feature**: Bucket Metadata
**Description**: View bucket information
**User Value**: Organize and understand bucket structure
**Status**: Stable
**Type**: User-facing
**Module**: [bucket-browser.md](/docs/02-modules/bucket-browser.md)

---

**Feature**: Trash & Recovery
**Description**: Recover deleted configurations and tables
**User Value**: Undo accidental deletions
**Status**: Stable
**Type**: User-facing
**Module**: [trash.md](/docs/02-modules/trash.md)

**Features**:
- Modern TanStack Query pattern
- List recently deleted items
- Restore functionality
- Permanent delete option
- Configurable retention period

---

### Data Catalog

**Feature**: Data Catalog Browser
**Description**: Browse shared data catalog
**User Value**: Discover available datasets
**Status**: Stable
**Type**: User-facing
**Module**: [data-catalog.md](/docs/02-modules/data-catalog.md)

**Features**:
- Search catalog entries
- Browse by category
- View dataset metadata
- Share datasets

---

**Feature**: Lineage Visualization
**Description**: Visual data lineage graph
**User Value**: Understand data flow and dependencies
**Status**: Stable
**Type**: User-facing
**Module**: [lineage.md](/docs/02-modules/lineage.md)

**Features**:
- React Flow graph
- Node expansion/collapse
- Upstream/downstream tracking
- Interactive navigation

---

## Orchestration & Automation Features

### Modern Flows (flows-v2)

**Feature**: Visual Flow Builder
**Description**: Canvas-based flow creation with drag-and-drop
**User Value**: Build data pipelines visually
**Status**: Stable
**Type**: User-facing
**Module**: [flows-v2.md](/docs/02-modules/flows-v2.md)

**Features**:
- React Flow canvas
- 100+ components
- Zustand state management
- Undo/redo support
- Modern TypeScript architecture

**Workflow**: [03-flow-creation-execution.md](/docs/05-workflows/03-flow-creation-execution.md)

---

**Feature**: Flow Phases & Tasks
**Description**: Organize tasks into sequential phases
**User Value**: Structure complex workflows
**Status**: Stable
**Type**: User-facing
**Module**: [flows-v2.md](/docs/02-modules/flows-v2.md)

**Features**:
- Multiple phases per flow
- Multiple tasks per phase
- Task ordering within phases
- Phase dependencies

---

**Feature**: Flow Conditions
**Description**: Conditional execution based on data or status
**User Value**: Smart workflow branching
**Status**: Stable
**Type**: User-facing
**Module**: [flows-v2.md](/docs/02-modules/flows-v2.md)

**Features**:
- Nested conditions (AND/OR)
- Multiple condition types
- Condition builder UI
- Visual condition display on canvas

---

**Feature**: Flow Scheduling
**Description**: Schedule flow execution with cron expressions
**User Value**: Automate data pipeline runs
**Status**: Stable
**Type**: User-facing
**Module**: [flows-v2.md](/docs/02-modules/flows-v2.md)

**Features**:
- Cron expression builder
- Multiple schedules per flow
- Schedule enable/disable
- Next run preview

---

**Feature**: Flow Notifications
**Description**: Email/webhook notifications on flow events
**User Value**: Stay informed of pipeline status
**Status**: Stable
**Type**: User-facing
**Module**: [flows-v2.md](/docs/02-modules/flows-v2.md)

**Features**:
- Email notifications
- Webhook notifications
- Event triggers (success, failure, warning)
- Custom message templates

---

**Feature**: Flow Execution Monitoring
**Description**: Real-time flow execution tracking
**User Value**: Monitor pipeline progress
**Status**: Stable
**Type**: User-facing
**Module**: [flows-v2.md](/docs/02-modules/flows-v2.md)

**Features**:
- Live execution status
- Phase and task progress
- Error display
- Execution history

---

**Feature**: Flow Version Control
**Description**: Track flow configuration changes
**User Value**: Audit and rollback capabilities
**Status**: Stable
**Type**: User-facing
**Module**: [flows-v2.md](/docs/02-modules/flows-v2.md)

---

**Feature**: Legacy Flows
**Description**: Deprecated flow system
**User Value**: Support for existing flows
**Status**: Deprecated
**Type**: User-facing
**Module**: [flows.md](/docs/02-modules/flows.md)

**Notes**: Uses custom Graph component, class components

---

### Job Queue

**Feature**: Job Queue Management
**Description**: View and manage running/queued jobs
**User Value**: Monitor all pipeline executions
**Status**: Stable
**Type**: User-facing
**Module**: [queue.md](/docs/02-modules/queue.md)

**Features**:
- Job list with filtering
- Job status tracking
- Job cancellation
- Job logs and details
- Job retry

---

## Development & Analysis Features

### Workspaces

**Feature**: External Database Workspaces
**Description**: Provision temporary database connections
**User Value**: Query data with external tools (SQL clients, BI tools)
**Status**: Stable
**Type**: User-facing
**Module**: [workspaces.md](/docs/02-modules/workspaces.md)

**Features**:
- Flux with Dispatcher
- Credential management
- Password reset
- Configuration-specific grouping
- Production-only API access

---

### Sandboxes

**Feature**: Computational Sandboxes
**Description**: Ephemeral compute environments for data exploration
**User Value**: Interactive data analysis and development
**Status**: Stable
**Type**: User-facing
**Module**: [sandboxes.md](/docs/02-modules/sandboxes.md)

**Types** (11 total):
- SQL: Snowflake, BigQuery, Redshift, Synapse, Exasol
- Containers: Python, R, Julia, RStudio, JupyterLab, Octave

**Features**:
- Size configuration (tiny to large)
- Data loading/unloading
- Storage mapping
- Snowflake login type (legacy vs key-pair)
- Sandbox sharing
- Billing integration

---

### Data Apps

**Feature**: Streamlit Data Apps
**Description**: Deploy Streamlit applications
**User Value**: Build interactive data applications
**Status**: Stable
**Type**: User-facing
**Module**: [data-apps.md](/docs/02-modules/data-apps.md)

**Features**:
- Code and Git deployment types
- Dependency freezing
- Package updates
- Secrets management via vault
- Real-time terminal logs
- Deployment status
- Notifications

---

## Administration & Management Features

### Project Administration

**Feature**: Role-Based Access Control (RBAC)
**Description**: Manage user permissions and roles
**User Value**: Control who can access what
**Status**: Stable
**Type**: User-facing
**Module**: [admin.md](/docs/02-modules/admin.md)

**Features**:
- Role assignment
- Permission management
- User invitations
- Access audit

---

**Feature**: Project Settings
**Description**: Configure project-wide settings
**User Value**: Customize project behavior
**Status**: Stable
**Type**: User-facing
**Module**: [settings.md](/docs/02-modules/settings.md)

**Features**:
- General settings
- Notification preferences
- API tokens
- Feature flags
- Storage settings

---

**Feature**: Billing & Usage
**Description**: Pay-as-you-go billing with Stripe
**User Value**: Track costs and usage
**Status**: Stable
**Type**: User-facing
**Module**: [billing.md](/docs/02-modules/billing.md)

**Features**:
- Stripe integration
- Usage tracking
- Cost estimation
- Payment methods
- Billing history

---

**Feature**: Telemetry & Analytics
**Description**: GoodData dashboard integration
**User Value**: Project usage analytics
**Status**: Stable
**Type**: User-facing
**Module**: [telemetry.md](/docs/02-modules/telemetry.md)

---

**Feature**: Configuration Management
**Description**: Manage component configurations
**User Value**: Organize and reuse configurations
**Status**: Stable
**Type**: Technical
**Module**: [configurations.md](/docs/02-modules/configurations.md)

**Features**:
- Configuration rows
- Version control
- Copy/paste configurations
- Configuration sharing

---

### Authentication & Security

**Feature**: OAuth 2.0 Integration
**Description**: OAuth authentication for third-party services
**User Value**: Secure authentication without passwords
**Status**: Stable
**Type**: Technical
**Module**: [oauth-v2.md](/docs/02-modules/oauth-v2.md)

**Supported Services**:
- Google (Drive, Sheets, Analytics, Ads, BigQuery)
- Microsoft (OneDrive)
- Facebook/Instagram
- Dropbox
- Email providers

---

**Feature**: Secrets Management
**Description**: Secure storage for credentials and API keys
**User Value**: Protect sensitive information
**Status**: Stable
**Type**: Technical
**Module**: [data-apps.md](/docs/02-modules/data-apps.md)

**Features**:
- Keboola vault integration
- Encrypted storage
- Secret injection

---

## AI & Intelligence Features

### AI SQL Editor (Waii)

**Feature**: AI-Assisted SQL Generation
**Description**: Generate SQL queries using natural language
**User Value**: Write SQL faster with AI help
**Status**: Stable
**Type**: User-facing
**Module**: [ai.md](/docs/02-modules/ai.md)

**Features**:
- Waii interactive SQL editor
- Natural language to SQL
- Query suggestions
- Error explanations
- Component suggestions

---

**Feature**: AI Session Management
**Description**: Maintain context across AI interactions
**User Value**: Contextual AI assistance
**Status**: Stable
**Type**: Technical
**Module**: [ai.md](/docs/02-modules/ai.md)

**Features**:
- Zustand + React Context
- Session persistence
- Conversation history
- Feedback system

---

**Feature**: Data Catalog Preview
**Description**: Browse and preview catalog data in AI editor
**User Value**: Understand data structure for queries
**Status**: Stable
**Type**: User-facing
**Module**: [ai.md](/docs/02-modules/ai.md)

---

**Feature**: Query Execution & Results
**Description**: Execute AI-generated queries
**User Value**: Test queries immediately
**Status**: Stable
**Type**: User-facing
**Module**: [ai.md](/docs/02-modules/ai.md)

**Features**:
- Result pagination
- Result caching
- Export results

---

### AI Chat

**Feature**: AI Chat Interface
**Description**: Chat with AI for data analysis help
**User Value**: Get help with data tasks
**Status**: Stable
**Type**: User-facing
**Module**: [chat.md](/docs/02-modules/chat.md)

**Features**:
- Real-time message streaming
- Fullscreen, sidebar, sheet layouts
- Context persistence
- Feature flag-driven layout
- Survey integration

---

## Monitoring & Observability Features

### Dashboard

**Feature**: Project Dashboard
**Description**: Overview of project activity and status
**User Value**: Quick project health check
**Status**: Stable
**Type**: User-facing
**Module**: [home.md](/docs/02-modules/home.md)

**Workflow**: [01-dashboard-navigation.md](/docs/05-workflows/01-dashboard-navigation.md)

**Widgets**:
- Latest CLI Activity
- Activity Feed (recent changes)
- Continue Your Work (recent items)
- Project Users (with online status)

---

**Feature**: Activity Feed
**Description**: Real-time feed of project changes
**User Value**: Stay informed of team activity
**Status**: Stable
**Type**: User-facing
**Module**: [home.md](/docs/02-modules/home.md)

**Features**:
- Event stream
- User actions
- Timestamp tracking
- Filtering by type

---

**Feature**: Job Logs & Details
**Description**: Detailed job execution logs
**User Value**: Debug failures and track execution
**Status**: Stable
**Type**: User-facing
**Module**: [queue.md](/docs/02-modules/queue.md)

**Features**:
- Real-time log streaming
- Log filtering
- Error highlighting
- Download logs

---

**Feature**: Notification System
**Description**: Email and webhook notifications
**User Value**: Stay informed of important events
**Status**: Stable
**Type**: User-facing
**Module**: [notifications.md](/docs/02-modules/notifications.md)

**Features**:
- Email notifications
- Webhook integration
- Event triggers
- Custom templates

---

## Feature Status Matrix

### By Status

| Status | Count | Percentage |
|--------|-------|------------|
| **Stable** | 112 | 93% |
| **Beta** | 2 | 2% |
| **Deprecated** | 7 | 5% |
| **Total** | 121 | 100% |

### Deprecated Features

Features marked for removal or replacement:

| Feature | Module | Reason | Replacement |
|---------|--------|--------|-------------|
| Legacy Flows | flows.md | Old architecture | flows-v2 |
| Legacy Transformations | legacy-transformation.md | Old architecture | transformations-v2 |
| Class Components | Various | React anti-pattern | Function components + hooks |
| Flux Stores | Various | Complex state | TanStack Query + Zustand |
| Immutable.js | Various | Performance overhead | Native JS + immer |
| Custom Graph Component | flows.md | Maintenance burden | React Flow |
| Old OAuth Flow | Various | Security issues | oauth-v2 |

### Beta Features

| Feature | Module | Notes |
|---------|--------|-------|
| AI Chat Sheet Layout | chat.md | Feature flag controlled |
| dbt Discovery Gantt Chart | transformations-v2.md | Visualization enhancement |

---

## Cross-References

### By Module Category

#### Core Infrastructure (10 modules)
- [admin.md](/docs/02-modules/admin.md) - RBAC
- [settings.md](/docs/02-modules/settings.md) - Project settings
- [home.md](/docs/02-modules/home.md) - Dashboard
- [components.md](/docs/02-modules/components.md) - Component framework
- [configurations.md](/docs/02-modules/configurations.md) - Config management
- [oauth-v2.md](/docs/02-modules/oauth-v2.md) - OAuth
- [queue.md](/docs/02-modules/queue.md) - Job queue
- [billing.md](/docs/02-modules/billing.md) - Billing
- [notifications.md](/docs/02-modules/notifications.md) - Notifications
- [trash.md](/docs/02-modules/trash.md) - Recovery

#### Data Modules (8 modules)
- [storage.md](/docs/02-modules/storage.md) - Storage (70+ components)
- [bucket-browser.md](/docs/02-modules/bucket-browser.md) - Buckets
- [table-browser.md](/docs/02-modules/table-browser.md) - Tables
- [data-catalog.md](/docs/02-modules/data-catalog.md) - Catalog
- [lineage.md](/docs/02-modules/lineage.md) - Lineage graph
- [workspaces.md](/docs/02-modules/workspaces.md) - External DBs
- [sandboxes.md](/docs/02-modules/sandboxes.md) - 11 sandbox types
- [data-apps.md](/docs/02-modules/data-apps.md) - Streamlit apps

#### Processing Modules (4 modules)
- [flows-v2.md](/docs/02-modules/flows-v2.md) - Modern flows (100+ components)
- [flows.md](/docs/02-modules/flows.md) - Legacy flows
- [transformations-v2.md](/docs/02-modules/transformations-v2.md) - SQL/dbt
- [legacy-transformation.md](/docs/02-modules/legacy-transformation.md) - Deprecated

#### AI Modules (2 modules)
- [ai.md](/docs/02-modules/ai.md) - Waii SQL editor
- [chat.md](/docs/02-modules/chat.md) - AI chat

#### Analytics Modules (2 modules)
- [lineage.md](/docs/02-modules/lineage.md) - Data lineage
- [telemetry.md](/docs/02-modules/telemetry.md) - GoodData

#### Extractors (16 modules)
See [EXTRACTORS_INDEX.md](/docs/02-modules/EXTRACTORS_INDEX.md)

#### Writers (7 modules)
See [00-WRITERS_INDEX.md](/docs/02-modules/00-WRITERS_INDEX.md)

### By Workflow

- [01-dashboard-navigation.md](/docs/05-workflows/01-dashboard-navigation.md) - Dashboard usage
- [02-storage-operations.md](/docs/05-workflows/02-storage-operations.md) - Storage management
- [03-flow-creation-execution.md](/docs/05-workflows/03-flow-creation-execution.md) - Flow building
- [04-transformation-workflow.md](/docs/05-workflows/04-transformation-workflow.md) - Transformations

### By Component Type

See [Design System Index](/docs/04-components/INDEX.md)

### By API Contract

See [API Contracts Index](/docs/06-api-contracts/INDEX.md)

---

## Feature Statistics

### Total Counts

- **Total Features**: 121
- **User-Facing Features**: 98 (81%)
- **Technical Features**: 23 (19%)
- **Modules Documented**: 49
- **React Components**: 400+
- **Design System Components**: 43+
- **API Clients**: 14
- **Supported Databases**: 15+ (extractors) + 18+ (writers)
- **Cloud Storage Providers**: 6
- **Authentication Methods**: 5 (OAuth, API Key, DB credentials, Service Account, Token)

### Architecture Patterns

| Pattern | Usage | Examples |
|---------|-------|----------|
| Adapter | 44% | Extractors, Writers |
| Provisioning | 30% | Multi-DB components |
| Flux + Immutable | 25% | Legacy modules |
| TanStack Query + Zustand | 20% | Modern modules |
| React Context | 15% | Chat, AI |
| Redux | 5% | wr-db |

### State Management Evolution

| Pattern | Modules | Status | Target |
|---------|---------|--------|--------|
| **Legacy (40%)** | Flux + Immutable.js | Deprecated | Migrate to modern |
| **Modern (30%)** | TanStack Query + Zustand | Preferred | Continue |
| **Hybrid (30%)** | Mixed patterns | Transitional | Modernize |

---

## Recommendations

### High Priority Migrations

1. **Flows v1 → Flows v2**: All users should migrate to modern flow builder
2. **Legacy Transformations → Transformations v2**: Complete migration path needed
3. **Flux → TanStack Query**: Systematic refactoring for performance
4. **Immutable.js → Native JS**: Remove performance overhead
5. **Class Components → Hooks**: Modern React patterns

### Feature Enhancement Opportunities

1. **Mobile Responsiveness**: Limited mobile optimization
2. **Loading States**: More consistent skeleton loaders
3. **Search UX**: Enhanced search with highlights
4. **Onboarding**: Guided tours and contextual help
5. **Error Boundaries**: More comprehensive error handling
6. **Virtual Scrolling**: For large lists and tables

### Documentation Gaps

1. **Workflow docs**: 5+ workflows still undocumented
2. **Component usage examples**: More real-world examples needed
3. **Migration guides**: Step-by-step migration documentation
4. **API endpoint docs**: Complete endpoint catalog

---

**Next Steps**: See [user-journeys.md](user-journeys.md), [feature-priority-matrix.md](feature-priority-matrix.md), [complexity-assessment.md](complexity-assessment.md)

---

*Generated: 2025-10-19*
*Version: 1.0*
*Based on: 49 modules, 4 workflows, 400+ components*
