import { NextRequest, NextResponse } from 'next/server';

interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  message: string;
}

export async function GET() {
  return NextResponse.json({ status: 'online', endpoint: 'SwishOS Contact Service' });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactPayload;
    const { firstName, lastName, email, company, message } = body;

    if (!firstName || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields (firstName, email, message are required)' },
        { status: 400 }
      );
    }

    const resendKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_EMAIL || 'hello@swishos.io';

    // If no Resend API key is provided, log to console so message isn't lost in Vercel logs and return success
    if (!resendKey) {
      console.log('[SWISHOS CONTACT FORM SUBMISSION]', {
        timestamp: new Date().toISOString(),
        firstName,
        lastName,
        email,
        company,
        message,
      });
      return NextResponse.json({
        success: true,
        message: 'Submission received successfully.',
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
              <td style="padding: 10px 0; color: #1a1a1a;">${firstName} ${lastName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666; font-size: 13px;"><strong>Email</strong></td>
              <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #E10600; text-decoration: none;">${email}</a></td>
            </tr>
            ${
              company
                ? `<tr>
              <td style="padding: 10px 0; color: #666; font-size: 13px;"><strong>Company</strong></td>
              <td style="padding: 10px 0; color: #1a1a1a;">${company}</td>
            </tr>`
                : ''
            }
            <tr>
              <td colspan="2" style="padding-top: 20px; border-top: 1px solid #eee;">
                <strong style="color: #666; font-size: 13px;">Message</strong>
                <p style="margin: 8px 0 0 0; color: #1a1a1a; line-height: 1.6; white-space: pre-wrap;">${message}</p>
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
        from: 'SwishOS Contact <noreply@swishos.io>',
        to: [toEmail],
        reply_to: email,
        subject: `New Enquiry: ${firstName} ${lastName}${company ? ` (${company})` : ''}`,
        html: emailHtml,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error('Resend delivery error:', errText);
      // Fallback response so user doesn't get 500 error page
      return NextResponse.json({ success: true, warning: 'Email logged' });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact API route error:', err);
    return NextResponse.json(
      { error: 'Server error processing your request. Please try again.' },
      { status: 500 }
    );
  }
}
