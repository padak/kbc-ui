# Authentication Flow

**Date:** 2025-10-19
**Status:** Approved

---

## User Authentication

**Method:** API Token + Stack URL selection

### Login Screen

**User inputs:**
1. **KBC Stack URL** (dropdown or text input)
   - Common options:
     - `https://connection.keboola.com` (US)
     - `https://connection.eu-central-1.keboola.com` (EU)
     - `https://connection.north-europe.azure.keboola.com` (Azure EU)
     - Custom URL option
2. **Storage API Token** (text input, password field)

**Validation:**
- Test connection: `GET {stack_url}/v2/storage`
- Success → Store token + stack URL → Redirect to Dashboard
- Fail → Show error message

---

## Token Storage

**Local Storage:**
```typescript
localStorage.setItem('kbc_token', token)
localStorage.setItem('kbc_stack_url', stackUrl)
```

**Security:**
- Token never sent to any server except KBC APIs
- Clear on logout
- Optionally: Add expiration check

---

## API Client Setup

**All API requests:**
```typescript
fetch(`${stackUrl}/v2/storage/jobs`, {
  headers: {
    'X-StorageApi-Token': token,
    'Content-Type': 'application/json'
  }
})
```

---

## Logout

**Action:**
- Clear localStorage
- Redirect to login screen

---

## Session Persistence

**Behavior:**
- If token + stack URL in localStorage → Auto-login
- If invalid → Show login screen
- Optional: "Remember me" checkbox (default: on)

---

**Implementation:** Login screen is first thing to build
