/**
 * SwishOS Hardened CORS Origin Policy & Enterprise Security Headers Middleware
 * Validates request origin against a strict whitelist, handles OPTIONS preflights,
 * and appends HSTS, CSP, X-Frame-Options: DENY, and X-Content-Type-Options: nosniff headers.
 */

import { NextResponse } from 'next/server';

const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/(?:[a-zA-Z0-9-]+\.)*swishos\.dev$/,
  /^http:\/\/localhost:(?:3000|8000|8080)$/,
  /^http:\/\/127\.0\.0\.1:(?:3000|8000|8080)$/,
];

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin));
}

/**
 * Handles OPTIONS preflight requests for API routes.
 */
export function handleCORSPreflight(req: Request): NextResponse | null {
  if (req.method !== 'OPTIONS') return null;

  const origin = req.headers.get('origin');
  const allowed = isAllowedOrigin(origin);

  const headers = new Headers();
  if (allowed && origin) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Credentials', 'true');
  } else {
    headers.set('Access-Control-Allow-Origin', 'https://swishos.dev');
  }

  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-SwishOS-Audit-Proof, X-Agent-Signature, X-Agent-Nonce'
  );
  headers.set('Access-Control-Max-Age', '86400');

  return new NextResponse(null, { status: 204, headers });
}

/**
 * Appends enterprise security and CORS headers to a NextResponse object.
 */
export function applySecurityHeaders(req: Request, res: NextResponse): NextResponse {
  const origin = req.headers.get('origin');
  if (origin && isAllowedOrigin(origin)) {
    res.headers.set('Access-Control-Allow-Origin', origin);
    res.headers.set('Access-Control-Allow-Credentials', 'true');
  } else {
    res.headers.set('Access-Control-Allow-Origin', 'https://swishos.dev');
  }

  res.headers.set('Access-Control-Expose-Headers', 'X-SwishOS-Audit-Proof, X-SwishOS-Edge-Proxy, X-RateLimit-Limit, X-RateLimit-Remaining');
  res.headers.set('Vary', 'Origin');

  // Hardened Enterprise Security Headers
  res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Content-Security-Policy', "default-src 'self'; frame-ancestors 'none';");

  return res;
}
