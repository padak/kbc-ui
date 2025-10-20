# Flows Feature - TypeScript Types

Comprehensive TypeScript type definitions for the Keboola Flows orchestration feature.

## Overview

This module provides:
- **TypeScript interfaces** for all flow-related data structures
- **Zod schemas** for runtime validation
- **Utility functions** for common operations
- **Type guards** for safe type checking

## Installation

The types are already included in the project. Zod is installed as a dependency:

```bash
pnpm add zod  # Already installed
```

## Usage

### Basic Example

```typescript
import {
  Flow,
  FlowConfiguration,
  Phase,
  Task,
  CreateFlowInput,
  FlowConfigurationSchema,
  validateFlowConfiguration,
} from '@/lib/types/flows';

// Define phases
const extractPhase: Phase = {
  id: 'phase-1-extract',
  name: 'Extract Data',
  dependsOn: [],
};

const transformPhase: Phase = {
  id: 'phase-2-transform',
  name: 'Transform Data',
  dependsOn: ['phase-1-extract'], // Runs after extract
};

// Define tasks
const sheetsTask: Task = {
  id: 'task-sheets',
  name: 'Google Sheets Extractor',
  componentId: 'keboola.ex-google-sheets',
  phase: 'phase-1-extract',
  task: {
    mode: 'run',
    configData: {}, // Auto-created config in V1
  },
};

const dbtTask: Task = {
  id: 'task-dbt',
  name: 'dbt Transformation',
  componentId: 'keboola.dbt-transformation',
  phase: 'phase-2-transform',
  task: {
    mode: 'run',
    configData: {},
  },
};

// Create flow configuration
const config: FlowConfiguration = {
  phases: [extractPhase, transformPhase],
  tasks: [sheetsTask, dbtTask],
};

// Validate with Zod (runtime)
const zodResult = FlowConfigurationSchema.safeParse(config);
if (zodResult.success) {
  console.log('Valid flow configuration!');
} else {
  console.error('Validation errors:', zodResult.error);
}

// Validate with custom validator (logical checks)
const customResult = validateFlowConfiguration(config);
if (!customResult.valid) {
  console.error('Configuration errors:', customResult.errors);
}
```

### Creating a Flow

```typescript
import { CreateFlowInput, CreateFlowInputSchema } from '@/lib/types/flows';

const createInput: CreateFlowInput = {
  name: 'Google Sheets to Snowflake',
  description: 'Extract from Sheets, transform with dbt, write to Snowflake',
  configuration: {
    phases: [/* ... */],
    tasks: [/* ... */],
  },
  isDisabled: false,
};

// Validate before sending to API
const result = CreateFlowInputSchema.safeParse(createInput);
if (result.success) {
  // Safe to send to API
  await createFlow(result.data);
}
```

### Working with Jobs

```typescript
import {
  Job,
  JobStatus,
  isJobTerminal,
  isJobRunning,
  calculateJobDuration,
  formatJobDuration,
} from '@/lib/types/flows';

const job: Job = {
  id: '12345',
  status: 'success',
  component: 'keboola.flow',
  config: 'my-flow-id',
  createdTime: '2025-01-20T14:00:00Z',
  startTime: '2025-01-20T14:00:05Z',
  endTime: '2025-01-20T14:05:30Z',
};

// Check job status
if (isJobTerminal(job.status)) {
  console.log('Job has completed');
}

if (isJobRunning(job.status)) {
  console.log('Job is still running');
}

// Calculate and format duration
const durationSeconds = calculateJobDuration(job); // 325
const formatted = formatJobDuration(durationSeconds!); // "5m 25s"
```

### AI Flow Generation

