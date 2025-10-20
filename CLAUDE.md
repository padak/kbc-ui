# Claude Working Memory - Keboola UI Rebuild

**Last Updated**: 2025-10-20
**Current Branch**: `feature/flow`
**Status**: ✅ Phase 7 Complete - Flow Feature Functional

---

## 🎯 Project Goal

Build a modern Keboola Connection UI from scratch using AI-assisted development and comprehensive research documentation.

**Method**: BMAD (`.bmad-core/`) - AI-driven planning and development methodology
**Repository**: https://github.com/padak/kbc-ui (main branch)

---

## 📍 Current Status

### What's Built (Ready to Use)
- ✅ Next.js 15.5.6 + React 19.2.0 + TypeScript 5.9.3
- ✅ Login page with authentication (API token + Stack URL)
- ✅ Dashboard with AI-powered insights (4 metric cards)
- ✅ Sidebar navigation (collapsible, persistent state)
- ✅ AI chat interface (floating button, ⌘K shortcut)
- ✅ **Flows page** with AI-powered flow creator
- ✅ **Mermaid diagrams** with color-coded components
- ✅ **Component icons** from Keboola API (ico32/ico64)
- ✅ Design system with CSS custom properties
- ✅ shadcn/ui components (Button, Card, Badge, Input, Select, Dialog, Accordion, Alert, Skeleton, Textarea)
- ✅ TanStack Query integration (data fetching, caching)

### What's Next
- ⏳ Flow detail view page
- ⏳ Flow execution functionality
- ⏳ Real dashboard data with polling (5s jobs, 30s stats)
- ⏳ Storage page (buckets/tables)
- ⏳ Jobs monitoring page
- ⏳ Transformations page

---

## 🚀 Quick Start

```bash
# Start development server
pnpm dev
# or
make dev

# View design system preview
make design-preview

# Build for production
pnpm build
# or
make build
```

**Environment Variables:**
- `ANTHROPIC_API_KEY` - Claude API key (for AI flow generation)
- `ANTHROPIC_MODEL` - Default: `claude-haiku-4-20250514`

---

## 🎨 Design System Workflow

**CRITICAL**: Never edit `src/app/globals.css` directly!

### How to Change Design
1. **Edit** `design-system.html` (change CSS custom properties)
2. **Run** `make sync-design`
3. **Restart** dev server

**Why?**
- `design-system.html` = Single source of truth
- `make sync-design` = Automated sync to `globals.css`
- CSS custom properties → All components update automatically

**Examples:**
```css
/* Change primary color */
--color-primary-500: #1F8FFF;  /* Keboola blue */

/* Change to orange */
--color-primary-500: #f97316;  /* Orange */
```

Then: `make sync-design` → All buttons, links, badges update automatically!

**Full Guide**: `docs/implementation/HOW-TO-CHANGE-DESIGN-SYSTEM.md`

---

## 📁 Documentation Structure

```
docs/
├── README.md                 # Complete usage guide
├── build-specs/              # 🔨 Specs BEFORE building features
│   ├── dashboard-spec.md     # Dashboard specification
│   ├── flow-spec.md          # Flow feature specification
│   ├── design-system.md      # Design system spec
│   └── auth-flow.md          # Authentication spec
├── implementation/           # 📝 Docs DURING/AFTER building
│   ├── flow/                 # Flow implementation docs
│   ├── FEATURES_QUICK_START.md
│   ├── CODE_REFERENCE.md
│   └── HOW-TO-CHANGE-DESIGN-SYSTEM.md
└── research/                 # 📚 Reference material
    ├── legacy-ui/            # Old Keboola UI analysis (109 files)
    │   ├── 02-modules/       # 49 module analyses
    │   ├── 06-api-contracts/ # API clients and endpoints
    │   └── 05-workflows/     # User workflows
    └── new-ui/               # New UI research
        └── flows/            # Flow Builder research (React Flow, n8n)
```

