/**
 * Lexical Character N-Gram Threat Centroid Classifier (Hardened v0.5.1)
 *
 * AUDIT FIX F9: Renamed from "Semantic Centroid" — this is NOT a semantic
 * (embedding-based) classifier.  It computes exact character 3-gram frequency
 * vectors and evaluates cosine similarity against pre-built threat keyword
 * cluster centroids.  This is a lexical fuzzy-match technique, effective for
 * catching keyword variations and obfuscation but unable to distinguish
 * semantically different uses of the same substrings (e.g. "bypass surgery"
 * vs. "bypass security").  Thresholds must be tuned per-category.
 *
 * Pre-decodes adversarial ciphers (Hex, Base64, ROT13, NFKC Unicode Math Symbols).
 */

export interface CentroidEvaluationResult {
  isThreat: boolean;
  matchedCategory?: string;
  centroidScore: number;
  reason?: string;
}

interface ThreatCentroidVector {
  category: string;
  rawKeywords: string[];
  vector: Map<string, number>;
  magnitude: number;
  threshold: number;
}

/**
 * Extracts character N-grams (N=3) from normalized text streams.
 */
export function extractCharacterNGrams(text: string, n: number = 3): Map<string, number> {
  const ngrams = new Map<string, number>();
  const cleaned = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (cleaned.length < n) {
    if (cleaned.length > 0) {
      ngrams.set(cleaned, 1);
    }
    return ngrams;
  }

  for (let i = 0; i <= cleaned.length - n; i++) {
    const gram = cleaned.substring(i, i + n);
    ngrams.set(gram, (ngrams.get(gram) || 0) + 1);
  }
  return ngrams;
}

/**
 * Computes L2 Euclidean Norm (Magnitude) of a vector map.
 */
function computeVectorMagnitude(vector: Map<string, number>): number {
  let sumSq = 0;
  for (const val of vector.values()) {
    sumSq += val * val;
  }
  return Math.sqrt(sumSq);
}

/**
 * Computes exact Dot Product Vector Cosine Similarity S = (A · B) / (||A|| * ||B||).
 */
export function computeVectorCosineSimilarity(
  vecA: Map<string, number>,
  magA: number,
  vecB: Map<string, number>,
  magB: number
): number {
  if (magA === 0 || magB === 0) return 0;

  let dotProduct = 0;
  for (const [gram, countA] of vecA.entries()) {
    const countB = vecB.get(gram);
    if (countB !== undefined) {
      dotProduct += countA * countB;
    }
  }

  return dotProduct / (magA * magB);
}

// Pre-compiled Threat Centroids as Character 3-Gram Feature Vectors
const THREAT_DEFINITIONS = [
  {
    category: 'PROMPT_INJECTION_OVERRIDE',
    keywords: [
      'ignore', 'override', 'bypass', 'system', 'instructions', 'prior', 'rules', 'developer', 'mode', 'admin', 'sudo', 'unrestricted', 'unconstrained', 'persona', 'act', 'auditor', 'validator',
      'nullify', 'disregard', 'rescind', 'mandates', 'guidelines', 'directives', 'unbounded', 'privilege', 'sanitizer', 'disregardez', 'forget',
      'ignorez', 'ignoriere', 'tajahal', 'anweisungen', 'instrucciones', 'precedentes', 'vorherigen', 'previas', 'sistema', 'reveler', 'desarrollador'
    ],
    threshold: 0.15,
  },
  {
    category: 'DESTRUCTIVE_EXFILTRATION',
    keywords: [
      'drop', 'truncate', 'delete', 'exfiltrate', 'send', 'http', 'curl', 'wget', 'fetch', 'token', 'secret', 'password', 'key', 'database', 'dump',
      'credentials', 'authorization', 'table', 'wipe', 'remove', 'purge', 'exfil', 'decommission',
      'effacer', 'löschen', 'borrar', 'contraseña', 'clave', 'passwort'
    ],
    threshold: 0.15,
  },
  {
    category: 'ROLEPLAY_JAILBREAK_FRAME',
    keywords: [
      'fictional', 'compliance', 'scenario', 'chapter', 'story', 'audit', 'ticket', 'hypothetical', 'simulation', 'game', 'playground', 'puzzle',
      'roleplay', 'acting', 'narrative', 'novel', 'experiment', 'academic', 'jailbreak',
      'fictif', 'geschicht', 'ficticio', 'juego', 'spiel'
    ],
    threshold: 0.15,
  },
  {
    category: 'UNAUTHORIZED_FINANCIAL_OVERRIDE',
    keywords: [
      'treasury_payout_override', 'wire_transfer_bypass', 'shares_market_order', 'iban_overdraft_bypass', 'surge_multiplier_override', 'unauthorized_payout'
    ],
    threshold: 0.22,
  },
];

