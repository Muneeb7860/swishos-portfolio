import { NextResponse } from 'next/server';
import { execute5StepVerification } from '@/lib/verification-engine';
import { logAuditIncident } from '@/lib/audit-logger';
import { generateSOC2ReportHTML, type AuditData } from '@/lib/soc2-report-generator';

export const runtime = 'nodejs';

const MAX_CLIENT_NAME_LENGTH = 120;

export async function POST(req: Request) {
  try {
    const body = await req.json() as { clientName?: string; auditData?: AuditData };
    const clientName = String(body.clientName || 'Confidential Client').slice(0, MAX_CLIENT_NAME_LENGTH).trim();
    const auditData: AuditData = body.auditData ?? {};

    // Guard clientName against injection vectors
    const verification = execute5StepVerification({ query: clientName });
    if (verification.blocked) {
      const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';
      logAuditIncident({
        ip: clientIp,
        endpoint: '/api/export-pdf',
        rawPayload: clientName,
        ruleTriggered: verification.triggeredRules.join(', ') || 'EXPORT_PDF_INJECTION_BLOCK',
      });
      return NextResponse.json(
        { error: 'Invalid clientName — injection pattern detected.' },
        { status: 422 }
      );
    }

    // Generate SOC 2 compliant HTML
    const html = generateSOC2ReportHTML(clientName, auditData);

    // Dynamically import Puppeteer to avoid cold-start overhead on non-PDF routes
    let pdfBuffer: Buffer;
    try {
      const chromium = await import('@sparticuz/chromium');
      const puppeteer = await import('puppeteer-core');

      const browser = await puppeteer.default.launch({
        args: chromium.default.args,
        executablePath: await chromium.default.executablePath(),
        headless: true,
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'load' });

      const rawPdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
      });

      await browser.close();
      pdfBuffer = Buffer.from(rawPdf as unknown as ArrayBuffer);
    } catch (puppeteerError) {
      // Puppeteer unavailable in local dev — return HTML fallback
      console.warn('[export-pdf] Puppeteer unavailable, returning HTML fallback:', puppeteerError);
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Disposition': `attachment; filename="swishos-soc2-report-${Date.now()}.html"`,
          'X-SwishOS-Fallback': 'html',
        },
      });
    }

    const safeClientSlug = clientName.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="swishos-soc2-${safeClientSlug}-${Date.now()}.pdf"`,
        'X-SwishOS-Report-Version': '0.9.0',
        'Cache-Control': 'no-store',
      },
    });

  } catch (error) {
    console.error('[export-pdf] Route error:', error);
    return NextResponse.json(
      { error: 'Internal error generating PDF report.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    endpoint: '/api/export-pdf',
    description: 'POST with { clientName, auditData } to receive a SOC 2 compliant PDF audit report.',
    version: '0.9.0',
  });
}
