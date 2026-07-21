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
const FORBIDDEN_SHADOW_FILES = ['/etc/passwd', '/etc/shadow', '/proc/self/environ', '.env', '.env.local'];

/**
 * Executes a proposed tool call in an isolated shadow sandbox before state commitment.
 * Validates tool parameters, shadow file access, and side-effects.
 * Defeats out-of-band deception and unapproved tool execution.
 */
export async function probeToolCallInShadowSandbox(
  toolCall: ProposedToolCall
): Promise<ShadowProbeResult> {
  const { name, arguments: args } = toolCall;

  // 1. Parameter Inspection for forbidden files / commands
  const argsString = JSON.stringify(args).toLowerCase();
  for (const forbiddenFile of FORBIDDEN_SHADOW_FILES) {
    if (argsString.includes(forbiddenFile.toLowerCase())) {
      return {
        allowed: false,
        toolName: name,
        probePassed: false,
        reason: `Shadow Probe Violation: Attempted access to restricted file '${forbiddenFile}'.`,
      };
    }
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
