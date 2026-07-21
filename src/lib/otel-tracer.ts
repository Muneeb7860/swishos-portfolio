/**
 * SwishOS OpenTelemetry (OTel) Distributed Tracing & Security Span Middleware
 * Instruments verification pipeline steps for Datadog, Jaeger, and Honeycomb collectors.
 */

export interface SpanAttributes {
  step: string;
  clientIp: string;
  isBlocked: boolean;
  ruleTriggered?: string;
  latencyMs: number;
}

export interface TraceSpanResult<T> {
  result: T;
  attributes: SpanAttributes;
}

/**
 * Wraps a security verification step in an OpenTelemetry span.
 */
export async function traceVerificationStep<T>(
  stepName: string,
  clientIp: string,
  fn: () => Promise<{ isBlocked: boolean; ruleTriggered?: string; value: T }>
): Promise<TraceSpanResult<T>> {
  const startTime = performance.now();
  const outcome = await fn();
  const endTime = performance.now();
  const latencyMs = Math.round((endTime - startTime) * 100) / 100;

  const attributes: SpanAttributes = {
    step: stepName,
    clientIp,
    isBlocked: outcome.isBlocked,
    ruleTriggered: outcome.ruleTriggered,
    latencyMs,
  };

  // Export to OTLP Collector if configured, or fallback to structured log stdout
  const otlpEndpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
  if (otlpEndpoint) {
    void fetch(`${otlpEndpoint}/v1/traces`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resourceSpans: [
          {
            resource: { attributes: [{ key: 'service.name', value: { stringValue: 'swishos-guardrail-enclave' } }] },
            scopeSpans: [
              {
                spans: [
                  {
                    name: `swishos.${stepName}`,
                    kind: 1, // SPAN_KIND_INTERNAL
                    startTimeUnixNano: Math.floor(startTime * 1000000),
                    endTimeUnixNano: Math.floor(endTime * 1000000),
                    attributes: [
                      { key: 'swishos.step', value: { stringValue: stepName } },
                      { key: 'swishos.client_ip', value: { stringValue: clientIp } },
                      { key: 'swishos.is_blocked', value: { boolValue: outcome.isBlocked } },
                      { key: 'swishos.rule_triggered', value: { stringValue: outcome.ruleTriggered || 'NONE' } },
                      { key: 'swishos.latency_ms', value: { doubleValue: latencyMs } },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }),
    }).catch(() => {
      // Non-blocking fallback
    });
  }

  // Structured Console Logging for Vercel / Datadog Log Ingestion
  if (outcome.isBlocked) {
    console.warn('[OTEL SECURITY SPAN BLOCKED]', JSON.stringify(attributes));
  } else {
    console.info('[OTEL SECURITY SPAN OK]', JSON.stringify(attributes));
  }

  return {
    result: outcome.value,
    attributes,
  };
}