**Organization Pattern:**
- **build-specs/** → Write specs BEFORE coding
- **implementation/** → Document DURING/AFTER building (component subfolders)
- **research/** → Background research (legacy UI + new UI patterns)

---

## 🧠 Key Architectural Decisions

### 1. Design System
- **CSS Custom Properties** as design tokens (93 tokens)
- **Two-tier system**: `design-system.html` (preview) + `globals.css` (implementation)
- **Automated sync**: `scripts/sync-design-tokens.js`
- **Never edit globals.css directly** - always use `make sync-design`

### 2. Tech Stack
- **Framework**: Next.js 15.5.6 (App Router)
- **UI**: shadcn/ui (Radix UI components)
- **Data Fetching**: TanStack Query (polling, caching)
- **Icons**: Lucide React (no emojis in production code)
- **Diagrams**: Mermaid 11.12.0 (dynamic imports)
- **AI**: Claude Haiku 4.5 (flow generation)

### 3. State Management
- **Server State**: TanStack Query (API data, polling)
- **Client State**: React hooks + localStorage (auth, sidebar state)
- **Polling Strategy**: 5s (jobs), 30s (stats), 60s (orchestrations)

### 4. Authentication
- **API Token + Stack URL** (localStorage)
- **No cookies/sessions** (localStorage only)
- **Stack URLs**: US, EU Central, Azure EU

### 5. API Integration
- **Keboola Storage API** for components (icons: ico32, ico64)
- **Type-safe clients** in `src/lib/api/`
- **TanStack Query hooks** for all API calls

---

## 📋 Common Workflows

### Creating a New Feature
1. **Write spec** in `docs/build-specs/[feature]-spec.md`
2. **Research** old UI if needed (`docs/research/legacy-ui/`)
3. **Build** feature with TanStack Query + shadcn/ui
4. **Document** in `docs/implementation/[feature]/`
5. **Test** manually + update CLAUDE.md status

### Adding a New Component
1. **Check shadcn/ui** first: `npx shadcn@latest add [component]`
2. **Use design tokens** (CSS custom properties)
3. **No hard-coded colors** - use `bg-primary-500`, `text-success-700`, etc.
4. **Use Lucide icons** (no emojis)

### Making Design Changes
1. Edit `design-system.html`
2. Run `make sync-design`
3. Restart dev server
4. Commit both files: `design-system.html` + `src/app/globals.css`

### Using Research Documentation
- **Old UI patterns**: `docs/research/legacy-ui/`
- **API contracts**: `docs/research/legacy-ui/06-api-contracts/`
- **User workflows**: `docs/research/legacy-ui/05-workflows/`
- **New patterns**: `docs/research/new-ui/[component]/`

---

## 🔑 Important Conventions

### Code Style
- **No emojis** in production code (use Lucide icons)
- **Type-safe** everything (TypeScript strict mode)
- **shadcn/ui** for all UI components
- **Design tokens** for all colors/spacing/typography

### Color Usage
- **Primary**: Keboola blue (`#1F8FFF`)
- **AI theme**: Purple → Blue → Cyan gradient
- **Semantic colors**: success (green), warning (amber), error (red), info (blue)
- **Always use tokens**: `bg-primary-500` not `bg-blue-500`

### Component Structure
```typescript
// Good: Uses design tokens
<Button className="bg-primary-500 hover:bg-primary-600">
  <Sparkles className="w-4 h-4" />
  Generate Flow
</Button>

// Bad: Hard-coded colors
<Button style={{ background: "#1F8FFF" }}>
  ✨ Generate Flow
</Button>
```

### API Calls
```typescript
// Good: TanStack Query hook
const { data, isLoading } = useQuery({
  queryKey: ['flows'],
  queryFn: fetchFlows,
  refetchInterval: 30000, // 30s polling
});

// Bad: Direct fetch
const [data, setData] = useState();
useEffect(() => { fetch('/api/flows').then(...) }, []);
```

---

## 🤖 BMAD Integration

**Location**: `.bmad-core/`
**What it is**: AI-driven planning and development methodology

**Key Files:**
- `.bmad-core/user-guide.md` - Full BMAD workflow
- `.bmad-core/working-in-the-brownfield.md` - Working with existing code
- `.bmad-core/workflows/` - Planning workflows
- `.bmad-core/agents/` - AI agent definitions

**When to use:**
- Planning complex features
- Breaking down epics into stories
- Architecture decisions
- Risk assessment

---

## 📚 Essential Documentation

**For Building Features:**
1. `docs/build-specs/[feature]-spec.md` - Feature specifications
2. `docs/research/legacy-ui/02-modules/[module].md` - Old UI patterns
3. `docs/research/legacy-ui/06-api-contracts/` - API documentation
4. `docs/implementation/CODE_REFERENCE.md` - Code examples

**For Maintenance:**
1. `docs/implementation/HOW-TO-CHANGE-DESIGN-SYSTEM.md` - Design changes
2. `docs/implementation/FEATURES_IMPLEMENTATION.md` - Technical reference
3. `CLAUDE.md` - This file (working memory)
4. `docs/HISTORY.md` - Historical project details

**For Understanding:**
1. `docs/README.md` - Complete documentation index
2. `docs/research/README.md` - Research usage guide
3. `.bmad-core/user-guide.md` - BMAD methodology

---

## 🎯 Next Session Priorities

1. **Flow Detail View** - Show flow configuration, tasks, execution history
2. **Flow Execution** - Run flow, show job status, logs
3. **Real Dashboard Data** - Replace static data with TanStack Query hooks
4. **Storage Page** - Bucket/table list, data preview

---

## 📦 Tech Stack Reference

**Core:**
- Next.js 15.5.6 (App Router, dynamic imports)
- React 19.2.0 (Server Components, hooks)
- TypeScript 5.9.3 (strict mode)
- Tailwind CSS 3.4.18 (design tokens)

**UI:**
- shadcn/ui (Radix UI components)
- Lucide React 0.546.0 (icons)
- Mermaid 11.12.0 (diagrams)

**Data:**
- TanStack Query 5.x (server state, polling, caching)
- Keboola Storage API (components, flows, jobs)

**AI:**
- Claude Haiku 4.5 (flow generation via `/api/flows/generate`)
- Anthropic SDK (@anthropic-ai/sdk)

**Dev Tools:**
- ESLint 9.38.0
- pnpm 10.15.0
- Makefile (dev workflow)

---

**For detailed project history, see `docs/HISTORY.md`**
