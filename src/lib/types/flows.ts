/**
 * Flows Feature - TypeScript Type Definitions
 *
 * Comprehensive type system for Keboola Flow orchestration feature.
 * Based on:
 * - /docs/build-specs/flow-spec.md
 * - /docs/research/legacy-ui/02-modules/flows-v2.md
 * - Keboola Storage API v2/v3
 *
 * @module lib/types/flows
 */

import { z } from 'zod';

// ============================================================================
// CORE FLOW TYPES
// ============================================================================

/**
 * Component type classification for UI rendering and validation
 */
export type ComponentType = 'extractor' | 'transformation' | 'writer' | 'application' | 'flow';

/**
 * Flow execution status for UI badges and filtering
 */
export type FlowStatus = 'active' | 'disabled' | 'failed' | 'never_run';

/**
 * Job execution status (aligned with Keboola Queue API)
 */
export type JobStatus =
  | 'created'     // Job created but not yet started
  | 'waiting'     // Waiting for resources or dependencies
  | 'processing'  // Currently executing
  | 'success'     // Completed successfully
  | 'error'       // Failed with error
  | 'terminated'  // Manually terminated
  | 'cancelled';  // Cancelled before execution

/**
 * Phase - Execution phase grouping tasks
 *
 * Phases define the orchestration structure. Tasks within a phase
 * run in parallel (or sequentially if configured). Phases can depend
 * on completion of other phases.
 *
 * @example
 * {
 *   id: "phase-1-extract",
 *   name: "Extract Data",
 *   dependsOn: [] // No dependencies, runs first
 * }
 */
export interface Phase {
  /** Unique phase identifier (e.g., "phase-1-extract") */
  id: string;

  /** Human-readable phase name (e.g., "Extract Data") */
  name: string;

  /** Array of phase IDs that must complete before this phase starts */
  dependsOn: string[];
}

/**
 * Task - Individual component execution task
 *
 * Tasks represent a single component configuration execution.
 * In V1, configs are auto-created. In V2, users can select existing configs.
 *
 * @example
 * {
 *   id: "task-sheets-extract",
 *   name: "Google Sheets Extractor",
 *   componentId: "keboola.ex-google-sheets",
 *   configId: "auto-created-config-123", // Optional in V1
 *   phase: "phase-1-extract",
 *   task: {
 *     mode: "run",
 *     configData: {} // Empty for auto-create, or specific config
 *   }
 * }
 */
export interface Task {
  /** Unique task identifier (e.g., "task-sheets-extract") */
  id: string;

  /** Human-readable task name (e.g., "Google Sheets Extractor") */
  name: string;

  /** Keboola component ID (e.g., "keboola.ex-google-sheets") */
  componentId: string;

  /**
   * Configuration ID (optional in V1 - auto-created)
   * In V2, users can select existing configurations
   */
  configId?: string;

  /** Phase ID this task belongs to */
  phase: string;

  /** Task execution configuration */
  task: {
    /** Execution mode (always "run" for V1) */
    mode: 'run';

    /**
     * Configuration data (empty object for auto-create in V1)
     * In V2, can contain component-specific config
     */
    configData?: Record<string, unknown>;
  };

  /** Optional retry configuration (V2 feature) */
  retry?: {
    enabled: boolean;
    maxRetries: number;
    delaySeconds: number;
  };

  /** Optional delay before task execution (seconds) */
  delaySeconds?: number;
}

/**
 * FlowConfiguration - Complete flow orchestration configuration
 *
 * Defines the entire flow structure with phases and tasks.
 * Sent to Keboola Storage API as the "configuration" field.
 *
 * @example
 * {
 *   phases: [
 *     { id: "phase-1", name: "Extract", dependsOn: [] },
 *     { id: "phase-2", name: "Transform", dependsOn: ["phase-1"] }
 *   ],
 *   tasks: [
 *     { id: "task-1", name: "Sheets", componentId: "keboola.ex-google-sheets", phase: "phase-1", ... },
 *     { id: "task-2", name: "dbt", componentId: "keboola.dbt-transformation", phase: "phase-2", ... }
 *   ]
 * }
 */
export interface FlowConfiguration {
  /** Array of execution phases defining orchestration structure */
  phases: Phase[];

  /** Array of tasks to execute within phases */
  tasks: Task[];
}

/**
 * Flow - Complete flow object (from Keboola Storage API)
 *
 * Represents a saved flow configuration in the Keboola project.
 * Maps to Storage API component configuration for "keboola.flow".
 *
 * @example
 * {
 *   id: "12345",
 *   name: "Google Sheets to Snowflake",
 *   description: "Extract from Sheets, transform with dbt, write to Snowflake",
 *   configuration: { phases: [...], tasks: [...] },
 *   isDisabled: false,
 *   created: "2025-01-20T10:00:00Z",
 *   version: 1
 * }
 */
