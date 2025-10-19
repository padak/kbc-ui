# Technical Stack Decisions

**Date:** 2025-10-19
**Status:** ✅ IMPLEMENTED
**Repository:** https://github.com/padak/kbc-ui

---

## Core Framework

**Next.js 15.5.6 with App Router**
- ✅ Server components for better performance
- ✅ Built-in routing, API routes if needed
- ✅ Excellent TypeScript support
- ✅ Vercel deployment (zero config)
- ✅ Image optimization, font optimization out of the box
- ✅ **Implemented:** Login page, Dashboard page
- ✅ **Implemented:** Authentication flow with auto-redirect

**TypeScript 5.9.3**
- ✅ Strict mode enabled
- ✅ Full type safety across app
- ✅ **Implemented:** Type-safe API client, auth utilities

**React 19.2.0**
- ✅ Latest stable version
- ✅ Improved performance and concurrent features

---

## Styling & Design System

**Tailwind CSS 3.4.18**
- ✅ Utility-first, fast development
- ✅ Small bundle size (only ships used classes)
- ✅ Excellent with component libraries
- ✅ Easy to customize via config
- ✅ **Implemented:** Configured with Keboola design tokens

**Component Library: shadcn/ui**
- ✅ Copy/paste components (you own the code)
- ✅ Built on Radix UI (accessibility built-in)
- ✅ Tailwind-based, fully customizable
- ✅ No runtime dependency, just source code
- ✅ 50+ pre-built components
- ✅ **Implemented:** Button, Card, Badge, Input, Select

