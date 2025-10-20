# Quick Start - AI Flow Generation API

**Endpoint:** `POST /api/flows/generate`

---

## Setup (1 minute)

1. **Add Anthropic API Key**
   ```bash
   echo "ANTHROPIC_API_KEY=sk-ant-api03-YOUR_KEY_HERE" >> .env.local
   ```
   Get key from: https://console.anthropic.com/

2. **Start Server**
   ```bash
   pnpm dev
   ```

---

## Test with cURL (30 seconds)

```bash
curl -X POST http://localhost:3000/api/flows/generate \
  -H "Content-Type: application/json" \
  -H "X-StorageApi-Token: YOUR_KEBOOLA_TOKEN" \
  -H "X-Stack-Url: https://connection.keboola.com" \
  -d '{"prompt":"Extract from Google Sheets and load to Snowflake"}'
```

**Expected Response:** JSON with `flow`, `mermaid`, and `warnings` fields.

---

## Use in React Component

```typescript
import { useMutation } from '@tanstack/react-query';
import { getAuth } from '@/lib/api/auth';
import type { GenerateFlowRequest, GenerateFlowResponse } from '@/lib/api/types/flow';

function useGenerateFlow() {
  const auth = getAuth();

  return useMutation<GenerateFlowResponse, Error, GenerateFlowRequest>({
    mutationFn: async (request) => {
      const res = await fetch('/api/flows/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-StorageApi-Token': auth.token,
          'X-Stack-Url': auth.stackUrl,
        },
        body: JSON.stringify(request),
      });
      return res.json();
    },
  });
}

// In component
function AIFlowCreator() {
  const generateFlow = useGenerateFlow();

  const handleGenerate = async (prompt: string) => {
    const result = await generateFlow.mutateAsync({ prompt });

    if (result.success) {
      console.log('Generated:', result.flow.name);
      // Display result.mermaid diagram
      // Show result.warnings if any
      // Save result.flow to Keboola
    }
  };

  return <div>{/* UI */}</div>;
}
```

---

## Response Structure

```typescript
{
  success: true,
  flow: {
    name: "Google Sheets to Snowflake",
    description: "Extract from Google Sheets and load to Snowflake",
    configuration: {
      phases: [
        { id: "phase-1", name: "Extract", dependsOn: [] },
        { id: "phase-2", name: "Load", dependsOn: ["phase-1"] }
      ],
      tasks: [
        {
          id: "task-1",
          name: "Google Sheets Extractor",
          componentId: "keboola.ex-google-sheets",
          phase: "phase-1",
          task: { mode: "run", configData: {} }
        },
        {
          id: "task-2",
          name: "Snowflake Writer",
          componentId: "keboola.wr-snowflake",
          phase: "phase-2",
          task: { mode: "run", configData: {} }
        }
      ]
    }
  },
  mermaid: "%%{init: {'theme':'base'...}}%%\n\ngraph TB...",
  warnings: []
}
```

---

## Next Steps

1. ✅ API is ready
2. → Build `AIFlowCreator` modal component
3. → Build `MermaidFlowDiagram` renderer
4. → Wire up "New Flow" button
5. → Save flow to Keboola Storage API

---

## Documentation

- **Complete API Docs:** `README.md` (in this directory)
- **Testing Guide:** `TEST.md` (in this directory)
- **Implementation Summary:** `/docs/implementation/AI_FLOW_GENERATION_ENDPOINT.md`
- **Type Definitions:** `/src/lib/api/types/flow.ts`
- **PRD:** `/docs/build-specs/flow-spec.md`

---

**Status:** ✅ Ready to use
