# Sidebar Component - Code Reference

## Component Code

### Main Component: `/src/components/layout/sidebar.tsx`

**Key Sections:**

#### 1. Navigation Items Configuration

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

#### 2. State Management Hook

```typescript
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

#### 3. Sidebar Component Structure

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
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700/50">
          {/* ... logo code ... */}
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
                      ? "bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20"
                      : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              );

              // Wrap with tooltip when collapsed
              return (
                <li key={item.href}>
                  {isCollapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                      <TooltipContent side="right">{item.label}</TooltipContent>
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
            className="w-full h-10 text-gray-300 hover:text-white hover:bg-gray-800/50"
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
```

#### 4. Layout Wrapper

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

## Integration Code

### Layout File: `/src/app/(dashboard)/layout.tsx`

```tsx
import { SidebarLayout } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
```

### Page Template: `/src/app/(dashboard)/[page]/page.tsx`

```tsx
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
      {/* Top Bar */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 bg-clip-text text-transparent">
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

## Styling Classes

### Sidebar Container

```tsx
className="fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white border-r border-gray-700/50 shadow-xl transition-all duration-300 ease-in-out z-50"
```

### Active Navigation Item

```tsx
className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20"
```

### Hover State (Non-active)

```tsx
className="text-gray-300 hover:bg-gray-800/50 hover:text-white"
```

### Gradient Overlay (on hover)

```tsx
<div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-500/0 to-purple-600/0 group-hover:from-blue-600/10 group-hover:via-blue-500/10 group-hover:to-purple-600/10 transition-all duration-300" />
```

### Active Indicator (right edge)

```tsx
{isActive && (
  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
)}
```

## TypeScript Interfaces

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

## Constants

```typescript
const STORAGE_KEY = "keboola-sidebar-collapsed";
const MOBILE_BREAKPOINT = 768; // pixels
const SIDEBAR_WIDTH_EXPANDED = "240px"; // w-60
const SIDEBAR_WIDTH_COLLAPSED = "64px"; // w-16
const ANIMATION_DURATION = "300ms";
```

## Import Statements

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

## Dependencies Required

```json
{
  "dependencies": {
    "next": "^15.5.6",
    "react": "^19.2.0",
    "lucide-react": "^0.546.0",
    "@radix-ui/react-tooltip": "^1.1.8",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0"
  }
}
```

## Key Features Explained

### 1. Persistent State

```typescript
// Save to localStorage
localStorage.setItem(STORAGE_KEY, String(newState));

// Load from localStorage
const stored = localStorage.getItem(STORAGE_KEY);
if (stored !== null) {
  setIsCollapsed(stored === "true");
}
```

### 2. Mobile Auto-collapse

```typescript
const checkMobile = () => {
  if (window.innerWidth < 768) {
    setIsCollapsed(true);
  }
};
checkMobile();
window.addEventListener("resize", checkMobile);
return () => window.removeEventListener("resize", checkMobile);
```

### 3. Hydration Safety

```typescript
// Prevent SSR/client mismatch
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
  // ... rest of effect
}, []);

if (!isMounted) {
  return <div className="min-h-screen">...</div>;
}
```

### 4. Active Route Detection

```typescript
const pathname = usePathname();
const isActive = pathname === item.href;
```

### 5. Conditional Tooltips

```typescript
{isCollapsed ? (
  <Tooltip>
    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
    <TooltipContent side="right">{item.label}</TooltipContent>
  </Tooltip>
) : (
  linkContent
)}
```

## Animation Details

### Transition Properties

```css
transition-all duration-300 ease-in-out
```

This applies to:
- Sidebar width changes
- Main content margin changes
- Background color changes
- Icon scale on hover

### Transform Effects

```tsx
// Icon scale on hover
className="group-hover:scale-110"

// Active indicator position
className="absolute right-0 top-1/2 -translate-y-1/2"
```

## Testing Commands

```bash
# Development mode
pnpm dev

# Production build
pnpm build

# Type checking
pnpm type-check

# Linting
pnpm lint
```

## Browser DevTools Tips

### Check localStorage

```javascript
// In browser console
localStorage.getItem("keboola-sidebar-collapsed");
```

### Force state change

```javascript
// Collapse
localStorage.setItem("keboola-sidebar-collapsed", "true");

// Expand
localStorage.setItem("keboola-sidebar-collapsed", "false");

// Then refresh page
location.reload();
```

### Debug route matching

```javascript
// Current pathname
window.location.pathname;
```

---

**Reference Version**: 1.0.0
**Last Updated**: 2025-10-19
