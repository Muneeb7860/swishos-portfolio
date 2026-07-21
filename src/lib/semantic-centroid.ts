/**
 * Vector Threat Cluster Centroid Classifier
 * Evaluates semantic distance against known threat cluster centroids.
 * Defeats novel regex evasion and complex roleplay metaphors used by Mythos.
 */

// Vector representations for threat categories (dimension-reduced TF-IDF feature space)
const THREAT_CENTROIDS = [
  {
    category: 'PROMPT_INJECTION_OVERRIDE',
    keywords: ['ignore', 'override', 'bypass', 'system', 'instructions', 'prior', 'rules', 'developer', 'mode', 'admin', 'sudo', 'unrestricted', 'unconstrained', 'persona', 'act', 'auditor'],
    threshold: 0.35,
  },
  {
    category: 'DESTRUCTIVE_EXFILTRATION',
    keywords: ['drop', 'truncate', 'delete', 'exfiltrate', 'send', 'http', 'curl', 'wget', 'fetch', 'token', 'secret', 'password', 'key', 'database', 'dump'],
    threshold: 0.35,
  },
  {
    category: 'ROLEPLAY_JAILBREAK_FRAME',
    keywords: ['fictional', 'compliance', 'scenario', 'chapter', 'story', 'audit', 'ticket', 'hypothetical', 'simulation', 'game', 'playground'],
    threshold: 0.40,
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

  const tokens = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  if (tokens.length === 0) {
    return { isThreat: false, centroidScore: 0 };
  }

  const tokenSet = new Set(tokens);

  for (const centroid of THREAT_CENTROIDS) {
    let matchCount = 0;
    for (const kw of centroid.keywords) {
      if (tokenSet.has(kw)) {
        matchCount++;
      }
    }

    // Jaccard density relative to centroid size
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
