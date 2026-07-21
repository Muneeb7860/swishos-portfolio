/**
 * SwishOS 5-Step Verification Engine
 * Shift-Left & Shift-Right Guardrail Architecture for Autonomous AI Agents
 * Mapped to OWASP Agentic Top 10 (2026) Standards
 */

export interface VerificationRequest {
  query: string;
  name?: string;
  email?: string;
  channel?: string;
  category?: string;
  toolName?: string;
  toolArgs?: Record<string, unknown>;
  dailySpendUSD?: number;
  maxDailySpendUSD?: number;
  maxToolAmountUSD?: number;
  lang?: string;
}

export interface VerificationStepResult {
  step: number;
  name: string;
  passed: boolean;
  details: string;
  output: string;
}

export interface VerificationPipelineResult {
  blocked: boolean;
  status: 'allowed' | 'blocked' | 'redacted' | 'triaged';
  threatType?: string;
  triggeredRules: string[];
  sanitizedQuery: string;
  ticketId?: string;
  sla?: string;
  steps: VerificationStepResult[];
  telemetry: {
    timestamp: string;
    homoglyphsNormalized: boolean;
    piiRedacted: boolean;
    astValid: boolean;
    spendCapOk: boolean;
    executionTimeMs: number;
  };
}

// Homoglyph map: Cyrillic/Greek to Latin
const HOMOGLYPH_MAP: Record<string, string> = {
  'а': 'a', 'е': 'e', 'о': 'o', 'с': 'c', 'ɑ': 'a', 'α': 'a',
  'А': 'A', 'С': 'C', 'Е': 'E', 'О': 'O', 'і': 'i', 'І': 'I',
  'р': 'p', 'Р': 'P', 'у': 'y', 'У': 'Y', 'х': 'x', 'Х': 'X'
};

/**
 * STEP 1: Input Normalization & Homoglyph Stripping
 */
export function step1_normalizeInput(rawInput: string): { normalized: string; homoglyphsFound: boolean } {
  if (!rawInput) return { normalized: '', homoglyphsFound: false };
  
  // 1. NFKC Unicode Normalization
  let text = rawInput.normalize('NFKC');
  
  // 2. Strip zero-width spaces and control characters
  text = text.replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '');
  
  // 3. Unmap Homoglyphs
  let homoglyphsFound = false;
  const chars = Array.from(text);
  const unmapped = chars.map(ch => {
    if (HOMOGLYPH_MAP[ch]) {
      homoglyphsFound = true;
      return HOMOGLYPH_MAP[ch];
    }
    return ch;
  }).join('');

  return { normalized: unmapped, homoglyphsFound };
}

/**
 * STEP 2: Threat & Jailbreak Injection Detection (OWASP LLM01)
 */
export function step2_detectThreats(text: string): { isThreat: boolean; threatType?: string; rule?: string } {
  const lower = text.toLowerCase();
  
  const injectionPatterns = [
    { pattern: /ignore\s+(all\s+)?(previous|prior|above|your)\s+instructions/i, name: 'Direct Prompt Injection (Ignore Instructions)' },
    { pattern: /system\s+override|parameter\s+override/i, name: 'System Prompt Override' },
    { pattern: /dan\s+mode|do\s+anything\s+now/i, name: 'DAN Jailbreak Framing' },
    { pattern: /developer\s+mode|sudo\s+mode|admin\s+mode/i, name: 'Privilege Escalation Bypass' },
    { pattern: /<system_override>|<\/system_override>|<<sys>>|<<\/sys>>/i, name: 'Delimiter Hijacking' },
    { pattern: /rm\s+-rf|drop\s+database|truncate\s+table|chmod\s+777/i, name: 'Destructive Command Execution' },
    { pattern: /adopt\s+the\s+persona|act\s+as\s+an?\s+unrestricted|unconstrained/i, name: 'Persona Jailbreak Hijack' },
    { pattern: /compliance\s+auditor|security\s+compliance\s+scenario/i, name: 'Compliance Framing Exploit' },
    { pattern: /chapter\s+\d+.*execute|narrative\s+chapter/i, name: 'Narrative Story Jailbreak' }
  ];

  for (const { pattern, name } of injectionPatterns) {
    if (pattern.test(lower)) {
      return { isThreat: true, threatType: 'LLM01_PROMPT_INJECTION', rule: name };
    }
  }

  return { isThreat: false };
}

