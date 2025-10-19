"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SparkleIconProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

function SparkleIcon({ className, size = "md", animated = true, ...props }: SparkleIconProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center",
        animated && "float",
        className
      )}
      {...props}
    >
      <svg
        className={cn(sizeClasses[size], "text-gradient-ai")}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="sparkle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "var(--color-ai-purple)", stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: "var(--color-ai-blue)", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "var(--color-ai-cyan)", stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <path
          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
          fill="url(#sparkle-gradient)"
        />
      </svg>
    </div>
  );
}

export { SparkleIcon };
