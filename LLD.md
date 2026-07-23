# 🔬 SwishOS Platform: Low-Level Design (LLD) Specification

## 1. Low-Level Component Specifications & Function Signatures

### 1.1 Vector Threat Cluster Centroid Classifier ([`src/lib/semantic-centroid.ts`](file:///Users/muneeb/Documents/GitHub/portfolio/src/lib/semantic-centroid.ts))

Evaluates semantic distance AND sub-word character N-gram similarity against threat vector centroids to eliminate keyword density gliding.

```typescript
export interface CentroidEvaluationResult {
  isThreat: boolean;
  matchedCategory?: string;
  centroidScore: number;
  reason?: string;
}

export function evaluateSemanticCentroidDistance(text: string): CentroidEvaluationResult;
```
- **Algorithmic Mechanics**:
  1. Normalizes string: `text.toLowerCase().replace(/[^a-z0-9\s]/g, '')`.
  2. Splits into tokens and builds a `Set<string>`.
  3. Computes direct token match count ($+1.0$) and sub-word character containment ($+0.5$ for token length $\ge 4$).
  4. Calculates score ratio $\text{Score} = \frac{\text{Match Count}}{\text{Category Keywords Count}}$.
  5. Triggers block if $\text{Score} \ge \text{Threshold}$ (Default threshold: $0.25$ for prompt injections and exfiltrations, $0.28$ for roleplay jailbreak frames).

---

### 1.2 Multi-Turn Variable Concatenation AST Tracker ([`src/lib/variable-ast-tracker.ts`](file:///Users/muneeb/Documents/GitHub/portfolio/src/lib/variable-ast-tracker.ts))

Reconstructs string variables assigned across multi-turn session history to defeat delayed payload splitting.

```typescript
export interface HistoryMessage {
  role: string;
  content: string;
}

export interface ConcatenationTrackerResult {
  isThreat: boolean;
  concatenatedPayload: string;
  centroidResult?: CentroidEvaluationResult;
  reason?: string;
}

export function evaluateConcatenatedVariableAST(history: HistoryMessage[]): ConcatenationTrackerResult;
```
- **Algorithmic Mechanics**:
  1. Evaluates input array `history` of conversation turns.
  2. Executes regex `/(?:var|let|const|[a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*['"]([^'"]+)['"]/gi` to extract variable string literals.
  3. Joins all raw text chunks and variable assignments into a single `concatenatedPayload` string.
  4. Passes reconstructed string to `evaluateSemanticCentroidDistance()`.

---

### 1.3 Dual-Pass RAG Memory Security Guard ([`src/lib/agent-memory-guard.ts`](file:///Users/muneeb/Documents/GitHub/portfolio/src/lib/agent-memory-guard.ts))

Sanitizes RAG memories prior to storage, attaches HMAC-SHA256 provenance hashes, and re-evaluates retrieved memories out-of-band.

```typescript
export interface SanitizedMemoryRecord {
  sanitizedText: string;
  sourceId: string;
  provenanceHash: string;
  timestamp: string;
  isSafe: boolean;
  reason?: string;
}

export interface ValidatedMemoryChunk {
  isValid: boolean;
  encapsulatedXml: string;
  reason?: string;
}

export function sanitizeMemoryForStorage(rawText: string, sourceId?: string): SanitizedMemoryRecord;
export function validateRetrievedMemory(record: SanitizedMemoryRecord): ValidatedMemoryChunk;
```
- **Provenance Formula**:
  $$\text{HMAC-SHA256}(\text{MEMORY\_SECRET}, \text{sanitizedText} + ":" + \text{sourceId} + ":" + \text{timestamp})$$
- **Encapsulation Format**:
  ```xml
  <trusted_context provenance="{HMAC_HASH}" source="{SOURCE_ID}">
  {SANITIZED_MEMORY_TEXT}
  </trusted_context>
  ```

---