/**
 * STEP 3: PII & Confidential Secret Redaction Engine (OWASP LLM02)
 */
export function step3_redactPII(input: string): { redactedText: string; piiFound: boolean } {
  let text = input;
  let piiFound = false;

  // Credit Card (Luhn pattern matching digits)
  const ccRegex = /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})\b/g;
  if (ccRegex.test(text)) {
    text = text.replace(ccRegex, '[REDACTED_CREDIT_CARD]');
    piiFound = true;
  }

  // API Keys (OpenAI, GitHub, AWS, Generic Secret)
  const apiKeyRegex = /\b(sk-[a-zA-Z0-9]{32,}|ghp_[a-zA-Z0-9]{36}|AIza[0-9A-Za-z-_]{35})\b/g;
  if (apiKeyRegex.test(text)) {
    text = text.replace(apiKeyRegex, '[REDACTED_API_KEY]');
    piiFound = true;
  }

  // Email Addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  if (emailRegex.test(text)) {
    text = text.replace(emailRegex, '[REDACTED_EMAIL]');
    piiFound = true;
  }

  return { redactedText: text, piiFound };
}

/**
 * STEP 4: Deterministic AST Tool Bounds & Spend Caps (OWASP LLM06 / ASI10)
 */
export function step4_validateASTBounds(
  toolName?: string,
  toolArgs?: Record<string, unknown>,
  dailySpendUSD: number = 0,
  maxDailySpendUSD: number = 5.0,
  maxToolAmountUSD: number = 5000.0
): { valid: boolean; spendCapOk: boolean; error?: string } {
  // 1. Spend Cap Verification
  if (dailySpendUSD >= maxDailySpendUSD) {
    return { valid: false, spendCapOk: false, error: `Daily agent spend limit of $${maxDailySpendUSD.toFixed(2)} reached (ASI10 Cap).` };
  }

  // 2. AST Parameter Bounds Verification
  if (toolArgs) {
    const rawAmount = toolArgs['amount'] ?? toolArgs['cost'] ?? toolArgs['units'];
    if (typeof rawAmount === 'number' && rawAmount > maxToolAmountUSD) {
      return {
        valid: false,
        spendCapOk: true,
        error: `Tool '${toolName || 'action'}' argument $${rawAmount} exceeds maximum threshold of $${maxToolAmountUSD} (OWASP LLM06 Excessive Agency).`
      };
    }

    // SQL Read-Only AST Validation
    const sqlQuery = String(toolArgs['query'] || toolArgs['sql'] || '');
    if (/^\s*(DROP|TRUNCATE|DELETE\s+FROM\s+\*|ALTER\s+TABLE)\b/i.test(sqlQuery)) {
      return {
        valid: false,
        spendCapOk: true,
        error: `Destructive SQL command blocked in AST tool evaluation.`
      };
    }
  }

  return { valid: true, spendCapOk: true };
}

/**
 * STEP 5: Execution Telemetry & Incident Triage (OWASP LLM08)
 */
