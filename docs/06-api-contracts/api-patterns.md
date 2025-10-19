# API Client Patterns, Utilities, and Error Handling

Comprehensive documentation of common patterns, utilities, error handling, and authentication mechanisms used throughout the `@keboola/api-client` package.

## Table of Contents

1. [Fetch Client Architecture](#fetch-client-architecture)
2. [Middleware System](#middleware-system)
3. [Error Handling](#error-handling)
4. [Authentication](#authentication)
5. [Type System](#type-system)
6. [OpenAPI Integration](#openapi-integration)
7. [React Integration](#react-integration)
8. [Utilities](#utilities)
9. [Common Patterns](#common-patterns)

---

## Fetch Client Architecture

The fetch client is the foundation of all API clients, providing a lightweight, middleware-based HTTP client.

### Core Components

```typescript
// createFetchClient - Low-level client with middleware support
export const createFetchClient = ({
  middlewares = [],
  ...defaultOptions
}: CreateFetchClientOptions) => {
  // Returns HTTP methods with middleware chain
  return {
    get: (url, params, options?) => Promise<ApiResponse<Data>>,
    post: (url, params, options?) => Promise<ApiResponse<Data>>,
    put: (url, params, options?) => Promise<ApiResponse<Data>>,
    patch: (url, params, options?) => Promise<ApiResponse<Data>>,
    delete: (url, params, options?) => Promise<ApiResponse<Data>>,
  };
};
```

### CreateFetchClientOptions

```typescript
type CreateFetchClientOptions = {
  baseUrl: string;
  validateStatus?: ValidateStatusFn;
  middlewares?: MiddlewareFn[];
} & CustomRequestInit; // extends RequestInit

type ValidateStatusFn = (options: ApiResponse) => boolean | ApiError;

type CustomRequestInit = Omit<RequestInit, 'method' | 'body'>;
```

### FetchClientOptions

```typescript
type FetchClientOptions = {
  validateStatus?: ValidateStatusFn;
} & CustomRequestInit;
```

### ApiResponse Structure

```typescript
type ApiResponse<Data = unknown> = {
  data: Data;           // Parsed response data
  response: Response;   // Raw fetch Response object
  request: Request;     // Fetch Request object
};
```

### HTTP Methods

```typescript
type FetchMethod = <Data, Path, Query, Body>(
  url: string,
  params: FetchParams<Path, Query, Body>,
  options?: FetchClientOptions,
) => Promise<ApiResponse<Data>>;

type FetchParams<Path, Query, Body> = {
  path?: Path;          // URL path parameters (replaces {param})
  query?: Query;        // URL query parameters
  body?: Body;          // Request body
};
```

---

## Middleware System

The middleware system allows request/response interception and transformation through a chain-of-responsibility pattern.

### Middleware Function Type

```typescript
type MiddlewareFn = (
  request: FetchRequest,
  next: CoreFetchFn
) => Promise<ApiResponse>;

type FetchRequest = {
  request: Request;
  validateStatus: ValidateStatusFn;
};

type CoreFetchFn = (request: FetchRequest) => Promise<ApiResponse>;
```

### Middleware Execution

Middlewares are executed in order, forming a chain where each middleware can:

1. Modify the request before passing to the next middleware
2. Intercept the response from the next middleware
3. Handle errors from the chain

```typescript
// Middleware chain execution
const wrapMiddlewares = (middlewares: MiddlewareFn[], fetchFn: CoreFetchFn) => {
  const handler = async (request, index) => {
    if (index === middlewares.length) return fetchFn(request);
    
    const currentMiddleware = middlewares[index];
    return currentMiddleware(request, (nextRequest) => 
      handler(nextRequest, index + 1)
    );
  };
  
  return (request) => handler(request, 0);
};
```

### Built-in Middlewares

#### createCallbackMiddleware

**Purpose:** Execute callbacks on success, error, or completion.

```typescript
type CreateCallbackMiddlewareOptions = {
  onError?: (error: FetchClientError) => void;
  onSuccess?: () => void;
  onSettled?: () => void;
};

export const createCallbackMiddleware = (options = {}) => 
  async (request, next) => {
    let response;
    try {
      response = await next(request);
      options.onSuccess?.();
    } catch (error) {
      options.onError?.(error as FetchClientError);
      throw error;  // Re-throw for caller handling
    } finally {
      options.onSettled?.();
    }
    return response;
  };
```

#### createAuthMiddleware (Management Client)

**Purpose:** Automatic token validation and session management.

**Features:**
- Token validation on each request
- Automatic token refresh (session token creation)
- Environment-aware behavior (development vs. production)
- Token type handling (admin vs. session)

```typescript
export const createAuthMiddleware = ({
  accessToken,
  baseUrl,
}: {
  baseUrl: string;
  accessToken?: string;
}): MiddlewareFn => {
  // Internal state
  let token: string | undefined = accessToken;
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return async (request, next) => {
    if (token) {
      // Verify token validity
      const isValid = await verify.managementApiToken(baseUrl, token);
      if (!isValid) {
        // Refresh token:
        // - Dev: convert admin token to session token
        // - Prod: create new session token via admin credentials
        token = isDevelopment
          ? await auth.createCurrentUserSessionToken(token)
          : await auth.createAdminAccountSessionToken();
      }
    } else {
      // No token provided, create session token
      token = await auth.createAdminAccountSessionToken();
    }
    
    // Set token in request headers
    request.request.headers.set('X-Kbc-Manageapitoken', token);
    return next(request);
  };
};
```

### Custom Middleware Example

```typescript
// Logging middleware
const createLoggingMiddleware = (): MiddlewareFn => 
  async (request, next) => {
    console.log(`[${request.request.method}] ${request.request.url}`);
    
    const start = performance.now();
    const response = await next(request);
    
    const duration = performance.now() - start;
    console.log(`Response: ${response.response.status} (${duration.toFixed(2)}ms)`);
    
    return response;
  };

// Usage
const client = createGenericFetchClient({
  baseUrl: 'https://api.example.com',
  middlewares: [
    createLoggingMiddleware(),
    createCallbackMiddleware(options),
  ],
});
```

---

## Error Handling

### Error Types

#### ApiError

Thrown when HTTP status is not in success range (200-299).

```typescript
export class ApiError extends Error {
  response: Response;  // HTTP response object
  request: Request;   // HTTP request object
  data: unknown;      // Parsed response data/error message
  
  constructor({ response, request, data }: ApiResponse) {
    super(response.statusText);
    this.response = response;
    this.request = request;
    this.data = data;
  }
}
```

#### UserError

Application-level error for client-side validation failures.

```typescript
export class UserError extends Error {
  constructor(message: string) {
    super(message);
  }
}
```

**Example Usage:**
```typescript
// Vault client validates encrypted values
if (body.flags.includes('encrypted') && 
    !body.value.startsWith(ENCRYPTED_VALUE_PREFIX)) {
  throw new UserError(
    'Encryption of a value failed. Please contact our support.'
  );
}
```

#### ManagementClientAuthError

Authorization-specific error for Management API failures.

```typescript
export class ManagementClientAuthError extends Error {
  constructor(
    message: string,
    userMessage: string,
    apiResponse: ApiResponse
  ) {
    super(message);
    this.userMessage = userMessage;
    this.apiResponse = apiResponse;
  }
}

// Usage detection
export const isManagementClientAuthError = (
  error: unknown
): error is ManagementClientAuthError =>
  error instanceof ManagementClientAuthError;
```

**Detection in auth middleware:**
```typescript
const validateStatus = (apiResponse) => {
  const { response } = apiResponse;
  
  // Check if session expired (HTTP 302 with HTML response)
  const isTextContent = response.headers
    .get('content-type')
    ?.includes('text/html');
  
  if (isTextContent)
    return new ManagementClientAuthError(
      'Your session expired',
      'You will be logged out automatically.',
      apiResponse,
    );
  
  return defaultValidateStatus(apiResponse);
};
```

### FetchClientError Union

```typescript
type FetchClientError = TypeError | ApiError | SyntaxError | DOMException;

export const isFetchClientError = (error: unknown): error is FetchClientError =>
  error instanceof TypeError || 
  error instanceof SyntaxError || 
  isApiError(error);

export const isApiError = (error: unknown): error is ApiError =>
  error instanceof ApiError;

export const isAbortError = (error: unknown): error is DOMException =>
  error instanceof DOMException && error.name === 'AbortError';
```

### Error Handling Pattern

```typescript
import { isApiError, isAbortError } from '@keboola/api-client';

try {
  const result = await client.storage.getStackInfo();
} catch (error) {
  if (isAbortError(error)) {
    console.log('Request was cancelled');
  } else if (isApiError(error)) {
    console.error('API Error:', {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.data,
      url: error.request.url,
    });
  } else if (error instanceof Error) {
    console.error('Unknown error:', error.message);
  }
}
```

### Validation Status Functions

```typescript
type ValidateStatusFn = (apiResponse: ApiResponse) => boolean | ApiError;

// Default: 200-299 is success
export const defaultValidateStatus: ValidateStatusFn = ({ response }) =>
  response.status >= 200 && response.status <= 299;

// Custom validation example
const customValidateStatus = (apiResponse) => {
  const { response, data } = apiResponse;
  
  // Accept 2xx as success
  if (response.status >= 200 && response.status <= 299) return true;
  
  // Handle specific error cases
  if (response.status === 401) {
    return new ApiError(apiResponse); // Convert to error
  }
  
  // Reject other statuses
  return false;
};
```

---

## Authentication

### Token Types

**Storage API Token:**
- Header: `X-StorageApi-Token`
- Used by: Storage, Vault, Chat, Editor, QueryService, DataScience, Sandboxes, Metastore, SyncActions, Telemetry, Queue clients

**Management API Token:**
- Header: `X-Kbc-Manageapitoken`
- Used by: Management client
- Features: Automatic validation and session token creation

### Token Verification

The `createVerifyClient` provides token validation utilities:

```typescript
const verify = createVerifyClient();

// Verify Storage API token
const storageTokenInfo = await verify.storageApiToken(
  'https://api.keboola.com',
  'your-token'
);

// Verify Management API token
const managementTokenInfo = await verify.managementApiToken(
  'https://api.keboola.com',
  'your-token'
);
```

### Management Token Refresh Flow

The Management client automatically handles token refresh through middleware:

```
Initial Request
    ↓
Auth Middleware: Verify token validity
    ↓
Token Valid? ─── YES ──→ Continue to API
    │
    NO
    ↓
Development Environment?
    ├─ YES: Convert admin token → session token (via /manage/current-user/session-token)
    └─ NO: Create session token (via /admin/account/session-token)
    ↓
Set token in request headers
    ↓
Continue to API
```

---

## Type System

### Generic Type Parameters

All fetch methods support four type parameters for strict typing:

```typescript
client.get<Data, Path, Query, Body>(url, params, options)
//        ↑     ↑    ↑     ↑
//        |     |    |     └─ Request body type
//        |     |    └─ Query parameters type
//        |     └─ URL path parameters type
//        └─ Response data type
```

### Generic Fetch Client Types

```typescript
type FetchParams<Path, Query, Body> = {
  path?: Path;
  query?: Query;
  body?: Body;
};

type FetchMethod = <Data, Path, Query, Body>(
  url: string,
  params: FetchParams<Path, Query, Body>,
  options?: FetchClientOptions,
) => Promise<ApiResponse<Data>>;

type FetchClient = {
  get: FetchMethod;
  post: FetchMethod;
  put: FetchMethod;
  patch: FetchMethod;
  delete: FetchMethod;
};
```

### Creating Typed Clients

```typescript
// Generic fetch client (untyped URLs)
const client = createGenericFetchClient({
  baseUrl: 'https://api.example.com/v2/storage',
  headers: new Headers({ 'X-StorageApi-Token': token }),
});

// Usage
const response = await client.get<StackInfo, void, GetStackInfoQuery>(
  '',
  { query: { exclude: 'componentDetails' } }
);

// OpenAPI-typed client (type-safe URLs)
const chatClient = createOpenapiFetchClient<paths>({
  baseUrl: 'https://api.example.com/chat',
});

// Usage - URL must match one of the paths
const history = await chatClient.get('/history', { query: params });
```

---

## OpenAPI Integration

### OpenAPI Type Extraction

The client uses TypeScript utility types to extract information from OpenAPI schemas generated by `openapi-typescript`:

```typescript
// Extract query parameters type from OpenAPI operation
export type OpenapiQueryType<Operation> = 
  Operation extends { parameters?: { query?: infer Query } }
    ? Query
    : never;

// Extract path parameters
export type OpenapiPathType<Operation> = 
  Operation extends { parameters?: { path?: infer Path } }
    ? Path
    : never;

// Extract request body type
export type OpenapiBodyType<Operation> =
  HasRequestBody<Operation> extends true
    ? Operation extends { requestBody?: { content: { 'application/json': infer RequestBody } } }
      ? RequestBody
      : never
    : never;

// Extract response type
export type OpenapiReturnType<OP> = 
  OpenapiSuccessType<OpenapiResponseTypes<OP>>;
```

### Schema Definition Pattern

Each client with OpenAPI support includes a schema file:

```typescript
// src/clients/chat/__generated__/schema.d.ts
export type paths = {
  '/history': {
    get: {
      parameters: {
        query: {
          limit?: number;
          offset?: number;
        };
      };
      responses: {
        200: {
          content: {
            'application/json': Chat[];
          };
        };
      };
    };
  };
  '/chat': {
    post: {
      requestBody: {
        content: {
          'application/json': ChatRequest;
        };
      };
      responses: {
        201: {
          content: {
            'application/json': ChatResponse;
          };
        };
      };
    };
  };
};

export type components = {
  schemas: {
    Chat: { id: string; title: string; ... };
    ChatRequest: { ... };
  };
};
```

### Type Extraction Example

```typescript
import type { paths } from './__generated__/schema';

// Extract query type from GET /history
type GetHistoryQuery = OpenapiQueryType<paths['/history']['get']>;
// Result: { limit?: number; offset?: number }

// Extract request body from POST /chat
type CreateChatBody = OpenapiBodyType<paths['/chat']['post']>;
// Result: ChatRequest

// Extract response type
type GetHistoryResponse = OpenapiReturnType<paths['/history']['get']>;
// Result: Chat[]
```

### Type Generation

OpenAPI schemas are generated from API specifications:

```bash
yarn gen:types  # Generates __generated__/schema.d.ts files
```

---

## React Integration

### useApiClient Hook

```typescript
import { useApiClient } from '@keboola/api-client';

function MyComponent() {
  const client = useApiClient();  // Returns initialized ApiClient
  
  return (
    <button onClick={() => client.storage.getStackInfo()}>
      Fetch Stack Info
    </button>
  );
}
```

### ApiClientProvider Component

```typescript
import { ApiClient, ApiClientProvider } from '@keboola/api-client';

const apiClient = new ApiClient();

function App() {
  return (
    <ApiClientProvider value={apiClient}>
      {/* useApiClient() available throughout tree */}
      <MyComponent />
    </ApiClientProvider>
  );
}
```

### Context Initialization

```typescript
// src/react/context.ts
const Context = createContext<ApiClient | null>(null);

export const Provider = Context.Provider;

export const useApiClient = () => {
  const client = useContext(Context);
  if (client === null) {
    throw new Error(
      'useApiClient must be used within <ApiClientProvider />'
    );
  }
  return client;
};
```

### Initialization Pattern

```typescript
// Initialize on app startup
async function initializeApp() {
  const apiClient = new ApiClient();
  
  await apiClient.init({
    baseUrl: 'https://api.keboola.com',
    token: {
      storageApi: process.env.STORAGE_API_TOKEN,
      managementApi: process.env.MANAGEMENT_API_TOKEN,
    },
    callbacks: {
      onError: (error) => console.error('API Error:', error),
      onSuccess: () => console.log('API call successful'),
      onSettled: () => console.log('API call completed'),
    },
  });
  
  return apiClient;
}

// In App component
const App = () => {
  const [client, setClient] = useState<ApiClient | null>(null);
  
  useEffect(() => {
    initializeApp().then(setClient);
  }, []);
  
  if (!client) return <LoadingScreen />;
  
  return (
    <ApiClientProvider value={client}>
      <MainApp />
    </ApiClientProvider>
  );
};
```

---

## Utilities

### HTTP Header Constants

```typescript
export const KeboolaHttpHeader = {
  STORAGE_API_TOKEN: 'X-StorageApi-Token',
  MANAGEMENT_API_TOKEN: 'X-Kbc-Manageapitoken',
  STORAGE_API_URL: 'x-storageapi-url',
};

export const HttpHeader = {
  CONTENT_TYPE: 'content-type',
  CONTENT_DISPOSITION: 'content-disposition',
};

export const HttpContentType = {
  JSON: 'application/json',
  TEXT_PLAIN: 'text/plain',
  FORM_DATA: 'multipart/form-data',
  TEXT_HTML: 'text/html',
};
```

### Response Parsing

```typescript
// Automatic content-type based parsing
export const parseData = async (response: Response) => {
  // HTTP 204 No Content
  if (response.status === 204) return null;
  
  // JSON content type
  const contentType = response.headers.get('content-type');
  if (contentType === 'application/json') {
    return response.json();
  }
  
  // Try JSON parsing on text
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;  // Return as string if not JSON
  }
};
```

### Content-Disposition Parsing

```typescript
export const parseContentDispositionHeader = (header: string | null) => {
  if (!header) return null;
  
  // Example: attachment; filename="logs.txt"
  const filenameMatch = header.match(/filename="?([^"]+)"?/);
  
  return {
    filename: filenameMatch?.[1] ?? 'file',
  };
};

// Usage
const { fileName } = await client.dataScience.getAppLogsDownload(appId);
// Returns filename from Content-Disposition header
```

### URL Parameter Serialization

Uses `qs` library for query parameter serialization:

```typescript
import qs from 'qs';

// Converts query object to URL params
const queryString = qs.stringify(params);
// Example: { limit: 10, filter: { status: 'active' } }
// Result: "limit=10&filter%5Bstatus%5D=active"
```

### UUID Generation

```typescript
export const generateUUID = (): string => {
  // Generates RFC 4122 compliant UUID
};
```

### Keboola UID Format

```typescript
export const keboolaUID = (): string => {
  // Generates Keboola-specific UID format
};
```

### Polling and Delays

```typescript
export const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export const poll = <T>(
  fn: () => Promise<T>,
  options: {
    interval?: number;  // ms between polls
    maxAttempts?: number;
    timeout?: number;   // total ms timeout
  }
): Promise<T> => {
  // Polls function until it resolves or times out
};
```

### Abort Signal Utilities

```typescript
export const createAbortError = (): DOMException => 
  new DOMException('Aborted', 'AbortError');
```

---

## Common Patterns

### Sub-module Pattern

Many clients use a factory pattern for sub-modules:

```typescript
// Storage client with sub-modules
export const createStorageClient = ({ baseUrl, token, callbacks }) => {
  const client = createGenericFetchClient({
    baseUrl: `${baseUrl}/v2/storage`,
    middlewares: [createCallbackMiddleware(callbacks)],
    headers: new Headers({ 'X-StorageApi-Token': token }),
  });
  
  return {
    files: createFiles(client),
    tables: createTables(client),
    branches: createBranches(client),
    workspaces: createWorkspaces(client),
    // ... more modules
    getStackInfo: async (query, signal) => { ... },
  };
};

// Each sub-module receives the client
const createFiles = (client: GenericFetchClient) => ({
  upload: async (path, file) => { ... },
  download: async (id) => { ... },
  delete: async (id) => { ... },
});
```

### Pagination Pattern

Automatic pagination with token handling:

```typescript
const getSandboxes = async (branchId, signal) => {
  const result = await _getSandboxes({ branchId }, signal);
  
  const allData = [...result.data];
  let nextPageToken = result.nextPageToken;
  
  // Fetch all pages automatically
  while (nextPageToken !== null) {
    const nextResult = await _getSandboxes(
      { branchId, nextPageToken }, 
      signal
    );
    allData.push(...nextResult.data);
    nextPageToken = nextResult.nextPageToken;
  }
  
  return allData;
};
```

### Generic Type Specialization

```typescript
// Generic job retrieval with customizable operation type
const getJob = async <T extends JobOperation | string = string>(
  id: string,
  signal?: AbortSignal
): Promise<Job<T>> => {
  const { data } = await client.get<Job<T>>(
    `/jobs/{id}`,
    { path: { id } },
    { signal }
  );
  
  return data;
};

// Usage with specific type
type MyOperation = 'create' | 'update' | 'delete';
const job = await client.storage.jobs.getJob<MyOperation>(jobId);
```

### Streaming Configuration Pattern

```typescript
// Return configuration for streaming requests
const getStreamingConfig = () => ({
  apiUrl: `${baseUrl}/chat`,
  headers: {
    'content-type': 'application/json',
    'X-StorageApi-Token': token,
    'x-storageapi-url': storageApiUrl,
  },
});

// Used by consumers for EventSource or WebSocket connections
const config = client.chat.getStreamingConfig();
const eventSource = new EventSource(config.apiUrl, {
  headers: config.headers,
});
```

---

## Best Practices

### 1. Always Handle AbortSignal

```typescript
// Good
try {
  const data = await client.storage.getStackInfo({}, abortSignal);
} catch (error) {
  if (isAbortError(error)) {
    // Handle cancellation gracefully
    return;
  }
  // Handle other errors
}
```

### 2. Use Callback Middleware for Monitoring

```typescript
const client = new ApiClient();
await client.init({
  // ...
  callbacks: {
    onError: (error) => {
      logErrorToAnalytics(error);
    },
    onSuccess: () => {
      logSuccessToAnalytics();
    },
  },
});
```

### 3. Validate Custom Data Before Encryption

```typescript
// Check before encrypting
if (encryptedFlag && !value.startsWith(ENCRYPTED_VALUE_PREFIX)) {
  throw new UserError('Encryption failed. Contact support.');
}
```

### 4. Use Type-Safe OpenAPI Clients

```typescript
// Prefer OpenAPI-typed client over generic
const client = createOpenapiFetchClient<paths>({
  baseUrl,
});

// This ensures URL and parameters match OpenAPI schema
await client.get('/valid-path', { query: validParams });
```

### 5. Close Sessions When Done

```typescript
// Create session
const session = await client.editor.createSession({ workspaceId });

// Use session...

// Clean up
await client.editor.unload({ id: session.id });
```

---

## API Client Lifecycle

```
1. Instantiation
   new ApiClient()
   
2. Initialization
   await client.init(options)
   ├─ Creates Storage client
   ├─ Fetches stack info
   ├─ Creates service-specific clients
   └─ Returns when ready
   
3. Service Access
   client.storage, client.chat, etc.
   ├─ Direct method calls
   ├─ Middleware chain execution
   └─ Error handling
   
4. React Context Integration (optional)
   <ApiClientProvider value={client}>
     <useApiClient() /> hook access
   </ApiClientProvider>
```

---

## See Also

- [`api-clients.md`](./api-clients.md) - Complete API client documentation
- `packages/api-client/src/` - Source code
- `packages/api-client/src/fetchClient/` - Core fetch client implementation
- `packages/api-client/src/clients/` - Individual client implementations