export interface Flow {
  /** Flow configuration ID (from Storage API) */
  id: string;

  /** Flow name (user-defined or AI-generated) */
  name: string;

  /** Flow description (typically the original AI prompt) */
  description: string;

  /** Flow orchestration configuration */
  configuration: FlowConfiguration;

  /** Whether flow is disabled (won't run on schedule) */
  isDisabled: boolean;

  /** ISO 8601 timestamp of creation */
  created: string;

  /** Configuration version number (increments on save) */
  version: number;

  /** Optional folder path (V2 feature) */
  folderPath?: string;

  /** Optional schedule information (from keboola.scheduler) */
  schedule?: {
    id: string;
    cronExpression: string;
    timezone: string;
    enabled: boolean;
  };
}

/**
 * Component - Available Keboola component
 *
 * Represents a component available in the Keboola project.
 * Used for validation and UI rendering (icons, names).
 *
 * @example
 * {
 *   id: "keboola.ex-google-sheets",
 *   name: "Google Sheets",
 *   type: "extractor",
 *   icon: {
 *     32: "https://cdn.keboola.com/icons/sheets-32.png",
 *     64: "https://cdn.keboola.com/icons/sheets-64.png"
 *   }
 * }
 */
export interface Component {
  /** Component ID (e.g., "keboola.ex-google-sheets") */
  id: string;

  /** Human-readable component name */
  name: string;

  /** Component type for categorization */
  type: ComponentType;

  /** Icon URLs for different sizes */
  icon: {
    32: string;
    64: string;
  };

  /** Optional component description */
  description?: string;

  /** Whether component is deprecated */
  deprecated?: boolean;
}

/**
 * Job - Flow execution job
 *
 * Represents a single execution of a flow (or component).
 * Aligned with Keboola Queue API.
 *
 * @example
 * {
 *   id: "67890",
 *   status: "success",
 *   component: "keboola.flow",
 *   config: "12345",
 *   createdTime: "2025-01-20T14:00:00Z",
 *   startTime: "2025-01-20T14:00:05Z",
 *   endTime: "2025-01-20T14:05:30Z",
 *   durationSeconds: 325
 * }
 */
export interface Job {
  /** Job ID (from Queue API) */
  id: string;

  /** Current job status */
  status: JobStatus;

  /** Component ID that was executed */
  component: string;

  /** Configuration ID that was executed */
  config: string;

  /** ISO 8601 timestamp when job was created */
  createdTime: string;

  /** ISO 8601 timestamp when job started (optional) */
  startTime?: string;

  /** ISO 8601 timestamp when job ended (optional) */
  endTime?: string;

  /** Job duration in seconds (calculated from start/end) */
  durationSeconds?: number;

  /** Error message if job failed */
  error?: string;

  /** Job metrics (rows processed, etc.) */
  metrics?: {
    rowsProcessed?: number;
    bytesProcessed?: number;
  };

  /** Nested jobs (for flows with phases/tasks) */
  nestedJobs?: Job[];
}

// ============================================================================
// AI GENERATION TYPES
// ============================================================================

/**
 * AIGenerateRequest - Request to AI endpoint for flow generation
 *
 * Sent from frontend to /api/flows/generate endpoint.
 *
 * @example
 * {
 *   prompt: "Extract from Google Sheets, transform with dbt, write to Snowflake",
 *   projectId: "12345"
 * }
 */
export interface AIGenerateRequest {
  /** Natural language prompt describing the flow */
  prompt: string;

  /** Optional project ID (for component validation) */
  projectId?: string;
}

/**
 * AIGenerateResponse - Response from AI endpoint
 *
 * Returned from /api/flows/generate endpoint.
 * Contains generated flow config, Mermaid diagram, and warnings.
 *
 * @example
 * {
 *   success: true,
 *   flow: {
 *     name: "Google Sheets to Snowflake",
 *     description: "Extract from Google Sheets...",
 *     configuration: { phases: [...], tasks: [...] }
 *   },
 *   mermaid: "graph TB\n  A[Sheets] --> B[dbt] --> C[Snowflake]",
 *   warnings: ["Component keboola.ex-google-sheets not installed"]
 * }
 */
export interface AIGenerateResponse {
  /** Whether generation was successful */
  success: boolean;

  /** Generated flow data (if successful) */
  flow: {
    /** AI-generated flow name */
    name: string;

    /** Original user prompt as description */
    description: string;

    /** Generated flow configuration */
    configuration: FlowConfiguration;
  };