```typescript
import {
  AIGenerateRequest,
  AIGenerateResponse,
  AIGenerateRequestSchema,
} from '@/lib/types/flows';

// Prepare request
const request: AIGenerateRequest = {
  prompt: 'Extract from Google Sheets, transform with dbt, write to Snowflake',
  projectId: '12345',
};

// Validate request
const validation = AIGenerateRequestSchema.safeParse(request);
if (!validation.success) {
  console.error('Invalid prompt:', validation.error);
  return;
}

// Call API endpoint
const response: AIGenerateResponse = await fetch('/api/flows/generate', {
  method: 'POST',
  body: JSON.stringify(request),
}).then(res => res.json());

if (response.success) {
  console.log('Generated flow:', response.flow);
  console.log('Mermaid diagram:', response.mermaid);

  // Check for warnings
  if (response.warnings?.length) {
    console.warn('Warnings:', response.warnings);
  }
}
```

### Utility Functions

```typescript
import {
  getComponentType,
  formatJobDuration,
  validateFlowConfiguration,
} from '@/lib/types/flows';

// Get component type from ID
getComponentType('keboola.ex-google-sheets'); // => "extractor"
getComponentType('keboola.wr-snowflake');     // => "writer"
getComponentType('keboola.dbt-transformation'); // => "transformation"

// Format durations
formatJobDuration(65);    // => "1m 5s"
formatJobDuration(3665);  // => "1h 1m 5s"
formatJobDuration(325);   // => "5m 25s"

// Validate flow configuration
const result = validateFlowConfiguration(config);
if (!result.valid) {
  result.errors.forEach(error => console.error(error));
}
```

### Type Guards

```typescript
import { isComponentType, isJobStatus, isJobTerminal } from '@/lib/types/flows';

const value: unknown = 'extractor';

if (isComponentType(value)) {
  // TypeScript now knows `value` is ComponentType
  const type: ComponentType = value;
}

if (isJobStatus('success')) {
  // TypeScript knows it's a valid JobStatus
}

if (isJobTerminal('success')) {
  console.log('Job is finished');
}
```

### Mermaid Diagram Styling

```typescript
import {
  COMPONENT_TYPE_STYLES,
  MermaidNodeStyle,
  getComponentType,
} from '@/lib/types/flows';

const componentId = 'keboola.ex-google-sheets';
const type = getComponentType(componentId);
const style: MermaidNodeStyle = COMPONENT_TYPE_STYLES[type];

console.log(style.icon); // "📊"
console.log(style.backgroundColor); // "#DBEAFE"
console.log(style.borderColor); // "#3B82F6"
```

## Type Reference

### Core Types

| Type | Description |
|------|-------------|
| `Flow` | Complete flow object from Storage API |
| `FlowConfiguration` | Flow orchestration config (phases + tasks) |
| `Phase` | Execution phase grouping tasks |
| `Task` | Individual component execution task |
| `Component` | Available Keboola component |
| `Job` | Flow execution job |

### Enums

| Type | Values | Description |
|------|--------|-------------|
| `ComponentType` | `extractor`, `transformation`, `writer`, `application`, `flow` | Component classification |
| `FlowStatus` | `active`, `disabled`, `failed`, `never_run` | Flow status |
| `JobStatus` | `created`, `waiting`, `processing`, `success`, `error`, `terminated`, `cancelled` | Job execution status |

### Input Types (Mutations)

| Type | Description |
|------|-------------|
| `CreateFlowInput` | Input for creating a new flow |
| `UpdateFlowInput` | Input for updating an existing flow |
| `RunFlowInput` | Input for running a flow |
| `AIGenerateRequest` | Request to AI generation endpoint |
| `AIGenerateResponse` | Response from AI generation endpoint |

### Zod Schemas

| Schema | Description |
|--------|-------------|
| `PhaseSchema` | Validates Phase objects |
| `TaskSchema` | Validates Task objects |
| `FlowConfigurationSchema` | Validates FlowConfiguration |
| `CreateFlowInputSchema` | Validates CreateFlowInput |
| `UpdateFlowInputSchema` | Validates UpdateFlowInput |
| `RunFlowInputSchema` | Validates RunFlowInput |
| `AIGenerateRequestSchema` | Validates AIGenerateRequest |

### Utility Types

| Type | Description |
|------|-------------|
| `FlowListItem` | Minimal flow data for list view |
| `MermaidNodeStyle` | Styling for Mermaid diagram nodes |

## Validation

