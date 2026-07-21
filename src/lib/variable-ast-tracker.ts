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
 * Extracts assigned variables (e.g. A = "...", var = '...') across multi-turn session history,
 * reconstructs the full concatenated string representation, and evaluates it against threat centroids.
 * Defeats multi-turn delayed payload reconstruction attacks by Mythos.
 */
export function evaluateConcatenatedVariableAST(history: HistoryMessage[]): ConcatenationTrackerResult {
  if (!history || history.length === 0) {
    return { isThreat: false, concatenatedPayload: '' };
  }

  // 1. Extract all string assignments and raw content chunks
  const stringAssignments: string[] = [];
  const variablePattern = /(?:var|let|const|[a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*['"]([^'"]+)['"]/gi;

  for (const msg of history) {
    const text = msg.content || '';
    
    // Collect raw text chunks
    stringAssignments.push(text);

    // Collect explicit string assignments
    let match: RegExpExecArray | null;
    while ((match = variablePattern.exec(text)) !== null) {
      if (match[1]) {
        stringAssignments.push(match[1]);
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
