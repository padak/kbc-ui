# Module: Lineage

## Overview

The Lineage module provides data lineage visualization and navigation within Keboola Connection. It displays how data flows between tables, configurations, and projects through interactive graph visualizations. The module uses React Flow for rendering dynamic graph layouts and supports both table-level and project-level lineage tracking with column-level granularity for detailed data provenance.

Key capabilities include:
- Interactive graph visualization of data transformations and dependencies
- Table lineage with column-level tracking
- Project-level lineage showing cross-project relationships
- LLM-calculated lineage for intelligent data flow detection
- Dynamic node and edge rendering with filtering

## File Structure

```
lineage/
├── api.ts                              # API calls for lineage data
├── types.ts                            # TypeScript types
├── constants.ts                        # Constants (routes, error codes, components)
├── helpers.ts                          # Utility functions for graph manipulation
├── fqid.ts                             # FQID (Fully Qualified ID) construction and parsing
├── rfTypes.ts                          # React Flow specific types
├── routes.ts                           # Route definitions
├── useLayoutNodes.ts                   # ELK.js layout algorithm hook
├── useResetFocusedNode.ts              # Focused node reset logic
├── Breadcrumbs.tsx                     # Breadcrumb navigation
├── BetaTitle.tsx                       # Beta feature indicator
├── TeasingContent.tsx                  # Teasing content for locked features
├── LineageButton.tsx                   # Button to open lineage
├── TablesLineage/
│   ├── TablesLineage.tsx               # Main tables lineage component
│   └── Content.tsx                     # Content renderer
├── CombinedLineage/
│   ├── CombinedLineage.tsx             # Combined project + table lineage
│   ├── ProjectDetailLineage.tsx        # Project-level view
│   └── OrganizationDetailLineage.tsx   # Organization-level view
├── components/
│   ├── DataLineageReactFlow.tsx        # Main React Flow wrapper
│   ├── CommonEdge.tsx                  # Custom edge renderer
│   ├── ActionsPanel.tsx                # Top actions panel
│   ├── CenterButton.tsx                # Center view button
│   ├── FitViewButton.tsx               # Fit to view button
│   ├── ZoomInButton.tsx                # Zoom in control
│   ├── ZoomOutButton.tsx               # Zoom out control
│   ├── Legend.tsx                      # Graph legend
│   ├── LegendButton.tsx                # Legend toggle button
│   ├── Search.tsx                      # Node search
│   ├── ExportToPng.tsx                 # PNG export functionality
│   ├── NoGraphWrapper.tsx              # Empty state wrapper
│   ├── LoadingPlaceholder.tsx          # Loading state
│   ├── NodesLoadingPlaceholder.tsx     # Nodes loading indicator
│   ├── NoAccessIcon.tsx                # Access denied indicator
│   ├── dynamicEdges.ts                 # Dynamic edge handle logic
│   ├── highlighting.ts                 # Path highlighting logic
│   ├── constants.ts                    # Component constants
│   ├── initConfig.ts                   # React Flow initialization config
│   ├── CustomNode/
│   │   ├── BaseNode.tsx                # Base node wrapper
│   │   ├── Table.tsx                   # Table node renderer
│   │   ├── Configuration.tsx           # Configuration node renderer
│   │   ├── Project.tsx                 # Project node renderer
│   │   ├── Dropdown.tsx                # Node dropdown menu
│   │   └── Table/
│   │       ├── Table.tsx               # Table node with columns
│   │       ├── Columns.tsx             # Column list component
│   │       ├── Pagination.tsx          # Column pagination
│   │       ├── ToggleNodeButton.tsx    # Toggle node expansion
│   │       ├── SourceProjectLink.tsx   # Link to source project
│   │       └── NoAccessIcon.tsx        # Access denied for node
│   └── Sidebar/
│       ├── Sidebar.tsx                 # Details sidebar
│       ├── Description.tsx             # Node description
│       ├── Row.tsx                     # Generic row component
│       ├── RowWrapper.tsx              # Row wrapper with styling
│       ├── RowWithRenderer.tsx         # Row with custom renderer
│       ├── LinkedInfo.tsx              # Linked info section
│       ├── LineageLink.tsx             # Clickable lineage link
│       ├── LinkWithWindowIcon.tsx      # Link with external icon
│       └── helpers.ts                  # Sidebar helper functions
├── columns/
│   ├── hooks.ts                        # Column-related hooks
│   └── columnsHelpers.ts               # Column highlighting logic
├── contexts/
│   ├── GraphContext.ts                 # React context for graph state
│   ├── GraphContextProvider.tsx        # Context provider
│   ├── graphStore.ts                   # Zustand store for graph state
│   └── columnsStore.ts                 # Zustand store for column selection
└── __tests__/
    ├── helpers.test.ts
    └── columnsHelpers.test.ts
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/lineage` | CombinedLineage | Main lineage page with project navigation |
| `/lineage?projectId={id}&projectName={name}` | TablesLineage | Table-level lineage for specific project |
| `/lineage?node={nodeId}` | Details sidebar opens | Focus on specific node |

