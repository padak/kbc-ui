# Technology Recommendations

**Document Version**: 1.0
**Date**: 2025-10-19
**Status**: Recommendation

---

## Executive Summary

This document provides specific technology recommendations for implementing the AI-First Hybrid modernization strategy. All recommendations are based on:

1. **Current Keboola stack** (React 18.3, TypeScript 5.7, Yarn workspaces)
2. **Phase 2 code analysis** (71 documents, 49 modules)
3. **Phase 3 UI exploration** (4 workflows, modern patterns identified)
4. **Industry best practices** (proven technologies, active communities)
5. **AI-first requirements** (LLM integration, MCP tools, streaming)

**Principle**: Extend existing stack where possible, introduce new tech only when necessary.

---

## Technology Stack Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Stack                          │
├─────────────────────────────────────────────────────────────┤
│ React 18.3+ │ TypeScript 5.7+ │ TailwindCSS │ Vite 6.0+     │
│ TanStack Query │ Zustand │ React Flow │ shadcn/ui           │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │
┌─────────────────────────────────────────────────────────────┐
│                     AI/LLM Layer                            │
├─────────────────────────────────────────────────────────────┤
│ Claude 3.5 (Sonnet/Haiku) │ Anthropic MCP │ LangChain       │
│ Vercel AI SDK │ Server-Sent Events │ Prompt Caching         │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │
┌─────────────────────────────────────────────────────────────┐
│                     Backend Stack                           │
├─────────────────────────────────────────────────────────────┤
│ Node.js 20+ │ Express/Fastify │ PostgreSQL │ Redis          │
│ Existing Keboola APIs (reuse 100%) │ MCP Tools              │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │
┌─────────────────────────────────────────────────────────────┐
│                Infrastructure & DevOps                      │
├─────────────────────────────────────────────────────────────┤
│ AWS (existing) │ Docker │ Kubernetes │ GitHub Actions       │
│ Datadog/Sentry │ Playwright │ Vitest │ Storybook            │
└─────────────────────────────────────────────────────────────┘
```

---

## Frontend Technologies

### Core Framework

**React 18.3+**
- **Status**: ✅ Already in use
- **Recommendation**: Continue using, upgrade to 18.3+ for latest features
- **Key Features**:
  - Concurrent rendering (better performance)
  - Automatic batching (fewer re-renders)
  - Streaming SSR (future consideration)
  - Suspense for data fetching
  - Server Components (future consideration)

**Why Not Alternatives**:
- Vue/Svelte: Team already skilled in React
- Next.js App Router: Keboola UI is SPA, SSR not critical
- Remix: Overkill for current needs

**TypeScript 5.7+**
- **Status**: ✅ Already in use (5.7+)
- **Recommendation**: Continue, enable strict mode everywhere
- **Configuration**:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true
  }
}
```

---

### Build Tool

**Vite 6.0+**
- **Status**: ⚠️ Not currently used (webpack implied)
- **Recommendation**: Migrate to Vite for better DX and performance
- **Benefits**:
  - 10x faster cold starts vs. webpack
  - Hot module replacement (instant updates)
  - Better tree-shaking
  - Native ESM support
  - Simpler configuration

**Migration Path**:
```yaml
Phase 1:
  - New AI chat module uses Vite
  - Existing modules stay on webpack
  - Share design system via npm packages

Phase 2:
  - Migrate one module at a time
  - Use Module Federation for gradual migration
  - Test thoroughly before moving next module

Phase 3:
  - Complete migration
  - Remove webpack entirely
  - Optimize Vite config for production
```

**Configuration Example**:
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(), // Use paths from tsconfig.json
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@keboola/design'],
          ai: ['ai', '@anthropic-ai/sdk'],
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000', // Proxy to backend
    },
  },
});
```

---

### State Management

**TanStack Query v5** (React Query)
- **Status**: ✅ Already in use (trash module)
- **Recommendation**: Use for ALL server state
- **Why**: Best-in-class data fetching, caching, invalidation

**Current State Assessment** (from Phase 2):
```yaml
Legacy (40%): Flux + Immutable.js
  - Modules: storage, flows (legacy), ex-facebook
  - Action: Migrate to TanStack Query

