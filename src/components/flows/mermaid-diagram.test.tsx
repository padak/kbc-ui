/**
 * Unit tests for MermaidDiagram component
 *
 * Note: These tests require a proper test environment with jsdom.
 * Install test dependencies if not already present:
 *
 * pnpm add -D @testing-library/react @testing-library/jest-dom vitest jsdom
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MermaidDiagram } from "./mermaid-diagram";

// Mock mermaid library
vi.mock("mermaid", () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn(async (id: string, diagram: string) => {
      if (diagram.includes("invalid")) {
        throw new Error("Invalid mermaid syntax");
      }
      return {
        svg: `<svg id="${id}"><text>Mocked diagram</text></svg>`,
      };
    }),
  },
}));

describe("MermaidDiagram", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders loading state initially", () => {
      const diagram = "graph TB\nA-->B";
      render(<MermaidDiagram diagram={diagram} />);

      expect(screen.getByText("Rendering flow diagram...")).toBeInTheDocument();
    });

    it("renders diagram successfully", async () => {
      const diagram = "graph TB\nA-->B";
      render(<MermaidDiagram diagram={diagram} />);

      await waitFor(() => {
        expect(screen.queryByText("Rendering flow diagram...")).not.toBeInTheDocument();
      });

      expect(screen.getByRole("img")).toBeInTheDocument();
    });

    it("applies custom className", async () => {
      const diagram = "graph TB\nA-->B";
      const { container } = render(
        <MermaidDiagram diagram={diagram} className="custom-class" />
      );

      await waitFor(() => {
        expect(container.querySelector(".custom-class")).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it("handles invalid mermaid syntax", async () => {
      const onError = vi.fn();
      const invalidDiagram = "invalid mermaid syntax!!!";

      render(<MermaidDiagram diagram={invalidDiagram} onError={onError} />);

      await waitFor(() => {
        expect(screen.getByText("Failed to render diagram")).toBeInTheDocument();
      });

      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("Invalid mermaid syntax"),
        })
      );
    });

    it("shows error details", async () => {
      const invalidDiagram = "invalid!!!";
      render(<MermaidDiagram diagram={invalidDiagram} />);

      await waitFor(() => {
        expect(screen.getByText("Failed to render diagram")).toBeInTheDocument();
      });

      // Should show troubleshooting tips
      expect(screen.getByText("Troubleshooting tips:")).toBeInTheDocument();
    });

    it("allows viewing diagram source on error", async () => {
      const invalidDiagram = "invalid!!!";
      render(<MermaidDiagram diagram={invalidDiagram} />);

      await waitFor(() => {
        expect(screen.getByText("View diagram source")).toBeInTheDocument();
      });
    });
  });

  describe("Zoom Controls", () => {
    it("renders zoom controls after successful render", async () => {
      const diagram = "graph TB\nA-->B";
      render(<MermaidDiagram diagram={diagram} />);

      await waitFor(() => {
        expect(screen.queryByText("Rendering flow diagram...")).not.toBeInTheDocument();
      });

      expect(screen.getByLabelText("Zoom in")).toBeInTheDocument();
      expect(screen.getByLabelText("Zoom out")).toBeInTheDocument();
      expect(screen.getByLabelText("Reset zoom")).toBeInTheDocument();
    });

    it("displays current zoom level", async () => {
      const diagram = "graph TB\nA-->B";
      render(<MermaidDiagram diagram={diagram} />);

      await waitFor(() => {
        expect(screen.getByText("100%")).toBeInTheDocument();
      });
    });

    it("increases zoom when zoom in is clicked", async () => {
      const diagram = "graph TB\nA-->B";
      const user = userEvent.setup();

      render(<MermaidDiagram diagram={diagram} />);

      await waitFor(() => {
        expect(screen.getByText("100%")).toBeInTheDocument();
      });

      const zoomInButton = screen.getByLabelText("Zoom in");
      await user.click(zoomInButton);

      expect(screen.getByText("125%")).toBeInTheDocument();
    });

    it("decreases zoom when zoom out is clicked", async () => {
      const diagram = "graph TB\nA-->B";
      const user = userEvent.setup();

      render(<MermaidDiagram diagram={diagram} />);

      await waitFor(() => {
        expect(screen.getByText("100%")).toBeInTheDocument();
      });

      const zoomOutButton = screen.getByLabelText("Zoom out");
      await user.click(zoomOutButton);

      expect(screen.getByText("75%")).toBeInTheDocument();
    });

    it("resets zoom when reset is clicked", async () => {
      const diagram = "graph TB\nA-->B";
      const user = userEvent.setup();

      render(<MermaidDiagram diagram={diagram} />);

      await waitFor(() => {
        expect(screen.getByText("100%")).toBeInTheDocument();
      });

      // Zoom in twice
      const zoomInButton = screen.getByLabelText("Zoom in");
      await user.click(zoomInButton);
      await user.click(zoomInButton);

      expect(screen.getByText("150%")).toBeInTheDocument();

      // Reset
      const resetButton = screen.getByLabelText("Reset zoom");
      await user.click(resetButton);

      expect(screen.getByText("100%")).toBeInTheDocument();
    });

    it("disables zoom out at minimum zoom", async () => {
      const diagram = "graph TB\nA-->B";
      const user = userEvent.setup();

      render(<MermaidDiagram diagram={diagram} />);

      await waitFor(() => {
        expect(screen.getByText("100%")).toBeInTheDocument();
      });

      // Zoom out to minimum (50%)
      const zoomOutButton = screen.getByLabelText("Zoom out");
      await user.click(zoomOutButton);
      await user.click(zoomOutButton);

      expect(screen.getByText("50%")).toBeInTheDocument();
      expect(zoomOutButton).toBeDisabled();
    });

    it("disables zoom in at maximum zoom", async () => {
      const diagram = "graph TB\nA-->B";
      const user = userEvent.setup();

      render(<MermaidDiagram diagram={diagram} />);

      await waitFor(() => {
        expect(screen.getByText("100%")).toBeInTheDocument();
      });

      // Zoom in to maximum (200%)
      const zoomInButton = screen.getByLabelText("Zoom in");
      await user.click(zoomInButton);
      await user.click(zoomInButton);
      await user.click(zoomInButton);

      expect(screen.getByText("200%")).toBeInTheDocument();
      expect(zoomInButton).toBeDisabled();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA label on diagram container", async () => {
      const diagram = "graph TB\nA-->B";
      render(<MermaidDiagram diagram={diagram} />);

      await waitFor(() => {
        const diagramElement = screen.getByRole("img");
        expect(diagramElement).toHaveAttribute("aria-label", "Flow diagram");
      });
    });

    it("has accessible zoom controls", async () => {
      const diagram = "graph TB\nA-->B";
      render(<MermaidDiagram diagram={diagram} />);

      await waitFor(() => {
        expect(screen.getByLabelText("Zoom in")).toBeInTheDocument();
        expect(screen.getByLabelText("Zoom out")).toBeInTheDocument();
        expect(screen.getByLabelText("Reset zoom")).toBeInTheDocument();
        expect(screen.getByLabelText("Fit to screen")).toBeInTheDocument();
      });
    });
  });

  describe("Re-rendering", () => {
    it("re-renders when diagram changes", async () => {
      const diagram1 = "graph TB\nA-->B";
      const { rerender } = render(<MermaidDiagram diagram={diagram1} />);

      await waitFor(() => {
        expect(screen.queryByText("Rendering flow diagram...")).not.toBeInTheDocument();
      });

      // Change diagram
      const diagram2 = "graph TB\nC-->D";
      rerender(<MermaidDiagram diagram={diagram2} />);

      // Should show loading state again
      expect(screen.getByText("Rendering flow diagram...")).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText("Rendering flow diagram...")).not.toBeInTheDocument();
      });
    });

    it("preserves zoom level when diagram changes", async () => {
      const diagram1 = "graph TB\nA-->B";
      const user = userEvent.setup();
      const { rerender } = render(<MermaidDiagram diagram={diagram1} />);

      await waitFor(() => {
        expect(screen.getByText("100%")).toBeInTheDocument();
      });

      // Zoom in
      const zoomInButton = screen.getByLabelText("Zoom in");
      await user.click(zoomInButton);

      expect(screen.getByText("125%")).toBeInTheDocument();

      // Change diagram
      const diagram2 = "graph TB\nC-->D";
      rerender(<MermaidDiagram diagram={diagram2} />);

      await waitFor(() => {
        // Zoom level should be preserved
        expect(screen.getByText("125%")).toBeInTheDocument();
      });
    });
  });
});
