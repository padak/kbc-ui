/**
 * AIFlowCreator Component - Usage Example
 *
 * This file demonstrates how to use the AIFlowCreator component
 * in your application. This is NOT a test file - it's a usage guide.
 */

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { AIFlowCreator } from "./ai-flow-creator";

/**
 * Example 1: Basic Usage
 *
 * Simple modal that opens when button is clicked
 */
export function BasicExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>
        <Sparkles className="h-4 w-4 mr-2" />
        Create Flow with AI
      </Button>

      <AIFlowCreator
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}

/**
 * Example 2: With Success Callback
 *
 * Show toast notification when flow is created
 */
export function WithCallbackExample() {
  const [open, setOpen] = useState(false);

  const handleFlowCreated = (flowId: string) => {
    console.log("Flow created with ID:", flowId);
    // Show toast notification (e.g., using sonner)
    // toast.success(`Flow created successfully! ID: ${flowId}`);
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)}>
        Create Flow with AI
      </Button>

      <AIFlowCreator
        open={open}
        onOpenChange={setOpen}
        onFlowCreated={handleFlowCreated}
      />
    </div>
  );
}

/**
 * Example 3: Keyboard Shortcut (⌘K)
 *
 * Open modal with keyboard shortcut
 */
export function KeyboardShortcutExample() {
  const [open, setOpen] = useState(false);

  // Listen for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">
        Press <kbd className="px-2 py-1 bg-gray-100 rounded">⌘K</kbd> to open
      </p>

      <AIFlowCreator
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}

/**
 * Example 4: Floating Button + Modal (Recommended for Flow List Page)
 *
 * This is the recommended pattern for the Flows page
 */
export function FloatingButtonExample() {
  const [open, setOpen] = useState(false);

  const handleFlowCreated = (flowId: string) => {
    console.log("New flow created:", flowId);
    // Navigate to flow detail page or show in list
    // router.push(`/flows/${flowId}`);
  };

  return (
    <>
      {/* Floating Button - Always visible */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
        aria-label="Create Flow with AI"
      >
        <Sparkles className="h-6 w-6" />
      </button>

      {/* Modal */}
      <AIFlowCreator
        open={open}
        onOpenChange={setOpen}
        onFlowCreated={handleFlowCreated}
      />
    </>
  );
}

/**
 * Props Interface (for reference)
 *
 * interface AIFlowCreatorProps {
 *   // Required: Controls modal visibility
 *   open: boolean;
 *
 *   // Required: Called when modal should close/open
 *   onOpenChange: (open: boolean) => void;
 *
 *   // Optional: Called when flow is successfully created
 *   onFlowCreated?: (flowId: string) => void;
 * }
 */

/**
 * Usage Notes:
 *
 * 1. **State Management**: Component uses local state for wizard steps
 * 2. **Data Fetching**: Uses TanStack Query hooks (useGenerateFlow, useCreateFlow)
 * 3. **Keyboard Shortcuts**:
 *    - ⌘K / Ctrl+K: Open modal (implement in parent)
 *    - ⌘Enter / Ctrl+Enter: Submit current step
 *    - Escape: Close modal
 * 4. **Loading States**: Automatically handled by mutation hooks
 * 5. **Error Handling**: Errors shown inline with helpful messages
 * 6. **Auto-reset**: Modal state resets when closed
 *
 * Required Dependencies:
 * - TanStack Query configured (QueryClientProvider)
 * - Auth context available (for API tokens)
 * - Mermaid library installed (for diagram rendering)
 */
