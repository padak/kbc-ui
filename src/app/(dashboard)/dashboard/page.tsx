"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AIBadge } from "@/components/ui/ai-badge";
import { SparkleIcon } from "@/components/ui/sparkle-icon";
import { getAuth, clearAuth } from "@/lib/api/auth";
import { useJobStats, useStorageStats, useOrchestrationStats, useTokens, useJobs } from "@/lib/api/queries";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { CompactRecentActivity } from "@/components/dashboard/compact-recent-activity";
import { ActiveJobs } from "@/components/dashboard/active-jobs";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { InsightCard } from "@/components/dashboard/insight-card";
import { FloatingChatButton } from "@/components/ai";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [auth, setAuth] = useState<{ stackUrl: string; token: string } | null>(null);
  const [showAllActivity, setShowAllActivity] = useState(false);

  // API hooks
  const jobStats = useJobStats();
  const storageStats = useStorageStats();
  const orchestrationStats = useOrchestrationStats();
  const tokens = useTokens();
  const { data: jobs } = useJobs(50);

  // Check if there are any active jobs
  const hasActiveJobs = jobs?.some(
    (job) =>
      job.status === "processing" ||
      job.status === "waiting" ||
      job.status === "terminating"
  ) ?? false;

  useEffect(() => {
    const credentials = getAuth();
    if (!credentials) {
      router.push("/login");
    } else {
      setAuth(credentials);
    }
  }, [router]);

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-primary-500">
                    Keboola Connection
                  </h1>
                  <AIBadge variant="subtle" className="text-xs">
                    AI-Powered
                  </AIBadge>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Connected to: {auth.stackUrl.replace("https://", "")}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="hover-lift border-gray-300 hover:border-gray-400"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* AI-Powered Insights - 30% of space, more prominent */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <SparkleIcon size="md" />
            <h2 className="text-2xl font-bold text-gray-900">AI-Powered Insights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Jobs Card */}
            <InsightCard
              type="jobs"
              data={{
                jobs: {
                  running: jobStats.data?.running ?? 0,
                  failed: jobStats.data?.failed ?? 0,
                  success: jobStats.data?.success ?? 0,
                },
              }}
              isLoading={jobStats.isLoading}
              isError={jobStats.isError}
            />

            {/* Storage Card */}
            <InsightCard
              type="storage"
              data={{
                storage: {
                  tables: {
                    count: storageStats.data?.tables?.count ?? 0,
                    bytes: storageStats.data?.tables?.bytes ?? 0,
                  },
                },
              }}
              isLoading={storageStats.isLoading}
              isError={storageStats.isError}
            />

            {/* Flows Card */}
            <InsightCard
              type="flows"
              data={{
                flows: {
                  total: orchestrationStats.data?.total ?? 0,
                  active: orchestrationStats.data?.active ?? 0,
                },
              }}
              isLoading={orchestrationStats.isLoading}
              isError={orchestrationStats.isError}
            />

            {/* Team Card */}
            <InsightCard
              type="team"
              data={{
                team: {
                  total: tokens.data?.length ?? 0,
                  admins: tokens.data?.filter(t => t.admin).length ?? 0,
                },
              }}
              isLoading={tokens.isLoading}
              isError={tokens.isError}
            />
          </div>
        </section>

        {/* Quick Actions - 20% of space */}
        <section>
          <QuickActions />
        </section>

        {/* Bottom Section - 50% of space */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Jobs - Left column (only show if there are active jobs) */}
          {hasActiveJobs && (
            <div className="lg:col-span-1">
              <ActiveJobs />
            </div>
          )}

          {/* Recent Activity - Right column (or full width if no active jobs) */}
          <div className={hasActiveJobs ? "lg:col-span-1" : "lg:col-span-2"}>
            <div className="relative">
              {/* Collapsible header */}
              <button
                onClick={() => setShowAllActivity(!showAllActivity)}
                className="absolute top-0 right-0 z-10 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg hover:bg-white/50"
                aria-label={showAllActivity ? "Collapse activity" : "Expand activity"}
              >
                {showAllActivity ? (
                  <>
                    Show less
                    <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Show more
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* Compact view when collapsed */}
              {!showAllActivity ? (
                <CompactRecentActivity />
              ) : (
                <RecentActivity />
              )}
            </div>
          </div>
        </section>
      </main>

      {/* AI Chat Interface */}
      <FloatingChatButton />
    </div>
  );
}

