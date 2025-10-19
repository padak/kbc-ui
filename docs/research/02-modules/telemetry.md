# Module: Telemetry

## Overview

The Telemetry module provides analytics and usage dashboards for monitoring project consumption, organization-wide metrics, and system activity. It integrates with GoodData Cloud Native (GDC) for dashboard embedding and rendering. The module displays real-time billing information, project health metrics, job monitoring, and user activity within the Keboola platform.

Key features:
- Project consumption dashboard with real-time metrics
- Organization-wide usage analytics
- Activity center with multi-view dashboards (organization, project, users, health, jobs)
- Dynamic dashboard provisioning via API
- GoodData embedded dashboards with read-only access
- Real-time data alert system

## File Structure

```
telemetry/
├── routes.ts                           # Route configuration
├── GoodDataDashboard.tsx               # GoodData dashboard wrapper
├── BillingConsumptionInfo.tsx          # Project consumption view
├── OrganizationUsageInfo.tsx           # Organization usage view
├── ActivityCenter.tsx                  # Activity center with tabs
├── LoadingData.tsx                     # Loading state component
├── RealTimeInfoAlert.tsx               # Real-time data alert banner
└── __tests__/
    └── (no specific tests)
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/billing-consumption` | BillingConsumptionInfo | Project consumption dashboard |
| `/organization-usage` | OrganizationUsageInfo | Organization usage dashboard |
| `/activity-center` | ActivityCenter | Multi-view activity dashboards |

**Route Configuration**:
- All routes include `RealTimeInfoAlert` as info alert handler
- `billing-consumption` includes BackLink for breadcrumb navigation
- Routes use lazy loading for dashboard components

## Key Components

### GoodDataDashboard
- **Location**: `GoodDataDashboard.tsx`
- **Purpose**: Wrapper component that embeds GoodData Cloud Native dashboards
- **Props**:
  - `gdcnHost: string` - GDC Cloud Native instance hostname
  - `userToken: string` - Authentication token for GDC
  - `workspaceId: string` - GDC workspace identifier
  - `dashboardId: string` - GDC dashboard identifier
- **Key Features**:
  - Dynamically loads GoodData CSS stylesheet
  - Creates authenticated backend connection
  - Applies caching configuration
  - Read-only dashboard mode (no editing)
- **Pattern**: Uses GoodData SDK for backend initialization and Dashboard component

### BillingConsumptionInfo
- **Location**: `BillingConsumptionInfo.tsx`
- **Purpose**: Project-level consumption dashboard
- **Workflow**:
  1. Gets current project type from ApplicationStore
  2. Calls `api.telemetry.provisioning.createCredentials()` with project type
  3. Receives credentials including GDC connection details and dashboard ID
  4. Passes credentials to GoodDataDashboard for rendering
- **Data Flow**: Project Type → API Call → GDC Credentials → Dashboard
- **Key Pattern**: Credentials fetched on component mount via useMutation

### OrganizationUsageInfo
- **Location**: `OrganizationUsageInfo.tsx`
- **Purpose**: Organization-level usage analytics
- **Similar to**: BillingConsumptionInfo but for organization scope
- **Dashboard Type**: Aggregated metrics across all organization projects
- **Note**: Located in telemetry module but integrated with billing module

### ActivityCenter
- **Location**: `ActivityCenter.tsx`
- **Purpose**: Multi-tab dashboard view for system monitoring
- **Tabs**:
  1. **Organization Usage**: Organization-wide metrics and trends
  2. **Project Overview**: Project summary and key metrics
  3. **Project Users**: User activity and engagement
  4. **Project Health**: System health and resource metrics
  5. **Jobs Monitoring**: Job execution status and performance
- **Workflow**:
  1. Component renders tab interface
  2. Each tab renders Dashboard subcomponent
  3. Dashboard calls provisioning API for credentials
  4. Returns GoodData dashboard embedded by ID
