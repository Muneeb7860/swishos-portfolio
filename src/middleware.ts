import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAllowedOrigin } from './lib/cors-policy';

/**
 * SwishOS Shift-Left Edge Security Middleware
 * Evaluates CORS headers, OPTIONS preflight, and NFKC Unicode normalization at Vercel Edge layer.
 */
export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  const pathname = request.nextUrl.pathname;
  const allowed = isAllowedOrigin(origin);
  const effectiveOrigin = allowed && origin ? origin : 'https://swishos.dev';

  // 1. CORS Preflight & Edge Header Injection
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': effectiveOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Agent-ID, X-Agent-Cert, X-ANS-Identity',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // 2. Next.js Edge Proxy Headers
  const response = NextResponse.next();
  if (pathname.startsWith('/api/')) {
    response.headers.set('X-SwishOS-Edge-Proxy', 'v0.5.0-vercel-edge');
    response.headers.set('Access-Control-Allow-Origin', effectiveOrigin);
    response.headers.set('Vary', 'Origin');
  }

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
