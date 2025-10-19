# Workflow: Storage Operations

## Overview

Storage is the central data repository in Keboola Connection, managing all tables, buckets, files, and data streams. It provides a comprehensive interface for browsing data, managing table schemas, viewing data samples, and monitoring storage events.

**URL Pattern**: `/admin/projects/{projectId}/storage`

**Module Reference**: See `docs/02-modules/storage.md` for code details

## Prerequisites

- User must be authenticated and have access to the project
- Project must have active storage backend (Snowflake, Redshift, or Synapse)
- User needs appropriate permissions to view/edit storage objects

---

## Storage Main Page Structure

### URL Structure
- Main storage page: `/admin/projects/33/storage`
- Bucket detail: `/admin/projects/33/storage/{bucketId}/overview`
- Table detail: `/admin/projects/33/storage/{bucketId}/overview/table/{tableName}/overview`

### Top Action Bar

**Screenshot**: `docs/08-screenshots/02-storage-buckets-list.png`

**Actions Available**:
1. **Register your Snowflake Dataset** - Link external Snowflake datasets
2. **Create bucket** - Create new storage bucket (green button)

**Components Used**:
- Button (variant: outline for Snowflake, variant: primary for Create)

---

## Navigation Tabs

**Location**: Below page header

**Tabs Available**:
1. **Tables & Buckets** - Main view (default)
2. **Files** - File uploads and storage
3. **Data Streams** - Real-time data streaming
4. **Storage Jobs** - Job history for storage operations
5. **Events** - Audit log of storage events

**Components Used**:
- Tabs component
- Icon + text labels

**Code Reference**: `apps/kbc-ui/src/scripts/modules/storage/react/components/StorageTabs.tsx`

---

## Tables & Buckets View

**Screenshot**: `docs/08-screenshots/02-storage-buckets-list.png`

### Search and Filtering

**Search Bar**:
- Placeholder: "Search all tables (76) and buckets (36)"
- Real-time filtering
- Searches both table and bucket names

**Filter Buttons** (horizontal pill buttons):
- **ALL** - Show all (default, blue highlight)
- **LINKED** - Show only linked buckets
- **SHARED** - Show only shared buckets
- **Tables** - Show only tables (collapse buckets)
- **Buckets** - Show only buckets (collapse tables)

**Components Used**:
- Input (with search icon)
- ToggleGroup (for filter buttons)

### Table/Bucket List

**Column Headers**:
1. **Name** - Bucket/table name with stage (in/out) and icon
2. **Recently updated by** - Source component or user
3. **Last change** - Timestamp (sortable)

**Checkbox Column**: Bulk selection for operations

**Sort Functionality**:
- Click column headers to sort
- Arrow indicators show sort direction
- Default sort: Name (ascending)

### Bucket/Table Row Display

**Each Row Shows**:

**For Buckets**:
- **Folder icon** - Indicates bucket
- **Expand/collapse arrow** - Show/hide tables
- **Bucket name** - Clickable link
- **Stage indicator** - "in" (input) or "out" (output) badge
- **Source component** - Icon and name (e.g., "MySQL", "Snowflake SQL")
- **Configuration link** - Click to open source configuration
- **Last change timestamp**
- **Options menu** - Three dots (more actions)

**For Tables** (when bucket expanded):
- **Table icon** - Grid icon
- **Table name** - Clickable link
- **Type badge** - "Non-typed" or specific type
- **Row count** - Number of rows
- **Data size** - e.g., "1.54 kB"
- **Recently updated by** - Component that last modified
- **Last change timestamp**
- **Options menu**

**Components Used**:
- Custom table/list component
- Badge (for stage, type indicators)
- Avatar (for component icons)
- Button (icon button for options)
- Link (for clickable names)
- Collapsible (for bucket expansion)

**Examples from Screenshot**:
1. **accel** (in) - Snowflake SQL bucket
2. **Billing** (in) - AWS S3 bucket, from "Zendesk 9590" configuration
3. **geo** (in) - Contains 1 table, no source component
4. **dbt-demo** (out) - Output bucket from dbt transformation

---

## Bucket Detail View

**Screenshot**: `docs/08-screenshots/03-storage-bucket-overview.png`

**URL**: `/admin/projects/33/storage/in.c-geo/overview`

### Breadcrumb Navigation

**Path**: Storage > geo

**Components Used**: Breadcrumb with folder icon

### Page Header

**Title**: Bucket name with folder icon and edit button
- Click bucket name dropdown to rename/configure

**Actions** (right side):
- **Create alias table** - Create table alias
- **Add Table** - Upload or create new table (green button)

### Tabs

1. **Overview** - Bucket details and tables (active)
2. **Events** - Bucket event history

### Bucket Information Panel

