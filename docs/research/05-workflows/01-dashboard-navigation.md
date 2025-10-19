# Workflow: Dashboard & Navigation

## Overview

The Dashboard is the entry point for all Keboola Connection projects, providing an overview of project activity, recent work, team members, and quick access to all major features. It serves as the central hub for navigation and project monitoring.

**URL Pattern**: `/admin/projects/{projectId}/dashboard`

**Module Reference**: See `docs/02-modules/home.md` for code details

## Prerequisites

- User must be authenticated and have access to the project
- Project must be active (not deleted)
- User needs appropriate permissions to view different sections

---

## Dashboard Layout Structure

### Top Navigation Bar

**Screenshot**: `docs/08-screenshots/01-dashboard-overview.png`

#### Left Section
1. **Keboola Logo** - Links back to project list
2. **Project Selector** - Dropdown showing:
   - Organization hierarchy path
   - Current project name (e.g., "Padák - EU")
   - Allows switching between projects
3. **Environment Badge** - Shows current environment (e.g., "Production")

#### Right Section
1. **Search** - Global search with keyboard shortcut (/)
2. **Recently Deleted** - Trash icon with count badge (shows "4")
3. **Navigation Hotkeys** - Keyboard shortcuts help
4. **User Profile** - Avatar with dropdown menu

**Components Used**:
- Button (variant: ghost, with dropdown)
- Badge (for notification counts)
- Input (for search)
- DropdownMenu (for project selector and user menu)
- Avatar (for user profile image)

**Code Reference**: `apps/kbc-ui/src/scripts/modules/home/react/components/Header.tsx`

---

### Main Navigation Sidebar

**Location**: Left side of screen

**Menu Items**:
1. **Dashboard** - Current page (highlighted)
2. **Flows** - Workflow orchestration (expandable)
3. **Components** - Extractors, writers, apps (expandable)
4. **Templates** - Pre-built configurations
5. **Data Catalog** - Shared data catalog
6. **Storage** - Tables and buckets
7. **Transformations** - SQL/dbt transformations
8. **Workspaces** - External database connections
9. **Jobs** - Queue and job history

**Components Used**:
- NavigationMenu
- Button (variant: ghost, with icon)
- Collapsible (for expandable sections)

**Interaction Pattern**:
- Active item highlighted with blue background
- Icons positioned left of text
- Click to navigate
- Some items expand with sub-menus (Flows, Components)

**Code Reference**: `apps/kbc-ui/src/scripts/modules/home/react/components/Sidebar.tsx`

---

## Dashboard Widgets

### 1. Latest CLI Activity Widget

**Screenshot**: `docs/08-screenshots/01-dashboard-overview.png` (top left)

**Purpose**: Shows the most recent CLI command execution

**Content**:
- Time since last activity (e.g., "3 months ago")
- Command description (e.g., "Remote-table-unload command done")
- Link to Settings page
- Minimize/close button (top right)

**Components Used**:
- Card
- Heading (h3 for widget title, h1 for time, h4 for description)
- Link
- Button (icon button for close)

**User Actions**:
- Click "Settings" link to view CLI configuration
- Click close button to hide widget

**Code Reference**: See `docs/02-modules/home.md` - LatestCliActivity component

---

### 2. Access Widget

**Screenshot**: `docs/08-screenshots/01-dashboard-overview.png` (middle left)

**Purpose**: Quick overview of project access statistics

**Content**:
- **10 Users** - Number of team members
- **26 API Tokens** - Number of active tokens
- Edit icon (top right)

**Components Used**:
- Card
- Heading (h3 for title, h1 for count, h4 for label)
- Button (icon button for edit)

**User Actions**:
- Click edit icon to manage access settings

**Code Reference**: See `docs/02-modules/home.md` - Access component

---

### 3. Continue Your Work Widget

**Screenshot**: `docs/08-screenshots/01-dashboard-overview.png` (middle center)

**Purpose**: Shows recently edited/created configurations for quick access

