# Old UI Research Documentation

This folder contains comprehensive research and documentation of the **original Keboola Connection UI**.

Use this as **reference material** when building the new UI to understand:
- What features existed and how they worked
- API endpoints and data structures
- User workflows and pain points
- Common patterns and components

---

## 📚 What's Inside

- **02-modules/** - Detailed analysis of all 49 modules (extractors, writers, flows, etc.)
- **06-api-contracts/** - API clients and integration patterns ⭐ Most useful for implementation
- **05-workflows/** - User workflows with screenshots ⭐ Most useful for UX
- **04-components/** - Design system components from the old UI
- **03-features/** - Feature catalog (121 features), complexity assessments, user journeys
- **07-state-management/** - State management patterns and migration guides
- **01-overview/** - Architecture, tech stack, routing, state management
- **08-screenshots/** - UI screenshots from the old system (12 images)
- **09-migration-plan/** - Strategic migration and modernization plans

---

## 🔍 How to Use This When Building

### Example 1: Building the Storage Page

**What you need to know:**
1. What features does Storage have?
2. What API endpoints does it use?
3. How do users navigate buckets/tables?

**Files to read:**
```
1. 02-modules/storage.md
   → Features: bucket management, table browsing, data preview
   → State: Uses Flux stores (outdated - use TanStack Query instead)
   → Components: BucketList, TableDetail, DataSample

2. 06-api-contracts/api-clients.md
   → Search for "Storage API"
   → Endpoints: GET /v2/storage/buckets, GET /v2/storage/tables
   → Auth: X-StorageApi-Token header
   → Response format: { id, name, stage, tables: [...] }

3. 05-workflows/02-storage-operations.md
   → User flow: Dashboard → Storage → Select bucket → View tables
   → Common actions: Create bucket, upload CSV, preview data
   → Screenshots show current UI layout
```

**What to copy:**
- ✅ API endpoint URLs
- ✅ Request/response data structures
- ✅ Feature list (what needs to be built)
- ✅ User flow steps

**What NOT to copy:**
- ❌ Old code (uses Flux, Immutable.js)
- ❌ Old state management patterns
- ❌ Exact UI layout (we're modernizing!)

---

### Example 2: Building an Extractor (e.g., Google Analytics)

**Files to read:**
```
1. 02-modules/ex-google-analytics-v4.md
   → Configuration: OAuth, dimensions/metrics selection
   → Features: Incremental loading, query builder
   → Complexity: XL (6-8 weeks estimated)

2. 02-modules/EXTRACTORS_INDEX.md
   → Overview of all 16 extractors
   → Common patterns across extractors

3. 06-api-contracts/api-clients.md
   → Component API endpoints
   → Configuration structure
```

---

### Example 3: Understanding an API

**Need to integrate with Storage API?**

Read: `06-api-contracts/api-clients.md`

Find this section:
```typescript
// Storage API Client (from research)
Base URL: {stackUrl}/v2/storage
Auth: X-StorageApi-Token header

Endpoints:
- GET /buckets - List all buckets
- GET /buckets/{id} - Get bucket detail
- GET /tables/{id} - Get table detail
- GET /tables/{id}/data-preview - Preview data
- POST /buckets - Create bucket
- DELETE /buckets/{id} - Delete bucket
```

Copy these endpoints → Wrap in TanStack Query → Use in new UI

---

## 🎯 Quick Reference by Task

| Task | Start Here |
|------|-----------|
| Building **Storage page** | `02-modules/storage.md` + `05-workflows/02-storage-operations.md` |
| Building **Flows page** | `02-modules/flows-v2.md` + `05-workflows/03-flow-creation-execution.md` |
| Building **Dashboard** | `02-modules/home.md` + `05-workflows/01-dashboard-navigation.md` |
| Building **Transformations** | `02-modules/transformations-v2.md` + `05-workflows/04-transformation-workflow.md` |
| Understanding **any API** | `06-api-contracts/api-clients.md` (search for the API name) |
| Finding **all extractors** | `02-modules/EXTRACTORS_INDEX.md` |
| Finding **all writers** | `02-modules/WRITERS_OVERVIEW.md` |
| Understanding **user pain points** | `03-features/user-journeys.md` |
| Estimating **complexity** | `03-features/complexity-assessment.md` |

---

## 💡 Practical Tips

### ✅ DO:
1. **Read module docs** before building to understand scope
2. **Copy API contracts** - endpoints, data structures are gold
3. **Review user workflows** to improve UX in new UI
4. **Check complexity estimates** to plan development time
5. **Use screenshots** to understand current UI layout

### ❌ DON'T:
1. **Copy old code** - it's outdated (Flux, Immutable.js, class components)
2. **Replicate old UI exactly** - we're modernizing, simplify where possible
3. **Use old state patterns** - use TanStack Query instead of Flux
4. **Skip the research** - you'll miss important requirements

---

## 📊 Documentation Stats

**Created**: October 2025
**Method**: AI-assisted codebase analysis (17 parallel agents)
**Total**: 109 files, ~53,200 lines, ~1.63 MB

**Coverage:**
- ✅ 49 modules documented
- ✅ 121 features cataloged
- ✅ 14 API clients mapped
- ✅ 100+ API endpoints documented
- ✅ 4 complete user workflows
- ✅ 12 UI screenshots
- ✅ 5 user personas

---

## 🔗 Related Documentation

- **New UI Specs**: See `../instructions/` for build specifications
- **Design System**: See `/design-system.html` for new design tokens
- **Tech Stack**: See `../instructions/technical-stack.md` for implementation status

---

⚠️ **Remember**: This documents the OLD UI. Use it as **reference**, not as **source code to copy**.

Build the new UI with modern stack (Next.js 15, React 19, TanStack Query, shadcn/ui).
