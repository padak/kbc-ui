import * as React from "react";
import { cn } from "@/lib/utils";

const GradientCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "ai" | "success";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm hover-lift transition-all duration-200",
      variant === "ai" && "border-purple-200 bg-gradient-ai-subtle glow-ai-hover",
      variant === "success" && "border-green-200 bg-green-50/50",
      className
    )}
    {...props}
  />
));
GradientCard.displayName = "GradientCard";

const GradientCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
GradientCardHeader.displayName = "GradientCardHeader";

const GradientCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
GradientCardTitle.displayName = "GradientCardTitle";

const GradientCardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
GradientCardDescription.displayName = "GradientCardDescription";

const GradientCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
GradientCardContent.displayName = "GradientCardContent";

const GradientCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
GradientCardFooter.displayName = "GradientCardFooter";

export {
  GradientCard,
  GradientCardHeader,
  GradientCardFooter,
  GradientCardTitle,
  GradientCardDescription,
  GradientCardContent,
};
