# Features Quick Start Guide

Quick setup and usage guide for all dashboard features built for the Keboola UI rebuild.

**Last Updated**: 2025-10-19

---

## Table of Contents

1. [Sidebar Navigation](#sidebar-navigation)
2. [AI Chat Interface](#ai-chat-interface)
3. [Common Commands](#common-commands)

---

## Sidebar Navigation

### What You Got

A professional, collapsible left sidebar with:
- ✅ Smooth collapse/expand animations
- ✅ Persistent state (localStorage)
- ✅ Tooltips when collapsed
- ✅ Active route highlighting
- ✅ Mobile responsive (auto-collapse)
- ✅ 7 navigation items

### How to Use

**Start the dev server:**
```bash
pnpm dev
```

**Navigate to:** `http://localhost:3000/dashboard`

**Test features:**
1. **Toggle**: Click "Collapse" button at bottom of sidebar
2. **Navigation**: Click any menu item to navigate
3. **Tooltips**: Collapse sidebar, hover over icons
4. **Active state**: Notice gradient on current route
5. **Persistence**: Refresh page, state is preserved
6. **Mobile**: Resize window < 768px, sidebar auto-collapses

### Adding a New Page

**Step 1:** Add navigation item in `/src/components/layout/sidebar.tsx`:
```tsx
import { YourIcon } from "lucide-react";

const navigationItems: NavItem[] = [
  // ... existing items
  { label: "Your Page", href: "/your-page", icon: YourIcon },
];
```

**Step 2:** Create the page in `/src/app/(dashboard)/your-page/page.tsx`:
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
          <h1 className="text-2xl font-bold text-primary-500">
            Your Page Title
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

### Customization

**Change sidebar width:**
```tsx
// In sidebar.tsx
isCollapsed ? "w-16" : "w-60"  // Change w-60 to w-72, w-80, etc.

// Match margin in SidebarLayout
isCollapsed ? "ml-16" : "ml-60"
```

---

## AI Chat Interface

### What You Got

A beautiful AI chat interface with:
- ✨ Floating button with glow effects
- 💬 Command palette modal
- ⌨️ Keyboard shortcut: `⌘K`
- 💡 Smart suggestions
- 🎨 Modern design with gradients

### How to Use

**Start the dev server:**
```bash
pnpm dev
```

**Navigate to:** `http://localhost:3000/dashboard`

**Open AI Assistant:**
- **Option A**: Press `⌘K` (Mac) or `Ctrl+K` (Windows)
- **Option B**: Click the purple glowing button in bottom-right corner

**Try it out:**
- Type a question in the input field
- Click one of the suggested actions
- Press Enter to submit

### Visual Overview

**Floating Button** (bottom-right corner):
```
┌─────────────────────────────────────┐
│                                     │
│    Your Dashboard Content          │
│                                     │
│                              ╔════╗ │
│                              ║ ✨ ║ │ ← Glowing purple button
│                              ╚════╝ │
└─────────────────────────────────────┘
```

**Command Palette** (centered modal):
```
┌─────────────────────────────────────────┐
│  🎭 AI Assistant               ⌘K     │
├─────────────────────────────────────────┤
│  ┌───────────────────────────────────┐ │
│  │ Ask me anything...          [→]  │ │
│  └───────────────────────────────────┘ │
│  💡 SUGGESTED ACTIONS                  │
│  ┌───────────────────────────────────┐ │
│  │ ⚠️  Show me all failed jobs       │ │
│  └───────────────────────────────────┘ │
│  ┌───────────────────────────────────┐ │
│  │ 💾 What's using most storage?     │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `⌘K` (Mac) / `Ctrl+K` (Windows) | Open/close AI assistant |
| `Escape` | Close AI assistant |
| `Enter` | Submit query |

### Default Suggestions

1. **Show me all failed jobs** - View recent job failures
2. **What's using the most storage?** - Analyze storage consumption
3. **Run the daily sales flow** - Execute data pipeline
4. **Show recent activity** - View timeline of actions

### Adding a New Suggestion

Edit `/src/components/ai/ai-suggestions.tsx`:
```tsx
{
  id: "your-custom-action",
  icon: <YourIcon className="w-4 h-4" />,
  text: "Your action text here",
  description: "Detailed description",
  action: () => {
    // Your custom logic
    console.log("Custom action!");
  },
}
```

### Customization

**Change button position:**
```tsx
// In floating-chat-button.tsx
// Current: bottom-6 right-6
className="fixed bottom-6 right-6 ..."

// Top-right instead:
className="fixed top-6 right-6 ..."
```

**Modify colors:**
Uses existing CSS utilities in `src/app/globals.css`:
```css
.bg-gradient-ai          /* Purple → Blue */
.text-gradient-ai        /* Gradient text */
.glow-ai                /* Purple glow */
```

---

## Common Commands

### Development
```bash
# Start dev server
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start
```

### Design System
```bash
# View design system preview
make design-preview
```

### Testing Checklist

#### Sidebar
- [ ] Click toggle button → sidebar collapses/expands
- [ ] Navigate to different pages → active state updates
- [ ] Collapse sidebar → tooltips appear on hover
- [ ] Refresh page → state persists
- [ ] Resize to mobile → sidebar auto-collapses

#### AI Chat
- [ ] Click floating button → modal opens
- [ ] Press `⌘K` → modal opens
- [ ] Type in input → accepts text
- [ ] Press Enter → submits (shows loading)
- [ ] Click suggestion → triggers action
- [ ] Press Escape → closes modal
- [ ] Click outside → closes modal

---

## Troubleshooting

### Sidebar Issues

**Q: Sidebar doesn't appear**
A: Ensure your page is in `src/app/(dashboard)/` directory

**Q: State not persisting**
A: Check browser console for localStorage errors

**Q: Icons not showing**
A: Verify lucide-react is installed: `pnpm add lucide-react`

### AI Chat Issues

**Q: Button doesn't appear**
A: Check that FloatingChatButton is rendered in your component tree

**Q: Keyboard shortcut doesn't work**
A: Make sure you're focused on the page (click anywhere first)

**Q: Build fails**
A: Run `pnpm install` and `rm -rf .next` then rebuild

---

## Files Structure

```
src/
├── components/
│   ├── layout/
│   │   └── sidebar.tsx              # Sidebar component
│   └── ai/
│       ├── floating-chat-button.tsx # AI button
│       ├── command-palette.tsx      # AI modal
│       └── ai-suggestions.tsx       # Suggested actions
├── app/
│   └── (dashboard)/                 # Route group with sidebar
│       ├── layout.tsx               # Applies sidebar to all routes
│       ├── dashboard/page.tsx       # Dashboard
│       ├── storage/page.tsx         # Storage
│       ├── jobs/page.tsx            # Jobs
│       └── ...                      # Other pages
```

---

## What's Working vs What's Next

### ✅ Currently Working

**Sidebar:**
- [x] Collapsible navigation
- [x] Persistent state
- [x] Active route highlighting
- [x] Mobile responsive
- [x] Tooltips

**AI Chat:**
- [x] Floating button with animations
- [x] Command palette modal
- [x] Keyboard shortcuts
- [x] Suggested actions
- [x] Loading states

### ⏳ Not Yet Connected

**AI Chat:**
- [ ] Actual AI processing
- [ ] API integration
- [ ] Conversation history
- [ ] Streaming responses

---

## Next Steps

### Sidebar
1. Replace placeholder pages with real content
2. Add breadcrumbs to page headers
3. Add user menu to top bar
4. Add global search

### AI Chat
1. Connect to Claude API (2-4 hours)
2. Implement streaming responses
3. Add conversation history
4. Context-aware suggestions

---

**Status**: ✅ All features production-ready (UI complete)
**Next**: Connect AI backend for real functionality

For detailed implementation docs, see:
- `docs/FEATURES_IMPLEMENTATION.md` - Complete technical reference
- `docs/CODE_REFERENCE.md` - Code examples and patterns
