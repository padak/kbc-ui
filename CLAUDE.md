# Claude Session Knowledge - Keboola UI Rebuild Project

**Last Updated**: 2025-10-20
**Session**: Phase 7 - Flow Feature Development (IN PROGRESS)
**Repository**: `https://github.com/padak/kbc-ui` (feature/flow branch)

---

## 🎯 Project Goal

Build a modern Keboola Connection UI from scratch with the same functionality as the current UI, using AI-assisted development and comprehensive research documentation.

**Approach**: Six-phase methodology
1. ✅ **Phase 1 - Initial Planning** (COMPLETE)
2. ✅ **Phase 2 - Code Analysis** (COMPLETE)
3. ✅ **Phase 3 - UI Exploration** (COMPLETE)
4. ✅ **Phase 4 - Synthesis & Migration Plan** (COMPLETE)
5. ✅ **Phase 5 - Implementation Specs** (COMPLETE)
6. ✅ **Phase 6 - Initial Implementation** (COMPLETE)

---

## ✅ Phase 1 Summary - Initial Planning COMPLETE

### What Was Accomplished

Informal chit-chat between Padak and Claude Code that defined the project scope and approach.

**Results:**
- ✅ Project vision established
- ✅ Phased approach decided
- ✅ Repository and branch setup
- ✅ Clear goals for AI-assisted documentation

**Documentation Created:**
- PHASE_1_COMPLETE.md (1 file)

---

## ✅ Phase 2 Summary - Code Analysis COMPLETE

### What Was Accomplished

Successfully executed **17 parallel AI agents** (+ 6 sub-agents for design system) to analyze the entire Keboola UI codebase in ~45 minutes.

**Results:**
- ✅ **71 markdown files** created
- ✅ **34,552 lines** of comprehensive documentation
- ✅ **1.15 MB** total documentation size
- ✅ **100% success rate** (all agents completed)

**Coverage:**
- ✅ 49 modules fully analyzed
- ✅ 400+ React components documented
- ✅ 43+ design system components cataloged
- ✅ 14 API clients with full contracts
- ✅ 100+ API endpoints documented
- ✅ 170+ code examples provided

### Documentation Structure Created

```
docs/
├── 02-modules/           # Module code analysis (59 files)
├── 04-components/        # Design system (7 files)
├── 06-api-contracts/     # API documentation (5 files)
└── Meta docs             # Summaries and indexes
```

**Key Files:**
- PHASE_2_COMPLETE.md
- FINAL_SUMMARY.md
- EXECUTION_TRACKER.md
- AGENT_PROMPTS.md

---

## ✅ Phase 3 Summary - UI Exploration COMPLETE

### What Was Accomplished

Used Playwright to navigate live Keboola UI and document user workflows with screenshots.

**Results:**
- ✅ **4 workflow documents** created (2,939 lines)
- ✅ **12 screenshots** captured (3.6 MB)
- ✅ UI patterns identified
- ✅ Component usage verified
- ✅ User journeys documented

**Workflows Documented:**
1. Dashboard & Navigation (463 lines)
2. Storage Operations (750 lines)
3. Flow Creation & Execution (798 lines)
4. Transformation Workflow (928 lines)

### Documentation Structure Created

```
docs/
├── 05-workflows/         # User workflows (4 files)
└── 08-screenshots/       # UI screenshots (12 images)
```

**Key Files:**
- PHASE_3_COMPLETE.md
- 01-dashboard-navigation.md
- 02-storage-operations.md
- 03-flow-creation-execution.md
- 04-transformation-workflow.md

---

## ✅ Phase 4 Summary - Synthesis & Migration Plan COMPLETE

### What Was Accomplished

Executed **4 parallel AI agents** to synthesize Phase 2 & 3 findings into comprehensive migration planning documentation.

**Results:**
- ✅ **17 markdown files** created (16,719 lines)
- ✅ **426 KB** total documentation size
- ✅ Complete architecture overview
- ✅ 121 features cataloged and prioritized
- ✅ State management migration guides
- ✅ Full AI-First Hybrid migration strategy

