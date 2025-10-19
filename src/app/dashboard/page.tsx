"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardSkeleton } from "@/components/ui/skeleton";
import { getAuth, clearAuth } from "@/lib/api/auth";
import { useJobStats, useStorageStats, useOrchestrationStats, useTokens } from "@/lib/api/queries";
import { formatBytes } from "@/lib/api/client";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default function DashboardPage() {
  const router = useRouter();
  const [auth, setAuth] = useState<{ stackUrl: string; token: string } | null>(null);

  // API hooks
  const jobStats = useJobStats();
  const storageStats = useStorageStats();
  const orchestrationStats = useOrchestrationStats();
  const tokens = useTokens();

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-primary-500">Keboola Connection</h1>
              <p className="text-sm text-gray-600 mt-1">
                Connected to: {auth.stackUrl.replace("https://", "")}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Jobs Card */}
            {jobStats.isLoading ? (
              <CardSkeleton />
            ) : jobStats.isError ? (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-600">Error loading jobs</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Running</span>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {jobStats.data?.running ?? 0}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Failed</span>
                      <Badge className="bg-red-100 text-red-800">
                        {jobStats.data?.failed ?? 0}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Success</span>
                      <Badge className="bg-green-100 text-green-800">
                        {jobStats.data?.success ?? 0}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Storage Card */}
            {storageStats.isLoading ? (
              <CardSkeleton />
            ) : storageStats.isError ? (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Storage</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-600">Error loading storage</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Storage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tables</span>
                      <span className="font-semibold">
                        {storageStats.data?.tables?.count ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Size</span>
                      <span className="font-semibold">
                        {formatBytes(storageStats.data?.tables?.bytes ?? 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Flows Card */}
            {orchestrationStats.isLoading ? (
              <CardSkeleton />
            ) : orchestrationStats.isError ? (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Flows</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-600">Error loading flows</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Flows</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total</span>
                      <span className="font-semibold">
                        {orchestrationStats.data?.total ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active</span>
                      <Badge className="bg-green-100 text-green-800">
                        {orchestrationStats.data?.active ?? 0}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Team Card */}
            {tokens.isLoading ? (
              <CardSkeleton />
            ) : tokens.isError ? (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-600">Error loading team</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Members</span>
                      <span className="font-semibold">
                        {tokens.data?.length ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Admin</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {tokens.data?.filter(t => t.admin).length ?? 0}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <RecentActivity />
        </div>
      </main>
    </div>
  );
}
