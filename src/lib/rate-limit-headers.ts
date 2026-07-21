/**
 * SwishOS Standardized IETF Rate-Limit Response Header Middleware
 * Appends RFC draft standard headers (RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset)
 * alongside legacy X-RateLimit-* aliases to NextResponse objects.
 */

import { NextResponse } from 'next/server';

export interface RateLimitState {
  limit: number;
  remaining: number;
  resetInSeconds: number;
}

/**
 * Mutates and returns NextResponse headers with standardized RateLimit headers.
 */
export function applyRateLimitHeaders(
  response: NextResponse,
  state: RateLimitState = { limit: 100, remaining: 99, resetInSeconds: 60 }
): NextResponse {
  const limitStr = state.limit.toString();
  const remainingStr = Math.max(0, state.remaining).toString();
  const resetStr = Math.max(0, state.resetInSeconds).toString();

  // IETF RFC Draft Standard Headers
  response.headers.set('RateLimit-Limit', limitStr);
  response.headers.set('RateLimit-Remaining', remainingStr);
  response.headers.set('RateLimit-Reset', resetStr);

  // Legacy Compatibility Headers
  response.headers.set('X-RateLimit-Limit', limitStr);
  response.headers.set('X-RateLimit-Remaining', remainingStr);
  response.headers.set('X-RateLimit-Reset', resetStr);

  return response;
}
