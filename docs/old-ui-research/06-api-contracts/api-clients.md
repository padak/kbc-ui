# API Client Contracts

Complete documentation of all API client modules in `@keboola/api-client` package with their endpoints, methods, and type contracts.

## Table of Contents

1. [Storage Client](#storage-client)
2. [Chat Client](#chat-client)
3. [Query Service Client](#query-service-client)
4. [Editor Client](#editor-client)
5. [Management Client](#management-client)
6. [Data Science Client](#data-science-client)
7. [Sync Actions Client](#sync-actions-client)
8. [Vault Client](#vault-client)
9. [Encryption Client](#encryption-client)
10. [Sandboxes Client](#sandboxes-client)
11. [Metastore Client](#metastore-client)
12. [Telemetry Client](#telemetry-client)
13. [Queue Client](#queue-client)
14. [Verify Client](#verify-client)

---

## Storage Client

**File:** `src/clients/storage/storageClient.ts`

**Base URL:** `{baseUrl}/v2/storage`

**Authentication:** `X-StorageApi-Token` header

### Main Methods

#### `getStackInfo(query?: GetStackInfoQuery, signal?: AbortSignal)`

Returns stack information including available services and service URLs.

```typescript
type GetStackInfoQuery = {
  exclude: 'componentDetails';
};

type StackInfo = {
  api: string;
  documentation: string;
  services: Service[];
  components: Component[];
  features: string[];
  host: string;
  revision: string;
  stack: string;
  urlTemplates: {
    orchestrationJob: string;
  };
  version: string;
};

type Service = {
  id: ServiceId;
  url: string;
};

type ServiceId =
  | 'vault'
  | 'data-science'
  | 'encryption'
  | 'sandboxes'
  | 'telemetry'
  | 'editor'
  | 'query'
  | 'queue'
  | 'kai-assistant'
  | 'sync-actions';

// Returns
type GetStackInfoResponse = {
  stackInfo: StackInfo;
  serviceMap: Record<ServiceId, string>;
};
```

### Sub-Modules

#### **Files Module** (`createFiles(client)`)

Methods for file operations in storage:
- File upload, download, deletion
- File browsing and listing
- File metadata operations

#### **Tables Module** (`createTables(client)`)

Methods for table operations:
- Table creation, deletion, modification
- Table schema management
- Row operations

#### **Branches Module** (`createBranches(client)`)

Methods for branch management:
- List branches
- Get branch details
- Create/delete branches
- Branch merging

#### **Workspaces Module** (`createWorkspaces(client)`)

Methods for workspace operations:
- List workspaces
- Load/unload operations
- Workspace configuration

#### **Merge Requests Module** (`createMergeRequests(client)`)

Methods for managing merge requests:
- Create, list, review merge requests
- Merge operations
- PR approvals

#### **Jobs Module** (`createJobs(client)`)

Methods for job operations:

```typescript
const getJob = async <T extends JobOperation | string = string>(
  id: string,
  signal?: AbortSignal
): Promise<Job<T>>;

type Job<T> = {
  id: string;
  runId: string;
  projectId: string;
  status: string;
  operationName: T;
  createdTime: string;
  startTime?: string;
  endTime?: string;
  result?: {
    message: string;
  };
  error?: {
    message: string;
    context?: Record<string, unknown>;
  };
};

type JobOperation = string;
```

#### **Components and Configurations Module** (`createComponentsAndConfigurations(client)`)

Methods for component and configuration management:
- List components
- Get configuration details
- CRUD operations on configurations

---

## Chat Client

**File:** `src/clients/chat/chatClient.ts`

**Base URL:** Service URL from stack info (`kai-assistant` service)

**Authentication:** `X-StorageApi-Token` and `x-storageapi-url` headers

### Methods

#### `getHistory(params?: GetHistoryQuery)`

Retrieve chat history.

```typescript
type GetHistoryQuery = {
  limit?: number;
  offset?: number;
};

type HistoryResponse = Chat[];

type Chat = {
  id: string;
  createdTime: string;
  updatedTime: string;
  title: string;
};
```

#### `getChat(chatId: string)`

Get a single chat with all messages.

```typescript
type ChatWithMessages = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdTime: string;
  updatedTime: string;
};

type ChatMessage = {
  role: 'user' | 'assistant';
  parts: MessagePart[];
  timestamp: string;
};

type MessagePart = {
  type: 'text' | 'thinking';
  content: string;
};
```

#### `deleteChat(chatId: string)`

Delete a chat and its associated messages.

#### `createChat(request: ChatRequest)`

Create a new chat and optionally send the first message.

```typescript
type ChatRequest = {
  title?: string;
  messages?: ChatMessage[];
};

// Returns
type ChatResponse = {
  id: string;
  title: string;
};
```

#### `getVotes(chatId: string)`

Get votes/ratings for a chat.

```typescript
type VotesResponse = Vote[];

type Vote = {
  chatId: string;
  messageId: string;
  rating: 'positive' | 'negative' | 'neutral';
  feedback?: string;
};
```

#### `submitVote(params: VoteRequest)`

Submit a vote/rating for a message.

```typescript
type VoteRequest = {
  chatId: string;
  messageId: string;
  rating: 'positive' | 'negative' | 'neutral';
  feedback?: string;
};
```

#### `getStreamingConfig()`

Get configuration for streaming chat responses.

```typescript
type StreamingConfig = {
  apiUrl: string;
  headers: Record<string, string>;
};
```

---

## Query Service Client

**File:** `src/clients/queryService/queryServiceClient.ts`

**Base URL:** Service URL from stack info (`query` service)

**Authentication:** `X-StorageApi-Token` header

### Methods

#### `createQueryJob(branchId: string, workspaceId: string, body: PostQueryBody)`

Create a new query job for SQL execution.

```typescript
type PostQueryBody = {
  sql: string;
  labels?: string[];
  timeout?: number;
  // Additional query parameters
};

type QueryJobResponse = {
  id: string;
  status: 'CREATED' | 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  createdTime: string;
};
```

#### `getQueryJobStatus(queryJobId: string)`

Get current status of a query job.

```typescript
type QueryJobStatus = {
  id: string;
  status: string;
  createdTime: string;
  startTime?: string;
  endTime?: string;
  error?: string;
};
```

#### `getQueryResults(queryJobId: string, statementId: string)`

Retrieve results from a completed query.

```typescript
type QueryResults = {
  columns: string[];
  rows: unknown[][];
  statistics?: {
    executionTime: number;
    scannedBytes?: number;
  };
};
```

#### `getQueryHistory(branchId: string, workspaceId: string, query?: GetQueriesHistoryQuery)`

Get historical queries for a workspace.

```typescript
type GetQueriesHistoryQuery = {
  limit?: number;
  offset?: number;
  status?: string;
};

type QueryHistoryResponse = {
  queries: QueryJobStatus[];
  total: number;
};
```

#### `cancelQueryJob(queryJobId: string)`

Cancel a running or queued query job.

```typescript
// Returns
type CancelResponse = {
  id: string;
  status: 'CANCELLED';
};
```

---

## Editor Client

**File:** `src/clients/editor/editorClient.ts`

**Base URL:** Service URL from stack info (`editor` service)

**Authentication:** `X-StorageApi-Token` header

### Methods

#### `createSession(body: CreateSqlSessionBody)`

Create a SQL editing session.

```typescript
type CreateSqlSessionBody = {
  workspaceId: string;
};

type SqlSession = {
  id: string;
  workspaceId: string;
  createdTime: string;
};
```

#### `getSession(id: string, signal?: AbortSignal)`

Get session details.

```typescript
type SessionDetails = {
  id: string;
  workspaceId: string;
  schema?: {
    tables: TableSchema[];
  };
};
```

#### `getSessionSchema(id: string, onlyWorkspaceSchema?: '0' | '1', loadTables?: '0' | '1', signal?: AbortSignal)`

Retrieve database schema for a session.

```typescript
type SchemaResponse = {
  tables: TableSchema[];
  views: ViewSchema[];
};

type TableSchema = {
  name: string;
  columns: ColumnSchema[];
  primaryKey?: string[];
};

type ColumnSchema = {
  name: string;
  type: string;
  nullable: boolean;
};
```

#### `createQueryJob(id: string, body: PostSqlRunQueryBody)`

Execute a SQL query in a session.

```typescript
type PostSqlRunQueryBody = {
  sql: string;
};

type QueryJobResponse = {
  jobId: string;
  status: string;
};
```

#### `tablePreview(id: string, body: PostSqlTablePreviewBody)`

Get a preview of table data.

```typescript
type PostSqlTablePreviewBody = {
  tableName: string;
  limit?: number;
};

type TablePreviewResponse = {
  columns: string[];
  rows: unknown[][];
};
```

#### `load(id: string, body: PostSqlSessionLoadBody)`

Load data into the session.

```typescript
type PostSqlSessionLoadBody = {
  tableId: string;
};
```

#### `unload(id: string, body?: PostSqlSessionUnloadBody)`

Unload data from the session.

```typescript
type PostSqlSessionUnloadBody = {
  tableId: string | null;
};
```

---

## Management Client

**File:** `src/clients/management/managementClient.ts`

**Base URL:** `{baseUrl}/manage`

**Authentication:** `X-Kbc-Manageapitoken` header (with automatic token refresh via auth middleware)

### Features

- **Authentication Middleware:** Automatic token validation and refresh
- **Token Types:** Supports both 'admin' and 'session' token types
- **Session Management:** Auto-creates session tokens from admin tokens in development

### Sub-Modules

#### **Projects Module** (`createProjects(client)`)

Methods for project management:
- List all projects
- Get project details
- Create/update/delete projects
- Project configuration

#### **Features Module** (`createFeatures(client)`)

Methods for feature flag management:
- Check feature availability
- Get feature details
- Manage feature flags

#### **Users Module** (`createUsers(client)`)

Methods for user management:
- List users
- Get user details
- Create/update/delete users
- User role management
- User permissions

---

## Data Science Client

**File:** `src/clients/dataScience/dataScienceClient.ts`

**Base URL:** Service URL from stack info (`data-science` service)

**Authentication:** `X-StorageApi-Token` header

### Methods

#### `getAppLogsDownload(appId: string, signal?: AbortSignal)`

Download application logs as file.

```typescript
type AppLogsDownloadResponse = {
  logs: Blob;
  fileName: string;
};
```

#### `getAppLogsTail(appId: string, query?: GetDataAppLogsTailQuery, signal?: AbortSignal)`

Get the tail of application logs with polling support.

```typescript
type GetDataAppLogsTailQuery = {
  sinceTimestamp?: string;
};

type AppLogsTailResponse = {
  logs: string | null;
  nextLogTimestamp: string | null;
};
```

#### `patchApp(appId: string, body: PatchDataAppBody, signal?: AbortSignal)`

Update data app configuration.

```typescript
type PatchDataAppBody = {
  name?: string;
  description?: string;
  // Additional app fields
};

type DataAppResponse = {
  id: string;
  name: string;
  description: string;
  updatedTime: string;
};
```

---

## Sync Actions Client

**File:** `src/clients/syncActions/syncActionsClient.ts`

**Base URL:** Service URL from stack info (`sync-actions` service)

**Authentication:** `X-StorageApi-Token` header

### Methods

#### `sendSyncAction(body: PostActionsBody, signal?: AbortSignal)`

Send a sync action request to the backend.

```typescript
type PostActionsBody = {
  action: string;
  configData: Record<string, unknown>;
  // Additional fields
};

type PostActionsResponse = {
  status: string;
  data?: Record<string, unknown>;
};
```

#### `enrollMFA(input: EnrollMFAInput, signal?: AbortSignal)`

Enroll user in multi-factor authentication.

```typescript
type EnrollMFAInput = {
  email: string;
  // Additional fields from PostActionsBody
};
```

### Sub-Modules

#### **Git Repository Module** (`gitRepository`)

Methods for Git repository operations:
- Repository access and management
- Clone, pull, push operations
- Branch management
- Credential management

---

## Vault Client

**File:** `src/clients/vault/vaultClient.ts`

**Base URL:** Service URL from stack info (`vault` service)

**Authentication:** `X-StorageApi-Token` header

### Methods

#### `getVariables(query: GetVariablesQuery, signal?: AbortSignal)`

Retrieve variables from vault.

```typescript
type GetVariablesQuery = {
  // Query parameters for filtering
};

type VariableWithHash = {
  hash: string;
  name: string;
  value: string;
  flags: string[]; // e.g., ['encrypted']
  createdTime: string;
  modifiedTime: string;
};
```

#### `createVariable(body: CreateVariableBody, signal?: AbortSignal)`

Create a new variable in vault.

```typescript
type CreateVariableBody = {
  name: string;
  value: string;
  flags: string[];
};

type VariableResponse = {
  hash: string;
  name: string;
  createdTime: string;
};
```

#### `deleteVariable(hash: string, signal?: AbortSignal)`

Delete a variable from vault.

#### `getVariablesByBranchId(branchId: string, signal?: AbortSignal)`

Get variables scoped to a specific branch.

```typescript
// Returns
type VariableWithHash[];
```

#### `getProjectWideVariables(signal?: AbortSignal)`

Get project-wide variables (branch-agnostic).

```typescript
// Returns
type VariableWithHash[];
```

**Note:** Uses internal method with `branchId = 'null'` to fetch project-wide variables.

---

## Encryption Client

**File:** `src/clients/encryption/encryptionClient.ts`

**Base URL:** Service URL from stack info (`encryption` service)

**Authentication:** No token required

### Methods

#### `encrypt(data: EncryptQuery & { data: string }, signal?: AbortSignal)`

Encrypt a string value.

```typescript
type EncryptQuery = {
  projectId: string;
  branchType: string;
  componentId: string;
};

type EncryptResponse = string; // KBC:encrypted_value_base64
```

#### `encryptSecrets<T extends Record<string, unknown>>(data: EncryptQuery & { data: T }, signal?: AbortSignal)`

Encrypt secrets in an object. Fields prefixed with `#` will be encrypted.

```typescript
type InputData = {
  name: string;
  '#secret': 'sensitive-value';
  nested: {
    '#password': 'abc123';
  };
};

type EncryptedData = {
  name: string;
  '#secret': 'KBC:encrypted_value_base64';
  nested: {
    '#password': 'KBC:encrypted_value_base64';
  };
};
```

**Encryption Prefix:** `KBC:` (from `ENCRYPTED_VALUE_PREFIX` constant)

---

## Sandboxes Client

**File:** `src/clients/sandboxes/sandboxesClient.ts`

**Base URL:** Service URL from stack info (`sandboxes` service)

**Authentication:** `X-StorageApi-Token` header

### Methods

#### `getSandbox(id: string, signal?: AbortSignal)`

Get details of a single sandbox.

```typescript
type SandboxDetail = {
  id: string;
  workspaceId: string;
  name: string;
  status: string;
  createdTime: string;
  expiresTime?: string;
  config?: Record<string, unknown>;
};
```

#### `getSandboxes(branchId: string, signal?: AbortSignal)`

Get all sandboxes for a branch (handles pagination automatically).

```typescript
type Sandbox = {
  id: string;
  workspaceId: string;
  name: string;
  status: string;
  createdTime: string;
};

// Returns
type Sandbox[];
```

**Note:** Implements automatic pagination handling through internal `_getSandboxes()` method using `nextPageToken`.

---

## Metastore Client

**File:** `src/clients/metastore/metastoreClient.ts`

**Base URL:** `https://metastore.canary-orion.keboola.dev`

**Authentication:** `X-StorageApi-Token` header

### Methods

#### `healthCheck(signal?: AbortSignal)`

Check metastore service health.

```typescript
type HealthCheckResponse = {
  status: 'ok';
};
```

### Sub-Modules

#### **Repository Module** (`repository`)

Methods for metastore repository operations:
- Repository browsing and management
- Schema/table operations

#### **Schema Module** (`schema`)

Methods for schema management:
- Schema creation/deletion
- Schema browsing

---

## Telemetry Client

**File:** `src/clients/telemetry/telemetryClient.ts`

**Base URL:** Service URL from stack info (`telemetry` service)

**Authentication:** `X-StorageApi-Token` header

### Sub-Modules

#### **Provisioning Module** (`createProvisioning(client)`)

Methods for workspace provisioning:

```typescript
const createCredentials = async (body: CreateCredentialsBody, signal?: AbortSignal)

type CreateCredentialsBody = {
  // Workspace provisioning parameters
};

type WorkspaceData = {
  // Provisioned workspace credentials and metadata
};
```

---

## Queue Client

**File:** `src/clients/queue/queueClient.ts`

**Base URL:** Service URL from stack info (`queue` service)

**Authentication:** `X-StorageApi-Token` header

### Methods

#### `getJob(jobId: string, signal?: AbortSignal)`

Get status of a queued job.

```typescript
type QueueJobResponse = {
  id: string;
  jobId: string;
  status: string;
  createdTime: string;
  startTime?: string;
  endTime?: string;
};
```

---

## Verify Client

**File:** `src/clients/verify/createVerifyClient.ts`

**Base URL:** Provided as parameter

**Authentication:** Token-based (no token required for instantiation)

### Methods

#### `storageApiToken(host: string, token: string, signal?: AbortSignal)`

Verify a Storage API token.

```typescript
type StorageToken = {
  id: string;
  description: string;
  token: string; // Masked token representation
  created: string;
};
```

#### `managementApiToken(host: string, token: string, signal?: AbortSignal)`

Verify a Management API token.

```typescript
type ManagementToken = {
  id: string;
  description: string;
  created: string;
  // Additional token metadata
};
```

---

## Client Initialization

All clients are created through the main `ApiClient` class:

```typescript
import { ApiClient } from '@keboola/api-client';

const client = new ApiClient();
await client.init({
  baseUrl: 'https://api.keboola.com',
  token: {
    storageApi: 'your-storage-api-token',
    managementApi: 'optional-management-api-token',
  },
  callbacks: {
    onError: (error) => console.error('API Error:', error),
    onSuccess: () => console.log('Request successful'),
    onSettled: () => console.log('Request finished'),
  },
});

// Access individual clients
const stackInfo = await client.storage.getStackInfo();
const history = await client.chat.getHistory();
```

---

## OpenAPI Schema Support

All clients except generic utilities use OpenAPI-generated schemas:

- **Location:** `__generated__/schema.d.ts` in each client directory
- **Generated via:** `openapi-typescript` package
- **Type extraction:** Uses utility types for path, query, body, and response types

Example from chat client:

```typescript
import type { paths } from './__generated__/schema';
import type {
  OpenapiQueryType,
  OpenapiPathType,
  OpenapiBodyType,
  OpenapiReturnType,
} from '../../fetchClient';

export type GetHistoryQuery = OpenapiQueryType<paths['/history']['get']>;
export type GetChatPath = OpenapiPathType<paths['/chat/{id}']['get']>;
export type ChatRequest = OpenapiBodyType<paths['/chat']['post']>;
```

---

## Common Headers

### Storage API Headers

```typescript
const KeboolaHttpHeader = {
  STORAGE_API_TOKEN: 'X-StorageApi-Token',
  MANAGEMENT_API_TOKEN: 'X-Kbc-Manageapitoken',
  STORAGE_API_URL: 'x-storageapi-url', // Used by Chat client
};
```

### HTTP Headers

```typescript
const HttpHeader = {
  CONTENT_TYPE: 'content-type',
  CONTENT_DISPOSITION: 'content-disposition',
};

const HttpContentType = {
  JSON: 'application/json',
  TEXT_PLAIN: 'text/plain',
  FORM_DATA: 'multipart/form-data',
  TEXT_HTML: 'text/html',
};
```

---

## Error Handling

See [`api-patterns.md`](./api-patterns.md) for comprehensive error handling patterns.
