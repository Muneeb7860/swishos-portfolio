/**
 * In-Memory Sliding Window Rate Limiter & Multi-Turn Session Memory
 * Enforces rate limiting per client IP (10 requests/min window) and context assembly.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

interface SessionMemoryRecord {
  messages: string[];
  lastSeenAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();
const sessionMemoryStore = new Map<string, SessionMemoryRecord>();

// Clean up stale memory records periodically (every 5 minutes)
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

export function checkRateLimit(ip: string, limit: number = 10, windowMs: number = 60000): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
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

export function appendSessionContext(sessionId: string, message: string): string[] {
  const now = Date.now();
  const record = sessionMemoryStore.get(sessionId) || { messages: [], lastSeenAt: now };
  
  // Keep last 5 messages in context window
  record.messages.push(message);
  if (record.messages.length > 5) {
    record.messages.shift();
  }
  record.lastSeenAt = now;
  sessionMemoryStore.set(sessionId, record);

  return record.messages;
}
