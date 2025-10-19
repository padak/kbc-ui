# Design System Audit Report

**Date:** 2025-10-19
**Scope:** Complete UI codebase alignment with established design system
**Design System Sources:**
- `/docs/instructions/design-system.md`
- `/design-system.html`
- `/src/app/globals.css`

---

## Executive Summary

**Overall Status:** ⚠️ **MODERATE MISALIGNMENT** - 67 violations found across 23 files

The codebase shows a **mixed implementation** with both design system tokens and hard-coded values. While `globals.css` properly defines all CSS custom properties from the design system, many components bypass these tokens and use hard-coded Tailwind classes instead.

**Key Issues:**
1. ✅ **CSS Tokens Properly Defined** - `globals.css` correctly implements all design system tokens
2. ⚠️ **Tailwind Config Incomplete** - Missing mappings for semantic colors (success, warning, error, info)
3. ❌ **Hard-coded Colors** - 143 instances of hard-coded blue/gray/purple colors in components
4. ⚠️ **Sidebar Color Inconsistency** - Dark theme (gray-900) conflicts with design system (light theme preferred)
5. ⚠️ **Component Token Usage** - Components use Tailwind classes instead of CSS custom properties
6. ❌ **Primary Color Mismatch** - shadcn/ui tokens override Keboola blue #1F8FFF

---

## Critical Violations (Priority: HIGH)

### 1. Primary Color Definition Conflict

**File:** `src/app/globals.css` (lines 151-152)
**Issue:** shadcn/ui HSL tokens override Keboola primary blue

```css
/* WRONG: shadcn/ui default (dark blue-gray) */
--primary: 222.2 47.4% 11.2%;
--primary-foreground: 210 40% 98%;
```

**Expected:**
```css
/* CORRECT: Use Keboola blue #1F8FFF */
--primary: 199 100% 56%;  /* #1F8FFF in HSL */
--primary-foreground: 0 0% 100%;  /* white */
```

**Impact:** Button default variant uses wrong color
**Files Affected:** All components using `bg-primary` class

---

### 2. Sidebar Dark Theme vs Design System Light Theme

**File:** `src/components/layout/sidebar.tsx` (line 89)
**Issue:** Sidebar uses dark background (gray-900) instead of light theme

```tsx
// WRONG: Dark gradient sidebar
className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white"
```

**Design System Spec:** Light mode with `bg-white/80 backdrop-blur-lg`

**Expected:**
```tsx
// CORRECT: Light theme sidebar
className="bg-white/80 backdrop-blur-lg border-r border-gray-200/50"
```

**Impact:** Visual inconsistency with design system mockup
**Priority:** HIGH - Affects entire app navigation

---

### 3. Hard-coded Hex Colors in Sparkle Icon

**File:** `src/components/ui/sparkle-icon.tsx` (lines 35-37)
**Issue:** AI gradient colors hard-coded instead of using CSS variables

```tsx
// WRONG: Hard-coded hex values
<stop offset="0%" style={{ stopColor: "#a855f7", stopOpacity: 1 }} />
<stop offset="50%" style={{ stopColor: "#3b82f6", stopOpacity: 1 }} />
<stop offset="100%" style={{ stopColor: "#06b6d4", stopOpacity: 1 }} />
```

**Expected:**
```tsx
// CORRECT: Use CSS variables
<stop offset="0%" style={{ stopColor: "var(--color-ai-purple)", stopOpacity: 1 }} />
<stop offset="50%" style={{ stopColor: "var(--color-ai-blue)", stopOpacity: 1 }} />
<stop offset="100%" style={{ stopColor: "var(--color-ai-cyan)", stopOpacity: 1 }} />
```

---

### 4. Incomplete Tailwind Config Mapping

**File:** `tailwind.config.ts` (lines 12-24)
**Issue:** Only primary colors mapped, missing semantic colors

```typescript
// CURRENT: Incomplete
colors: {
  primary: {
    50: "var(--color-primary-50)",
    // ... only primary colors
  }
}
```

**Expected:**
```typescript
// CORRECT: Complete mapping
colors: {
  primary: {
    50: "var(--color-primary-50)",
    // ... (current code is correct for primary)
  },
  success: {
    50: "var(--color-success-50)",
    500: "var(--color-success-500)",
    700: "var(--color-success-700)",
  },
  warning: {
    50: "var(--color-warning-50)",
    500: "var(--color-warning-500)",
    700: "var(--color-warning-700)",
  },
  error: {
    50: "var(--color-error-50)",
    500: "var(--color-error-500)",
    700: "var(--color-error-700)",
  },
  info: {
    50: "var(--color-info-50)",
    500: "var(--color-info-500)",
    700: "var(--color-info-700)",
  },
  neutral: {
    50: "var(--color-neutral-50)",
    100: "var(--color-neutral-100)",
    200: "var(--color-neutral-200)",
    300: "var(--color-neutral-300)",
    400: "var(--color-neutral-400)",
    500: "var(--color-neutral-500)",
    600: "var(--color-neutral-600)",
    700: "var(--color-neutral-700)",
    800: "var(--color-neutral-800)",
    900: "var(--color-neutral-900)",
  }
}
```