**Left Section**:
- **ID**: Full bucket ID (e.g., "in.c-geo") - clickable to copy
- **Name**: Display name (e.g., "geo") - clickable to edit
- **Backend**: Snowflake icon + "Snowflake"
- **Sharing**: "Disabled (click to enable)" - clickable to configure
- **Schema**: Database schema name with copy button

**Right Section**:
- **Stage**: IN or OUT
- **Created**: Creation timestamp
- **Last change**: Last modification timestamp
- **Row count**: Total rows across all tables (e.g., "7")
- **Data size**: Total size (e.g., "1.54 kB")

**Components Used**:
- Card with two-column layout
- Button (copy buttons)
- Badge (for backend type)
- Paragraph elements for key-value pairs

### Bucket Description

**Section**: "Bucket Description" heading
- **Add description** button if no description exists
- Editable text area when description exists

### Tables List in Bucket

**Search**: "Search tables (1) and columns (1)"

**Table Headers**:
- Checkbox (select all)
- **Table Name** (sortable)
- **Row Count** (sortable)
- **Data Size** (sortable)
- **Recently Updated By**
- **Last Change** (sortable)

**Table Row** (example: "locations"):
- Checkbox for selection
- Table icon + name link
- Type badge: "Non-typed"
- Row count: "7"
- Data size: "1.54 kB"
- Updated by: "N/A"
- Last change: "Jul 24 13:51"
- Options menu button

**Components Used**:
- Input (search)
- Table
- Checkbox
- Badge
- Link
- Button (icon button)

---

## Table Detail View

**Screenshot**: `docs/08-screenshots/04-storage-table-overview.png`

**URL**: `/admin/projects/33/storage/in.c-geo/overview/table/locations/overview`

### Breadcrumb

**Path**: Storage > geo (folder icon) > locations

### Page Header

**Title**: "locations" with table icon
- **Type Badge**: "NON-TYPED" (orange badge)

### Action Bar

**Left**:
- **Open Storage Tree** button - Shows hierarchical storage view

**Tabs**:
1. **Overview** - Table metadata (active)
2. **Schema** - Column definitions and types
3. **Events** - Table event history
4. **Data Sample** - Preview actual data
5. **Snapshots** - Table snapshots for recovery
6. **Usage** - Usage statistics

**Right**:
- More actions menu (three dots)

### Table Information Panel

**Left Section**:
- **ID**: Full table ID (e.g., "in.c-geo.locations") - copy button
- **Name**: Table name (e.g., "locations") - edit button
- **Primary key**: "Not set" or key column(s) - edit button with tooltip
- **Recently updated by**: Source component or "N/A"
- **Schema**: Database schema (e.g., "in.c-geo") - copy button
- **Table Name**: Physical table name - copy button

**Right Section**:
- **Stage**: IN or OUT
- **Created**: Creation timestamp
- **Last import**: Last data import timestamp
- **Last change**: Last modification timestamp
- **Row count**: Number of rows (e.g., "7")
- **Data size**: Size in storage (e.g., "1.54 kB")

**Components Used**:
- Two-column card layout
- Button (copy buttons, edit buttons)
- Tooltip (for field explanations)

### Latest Import Time Chart

**Section**: "Latest import time" heading
- Line chart showing import duration over time
- Message: "Graph cannot be rendered, there aren't enough import events" (when insufficient data)

**Components Used**:
- Empty state message
- Chart component (when data available)

### Table Description

**Section**: "Table Description" heading
- **Add description** button if empty
- Editable markdown text when present

### Column Preview (on Overview Tab)

**Table Headers**:
- **Column Name**
- **Sample Value**

**Example Row**:
- Column: "location"
- Sample: "Sakra, Bihar, India, Bridgeton, MO, USA, 21 Macarthur Road,Sydney,Australia..."

**Loading State**:
- Spinner icon
- Text: "Loading preview data...."

**Components Used**:
- Table
- Skeleton loader
- Text with truncation

---

## Data Sample View

**Screenshot**: `docs/08-screenshots/05-storage-data-sample.png`

**URL**: `/admin/projects/33/storage/in.c-geo/overview/table/locations/data-sample`

### Search and Filter Bar

**Search Input**: "Search columns"
- Filters displayed columns or values

**Toggle Buttons**:
- **COLUMNS** (active/blue) - Search column names
- **VALUES** - Search within cell values

**Components Used**:
- Input (with search icon)
- RadioGroup (styled as toggle buttons)

### Data Display

**Column Headers**:
- Column name (e.g., "location")
- Sort indicator (arrow icon)
- Clickable to sort

**Row Display**:
- Each row shows cell value
- Filter input below column header
- Full data preview (not truncated like Overview)

