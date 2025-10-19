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
} from "lucide-react";

function getEventIcon(eventType: string) {
  if (eventType.includes("storage.jobTerminated") || eventType.includes("job.")) {
    return CheckCircle2;
  }
  if (eventType.includes("storage.jobFailed") || eventType.includes("error")) {
    return XCircle;
  }
  if (eventType.includes("storage.configurationCreated")) {
    return Plus;
  }
  return Activity;
}

function getEventIconColor(eventType: string): string {
  if (eventType.includes("storage.jobTerminated") || eventType.includes("job.")) {
    return "text-green-600";
  }
  if (eventType.includes("storage.jobFailed") || eventType.includes("error")) {
    return "text-red-600";
  }
  if (eventType.includes("storage.configurationCreated")) {
    return "text-blue-600";
  }
  return "text-gray-600";
}

function getEventBadgeVariant(eventType: string): "default" | "secondary" | "destructive" | "outline" {
  if (eventType.includes("storage.jobFailed") || eventType.includes("error")) {
    return "destructive";
  }
  if (eventType.includes("storage.jobTerminated") || eventType.includes("job.")) {
    return "default";
  }
  return "secondary";
}

export function RecentActivity() {
  const { data: events, isLoading, error } = useEvents(10);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
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
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-destructive">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span className="text-sm">
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
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Activity className="h-5 w-5 mr-2" />
            <span className="text-sm">No recent activity</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline border */}
          <div className="absolute left-[15px] top-0 bottom-0 w-px bg-border" />

          {/* Events list */}
          <div className="space-y-4">
            {events.map((event, index) => {
              const Icon = getEventIcon(event.type);
              const iconColor = getEventIconColor(event.type);
              const badgeVariant = getEventBadgeVariant(event.type);

              return (
                <div
                  key={event.id || `event-${index}`}
                  className="relative flex gap-4 group hover:bg-accent/50 -mx-2 px-2 py-2 rounded-md transition-colors"
                >
                  {/* Icon */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="rounded-full bg-background p-1 border">
                      <Icon className={`h-4 w-4 ${iconColor}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <p className="text-sm font-medium leading-tight">
                        {event.message}
                      </p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {getRelativeTime(event.created)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={badgeVariant} className="text-xs">
                        {event.type}
                      </Badge>
                      {event.component && (
                        <span className="text-xs text-muted-foreground">
                          {event.component}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
