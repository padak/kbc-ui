# Chat Module Documentation

## Overview

The Chat module provides AI-powered chat capabilities integrated across the Keboola UI. It enables:
- **Agent Chat Interface**: Conversational AI for data analysis and task assistance
- **Chat Message Streaming**: Real-time message rendering and feedback
- **Multi-display Modes**: Fullscreen, sidebar, and sheet layouts
- **Chat Context Persistence**: State management across navigation
- **Survey Integration**: Post-chat user feedback collection

## Architecture

### Core Structure

```
apps/kbc-ui/src/scripts/modules/chat/
├── ChatProvider.tsx                # Provider component with context setup
├── useChat.tsx                     # Custom hook for chat context
├── ChatContent.tsx                 # Message display and rendering
├── ChatButton.tsx                  # Floating chat trigger button
├── ChatHeader.tsx                  # Chat window header
├── FullscreenChat.tsx              # Fullscreen chat layout
├── SidebarChat.tsx                 # Sidebar chat layout
├── SheetChatContent.tsx            # Sheet-based chat layout
└── showSurvey.ts                   # Survey trigger utility
```

## Key Features

### 1. Chat Context Management

#### ChatContextType
```typescript
type ChatContextType = {
  isAvailable: boolean;             // Feature flag check
  isOpen: boolean;                  // Sidebar/sheet open state
  isFullscreen: boolean;            // Fullscreen mode state
  toggleSideChat: () => void;       // Toggle sidebar/sheet
  closeFullscreen: () => void;      // Exit fullscreen
  prompt: string;                   // Current input prompt
  setPrompt: (prompt: string) => void;
  expand: () => void;               // Enter fullscreen
  collapse: () => void;             // Exit fullscreen to sidebar
};
```

#### Global Chat Provider
- Wraps application with `@keboola/chat` GlobalChatProvider
- Manages chat state with feature flag checks
- Handles URL parameter based activation

### 2. Chat Provider Implementation

#### Features
- **Feature Flag Integration**: Checks `FEATURE_SIDEBAR_NAVIGATION` for layout mode
- **Availability Checking**: Uses `ApplicationStore.hasAgentChat()`
- **Welcome Page**: Triggered via `?agent_chat=true` URL parameter
- **Dynamic Layout**: Adapts between sidebar and sheet based on feature flags
- **ProductFruits Integration**: Shows/hides floating button based on sidebar state

#### State Management
```typescript
const [isSheetOpen, setIsSheetOpen] = useState(false);
const [isFullscreen, setIsFullscreen] = useState(shouldShowWelcomePage);
const [prompt, setPrompt] = useState('');
```

#### URL Parameter Handling
- Parameter: `?agent_chat=true`
- Triggers welcome page on initial load
- Auto-removes parameter after processing
- Prevents duplicate initialization

### 3. Message Handling and Streaming

#### ChatContent Component
```typescript
export const ChatContent = () => {
  // Filter and render messages
  chat.messages
    .filter((message) => message.parts.length > 0 && !message.metadata?.hidden)
    .map((message, index, messages) => (
      <MessageBubble
        variant={message.role === 'user' ? 'user' : 'assistant'}
        messageActions={shouldShowMessageActions(...)}
      >
        <MessageContent message={message} isLastMessage={isLastMessage} />
      </MessageBubble>
    ))

  // Show thinking indicator during processing
  {isAgentThinking(chat.status, chat.messages) && <ThinkingIndicator />}
};
```

#### Message Filtering
- Hides messages with `metadata.hidden` flag
- Filters empty messages (no parts)
- Preserves message order

#### Streaming States
- **User Messages**: Displayed immediately
- **Assistant Messages**: Rendered with streaming content
- **Thinking State**: Shows ThinkingIndicator while processing
- **Actions**: Show on last assistant message when ready

### 4. Chat Layouts

#### Fullscreen Chat
- Occupies entire viewport
- Header with close/collapse buttons
- Full message history display
- Extended input area

#### Sidebar Chat
- Fixed width sidebar panel
- Integrates with `@keboola/design` sidebar system
- Shows/hides via toggle
- Responsive to design system sidebar state

#### Sheet Chat
- Bottom sheet layout (mobile-friendly)
- Expandable area
- Touch-optimized input
- Fallback for non-sidebar navigation

### 5. Chat Navigation and Routing

#### Redirect Handling
```typescript
const handleRedirect = (url: string) => {
  if (!URL.canParse(url)) return;
  
  const pathname = new URL(url).pathname;
  const basename = getBaseName();
  const navigateTo = pathname.startsWith(basename)
    ? pathname.slice(basename.length)
    : pathname;
  navigate(navigateTo, { replace: true });
};
```

#### Chat ID Persistence
```typescript
const handleChatIdChange = (next: string | null) => {
  if (isOpen && isFullscreen) {
    setSearchParams(params => {
      if (next) params.set('chatId', next);
      else params.delete('chatId');
      return params;
    }, { replace: true });
  }
};
```

### 6. Integration with Global Chat Provider

#### Data Flow
1. **Local Context**: KBC-specific state (display mode, availability)
2. **Global Provider**: `@keboola/chat` handles messaging, streaming, history
3. **Combined Context**: Both available to components

#### Configuration Passed to GlobalChatProvider
```typescript
<GlobalChatProvider
  context={{
    branchId,                    // Development branch ID
    showWelcome: shouldShowWelcomePage
  }}
  onChatIdChange={handleChatIdChange}
  onRedirect={handleRedirect}
>
```

### 7. Survey Integration

#### showSurvey Function
- Triggered on fullscreen close
- Uses ProductFruits integration
- User satisfaction tracking
- Feedback collection

