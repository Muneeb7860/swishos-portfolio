import { executeToolInSandbox } from './wasm-sandbox';

export interface ProposedToolCall {
  name: string;
  arguments: Record<string, unknown>;
}

export interface ShadowProbeResult {
  allowed: boolean;
  toolName: string;
  probePassed: boolean;
  reason?: string;
}

const FORBIDDEN_SHADOW_SYSCALLS = ['execve', 'unlink', 'chmod', 'chown', 'connect_raw_socket'];

/**
 * Executes a proposed tool call in an isolated shadow sandbox before state commitment.
 * Validates tool parameters, shadow file access, and side-effects.
 * Defeats out-of-band deception and unapproved tool execution.
 */
export async function probeToolCallInShadowSandbox(
  toolCall: ProposedToolCall
): Promise<ShadowProbeResult> {
  const name = toolCall.name || 'unknown_tool';
  const args = toolCall.arguments || (toolCall as unknown as Record<string, unknown>).args || {};

const RESTRICTED_PATH_REGEX = /\.env(?:\.[a-z0-9_-]+)?|\.git\/|id_rsa|\/etc\/(?:passwd|shadow|master\.passwd)|proc\/self\/environ/i;

  // 1. Parameter Inspection for forbidden files / commands
  const argsString = JSON.stringify(args || {}).toLowerCase();
  
  if (RESTRICTED_PATH_REGEX.test(argsString) || argsString.includes('..%2f') || argsString.includes('../')) {
    return {
      allowed: false,
      toolName: name,
      probePassed: false,
      reason: `Shadow Probe Violation: Attempted access to restricted path or environment configuration.`,
    };
  }

  for (const syscall of FORBIDDEN_SHADOW_SYSCALLS) {
    if (argsString.includes(syscall)) {
      return {
        allowed: false,
        toolName: name,
        probePassed: false,
        reason: `Shadow Probe Violation: Attempted forbidden syscall '${syscall}'.`,
      };
    }
  }

  // 2. Execute tool call inside isolated WASM/gVisor sandbox
  try {
    const sandboxResult = await executeToolInSandbox(name, args);
    if (!sandboxResult.success || sandboxResult.blocked) {
      return {
        allowed: false,
        toolName: name,
        probePassed: false,
        reason: `Shadow Probe Violation: Sandbox engine blocked execution (${sandboxResult.error}).`,
      };
    }
  } catch (err) {
    return {
      allowed: false,
      toolName: name,
      probePassed: false,
      reason: `Shadow Probe Exception: ${(err as Error).message}`,
    };
  }

  return {
    allowed: true,
    toolName: name,
    probePassed: true,
  };
}
