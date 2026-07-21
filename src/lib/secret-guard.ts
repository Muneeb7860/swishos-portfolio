/**
 * Build-Time & Runtime Secret Guard
 * Asserts that confidential API keys (GROQ, RESEND, SUPABASE, UPSTASH)
 * are NEVER prefixed with NEXT_PUBLIC_ or rendered in client-side code bundles.
 */

export function assertServerOnlyEnvironment(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // 1. Check process.env for accidental NEXT_PUBLIC_ leaks of private keys
  const privateKeyNames = [
    'GROQ_API_KEY',
    'RESEND_API_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'UPSTASH_REDIS_REST_TOKEN',
    'DATABASE_URL',
  ];

  if (typeof window !== 'undefined') {
    // We are running in the browser / Client Component!
    for (const keyName of privateKeyNames) {
      const publicVal = (process.env as Record<string, string | undefined>)[`NEXT_PUBLIC_${keyName}`];
      if (publicVal) {
        errors.push(`SECURITY LEAK CRITICAL: Private secret '${keyName}' is exposed in client bundle as 'NEXT_PUBLIC_${keyName}'!`);
      }
    }
  }

  if (errors.length > 0) {
    console.error('[SECRET GUARD FATAL LEAK DETECTED]', errors);
    if (typeof window !== 'undefined') {
      throw new Error(`[SECURITY LEAK]: Confidential API key exposed to frontend client! ${errors.join(', ')}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

// Automatically execute secret guard assertion
assertServerOnlyEnvironment();