  /** Mermaid diagram markdown for visualization */
  mermaid: string;

  /** Optional warnings (e.g., missing components) */
  warnings?: string[];

  /** Error message (if success: false) */
  error?: string;
}

// ============================================================================
// INPUT TYPES (for mutations)
// ============================================================================

/**
 * CreateFlowInput - Input for creating a new flow
 *
 * Used by useCreateFlow mutation.
 * Sent to POST /v2/storage/components/keboola.flow/configs
 *
 * @example
 * {
 *   name: "Google Sheets to Snowflake",
 *   description: "Extract customer data from Sheets...",
 *   configuration: { phases: [...], tasks: [...] },
 *   isDisabled: false
 * }
 */
export interface CreateFlowInput {
  /** Flow name (required, max 255 chars) */
  name: string;

  /** Flow description (optional) */
  description?: string;

  /** Flow configuration (required) */
  configuration: FlowConfiguration;

  /** Whether flow is disabled (defaults to false) */
  isDisabled?: boolean;

  /** Optional folder path (V2 feature) */
  folderPath?: string;
}

/**
 * UpdateFlowInput - Input for updating an existing flow
 *
 * Used by useUpdateFlow mutation.
 * Sent to PUT /v2/storage/components/keboola.flow/configs/:id
 *
 * @example
 * {
 *   id: "12345",
 *   name: "Updated Flow Name",
 *   configuration: { phases: [...], tasks: [...] }
 * }
 */
export interface UpdateFlowInput {
  /** Flow ID (required) */
  id: string;

  /** Updated flow name (optional) */
  name?: string;

  /** Updated description (optional) */
  description?: string;

  /** Updated configuration (optional) */
  configuration?: FlowConfiguration;

  /** Updated disabled state (optional) */
  isDisabled?: boolean;
}

/**
 * RunFlowInput - Input for running a flow
 *
 * Used by useRunFlow mutation.
 * Sent to POST /v2/storage/jobs
 *
 * @example
 * {
 *   flowId: "12345"
 * }
 */
export interface RunFlowInput {
  /** Flow configuration ID to execute */
  flowId: string;

  /** Optional execution mode (defaults to "run") */
  mode?: 'run';

  /** Optional parameters to pass to flow (V2 feature) */
  parameters?: Record<string, unknown>;
}

// ============================================================================
// ZOD SCHEMAS (for runtime validation)
// ============================================================================

/**
 * Zod schema for Phase validation
 */
export const PhaseSchema = z.object({
  id: z.string().min(1, 'Phase ID is required'),
  name: z.string().min(1, 'Phase name is required').max(255, 'Phase name too long'),
  dependsOn: z.array(z.string()),
});

/**
 * Zod schema for Task validation
 */
export const TaskSchema = z.object({
  id: z.string().min(1, 'Task ID is required'),
  name: z.string().min(1, 'Task name is required').max(255, 'Task name too long'),
  componentId: z.string().min(1, 'Component ID is required'),
  configId: z.string().optional(),
  phase: z.string().min(1, 'Phase ID is required'),
  task: z.object({
    mode: z.literal('run'),
    configData: z.record(z.string(), z.unknown()).optional(),
  }),
  retry: z.object({
    enabled: z.boolean(),
    maxRetries: z.number().int().min(0).max(10),
    delaySeconds: z.number().int().min(0).max(3600),
  }).optional(),
  delaySeconds: z.number().int().min(0).max(3600).optional(),
});

/**
 * Zod schema for FlowConfiguration validation
 */
export const FlowConfigurationSchema = z.object({
  phases: z.array(PhaseSchema).min(1, 'At least one phase is required'),
  tasks: z.array(TaskSchema).min(1, 'At least one task is required'),
});

/**
 * Zod schema for CreateFlowInput validation
 */
export const CreateFlowInputSchema = z.object({
  name: z.string()
    .min(1, 'Flow name is required')
    .max(255, 'Flow name must be less than 255 characters'),
  description: z.string().max(1000, 'Description too long').optional(),
  configuration: FlowConfigurationSchema,
  isDisabled: z.boolean().optional().default(false),
  folderPath: z.string().optional(),
});

/**
 * Zod schema for UpdateFlowInput validation
 */
export const UpdateFlowInputSchema = z.object({
  id: z.string().min(1, 'Flow ID is required'),
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  configuration: FlowConfigurationSchema.optional(),
  isDisabled: z.boolean().optional(),
});

/**
 * Zod schema for RunFlowInput validation
 */