Modern (30%): TanStack Query
  - Modules: trash, notifications
  - Action: Use as template for others

Hybrid (30%): Mixed patterns
  - Modules: flows-v2 (Zustand), transformations-v2
  - Action: Standardize on TanStack Query + Zustand
```

**Usage Pattern**:
```typescript
// Server state: TanStack Query
import { useQuery, useMutation } from '@tanstack/react-query';

function useComponents() {
  return useQuery({
    queryKey: ['components'],
    queryFn: () => componentsApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

function useCreateComponent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: componentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['components'] });
    },
  });
}
```

**Zustand**
- **Status**: ✅ Already in use (flows-v2)
- **Recommendation**: Use for LOCAL UI state only
- **Why**: Simple, TypeScript-friendly, minimal boilerplate

**Usage Pattern**:
```typescript
// Local state: Zustand
import { create } from 'zustand';

interface FlowEditorState {
  selectedNode: string | null;
  isEditing: boolean;
  setSelectedNode: (id: string | null) => void;
  setEditing: (editing: boolean) => void;
}

const useFlowEditorStore = create<FlowEditorState>((set) => ({
  selectedNode: null,
  isEditing: false,
  setSelectedNode: (id) => set({ selectedNode: id }),
  setEditing: (editing) => set({ isEditing: editing }),
}));
```

**Decision Tree**:
```yaml
Server State (API data):
  Use: TanStack Query
  Examples: Components, configurations, jobs, storage

Local UI State (component state):
  Simple: useState
  Complex: Zustand
  Examples: Modal open/closed, selected items, form state

Global App State (user, auth):
  Use: Zustand + Context
  Examples: Current user, project, permissions
```

---

### UI Component Library

**shadcn/ui + Radix UI**
- **Status**: ✅ Already in use (@keboola/design)
- **Recommendation**: Continue and expand
- **Why**:
  - Not a dependency (copy-paste components)
  - Full customization control
  - Accessible by default (Radix primitives)
  - TailwindCSS integration
  - TypeScript-first

**Current Design System** (from Phase 2):
```yaml
Existing Components (43+):
  - Form: Button, Input, Checkbox, Switch, RadioGroup
  - Layout: Card, Modal, Tabs, Table, Timeline
  - Navigation: DropdownMenu, Command
  - Feedback: Alert, Tooltip, Skeleton
  - Code: CodeEditor (CodeMirror 6), SqlEditor

Technology:
  - Radix UI primitives
  - CVA (Class Variance Authority) for variants
  - TailwindCSS with tw- prefix
  - React 18.3+

Action: Keep and enhance, don't rebuild
```

**Add for AI Chat**:
```typescript
// New components needed for AI
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Markdown } from '@/components/ui/markdown';

