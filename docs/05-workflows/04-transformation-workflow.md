# Workflow: Transformations

## Overview

Transformations allow users to manipulate data in Keboola Connection using SQL, Python, R, Julia, or dbt. This workflow covers creating, configuring, and executing transformations, with a focus on Snowflake SQL transformations as the most common type.

**URL Pattern**: `/admin/projects/{projectId}/transformations-v2`

**Module Reference**: See `docs/02-modules/transformations-v2.md` for code details

## Prerequisites

- User must have appropriate permissions to create/edit transformations
- Project must be active
- Input tables must exist in Storage if using input mapping
- For execution: Valid backend credentials configured

---

## Transformation Types Supported

**Available Backend Types**:
1. **Snowflake SQL** - Most common, native SQL transformations
2. **Python** - Custom Python scripts
3. **R** - R scripts for statistical analysis
4. **Julia** - Julia language transformations
5. **dbt** - Data build tool for analytics engineering
6. **Synapse SQL** - Azure Synapse transformations
7. **Redshift SQL** - AWS Redshift transformations
8. **Exasol SQL** - Exasol database transformations
9. **Teradata SQL** - Teradata transformations
10. **OpenRefine** - Data cleaning and transformation

---

## Transformations List Page

**Screenshot**: `docs/08-screenshots/09-transformations-list.png`

### Page Structure

**Header**:
- Breadcrumb: "Transformations"
- "Create Transformation" button (green, top right)

**Content Area**:
- Folder structure on left (collapsible folders)
- Transformation list on right

### List View Features

**Columns**:
1. **Name** - Transformation name with type icon
2. **Backend Size** - Workspace size (Small, Medium, Large)
3. **Data** - Input/output data indicator
4. **Used In** - Number of flows using this transformation
5. **Last Change** - Timestamp and user
6. **Last Use** - Last execution time

**Example Transformations Shown**:
```
BLA (folder)
├── fetch specific year (Snowflake SQL)
└── Transform.io test (Snowflake SQL)

transformations without folder
├── K-Means Live segmentation (Python)
├── Clustering (Python)
├── Export transactions (Snowflake SQL)
├── test dbt (dbt)
├── test (R)
└── testttt (Julia)
```

**Components Used**:
- Card (for folder containers)
- Table (for transformation list)
- Badge (for backend type, status)
- Button (Create, folder actions)
- Link (clickable rows)

**User Actions**:
- Click transformation name → Open transformation detail
- Click "Create Transformation" → Create new transformation modal
- Click folder → Expand/collapse folder
- Drag transformations → Organize into folders
- Right-click → Context menu (copy, delete, move)

**Code Reference**: `apps/kbc-ui/src/scripts/modules/transformations-v2/react/pages/TransformationsList.tsx`

---

## Transformation Detail Page

**Screenshot**: `docs/08-screenshots/10-transformation-detail.png`

**URL Pattern**: `/admin/projects/{projectId}/transformations-v2/{componentId}/{configId}`

### Page Header

**Left Section**:
- Component icon (Snowflake logo for Snowflake SQL)
- Breadcrumb: "Transformations" > "fetch specific year"
- Transformation name (editable with pencil icon)

**Right Section** (Tabs):
- Information & Settings (active)
- Notifications
- Versions

### Information & Settings Tab

#### Overview Card (Top)

**Metadata Display** (two-column layout):
- **Type**: Transformation (with icon)
- **Used in**: "2 flows" (clickable badge showing flow count)
- **Data**: None (or shows input/output table count)
- **Additional Links**:
  - Documentation (external link to help.keboola.com)
  - License (terms and conditions link)

**Description Section**:
- Empty state with two options:
  - "Add description" button
  - "Generate description" button (AI-powered)

#### Table Input Mapping

**Screenshot Detail**: Shows one input mapping configured

**Header**:
- Section title: "Table Input Mapping"
- "New Table Input" button (green)
- Expand/collapse button

**Mapping Table**:
- Columns: Source Table, Input Table
- Checkboxes for bulk selection

**Example Mapping**:
```
Source Table: in.Billing/padak
Input Table: padak
```

**Each Mapping Row Shows**:
- Source bucket/table badge (e.g., "in Billing / padak")
- Arrow indicator (→)
- Destination table name in transformation
- Edit button (pencil icon)
- Delete button (trash icon)

**User Actions**:
- Click "New Table Input" → Add input mapping modal
- Click existing mapping → Edit mapping
- Drag rows → Reorder mappings

**Components Used**:
- Table with custom styling
- Badge (for bucket/table names)
- Button (add, edit, delete)
- Modal (for configuration)