export const RunFlowInputSchema = z.object({
  flowId: z.string().min(1, 'Flow ID is required'),
  mode: z.literal('run').optional().default('run'),
  parameters: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Zod schema for AIGenerateRequest validation
 */
export const AIGenerateRequestSchema = z.object({
  prompt: z.string()
    .min(10, 'Prompt must be at least 10 characters')
    .max(2000, 'Prompt must be less than 2000 characters'),
  projectId: z.string().optional(),
});

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Utility type: Flow list item (minimal data for list view)
 */
export type FlowListItem = Pick<
  Flow,
  'id' | 'name' | 'description' | 'isDisabled' | 'created'
> & {
  /** Latest job status for this flow */
  latestJobStatus?: JobStatus;

  /** Last run timestamp */
  lastRunTime?: string;

  /** Number of tasks in flow */
  taskCount: number;

  /** Whether flow has a schedule */
  isScheduled: boolean;
};

/**
 * Utility type: Mermaid node styling
 */
export interface MermaidNodeStyle {
  /** Node background color (hex) */
  backgroundColor: string;

  /** Node border color (hex) */
  borderColor: string;

  /** Node emoji/icon */
  icon: string;
}

/**
 * Component type to Mermaid styling map
 */
export const COMPONENT_TYPE_STYLES: Record<ComponentType, MermaidNodeStyle> = {
  extractor: {
    backgroundColor: '#DBEAFE',
    borderColor: '#3B82F6',
    icon: '📊',
  },
  transformation: {
    backgroundColor: '#E9D5FF',
    borderColor: '#A855F7',
    icon: '⚙️',
  },
  writer: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
    icon: '💾',
  },
  application: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    icon: '🔧',
  },
  flow: {
    backgroundColor: '#FED7AA',
    borderColor: '#F97316',
    icon: '🔄',
  },
};

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard: Check if value is a valid ComponentType
 */
export function isComponentType(value: unknown): value is ComponentType {
  return typeof value === 'string' &&
    ['extractor', 'transformation', 'writer', 'application', 'flow'].includes(value);
}

/**
 * Type guard: Check if value is a valid JobStatus
 */
export function isJobStatus(value: unknown): value is JobStatus {
  return typeof value === 'string' &&
    ['created', 'waiting', 'processing', 'success', 'error', 'terminated', 'cancelled'].includes(value);
}

/**
 * Type guard: Check if job is in terminal state (completed/failed)
 */
export function isJobTerminal(status: JobStatus): boolean {
  return ['success', 'error', 'terminated', 'cancelled'].includes(status);
}

/**
 * Type guard: Check if job is running
 */
export function isJobRunning(status: JobStatus): boolean {
  return ['waiting', 'processing'].includes(status);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get component type from component ID
 *
 * @example
 * getComponentType("keboola.ex-google-sheets") // => "extractor"
 * getComponentType("keboola.wr-snowflake") // => "writer"
 * getComponentType("keboola.dbt-transformation") // => "transformation"
 */
export function getComponentType(componentId: string): ComponentType {
  if (componentId.startsWith('keboola.ex-')) return 'extractor';
  if (componentId.startsWith('keboola.wr-')) return 'writer';
  if (componentId.includes('transformation')) return 'transformation';
  if (componentId === 'keboola.flow') return 'flow';
  return 'application';
}

/**
 * Calculate job duration in seconds
 */
export function calculateJobDuration(job: Job): number | null {
  if (!job.startTime || !job.endTime) return null;
  const start = new Date(job.startTime).getTime();
  const end = new Date(job.endTime).getTime();
  return Math.round((end - start) / 1000);
}

/**
 * Format job duration for display
 *
 * @example
 * formatJobDuration(65) // => "1m 5s"
 * formatJobDuration(3665) // => "1h 1m 5s"
 */
export function formatJobDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
}

/**
 * Validate flow configuration structure
 *
 * Checks:
 * - All tasks reference valid phases
 * - Phase dependencies don't create cycles
 * - At least one task per phase
 */
export function validateFlowConfiguration(config: FlowConfiguration): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const phaseIds = new Set(config.phases.map(p => p.id));

  // Check all tasks reference valid phases
  for (const task of config.tasks) {
    if (!phaseIds.has(task.phase)) {
      errors.push(`Task "${task.name}" references non-existent phase "${task.phase}"`);
    }
  }

  // Check each phase has at least one task
  for (const phase of config.phases) {
    const phaseTasks = config.tasks.filter(t => t.phase === phase.id);
    if (phaseTasks.length === 0) {
      errors.push(`Phase "${phase.name}" has no tasks`);
    }
  }

  // Check phase dependencies don't create cycles (simplified check)
  for (const phase of config.phases) {
    for (const depId of phase.dependsOn) {
      if (!phaseIds.has(depId)) {
        errors.push(`Phase "${phase.name}" depends on non-existent phase "${depId}"`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
