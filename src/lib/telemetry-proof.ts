import crypto from 'crypto';

const AUDIT_PROOF_SECRET = process.env.AUDIT_PROOF_SECRET || 'swishos-audit-proof-signature-key-v4';

export interface AuditProofHeaders {
  'X-SwishOS-Audit-Proof': string;
  'X-SwishOS-Audit-Timestamp': string;
  'X-SwishOS-Audit-Nonce': string;
}

/**
 * Generates a signed cryptographic audit proof header.
 * Proves to scanners that a security block occurred in deterministic CODE,
 * defeating fake hallucinated LLM JSON error responses.
 */
export function generateCryptographicAuditProof(
  ruleTriggered: string,
  clientIp: string
): AuditProofHeaders {
  const ts = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(8).toString('hex');
  const stringToSign = `${ruleTriggered}:${clientIp}:${ts}:${nonce}`;

  const proofSignature = crypto
    .createHmac('sha256', AUDIT_PROOF_SECRET)
    .update(stringToSign)
    .digest('hex');

  return {
    'X-SwishOS-Audit-Proof': proofSignature,
    'X-SwishOS-Audit-Timestamp': ts,
    'X-SwishOS-Audit-Nonce': nonce,
  };
}
