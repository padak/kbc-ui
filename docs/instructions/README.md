# Implementation Instructions

**For:** AI coding agents building Keboola UI v2
**Status:** Ready to build
**Repository:** New repo (to be created)

---

## Quick Start

1. **Read:** [as-of-now-ui.md](./as-of-now-ui.md) - Vision & requirements
2. **Review:** [technical-stack.md](./technical-stack.md) - Tech decisions
3. **Check:** [design-system.md](./design-system.md) - Design foundation
4. **Build:** [dashboard-spec.md](./dashboard-spec.md) - First feature

---

## Documents

| File | Purpose | Status |
|------|---------|--------|
| `as-of-now-ui.md` | Vision, features, principles | ✅ Complete |
| `technical-stack.md` | Framework, tools, deployment | ✅ Approved |
| `design-system.md` | Colors, components, spacing | ✅ Approved |
| `dashboard-spec.md` | Dashboard feature spec | ✅ Approved |
| `auth-flow.md` | Authentication implementation | ✅ Approved |

---

## Next Steps

### ✅ Completed
1. ✅ Vision defined (as-of-now-ui.md)
2. ✅ Technical stack approved
3. ✅ Design system approved (Keboola blue #1F8FFF)
4. ✅ Dashboard spec approved
5. ✅ Auth flow defined

### 🚀 Ready to Build

**Repository:** https://github.com/padak/kbc-ui

**Build Order:**
1. Copy `/docs` to new repo (reference material)
2. Scaffold Next.js project
3. Create font options deck (HTML preview)
4. Build login screen (auth-flow.md)
5. Build Dashboard (dashboard-spec.md)
6. Run locally with `pnpm dev`

**Decisions:**
- Keboola blue: `#1F8FFF`
- System fonts (+ options deck to choose)
- Polling: 5s (jobs), 30s (stats)
- Auth: Token + Stack URL
- Local dev only (no Vercel yet)

---

**Estimated Time:** 3-4 hours to working local Dashboard
