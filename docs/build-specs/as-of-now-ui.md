# Keboola UI Vision & Requirements

**Source:** Voice notes transcript (cleaned & translated)
**Date:** 2025-10-19
**Status:** Initial requirements capture

---

## 🎯 Vision

Rebuild Keboola's UI from scratch so an AI coding agent (with sub-agents) can implement it from clear instructions.

**Core Principles:**
- Keboola is a data platform; the UI is essentially an API client running in the user's browser
- Core business logic should live in backend APIs (API-first approach)
- Some UX helpers naturally happen in the UI (e.g., CSV delimiter preview, timezone pickers)

---

## 📋 What Users Need From The UI

### A) Dashboard (Project Overview)

**Purpose:** A cockpit showing whether the project delivers its intended business value.

**Key Elements:**
- Who's in the project
- What processes run
- Health status
- Billing (if applicable)
- Risks/warnings

**Typical Scenario:** "Campaign data prep is healthy; nothing to worry about."

---

### B) Connectors

**Model:** "Components" (Dockerized) with one or more configurations; users assemble processes from these blocks.

**User Needs:**
- List of available/installed connectors
- Status & versions
- Who configured them
- Quick actions (run one/all, rollback via version history)

**Mental Model:** "Git for business users" (safe versioning without Git knowledge)

---

### C) Data Manipulation (Transformations) & Workspaces

**Transformations:**
- Run SQL/Python against a warehouse
- Users write/adjust scripts

**Workspaces** (formerly "sandboxes"):
- Isolated, prepared test environments per transformation configuration
- Test against real sample data
- Safe experimentation space

---

### D) Storage

**Purpose:** View of data stored "in Keboola" (technically in a warehouse like Snowflake and files on S3).

**Two Primitives:**

1. **Tables** (warehouse)
   - Structured data storage
   - Queryable via SQL

2. **Files** (S3)
   - Object storage
   - Metadata & tags
   - Components can tag/consume by tag

---

### E) Flows (Orchestration)

**Purpose:** Users design end-to-end processes from component configurations.

**Execution Semantics:**
- **Phases:** A phase runs all included component configurations in parallel
  - Example: Pull from 5 sources concurrently, then proceed to next phase
- **Current:** Drag-and-drop canvas (powerful but complex)

**Proposed Simplification:**
- Users describe intent via natural language
- AI proposes the flow
- AI produces a Mermaid/Markdown flow diagram rendered read-only in the UI
- Users can ask AI to adjust (or switch to a light "edit" mode for small rearrangements)
- Consider reusing a well-known OSS JS canvas library (MIT-licensed)
  - Similar to what OpenAI used for agent demos
  - n8n-style editors

---

### F) Jobs

**Purpose:** System log of what's running/ran

**Features:**
- Per-component "jobs" with streaming logs/events
- Searchable (full-text via Elastic)
- Flow-level progress and statuses
- Real-time updates

---

### G) Settings

**Configuration Areas:**
- Project users & permissions
- API tokens
- Feature flags (betas)
- Backend/region configuration
- Organization membership
- Security settings

---

### H) Data Apps (Streamlit)

**What They Are:**
- Python Streamlit apps hosted by Keboola
- Exposed endpoints for access

**Use Cases:**
- Bespoke dashboards
- Internal forms/surveys
- Light operational tools driven by project data
- Self-service analytics

---

## 🏗️ Design Principles

1. **UI = Thin API Client**
   - Keep core logic server-side
   - UI consumes backend APIs

2. **Rich UX Helpers Client-Side**
   - Allow client-side improvements where it enhances experience
   - Examples: previews, pickers, instant validation

3. **Simpler Interactions**
   - Aim for simpler interactions over heavy drag-and-drop
   - Lean on AI for proposing/editing configurations and flows
   - Progressive disclosure of complexity

4. **API-First Architecture**
   - All functionality available via API
   - UI is one of many possible clients