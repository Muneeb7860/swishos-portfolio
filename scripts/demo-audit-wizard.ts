/**
 * SwishOS Turnkey Sales Pitch & Audit Report Wizard
 * Runs automated audit sweeps and generates client reports + customized cold pitch email text.
 */

import fs from 'fs';
import path from 'path';
import { generatePenTestReport } from './generate-pen-test-report';

export interface PitchWizardOptions {
  clientName: string;
  targetUrl?: string;
  outputDir?: string;
}

export function generateColdPitchEmail(clientName: string): string {
  const clientSlug = clientName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const baseUrl = process.env.AUDIT_PORTAL_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://portfolio-eight-theta-fp2kdb67zc.vercel.app';
  const reportUrl = `${baseUrl}/en/playground?client=${clientSlug}`;

  return `Subject: Security Audit Findings for ${clientName}'s AI Agent Endpoint

Hi [CTO / VP of Engineering Name],

Our automated security scanner (agentic-redteam v0.5.0) performed a non-invasive OWASP LLM security sweep against ${clientName}'s AI agent pipelines.

Key Audit Highlights:
• Evaluation Matrix : OWASP LLM Top 10 + ASI01-10 Agentic Threat Vectors
• Audit Evidence    : SOC 2 Trust Services Criteria (TSC) Evidence Collectors
• Live Report Portal : ${reportUrl}

We help AI engineering teams secure production agent pipelines against prompt injections, multi-turn AST payload splitting, and memory poisoning using self-hosted zero-trust execution enclaves.

Would you be open to a brief 15-minute call this Thursday to walk through the complete vulnerability report?

Best regards,

SwishOS Security Research Team
https://swishos.dev | security@swishos.dev
`;
}

export function runPitchWizard(options: PitchWizardOptions): { htmlPath: string; emailPath: string } {
  const outputDir = options.outputDir || '.';
  console.log(`\n🚀 Launching SwishOS Sales Pitch & Audit Wizard for ${options.clientName}...`);

  const { htmlPath } = generatePenTestReport(options.clientName, outputDir);
  const emailText = generateColdPitchEmail(options.clientName);

  const emailPath = path.join(outputDir, 'cold_pitch_email.txt');
  fs.writeFileSync(emailPath, emailText, 'utf-8');

  console.log(`\n✉️  Customized CISO Cold Pitch Email Generated:`);
  console.log(` - ${emailPath}`);
  console.log(`\n--- COLD PITCH EMAIL PREVIEW ---\n`);
  console.log(emailText);
  console.log(`---------------------------------\n`);

  return { htmlPath, emailPath };
}

// Auto-run if executed directly
if (require.main === module) {
  const client = process.argv[2] || 'Acme Corp';
  runPitchWizard({ clientName: client });
}
