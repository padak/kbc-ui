/**
 * AI Flow Creator Modal
 *
 * 3-step wizard for creating flows via AI:
 * - Step 1: Natural language prompt input
 * - Step 2: Review generated flow (Mermaid + config)
 * - Step 3: Name and save
 *
 * Based on: /docs/build-specs/flow-spec.md (lines 325-450)
 */

"use client";

import { useState, useEffect } from "react";
import { Sparkles, Loader2, AlertCircle, ArrowLeft, RefreshCw, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { MermaidDiagram } from "./mermaid-diagram";
import ConfigSummary from "./config-summary";
import { useGenerateFlow, useCreateFlow, useComponents } from "@/lib/api/flows";
import type { GenerateFlowResponse } from "@/lib/api/flows";

// ============================================================================
// TYPES
// ============================================================================

export interface AIFlowCreatorProps {
  /** Whether modal is open */
  open: boolean;

  /** Callback when modal open state changes */
  onOpenChange: (open: boolean) => void;

  /** Callback when flow is successfully created */
  onFlowCreated?: (flowId: string) => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const QUICK_EXAMPLES = [
  "Extract from Google Sheets, transform with dbt, write to Snowflake",
  "Pull data from Salesforce, clean it, and push to BigQuery",
  "Schedule a daily backup of PostgreSQL to S3",
];

const PLACEHOLDER_TEXT = `Describe your data pipeline in plain English...

Examples:
• "Extract customer data from MySQL, clean it with Python, and load to Snowflake"
• "Get sales data from Salesforce, transform with dbt, export to Google Sheets"
• "Pull logs from S3, process with Spark, write to Redshift"`;

// ============================================================================
// COMPONENT
// ============================================================================

export function AIFlowCreator({
  open,
  onOpenChange,
  onFlowCreated,
}: AIFlowCreatorProps) {
  // ============================================================================
  // STATE
  // ============================================================================

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [prompt, setPrompt] = useState("");
  const [generatedFlow, setGeneratedFlow] = useState<GenerateFlowResponse | null>(null);
  const [flowName, setFlowName] = useState("");
  const [flowDescription, setFlowDescription] = useState("");

  // ============================================================================
  // API HOOKS
  // ============================================================================

  const generateFlowMutation = useGenerateFlow();
  const createFlowMutation = useCreateFlow();
  const { data: components } = useComponents();

  // ============================================================================
  // RESET STATE WHEN MODAL CLOSES
  // ============================================================================

  useEffect(() => {
    if (!open) {
      // Reset all state when modal closes
      const timeoutId = setTimeout(() => {
        setCurrentStep(1);
        setPrompt("");
        setGeneratedFlow(null);
        setFlowName("");
        setFlowDescription("");
        generateFlowMutation.reset();
        createFlowMutation.reset();
      }, 300); // Wait for close animation

      return () => clearTimeout(timeoutId);
    }
  }, [open, generateFlowMutation, createFlowMutation]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  /**
   * Handle prompt submission (Step 1 → Step 2)
   */
  const handleGenerateFlow = async () => {
    if (!prompt.trim()) return;

    try {
      const result = await generateFlowMutation.mutateAsync({
        prompt: prompt.trim(),
        projectId: "", // TODO: Get from auth context
      });

      setGeneratedFlow(result);
      setFlowName(result.flow.name);
      setFlowDescription(result.flow.description);
      setCurrentStep(2);
    } catch (error) {
      console.error("Flow generation failed:", error);
      // Error state is handled by mutation.isError
    }
  };

  /**
   * Handle "Edit Prompt" button (Step 2 → Step 1)
   */
  const handleEditPrompt = () => {
    setCurrentStep(1);
  };

  /**
   * Handle "Regenerate" button (re-generate with same prompt)
   */
  const handleRegenerate = () => {
    handleGenerateFlow();
  };

  /**
   * Handle "Looks Good" button (Step 2 → Step 3)
   */
  const handleConfirmGeneration = () => {
    setCurrentStep(3);
  };

  /**
   * Handle "Save Flow" button (Step 3, create flow)
   */
  const handleSaveFlow = async () => {
    if (!flowName.trim() || !generatedFlow) return;

    try {
      const newFlow = await createFlowMutation.mutateAsync({
        name: flowName.trim(),
        description: flowDescription.trim() || generatedFlow.flow.description,
        configuration: generatedFlow.flow.configuration,
      });

      // Success: close modal after brief delay
      setTimeout(() => {
        onOpenChange(false);
        onFlowCreated?.(newFlow.id);
      }, 300);
    } catch (error) {
      console.error("Flow creation failed:", error);
      // Error state is handled by mutation.isError
    }
  };

  /**
   * Handle quick example button click
   */
  const handleQuickExample = (example: string) => {
    setPrompt(example);
  };

  /**
   * Handle keyboard shortcuts
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Enter to submit (Step 1) or confirm (Step 2) or save (Step 3)
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (currentStep === 1 && prompt.trim() && !generateFlowMutation.isPending) {
          handleGenerateFlow();
        } else if (currentStep === 2 && generatedFlow) {
          handleConfirmGeneration();
        } else if (currentStep === 3 && flowName.trim() && !createFlowMutation.isPending) {
          handleSaveFlow();
        }
      }
    };

    if (open) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, currentStep, prompt, flowName, generatedFlow, generateFlowMutation.isPending, createFlowMutation.isPending]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              AI Flow Creator
            </DialogTitle>
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
            <Badge variant="outline" className="text-xs text-gray-500">
              ⌘K
            </Badge>
          </div>
          <DialogDescription className="sr-only">
            Create a new data pipeline flow using AI assistance. Describe your pipeline in natural language and AI will generate the configuration for you.
          </DialogDescription>
        </DialogHeader>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {/* ================================================================ */}
          {/* STEP 1: DESCRIBE YOUR PIPELINE */}
          {/* ================================================================ */}
          {currentStep >= 1 && (
            <div className={currentStep === 1 ? "" : "opacity-50 pointer-events-none"}>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    1. Describe Your Pipeline
                  </h3>
                  <p className="text-sm text-gray-600">
                    Tell us what you want to build in plain English
                  </p>
                </div>

                {/* Prompt Input */}
                <Textarea
                  placeholder={PLACEHOLDER_TEXT}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] font-mono text-sm"
                  disabled={currentStep !== 1}
                  autoFocus={currentStep === 1}
                />

                {/* Quick Examples */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Quick examples:</p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_EXAMPLES.map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickExample(example)}
                        disabled={currentStep !== 1}
                        className="text-xs h-auto py-2 px-3 whitespace-normal text-left"
                      >
                        {example}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Error Display */}
                {generateFlowMutation.isError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <p className="font-semibold mb-1">
                        AI couldn&apos;t generate the flow
                      </p>
                      <p className="text-sm">
                        {generateFlowMutation.error instanceof Error
                          ? generateFlowMutation.error.message
                          : "Please try rephrasing or adding more details."}
                      </p>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                {currentStep === 1 && (
                  <div className="flex justify-end">
                    <Button
                      onClick={handleGenerateFlow}
                      disabled={!prompt.trim() || generateFlowMutation.isPending}
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {generateFlowMutation.isPending ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          AI is working...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 mr-2" />
                          Generate Flow
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* STEP 2: REVIEW GENERATED FLOW */}
          {/* ================================================================ */}
          {currentStep >= 2 && generatedFlow && (
            <div className={currentStep === 2 ? "" : "opacity-50 pointer-events-none"}>
              <div className="space-y-4">
                {/* Section Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      2. Review Your Pipeline
                    </h3>
                    <p className="text-sm text-gray-600">
                      AI generated this flow based on your description
                    </p>
                  </div>
                  {currentStep === 2 && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEditPrompt}
                      >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Edit Prompt
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRegenerate}
                        disabled={generateFlowMutation.isPending}
                      >
                        {generateFlowMutation.isPending ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4 mr-1" />
                        )}
                        Regenerate
                      </Button>
                    </div>
                  )}
                </div>

                {/* Mermaid Diagram */}
                <MermaidDiagram
                  diagram={generatedFlow.mermaid}
                  onError={(error) => console.error("Mermaid error:", error)}
                />

                {/* Configuration Summary */}
                <ConfigSummary
                  configuration={generatedFlow.flow.configuration}
                  components={generatedFlow.components || components} // Use API response components (with icons) as primary source
                  warnings={generatedFlow.warnings}
                />

                {/* Validation Messages */}
                <div className="space-y-2">
                  {generatedFlow.warnings && generatedFlow.warnings.length > 0 ? (
                    <Alert className="bg-yellow-50 border-yellow-200">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription>
                        <p className="font-semibold text-yellow-900 mb-1">
                          {generatedFlow.warnings.length}{" "}
                          {generatedFlow.warnings.length === 1 ? "Warning" : "Warnings"}
                        </p>
                        <p className="text-sm text-yellow-800">
                          Review the configuration details below for more information.
                        </p>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 border border-green-200 rounded-lg p-3">
                      <Check className="h-4 w-4" />
                      <span className="font-medium">
                        All components are available in your project
                      </span>
                    </div>
                  )}
                </div>

                {/* "Looks Good" Button */}
                {currentStep === 2 && (
                  <div className="flex justify-end">
                    <Button
                      onClick={handleConfirmGeneration}
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      <Check className="h-5 w-5 mr-2" />
                      Looks Good
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* STEP 3: NAME AND SAVE */}
          {/* ================================================================ */}
          {currentStep === 3 && generatedFlow && (
            <div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    3. Name and Save
                  </h3>
                  <p className="text-sm text-gray-600">
                    Give your flow a name and save it to your project
                  </p>
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Flow Name */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="flow-name"
                      className="block text-sm font-medium mb-2"
                    >
                      Flow Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="flow-name"
                      value={flowName}
                      onChange={(e) => setFlowName(e.target.value)}
                      placeholder="e.g., Google Sheets to Snowflake via dbt"
                      maxLength={255}
                      autoFocus
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label
                      htmlFor="flow-description"
                      className="block text-sm font-medium mb-2"
                    >
                      Description <span className="text-gray-400">(optional)</span>
                    </label>
                    <Textarea
                      id="flow-description"
                      value={flowDescription}
                      onChange={(e) => setFlowDescription(e.target.value)}
                      placeholder="Describe what this flow does..."
                      maxLength={500}
                      className="max-h-[100px]"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {flowDescription.length}/500 characters
                    </p>
                  </div>

                  {/* Folder Selection - Disabled in V1 */}
                  {/* <div className="md:col-span-2">
                    <label
                      htmlFor="flow-folder"
                      className="block text-sm font-medium mb-2"
                    >
                      Folder <span className="text-gray-400">(optional)</span>
                    </label>
                    <Select disabled>
                      <SelectTrigger id="flow-folder">
                        <SelectValue placeholder="Root" />
                      </SelectTrigger>
                    </Select>
                  </div> */}
                </div>

                {/* Save Error */}
                {createFlowMutation.isError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <p className="font-semibold mb-1">Failed to save flow</p>
                      <p className="text-sm">
                        {createFlowMutation.error instanceof Error
                          ? createFlowMutation.error.message
                          : "An unexpected error occurred. Please try again."}
                      </p>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={createFlowMutation.isPending}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveFlow}
                    disabled={!flowName.trim() || createFlowMutation.isPending}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {createFlowMutation.isPending ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="h-5 w-5 mr-2" />
                        Save Flow
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