- **Key Pattern**: Dashboard ID mapping (hardcoded backend order):
  ```typescript
  DASHBOARD_ID_MAP = [
    'organization-usage',      // Index 0
    'project-overview',        // Index 1
    'project-users',           // Index 2
    'project-health',          // Index 3
    'jobs-monitoring',         // Index 4
  ]
  ```

### LoadingData
- **Location**: `LoadingData.tsx`
- **Purpose**: Loading state component
- **Props**:
  - `isLoading: boolean` - Loading indicator
- **Usage**: Shown while credentials are being provisioned

### RealTimeInfoAlert
- **Location**: `RealTimeInfoAlert.tsx`
- **Purpose**: Alert banner indicating real-time data freshness
- **Content**: "This data is updated in real-time" or similar message
- **Usage**: Injected as `infoAlertHandler` in all telemetry routes

## API Endpoints

| Method | Endpoint | Purpose | Response Type |
|--------|----------|---------|---------------|
| POST | `/telemetry/provisioning/createCredentials` | Get GDC credentials | `{ userToken, workspaceId, dashboardId, gdcnHost }` |

**Request Body**:
```typescript
{
  project_type: string  // 'activity-center' or project type (standard, advanced, etc.)
}
```

**Response**:
```typescript
{
  userToken: string;           // Bearer token for GDC authentication
  workspaceId: string;         // GDC workspace ID
  dashboardId: string;         // Dashboard ID (comma-separated for activity-center)
  gdcnHost: string;           // GDC Cloud Native hostname
}
```

## State Management

### Patterns Used
1. **React Hooks**: useState, useEffect, useMemo, useLayoutEffect
2. **TanStack React Query**: useMutation for credentials provisioning
3. **React Context**: Not explicitly used in telemetry
4. **Component State**: Minimal - mostly data flow through props

### Key Queries/Mutations

#### Credentials Mutation
```typescript
const { mutate: createCredentials, data, isPending } = useMutation({
  mutationFn: () =>
    api.telemetry.provisioning.createCredentials({ project_type })
})
```

- Called automatically on component mount via useEffect
- Returns credentials needed for dashboard embedding
- Loading state reflected in isPending flag

### Data Flow
1. Component mounts → useEffect triggers createCredentials mutation
2. Mutation called with project_type parameter
3. API returns GDC credentials and dashboard ID(s)
4. Mutation data used to render GoodDataDashboard
5. GoodDataDashboard creates backend connection and renders dashboard
6. Read-only config prevents user edits

## Dependencies

### Internal Modules
- `modules/billing` - BackLink for navigation
- `stores/ApplicationStore` - Current project information
- `modules/telemetry` - API client for provisioning

### External Packages
- **@gooddata/sdk-backend-tiger**: GoodData backend factory
- **@gooddata/sdk-ui-dashboard**: Dashboard component
- **@gooddata/sdk-backend-base**: Caching configuration
- **@tanstack/react-query**: Data fetching state management
- **@keboola/api-client**: Telemetry API endpoints

### Design System Components
- `Tabs`, `TabsContent` from @keboola/design
- No direct use of lower-level design components (dashboard handles UI)

## Notable Patterns

### Lazy Route Loading
Routes use async/await lazy loading:

```typescript
{
  name: routeNames.ACTIVITY_CENTER,
  title: 'Activity Center',
  lazy: async () => {
    const ActivityCenter = await import('./ActivityCenter');
    return { Component: ActivityCenter.default };
  },
}
```

Benefits:
- Reduces initial bundle size
- Dashboards loaded only when needed
- Separate code chunks for each dashboard type

### GDC Credential Provisioning
Credentials are fetched on-demand rather than pre-provisioned:

```typescript
useEffect(() => {
  createCredentials();  // Fetch credentials when mounted
}, [createCredentials]);
```

Pattern:
- Each dashboard view requests fresh credentials
- Ensures tokens are current and not stale
- Allows per-project/per-dashboard authorization control

### Dashboard ID Mapping
Activity Center uses array index to lookup correct dashboard:

