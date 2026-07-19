import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Deterministic Pre-Execution Prompt Injection & Threat Filter
const THREAT_PATTERNS = [
  /ignore\s+previous\s+instructions/i,
  /system\s+prompt\s+reveal/i,
  /dan\s+mode/i,
  /developer\s+mode/i,
  /<script[\s\S]*?>/i,
  /javascript:/i,
  /drop\s+table/i,
  /truncate\s+table/i,
];

function sanitizeAndValidateInput(data: {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  channel?: string;
  category?: string;
}) {
  const { name = '', email = '', subject = '', message = '', channel = 'web', category = 'general' } = data;

  // 1. Structural Length Contracts
  if (name.length > 100 || subject.length > 200 || message.length > 2000) {
    return { valid: false, status: 400, error: 'Input field exceeds maximum allowed character limit.' };
  }

  // 2. Email Contract
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { valid: false, status: 400, error: 'A valid email address is required.' };
  }

  // 3. Message Contract
  if (!message || message.trim().length === 0) {
    return { valid: false, status: 400, error: 'Message body cannot be empty.' };
  }

  // 4. Channel & Category Enum Contracts
  const validChannels = ['web', 'api', 'audit_desk', 'slack', 'email'];
  const validCategories = ['bug', 'feature_request', 'security_incident', 'general'];

  if (!validChannels.includes(channel)) {
    return { valid: false, status: 400, error: `Invalid channel '${channel}'.` };
  }

  if (!validCategories.includes(category)) {
    return { valid: false, status: 400, error: `Invalid category '${category}'.` };
  }

  // 5. Shift Validation Left: Inline Threat & Prompt Injection Filtering
  const fullContent = `${subject} ${message}`;
  for (const pattern of THREAT_PATTERNS) {
    if (pattern.test(fullContent)) {
      return {
        valid: false,
        status: 422,
        error: 'Security Enforcement Block: Malicious prompt injection or disallowed script pattern detected.',
        threatDetected: true,
      };
    }
  }

  return { valid: true };
}

function determineTriage(category: string, message: string) {
  const isSecurity = category === 'security_incident' || /exploit|vulnerability|bypass|leak|jailbreak|threat/i.test(message);
  const isBug = category === 'bug' || /error|failed|crash|broken|issue/i.test(message);

  if (isSecurity) {
    return {
      priority: 'P1 - Critical (Security Incident)',
      sla: '15 Minutes',
      sentiment: 'Urgent / Security Risk',
      reply: 'Your security incident report has been elevated to P1 Critical priority. Our AI Security Engineering Lead and On-Call Security Architect have been dispatched immediately. Track updates via your Ticket ID.'
    };
  }

  if (isBug) {
    return {
      priority: 'P2 - High (Technical Defect)',
      sla: '1 Hour',
      sentiment: 'Frustrated / Defect Report',
      reply: 'Thank you for reporting this technical defect. Our engineering team has received your logs and steps to reproduce. Diagnostic triage is underway.'
    };
  }

  return {
    priority: 'P3 - Normal (General / Request)',
    sla: '4 Hours',
    sentiment: 'Inquisitive / Positive',
    reply: 'Thank you for reaching out! Your feedback has been received and routed to our solutions team. We will review your request shortly.'
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Enforce Pre-Execution Schema Validation & Shift Validation Left
    const validation = sanitizeAndValidateInput(body);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
          threatDetected: validation.threatDetected || false,
        },
        { status: validation.status }
      );
    }

    const { name, email, channel, category, subject, message } = body;
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `TK-2026-${randomNum}`;
    const triage = determineTriage(category || 'general', message);

    console.log('[SUPPORT ROUTE] Pre-Validated Ticket Created:', {
      ticketId,
      name,
      email,
      channel: channel || 'web',
      category: category || 'general',
      subject: subject || 'N/A',
      triage
    });

    return NextResponse.json({
      success: true,
      ticketId,
      channel: channel || 'web',
      category: category || 'general',
      priority: triage.priority,
      sla: triage.sla,
      sentiment: triage.sentiment,
      automatedReply: triage.reply,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('[SUPPORT ROUTE ERROR]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing feedback ticket.' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ticketId = searchParams.get('ticketId');

  if (!ticketId) {
    return NextResponse.json({ success: false, error: 'ticketId parameter is required' }, { status: 400 });
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

  return NextResponse.json({ success: true, ticket: sampleTicket });
}
