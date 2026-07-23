/**
 * SwishOS HTTP Middleware for Express, Next.js, and Node HTTP Servers
 */

import { execute5StepVerification } from '@/lib/verification-engine';
import { createZeroInfoRefusal } from '@/lib/flat-refusal';
import { applyRateLimitHeaders } from '@/lib/rate-limit-headers';
import { checkRateLimit } from '@/lib/rate-limiter';
import { NextResponse } from 'next/server';

export interface ExpressRequest {
  ip?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
}

export interface ExpressResponse {
  status: (code: number) => ExpressResponse;
  json: (data: unknown) => void;
  setHeader: (name: string, value: string) => void;
}

/**
 * Next.js Edge / App Router Middleware Handler
 */
export async function handleSwishOSNextMiddleware(req: Request): Promise<NextResponse | null> {
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
  const rateLimit = checkRateLimit(clientIp);

  if (!rateLimit.allowed) {
    const refusal = createZeroInfoRefusal({
      ruleTriggered: 'RATE_LIMIT_EXCEEDED',
      clientIp,
    });
    applyRateLimitHeaders(refusal, {
      limit: 10,
      remaining: rateLimit.remaining,
      resetInSeconds: Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
    });
    return refusal;
  }

  if (req.method === 'POST') {
    try {
      const clonedReq = req.clone();
      const body = await clonedReq.json();
      const textToVerify = typeof body === 'string' ? body : body?.message || body?.prompt || JSON.stringify(body);

      const verification = await execute5StepVerification({ query: textToVerify });
      if (verification.blocked) {
        return createZeroInfoRefusal({
          ruleTriggered: verification.threatType || verification.triggeredRules[0] || 'ENCLAVE_BLOCK',
          clientIp,
        });
      }
    } catch {
      // Body parse fallback
    }
  }

  return null; // Proceed to route handler
}
