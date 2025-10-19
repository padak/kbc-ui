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
        iconColor: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-950/30",
        title: `${componentName} completed successfully`,
        badgeVariant: "default",
        badgeLabel: "Success",
      };

    case "job_failure":
      return {
        icon: XCircle,
        iconColor: "text-red-600",
        bgColor: "bg-red-50 dark:bg-red-950/30",
        title: `${componentName} failed`,
        badgeVariant: "destructive",
        badgeLabel: "Failed",
      };

    case "job_running":
      return {
        icon: PlayCircle,
        iconColor: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-950/30",
        title: `${componentName} is running`,
        badgeVariant: "default",
        badgeLabel: "Running",
      };

    case "config_created":
      return {
        icon: Plus,
        iconColor: "text-emerald-600",
        bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        title: `New ${componentName} configuration created`,
        badgeVariant: "secondary",
        badgeLabel: "Created",
      };

    case "config_updated":
      return {
        icon: Settings,
        iconColor: "text-amber-600",
        bgColor: "bg-amber-50 dark:bg-amber-950/30",
        title: `${componentName} configuration updated`,
        badgeVariant: "secondary",
        badgeLabel: "Updated",
      };

    case "config_deleted":
      return {
        icon: Trash2,
        iconColor: "text-gray-600",
        bgColor: "bg-gray-50 dark:bg-gray-950/30",
        title: `${componentName} configuration deleted`,
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
        iconColor: "text-purple-600",
        bgColor: "bg-purple-50 dark:bg-purple-950/30",
        title: storageTitle,
        badgeVariant: "secondary",
        badgeLabel: "Storage",
      };
    }

    default:
      // For generic events, try to make them more descriptive
      const eventMessage = event.message || "Activity";
      const title =
        componentName === "System"
          ? eventMessage
          : `${componentName}: ${eventMessage}`;

      return {
        icon: Activity,
        iconColor: "text-gray-600",
        bgColor: "bg-gray-50 dark:bg-gray-950/30",
        title,
        badgeVariant: "secondary",
        badgeLabel: "Activity",
      };
  }
}

export function CompactRecentActivity() {
  const { data: events, isLoading, error } = useEvents(5); // Only fetch 5 events

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">
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
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-destructive">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span className="text-sm">Failed to load activity</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!events || events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Activity className="h-6 w-6 mb-2 opacity-50" />
            <span className="text-sm font-medium">No recent activity</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event, index) => {
            const story = createEventStory(event);
            const Icon = story.icon;

            return (
              <div
                key={event.id || `event-${index}`}
                className="flex items-start gap-3 group hover:bg-accent/50 -mx-3 px-3 py-2 rounded-md transition-all duration-200"
              >
                {/* Icon with colored background - smaller for compact view */}
                <div className="flex-shrink-0">
                  <div className={`rounded-full p-1.5 ${story.bgColor}`}>
                    <Icon className={`h-4 w-4 ${story.iconColor}`} />
                  </div>
                </div>

                {/* Content - single line, compact */}
                <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {story.title}
                    </p>
                    <Badge variant={story.badgeVariant} className="text-xs px-1.5 py-0 flex-shrink-0">
                      {story.badgeLabel}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {getRelativeTime(event.created)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