// AI Message Component
function AIMessage({ message, isStreaming }: Props) {
  return (
    <div className="flex gap-3">
      <Avatar>
        <AvatarImage src="/ai-avatar.png" />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <Markdown>{message.content}</Markdown>
        {isStreaming && <StreamingIndicator />}
      </div>
    </div>
  );
}
```

**TailwindCSS**
- **Status**: ✅ Already in use
- **Recommendation**: Continue with tw- prefix
- **Configuration**:
```javascript
// tailwind.config.js
module.exports = {
  prefix: 'tw-', // Existing practice
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1F8FFF', // Keboola blue
        // ... existing colors
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // For AI markdown
    require('@tailwindcss/forms'),
  ],
};
```

---

### Specialized UI Libraries

**React Flow**
- **Status**: ✅ Already in use (flows-v2)
- **Recommendation**: Continue for flow visualizations
- **Enhancement**: AI generates flow structures

**CodeMirror 6**
- **Status**: ✅ Already in use (transformations)
- **Recommendation**: Continue for code editing
- **Enhancement**: AI-generated code, syntax highlighting

**React Table (TanStack Table)**
- **Status**: ❌ Not in use (custom tables)
- **Recommendation**: Consider for new tables
- **Why**: Headless, flexible, TypeScript-first
- **Alternative**: Keep custom implementation if working well

---

## AI/LLM Technologies

### LLM Provider

**Anthropic Claude 3.5**
- **Recommendation**: Primary LLM provider
- **Models**:
  ```yaml
  Claude 3.5 Haiku (Simple tasks - 70%):
    - Use: Simple questions, config generation
    - Cost: $0.001 per request
    - Speed: <500ms

  Claude 3.5 Sonnet (Complex tasks - 25%):
    - Use: Flow generation, transformations
    - Cost: $0.01 per request
    - Speed: <2s

  Claude 3.5 Opus (Expert tasks - 5%):
    - Use: Complex optimization, debugging
    - Cost: $0.05 per request
    - Speed: <5s
  ```

- **Why Claude over OpenAI**:
  - Longer context window (200k tokens)
  - Better code generation
  - More reliable structured output
  - Anthropic MCP (tool integration)
  - Better safety and alignment

**OpenAI GPT-4 Turbo**
- **Recommendation**: Fallback option
- **Use Cases**: When Claude is unavailable, A/B testing
- **Cost**: Similar to Claude Sonnet

**Implementation**:
```typescript
// LLM abstraction layer
interface LLMProvider {
  name: 'claude' | 'openai';
  model: string;
  chat(messages: Message[]): Promise<string>;
  stream(messages: Message[]): AsyncIterator<string>;
}

// Use Claude by default, fallback to OpenAI
const llm: LLMProvider = claudeAvailable
  ? new ClaudeProvider({ model: 'claude-3-5-sonnet' })
  : new OpenAIProvider({ model: 'gpt-4-turbo' });
```

---

### AI SDK

**Vercel AI SDK**
- **Recommendation**: Use for AI features
- **Why**:
  - Framework-agnostic (works with any backend)
  - React hooks for streaming
  - Built-in token counting
  - Multi-provider support
  - Edge runtime support

**Features**:
```typescript
import { useChat } from 'ai/react';

function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    streamMode: 'text',
  });

  return (
    <form onSubmit={handleSubmit}>
      <MessageList messages={messages} />
      <Input value={input} onChange={handleInputChange} disabled={isLoading} />
    </form>
  );
}
```

**Alternative**: Build custom implementation
- Pros: More control, no dependency
- Cons: More work, reinventing wheel
- Verdict: Use Vercel AI SDK, it's battle-tested

---

### MCP (Model Context Protocol)

**Anthropic MCP**
- **Recommendation**: Use for tool integration
- **Why**:
  - Standard protocol for LLM tools
  - Growing ecosystem
  - Type-safe tool definitions
  - Works with any LLM provider

**MCP Tools to Implement**:
```yaml
Phase 1 (5 tools):
  - PostgreSQL connector
  - MySQL connector
  - Snowflake connector
  - Amazon S3 connector
  - Google BigQuery connector

Phase 2 (10 more tools):
  - MongoDB
  - Generic HTTP API
  - Google Drive
  - Azure Blob Storage
  - Google Sheets
  - Transformation generators (SQL, Python)
  - Flow validators
  - Cost estimators
  - Schema analyzers
  - Data quality checkers

Phase 3 (5 more tools):
  - Workspace managers
  - Data app deployers
  - Sandbox creators
  - Anomaly detectors
  - Performance optimizers
```

**MCP Tool Example**:
```typescript
// MCP Tool for PostgreSQL
import { MCPTool, MCPToolInput, MCPToolOutput } from '@anthropic-ai/mcp';

