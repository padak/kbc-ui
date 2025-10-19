# Keboola Connection UI Documentation

This folder contains all documentation for building the **new Keboola Connection UI**.

## Structure

```
docs/
├── instructions/         # 🔨 BUILD SPECS - Use these to build new features
│   ├── INITIAL_PROMPT.md
│   ├── technical-stack.md       ✅ Implementation status
│   ├── dashboard-spec.md        📋 Dashboard specification
│   ├── auth-flow.md            🔐 Authentication flow
│   ├── design-system.md        🎨 Design system
│   └── implementation-plan.md  📝 Build plan
│
└── old-ui-research/      # 📚 REFERENCE - Use these when building features
    ├── 02-modules/              49 module analyses (extractors, writers, flows)
    ├── 06-api-contracts/        API clients, endpoints, patterns
    ├── 04-components/           Design system components
    ├── 05-workflows/            User workflows with screenshots
    └── 07-state-management/     State patterns and migration guides
```

---

## 🔨 Building New Features? Use This Workflow

### Example: Building the Storage Page

**Step 1: Read the Build Spec**
- Check if there's a spec in `instructions/` (there isn't one yet for Storage)

**Step 2: Research the Old Implementation**
1. **Module Analysis:** Read `old-ui-research/02-modules/storage.md`
   - Understand current features
   - See component structure
   - Review state management patterns

2. **API Contracts:** Check `old-ui-research/06-api-contracts/api-clients.md`
   - Find Storage API endpoints
   - Understand request/response format
   - See authentication headers

3. **User Workflows:** Review `old-ui-research/05-workflows/02-storage-operations.md`
   - See how users navigate buckets/tables
   - Understand common operations
   - View UI screenshots

4. **Components:** Check `old-ui-research/04-components/`
   - See which components are used
   - Understand patterns (tables, modals, etc.)

**Step 3: Build the New Version**
- Use modern stack (Next.js 15, shadcn/ui)
- Reference old API contracts but use TanStack Query
- Simplify UX based on user workflow insights
- Use design system tokens from `src/app/globals.css`

---

## 📚 How to Use Old UI Research

The `old-ui-research/` folder contains **109 files** documenting the original UI. Here's how to use it:

### When Building a New Feature

✅ **DO:**
- Read the module documentation to understand functionality
- Copy API endpoint URLs and data structures
- Learn from user workflows to improve UX
- Reference component patterns for consistency
- Check state management patterns for complex features

❌ **DON'T:**
- Copy old code directly (it uses Flux, Immutable.js, class components)
- Replicate old UI exactly (we're modernizing!)
- Copy complex state patterns (use TanStack Query instead)

### Quick Reference Guide

| Building... | Read these files... |
|-------------|---------------------|
| **Storage page** | `old-ui-research/02-modules/storage.md`, `old-ui-research/05-workflows/02-storage-operations.md`, `old-ui-research/06-api-contracts/api-clients.md` |
| **Flows page** | `old-ui-research/02-modules/flows-v2.md`, `old-ui-research/05-workflows/03-flow-creation-execution.md` |
| **Dashboard** | `old-ui-research/02-modules/home.md`, `old-ui-research/05-workflows/01-dashboard-navigation.md` |
| **Extractors** | `old-ui-research/02-modules/EXTRACTORS_INDEX.md`, specific extractor files |
| **Writers** | `old-ui-research/02-modules/WRITERS_OVERVIEW.md`, specific writer files |
| **Transformations** | `old-ui-research/02-modules/transformations-v2.md`, `old-ui-research/05-workflows/04-transformation-workflow.md` |
| **API integration** | `old-ui-research/06-api-contracts/api-clients.md`, `old-ui-research/06-api-contracts/api-patterns.md` |
| **Components** | `old-ui-research/04-components/INDEX.md`, specific component files |
| **State patterns** | `old-ui-research/07-state-management/state-architecture.md` |

### Key Files for Common Tasks

**Understanding APIs:**
- `old-ui-research/06-api-contracts/api-clients.md` - All 14 API clients documented
- `old-ui-research/06-api-contracts/api-patterns.md` - Request/response patterns

**Understanding Features:**
- `old-ui-research/03-features/feature-catalog.md` - All 121 features listed
- `old-ui-research/03-features/complexity-assessment.md` - Effort estimates

**Understanding User Needs:**
- `old-ui-research/05-workflows/*.md` - Real user workflows with screenshots
- `old-ui-research/03-features/user-journeys.md` - User personas and pain points

---

## 🎯 Quick Start

**Building a new feature?**
1. Check `instructions/` for a spec (if it exists)
2. Research in `old-ui-research/` to understand requirements
3. Build with modern stack per `instructions/technical-stack.md`
4. Reference design system in `/design-system.html`

**Stuck on implementation?**
- Search `old-ui-research/02-modules/` for the relevant module
- Check `old-ui-research/06-api-contracts/` for API details
- Review `old-ui-research/05-workflows/` for user flows

---

## 📊 Project Status

**Implemented:**
- ✅ Next.js 15 + React 19 + TypeScript
- ✅ Login page with authentication
- ✅ Dashboard preview (static data)
- ✅ Design system with change management
- ✅ shadcn/ui component library

**Next Steps:**
1. Integrate TanStack Query for API calls
2. Add real dashboard data with polling
3. Build Storage page (buckets/tables)
4. Build Flows page
5. Build Jobs monitoring page

---

**Repository:** https://github.com/padak/kbc-ui
**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui
**Start Development:** `pnpm dev` or `make dev`