**Example Data** (from "location" column):
1. Sakra, Bihar, India
2. Bridgeton, MO, USA
3. 21 Macarthur Road,Sydney,Australia
4. Caravan Mobile Services, Kenfig Industrial Estate, Port Talbot, the UK
5. Isinya, Kenya
6. The White House
7. Holešovice

**Loading State**:
- Spinner
- "Loading data..." text

**Action Buttons** (top right):
- Help icon button
- Expand/fullscreen button
- More options menu

**Components Used**:
- Custom data table with virtual scrolling
- Input (inline filters)
- Toggle buttons
- Spinner (loading state)

---

## Common Workflows

### 1. Browse and Search Tables

**Steps**:
1. Navigate to Storage from main menu
2. Use search bar to filter tables/buckets
3. Click filter buttons to narrow by type (ALL, LINKED, SHARED, etc.)
4. Click table/bucket name to view details

**Components**: Input, ToggleGroup, Link

---

### 2. View Table Data

**Steps**:
1. Navigate to table detail page
2. Click "Data Sample" tab
3. Use column search to filter
4. Toggle between "COLUMNS" and "VALUES" search modes
5. Use inline column filters to refine data
6. View full dataset with all rows visible

**Components**: Tabs, Input, RadioGroup, Table

**Code Reference**: `apps/kbc-ui/src/scripts/modules/storage/react/components/DataSample.tsx`

---

### 3. Check Table Metadata

**Steps**:
1. Navigate to table detail
2. Overview tab shows:
   - Table ID, name, creation date
   - Row count, data size
   - Primary key status
   - Recent updates
3. Click "Schema" tab to view:
   - Column definitions
   - Data types
   - Column metadata

**Components**: Card, Table, Badge

---

### 4. View Storage Events

**Steps**:
1. From table/bucket detail, click "Events" tab
2. View chronological event log:
   - Data imports
   - Schema changes
   - Table/bucket modifications
   - Deletions and restorations
3. Filter events by type or date
4. Click event to see full details

**Components**: Timeline, Event list, Filter

---

### 5. Create New Bucket

**Steps**:
1. From Storage main page, click "Create bucket" button
2. Modal opens with form:
   - Bucket name (required)
   - Stage: IN or OUT (required)
   - Backend: Snowflake/Redshift/Synapse (auto-selected)
   - Description (optional)
   - Sharing settings (optional)
3. Click "Create" button
4. New bucket appears in list
5. Navigate to bucket to add tables

**Components**: Modal, Form, Input, Select, Button

**Code Reference**: `apps/kbc-ui/src/scripts/modules/storage/react/components/BucketCreateModal.tsx`

---

### 6. Upload Data to Table

**Steps**:
1. Navigate to bucket detail
2. Click "Add Table" button
3. Choose upload method:
   - Upload CSV file
   - Import from file storage
   - Create empty table
4. Configure table settings:
   - Table name
   - Primary key
   - Column types (optional)
   - Incremental load (optional)
5. Upload/create table
6. View table in bucket list

**Components**: Modal, FileUpload, Form, Checkbox, Input

---

### 7. Register Snowflake Dataset

**Steps**:
1. From Storage main page, click "Register your Snowflake Dataset"
2. Enter Snowflake credentials:
   - Account name
   - Database name
   - Schema name
   - Table/view name
3. Configure access permissions
4. Link external dataset as Keboola bucket
5. Tables appear as linked buckets (read-only)

**Components**: Modal, Form, Input, Button

**Note**: Linked buckets display "LINKED" badge in filter view

---

## Schema Tab Features

**Purpose**: View and edit table schema

**Display**:
- Column name
- Data type (STRING, INTEGER, DATE, etc.)
- Nullable (yes/no)
- Default value
- Description

**Actions**:
- Edit column metadata
- Add column descriptions
- Change column types (with warning)
- Set/remove primary key

**Components**: Table, Input, Select, Modal (for confirmations)

---

## Usage Tab Features

**Purpose**: Monitor table read/write patterns

**Display**:
- Read operations count
- Write operations count
- Data transferred
- Time-based chart
- Component usage breakdown

**Filters**:
- Date range selector
- Operation type (read/write)
- Component filter

**Components**: Chart, DateRangePicker, Filter buttons

---

## Snapshots Tab Features

**Purpose**: View and restore table snapshots

**Display**:
- Snapshot timestamp
- Row count at snapshot time
- Data size
- Who created snapshot
- Restore button

**Actions**:
- Create manual snapshot
- Restore from snapshot (with confirmation)
- Delete old snapshots

**Components**: Table, Button, Modal (confirmation)

---

## Empty States

### No Tables in Bucket

**Display**:
- Empty state illustration
- Message: "No tables in bucket"
- "Add Table" call-to-action button

