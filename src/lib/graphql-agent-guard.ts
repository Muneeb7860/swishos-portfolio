/**
 * SwishOS GraphQL & Nested Tool Query Defense Middleware
 * Inspects incoming GraphQL queries and nested tool structures for recursive depth attacks (max 5 levels),
 * field alias amplification attacks (max 10 aliases), and directive manipulation.
 */

export interface GraphQLSafetyCheck {
  isSafe: boolean;
  maxDepth: number;
  aliasCount: number;
  reason?: string;
  matchedRule?: string;
}

const MAX_ALLOWED_DEPTH = 5;
const MAX_ALLOWED_ALIASES = 10;

/**
 * Calculates max nested depth of braces in a GraphQL/JSON query string.
 */
export function calculateQueryDepth(queryStr: string): number {
  let currentDepth = 0;
  let maxDepth = 0;

  for (let i = 0; i < queryStr.length; i++) {
    const char = queryStr[i];
    if (char === '{') {
      currentDepth++;
      if (currentDepth > maxDepth) {
        maxDepth = currentDepth;
      }
    } else if (char === '}') {
      if (currentDepth > 0) {
        currentDepth--;
      }
    }
  }

  return maxDepth;
}

/**
 * Counts field aliases matching `alias_name: field_name` pattern.
 */
export function countFieldAliases(queryStr: string): number {
  const aliasMatches = queryStr.match(/\b[A-Za-z0-9_]+\s*:\s*[A-Za-z0-9_]+\b/g);
  return aliasMatches ? aliasMatches.length : 0;
}

/**
 * Evaluates GraphQL and nested query safety.
 */
export function evaluateGraphQLQuerySafety(queryStr: string): GraphQLSafetyCheck {
  if (!queryStr || typeof queryStr !== 'string') {
    return { isSafe: true, maxDepth: 0, aliasCount: 0 };
  }

  // 1. Calculate Nested Depth
  const maxDepth = calculateQueryDepth(queryStr);
  if (maxDepth > MAX_ALLOWED_DEPTH) {
    return {
      isSafe: false,
      maxDepth,
      aliasCount: 0,
      reason: `Query Max Depth Exceeded: Depth ${maxDepth} > Limit ${MAX_ALLOWED_DEPTH}`,
      matchedRule: 'GRAPHQL_RECURSIVE_DEPTH_EXCEEDED',
    };
  }

  // 2. Calculate Field Aliases Count
  const aliasCount = countFieldAliases(queryStr);
  if (aliasCount > MAX_ALLOWED_ALIASES) {
    return {
      isSafe: false,
      maxDepth,
      aliasCount,
      reason: `Query Field Aliases Limit Exceeded: ${aliasCount} > Limit ${MAX_ALLOWED_ALIASES}`,
      matchedRule: 'GRAPHQL_ALIAS_AMPLIFICATION_EXCEEDED',
    };
  }

  // 3. Check Directive Manipulation
  if (/@skip\s*\(|\b@include\s*\(/i.test(queryStr)) {
    return {
      isSafe: false,
      maxDepth,
      aliasCount,
      reason: 'Suspicious GraphQL directive manipulation detected',
      matchedRule: 'GRAPHQL_DIRECTIVE_MANIPULATION_DETECTED',
    };
  }

  return {
    isSafe: true,
    maxDepth,
    aliasCount,
  };
}
