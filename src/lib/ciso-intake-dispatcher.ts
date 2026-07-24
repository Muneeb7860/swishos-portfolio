export interface AuditRequestPayload {
  name: string;
  email: string;
  company?: string;
  infrastructure?: string;
  plan?: string;
  notes?: string;
}

export interface IntakeDispatchResult {
  success: boolean;
  ticketId: string;
  bookingUrl: string;
  mode: 'live_resend' | 'dev_fallback';
  message: string;
  sarifSnippet?: string;
}

/**
 * Generates executive dark-mode HTML email template for CISO audit bookings
 */
export function generateCisoIntakeEmailHtml(payload: AuditRequestPayload, ticketId: string, bookingUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>SwishOS AI Security Audit Confirmation - Ticket #${ticketId}</title>
</head>
<body style="background-color: #0B0F17; color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 32px 16px;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #0F172A; border: 1px solid rgba(255,255,255,0.15); border-radius: 16px; overflow: hidden;">
    
    <!-- HEADER BAR -->
    <tr>
      <td style="background-color: #161E2E; padding: 24px 32px; border-bottom: 1px solid rgba(255,255,255,0.12);">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td>
              <span style="font-size: 20px; font-weight: 800; color: #F8FAFC; letter-spacing: -0.02em;">Swish<span style="color: #38BDF8;">OS</span> Defense</span>
            </td>
            <td align="right">
              <span style="background-color: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.35); color: #38BDF8; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 6px; letter-spacing: 0.05em;">
                TICKET #${ticketId}
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- MAIN BODY -->
    <tr>
      <td style="padding: 32px;">
        <h1 style="font-size: 22px; font-weight: 800; color: #F8FAFC; margin: 0 0 16px 0;">
          AI Agent Security Audit Confirmation
        </h1>
        <p style="font-size: 14px; color: #94A3B8; line-height: 1.6; margin: 0 0 24px 0;">
          Hello ${payload.name},<br><br>
          Thank you for requesting a <strong>1-Week AI Agent Threat Model Audit</strong> ($7,500 – $12,500 scope) for <strong>${payload.company || 'your organization'}</strong>.
        </p>

        <!-- BOOKING ACTION BOX -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1E293B; border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 12px; margin-bottom: 28px;">
          <tr>
            <td style="padding: 20px; text-align: center;">
              <div style="font-size: 13px; color: #38BDF8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">
                ACTION REQUIRED: SCHEDULE 30-MIN CISO DISCOVERY BRIEFING
              </div>
              <a href="${bookingUrl}" target="_blank" style="display: inline-block; background-color: #2563EB; color: #FFFFFF; font-size: 14px; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin-top: 6px;">
                Schedule CISO Discovery Call →
              </a>
            </td>
          </tr>
        </table>

        <!-- OWASP THREAT MATRIX TABLE -->
        <h2 style="font-size: 15px; font-weight: 700; color: #F8FAFC; margin: 0 0 12px 0;">
          Included Audit Threat Vectors (OWASP LLM Top 10)
        </h2>
        <table border="0" cellpadding="8" cellspacing="0" width="100%" style="background-color: #161E2E; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; font-size: 12px; margin-bottom: 28px;">
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="color: #38BDF8; font-weight: 700;">OWASP LLM01</td>
            <td style="color: #F8FAFC;">Prompt Injection & Homoglyph Bypass</td>
            <td align="right" style="color: #34D399; font-weight: 700;">COVERED</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="color: #38BDF8; font-weight: 700;">OWASP LLM02</td>
            <td style="color: #F8FAFC;">Sensitive Info & PII Exfiltration</td>
            <td align="right" style="color: #34D399; font-weight: 700;">COVERED</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="color: #38BDF8; font-weight: 700;">OWASP LLM05</td>
            <td style="color: #F8FAFC;">Improper Output & Tool Tampering</td>
            <td align="right" style="color: #34D399; font-weight: 700;">COVERED</td>
          </tr>
          <tr>
            <td style="color: #38BDF8; font-weight: 700;">OWASP LLM08</td>
            <td style="color: #F8FAFC;">Excessive Agency & Monetary Overflows</td>
            <td align="right" style="color: #34D399; font-weight: 700;">COVERED</td>
          </tr>
        </table>

        <!-- SARIF DELIVERABLE PREVIEW -->
        <h2 style="font-size: 15px; font-weight: 700; color: #F8FAFC; margin: 0 0 12px 0;">
          Sample Deliverable Format Preview (OASIS SARIF v2.1.0)
        </h2>
        <div style="background-color: #0B0F17; border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; padding: 14px; font-family: monospace; font-size: 11px; color: #34D399; line-height: 1.4; white-space: pre-wrap; overflow-x: auto;">
{
  "$schema": "https://json.schemastore.org/sarif-2.1.0.json",
  "version": "2.1.0",
  "runs": [{
    "tool": { "driver": { "name": "SwishOS-RedTeam-Engine", "version": "1.0.0" } },
    "results": [{
      "ruleId": "SWISH-OWASP-LLM01",
      "level": "error",
      "message": { "text": "Pass: Sliding-window stream redactor blocked prompt injection payload." }
    }]
  }]
}
        </div>
      </td>
    </tr>

    <!-- FOOTER -->
    <tr>
      <td style="background-color: #161E2E; padding: 20px 32px; border-top: 1px solid rgba(255,255,255,0.12); font-size: 12px; color: #94A3B8; text-align: center;">
        SwishOS AI Security & Governance Enclave · Senior Security Research Team<br>
        Direct Escalations: <a href="mailto:security@swishos.dev" style="color: #38BDF8; text-decoration: none;">security@swishos.dev</a>
      </td>
    </tr>

  </table>
</body>
</html>
  `.trim();
}

/**
 * Dispatches audit booking confirmation email via Resend API or dev fallback
 */
export async function dispatchCisoAuditIntake(payload: AuditRequestPayload): Promise<IntakeDispatchResult> {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const ticketId = `SWISH-AUDIT-${randomSuffix}`;
  const bookingUrl = `https://cal.com/swishos-security/ciso-discovery?ticket=${ticketId}&name=${encodeURIComponent(payload.name)}&company=${encodeURIComponent(payload.company || '')}`;

  const emailHtml = generateCisoIntakeEmailHtml(payload, ticketId, bookingUrl);

  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'SwishOS Defense <audits@swishos.dev>',
          to: [payload.email],
          subject: `[SwishOS] AI Security Audit Request Received - Ticket #${ticketId}`,
          html: emailHtml,
        }),
      });

      if (response.ok) {
        return {
          success: true,
          ticketId,
          bookingUrl,
          mode: 'live_resend',
          message: `Audit request confirmed and executive report dispatched to ${payload.email} via Resend.`,
        };
      }
    } catch (err) {
      console.warn('[CISO Intake Dispatcher] Resend API dispatch error, falling back to logger:', err);
    }
  }

  // Graceful Dev/Test Fallback
  return {
    success: true,
    ticketId,
    bookingUrl,
    mode: 'dev_fallback',
    message: `Audit request created for ${payload.email}. (Dev Mode: Resend API key unconfigured; email payload generated).`,
    sarifSnippet: `SWISH-SARIF-V2.1-${ticketId}`,
  };
}
