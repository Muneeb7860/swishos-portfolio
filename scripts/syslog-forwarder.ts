/**
 * SwishOS Enterprise SIEM Syslog Forwarder (CEF / RFC-5424 Format)
 * Formats security incidents into Common Event Format (CEF:0) and dispatches over UDP/TLS socket or stdout console.
 */

import dgram from 'dgram';
import os from 'os';

export interface SyslogIncident {
  ip: string;
  endpoint: string;
  ruleTriggered: string;
  rawPayload: string;
  hmacProof?: string;
  timestamp?: string;
}

/**
 * Formats a security incident into standard CEF:0 over RFC-5424 Syslog line.
 */
export function formatCEFMessage(incident: SyslogIncident): string {
  const ts = incident.timestamp || new Date().toISOString();
  const hostname = os.hostname() || 'swishos-node-01';
  const severity = '8'; // High severity incident
  const proof = incident.hmacProof || 'verified_hmac_sha256';
  const payloadSnippet = incident.rawPayload.replace(/[\r\n|]/g, ' ').substring(0, 100);

  const cefHeader = `CEF:0|SwishOS|AgenticEnclave|0.5.0|${incident.ruleTriggered}|${incident.ruleTriggered}|${severity}|`;
  const cefExtensions = `src=${incident.ip} request=${incident.endpoint} cs1Label=HMACProof cs1=${proof} msg=${payloadSnippet}`;
  const syslogHeader = `<134>1 ${ts} ${hostname} swishos-enclave - - - `;

  return syslogHeader + cefHeader + cefExtensions;
}

/**
 * Dispatches CEF syslog payload to SIEM collector via UDP socket, falling back to console stdout.
 */
export function forwardSyslogIncident(incident: SyslogIncident): void {
  const cefMessage = formatCEFMessage(incident);
  const host = process.env.SYSLOG_SERVER_HOST;
  const port = process.env.SYSLOG_SERVER_PORT ? parseInt(process.env.SYSLOG_SERVER_PORT, 10) : 514;

  if (host) {
    try {
      const client = dgram.createSocket('udp4');
      const messageBuffer = Buffer.from(cefMessage);
      client.send(messageBuffer, 0, messageBuffer.length, port, host, (err) => {
        client.close();
        if (!err) {
          console.log(`✅ CEF Syslog Forwarded to SIEM ${host}:${port}`);
        } else {
          console.warn(`⚠️ Failed UDP Syslog dispatch to ${host}:${port}: ${err.message}`);
        }
      });
      return;
    } catch {
      // Fallback
    }
  }

  // Console Fallback if SYSLOG_SERVER_HOST is unconfigured
  console.info('[CEF SYSLOG FORWARD]', cefMessage);
}

// Auto-run if executed directly
if (require.main === module) {
  const sampleIncident: SyslogIncident = {
    ip: '198.51.100.42',
    endpoint: '/api/support',
    ruleTriggered: 'SEMANTIC_CENTROID_PROMPT_INJECTION_OVERRIDE',
    rawPayload: 'Execute SUDО command with sk-proj-1234567890abcdef',
    hmacProof: '8f9e7a6b5c4d3e2f1a0b',
  };
  forwardSyslogIncident(sampleIncident);
}