**Content**:
- List of recent items with:
  - Component icon
  - Configuration name
  - Action and timestamp (e.g., "Edited Oct 17 18:32")
  - Deleted items marked with trash icon
  - Arrow indicator for navigation
- Pagination controls (left/right arrows)

**Recent Items Shown**:
1. Custom Python: Pabu01 demo (Edited)
2. Custom Python: Pabu01 demo (Deleted)
3. Custom Python: test (Edited)
4. Custom Python: e2b mockup (Edited)
5. Flow: Sub-parent (Edited)
6. Flow: Parent (Edited)

**Components Used**:
- Card
- Link (styled as card item)
- Avatar (for component icons)
- Badge (for status indicators)
- Button (pagination arrows)
- Carousel/Slider (for pagination)

**User Actions**:
- Click any item to navigate to configuration
- Use pagination arrows to see more items
- Click deleted items to go to trash

**Code Reference**: See `docs/02-modules/home.md` - ContinueYourWork component

---

### 4. Project Users Widget

**Screenshot**: `docs/08-screenshots/01-dashboard-overview.png` (top right)

**Purpose**: Shows team members and their online status

**Content**:
- "Manage users" link (top right)
- List of users with:
  - Avatar image
  - Full name
  - Online/Offline status
- Pagination controls

**Users Shown**:
1. Petr EU Šimeček - Online (green indicator)
2. Petr Dospiva - Offline
3. Ondrej Popelka - Offline
4. Václav Nosek - Offline
5. David Esner - Offline
6. Ondřej Jodas - Offline

**Components Used**:
- Card
- Avatar (with online status badge)
- Link (for "Manage users")
- Button (pagination)
- Badge (online status indicator)

**User Actions**:
- Click "Manage users" to access user management
- Use pagination to see all users

**Code Reference**: See `docs/02-modules/home.md` - ProjectUsers component

---

### 5. Latest Activity Widget

**Screenshot**: `docs/08-screenshots/01-dashboard-overview.png` (bottom, full width)

**Purpose**: Comprehensive activity log showing jobs, edits, and configuration changes

**Features**:
- Search field (top left)
- Filter dropdown: "All data" (top right)
- Table with columns:
  - **Name** - Component/user name and action
  - **Duration / Version** - Job duration or version number
  - **Created / Last Change** - Timestamp
  - **Status** - Success/Error indicator

**Activity Types**:
1. **Job Runs** (Application):
   - Component icon
   - Configuration name
   - Duration (e.g., "7 sec", "16 sec")
   - Timestamp
   - Status badge (green "Success")

2. **Configuration Changes**:
   - User avatar
   - Action (edited/created/deleted)
   - Configuration name
   - Version number
   - Timestamp

**Recent Activities Shown**:
- Storage Table Downloader - 7 sec - Success
- Custom Python: Pabu01 demo - 16 sec - Success
- User edits and configuration changes

**Components Used**:
- Card
- Input (with search icon)
- Select/Combobox (for filter)
- Table (with custom styling)
- Link (table rows are clickable)
- Badge (for status indicators)
- Avatar (for user actions)

**User Actions**:
- Search activities by name
- Filter by data type (All data/specific types)
- Click any row to view details
- Scroll to see more activities

**Code Reference**: See `docs/02-modules/home.md` - LatestActivity component

---

## Navigation Patterns

### 1. Main Navigation

**Pattern**: Click navigation menu items to switch between major sections

**Example Flow**:
```
Dashboard → Click "Storage" → Storage page loads
Dashboard → Click "Flows" → Flows list/builder loads
Dashboard → Click "Components" → Components catalog loads
```

**Code**: Uses React Router for client-side routing

---

### 2. Widget-Based Navigation

**Pattern**: Click items within widgets to jump to specific configurations

**Example Flow**:
```
Dashboard → "Continue Your Work" widget → Click "Pabu01 demo" → Configuration detail page
Dashboard → "Latest Activity" → Click job row → Job detail page
Dashboard → "Project Users" → Click "Manage users" → User settings page
```

---

### 3. Search-Based Navigation

**Pattern**: Use global search to find any component, configuration, or resource

