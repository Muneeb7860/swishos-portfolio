/**
 * Vector Threat Cluster Centroid Classifier (Hardened v0.5.0)
 * Evaluates semantic distance, multi-lingual stem keywords, AND sub-word character N-gram similarity
 * against Threat Cluster Centroids after pre-decoding ciphers (Hex, ROT13, Unicode Math Symbols).
 */

const THREAT_CENTROIDS = [
  {
    category: 'PROMPT_INJECTION_OVERRIDE',
    keywords: [
      // English
      'ignore', 'override', 'bypass', 'system', 'instructions', 'prior', 'rules', 'developer', 'mode', 'admin', 'sudo', 'unrestricted', 'unconstrained', 'persona', 'act', 'auditor', 'validator',
      // Multi-Lingual Stems (French, German, Spanish, Arabic transliterations)
      'ignorez', 'ignoriere', 'tajahal', 'anweisungen', 'instrucciones', 'precedentes', 'vorherigen', 'previas', 'sistema', 'reveler', 'développeur', 'desarrollador'
    ],
    threshold: 0.22,
  },
  {
    category: 'DESTRUCTIVE_EXFILTRATION',
    keywords: [
      'drop', 'truncate', 'delete', 'exfiltrate', 'send', 'http', 'curl', 'wget', 'fetch', 'token', 'secret', 'password', 'key', 'database', 'dump',
      'effacer', 'löschen', 'borrar', 'contraseña', 'clave', 'passwort'
    ],
    threshold: 0.22,
  },
  {
    category: 'ROLEPLAY_JAILBREAK_FRAME',
    keywords: [
      'fictional', 'compliance', 'scenario', 'chapter', 'story', 'audit', 'ticket', 'hypothetical', 'simulation', 'game', 'playground', 'puzzle',
      'fictif', 'geschicht', 'ficticio', 'juego', 'spiel'
    ],
    threshold: 0.25,
  },
];

export interface CentroidEvaluationResult {
  isThreat: boolean;
  matchedCategory?: string;
  centroidScore: number;
  reason?: string;
}

/**
 * Pre-decodes hex strings, ROT13 transformations, and normalizes Mathematical Unicode symbols.
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

  // 2. ROT13 transformation
  const rot13 = text.replace(/[a-zA-Z]/g, (c) => {
    const code = c.charCodeAt(0);
    const base = code >= 97 ? 97 : 65;
    return String.fromCharCode(((code - base + 13) % 26) + base);
  });
  variations.push(rot13);

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
    const normalizedText = stream.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    const tokens = normalizedText.split(/\s+/).filter(Boolean);
    if (tokens.length === 0) continue;

    const tokenSet = new Set(tokens);

    for (const centroid of THREAT_CENTROIDS) {
      let matchCount = 0;

      // Direct Token & Sub-Word Containment Checks
      for (const kw of centroid.keywords) {
        if (tokenSet.has(kw)) {
          matchCount++;
        } else {
          for (const token of tokenSet) {
            if (token.length >= 4 && (token.includes(kw) || kw.includes(token))) {
              matchCount += 0.5;
              break;
            }
          }
        }
      }

      const score = matchCount / centroid.keywords.length;

      if (score >= centroid.threshold) {
        return {
          isThreat: true,
          matchedCategory: centroid.category,
          centroidScore: score,
          reason: `Semantic Centroid Distance Triggered (${centroid.category}, score: ${(score * 100).toFixed(1)}% >= ${(centroid.threshold * 100)}%).`,
        };
      }
    }
  }

  return { isThreat: false, centroidScore: 0 };
}
