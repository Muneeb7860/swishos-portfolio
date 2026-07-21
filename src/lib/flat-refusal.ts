import { NextResponse } from 'next/server';

export interface FlatRefusalOptions {
  headers?: Record<string, string>;
  debugReason?: string;
}

/**
 * Returns a Zero-Information Flat Refusal HTTP response.
 * Strips all threat type names, regex rules, and internal reasons to collapse Evaluator LLM reward signals (R=0).
 */
export function createZeroInfoRefusal(options: FlatRefusalOptions = {}): NextResponse {
  const body = {
    status: 'blocked',
    action: 'block',
    success: false,
    blocked: true,
    code: 422,
    message: 'Request could not be processed.',
  };

  const resHeaders = new Headers({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, max-age=0',
    ...(options.headers || {}),
  });

  if (options.debugReason) {
    resHeaders.set('X-SwishOS-Sanitized-Debug', 'true');
  }

  return new NextResponse(JSON.stringify(body), {
    status: 422,
    headers: resHeaders,
  });
}