#### Implementation
```typescript
closeFullscreen: () => {
  showSurvey();                  // Collect feedback
  setIsFullscreen(false);        // Exit fullscreen
  handleChatIdChange(null);      // Clear chat ID
}
```

## State Management

### Provider State
- **isOpen**: Boolean indicating sidebar/sheet visibility
- **isFullscreen**: Boolean for fullscreen mode
- **prompt**: Current user input
- **isAvailable**: Feature availability from store

### Search Parameters
- **chatId**: Current chat conversation ID
- **agent_chat**: Initial activation parameter

### Stores Integration
- **ApplicationStore**: Feature flags, user info
- **DevBranchesStore**: Branch context for conversations

## Hooks

### useChat
```typescript
const useChat = (): ChatContextType => {
  const ctx = useContext(ChatContext);
  if (ctx === null) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};
```

**Usage:**
- Access chat state anywhere in the app
- Toggle chat visibility
- Manage fullscreen mode
- Control input prompt

### useSidebar
- From `@keboola/design` package
- Manages sidebar open state
- Supports animation transitions
- Mobile-responsive behavior

## API Integration

### Global Chat Provider APIs
- Message history retrieval
- Real-time message streaming
- Chat metadata management
- Conversation threading

### ProductFruits Integration
```typescript
// Show/hide floating button based on state
if (sidebar.open) {
  showButton();
} else {
  hideButton();
}
```

## Type Definitions

```typescript
// Chat context for local UI state
type ChatContextType = {
  isAvailable: boolean;
  isOpen: boolean;
  isFullscreen: boolean;
  toggleSideChat: () => void;
  closeFullscreen: () => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  expand: () => void;
  collapse: () => void;
};

// Message structure from @keboola/chat
type Message = {
  id: string;
  role: 'user' | 'assistant';
  parts: MessagePart[];
  metadata?: {
    hidden?: boolean;
    [key: string]: any;
  };
};

// Message part (supports streaming)
type MessagePart = {
  type: 'text' | 'code' | 'thinking';
  content: string;
};
```

## Component Composition

### Rendering Flow
1. **ChatProvider** wraps entire application
2. **GlobalChatProvider** handles messaging backend
3. **Chat UI Components** subscribe to context
4. **Message Display** renders with real-time updates
5. **Actions** show on hover/focus

### Conditional Rendering
- Chat button only shows if `isAvailable`
- Layout depends on feature flags
- Messages filtered by visibility
- Actions conditional on chat state

## Performance Considerations

### Optimization Strategies
- Memoized context values to prevent re-renders
- Lazy loading of chat content
- Search params updates with `replace: true`
- Efficient message filtering
- Deferred survey display

### Event Handlers
- useCallback memoization for stability
- Debounced prompt updates
- Minimal dependency arrays

## Integration Points

### With Storage Module
- Access user context for personalization
- Branch-specific conversations

### With Navigation
- Redirect handling for chat-suggested actions
- URL parameter integration
- Router state synchronization

### With UI Components
- Design system sidebar/sheet
- Button styling and interactions
- Modal overlays

### With ProductFruits
- Analytics tracking
- User feedback collection
- Feature engagement monitoring

## Development Guidelines

### Adding Chat Features
1. Extend `ChatContextType` if needed
2. Update `ChatProvider` logic
3. Add component in appropriate layout file
4. Subscribe to context in component

### Creating New Chat Layouts
1. Create component file (e.g., `NewLayoutChat.tsx`)
2. Receive props from `ChatProvider`
3. Render GlobalChatProvider content
4. Add conditional rendering to provider

### Integrating Chat Actions
1. Handle in `onRedirect` callback
2. Parse URL and navigate
3. Set chat ID in search params
4. Update prompt if needed

## Testing

### Key Areas
- Chat availability checks
- Layout switching (sidebar ↔ fullscreen)
- Message rendering and filtering
- URL parameter handling
- Redirect functionality
- Survey triggering
- State synchronization

### Mock Requirements
- ApplicationStore mocks
- DevBranchesStore mocks
- Global chat provider mock
- Router mock with search params

### Test Scenarios
- Feature disabled (isAvailable = false)
- URL parameter activation
- Layout transitions
- Message streaming
- Fullscreen → sidebar collapse
- Chat ID persistence
- Survey display on close

## Common Tasks

### Enable Chat for User
```typescript
// Check ApplicationStore.hasAgentChat()
// Or use URL parameter: ?agent_chat=true
```

### Access Chat in Component
```typescript
const { isOpen, prompt, toggleSideChat } = useChat();
```

### Navigate from Chat Action
```typescript
// GlobalChatProvider onRedirect handles navigation
// URL format: /path/to/destination
```

### Show/Hide Chat
```typescript
const { toggleSideChat, expand, collapse } = useChat();
toggleSideChat();  // Toggle sidebar/sheet
expand();          // Enter fullscreen
collapse();        // Return to sidebar
```

## Debugging

### Check Feature Availability
- Verify feature flag in ApplicationStore
- Check branch ID in DevBranchesStore

### Message Streaming Issues
- Check message parts array
- Verify metadata.hidden flag
- Monitor streaming status

### Layout Not Switching
- Confirm feature flag `FEATURE_SIDEBAR_NAVIGATION`
- Check sidebar provider setup
- Verify useSidebar hook integration

### Navigation Problems
- Validate URL in onRedirect
- Check basename calculation
- Verify router setup

## Security Considerations

- Branch isolation in conversation context
- User authentication via token
- Secure message transmission
- Metadata validation for hidden messages
- Survey data privacy

