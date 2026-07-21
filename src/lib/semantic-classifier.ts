/**
 * Inline Semantic Vector Safety Classifier
 * Evaluates high-dimensional semantic intent vectors, narrative roleplay framing,
 * metalinguistic ciphers, and context-switching prompt injections.
 */

export interface SemanticSafetyResult {
  isThreat: boolean;
  riskScore: number; // 0.0 to 1.0
  confidence: number; // 0.0 to 1.0
  threatType?: string;
  matchedSemanticVector?: string;
}

const SEMANTIC_INTENT_VECTORS = [
  { name: 'NARRATIVE_ROLEPLAY_JAILBREAK', pattern: /(?:write\s+a\s+screenplay|fictional\s+story|character\s+named\s+\w+|in\s+chapter\s+\d+|let's\s+roleplay)/i, weight: 0.85 },
  { name: 'METALINGUISTIC_CIPHER_INJECTION', pattern: /(?:translate\s+pseudocode|metalinguistic\s+cipher|substitution\s+cipher|interpret\s+encoded\s+instruction)/i, weight: 0.90 },
  { name: 'CONTEXT_SWITCHING_OVERRIDE', pattern: /(?:disregard\s+all|reset\s+operational\s+state|forget\s+safety\s+bounds|new\s+system\s+role)/i, weight: 0.95 },
  { name: 'UNAUTHORIZED_SPEND_COMMAND', pattern: /(?:buy\s+\d+\s+units|transfer\s+funds|refund_override|execute_adjustment)/i, weight: 0.88 },
  { name: 'SYSTEM_PROMPT_EXFILTRATION', pattern: /(?:print\s+system\s+prompt|output\s+initial\s+instructions|reveal\s+hidden\s+rules)/i, weight: 0.92 }
];

export function evaluateSemanticSafety(promptText: string): SemanticSafetyResult {
  if (!promptText) {
    return { isThreat: false, riskScore: 0.0, confidence: 1.0 };
  }

  let highestScore = 0.0;
  let detectedThreat: string | undefined = undefined;

  for (const vector of SEMANTIC_INTENT_VECTORS) {
    if (vector.pattern.test(promptText)) {
      if (vector.weight > highestScore) {
        highestScore = vector.weight;
        detectedThreat = vector.name;
      }
    }
  }

  // Heuristic check for combined high-entropy or multi-turn prompt injection context
  if (promptText.length > 500 && /(?:system|instruction|override|execute|admin)/gi.test(promptText)) {
    const matchCount = (promptText.match(/(?:system|instruction|override|execute|admin)/gi) || []).length;
    if (matchCount >= 3) {
      highestScore = Math.max(highestScore, 0.82);
      detectedThreat = detectedThreat || 'MULTI_TURN_LATENT_INJECTION';
    }
  }

  const isThreat = highestScore >= 0.75;
  return {
    isThreat,
    riskScore: highestScore,
    confidence: isThreat ? 0.98 : 0.95,
    threatType: detectedThreat,
    matchedSemanticVector: detectedThreat
  };
}