```typescript
const dashboardTypeIndex = DASHBOARD_ID_MAP.indexOf(props.type);
const dashboardsIds = data.dashboardId.split(',');
return dashboardsIds[dashboardTypeIndex];
```

Rationale:
- Backend returns comma-separated list in fixed order
- Order defined in backend provisioning configuration
- Index lookup ensures correct dashboard per tab

### GoodData Stylesheet Injection
CSS loaded dynamically to avoid unused styles in other views:

```typescript
useLayoutEffect(() => {
  if (document.getElementById('gooddata-css')) {
    return;  // Already loaded
  }
  const link = document.createElement('link');
  link.id = 'gooddata-css';
  link.rel = 'stylesheet';
  link.href = `${props.gdcnHost}/components/911.css`;
  document.head.appendChild(link);
}, [props.gdcnHost]);
```

Benefits:
- Stylesheets loaded only when GDC dashboard needed
- Prevents CSS conflicts from unused styles
- Handles dynamic hostname for different environments

### Caching Configuration for GDC
Recommended caching applied to backend:

```typescript
const backend = withCaching(
  factory()
    .onHostname(props.gdcnHost)
    .withAuthentication(new TigerTokenAuthProvider(props.userToken)),
  RecommendedCachingConfiguration,
);
```

Benefits:
- Improves dashboard load performance
- Reduces API calls to GDC
- Respects GDC recommended cache settings

## User-Facing Features

### Feature 1: Project Consumption Dashboard
- **Description**: View detailed project consumption metrics and billing info
- **Entry Point**: Billing section → "Project Consumption" or sidebar link
- **Metrics Displayed**:
  - Credit consumption over time
  - Resource utilization (CPU, memory, storage)
  - Cost breakdown by service
  - Historical trends
- **Interaction**: Interactive charts for drilling down into details
- **Components**: `BillingConsumptionInfo`, `GoodDataDashboard`

### Feature 2: Organization Usage Analytics
- **Description**: See usage patterns across entire organization
- **Entry Point**: Admin section → "Organization Usage"
- **Metrics Displayed**:
  - Total organization consumption
  - Per-project usage comparison
  - Usage trends
  - Resource allocation efficiency
- **Components**: `OrganizationUsageInfo`, `GoodDataDashboard`

### Feature 3: Activity Center - Multi-View Monitoring
- **Description**: Comprehensive system monitoring with five specialized views
- **Entry Point**: Admin or monitoring section → "Activity Center"
- **Tabs Available**:
  1. **Organization Usage**: High-level organization metrics
  2. **Project Overview**: Summary of current project status
  3. **Project Users**: Active users and engagement metrics
  4. **Project Health**: System health checks and alerts
  5. **Jobs Monitoring**: Real-time job execution tracking
- **Workflow**:
  1. Click tab to view specific dashboard
  2. Dashboard loads with fresh credentials
  3. View real-time metrics and historical data
  4. Click through for deeper analysis
- **Components**: `ActivityCenter`, `Dashboard` (internal), `GoodDataDashboard`

### Feature 4: Real-Time Data Indicator
- **Description**: Alert users that dashboard data updates in real-time
- **Location**: Top of dashboard views
- **Purpose**: Sets expectations for metric freshness
- **Component**: `RealTimeInfoAlert`

## Technical Debt & Observations

### Current Limitations
1. **GDC Dependency**: Entire module depends on external GoodData platform
2. **Hardcoded Dashboard Order**: Backend order embedded in client code
3. **Simple Provisioning**: No caching of credentials, always fresh
4. **Limited Error Handling**: Minimal error handling for provisioning failures

### Potential Issues
1. **Token Expiration**: No refresh mechanism if token becomes invalid
2. **Offline Dashboard Loading**: No fallback if GDC is unavailable
3. **Credential Leakage**: Tokens stored in component state (could use secure storage)
4. **No Loading Timeout**: Component waits indefinitely for credentials

### Areas for Improvement
1. Add credential caching with TTL for performance
2. Implement credential refresh on token expiration
3. Add error boundary with user-friendly error messages
4. Implement timeout and retry logic
5. Use secure credential storage
6. Add telemetry for dashboard load success/failure
7. Support dashboard customization per user

