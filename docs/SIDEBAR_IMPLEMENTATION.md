# Sidebar Navigation Implementation

## Overview

A professional, collapsible left sidebar navigation component for the Keboola dashboard with smooth animations, persistent state, and mobile responsiveness.

## Features Implemented

### Core Features
- **Collapsible sidebar** - Toggle between expanded (240px) and collapsed (64px) states
- **Persistent state** - Collapsed state saved to localStorage
- **Smooth animations** - 300ms transitions for all state changes
- **Tooltips** - Icon-only navigation shows tooltips when collapsed
- **Active state highlighting** - Blue/purple gradient for current route
- **Hover effects** - Subtle gradient effects on non-active items
- **Mobile responsive** - Auto-collapses on screens < 768px

### Design
- **Width**: 240px (expanded), 64px (collapsed)
- **Background**: Dark gradient (gray-900 → gray-800 → gray-900)
- **Active indicator**: Blue/purple gradient + white border on right edge
- **Icons**: Lucide React icons (5x5 size)
- **Typography**: 14px labels, semibold logo

## File Structure

```
src/
├── components/
│   └── layout/
│       └── sidebar.tsx              # Main sidebar component
├── app/
│   └── (dashboard)/                 # Route group with shared sidebar layout
│       ├── layout.tsx               # Applies sidebar to all routes
│       ├── dashboard/page.tsx       # Dashboard page
│       ├── storage/page.tsx         # Storage page (placeholder)
│       ├── jobs/page.tsx            # Jobs page (placeholder)
│       ├── flows/page.tsx           # Flows page (placeholder)
│       ├── transformations/page.tsx # Transformations page (placeholder)
│       ├── data-apps/page.tsx       # Data Apps page (placeholder)
│       └── settings/page.tsx        # Settings page (placeholder)
```

## Components Exported

### 1. `Sidebar` Component

Main sidebar component with navigation items and toggle button.

```typescript
interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

function Sidebar({ isCollapsed, onToggle }: SidebarProps)
```

**Usage:**
```tsx
import { Sidebar } from "@/components/layout/sidebar";

<Sidebar isCollapsed={false} onToggle={() => {}} />
```

### 2. `SidebarLayout` Component

Wrapper component that handles sidebar state and layout.

```typescript
interface SidebarLayoutProps {
  children: React.ReactNode;
}

function SidebarLayout({ children }: SidebarLayoutProps)
```

**Usage:**
```tsx
import { SidebarLayout } from "@/components/layout/sidebar";

export default function Layout({ children }) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
```

### 3. `useSidebarState` Hook

React hook for managing sidebar state with localStorage persistence.

```typescript
function useSidebarState(): {
  isCollapsed: boolean;
  toggleCollapsed: () => void;
  isMounted: boolean;
}
```

**Returns:**
- `isCollapsed` - Current collapsed state
- `toggleCollapsed` - Function to toggle the state
- `isMounted` - Whether component has mounted (prevents hydration mismatch)

## Navigation Items

| Label | Route | Icon |
|-------|-------|------|
| Dashboard | `/dashboard` | Home |
| Storage | `/storage` | Database |
| Jobs | `/jobs` | Briefcase |
| Flows | `/flows` | Workflow |
| Transformations | `/transformations` | Code |
| Data Apps | `/data-apps` | AppWindow |
| Settings | `/settings` | Settings |

## Integration Guide

### Step 1: Apply to Route Group

Create a layout file in your route group:

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

### Step 2: Create Pages

All pages in the `(dashboard)` route group will automatically get the sidebar:

```tsx
// src/app/(dashboard)/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
        {/* Page header */}
      </header>
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Page content */}
      </main>
    </div>
  );
}
```

### Step 3: Adjust Page Styling

Remove max-width containers from pages as the sidebar already provides layout structure:

**Before:**
```tsx
<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
```

**After:**
```tsx
<main className="px-4 sm:px-6 lg:px-8 py-8">
```

## Styling Details

### Collapsed State
- Width: 64px (w-16)
- Shows only icons + logo
- Tooltips appear on hover
- Toggle button shows ChevronRight icon

### Expanded State
- Width: 240px (w-60)
- Shows icons + labels
- No tooltips needed
- Toggle button shows ChevronLeft icon + "Collapse" label

