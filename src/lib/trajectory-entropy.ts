/**
 * Stateful Trajectory Entropy Engine
 * Measures Jaccard / N-Gram Cosine Similarity across sliding-window session queries.
 * Detects and locks out active TAP / MCTS adversarial search trees.
 */

const SESSION_TRAJECTORY_MAP = new Map<string, { query: string; timestamp: number }[]>();
const WINDOW_SIZE = 5;
const SIMILARITY_THRESHOLD = 0.75;
const EXPIRY_MS = 300000; // 5 Minutes

const STOP_WORDS = new Set([
  'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'in', 'to', 'for', 'with', 'by', 'from', 'this', 'that', 'it', 'be', 'are', 'was', 'were', 'as'
]);

function getNGrams(text: string, n = 3): Set<string> {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));
  const normalized = words.join('');
  const nGrams = new Set<string>();
  for (let i = 0; i <= normalized.length - n; i++) {
    nGrams.add(normalized.slice(i, i + n));
  }
  return nGrams;
}

export function computeNGramCosineSimilarity(textA: string, textB: string): number {
  if (!textA || !textB) return 0;
  const setA = getNGrams(textA);
  const setB = getNGrams(textB);

  if (setA.size === 0 || setB.size === 0) return 0;

  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) {
      intersection++;
    }
  }

  return intersection / Math.sqrt(setA.size * setB.size);
}

export interface TrajectoryResult {
  isSearchTreeDetected: boolean;
  averageSimilarity: number;
  reason?: string;
}

export function evaluateTrajectoryEntropy(sessionId: string, currentQuery: string): TrajectoryResult {
  const now = Date.now();
  let history = SESSION_TRAJECTORY_MAP.get(sessionId) || [];

  // Filter expired entries
  history = history.filter(h => now - h.timestamp < EXPIRY_MS);

  if (history.length < 2) {
    history.push({ query: currentQuery, timestamp: now });
    SESSION_TRAJECTORY_MAP.set(sessionId, history);
    return { isSearchTreeDetected: false, averageSimilarity: 0 };
  }

  // Calculate similarity against recent window
  let totalSim = 0;
  let comparisons = 0;
  for (const prev of history.slice(-WINDOW_SIZE)) {
    totalSim += computeNGramCosineSimilarity(currentQuery, prev.query);
    comparisons++;
  }

  const avgSim = comparisons > 0 ? totalSim / comparisons : 0;

  history.push({ query: currentQuery, timestamp: now });
  if (history.length > WINDOW_SIZE * 2) {
    history = history.slice(-WINDOW_SIZE * 2);
  }
  SESSION_TRAJECTORY_MAP.set(sessionId, history);

  if (avgSim >= SIMILARITY_THRESHOLD && history.length >= 3) {
    return {
      isSearchTreeDetected: true,
      averageSimilarity: avgSim,
      reason: `Adversarial search tree detected (N-Gram similarity: ${(avgSim * 100).toFixed(1)}% >= ${(SIMILARITY_THRESHOLD * 100)}%).`,
    };
  }

  return { isSearchTreeDetected: false, averageSimilarity: avgSim };
}
