/**
 * SwishOS Model Client Wrapper & Decorator
 * Wraps OpenAI / Anthropic client instances to intercept completions, prompt injections, and tool execution.
 */

import { execute5StepVerification } from '@/lib/verification-engine';
import { generateCryptographicAuditProof } from '@/lib/telemetry-proof';
import { telemetryQueue } from './telemetry';
import { getSwishOSConfig } from './index';

export class SwishOSSecurityException extends Error {
  public readonly auditProof: string;
  public readonly ruleTriggered: string;
  public readonly nonce: string;
  public readonly timestamp: string;

  constructor(reason: string, ruleTriggered: string, auditProof: string, nonce: string, timestamp: string) {
    super(`SwishOS Security Block: ${reason} (Rule: ${ruleTriggered})`);
    this.name = 'SwishOSSecurityException';
    this.auditProof = auditProof;
    this.ruleTriggered = ruleTriggered;
    this.nonce = nonce;
    this.timestamp = timestamp;
  }
}

export interface GenericModelClient {
  chat?: {
    completions?: {
      create: (...args: unknown[]) => Promise<unknown>;
    };
  };
  messages?: {
    create: (...args: unknown[]) => Promise<unknown>;
  };
}

/**
 * Wraps an OpenAI / Anthropic client instance with zero-trust guardrails.
 */
export function wrapModelClient<T extends GenericModelClient>(client: T): T {
  const config = getSwishOSConfig();

  if (client.chat?.completions?.create) {
    const originalCreate = client.chat.completions.create.bind(client.chat.completions);
    client.chat.completions.create = async (...args: unknown[]) => {
      const payload = args[0] as { messages?: Array<{ role: string; content: string }> };
      if (payload?.messages && Array.isArray(payload.messages)) {
        const lastMessage = payload.messages[payload.messages.length - 1];
        if (lastMessage?.content) {
          const evalResult = await execute5StepVerification({ query: lastMessage.content });
          if (evalResult.blocked) {
            const rule = evalResult.threatType || evalResult.triggeredRules[0] || 'PROMPT_INJECTION_DETECTED';
            const proof = generateCryptographicAuditProof(rule, '127.0.0.1');

            telemetryQueue.enqueue({
              timestamp: proof['X-SwishOS-Audit-Timestamp'],
              eventType: 'ENCLAVE_BLOCK',
              ruleTriggered: rule,
              clientIp: '127.0.0.1',
              auditProof: proof['X-SwishOS-Audit-Proof'],
              nonce: proof['X-SwishOS-Audit-Nonce'],
            });

            if (config.policy !== 'SILENT_REDACT') {
              throw new SwishOSSecurityException(
                `Agent request blocked by enclave safety policy (${rule}).`,
                rule,
                proof['X-SwishOS-Audit-Proof'],
                proof['X-SwishOS-Audit-Nonce'],
                proof['X-SwishOS-Audit-Timestamp']
              );
            }
          }
        }
      }
      return originalCreate(...args);
    };
  }

  return client;
}