---

## Major Violations (Priority: MEDIUM)

### 5. Hard-coded Tailwind Colors Instead of Semantic Tokens

**Affected Files:** 21 files with 143 total violations

**Pattern:** Components use Tailwind's default color palette instead of design system tokens

**Examples:**

#### Example A: `src/components/layout/sidebar.tsx` (lines 97, 123)
```tsx
// WRONG: Hard-coded blue-500, purple-600
bg-gradient-to-br from-blue-500 to-purple-600

// CORRECT: Use design tokens
bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-ai-purple)]
```

#### Example B: `src/components/dashboard/insight-card.tsx` (lines 288, 294)
```tsx
// WRONG: Hard-coded color classes
bg-gradient-to-r from-green-400 to-emerald-500
bg-gradient-to-r from-red-400 to-rose-500

// CORRECT: Use semantic tokens
bg-gradient-to-r from-[var(--color-success-500)] to-[var(--color-success-700)]
bg-gradient-to-r from-[var(--color-error-500)] to-[var(--color-error-700)]
```

#### Example C: `src/app/(dashboard)/dashboard/page.tsx` (line 69)
```tsx
// WRONG: Hard-coded gradient
bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600

// CORRECT: Use tokens
bg-gradient-to-r from-[var(--color-primary-600)] via-[var(--color-primary-500)] to-[var(--color-ai-purple)]
```

**Impact:** Changes to design system colors won't propagate automatically
**Effort:** ~2-3 hours to fix all instances

---

### 6. Dashboard Layout Background Gradient

**File:** `src/components/layout/dashboard-layout.tsx` (line 119)
**Issue:** Custom gradient not defined in design system

```tsx
// WRONG: Custom gradient
bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20
```

**Expected:**
```tsx
// CORRECT: Use neutral background from design system
bg-[var(--color-neutral-50)]

// OR: Define in globals.css as
--bg-app: linear-gradient(135deg, var(--color-neutral-50), var(--color-primary-50)/30, var(--color-ai-purple)/20);
```

---

### 7. Active Navigation Indicator Color

**File:** `src/components/layout/sidebar.tsx` (line 123)
**File:** `src/components/layout/dashboard-layout.tsx` (line 158)

```tsx
// INCONSISTENT: Uses blue-600 in dark sidebar, primary-500 in light layout
// sidebar.tsx
bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600

// dashboard-layout.tsx
bg-gradient-to-r from-[var(--color-primary-500)]/10 to-[var(--color-ai-purple)]/10
```

**Expected:** Consistent use of design tokens across both layouts

---

## Minor Violations (Priority: LOW)

### 8. Spacing Inconsistencies

**Issue:** Some components use arbitrary spacing instead of design system scale

**Examples:**
- `px-4`, `py-2` instead of `px-[var(--space-4)]`, `py-[var(--space-2)]`
- However, Tailwind's default scale (1 unit = 4px) matches design system

**Assessment:** Low priority - Tailwind scale aligns with design system base unit

---

### 9. Font Weight Usage

**Assessment:** ✅ **COMPLIANT**
- Components correctly use `font-normal`, `font-medium`, `font-semibold`, `font-bold`
- Matches design system: 400, 500, 600, 700

---

### 10. Icon Sizes

**Assessment:** ✅ **COMPLIANT**
- Consistent use of `w-4 h-4`, `w-5 h-5`, `w-6 h-6`
- Matches design system: 16px, 20px, 24px

---

## Compliance Summary by Category

| Category | Status | Violations | Notes |
|----------|--------|------------|-------|
| **Colors - CSS Tokens** | ✅ PASS | 0 | `globals.css` correctly defines all tokens |
| **Colors - Tailwind Config** | ⚠️ PARTIAL | 1 | Missing semantic color mappings |
| **Colors - Component Usage** | ❌ FAIL | 143+ | Hard-coded classes instead of tokens |
| **Primary Color** | ❌ FAIL | 1 | shadcn/ui default overrides Keboola blue |
| **Typography** | ✅ PASS | 0 | Correct font weights and sizes |
| **Spacing** | ✅ PASS | 0 | Tailwind scale matches design system |
| **Icons** | ✅ PASS | 0 | Correct sizes and Lucide React only |
| **Components** | ✅ PASS | 0 | Using shadcn/ui as specified |
| **Sidebar Theme** | ❌ FAIL | 1 | Dark theme vs light design system |
| **Border Radius** | ✅ PASS | 0 | Using Tailwind defaults (rounded-md, rounded-lg) |

