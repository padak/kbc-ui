# Initial Prompt for New Repository

**When:** After creating new repo with `/docs` folder copied
**Where:** Fresh repo at https://github.com/padak/kbc-ui

---

## 🎯 Copy This Prompt

```
I'm building a new UI for Keboola Connection (data platform).

Context:
- All planning and specs are done (see @docs/instructions/)
- Technical stack approved: Next.js 14 + TypeScript + Tailwind + shadcn/ui
- Design system defined: Keboola blue #1F8FFF, system fonts
- First feature: Dashboard (fully spec'd in @docs/instructions/dashboard-spec.md)

Your tasks:
1. Scaffold Next.js 14 project (TypeScript, Tailwind, App Router)
2. Install and configure shadcn/ui
3. Create @public/font-options.html - HTML preview showing 5 font options:
   - System fonts (default)
   - Inter (Google Fonts)
   - Roboto (Google Fonts)
   - Public Sans (Google Fonts)
   - Work Sans (Google Fonts)
4. Build login screen per @docs/instructions/auth-flow.md
5. Build dashboard per @docs/instructions/dashboard-spec.md

Requirements:
- Use Keboola blue #1F8FFF as primary color
- Polling: 5s for jobs, 30s for stats (no WebSockets)
- Auth: API token + Stack URL selector
- Local dev only (no Vercel deployment)
- Reference @docs/ for API contracts and feature details

Start with scaffolding the project. Let me know when ready for next step.
```

---

## 📋 What Happens Next

**Claude will:**
1. ✅ Create Next.js project structure
2. ✅ Set up Tailwind config with Keboola colors
3. ✅ Install shadcn/ui components
4. ✅ Create font options HTML preview
5. ✅ Build login screen
6. ✅ Build dashboard with API integration
7. ✅ Give you `pnpm dev` command to run locally

**You'll:**
1. Review font options → pick one
2. Test login with real API token
3. See dashboard with live data
4. Provide feedback
5. Iterate until happy
6. Move to next feature

---

## 🚀 Faster Alternative (More Specific)

If you want to jump straight to building:

```
Build Keboola Connection UI Dashboard.

Setup:
- Create Next.js 14 app (TypeScript, Tailwind, App Router)
- Install shadcn/ui: button, card, badge, input, select
- Primary color: #1F8FFF (Keboola blue)
- System fonts

Then build these screens:

1. Login (@docs/instructions/auth-flow.md)
   - Stack URL dropdown (connection.keboola.com, connection.eu-central-1.keboola.com, custom)
   - API token input (password field)
   - Validate with GET {stackUrl}/v2/storage
   - Store in localStorage

2. Dashboard (@docs/instructions/dashboard-spec.md)
   - 4 metric cards: Jobs (running/failed/success), Storage (size/tables), Flows (count/status), Team (members)
   - Recent activity feed (last 10 events)
   - Active jobs table
   - Poll every 5s for jobs, 30s for stats
   - See spec for full details

Reference @docs/06-api-contracts/ for API endpoints.

Start with scaffolding.
```

---

## ✅ Before You Start

**In new repo, ensure you have:**
- [ ] `/docs` folder copied from analysis repo
- [ ] Clean git repo (initialized)
- [ ] Node.js 18+ installed
- [ ] pnpm installed (`npm install -g pnpm`)

**Then paste the prompt above!**

---

**Estimated time:** 3-4 hours from prompt to working dashboard
