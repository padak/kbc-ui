# AI Module Documentation

## Overview

The AI module provides AI-powered features for the Keboola Connection UI, including:
- **AI SQL Editor (Waii)**: Interactive SQL editor with AI-assisted query generation and execution
- **Conversation Management**: AI-driven conversations for data analysis and configuration explanation
- **Error Explanation**: AI-powered error analysis from failed jobs
- **Component Suggestion**: AI recommendations for components based on user input

## Architecture

### Core Structure

```
apps/kbc-ui/src/scripts/modules/ai/
├── api.ts                          # API layer for AI service interactions
├── constants.ts                    # Constants for AI features (feedback status, suggestions)
├── helpers.ts                      # Helper utilities (mode checking)
├── waii/                           # Waii SQL editor integration
│   ├── components/                 # React components for editor UI
│   ├── context/                    # React context for session management
│   ├── hooks/                      # Custom hooks for data fetching and state
│   ├── helpers/                    # Utilities for code blocks, query handling
│   └── types.ts                    # TypeScript type definitions
```

## Key Features

### 1. Waii SQL Editor

The Waii integration provides an interactive SQL editor with:

#### Components Structure
- **Editor**: Main editor component managing code blocks, results, and catalog
- **CodeBlockPanel**: Handles individual code blocks with script management
- **QueryResults**: Displays query execution results with tabs and filtering
- **CatalogPanel**: Browse database schema, tables, and columns
- **EditorModal**: Modal wrapper for Waii editor

#### Key Capabilities
- Multiple code blocks with open/close toggle
- Query execution with previous context
- Result previewing and pagination (100 rows sample, 1000 max display)
- Table data preview from catalog
- Shared code references
- Query history tracking

### 2. Session Management

#### SessionContext
- **Type**: React Context API + Zustand store
- **State**: Session ID, workspace database, branch ID, workspace ID
- **Purpose**: Maintains SQL editor session across components

```typescript
type SqlEditorState = {
  lastActiveEditor: EditorView | null;
  setLastActiveEditor: (editor: EditorView | null) => void;
};
```

#### SessionProvider
- Initializes session when editor mounts
- Resolves pending sessions with polling
- Manages session lifecycle

### 3. Query Execution Pipeline

#### Flow
1. **User executes query** → `handleRunQuery`
2. **Collect previous queries** → If `withPrevious` flag set
3. **Extract shared codes** → Find references like `{shared_code_id:rowId}`
4. **Run query job** → `useRunQueries` mutation via API
5. **Poll for results** → `resolveQueryJob` helper with polling
6. **Update UI** → Store results in state with pagination

#### Query Result Types
```typescript
type QueryResult =
  | { status: 'success'; rows: RowsResult; columns: ColumnsResult }
  | { status: 'failed' | 'canceled'; title: string; message?: string; query?: string };
```

#### Limits
- Sample preview: 100 rows
- Full result display: 1000 rows
- Both limits enforced at query service level

### 4. Code Organization

#### Code Blocks Structure
```typescript
type CodeBlock = {
  name: string;                    // User-defined block name
  codes: Code[];                   // Array of code items
};

type Code = {
  name: string;                    // Code item name
  script: string[];                // Array of script lines
  isOpen: boolean;                 // Expand/collapse state
};
```

#### Shared Code References
- Format: `{shared_code_id:rowId}` in script
- Resolved at query time
- Validated before execution

### 5. Data Catalog

#### Features
- Hierarchical browsing: Database → Schema → Table
- Column type information
- Search/filter functionality
- Table preview integration
- Links to Storage browser
- Working tables display

#### CatalogPanel
- Left sidebar in editor
- Collapsible sections
- Context menu actions on tables
- Displays table statistics

## API Integration

### API Client Methods

#### Conversation APIs
```typescript
// Create conversation for configuration/error
createConversation(componentId: string, configId: string)

// Get conversation details
getConversation(conversationId: string)

// Delete conversation
deleteConversation(conversationId: string)

// Generate SQL query
generateQuery(
  conversationId: string,
  prompt: string,
  existingQuery?: string
)

// Execute transformation
executeTransformation(
  conversationId: string,
  transformation: ConversationExecuteTransformationRequest['transformation']
)
```

#### Query Service APIs
```typescript
// Create query job with SQL
api.editor.createQueryJob({ id: sessionId }, body)

// Get query job status
api.queryService.getQueryJobStatus(queryJobId)

// Table preview
api.editor.previewTable({ sessionId }, { tableName, schemaName, databaseName })
```

#### AI Service APIs
```typescript
// Get error explanation
Api.aiService.explainError({ jobId, error })

// Get config description
Api.aiService.describeConfiguration({ branchId, componentId, configId })

// Send feedback
Api.aiService.feedback(data)

// Suggest component
Api.aiService.suggestComponent({ prompt })
```

