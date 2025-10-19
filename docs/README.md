# Keboola UI Documentation

**Project**: Comprehensive documentation for AI-assisted Keboola UI modernization
**Created**: October 2025
**Branch**: `padak/ui-experiment`
**Total Files**: 97 markdown files, ~51,700 lines, ~1.56 MB

---

## 📖 Complete File Index

| File | Audience | Description |
|------|----------|-------------|
| **README.md** | Both | This file - complete navigation and index |
| | | |
| **Root-Level Strategic Documents** | | |
| CLAUDE.md | AI | Session knowledge, project overview, context for AI continuation |
| MODERNIZATION_ASSESSMENT.md | Human | Strategic assessment, 3 approaches, AI-First recommendation |
| BUILD_READINESS_ANALYSIS.md | Human | What we have vs what's needed to start building - gap analysis |
| PHASE_1_COMPLETE.md | Human | Phase 1 summary - initial planning and chit-chat |
| PHASE_2_COMPLETE.md | Human | Phase 2 summary - code analysis (17 agents, 71 files) |
| PHASE_3_COMPLETE.md | Human | Phase 3 summary - UI exploration (4 workflows, 12 screenshots) |
| PHASE_4_COMPLETE.md | Human | Phase 4 summary - synthesis & migration planning (17 files) |
| | | |
| **Research Methodology** | | |
| AGENT_PROMPTS.md | Both | All 17 agent prompts - how to reproduce the research |
| EXECUTION_TRACKER.md | Human | Agent completion status, timing, parallelization tracking |
| HOW_TO_EXECUTE.md | Human | Step-by-step guide for running parallel AI agents |
| FINAL_SUMMARY.md | Human | Phase 2 authoritative completion record |
| | | |
| **01-overview/** | | **Architecture & System Overview** |
| 01-overview/README.md | AI | Overview directory index |
| 01-overview/architecture-overview.md | AI | System architecture, 49 modules mapped, ASCII diagrams |
| 01-overview/technology-stack.md | AI | Complete tech inventory (React 18.3, TypeScript 5.9, Rspack) |
| 01-overview/state-management-patterns.md | AI | Flux, TanStack Query, Zustand patterns with examples |
| 01-overview/routing-structure.md | AI | React Router 7 configuration, URL patterns |
| | | |
| **02-modules/** | | **Module-by-Module Code Analysis** |
| 02-modules/INDEX.md | AI | Core modules index (ai, chat, data-apps, workspaces, sandboxes) |
| 02-modules/EXTRACTORS_INDEX.md | AI | All 16 extractors quick reference |
| 02-modules/FLOWS_INDEX.md | AI | Flow modules index (flows-v2, flows, orchestrations-v2) |
| 02-modules/00-WRITERS_INDEX.md | AI | All 7 writers index |
| 02-modules/WRITERS_OVERVIEW.md | AI | Comprehensive writer overview |
| 02-modules/_TEMPLATE.md | Both | Template for module documentation |
| | | |
| 02-modules/admin.md | AI | Admin module - user management, privileges |
| 02-modules/ai.md | AI | AI module - Waii SQL editor |
| 02-modules/billing.md | AI | Billing module - credits, usage tracking |
| 02-modules/bucket-browser.md | AI | Bucket browser - storage bucket navigation |
| 02-modules/chat.md | AI | Chat module - chat interface |
| 02-modules/components.md | AI | Components infrastructure - shared component logic |
| 02-modules/configurations.md | AI | Configurations - generic config patterns |
| 02-modules/data-apps.md | AI | Data apps - deployment and management |
| 02-modules/data-catalog.md | AI | Data catalog - search and metadata |
| 02-modules/flows-v2.md | AI | Modern flow builder - visual canvas (React Flow) |
| 02-modules/flows.md | AI | Legacy flow builder |
| 02-modules/home.md | AI | Home dashboard - widgets and navigation |
| 02-modules/legacy-transformation.md | AI | Legacy transformations |
| 02-modules/lineage.md | AI | Data lineage - graph visualization |
| 02-modules/notifications.md | AI | Notifications - email/webhook alerts |
| 02-modules/oauth-v2.md | AI | OAuth v2 - authorization flows |
| 02-modules/orchestrations-v2.md | AI | Orchestrations - scheduling and automation |
| 02-modules/queue.md | AI | Job queue - monitoring and cancellation |
| 02-modules/sandboxes.md | AI | Sandboxes - provisioning and types |
| 02-modules/settings.md | AI | Settings - project configuration |
| 02-modules/storage.md | AI | Storage - buckets and tables management |
| 02-modules/table-browser.md | AI | Table browser - data preview and export |
| 02-modules/telemetry.md | AI | Telemetry - analytics dashboards |
| 02-modules/transformations-v2.md | AI | Transformations - SQL/Python/R/dbt code editor |
| 02-modules/trash.md | AI | Trash - recovery and deletion |
| 02-modules/workspaces.md | AI | Workspaces - Snowflake/Redshift provisioning |
| | | |
| 02-modules/ex-aws-s3.md | AI | Extractor: AWS S3 file storage |
| 02-modules/ex-azure-blob.md | AI | Extractor: Azure Blob Storage |
| 02-modules/ex-db-generic.md | AI | Extractor: Generic database (15+ databases) |
| 02-modules/ex-dropbox-v2.md | AI | Extractor: Dropbox cloud storage |
| 02-modules/ex-email-attachments.md | AI | Extractor: Email attachments |
| 02-modules/ex-facebook.md | AI | Extractor: Facebook Ads |
| 02-modules/ex-ftp.md | AI | Extractor: FTP file transfer |
| 02-modules/ex-generic.md | AI | Extractor: Generic API adapter |
| 02-modules/ex-google-ads.md | AI | Extractor: Google Ads |
| 02-modules/ex-google-analytics-v4.md | AI | Extractor: Google Analytics 4 |
| 02-modules/ex-google-bigquery-v2.md | AI | Extractor: Google BigQuery |
| 02-modules/ex-google-drive.md | AI | Extractor: Google Drive |
| 02-modules/ex-http.md | AI | Extractor: HTTP/REST API |
| 02-modules/ex-mongodb.md | AI | Extractor: MongoDB database |
| 02-modules/ex-onedrive.md | AI | Extractor: OneDrive cloud storage |
| 02-modules/ex-storage.md | AI | Extractor: Keboola Storage (internal) |
| | | |
| 02-modules/wr-aws-s3.md | AI | Writer: AWS S3 destination |
| 02-modules/wr-db.md | AI | Writer: Generic database destination |
| 02-modules/wr-google-bigquery-v2.md | AI | Writer: Google BigQuery destination |
| 02-modules/wr-google-drive.md | AI | Writer: Google Drive destination |
| 02-modules/wr-google-sheets.md | AI | Writer: Google Sheets destination |
| 02-modules/wr-onedrive.md | AI | Writer: OneDrive destination |
| 02-modules/wr-storage.md | AI | Writer: Keboola Storage (internal) |
| | | |
| **03-features/** | | **Feature Catalog & Analysis** |
| 03-features/feature-catalog.md | AI | 121 features across 9 categories, complete inventory |
| 03-features/user-journeys.md | Both | 5 personas, 4 journey maps (data engineer, analyst, etc.) |
| 03-features/feature-priority-matrix.md | Both | P0-P3 prioritization, 35 must-haves, 20 quick wins |
| 03-features/complexity-assessment.md | Both | Technical complexity (XS-XXL), 30+ detailed assessments |
| | | |
| **04-components/** | | **Design System** |
| 04-components/README.md | AI | Getting started with design system |
| 04-components/INDEX.md | AI | Complete component reference (43+ components) |
| 04-components/DIRECTORY_STRUCTURE.md | AI | Component organization, file tree |
| 04-components/form-components.md | AI | 11 form components (Input, Button, Select, etc.) |
| 04-components/code-editor-components.md | AI | 4 code editors (SqlEditor, CodeEditor, etc.) |
| 04-components/utilities-and-patterns.md | AI | 7 utilities + 12 design patterns |
| | | |
| **05-workflows/** | | **User Workflows with Screenshots** |
| 05-workflows/01-dashboard-navigation.md | AI | Dashboard widgets, navigation patterns |
| 05-workflows/02-storage-operations.md | AI | Browse tables/buckets, data samples |
| 05-workflows/03-flow-creation-execution.md | AI | Flow builder canvas, task configuration |
| 05-workflows/04-transformation-workflow.md | AI | Transformations, SQL editor, variables |
| | | |
| **06-api-contracts/** | | **API Integration** |
| 06-api-contracts/INDEX.md | AI | API navigation hub |
| 06-api-contracts/api-clients.md | AI | 14 API clients (Storage, Queue, Chat, etc.) |
| 06-api-contracts/api-patterns.md | AI | Request/response patterns, auth, error handling |
| 06-api-contracts/ANALYSIS_SUMMARY.md | Both | Executive summary of API architecture |
| | | |
| **07-state-management/** | | **State Patterns & Migration** |
| 07-state-management/flux-to-tanstack-migration.md | AI | 10-phase migration guide, before/after examples |
| 07-state-management/zustand-usage-patterns.md | AI | When/how to use Zustand, patterns from flows-v2 |
| 07-state-management/state-architecture.md | AI | Overall architecture, caching, optimistic updates |
| | | |
| **09-migration-plan/** | | **Implementation Strategy** |
| 09-migration-plan/migration-strategy.md | Human | AI-First Hybrid approach, parallel tracks |
| 09-migration-plan/phased-approach.md | Human | 3 phases detailed (Foundation, Expansion, Integration) |
| 09-migration-plan/technology-recommendations.md | Both | Tech stack (Claude 3.5, Vercel AI SDK, MCP, Next.js 14+) |
| 09-migration-plan/risk-assessment.md | Human | 10 major risks with mitigation strategies |
| 09-migration-plan/timeline-estimation.md | Human | AI-accelerated, milestone-based approach |

---

## 🗺️ How to Read This Repo as a Human

### First Time? Start Here (30 minutes)

**1. Understand the Project** (10 min)
- Read: `PHASE_1_COMPLETE.md` → `PHASE_2_COMPLETE.md` → `PHASE_3_COMPLETE.md` → `PHASE_4_COMPLETE.md`
- Why: Understand how this documentation was created and what each phase accomplished

**2. Strategic Direction** (10 min)
- Read: `MODERNIZATION_ASSESSMENT.md`
- Why: Understand the 3 modernization options and why AI-First Hybrid is recommended

**3. Build Readiness** (5 min)
- Read: `BUILD_READINESS_ANALYSIS.md`
- Why: Understand what we have vs what's needed to actually start building

**4. Migration Plan Overview** (5 min)
- Read: `09-migration-plan/migration-strategy.md`
- Why: Understand the recommended implementation approach

### Decision Maker? Read This (1 hour)

**1. Readiness Assessment** ⭐ Start here
- `BUILD_READINESS_ANALYSIS.md` - What we have vs what's needed, critical gaps
- `MODERNIZATION_ASSESSMENT.md` - 3 modernization options
- `PHASE_4_COMPLETE.md` - What was accomplished in synthesis phase

**2. Strategic Planning**
- `09-migration-plan/migration-strategy.md` - Overall approach
- `09-migration-plan/phased-approach.md` - Detailed 3-phase plan
- `09-migration-plan/risk-assessment.md` - 10 major risks + mitigation
- `09-migration-plan/timeline-estimation.md` - Milestone-based approach

**3. Feature Scope**
- `03-features/feature-catalog.md` - All 121 features
- `03-features/feature-priority-matrix.md` - What to build first
- `03-features/user-journeys.md` - User pain points

### Technical Lead? Read This (2-3 hours)

**1. Architecture Understanding**
- `01-overview/architecture-overview.md` - System architecture
- `01-overview/technology-stack.md` - Current tech (React 18.3, TypeScript 5.9)
- `01-overview/state-management-patterns.md` - 3 state patterns in use

**2. Complexity Assessment**
- `03-features/complexity-assessment.md` - Technical complexity (XS-XXL)
- `03-features/feature-priority-matrix.md` - 20 quick wins identified

**3. Migration Technical Details**
- `07-state-management/flux-to-tanstack-migration.md` - How to modernize state
- `09-migration-plan/technology-recommendations.md` - New tech stack

**4. Sample Module Deep Dive**
- `02-modules/flows-v2.md` - Most complex module (XXL)
- `02-modules/trash.md` - Well-architected modern module

### Want to Reproduce the Research? (1 day)

**1. Understand Methodology**
- `HOW_TO_EXECUTE.md` - Step-by-step execution guide
- `AGENT_PROMPTS.md` - All 17 agent prompts
- `EXECUTION_TRACKER.md` - Agent completion status

**2. Study Template**
- `02-modules/_TEMPLATE.md` - Documentation template structure

**3. Run Parallel Agents**
- Follow instructions in `HOW_TO_EXECUTE.md`
- Use prompts from `AGENT_PROMPTS.md`
- Track progress like `EXECUTION_TRACKER.md`

### Building a Feature? (30 min per feature)

**Example: Building the Flow Builder**

**1. Read Module Documentation**
- `02-modules/flows-v2.md` - Current implementation
- `02-modules/FLOWS_INDEX.md` - Comparison with legacy

**2. Check Complexity**
- `03-features/complexity-assessment.md` - Search for "Flow Builder"
- Result: XXL complexity, 8-10 weeks

**3. Review User Workflows**
- `05-workflows/03-flow-creation-execution.md` - How users interact

**4. Check Design System**
- `04-components/INDEX.md` - Available components
- Look for Canvas, Node, Edge components

**5. API Integration**
- `06-api-contracts/api-clients.md` - Search for flow/orchestration APIs

**6. State Management**
- `07-state-management/zustand-usage-patterns.md` - flows-v2 uses Zustand
- Study the patterns used

---

## 📊 Quick Stats

| Category | Files | Lines | Description |
|----------|-------|-------|-------------|
| **For AI Systems** | 82 | ~49,000 | Technical specifications |
| **For Humans** | 11 | ~2,200 | Strategic planning & readiness |
| **Research Process** | 4 | ~500 | Methodology documentation |
| **TOTAL** | **97** | **~51,700** | Complete documentation |

---

## 🎯 Key Findings

### Technical Debt
- 40% legacy code (Flux + Immutable.js)
- 30% modern (TanStack Query)
- 30% modern (Zustand)

### Most Complex Modules
1. Generic Database Extractor (XXL, 8-10 weeks)
2. Visual Flow Builder (XXL, 8-10 weeks)
3. Transformations v2 (XL, 6-8 weeks)

### Quick Wins (20 features, 30 weeks)
- Modern modules: trash, notifications
- Simple extractors: email-attachments, storage
- Basic writers: Google Sheets, OneDrive

### Recommended Approach
**AI-First Hybrid**: Build AI chat interface alongside current UI
- Phase 1: Foundation & AI POC (6-8 weeks)
- Phase 2: Core Modernization & AI Expansion (8-10 weeks)
- Phase 3: Full Integration & Scale (8-10 weeks)

---

## 🔗 External Links

- **Repository**: https://github.com/keboola/ui
- **Branch**: https://github.com/keboola/ui/tree/padak/ui-experiment
- **Screenshots**: Located in `docs/08-screenshots/` (12 images, 3.6 MB)

---

**Last Updated**: 2025-10-19
**Documentation Method**: Parallel AI agents (17 agents in Phase 2, 4 agents in Phase 4)
**Quality**: 100% based on actual codebase analysis