## Key Components

### DataLineageReactFlow
- **Location**: `components/DataLineageReactFlow.tsx`
- **Purpose**: Main React Flow canvas wrapper that renders all nodes, edges, and controls
- **Props**: 
  - `nodesData: NodeData[]` - Array of node data
  - `edgesData: EdgeInfo[]` - Array of edge data
  - `withColumns: boolean` - Include column-level tracking
  - `onOpenSidebar?: (nodeId: string | null) => void` - Sidebar open callback
  - `onSelectProject: OnSelectProject` - Project selection handler
- **State**: Uses Zustand stores (graphStore, columnsStore) for focused nodes and column selections
- **Key Features**:
  - Dynamic node and edge rendering with lazy initialization
  - Keyboard-free navigation (deleteKeyCode set to null)
  - Conditional rendering based on performance (RENDER_ONLY_VISIBLE_ELEMENTS_LIMIT: 500)
  - Column highlighting with path traversal
  - LLM-calculated edge differentiation

### TablesLineage
- **Location**: `TablesLineage/TablesLineage.tsx`
- **Purpose**: Main component for displaying table-level lineage
- **Props**:
  - `startingPointFqid: string` - Starting table/config FQID
  - `onOpenModal?/onCloseModal?` - Modal open/close callbacks
  - `projectId: string | null` - Current project context
- **State**: 
  - Uses `useState` for loading, error code, and graph data
  - Lazy loads lineage data via `getTablesLineage()` API call
  - Shows "tables only" toggle to filter out configurations
- **Key Workflow**:
  1. Fetches lineage data from backend AI service
  2. Maps raw data to graph format using `mapTablesDataToGraph()`
  3. Renders in modal or inline based on `onCloseModal` prop
  4. Supports both locked (teasing) and unlocked states

### CombinedLineage
- **Location**: `CombinedLineage/CombinedLineage.tsx`
- **Purpose**: Shows both project-level and table-level lineage
- **State**:
  - Fetches projects lineage with `getProjectsLineage()`
  - Can drill into specific projects for table-level detail
  - Manages `showTablesOnly` toggle state
- **Key Pattern**: Two-level navigation - organization/project view then table view within

### Table Node
- **Location**: `components/CustomNode/Table/Table.tsx`
- **Purpose**: Renders individual table nodes with column expansion
- **Props**:
  - `data: TableNode` - Node data including table info and columns
  - `onSelectColumn: (nodeId, column) => void` - Column selection callback
  - `onSetShownHandles: OnSetShownHandles` - Dynamic handle management
- **Styling**:
  - `ColorMap` determines background based on `TableSubtype`:
    - `LINKED_FROM` (yellow-200): Tables from other projects
    - `LINKED_TO` (purple-200): Tables linked to other projects
    - `TABLE` (secondary-200): Regular project tables
- **Key Feature**: Shows column list when expanded with pagination support

### Legend
- **Location**: `components/Legend.tsx`
- **Purpose**: Visual legend explaining node types and colors
- **Props**:
  - `nodes: CustomNode[]` - Used to determine what legend items to show
  - `llmCalculated: boolean` - Show LLM calculation indicator
- **Storage**: Visibility controlled by localStorage key `LINEAGE_LEGEND`

## API Endpoints

| Method | Endpoint | Purpose | Response Type |
|--------|----------|---------|---------------|
| GET | `/omnisearch/v1/lineage/projects` | Get project-level lineage | `{ graph: ProjectsLineage }` |
| GET | `/omnisearch/v1/lineage/tables` | Get table-level lineage | `{ graph: TablesLineage }` |

**Query Parameters**:
- `project` (required for tables): FQID of project
- `startingPoint` (optional): FQID of starting table/config
- `columns` (optional, default: true): Include column-level data

**Authentication**: Uses `X-StorageApi-Token` header with current project's SAPI token

## State Management

### Patterns Used
1. **Zustand Stores**: Graph state and column selection
2. **React State**: Component-level UI state (loading, error code)
3. **React Context**: Graph configuration (mainNodeId)
4. **React Flow Internal**: Node and edge state management

### Key Stores/Queries

#### graphStore (Zustand)
```typescript
{
  focusedNodeId: string | null;        // Currently focused node
  searchQuery: string;                  // Search input
  nodeDetail: NodeData | null;          // Selected node details
  isLoading: boolean;                   // Loading state
  setNodeFocus, onSearch, setNodeDetail, setIsLoading
}
```

