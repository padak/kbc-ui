# AI Theme Quick Reference Guide

## 🎨 Available AI Components

### 1. AIBadge
```tsx
import { AIBadge } from "@/components/ui/ai-badge";

// Default (full gradient)
<AIBadge>AI-Powered</AIBadge>

// Subtle (light gradient with border)
<AIBadge variant="subtle">Intelligent</AIBadge>
```

### 2. GradientCard
```tsx
import { GradientCard, GradientCardHeader, GradientCardTitle, GradientCardContent } from "@/components/ui/gradient-card";

// AI variant with glow
<GradientCard variant="ai">
  <GradientCardHeader>
    <GradientCardTitle>AI Insight</GradientCardTitle>
  </GradientCardHeader>
  <GradientCardContent>
    Content here
  </GradientCardContent>
</GradientCard>

// Success variant
<GradientCard variant="success">...</GradientCard>
```

### 3. SparkleIcon
```tsx
import { SparkleIcon } from "@/components/ui/sparkle-icon";

// Sizes: sm, md, lg
<SparkleIcon size="md" animated />
<SparkleIcon size="sm" className="opacity-60" />
```

## 🎨 Utility Classes

### Gradients
```tsx
// Gradient text (animated)
<h1 className="text-gradient-ai">AI-Powered Platform</h1>

// Gradient background (animated)
<div className="bg-gradient-ai text-white">...</div>

// Subtle gradient background
<div className="bg-gradient-ai-subtle">...</div>
```

### Effects
```tsx
// Hover lift (card rises on hover)
<div className="hover-lift">...</div>

// AI glow
<div className="glow-ai">...</div>

// AI glow on hover
<button className="glow-ai-hover">...</button>

// Success pulse
<span className="glow-success">✓ Success</span>

// Floating animation
<div className="float">...</div>
```

### Glassmorphism
```tsx
// Light glass
<div className="glass">...</div>

// Dark glass
<div className="glass-dark">...</div>
```

### Loading States
```tsx
// Shimmer effect
<div className="shimmer">Loading...</div>
```

## 🎨 CSS Custom Properties

### AI Colors
```css
var(--color-ai-purple)      /* #a855f7 */
var(--color-ai-blue)        /* #3b82f6 */
var(--color-ai-cyan)        /* #06b6d4 */
var(--color-ai-gradient)    /* Linear gradient */
var(--color-ai-gradient-subtle) /* Subtle gradient */
```

### Glow Effects
```css
var(--glow-ai)              /* Soft purple glow */
var(--glow-ai-strong)       /* Strong purple glow */
var(--color-success-glow)   /* Green glow */
var(--color-warning-glow)   /* Orange glow */
```

## 💡 Common Patterns

### AI Feature Header
```tsx
<div className="flex items-center gap-2">
  <SparkleIcon size="md" />
  <h2 className="text-xl font-semibold">AI-Powered Insights</h2>
</div>
```

### AI Badge with Title
```tsx
<div className="flex items-center gap-2">
  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 bg-clip-text text-transparent">
    Keboola Connection
  </h1>
  <AIBadge variant="subtle" className="text-xs">
    AI-Powered
  </AIBadge>
</div>
```

### Gradient Background
```tsx
<div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
  {/* Content */}
</div>
```

### Glassmorphism Header
```tsx
<header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-10">
  {/* Header content */}
</header>
```

### Success Badge with Glow
```tsx
<Badge className="bg-green-100 text-green-800 hover-lift glow-success">
  {count} success
</Badge>
```

## 🎬 Animation Examples

### Keyframe Animations Available
- `shimmer` - Loading indicator
- `float` - Gentle vertical motion
- `success-pulse` - Pulsing glow
- `gradient-shift` - Animated gradient (built into utilities)
- `sparkle` - Scale + fade
- `pulse-glow` - Pulsing glow effect

### Custom Animation
```tsx
// Combine multiple effects
<div className="hover-lift float glow-ai-hover">
  Interactive AI element
</div>
```

## 🎨 Color Coding by State

### Positive (Green)
```tsx
<Badge className="bg-green-100 text-green-800 glow-success">
  Success
</Badge>
```

### Warning (Yellow/Amber)
```tsx
<Badge className="bg-yellow-100 text-yellow-800">
  Running
</Badge>
```

### Error (Red)
```tsx
<Badge className="bg-red-100 text-red-800">
  Failed
</Badge>
```

### AI/Neutral (Purple/Blue)
```tsx
<Badge className="bg-gradient-ai text-white">
  AI Feature
</Badge>
```

## 🔧 Extending the Theme

### Add New AI Color
In `globals.css`:
```css
:root {
  --color-ai-green: #10b981;
  --color-ai-gradient-alt: linear-gradient(135deg, #10b981, #3b82f6, #a855f7);
}
```

### Create Custom Animation
In `globals.css`:
```css
@keyframes custom-animation {
  0% { /* start */ }
  100% { /* end */ }
}

.custom-effect {
  animation: custom-animation 2s ease-in-out infinite;
}
```

### New Utility Class
In `globals.css`:
```css
@layer utilities {
  .custom-utility {
    /* Your styles */
  }
}
```

## 📊 Performance Tips

1. **Use CSS animations** (not JavaScript) for 60fps
2. **Limit simultaneous animations** to 3-4 on screen
3. **Use `transform` and `opacity`** for best performance
4. **Avoid animating** `width`, `height`, `top`, `left`
5. **Test on mobile** - reduce motion if needed

## ♿ Accessibility

All AI visual enhancements maintain:
- ✅ WCAG AA contrast ratios
- ✅ Reduced motion support (add `prefers-reduced-motion` media queries)
- ✅ Screen reader compatibility
- ✅ Keyboard navigation

### Add Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  .float,
  .shimmer,
  .glow-success {
    animation: none;
  }
}
```

## 🎯 Best Practices

1. **Don't overuse gradients** - Use strategically for AI elements only
2. **Keep animations subtle** - 2-3 second durations minimum
3. **Test performance** - Monitor frame rates during development
4. **Maintain hierarchy** - AI elements should enhance, not distract
5. **Stay consistent** - Use the same gradient/glow for similar features

## 📱 Responsive Considerations

```tsx
// Reduce effects on mobile
<div className="hover-lift md:glow-ai-hover">
  {/* Glow only on desktop */}
</div>

// Smaller sparkles on mobile
<SparkleIcon size="sm" className="md:w-5 md:h-5" />
```

---

**Last Updated:** 2025-10-19
**Version:** 1.0.0
**Maintained by:** Design System Team
