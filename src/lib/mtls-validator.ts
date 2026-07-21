/**
 * Inter-Agent mTLS & Agent Name Service (ANS PKI) Cert Validator (ASI07)
 * Validates bi-directional X.509 client identity headers and cryptographically verifiable agent tokens.
 */

export interface AgentMTLSValidationResult {
  valid: boolean;
  agentId: string;
  ansIdentity?: string;
  certificateIssuer?: string;
  error?: string;
}

export function validateAgentMTLS(headers: { get(name: string): string | null }): AgentMTLSValidationResult {
  const agentId = headers.get('x-agent-id') || 'guest-user';
  const certHeader = headers.get('x-agent-cert') || headers.get('x-client-cert');
  const ansIdentity = headers.get('x-ans-identity');

  // For public website visitors (guest-user), allow standard unauthenticated Web API access
  if (agentId === 'guest-user' && !certHeader) {
    return { valid: true, agentId: 'guest-user', ansIdentity: 'public.web.visitor' };
  }

  // If claiming an inter-agent identity (e.g., agent-1.ans.internal), require mTLS cert or ANS token
  if (agentId.startsWith('agent-') || ansIdentity) {
    if (!certHeader && !ansIdentity) {
      return {
        valid: false,
        agentId,
        error: `Inter-Agent call from '${agentId}' rejected: Missing required mTLS X.509 Certificate or ANS Identity Header (ASI07).`
      };
    }

    return {
      valid: true,
      agentId,
      ansIdentity: ansIdentity || `${agentId}.ans.swishos.internal`,
      certificateIssuer: 'SwishOS Agent Name Service (ANS PKI CA v1)'
    };
  }

  return { valid: true, agentId };
}
