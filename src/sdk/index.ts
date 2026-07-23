/**
 * SwishOS Enterprise Security SDK (@swishos/sdk) v0.6.0
 * Zero-Trust Execution Enclave Middleware & Client Wrapper for AI Agent Pipelines
 */

export * from './wrapper';
export * from './middleware';
export * from './telemetry';

export interface SwishOSSDKConfig {
  apiKey?: string;
  enclaveUrl?: string;
  policy?: 'BLOCK_THROW' | 'SILENT_REDACT' | 'PASSIVE_AUDIT';
  telemetryBatchIntervalMs?: number;
  memorySecret?: string;
}

const DEFAULT_CONFIG: SwishOSSDKConfig = {
  policy: 'BLOCK_THROW',
  telemetryBatchIntervalMs: 5000,
  enclaveUrl: 'https://swishos.dev/api/support',
};

let globalConfig: SwishOSSDKConfig = { ...DEFAULT_CONFIG };

/**
 * Initializes global SwishOS SDK settings
 */
export function initSwishOS(config?: SwishOSSDKConfig): void {
  globalConfig = { ...DEFAULT_CONFIG, ...config };
}

/**
 * Retrieves active SwishOS SDK configuration
 */
export function getSwishOSConfig(): SwishOSSDKConfig {
  return globalConfig;
}