### Migration Notes
- Telemetry module is relatively simple wrapper around GoodData
- Good example of integration pattern for embedded analytics
- Could be expanded to support other analytics providers

## Code Examples

### Basic Dashboard Rendering
```typescript
// From BillingConsumptionInfo.tsx
const BillingConsumptionInfo = () => {
  const api = useApiClient();
  const projectType = ApplicationStore.getCurrentProject().get('type');

  const { mutate: createCredentials, data, isPending } = useMutation({
    mutationFn: () => api.telemetry.provisioning.createCredentials({ project_type: projectType }),
  });

  useEffect(() => {
    createCredentials();
  }, [createCredentials]);

  if (!data) {
    return <LoadingData isLoading={isPending} />;
  }

  return <GoodDataDashboard {...data} />;
};
```

### Activity Center Tab Management
```typescript
// From ActivityCenter.tsx
const TABS = [
  { title: 'Organization Usage', value: 'organization-usage' },
  { title: 'Project Overview', value: 'project-overview' },
  // ...
];

const ActivityCenter = () => {
  return (
    <Tabs triggers={TABS}>
      {TABS.map(({ value }) => (
        <TabsContent key={value} value={value}>
          <Dashboard type={value} />
        </TabsContent>
      ))}
    </Tabs>
  );
};
```

### GDC Dashboard Embedding
```typescript
// From GoodDataDashboard.tsx
const GoodDataDashboard = (props: WorkspaceData) => {
  const backend = useMemo(() => {
    return withCaching(
      factory()
        .onHostname(props.gdcnHost)
        .withAuthentication(new TigerTokenAuthProvider(props.userToken)),
      RecommendedCachingConfiguration,
    );
  }, [props.userToken, props.gdcnHost]);

  return (
    <Dashboard
      backend={backend}
      workspace={props.workspaceId}
      dashboard={props.dashboardId}
      config={{ isReadOnly: true }}
    />
  );
};
```

## Related Modules

- `modules/billing` - Billing and consumption management (parent module)
- `modules/admin` - Administrative functions and organization management
- `stores/ApplicationStore` - Application state including current project

## Testing

### Test Approach
- Limited specific tests for telemetry module (mostly wrapper components)
- Component testing would focus on:
  - Credential provisioning flow
  - Tab switching in Activity Center
  - Loading state transitions
  - GDC dashboard props correctly passed

### Integration Testing
- End-to-end tests should verify:
  - Credentials retrieved from provisioning API
  - Dashboard loads with correct credentials
  - Multiple dashboards can be viewed sequentially
  - Error handling when provisioning fails

### Accessibility

1. **Tab Navigation**: Tabs keyboard navigable via arrow keys and Tab
2. **Focus Management**: Focus preserved when switching tabs
3. **ARIA Labels**: Tabs and content labeled for screen readers
4. **GDC Dashboard**: Inherits accessibility from GoodData SDK
   - Dashboard components include ARIA attributes
   - Color not only indicator (charts have legends)
   - Interactive elements keyboard accessible

## Performance Considerations

1. **Lazy Loading**: Routes and components lazy-loaded to reduce initial bundle
2. **CSS Injection**: GDC styles loaded only when dashboard viewed
3. **Credential Caching**: Could cache credentials to avoid re-provisioning
4. **Backend Caching**: GDC recommends caching configuration applied
5. **Memoization**: useMemo for backend prevents recreation on re-renders

## Future Enhancements

1. **Credential Refresh**: Automatically refresh tokens before expiration
2. **Offline Support**: Cache dashboard data for offline viewing
3. **Custom Dashboards**: Allow users to customize dashboard layouts
4. **Dashboard Scheduling**: Schedule reports and email them
5. **Alerts**: Real-time alerts for consumption thresholds
6. **Export**: Export dashboard data to CSV/PDF
7. **Mobile Optimization**: Responsive dashboard layouts for mobile devices
