# Module: [Module Name]

## Overview
Brief description of what this module does and its role in the application.

## File Structure
```
module-name/
├── routes.tsx
├── components/
├── api.ts
├── store.ts (if Flux)
└── ...
```

## Routes
| Path | Component | Description |
|------|-----------|-------------|
| `/path` | ComponentName | Description |

## Key Components

### ComponentName
- **Location**: `apps/kbc-ui/src/scripts/modules/module-name/components/Component.tsx`
- **Purpose**: What it does
- **Props**: Key props and their types
- **State**: How it manages state (local, TanStack Query, Flux)
- **Child Components**: Important children

## API Endpoints

| Method | Endpoint | Purpose | Response Type |
|--------|----------|---------|---------------|
| GET | `/api/endpoint` | Description | TypeName |

## State Management

- **Pattern Used**: Flux / TanStack Query / Zustand / React State
- **Key Stores/Queries**:
  - Store/Query name: Purpose
- **Data Flow**: How data flows through the module

## Dependencies

### Internal Modules
- `modules/other-module` - Why it's used

### External Packages
- `package-name` - Purpose

### Design System Components
- `Button`, `Modal`, `Card`, etc.

## Notable Patterns

- Implementation details worth noting
- Complex logic
- Performance optimizations
- Interesting use of hooks or patterns

## User-Facing Features

### Feature 1: Name
- **Description**: What users can do
- **Workflow**: Steps involved
- **Components**: Which components are used

## Technical Debt & Observations

- Legacy patterns still in use
- Areas that could be improved
- Complexity hotspots
- Migration notes (Flux → TanStack Query, etc.)

## Code Examples

### Important Pattern or Hook
```typescript
// Example code showing key pattern
```

## Related Modules

- `module-name` - Relationship description

## Testing

- Test coverage notes
- Key test files
- Testing approach
