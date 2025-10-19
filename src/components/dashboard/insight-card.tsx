import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AIBadge } from "@/components/ui/ai-badge";
import { SparkleIcon } from "@/components/ui/sparkle-icon";
import {
  LucideIcon,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Database,
  Package,
  Repeat,
  Users,
  User,
  Rocket,
  Moon,
  Lightbulb
} from "lucide-react";

interface InsightCardProps {
  type: "jobs" | "storage" | "flows" | "team";
  data: {
    jobs?: {
      running: number;
      failed: number;
      success: number;
    };
    storage?: {
      tables: { count: number; bytes: number };
    };
    flows?: {
      total: number;
      active: number;
    };
    team?: {
      total: number;
      admins: number;
    };
  };
  isLoading?: boolean;
  isError?: boolean;
}

// Helper to format bytes
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
};

// Generate AI insights based on data
const generateInsight = (type: string, data: InsightCardProps["data"]) => {
  switch (type) {
    case "jobs": {
      const { running = 0, failed = 0, success = 0 } = data.jobs || {};
      const total = running + failed + success;

      if (total === 0) {
        return {
          icon: Moon,
          iconColor: "text-gray-500",
          title: "No recent activity",
          subtitle: "Your project is quiet at the moment",
          tip: "Try running a flow to get started",
          trend: null,
        };
      }

      if (failed === 0 && success > 0) {
        return {
          icon: CheckCircle2,
          iconColor: "text-success-700",
          title: `Perfect! All ${success} jobs succeeded`,
          subtitle: running > 0 ? `${running} currently running` : "Everything is running smoothly",
          tip: "Keep up the great work!",
          trend: "positive",
        };
      }

      if (failed > 0) {
        const failRate = Math.round((failed / total) * 100);
        return {
          icon: AlertTriangle,
          iconColor: "text-error-700",
          title: `${failed} job${failed > 1 ? "s" : ""} failed`,
          subtitle: `${failRate}% failure rate - needs attention`,
          tip: "Check job logs for error details",
          trend: "negative",
        };
      }

      return {
        icon: Zap,
        iconColor: "text-primary-600",
        title: `${running} jobs running`,
        subtitle: `${success} succeeded, ${failed} failed`,
        tip: "Monitor active jobs for completion",
        trend: "neutral",
      };
    }

    case "storage": {
      const { tables } = data.storage || { tables: { count: 0, bytes: 0 } };
      const size = formatBytes(tables.bytes);
      const avgSize = tables.count > 0 ? formatBytes(tables.bytes / tables.count) : "0 B";

      if (tables.count === 0) {
        return {
          icon: Package,
          iconColor: "text-gray-500",
          title: "No data yet",
          subtitle: "Start by loading data into your project",
          tip: "Create your first bucket and table",
          trend: null,
        };
      }

      // Simulated growth insight (in real app, compare with previous period)
      const isGrowing = tables.bytes > 1000000; // > 1MB

      return {
        icon: Database,
        iconColor: "text-primary-600",
        title: `${size} across ${tables.count} table${tables.count > 1 ? "s" : ""}`,
        subtitle: isGrowing
          ? `Average ${avgSize} per table • Growing steadily`
          : `Avg ${avgSize} per table`,
        tip: tables.bytes > 10000000
          ? "Consider archiving old data to save costs"
          : "Storage usage is healthy",
        trend: isGrowing ? "positive" : "neutral",
      };
    }

    case "flows": {
      const { total = 0, active = 0 } = data.flows || {};
      const inactive = total - active;

      if (total === 0) {
        return {
          icon: Rocket,
          iconColor: "text-purple-600",
          title: "No flows configured",
          subtitle: "Flows automate your data pipelines",
          tip: "Create your first flow to get started",
          trend: null,
        };
      }

      if (active === total) {
        return {
          icon: Zap,
          iconColor: "text-success-700",
          title: `${active} flow${active > 1 ? "s" : ""} running smoothly`,
          subtitle: "All flows are active and ready",
          tip: "Check schedules for next runs",
          trend: "positive",
        };
      }

      if (active === 0) {
        return {
          icon: Moon,
          iconColor: "text-gray-500",
          title: `${total} flow${total > 1 ? "s" : ""} inactive`,
          subtitle: "No active flows at the moment",
          tip: "Activate flows to start automation",
          trend: "neutral",
        };
      }

      return {
        icon: Repeat,
        iconColor: "text-primary-600",
        title: `${active}/${total} flows active`,
        subtitle: `${inactive} inactive flow${inactive > 1 ? "s" : ""}`,
        tip: "Review inactive flows for optimization",
        trend: "neutral",
      };
    }

    case "team": {
      const { total = 0, admins = 0 } = data.team || {};
      const members = total - admins;

      if (total === 0) {
        return {
          icon: User,
          iconColor: "text-gray-500",
          title: "Just you",
          subtitle: "Invite teammates to collaborate",
          tip: "Add team members to scale your work",
          trend: null,
        };
      }

      // Simulated inactive users (in real app, check last login dates)
      const hasInactiveUsers = total > 10;

      return {
        icon: Users,
        iconColor: "text-purple-600",
        title: `${total} member${total > 1 ? "s" : ""}, ${admins} admin${admins > 1 ? "s" : ""}`,
        subtitle: members > 0
          ? `${members} regular member${members > 1 ? "s" : ""}`
          : "All admins",
        tip: hasInactiveUsers
          ? "Check for inactive users to optimize licenses"
          : "Team size is healthy",
        trend: hasInactiveUsers ? "neutral" : "positive",
      };
    }

    default:
      return {
        icon: Database,
        iconColor: "text-gray-500",
        title: "No data",
        subtitle: "Loading...",
        tip: null,
        trend: null,
      };
  }
};

