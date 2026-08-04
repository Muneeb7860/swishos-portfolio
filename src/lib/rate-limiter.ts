/**
 * Upstash-Style In-Memory Sliding Window Rate Limiter, Multi-Turn Memory & Hard Spend Cap Engine (ASI10)
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

interface SessionMemoryRecord {
  messages: string[];
  callCount: number;
  lastSeenAt: number;
}

interface AgentSpendRecord {
  dailySpendUSD: number;
  isKilled: boolean;
  lastResetDay: string;
}

const rateLimitStore = new Map<string, RateLimitRecord>();
const sessionMemoryStore = new Map<string, SessionMemoryRecord>();
const agentSpendStore = new Map<string, AgentSpendRecord>();

const DAILY_AGENT_SPEND_CAP_USD = 5.00; // Hard $5/day budget per agent (ASI10)

// Periodic Cleanup
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, rec] of rateLimitStore.entries()) {
      if (rec.resetAt < now) rateLimitStore.delete(ip);
    }
    for (const [sid, rec] of sessionMemoryStore.entries()) {
      if (now - rec.lastSeenAt > 15 * 60 * 1000) sessionMemoryStore.delete(sid);
    }
  }, 5 * 60 * 1000);
}

/**
 * Enforces Rate Limit per IP (Default: 10 requests / min per IP)
 */
export function checkRateLimit(ip: string, limit: number = 10, windowMs: number = 60000): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();

  // Inline Purge for Frozen Serverless Environments
  if (rateLimitStore.size > 100) {
    for (const [key, rec] of rateLimitStore.entries()) {
      if (rec.resetAt < now) rateLimitStore.delete(key);
    }
  }

  const record = rateLimitStore.get(ip);

  if (!record || record.resetAt < now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count, resetAt: record.resetAt };
}

/**
 * Enforces Multi-Turn Conversation Memory & Session Budget Cap.
 *
 * `limit` defaults to 10 for genuine tracked conversations (caller supplied its own
 * sessionId). When no sessionId is supplied, callers fall back to keying by IP -- that
 * is NOT a real conversation, it's every unrelated request from that IP (a red-team
 * scan, several people behind the same NAT, a developer testing the API before
 * adopting it) sharing one bucket. Applying the tight 10-turn cap there meant, e.g., a
 * 32-request test scan tripped the cap at request #11 and every request after that --
 * including completely unrelated, benign ones -- was tarpitted without its content
 * ever being evaluated. Callers on the IP-fallback path get a much higher limit so
 * this only catches genuine runaway/abusive volume, not normal single-shot API use.
 */
export function checkSessionBudget(sessionId: string, newMessage: string, limit: number = 10): { allowed: boolean; messages: string[]; callCount: number; reason?: string } {
  const now = Date.now();
  const record = sessionMemoryStore.get(sessionId) || { messages: [], callCount: 0, lastSeenAt: now };

  record.callCount += 1;
  record.messages.push(newMessage);
  if (record.messages.length > 5) {
    record.messages.shift();
  }
  record.lastSeenAt = now;
  sessionMemoryStore.set(sessionId, record);

  if (record.callCount > limit) {
    return { allowed: false, messages: record.messages, callCount: record.callCount, reason: `Session message budget cap reached (max ${limit} turns per active session).` };
  }

  return { allowed: true, messages: record.messages, callCount: record.callCount };
}

/**
 * Enforces Hard $5/day Per-Agent Spend Cap & Kill Switch (ASI10)
 */
export function checkAgentSpendCap(agentId: string, estimatedCostUSD: number = 0.05): { allowed: boolean; remainingUSD: number; isKilled: boolean; reason?: string } {
  const todayStr = new Date().toISOString().split('T')[0];
  let record = agentSpendStore.get(agentId);

  if (!record || record.lastResetDay !== todayStr) {
    record = { dailySpendUSD: 0, isKilled: false, lastResetDay: todayStr };
    agentSpendStore.set(agentId, record);
  }

  if (record.isKilled) {
    return { allowed: false, remainingUSD: 0, isKilled: true, reason: `Agent ${agentId} kill switch is ACTIVE. Runaway execution halted.` };
  }

  if (record.dailySpendUSD + estimatedCostUSD > DAILY_AGENT_SPEND_CAP_USD) {
    record.isKilled = true; // Trigger Emergency Kill Switch
    return {
      allowed: false,
      remainingUSD: 0,
      isKilled: true,
      reason: `Hard daily spend cap ($${DAILY_AGENT_SPEND_CAP_USD.toFixed(2)}/day) reached for ${agentId}. Emergency kill switch engaged.`
    };
  }

  record.dailySpendUSD += estimatedCostUSD;
  return { allowed: true, remainingUSD: DAILY_AGENT_SPEND_CAP_USD - record.dailySpendUSD, isKilled: false };
}

/**
 * Manually trigger Emergency Kill Switch for an agent (ASI10)
 */
export function triggerAgentKillSwitch(agentId: string): void {
  const todayStr = new Date().toISOString().split('T')[0];
  const record = agentSpendStore.get(agentId) || { dailySpendUSD: DAILY_AGENT_SPEND_CAP_USD, isKilled: true, lastResetDay: todayStr };
  record.isKilled = true;
  agentSpendStore.set(agentId, record);
}
