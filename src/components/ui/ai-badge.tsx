import * as React from "react";
import { cn } from "@/lib/utils";

export interface AIBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle";
}

function AIBadge({ className, variant = "default", children, ...props }: AIBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variant === "default" && "bg-gradient-ai text-white",
        variant === "subtle" && "bg-gradient-ai-subtle text-purple-700 border border-purple-200",
        className
      )}
      {...props}
    >
      <svg
        className="w-3 h-3"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
          fill="currentColor"
        />
      </svg>
      {children}
    </div>
  );
}

export { AIBadge };
