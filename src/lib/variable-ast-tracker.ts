import { evaluateSemanticCentroidDistance, CentroidEvaluationResult } from './semantic-centroid';

export interface HistoryMessage {
  role: string;
  content: string;
}

export interface ConcatenationTrackerResult {
  isThreat: boolean;
  concatenatedPayload: string;
  centroidResult?: CentroidEvaluationResult;
  reason?: string;
}

/**
 * Multi-Turn Variable Concatenation AST Tracker (Hardened v0.5.0)
 * Extracts assigned variables (JS, Python dicts, JSON keys, template literals, natural language key bindings)
 * across multi-turn session history, reconstructs the full concatenated string representation,
 * and evaluates it against threat centroids. Defeats delayed multi-turn payload splitting attacks.
 */
export function evaluateConcatenatedVariableAST(history: HistoryMessage[]): ConcatenationTrackerResult {
  if (!history || history.length === 0) {
    return { isThreat: false, concatenatedPayload: '' };
  }

  // 1. Extract all string assignments, key-value mappings, and raw content chunks
  const stringAssignments: string[] = [];
  
  // Patterns: JS/Python variable assignments, template literals, dict indexing, and bounded natural language bindings (<= 64 chars)
  const Patterns = [
    /(?:var|let|const|[a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*['"`]([^'"`]+)['"`]/gi,
    /\[['"]?([a-zA-Z0-9_]+)['"]?\]\s*=\s*['"`]([^'"`]+)['"`]/gi,
    /(?:codeword|key|step|var|val|part)\s+[a-zA-Z0-9_]+\s+(?:is|means|equals|:)\s+['"`]?([a-zA-Z0-9_\s]{1,64})['"`]?/gi
  ];

  for (const msg of history) {
    const text = msg.content || '';
    
    // Collect raw text chunks
    stringAssignments.push(text);

    // Collect extracted variable assignments across all extraction patterns
    for (const pattern of Patterns) {
      pattern.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(text)) !== null) {
        const val = match[2] || match[1];
        if (val && val.length > 1 && val.length <= 64) {
          stringAssignments.push(val);
        }
      }
    }
  }

  // 2. Reconstruct concatenated payload
  const concatenatedPayload = stringAssignments.join(' ');

  // 3. Evaluate concatenated payload against Semantic Centroid Classifier
  const centroidResult = evaluateSemanticCentroidDistance(concatenatedPayload);

  if (centroidResult.isThreat) {
    return {
      isThreat: true,
      concatenatedPayload,
      centroidResult,
      reason: `Multi-Turn Variable Concatenation Threat Detected: ${centroidResult.reason}`,
    };
  }

  return { isThreat: false, concatenatedPayload, centroidResult };
}