#### Table Output Mapping

**Header**:
- Section title: "Table Output Mapping"
- "New Table Output" button (green)

**Purpose**: Maps transformation output tables back to Storage

**Empty State** (in screenshot): No output mappings configured

**When Configured, Shows**:
- Source table (from transformation)
- Destination bucket/table in Storage
- Incremental load toggle
- Primary key configuration
- Delete rows options

#### Variables Section

**Screenshot Detail**: Shows 4 variables configured

**Header**:
- Section title: "Variables"
- "New Variable" button (green)
- Info text with documentation link

**Purpose**: Parameterize transformations for reusability

**Variables Shown**:
```
1. date (2022)
   - Name: date
   - Value: 2022
   - Used in queries as {{date}}

2. fff (f)
   - Name: fff
   - Value: f

3. padak (EMPTY STRING)
   - Name: padak
   - Value: (empty)

4. segment (main)
   - Name: segment
   - Value: main
```

**Each Variable Displays**:
- Variable icon
- Variable name
- Current value in parentheses
- Three-dot menu for actions:
  - Edit
  - Copy
  - Delete

**Components Used**:
- Card/Panel for each variable
- Badge (for value display)
- DropdownMenu (three dots)
- Button (add variable)

**Code Reference**: Variables are referenced in SQL using `{{variableName}}` syntax

#### Queries/Code Blocks Section

**Header**:
- Section title: "Queries"
- "Copy all Queries" button
- "Edit all Queries" button

**Code Block Display**:

**Block Header**:
- Icon (code icon)
- "Block 1" title (editable)
- Actions:
  - "Select Shared Code" button
  - "New Code" button
  - Three-dot menu

**Code Block Content**:

**Screenshot Detail**: "bla bla" code block shown

**Query Preview**:
```sql
create table pavel as
SELECT * FROM padak WHERE YEAR(datum) = '{{date}}';
```

**Features**:
- Syntax highlighting
- Variable interpolation ({{date}})
- Line numbers
- Edit button (opens full editor)
- Run button (execute this block only)

**Click Code Block**:
- Opens full SQL editor modal
- Shows:
  - Search box
  - "Copy Code" button
  - Full-screen toggle
  - "Save" button (enabled when changes made)
  - Close button (X)
- Editor features:
  - Syntax highlighting (SQL)
  - Line numbers
  - Auto-complete (Ctrl+Space or Option+Space)
  - Comment toggle (Ctrl+/ or Command+/)
  - Reference table helper
  - Variable highlighting

**Components Used**:
- CodeEditor (CodeMirror 6)
- Modal (for full editor)
- Button (various actions)
- Tooltip (for keyboard shortcuts)

**Code Reference**: See `docs/04-components/code-editor-components.md` for SqlEditor component

**Add New Code Block**:
- "New Code Block" button at bottom
- Creates sequential blocks (Block 1, Block 2, etc.)
- Blocks execute in order during transformation run

### Right Sidebar Actions

**Primary Actions**:
1. **Run transformation** (green button with play icon)
2. **Timeout**: 1d (configurable, 1 hour to 7 days)
3. **Query timeout**: 2h (configurable, per-query timeout)

**Workspace Actions**:
4. **Create new workspace** - Create Snowflake workspace with transformation data
5. **Copy to existing workspace** - Copy to pre-existing workspace

**Additional Actions**:
6. **Copy transformation** - Duplicate configuration
7. **Automate** - Add to flow

**Settings**:
8. **Automatic data types** (toggle switch)
   - When ON: Automatically detects column types
   - When OFF: Manual type specification required

**Advanced**:
9. **Debug mode** - View raw JSON configuration
10. **Delete transformation** (destructive, at bottom)

**Last Use Panel**:
- Job status badge (Success/Error/Cancelled)
- Timestamp ("3 days ago")
- User who ran it
- "Show All Uses" link → Job queue filtered by this transformation