export const postgresqlTool: MCPTool = {
  name: 'postgresql_connect',
  description: 'Connect to PostgreSQL database and extract data',
  inputSchema: {
    type: 'object',
    properties: {
      host: { type: 'string', description: 'Database host' },
      port: { type: 'number', default: 5432 },
      database: { type: 'string' },
      username: { type: 'string' },
      password: { type: 'string' },
      table: { type: 'string', description: 'Table to extract' },
    },
    required: ['host', 'database', 'username', 'password', 'table'],
  },

  async execute(input: MCPToolInput): Promise<MCPToolOutput> {
    // 1. Validate credentials
    const isValid = await validateConnection(input);
    if (!isValid) {
      return { error: 'Invalid credentials or connection failed' };
    }

    // 2. Preview data
    const preview = await fetchPreview(input.table, 100);

    // 3. Generate Keboola extractor config
    const config = {
      componentId: 'keboola.ex-db-generic',
      configuration: {
        parameters: {
          db: {
            host: input.host,
            port: input.port,
            database: input.database,
            user: input.username,
            password: '#encrypted', // Use Keboola encryption
          },
          tables: [
            {
              name: input.table,
              outputTable: `ex-postgres-${input.table}`,
            },
          ],
        },
      },
    };

    return {
      success: true,
      preview,
      config,
      message: `PostgreSQL extractor configured for table "${input.table}"`,
    };
  },
};
```

---

### Prompt Management

**LangChain**
- **Recommendation**: Use for prompt orchestration
- **Why**: Proven, extensive tooling, active community

**Alternative**: Custom implementation
- **Recommendation**: Start simple, add LangChain if needed

**Prompt Structure**:
```typescript
// Prompt templates
const SYSTEM_PROMPTS = {
  extractorGeneration: `You are a helpful assistant that helps users configure data extractors for Keboola.

  Available extractors:
  - PostgreSQL, MySQL, Snowflake (databases)
  - Amazon S3, Google Drive, Azure Blob (file storage)
  - Google BigQuery, Redshift (data warehouses)

  When a user describes their data source, you should:
  1. Ask clarifying questions if needed
  2. Select the appropriate extractor
  3. Generate the configuration
  4. Preview the data
  5. Explain what the extractor will do

  Always validate credentials before finalizing configuration.`,

  transformationGeneration: `You are an expert SQL and Python programmer helping users write data transformations.

  When generating transformations:
  1. Write clean, well-commented code
  2. Handle NULL values appropriately
  3. Include error handling
  4. Optimize for performance
  5. Follow best practices

  Always explain your code and ask for confirmation before applying.`,

  flowGeneration: `You are a data pipeline expert helping users build workflows.

  A flow consists of:
  - Extractors (get data from sources)
  - Transformations (process data)
  - Writers (load data to destinations)

  When creating flows:
  1. Understand user's end-to-end goal
  2. Break into logical tasks
  3. Configure dependencies correctly
  4. Set up error handling
  5. Suggest scheduling

  Always visualize the flow before finalizing.`,
};
```

**Prompt Caching**:
```typescript
// Cache common prompts to reduce costs
import { LRUCache } from 'lru-cache';

const promptCache = new LRUCache<string, string>({
  max: 1000,
  ttl: 1000 * 60 * 60 * 24, // 24 hours
});

async function getCachedCompletion(prompt: string): Promise<string> {
  const cached = promptCache.get(prompt);
  if (cached) return cached;

  const completion = await llm.chat([{ role: 'user', content: prompt }]);
  promptCache.set(prompt, completion);
  return completion;
}
```

---

## Backend Technologies

### Runtime

**Node.js 20+**
- **Status**: ✅ Likely in use (common for React apps)
- **Recommendation**: Use Node.js 20 LTS
- **Why**: Best JavaScript ecosystem, team familiarity

**Server Framework**

**Fastify**
- **Recommendation**: Use for new AI backend
- **Why**:
  - 2x faster than Express
  - TypeScript-first
  - Schema validation built-in
  - Plugin system
  - WebSocket support

**Express**
- **Alternative**: If team prefers familiarity
- **Trade-off**: Slower, less TypeScript-friendly

**Example**:
```typescript
// Fastify server for AI endpoints
import Fastify from 'fastify';
import { chatRoutes } from './routes/chat';
import { mcpRoutes } from './routes/mcp';

const app = Fastify({
  logger: true,
});

