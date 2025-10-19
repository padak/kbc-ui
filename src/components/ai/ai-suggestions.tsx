"use client";

import { Sparkles, AlertCircle, Database, PlayCircle, Activity } from "lucide-react";

export interface AISuggestion {
  id: string;
  icon: React.ReactNode;
  text: string;
  description: string;
  action: () => void;
}

interface AISuggestionsProps {
  onSelect: (suggestion: AISuggestion) => void;
}

export function AISuggestions({ onSelect }: AISuggestionsProps) {
  const suggestions: AISuggestion[] = [
    {
      id: "failed-jobs",
      icon: <AlertCircle className="w-4 h-4" />,
      text: "Show me all failed jobs",
      description: "View recent job failures and error details",
      action: () => console.log("Show failed jobs"),
    },
    {
      id: "storage-usage",
      icon: <Database className="w-4 h-4" />,
      text: "What's using the most storage?",
      description: "Analyze storage consumption by tables and buckets",
      action: () => console.log("Show storage usage"),
    },
    {
      id: "run-flow",
      icon: <PlayCircle className="w-4 h-4" />,
      text: "Run the daily sales flow",
      description: "Execute your daily sales data pipeline",
      action: () => console.log("Run daily sales flow"),
    },
    {
      id: "recent-activity",
      icon: <Activity className="w-4 h-4" />,
      text: "Show recent activity",
      description: "View timeline of recent actions and changes",
      action: () => console.log("Show recent activity"),
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-3 py-2">
        <Sparkles className="w-4 h-4 text-purple-500" />
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Suggested Actions
        </span>
      </div>
      <div className="space-y-1">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => onSelect(suggestion)}
            className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left group"
          >
            <div className="flex-shrink-0 mt-0.5 text-gray-400 group-hover:text-purple-500 transition-colors">
              {suggestion.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                {suggestion.text}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{suggestion.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