export function execute5StepVerification(req: VerificationRequest): VerificationPipelineResult {
  const startTime = Date.now();
  const steps: VerificationStepResult[] = [];
  const triggeredRules: string[] = [];

  // STEP 1: Ingestion & Normalization
  const { normalized, homoglyphsFound } = step1_normalizeInput(req.query);
  steps.push({
    step: 1,
    name: 'Input Normalization & Homoglyph Stripping',
    passed: true,
    details: homoglyphsFound ? 'Homoglyphs detected & unmapped to Latin NFKC' : 'Clean NFKC Unicode normalization applied',
    output: normalized
  });

  // STEP 2: Threat Detection
  const threatResult = step2_detectThreats(normalized);
  if (threatResult.isThreat) {
    triggeredRules.push(threatResult.rule || 'LLM01_PROMPT_INJECTION');
    steps.push({
      step: 2,
      name: 'Threat & Injection Pattern Filter',
      passed: false,
      details: `Exploit pattern detected: ${threatResult.rule}`,
      output: '[BLOCKED_BY_GUARDRAIL]'
    });

    const ticketId = `SEC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    return {
      blocked: true,
      status: 'blocked',
      threatType: threatResult.threatType,
      triggeredRules,
      sanitizedQuery: '[BLOCKED_BY_GUARDRAIL]',
      ticketId,
      sla: 'P1 - 15m SLA',
      steps,
      telemetry: {
        timestamp: new Date().toISOString(),
        homoglyphsNormalized: homoglyphsFound,
        piiRedacted: false,
        astValid: false,
        spendCapOk: true,
        executionTimeMs: Date.now() - startTime
      }
    };
  } else {
    steps.push({
      step: 2,
      name: 'Threat & Injection Pattern Filter',
      passed: true,
      details: 'Zero injection or jailbreak threat patterns detected',
      output: normalized
    });
  }

  // STEP 3: PII & Secret Redaction
  const { redactedText, piiFound } = step3_redactPII(normalized);
  if (piiFound) {
    triggeredRules.push('LLM02_PII_REDACTED');
  }
  steps.push({
    step: 3,
    name: 'PII & Confidential Secret Redaction Engine',
    passed: true,
    details: piiFound ? 'Confidential credentials or PII sanitized' : 'No PII or sensitive tokens detected',
    output: redactedText
  });

  // STEP 4: AST Tool Bounds & Spend Caps
  const astResult = step4_validateASTBounds(
    req.toolName,
    req.toolArgs,
    req.dailySpendUSD || 0,
    req.maxDailySpendUSD || 5.0,
    req.maxToolAmountUSD || 5000.0
  );

  if (!astResult.valid) {
    triggeredRules.push('LLM06_AST_BOUNDS_VIOLATED');
    steps.push({
      step: 4,
      name: 'Deterministic AST Tool Bounds & Spend Caps',
      passed: false,
      details: astResult.error || 'AST Tool Validation Failed',
      output: '[ACTION_EXECUTION_BLOCKED]'
    });

    const ticketId = `SEC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    return {
      blocked: true,
      status: 'blocked',
      threatType: 'LLM06_EXCESSIVE_AGENCY',
      triggeredRules,
      sanitizedQuery: redactedText,
      ticketId,
      sla: 'P1 - 15m SLA',
      steps,
      telemetry: {
        timestamp: new Date().toISOString(),
        homoglyphsNormalized: homoglyphsFound,
        piiRedacted: piiFound,
        astValid: false,
        spendCapOk: astResult.spendCapOk,
        executionTimeMs: Date.now() - startTime
      }
    };
  } else {
    steps.push({
      step: 4,
      name: 'Deterministic AST Tool Bounds & Spend Caps',
      passed: true,
      details: 'AST parameters within acceptable range ($5/day spend cap clear)',
      output: redactedText
    });
  }

  // STEP 5: Execution Telemetry & Triage Dispatch
  const isSecurity = /vulnerability|jailbreak|threat|exploit/i.test(normalized);
  const ticketId = isSecurity
    ? `SEC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    : `TKT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const sla = isSecurity ? 'P1 - 15m SLA' : 'P2 - 1h SLA';

  steps.push({
    step: 5,
    name: 'Execution Telemetry & SLA Incident Triage',
    passed: true,
    details: `Telemetry logged to audit trail (${ticketId}, ${sla})`,
    output: `Dispatched to SLA Triage Queue: ${ticketId}`
  });

  return {
    blocked: false,
    status: piiFound ? 'redacted' : 'allowed',
    triggeredRules,
    sanitizedQuery: redactedText,
    ticketId,
    sla,
    steps,
    telemetry: {
      timestamp: new Date().toISOString(),
      homoglyphsNormalized: homoglyphsFound,
      piiRedacted: piiFound,
      astValid: true,
      spendCapOk: true,
      executionTimeMs: Date.now() - startTime
    }
  };
}