// Type-safe routes
app.register(chatRoutes, { prefix: '/api/chat' });
app.register(mcpRoutes, { prefix: '/api/mcp' });

// Server-Sent Events for streaming
app.get('/api/chat/stream', async (request, reply) => {
  reply.raw.setHeader('Content-Type', 'text/event-stream');
  reply.raw.setHeader('Cache-Control', 'no-cache');
  reply.raw.setHeader('Connection', 'keep-alive');

  for await (const chunk of streamAIResponse(request.body.prompt)) {
    reply.raw.write(`data: ${JSON.stringify(chunk)}\n\n`);
  }

  reply.raw.end();
});

await app.listen({ port: 3000 });
```

---

### Database

**PostgreSQL 16+**
- **Recommendation**: Use for AI metadata storage
- **Use Cases**:
  - AI conversation history
  - User preferences (AI vs. manual UI)
  - Prompt templates and caching
  - Audit logs (AI decisions)
  - Usage analytics

**Schema Example**:
```sql
-- AI conversation history
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER NOT NULL,
  project_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  title TEXT, -- AI-generated summary
  metadata JSONB -- Custom data
);

CREATE TABLE ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES ai_conversations(id),
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  tokens_used INTEGER,
  model TEXT, -- 'claude-3-5-sonnet', etc.
  metadata JSONB -- Tool calls, etc.
);

-- Prompt cache
CREATE TABLE ai_prompt_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_hash TEXT UNIQUE NOT NULL,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  model TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  hit_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_prompt_hash ON ai_prompt_cache(prompt_hash);
CREATE INDEX idx_expires_at ON ai_prompt_cache(expires_at);
```

**Redis**
- **Recommendation**: Use for caching and rate limiting
- **Use Cases**:
  - Prompt cache (faster than PostgreSQL)
  - Rate limiting (per user, per project)
  - Session storage
  - Real-time data (active users)

**Example**:
```typescript
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Cache AI responses
async function getCachedAIResponse(prompt: string): Promise<string | null> {
  const hash = hashPrompt(prompt);
  return redis.get(`ai:cache:${hash}`);
}

async function cacheAIResponse(prompt: string, response: string) {
  const hash = hashPrompt(prompt);
  await redis.setex(`ai:cache:${hash}`, 86400, response); // 24 hour TTL
}

// Rate limiting
async function checkRateLimit(userId: string): Promise<boolean> {
  const key = `ai:ratelimit:${userId}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 3600); // Reset every hour
  }

  return count <= 100; // 100 requests per hour
}
```

---

### API Layer

**Reuse Existing Keboola APIs**
- **Recommendation**: 100% reuse, no duplication
- **Why**: Proven, tested, maintained

**From Phase 2 API Analysis**:
```yaml
14 API Clients Already Exist:
  - Storage API (tables, buckets, files, tokens)
  - Components API (configurations, configs)
  - Queue API (jobs)
  - Transformations API (code, variables)
  - Management API (projects, users, features)
  - Orchestrations API (flows, schedules)
  - Vault API (credentials)
  - Sandboxes API
  - Metastore API (data catalog, lineage)
  - Telemetry API (analytics)
  - And 4 more...

Reference: docs/06-api-contracts/api-clients.md

AI Layer Role:
  - Translate natural language → API calls
  - NOT replace APIs
  - NOT duplicate business logic
```

**Architecture**:
```typescript
// AI orchestrates existing APIs
async function createFlowViaAI(userPrompt: string) {
  // 1. AI understands intent
  const intent = await parseIntent(userPrompt);

  // 2. AI calls existing Keboola APIs (not new APIs!)
  const flow = await storageApi.createConfiguration({
    componentId: 'keboola.orchestrator',
    name: intent.flowName,
    configuration: intent.config,
  });

  // 3. AI adds tasks using existing APIs
  for (const task of intent.tasks) {
    await storageApi.createConfigurationRow({
      configurationId: flow.id,
      row: task,
    });
  }

  return flow;
}
```

---

## Testing Technologies

### Unit Testing

**Vitest**
- **Recommendation**: Use for new code
- **Why**:
  - 10x faster than Jest
  - Vite integration (same config)
  - Better TypeScript support
  - Compatible with Jest API

**Jest**
- **Status**: ✅ Likely in use currently
- **Recommendation**: Keep for existing tests, migrate gradually

**Example**:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChatInterface } from './ChatInterface';

