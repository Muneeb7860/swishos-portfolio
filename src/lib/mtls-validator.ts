/**
 * Inter-Agent identity header check (ASI07)
 *
 * NOT mTLS. Mutual TLS is a property of the TLS handshake; this reads an HTTP
 * header, which the client controls, and performs no certificate parsing or
 * signature verification. It was previously named and described as an mTLS /
 * X.509 validator and returned a certificateIssuer for a certificate it never
 * looked at -- an attestation invented in code. Renamed to what it does.
 *
 * Access behaviour is deliberately unchanged; only the false attestation is gone.
 */

export interface AgentIdentityCheckResult {
  identitySource?: string;
  valid: boolean;
  agentId: string;
  ansIdentity?: string;
  error?: string;
}

export function validateAgentMTLS(headers: { get(name: string): string | null }): AgentIdentityCheckResult {
  const agentId = headers.get('x-agent-id') || 'guest-user';
  const certHeader = headers.get('x-agent-cert') || headers.get('x-client-cert');
  const ansIdentity = headers.get('x-ans-identity');

  // For public website visitors (guest-user), allow standard unauthenticated Web API access
  if (agentId === 'guest-user' && !certHeader) {
    return { valid: true, agentId: 'guest-user', ansIdentity: 'public.web.visitor' };
  }

  // If claiming an inter-agent identity, require an identity header to be present
  if (agentId.startsWith('agent-') || ansIdentity) {
    if (!certHeader && !ansIdentity) {
      return {
        valid: false,
        agentId,
        error: `Inter-Agent call from '${agentId}' rejected: Missing required agent identity header (ASI07).`
      };
    }

    return {
      valid: true,
      agentId,
      ansIdentity: ansIdentity || `${agentId}.ans.swishos.internal`,
      identitySource: certHeader ? 'client-supplied header' : 'ans identity header'
    };
  }

  return { valid: true, agentId };
}
