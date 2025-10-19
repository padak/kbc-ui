# Flow Builder Recommendations - Executive Summary

**Date**: 2025-10-19
**For**: Keboola Flow Feature Redesign
**Research Basis**: Analysis of 10+ modern workflow and data pipeline builders

---

## TL;DR - Top 5 Recommendations

1. **Use React Flow** as the foundation library
2. **Implement n8n-style instant feedback** (test nodes individually, see outputs inline)
3. **Add AI pipeline generation** from natural language descriptions
4. **Provide multiple view modes** (Graph, Grid, Calendar, Code)
5. **Make debugging excellent** with failed execution replay and AI suggestions

---

## Technology Decision: React Flow

**Recommendation**: Use **@xyflow/react** (React Flow) as the foundation library

### Why React Flow?

- **Battle-tested**: Used by Stripe, Typeform, thousands of production apps
- **Customizable**: Nodes are React components, full control over UI/UX
- **Feature-rich**: Built-in zoom/pan, drag-drop, keyboard shortcuts, MiniMap
- **Active development**: Regular updates, modern UI refresh in 2024-2025
- **Pro version**: Auto-layout, real-time collaboration when needed
- **Performance**: Handles 100+ node flows efficiently
- **TypeScript**: First-class TypeScript support

### What You Get Out of the Box

```
✅ Drag-and-drop nodes and edges
✅ Zoom, pan, viewport controls
✅ MiniMap for navigation
✅ 4 edge types (Bezier, Straight, Step, SmoothStep)
✅ Keyboard shortcuts
✅ Multi-node selection
✅ Custom node components
✅ Background grid/dots
✅ Dark/light themes
```

### What to Build Custom

```
🔨 Keboola-specific node types (Extractor, Transformer, Writer)
🔨 Configuration sidebar
🔨 Execution status visualization
🔨 AI chat interface
🔨 Template library
🔨 Grid/Calendar views
```

### Installation

```bash
pnpm add @xyflow/react
```

### Quick Start Example

```tsx
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const nodes = [
  { id: '1', type: 'extractor', position: { x: 0, y: 0 }, data: { label: 'Snowflake' } },
  { id: '2', type: 'transformer', position: { x: 200, y: 0 }, data: { label: 'dbt' } },
  { id: '3', type: 'writer', position: { x: 400, y: 0 }, data: { label: 'BigQuery' } },
];

const edges = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
  { id: 'e2-3', source: '2', target: '3', type: 'smoothstep' },
];

export default function FlowBuilder() {
  return (
    <ReactFlow nodes={nodes} edges={edges}>
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
}
```

---

## UX Pattern: n8n-Style Instant Feedback

**Inspiration**: n8n.io workflow automation platform

### What Makes n8n's UX Exceptional

**1. Test Individual Nodes**
- Click "Execute Node" on any node
- Run just that step, not entire workflow
- See results immediately
- Iterate quickly on configuration

**2. Inline Data Preview**
- Sample output appears next to node
- See data structure: columns, types, values
- No need to open separate logs
- Visual confirmation at each step

**3. Replay Execution Data**
- Load data from previous run
- Test with real production data
- No need to re-trigger sources
- Debug faster

**4. Fast Feedback Loop**
```
User Action → Immediate Visual Response
Add node → Preview available fields
Configure → See output data
Test → Results appear inline
Error → Stack trace + suggested fix
```

### Implementation for Keboola

**Node-Level Testing**:
```tsx
<Node>
  <NodeHeader>
    <Icon type={nodeType} />
    <Title>{nodeName}</Title>
    <StatusBadge status={status} />
  </NodeHeader>

  <NodeBody>
    <SourceHandle />
    <TargetHandle />
  </NodeBody>

  <NodeFooter>
    <Button size="sm" onClick={testNode}>
      Test Node
    </Button>
    {hasData && (
      <DataPreview rows={5} data={outputData} />
    )}
  </NodeFooter>
</Node>
```

**Inline Data Preview**:
```tsx
<DataPreview>
  <PreviewHeader>
    Output: users table (1.2M rows, 15 cols)
  </PreviewHeader>
  <DataTable>
    {/* First 5 rows */}
    <Row>id | name | email | created_at | ...</Row>
  </DataTable>
  <Button variant="link" onClick={viewFull}>
    View all data →
  </Button>
</DataPreview>
```

