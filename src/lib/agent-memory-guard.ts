/**
 * SwishOS AI Agent Long-Term Memory Security Guard (ASI08 Protection)
 * Sanitizes RAG memories before storage, signs memory provenance with HMAC-SHA256,
 * and validates retrieved memories before prompt insertion.
 */

import crypto from 'crypto';
import { evaluateSemanticCentroidDistance } from './semantic-centroid';

function resolveMemorySecret(): string {
  return (
    process.env.MEMORY_PROVENANCE_SECRET ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    'swishos-master-memory-provenance-secret-v1'
  );
}

const INDIRECT_INJECTION_MARKERS = [
  /ignore\s+previous\s+instructions/gi,
  /system\s*:/gi,
  /note\s+to\s+ai\s*:/gi,
  /developer\s+mode\s*:/gi,
  /override\s+prior\s+rules/gi,
];

export interface SanitizedMemoryRecord {
  sanitizedText: string;
  sourceId: string;
  provenanceHash: string;
  timestamp: string;
  isSafe: boolean;
  reason?: string;
}

export interface ValidatedMemoryChunk {
  isValid: boolean;
  encapsulatedXml: string;
  reason?: string;
}

/**
 * Dual-Pass Sanitization of long-term memory text before vector database embedding.
 * Attaches HMAC-SHA256 provenance signature.
 */
export function sanitizeMemoryForStorage(
  rawText: string,
  sourceId = 'user-session-memory'
): SanitizedMemoryRecord {
  const ts = new Date().toISOString();

  // 1. Centroid Threat Check
  const centroidCheck = evaluateSemanticCentroidDistance(rawText);
  if (centroidCheck.isThreat) {
    return {
      sanitizedText: '[BLOCKED_INDIRECT_INJECTION_MEMORY]',
      sourceId,
      provenanceHash: '',
      timestamp: ts,
      isSafe: false,
      reason: `Memory Sanitization Blocked: ${centroidCheck.reason}`,
    };
  }

  // 2. Strip Indirect Prompt Injection Markers
  let cleanedText = rawText;
  for (const marker of INDIRECT_INJECTION_MARKERS) {
    cleanedText = cleanedText.replace(marker, '[STRIPPED_INJECTION_MARKER]');
  }

  // 3. Generate HMAC-SHA256 Memory Provenance Signature
  const stringToSign = `${cleanedText}:${sourceId}:${ts}`;
  const provenanceHash = crypto
    .createHmac('sha256', resolveMemorySecret())
    .update(stringToSign)
    .digest('hex');

  return {
    sanitizedText: cleanedText,
    sourceId,
    provenanceHash,
    timestamp: ts,
    isSafe: true,
  };
}

function escapeXmlEntities(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Validates retrieved memory chunk before prompt insertion.
 * Verifies provenance hash out-of-band and encapsulates memory in structural XML.
 */
export function validateRetrievedMemory(record: SanitizedMemoryRecord): ValidatedMemoryChunk {
  if (!record.isSafe || !record.provenanceHash) {
    return {
      isValid: false,
      encapsulatedXml: '',
      reason: 'Retrieved memory was flagged unsafe or missing provenance hash.',
    };
  }

  // 1. Re-verify HMAC Provenance Signature
  const stringToSign = `${record.sanitizedText}:${record.sourceId}:${record.timestamp}`;
  const expectedHash = crypto
    .createHmac('sha256', resolveMemorySecret())
    .update(stringToSign)
    .digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(record.provenanceHash), Buffer.from(expectedHash))) {
    return {
      isValid: false,
      encapsulatedXml: '',
      reason: 'Memory Provenance Verification Failed: Vector database memory tampering detected!',
    };
  }

  // 2. Re-verify Centroid Distance
  const centroidCheck = evaluateSemanticCentroidDistance(record.sanitizedText);
  if (centroidCheck.isThreat) {
    return {
      isValid: false,
      encapsulatedXml: '',
      reason: `Retrieved Memory Threat Re-evaluation Blocked: ${centroidCheck.reason}`,
    };
  }

  // 3. Structural XML Encapsulation with XML Entity Escaping (Prevents XML Tag Breakout)
  const escapedText = escapeXmlEntities(record.sanitizedText);
  const encapsulatedXml = `<trusted_context provenance="${record.provenanceHash}" source="${record.sourceId}">\n${escapedText}\n</trusted_context>`;

  return {
    isValid: true,
    encapsulatedXml,
  };
}
