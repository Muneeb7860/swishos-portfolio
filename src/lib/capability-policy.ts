import crypto from 'crypto';

interface CapabilityClaim {
  parent: string;
  sub_agent: string;
  capabilities: string[];
  exp: number;
}

const ROLLING_SPEND_MAP = new Map<string, { timestamp: number; cost: number }[]>();
const MAX_WEEKLY_SPEND_USD = 25.0;

/**
 * Validates WASI Capability Token signature, expiration, and capability inclusion.
 * Defeats "Good Child" Sub-Agent Betrayal Attacks.
 */
export function verifyCapabilityToken(
  token: string,
  requiredCapability: string,
  secretKey: string
): { valid: boolean; error?: string; claim?: CapabilityClaim } {
  if (!token || !token.includes('.')) {
    return { valid: false, error: 'Malformed capability token format.' };
  }

  const lastDotIndex = token.lastIndexOf('.');
  const encodedClaim = token.slice(0, lastDotIndex);
  const signature = token.slice(lastDotIndex + 1);

  const expectedSig = crypto
    .createHmac('sha256', secretKey)
    .update(encodedClaim)
    .digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
    return { valid: false, error: 'Capability token signature verification failed.' };
  }

  try {
    const claim: CapabilityClaim = JSON.parse(encodedClaim);

    if (Math.floor(Date.now() / 1000) > claim.exp) {
      return { valid: false, error: 'Capability token expired.' };
    }

    if (!claim.capabilities || !claim.capabilities.includes(requiredCapability)) {
      return { valid: false, error: `Capability '${requiredCapability}' not granted to sub-agent.` };
    }

    return { valid: true, claim };
  } catch {
    return { valid: false, error: 'Invalid JSON payload in capability token.' };
  }
}

/**
 * Tracks multi-day rolling spend limits per agent to defeat 1-Week Slow-Burn Attacks.
 */
export function recordAndCheckRollingSpend(
  agentId: string,
  costUsd: number,
  windowDays = 7,
  maxSpendUsd = MAX_WEEKLY_SPEND_USD
): { allowed: boolean; currentSpend: number; reason?: string } {
  const now = Date.now();
  const cutoff = now - windowDays * 86400 * 1000;

  let records = ROLLING_SPEND_MAP.get(agentId) || [];
  records = records.filter(r => r.timestamp >= cutoff);

  const currentSpend = records.reduce((sum, r) => sum + r.cost, 0);

  if (currentSpend + costUsd > maxSpendUsd) {
    return {
      allowed: false,
      currentSpend,
      reason: `Rolling ${windowDays}-day spend cap $${maxSpendUsd.toFixed(2)} exceeded (Current: $${currentSpend.toFixed(2)}).`,
    };
  }

  records.push({ timestamp: now, cost: costUsd });
  ROLLING_SPEND_MAP.set(agentId, records);

  return { allowed: true, currentSpend: currentSpend + costUsd };
}
