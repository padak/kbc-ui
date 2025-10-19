"use client";

import { useEvents } from "@/lib/api/queries";
import { getRelativeTime } from "@/lib/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  CheckCircle2,
  XCircle,
  Plus,
  Loader2,
  AlertCircle,
  Settings,
  Trash2,
  Database,
  PlayCircle,
  Wrench,
  Package,
  Users,
  FileText,
  Clock,
} from "lucide-react";
import type { Event } from "@/lib/api/client";

// ============================================================================
// Event Type Definitions - Better categorization for storytelling
// ============================================================================

type EventCategory =
  | "job_success"
  | "job_failure"
  | "job_running"
  | "config_created"
  | "config_updated"
  | "config_deleted"
  | "storage_operation"
  | "token_operation"
  | "other";

interface EventStory {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  bgColor: string;
  title: string;
  description?: string;
  badgeVariant: "default" | "secondary" | "destructive" | "outline";
  badgeLabel: string;
}

// ============================================================================
// Event Categorization
// ============================================================================

function categorizeEvent(event: Event): EventCategory {
  const type = (event.type || "").toLowerCase();
  const message = (event.message || "").toLowerCase();
  const component = (event.component || "").toLowerCase();

  // Job events (check both type and message for flexibility)
  if (
    type.includes("jobterminated") ||
    type.includes("jobprocessingsuccess") ||
    type.includes("jobsuccess") ||
    message.includes("job completed") ||
    message.includes("job succeeded")
  ) {
    return "job_success";
  }
  if (
    type.includes("jobfailed") ||
    type.includes("joberror") ||
    message.includes("job failed") ||
    message.includes("job error")
  ) {
    return "job_failure";
  }
  if (
    type.includes("jobcreated") ||
    type.includes("jobprocessing") ||
    type.includes("jobqueued") ||
    message.includes("job started") ||
    message.includes("job running")
  ) {
    return "job_running";
  }

  // Configuration events
  if (type.includes("configurationcreated") || message.includes("configuration created")) {
    return "config_created";
  }
  if (
    type.includes("configurationupdated") ||
    type.includes("configurationedited") ||
    message.includes("configuration updated") ||
    message.includes("configuration changed")
  ) {
    return "config_updated";
  }
  if (type.includes("configurationdeleted") || message.includes("configuration deleted")) {
    return "config_deleted";
  }

  // Storage operations - catch generic storage events
  if (
    type.includes("storage") ||
    component.toLowerCase().includes("storage") ||
    type.includes("table") ||
    type.includes("bucket") ||
    message.includes("table") ||
    message.includes("bucket") ||
    message.includes("list") // Catch "Listed tables", "Listed buckets", etc.
  ) {
    return "storage_operation";
  }

  // Token operations
  if (type.includes("token") || message.includes("token")) {
    return "token_operation";
  }

  return "other";
}

// ============================================================================
// Event Storytelling - Transform raw events into human-readable stories
// ============================================================================

