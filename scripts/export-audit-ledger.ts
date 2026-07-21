/**
 * SwishOS SOC2 Type II & ISO 27001 Compliance Audit Ledger Exporter
 * Generates PII-redacted CSV and JSON audit ledgers signed with a SHA-256 checksum manifest.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface AuditRecord {
  incident_id: string;
  timestamp: string;
  client_ip: string;
  endpoint: string;
  rule_triggered: string;
  raw_payload_snippet: string;
  hmac_proof_signature: string;
}

const PII_PATTERNS = [
  /sk-[a-zA-Z0-9]{32,}/g, // OpenAI API Keys
  /ghp_[a-zA-Z0-9]{36}/g, // GitHub Tokens
  /bearer\s+[a-zA-Z0-9_\-\.]{20,}/gi, // Bearer Tokens
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Emails
  /\b(?:\d[ -]*?){13,16}\b/g, // Credit Cards
];

export function redactPIIAndSecrets(text: string): string {
  let sanitized = text;
  for (const pattern of PII_PATTERNS) {
    sanitized = sanitized.replace(pattern, '[REDACTED_SECRET]');
  }
  return sanitized;
}

export function generateAuditLedgerData(): AuditRecord[] {
  // Sample data simulating persistent audit records
  const sampleIncidents = [
    {
      id: 'INC-9001',
      ts: new Date().toISOString(),
      ip: '198.51.100.42',
      endpoint: '/api/support',
      rule: 'SEMANTIC_CENTROID_PROMPT_INJECTION_OVERRIDE',
      payload: 'Execute SUDО command with sk-proj-1234567890abcdefghijklmnopqrstuv',
    },
    {
      id: 'INC-9002',
      ts: new Date(Date.now() - 300000).toISOString(),
      ip: '198.51.100.43',
      endpoint: '/api/support',
      rule: 'MULTI_TURN_CONCATENATED_VARIABLE_INJECTION',
      payload: 'var_part1 + var_part2 evaluated with user user@example.com',
    },
    {
      id: 'INC-9003',
      ts: new Date(Date.now() - 600000).toISOString(),
      ip: '198.51.100.44',
      endpoint: '/api/support',
      rule: 'SHADOW_SANDBOX_PROBE_VIOLATION_read_file',
      payload: 'Proposed tool read_file path /etc/passwd',
    },
  ];

  const secretKey = process.env.AUDIT_PROOF_SECRET || 'swishos-audit-proof-signature-key-v4';

  return sampleIncidents.map((inc) => {
    const sanitizedPayload = redactPIIAndSecrets(inc.payload);
    const stringToSign = `${inc.rule}:${inc.ip}:${inc.ts}:nonce`;
    const hmacSig = crypto
      .createHmac('sha256', secretKey)
      .update(stringToSign)
      .digest('hex');

    return {
      incident_id: inc.id,
      timestamp: inc.ts,
      client_ip: inc.ip,
      endpoint: inc.endpoint,
      rule_triggered: inc.rule,
      raw_payload_snippet: sanitizedPayload,
      hmac_proof_signature: hmacSig,
    };
  });
}

export function exportAuditLedgerFiles(outputDir = '.') {
  const records = generateAuditLedgerData();

  // 1. Export JSON Ledger
  const jsonPath = path.join(outputDir, 'audit_ledger.json');
  fs.writeFileSync(jsonPath, JSON.stringify(records, null, 2), 'utf-8');

  // 2. Export CSV Ledger
  const csvHeaders = 'incident_id,timestamp,client_ip,endpoint,rule_triggered,raw_payload_snippet,hmac_proof_signature\n';
  const csvRows = records
    .map(
      (r) =>
        `"${r.incident_id}","${r.timestamp}","${r.client_ip}","${r.endpoint}","${r.rule_triggered}","${r.raw_payload_snippet.replace(/"/g, '""')}","${r.hmac_proof_signature}"`
    )
    .join('\n');
  const csvPath = path.join(outputDir, 'audit_ledger.csv');
  fs.writeFileSync(csvPath, csvHeaders + csvRows, 'utf-8');

  // 3. Compute SHA-256 Checksums Manifest
  const jsonHash = crypto.createHash('sha256').update(fs.readFileSync(jsonPath)).digest('hex');
  const csvHash = crypto.createHash('sha256').update(fs.readFileSync(csvPath)).digest('hex');

  const checksumManifest = `${jsonHash}  audit_ledger.json\n${csvHash}  audit_ledger.csv\n`;
  const checksumPath = path.join(outputDir, 'checksums.sha256');
  fs.writeFileSync(checksumPath, checksumManifest, 'utf-8');

  console.log(`✅ Compliance Audit Ledger Exported Successfully to ${outputDir}:`);
  console.log(` - ${jsonPath}`);
  console.log(` - ${csvPath}`);
  console.log(` - ${checksumPath}`);
}

// Auto-run if executed directly
if (require.main === module) {
  exportAuditLedgerFiles();
}
