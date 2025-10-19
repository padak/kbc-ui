"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AISuggestions, AISuggestion } from "./ai-suggestions";
import { Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setInput("");
      setIsProcessing(false);
    }
  }, [open]);

  const handleSuggestionSelect = (suggestion: AISuggestion) => {
    setInput(suggestion.text);
    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      suggestion.action();
      setIsProcessing(false);
      onOpenChange(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      console.log("Processing query:", input);
      setIsProcessing(false);
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden border-0 bg-white/95 backdrop-blur-xl shadow-2xl">
        {/* Header with gradient */}
        <DialogHeader className="sr-only">AI Assistant</DialogHeader>
        <div className="relative">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 pointer-events-none" />

          {/* Content */}
          <div className="relative">
            {/* AI Badge */}
            <div className="flex items-center gap-2 px-6 pt-6 pb-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">AI Assistant</span>
              </div>
              <div className="flex-1" />
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 border border-gray-200 rounded">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>

            {/* Search Input */}
            <form onSubmit={handleSubmit} className="px-6 pb-4">
              <div className="relative group">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about your data pipelines..."
                  className="w-full h-12 pl-4 pr-12 text-base bg-white border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all shadow-sm"
                  autoFocus
                  disabled={isProcessing}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!input.trim() || isProcessing}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Hint text */}
              <p className="mt-2 text-xs text-gray-500 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Try asking about jobs, storage, flows, or recent activity
              </p>
            </form>
          </div>
        </div>

        {/* Suggestions */}
        <div className="px-3 pb-4 max-h-[400px] overflow-y-auto">
          <AISuggestions onSelect={handleSuggestionSelect} />
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50/80 border-t border-gray-200/50 backdrop-blur-sm">
          <p className="text-xs text-gray-500 text-center">
            Powered by AI • Your data never leaves your browser
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