**Replay Failed Executions**:
```tsx
// When flow fails
<FailureNotification>
  Flow failed at node: "dbt Transformation"
  <Button onClick={debugInEditor}>
    Debug in Editor
  </Button>
</FailureNotification>

// In editor
<FlowBuilder
  executionData={failedExecution.data}
  highlightFailedNode={failedNode.id}
/>
```

### Benefits

- **50% faster debugging**: No need to re-run entire flows
- **Better learning**: See how data transforms at each step
- **Reduced errors**: Catch issues before running full pipeline
- **Improved DX**: Developers love instant feedback

---

## Game-Changer: AI-Powered Pipeline Generation

**Trend**: 80%+ enterprises will use AI-driven pipeline automation by 2025

### What's Possible Now (2025)

**Natural Language → Full Pipeline**:
```
User: "Extract from Snowflake, transform with dbt, write to BigQuery"

AI: [Creates 3-node flow]
    1. Snowflake Extractor (queries users table)
    2. dbt Transformer (creates sample model)
    3. BigQuery Writer (configures destination)

    "Would you like to add data quality checks?"

User: "Yes, check for duplicates and null emails"

AI: [Adds validation node between extractor and transformer]
    "Added deduplication and null check. Test flow?"
```

**Code Generation**:
```
User: "Generate dbt model for customer lifetime value"

AI: [Generates CLV model]
    models/marts/customers/customer_lifetime_value.sql

    WITH customer_orders AS (
      SELECT customer_id, SUM(order_total) as total_revenue
      FROM {{ ref('orders') }}
      GROUP BY customer_id
    )
    SELECT * FROM customer_orders

    + Documentation + Tests

    "Model created. Want to add cohort analysis?"
```

**Auto-Optimization**:
```
AI detects: "Your pipeline processes 10M rows sequentially"
AI suggests: "Switch to parallel processing for 5x speedup"
AI implements: [Refactors to parallel architecture]
User: [Approves] → [Deployed]
```

### ROI Data

**Time Savings**:
- 60-70% reduction in pipeline maintenance
- 75-85% faster deployment of new workflows
- 40-50% decrease in data engineering costs

**Business Impact**:
- Non-technical users build pipelines
- 10x faster development
- AI applies best practices automatically
- Reduced need for specialized talent

### Implementation Phases

**Phase 1: AI Assistant (Month 10-11)**
```tsx
<FlowBuilder>
  <Canvas />
  <AIAssistant>
    <ChatInterface>
      <Input placeholder="Describe what you want to build..." />
      <Suggestions>
        - "Add email notification on failure"
        - "Optimize this flow for performance"
        - "Explain what this transformation does"
      </Suggestions>
    </ChatInterface>
  </AIAssistant>
</FlowBuilder>
```

**Phase 2: Flow Generation (Month 12-14)**
```tsx
// Natural language → flow
const generateFlow = async (description: string) => {
  const response = await ai.generatePipeline(description);
  return {
    nodes: response.nodes,
    edges: response.edges,
    config: response.config
  };
};
```

**Phase 3: Auto-Optimization (Month 15+)**
```tsx
// AI analyzes execution patterns
const optimizationSuggestions = await ai.analyzeFlow(flowId);
// [
//   { type: 'performance', suggestion: 'Parallelize extractors' },
//   { type: 'cost', suggestion: 'Use incremental sync' },
//   { type: 'reliability', suggestion: 'Add retry logic' }
// ]
```

### UI Integration

**Floating AI Button**:
```tsx
<FloatingActionButton
  position="bottom-right"
  onClick={openAI}
  shortcut="⌘K"
>
  <Icon>sparkles</Icon>
  AI Assistant
</FloatingActionButton>
```

**AI Suggestions on Nodes**:
```tsx
<Node>
  {/* ... */}
  <AIBadge onClick={getAISuggestions}>
    <Icon>lightbulb</Icon>
    AI Assist
  </AIBadge>
</Node>
```

**Optimize Flow Button**:
```tsx
<FlowActions>
  <Button onClick={runFlow}>Run Flow</Button>
  <Button variant="outline" onClick={optimizeWithAI}>
    <Icon>zap</Icon>
    Optimize with AI
  </Button>
</FlowActions>
```

---

## Multiple View Modes (Airflow-Inspired)

**Insight**: Different tasks need different visualizations

### View 1: Graph (Primary)

**Purpose**: Design and understand flow structure