**Components**: EmptyState component

### No Buckets in Project

**Display**:
- Large illustration
- "Create your first bucket" message
- "Create bucket" button
- Link to documentation

**Components**: EmptyState, Button, Link

---

## Error States

### Failed to Load Data

**Display**:
- Error icon
- Message: "Failed to load storage data"
- "Retry" button
- Link to support

**Components**: Alert (variant: error), Button

### Permission Denied

**Display**:
- Lock icon
- "You don't have permission to view this bucket/table"
- Link to request access

**Components**: Alert (variant: warning)

---

## Loading States

### Table List Loading

**Display**:
- Skeleton rows (3-5 placeholder rows)
- Shimmer animation
- Maintains layout structure

**Components**: Skeleton component

### Data Sample Loading

**Display**:
- Spinner icon
- "Loading data..." text
- Centered in data area

**Components**: Spinner, loading text

---

## Permission-Based UI

### Admin Users
- Full access to all buckets/tables
- Can create/delete buckets
- Can modify table schemas
- Can configure sharing

### Regular Users
- View access to assigned buckets
- Can upload data to authorized tables
- Cannot modify schemas
- Cannot delete tables

### Read-Only Users
- View data samples only
- No upload/edit capabilities
- Cannot view sensitive metadata
- Limited event history

**Code Reference**: See `docs/02-modules/admin.md` for RBAC implementation

---

## Interactions & Transitions

### List View
- **Hover**: Row highlights with subtle background color
- **Click row**: Navigate to detail page
- **Expand bucket**: Smooth slide animation shows tables
- **Checkbox select**: Highlight row with blue tint

### Detail View
- **Tab switch**: Instant content swap (no loading unless data fetch needed)
- **Edit inline**: Field highlights, save/cancel buttons appear
- **Copy button**: Tooltip shows "Copied!" after click

### Data Sample
- **Column sort**: Arrow flips, data reorders
- **Filter input**: Debounced search (300ms delay)
- **Virtual scroll**: Smooth infinite scroll for large datasets

---

## Keyboard Shortcuts

**On Storage Main Page**:
- `/` - Focus search bar
- `c` - Create new bucket
- `↑/↓` - Navigate list
- `Enter` - Open selected item

**On Table Detail**:
- `1-6` - Switch between tabs
- `e` - Edit table description
- `?` - Show keyboard shortcuts help

---

## Technical Implementation

### State Management
- **Pattern**: Flux + Immutable.js (legacy)
- **Store**: StorageStore manages all storage state
- **Actions**: StorageActions for CRUD operations

**Transition Note**: Newer features use TanStack Query

### API Endpoints
- `GET /v2/storage/buckets` - List all buckets
- `GET /v2/storage/tables` - List all tables
- `GET /v2/storage/tables/{tableId}` - Table detail
- `POST /v2/storage/tables/{tableId}/preview` - Data sample
- `GET /v2/storage/events` - Event history
- `POST /v2/storage/buckets` - Create bucket
- `POST /v2/storage/tables` - Create/upload table

**Code Reference**: See `docs/06-api-contracts/api-clients.md` - Storage client

### Performance Optimizations
- Virtual scrolling for large table lists
- Debounced search (300ms)
- Cached bucket/table metadata
- Lazy loading of data samples
- Pagination for large datasets

**Code Reference**: See `docs/02-modules/storage.md` - Performance section

---

## Cross-References

### Related Workflows
- Flow Creation: Uses Storage tables as inputs/outputs
- Transformations: Read from/write to Storage tables
- Data Apps: Access Storage for data visualization
- Extractors: Write data to Storage buckets

### Module Documentation
- Storage module: `docs/02-modules/storage.md`
- Bucket browser: `docs/02-modules/bucket-browser.md`
- Table browser: `docs/02-modules/table-browser.md`

### Design System
- Table: `docs/04-components/INDEX.md`
- Input: `docs/04-components/form-components.md`
- Badge: `docs/04-components/INDEX.md`
- Card: `docs/04-components/INDEX.md`
- Modal: `docs/04-components/INDEX.md`
- Tabs: `docs/04-components/INDEX.md`
- EmptyState: `docs/04-components/utilities-and-patterns.md`
- Skeleton: `docs/04-components/INDEX.md`

---

## Notes

- Storage is the most heavily used feature in Keboola
- Table list can contain 1000+ items (virtual scrolling critical)
- Data sample limited to 1000 rows by default (configurable)
- Bucket sharing enables cross-project data access
- Schema changes require careful validation (data loss prevention)
- Linked buckets are read-only (external Snowflake datasets)
- File storage separate from table storage (different backend)

---

**Last Updated**: 2025-10-18
**Phase**: 3 - UI Exploration
**Status**: Complete