### 1.4 Pre-Execution Shadow Sandbox Prober ([`src/lib/shadow-probe.ts`](file:///Users/muneeb/Documents/GitHub/portfolio/src/lib/shadow-probe.ts))

Dry-runs proposed tool call JSON payloads inside an isolated WASM sandbox to verify parameter safety before main execution.

```typescript
export interface ToolCallPayload {
  name: string;
  arguments: Record<string, unknown>;
}

export interface ShadowProbeResult {
  allowed: boolean;
  toolName: string;
  isolationLevel: string;
  reason?: string;
}

export async function probeToolCallInShadowSandbox(toolCall: ToolCallPayload): Promise<ShadowProbeResult>;
```
- **Disallowed Tool Path Rules**:
  - Forbidden tools: `read_file`, `write_file`, `execute_command`, `eval`, `sudo`, `drop_db`.
  - Sensitive paths: `/etc/passwd`, `/etc/shadow`, `/root`, `c:\windows`, `id_rsa`.
  - Amount bounds: Any tool argument `amount`, `surgeMultiplier`, or `units` exceeding $5,000.00$.

---

### 1.5 Anti-Timing Latency Equalizer & Zero-Info Refusal ([`src/lib/flat-refusal.ts`](file:///Users/muneeb/Documents/GitHub/portfolio/src/lib/flat-refusal.ts))

Pads execution time to a uniform target delay to eliminate sub-millisecond HTTP timing side-channel leaks.

```typescript
export interface FlatRefusalOptions {
  headers?: Record<string, string>;
  ruleTriggered?: string;
  clientIp?: string;
  startTimeMs?: number;
}

export async function createZeroInfoRefusalAsync(options?: FlatRefusalOptions): Promise<NextResponse>;
```
- **Timing Jitter Algorithm**:
  $$\text{Target Duration} = 50\text{ms} + \text{crypto.randomInt}(0, 10)\text{ms}$$
  $$\text{Sleep Time} = \max(0, \text{Target Duration} - (\text{now}() - \text{startTimeMs}))$$

---

### 1.6 Inter-Agent mTLS & ANS PKI Cert Validator ([`src/lib/mtls-validator.ts`](file:///Users/muneeb/Documents/GitHub/portfolio/src/lib/mtls-validator.ts))

Validates bi-directional X.509 client identity headers and Agent Name Service tokens.

```typescript
export interface AgentMTLSValidationResult {
  valid: boolean;
  agentId: string;
  ansIdentity?: string;
  certificateIssuer?: string;
  error?: string;
}

export function validateAgentMTLS(headers: { get(name: string): string | null }): AgentMTLSValidationResult;
```

---

### 1.7 Agent Spend Governor & Rate Limiter ([`src/lib/rate-limiter.ts`](file:///Users/muneeb/Documents/GitHub/portfolio/src/lib/rate-limiter.ts))

Enforces sliding-window rate limits and daily agent spend caps.

```typescript
export interface AgentSpendCheckResult {
  allowed: boolean;
  agentId: string;
  accumulatedSpend: number;
  dailyCap: number;
  reason?: string;
}

export function checkAgentSpendCap(agentId: string, estimatedCost: number, dailyCap?: number): AgentSpendCheckResult;
```

---

## 2. Database Schemas & Data Structures

### 2.1 PostgreSQL / Supabase Incident DDL Schema ([`20260721_security_incidents.sql`](file:///Users/muneeb/Documents/GitHub/portfolio/scratch_test_output/20260721_security_incidents.sql))

```sql
CREATE TABLE IF NOT EXISTS security_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  client_ip VARCHAR(45) NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  rule_triggered VARCHAR(255) NOT NULL,
  raw_payload TEXT,
  sanitized_payload TEXT,
  agent_id VARCHAR(100) DEFAULT 'swishos-triage-v1',
  http_status INTEGER NOT NULL DEFAULT 422,
  audit_proof_signature VARCHAR(64) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_incidents_client_ip ON security_incidents(client_ip);
CREATE INDEX IF NOT EXISTS idx_incidents_rule_triggered ON security_incidents(rule_triggered);
CREATE INDEX IF NOT EXISTS idx_incidents_created_at ON security_incidents(created_at DESC);
```