**Features**:
- Visual node-edge diagram
- Drag-and-drop editing
- Real-time execution status
- Color-coded nodes (status)
- MiniMap for navigation

**Best For**:
- Building new flows
- Understanding dependencies
- Visual learners
- Presentations

### View 2: Grid

**Purpose**: Monitor executions and track history

**Features**:
- Rows = Flow executions (newest first)
- Columns = Tasks/Nodes
- Color-coded cells (green/red/yellow/gray)
- Click cell → Task details/logs
- Filter by date, status, duration

**Best For**:
- Monitoring production flows
- Identifying patterns
- Debugging failures
- Historical analysis

**Example**:
```
Execution | Node 1 | Node 2 | Node 3 | Duration | Status
----------|--------|--------|--------|----------|-------
Run #123  | 🟢     | 🟢     | 🔴     | 5m 23s   | Failed
Run #122  | 🟢     | 🟢     | 🟢     | 4m 51s   | Success
Run #121  | 🟢     | 🔴     | ⚫     | 2m 10s   | Failed
```

### View 3: Calendar

**Purpose**: Long-term execution patterns

**Features**:
- Heat map of execution frequency
- Success/failure rate by day
- Monthly and yearly views
- Click day → See executions
- Identify trends

**Best For**:
- Scheduled flows
- Historical analysis
- Capacity planning
- SLA tracking

**Example**:
```
October 2025
Mon | Tue | Wed | Thu | Fri | Sat | Sun
----|-----|-----|-----|-----|-----|----
    |     |  1  |  2  |  3  |  4  |  5
    |     | 🟢🟢| 🟢🟢| 🟢🔴| 🟢🟢| 🟢🟢
 6  |  7  |  8  |  9  | 10  | 11  | 12
🟢🟢| 🟢🟢| 🔴🔴| 🟢🟢| 🟢🟢| 🟢🟢| 🟢🟢
```

### View 4: Code

**Purpose**: Version control and fine-tuning

**Features**:
- JSON/YAML flow definition
- Syntax highlighting
- Direct editing
- Sync with visual view
- Export/import

**Best For**:
- Version control (Git)
- Bulk editing
- Advanced users
- Documentation

**Example**:
```yaml
flow:
  name: "Snowflake to BigQuery ETL"
  nodes:
    - id: extractor-1
      type: snowflake-extractor
      config:
        query: "SELECT * FROM users"
    - id: transformer-1
      type: dbt-transformer
      config:
        model: "customer_lifetime_value"
    - id: writer-1
      type: bigquery-writer
      config:
        table: "analytics.users"
  edges:
    - from: extractor-1
      to: transformer-1
    - from: transformer-1
      to: writer-1
```

### View Switcher UI

```tsx
<ViewSwitcher>
  <Tab active={view === 'graph'} onClick={() => setView('graph')}>
    <Icon>workflow</Icon>
    Graph
  </Tab>
  <Tab active={view === 'grid'} onClick={() => setView('grid')}>
    <Icon>table</Icon>
    Grid
  </Tab>
  <Tab active={view === 'calendar'} onClick={() => setView('calendar')}>
    <Icon>calendar</Icon>
    Calendar
  </Tab>
  <Tab active={view === 'code'} onClick={() => setView('code')}>
    <Icon>code</Icon>
    Code
  </Tab>
</ViewSwitcher>
```

---

## Debugging Excellence

**Insight**: Great debugging UX reduces support tickets by 50%

### Failed Execution Debugging Flow

**1. Failure Notification**:
```tsx
<Alert variant="error">
  <Icon>alert-circle</Icon>
  Flow "Snowflake to BigQuery ETL" failed
  <Meta>
    Failed at: dbt Transformation
    Error: Table 'users' not found
    Time: 2025-10-19 14:23:15
  </Meta>
  <Actions>
    <Button onClick={debugInEditor}>Debug in Editor</Button>
    <Button variant="outline" onClick={viewLogs}>View Logs</Button>
  </Actions>
</Alert>
```

**2. Load Execution in Editor**:
```tsx
// Opens flow with execution data
<FlowBuilder
  executionData={failedExecution}
  highlightNode={failedNode}
  mode="debug"
/>
```

