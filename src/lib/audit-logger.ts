/**
 * Persistent Forensic Audit Incident Logger (Supabase & SIEM Compatible)
 * Captures structured incident telemetry into the `security_incidents` table schema.
 */

export interface SecurityIncidentRow {
  id?: number;
  ip: string;
  endpoint: string;
  payload: Record<string, unknown>;
  rule_triggered: string;
  timestamp?: string;
}

const incidentMemoryStore: SecurityIncidentRow[] = [];

export function logAuditIncident(incident: {
  ip: string;
  endpoint?: string;
  rawPayload: string | Record<string, unknown>;
  ruleTriggered: string;
}): SecurityIncidentRow {
  const endpoint = incident.endpoint || '/api/support';
  const payloadData = typeof incident.rawPayload === 'string'
    ? { query: incident.rawPayload }
    : incident.rawPayload;

  const row: SecurityIncidentRow = {
    ip: incident.ip,
    endpoint,
    payload: payloadData,
    rule_triggered: incident.ruleTriggered,
    timestamp: new Date().toISOString(),
  };

  // 1. Append to memory cache (capped at 500 records)
  incidentMemoryStore.unshift(row);
  if (incidentMemoryStore.length > 500) {
    incidentMemoryStore.pop();
  }

  // 2. Format Supabase SQL Insert statement for DB logs
  const sqlStatement = `INSERT INTO security_incidents (ip, endpoint, payload, rule_triggered) VALUES ('${row.ip}', '${row.endpoint}', '${JSON.stringify(row.payload).replace(/'/g, "''")}', '${row.rule_triggered}');`;

  // 3. Structured console output for Vercel Logs / Datadog / Supabase webhooks
  console.error('[SECURITY INCIDENT AUDIT LOG]', JSON.stringify({ ...row, sql: sqlStatement }));

  return row;
}

export function getAuditIncidents(limit: number = 50): SecurityIncidentRow[] {
  return incidentMemoryStore.slice(0, limit);
}
