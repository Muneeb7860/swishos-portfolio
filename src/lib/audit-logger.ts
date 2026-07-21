/**
 * Persistent Forensic Audit Incident Logger
 * Captures structured incident telemetry for SOC/SIEM compliance.
 */

export interface AuditIncident {
  timestamp: string;
  incidentId: string;
  ip: string;
  channel: string;
  category: string;
  threatCategory: string;
  triggeredRules: string[];
  rawPayload: string;
  normalizedPayload: string;
  action: 'block' | 'allow' | 'elevate';
  blockReason: string;
}

const auditLogMemoryStore: AuditIncident[] = [];

export function logAuditIncident(incident: Omit<AuditIncident, 'timestamp' | 'incidentId'>): AuditIncident {
  const fullIncident: AuditIncident = {
    ...incident,
    timestamp: new Date().toISOString(),
    incidentId: `INC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
  };

  // 1. In-memory append (capped at 500 records)
  auditLogMemoryStore.unshift(fullIncident);
  if (auditLogMemoryStore.length > 500) {
    auditLogMemoryStore.pop();
  }

  // 2. Structured console JSON logging for Vercel / Datadog ingestion
  console.error('[SECURITY INCIDENT AUDIT LOG]', JSON.stringify(fullIncident));

  return fullIncident;
}

export function getAuditIncidents(limit: number = 50): AuditIncident[] {
  return auditLogMemoryStore.slice(0, limit);
}
