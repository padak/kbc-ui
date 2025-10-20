/**
 * Example usage of the MermaidDiagram component
 *
 * This file demonstrates how to use the MermaidDiagram component
 * in your Flows feature pages.
 */

import { MermaidDiagram } from "./mermaid-diagram";

// Example 1: Simple flow diagram
const simpleFlowDiagram = `
graph TB
  Start([Start]) --> Extract[Extract Data]
  Extract --> Transform[Transform Data]
  Transform --> Load[Load to Storage]
  Load --> End([End])

  style Start fill:#e0f2ff,stroke:#1F8FFF
  style Extract fill:#fff3e0,stroke:#f97316
  style Transform fill:#e0ffe0,stroke:#22c55e
  style Load fill:#e0f9ff,stroke:#06b6d4
  style End fill:#e0f2ff,stroke:#1F8FFF
`;

// Example 2: Complex multi-phase flow (from flow-spec.md)
const complexFlowDiagram = `
graph TB
  Start([Start Flow]) --> Phase1[Phase 1: Data Ingestion]

  Phase1 --> E1[Extractor: Google Sheets]
  Phase1 --> E2[Extractor: Salesforce]
  E1 --> Storage1[(Storage: in.c-raw)]
  E2 --> Storage1

  Storage1 --> Phase2[Phase 2: Transformation]
  Phase2 --> T1[dbt: Customer Model]
  Phase2 --> T2[SQL: Aggregations]
  T1 --> Storage2[(Storage: out.c-analytics)]
  T2 --> Storage2

  Storage2 --> Phase3[Phase 3: Data Export]
  Phase3 --> W1[Writer: Snowflake]
  Phase3 --> W2[Writer: Google Sheets]
  W1 --> End([Flow Complete])
  W2 --> End

  style Start fill:#e0f2ff,stroke:#1F8FFF,stroke-width:2px
  style End fill:#e0ffe0,stroke:#22c55e,stroke-width:2px
  style Phase1 fill:#f3f4f6,stroke:#1F8FFF
  style Phase2 fill:#f3f4f6,stroke:#1F8FFF
  style Phase3 fill:#f3f4f6,stroke:#1F8FFF
  style E1 fill:#fff3e0,stroke:#f97316
  style E2 fill:#fff3e0,stroke:#f97316
  style T1 fill:#e0ffe0,stroke:#22c55e
  style T2 fill:#e0ffe0,stroke:#22c55e
  style W1 fill:#e0f9ff,stroke:#06b6d4
  style W2 fill:#e0f9ff,stroke:#06b6d4
  style Storage1 fill:#e0f2ff,stroke:#1F8FFF
  style Storage2 fill:#e0f2ff,stroke:#1F8FFF
`;

// Example 3: Invalid diagram (for error handling demo)
const invalidDiagram = `
graph TB
  Node1 --> Node2
  Node2 --> Node3
  Invalid syntax here!!!
  Node3 --> Node4 ->->-> broken
`;

export function MermaidDiagramExample() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Simple Flow</h2>
        <MermaidDiagram
          diagram={simpleFlowDiagram}
          onError={(error) => console.error("Rendering error:", error)}
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Complex Multi-Phase Flow</h2>
        <MermaidDiagram
          diagram={complexFlowDiagram}
          className="border-2 border-primary-500"
          onError={(error) => console.error("Rendering error:", error)}
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Error Handling Demo</h2>
        <MermaidDiagram
          diagram={invalidDiagram}
          onError={(error) => {
            console.error("Expected error:", error);
            // You can also show a toast notification here
          }}
        />
      </div>
    </div>
  );
}

/**
 * Usage in a Flow Detail Page:
 *
 * ```tsx
 * import { MermaidDiagram } from "@/components/flows/mermaid-diagram";
 *
 * export default function FlowDetailPage({ params }: { params: { flowId: string } }) {
 *   const { data: flow, isLoading, error } = useQuery({
 *     queryKey: ["flow", params.flowId],
 *     queryFn: () => fetchFlow(params.flowId),
 *   });
 *
 *   if (isLoading) return <Skeleton />;
 *   if (error) return <ErrorState />;
 *
 *   return (
 *     <div>
 *       <h1>{flow.name}</h1>
 *       <MermaidDiagram
 *         diagram={flow.mermaid}
 *         onError={(err) => {
 *           toast.error("Failed to render flow diagram", {
 *             description: err.message,
 *           });
 *         }}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */

/**
 * Integration with AI Flow Builder:
 *
 * ```tsx
 * import { MermaidDiagram } from "@/components/flows/mermaid-diagram";
 * import { useState } from "react";
 *
 * export function AIFlowBuilder() {
 *   const [generatedDiagram, setGeneratedDiagram] = useState<string>("");
 *   const [isGenerating, setIsGenerating] = useState(false);
 *
 *   const handleGenerateFlow = async (prompt: string) => {
 *     setIsGenerating(true);
 *     try {
 *       const response = await fetch("/api/ai/generate-flow", {
 *         method: "POST",
 *         body: JSON.stringify({ prompt }),
 *       });
 *       const { mermaid } = await response.json();
 *       setGeneratedDiagram(mermaid);
 *     } catch (error) {
 *       console.error("Failed to generate flow:", error);
 *     } finally {
 *       setIsGenerating(false);
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <AIPromptInput onSubmit={handleGenerateFlow} />
 *
 *       {isGenerating ? (
 *         <Skeleton className="h-96" />
 *       ) : generatedDiagram ? (
 *         <MermaidDiagram
 *           diagram={generatedDiagram}
 *           onError={(err) => toast.error(err.message)}
 *         />
 *       ) : (
 *         <EmptyState />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
