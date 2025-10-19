import { useQuery } from "@tanstack/react-query";
import {
  getProjectInfo,
  getJobs,
  getStorageStats,
  getEvents,
  getOrchestrations,
  getTokens,
  type Job,
  type StorageStats,
  type Event,
  type Orchestration,
  type ProjectInfo,
  type Token,
} from "./client";

// ============================================================================
// Query Keys
// ============================================================================

export const queryKeys = {
  projectInfo: ["projectInfo"] as const,
  jobs: ["jobs"] as const,
  storageStats: ["storageStats"] as const,
  events: ["events"] as const,
  orchestrations: ["orchestrations"] as const,
  tokens: ["tokens"] as const,
};

// ============================================================================
// Hooks
// ============================================================================

/**
 * Get project information
 * Refetches every 30 seconds
 */
export function useProjectInfo() {
  return useQuery({
    queryKey: queryKeys.projectInfo,
    queryFn: getProjectInfo,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 30, // Poll every 30 seconds
  });
}

/**
 * Get jobs list with status
 * Refetches every 5 seconds (max frequency for job monitoring)
 */
export function useJobs(limit = 20, offset = 0) {
  return useQuery({
    queryKey: [...queryKeys.jobs, limit, offset],
    queryFn: () => getJobs(limit, offset),
    staleTime: 1000 * 5, // 5 seconds
    refetchInterval: 1000 * 5, // Poll every 5 seconds
  });
}

/**
 * Get storage statistics (tables, files, size)
 * Refetches every 30 seconds
 */
export function useStorageStats() {
  return useQuery({
    queryKey: queryKeys.storageStats,
    queryFn: getStorageStats,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 30, // Poll every 30 seconds
  });
}

/**
 * Get recent events/activity
 * Refetches every 10 seconds
 */
export function useEvents(limit = 10) {
  return useQuery({
    queryKey: [...queryKeys.events, limit],
    queryFn: () => getEvents(limit),
    staleTime: 1000 * 10, // 10 seconds
    refetchInterval: 1000 * 10, // Poll every 10 seconds
  });
}

/**
 * Get orchestrations (flows)
 * Refetches every 30 seconds
 */
export function useOrchestrations() {
  return useQuery({
    queryKey: queryKeys.orchestrations,
    queryFn: getOrchestrations,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 30, // Poll every 30 seconds
  });
}

/**
 * Get project tokens/users
 * Refetches every 60 seconds (less frequent, rarely changes)
 */
export function useTokens() {
  return useQuery({
    queryKey: queryKeys.tokens,
    queryFn: getTokens,
    staleTime: 1000 * 60, // 60 seconds
    refetchInterval: 1000 * 60, // Poll every 60 seconds
  });
}

// ============================================================================
// Derived Data Hooks
// ============================================================================

/**
 * Get job statistics (running, failed, success counts)
 * Uses the jobs query and calculates stats
 */
export function useJobStats() {
  const { data: jobs, ...rest } = useJobs(100); // Get more jobs for accurate stats

  const stats = jobs
    ? {
        running: jobs.filter(
          (j) => j.status === "processing" || j.status === "waiting"
        ).length,
        failed: jobs.filter(
          (j) => j.status === "error" || j.status === "cancelled"
        ).length,
        success: jobs.filter((j) => j.status === "success").length,
        total: jobs.length,
      }
    : undefined;

  return {
    data: stats,
    jobs,
    ...rest,
  };
}

/**
 * Get orchestration statistics (total, active)
 */
export function useOrchestrationStats() {
  const { data: orchestrations, ...rest } = useOrchestrations();

  const stats = orchestrations
    ? {
        total: orchestrations.length,
        active: orchestrations.filter((o) => !o.isDisabled).length,
        inactive: orchestrations.filter((o) => o.isDisabled).length,
      }
    : undefined;

  return {
    data: stats,
    orchestrations,
    ...rest,
  };
}