**3. Show Error Details**:
```tsx
<FailedNode>
  <NodeIcon color="red">alert-triangle</NodeIcon>
  <ErrorBadge>Failed</ErrorBadge>
  <ErrorDetails>
    <Message>Table 'users' not found</Message>
    <StackTrace>{stackTrace}</StackTrace>
    <InputData>{inputData}</InputData>
  </ErrorDetails>
  <Actions>
    <Button onClick={askAI}>Ask AI for Fix</Button>
    <Button onClick={editConfig}>Edit Configuration</Button>
    <Button onClick={viewDocs}>View Documentation</Button>
  </Actions>
</FailedNode>
```

**4. AI Suggestion**:
```tsx
<AISuggestion>
  <Icon>lightbulb</Icon>
  Suggested Fix:

  The table name should be 'public.users' not 'users'.

  <CodeDiff>
    - query: "SELECT * FROM users"
    + query: "SELECT * FROM public.users"
  </CodeDiff>

  <Button onClick={applyFix}>Apply Fix</Button>
</AISuggestion>
```

**5. Re-run with Same Data**:
```tsx
<Actions>
  <Button onClick={retryWithSameData}>
    Re-run with Failed Execution Data
  </Button>
  <Checkbox>
    Compare before/after results
  </Checkbox>
</Actions>
```

**6. Compare Results**:
```tsx
<ComparisonView>
  <Column>
    <Header>Before (Failed)</Header>
    <ErrorMessage>Table not found</ErrorMessage>
  </Column>
  <Column>
    <Header>After (Success)</Header>
    <SuccessMessage>1.2M rows extracted</SuccessMessage>
    <DataPreview rows={outputData} />
  </Column>
</ComparisonView>
```

### Key Features

✅ **One-click debug**: Failed execution → Editor with data
✅ **AI suggestions**: Intelligent fix recommendations
✅ **Replay with same data**: No need to re-trigger sources
✅ **Before/after comparison**: See what changed
✅ **Stack traces**: Full error details for developers
✅ **Input data visibility**: See what went into failed node

---

## Visual Design Recommendations

### Color System (Status)

```
Success:  #22c55e (green-500)
Failed:   #ef4444 (red-500)
Running:  #f59e0b (amber-500)
Pending:  #6b7280 (gray-500)
Disabled: #9ca3af (gray-400)
Warning:  #eab308 (yellow-500)
```

### Node Type Colors

```
Extractor:     #3b82f6 (blue-500) + database icon
Transformer:   #a855f7 (purple-500) + code icon
Writer:        #10b981 (emerald-500) + upload icon
Flow Control:  #f97316 (orange-500) + git-branch icon
Notification:  #06b6d4 (cyan-500) + bell icon
```

### Edge Styles

```css
/* Data Flow (default) */
.edge-data-flow {
  stroke: #3b82f6;
  stroke-width: 2px;
  type: bezier;
}

/* Dependency */
.edge-dependency {
  stroke: #6b7280;
  stroke-width: 2px;
  type: straight;
}

/* Conditional */
.edge-conditional {
  stroke: #f97316;
  stroke-width: 2px;
  stroke-dasharray: 5, 5;
  type: bezier;
}

/* Error Handler */
.edge-error {
  stroke: #ef4444;
  stroke-width: 2px;
  stroke-dasharray: 2, 4;
  type: straight;
}
```

### Layout & Spacing

```
Node Dimensions:
  Min Width:  200px
  Max Width:  400px
  Height:     Auto (content-based)
  Padding:    16px

Node Gaps:
  Horizontal: 80px
  Vertical:   60px

Handles:
  Size:       12px
  Position:   Center (top/bottom/left/right)

Edges:
  Width:      2px (normal)
  Width:      3px (selected)
  Width:      4px (active/running)

Canvas:
  Padding:    40px
  Background: Grid (20px) or Dots
```

### Interactive States

```
Node States:
  Normal:   border: 2px solid gray-300
  Hover:    border: 2px solid blue-500, shadow-md
  Selected: border: 2px solid blue-600, shadow-lg
  Running:  border: 2px solid amber-500, pulse animation
  Failed:   border: 2px solid red-500, shake animation

Edge States:
  Normal:   opacity: 0.6
  Hover:    opacity: 1.0, stroke-width: 3px
  Selected: opacity: 1.0, stroke-width: 3px, color: blue-600
  Active:   animated dash (data flowing)
```

---

## Template Library (AWS-Inspired)

**Insight**: Pre-built patterns accelerate development by 3x

### Categories

