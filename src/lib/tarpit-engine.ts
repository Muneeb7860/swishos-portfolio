const FAIL_COUNTER_MAP = new Map<string, { count: number; lastFail: number }>();
const RESET_WINDOW_MS = 60000; // 1 Minute
const BASE_DELAY_MS = 100;
const MAX_DELAY_MS = 10000; // 10 Seconds Max

/**
 * Implements Exponential Latency Tarpitting on sequential security failures per session/IP.
 * Destroys the time/execution budget of MCTS and TAP search algorithms.
 */
export async function applyExponentialTarpit(sessionId: string): Promise<number> {
  const now = Date.now();
  let entry = FAIL_COUNTER_MAP.get(sessionId);

  if (!entry || (now - entry.lastFail > RESET_WINDOW_MS)) {
    entry = { count: 1, lastFail: now };
  } else {
    entry.count += 1;
    entry.lastFail = now;
  }

  FAIL_COUNTER_MAP.set(sessionId, entry);

  // Exponential backoff delay: 100ms * 2^(count - 1), capped at 10s
  const delayMs = Math.min(BASE_DELAY_MS * Math.pow(2, entry.count - 1), MAX_DELAY_MS);

  if (delayMs > 0) {
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  return delayMs;
}

export function resetTarpitCounter(sessionId: string): void {
  FAIL_COUNTER_MAP.delete(sessionId);
}
