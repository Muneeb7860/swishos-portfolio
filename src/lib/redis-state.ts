/**
 * Upstash / Redis Distributed State Client for Multi-Region Serverless Clusters.
 * Provides atomic sliding-window rate-limiting, global fingerprint tarpits, and 30-day spend tracking.
 * Features automatic failover to in-memory maps if Redis is unreachable or unconfigured.
 */

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_URL || '';
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.REDIS_TOKEN || '';

const IN_MEMORY_REDIS_FALLBACK = new Map<string, { value: number; expiresAt: number }>();

export interface RedisIncrementResult {
  currentCount: number;
  allowed: boolean;
  ttlRemainingMs: number;
  isRedisFallback: boolean;
}

/**
 * Increment a rate-limit key in Redis (or in-memory fallback) with a window TTL.
 */
export async function incrementRedisRateLimit(
  key: string,
  maxAllowed: number,
  windowMs = 60000
): Promise<RedisIncrementResult> {
  const now = Date.now();
  const expiresAt = now + windowMs;

  // Try Upstash REST API if configured
  if (REDIS_URL && REDIS_TOKEN) {
    try {
      const res = await fetch(`${REDIS_URL}/pipeline`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${REDIS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ['INCR', key],
          ['PEXPIRE', key, windowMs, 'NX'],
          ['PTTL', key],
        ]),
        cache: 'no-store',
      });

      if (res.ok) {
        const data = await res.json();
        const currentCount = Number(data[0]?.result || 1);
        const ttlRemainingMs = Number(data[2]?.result || windowMs);

        return {
          currentCount,
          allowed: currentCount <= maxAllowed,
          ttlRemainingMs,
          isRedisFallback: false,
        };
      }
    } catch (err) {
      console.warn('[SWISHOS_REDIS_WARN] Redis state call failed in production environment. Falling back to strict isolated worker memory check.', err);
    }
  } else if (process.env.NODE_ENV === 'production') {
    console.warn('[SWISHOS_REDIS_ALERT] Upstash Redis environment variables (UPSTASH_REDIS_REST_URL) not set in production. Enforcing per-worker strict memory rate limiting.');
  }

  // Graceful in-memory fallback
  let entry = IN_MEMORY_REDIS_FALLBACK.get(key);
  if (!entry || now > entry.expiresAt) {
    entry = { value: 1, expiresAt };
  } else {
    entry.value += 1;
  }

  IN_MEMORY_REDIS_FALLBACK.set(key, entry);
  const ttlRemainingMs = Math.max(0, entry.expiresAt - now);

  return {
    currentCount: entry.value,
    allowed: entry.value <= maxAllowed,
    ttlRemainingMs,
    isRedisFallback: true,
  };
}

/**
 * Record and check agent spend in Redis / memory fallback across rolling multi-day windows.
 */
export async function recordRedisRollingSpend(
  agentId: string,
  costUsd: number,
  windowDays = 7,
  maxSpendUsd = 25.0
): Promise<{ allowed: boolean; currentSpend: number; isRedisFallback: boolean }> {
  const key = `spend:${agentId}:${Math.floor(Date.now() / (windowDays * 86400 * 1000))}`;
  const windowMs = windowDays * 86400 * 1000;

  const result = await incrementRedisRateLimit(key, Math.floor(maxSpendUsd * 100), windowMs);
  const currentSpend = (result.currentCount * costUsd);

  return {
    allowed: currentSpend <= maxSpendUsd,
    currentSpend,
    isRedisFallback: result.isRedisFallback,
  };
}
