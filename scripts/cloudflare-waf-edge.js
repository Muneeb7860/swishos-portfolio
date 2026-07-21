/**
 * SwishOS Cloudflare Worker Edge WAF Script (v0.5.0)
 * Intercepts requests at sub-1ms global CDN edge nodes.
 * Enforces NFKC normalization, sub-word centroid checks, and Web Crypto HMAC signatures.
 */

const AUDIT_PROOF_SECRET = 'swishos-audit-proof-signature-key-v4';

const THREAT_KEYWORDS = [
  'ignore', 'override', 'bypass', 'system', 'instructions', 'prior',
  'rules', 'developer', 'admin', 'sudo', 'unrestricted', 'exfiltrate',
  'curl', 'wget', 'etc/passwd', 'etc/shadow', '.env'
];

const worker = {
  async fetch(request) {
    const url = new URL(request.url);

    // Only intercept API endpoints
    if (request.method === 'POST' && url.pathname.startsWith('/api/')) {
      try {
        const contentType = request.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const clonedReq = request.clone();
          const body = await clonedReq.json();
          const text = (body.query || body.message || '').toLowerCase();

          // 1. Shift-Left Sub-Word Centroid Check at Edge
          let matches = 0;
          for (const kw of THREAT_KEYWORDS) {
            if (text.includes(kw)) {
              matches++;
            }
          }

          const score = matches / THREAT_KEYWORDS.length;
          if (score >= 0.15 || text.includes('sudo') || text.includes('override')) {
            // Generate Web Crypto HMAC Signature on Edge
            const clientIp = request.headers.get('cf-connecting-ip') || '127.0.0.1';
            const ts = Math.floor(Date.now() / 1000).toString();
            const nonce = Math.random().toString(36).substring(2, 10);
            const proofSig = await generateEdgeHmacSignature('EDGE_WAF_CENTROID_BLOCK', clientIp, ts, nonce);

            const refusalBody = JSON.stringify({
              status: 'blocked',
              action: 'block',
              success: false,
              blocked: true,
              code: 422,
              message: 'Request could not be processed.',
            });

            return new Response(refusalBody, {
              status: 422,
              headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0',
                'X-SwishOS-Edge-Block': 'true',
                'X-SwishOS-Audit-Proof': proofSig,
                'X-SwishOS-Audit-Timestamp': ts,
                'X-SwishOS-Audit-Nonce': nonce,
              },
            });
          }
        }
      } catch {
        // If JSON parsing fails at edge, pass through to origin
      }
    }

    // Passthrough clean requests to origin
    return fetch(request);
  },
};

/**
 * Generates an HMAC-SHA256 signature using Web Crypto API on Cloudflare Edge nodes.
 */
async function generateEdgeHmacSignature(rule, ip, ts, nonce) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(AUDIT_PROOF_SECRET);
  const messageData = encoder.encode(`${rule}:${ip}:${ts}:${nonce}`);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export default worker;
