"use client";

import { useState } from "react";
import { useOrchestrations } from "@/lib/api/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Play,
  Plus,
  Briefcase,
  Database,
  Loader2,
  Zap,
  ArrowRight,
} from "lucide-react";

export function QuickActions() {
  const { data: orchestrations, isLoading } = useOrchestrations();
  const [selectedFlow, setSelectedFlow] = useState<string>("");

  const handleRunFlow = () => {
    if (!selectedFlow) {
      alert("Please select a flow to run");
      return;
    }
    // TODO: Implement run flow functionality
    console.log("Running flow:", selectedFlow);
    alert(`Running flow: ${selectedFlow}`);
  };

  const handleCreateExtractor = () => {
    // TODO: Navigate to extractor creation page
    console.log("Navigate to create extractor");
    alert("Create Extractor - Coming soon!");
  };

  const handleViewAllJobs = () => {
    // TODO: Navigate to jobs page
    console.log("Navigate to jobs page");
    alert("Jobs page - Coming soon!");
  };

  const handleGoToStorage = () => {
    // TODO: Navigate to storage page
    console.log("Navigate to storage page");
    alert("Storage page - Coming soon!");
  };

  // Filter active flows
  const activeFlows = orchestrations?.filter((o) => !o.isDisabled) || [];

  return (
    <Card className="relative overflow-hidden hover-lift">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-ai" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary-600" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Run a Flow */}
          <div className="space-y-2 group">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Play className="h-3 w-3" />
              Run a Flow
            </label>
            <div className="flex gap-2">
              <Select
                value={selectedFlow}
                onValueChange={setSelectedFlow}
                disabled={isLoading || activeFlows.length === 0}
              >
                <SelectTrigger className="flex-1 hover:border-blue-400 transition-colors">
                  <SelectValue placeholder={
                    isLoading
                      ? "Loading..."
                      : activeFlows.length === 0
                        ? "No flows"
                        : "Select flow"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {activeFlows.map((flow) => (
                    <SelectItem key={flow.id} value={flow.id}>
                      {flow.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleRunFlow}
                disabled={!selectedFlow || isLoading}
                className="flex-shrink-0 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-md hover:shadow-lg transition-all"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500">Execute a data pipeline instantly</p>
          </div>

          {/* Create Extractor */}
          <div className="space-y-2 group">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Plus className="h-3 w-3" />
              Create Component
            </label>
            <Button
              onClick={handleCreateExtractor}
              variant="outline"
              className="w-full justify-between hover:bg-gradient-to-r hover:from-success-50 hover:to-success-50 hover:border-success-500 transition-all hover-lift group"
            >
              <span className="flex items-center">
                <Plus className="h-4 w-4 mr-2 text-success-700" />
                Create Extractor
              </span>
              <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-success-700 group-hover:translate-x-1 transition-all" />
            </Button>
            <p className="text-xs text-gray-500">Add a new data source connector</p>
          </div>

          {/* View All Jobs */}
          <div className="space-y-2 group">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              Job Monitoring
            </label>
            <Button
              onClick={handleViewAllJobs}
              variant="outline"
              className="w-full justify-between hover:bg-gradient-to-r hover:from-warning-50 hover:to-warning-50 hover:border-warning-500 transition-all hover-lift group"
            >
              <span className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2 text-warning-500" />
                View All Jobs
              </span>
              <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-warning-500 group-hover:translate-x-1 transition-all" />
            </Button>
            <p className="text-xs text-gray-500">Track all running and past jobs</p>
          </div>

          {/* Go to Storage */}
          <div className="space-y-2 group">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Database className="h-3 w-3" />
              Data Management
            </label>
            <Button
              onClick={handleGoToStorage}
              variant="outline"
              className="w-full justify-between hover:bg-gradient-to-r hover:from-primary-50 hover:to-info-50 hover:border-primary-300 transition-all hover-lift group"
            >
              <span className="flex items-center">
                <Database className="h-4 w-4 mr-2 text-primary-600" />
                Go to Storage
              </span>
              <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
            </Button>
            <p className="text-xs text-gray-500">Browse buckets, tables and data</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
