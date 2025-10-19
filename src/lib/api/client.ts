import { getAuth } from "./auth";

// ============================================================================
// Types
// ============================================================================

export interface Job {
  id: string;
  runId: string;
  status: "processing" | "success" | "error" | "cancelled" | "waiting" | "terminating";
  component: string;
  config?: string;
  configData?: {
    name?: string;
  };
  startTime?: string;
  endTime?: string;
  durationSeconds?: number;
  result?: {
    message?: string;
  };
  error?: {
    message?: string;
  };
}

export interface StorageStats {
  tables: {
    count: number;
    bytes: number;
  };
  files: {
    count: number;
    bytes: number;
  };
}

export interface Event {
  id: string;
  created: string;
  message: string;
  type: string;
  component?: string;
  configurationId?: string;
  runId?: string;
  results?: Record<string, unknown>;
}

export interface Orchestration {
  id: string;
  name: string;
  active: boolean;
  crontabRecord?: string;
  lastExecutedJob?: {
    id: string;
    status: string;
    startTime: string;
    endTime?: string;
  };
  nextScheduledTime?: string;
}

export interface ProjectInfo {
  id: string;
  name: string;
  region?: string;
  created?: string;
  features?: string[];
  limits?: Record<string, unknown>;
}

export interface Token {
  id: string;
  description: string;
  created: string;
  admin: boolean;
  canManageTokens?: boolean;
  canReadAllFileUploads?: boolean;
}

// ============================================================================
// API Client
// ============================================================================

class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown
  ) {
    super(message);
    this.name = "APIError";
  }
}

async function apiRequest<T>(endpoint: string): Promise<T> {
  const auth = getAuth();
  if (!auth) {
    throw new APIError("Not authenticated", 401);
  }

  const url = `${auth.stackUrl}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        "X-StorageApi-Token": auth.token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorText);
      } catch {
        errorDetails = errorText;
      }

      throw new APIError(
        `API request failed: ${response.statusText}`,
        response.status,
        errorDetails
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
      0
    );
  }
}

// ============================================================================
// API Functions
// ============================================================================

export async function getProjectInfo(): Promise<ProjectInfo> {
  return apiRequest<ProjectInfo>("/v2/storage");
}

export async function getJobs(limit = 20, offset = 0): Promise<Job[]> {
  return apiRequest<Job[]>(`/v2/storage/jobs?limit=${limit}&offset=${offset}`);
}

export async function getStorageStats(): Promise<StorageStats> {
  return apiRequest<StorageStats>("/v2/storage/stats");
}

export async function getEvents(limit = 10): Promise<Event[]> {
  return apiRequest<Event[]>(`/v2/storage/events?limit=${limit}`);
}

export async function getOrchestrations(): Promise<Orchestration[]> {
  return apiRequest<Orchestration[]>("/v2/orchestrations");
}

export async function getTokens(): Promise<Token[]> {
  return apiRequest<Token[]>("/v2/storage/tokens");
}

// ============================================================================
// Helper Functions
// ============================================================================

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export function getJobStatusColor(status: Job["status"]): string {
  switch (status) {
    case "success":
      return "bg-green-100 text-green-800";
    case "error":
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "processing":
    case "waiting":
      return "bg-yellow-100 text-yellow-800";
    case "terminating":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

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
