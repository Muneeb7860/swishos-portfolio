import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limiter';
import { dispatchCisoAuditIntake } from '@/lib/ciso-intake-dispatcher';

interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  message: string;
}

const FALLBACK_EMAIL = 'hello@swishos.io';

// User input is interpolated into an HTML email. Without escaping, a submitter can
// inject markup or tracking pixels into the mail we receive.
function escapeHtml(value: string): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

export async function GET() {
  return NextResponse.json({ status: 'online', endpoint: 'SwishOS Contact Service' });
}

export async function POST(req: NextRequest) {
  let payload: ContactPayload | null = null;

  try {
    const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const rateCheck = checkRateLimit(clientIp, 5, 60000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many contact submissions from this IP. Please wait a minute before retrying.' },
        { status: 429 }
      );
    }

    const body = (await req.json()) as ContactPayload;
    payload = body;
    const { firstName, lastName, email, company, message } = body;

    if (!firstName || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields (firstName, email, message are required)' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'That email address does not look valid — please check and try again.' },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: 'Message is too long. Please keep it under 5000 characters.' },
        { status: 400 }
      );
    }

    const resendKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_EMAIL || FALLBACK_EMAIL;

    // Use dispatchCisoAuditIntake for audit booking tickets and dual-mode dispatch
    const intakeResult = await dispatchCisoAuditIntake({
      name: `${firstName} ${lastName}`,
      email,
      company,
      infrastructure: 'Cloud / Kubernetes / WASM',
      plan: 'audit',
      notes: message,
    });

    if (!resendKey) {
      console.log('[CONTACT API] Operating in dev fallback mode (RESEND_API_KEY unconfigured).', intakeResult);
      return NextResponse.json({
        success: true,
        ticketId: intakeResult.ticketId,
        bookingUrl: intakeResult.bookingUrl,
        mode: intakeResult.mode,
        message: 'Audit ticket created successfully. (Dev mode: email logged locally).',
      });
    }

    const emailHtml = `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <div style="background: #E10600; padding: 28px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">New Enquiry from SwishOS Website</h1>
        </div>
        <div style="background: #ffffff; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e5e5e5;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #666; font-size: 13px; width: 120px;"><strong>Name</strong></td>
              <td style="padding: 10px 0; color: #1a1a1a;">${escapeHtml(firstName)} ${escapeHtml(lastName)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666; font-size: 13px;"><strong>Email</strong></td>
              <td style="padding: 10px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #E10600; text-decoration: none;">${escapeHtml(email)}</a></td>
            </tr>
            ${
              company
                ? `<tr>
              <td style="padding: 10px 0; color: #666; font-size: 13px;"><strong>Company</strong></td>
              <td style="padding: 10px 0; color: #1a1a1a;">${escapeHtml(company)}</td>
            </tr>`
                : ''
            }
            <tr>
              <td colspan="2" style="padding-top: 20px; border-top: 1px solid #eee;">
                <strong style="color: #666; font-size: 13px;">Message</strong>
                <p style="margin: 8px 0 0 0; color: #1a1a1a; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</p>
              </td>
            </tr>
          </table>
          <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px;">
            Sent automatically via SwishOS Web Portal (Vercel API Route)
          </div>
        </div>
      </div>
    `;

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || 'SwishOS Contact <hello@swishos.io>',
        to: [toEmail],
        reply_to: email,
        subject: `New Enquiry: ${firstName} ${lastName}${company ? ` (${company})` : ''}`,
        html: emailHtml,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      // Log the full payload so the lead is recoverable from Vercel logs, then tell the
      // truth. This previously returned success:true and silently dropped the enquiry.
      console.error('[CONTACT] Resend delivery failed — enquiry NOT delivered.', {
        status: resendRes.status,
        resendError: errText,
        timestamp: new Date().toISOString(),
        firstName,
        lastName,
        email,
        company,
        message,
      });
      return NextResponse.json(
        {
          error: `We couldn't send your message just now. Please email ${toEmail} directly — sorry about that.`,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[CONTACT] Route error — enquiry NOT delivered.', {
      error: err,
      timestamp: new Date().toISOString(),
      payload,
    });
    return NextResponse.json(
      { error: `Server error processing your request. Please email ${FALLBACK_EMAIL} directly.` },
      { status: 500 }
    );
  }
}
