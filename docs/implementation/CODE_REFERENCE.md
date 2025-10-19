# Code Reference Guide

Complete code examples and technical patterns for all dashboard features.

**Last Updated**: 2025-10-19

---

## Table of Contents

1. [Sidebar Navigation](#sidebar-navigation)
2. [AI Chat Interface](#ai-chat-interface)
3. [AI Theme Components](#ai-theme-components)
4. [Common Patterns](#common-patterns)

---

## Sidebar Navigation

### Import Statements

```typescript
// React & Next.js
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Icons
import {
  Home,
  Database,
  Briefcase,
  Workflow,
  Code,
  AppWindow,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// UI Components
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

// Utilities
import { cn } from "@/lib/utils";
```

### TypeScript Interfaces

```typescript
interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

interface SidebarLayoutProps {
  children: React.ReactNode;
}
```

### Navigation Items Configuration

```typescript
const navigationItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Storage", href: "/storage", icon: Database },
  { label: "Jobs", href: "/jobs", icon: Briefcase },
  { label: "Flows", href: "/flows", icon: Workflow },
  { label: "Transformations", href: "/transformations", icon: Code },
  { label: "Data Apps", href: "/data-apps", icon: AppWindow },
  { label: "Settings", href: "/settings", icon: Settings },
];
```

### State Management Hook

```typescript
const STORAGE_KEY = "keboola-sidebar-collapsed";

export function useSidebarState() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setIsCollapsed(stored === "true");
    }

    // Auto-collapse on mobile
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleCollapsed = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (isMounted) {
      localStorage.setItem(STORAGE_KEY, String(newState));
    }
  };

  return { isCollapsed, toggleCollapsed, isMounted };
}
```

### Sidebar Component

```tsx
export function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white border-r border-gray-700/50 shadow-xl transition-all duration-300 ease-in-out z-50",
          isCollapsed ? "w-16" : "w-60"
        )}
      >
        {/* Logo/Header Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700/50">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center font-bold text-sm text-white">
                K
              </div>
              <span className="font-semibold text-sm">Keboola</span>
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center font-bold text-sm text-white mx-auto">
              K
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4">
          <ul className="space-y-1 px-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              const linkContent = (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden",
                    isActive
                      ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20"
                      : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                  )}
                >
                  {/* Hover gradient effect for non-active items */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-primary-600/0 group-hover:bg-primary-600/10 transition-all duration-300" />
                  )}

                  <Icon
                    className={cn(
                      "relative z-10 flex-shrink-0 transition-transform duration-200",
                      isActive
                        ? "w-5 h-5"
                        : "w-5 h-5 group-hover:scale-110"
                    )}
                  />

                  {!isCollapsed && (
                    <span className="relative z-10 text-sm font-medium truncate">
                      {item.label}
                    </span>
                  )}

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
                  )}
                </Link>
              );

              return (
                <li key={item.href}>
                  {isCollapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                      <TooltipContent side="right" className="font-medium">
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    linkContent
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Toggle Button */}
        <div className="p-4 border-t border-gray-700/50">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn(
              "w-full h-10 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200",
              isCollapsed && "mx-auto"
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <div className="flex items-center gap-2 w-full">
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Collapse</span>
              </div>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
```

### Layout Wrapper

```tsx
export function SidebarLayout({ children }: SidebarLayoutProps) {
  const { isCollapsed, toggleCollapsed, isMounted } = useSidebarState();

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="min-h-screen">
        <div className="w-60" />
        <main>{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Sidebar isCollapsed={isCollapsed} onToggle={toggleCollapsed} />
      <main
        className={cn(
          "transition-all duration-300 ease-in-out min-h-screen",
          isCollapsed ? "ml-16" : "ml-60"
        )}
      >
        {children}
      </main>
    </div>
  );
}
```

### Route Layout Integration

```tsx
// src/app/(dashboard)/layout.tsx
import { SidebarLayout } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
```

### Page Template

```tsx
// src/app/(dashboard)/[page]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "@/lib/api/auth";

export default function YourPage() {
  const router = useRouter();
  const [auth, setAuth] = useState<{ stackUrl: string; token: string } | null>(null);

  useEffect(() => {
    const credentials = getAuth();
    if (!credentials) {
      router.push("/login");
    } else {
      setAuth(credentials);
    }
  }, [router]);

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-primary-500">
            Page Title
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {auth.stackUrl.replace("https://", "")}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Your content here */}
      </main>
    </div>
  );
}
```

---

## AI Chat Interface

### Import Statements

```typescript
// React & Next.js
import { useState, useEffect } from "react";

// Icons
import { Sparkles, Send, Loader2, X } from "lucide-react";

// UI Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AIBadge } from "@/components/ui/ai-badge";

// AI Components
import { AISuggestions } from "./ai-suggestions";
```

### FloatingChatButton Component

```tsx
"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { CommandPalette } from "./command-palette";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsOpen(true)}
              className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-ai text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group hover-lift glow-ai-hover"
              aria-label="Open AI Assistant"
            >
              <Sparkles className="w-6 h-6 animate-pulse" />
              <div className="absolute inset-0 rounded-full bg-gradient-ai opacity-0 group-hover:opacity-50 animate-pulse" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="glass font-medium">
            AI Assistant ⌘K
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <CommandPalette open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
```

### CommandPalette Component

```tsx
"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AIBadge } from "@/components/ui/ai-badge";
import { AISuggestions } from "./ai-suggestions";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    // TODO: Integrate with AI backend
    console.log("Submitting query:", query);

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setQuery("");
    onOpenChange(false);
  };

  const handleSuggestionSelect = (suggestion: any) => {
    console.log("Selected suggestion:", suggestion);
    suggestion.action();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-gradient-ai text-xl font-bold flex items-center gap-2">
              🎭 AI Assistant
              <AIBadge variant="subtle" className="text-xs">
                Powered by AI
              </AIBadge>
            </DialogTitle>
            <kbd className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              ⌘K
            </kbd>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1"
              autoFocus
              disabled={isLoading}
            />
            <Button type="submit" disabled={!query.trim() || isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            ✨ Try asking about jobs, storage, flows, or recent activity
          </p>

          <AISuggestions onSelect={handleSuggestionSelect} />

          <p className="text-xs text-muted-foreground text-center">
            Powered by AI • Privacy-first
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### AISuggestions Component

```tsx
"use client";

import { AlertCircle, Database, PlayCircle, Activity } from "lucide-react";

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
      action: () => {
        console.log("Navigating to failed jobs...");
        // TODO: Navigate to jobs page with failed filter
      },
    },
    {
      id: "storage-usage",
      icon: <Database className="w-4 h-4" />,
      text: "What's using the most storage?",
      description: "Analyze storage consumption by tables and buckets",
      action: () => {
        console.log("Analyzing storage usage...");
        // TODO: Show storage analytics
      },
    },
    {
      id: "run-flow",
      icon: <PlayCircle className="w-4 h-4" />,
      text: "Run the daily sales flow",
      description: "Execute your daily sales data pipeline",
      action: () => {
        console.log("Running flow...");
        // TODO: Trigger flow execution
      },
    },
    {
      id: "recent-activity",
      icon: <Activity className="w-4 h-4" />,
      text: "Show recent activity",
      description: "View timeline of recent actions and changes",
      action: () => {
        console.log("Showing recent activity...");
        // TODO: Navigate to activity view
      },
    },
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        💡 Suggested Actions
      </h3>
      <div className="space-y-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => onSelect(suggestion)}
            className="w-full text-left px-4 py-3 rounded-lg border border-border hover:border-primary hover:bg-accent transition-all duration-200 hover-lift group"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 text-primary group-hover:scale-110 transition-transform">
                {suggestion.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm group-hover:text-primary transition-colors">
                  {suggestion.text}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {suggestion.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Integration Example

```tsx
// src/app/(dashboard)/dashboard/page.tsx
import { FloatingChatButton } from "@/components/ai";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Dashboard content */}

      {/* AI Chat Interface */}
      <FloatingChatButton />
    </div>
  );
}
```

---

## AI Theme Components

### AIBadge Component

```tsx
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface AIBadgeProps {
  children: React.ReactNode;
  variant?: "default" | "subtle";
  className?: string;
}

export function AIBadge({ children, variant = "default", className }: AIBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold",
        variant === "default"
          ? "bg-gradient-ai text-white"
          : "bg-gradient-ai-subtle border border-purple-200 text-purple-700",
        className
      )}
    >
      <Sparkles className="w-3 h-3" />
      {children}
    </span>
  );
}
```

### SparkleIcon Component

```tsx
import { cn } from "@/lib/utils";

interface SparkleIconProps {
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
}

export function SparkleIcon({ size = "md", animated = false, className }: SparkleIconProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <svg
      className={cn(sizeClasses[size], animated && "animate-pulse", className)}
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
        d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
        fill="url(#sparkle-gradient)"
      />
    </svg>
  );
}
```

### GradientCard Component

```tsx
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface GradientCardProps {
  variant?: "default" | "ai" | "success";
  children: React.ReactNode;
  className?: string;
}

export function GradientCard({ variant = "default", children, className }: GradientCardProps) {
  const variantClasses = {
    default: "",
    ai: "border-t-2 border-t-purple-500 glow-ai-hover",
    success: "border-t-2 border-t-green-500 glow-success",
  };

  return (
    <Card className={cn("hover-lift", variantClasses[variant], className)}>
      {children}
    </Card>
  );
}

export { CardHeader as GradientCardHeader, CardTitle as GradientCardTitle, CardContent as GradientCardContent };
```

---

## Common Patterns

### AI Feature Header

```tsx
<div className="flex items-center gap-2 mb-6">
  <SparkleIcon size="md" />
  <h2 className="text-2xl font-bold text-gray-900">AI-Powered Insights</h2>
</div>
```

### AI Badge with Title

```tsx
<div className="flex items-center gap-2">
  <h1 className="text-2xl font-bold text-primary-500">
    Keboola Connection
  </h1>
  <AIBadge variant="subtle" className="text-xs">
    AI-Powered
  </AIBadge>
</div>
```

### Gradient Background

```tsx
<div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
  {/* Content */}
</div>
```

### Glassmorphism Header

```tsx
<header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
  {/* Header content */}
</header>
```

### Success Badge with Glow

```tsx
<Badge className="bg-success-50 text-success-800 hover-lift glow-success">
  {count} success
</Badge>
```

### Hover Lift Effect

```tsx
<div className="hover-lift glow-ai-hover">
  Interactive element
</div>
```

### Loading State with Shimmer

```tsx
{isLoading ? (
  <div className="shimmer h-20 rounded-lg" />
) : (
  <div>Content</div>
)}
```

### Gradient Text

```tsx
<h1 className="text-gradient-ai">AI-Powered Platform</h1>
```

### Floating Animation

```tsx
<div className="float">
  <SparkleIcon size="lg" />
</div>
```

---

## Utility Classes Quick Reference

### AI Gradients
```css
.bg-gradient-ai          /* Purple to blue animated */
.text-gradient-ai        /* Gradient text animated */
.bg-gradient-ai-subtle   /* Subtle background gradient */
```

### Glassmorphism
```css
.glass                   /* Light glass effect */
.glass-dark             /* Dark glass effect */
```

### Glow Effects
```css
.glow-ai                /* Constant AI glow */
.glow-ai-hover          /* Glow on hover only */
.glow-success           /* Success pulse animation */
```

### Animations
```css
.hover-lift             /* Lift effect on hover */
.float                  /* Floating animation */
.shimmer                /* Shimmer loading effect */
```

---

## Browser DevTools Tips

### Check localStorage

```javascript
// In browser console
localStorage.getItem("keboola-sidebar-collapsed");
```

### Force Sidebar State

```javascript
// Collapse
localStorage.setItem("keboola-sidebar-collapsed", "true");

// Expand
localStorage.setItem("keboola-sidebar-collapsed", "false");

// Refresh page
location.reload();
```

### Debug Current Route

```javascript
// Current pathname
window.location.pathname;
```

---

## Constants & Configuration

### Sidebar Constants

```typescript
const STORAGE_KEY = "keboola-sidebar-collapsed";
const MOBILE_BREAKPOINT = 768; // pixels
const SIDEBAR_WIDTH_EXPANDED = "240px"; // w-60
const SIDEBAR_WIDTH_COLLAPSED = "64px"; // w-16
const ANIMATION_DURATION = "300ms";
```

### Z-Index Layers

```css
sidebar: z-50
floating-chat-button: z-50
page-header: z-40
modal-dialog: z-50 (from Radix UI)
```

---

**Reference Version**: 1.0.0
**Last Updated**: 2025-10-19
