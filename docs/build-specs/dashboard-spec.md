# Dashboard Feature Specification

**Feature:** Project Dashboard (Main Screen)
**Priority:** P0 (First feature to build)
**Complexity:** Medium
**Estimated:** 2-3 days with AI

---

## User Goal

**Primary:** "Check project health and activity at a glance in <30 seconds"

**User Types:**
- Data Engineers: Daily health checks
- Project Managers: Team activity monitoring
- On-call Engineers: Incident response
- New Team Members: Understanding project state

---

## Success Criteria

✅ Dashboard loads in <2 seconds
✅ Shows project health without scrolling
✅ Critical issues immediately visible
✅ Works on mobile (on-call access)
✅ Updates automatically (polling or WebSocket)
✅ Accessible (keyboard nav, screen reader)

---

## User Actions

**Primary:**
- View current job statuses
- See recent activity
- Identify failed jobs
- Navigate to problem areas (click to drill down)

**Secondary:**
- Filter by time range (last hour, day, week)
- Refresh data manually
- Quick actions: run flow, view logs

---

## UI Sections

### 1. Header
- Project name
- Region/backend indicator
- User profile menu

### 2. Health Overview (Top Cards)

**Metrics Cards (4 cards in a row):**

1. **Jobs Status**
   - Running count (yellow/animated)
   - Failed count (red/bold)
   - Success count (green)
   - Click → Jobs page

2. **Storage**
   - Total tables count
   - Total size (GB)
   - Trend indicator (↑↓)
   - Click → Storage page

3. **Flows**
   - Total flows count
   - Last run status
   - Next scheduled run
   - Click → Flows page

4. **Team**
   - Active members count
   - Recent activity count
   - Click → Settings/Users

### 3. Recent Activity (Timeline)

**Shows last 10 events:**
- Timestamp (relative: "2 min ago")
- Event type icon
- Description ("User X ran Flow Y")
- Status indicator (success/fail/running)
- Click → Event detail

**Event types:**
- Job completed
- Flow started
- Configuration changed
- User joined
- Data loaded

### 4. Active Jobs (Table)

**If any jobs running/queued:**
- Job name
- Component type
- Started time
- Progress (if available)
- Actions: view logs, cancel

**Empty state:** "No active jobs"

### 5. Quick Actions (Bottom)

**Action buttons:**
- Run a flow (dropdown)
- Create extractor
- View all jobs
- Go to storage

---

## Data Requirements

### API Endpoints Needed:

**1. Project Info**
```
GET /v2/storage
Response: {project, features, limits}
```

**2. Job Queue Status**
```
GET /v2/storage/jobs?limit=20&offset=0
Response: [{id, status, component, runId, startTime, endTime}]
```

**3. Storage Metadata**
```
GET /v2/storage/stats
Response: {tables: {count, bytes}, files: {count, bytes}}
```

**4. Recent Events**
```
GET /v2/storage/events?limit=10
Response: [{id, created, message, type, component}]
```

**5. Flows (Orchestrations)**
```
GET /v2/orchestrations
Response: [{id, name, active, lastExecution}]
```

**6. Project Users**
```
GET /v2/storage/tokens
Response: [{id, description, created, admin}]
```

---

## UI States

### Loading State
- Skeleton loaders for cards
- "Loading project..." message
- No flicker on re-fetch

### Error States

**API Error:**
- Show error banner at top
- Display cached data if available
- Retry button

**No Data:**
- Empty state illustrations
- Onboarding CTA: "Get started" button
- Links to docs

**Partial Data:**
- Show what's available
- Indicate missing sections
- Error details in footer

### Polling/Updates

**Strategy:**
- Poll every 5 seconds for job status (max frequency allowed)
- Poll every 30 seconds for other stats
- WebSockets NOT available (use polling only)
- Stop polling when tab inactive (save resources)

---

## Design Constraints

**Colors (Status):**
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)
- Info: Blue (#3B82F6)
- Neutral: Gray (#6B7280)

**Spacing:**
- Use Tailwind default scale (4, 8, 16, 24px)
- Card padding: 24px
- Section gaps: 32px

**Typography:**
- Headings: Font-bold
- Body: Font-normal
- Mono: For IDs, timestamps

**Responsive:**
- Desktop: 4 cards per row
- Tablet: 2 cards per row
- Mobile: 1 card per row, stack all

---

## Accessibility

**Requirements:**
- All cards keyboard navigable
- Status announced to screen readers
- Color not the only indicator (use icons)
- Focus visible on all interactive elements
- Skip to main content link

**ARIA:**
- Cards use semantic `<article>` or `<section>`
- Status badges have `aria-label`
- Live regions for updates

---

## Performance

**Targets:**
- Initial load: <2s
- Time to Interactive: <3s
- Bundle size: <300KB (initial)

**Optimization:**
- Code split by route
- Lazy load charts (if added)
- Memoize expensive computations
- Virtual scroll for long lists (if >50 items)

---

## Error Handling

**Network Errors:**
- Toast notification
- Retry logic (3 attempts)
- Fallback to cached data

**API Errors:**
- 401: Redirect to login
- 403: Show "Access denied" message
- 404: Show "Project not found"
- 500: Show "Server error, try again"

---

## Future Enhancements (Not V1)

- Charts (job trends over time)
- Customizable widgets (drag & drop)
- Alert thresholds (notify on X failures)
- Export data (CSV/JSON)
- Compare projects (multi-project view)

---

## Acceptance Checklist

**Functional:**
- [ ] All 4 metric cards display correct data
- [ ] Recent activity shows last 10 events
- [ ] Active jobs table updates in real-time
- [ ] Click on card navigates to detail page
- [ ] Refresh button works
- [ ] Loading states show properly
- [ ] Error states show properly

**Non-Functional:**
- [ ] Loads in <2 seconds
- [ ] Works on mobile (test on iPhone/Android)
- [ ] Keyboard navigation works
- [ ] Screen reader announces updates
- [ ] No console errors
- [ ] TypeScript strict mode passes
- [ ] Lighthouse score >90

---

## Decisions Made

1. **WebSockets:** NOT available - use polling only ✅
2. **Max polling frequency:** 5 seconds (for jobs), 30 seconds (for stats) ✅
3. **Auth flow:** User enters API token + selects KBC Stack URL ✅
4. **Cache strategy:** Keep data until next successful fetch (TBD: local storage persistence)

---

**Next Step:** Scaffold repository and build Dashboard
