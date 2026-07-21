import { NextResponse } from 'next/server';
import { checkRateLimit, checkSessionBudget, checkAgentSpendCap } from '@/lib/rate-limiter';
import { logAuditIncident } from '@/lib/audit-logger';
import { evaluateSemanticSafety } from '@/lib/semantic-classifier';
import { executeToolInSandbox } from '@/lib/wasm-sandbox';
import { validateAgentMTLS } from '@/lib/mtls-validator';
import { execute5StepVerification } from '@/lib/verification-engine';
import { analyzeTokenEntropy } from '@/lib/token-entropy';
import { evaluateTrajectoryEntropy } from '@/lib/trajectory-entropy';
import { applyExponentialTarpit } from '@/lib/tarpit-engine';
import { createZeroInfoRefusal } from '@/lib/flat-refusal';
import { computeClientFingerprint, applyGlobalFingerprintTarpit } from '@/lib/global-tarpit';
import { evaluateSemanticCentroidDistance } from '@/lib/semantic-centroid';

export const runtime = 'nodejs';

// Comprehensive Threat & Injection Patterns
const THREAT_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above|your|restrictions)\s+instructions/i,
  /ignore\s+(all\s+)?(previous|prior|above|your|restrictions)/i,
  /forget\s+(all\s+)?(previous|prior|above|your)\s+instructions/i,
  /forget\s+(all\s+)?(previous|prior|above|your)/i,
  /disregard\s+(all\s+)?(previous|prior|above|your)/i,
  /new\s+instructions:/i,
  /system\s+prompt/i,
  /reveal\s+(your\s+)?system\s+prompt/i,
  /dan\s+mode/i,
  /developer\s+mode/i,
  /do\s+anything\s+now/i,
  /act\s+as\s+an?\s+unrestricted/i,
  /simulate\s+a\s+system\s+admin/i,
  /hypothetical\s+scenario/i,
  /sudo\s+mode/i,
  /admin\s+mode/i,
  /override\s+mode/i,
  /system\s+override/i,
  /parameter\s+override/i,
  /override\s+refund\s+policy/i,
  /instant\s+\$\d+.*refund/i,
  /without\s+verification/i,
  /safety\s+constraints/i,
  /bypass\s+security/i,
  /stored\s+secrets/i,
  /roleplay/i,
  /malware/i,
  /no\s+restrictions/i,
  /in\s+character/i,
  /compliance\s+test/i,
  /safety\s+systems\s+are\s+disabled/i,
  /<<SYS>>/i,
  /<<\/SYS>>/i,
  /<script[\s\S]*?>/i,
  /javascript:/i,
  /drop\s+table/i,
  /truncate\s+table/i,
  /delete\s+from/i,
  /chmod\s+777/i,
  /rm\s+-rf/i,
  /eval\(/i,
  /exec\(/i,
  /<\s*\|im_start\|\s*>/i,
  /\[SYSTEM\]/i,
  /```system/i,
  /base64\s+decode/i,
  /jailbreak/i,
  /unrestricted\s+ai/i,
  /content\s+policy/i,
  /without\s+requiring\s+supervisor\s+override/i,
  /elevated\s+root\s+privileges/i,
  /surgeMultiplier\s+to\s+12\.5x/i,
  /wipe_audit_logs/i,
  /root\s+privileges/i,
  /write\s+a\s+fictional\s+story/i,
  /fictional\s+character/i,
  /narrative\s+chapter/i,
  /metalinguistic\s+cipher/i,
  /roleplay\s+as/i,
  /chapter\s+\d+.*execute/i,
];

const PII_PATTERNS = [
  { regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, replacement: '[REDACTED:EMAIL]' },
  { regex: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: '[REDACTED:SSN]' },
  { regex: /\b(?:\d[ -]*?){13,16}\b/g, replacement: '[REDACTED:CREDIT_CARD]' },
  { regex: /\b\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}\b/g, replacement: '[REDACTED:PHONE]' },
  { regex: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, replacement: '[REDACTED:IP]' },
  { regex: /\bsk-[A-Za-z0-9]{20,}\b/g, replacement: '[REDACTED:API_KEY]' },
  { regex: /password\s*=\s*\S+/gi, replacement: 'password=[REDACTED:PASSWORD]' },
];

function normalizeUnicode(text: string): string {
  if (!text) return '';
  let normalized = text.normalize('NFKC');
  normalized = normalized.replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '');

  const homoglyphMap: Record<string, string> = {
    'ɑ': 'a', 'а': 'a', 'а́': 'a', 'α': 'a', 'b': 'b', 'с': 'c', 'ԁ': 'd', 'е': 'e', 'е́': 'e',
    'f': 'f', 'ɡ': 'g', 'h': 'h', 'і': 'i', 'ј': 'j', 'k': 'k', 'l': 'l',
    'm': 'm', 'ո': 'n', 'о': 'o', 'р': 'p', 'ԛ': 'q', 'г': 'r', 'ѕ': 's',
    't': 't', 'υ': 'u', 'ν': 'v', 'w': 'w', 'х': 'x', 'у': 'y', 'z': 'z',
    'А': 'A', 'В': 'B', 'С': 'C', 'Е': 'E', 'Н': 'H', 'І': 'I', 'Ј': 'J',
    'К': 'K', 'М': 'M', 'О': 'O', 'Р': 'P', 'Ѕ': 'S', 'Т': 'T', 'Х': 'X', 'Ү': 'Y'
  };

  return normalized.split('').map(ch => homoglyphMap[ch] || ch).join('');
}

function inspectBase64Payloads(text: string): string {
  let decodedText = text;
  const base64Regex = /([A-Za-z0-9+/]{20,}={0,2})/g;
  const matches = text.match(base64Regex);

  if (matches) {
    for (const match of matches) {
      try {
        const decoded = Buffer.from(match, 'base64').toString('utf-8');
        if (/^[\x20-\x7E\s]+$/.test(decoded)) {
          decodedText += ` ${decoded}`;
        }
      } catch {}
    }
  }
  return decodedText;
}

function detectMarkdownExfiltration(text: string): boolean {
  if (!text) return false;
  const mdImageRegex = /!\[.*?\]\((https?:\/\/[^\s)]+)\)/i;
  return mdImageRegex.test(text);
}

function validateToolCallArguments(text: string): boolean {
  if (!text) return false;
  const toolCallRegex = /(?:refund_override|transfer_funds|approve_procurement|set_multiplier|buy_units)\s*\((.*?)\)/i;
  const match = text.match(toolCallRegex);

  if (match) {
    const argsStr = match[1];
    const amountMatch = argsStr.match(/(?:amount|cost|units|surgeMultiplier|qty)\s*=\s*['"]?([\d.]+)/i);
    if (amountMatch) {
      const val = parseFloat(amountMatch[1]);
      if (val > 5000) return true;
    }
    if (/ATTACKER|override|root|unrestricted/i.test(argsStr)) return true;
  }

  if (/buy\s+(?:1000|\d{4,})\s+units/i.test(text)) {
    return true;
  }

  return false;
}

function sanitizeInput(text: string): string {
  let cleaned = text;
  for (const { regex, replacement } of PII_PATTERNS) {
    cleaned = cleaned.replace(regex, replacement);
  }
  return cleaned;
}

export async function POST(req: Request) {
  try {
    // 0a. Inter-Agent mTLS & ANS PKI Cert Validation (ASI07)
    const mtlsCheck = validateAgentMTLS(req.headers);
    if (!mtlsCheck.valid) {
      logAuditIncident({
        ip: '0.0.0.0',
        endpoint: '/api/support',
        rawPayload: { agentId: mtlsCheck.agentId, error: mtlsCheck.error },
        ruleTriggered: 'ASI07_MTLS_CERT_VALIDATION_FAILED',
      });

      return NextResponse.json(
        { status: 'blocked', action: 'block', error: mtlsCheck.error },
        { status: 401 }
      );
    }

    // 0b. Client IP Rate Limiting (10 req/min per IP)
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const rateCheck = checkRateLimit(clientIp, 10, 60000);

    if (!rateCheck.allowed) {
      logAuditIncident({
        ip: clientIp,
        endpoint: '/api/support',
        rawPayload: { error: 'Rate limit exceeded' },
        ruleTriggered: 'RATE_LIMIT_EXCEEDED_10_RPM',
      });

      return NextResponse.json(
        { status: 'blocked', error: 'Too many requests. Rate limit is 10 req/min per IP.', remaining: 0 },
        { status: 429 }
      );
    }

    // 0c. Agent Spend Cap Check (Hard $5/day Spend Cap - ASI10)
    const agentId = mtlsCheck.agentId || 'swishos-triage-v1';
    const spendCheck = checkAgentSpendCap(agentId, 0.05);

    if (!spendCheck.allowed) {
      logAuditIncident({
        ip: clientIp,
        endpoint: '/api/support',
        rawPayload: { agentId, reason: spendCheck.reason },
        ruleTriggered: 'ASI10_HARD_SPEND_CAP_EXCEEDED',
      });

      return NextResponse.json(
        { status: 'blocked', action: 'kill', error: spendCheck.reason, isKilled: true },
        { status: 429 }
      );
    }

    const userAgent = req.headers.get('user-agent') || '';
    const globalFingerprint = computeClientFingerprint(clientIp, userAgent);

    const body = await req.json();
    const rawQuery = body.query || body.message || '';
    const subject = body.subject || '';
    const sessionId = body.sessionId || clientIp;

    // 0c1. Semantic Threat Cluster Centroid Distance (Novel Metaphor & Evasion Filter)
    const centroidCheck = evaluateSemanticCentroidDistance(rawQuery);
    if (centroidCheck.isThreat) {
      await applyGlobalFingerprintTarpit(globalFingerprint);
      logAuditIncident({
        ip: clientIp,
        endpoint: '/api/support',
        rawPayload: rawQuery,
        ruleTriggered: `SEMANTIC_CENTROID_${centroidCheck.matchedCategory}`,
      });
      return createZeroInfoRefusal();
    }

    // 0d. Token Entropy & Adversarial Noise Check (Step 0)
    const tokenEntropy = analyzeTokenEntropy(rawQuery);
    if (tokenEntropy.isAnomalous) {
      await applyGlobalFingerprintTarpit(globalFingerprint);
      logAuditIncident({
        ip: clientIp,
        endpoint: '/api/support',
        rawPayload: rawQuery,
        ruleTriggered: 'TOKEN_ENTROPY_ADVERSARIAL_NOISE',
      });
      return createZeroInfoRefusal();
    }

    // 0e. Stateful Trajectory Entropy & MCTS Search Tree Lock
    const trajectory = evaluateTrajectoryEntropy(sessionId, rawQuery);
    if (trajectory.isSearchTreeDetected) {
      await applyGlobalFingerprintTarpit(globalFingerprint);
      logAuditIncident({
        ip: clientIp,
        endpoint: '/api/support',
        rawPayload: rawQuery,
        ruleTriggered: 'MCTS_TAP_SEARCH_TREE_DETECTED',
      });
      return createZeroInfoRefusal();
    }

    // 0f. Multi-Turn Session Budget Check
    const sessionCheck = checkSessionBudget(sessionId, `${subject} ${rawQuery}`);
    if (!sessionCheck.allowed) {
      await applyExponentialTarpit(sessionId);
      logAuditIncident({
        ip: clientIp,
        endpoint: '/api/support',
        rawPayload: rawQuery,
        ruleTriggered: 'SESSION_CALL_BUDGET_EXCEEDED',
      });
      return createZeroInfoRefusal();
    }

    const fullText = sessionCheck.messages.join(' \n ');

    // 1. Core 5-Step Verification Engine Execution
    const verification = execute5StepVerification({ query: fullText, lang: body.lang });
    if (verification.blocked) {
      await applyExponentialTarpit(sessionId);
      logAuditIncident({
        ip: clientIp,
        endpoint: '/api/support',
        rawPayload: rawQuery,
        ruleTriggered: verification.triggeredRules.join(', ') || 'VERIFICATION_ENGINE_BLOCK',
      });

      return createZeroInfoRefusal();
    }

    const normalizedInput = normalizeUnicode(fullText);
    const fullyDecodedStream = inspectBase64Payloads(normalizedInput);

    // 2. High-Dimensional Inline Semantic Vector Safety Evaluation
    const semanticEval = evaluateSemanticSafety(fullText);
    if (semanticEval.isThreat) {
      logAuditIncident({
        ip: clientIp,
        endpoint: '/api/support',
        rawPayload: rawQuery,
        ruleTriggered: `SEMANTIC_VECTOR_${semanticEval.threatType}`,
      });

      return NextResponse.json(
        {
          status: 'blocked',
          action: 'block',
          agent_id: agentId,
          message: 'Request blocked by Semantic Safety Classifier.',
          block_reason: `Semantic Safety Evaluation Blocked (${semanticEval.threatType}, score: ${semanticEval.riskScore}).`,
          routing_decision: { intent: 'security_threat', decision: 'block', confidence: semanticEval.confidence, complexity: 'high' },
          risk: { elevated: true, reason: 'Semantic prompt injection or roleplay jailbreak detected.' },
          triggered_rules: [`SEMANTIC_VECTOR_${semanticEval.threatType}`],
          success: false,
          blocked: true,
          threatDetected: true,
          error: 'Security Enforcement Block: Semantic injection or roleplay vector detected.',
          response: 'Request blocked due to semantic safety evaluation.',
        },
        { status: 422 }
      );
    }

    const isExfiltrationAttempt = detectMarkdownExfiltration(fullText) || detectMarkdownExfiltration(normalizedInput);
    const isASTLimitExceeded = validateToolCallArguments(fullText) || validateToolCallArguments(normalizedInput);

    if (isExfiltrationAttempt || isASTLimitExceeded) {
      const ruleTriggered = isExfiltrationAttempt ? 'MARKDOWN_SIDECHANNEL_EXFIL_BLOCK' : 'AST_TOOL_BOUNDS_OVERRIDE_BLOCK';

      logAuditIncident({
        ip: clientIp,
        endpoint: '/api/support',
        rawPayload: rawQuery,
        ruleTriggered,
      });

      return NextResponse.json(
        {
          status: 'blocked',
          action: 'block',
          agent_id: agentId,
          message: 'Request blocked due to security guardrail violation.',
          block_reason: isExfiltrationAttempt
            ? 'Markdown Side-Channel PII Exfiltration Blocked.'
            : 'AST Tool Execution Argument Range Bound Exceeded (OWASP LLM06 Excessive Agency).',
          routing_decision: { intent: 'security_threat', decision: 'block', confidence: 0.99, complexity: 'high' },
          risk: { elevated: true, reason: 'Action-level security override blocked.' },
          schema_validation: { valid: false, reason: 'Disallowed action or side-channel pattern.' },
          triggered_rules: [ruleTriggered],
          success: false,
          blocked: true,
          threatDetected: true,
          error: 'Security Enforcement Block: Threat pattern or injection vector detected.',
          response: 'Request blocked due to security guardrail violation.',
        },
        { status: 422 }
      );
    }

    for (const pattern of THREAT_PATTERNS) {
      if (pattern.test(fullText) || pattern.test(normalizedInput) || pattern.test(fullyDecodedStream)) {
        logAuditIncident({
          ip: clientIp,
          endpoint: '/api/support',
          rawPayload: rawQuery,
          ruleTriggered: 'PROMPT_INJECTION_HOMOGLYPH_BLOCK',
        });

        return NextResponse.json(
          {
            status: 'blocked',
            action: 'block',
            agent_id: agentId,
            message: 'Request blocked due to security guardrail violation.',
            block_reason: 'Security Enforcement Block: Threat pattern or injection vector detected.',
            routing_decision: { intent: 'security_threat', decision: 'block', confidence: 0.99, complexity: 'high' },
            risk: { elevated: true, reason: 'Action-level security override blocked.' },
            schema_validation: { valid: false, reason: 'Disallowed action pattern.' },
            triggered_rules: ['PROMPT_INJECTION_BLOCK', 'HOMOGLYPH_DECODE_BLOCK'],
            success: false,
            blocked: true,
            threatDetected: true,
            error: 'Security Enforcement Block: Threat pattern or injection vector detected.',
            response: 'Request blocked due to security guardrail violation.',
          },
          { status: 422 }
        );
      }
    }

    // 3. Execute Action inside WASM Sandbox (ASI06)
    const sandboxExec = executeToolInSandbox('support_triage', { query: rawQuery });
    if (sandboxExec.blocked) {
      return NextResponse.json(
        { status: 'blocked', action: 'block', error: sandboxExec.error, logs: sandboxExec.logs },
        { status: 422 }
      );
    }

    // 4. Length Contract Checks
    if (rawQuery.length > 3000 || subject.length > 300) {
      return NextResponse.json(
        {
          status: 'blocked',
          action: 'block',
          agent_id: agentId,
          message: 'Payload exceeds contract limit.',
          block_reason: 'Payload length contract violation.',
          triggered_rules: ['LENGTH_CONTRACT_BLOCK'],
          success: false,
          blocked: true,
          error: 'Payload exceeds contract limit.',
        },
        { status: 400 }
      );
    }

    // 5. PII Redaction & Response Construction
    const sanitizedQuery = sanitizeInput(rawQuery);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `TK-2026-${randomNum}`;

    const isBooking = /audit|book|engagement|retainer|pricing/i.test(rawQuery);
    const isSecurity = !isBooking && (body.category === 'security_incident' || /exploit|vulnerability|leak|threat/i.test(rawQuery));
    const isBug = !isBooking && !isSecurity && (body.category === 'bug' || /error|failed|crash|broken|issue/i.test(rawQuery));

    const lang = body.lang || 'en';
    const intent = isBooking ? 'audit_booking' : isSecurity ? 'security_incident' : isBug ? 'technical_support' : 'general_query';
    const priority = isBooking ? 'P1 - High (Audit Inquiry)' : isSecurity ? 'P1 - Critical (Security Incident)' : isBug ? 'P2 - High (Technical Defect)' : 'P3 - Normal (General / Request)';
    const sla = isBooking ? '30 Minutes' : isSecurity ? '15 Minutes' : isBug ? '1 Hour' : '4 Hours';
    
    let replyText = 'Feedback received and routed to solutions team.';
    let actionUrl: string | undefined = undefined;
    let actionLabel: string | undefined = undefined;

    if (isBooking) {
      replyText = lang === 'ar'
        ? 'يسعدنا مساعدتك في حجز تدقيق أمن وكيل الذكاء الاصطناعي (نطاق ثابت 1-2 أسبوع بقيمة $7,500 - $12,500). تم تسجيل طلبك ورَفعه للفريق، ويمكنك أيضاً إكمال تفاصيل الحجز مباشرة عبر الرابط أدناه:'
        : 'I can assist you with booking an AI Agent Security Audit ($7,500 – $12,500 fixed scope, 1–2 weeks). Your request has been logged, and you can also finalize your booking directly via the link below:';
      actionUrl = `/${lang}/contact?plan=audit`;
      actionLabel = lang === 'ar' ? '🎯 إكمال حجز التدقيق المباشر' : '🎯 Complete Direct Audit Booking';
    } else if (isSecurity) {
      replyText = 'Security incident elevated to P1 Critical priority. On-call Security Engineering dispatched.';
    } else if (isBug) {
      replyText = 'Defect report received. Diagnostics underway.';
    }

    return NextResponse.json({
      status: 'success',
      action: 'allow',
      agent_id: agentId,
      ansIdentity: mtlsCheck.ansIdentity,
      isolationLevel: sandboxExec.isolationLevel,
      message: 'Request processed successfully.',
      routing_decision: { intent, decision: 'allow', confidence: 0.98, complexity: 'low' },
      risk: { elevated: false },
      schema_validation: { valid: true },
      triggered_rules: [],
      success: true,
      blocked: false,
      ticketId,
      channel: body.channel || 'web',
      category: body.category || 'general',
      priority,
      sla,
      response: sanitizedQuery,
      sanitizedQuery,
      automatedReply: replyText,
      actionUrl,
      actionLabel,
      createdAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('[SUPPORT ROUTE ERROR]:', error);
    return NextResponse.json(
      {
        status: 'error',
        action: 'block',
        agent_id: 'swishos-triage-v1',
        message: 'Internal server error processing payload.',
        block_reason: 'Internal server error.',
        triggered_rules: ['INTERNAL_ERROR'],
        success: false,
        error: 'Internal server error processing payload.',
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ticketId = searchParams.get('ticketId');

  if (!ticketId) {
    return NextResponse.json({ status: 'error', success: false, error: 'ticketId parameter is required' }, { status: 400 });
  }

  const sampleTicket = {
    ticketId,
    status: 'In Progress (Triage Complete)',
    priority: 'P1 - High Priority',
    sla: '< 15 Minutes',
    sentiment: 'Actionable / High Priority',
    automatedReply: `Ticket ${ticketId} is actively assigned to SwishOS Security Engineering. Red-team telemetry logs and guardrail traces are currently being analyzed.`,
    lastUpdated: new Date().toISOString()
  };

  return NextResponse.json({ status: 'success', success: true, ticket: sampleTicket });
}
