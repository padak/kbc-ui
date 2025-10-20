# Testing the AI Flow Generation Endpoint

## Prerequisites

1. **Anthropic API Key**: Set in `.env.local`
   ```bash
   echo "ANTHROPIC_API_KEY=sk-ant-api03-..." > .env.local
   ```

2. **Keboola Credentials**: Get from Keboola Connection UI
   - Stack URL: e.g., `https://connection.keboola.com`
   - API Token: From User Settings > API Tokens

3. **Start Development Server**:
   ```bash
   pnpm dev
   ```

---

## Test via cURL

### 1. Basic Test (Simple Pipeline)

```bash
curl -X POST http://localhost:3000/api/flows/generate \
  -H "Content-Type: application/json" \
  -H "X-StorageApi-Token: YOUR_KEBOOLA_TOKEN" \
  -H "X-Stack-Url: https://connection.keboola.com" \
  -d '{
    "prompt": "Extract data from Google Sheets and load to Snowflake"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "flow": {
    "name": "Google Sheets to Snowflake",
    "description": "Extract data from Google Sheets and load to Snowflake",
    "configuration": {
      "phases": [...],
      "tasks": [...]
    }
  },
  "mermaid": "%%{init: {'theme':'base'...}}%%\n\ngraph TB...",
  "warnings": []
}
```

---

### 2. Complex Pipeline Test

```bash
curl -X POST http://localhost:3000/api/flows/generate \
  -H "Content-Type: application/json" \
  -H "X-StorageApi-Token: YOUR_KEBOOLA_TOKEN" \
  -H "X-Stack-Url: https://connection.keboola.com" \
  -d '{
    "prompt": "Create a data pipeline that: 1) Extracts sales data from Salesforce, 2) Transforms it with dbt to calculate monthly metrics, 3) Loads to BigQuery for reporting, and 4) Sends a Slack notification when complete"
  }'
```

**Expected:** 4-phase flow with extractor → transformation → writer → notification

---

### 3. Error Test: Missing Headers

```bash
curl -X POST http://localhost:3000/api/flows/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Test pipeline"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Authentication required: X-StorageApi-Token and X-Stack-Url headers must be provided"
}
```

---

### 4. Error Test: Empty Prompt

```bash
curl -X POST http://localhost:3000/api/flows/generate \
  -H "Content-Type: application/json" \
  -H "X-StorageApi-Token: YOUR_KEBOOLA_TOKEN" \
  -H "X-Stack-Url: https://connection.keboola.com" \
  -d '{
    "prompt": ""
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Prompt is required and must be a non-empty string"
}
```

---

## Test via Browser Console

Open the browser console on the Keboola UI app and run:

```javascript
// Get credentials from localStorage
const token = localStorage.getItem('kbc_token');
const stackUrl = localStorage.getItem('kbc_stack_url');

// Test API endpoint
fetch('/api/flows/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-StorageApi-Token': token,
    'X-Stack-Url': stackUrl,
  },
  body: JSON.stringify({
    prompt: 'Extract data from PostgreSQL, transform with Python, and load to S3'
  })
})
  .then(res => res.json())
  .then(data => {
    console.log('Success:', data.success);
    console.log('Flow name:', data.flow?.name);
    console.log('Phases:', data.flow?.configuration.phases.length);
    console.log('Tasks:', data.flow?.configuration.tasks.length);
    console.log('Mermaid diagram:', data.mermaid);
    console.log('Warnings:', data.warnings || 'None');
  })
  .catch(err => console.error('Error:', err));
```

---

## Verify Response Structure

After getting a successful response, verify:

### Flow Object
- ✅ `flow.name` is a descriptive string
- ✅ `flow.description` matches the original prompt
- ✅ `flow.configuration.phases` is an array with 1+ phases
- ✅ `flow.configuration.tasks` is an array with 1+ tasks

### Phases
- ✅ Each phase has `id`, `name`, `dependsOn` fields
- ✅ Phase IDs are sequential: `phase-1`, `phase-2`, etc.
- ✅ Phase names are descriptive: "Extract", "Transform", "Load"
- ✅ Dependencies are correct (later phases depend on earlier ones)

### Tasks
- ✅ Each task has `id`, `name`, `componentId`, `phase`, `task` fields
- ✅ Task IDs are sequential: `task-1`, `task-2`, etc.
- ✅ Component IDs are valid Keboola component IDs (e.g., `keboola.ex-google-sheets`)
- ✅ Each task references a valid phase ID
- ✅ `task.mode` is "run"
- ✅ `task.configData` is an empty object `{}`

### Mermaid Diagram
- ✅ Starts with theme configuration
- ✅ Contains `graph TB` declaration
- ✅ Has subgraphs for each phase
- ✅ Contains nodes for each task
- ✅ Has labeled edges between tasks
- ✅ Includes CSS class definitions
- ✅ Can be rendered by Mermaid.js

### Warnings
- ✅ Empty array if all components are valid
- ✅ Contains descriptive messages if components don't exist

---

## Common Issues

### 1. "ANTHROPIC_API_KEY environment variable is not set"
**Fix:** Create `.env.local` file with your API key

### 2. "Failed to fetch available components"
**Fix:** Check your Keboola token is valid and has correct permissions

### 3. "AI generation failed"
**Fix:**
- Check Anthropic API key is valid
- Check you have API credits remaining
- Try with a simpler prompt

### 4. Components in warnings
**Fix:** The AI suggested components not available in your project. This is expected - the flow will still be created but you may need to enable those components.

---

## Performance Benchmarks

Expected timing (approximate):

| Operation | Time |
|-----------|------|
| Component fetch | 200-500ms |
| Claude API call | 3-8 seconds |
| Mermaid generation | < 50ms |
| **Total** | **3-10 seconds** |

If requests take longer than 15 seconds, check:
- Network latency to Anthropic API
- Complexity of prompt (very complex pipelines take longer)
- Anthropic API status page

---

## Next Steps

Once the API is working:

1. **Build Frontend Components**:
   - `AIFlowCreator` modal component
   - `MermaidFlowDiagram` renderer
   - `FlowConfigSummary` display

2. **Add TanStack Query Hook**:
   ```typescript
   export function useGenerateFlow() {
     // Implementation in /src/lib/api/flows.ts
   }
   ```

3. **Integrate with UI**:
   - Wire up "New Flow" button
   - Handle ⌘K keyboard shortcut
   - Display loading states
   - Show Mermaid diagram
   - Allow saving flow

4. **Add Error Handling**:
   - Network errors
   - Timeout (30s)
   - Invalid responses
   - Component warnings

5. **Enhance AI Prompt**:
   - Add more context about user's project
   - Include existing flows for consistency
   - Support multi-turn conversation
   - Add prompt templates/examples