### Active Item
```css
background: linear-gradient(to right, #2563eb, #3b82f6, #9333ea);
box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.2);
```

### Hover Effect (Non-active)
```css
background: rgba(31, 41, 55, 0.5); /* gray-800/50 */
gradient overlay: from-blue-600/10 via-blue-500/10 to-purple-600/10
```

## Mobile Responsiveness

- Breakpoint: 768px (md)
- Behavior: Auto-collapses on mobile
- Event listener: Window resize
- Cleanup: Removes listener on unmount

## LocalStorage Key

```typescript
const STORAGE_KEY = "keboola-sidebar-collapsed";
```

Stores: `"true"` or `"false"` as string

## Z-Index Layers

```css
sidebar: z-50
page header: z-40
other elements: default
```

## Dependencies

- `next/link` - Client-side navigation
- `next/navigation` - usePathname hook
- `lucide-react` - Icon components
- `@/components/ui/tooltip` - shadcn/ui tooltip
- `@/components/ui/button` - shadcn/ui button
- `@/lib/utils` - cn utility (class merging)

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support

Animations use CSS transitions (widely supported).

## Accessibility

- **Keyboard navigation**: All links are keyboard accessible
- **ARIA labels**: Toggle button has descriptive aria-label
- **Focus indicators**: Default browser focus styles maintained
- **Screen readers**: Tooltips provide context when collapsed

## Performance

- **Hydration safe**: Uses isMounted flag to prevent SSR/client mismatch
- **Minimal re-renders**: State isolated to sidebar component
- **Smooth animations**: Hardware-accelerated transitions
- **LocalStorage**: Synchronous, minimal overhead

## Customization

### Adding New Navigation Items

Edit the `navigationItems` array in `sidebar.tsx`:

```typescript
const navigationItems: NavItem[] = [
  // ... existing items
  { label: "New Page", href: "/new-page", icon: YourIcon },
];
```

### Changing Colors

Update the gradient classes:

```tsx
// Active state
className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600"

// Hover gradient
className="from-blue-600/10 via-blue-500/10 to-purple-600/10"
```

### Adjusting Widths

```tsx
// In sidebar.tsx
isCollapsed ? "w-16" : "w-60"  // Change w-60 to your desired width

// In SidebarLayout
isCollapsed ? "ml-16" : "ml-60"  // Match the margin-left
```

## Testing Checklist

- [x] Build succeeds without errors
- [x] Sidebar renders on all pages
- [x] Toggle button collapses/expands sidebar
- [x] State persists after page refresh
- [x] Active state highlights correct route
- [x] Tooltips show when collapsed
- [x] Mobile auto-collapse works
- [x] All navigation links work
- [x] Smooth animations on all transitions
- [x] No hydration warnings in console

## Next Steps

To add real content to placeholder pages:

1. **Storage page**: Add bucket/table list components
2. **Jobs page**: Add job monitoring table
3. **Flows page**: Add flow list and execution controls
4. **Transformations**: Add transformation management UI
5. **Data Apps**: Add data app deployment UI
6. **Settings**: Add project settings forms

## Troubleshooting

### Hydration Mismatch Warning

If you see a hydration warning, ensure `isMounted` check is in place:

```tsx
if (!isMounted) {
  return <div className="min-h-screen">...</div>;
}
```

### LocalStorage Not Persisting

Check browser console for errors. Ensure localStorage is available:

```typescript
if (typeof window !== 'undefined') {
  localStorage.setItem(STORAGE_KEY, value);
}
```

### Icons Not Showing

Verify Lucide React is installed:

```bash
pnpm add lucide-react
```

### Tooltips Not Appearing

Check that shadcn/ui tooltip is installed:

```bash
npx shadcn@latest add tooltip
```

## Screenshots

### Expanded State
- Full width sidebar with icons + labels
- Active route highlighted with gradient
- Logout button in top bar

### Collapsed State
- Icon-only sidebar (64px wide)
- Tooltips on hover
- More screen space for content

### Mobile View
- Auto-collapsed sidebar
- Touch-friendly navigation
- Responsive layout

---

**Created**: 2025-10-19
**Version**: 1.0.0
**Status**: Complete and tested