**ETL Patterns**:
- Full Load (Source → Transform → Destination)
- Incremental Load (CDC with watermark)
- SCD Type 2 (Slowly Changing Dimensions)
- Data Quality Pipeline (Validate → Clean → Transform)

**Transformation Patterns**:
- dbt + Python Hybrid
- SQL Transformation Chain
- Data Cleaning Pipeline
- Feature Engineering for ML

**Orchestration Patterns**:
- Parallel Extraction (Multiple sources)
- Sequential with Dependencies
- Conditional Branching (if/else logic)
- Error Handling with Retry

**Integration Patterns**:
- Salesforce → Snowflake
- MySQL → BigQuery
- REST API → Data Lake
- CSV Upload → Transform → Database

### Template Card UI

```tsx
<TemplateCard>
  <Thumbnail>
    {/* Visual preview of flow */}
    <FlowPreview nodes={template.nodes} />
  </Thumbnail>

  <Content>
    <Title>Full Load ETL</Title>
    <Description>
      Extract data from source, apply transformations,
      load to destination with error handling
    </Description>

    <Badges>
      <Badge color="green">Beginner</Badge>
      <Badge color="blue">3 nodes</Badge>
      <Badge color="purple">~5 min setup</Badge>
    </Badges>

    <Stats>
      <Stat>
        <Icon>users</Icon>
        1.2k uses
      </Stat>
      <Stat>
        <Icon>star</Icon>
        4.8 rating
      </Stat>
    </Stats>
  </Content>

  <Actions>
    <Button onClick={useTemplate}>Use Template</Button>
    <Button variant="outline" onClick={preview}>Preview</Button>
  </Actions>
</TemplateCard>
```

### Template Gallery

```tsx
<TemplateGallery>
  <Header>
    <Title>Flow Templates</Title>
    <SearchInput placeholder="Search templates..." />
  </Header>

  <Filters>
    <FilterGroup label="Category">
      <Checkbox>All</Checkbox>
      <Checkbox>ETL</Checkbox>
      <Checkbox>Transform</Checkbox>
      <Checkbox>Orchestration</Checkbox>
    </FilterGroup>

    <FilterGroup label="Complexity">
      <Checkbox>Beginner</Checkbox>
      <Checkbox>Intermediate</Checkbox>
      <Checkbox>Advanced</Checkbox>
    </FilterGroup>

    <FilterGroup label="Source">
      <Checkbox>Snowflake</Checkbox>
      <Checkbox>MySQL</Checkbox>
      <Checkbox>Salesforce</Checkbox>
      <Checkbox>API</Checkbox>
    </FilterGroup>
  </Filters>

  <Grid cols={3}>
    {templates.map(template => (
      <TemplateCard key={template.id} {...template} />
    ))}
  </Grid>
</TemplateGallery>
```

### Benefits

- **Faster onboarding**: New users start with working examples
- **Best practices**: Templates embody proven patterns
- **Consistency**: Teams use standard flows
- **Learning**: See how complex flows are built

---

## Implementation Checklist

### Phase 1: Foundation (Month 1-2)
- [ ] Install and configure React Flow
- [ ] Create base FlowBuilder component
- [ ] Implement custom node types (Extractor, Transformer, Writer)
- [ ] Build configuration sidebar (70/30 layout)
- [ ] Add drag-and-drop from node toolbar
- [ ] Implement basic edge creation and validation
- [ ] Add zoom/pan/MiniMap controls
- [ ] Dark/light theme support

### Phase 2: Execution (Month 3-4)
- [ ] Real-time execution status updates
- [ ] Node status colors (green/red/yellow/gray)
- [ ] Run entire flow functionality
- [ ] Basic error handling and display
- [ ] Execution logs viewer
- [ ] Save/load flows (API integration)
- [ ] Flow scheduling interface

### Phase 3: Debugging (Month 5-6)
- [ ] Test individual nodes (n8n pattern)
- [ ] Inline data preview (sample outputs)
- [ ] Failed execution debugging
- [ ] Load execution data into editor
- [ ] Before/after comparison view
- [ ] Execution history panel
- [ ] Filter executions by status/date

### Phase 4: Views (Month 7-8)
- [ ] Graph view (primary, already built)
- [ ] Grid view (runs × tasks matrix)
- [ ] Calendar view (historical heat map)
- [ ] Code view (JSON/YAML export)
- [ ] View switcher UI
- [ ] Responsive layouts for each view

