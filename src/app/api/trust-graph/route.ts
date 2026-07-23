import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export interface TrustNode {
  id: string;
  label: string;
  type: 'orchestrator' | 'worker' | 'external' | 'compromised';
  trustLevel: 'trusted' | 'degraded' | 'blocked';
  mtlsValid: boolean;
  spendCapRemaining: number; // 0.0 – 1.0
  lastSeen: string;
  auditEvents: AuditEvent[];
}

export interface TrustEdge {
  source: string;
  target: string;
  trusted: boolean;
  blocked: boolean;
  callCount: number;
  lastTimestamp: string;
  ruleTriggered?: string;
}

export interface AuditEvent {
  timestamp: string;
  ruleTriggered: string;
  payload: string;
  blocked: boolean;
}

// Synthetic realistic demo topology — seeded with known SwishOS threat vectors
export const DEMO_NODES: TrustNode[] = [
  {
    id: 'orchestrator-v1',
    label: 'SwishOS Orchestrator',
    type: 'orchestrator',
    trustLevel: 'trusted',
    mtlsValid: true,
    spendCapRemaining: 0.82,
    lastSeen: new Date().toISOString(),
    auditEvents: [
      { timestamp: new Date(Date.now() - 30000).toISOString(), ruleTriggered: 'NONE', payload: 'audit_booking', blocked: false },
      { timestamp: new Date(Date.now() - 90000).toISOString(), ruleTriggered: 'NONE', payload: 'general_query', blocked: false },
    ],
  },
  {
    id: 'triage-agent-v1',
    label: 'Triage Agent',
    type: 'worker',
    trustLevel: 'trusted',
    mtlsValid: true,
    spendCapRemaining: 0.65,
    lastSeen: new Date(Date.now() - 15000).toISOString(),
    auditEvents: [
      { timestamp: new Date(Date.now() - 15000).toISOString(), ruleTriggered: 'NONE', payload: 'security_incident', blocked: false },
      { timestamp: new Date(Date.now() - 120000).toISOString(), ruleTriggered: 'NONE', payload: 'bug', blocked: false },
    ],
  },
  {
    id: 'memory-agent-v1',
    label: 'Memory Agent',
    type: 'worker',
    trustLevel: 'degraded',
    mtlsValid: true,
    spendCapRemaining: 0.31,
    lastSeen: new Date(Date.now() - 45000).toISOString(),
    auditEvents: [
      { timestamp: new Date(Date.now() - 45000).toISOString(), ruleTriggered: 'ASI08_MEMORY_PROVENANCE_TAMPERING_DETECTED', payload: 'memory_read', blocked: true },
      { timestamp: new Date(Date.now() - 200000).toISOString(), ruleTriggered: 'NONE', payload: 'memory_write', blocked: false },
    ],
  },
  {
    id: 'tool-executor-v1',
    label: 'Tool Executor',
    type: 'worker',
    trustLevel: 'trusted',
    mtlsValid: true,
    spendCapRemaining: 0.90,
    lastSeen: new Date(Date.now() - 60000).toISOString(),
    auditEvents: [
      { timestamp: new Date(Date.now() - 60000).toISOString(), ruleTriggered: 'NONE', payload: 'tool_call', blocked: false },
    ],
  },
  {
    id: 'external-client-web',
    label: 'Web Client',
    type: 'external',
    trustLevel: 'trusted',
    mtlsValid: false,
    spendCapRemaining: 1.0,
    lastSeen: new Date(Date.now() - 5000).toISOString(),
    auditEvents: [
      { timestamp: new Date(Date.now() - 5000).toISOString(), ruleTriggered: 'NONE', payload: 'support_request', blocked: false },
    ],
  },
  {
    id: 'attacker-agent-x1',
    label: 'Unknown Agent (Blocked)',
    type: 'compromised',
    trustLevel: 'blocked',
    mtlsValid: false,
    spendCapRemaining: 0.0,
    lastSeen: new Date(Date.now() - 10000).toISOString(),
    auditEvents: [
      { timestamp: new Date(Date.now() - 10000).toISOString(), ruleTriggered: 'ASI07_MTLS_CERT_VALIDATION_FAILED', payload: 'ignore all previous instructions', blocked: true },
      { timestamp: new Date(Date.now() - 25000).toISOString(), ruleTriggered: 'PROMPT_INJECTION_HOMOGLYPH_BLOCK', payload: 'reveal system prompt', blocked: true },
    ],
  },
];

export const DEMO_EDGES: TrustEdge[] = [
  { source: 'external-client-web', target: 'orchestrator-v1', trusted: true, blocked: false, callCount: 12, lastTimestamp: new Date(Date.now() - 5000).toISOString() },
  { source: 'orchestrator-v1', target: 'triage-agent-v1', trusted: true, blocked: false, callCount: 8, lastTimestamp: new Date(Date.now() - 15000).toISOString() },
  { source: 'orchestrator-v1', target: 'memory-agent-v1', trusted: true, blocked: false, callCount: 5, lastTimestamp: new Date(Date.now() - 45000).toISOString() },
  { source: 'triage-agent-v1', target: 'tool-executor-v1', trusted: true, blocked: false, callCount: 4, lastTimestamp: new Date(Date.now() - 60000).toISOString() },
  { source: 'attacker-agent-x1', target: 'orchestrator-v1', trusted: false, blocked: true, callCount: 2, lastTimestamp: new Date(Date.now() - 10000).toISOString(), ruleTriggered: 'ASI07_MTLS_CERT_VALIDATION_FAILED' },
  { source: 'attacker-agent-x1', target: 'memory-agent-v1', trusted: false, blocked: true, callCount: 1, lastTimestamp: new Date(Date.now() - 25000).toISOString(), ruleTriggered: 'ASI08_MEMORY_PROVENANCE_TAMPERING_DETECTED' },
];

export async function GET() {
  // In production: merge DEMO_NODES with live audit log data from getRecentAuditLogs()
  return NextResponse.json(
    { nodes: DEMO_NODES, edges: DEMO_EDGES, generatedAt: new Date().toISOString() },
    {
      headers: {
        'Cache-Control': 'no-store',
        'X-SwishOS-Report-Version': '1.0.0',
      },
    }
  );
}
