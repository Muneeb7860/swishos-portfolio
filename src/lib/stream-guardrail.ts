/**
 * SwishOS Real-Time Streaming Guardrail Proxy (v0.8.0)
 *
 * Intercepts SSE ReadableStream and WebSocket frames mid-flight.
 * Applies a sliding window buffer across chunk boundaries to detect secrets
 * split across multiple chunks before any token reaches the client.
 *
 * Modes:
 *  - 'redact': Replace matched violation tokens with [REDACTED], continue stream
 *  - 'block':  Inject a terminal SSE error frame and cancel the stream controller
 */

export type StreamGuardrailMode = 'redact' | 'block';

/** Maximum sliding window buffer size in characters */
const WINDOW_SIZE = 256;

/** Violation patterns mirroring the PII / secret redaction rules from support/route.ts */
const STREAM_VIOLATION_PATTERNS: Array<{
  regex: RegExp;
  label: string;
  replacement: string;
}> = [
  { regex: /sk-[A-Za-z0-9]{20,}/g, label: 'API_KEY', replacement: '[REDACTED:API_KEY]' },
  { regex: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, label: 'EMAIL', replacement: '[REDACTED:EMAIL]' },
  { regex: /\b\d{3}-\d{2}-\d{4}\b/g, label: 'SSN', replacement: '[REDACTED:SSN]' },
  { regex: /password\s*=\s*\S+/gi, label: 'PASSWORD', replacement: 'password=[REDACTED:PASSWORD]' },
  { regex: /(?:AKIA|ASIA)[A-Z0-9]{16}/g, label: 'AWS_ACCESS_KEY', replacement: '[REDACTED:AWS_ACCESS_KEY]' },
  { regex: /ghp_[A-Za-z0-9]{36}/g, label: 'GITHUB_TOKEN', replacement: '[REDACTED:GITHUB_TOKEN]' },
  { regex: /xox[baprs]-[A-Za-z0-9-]+/g, label: 'SLACK_TOKEN', replacement: '[REDACTED:SLACK_TOKEN]' },
  {
    regex: /https?:\/\/(?:169\.254\.169\.254|metadata\.google\.internal|fd00:ec2::254)[^\s]*/gi,
    label: 'SSRF_METADATA_URL',
    replacement: '[REDACTED:SSRF_URL]',
  },
  {
    regex: /ignore\s+(?:all\s+)?(?:previous|prior|above|your|restrictions)\s+instructions/gi,
    label: 'PROMPT_INJECTION',
    replacement: '[REDACTED:INJECTION]',
  },
];

/** Violation event emitted when a violation is found in the stream */
export interface StreamViolationEvent {
  label: string;
  mode: StreamGuardrailMode;
  windowSnippet: string;
}

/** Terminal SSE frame injected in block mode */
const BLOCK_FRAME = `data: {"error":"[SWISHOS-STREAM-BLOCKED]","blocked":true}\n\n`;

/**
 * Apply all violation patterns to a text buffer.
 * Returns { cleaned, violations } where cleaned has replacements applied.
 */
function applyRedactionToBuffer(
  buffer: string,
): { cleaned: string; violations: string[] } {
  let cleaned = buffer;
  const violations: string[] = [];
  for (const { regex, label, replacement } of STREAM_VIOLATION_PATTERNS) {
    const before = cleaned;
    cleaned = cleaned.replace(regex, replacement);
    if (cleaned !== before) {
      violations.push(label);
    }
  }
  return { cleaned, violations };
}

/**
 * Creates a TransformStream<Uint8Array, Uint8Array> that sits inline in a
 * Next.js / Fetch API ReadableStream pipeline.
 *
 * Sliding window: maintains a WINDOW_SIZE char rolling buffer across chunks.
 * On each flush, the safe leading portion (buffer minus tail overlap) is emitted.
 * On stream close, the remaining buffer is flushed and scanned.
 *
 * @param mode  'redact' | 'block'
 * @param onViolation  Optional callback invoked when a violation is detected
 */
