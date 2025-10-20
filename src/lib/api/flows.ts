import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuth } from "./auth";

// ============================================================================
// Types
// ============================================================================

export interface Phase {
  id: string;
  name: string;
  dependsOn: string[];
}

export interface Task {
  id: string;
  name: string;
  componentId: string;
  phase: string;
  task: {
    mode: "run";
    configData: Record<string, unknown>;
  };
}

export interface FlowConfiguration {
  phases: Phase[];
  tasks: Task[];
}

export interface Flow {
  id: string;
  name: string;
  description: string;
  configuration: FlowConfiguration;
  isDisabled: boolean;
  created: string;
  version: number;
}

export interface Component {
  id: string;
  name: string;
  type: "extractor" | "writer" | "transformation" | "application";
  icon?: {
    "32": string;
    "64": string;
  };
}

export interface CreateFlowInput {
  name: string;
  description: string;
  configuration: FlowConfiguration;
}

export interface RunFlowInput {
  component: "keboola.flow";
  config: string; // Flow ID
  mode: "run";
}

export interface JobResponse {
  id: string;
  status: "created";
  component: string;
  config: string;
  created: string;
}

export interface GenerateFlowInput {
  prompt: string;
  projectId: string;
}

export interface GenerateFlowResponse {
  success: boolean;
  flow: {
    name: string;
    description: string;
    configuration: FlowConfiguration;
  };
  mermaid: string;
  components: Component[]; // Include components with icons for UI display
  warnings?: string[];
}

/**
 * Flow status for UI visualization
 */
export type FlowStatus = 'active' | 'disabled' | 'never_run';

// ============================================================================
// API Error Class
// ============================================================================

class FlowAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown
  ) {
    super(message);
    this.name = "FlowAPIError";
  }
}

// ============================================================================
// API Request Helpers
// ============================================================================

async function apiRequest<T>(
  endpoint: string,
  options?: {
    method?: string;
    body?: unknown;
  }
): Promise<T> {
  const auth = getAuth();
  if (!auth) {
    // Redirect to login if not authenticated
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new FlowAPIError("Not authenticated", 401);
  }

  const url = `${auth.stackUrl}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: options?.method || "GET",
      headers: {
        "X-StorageApi-Token": auth.token,
        "Content-Type": "application/json",
      },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = errorText;
      }

      // Handle 401 by redirecting to login
      if (response.status === 401 && typeof window !== "undefined") {
        window.location.href = "/login";
      }

      throw new FlowAPIError(
        `API request failed: ${response.statusText}`,
        response.status,
        errorDetails
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof FlowAPIError) {
      throw error;
    }
    throw new FlowAPIError(
      `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
      0
    );
  }
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Fetch all flows
 */
export async function getFlows(): Promise<Flow[]> {
  return apiRequest<Flow[]>("/v2/storage/components/keboola.flow/configs");
}

/**
 * Fetch a single flow by ID
 */
export async function getFlow(id: string): Promise<Flow> {
  return apiRequest<Flow>(`/v2/storage/components/keboola.flow/configs/${id}`);
}

/**
 * Create a new flow
 */
export async function createFlow(input: CreateFlowInput): Promise<Flow> {
  return apiRequest<Flow>("/v2/storage/components/keboola.flow/configs", {
    method: "POST",
    body: input,
  });
}

/**
 * Delete a flow by ID
 */
export async function deleteFlow(id: string): Promise<{ success: boolean }> {
  await apiRequest<void>(`/v2/storage/components/keboola.flow/configs/${id}`, {
    method: "DELETE",
  });
  return { success: true };
}

/**
 * Run a flow (creates a job)
 */
export async function runFlow(flowId: string): Promise<JobResponse> {
  const input: RunFlowInput = {
    component: "keboola.flow",
    config: flowId,
    mode: "run",
  };
  return apiRequest<JobResponse>("/v2/storage/jobs", {
    method: "POST",
    body: input,
  });
}

/**
 * Fetch all available components
 */
export async function getComponents(): Promise<Component[]> {
  return apiRequest<Component[]>("/v2/storage/components");
}

/**
 * Generate a flow using AI (calls Next.js API route)
 */
export async function generateFlow(
  input: GenerateFlowInput
): Promise<GenerateFlowResponse> {
  const auth = getAuth();
  if (!auth) {
    throw new FlowAPIError("Not authenticated", 401);
  }

  // This calls the Next.js API route, not the Keboola API
  // Use relative path so it calls localhost:3000 (Next.js app), not the Keboola stack URL
  const response = await fetch('/api/flows/generate', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Pass auth info via custom headers so the API route can make Keboola API calls
      "X-StorageApi-Token": auth.token,
      "X-Stack-Url": auth.stackUrl,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new FlowAPIError(
      `AI generation failed: ${response.statusText}`,
      response.status,
      errorText
    );
  }

  return await response.json();
}

// ============================================================================
// Query Keys
// ============================================================================