describe('ChatInterface', () => {
  it('renders message input', () => {
    render(<ChatInterface />);
    expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
  });

  it('streams AI response', async () => {
    const mockStream = vi.fn();
    render(<ChatInterface onStream={mockStream} />);

    // Type and submit
    const input = screen.getByPlaceholderText('Type a message...');
    await userEvent.type(input, 'Create a flow');
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));

    // Verify streaming started
    expect(mockStream).toHaveBeenCalled();
  });
});
```

---

### E2E Testing

**Playwright**
- **Status**: ✅ Likely in use (Phase 3 used it)
- **Recommendation**: Continue for E2E tests
- **Why**: Best E2E framework, multi-browser, great DX

**Test Scenarios**:
```typescript
import { test, expect } from '@playwright/test';

test.describe('AI Flow Creation', () => {
  test('creates flow via chat', async ({ page }) => {
    await page.goto('/app/ai-chat');

    // Type prompt
    await page.fill('[data-testid="chat-input"]', 'Create a daily sales pipeline');
    await page.click('[data-testid="send-button"]');

    // Wait for AI response
    await expect(page.locator('[data-testid="ai-message"]')).toContainText(
      'I\'ll create a flow'
    );

    // Verify flow created
    await page.click('[data-testid="create-button"]');
    await expect(page).toHaveURL(/flows\/\d+/);
  });

  test('edits AI-generated flow manually', async ({ page }) => {
    // ... create flow via AI
    await page.click('[data-testid="edit-manually"]');

    // Verify canvas visible
    await expect(page.locator('.react-flow')).toBeVisible();

    // Edit on canvas
    await page.click('[data-node-id="task-1"]');
    await page.fill('[data-testid="task-name"]', 'Updated Name');

    // Verify AI context updated
    await page.click('[data-testid="back-to-chat"]');
    await expect(page.locator('[data-testid="ai-message"]')).toContainText(
      'Updated Name'
    );
  });
});
```

---

### Visual Testing

**Storybook**
- **Status**: Possibly in use for design system
- **Recommendation**: Use for component development
- **Why**: Great DX, visual testing, documentation

**Chromatic** (Optional)
- **Recommendation**: Consider for visual regression testing
- **Why**: Automated screenshot comparison, catches UI bugs

---

### AI Testing

**Prompt Testing**
- **Recommendation**: Custom test suite for AI behavior
- **Why**: Ensure AI generates correct configs

**Example**:
```typescript
import { describe, it, expect } from 'vitest';
import { generateExtractorConfig } from './ai';

describe('AI Extractor Generation', () => {
  it('generates PostgreSQL extractor from prompt', async () => {
    const prompt = 'Extract customers table from PostgreSQL at db.example.com';

    const config = await generateExtractorConfig(prompt);

    expect(config.componentId).toBe('keboola.ex-db-generic');
    expect(config.parameters.db.host).toBe('db.example.com');
    expect(config.parameters.tables[0].name).toBe('customers');
  });

  it('asks for credentials if not provided', async () => {
    const prompt = 'Extract from PostgreSQL';

    const response = await generateExtractorConfig(prompt);

    expect(response.needsMoreInfo).toBe(true);
    expect(response.questions).toContain('What is the database host?');
  });
});
```

---

## DevOps & Infrastructure

### Deployment

**Existing Keboola Infrastructure**
- **Recommendation**: Deploy to existing AWS environment
- **Why**: Reuse networking, security, monitoring

**Docker + Kubernetes**
- **Status**: ✅ Likely in use
- **Recommendation**: Continue, add AI services

**Architecture**:
```yaml
Kubernetes Deployment:
  Services:
    - keboola-ui (existing frontend)
    - keboola-ai-chat (new AI frontend)
    - keboola-ai-backend (new AI API)
    - keboola-mcp-tools (MCP tool services)
    - keboola-apis (existing backends)

  Shared:
    - PostgreSQL (existing + new AI tables)
    - Redis (new for AI caching)
    - Nginx (existing load balancer)

  Scaling:
    - AI backend: Auto-scale 2-20 pods
    - MCP tools: Auto-scale based on queue depth
    - Frontend: CDN (CloudFront)