#### columnsStore (Zustand)
```typescript
{
  chosenColumn: { nodeId: string; column: string } | null;
  highlightedColumns: string[];
  highlightedEdges: string[];
  shouldResetColumnsHighlight: boolean;
}
```

#### React Flow State
- **nodes**: `CustomNode[]` with position and style
- **edges**: `CustomEdge[]` with custom data properties

### Data Flow
1. Component mounts → fetches lineage from API
2. Raw API response → transformed by `mapTablesDataToGraph()`
3. Graph data → split into nodes and edges
4. Initial state set to hidden (opacity: 0) to prevent flickering
5. ELK.js layout algorithm applied via `useLayoutNodes()`
6. Nodes/edges rendered and measured
7. Final layout applied with visibility restored
8. User interactions (column select, node focus) update Zustand stores
9. Store updates trigger React Flow state updates

## Dependencies

### Internal Modules
- `modules/storage` - Table and bucket information
- `modules/components` - Component registry and metadata
- `modules/admin` - Permission checking
- `modules/services` - Service URL resolution (AI service)

### External Packages
- **@xyflow/react** (v11+): Graph visualization and layout
- **elkjs**: Hierarchical graph layout algorithm
- **zustand**: State management
- **underscore**: Utility functions
- **dayjs**: Date formatting
- **@keboola/design**: Design system components and utilities

### Design System Components
- `Button`, `Modal`, `Search`, `Tabs`
- `cn` utility for class composition
- Color system from tailwind config

## Notable Patterns

### Dynamic Handle Management
The module implements smart handle hiding to prevent React Flow from assigning edges to wrong connection points:

```typescript
// Handles are dynamically added when columns are selected
// Initial state: only 'main' handles shown
// After column selection: 'main' + column-specific handles
// Opacity 0 applied to hidden handles to keep them unmeasured
```

### Column Highlighting with Graph Traversal
When a column is selected, the system performs graph traversal to find all related columns:
- `getNextEdges()`: Follow edges forward (data flowing out)
- `getPrevEdges()`: Follow edges backward (data flowing in)
- `goThroughGraph()`: BFS to collect all connected edges
- Results highlight entire data lineage path for chosen column

### LLM-Calculated Edge Detection
Edges calculated by LLM analysis are distinguished visually:
```typescript
isEdgeCalculatedWithLlm(edge) // checks lineageSource array for 'llm_analysis'
// Renders with different color: LLM_EDGE_COLOR
```

### Node Subtypes for Cross-Project Relationships
Tables from other projects are marked with subtypes:
- `LINKED_FROM`: Data originates from another project
- `LINKED_TO`: Data is linked to another project
- `TABLE`: Local project table

### Layout Algorithm: ELK.js
Uses hierarchical graph layout for automatic positioning:
- Prevents manual layout management
- Responsive to viewport changes
- Configured with `elkOptions` for directed graph layout
- Nodes measured before layout (width/height acquisition)
- Layout applied asynchronously

### Performance Optimization: Conditional Rendering
```typescript
onlyRenderVisibleElements={nodes.length + edges.length > RENDER_ONLY_VISIBLE_ELEMENTS_LIMIT}
// Enables React Flow's built-in virtualization for large graphs
```

## User-Facing Features

### Feature 1: Table Lineage Visualization
- **Description**: Users can see how data flows through their project
- **Entry Point**: Click lineage button on table/configuration detail
- **Workflow**:
  1. System fetches lineage data from backend
  2. Graph renders with table nodes and transformation arrows
  3. Users can expand to see columns and their relationships
- **Components**: `TablesLineage`, `DataLineageReactFlow`, `Table` nodes

### Feature 2: Column-Level Tracking
- **Description**: Track data flow at column level for precision
- **Interaction**: Click column name in table node
- **Workflow**:
  1. Column selection triggers graph traversal
  2. All related columns highlighted in connected tables
  3. Edges highlighted showing exact data path
  4. Column names shown in connected nodes for quick reference
- **Components**: `Columns`, `columnsHelpers.ts`

### Feature 3: Cross-Project Navigation
- **Description**: View how data flows between projects
- **Interaction**: Click on linked table from other project
- **Workflow**:
  1. Shows source project link with icon indicator
  2. Opens project lineage in new window
  3. Preserves node selection via URL parameter
- **Components**: `SourceProjectLink`, `onProjectOpenInNewWindow` helper

### Feature 4: Interactive Controls
- **Controls Available**:
  - Legend toggle (top-right)
  - Zoom in/out buttons
  - Center view button
  - Fit to view button
  - Export to PNG
  - Search/filter nodes
  - Table-only toggle
- **Components**: `Legend`, `ZoomInButton`, `ZoomOutButton`, `ExportToPng`, `Search`

### Feature 5: Sidebar Details
- **Description**: View detailed information about selected node
- **Content**: Metadata, description, linked information, related nodes
- **Interaction**: Click on any node to open sidebar
- **Components**: `Sidebar`, `Description`, `LinkedInfo`

