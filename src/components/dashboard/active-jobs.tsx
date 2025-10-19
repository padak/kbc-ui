"use client";

import { useJobs } from "@/lib/api/queries";
import { getRelativeTime, getJobStatusColor } from "@/lib/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  AlertCircle,
  Briefcase,
  FileText,
  XCircle,
  Activity,
  CheckCircle2,
} from "lucide-react";
import type { Job } from "@/lib/api/client";

function getJobDisplayName(job: Job): string {
  return job.configData?.name || job.component || `Job ${job.id}`;
}

function getComponentShortName(component: string): string {
  // Extract component name from full ID (e.g., "keboola.ex-db-mysql" -> "MySQL")
  const parts = component.split(".");
  const lastPart = parts[parts.length - 1];
  return lastPart
    .replace("ex-", "")
    .replace("wr-", "")
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function ActiveJobs() {
  const { data: jobs, isLoading, error } = useJobs(50);

  // Filter only active jobs (running or waiting)
  const activeJobs = jobs?.filter(
    (job) =>
      job.status === "processing" ||
      job.status === "waiting" ||
      job.status === "terminating"
  ) || [];

  if (isLoading) {
    return (
      <Card className="relative overflow-hidden hover-lift">
        <div className="absolute inset-0 shimmer" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-gray-400" />
            Active Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">
              Loading jobs...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-error-500 bg-error-50 hover-lift">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-error-500 to-error-700" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-error-700">
            <Activity className="h-5 w-5" />
            Active Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3 py-4">
            <AlertCircle className="h-5 w-5 text-error-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-error-700">Failed to load jobs</p>
              <p className="text-xs text-error-700 mt-1">Please check your connection and try again</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activeJobs.length === 0) {
    return (
      <Card className="relative overflow-hidden hover-lift bg-gradient-to-br from-success-50 to-success-50 border-success-500">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-success-500 to-success-700" />
        <div className="absolute -top-2 -left-2 w-24 h-24 bg-success-500/10 rounded-full blur-2xl" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-success-700">
            <CheckCircle2 className="h-5 w-5" />
            Active Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="relative mb-3">
              <div className="absolute inset-0 bg-success-500/50 rounded-full blur-xl" />
              <Briefcase className="h-12 w-12 text-success-500 relative" />
            </div>
            <p className="text-sm font-medium text-success-700 mb-1">All clear!</p>
            <p className="text-xs text-success-700">No jobs are currently running</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden hover-lift">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-warning-500 via-warning-500 to-error-500" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-warning-500" />
          Active Jobs
          <Badge variant="secondary" className="ml-auto bg-warning-50 text-warning-700 hover-lift">
            {activeJobs.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-gray-200 bg-white/50">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Name</TableHead>
                <TableHead>Component</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Started</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">
                    {getJobDisplayName(job)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {getComponentShortName(job.component)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getJobStatusColor(job.status)}>
                      {job.status === "processing" && (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      )}
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {job.startTime ? getRelativeTime(job.startTime) : "—"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-primary-50 hover:text-primary-700 transition-colors"
                        onClick={() => {
                          // TODO: Implement view logs functionality
                          console.log("View logs for job:", job.id);
                        }}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Logs
                      </Button>
                      {job.status === "processing" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-error-50 hover:text-error-700 transition-colors"
                          onClick={() => {
                            // TODO: Implement cancel job functionality
                            console.log("Cancel job:", job.id);
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