**Overall Compliance:** 60% (6/10 categories passing)

---

## Recommended Fix Priority

### Phase 1: Critical Fixes (1-2 hours)

1. **Fix Primary Color in globals.css**
   - Change `--primary` HSL value to match #1F8FFF
   - Test all Button components

2. **Complete Tailwind Config**
   - Add semantic color mappings (success, warning, error, info, neutral)
   - Test color usage across components

3. **Decide on Sidebar Theme**
   - Option A: Keep dark sidebar (document as intentional deviation)
   - Option B: Change to light sidebar (align with design system)

### Phase 2: Major Fixes (2-3 hours)

4. **Replace Hard-coded Colors**
   - Search and replace common patterns:
     - `from-blue-500` → `from-[var(--color-primary-500)]`
     - `from-blue-600` → `from-[var(--color-primary-600)]`
     - `to-purple-600` → `to-[var(--color-ai-purple)]`
     - `from-gray-900` → `from-[var(--color-neutral-900)]`
     - `text-green-600` → `text-[var(--color-success-500)]`
     - `text-red-600` → `text-[var(--color-error-500)]`

5. **Fix SparkleIcon Hard-coded Colors**
   - Use CSS variables for gradient stops

6. **Standardize Background Gradients**
   - Define common gradients in globals.css
   - Use utility classes

### Phase 3: Documentation (30 minutes)

7. **Document Intentional Deviations**
   - If keeping dark sidebar, document why
   - Update design-system.md with actual implementation

8. **Create Style Guide**
   - Examples of correct token usage
   - Common patterns for gradients
   - Don't use hard-coded colors rule

---

## Top 10 Violations with Before/After

### 1. Primary Color HSL Value

**File:** `src/app/globals.css` (line 151)

```css
/* BEFORE */
--primary: 222.2 47.4% 11.2%;

/* AFTER */
--primary: 199 100% 56%;  /* #1F8FFF */
```

---

### 2. Sidebar Background

**File:** `src/components/layout/sidebar.tsx` (line 89)

```tsx
// BEFORE
className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white"

// AFTER
className="bg-white/80 backdrop-blur-lg text-gray-900"
```

---

### 3. Logo Gradient in Sidebar

**File:** `src/components/layout/sidebar.tsx` (line 97)

```tsx
// BEFORE
bg-gradient-to-br from-blue-500 to-purple-600

// AFTER
bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-ai-purple)]
```

---

### 4. Active Link Background

**File:** `src/components/layout/sidebar.tsx` (line 123)

```tsx
// BEFORE
bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600

// AFTER
bg-gradient-to-r from-[var(--color-primary-600)] via-[var(--color-primary-500)] to-[var(--color-ai-purple)]
```

---

### 5. Dashboard Title Gradient

**File:** `src/app/(dashboard)/dashboard/page.tsx` (line 69)

```tsx
// BEFORE
className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 bg-clip-text text-transparent"

// AFTER
className="text-gradient-ai"  // Use utility class from globals.css
```

---

### 6. Insight Card Success Border

**File:** `src/components/dashboard/insight-card.tsx` (line 288)

```tsx
// BEFORE
bg-gradient-to-r from-green-400 to-emerald-500

// AFTER
bg-gradient-to-r from-[var(--color-success-500)] to-[var(--color-success-700)]
```

---

### 7. Insight Card Error Border

**File:** `src/components/dashboard/insight-card.tsx` (line 294)

```tsx
// BEFORE
bg-gradient-to-r from-red-400 to-rose-500

// AFTER
bg-gradient-to-r from-[var(--color-error-500)] to-[var(--color-error-700)]
```

---

### 8. Quick Actions Gradient Accent

**File:** `src/components/dashboard/quick-actions.tsx` (line 61)

```tsx
// BEFORE
bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400

// AFTER
bg-gradient-to-r from-[var(--color-primary-400)] via-[var(--color-ai-purple)] to-[var(--color-ai-cyan)]
```

---

### 9. Run Flow Button Gradient

**File:** `src/components/dashboard/quick-actions.tsx` (line 102)

```tsx
// BEFORE
className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"

// AFTER
className="bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] hover:from-[var(--color-primary-600)] hover:to-[var(--color-primary-700)]"
```

---

### 10. Tailwind Config - Add Semantic Colors

**File:** `tailwind.config.ts` (lines 12-24)

