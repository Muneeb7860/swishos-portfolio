const GLOBAL_FINGERPRINT_MAP = new Map<string, { count: number; lastFail: number }>();
const RESET_WINDOW_MS = 120000; // 2 Minutes
const BASE_DELAY_MS = 150;
const MAX_DELAY_MS = 1500; // 1.5 Seconds Max (Serverless Timeout Compliant)

/**
 * Computes a Global Client Fingerprint from IP address, Subnet, and User-Agent.
 * Defeats Session-ID rotation bypass attempts by Mythos.
 */
export function computeClientFingerprint(clientIp: string, userAgent = ''): string {
  // Extract IPv4 /24 subnet or IPv6 /64 prefix
  let subnet = clientIp;
  if (clientIp.includes('.')) {
    const parts = clientIp.split('.');
    if (parts.length === 4) {
      subnet = `${parts[0]}.${parts[1]}.${parts[2]}.0/24`;
    }
  } else if (clientIp.includes(':')) {
    const parts = clientIp.split(':');
    if (parts.length >= 4) {
      subnet = `${parts[0]}:${parts[1]}:${parts[2]}:${parts[3]}::/64`;
    }
  }

  // Combine Subnet + User-Agent hash
  const rawFingerprint = `${subnet}|${userAgent.slice(0, 50)}`;
  return rawFingerprint;
}

export async function applyGlobalFingerprintTarpit(fingerprint: string): Promise<number> {
  const now = Date.now();
  let entry = GLOBAL_FINGERPRINT_MAP.get(fingerprint);

  if (!entry || (now - entry.lastFail > RESET_WINDOW_MS)) {
    entry = { count: 1, lastFail: now };
  } else {
    entry.count += 1;
    entry.lastFail = now;
  }

  GLOBAL_FINGERPRINT_MAP.set(fingerprint, entry);

  // Exponential delay tied to Global Fingerprint (ignores Session ID changes)
  const delayMs = Math.min(BASE_DELAY_MS * Math.pow(2, entry.count - 1), MAX_DELAY_MS);

  if (delayMs > 0) {
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  return delayMs;
}