export const flowQueryKeys = {
  all: ["flows"] as const,
  lists: () => [...flowQueryKeys.all, "list"] as const,
  list: () => [...flowQueryKeys.lists()] as const,
  details: () => [...flowQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...flowQueryKeys.details(), id] as const,
  components: ["components"] as const,
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Get all flows with 30s polling
 * Used by: FlowList component
 */
export function useFlows() {
  return useQuery({
    queryKey: flowQueryKeys.list(),
    queryFn: getFlows,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 30, // Poll every 30 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}

/**
 * Get a single flow by ID (no polling)
 * Used by: FlowDetailPage component
 */
export function useFlow(id: string) {
  return useQuery({
    queryKey: flowQueryKeys.detail(id),
    queryFn: () => getFlow(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id, // Only run if ID is provided
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Get all available components (cached for session)
 * Used by: AI validation (check if components exist)
 */
export function useComponents() {
  return useQuery({
    queryKey: flowQueryKeys.components,
    queryFn: getComponents,
    staleTime: 1000 * 60 * 60, // 1 hour (components rarely change)
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Create a new flow
 * Used by: AIFlowCreator component (Step 3, after save)
 */
export function useCreateFlow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFlow,
    onSuccess: () => {
      // Invalidate and refetch flows list
      queryClient.invalidateQueries({ queryKey: flowQueryKeys.lists() });
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Delete a flow
 * Used by: FlowCard delete action
 */
export function useDeleteFlow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFlow,
    onSuccess: (_, flowId) => {
      // Invalidate flows list
      queryClient.invalidateQueries({ queryKey: flowQueryKeys.lists() });
      // Remove the specific flow from cache
      queryClient.removeQueries({ queryKey: flowQueryKeys.detail(flowId) });
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Run a flow (creates a job)
 * Used by: FlowCard run action, FlowDetailPage run button
 */
export function useRunFlow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: runFlow,
    onSuccess: () => {
      // Invalidate jobs list to show new job
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Generate a flow using AI
 * Used by: AIFlowCreator component (Step 1 → Step 2)
 */
export function useGenerateFlow() {
  return useMutation({
    mutationFn: generateFlow,
    retry: 1, // Only retry once for AI generation
    retryDelay: 2000, // 2 second delay before retry
  });
}

// ============================================================================
// Derived Data Hooks
// ============================================================================

/**
 * Get flow statistics (total, active, inactive)
 */
export function useFlowStats() {
  const { data: flows, ...rest } = useFlows();

  const stats = flows
    ? {
        total: flows.length,
        active: flows.filter((f) => !f.isDisabled).length,
        inactive: flows.filter((f) => f.isDisabled).length,
      }
    : undefined;

  return {
    data: stats,
    flows,
    ...rest,
  };
}

/**
 * Check if a component exists by ID
 */
export function useComponentExists(componentId: string) {
  const { data: components, ...rest } = useComponents();

  const exists = components
    ? components.some((c) => c.id === componentId)
    : undefined;

  return {
    exists,
    component: components?.find((c) => c.id === componentId),
    ...rest,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get flow status color based on disabled state
 */
export function getFlowStatusColor(isDisabled: boolean): string {
  return isDisabled
    ? "bg-gray-100 text-gray-800"
    : "bg-green-100 text-green-800";
}

/**
 * Get flow status label
 */
export function getFlowStatusLabel(isDisabled: boolean): string {
  return isDisabled ? "Disabled" : "Active";
}

/**
 * Get component type color for UI badges
 */
export function getComponentTypeColor(
  type: Component["type"]
): { bg: string; text: string } {
  switch (type) {
    case "extractor":
      return { bg: "bg-blue-100", text: "text-blue-800" };
    case "writer":
      return { bg: "bg-green-100", text: "text-green-800" };
    case "transformation":
      return { bg: "bg-purple-100", text: "text-purple-800" };
    case "application":
      return { bg: "bg-orange-100", text: "text-orange-800" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-800" };
  }
}

/**
 * Format relative time from ISO date string
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/**
 * Validate flow configuration
 */
export function validateFlowConfiguration(
  config: FlowConfiguration
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.phases || config.phases.length === 0) {
    errors.push("Flow must have at least one phase");
  }

  if (!config.tasks || config.tasks.length === 0) {
    errors.push("Flow must have at least one task");
  }

  // Check for circular dependencies in phases
  const phaseIds = new Set(config.phases.map((p) => p.id));
  for (const phase of config.phases) {
    for (const dep of phase.dependsOn) {
      if (!phaseIds.has(dep)) {
        errors.push(`Phase "${phase.name}" depends on non-existent phase "${dep}"`);
      }
    }
  }

  // Check that all tasks reference valid phases
  for (const task of config.tasks) {
    if (!phaseIds.has(task.phase)) {
      errors.push(`Task "${task.name}" references non-existent phase "${task.phase}"`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
