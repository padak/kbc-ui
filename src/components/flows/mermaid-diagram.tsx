"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MermaidDiagramProps {
  diagram: string;
  className?: string;
  onError?: (error: Error) => void;
}

// Zoom levels supported
const ZOOM_LEVELS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
const DEFAULT_ZOOM_INDEX = 2; // 100%

export function MermaidDiagram({ diagram, className, onError }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRendering, setIsRendering] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [zoomIndex, setZoomIndex] = useState(DEFAULT_ZOOM_INDEX);
  const [diagramId] = useState(() => `mermaid-${Math.random().toString(36).substring(7)}`);

  // Initialize mermaid with custom theme matching Keboola design
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      themeVariables: {
        // Primary colors - Keboola blue
        primaryColor: "#e0f2ff", // --color-primary-50
        primaryTextColor: "#003d7a", // --color-primary-800
        primaryBorderColor: "#1F8FFF", // --color-primary-500
        lineColor: "#0066cc", // --color-primary-600

        // Secondary colors
        secondaryColor: "#fff3e0", // --color-warning-50
        secondaryTextColor: "#c2410c", // --color-warning-700
        secondaryBorderColor: "#f97316", // --color-warning-500

        // Tertiary colors
        tertiaryColor: "#e0ffe0", // --color-success-50
        tertiaryTextColor: "#15803d", // --color-success-700
        tertiaryBorderColor: "#22c55e", // --color-success-500

        // Background and text
        background: "#ffffff",
        mainBkg: "#f9fafb", // --color-neutral-50
        textColor: "#1f2937", // --color-neutral-800

        // Node styling
        nodeBorder: "#1F8FFF", // --color-primary-500
        clusterBkg: "#f3f4f6", // --color-neutral-100
        clusterBorder: "#d1d5db", // --color-neutral-300

        // Edge styling
        edgeLabelBackground: "#ffffff",

        // Font
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontSize: "14px",
      },
      flowchart: {
        htmlLabels: true,
        curve: "basis",
        padding: 20,
      },
      securityLevel: "strict",
    });
  }, []);

  // Render mermaid diagram
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const renderDiagram = async () => {
      if (!containerRef.current || !diagram) {
        setIsRendering(false);
        return;
      }

      setIsRendering(true);
      setError(null);

      // Set timeout for rendering (5 seconds max)
      timeoutId = setTimeout(() => {
        if (isMounted) {
          const timeoutError = new Error("Mermaid rendering timed out after 5 seconds");
          setError(timeoutError);
          setIsRendering(false);
          onError?.(timeoutError);
        }
      }, 5000);

      try {
        // Clear previous diagram
        containerRef.current.innerHTML = "";

        // Validate diagram is not empty
        if (!diagram.trim()) {
          throw new Error("Diagram content is empty");
        }

        // Render the diagram
        const { svg } = await mermaid.render(diagramId, diagram);

        if (isMounted && containerRef.current) {
          clearTimeout(timeoutId);
          containerRef.current.innerHTML = svg;
          setIsRendering(false);

          // Make SVG responsive
          const svgElement = containerRef.current.querySelector("svg");
          if (svgElement) {
            svgElement.style.maxWidth = "100%";
            svgElement.style.height = "auto";
          }
        }
      } catch (err) {
        clearTimeout(timeoutId);
        console.error("[Mermaid] Render failed:", err);
        const renderError = err instanceof Error ? err : new Error("Failed to render Mermaid diagram");

        if (isMounted) {
          setError(renderError);
          setIsRendering(false);
          onError?.(renderError);
        }
      }
    };

    renderDiagram();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [diagram, diagramId, onError]);

  // Zoom handlers
  const handleZoomIn = () => {
    setZoomIndex((prev) => Math.min(prev + 1, ZOOM_LEVELS.length - 1));
  };

  const handleZoomOut = () => {
    setZoomIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleZoomReset = () => {
    setZoomIndex(DEFAULT_ZOOM_INDEX);
  };

  const currentZoom = ZOOM_LEVELS[zoomIndex];
  const canZoomIn = zoomIndex < ZOOM_LEVELS.length - 1;
  const canZoomOut = zoomIndex > 0;

  return (
    <div className={cn("relative bg-gray-50 border border-gray-200 rounded-lg", className)}>
      {/* Zoom Controls - Sticky top-right */}
      {!isRendering && !error && (
        <div className="sticky top-2 right-2 z-10 flex gap-1 justify-end p-2">
          <div className="flex gap-1 bg-white border border-gray-200 rounded-md shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              disabled={!canZoomOut}
              aria-label="Zoom out"
              title="Zoom out"
              className="h-8 w-8"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomReset}
              aria-label="Reset zoom"
              title="Reset to 100%"
              className="h-8 px-2 text-xs font-medium min-w-[50px]"
            >
              {Math.round(currentZoom * 100)}%
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              disabled={!canZoomIn}
              aria-label="Zoom in"
              title="Zoom in"
              className="h-8 w-8"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>

            <div className="w-px bg-gray-200" />

            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomReset}
              aria-label="Fit to screen"
              title="Fit to screen"
              className="h-8 w-8"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isRendering && (
        <div className="p-6 space-y-4" style={{ minHeight: "400px" }}>
          <div className="flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
          </div>
          <Skeleton className="h-24 w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-16 w-1/4" />
            <Skeleton className="h-16 w-1/4" />
            <Skeleton className="h-16 w-1/4" />
            <Skeleton className="h-16 w-1/4" />
          </div>
          <Skeleton className="h-32 w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-16 w-1/3" />
            <Skeleton className="h-16 w-1/3" />
            <Skeleton className="h-16 w-1/3" />
          </div>
          <p className="text-sm text-gray-500 text-center mt-4">
            Rendering flow diagram...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-6 space-y-4" style={{ minHeight: "400px" }}>
          <div className="flex items-start space-x-3 bg-error-50 border border-error-500 rounded-lg p-4">
            <AlertTriangle className="h-6 w-6 text-error-700 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-error-900 mb-1">
                Failed to render diagram
              </h3>
              <p className="text-sm text-error-700 mb-3">
                {error.message}
              </p>
              <details className="text-xs text-error-600">
                <summary className="cursor-pointer font-medium hover:text-error-700">
                  View diagram source
                </summary>
                <pre className="mt-2 p-3 bg-white border border-error-200 rounded overflow-x-auto">
                  <code>{diagram}</code>
                </pre>
              </details>
            </div>
          </div>

          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-neutral-900 mb-2">
              Troubleshooting tips:
            </h4>
            <ul className="text-sm text-neutral-700 space-y-1 list-disc list-inside">
              <li>Check that the Mermaid syntax is valid</li>
              <li>Ensure all node IDs are unique</li>
              <li>Verify that arrows and connections are properly formatted</li>
              <li>Try simplifying the diagram to identify the issue</li>
            </ul>
          </div>
        </div>
      )}

      {/* Diagram Container with Zoom - Always render so ref is available */}
      <div
        className="overflow-auto p-6 relative"
        style={{
          minHeight: "400px",
          maxHeight: "600px",
          display: isRendering || error ? "none" : "block",
        }}
      >
        <div
          ref={containerRef}
          className="transition-transform duration-200 ease-out"
          style={{
            transform: `scale(${currentZoom})`,
            transformOrigin: "top left",
          }}
          role="img"
          aria-label="Flow diagram"
        />
      </div>
    </div>
  );
}