function createEventStory(event: Event): EventStory {
  const category = categorizeEvent(event);
  const component = event.component || "system";
  const configId = event.configurationId;

  // Extract meaningful info from results if available
  const results = event.results || {};
  const rowsProcessed = results.rows ? `${Number(results.rows).toLocaleString()} rows` : "";
  const tablesAffected = results.tables ? `${results.tables} tables` : "";

  // Clean up component name for display
  const componentName = component
    .replace(/^keboola\./, "") // Remove keboola. prefix
    .replace(/\./g, " ") // Replace dots with spaces
    .replace(/-/g, " ") // Replace dashes with spaces
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  switch (category) {
    case "job_success":
      return {
        icon: CheckCircle2,
        iconColor: "text-success-700",
        bgColor: "bg-success-50 dark:bg-success-700/30",
        title: `${componentName} completed successfully`,
        description: rowsProcessed ? `Processed ${rowsProcessed}` : configId || undefined,
        badgeVariant: "default",
        badgeLabel: "Success",
      };

    case "job_failure":
      return {
        icon: XCircle,
        iconColor: "text-error-700",
        bgColor: "bg-error-50 dark:bg-error-700/30",
        title: `${componentName} failed`,
        description: configId ? `Config: ${configId}` : "Check logs for details",
        badgeVariant: "destructive",
        badgeLabel: "Failed",
      };

    case "job_running":
      return {
        icon: PlayCircle,
        iconColor: "text-primary-600",
        bgColor: "bg-primary-50 dark:bg-primary-600/30",
        title: `${componentName} is running`,
        description: configId || "Job in progress",
        badgeVariant: "default",
        badgeLabel: "Running",
      };

    case "config_created":
      return {
        icon: Plus,
        iconColor: "text-success-700",
        bgColor: "bg-success-50 dark:bg-success-700/30",
        title: `New ${componentName} configuration created`,
        description: configId || "Configuration ready to use",
        badgeVariant: "secondary",
        badgeLabel: "Created",
      };

    case "config_updated":
      return {
        icon: Settings,
        iconColor: "text-warning-500",
        bgColor: "bg-warning-50 dark:bg-warning-500/30",
        title: `${componentName} configuration updated`,
        description: configId || "Settings changed",
        badgeVariant: "secondary",
        badgeLabel: "Updated",
      };

    case "config_deleted":
      return {
        icon: Trash2,
        iconColor: "text-neutral-600",
        bgColor: "bg-neutral-50 dark:bg-neutral-600/30",
        title: `${componentName} configuration deleted`,
        description: configId || "Configuration removed",
        badgeVariant: "outline",
        badgeLabel: "Deleted",
      };

    case "storage_operation": {
      // Make generic storage events more descriptive
      const isGenericList = event.message.toLowerCase().startsWith("listed");
      const storageTitle = isGenericList
        ? `Storage: ${event.message}` // e.g., "Storage: Listed tables"
        : `${componentName}: ${event.message}`;

      return {
        icon: Database,
        iconColor: "text-primary-600",
        bgColor: "bg-primary-50 dark:bg-primary-600/30",
        title: storageTitle,
        description: tablesAffected || (configId ? `Config: ${configId}` : isGenericList ? "Browsing data catalog" : event.type || undefined),
        badgeVariant: "secondary",
        badgeLabel: "Storage",
      };
    }

    case "token_operation":
      return {
        icon: Users,
        iconColor: "text-info-500",
        bgColor: "bg-info-50 dark:bg-info-500/30",
        title: `${componentName}: ${event.message}`,
        description: configId ? `Config: ${configId}` : "Access management",
        badgeVariant: "secondary",
        badgeLabel: "Security",
      };

    default:
      // For generic events, try to make them more descriptive
      const eventMessage = event.message || "Activity";
      const title =
        componentName === "System"
          ? eventMessage
          : `${componentName}: ${eventMessage}`;

      return {
        icon: Activity,
        iconColor: "text-neutral-600",
        bgColor: "bg-neutral-50 dark:bg-neutral-600/30",
        title,
        description: configId ? `Config: ${configId}` : event.type || undefined,
        badgeVariant: "secondary",
        badgeLabel: "Activity",
      };
  }
}

export function RecentActivity() {
  const { data: events, isLoading, error } = useEvents(10);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
            <span className="ml-3 text-base text-muted-foreground">
              Loading activity...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12 text-destructive">
            <AlertCircle className="h-6 w-6 mr-3" />
            <span className="text-base">
              Failed to load activity. Please try again.
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!events || events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Activity className="h-8 w-8 mb-3 opacity-50" />
            <span className="text-base font-medium">No recent activity</span>
            <span className="text-sm mt-1">Events will appear here as they occur</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline border - thicker and more prominent */}
          <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-border via-border to-transparent" />

          {/* Events list */}
          <div className="space-y-2">
            {events.map((event, index) => {
              const story = createEventStory(event);
              const Icon = story.icon;

              return (
                <div
                  key={event.id || `event-${index}`}
                  className="relative flex gap-4 group hover:bg-accent/50 -mx-3 px-3 py-3 rounded-lg transition-all duration-200 hover:shadow-sm cursor-pointer"
                >
                  {/* Icon with colored background */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className={`rounded-full p-2 border-2 border-background shadow-sm ${story.bgColor}`}>
                      <Icon className={`h-5 w-5 ${story.iconColor}`} />
                    </div>
                  </div>

                  {/* Content - improved hierarchy and readability */}
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Title and timestamp row */}
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-base font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
                        {story.title}
                      </h4>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                          {getRelativeTime(event.created)}
                        </span>
                      </div>
                    </div>

                    {/* Description text */}
                    {story.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {story.description}
                      </p>
                    )}

                    {/* Badges and metadata */}
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      <Badge variant={story.badgeVariant} className="text-xs font-semibold px-2.5 py-0.5">
                        {story.badgeLabel}
                      </Badge>
                      {event.runId && (
                        <span className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-0.5 rounded">
                          Run #{event.runId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Show more indicator */}
        {events.length >= 10 && (
          <div className="mt-6 pt-4 border-t text-center">
            <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center gap-2">
              View all activity
              <Activity className="h-4 w-4" />
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