```

---

### CI/CD

**GitHub Actions**
- **Status**: ✅ Likely in use
- **Recommendation**: Continue, add AI-specific workflows

**Workflows**:
```yaml
# .github/workflows/ai-backend.yml
name: AI Backend CI/CD

on:
  push:
    branches: [main]
    paths:
      - 'packages/ai-backend/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: yarn install
      - run: yarn test:ai-backend
      - run: yarn build:ai-backend

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: kubectl set image deployment/ai-backend ai-backend=$IMAGE_TAG
        env:
          KUBECONFIG: ${{ secrets.KUBECONFIG_STAGING }}

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: kubectl set image deployment/ai-backend ai-backend=$IMAGE_TAG
        env:
          KUBECONFIG: ${{ secrets.KUBECONFIG_PROD }}
```

---

### Monitoring

**Datadog / Sentry**
- **Status**: ✅ Likely in use
- **Recommendation**: Continue, add AI-specific metrics

**AI Metrics to Track**:
```yaml
Performance:
  - AI response time (p50, p95, p99)
  - Token usage per request
  - Cache hit rate
  - MCP tool execution time
  - Streaming latency

Cost:
  - LLM cost per user
  - LLM cost per request
  - Cache savings
  - Total AI spend (daily, monthly)

Quality:
  - AI accuracy (validated configs)
  - User satisfaction (thumbs up/down)
  - Manual edit rate (how often users edit AI output)
  - Error rate (AI failures)

Usage:
  - Active AI users (DAU, WAU, MAU)
  - AI vs manual UI usage
  - Most common prompts
  - Feature adoption (extractors, flows, transformations)
```

**Dashboard Example** (Datadog):
```yaml
Dashboard: AI Platform Metrics
  Widgets:
    - Timeseries: AI Requests per Minute
    - Gauge: Cache Hit Rate (target: >70%)
    - Timeseries: AI Cost per Hour
    - Heatmap: Response Time Distribution
    - Top List: Most Used MCP Tools
    - Table: Error Rate by AI Model

Alerts:
  - AI response time p95 > 2 seconds
  - AI error rate > 5%
  - AI cost > $1000/day
  - Cache hit rate < 50%
```

---

## Security

### Authentication & Authorization

**Reuse Existing Keboola Auth**
- **Status**: ✅ OAuth 2.0 in place
- **Recommendation**: Reuse 100%, no changes

**AI-Specific Security**:
```typescript
// Validate user can access project before AI acts on it
async function validateAIRequest(userId: string, projectId: string) {
  // Use existing RBAC
  const hasAccess = await kbcAuth.hasProjectAccess(userId, projectId);
  if (!hasAccess) {
    throw new ForbiddenError('User cannot access this project');
  }

  // Check AI rate limits
  const withinLimits = await checkRateLimit(userId);
  if (!withinLimits) {
    throw new RateLimitError('AI rate limit exceeded');
  }

  return true;
}
```

---

### Data Privacy

**PII Handling**:
```typescript
// Never send PII to LLM
function sanitizeForAI(data: any): any {
  return {
    ...data,
    // Redact sensitive fields
    password: '[REDACTED]',
    apiKey: '[REDACTED]',
    email: '[REDACTED]',
    // Keep structure for AI understanding
    _metadata: {
      originalFields: Object.keys(data),
    },
  };
}
```

**Audit Logging**:
```typescript
// Log all AI interactions for compliance
async function logAIInteraction(interaction: AIInteraction) {
  await auditLog.create({
    userId: interaction.userId,
    projectId: interaction.projectId,
    action: 'ai_request',
    prompt: interaction.prompt,
    response: interaction.response,
    model: interaction.model,
    tokensUsed: interaction.tokensUsed,
    timestamp: new Date(),
    ip: interaction.ip,
  });
}
```

---

## Recommended Package Versions

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "typescript": "^5.7.2",

    "@tanstack/react-query": "^5.59.0",
    "zustand": "^5.0.1",

    "@anthropic-ai/sdk": "^0.32.0",
    "ai": "^4.0.0",
    "@anthropic-ai/mcp": "^0.1.0",

    "react-flow": "^11.11.0",
    "@codemirror/lang-sql": "^6.8.0",
    "@codemirror/lang-python": "^6.1.6",

    "fastify": "^5.1.0",
    "ioredis": "^5.4.1",
    "pg": "^8.13.1"
  },
  "devDependencies": {
    "vite": "^6.0.1",
    "@vitejs/plugin-react": "^4.3.4",
    "vitest": "^2.1.8",
    "@testing-library/react": "^16.0.1",
    "@playwright/test": "^1.49.0",
    "storybook": "^8.4.7",
    "tailwindcss": "^3.4.15",
    "@tailwindcss/typography": "^0.5.15"
  }
}
```

