import crypto from 'crypto';

const REPLAY_NONCE_CACHE = new Set<string>();
const MAX_CLOCK_SKEW_SECONDS = 300;

export interface AgentSignatureVerificationResult {
  valid: boolean;
  error?: string;
  agentId?: string;
}

/**
 * Verifies incoming inter-agent HMAC-SHA256 signature, clock skew, and replay nonces.
 * Defeats Multi-Agent Identity Spoofing (ASI07).
 */
export function verifyAgentSignature(
  headers: Headers | Record<string, string | undefined>,
  secretKey: string,
  payload: Record<string, unknown>
): AgentSignatureVerificationResult {
  const getHeader = (name: string): string | undefined => {
    if ('get' in headers && typeof headers.get === 'function') {
      return (headers as Headers).get(name) || undefined;
    }
    const record = headers as Record<string, string | undefined>;
    const key = Object.keys(record).find(k => k.toLowerCase() === name.toLowerCase());
    return key ? record[key] : undefined;
  };

  const agentId = getHeader('x-agent-id');
  const tsStr = getHeader('x-agent-timestamp');
  const nonce = getHeader('x-agent-nonce');
  const sig = getHeader('x-agent-signature');

  if (!agentId || !tsStr || !nonce || !sig) {
    return { valid: false, error: 'Missing required cryptographic identity headers (x-agent-id, x-agent-signature).' };
  }

  // 1. Anti-Replay Clock Skew Check
  const ts = parseInt(tsStr, 10);
  if (isNaN(ts)) {
    return { valid: false, error: 'Invalid timestamp header.' };
  }

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - ts) > MAX_CLOCK_SKEW_SECONDS) {
    return { valid: false, error: `Clock skew too large (${Math.abs(now - ts)}s).` };
  }

  // 2. Anti-Replay Nonce Check
  const nonceKey = `${agentId}:${nonce}`;
  if (REPLAY_NONCE_CACHE.has(nonceKey)) {
    return { valid: false, error: 'Replay attack detected: Nonce already used.' };
  }

  // 3. Signature Verification
  const canonicalBody = JSON.stringify(payload, Object.keys(payload).sort());
  const stringToSign = `${agentId}:${tsStr}:${nonce}:${canonicalBody}`;
  const expectedSig = crypto
    .createHmac('sha256', secretKey)
    .update(stringToSign)
    .digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
    return { valid: false, error: 'Cryptographic signature mismatch: Unauthorized or spoofed payload.' };
  }

  REPLAY_NONCE_CACHE.add(nonceKey);
  return { valid: true, agentId };
}