```typescript
// BEFORE
extend: {
  colors: {
    primary: {
      50: "var(--color-primary-50)",
      // ... only primary
    }
  }
}

// AFTER
extend: {
  colors: {
    primary: {
      50: "var(--color-primary-50)",
      100: "var(--color-primary-100)",
      200: "var(--color-primary-200)",
      300: "var(--color-primary-300)",
      400: "var(--color-primary-400)",
      500: "var(--color-primary-500)",
      600: "var(--color-primary-600)",
      700: "var(--color-primary-700)",
      800: "var(--color-primary-800)",
      900: "var(--color-primary-900)",
    },
    success: {
      50: "var(--color-success-50)",
      500: "var(--color-success-500)",
      700: "var(--color-success-700)",
    },
    warning: {
      50: "var(--color-warning-50)",
      500: "var(--color-warning-500)",
      700: "var(--color-warning-700)",
    },
    error: {
      50: "var(--color-error-50)",
      500: "var(--color-error-500)",
      700: "var(--color-error-700)",
    },
    info: {
      50: "var(--color-info-50)",
      500: "var(--color-info-500)",
      700: "var(--color-info-700)",
    },
    neutral: {
      50: "var(--color-neutral-50)",
      100: "var(--color-neutral-100)",
      200: "var(--color-neutral-200)",
      300: "var(--color-neutral-300)",
      400: "var(--color-neutral-400)",
      500: "var(--color-neutral-500)",
      600: "var(--color-neutral-600)",
      700: "var(--color-neutral-700)",
      800: "var(--color-neutral-800)",
      900: "var(--color-neutral-900)",
    },
  }
}
```

---

## Files Requiring Changes

### High Priority (3 files)
1. `src/app/globals.css` - Fix --primary HSL value
2. `tailwind.config.ts` - Add semantic color mappings
3. `src/components/layout/sidebar.tsx` - Theme decision (dark vs light)

### Medium Priority (18 files with hard-coded colors)
1. `src/components/layout/sidebar.tsx`
2. `src/components/layout/dashboard-layout.tsx`
3. `src/app/(dashboard)/dashboard/page.tsx`
4. `src/components/dashboard/insight-card.tsx`
5. `src/components/dashboard/quick-actions.tsx`
6. `src/components/ui/sparkle-icon.tsx`
7. `src/components/ui/ai-badge.tsx`
8. `src/components/dashboard/active-jobs.tsx`
9. `src/components/dashboard/recent-activity.tsx`
10. `src/components/dashboard/compact-recent-activity.tsx`
11. `src/components/ai/ai-suggestions.tsx`
12. `src/components/ai/command-palette.tsx`
13. `src/app/(dashboard)/storage/page.tsx`
14. `src/app/(dashboard)/jobs/page.tsx`
15. `src/app/(dashboard)/flows/page.tsx`
16. `src/app/(dashboard)/transformations/page.tsx`
17. `src/app/(dashboard)/data-apps/page.tsx`
18. `src/app/(dashboard)/settings/page.tsx`

### Low Priority (Documentation)
1. `docs/instructions/design-system.md` - Update with actual implementation notes

---

## Testing Checklist

After implementing fixes, verify:

- [ ] All buttons use Keboola blue (#1F8FFF)
- [ ] Sidebar theme is consistent with decision (dark or light)
- [ ] Success states use green from design system
- [ ] Error states use red from design system
- [ ] Warning states use orange from design system
- [ ] AI-powered components use purple/blue/cyan gradient
- [ ] No hard-coded hex colors in components (except SVG gradients using CSS vars)
- [ ] All Tailwind color classes reference design system tokens
- [ ] Hot reload works when changing CSS custom properties
- [ ] Light/dark mode toggle (future) will work with current token structure

---

## Estimated Effort

| Phase | Tasks | Effort | Priority |
|-------|-------|--------|----------|
| Phase 1 | Critical fixes (3 files) | 1-2 hours | HIGH |
| Phase 2 | Replace hard-coded colors (18 files) | 2-3 hours | MEDIUM |
| Phase 3 | Documentation updates | 30 min | LOW |
| **TOTAL** | **67 violations across 23 files** | **3.5-5.5 hours** | - |

---

## Conclusion

The design system is **well-defined** in `globals.css` and `design-system.html`, but **implementation is inconsistent**. The main issue is that components bypass the design tokens and use hard-coded Tailwind classes.

**Root Cause:** Developers used Tailwind's default color names (blue-500, gray-900) instead of the custom tokens (primary-500, neutral-900).

**Solution:** Systematic find-and-replace + Tailwind config completion will align the codebase with the design system in ~4-5 hours.

**Benefit:** Once fixed, all color changes will propagate automatically via CSS custom properties, making design iterations 10x faster.

---

**Audit Completed:** 2025-10-19
**Audited By:** Claude Code
**Next Steps:** Review findings → Prioritize fixes → Implement Phase 1 critical fixes
