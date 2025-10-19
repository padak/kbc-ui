# Implementation Plan

**Date:** 2025-10-19
**Repository:** https://github.com/padak/kbc-ui
**Status:** Ready to start

---

## Questions Answered

### Do we need existing code?

**Answer: NO - docs are enough**

The existing codebase analysis in `/docs` provides all the knowledge needed:
- ✅ API contracts documented
- ✅ Feature requirements captured
- ✅ User workflows understood
- ✅ Component patterns identified

**Strategy:**
1. Move `/docs` to new repo (reference)
2. Build fresh from scratch (no legacy code)
3. Reference docs when implementing features
4. Use existing API endpoints (backend stays same)

**Benefits:**
- Clean start, no tech debt
- Faster development (no refactoring)
- Modern patterns from day 1

---

## Local Development Setup

**Answer: YES - Run locally, skip Vercel**

```bash
# Development workflow
git clone https://github.com/padak/kbc-ui
cd kbc-ui
pnpm install
pnpm dev

# Opens at http://localhost:3000
```

**Hot reload:** Changes appear instantly
**No deployment:** Work fully offline
**Fast iteration:** See changes in <1 second

**Vercel:** Add later when ready to share publicly

---

## Build Steps

### 1. Repository Setup (10 min)
```bash
cd /path/to/new/repo
pnpm create next-app@latest . --typescript --tailwind --app --no-src
pnpm install
```

### 2. Copy Documentation (2 min)
```bash
cp -r /Users/padak/github/kbc-ui/docs ./docs
```

### 3. Install shadcn/ui (5 min)
```bash
pnpm dlx shadcn-ui@latest init
pnpm dlx shadcn-ui@latest add button card badge input
```

### 4. Create Font Options Deck (15 min)
HTML file showcasing:
- System fonts (default)
- Inter (Google Fonts)
- Roboto (Google Fonts)
- Public Sans (Google Fonts)
- Work Sans (Google Fonts)

### 5. Build Login Screen (45 min)
- Stack URL selector
- Token input
- Validation
- Local storage save

### 6. Build Dashboard (2-3 hours)
- 4 metric cards
- Recent activity
- Active jobs table
- API integration
- Polling setup

### 7. Test Locally (15 min)
- Enter real token
- Verify API calls
- Check polling
- Test error states

---

## File Structure (New Repo)

```
kbc-ui/
├── docs/                      # Copied from analysis repo
│   ├── instructions/          # Build specs
│   ├── 01-overview/          # Reference material
│   ├── 02-modules/           # Feature details
│   └── 06-api-contracts/     # API docs
├── app/
│   ├── login/
│   │   └── page.tsx          # Login screen
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Tailwind imports
├── components/
│   ├── ui/                   # shadcn/ui components
│   └── dashboard/            # Dashboard components
├── lib/
│   ├── api/                  # API client
│   │   ├── client.ts         # Base fetch wrapper
│   │   └── endpoints.ts      # API functions
│   └── utils.ts              # Utilities
├── public/
│   └── font-options.html     # Font preview deck
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## What to Copy from Old Repo

**Copy:**
- ✅ `/docs` folder (all documentation)
- ✅ Package.json dependencies (reference only)
- ✅ API client types (if useful)

**Don't Copy:**
- ❌ Source code (`/src`, `/apps`)
- ❌ Build configs (Rspack, etc)
- ❌ Node modules
- ❌ Legacy state management (Flux, Immutable.js)

**Why:** Fresh start = faster than refactoring

---

## Timeline

**Session 1 (Today - 4 hours):**
- ✅ Docs updated with decisions
- [ ] Scaffold Next.js project (10 min)
- [ ] Install dependencies (5 min)
- [ ] Copy docs folder (2 min)
- [ ] Create font options (15 min)
- [ ] Build login screen (45 min)
- [ ] Build dashboard shell (1 hour)
- [ ] Integrate API (1 hour)
- [ ] Test locally (15 min)

**Session 2 (Next - 2 hours):**
- [ ] Padak picks font
- [ ] Padak reviews dashboard
- [ ] Iterate on feedback
- [ ] Polish UI

**Session 3 (Future - ongoing):**
- [ ] Add Storage feature
- [ ] Add Jobs feature
- [ ] Add Flows feature
- [ ] Continue per feature specs

---

## Ready to Start?

**Confirmed:**
- ✅ New repo: https://github.com/padak/kbc-ui
- ✅ Local development only
- ✅ Docs are sufficient (no need for existing code)
- ✅ Fresh Next.js build
- ✅ All specs approved

**Next command:** Scaffold the project!

**Say "start building" and I'll begin!**
