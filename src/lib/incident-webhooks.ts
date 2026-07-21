/**
 * SwishOS Automated Security Incident Webhook Dispatcher
 * Formats high-severity audit incidents into Slack Block Kit cards and PagerDuty events.
 * Features an in-memory 5-minute deduplication window to prevent alert storms during heavy tarpits.
 */

export interface IncidentAlertPayload {
  ip: string;
  endpoint: string;
  ruleTriggered: string;
  rawPayload?: unknown;
  timestamp?: string;
}

const DEDUPLICATION_CACHE = new Map<string, number>();
const DEDUP_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Asynchronously dispatches a high-severity security incident to configured webhooks.
 * Operates in non-blocking background mode.
 */
export async function dispatchIncidentWebhook(incident: IncidentAlertPayload): Promise<void> {
  const slackUrl = process.env.SLACK_WEBHOOK_URL;
  const pagerDutyUrl = process.env.PAGERDUTY_WEBHOOK_URL;

  if (!slackUrl && !pagerDutyUrl) {
    return; // Webhooks unconfigured
  }

  // Deduplication check
  const dedupKey = `${incident.ip}:${incident.ruleTriggered}`;
  const now = Date.now();
  const lastSent = DEDUPLICATION_CACHE.get(dedupKey);

  if (lastSent && now - lastSent < DEDUP_WINDOW_MS) {
    return; // Suppress duplicate alert within window
  }

  DEDUPLICATION_CACHE.set(dedupKey, now);

  const payloadString = typeof incident.rawPayload === 'string'
    ? incident.rawPayload
    : JSON.stringify(incident.rawPayload || {});

  // 1. Dispatch to Slack Webhook (Block Kit Card)
  if (slackUrl) {
    try {
      const slackBody = {
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '🚨 SwishOS Security Incident Blocked',
              emoji: true,
            },
          },
          {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: `*Rule Triggered:*\n\`${incident.ruleTriggered}\`` },
              { type: 'mrkdwn', text: `*Client IP:*\n\`${incident.ip}\`` },
              { type: 'mrkdwn', text: `*Endpoint:*\n\`${incident.endpoint}\`` },
              { type: 'mrkdwn', text: `*Timestamp:*\n\`${incident.timestamp || new Date().toISOString()}\`` },
            ],
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Payload Snippet:*\n\`\`\`${payloadString.substring(0, 300)}\`\`\``,
            },
          },
        ],
      };

      await fetch(slackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slackBody),
        cache: 'no-store',
      });
    } catch {
      // Ignore background webhook network errors
    }
  }

  // 2. Dispatch to PagerDuty Event V2
  if (pagerDutyUrl) {
    try {
      const pdBody = {
        event_action: 'trigger',
        routing_key: process.env.PAGERDUTY_ROUTING_KEY || '',
        payload: {
          summary: `SwishOS Security Block: ${incident.ruleTriggered} from ${incident.ip}`,
          severity: 'error',
          source: incident.endpoint,
          custom_details: incident,
        },
      };

      await fetch(pagerDutyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pdBody),
        cache: 'no-store',
      });
    } catch {
      // Ignore background webhook network errors
    }
  }
}