**Versions Panel**:
- Latest 3 versions shown
- Each version shows:
  - Version number (#13, #12, #11)
  - Change description (e.g., "Delete output table mapping")
  - Timestamp and user
- "See Latest Changes" button (top right)
- "Show All Versions" link (bottom) → Full version history

**Components Used**:
- Button (various actions)
- Switch (toggle settings)
- Card/Panel (Last Use, Versions)
- Badge (job status)
- Link (navigation to related pages)
- Separator (visual dividers)

---

## Notifications Tab

**Screenshot**: `docs/08-screenshots/11-transformation-notifications.png`

**URL Pattern**: `/admin/projects/{projectId}/transformations-v2/{componentId}/{configId}/notifications`

### Purpose

Configure email and webhook notifications for transformation execution events.

### Notification Types

#### 1. Success Notifications (Green Icon)

**Description**: "Get notified when the transformation finishes successfully."

**Tabs**:
- Email 0 (active)
- Webhook 0

**Email Configuration**:
- Combobox: "Choose from your colleagues or enter an email address"
- Auto-suggests project members
- Can enter external email addresses
- Multiple recipients supported

**Webhook Configuration** (when tab selected):
- URL input field
- Headers configuration
- Request body template

#### 2. Error Notifications (Red Icon)

**Description**: "Get notified when the transformation finishes with an error."

**Same Structure**:
- Email tab (0 configured)
- Webhook tab (0 configured)
- Identical configuration options

#### 3. Processing Notifications (Blue Icon)

**Description**: "Get notified when the job is processing longer than usual (%)."

**Purpose**: Alert on long-running transformations that exceed historical average

**Same Structure**:
- Email tab
- Webhook tab

### Notification Configuration Flow

**To Add Email Notification**:
1. Select notification type (Success/Error/Processing)
2. Click Email tab (if not active)
3. Type in combobox → Shows project members dropdown
4. Select user(s) or enter email address
5. Press Enter or click Add
6. Email appears in list below
7. Auto-saved immediately

**To Add Webhook**:
1. Select notification type
2. Click Webhook tab
3. Enter webhook URL
4. Configure headers (optional)
5. Configure body template (optional)
6. Click Add/Save
7. Webhook appears in configured list

**Components Used**:
- Tabs (Email/Webhook)
- Combobox (with autocomplete)
- Input (for URLs, headers)
- TextArea (for body templates)
- Badge (showing count "0", "1", etc.)
- Card (for each notification type)

**Code Reference**: See `docs/02-modules/notifications.md` for notification system

---

## Versions Tab

**URL Pattern**: `/admin/projects/{projectId}/transformations-v2/{componentId}/{configId}/versions`

### Purpose

View complete change history and restore previous versions of transformation configuration.

### Version List Display

**Each Version Shows**:
- Version number (sequential, #1, #2, #3...)
- Change description (auto-generated)
  - "Add input table in.bucket/table"
  - "Change query in Block 1"
  - "Delete output table mapping"
  - "Update variable 'date' to 2023"
- Timestamp (relative: "3 days ago" or absolute: "Dec 1, 2022 11:12")
- User who made the change
- User avatar

**User Actions**:
- Click version → View version details
- Compare versions (checkbox selection)
- Restore version (rollback button)
- View diff (shows what changed)

**Components Used**:
- Timeline (vertical)
- Card (for each version)
- Avatar (user images)
- Badge (version numbers)
- Button (restore, compare)
- Diff viewer (for comparisons)

---

## Creating a New Transformation

### Step 1: Click "Create Transformation"

**From**: Transformations list page

**Opens**: Create transformation modal

### Step 2: Configure Basic Settings

**Modal Fields**:
1. **Name** (required)
   - Text input
   - Unique within project

2. **Backend** (required dropdown)
   - Snowflake SQL (default)
   - Python
   - R
   - Julia
   - dbt
   - Other SQL backends (Synapse, Redshift, Exasol, Teradata)

3. **Backend Size** (dropdown)
   - Small (default)
   - Medium
   - Large
   - Affects workspace resources

4. **Folder** (optional)
   - Organize transformations
   - Create new folder or select existing

5. **Description** (optional)
   - Markdown supported

**Buttons**:
- "Create" (green, primary)
- "Cancel" (secondary)

### Step 3: Add Input Mapping

**After Creation**: Transformation detail page opens

**Click "New Table Input"**:

**Modal Fields**:
1. **Source** (required)
   - Dropdown of Storage tables
   - Search/filter supported
   - Shows bucket and table name

2. **Destination** (required)
   - Table name in transformation
   - Must be valid SQL identifier
   - Default: source table name

3. **Columns** (optional)
   - Select specific columns
   - Default: all columns

4. **Where Filters** (optional)
   - Filter source data
   - SQL WHERE clause syntax
   - Example: `date > '2023-01-01'`

5. **Changed In Last** (optional)
   - Only load recently changed data
   - Specify days/hours

6. **Data Types** (optional)
   - Override column types
   - Specify length/precision

**Click "Create"**: Mapping added to list

### Step 4: Write Transformation Code

**Click "New Code Block"** or edit existing

**In Code Editor**:
1. Write SQL query
2. Reference input tables by destination name
3. Use variables with `{{variableName}}` syntax
4. Create output tables
5. Use auto-complete (Ctrl+Space)
6. Click "Save"

**Example**:
```sql
-- Input table: customers (from in.c-main.customers)
-- Variable: min_date

CREATE TABLE filtered_customers AS
SELECT
  customer_id,
  customer_name,
  registration_date
FROM customers
WHERE registration_date >= '{{min_date}}'
  AND status = 'active';
```

### Step 5: Add Output Mapping

**Click "New Table Output"**:

**Modal Fields**:
1. **Source** (required)
   - Table created in transformation
   - Dropdown shows all created tables

2. **Destination** (required)
   - Storage bucket.table
   - Format: `out.c-bucket.table`

3. **Incremental** (toggle)
   - ON: Append new rows
   - OFF: Replace entire table

4. **Primary Key** (if incremental)
   - Columns to identify unique rows
   - Multiple columns supported

5. **Delete Rows** (if incremental)
   - Delete existing rows matching criteria
   - WHERE clause syntax

**Click "Create"**: Output mapping configured

### Step 6: Configure Variables (Optional)

**Click "New Variable"**:

**Modal Fields**:
1. **Name** (required)
   - Valid identifier
   - Used in queries as `{{name}}`

2. **Value** (required)
   - Default value
   - Can be overridden in flow

3. **Type** (optional)
   - String (default)
   - Number
   - Boolean

**Click "Create"**: Variable available for use

### Step 7: Test Transformation

**Click "Run transformation"** (sidebar)

**Execution Flow**:
1. Shows "Running" status
2. Creates temporary workspace (if first run)
3. Loads input tables
4. Executes code blocks sequentially
5. Saves output tables to Storage
6. Shows success/error status
7. Displays job duration

**During Execution**:
- Modal shows progress
- Can cancel job
- Real-time log output
- Error highlighting if failure

**After Execution**:
- Job appears in "Last Use" panel
- Version created (if config changed)
- Output tables available in Storage

---

## Advanced Features

### Shared Code

**Purpose**: Reuse SQL code across multiple transformations

**Usage**:
1. Create shared code in transformation settings
2. Click "Select Shared Code" in code block
3. Select from list of shared codes
4. Shared code prepended to block
5. Updates propagate to all transformations using it

### Workspace Integration

**Create Workspace from Transformation**:
1. Click "Create new workspace"
2. Generates Snowflake/Redshift/etc. workspace
3. Loads all input tables
4. Provides credentials to connect
5. Use for development/debugging

**Copy to Existing Workspace**:
1. Select target workspace
2. Copies input tables
3. Optionally run transformation
4. Results available in workspace

### Debug Mode

**Access**: Click "Debug mode" in sidebar

**Shows**:
- Raw JSON configuration
- API request/response
- Internal IDs
- Advanced settings not in UI

**Use Cases**:
- Troubleshooting
- Manual edits
- Bulk operations via API
- Component development

### Automatic Data Types

**When Enabled** (default):
- Keboola detects column types from data
- Creates typed tables in backend
- Improves query performance
- Handles schema changes automatically

**When Disabled**:
- Manual type specification required
- More control over types
- Needed for edge cases (very large numbers, special formats)

### Phases (Legacy - Not in Snowflake SQL)

**Note**: Snowflake SQL transformations don't use phases. Python/R transformations may have multiple phases for dependency management.

---

## Error States & Handling

### Common Errors

**1. Input Table Not Found**
```
Error: Table 'in.c-main.customers' does not exist in Storage
```
**Fix**: Create table in Storage or fix input mapping

**2. SQL Syntax Error**
```
Error: SQL compilation error: syntax error line 3 at position 15 unexpected 'FORM'
```
**Fix**: Correct SQL syntax in code block

**3. Output Table Conflict**
```
Error: Table 'out.c-main.results' already exists and incremental load is OFF
```
**Fix**: Enable incremental load or change destination table

**4. Workspace Timeout**
```
Error: Transformation exceeded timeout (1d)
```
**Fix**: Optimize query or increase timeout

**5. Variable Not Defined**
```
Error: Variable {{date}} is not defined
```
**Fix**: Add variable in Variables section

### Error Display

**In UI**:
- Red error banner at top
- Error message with details
- Link to job detail for full logs
- Suggested fixes (when available)

**In Job Queue**:
- Job status: "error" (red badge)
- Full error log
- Stack trace (for Python/R)
- Query that failed

**Components Used**:
- Alert (error display)
- Toast (notifications)
- Modal (error details)
- Code block (error highlighting)

---

## Empty States

### No Transformations

**Display**:
- Illustration (data transformation icon)
- Heading: "No transformations yet"
- Description: "Create your first transformation to manipulate data with SQL, Python, R, or dbt"
- "Create Transformation" button (large, prominent)
- Links to documentation and templates

### No Input Mappings

**Display**:
- Text: "No input tables configured"
- Description: "Add tables from Storage to use in your transformation"
- "New Table Input" button

### No Output Mappings

**Display**:
- Text: "No output tables configured"
- Description: "Save transformation results back to Storage"
- "New Table Output" button

### No Code Blocks

**Display**:
- Text: "No code blocks yet"
- "New Code Block" button
- Quick start templates (optional)

---

## Loading States

**Page Load**:
- Skeleton loader for transformation list
- Shimmer effect on cards

**Running Transformation**:
- Progress modal with spinner
- "Running transformation..." message
- Cancel button
- Estimated time remaining (if available)

**Saving Changes**:
- "Save" button shows spinner
- Disabled during save
- Success toast on completion

**Components Used**:
- Skeleton (list items)
- Spinner (loading indicator)
- ProgressBar (for multi-step operations)

---

## Permission-Based UI

### Admin Users
- Create/edit/delete all transformations
- Change backend size
- Access debug mode
- Delete transformations

### Developer Users
- Create/edit own transformations
- Run transformations
- View all transformations
- Cannot delete others' work

### Read-Only Users
- View transformations
- View code and configuration
- Cannot run or edit
- "Run" button disabled

---

## Keyboard Shortcuts

**In Transformation List**:
- `n` - New transformation
- `/` - Focus search
- `↑`/`↓` - Navigate list
- `Enter` - Open selected transformation

**In Code Editor**:
- `Ctrl/Cmd + S` - Save
- `Ctrl/Cmd + /` - Toggle comment
- `Ctrl/Cmd + F` - Find
- `Ctrl/Cmd + Space` - Auto-complete
- `F11` - Full-screen
- `Esc` - Close editor

---

## Cross-References

### Related Workflows
- Flow Creation: `docs/05-workflows/03-flow-creation-execution.md` - Using transformations in flows
- Storage Operations: `docs/05-workflows/02-storage-operations.md` - Input/output tables
- Workspace Management: Creating workspaces from transformations

### Module Documentation
- Transformations module: `docs/02-modules/transformations-v2.md`
- Legacy transformations: `docs/02-modules/legacy-transformation.md`
- Notifications: `docs/02-modules/notifications.md`
- Queue: `docs/02-modules/queue.md`

### Design System
- SqlEditor: `docs/04-components/code-editor-components.md`
- Button: `docs/04-components/form-components.md`
- Modal: `docs/04-components/INDEX.md`
- Table: `docs/04-components/INDEX.md`
- Badge: `docs/04-components/INDEX.md`

### API Documentation
- Storage API: `docs/06-api-contracts/api-clients.md` - Table operations
- Queue API: `docs/06-api-contracts/api-clients.md` - Job execution

---

## Technical Implementation

### State Management
- **Modern**: TanStack Query for data fetching
- **Legacy**: Some components still use Flux/Immutable.js
- **Real-time**: Polling for job status updates

### API Endpoints
- `GET /admin/projects/{id}/transformations-v2` - List transformations
- `GET /transformations/{id}` - Get transformation detail
- `POST /transformations` - Create transformation
- `PUT /transformations/{id}` - Update transformation
- `POST /transformations/{id}/run` - Execute transformation
- `GET /transformations/{id}/versions` - Version history
- `POST /transformations/{id}/versions/{version}/rollback` - Restore version

### Performance Optimizations
- Code editor lazy-loaded (only when opened)
- Virtual scrolling for large code blocks
- Debounced auto-save
- Cached syntax highlighting
- Optimistic updates for variable changes

### Data Flow
```
Storage → Input Mapping → Transformation Workspace → Code Execution → Output Mapping → Storage
```

**Code Reference**: See `docs/02-modules/transformations-v2.md` for complete implementation details

---

## Notes

- Snowflake SQL is the most commonly used transformation type
- Transformations can be organized in folders for better management
- Variables enable parameterization and reusability across flows
- Each code block executes sequentially (Block 1, then Block 2, etc.)
- Output tables are not created in Storage until transformation runs successfully
- Workspace size affects performance and cost - Small is suitable for most use cases
- Automatic data types recommended unless specific type control needed
- Version history provides audit trail and rollback capability
- Notifications help monitor transformation execution in production

---

**Last Updated**: 2025-10-18
**Phase**: 3 - UI Exploration
**Status**: Complete