## State Management

### Store Pattern
Uses Zustand for session state with Redux DevTools support:

```typescript
const createSqlEditorStore = () => {
  return createStore<SqlEditorState>()(
    devtools(
      (set) => ({
        lastActiveEditor: null,
        setLastActiveEditor: (editor) => set({ lastActiveEditor: editor }),
      }),
      { name: 'sql-editor-session-store' },
    ),
  );
};
```

### Query Management
- Query previews maintained in component state
- Results cached with query ID
- Automatic cache invalidation on execution

## Hooks

### useCreateSession
- Creates SQL editor session
- Handles pending session resolution with polling
- Caches session by branchId, componentId, configurationId

### useRunQueries
- Executes SQL queries against session
- Returns mutation for async query execution
- Handles shared code references

### useTablePreview
- Previews table data
- Returns mutation for async preview loading
- Integrates with query job polling

### useLoadData / useUnloadData
- Manages workspace data loading
- Handles transformation-to-sandbox mapping

### useWorkingContext
- Fetches current working context
- Loads workspace schema and settings

## Type Definitions

```typescript
// Code and script structures
type CodeBlocks = CodeBlock[];
type IndexPath = [blockIndex: number, codeIndex: number, scriptIndex: number];

// Query results
type RowsResult = string[][];
type ColumnsResult = { name?: string; type?: string }[];
type QueryResult = success | failed | canceled;

// Query preview with job details
type QueryPreview = {
  id: string;
  name: string;
  result?: QueryResult;
  details?: QueryPreviewDetails;
};

// Mapping configuration
type Mapping = {
  input?: { tables?: TableInputMapping[] };
  output?: { tables?: TableOutputMapping[] };
};

// Shared code references
type SharedCode = {
  id: string;
  name: string;
  configuration: { code_content: string[] };
};
```

## Feedback System

### Feedback Types
```typescript
const FEEDBACK_STATUS = {
  CANCEL: 'cancel',    // User dismissed
  GOOD: 'good',        // User approved
  BAD: 'bad',          // User rejected
};
```

### Usage
- Track AI suggestion quality
- Improve query generation model
- Monitor user satisfaction

## Error Handling

### Query Error Processing
1. Check for "statements is not value" error (validation error)
2. Extract error title from failed query
3. Map error to specific code block/script
4. Display user-friendly error message

### Error Explanation API
- Requests AI explanation of job errors
- Provides jobId and error message
- Returns explanatory text

## Performance Considerations

### Query Execution
- Batch queries in single transaction (with `withPrevious`)
- Limits result size to prevent memory issues
- Polling interval: 500ms for pending queries

### Code Blocks
- Keep reference to latest code blocks
- Efficient traversal for query index paths
- Shared code validation at runtime

### UI Rendering
- Resizable panels (Editor/Results)
- Virtualization for large result sets
- Tab-based result organization

## Integration Points

### With Storage Module
- Access buckets, schemas, tables
- Table metadata display
- Column information retrieval

### With Components Module
- Configuration metadata storage
- Component installation tracking
- Shared code component references

### With Dev Branches
- Branch-specific session isolation
- Dev mode query handling

### With API Client
- Session creation and management
- Query execution
- Job status polling
- Table preview loading

## Constants

### Feedback Status
- `CANCEL`: User dismissed suggestion
- `GOOD`: User accepted suggestion
- `BAD`: User rejected suggestion

### Component Suggestion
- `COMPONENT_SUGGESTION_FALLBACK_SOURCE`: 'genericFallback'

## Development Guidelines

### Adding New Query Features
1. Extend `QueryPreview` type if needed
2. Add hook in `useRunQueries` or similar
3. Update `Editor` component handlers
4. Add result display in `QueryResults`

### Creating New Code Blocks
1. Define structure in types.ts
2. Add component in components/
3. Implement handlers in Editor
4. Update state management

### Extending Catalog
1. Add new node type in CatalogPanel
2. Implement display component
3. Add context menu actions
4. Update data fetching in hooks

## Testing

### Key Areas
- Query execution with various SQL syntaxes
- Error handling and recovery
- Session lifecycle management
- Code block manipulation
- Result pagination and display
- Catalog navigation
- Shared code resolution

### Mock Requirements
- Session creation response
- Query job response
- Schema/table data
- Error responses

## Debugging

### Redux DevTools
- Monitor store changes
- Track action history
- Time-travel debugging

### Query Logging
- Check query builder output
- Verify shared code substitution
- Monitor polling lifecycle

### Session Issues
- Verify session creation
- Check pending session resolution
- Monitor polling timeout
