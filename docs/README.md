# Keboola Connection UI Documentation

This folder contains all documentation for building the **new Keboola Connection UI**.

## Structure

```
docs/
├── README.md             # 📖 This file - Documentation index
├── HISTORY.md            # 📜 Project history (Phases 1-7)
│
├── build-specs/          # 🔨 BUILD SPECS - Use these to build new features
│   ├── INITIAL_PROMPT.md
│   ├── technical-stack.md       ✅ Implementation status
│   ├── dashboard-spec.md        📋 Dashboard specification
│   ├── auth-flow.md            🔐 Authentication flow
│   ├── design-system.md        🎨 Design system
│   └── implementation-plan.md  📝 Build plan
│
├── implementation/       # 📝 IMPLEMENTATION GUIDES - Current implementation docs
│   ├── CODE_REFERENCE.md          Code organization guide
│   ├── DESIGN_SYSTEM_AUDIT.md     Design system details
│   ├── FEATURES_IMPLEMENTATION.md Feature implementation guide
│   ├── FEATURES_QUICK_START.md    Quick start guide
│   └── HOW-TO-CHANGE-DESIGN-SYSTEM.md Design change workflow
│
└── research/             # 📚 REFERENCE - Research material
    ├── legacy-ui/               Old Keboola UI research (109 files)
    │   ├── 02-modules/          49 module analyses
    │   ├── 06-api-contracts/    API clients and endpoints
    │   ├── 04-components/       Design system components
    │   ├── 05-workflows/        User workflows with screenshots
    │   └── 07-state-management/ State patterns
    └── new-ui/                  New UI research
        └── flows/               Flow Builder research (3 files)
```

---

## 🔨 Building New Features? Use This Workflow

### Example: Building the Storage Page

**Step 1: Read the Build Spec**
- Check if there's a spec in `build-specs/` (there isn't one yet for Storage)

**Step 2: Research the Old Implementation**
1. **Module Analysis:** Read `research/legacy-ui/02-modules/storage.md`
   - Understand current features
   - See component structure
   - Review state management patterns

2. **API Contracts:** Check `research/legacy-ui/06-api-contracts/api-clients.md`
   - Find Storage API endpoints
   - Understand request/response format
   - See authentication headers

3. **User Workflows:** Review `research/legacy-ui/05-workflows/02-storage-operations.md`
   - See how users navigate buckets/tables
   - Understand common operations
   - View UI screenshots

4. **Components:** Check `research/legacy-ui/04-components/`
   - See which components are used
   - Understand patterns (tables, modals, etc.)

**Step 3: Build the New Version**
- Use modern stack (Next.js 15, shadcn/ui)
- Reference old API contracts but use TanStack Query
- Simplify UX based on user workflow insights
- Use design system tokens from `src/app/globals.css`

---

## 📚 How to Use Old UI Research

The `research/` folder contains **109 files** documenting the original UI. Here's how to use it:

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
| **Storage page** | `research/legacy-ui/02-modules/storage.md`, `research/legacy-ui/05-workflows/02-storage-operations.md`, `research/legacy-ui/06-api-contracts/api-clients.md` |
| **Flows page** | `research/legacy-ui/02-modules/flows-v2.md`, `research/legacy-ui/05-workflows/03-flow-creation-execution.md`, `research/new-ui/flows/` (for new design) |
| **Dashboard** | `research/legacy-ui/02-modules/home.md`, `research/legacy-ui/05-workflows/01-dashboard-navigation.md` |
| **Extractors** | `research/legacy-ui/02-modules/EXTRACTORS_INDEX.md`, specific extractor files |
| **Writers** | `research/legacy-ui/02-modules/WRITERS_OVERVIEW.md`, specific writer files |
| **Transformations** | `research/legacy-ui/02-modules/transformations-v2.md`, `research/legacy-ui/05-workflows/04-transformation-workflow.md` |
| **API integration** | `research/legacy-ui/06-api-contracts/api-clients.md`, `research/legacy-ui/06-api-contracts/api-patterns.md` |
| **Components** | `research/legacy-ui/04-components/INDEX.md`, specific component files |
| **State patterns** | `research/legacy-ui/07-state-management/state-architecture.md` |

### Key Files for Common Tasks

**Understanding APIs:**
- `research/legacy-ui/06-api-contracts/api-clients.md` - All 14 API clients documented
- `research/legacy-ui/06-api-contracts/api-patterns.md` - Request/response patterns

**Understanding Features:**
- `research/legacy-ui/03-features/feature-catalog.md` - All 121 features listed
- `research/legacy-ui/03-features/complexity-assessment.md` - Effort estimates

**Understanding User Needs:**
- `research/legacy-ui/05-workflows/*.md` - Real user workflows with screenshots
- `research/legacy-ui/03-features/user-journeys.md` - User personas and pain points

**New UI Research:**
- `research/new-ui/flows/` - Flow Builder research (React Flow, n8n patterns, AI integration)

---

## 🎯 Quick Start

**Building a new feature?**
1. Check `build-specs/` for a spec (if it exists)
2. Review `implementation/` guides for current implementation patterns
3. Research in `research/` to understand requirements
4. Build with modern stack per `build-specs/technical-stack.md`
5. Reference design system in `/design-system.html`

**Stuck on implementation?**
- Check `implementation/` for current implementation guides
- Search `research/legacy-ui/02-modules/` for the relevant module
- Check `research/legacy-ui/06-api-contracts/` for API details
- Review `research/legacy-ui/05-workflows/` for user flows
- Check `research/new-ui/` for new feature research (e.g., Flow Builder)

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

## 📜 Project History

**Want to understand how we got here?**

See **`HISTORY.md`** for complete project history including:
- ✅ Phase 1-7 summaries
- ✅ AI-assisted documentation methodology
- ✅ 17 parallel agents analyzing 49 modules
- ✅ Complete statistics and coverage metrics
- ✅ Lessons learned and strategic insights

---

**Repository:** https://github.com/padak/kbc-ui
**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui
**Start Development:** `pnpm dev` or `make dev`
**Working Memory:** See `/CLAUDE.md` for current status and workflows