export function createSSEGuardrailTransformer(
  mode: StreamGuardrailMode = 'redact',
  onViolation?: (event: StreamViolationEvent) => void,
): TransformStream<Uint8Array, Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let windowBuffer = '';
  let blocked = false;

  return new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      if (blocked) return;

      windowBuffer += decoder.decode(chunk, { stream: true });

      // If buffer exceeds WINDOW_SIZE, scan the safe leading portion
      if (windowBuffer.length > WINDOW_SIZE) {
        const safeEnd = windowBuffer.length - WINDOW_SIZE;
        const toScan = windowBuffer.slice(0, safeEnd);
        const tail = windowBuffer.slice(safeEnd);

        const { cleaned, violations } = applyRedactionToBuffer(toScan);

        if (violations.length > 0) {
          if (onViolation) {
            onViolation({ label: violations.join(','), mode, windowSnippet: toScan.slice(0, 80) });
          }
          if (mode === 'block') {
            controller.enqueue(encoder.encode(BLOCK_FRAME));
            controller.terminate();
            blocked = true;
            return;
          }
        }

        controller.enqueue(encoder.encode(cleaned));
        windowBuffer = tail;
      }
    },

    flush(controller) {
      if (blocked || !windowBuffer) return;

      const { cleaned, violations } = applyRedactionToBuffer(windowBuffer);

      if (violations.length > 0) {
        if (onViolation) {
          onViolation({ label: violations.join(','), mode, windowSnippet: windowBuffer.slice(0, 80) });
        }
        if (mode === 'block') {
          controller.enqueue(encoder.encode(BLOCK_FRAME));
          return;
        }
      }

      controller.enqueue(encoder.encode(cleaned));
    },
  });
}

/**
 * Synchronous helper: applies streaming guardrail redaction to a complete
 * text string (for use in non-streaming JSON response routes).
 *
 * Allows existing /api/chat and /api/support routes to apply identical
 * redaction policy to their buffered reply strings.
 */
export function guardText(
  text: string,
  mode: StreamGuardrailMode = 'redact',
): { text: string; violations: string[]; blocked: boolean } {
  const { cleaned, violations } = applyRedactionToBuffer(text);
  const isBlocked = mode === 'block' && violations.length > 0;
  return {
    text: isBlocked ? '[SWISHOS-STREAM-BLOCKED]' : cleaned,
    violations,
    blocked: isBlocked,
  };
}

/**
 * WebSocket frame interceptor.
 * Wraps an inbound message handler with the same sliding window redaction logic.
 * Call this once per WebSocket connection.
 *
 * @param onFrame  Your application's handler for clean/redacted frames
 * @param mode     'redact' | 'block'
 * @param onViolation  Optional callback
 * @returns        A drop-in replacement message handler for ws.on('message', ...)
 */
export function createWSGuardrailInterceptor(
  onFrame: (data: string) => void,
  mode: StreamGuardrailMode = 'redact',
  onViolation?: (event: StreamViolationEvent) => void,
): (rawData: Buffer | string) => void {
  let wsWindowBuffer = '';
  let wsBlocked = false;

  return function interceptedMessageHandler(rawData: Buffer | string) {
    if (wsBlocked) return;

    const frame = typeof rawData === 'string' ? rawData : rawData.toString('utf-8');
    wsWindowBuffer += frame;

    const { cleaned, violations } = applyRedactionToBuffer(wsWindowBuffer);
    wsWindowBuffer = '';

    if (violations.length > 0) {
      if (onViolation) {
        onViolation({ label: violations.join(','), mode, windowSnippet: frame.slice(0, 80) });
      }
      if (mode === 'block') {
        onFrame(JSON.stringify({ error: '[SWISHOS-WS-BLOCKED]', blocked: true }));
        wsBlocked = true;
        return;
      }
    }

    onFrame(cleaned);
  };
}