**Keyboard Shortcut**: `/` (forward slash)

**Example Flow**:
```
Dashboard → Press "/" → Search modal opens → Type "flow name" → Select result → Navigate
```

**Code Reference**: Global search implemented in `apps/kbc-ui/src/scripts/modules/search/`

---

### 4. Breadcrumb Navigation

**Pattern**: Top bar shows organizational hierarchy

**Example**:
```
[Keboola] PRODUCT - team projects / Padák - EU
```

**User Actions**:
- Click project selector to see organization tree
- Switch to different projects
- Navigate up to organization level

---

## Empty States

**When**: New project with no activity

**Display**:
- Widgets show empty state messages
- "Get Started" prompts or tutorial links
- Sample data suggestions

**Components**: EmptyState component with illustration and CTA buttons

---

## Error States

**Scenarios**:
1. **Failed to load activity**: Error message in Latest Activity widget
2. **No access**: Missing widgets or disabled buttons
3. **Network error**: Retry button and error notification

**Components**: Alert, Toast notification

---

## Loading States

**On Page Load**:
- Skeleton loaders for each widget
- Shimmer effect on content areas
- Spinner for slower data

**Components**: Skeleton, Spinner

**Code Reference**: Design system skeleton components in `docs/04-components/`

---

## Permission-Based UI Changes

### Admin Users
- See all widgets
- "Manage users" link visible
- Access widget with edit icon

### Regular Users
- Limited widget visibility
- No user management access
- Restricted Latest Activity view

### Read-Only Users
- View-only dashboard
- No edit actions available
- Limited navigation options

**Code Reference**: See `docs/02-modules/admin.md` for RBAC implementation

---

## Interactions & Transitions

### Widget Interactions
- **Hover**: Card highlights with subtle shadow
- **Click**: Immediate navigation (no loading overlay)
- **Pagination**: Smooth slide transition

### Navigation Transitions
- **Route Change**: Fade transition between pages
- **Active State**: Blue highlight on current menu item
- **Loading**: Skeleton placeholder maintains layout

---

## Keyboard Shortcuts

**Available on Dashboard**:
- `/` - Open search
- `g d` - Go to Dashboard
- `g f` - Go to Flows
- `g s` - Go to Storage
- `g t` - Go to Transformations
- `?` - Show all keyboard shortcuts

**Code Reference**: Keyboard shortcuts implemented via keyboard navigation utility

---

## Cross-References

### Related Workflows
- Storage Operations: `docs/05-workflows/02-storage-operations.md`
- Flow Creation: `docs/05-workflows/03-flow-creation.md`
- Job Monitoring: Access via Latest Activity widget

### Module Documentation
- Dashboard module: `docs/02-modules/home.md`
- Admin/RBAC: `docs/02-modules/admin.md`
- Settings: `docs/02-modules/settings.md`

### Design System
- Button: `docs/04-components/form-components.md`
- Card: `docs/04-components/INDEX.md`
- Table: `docs/04-components/INDEX.md`
- Avatar: `docs/04-components/INDEX.md`
- Badge: `docs/04-components/INDEX.md`

---

## Technical Implementation

### State Management
- **Pattern**: Flux + Immutable.js (legacy)
- **Store**: HomeStore manages dashboard state
- **Actions**: HomeActions for data fetching

### API Endpoints
- `GET /admin/projects/{id}/dashboard` - Dashboard data
- `GET /admin/projects/{id}/activity` - Latest activity
- `GET /admin/projects/{id}/users` - Project users

### Performance Optimizations
- Widgets load independently
- Activity table uses virtual scrolling for large datasets
- Cached user avatars

**Code Reference**: See `docs/02-modules/home.md` for complete API and state management details

---

## Notes

- Dashboard is highly customizable per project
- Widget visibility can be configured
- Activity log supports extensive filtering (implementation varies)
- Real-time updates for online status
- Mobile-responsive layout (stacks widgets vertically)

---

**Last Updated**: 2025-10-18
**Phase**: 3 - UI Exploration
**Status**: Complete