---

## Migration Strategy for Existing Code

### Flux → TanStack Query

**Priority Modules** (from Phase 2):
1. storage (high usage, high complexity)
2. ex-facebook (legacy pattern)
3. Legacy flows (being replaced by AI anyway)

**Migration Pattern**:
```typescript
// BEFORE: Flux store
const ComponentsStore = Reflux.createStore({
  _components: Immutable.Map(),

  init() {
    this.listenTo(ComponentsActions.loadSuccess, this._handleLoadSuccess);
  },

  _handleLoadSuccess(components) {
    this._components = Immutable.fromJS(components);
    this.trigger(this._components);
  },

  getAll() {
    return this._components.toArray();
  },
});

// Component usage
const ComponentsList = React.createClass({
  mixins: [createStoreMixin(ComponentsStore)],
  getStateFromStores() {
    return { components: ComponentsStore.getAll() };
  },
});

// AFTER: TanStack Query
function useComponents() {
  return useQuery({
    queryKey: ['components'],
    queryFn: () => componentsApi.getAll(),
  });
}

// Component usage
function ComponentsList() {
  const { data: components, isLoading, error } = useComponents();

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorBoundary error={error} />;

  return components.map(c => <Component key={c.id} />);
}
```

---

## Summary

### Core Frontend Stack
- ✅ React 18.3+ (keep)
- ✅ TypeScript 5.7+ (keep, enable strict mode)
- ⭐ Vite 6.0+ (migrate from webpack)
- ✅ TanStack Query v5 (expand usage)
- ✅ Zustand (for local state)
- ✅ shadcn/ui + Radix (keep and enhance)
- ✅ TailwindCSS (keep)

### AI Stack
- ⭐ Anthropic Claude 3.5 (primary LLM)
- ⭐ OpenAI GPT-4 Turbo (fallback)
- ⭐ Vercel AI SDK (React integration)
- ⭐ Anthropic MCP (tools)
- ⭐ LangChain (prompt management)

### Backend Stack
- ⭐ Node.js 20+
- ⭐ Fastify (new AI backend)
- ✅ Existing Keboola APIs (reuse 100%)
- ⭐ PostgreSQL 16+ (AI metadata)
- ⭐ Redis (caching, rate limiting)

### Testing Stack
- ⭐ Vitest (new tests)
- ✅ Playwright (E2E)
- ✅ Storybook (components)
- ⭐ Custom AI testing framework

### Infrastructure
- ✅ AWS (existing)
- ✅ Kubernetes (existing)
- ✅ GitHub Actions (existing)
- ✅ Datadog/Sentry (existing)

**Legend**:
- ✅ Already in use, keep
- ⭐ New, recommended
- ⚠️ Consider replacing

**Next**: Review risk assessment and mitigation strategies.
