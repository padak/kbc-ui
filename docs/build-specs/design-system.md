# Design System

**Approach:** Build as we go (no upfront design needed)
**Foundation:** Tailwind CSS + shadcn/ui

---

## Color Palette

### Brand (Keboola)
```typescript
primary: '#1F8FFF',      // Keboola blue
primaryDark: '#0070E0',  // Darker shade (hover states)
primaryLight: '#60B0FF', // Lighter shade (backgrounds)
```

### Functional Colors (Status)
```typescript
success: '#10B981',   // Green-500
warning: '#F59E0B',   // Amber-500
error: '#EF4444',     // Red-500
info: '#3B82F6',      // Blue-500
```

### Neutrals (Tailwind Defaults)
```typescript
gray-50 to gray-950   // Use for text, backgrounds, borders
```

---

## Typography

**Font Family:**
- System font stack (for now)
- See font-options.html for alternatives to choose from

**System Font Stack:**
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
             'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
             'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
```

**Scale (Tailwind):**
- text-xs: 12px
- text-sm: 14px
- text-base: 16px (body)
- text-lg: 18px
- text-xl: 20px (headings)
- text-2xl: 24px (page titles)

**Weight:**
- font-normal: 400 (body)
- font-medium: 500 (emphasis)
- font-semibold: 600 (headings)
- font-bold: 700 (strong emphasis)

---

## Spacing

**Use Tailwind Scale:**
- 1 unit = 4px
- Common: 2 (8px), 4 (16px), 6 (24px), 8 (32px)

**Component Spacing:**
- Card padding: p-6 (24px)
- Section gaps: gap-8 (32px)
- Element gaps: gap-4 (16px)

---

## Components

**Source:** shadcn/ui (copy/paste as needed)

### Core Components Needed

**Already available via shadcn/ui:**
- Button
- Card
- Badge
- Table
- Input
- Select
- Dialog
- Dropdown Menu
- Toast (notifications)
- Skeleton (loading)
- Alert
- Separator
- Avatar
- Tabs

### Component Variants

**Button:**
```tsx
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
```

**Badge (Status):**
```tsx
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="default">Default</Badge>
```

---

## Icons

**Library:** Lucide React

**Common Icons Needed:**
- Database (storage)
- Activity (jobs)
- Workflow (flows)
- Users (team)
- Settings
- ChevronRight (navigation)
- AlertCircle (errors)
- CheckCircle (success)
- Clock (time)
- Play (run job)
- X (close)

**Usage:**
```tsx
import { Database, Activity } from 'lucide-react'

<Database className="w-4 h-4 text-gray-500" />
```

**Size Convention:**
- Small: w-4 h-4 (16px)
- Medium: w-5 h-5 (20px)
- Large: w-6 h-6 (24px)

---

## Layout

**Max Width:** 1280px (container)
**Breakpoints (Tailwind):**
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

**Grid:**
- Use CSS Grid for cards
- grid-cols-1 (mobile)
- grid-cols-2 (tablet)
- grid-cols-4 (desktop)

---

## Dark Mode

**Phase 1:** Light mode only
**Phase 2:** Add dark mode toggle (Tailwind makes this easy)

---

## Accessibility

**Focus States:**
- Use Tailwind's `focus-visible:` utilities
- Visible outline on keyboard navigation

**Color Contrast:**
- Text: WCAG AA minimum (4.5:1)
- Large text: 3:1
- Use tools: https://contrast-ratio.com

**Touch Targets:**
- Minimum 44x44px for interactive elements

---

## Installation

```bash
# Install shadcn/ui components as needed
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
# etc.
```

Components are copied to `src/components/ui/` (you own the code)

---

## Notes

- No need to design everything upfront
- Install shadcn/ui components as you build features
- Customize via `tailwind.config.ts` when needed
- Keep it simple, iterate based on real usage

---

**Status:** Ready to start building
