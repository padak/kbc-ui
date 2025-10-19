"use client";

import { useState } from "react";
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
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { Event } from "@/lib/api/client";

// ============================================================================
// Event Type Definitions
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
  title: string;
  description?: string;
  badgeVariant: "default" | "secondary" | "destructive" | "outline";
}

// ============================================================================
// Event Categorization
// ============================================================================

function categorizeEvent(event: Event): EventCategory {
  const type = (event.type || "").toLowerCase();
  const message = (event.message || "").toLowerCase();
  const component = (event.component || "").toLowerCase();

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

  if (
    type.includes("storage") ||
    component.toLowerCase().includes("storage") ||
    type.includes("table") ||
    type.includes("bucket") ||
    message.includes("table") ||
    message.includes("bucket") ||
    message.includes("list")
  ) {
    return "storage_operation";
  }

  if (type.includes("token") || message.includes("token")) {
    return "token_operation";
  }

  return "other";
}

// ============================================================================
// Event Storytelling - Compact version
// ============================================================================

function createEventStory(event: Event): EventStory {
  const category = categorizeEvent(event);
  const component = event.component || "system";
  const configId = event.configurationId;

  const componentName = component
    .replace(/^keboola\./, "")
    .replace(/\./g, " ")
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  switch (category) {
    case "job_success":
      return {
        icon: CheckCircle2,
        iconColor: "text-green-600",
        title: `${componentName} completed`,
        description: configId,
        badgeVariant: "default",
      };

    case "job_failure":
      return {
        icon: XCircle,
        iconColor: "text-red-600",
        title: `${componentName} failed`,
        description: configId || "Check logs",
        badgeVariant: "destructive",
      };

    case "job_running":
      return {
        icon: PlayCircle,
        iconColor: "text-blue-600",
        title: `${componentName} running`,
        description: configId,
        badgeVariant: "default",
      };

    case "config_created":
      return {
        icon: Plus,
        iconColor: "text-emerald-600",
        title: `${componentName} created`,
        description: configId,
        badgeVariant: "secondary",
      };

    case "config_updated":
      return {
        icon: Settings,
        iconColor: "text-amber-600",
        title: `${componentName} updated`,
        description: configId,
        badgeVariant: "secondary",
      };

    case "config_deleted":
      return {
        icon: Trash2,
        iconColor: "text-gray-600",
        title: `${componentName} deleted`,
        description: configId,
        badgeVariant: "outline",
      };

    case "storage_operation": {
      const isGenericList = event.message.toLowerCase().startsWith("listed");
      const storageTitle = isGenericList
        ? `Storage: ${event.message}`
        : `${componentName}: ${event.message}`;

      return {
        icon: Database,
        iconColor: "text-purple-600",
        title: storageTitle,
        description: configId || (isGenericList ? undefined : event.type),
        badgeVariant: "secondary",
      };
    }

    case "token_operation":
      return {
        icon: Users,
        iconColor: "text-indigo-600",
        title: `${componentName}: ${event.message}`,
        description: configId,
        badgeVariant: "secondary",
      };

    default:
      const eventMessage = event.message || "Activity";
      const title =
        componentName === "System"
          ? eventMessage
          : `${componentName}: ${eventMessage}`;

      return {
        icon: Activity,
        iconColor: "text-gray-600",
        title,
        description: configId || event.type,
        badgeVariant: "secondary",
      };
  }
}

// ============================================================================
// Group consecutive similar events
// ============================================================================

interface GroupedEvent {
  event: Event;
  story: EventStory;
  count: number;
  events: Event[];
}

function groupEvents(events: Event[]): GroupedEvent[] {
  if (!events || events.length === 0) return [];

  const grouped: GroupedEvent[] = [];
  let currentGroup: GroupedEvent | null = null;

  for (const event of events) {
    const story = createEventStory(event);

    // Check if this event can be grouped with the current group
    if (
      currentGroup &&
      currentGroup.story.title === story.title &&
      currentGroup.story.iconColor === story.iconColor
    ) {
      // Add to current group
      currentGroup.count++;
      currentGroup.events.push(event);
    } else {
      // Start new group
      currentGroup = {
        event,
        story,
        count: 1,
        events: [event],
      };
      grouped.push(currentGroup);
    }
  }

  return grouped;
}

// ============================================================================
// Compact Event Item Component
// ============================================================================

interface CompactEventItemProps {
  group: GroupedEvent;
  expanded: boolean;
  onToggle: () => void;
}

function CompactEventItem({ group, expanded, onToggle }: CompactEventItemProps) {
  const Icon = group.story.icon;
  const { event, story, count } = group;

  return (
    <div className="group">
      {/* Main compact row */}
      <div
        onClick={onToggle}
        className="flex items-center gap-2 py-1.5 px-2 -mx-2 rounded hover:bg-accent/50 transition-colors cursor-pointer"
      >
        {/* Icon */}
        <Icon className={`h-4 w-4 flex-shrink-0 ${story.iconColor}`} />

        {/* Title */}
        <span className="text-sm font-medium flex-1 truncate">
          {story.title}
          {count > 1 && (
            <span className="text-muted-foreground ml-1">({count}x)</span>
          )}
        </span>

        {/* Time */}
        <span className="text-xs text-muted-foreground flex-shrink-0">
          {getRelativeTime(event.created)}
        </span>

        {/* Expand indicator */}
        {story.description && (
          <ChevronDown
            className={`h-3 w-3 text-muted-foreground flex-shrink-0 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          />
        )}
      </div>

      {/* Expanded details */}
      {expanded && story.description && (
        <div className="pl-6 pr-2 pb-2 text-xs text-muted-foreground">
          {story.description}
          {event.runId && (
            <span className="ml-2 font-mono">
              Run #{event.runId}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main Compact Component
// ============================================================================

interface RecentActivityCompactProps {
  defaultVisible?: number;
  maxEvents?: number;
}

export function RecentActivityCompact({
  defaultVisible = 5,
  maxEvents = 20,
}: RecentActivityCompactProps) {
  const { data: events, isLoading, error } = useEvents(maxEvents);
  const [showAll, setShowAll] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">
              Loading...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-3">
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
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Activity className="h-6 w-6 mb-2 opacity-50" />
            <span className="text-sm">No recent activity</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const groupedEvents = groupEvents(events);
  const visibleEvents = showAll ? groupedEvents : groupedEvents.slice(0, defaultVisible);
  const hasMore = groupedEvents.length > defaultVisible;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {groupedEvents.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-0">
        {/* Events list */}
        <div className="space-y-0">
          {visibleEvents.map((group, index) => (
            <CompactEventItem
              key={group.event.id || `event-${index}`}
              group={group}
              expanded={expandedIndex === index}
              onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* Show more/less toggle */}
        {hasMore && (
          <div className="pt-3 mt-3 border-t">
            <button
              onClick={() => {
                setShowAll(!showAll);
                setExpandedIndex(null); // Collapse all on toggle
              }}
              className="w-full text-sm text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center justify-center gap-1"
            >
              {showAll ? (
                <>
                  Show less
                  <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Show {groupedEvents.length - defaultVisible} more
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