## Technical Debt & Observations

### Current Limitations
1. **External Table Filtering**: Backend still sends external table/column FQIDs which must be filtered client-side (`isValidEdge` check)
2. **React Flow 11 Handle Issues**: Dynamic handles don't always assign correctly - workaround uses opacity instead of hidden
3. **ELK.js Async Layout**: Layout algorithm requires async operation which can cause UI jank
4. **Column Pagination**: Large tables with many columns need pagination within node

### Performance Hotspots
1. Graph traversal for column highlighting could be expensive with large graphs
2. ELK.js layout recalculation on every node measure change
3. React Flow re-renders all nodes on any state change (even edge highlight)

### Areas for Improvement
1. Memoization of graph traversal results
2. Virtual scrolling for column lists
3. WebGL rendering for very large graphs (1000+ nodes)
4. Incremental data loading instead of full graph

### Migration Notes
- Flux pattern not used in lineage module - purely React hooks + Zustand
- Good candidate for React Query once API stabilizes
- Column store could be simplified with composition

## Code Examples

### Adding Column Highlighting
```typescript
// In DataLineageReactFlow.tsx
const handleSelectColumn = useCallback(
  (nodeId: string, column: string) => {
    // 1. Update store with selected column
    setChosenColumn({ nodeId, column });

    // 2. Find all edges connected to this column
    const edgesToHighlight = highlightedEdges(initEdges, nodeId, column);

    // 3. Calculate which columns in other tables are related
    const columnsToHighlight = calculateHighlightedColumns(edgesToHighlight, nodeId);

    // 4. Update stores and trigger re-render
    setHighlightedColumns(columnsToHighlight);
    setHighlightedEdges(edgesToHighlight.map((e) => e.id));

    // 5. React Flow updates edges with highlighting style
    setEdges((prevEdges) => {
      const newUniqueEdges = _.uniq([...prevEdges, ...edgesToHighlight], (edge) => edge.id);
      return newUniqueEdges.map((edge) => ({
        ...edge,
        data: {
          ...edge.data,
          isHighlighted: edgesToHighlight.some((e) => e.id === edge.id),
        },
      }));
    });
  },
  [initEdges, setChosenColumn, setEdges, setHighlightedColumns, setHighlightedEdges],
);
```

### FQID Construction and Parsing
```typescript
// FQID format: TYPE/projectId/tableId/column
const fqid = constructFQID({
  type: FQID_TYPES.column,
  data: { projectId: '123', tableId: 'my-table', column: 'name' }
});
// Result: "COL/123/my-table/name"

const parsed = parseFQID('COL/123/my-table/name');
// Result: { type: 'COL', projectId: '123', tableId: 'my-table', column: 'name' }
```

### Graph Data Transformation
```typescript
// Raw API response → Graph-ready format
const graph = mapTablesDataToGraph(
  data.graph,        // TablesLineage from API
  components,        // Component registry (Map)
  showTablesOnly,    // Filter configurations
  currentProjectId   // For determining table subtypes
);
// Returns: { nodes: NodeData[], edges: EdgeInfo[], computeTimestamp: string }
```

## Related Modules

- `modules/storage` - Provides table and bucket information, alias checking
- `modules/components` - Component metadata and icons
- `modules/admin` - Permission and access level checking
- `modules/ai` - AI service integration for lineage calculations

## Testing

### Test Files
- `helpers.test.ts`: Tests for graph manipulation and FQID handling
- `columnsHelpers.test.ts`: Tests for column highlighting logic

### Coverage Areas
1. Graph transformation logic (`mapTablesDataToGraph`)
2. Column edge finding and highlighting
3. FQID construction and parsing
4. Metadata value extraction
5. Column sorting (columns with edges prioritized)

### Testing Approach
- Unit tests for pure functions (helpers, FQID utilities)
- Component tests would use React Testing Library
- E2E tests in dedicated e2e-testing package

### Key Test Utilities
- Mock data generators for nodes/edges
- FQID factory functions for test data
- React Flow mock providers

## Performance Considerations

1. **Conditional Rendering**: Only visible nodes/edges rendered when count exceeds threshold
2. **Memoization**: `useMemo` for node/edge initialization and transformations
3. **Zustand Shallow Subscriptions**: `useShallow` prevents unnecessary re-renders
4. **Lazy Loading**: Edge and node data lazy-initialized with hidden state
5. **Graph Caching**: ELK.js layout cached in component refs to avoid recalculation

## Accessibility

- `disableKeyboardA11y` set to prevent accidental node deletion
- Legend provides color/shape explanations for users
- Sidebar provides text descriptions of nodes for screen readers
- Breadcrumbs aid navigation for keyboard users