// Initialize Vector Centroids with pre-calculated magnitudes
const PRECOMPILED_CENTROIDS: ThreatCentroidVector[] = THREAT_DEFINITIONS.map((def) => {
  const combinedText = def.keywords.join(' ');
  const vector = extractCharacterNGrams(combinedText, 3);
  const magnitude = computeVectorMagnitude(vector);
  return {
    category: def.category,
    rawKeywords: def.keywords,
    vector,
    magnitude,
    threshold: def.threshold,
  };
});

/**
 * Pre-decodes hex strings, ROT13 transformations, Base64, and normalizes Mathematical Unicode symbols.
 */
export function decodeAdversarialCiphers(text: string): string[] {
  const variations: string[] = [text];

  // 1. Hex sequence decoding (e.g. 0x69676e6f7265 or \x69\x67...)
  const hexCleaned = text.replace(/0x|\\x/g, '');
  if (/^[0-9a-fA-F]{8,}$/.test(hexCleaned) && hexCleaned.length % 2 === 0) {
    try {
      const decodedHex = Buffer.from(hexCleaned, 'hex').toString('utf-8');
      if (/^[\x20-\x7E\s]+$/.test(decodedHex)) {
        variations.push(decodedHex);
      }
    } catch {}
  }

  // 1b. Base64 sequence decoding
  const b64Matches = text.match(/[A-Za-z0-9_\-\/+=]{16,}/g);
  if (b64Matches) {
    for (const rawMatch of b64Matches) {
      const b64Str = rawMatch.replace(/-/g, '+').replace(/_/g, '/');
      if (b64Str.length % 4 === 0 || b64Str.length % 4 === 2 || b64Str.length % 4 === 3) {
        try {
          const decodedB64 = Buffer.from(b64Str, 'base64').toString('utf-8');
          if (/^[\x20-\x7E\s]{6,}$/.test(decodedB64) && decodedB64 !== text) {
            variations.push(decodedB64);
          }
        } catch {}
      }
    }
  }

  // 2. ROT13 transformation
  const normalizedForRot = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const rot13 = normalizedForRot.replace(/[a-zA-Z]/g, (c) => {
    const code = c.charCodeAt(0);
    const base = code >= 97 ? 97 : 65;
    return String.fromCharCode(((code - base + 13) % 26) + base);
  });
  if (/rot13|cipher|caesar|obfuscat/i.test(text) || /\b(?:ignore|override|bypass|system|instructions|delete|secret)\b/i.test(rot13)) {
    variations.push(rot13);
  }

  // 3. Mathematical Unicode normalization (NFKC)
  try {
    const nfkc = text.normalize('NFKC');
    if (nfkc !== text) {
      variations.push(nfkc);
    }
  } catch {}

  return variations;
}

export function evaluateSemanticCentroidDistance(text: string): CentroidEvaluationResult {
  if (!text || text.trim().length === 0) {
    return { isThreat: false, centroidScore: 0 };
  }

  const variations = decodeAdversarialCiphers(text);

  for (const stream of variations) {
    const inputVector = extractCharacterNGrams(stream, 3);
    const inputMag = computeVectorMagnitude(inputVector);

    if (inputMag === 0) continue;

    for (const centroid of PRECOMPILED_CENTROIDS) {
      const score = computeVectorCosineSimilarity(
        inputVector,
        inputMag,
        centroid.vector,
        centroid.magnitude
      );

      if (score >= centroid.threshold) {
        return {
          isThreat: true,
          matchedCategory: centroid.category,
          centroidScore: score,
          reason: `Semantic Centroid Distance Triggered (${centroid.category}, vector score: ${(score * 100).toFixed(1)}% >= ${(centroid.threshold * 100)}%).`,
        };
      }
    }
  }

  return { isThreat: false, centroidScore: 0 };
}