**Design System Strategy**
- ✅ **Implemented:** CSS Custom Properties (design tokens)
- ✅ **Implemented:** `design-system.html` - Visual design system preview
- ✅ **Primary Color:** Keboola Blue (#1F8FFF)
- ✅ **Change Management:** Update tokens in one place → all components update
- ✅ **File:** `src/app/globals.css` - Single source of truth for design tokens

**Icons: Lucide React 0.546.0**
- ✅ 1000+ MIT-licensed icons
- ✅ Consistent design language
- ✅ Tree-shakeable (only import what you use)
- ✅ Actively maintained
- ✅ Easy to use: `<Database className="w-4 h-4" />`
- ✅ **Implemented:** Ready to use (imported via shadcn/ui)

---

## Data Fetching & State

**TanStack Query (React Query) v5** - Planned
- ✅ Server state management
- ✅ Automatic caching, refetching, polling
- ✅ Optimistic updates
- ✅ Perfect for API client
- ✅ DevTools for debugging
- ⏳ **Status:** To be added when implementing dashboard API calls

**Zustand** - Planned (if needed for client state)
- ✅ Minimal, simple API
- ✅ No boilerplate
- ✅ TypeScript-first
- ✅ DevTools available
- ⏳ **Status:** Add only if complex client state emerges

**Current Implementation:**
- ✅ **Implemented:** Native fetch for auth validation
- ✅ **Implemented:** Local storage for session persistence
- ⏳ **Next:** Add TanStack Query for dashboard data polling

---

## API Client

**Current: Native Fetch**
- ✅ **Implemented:** Type-safe auth validation function
- ✅ **Implemented:** Stack URL + API token configuration
- ✅ **File:** `src/lib/api/auth.ts`

```typescript
// Implemented
export async function validateToken(stackUrl: string, token: string): Promise<boolean> {
  const response = await fetch(`${stackUrl}/v2/storage`, {
    headers: {
      'X-StorageApi-Token': token,
      'Content-Type': 'application/json',
    },
  });
  return response.ok;
}
```

**Planned: TanStack Query Integration**
- ⏳ Wrap fetch in typed functions
- ⏳ Use TanStack Query for caching/state
- ⏳ Add interceptors for auth tokens
- ⏳ Implement polling (5s for jobs, 30s for stats)

---

## Form Handling

**React Hook Form + Zod** - Planned
- ✅ Minimal re-renders
- ✅ Schema validation with Zod
- ✅ TypeScript inference
- ✅ Works great with shadcn/ui
- ⏳ **Status:** To be added when building complex forms

**Current Implementation:**
- ✅ **Implemented:** Basic form handling in login page
- ✅ **Implemented:** Client-side validation
- ⏳ **Next:** Add React Hook Form + Zod for advanced forms

---

## Testing

**Vitest (Unit/Component)** - Planned
- ✅ Fast, Vite-powered
- ✅ Jest-compatible API
- ✅ TypeScript support
- ⏳ **Status:** To be added after core features complete

**Playwright (E2E)** - Planned
- ✅ Cross-browser
- ✅ Auto-wait, reliable
- ✅ Great debugging tools
- ⏳ **Status:** To be added for critical user flows

**Current:**
- ✅ **Implemented:** Manual testing via `pnpm dev`
- ✅ **Implemented:** Build verification via `pnpm build`

---

## Deployment

**Local Development (Current)**
- ✅ **Implemented:** `pnpm dev` for local development
- ✅ **Implemented:** `pnpm build` for production builds
- ✅ **Implemented:** Makefile for common commands
- ✅ No deployment needed initially
- ✅ Fast iteration and feedback

**Vercel (Future)**
- ⏳ Will add later for staging/production
- ⏳ Zero-config Next.js deployment
- ⏳ Automatic preview deployments

---

## Repository Structure

```
kbc-ui-padak/                          # ✅ Implemented
├── src/
│   ├── app/                           # ✅ Next.js App Router
│   │   ├── login/page.tsx            # ✅ Login page
│   │   ├── dashboard/page.tsx        # ✅ Dashboard page
│   │   ├── page.tsx                  # ✅ Home (auth redirect)
│   │   ├── layout.tsx                # ✅ Root layout
│   │   └── globals.css               # ✅ Design tokens
│   ├── components/                    # ✅ Reusable components
│   │   └── ui/                       # ✅ shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── badge.tsx
│   │       ├── input.tsx
│   │       └── select.tsx
│   └── lib/                          # ✅ Utilities
│       ├── api/                      # ✅ API client functions
│       │   └── auth.ts               # ✅ Auth utilities
│       └── utils.ts                  # ✅ Utility functions
├── docs/                             # ✅ Documentation
│   └── instructions/                 # ✅ Build specs
├── old-ui-research/                  # ✅ Legacy UI docs
├── public/                           # ✅ Static assets
├── design-system.html                # ✅ Design system preview
├── Makefile                          # ✅ Dev commands
├── tailwind.config.ts                # ✅ Tailwind config
├── tsconfig.json                     # ✅ TypeScript config
├── components.json                   # ✅ shadcn/ui config
└── package.json                      # ✅ Dependencies
```

---

## Environment Variables

**Current Implementation:**
- ✅ Stack URLs hardcoded in UI (user selects from dropdown)
- ✅ API token stored in localStorage
- ✅ No .env needed for MVP

**Future (when deploying):**
```bash
# .env.local (local development)
NEXT_PUBLIC_DEFAULT_STACK_URL=https://connection.keboola.com
```

**Auth:** Storage API Token (passed in X-StorageApi-Token header)

---

## Package Manager

**pnpm 10.15.0** - ✅ Implemented
- ✅ Faster than npm/yarn
- ✅ Disk space efficient
- ✅ Strict dependency resolution
- ✅ **Implemented:** All dependencies installed via pnpm

---

## AI Features (Future)

**Vercel AI SDK**
- For AI chat interface
- Streaming responses
- React hooks for chat UI

**Note:** Start without AI, add when Flows feature needs it

---

## Decision Summary

| Category | Choice | Version | Status |
|----------|--------|---------|--------|
| Framework | Next.js | 15.5.6 | ✅ Implemented |
| React | React | 19.2.0 | ✅ Implemented |
| Language | TypeScript | 5.9.3 | ✅ Implemented |
| Styling | Tailwind CSS | 3.4.18 | ✅ Implemented |
| Components | shadcn/ui | Latest | ✅ 5 components |
| Icons | Lucide React | 0.546.0 | ✅ Implemented |
| Data | TanStack Query | v5 | ⏳ Planned |
| Forms | React Hook Form | Latest | ⏳ Planned |
| Validation | Zod | Latest | ⏳ Planned |
| Testing | Vitest + Playwright | Latest | ⏳ Planned |
| Linting | ESLint | 9.38.0 | ✅ Implemented |
| Deployment | Local/Vercel | N/A | ✅ Local only |
| Package Mgr | pnpm | 10.15.0 | ✅ Implemented |

---

## Implemented Features

✅ **Core Infrastructure**
- Next.js 15 with App Router
- TypeScript strict mode
- Tailwind CSS with custom design tokens
- ESLint 9 configuration

✅ **Authentication**
- Login page with Stack URL selection
- API token validation
- Local storage persistence
- Auto-redirect based on auth state

✅ **UI Components**
- shadcn/ui: Button, Card, Badge, Input, Select
- Design system with CSS custom properties
- Keboola blue (#1F8FFF) theme
- Responsive layouts

✅ **Pages**
- Login page (`/login`)
- Dashboard page (`/dashboard`) - preview with static data
- Home page (`/`) - auth redirect logic

✅ **Developer Experience**
- Makefile with common commands
- Design system preview (`design-system.html`)
- Type-safe API utilities
- Build verification

---

## Next Steps

⏳ **Phase 1: API Integration**
1. Add TanStack Query
2. Implement real dashboard API calls
3. Add polling (5s jobs, 30s stats)
4. Error handling and loading states

⏳ **Phase 2: Additional Features**
1. Storage page (tables/buckets)
2. Flows page (list/detail)
3. Jobs page (monitoring)
4. React Hook Form + Zod for complex forms

⏳ **Phase 3: Testing & Deployment**
1. Add Vitest for unit tests
2. Add Playwright for E2E tests
3. Deploy to Vercel
4. Set up CI/CD

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

**Status:** ✅ FOUNDATION COMPLETE - Ready for feature development
**Repository:** https://github.com/padak/kbc-ui
**Start development:** `pnpm dev` or `make dev`