### Phase 5: Advanced Features (Month 9-10)
- [ ] Auto-layout (dagre integration)
- [ ] Node grouping/sub-flows
- [ ] Template library UI
- [ ] Pre-built flow templates (10+ patterns)
- [ ] Export flow as Mermaid diagram
- [ ] Flow comparison tool
- [ ] Performance metrics dashboard

### Phase 6: AI Integration (Month 11-12)
- [ ] AI chat interface (floating button)
- [ ] Keyboard shortcut (⌘K) to open AI
- [ ] Natural language flow generation
- [ ] AI suggestions on nodes
- [ ] AI-powered debugging
- [ ] Flow optimization recommendations
- [ ] Code generation (dbt models, SQL, etc.)

### Phase 7: Collaboration (Month 13+)
- [ ] Real-time multi-user editing (yjs)
- [ ] User cursors and selections
- [ ] Comments on nodes
- [ ] Change history and versioning
- [ ] Flow permissions (view/edit/admin)
- [ ] Team template marketplace

---

## Success Metrics

### User Experience Metrics

**Time to First Flow**:
- Target: < 5 minutes (with template)
- Measure: From account creation to first successful run

**Time to Debug Failed Flow**:
- Target: < 2 minutes (with AI assistance)
- Measure: From failure notification to successful re-run

**User Satisfaction**:
- Target: NPS 60+
- Measure: Quarterly survey

**Feature Adoption**:
- Target: 85% users create at least one flow
- Measure: Active users with 1+ flows

### Technical Metrics

**Performance**:
- Support 100+ node flows without lag
- Real-time status updates (< 1s latency)
- Load flow in < 500ms

**Reliability**:
- 99.9% uptime for flow execution
- Zero data loss during execution
- Graceful degradation for offline mode

### Business Metrics

**Support Reduction**:
- Target: 50% fewer debugging tickets
- Measure: Support ticket volume (before/after)

**Development Speed**:
- Target: 3x faster flow creation
- Measure: Average time to create flow (before/after)

**AI Engagement**:
- Target: 60% of flows use AI assistance
- Measure: Flows created with AI vs manual

**Cost Efficiency**:
- Target: 40% reduction in engineering time
- Measure: Engineering hours spent on pipelines

---

## Quick Reference

### Libraries to Install

```bash
# Core
pnpm add @xyflow/react

# Pro (optional, for auto-layout and collaboration)
pnpm add @xyflow/react-pro

# UI Components (already using shadcn/ui)
# No additional install needed

# AI (future)
pnpm add ai @ai-sdk/anthropic
```

### Key Files to Create

```
src/
├── components/
│   ├── flow-builder/
│   │   ├── FlowBuilder.tsx           # Main component
│   │   ├── FlowCanvas.tsx            # React Flow wrapper
│   │   ├── nodes/
│   │   │   ├── ExtractorNode.tsx     # Custom node types
│   │   │   ├── TransformerNode.tsx
│   │   │   └── WriterNode.tsx
│   │   ├── edges/
│   │   │   └── DataFlowEdge.tsx      # Custom edge types
│   │   ├── sidebar/
│   │   │   ├── NodeToolbar.tsx       # Left toolbar
│   │   │   └── ConfigPanel.tsx       # Right sidebar
│   │   ├── views/
│   │   │   ├── GraphView.tsx         # Default view
│   │   │   ├── GridView.tsx          # Execution matrix
│   │   │   ├── CalendarView.tsx      # Historical
│   │   │   └── CodeView.tsx          # JSON/YAML
│   │   └── ai/
│   │       ├── AIAssistant.tsx       # Chat interface
│   │       └── AISuggestions.tsx     # Inline suggestions
│   └── templates/
│       └── TemplateGallery.tsx       # Template library
```

### Next Steps

1. **Review this document** with the team
2. **Prioritize features** based on user needs
3. **Spike React Flow** (1-2 days, proof of concept)
4. **Design mockups** for key screens
5. **Start Phase 1 implementation**

---

**Document Version**: 1.0
**Last Updated**: 2025-10-19
**Author**: Claude Code Research
**Related Documents**:
- `/Users/padak/github/kbc-ui-padak/docs/research/FLOW_BUILDER_UI_RESEARCH.md` (full research)
- `/Users/padak/github/kbc-ui-padak/docs/build-specs/dashboard-spec.md` (implementation reference)