export function InsightCard({ type, data, isLoading, isError }: InsightCardProps) {
  if (isLoading) {
    return (
      <Card className="relative overflow-hidden hover-lift">
        <div className="absolute inset-0 shimmer" />
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-400">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-red-600">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-800">Error loading data</p>
              <p className="text-xs text-red-600 mt-1">Please try again later</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const insight = generateInsight(type, data);

  // Trend color styles
  const trendStyles: Record<string, string> = {
    positive: "bg-success-50 border-success-500",
    negative: "bg-error-50 border-error-500",
    neutral: "bg-primary-50 border-primary-200",
  };

  const borderColor = insight.trend && insight.trend in trendStyles
    ? trendStyles[insight.trend]
    : "bg-white border-gray-200";

  return (
    <Card className={`relative overflow-hidden hover-lift ${borderColor}`}>
      {/* Gradient accent with glow */}
      {insight.trend === "positive" && (
        <>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-success-500 to-success-700" />
          <div className="absolute -top-2 -left-2 w-24 h-24 bg-success-500/10 rounded-full blur-2xl" />
        </>
      )}
      {insight.trend === "negative" && (
        <>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-error-500 to-error-700" />
          <div className="absolute -top-2 -right-2 w-24 h-24 bg-error-500/10 rounded-full blur-2xl" />
        </>
      )}
      {insight.trend === "neutral" && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-ai" />
      )}

      <CardHeader className="pb-3 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </CardTitle>
            {insight.trend === "positive" && (
              <SparkleIcon size="sm" className="opacity-60" />
            )}
          </div>
          <insight.icon className={`h-7 w-7 float ${insight.iconColor}`} />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Main insight */}
        <div>
          <p className="font-semibold text-gray-900 leading-tight">
            {insight.title}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {insight.subtitle}
          </p>
        </div>

        {/* Contextual tip */}
        {insight.tip && (
          <div className="pt-2 border-t border-neutral-200">
            <p className="text-xs text-neutral-500 flex items-start">
              <Lightbulb className="h-4 w-4 mr-1.5 text-warning-500 flex-shrink-0" />
              <span>{insight.tip}</span>
            </p>
          </div>
        )}

        {/* Detailed metrics (optional, based on type) */}
        {type === "jobs" && data.jobs && (
          <div className="flex gap-2 pt-2 flex-wrap">
            {data.jobs.running > 0 && (
              <Badge variant="secondary" className="bg-warning-50 text-warning-700 text-xs hover-lift">
                {data.jobs.running} running
              </Badge>
            )}
            {data.jobs.failed > 0 && (
              <Badge variant="secondary" className="bg-error-50 text-error-700 text-xs hover-lift">
                {data.jobs.failed} failed
              </Badge>
            )}
            {data.jobs.success > 0 && (
              <Badge variant="secondary" className="bg-success-50 text-success-700 text-xs hover-lift glow-success">
                {data.jobs.success} success
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