### Zod Validation (Runtime)

```typescript
import { FlowConfigurationSchema } from '@/lib/types/flows';

const result = FlowConfigurationSchema.safeParse(config);

if (result.success) {
  // result.data is typed and validated
  const validConfig = result.data;
} else {
  // result.error contains detailed validation errors
  console.error(result.error.errors);
}
```

### Custom Validation (Logical)

```typescript
import { validateFlowConfiguration } from '@/lib/types/flows';

const result = validateFlowConfiguration(config);

if (!result.valid) {
  // result.errors contains human-readable error messages
  result.errors.forEach(error => console.error(error));
}
```

The custom validator checks:
- All tasks reference valid phases
- Each phase has at least one task
- Phase dependencies reference existing phases
- No circular dependencies (simplified check)

## Best Practices

1. **Always validate input from external sources** (API responses, user input)
2. **Use Zod schemas for runtime validation** before sending data to APIs
3. **Use TypeScript interfaces** for type safety during development
4. **Use type guards** when working with `unknown` or `any` types
5. **Use utility functions** instead of reimplementing common logic

## Examples in the Codebase

### TanStack Query Hook

```typescript
// src/lib/api/flows.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { Flow, CreateFlowInput, CreateFlowInputSchema } from '@/lib/types/flows';

export function useCreateFlow() {
  return useMutation({
    mutationFn: async (input: CreateFlowInput) => {
      // Validate before sending
      const validated = CreateFlowInputSchema.parse(input);

      const response = await fetch(`${stackUrl}/v2/storage/components/keboola.flow/configs`, {
        method: 'POST',
        headers: {
          'X-StorageApi-Token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validated),
      });

      return response.json() as Promise<Flow>;
    },
  });
}
```

### React Component

```typescript
// src/components/flows/flow-card.tsx
import { Flow, JobStatus, formatJobDuration } from '@/lib/types/flows';

interface FlowCardProps {
  flow: Flow;
  latestJobStatus?: JobStatus;
  lastRunTime?: string;
}

export function FlowCard({ flow, latestJobStatus, lastRunTime }: FlowCardProps) {
  const taskCount = flow.configuration.tasks.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{flow.name}</CardTitle>
        {latestJobStatus && <StatusBadge status={latestJobStatus} />}
      </CardHeader>
      <CardContent>
        <p>{flow.description}</p>
        <p>{taskCount} tasks</p>
        {lastRunTime && <p>Last run: {lastRunTime}</p>}
      </CardContent>
    </Card>
  );
}
```

## API Integration

The types align with these Keboola Storage API endpoints:

- `GET /v2/storage/components/keboola.flow/configs` → `Flow[]`
- `GET /v2/storage/components/keboola.flow/configs/:id` → `Flow`
- `POST /v2/storage/components/keboola.flow/configs` → `Flow` (body: `CreateFlowInput`)
- `PUT /v2/storage/components/keboola.flow/configs/:id` → `Flow` (body: `UpdateFlowInput`)
- `DELETE /v2/storage/components/keboola.flow/configs/:id` → `{ success: boolean }`
- `POST /v2/storage/jobs` → `Job` (body: `{ component: 'keboola.flow', config: flowId }`)
- `GET /v2/storage/jobs?component=keboola.flow&config=:id` → `Job[]`

## Related Documentation

- [Flow Feature Specification](/docs/build-specs/flow-spec.md)
- [Legacy UI Flows Module](/docs/research/legacy-ui/02-modules/flows-v2.md)
- [Keboola Storage API](https://developers.keboola.com/storage/)
- [Zod Documentation](https://zod.dev/)

## Contributing

When adding new types:

1. Add TypeScript interface
2. Add corresponding Zod schema
3. Add JSDoc comments with examples
4. Update this README
5. Add tests if adding utility functions

## Version History

- **v1.0.0** (2025-01-20): Initial type definitions for Flows feature
  - Core types (Flow, Phase, Task, Component, Job)
  - AI generation types
  - Input types for mutations
  - Zod schemas for validation
  - Utility functions and type guards