**Coverage:**
- ✅ Architecture and tech stack analysis
- ✅ Complete feature inventory with complexity ratings
- ✅ User journey maps (5 personas)
- ✅ State management patterns and migration paths
- ✅ 3-phase migration strategy (~7 months AI-accelerated)
- ✅ Risk assessment (10 major risks with mitigation)
- ✅ Technology recommendations (Claude 3.5, MCP tools)

### Documentation Structure Created

```
docs/
├── 01-overview/              # Architecture (5 files)
├── 03-features/              # Feature catalog (4 files)
├── 07-state-management/      # State patterns (3 files)
└── 09-migration-plan/        # Migration strategy (5 files)
```

**Key Files:**
- PHASE_4_COMPLETE.md
- MODERNIZATION_ASSESSMENT.md
- architecture-overview.md
- feature-catalog.md
- migration-strategy.md

---

## ✅ Phase 5 Summary - Implementation Specs COMPLETE

### What Was Accomplished

Defined complete technical specifications and build-ready instructions for AI-powered development.

**Results:**
- ✅ **Technical stack approved** (Next.js 14 + Tailwind + shadcn/ui)
- ✅ **Design system defined** (Keboola blue #1F8FFF, system fonts)
- ✅ **Dashboard spec complete** (4 metric cards, polling, auth flow)
- ✅ **Authentication flow defined** (API token + Stack URL)
- ✅ **Implementation plan ready** (4-hour timeline)

**Decisions Made:**
- ✅ Local development workflow (pnpm dev)
- ✅ Polling strategy (5s for jobs, 30s for stats)
- ✅ No WebSockets (use polling only)
- ✅ Fresh build (no existing code needed)
- ✅ New repository: https://github.com/padak/kbc-ui

### Documentation Structure Created

```
docs/instructions/
├── as-of-now-ui.md           # Vision & requirements
├── technical-stack.md        # Framework & tools (approved)
├── design-system.md          # Colors, fonts, components
├── dashboard-spec.md         # First feature spec
├── auth-flow.md             # Login implementation
├── implementation-plan.md    # Build steps & timeline
└── README.md                # Index & status
```

**Key Files:**
- as-of-now-ui.md (vision from voice notes)
- technical-stack.md (all decisions approved)
- dashboard-spec.md (complete feature spec)
- implementation-plan.md (ready to execute)

---

## ✅ Phase 6 Summary - Initial Implementation COMPLETE

### What Was Accomplished

Built the initial Next.js application with authentication, dashboard, and design system using AI-assisted development.

**Results:**
- ✅ **Next.js 15.5.6 + React 19.2.0** scaffolded and configured
- ✅ **Design system created** with CSS custom properties
- ✅ **Login page** with Stack URL selection and API token validation
- ✅ **Dashboard page** with 4 metric cards (preview with static data)
- ✅ **Authentication flow** with session persistence
- ✅ **shadcn/ui components** installed (Button, Card, Badge, Input, Select)
- ✅ **Documentation reorganized** for better accessibility
- ✅ **ESLint 9** configured (no deprecation warnings)

**Timeline:**
- Git initialization and repository setup
- Design system planning and implementation
- Next.js application scaffolding
- Login and dashboard feature build
- Dependency upgrades (Next.js 14→15, React 18→19, ESLint 8→9)
- Documentation reorganization

### Implementation Details

**Technology Stack (Actual):**
- Next.js 15.5.6 (upgraded from planned 14)
- React 19.2.0 (upgraded from planned 18)
- TypeScript 5.9.3
- Tailwind CSS 3.4.18
- shadcn/ui (Radix UI components)
- Lucide React 0.546.0 (icons)
- ESLint 9.38.0 (upgraded to fix deprecation)
- pnpm 10.15.0

**Features Built:**
1. **Design System** (`design-system.html`)
   - Visual preview with CSS custom properties
   - Complete color palette (Keboola blue #1F8FFF)
   - Typography scale, spacing system
   - Component examples (buttons, cards, badges)
   - Change management workflow documented

2. **Authentication** (`src/app/login/page.tsx`)
   - Stack URL dropdown (US, EU Central, Azure EU)
   - API token input with validation
   - Form validation and error handling
   - Session persistence in localStorage
   - Auto-redirect logic

3. **Dashboard** (`src/app/dashboard/page.tsx`)
   - 4 metric cards: Jobs, Storage, Flows, Team
   - Static preview data (ready for API integration)
   - Logout functionality
   - Responsive layout

4. **API Client** (`src/lib/api/auth.ts`)
   - Type-safe authentication utilities
   - Stack URL definitions
   - Token validation against Storage API
   - Ready for TanStack Query integration

5. **Developer Tools**
   - Makefile with common commands (`make dev`, `make build`, etc.)
   - Design system preview workflow
   - Build verification

### Documentation Structure Created

```
kbc-ui-padak/
├── design-system.html        # Visual design system preview
├── Makefile                  # Dev workflow commands
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── login/           # Login page
│   │   ├── dashboard/       # Dashboard page
│   │   └── globals.css      # Design tokens (CSS custom properties)
│   ├── components/ui/       # shadcn/ui components
│   └── lib/api/            # API utilities
├── docs/
│   ├── README.md            # Usage guide with examples
│   ├── build-specs/         # Build specifications (was: instructions/)
│   ├── implementation/      # Implementation docs (was: root *.md)
│   └── research/            # Reference material (was: old-ui-research/)
└── public/                  # Static assets
```

**Key Decisions:**
- ✅ **Design System Workflow**: Single source of truth with automated sync
  - `design-system.html` = source of truth (never edit globals.css directly!)
  - `make sync-design` = automated sync to `src/app/globals.css`
  - `scripts/sync-design-tokens.js` = extracts & propagates CSS custom properties
  - Change workflow: Edit design-system.html → Run sync → Restart dev server
- ✅ CSS Custom Properties as design tokens (93 tokens total)
- ✅ Documentation reorganized into build-specs/, implementation/, research/
- ✅ Comprehensive usage guides to ensure research is actively used
- ✅ Latest stable versions (Next.js 15, React 19) for future-proofing
- ✅ Dashboard spec updated to match actual implementation (777 lines)

### Challenges Solved

1. **Design System Change Management**
   - Created two-tier system: `design-system.html` (preview) + `globals.css` (implementation)
   - CSS custom properties ensure changes propagate automatically
   - Documented workflow for design updates

2. **ESLint Deprecation Warning**
   - Upgraded from ESLint 8 → 9
   - Upgraded Next.js 14 → 15, React 18 → 19
   - All dependencies on latest stable versions

3. **Research Accessibility**
   - Moved old UI research under `docs/old-ui-research/`
   - Created comprehensive usage guides with practical examples
   - Quick reference tables linking features to research files

4. **Build Configuration**
   - Resolved autoprefixer dependency issue
   - Fixed CSS syntax errors (border-border, bg-background)
   - Configured Tailwind with design tokens

**Key Files Created:**
- design-system.html (design system preview)
- src/app/login/page.tsx (authentication)
- src/app/dashboard/page.tsx (dashboard)
- src/lib/api/auth.ts (API utilities)
- Makefile (dev workflow)
- docs/README.md (usage guide)
- docs/implementation/FEATURES_QUICK_START.md (quick start)
- docs/implementation/FEATURES_IMPLEMENTATION.md (technical reference)
- docs/implementation/CODE_REFERENCE.md (code examples)
- docs/build-specs/dashboard-spec.md (updated to match implementation)

---

## ✅ Phase 6.5 Summary - Research Organization COMPLETE

### What Was Accomplished

Reorganized research documentation to separate legacy UI analysis from new UI research for better clarity and scalability.

**Results:**
- ✅ **112 files reorganized** (108 renames + 3 additions + 1 update)
- ✅ **Clear separation** between old UI and new UI research
- ✅ **Scalable structure** for future component research
- ✅ **Git history preserved** (all renames tracked)

**Changes Made:**

1. **Legacy UI Research** → `docs/research/legacy-ui/` (109 files)
   - All Phase 2-4 old UI analysis moved here
   - 01-overview/ through 09-migration-plan/
   - All meta-docs (PHASE_*.md, AGENT_PROMPTS.md, etc.)
   - Entire old UI research from Phase 2-4

2. **New UI Research** → `docs/research/new-ui/` (3 files)
   - Component-specific research folders
   - `flows/` - Flow Builder research (3 files)
   - Future: `transformations/`, `storage/`, etc.

3. **Updated Documentation**
   - `docs/README.md` - All paths corrected
   - Quick reference guide updated
   - Usage examples updated

### Documentation Organization Logic

**Principle:** Separate research by purpose and timeline

```
docs/research/
├── README.md              # Index and usage guide
├── legacy-ui/             # OLD UI research (reference material)
│   ├── 01-overview/       # Architecture, tech stack
│   ├── 02-modules/        # 49 module analyses
│   ├── 03-features/       # Feature catalog, priorities
│   ├── 04-components/     # Design system components
│   ├── 05-workflows/      # User workflows + screenshots
│   ├── 06-api-contracts/  # API clients and endpoints
│   ├── 07-state-management/ # State patterns
│   ├── 08-screenshots/    # UI screenshots
│   ├── 09-migration-plan/ # Migration strategy
│   └── *.md               # Meta-docs (PHASE_*, AGENT_PROMPTS, etc.)
└── new-ui/                # NEW UI research (active development)
    ├── flows/             # Flow Builder research
    ├── transformations/   # (Future) Transformations research
    ├── storage/           # (Future) Storage research
    └── [component]/       # (Future) Other component research
```

**When to Add New Research:**
- **Legacy UI changes:** Update existing files in `legacy-ui/`
- **New component research:** Create `new-ui/[component-name]/`
- **New feature research:** Add files to appropriate `new-ui/[component]/`

**Naming Convention:**
- Component folders: lowercase, hyphenated (e.g., `flow-builder`, `data-catalog`)
- Research files: UPPERCASE_SNAKE_CASE for summaries (e.g., `FLOW_BUILDER_COMPARISON.md`)
- Detail files: lowercase with hyphens (e.g., `react-flow-integration.md`)

**Benefits:**
- ✅ Clear separation: Old (reference) vs New (active)
- ✅ Scalable: Easy to add new component research
- ✅ Maintainable: Related research stays together
- ✅ Discoverable: Component-based organization

### Key Commit

**Commit:** `a2e4f72` - docs: reorganize research folder into legacy-ui and new-ui
- 108 renames (legacy UI → legacy-ui/)
- 3 additions (Flow Builder → new-ui/flows/)
- 1 update (docs/README.md paths)

---

## 📊 Complete Project Statistics

### Total Documentation & Implementation

| Component | Files | Lines | Size | Content |
|-----------|-------|-------|------|---------|
| **Phase 1** | 1 | ~20 | 1 KB | Initial planning |
| **Phase 2** | 71 | 34,552 | 1.15 MB | Code analysis |
| **Phase 3** | 4 | 2,939 | 130 KB | UI workflows |
| **Phase 4** | 17 | 16,719 | 426 KB | Migration plan |
| **Phase 5** | 6 | ~1,200 | ~30 KB | Implementation specs |
| **Phase 6** | ~25 | ~2,500 | ~100 KB | Initial implementation + docs |
| **Meta Docs** | 9 | ~2,000 | ~100 KB | Summaries |
| **TOTAL** | **~133** | **~55,700** | **~1.73 MB** | Complete + Running App |

### Coverage

- **Modules**: 49/49 (100%)
- **Features**: 121 cataloged
- **Components**: 43+ documented
- **API Clients**: 14 documented
- **Workflows**: 4 major workflows
- **Screenshots**: 12 UI captures
- **Code Examples**: 170+
- **User Personas**: 5 defined
- **Journey Maps**: 4 detailed

---

## 🗂️ Documentation Organization

### 📁 Current Structure (Phase 7)

```
docs/
├── README.md                 # Complete usage guide
├── build-specs/              # 🔨 BUILD SPECS for new features
│   ├── INITIAL_PROMPT.md
│   ├── README.md
│   ├── as-of-now-ui.md
│   ├── auth-flow.md
│   ├── dashboard-spec.md
│   ├── design-system.md
│   ├── flow-spec.md          # Flow feature specification
│   ├── implementation-plan.md
│   └── technical-stack.md
├── implementation/           # 📝 IMPLEMENTATION GUIDES
│   ├── CODE_REFERENCE.md
│   ├── FEATURES_QUICK_START.md
│   ├── FEATURES_IMPLEMENTATION.md
│   ├── DESIGN_SYSTEM_AUDIT.md
│   ├── HOW-TO-CHANGE-DESIGN-SYSTEM.md
│   ├── AI_FLOW_GENERATION_ENDPOINT.md
│   ├── flow/                 # Flow component implementation docs
│   │   ├── FLOWS_PAGE_IMPLEMENTATION.md
│   │   ├── MERMAID_COMPONENT_COMPLETE.md
│   │   └── PHASE_1_COMPLETE.md
│   ├── dashboard/            # (Future) Dashboard implementation docs
│   └── storage/              # (Future) Storage implementation docs
└── research/                 # 📚 RESEARCH MATERIAL
    ├── README.md
    ├── legacy-ui/            # Old UI reference (109 files)
    │   ├── 01-overview/
    │   ├── 02-modules/       # 49 module analyses
    │   ├── 03-features/
    │   ├── 04-components/
    │   ├── 05-workflows/
    │   ├── 06-api-contracts/
    │   ├── 07-state-management/
    │   ├── 08-screenshots/
    │   ├── 09-migration-plan/
    │   └── *.md              # Meta-docs (PHASE_*, AGENT_PROMPTS, etc.)
    └── new-ui/               # New UI research (3+ files)
        └── flows/            # Flow Builder research
```

**Organization Pattern:**

**build-specs/** - Specifications BEFORE building
- Feature specs written before implementation starts
- Technical decisions and requirements
- Example: `flow-spec.md` written before coding flows

**implementation/** - Documentation DURING/AFTER building
- Component-specific subfolders (e.g., `flow/`, `dashboard/`)
- Implementation notes, decisions, completion reports
- Created as features are built
- Example: `implementation/flow/PHASE_1_COMPLETE.md` after Flow page is done

**research/** - Background research
- `legacy-ui/` - Analysis of old Keboola UI
- `new-ui/[component]/` - Research for new components (React Flow, n8n, etc.)

### 🤖 FOR AI SYSTEMS

**Legacy UI Research** (`docs/research/legacy-ui/`):
- **109 files** documenting old Keboola UI
- Use as reference for building new features
- API contracts, component patterns, user workflows

**New UI Research** (`docs/research/new-ui/`):
- **Component-specific** modern research
- Flow Builder: React Flow, n8n patterns, AI integration
- Future: transformations/, storage/, etc.

### 👥 FOR HUMANS

**Build Specs** (`docs/build-specs/`):
- Technical specifications for AI to build from
- Dashboard, auth, design system specs

**Implementation Guides** (`docs/implementation/`):
- Documentation of what was actually built
- Code organization, quick start, feature guides

---

## 🚀 Key Findings & Recommendations

### Current State Analysis

**Technology Stack:**
- React 18.3.1, TypeScript 5.9.3
- Rspack 1.5.2 (modern bundler)
- 40% legacy code (Flux + Immutable.js)
- 30% modern (TanStack Query)
- 30% modern (Zustand)

**Complexity:**
- 49 modules, 400+ components
- Most complex: Generic API Extractor (XXL, 8-10 weeks)
- Visual Flow Builder (XXL, 8-10 weeks)
- Quick wins: 20 features, 30 weeks effort

### Strategic Recommendation

**AI-First Hybrid Approach:**

**Two Parallel Tracks:**
1. **Innovation Track**: AI chat interface + MCP tools
2. **Modernization Track**: Selective UI improvements

**Timeline**: ~7 months with AI acceleration (vs 12+ traditional)

**3 Phases:**
1. Foundation & AI POC (6-8 weeks)
2. Core Modernization & AI Expansion (8-10 weeks)
3. Full Integration & Scale (8-10 weeks)

**Success Metrics:**
- 50% time savings on workflow creation
- 85% user activation rate
- NPS 60+
- <$2/user/month LLM costs

**Technology Stack:**
- Claude 3.5 Sonnet (primary LLM)
- OpenAI GPT-4 Turbo (fallback)
- Vercel AI SDK (React integration)
- Anthropic MCP (20+ tools planned)
- Next.js 14+, TanStack Query, Zustand

---

## 📚 How to Use This Documentation

### For AI Coding Systems Building New UI

**Recommended Reading Order:**

1. **Start with Overview**
   - `docs/research/legacy-ui/01-overview/architecture-overview.md` - System structure
   - `docs/research/legacy-ui/01-overview/technology-stack.md` - Tech inventory

2. **Understand Features**
   - `docs/research/legacy-ui/03-features/feature-catalog.md` - All 121 features
   - `docs/research/legacy-ui/03-features/feature-priority-matrix.md` - Build order

3. **Learn Components**
   - `docs/research/legacy-ui/04-components/INDEX.md` - Design system

4. **Study Implementation**
   - `docs/research/legacy-ui/02-modules/[module-name].md` - Module details
   - `docs/research/legacy-ui/05-workflows/[workflow-name].md` - User behavior

5. **Integrate**
   - `docs/research/legacy-ui/06-api-contracts/api-clients.md` - API integration
   - `docs/research/legacy-ui/07-state-management/state-architecture.md` - State patterns

6. **New UI Research**
   - `docs/research/new-ui/flows/` - Flow Builder modern design (React Flow, n8n, AI)

### For Human Teams Planning Migration

**Recommended Reading Order:**

1. **Understand Project**
   - `docs/research/legacy-ui/PHASE_1_COMPLETE.md` through `PHASE_4_COMPLETE.md`

2. **Strategic Direction**
   - `docs/research/legacy-ui/MODERNIZATION_ASSESSMENT.md` - 3 options, AI-First recommended

3. **Migration Plan**
   - `docs/research/legacy-ui/09-migration-plan/migration-strategy.md` - Overall approach
   - `docs/research/legacy-ui/09-migration-plan/phased-approach.md` - Detailed phases
   - `docs/research/legacy-ui/09-migration-plan/risk-assessment.md` - Risks & mitigation

4. **Resource Planning**
   - `docs/research/legacy-ui/03-features/complexity-assessment.md` - Effort estimates
   - `docs/research/legacy-ui/03-features/user-journeys.md` - User pain points

---

## 🎯 Quick Reference

### Most Important Files

**For AI Systems:**
1. `docs/research/legacy-ui/01-overview/architecture-overview.md` - System overview
2. `docs/research/legacy-ui/03-features/feature-catalog.md` - What to build
3. `docs/research/legacy-ui/04-components/INDEX.md` - Components to use
4. `docs/research/legacy-ui/02-modules/flows-v2.md` - Complex feature example
5. `docs/research/new-ui/flows/` - Modern Flow Builder research

**For Humans:**
1. `docs/research/legacy-ui/MODERNIZATION_ASSESSMENT.md` - Strategic direction
2. `docs/research/legacy-ui/09-migration-plan/migration-strategy.md` - How to execute
3. `docs/research/legacy-ui/03-features/feature-priority-matrix.md` - What to build first
4. `docs/research/legacy-ui/09-migration-plan/risk-assessment.md` - Risks

**Navigation:**
- `docs/README.md` - Complete documentation index
- `docs/research/legacy-ui/` - Old UI reference material
- `docs/research/new-ui/` - New UI research by component

---

## 💡 Key Insights

### Technical Debt

**40% Legacy Code:**
- Flux + Immutable.js causing performance issues
- Class components need conversion to hooks
- Mixed state management patterns

**Migration Priority:**
- Flux → TanStack Query (server state)
- Class components → Function components
- Immutable.js → Native JavaScript

### User Pain Points

**Identified Issues:**
1. Complex onboarding → AI opportunity
2. Limited self-service for non-technical users → AI workflows
3. Debugging complexity → AI assistance
4. Information overload → Progressive disclosure

**Journey Times (Current → AI-Accelerated Target):**
- New pipeline creation: 65 min → 6 min
- Ad-hoc analysis: 43 min → 4 min
- dbt deployment: 55 min → 10 min
- Self-service access: 22 min → 2 min

### Feature Prioritization

**P0 Must-Have (35 features, 92 weeks):**
- Core data integration (extractors/writers)
- Flow builder & orchestration
- Storage management
- Transformations
- Authentication & RBAC

**Quick Wins (20 features, 30 weeks):**
- Modern modules (trash, notifications)
- Simple extractors
- Basic writers
- UI improvements

---

## 🔄 Next Steps - Implementation

### ✅ Phase 6 Complete: Initial Foundation

**Completed:**
- ✅ Repository setup and git initialization
- ✅ Next.js 15 + React 19 + TypeScript scaffolding
- ✅ Design system with CSS custom properties
- ✅ Login page with authentication
- ✅ Dashboard page with preview data
- ✅ Developer workflow (Makefile)
- ✅ Documentation reorganization

### Phase 7: API Integration & Dashboard (Next)

**Immediate Next Steps:**
1. **Add TanStack Query** (data fetching library)
   - Install dependencies
   - Set up QueryClient provider
   - Create API query hooks

2. **Implement Real Dashboard Data**
   - Jobs API integration (5s polling)
   - Storage API integration (30s polling)
   - Flows API integration
   - Team/Projects API integration

3. **Error Handling & Loading States**
   - Loading skeletons
   - Error boundaries
   - Retry logic
   - Optimistic updates

4. **Testing**
   - Manual testing with real API
   - Error scenario testing

### Phase 8: Core Features

**Planned Features:**
1. **Storage Page** (Weeks 1-2)
   - Bucket list
   - Table detail view
   - Data preview
   - Bucket/table operations

2. **Flows Page** (Weeks 3-4)
   - Flow list with status
   - Flow detail view
   - Flow execution
   - Visual flow diagram

3. **Jobs Monitoring** (Week 5)
   - Job list with real-time updates
   - Job detail view
   - Job logs
   - Job filtering and search

### Phase 9: Advanced Features & AI Integration

**Future Work:**
1. **AI Chat Interface** (if pursuing AI-First strategy)
2. **Transformations Page**
3. **Extractors/Writers Pages**
4. **User Management & RBAC**
5. **Testing Suite** (Vitest + Playwright)
6. **Deployment** (Vercel staging + production)

---

## 🎓 Lessons Learned

### Documentation Approach

**Parallel AI Agents:**
- 17 agents in Phase 2 → 71 files in ~45 min
- 4 agents in Phase 4 → 17 files in ~1 session
- 100x faster than manual documentation
- Consistent quality across all documents

**Synthesis Methodology:**
- Combined Phase 2 (code) + Phase 3 (UI) insights
- Real examples from actual codebase
- Data-driven recommendations
- Actionable implementation guidance

**AI-First Planning:**
- Rejected traditional time estimates
- Focus on milestones, not dates
- Embrace uncertainty with go/no-go decisions
- Plan for 2-3x acceleration with AI tools

### Strategic Insights

**Why AI-First Hybrid Works:**
- Validates innovation with low risk
- Preserves existing functionality
- Provides competitive differentiation
- Natural migration path for users
- Builds on proven infrastructure

**Critical Success Factors:**
1. Experienced team (AI + full-stack)
2. Strong validation layer for AI outputs
3. User-centric approach (AI is optional)
4. Clear go/no-go decision criteria
5. Cost optimization from day 1

---

## 📝 Project Status

**Current Status**: 🚧 PHASE 7 IN PROGRESS - Flow Feature Development

**Phase Status:**
- ✅ Phase 1-5: Planning & Analysis (COMPLETE)
- ✅ Phase 6: Initial Implementation (COMPLETE)
- ✅ Phase 6.5: Documentation Consolidation & Organization (COMPLETE)
- 🚧 **Phase 7: Flow Feature** (IN PROGRESS)
  - ✅ Flow specification (flow-spec.md)
  - ✅ AI Flow Creator with Mermaid diagrams
  - ✅ Flow list page with search/filters
  - ✅ AI generation endpoint (Claude Haiku 4.5)
  - 🚧 Mermaid diagram rendering (debugging)
  - ⏳ Flow detail view
  - ⏳ Flow execution
- 🔜 **Next: Complete Flow feature + Storage page**

**What's Built:**
- ✅ Next.js 15.5.6 + React 19.2.0 application running
- ✅ Login page with authentication
- ✅ Dashboard page with preview data (AI-powered insights, collapsible activity)
- ✅ Sidebar navigation (collapsible, persistent state)
- ✅ AI chat interface (floating button, ⌘K shortcut)
- ✅ Design system with CSS custom properties + AI theme colors
- ✅ shadcn/ui component library
- ✅ Developer workflow (Makefile, design system sync)
- ✅ Production-ready documentation structure
- ✅ **Flows page** with search, filters, empty state
- ✅ **AI Flow Creator** modal (3-step wizard)
- ✅ **AI generation endpoint** (/api/flows/generate) with Claude Haiku 4.5
- ✅ Mermaid diagram component (debugging rendering)
- ✅ Flow card component with status badges
- ✅ TanStack Query integration for API calls

**What's Next:**
- 🐛 Fix Mermaid rendering (currently debugging)
- ⏳ Flow detail view page
- ⏳ Flow execution functionality
- ⏳ Implement real dashboard data with polling
- ⏳ Build Storage page (buckets/tables)
- ⏳ Build Jobs monitoring page

**Repository:**
- **Build Repo**: `https://github.com/padak/kbc-ui` (main branch)
- **Analysis Repo**: `https://github.com/keboola/ui/tree/padak/ui-experiment` (reference)

**Key Documents:**
- `docs/README.md` - Complete usage guide with examples
- `docs/build-specs/dashboard-spec.md` - Updated to match actual implementation (777 lines)
- `docs/implementation/FEATURES_QUICK_START.md` - 2-minute setup guide
- `docs/implementation/FEATURES_IMPLEMENTATION.md` - Technical reference
- `docs/implementation/CODE_REFERENCE.md` - Code examples and patterns
- `docs/research/README.md` - How to use research when building
- `design-system.html` - Visual design system preview
- `Makefile` - Dev workflow commands

**How to Start:**
```bash
# Start development server
pnpm dev
# or
make dev

# View design system
make design-preview

# Build for production
pnpm build
# or
make build
```

---

**Last Updated**: 2025-10-20
**Total Project**: ~150+ files, ~60,000+ lines, ~1.8 MB
**Implementation**: Next.js 15.5.6 + React 19.2.0 + TypeScript 5.9.3

**Tech Stack (Actual):**
- Design System: Keboola blue (#1F8FFF) + AI theme colors (purple→blue→cyan)
- Next.js 15.5.6 + TypeScript 5.9.3 + Tailwind CSS 3.4.18
- shadcn/ui (Button, Card, Badge, Input, Select, Dialog, Accordion, Alert, Skeleton, Textarea)
- TanStack Query 5.x (data fetching, caching, polling)
- Mermaid 11.12.0 (flow diagrams)
- Lucide React (icons)
- ESLint 9.38.0, pnpm 10.15.0
- Local dev: `pnpm dev`
- Auth: API token + Stack URL (localStorage)
- AI: Claude Haiku 4.5 (ANTHROPIC_API_KEY + ANTHROPIC_MODEL env vars)

**Git Status:**
- Branch: `feature/flow`
- Status: Working on Flow feature
- Working tree: Modified (mermaid debugging)
- Ready to: Continue Flow implementation

**Phase 7 Progress:**
- ✅ Flow specification complete
- ✅ AI Flow Creator with 3-step wizard
- ✅ Flow list page with search/filters
- ✅ AI generation endpoint with Claude
- ✅ Anthropic API optimization (70% cost reduction)
- ✅ Design system compliance fixes
- 🚧 Mermaid rendering (debugging in progress)
- ⏳ Flow detail view
- ⏳ Flow execution

**Documentation Organization:**
- ✅ Component-based implementation docs (`docs/implementation/flow/`)
- ✅ Build specs updated (flow-spec.md added)
- ✅ Design system synchronized (design-system.md ↔ design-system.html)
- ✅ Research organized by UI version (legacy-ui/ vs new-ui/)

*Phase 7 in progress - Flow feature under development - Debugging Mermaid diagrams*
