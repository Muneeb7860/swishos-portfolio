/**
 * Vector Threat Cluster Centroid Classifier (Hardened v0.4.0)
 * Evaluates semantic distance AND sub-word character N-gram similarity against Threat Cluster Centroids.
 * Catches sub-threshold keyword density gliding (e.g. 0.34 density gliding).
 */

const THREAT_CENTROIDS = [
  {
    category: 'PROMPT_INJECTION_OVERRIDE',
    keywords: ['ignore', 'override', 'bypass', 'system', 'instructions', 'prior', 'rules', 'developer', 'mode', 'admin', 'sudo', 'unrestricted', 'unconstrained', 'persona', 'act', 'auditor', 'validator'],
    threshold: 0.25, // Lowered from 0.35 to eliminate gliding window
  },
  {
    category: 'DESTRUCTIVE_EXFILTRATION',
    keywords: ['drop', 'truncate', 'delete', 'exfiltrate', 'send', 'http', 'curl', 'wget', 'fetch', 'token', 'secret', 'password', 'key', 'database', 'dump'],
    threshold: 0.25,
  },
  {
    category: 'ROLEPLAY_JAILBREAK_FRAME',
    keywords: ['fictional', 'compliance', 'scenario', 'chapter', 'story', 'audit', 'ticket', 'hypothetical', 'simulation', 'game', 'playground', 'puzzle'],
    threshold: 0.28,
  },
];

export interface CentroidEvaluationResult {
  isThreat: boolean;
  matchedCategory?: string;
  centroidScore: number;
  reason?: string;
}

export function evaluateSemanticCentroidDistance(text: string): CentroidEvaluationResult {
  if (!text || text.trim().length === 0) {
    return { isThreat: false, centroidScore: 0 };
  }

  const normalizedText = text.toLowerCase().replace(/[^a-z0-9\s]/g, '');
  const tokens = normalizedText.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return { isThreat: false, centroidScore: 0 };
  }

  const tokenSet = new Set(tokens);

  for (const centroid of THREAT_CENTROIDS) {
    let matchCount = 0;

    // 1. Direct Token Matches
    for (const kw of centroid.keywords) {
      if (tokenSet.has(kw)) {
        matchCount++;
      } else {
        // 2. Sub-Word N-Gram Containment (Catches modified stems & sub-threshold gliding)
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

  return { isThreat: false, centroidScore: 0 };
}
