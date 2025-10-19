# Technical Stack Decisions

**Date:** 2025-10-19
**Status:** Proposed (pending approval)

---

## Core Framework

**Next.js 14+ with App Router**
- ✅ Server components for better performance
- ✅ Built-in routing, API routes if needed
- ✅ Excellent TypeScript support
- ✅ Vercel deployment (zero config)
- ✅ Image optimization, font optimization out of the box

**TypeScript 5.9+**
- Strict mode enabled
- Full type safety across app

---

## Styling & Design System

**Tailwind CSS 3+**
- ✅ Utility-first, fast development
- ✅ Small bundle size (only ships used classes)
- ✅ Excellent with component libraries
- ✅ Easy to customize via config

**Component Library: shadcn/ui**
- ✅ Copy/paste components (you own the code)
- ✅ Built on Radix UI (accessibility built-in)
- ✅ Tailwind-based, fully customizable
- ✅ No runtime dependency, just source code
- ✅ 50+ pre-built components

**Icons: Lucide React**
- ✅ 1000+ MIT-licensed icons
- ✅ Consistent design language
- ✅ Tree-shakeable (only import what you use)
- ✅ Actively maintained
- ✅ Easy to use: `<Database className="w-4 h-4" />`

**Alternative Icon Options:**
- Heroicons (smaller set, also excellent)
- Phosphor Icons (more variety)
- Tabler Icons (clean, modern)

**Recommendation:** Start with Lucide, switch if needed

---

## Data Fetching & State

**TanStack Query (React Query) v5**
- ✅ Server state management
- ✅ Automatic caching, refetching, polling
- ✅ Optimistic updates
- ✅ Perfect for API client
- ✅ DevTools for debugging

**Zustand (if needed for client state)**
- ✅ Minimal, simple API
- ✅ No boilerplate
- ✅ TypeScript-first
- ✅ DevTools available

**Note:** Start with TanStack Query only, add Zustand if complex client state emerges

---

## API Client

**Native Fetch + TanStack Query**
- Wrap fetch in typed functions
- Use TanStack Query for caching/state
- Add interceptors for auth tokens

```typescript
// Example structure
const apiClient = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: () => ({
    'X-StorageApi-Token': getToken(),
  })
}
```

---

## Form Handling

**React Hook Form + Zod**
- ✅ Minimal re-renders
- ✅ Schema validation with Zod
- ✅ TypeScript inference
- ✅ Works great with shadcn/ui

---

## Testing

**Vitest (Unit/Component)**
- ✅ Fast, Vite-powered
- ✅ Jest-compatible API
- ✅ TypeScript support

**Playwright (E2E)**
- ✅ Cross-browser
- ✅ Auto-wait, reliable
- ✅ Great debugging tools

---

## Deployment

**Local Development (Phase 1)**
- ✅ `pnpm dev` for local development
- ✅ No deployment needed initially
- ✅ Fast iteration and feedback

**Vercel (Future)**
- Will add later for staging/production
- Zero-config Next.js deployment
- Automatic preview deployments

---

## Repository Structure

```
keboola-ui-next/              # New repository
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── dashboard/
│   │   ├── storage/
│   │   └── layout.tsx
│   ├── components/           # Reusable components
│   │   ├── ui/              # shadcn/ui components
│   │   └── dashboard/       # Feature components
│   ├── lib/                 # Utilities
│   │   ├── api/            # API client functions
│   │   └── utils.ts
│   └── types/               # TypeScript types
├── public/                   # Static assets
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Environment Variables

```bash
# .env.local (local development)
NEXT_PUBLIC_STORAGE_API_URL=https://connection.keboola.com
NEXT_PUBLIC_QUEUE_API_URL=https://queue.keboola.com
NEXT_PUBLIC_BILLING_API_URL=https://billing.keboola.com
```

**Auth:** Storage API Token (passed in X-StorageApi-Token header)

---

## Package Manager

**pnpm (Recommended)**
- ✅ Faster than npm/yarn
- ✅ Disk space efficient
- ✅ Strict dependency resolution

**Alternative:** npm (if team preference)

---

## AI Features (Future)

**Vercel AI SDK**
- For AI chat interface
- Streaming responses
- React hooks for chat UI

**Note:** Start without AI, add when Flows feature needs it

---

## Decision Summary

| Category | Choice | Why |
|----------|--------|-----|
| Framework | Next.js 14 | Performance, DX, deployment |
| Styling | Tailwind CSS | Fast, flexible, small bundle |
| Components | shadcn/ui | Own the code, accessible |
| Icons | Lucide React | Comprehensive, MIT, tree-shakeable |
| Data | TanStack Query | Perfect for API client |
| Forms | React Hook Form | Performance, DX |
| Validation | Zod | TypeScript inference |
| Testing | Vitest + Playwright | Fast, reliable |
| Deployment | Vercel | Zero-config, fast |
| Package Mgr | pnpm | Speed, efficiency |

---

## Alternatives Considered

**Why not Vite + React Router?**
- Next.js provides more out of the box (routing, optimization)
- App Router offers better performance with Server Components

**Why not Material UI / Ant Design?**
- Heavier bundles
- Harder to customize
- shadcn/ui gives you source code ownership

**Why not CSS Modules / Styled Components?**
- Tailwind faster for iteration
- Better tree-shaking
- More consistent design system

---

**Status:** ✅ APPROVED - Ready to implement
