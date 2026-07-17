// Cloudflare Pages Function: /api/contact
// Sends contact form submissions via Resend

interface Env {
  RESEND_API_KEY: string;   // Set in Cloudflare Pages → Settings → Environment Variables
  CONTACT_EMAIL: string;    // e.g. hello@swishos.io
}

interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  message: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const body = await request.json() as ContactPayload;
    const { firstName, lastName, email, company, message } = body;

    if (!firstName || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers });
    }

    const resendKey = env.RESEND_API_KEY;
    const toEmail = env.CONTACT_EMAIL || 'hello@swishos.io';

    if (!resendKey) {
      // Graceful fallback - log and return success (so form UX isn't broken during setup)
      console.warn('RESEND_API_KEY not set - contact form submission logged only:', { firstName, lastName, email, company, message });
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    const emailHtml = `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #5b8cff, #7b5bff); padding: 32px; border-radius: 12px 12px 0 0;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">New Contact from SwishOS.io</h1>
        </div>
        <div style="background: #f9f9fb; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e8eaf0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; color: #5a6273; font-size: 13px; width: 120px;"><strong>Name</strong></td><td style="padding: 10px 0; color: #06070c;">${firstName} ${lastName}</td></tr>
            <tr><td style="padding: 10px 0; color: #5a6273; font-size: 13px;"><strong>Email</strong></td><td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #5b8cff;">${email}</a></td></tr>
            ${company ? `<tr><td style="padding: 10px 0; color: #5a6273; font-size: 13px;"><strong>Company</strong></td><td style="padding: 10px 0; color: #06070c;">${company}</td></tr>` : ''}
            <tr><td colspan="2" style="padding-top: 20px; border-top: 1px solid #e8eaf0;"><strong style="color: #5a6273; font-size: 13px;">Message</strong><p style="margin: 8px 0 0 0; color: #06070c; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p></td></tr>
          </table>
          <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e8eaf0; color: #9aa3b8; font-size: 12px;">
            Sent from swishos.io contact form
          </div>
        </div>
      </div>
    `;

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SwishOS Contact <noreply@swishos.io>',
        to: [toEmail],
        reply_to: email,
        subject: `New enquiry from ${firstName} ${lastName}${company ? ` @ ${company}` : ''}`,
        html: emailHtml,
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error('Resend error:', errText);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500, headers });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers });
  } catch (err) {
    console.error('Contact function error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