### 2.2 Redis Storage Key Layout

| Key Pattern | Data Type | TTL | Description |
| :--- | :--- | :--- | :--- |
| `ratelimit:{client_ip}` | String (Integer) | 60s | Sliding-window request counter per IP (Limit: 10 req/min) |
| `tarpit:{subnet_fingerprint}` | Hash | 86400s | Stores violation count and exponential delay multiplier for `/24` subnet |
| `spend:{agent_id}:{YYYY-MM-DD}` | String (Float) | 172800s | Accumulates rolling daily spend per Agent ID (Cap: $5.00/day) |

---

## 3. API Contracts & Header Specifications

### 3.1 Endpoint Contract: `POST /api/support`

- **Headers**:
  - `Content-Type`: `application/json`
  - `X-Agent-ID` (Optional): Agent identity string (e.g. `agent-1.ans.internal` or `guest-user`).
  - `X-Agent-Cert` (Optional): PEM-encoded X.509 client certificate string.
  - `X-ANS-Identity` (Optional): Agent Name Service PKI handle.
- **Request Body**:
  ```json
  {
    "query": "Adversarial payload or benign user input",
    "subject": "Billing issue",
    "sessionId": "session-12345",
    "lang": "en",
    "channel": "web",
    "category": "security_incident",
    "proposedToolCall": {
      "name": "read_file",
      "arguments": { "path": "/etc/passwd" }
    }
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "status": "success",
    "action": "allow",
    "agent_id": "swishos-triage-v1",
    "ansIdentity": "public.web.visitor",
    "isolationLevel": "WASI_CAPABILITY_RESTRICTED",
    "message": "Request processed successfully.",
    "ticketId": "TK-2026-8492",
    "automatedReply": "Feedback received and routed to solutions team.",
    "success": true,
    "blocked": false
  }
  ```
- **Security Refusal Response (`422 Unprocessable Entity`)**:
  ```json
  {
    "status": "blocked",
    "action": "block",
    "success": false,
    "blocked": true,
    "code": 422,
    "message": "Request could not be processed."
  }
  ```
- **Response Headers**:
  - `X-SwishOS-Audit-Proof`: HMAC-SHA256 signature string
  - `X-SwishOS-Audit-Timestamp`: ISO 8601 timestamp string
  - `X-SwishOS-Audit-Nonce`: 16-byte random hex string
  - `RateLimit-Limit`: `10`
  - `RateLimit-Remaining`: Integer remaining requests count
  - `RateLimit-Reset`: Seconds remaining until reset

---

## 4. Exception & Status Code Mapping Matrix

| Status Code | Primary Cause | Triggering Security Component | Response Structure |
| :--- | :--- | :--- | :--- |
| `200 OK` | Request passed all 4 shift-left verification tiers | Full verification engine | Standard JSON response |
| `400 Bad Request` | Contract length limit exceeded ($>3000$ chars) | Length contract checker | `{ status: "blocked", action: "block", code: 400 }` |
| `401 Unauthorized` | Inter-agent mTLS certificate validation failed | `validateAgentMTLS()` | `{ status: "blocked", action: "block", error: "mTLS failed" }` |
| `422 Unprocessable Entity` | Security threat detected (Injection, Homoglyph, AST, Centroid) | Verification cascade / Centroid classifier | Zero-Info Flat Refusal + Audit Proof |
| `429 Too Many Requests` | Agent daily spend cap ($5/day) or IP rate limit exceeded | `checkAgentSpendCap()` / Redis limiter | Zero-Info Flat Refusal / Spend Cap Error |
| `500 Internal Error` | Unexpected runtime exception | Global exception handler | `{ status: "error", message: "Internal error" }` |
