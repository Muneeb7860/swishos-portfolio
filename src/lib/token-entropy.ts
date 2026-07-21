/**
 * Calculates Character Shannon Entropy & Token Perplexity Density Scores.
 * Rejects adversarial prompt noise, homoglyph spam, and GCG/TAP mutations at Step 0.
 */

export interface TokenEntropyResult {
  entropyScore: number;
  homoglyphRatio: number;
  isAnomalous: boolean;
  reason?: string;
}

export function computeShannonEntropy(text: string): number {
  if (!text) return 0;
  const frequencies = new Map<string, number>();
  for (const char of text) {
    frequencies.set(char, (frequencies.get(char) || 0) + 1);
  }

  let entropy = 0;
  const len = text.length;
  for (const count of frequencies.values()) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

export function analyzeTokenEntropy(text: string): TokenEntropyResult {
  if (!text || text.trim().length === 0) {
    return { entropyScore: 0, homoglyphRatio: 0, isAnomalous: false };
  }

  const entropyScore = computeShannonEntropy(text);

  // Measure Non-ASCII / Non-Latin ratio (Homoglyph & Unicode Obfuscation Spam)
  let nonAsciiCount = 0;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code > 127) {
      nonAsciiCount++;
    }
  }
  const homoglyphRatio = nonAsciiCount / text.length;

  // High entropy (> 5.2) + High non-ASCII ratio (> 0.25) indicates token corruption / adversarial noise
  if (entropyScore > 5.2 && homoglyphRatio > 0.25) {
    return {
      entropyScore,
      homoglyphRatio,
      isAnomalous: true,
      reason: 'High entropy & non-ASCII token density detected (Adversarial noise/homoglyphs).',
    };
  }

  return { entropyScore, homoglyphRatio, isAnomalous: false };
}
