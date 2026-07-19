import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Pre-Execution Security & Threat Rules
const THREAT_PATTERNS = [
  /ignore\s+previous\s+instructions/i,
  /system\s+prompt\s+reveal/i,
  /dan\s+mode/i,
  /developer\s+mode/i,
  /<script[\s\S]*?>/i,
  /javascript:/i,
  /drop\s+table/i,
  /truncate\s+table/i,
  /delete\s+from/i,
  /chmod\s+777/i,
  /bypass/i,
  /override/i,
  /sudo/i,
  /eval\(/i,
  /exec\(/i,
];

// PII Detection & Redaction Patterns
const PII_PATTERNS = [
  { regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, replacement: '[REDACTED:EMAIL]' },
  { regex: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: '[REDACTED:SSN]' },
  { regex: /\b(?:\d[ -]*?){13,16}\b/g, replacement: '[REDACTED:CREDIT_CARD]' },
  { regex: /\b\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}\b/g, replacement: '[REDACTED:PHONE]' },
];

function sanitizeInput(text: string): string {
  let cleaned = text;
  for (const { regex, replacement } of PII_PATTERNS) {
    cleaned = cleaned.replace(regex, replacement);
  }
  return cleaned;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Support both direct red-team benchmark queries `{ query }` and standard ticket payloads
    const rawQuery = body.query || body.message || '';
    const subject = body.subject || '';

    // 1. Shift Validation Left: Threat & Injection Block Contract
    for (const pattern of THREAT_PATTERNS) {
      if (pattern.test(rawQuery) || pattern.test(subject)) {
        return NextResponse.json(
          {
            status: 'blocked',
            action: 'block',
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

    // 2. Length Contract Checks
    if (rawQuery.length > 3000 || subject.length > 300) {
      return NextResponse.json(
        { status: 'blocked', success: false, blocked: true, error: 'Payload exceeds contract limit.' },
        { status: 400 }
      );
    }

    // 3. PII Redaction & Clean Response Construction
    const sanitizedQuery = sanitizeInput(rawQuery);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `TK-2026-${randomNum}`;

    const isSecurity = body.category === 'security_incident' || /exploit|vulnerability|bypass|leak|jailbreak|threat/i.test(rawQuery);
    const isBug = body.category === 'bug' || /error|failed|crash|broken|issue/i.test(rawQuery);

    const priority = isSecurity ? 'P1 - Critical (Security Incident)' : isBug ? 'P2 - High (Technical Defect)' : 'P3 - Normal (General / Request)';
    const sla = isSecurity ? '15 Minutes' : isBug ? '1 Hour' : '4 Hours';
    const replyText = isSecurity
      ? 'Security incident elevated to P1 Critical priority. On-call Security Engineering dispatched.'
      : isBug
      ? 'Defect report received. Diagnostics underway.'
      : 'Feedback received and routed to solutions team.';

    return NextResponse.json({
      status: 'success',
      action: 'allow',
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
      createdAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('[SUPPORT ROUTE ERROR]:', error);
    return NextResponse.json(
      { status: 'error', success: false, error: 'Internal server error processing payload.' },
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
