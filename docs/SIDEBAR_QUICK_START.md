# Sidebar Quick Start Guide

## What Was Built

A professional collapsible sidebar navigation with:

- ✅ Smooth collapse/expand animations
- ✅ Persistent state (localStorage)
- ✅ Tooltips when collapsed
- ✅ Active route highlighting (blue/purple gradient)
- ✅ Mobile responsive (auto-collapse)
- ✅ Dark theme with modern styling
- ✅ 7 navigation items (Dashboard, Storage, Jobs, Flows, Transformations, Data Apps, Settings)

## Files Created

```
src/components/layout/sidebar.tsx         # Main component
src/app/(dashboard)/layout.tsx            # Shared layout
src/app/(dashboard)/dashboard/page.tsx    # Dashboard (moved)
src/app/(dashboard)/storage/page.tsx      # Storage (placeholder)
src/app/(dashboard)/jobs/page.tsx         # Jobs (placeholder)
src/app/(dashboard)/flows/page.tsx        # Flows (placeholder)
src/app/(dashboard)/transformations/page.tsx  # Transformations (placeholder)
src/app/(dashboard)/data-apps/page.tsx    # Data Apps (placeholder)
src/app/(dashboard)/settings/page.tsx     # Settings (placeholder)
```

## How It Works

### Route Group Pattern

All pages in `(dashboard)` directory automatically get the sidebar:

```
src/app/(dashboard)/
├── layout.tsx         # ← Applies SidebarLayout to all child routes
├── dashboard/
│   └── page.tsx      # ← Gets sidebar automatically
├── storage/
│   └── page.tsx      # ← Gets sidebar automatically
└── ...
```

### Component Structure

```tsx
// src/app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
```

The `SidebarLayout` component:
1. Manages collapsed state (with localStorage)
2. Renders the `Sidebar` component
3. Adjusts main content margin based on sidebar width

## Usage

### View the Sidebar

```bash
pnpm dev
```

Navigate to: `http://localhost:3000/dashboard`

### Test Features

1. **Toggle**: Click "Collapse" button at bottom of sidebar
2. **Navigation**: Click any menu item to navigate
3. **Tooltips**: Collapse sidebar, hover over icons
4. **Active state**: Notice gradient on current route
5. **Persistence**: Refresh page, state is preserved
6. **Mobile**: Resize window < 768px, sidebar auto-collapses

## Customization

### Add a New Navigation Item

Edit `/src/components/layout/sidebar.tsx`:

```tsx
import { YourIcon } from "lucide-react";

const navigationItems: NavItem[] = [
  // ... existing items
  { label: "Your Page", href: "/your-page", icon: YourIcon },
];
```

Create the page:

```tsx
// src/app/(dashboard)/your-page/page.tsx
export default function YourPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Your Page
          </h1>
        </div>
      </header>
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Your content */}
      </main>
    </div>
  );
}
```

### Change Sidebar Width

In `sidebar.tsx`, update these values:

```tsx
// Sidebar component
isCollapsed ? "w-16" : "w-60"  // Change w-60 to w-72, w-80, etc.

// SidebarLayout component
isCollapsed ? "ml-16" : "ml-60"  // Match the margin-left
```

### Change Colors

```tsx
// Background gradient
className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"

// Active item gradient
className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600"
```

## Export Details

The component exports three things:

```tsx
import {
  Sidebar,         // Main sidebar component
  SidebarLayout,   // Layout wrapper with state
  useSidebarState  // React hook for manual control
} from "@/components/layout/sidebar";
```

### Using the Hook Directly

If you want manual control:

```tsx
function MyLayout({ children }) {
  const { isCollapsed, toggleCollapsed, isMounted } = useSidebarState();

  return (
    <div>
      <Sidebar isCollapsed={isCollapsed} onToggle={toggleCollapsed} />
      <main className={isCollapsed ? "ml-16" : "ml-60"}>
        {children}
      </main>
    </div>
  );
}
```

## Page Template

Copy this template for new pages:

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
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Page Title
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Page description
          </p>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Your content here */}
      </main>
    </div>
  );
}
```

## Common Issues

### Issue: Page doesn't have sidebar

**Solution**: Ensure the page is in `src/app/(dashboard)/` directory

### Issue: Hydration mismatch warning

**Solution**: The component handles this with `isMounted` flag. If you still see warnings, clear your browser cache.

### Issue: State not persisting

**Solution**: Check browser console for localStorage errors. Ensure you're testing in a browser (not SSR).

### Issue: Icons not showing

**Solution**: Verify `lucide-react` is installed:
```bash
pnpm add lucide-react
```

## Next Steps

1. **Replace placeholders**: Add real content to Storage, Jobs, Flows, etc.
2. **Add user menu**: Add user profile dropdown in top bar
3. **Add breadcrumbs**: Show navigation path in page headers
4. **Add search**: Global search in sidebar or top bar
5. **Add notifications**: Bell icon with notification count

## Build & Deploy

```bash
# Development
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start
```

All pages build successfully with no errors.

---

**Status**: Ready to use
**Last updated**: 2025-10-19
